const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const reportsDir = path.join(root, "reports");
const queuePath = path.join(reportsDir, "sponsor-prospect-queue.json");
const contactProbePath = path.join(reportsDir, "sponsor-contact-route-probe.json");
const logPath = path.join(reportsDir, "sponsor-outreach-log.json");
const csvPath = path.join(reportsDir, "sponsor-outreach-log.csv");
const nextBatchPath = path.join(reportsDir, "sponsor-next-submission-batch.md");
const executionBatchPath = path.join(reportsDir, "sponsor-execution-batch.json");
const now = new Date().toISOString();

main();

function main() {
  const queue = readJson(queuePath, null);
  if (!queue || !Array.isArray(queue.rows) || !queue.rows.length) {
    console.error("Missing reports/sponsor-prospect-queue.json. Run npm.cmd run sponsor:prospects first.");
    process.exit(2);
  }
  const existing = readJson(logPath, { rows: [] });
  const contactProbe = readJson(contactProbePath, { rows: [] });
  const existingById = new Map((existing.rows || []).map((row) => [row.id, row]));
  const contactProbeById = new Map((contactProbe.rows || []).map((row) => [row.id, row]));
  const rows = queue.rows
    .map((prospect) => normalizeLogRow(prospect, existingById.get(prospect.id), contactProbeById.get(prospect.id)))
    .sort((a, b) => outreachPriorityScore(b) - outreachPriorityScore(a) || Number(a.priority || 999) - Number(b.priority || 999));
  const executeNow = executionBatchRows(rows);
  const log = {
    name: "PrintableTools Lab Sponsor Outreach Log",
    generatedAt: now,
    count: rows.length,
    queued: rows.filter((row) => row.status === "queued").length,
    sent: rows.filter((row) => row.status === "sent").length,
    replied: rows.filter((row) => row.status === "replied").length,
    qualified: rows.filter((row) => row.status === "qualified").length,
    settled: rows.filter((row) => row.status === "settled").length,
    blockedByReplyEmail: rows.filter((row) => row.needsReplyEmail && !row.publicReplyAvailable && row.status === "queued").length,
    publicReplyFallbackReady: rows.filter((row) => row.needsReplyEmail && row.publicReplyAvailable && row.status === "queued").length,
    contactRouteReady: rows.filter((row) => row.contactRouteStatus === "ready" && row.status === "queued").length,
    contactRouteReview: rows.filter((row) => row.contactRouteStatus === "review" && row.status === "queued").length,
    contactRouteBlocked: rows.filter((row) => row.contactRouteStatus === "blocked" && row.status === "queued").length,
    requiresAuthorizedSender: rows.filter((row) => row.requiresAuthorizedSender && row.status === "queued").length,
    executionReady: executeNow.filter((row) => row.executionMode !== "hold").length,
    rules: [
      "Use public contact, partner, or sales forms only.",
      "Do not submit fake identity, phone, payment, tax, or bank details.",
      "Prioritize rows where contactRouteStatus is ready and bestContactUrl has a sponsor, partner, or sales route.",
      "Treat contactRouteStatus as route availability, not permission to submit without a legitimate sender.",
      "If a form requires a reply email that is not available and no publicReplyUrl exists, leave the row queued and set evidenceNote accordingly.",
      "If outbound email is unavailable, send only the proposal URL through an allowed public contact route and point partners to publicReplyUrl or the site sponsor form.",
      "Use invoiceReviewUrl as the shortest paid-pilot URL when a contact route accepts one concise sponsor or partner link.",
      "Change status to sent only after a real form submission or email send with timestamped evidence.",
      "Change status to settled only after an external provider or signed agreement confirms settled payment.",
    ],
    executeNow,
    rows,
  };
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(logPath, `${JSON.stringify(log, null, 2)}\n`);
  fs.writeFileSync(csvPath, toCsv(rows));
  fs.writeFileSync(nextBatchPath, nextBatchMarkdown(rows, executeNow));
  fs.writeFileSync(executionBatchPath, `${JSON.stringify({
    name: "PrintableTools Lab Sponsor 30-Minute Execution Batch",
    generatedAt: now,
    count: executeNow.length,
    rows: executeNow,
    proofGate: "A row becomes sent only after a real manual submission or legitimate email send has timestamped evidence. Revenue is still zero until a signed agreement or settled external payment exists.",
  }, null, 2)}\n`);
  console.log(`Sponsor outreach log ready: ${log.count} row(s), ${log.queued} queued, ${log.sent} sent, ${log.settled} settled, ${log.executionReady} execution-ready.`);
}

function normalizeLogRow(prospect, existing = {}, probe = {}) {
  const publicReplyAvailable = Boolean(prospect.publicReplyUrl);
  const contactRouteStatus = probe.routeStatus || existing.contactRouteStatus || "unknown";
  const bestContactUrl = probe.bestContactUrl || existing.bestContactUrl || prospect.contactUrl;
  const contactRouteScore = Number.isFinite(Number(probe.score)) ? Number(probe.score) : Number(existing.contactRouteScore || 0);
  const contactRouteEvidence = Array.isArray(probe.evidence) ? probe.evidence : existing.contactRouteEvidence || [];
  const publicEmails = publicEmailsFromEvidence(contactRouteEvidence);
  const contactRouteBlockers = Array.isArray(probe.blockers) ? probe.blockers : existing.contactRouteBlockers || [];
  const contactRouteRequiredFields = Array.isArray(probe.requiredFields) ? probe.requiredFields : existing.contactRouteRequiredFields || [];
  const contactRoutePublicSafeFields = Array.isArray(probe.publicSafeFields) ? probe.publicSafeFields : existing.contactRoutePublicSafeFields || [];
  const contactRouteSubmissionBlockers = Array.isArray(probe.submissionBlockers) ? probe.submissionBlockers : existing.contactRouteSubmissionBlockers || [];
  const requiresAuthorizedSender = probe.requiresAuthorizedSender !== undefined ? Boolean(probe.requiresAuthorizedSender) : Boolean(existing.requiresAuthorizedSender);
  const existingNextAction = String(existing.nextAction || "");
  const existingEvidenceNote = String(existing.evidenceNote || "");
  const staleReplyEmailBlocker = /legitimate reply email|private reply email|reply email is available|needs a real reply email/i;
  const staleContactRouteAction = /open contactUrl|public-safe partner note|prepared proposal pitch|submit contactFormMessage/i;
  const staleAuthorizedSenderEvidence = /public reply fallback is ready|real public contact form submission|legitimate email send/i;
  const defaultEvidenceNote = requiresAuthorizedSender
    ? `Contact route exists, but submission needs a legitimate sender or manual consent (${contactRouteSubmissionBlockers.join("; ") || "authorized sender fields"}).`
    : publicReplyAvailable
    ? "Public reply fallback is ready; mark sent only after a real public contact form submission, public-safe issue reply, or legitimate email send."
    : "Needs a real public contact form submission or legitimate email send before marking sent.";
  const defaultNextAction = requiresAuthorizedSender
    ? "Prepare the proposal URL and message, but do not submit until a legitimate business email, sender name, phone if required, and any consent checkbox can be truthfully provided."
    : contactRouteStatus === "ready"
    ? "Open bestContactUrl, submit contactFormMessage only if the page accepts sponsor, partner, sales, or marketing notes, then record timestamp and evidence."
    : publicReplyAvailable
      ? "Open bestContactUrl or contactUrl, submit contactFormMessage only after confirming the route allows a public-safe partner note, and include proposalUrl plus publicReplyUrl."
      : "Open bestContactUrl or contactUrl only if a legitimate reply email or public-safe contact route is available, then record timestamp and evidence.";
  const subject = prospect.subject || `${prospect.suggestedDealTitle || "Sponsor pilot"} for ${prospect.name}`;
  const contactFormMessage = prospect.contactFormMessage || "";
  const body = prospect.body || contactFormMessage;
  const mailtoUrl = publicEmails.length ? mailtoDraft(publicEmails[0], subject, body) : "";
  const executionMode = executionModeFor({ mailtoUrl, requiresAuthorizedSender, contactRouteStatus });
  const executionStep = executionStepFor({ executionMode, contactRouteStatus });
  const doNotSendUntil = doNotSendUntilFor({ executionMode, contactRouteStatus, contactRouteSubmissionBlockers });
  const evidenceChecklist = evidenceChecklistFor({ executionMode, contactRouteStatus });
  const copyFirstAction = mailtoUrl
    ? "Open email draft"
    : requiresAuthorizedSender
      ? "Prepare only"
      : contactRouteStatus === "blocked"
        ? "Skip for now"
        : "Open contact route";
  return {
    priority: prospect.priority || "",
    id: prospect.id,
    name: prospect.name,
    vertical: prospect.vertical,
    contactUrl: prospect.contactUrl,
    bestContactUrl,
    contactRouteStatus,
    contactRouteScore,
    contactRouteEvidence,
    publicEmails,
    mailtoUrl,
    copyFirstAction,
    contactRouteBlockers,
    contactRouteRequiredFields,
    contactRoutePublicSafeFields,
    contactRouteSubmissionBlockers,
    requiresAuthorizedSender,
    executionMode,
    executionStep,
    doNotSendUntil,
    evidenceChecklist,
    sentGate: "Change status to sent only after a real form submission, public-safe issue reply, or legitimate email send with timestamped evidence.",
    estimatedMinutes: executionMode === "email_draft" ? 8 : executionMode === "contact_route" ? 12 : executionMode === "prepare" ? 10 : 0,
    suggestedDealId: prospect.suggestedDealId || "",
    suggestedDealTitle: prospect.suggestedDealTitle || "",
    suggestedDealPrice: prospect.suggestedDealPrice || "",
    validationSignal: prospect.validationSignal || "",
    invoiceReviewUrl: prospect.invoiceReviewUrl || "",
    proposalUrl: prospect.proposalUrl || prospect.trackedUrl || "",
    contactFormProposalUrl: prospect.contactFormProposalUrl || prospect.proposalUrl || prospect.trackedUrl || "",
    dealRoomUrl: prospect.dealRoomUrl || prospect.trackedUrl,
    publicReplyUrl: prospect.publicReplyUrl || "",
    verticalTrackedUrl: prospect.verticalTrackedUrl || "",
    trackedUrl: prospect.trackedUrl,
    subject,
    status: existing.status || "queued",
    needsReplyEmail: existing.needsReplyEmail !== undefined ? Boolean(existing.needsReplyEmail) : true,
    publicReplyAvailable,
    submittedAt: existing.submittedAt || "",
    replyAt: existing.replyAt || "",
    qualifiedAt: existing.qualifiedAt || "",
    settledAt: existing.settledAt || "",
    evidenceUrl: existing.evidenceUrl || "",
    evidenceNote: existingEvidenceNote && !(publicReplyAvailable && staleReplyEmailBlocker.test(existingEvidenceNote)) && !(requiresAuthorizedSender && staleAuthorizedSenderEvidence.test(existingEvidenceNote)) ? existingEvidenceNote : defaultEvidenceNote,
    nextAction: existingNextAction && !(publicReplyAvailable && staleReplyEmailBlocker.test(existingNextAction)) && !(contactRouteStatus !== "unknown" && staleContactRouteAction.test(existingNextAction)) ? existingNextAction : defaultNextAction,
    successSignal: prospect.successSignal || "qualified sponsor inquiry, signed agreement, or settled external payment",
    contactFormMessage,
    body,
  };
}

function toCsv(rows) {
  const headers = ["priority", "id", "name", "vertical", "contactUrl", "bestContactUrl", "contactRouteStatus", "contactRouteScore", "contactRouteEvidence", "publicEmails", "mailtoUrl", "copyFirstAction", "contactRouteBlockers", "contactRouteRequiredFields", "contactRoutePublicSafeFields", "contactRouteSubmissionBlockers", "requiresAuthorizedSender", "suggestedDealId", "suggestedDealTitle", "suggestedDealPrice", "validationSignal", "invoiceReviewUrl", "proposalUrl", "contactFormProposalUrl", "dealRoomUrl", "publicReplyUrl", "verticalTrackedUrl", "trackedUrl", "status", "needsReplyEmail", "publicReplyAvailable", "submittedAt", "replyAt", "qualifiedAt", "settledAt", "evidenceUrl", "evidenceNote", "nextAction", "contactFormMessage"];
  return [
    headers,
    ...rows.map((row) => headers.map((header) => Array.isArray(row[header]) ? row[header].join("; ") : row[header] || "")),
  ].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n") + "\n";
}

function nextBatchMarkdown(rows, executeNow = executionBatchRows(rows)) {
  const queued = rows.filter((row) => row.status === "queued").slice(0, 5);
  return [
    "# Sponsor Next Submission Batch",
    "",
    `Generated: ${now}`,
    "",
    "Do not mark a row sent until a real public form submission or email send has happened.",
    "If a private reply email is unavailable, use contactFormMessage with publicReplyUrl only where the partner's public contact route allows safe sponsor or partnership notes.",
    "Do not include private payment, tax, phone, bank, customer, identity, password, or file data.",
    "",
    "## 30-minute execution queue",
    "",
    ...executeNow.map((row, index) => [
      `${index + 1}. ${row.name} - ${row.executionMode}`,
      `   First step: ${row.executionStep}`,
      `   Open: ${row.openUrl || row.bestContactUrl || row.contactUrl}`,
      `   Copy: ${row.messageToCopyLabel}`,
      `   Do not send until: ${row.doNotSendUntil}`,
      `   Evidence: ${row.evidenceChecklist.join("; ")}`,
      "",
    ].join("\n")),
    "",
    ...queued.map((row, index) => [
      `## ${index + 1}. ${row.name}`,
      "",
      `- Status: ${row.status}`,
      `- Contact: ${row.contactUrl}`,
      `- Best contact route: ${row.bestContactUrl}`,
      `- Contact route status: ${row.contactRouteStatus} (${row.contactRouteScore})`,
      `- Contact route evidence: ${row.contactRouteEvidence.join("; ") || "none"}`,
      `- Public email draft: ${row.mailtoUrl || "not available"}`,
      `- First action: ${row.copyFirstAction}`,
      `- Contact route blockers: ${row.contactRouteBlockers.join("; ") || "none"}`,
      `- Required fields: ${row.contactRouteRequiredFields.join("; ") || "none"}`,
      `- Public-safe fields: ${row.contactRoutePublicSafeFields.join("; ") || "none"}`,
      `- Submission blockers: ${row.contactRouteSubmissionBlockers.join("; ") || "none"}`,
      `- Requires authorized sender: ${row.requiresAuthorizedSender ? "yes" : "no"}`,
      `- Execution mode: ${row.executionMode}`,
      `- Execution step: ${row.executionStep}`,
      `- Do not send until: ${row.doNotSendUntil}`,
      `- Evidence checklist: ${row.evidenceChecklist.join("; ")}`,
      `- Recommended deal: ${row.suggestedDealTitle} (${row.suggestedDealPrice})`,
      `- Validation signal: ${row.validationSignal || "none"}`,
      `- Fast invoice review URL: ${row.invoiceReviewUrl}`,
      `- Proposal URL: ${row.proposalUrl}`,
      `- Short contact-form proposal URL: ${row.contactFormProposalUrl}`,
      `- Deal room URL: ${row.dealRoomUrl}`,
      `- Public-safe reply URL: ${row.publicReplyUrl || "not available"}`,
      `- Vertical fit URL: ${row.verticalTrackedUrl}`,
      `- Needs reply email: ${row.needsReplyEmail ? "yes" : "no"}`,
      `- Public reply available: ${row.publicReplyAvailable ? "yes" : "no"}`,
      `- Evidence note: ${row.evidenceNote}`,
      `- Next action: ${row.nextAction}`,
      "",
      `Subject: ${row.subject}`,
      "",
      "Short contact form message:",
      "",
      "```text",
      row.contactFormMessage || row.body,
      "```",
      "",
      "Long outreach note:",
      "",
      "```text",
      row.body,
      "```",
      "",
    ].join("\n")),
  ].join("\n");
}

function executionBatchRows(rows) {
  return rows
    .filter((row) => row.status === "queued")
    .sort((a, b) => executionPriorityScore(b) - executionPriorityScore(a) || Number(a.priority || 999) - Number(b.priority || 999))
    .slice(0, 5)
    .map((row, index) => ({
      rank: index + 1,
      id: row.id,
      name: row.name,
      vertical: row.vertical,
      status: row.status,
      contactRouteStatus: row.contactRouteStatus,
      contactRouteScore: row.contactRouteScore,
      executionMode: row.executionMode,
      copyFirstAction: row.copyFirstAction,
      executionStep: row.executionStep,
      doNotSendUntil: row.doNotSendUntil,
      evidenceChecklist: row.evidenceChecklist,
      sentGate: row.sentGate,
      estimatedMinutes: row.estimatedMinutes,
      openUrl: row.mailtoUrl || row.bestContactUrl || row.contactUrl,
      bestContactUrl: row.bestContactUrl,
      mailtoUrl: row.mailtoUrl,
      proposalUrl: row.proposalUrl,
      invoiceReviewUrl: row.invoiceReviewUrl,
      publicReplyUrl: row.publicReplyUrl,
      messageToCopyLabel: row.mailtoUrl ? "long outreach note in the email draft" : "short public contact form message",
      messageToCopy: row.mailtoUrl ? row.body : row.contactFormMessage,
      validationSignal: row.validationSignal,
      nextAction: row.nextAction,
    }));
}

function executionModeFor({ mailtoUrl, requiresAuthorizedSender, contactRouteStatus }) {
  if (mailtoUrl) return "email_draft";
  if (requiresAuthorizedSender) return "prepare";
  if (contactRouteStatus === "blocked") return "hold";
  return "contact_route";
}

function executionStepFor({ executionMode, contactRouteStatus }) {
  if (executionMode === "email_draft") return "Open the email draft, review every copied line, send only from a truthful sender, then record timestamped evidence.";
  if (executionMode === "prepare") return "Prepare the proposal URL and message only; do not submit until required sender fields and consent can be provided truthfully.";
  if (executionMode === "hold") return "Hold this row until a valid public sponsor, partner, sales, or media contact route is found.";
  if (contactRouteStatus === "ready") return "Open bestContactUrl, confirm it accepts partner or sponsorship notes, paste the short message, then record timestamped evidence.";
  return "Review the route first, confirm partner or sponsor notes are welcome, paste the short message only if allowed, then record timestamped evidence.";
}

function doNotSendUntilFor({ executionMode, contactRouteStatus, contactRouteSubmissionBlockers }) {
  if (executionMode === "email_draft") return "The public email is a legitimate business, partner, sales, or media route and the sender identity is truthful.";
  if (executionMode === "prepare") return `Truthful required sender fields and consent are available (${contactRouteSubmissionBlockers.join("; ") || "authorized sender requirements"}).`;
  if (executionMode === "hold") return "A valid public sponsor, partner, sales, or media contact route is discovered.";
  if (contactRouteStatus === "ready") return "The contact page visibly accepts sponsor, partner, sales, or marketing notes.";
  return "Manual review confirms the route accepts public-safe sponsor or partnership notes.";
}

function evidenceChecklistFor({ executionMode, contactRouteStatus }) {
  const base = [
    "submittedAt timestamp",
    "bestContactUrl or public email used",
    "proposalUrl or invoiceReviewUrl included",
    "no private payment, tax, bank, phone, customer, identity, password, or file data submitted",
  ];
  if (executionMode === "hold") return ["route discovery evidence before any send attempt", ...base];
  if (executionMode === "prepare") return ["truthful sender fields available before send", ...base];
  if (contactRouteStatus === "review") return ["route-fit note confirming sponsorship or partnership notes are allowed", ...base];
  return base;
}

function outreachPriorityScore(row) {
  let score = 0;
  if (row.status === "queued") score += 100;
  if (row.contactRouteStatus === "ready") score += 50;
  else if (row.contactRouteStatus === "review") score += 20;
  else if (row.contactRouteStatus === "blocked") score -= 30;
  score += Math.max(-20, Math.min(40, Number(row.contactRouteScore || 0)));
  if (row.requiresAuthorizedSender) score -= 25;
  if (row.publicReplyAvailable) score += 8;
  return score;
}

function executionPriorityScore(row) {
  let score = outreachPriorityScore(row);
  if (row.executionMode === "email_draft") score += 35;
  else if (row.executionMode === "contact_route") score += 20;
  else if (row.executionMode === "prepare") score -= 10;
  else if (row.executionMode === "hold") score -= 60;
  if (String(row.vertical || "").includes("small-business-paperwork")) score += 10;
  return score;
}

function publicEmailsFromEvidence(evidence) {
  const emails = [];
  for (const item of Array.isArray(evidence) ? evidence : []) {
    const match = String(item || "").match(/public email visible:\s*(.+)$/i);
    if (!match) continue;
    match[1].split(/,\s*/).forEach((email) => {
      const clean = email.trim().toLowerCase();
      if (/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(clean) && !emails.includes(clean)) emails.push(clean);
    });
  }
  return emails;
}

function mailtoDraft(email, subject, body) {
  const params = new URLSearchParams();
  params.set("subject", subject || "PrintableTools Lab sponsor pilot");
  params.set("body", body || "");
  return `mailto:${email}?${params.toString()}`;
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}
