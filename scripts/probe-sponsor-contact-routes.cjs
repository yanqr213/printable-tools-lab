const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const reportsDir = path.join(root, "reports");
const queuePath = path.join(reportsDir, "sponsor-prospect-queue.json");
const jsonPath = path.join(reportsDir, "sponsor-contact-route-probe.json");
const csvPath = path.join(reportsDir, "sponsor-contact-route-probe.csv");
const markdownPath = path.join(reportsDir, "sponsor-contact-route-probe.md");
const generatedAt = new Date().toISOString();

const TIMEOUT_MS = 12000;
const USER_AGENT = "PrintableToolsLabSponsorRouteProbe/1.0 (+https://printable-tools-lab.pages.dev/sponsor-call/)";

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  const queue = readJson(queuePath, null);
  if (!queue || !Array.isArray(queue.rows) || !queue.rows.length) {
    console.error("Missing reports/sponsor-prospect-queue.json. Run npm.cmd run sponsor:prospects first.");
    process.exit(2);
  }
  const rows = [];
  for (const prospect of queue.rows) {
    rows.push(await probeProspect(prospect));
  }
  rows.sort((a, b) => b.score - a.score || Number(a.priority || 999) - Number(b.priority || 999));
  const report = {
    name: "PrintableTools Lab Sponsor Contact Route Probe",
    generatedAt,
    count: rows.length,
    readyNow: rows.filter((row) => row.routeStatus === "ready").length,
    needsManualReview: rows.filter((row) => row.routeStatus === "review").length,
    blocked: rows.filter((row) => row.routeStatus === "blocked").length,
    rules: [
      "This probe only reads public contact pages; it never submits forms.",
      "Use the short contactFormMessage only where the page allows sponsor, partner, sales, or marketing notes.",
      "Do not fabricate email addresses, phone numbers, identity, payment, tax, bank, customer, or private file details.",
      "Mark outreach sent only after a real manual form submission, public-safe issue reply, or legitimate email send with evidence.",
    ],
    rows,
  };
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(csvPath, toCsv(rows));
  fs.writeFileSync(markdownPath, toMarkdown(report));
  console.log(`Sponsor contact route probe ready: ${report.count} row(s), ${report.readyNow} ready, ${report.needsManualReview} review, ${report.blocked} blocked.`);
}

async function probeProspect(prospect) {
  const startedAt = Date.now();
  const result = {
    priority: prospect.priority || "",
    id: prospect.id || "",
    name: prospect.name || "",
    vertical: prospect.vertical || "",
    contactUrl: prospect.contactUrl || "",
    proposalUrl: prospect.proposalUrl || "",
    contactFormProposalUrl: prospect.contactFormProposalUrl || "",
    publicReplyUrl: prospect.publicReplyUrl || "",
    contactFormMessage: prospect.contactFormMessage || "",
    httpStatus: "",
    finalUrl: "",
    bestContactUrl: prospect.contactUrl || "",
    candidateUrls: [],
    routeStatus: "review",
    score: 0,
    evidence: [],
    blockers: [],
    formFields: [],
    requiredFields: [],
    publicSafeFields: [],
    submissionBlockers: [],
    requiresAuthorizedSender: false,
    recommendedAction: "",
    checkedAt: generatedAt,
    elapsedMs: 0,
  };
  try {
    const firstProbe = await probeUrl(result.contactUrl);
    let bestProbe = firstProbe;
    let homepageHtml = "";
    if (prospect.website) {
      try {
        homepageHtml = (await probeUrl(prospect.website)).html;
      } catch {
        homepageHtml = "";
      }
    }
    const candidateUrls = [
      ...discoverCandidateUrls(firstProbe.html, prospect.website || result.contactUrl),
      ...discoverCandidateUrls(homepageHtml, prospect.website || result.contactUrl),
    ];
    result.candidateUrls = [...new Set(candidateUrls)];
    if (firstProbe.score < 45 || firstProbe.status >= 400) {
      for (const candidateUrl of result.candidateUrls.slice(0, 8)) {
        const candidateProbe = await probeUrl(candidateUrl);
        if (candidateProbe.score > bestProbe.score) bestProbe = candidateProbe;
      }
    }
    result.httpStatus = bestProbe.status;
    result.finalUrl = bestProbe.finalUrl;
    result.bestContactUrl = bestProbe.url;
    result.evidence = bestProbe.signals.evidence;
    result.blockers = bestProbe.signals.blockers;
    if (bestProbe.url !== result.contactUrl) result.evidence.unshift(`better route discovered: ${bestProbe.url}`);
    result.score = bestProbe.score;
    result.routeStatus = routeStatusFromScore(result.score, bestProbe.signals);
    result.formFields = bestProbe.signals.formFields;
    result.requiredFields = bestProbe.signals.requiredFields;
    result.publicSafeFields = bestProbe.signals.publicSafeFields;
    result.submissionBlockers = bestProbe.signals.submissionBlockers;
    result.requiresAuthorizedSender = bestProbe.signals.requiresAuthorizedSender;
    result.recommendedAction = recommendedAction(result, bestProbe.signals);
  } catch (error) {
    result.routeStatus = "blocked";
    result.score = -10;
    result.blockers = [`fetch failed: ${String(error.message || error).slice(0, 160)}`];
    result.recommendedAction = "Do not mark sent. Try the publicReplyUrl only where the partner already accepts public sponsorship or partnership submissions.";
  } finally {
    result.elapsedMs = Date.now() - startedAt;
  }
  return result;
}

async function probeUrl(url) {
  const response = await fetchWithTimeout(url, TIMEOUT_MS);
  const html = await response.text();
  const finalUrl = response.url || url;
  const signals = analyzeContactHtml(html, finalUrl);
  return {
    url,
    status: response.status,
    finalUrl,
    html,
    signals,
    score: scoreRoute(response.status, signals),
  };
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

function analyzeContactHtml(html, finalUrl) {
  const text = stripHtml(html).toLowerCase();
  const raw = html.toLowerCase();
  const evidence = [];
  const blockers = [];
  const forms = countMatches(raw, /<form\b/g);
  const textareas = countMatches(raw, /<textarea\b/g);
  const inputs = countMatches(raw, /<input\b/g);
  const formFields = extractFormFields(html);
  const fieldSummary = summarizeFormFields(formFields);
  if (forms) evidence.push(`${forms} form element(s)`);
  if (textareas) evidence.push(`${textareas} textarea/message field(s)`);
  if (inputs) evidence.push(`${inputs} input field(s)`);
  if (fieldSummary.visibleFieldKinds.length) evidence.push(`visible form fields: ${fieldSummary.visibleFieldKinds.join(", ")}`);
  if (fieldSummary.requiredFields.length) evidence.push(`required fields: ${fieldSummary.requiredFieldKinds.join(", ")}`);
  if (fieldSummary.publicSafeFields.length) evidence.push(`public-safe autofill fields: ${fieldSummary.publicSafeFields.join(", ")}`);
  const sponsorTerms = keywordHits(text, ["partner", "partnership", "sponsor", "sponsorship", "advertis", "marketing", "sales", "business", "media"]);
  if (sponsorTerms.length) evidence.push(`sponsor-route terms: ${sponsorTerms.join(", ")}`);
  const emailHits = (html.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || []).slice(0, 3);
  if (emailHits.length) evidence.push(`public email visible: ${emailHits.join(", ")}`);
  const blockerTerms = keywordHits(text, ["captcha", "recaptcha", "cloudflare", "login", "sign in", "required phone", "phone required", "privacy policy consent"]);
  if (blockerTerms.length) blockers.push(`manual/friction terms: ${blockerTerms.join(", ")}`);
  if (/cf-chl|challenge-platform|turnstile|g-recaptcha/.test(raw)) blockers.push("challenge or captcha markup");
  if (/type=["']email["']/.test(raw) || /\bemail\b/.test(text)) evidence.push("email field likely present");
  if (new URL(finalUrl).pathname.toLowerCase().includes("contact")) evidence.push("contact URL path");
  return {
    evidence,
    blockers,
    forms,
    textareas,
    inputs,
    sponsorTerms,
    emailHits,
    formFields,
    requiredFields: fieldSummary.requiredFields,
    publicSafeFields: fieldSummary.publicSafeFields,
    submissionBlockers: fieldSummary.submissionBlockers,
    requiresAuthorizedSender: fieldSummary.requiresAuthorizedSender,
  };
}

function extractFormFields(html) {
  const fields = [];
  const labelByFor = labelMap(html);
  const forms = String(html || "").match(/<form\b[\s\S]*?<\/form>/gi) || [];
  for (const [formIndex, form] of forms.entries()) {
    for (const match of form.matchAll(/<(input|textarea|select)\b([^>]*)>/gi)) {
      const tag = match[1].toLowerCase();
      const attrs = attrsFromString(match[2]);
      const type = (attrs.type || (tag === "input" ? "text" : tag)).toLowerCase();
      const id = attrs.id || "";
      const name = attrs.name || "";
      fields.push({
        formIndex: formIndex + 1,
        tag,
        type,
        name,
        id,
        label: labelByFor.get(id) || attrs["aria-label"] || "",
        placeholder: attrs.placeholder || "",
        required: Boolean(attrs.required) || /\brequired\b/i.test(match[2]),
        kind: "",
      });
    }
  }
  return fields.map((field) => ({ ...field, kind: classifyField(field) }));
}

function attrsFromString(value) {
  const attrs = {};
  const text = String(value || "");
  for (const match of text.matchAll(/([:\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
    attrs[match[1].toLowerCase()] = match[2] || match[3] || match[4] || true;
  }
  return attrs;
}

function labelMap(html) {
  const labels = new Map();
  for (const match of String(html || "").matchAll(/<label\b[^>]*for=["']([^"']+)["'][^>]*>([\s\S]*?)<\/label>/gi)) {
    labels.set(match[1], stripHtml(match[2]));
  }
  return labels;
}

function summarizeFormFields(fields) {
  const visible = fields.filter((field) => !["hidden", "submit", "button", "reset", "image"].includes(field.type));
  const visibleFieldKinds = unique(visible.map((field) => field.kind).filter(Boolean));
  const requiredFields = visible.filter((field) => field.required).map(fieldSummary);
  const requiredFieldKinds = unique(visible.filter((field) => field.required).map((field) => field.kind).filter(Boolean));
  const publicSafeFields = unique(visibleFieldKinds.filter((kind) => ["company", "website", "message"].includes(kind)));
  const identityKinds = unique(visibleFieldKinds.filter((kind) => ["email", "name", "phone"].includes(kind)));
  const submissionBlockers = [];
  if (requiredFieldKinds.some((kind) => ["email", "name", "phone"].includes(kind))) {
    submissionBlockers.push(`required authorized sender fields: ${requiredFieldKinds.filter((kind) => ["email", "name", "phone"].includes(kind)).join(", ")}`);
  } else if (identityKinds.length) {
    submissionBlockers.push(`authorized sender fields present: ${identityKinds.join(", ")}`);
  }
  if (visibleFieldKinds.includes("terms consent")) submissionBlockers.push("terms or consent checkbox requires manual review");
  return {
    visibleFieldKinds,
    requiredFields,
    requiredFieldKinds,
    publicSafeFields,
    submissionBlockers,
    requiresAuthorizedSender: submissionBlockers.some((item) => /authorized sender|terms|consent/i.test(item)),
  };
}

function classifyField(field) {
  const text = `${field.label} ${field.name} ${field.id} ${field.placeholder} ${field.type}`.toLowerCase();
  if (field.type === "email" || /\b(e-?mail|txtemail)\b/.test(text)) return "email";
  if (field.type === "tel" || /\b(phone|telephone|mobile|txtphone)\b/.test(text)) return "phone";
  if (/\b(first\s*name|last\s*name|full\s*name|firstname|lastname|fullname|txtfirstname|txtlastname|contact name)\b/.test(text)) return "name";
  if (/\b(company|organization|organisation|business|txtcompany)\b/.test(text)) return "company";
  if (/\b(website|site url|url|domain)\b/.test(text)) return "website";
  if (field.tag === "textarea" || /\b(note|notes|message|comment|inquiry|description|txtnotes)\b/.test(text)) return "message";
  if (field.type === "checkbox" && /(agree|terms|privacy|consent|policy)/.test(text)) return "terms consent";
  return "";
}

function fieldSummary(field) {
  return field.kind || field.label || field.name || field.id || field.type;
}

function discoverCandidateUrls(html, baseUrl) {
  const raw = String(html || "");
  const base = safeUrl(baseUrl);
  if (!base) return [];
  const hrefs = [];
  const linkPattern = /href=["']([^"']+)["']/gi;
  let match;
  while ((match = linkPattern.exec(raw))) {
    const href = match[1];
    const normalized = normalizeCandidateUrl(href, base);
    if (normalized) hrefs.push(normalized);
  }
  const home = `${base.origin}/`;
  hrefs.push(
    new URL("/contact", home).toString(),
    new URL("/contact-us", home).toString(),
    new URL("/contact-sales", home).toString(),
    new URL("/sales", home).toString(),
    new URL("/partners", home).toString(),
    new URL("/partnerships", home).toString(),
  );
  return [...new Set(hrefs)]
    .filter((url) => candidatePathLooksRelevant(url))
    .sort((a, b) => candidatePriority(b) - candidatePriority(a));
}

function normalizeCandidateUrl(href, base) {
  if (!href || /^(mailto:|tel:|javascript:|#)/i.test(href)) return "";
  try {
    const url = new URL(href, base);
    if (!/^https?:$/.test(url.protocol)) return "";
    if (url.hostname !== base.hostname && !url.hostname.endsWith(`.${base.hostname}`)) return "";
    if (/\.(woff2?|ttf|otf|png|jpe?g|webp|gif|svg|css|js|ico|pdf|zip)(\?|$)/i.test(url.pathname)) return "";
    url.hash = "";
    return url.toString();
  } catch {
    return "";
  }
}

function candidatePathLooksRelevant(url) {
  try {
    const segments = new URL(url).pathname.toLowerCase().split("/").filter(Boolean);
    return segments.some((segment) => ["contact", "contact-us", "contact-sales", "sales", "partner", "partners", "partnership", "partnerships", "advertising", "media"].includes(segment));
  } catch {
    return false;
  }
}

function candidatePriority(url) {
  const value = String(url).toLowerCase();
  let score = 0;
  if (value.includes("contact-sales")) score += 8;
  if (value.includes("partnership")) score += 7;
  if (value.includes("partner")) score += 6;
  if (value.includes("sales")) score += 5;
  if (value.includes("contact-us")) score += 4;
  if (value.includes("contact")) score += 3;
  if (value.includes("media")) score += 2;
  if (value.includes("support")) score -= 3;
  if (value.includes("login") || value.includes("signin")) score -= 8;
  return score;
}

function safeUrl(value) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function scoreRoute(status, signals) {
  let score = 0;
  if (status >= 200 && status < 300) score += 20;
  else if (status >= 300 && status < 400) score += 10;
  else score -= 20;
  if (signals.forms) score += 18;
  if (signals.textareas) score += 18;
  if (signals.inputs >= 2) score += 8;
  if (signals.sponsorTerms.length) score += Math.min(20, signals.sponsorTerms.length * 4);
  if (signals.emailHits.length) score += 8;
  if (signals.blockers.length) score -= signals.blockers.length * 12;
  return score;
}

function routeStatusFromScore(score, signals) {
  if (signals.blockers.some((item) => /challenge|captcha|login/i.test(item))) return "review";
  if (score >= 45 && (signals.forms || signals.emailHits.length)) return "ready";
  if (score <= 0) return "blocked";
  return "review";
}

function recommendedAction(row, signals) {
  if (signals.requiresAuthorizedSender) {
    return "Route is available, but do not submit yet. Prepare contactFormMessage and proposal URL only after a legitimate business email, sender name, phone if required, and any consent checkbox can be truthfully provided.";
  }
  if (row.routeStatus === "ready") {
    return "Open bestContactUrl manually, paste contactFormMessage only if the page accepts sponsor, partner, sales, or marketing notes, then record timestamp and evidence.";
  }
  if (signals.emailHits.length) {
    return "Use the visible public email only if it is a legitimate business, partnership, sales, or media contact; include contactFormProposalUrl and public reply form.";
  }
  if (row.routeStatus === "blocked") {
    return "Skip automated outreach for now. Keep the row queued and use publicReplyUrl only where partner submissions are explicitly welcomed.";
  }
  return "Manual review first: confirm the contact route accepts sponsorship or partnership notes before sending contactFormMessage.";
}

function stripHtml(html) {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function keywordHits(text, keywords) {
  return keywords.filter((keyword) => text.includes(keyword));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function countMatches(text, regex) {
  return (text.match(regex) || []).length;
}

function toCsv(rows) {
  const headers = ["priority", "id", "name", "vertical", "contactUrl", "bestContactUrl", "httpStatus", "routeStatus", "score", "evidence", "blockers", "requiredFields", "publicSafeFields", "submissionBlockers", "requiresAuthorizedSender", "recommendedAction", "contactFormProposalUrl", "publicReplyUrl"];
  return [
    headers,
    ...rows.map((row) => headers.map((header) => Array.isArray(row[header]) ? row[header].join("; ") : row[header] || "")),
  ].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n") + "\n";
}

function toMarkdown(report) {
  return [
    "# Sponsor Contact Route Probe",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    `Ready now: ${report.readyNow}`,
    `Needs manual review: ${report.needsManualReview}`,
    `Blocked: ${report.blocked}`,
    "",
    ...report.rules.map((rule) => `- ${rule}`),
    "",
    ...report.rows.map((row, index) => [
      `## ${index + 1}. ${row.name}`,
      "",
      `- Status: ${row.routeStatus}`,
      `- Score: ${row.score}`,
      `- Contact: ${row.contactUrl}`,
      `- Best contact route: ${row.bestContactUrl}`,
      `- HTTP: ${row.httpStatus}`,
      `- Evidence: ${row.evidence.join("; ") || "none"}`,
      `- Blockers: ${row.blockers.join("; ") || "none"}`,
      `- Required fields: ${row.requiredFields.join("; ") || "none"}`,
      `- Public-safe fields: ${row.publicSafeFields.join("; ") || "none"}`,
      `- Submission blockers: ${row.submissionBlockers.join("; ") || "none"}`,
      `- Requires authorized sender: ${row.requiresAuthorizedSender ? "yes" : "no"}`,
      `- Recommended action: ${row.recommendedAction}`,
      `- Short proposal URL: ${row.contactFormProposalUrl}`,
      "",
      "```text",
      row.contactFormMessage,
      "```",
      "",
    ].join("\n")),
  ].join("\n");
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}
