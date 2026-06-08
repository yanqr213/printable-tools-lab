const PLACEMENTS = new Set([
  "media-kit-review",
  "directory-visibility",
  "content-sponsorship",
  "partner-distribution",
  "other",
]);

const BUDGET_RANGES = new Set([
  "exploratory",
  "under-250",
  "250-500",
  "500-1000",
  "1000-plus",
]);

const TIMELINES = new Set([
  "exploratory",
  "this-week",
  "this-month",
  "later",
]);

const COMMITMENT_LEVELS = new Set([
  "question-only",
  "request-invoice",
  "ready-this-month",
]);

const DEAL_IDS = new Set([
  "starter-fit-review",
  "guide-sponsor-pilot",
  "vertical-category-pilot",
  "partner-distribution-test",
]);

const ALLOWED_SOURCES = new Set([
  "direct",
  "google",
  "bing",
  "github",
  "github-pages",
  "github-issue",
  "gist",
  "zearches",
  "listai",
  "techtools",
  "nosignuptools",
  "freenosignup",
  "nologin",
  "nosubscription",
  "share-kit",
  "short-video",
  "game-platform",
  "sponsor-outreach",
  "directory",
  "community",
  "referral",
]);

export async function onRequestPost({ request, env }) {
  if (!env.PTL_EVENTS) return json({ ok: false, error: "Lead store unavailable" }, 503);
  let normalizedLead = null;
  let validation = false;
  try {
    const body = await request.json();
    if (String(body.websiteTrap || body.companyWebsite || "").trim()) return json({ ok: true, ignored: true });

    const lead = normalizeLead(body, request);
    if (lead.error) return json({ ok: false, error: lead.error }, 400);
    normalizedLead = lead.value;

    validation = Boolean(body.validation);
    if (validation && body.dryRunFallback === true) {
      return json({
        ok: false,
        validation,
        dryRunFallback: true,
        error: "Sponsor lead storage is temporarily limited. Use the public-safe reply form or copy the backup request.",
        fallbackRequired: true,
        fallbackSubject: "PrintableTools Lab sponsor invoice review",
        fallbackBody: sponsorLeadFallbackText(normalizedLead),
        fallbackPublicReplyUrl: sponsorLeadPublicReplyUrl(normalizedLead),
      }, 503);
    }
    if (validation && body.dryRun === true) {
      return json({
        ok: true,
        validation,
        dryRun: true,
        normalized: sponsorLeadDryRunPayload(normalizedLead),
      });
    }

    const ipHash = await hashIp(request.headers.get("CF-Connecting-IP") || "");
    let rateLimitSkipped = false;
    if (!validation) {
      const rate = await safeRateLimit(env.PTL_EVENTS, ipHash);
      rateLimitSkipped = Boolean(rate.skipped);
      if (!rate.ok) return json({ ok: false, error: "Too many sponsor inquiries. Please try again later." }, 429);
    }

    const now = new Date();
    const id = `${now.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}-${crypto.randomUUID().slice(0, 8)}`;
    const payload = {
      id,
      createdAt: now.toISOString(),
      validation,
      ipHash: ipHash ? ipHash.slice(0, 16) : "",
      ...lead.value,
    };

    if (validation) {
      await env.PTL_EVENTS.put(`sponsor:validation:${id}`, JSON.stringify(payload), { expirationTtl: 60 * 60 * 24 * 14 });
      await safeOptionalStoreTask(increment(env.PTL_EVENTS, "total:sponsor_lead_tests"));
    } else {
      await env.PTL_EVENTS.put(`sponsor:lead:${id}`, JSON.stringify(payload));
      const sideEffects = await Promise.allSettled([
        appendLeadIndex(env.PTL_EVENTS, payload),
        incrementLeadMetrics(env.PTL_EVENTS, payload, now),
      ]);
      const sideEffectLimited = sideEffects.some((result) => result.status === "rejected" && isKvLimitError(result.reason));
      const sideEffectFailed = sideEffects.some((result) => result.status === "rejected");
      const dataQuality = sideEffectFailed ? "stored-private-only" : "stored";
      return json({
        ok: true,
        id,
        validation,
        dataQuality,
        rateLimitSkipped,
        metricsSampledOut: sideEffectLimited || undefined,
      });
    }

    return json({ ok: true, id, validation, rateLimitSkipped });
  } catch (error) {
    if (isKvLimitError(error)) return sponsorStoreFallbackResponse(normalizedLead, validation);
    return json({ ok: false, error: "Sponsor inquiry rejected" }, 400);
  }
}

export async function onRequestGet({ env }) {
  if (!env.PTL_EVENTS) return json({ ok: false, error: "Lead store unavailable" }, 503);
  const month = new Date().toISOString().slice(0, 7);
  try {
    const rows = arrayOrEmpty(safeJson(await env.PTL_EVENTS.get(`sponsor:lead_index:${month}`), []));
    return json({
      ok: true,
      service: "PrintableTools Lab sponsor lead intake",
      publicMetricsOnly: true,
      dataQuality: "lead-index",
      month,
      ...publicLeadSummary(rows),
      privateFields: "not exposed",
    });
  } catch (error) {
    return json({
      ok: true,
      service: "PrintableTools Lab sponsor lead intake",
      publicMetricsOnly: true,
      dataQuality: "unavailable",
      dataWarning: "Lead index read failed, so public lead totals are unavailable. Use the private export workflow for an authoritative check.",
      month,
      leadCount: null,
      invoiceRequestCount: null,
      latestCreatedAt: "",
      privateFields: "not exposed",
    });
  }
}

function normalizeLead(body, request) {
  const rawCompany = cleanText(body.company, 90);
  const contactEmail = cleanEmail(body.contactEmail);
  const website = cleanUrl(body.website, 220) || inferWebsiteFromEmail(contactEmail);
  const company = rawCompany || inferCompanyFromContact(website, contactEmail);
  const placement = cleanChoice(body.placement, PLACEMENTS, "media-kit-review");
  const budgetRange = cleanChoice(body.budgetRange, BUDGET_RANGES, "exploratory");
  const timeline = cleanChoice(body.timeline, TIMELINES, "exploratory");
  const commitment = cleanChoice(body.commitment, COMMITMENT_LEVELS, "question-only");
  const audienceFit = cleanText(body.audienceFit, 420);
  const notes = cleanText(body.notes, 1000);
  const dealId = cleanChoice(body.dealId || body.deal || body.sponsorDealId || body.utmContent, DEAL_IDS, "");
  const source = cleanSource(body.source || body.utmSource || "direct");
  const path = cleanPath(body.path || "/sponsor/");
  const utmSource = cleanKey(body.utmSource, 64);
  const utmMedium = cleanKey(body.utmMedium, 64);
  const utmCampaign = cleanKey(body.utmCampaign, 80);
  const utmContent = cleanKey(body.utmContent, 80);
  const vertical = cleanKey(body.vertical || inferVerticalFromPath(path), 80);
  const consent = body.consent === true || body.consent === "yes" || body.consent === "on";

  if (company.length < 2) return { error: "Company or project name is required." };
  if (!contactEmail) return { error: "A valid business email is required." };
  if (audienceFit.length < 12) return { error: "Audience fit needs a short public-safe note." };
  if (!consent) return { error: "Confirm that the inquiry avoids private payment, tax, or customer files." };

  return {
    value: {
      company,
      contactEmail,
      website,
      placement,
      budgetRange,
      timeline,
      commitment,
      audienceFit,
      notes,
      dealId,
      source,
      path,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      vertical,
      userAgent: cleanText(request.headers.get("user-agent") || "", 160),
    },
  };
}

async function rateLimit(store, ipHash) {
  if (!ipHash) return { ok: true };
  const now = new Date();
  const hour = now.toISOString().slice(0, 13);
  const day = now.toISOString().slice(0, 10);
  const hourKey = `sponsor:rate:${hour}:${ipHash.slice(0, 18)}`;
  const dayKey = `sponsor:rate:${day}:${ipHash.slice(0, 18)}`;
  const [hourCount, dayCount] = await Promise.all([
    count(store, hourKey),
    count(store, dayKey),
  ]);
  if (hourCount >= 4 || dayCount >= 12) return { ok: false };
  await Promise.all([
    increment(store, hourKey, 60 * 60 * 2),
    increment(store, dayKey, 60 * 60 * 24 * 2),
  ]);
  return { ok: true };
}

async function safeRateLimit(store, ipHash) {
  try {
    return await rateLimit(store, ipHash);
  } catch (error) {
    if (isKvLimitError(error)) return { ok: true, skipped: true };
    throw error;
  }
}

async function safeOptionalStoreTask(task) {
  try {
    await task;
  } catch (error) {
    if (!isKvLimitError(error)) throw error;
  }
}

async function incrementLeadMetrics(store, lead, now) {
  const day = now.toISOString().slice(0, 10);
  await appendSponsorMetricRollup(store, lead, day, "sponsor_lead_submit");
  if (lead.commitment === "request-invoice" || lead.commitment === "ready-this-month") {
    await appendSponsorMetricRollup(store, lead, day, "sponsor_invoice_request");
  }
}

async function appendSponsorMetricRollup(store, lead, day, event) {
  const month = day.slice(0, 7);
  const key = `rollup:${month}`;
  const rollup = safeJson(await store.get(key), null) || emptyRollup(month);
  const dayBucket = ensureDay(rollup, day);
  addCount(rollup.totals.events, event);
  addCount(dayBucket.events, event);
  addNestedCount(rollup.totals.tools, "sponsor", event);
  addNestedCount(dayBucket.tools, "sponsor", event);
  if (lead.source) {
    addNestedCount(rollup.totals.sources, lead.source, event);
    addNestedCount(dayBucket.sources, lead.source, event);
  }
  const projectTotal = ensureNested(rollup.totals.projects, "printable-tools-lab");
  addCount(projectTotal.events, event);
  addNestedCount(projectTotal.tools, "sponsor", event);
  if (lead.source) addNestedCount(projectTotal.sources, lead.source, event);
  if (lead.path) addPathEventCount(projectTotal.paths, lead.path, event);
  const projectToday = ensureNested(dayBucket.projects, "printable-tools-lab");
  addCount(projectToday.events, event);
  addNestedCount(projectToday.tools, "sponsor", event);
  if (lead.source) addNestedCount(projectToday.sources, lead.source, event);
  if (lead.path) addPathEventCount(projectToday.paths, lead.path, event);
  rollup.updatedAt = new Date().toISOString();
  await store.put(key, JSON.stringify(rollup));
}

async function appendLeadIndex(store, lead) {
  const month = lead.createdAt.slice(0, 7);
  const key = `sponsor:lead_index:${month}`;
  const current = await store.get(key);
  const rows = arrayOrEmpty(safeJson(current, []));
  rows.push({
    id: lead.id,
    createdAt: lead.createdAt,
    company: lead.company,
    website: lead.website,
    contactEmail: lead.contactEmail,
    placement: lead.placement,
    budgetRange: lead.budgetRange,
    timeline: lead.timeline,
    commitment: lead.commitment,
    source: lead.source,
    utmSource: lead.utmSource,
    utmMedium: lead.utmMedium,
    utmCampaign: lead.utmCampaign,
    utmContent: lead.utmContent,
    dealId: lead.dealId,
    vertical: lead.vertical,
  });
  await store.put(key, JSON.stringify(rows.slice(-200)));
}

async function count(store, key) {
  return Number(await store.get(key)) || 0;
}

async function increment(store, key, expirationTtl) {
  const current = await count(store, key);
  const options = expirationTtl ? { expirationTtl } : undefined;
  if (options) await store.put(key, String(current + 1), options);
  else await store.put(key, String(current + 1));
}

async function hashIp(value) {
  const ip = String(value || "").trim();
  if (!ip) return "";
  const data = new TextEncoder().encode(ip);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function cleanText(value, maxLength) {
  return String(value || "")
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function cleanEmail(value) {
  const email = cleanText(value, 140).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? email : "";
}

function cleanUrl(value, maxLength) {
  const text = cleanText(value, maxLength);
  if (!text) return "";
  try {
    const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
    if (!["http:", "https:"].includes(url.protocol)) return "";
    url.hash = "";
    return url.toString().slice(0, maxLength);
  } catch {
    return "";
  }
}

function inferCompanyFromContact(website, contactEmail) {
  const host = hostFromUrl(website) || hostFromEmail(contactEmail);
  const base = host
    .replace(/^www\./, "")
    .split(".")
    .filter(Boolean)
    .slice(0, -1)
    .pop() || "";
  const words = base
    .replace(/[-_]+/g, " ")
    .replace(/[^a-zA-Z0-9 ]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 6);
  const label = words.map((word) => word ? word[0].toUpperCase() + word.slice(1) : "").join(" ");
  return cleanText(label, 90);
}

function hostFromUrl(value) {
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function hostFromEmail(value) {
  return String(value || "").split("@").pop()?.toLowerCase() || "";
}

function inferWebsiteFromEmail(value) {
  const host = hostFromEmail(value);
  if (!host || host === "gmail.com" || host === "yahoo.com" || host === "outlook.com" || host === "hotmail.com" || host === "icloud.com" || host === "proton.me" || host === "protonmail.com") return "";
  return cleanUrl(`https://${host}`, 220);
}

function cleanChoice(value, allowed, fallback) {
  const key = cleanKey(value, 40);
  return allowed.has(key) ? key : fallback;
}

function cleanKey(value, maxLength) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLength);
}

function cleanSource(value) {
  const source = cleanKey(value || "direct", 48);
  const canonical = canonicalSource(source);
  if (!canonical) return "direct";
  return ALLOWED_SOURCES.has(canonical) ? canonical : "referral";
}

function canonicalSource(source) {
  if (source === "free-no-signup") return "freenosignup";
  if (source === "no-login") return "nologin";
  if (source === "no-subscription") return "nosubscription";
  if (source === "github-issues") return "github-issue";
  if (source === "sharekit") return "share-kit";
  if (source === "short_video") return "short-video";
  if (source === "game_platform") return "game-platform";
  if (source === "sponsor-call") return "sponsor-outreach";
  return source;
}

function cleanPath(value) {
  const path = String(value || "/sponsor/").split("?")[0].replace(/[^a-zA-Z0-9/_-]/g, "");
  return path.startsWith("/") ? path.slice(0, 120) : `/${path.slice(0, 119)}`;
}

function inferVerticalFromPath(path) {
  const match = String(path || "").match(/^\/sponsor\/([a-z0-9-]+)\/?$/i);
  return match ? match[1] : "";
}

function safeJson(text, fallback) {
  try {
    const value = JSON.parse(text);
    return value && typeof value === "object" ? value : fallback;
  } catch {
    return fallback;
  }
}

function isKvLimitError(error) {
  const message = String(error?.message || "").toLowerCase();
  return message.includes("kv put() limit exceeded")
    || message.includes("kv get() limit exceeded")
    || message.includes("write limit")
    || message.includes("read limit")
    || message.includes("too many requests")
    || message.includes("1101");
}

function sponsorStoreFallbackResponse(lead, validation) {
  return json({
    ok: false,
    error: validation
      ? "Sponsor validation storage is temporarily limited."
      : "Sponsor lead storage is temporarily limited. Use the public-safe reply form or copy the backup request.",
    fallbackRequired: !validation,
    fallbackSubject: "PrintableTools Lab sponsor invoice review",
    fallbackBody: lead ? sponsorLeadFallbackText(lead) : "",
    fallbackPublicReplyUrl: !validation && lead ? sponsorLeadPublicReplyUrl(lead) : "",
  }, validation ? 503 : 503);
}

function sponsorLeadFallbackText(lead) {
  return [
    "Hi PrintableTools Lab team,",
    "",
    "Please review this sponsor inquiry manually because the website lead store was temporarily limited.",
    "",
    `Company / project: ${lead.company || ""}`,
    `Business email: ${lead.contactEmail || ""}`,
    `Website: ${lead.website || ""}`,
    `Placement interest: ${lead.placement || ""}`,
    `Budget range: ${lead.budgetRange || ""}`,
    `Timeline: ${lead.timeline || ""}`,
    `Next step: ${lead.commitment || ""}`,
    `Deal ID: ${lead.dealId || ""}`,
    `Audience / vertical: ${lead.vertical || ""}`,
    "",
    "Audience fit:",
    lead.audienceFit || "",
    "",
    "Notes:",
    lead.notes || "",
    "",
    "I will keep payment, tax, bank, phone, private identity, password, and customer-file details outside the website form.",
  ].join("\n");
}

function sponsorLeadDryRunPayload(lead) {
  return {
    company: lead.company,
    website: lead.website,
    placement: lead.placement,
    budgetRange: lead.budgetRange,
    timeline: lead.timeline,
    commitment: lead.commitment,
    dealId: lead.dealId,
    source: lead.source,
    path: lead.path,
    vertical: lead.vertical,
  };
}

function sponsorLeadPublicReplyUrl(lead) {
  const title = `[Sponsor/Partner]: ${lead.company || "Sponsor pilot review"}`;
  const body = [
    "Public-safe sponsor reply.",
    "",
    `Company / project: ${lead.company || ""}`,
    `Public website URL: ${lead.website || ""}`,
    `Audience fit: ${lead.vertical || lead.path || ""}`,
    `Selected pilot deal: ${lead.dealId || ""}`,
    `Proposal or deal URL: https://printable-tools-lab.pages.dev${lead.path || "/sponsor/"}`,
    "",
    `Requested next step: ${lead.commitment || "Request pilot invoice review"}`,
    "",
    "Do not include private payment, tax, bank, phone, customer, identity, password, or confidential file data in this public issue.",
  ].join("\n");
  const url = new URL("https://github.com/yanqr213/printable-tools-lab/issues/new");
  url.searchParams.set("title", title);
  url.searchParams.set("body", body);
  url.searchParams.set("labels", "sponsor,partner,business-review");
  return url.toString();
}

function arrayOrEmpty(value) {
  return Array.isArray(value) ? value : [];
}

function publicLeadSummary(rows) {
  const summary = {
    leadCount: rows.length,
    invoiceRequestCount: 0,
    readyThisMonthCount: 0,
    starterReviewCount: 0,
    latestCreatedAt: "",
    commitments: {},
    deals: {},
    sources: {},
    verticals: {},
  };
  for (const row of rows) {
    const commitment = cleanKey(row?.commitment, 40) || "unknown";
    const dealId = cleanKey(row?.dealId, 80) || "unknown";
    const source = cleanSource(row?.source || row?.utmSource || "direct");
    const vertical = cleanKey(row?.vertical, 80) || "unknown";
    addCount(summary.commitments, commitment);
    addCount(summary.deals, dealId);
    addCount(summary.sources, source);
    addCount(summary.verticals, vertical);
    if (commitment === "request-invoice" || commitment === "ready-this-month") summary.invoiceRequestCount += 1;
    if (commitment === "ready-this-month") summary.readyThisMonthCount += 1;
    if (dealId === "starter-fit-review") summary.starterReviewCount += 1;
    const createdAt = cleanText(row?.createdAt, 40);
    if (createdAt && createdAt > summary.latestCreatedAt) summary.latestCreatedAt = createdAt;
  }
  return summary;
}

function emptyRollup(month) {
  return { month, updatedAt: "", totals: emptyBucket(), today: {} };
}

function emptyBucket() {
  return { events: {}, tools: {}, sources: {}, projects: {}, paths: {} };
}

function ensureDay(rollup, day) {
  if (!rollup.today || typeof rollup.today !== "object") rollup.today = {};
  if (!rollup.today[day]) rollup.today[day] = emptyBucket();
  return rollup.today[day];
}

function ensureNested(container, key) {
  if (!container[key]) container[key] = emptyBucket();
  return container[key];
}

function addCount(container, key) {
  container[key] = (Number(container[key]) || 0) + 1;
}

function addNestedCount(container, outerKey, innerKey) {
  if (!container[outerKey]) container[outerKey] = {};
  addCount(container[outerKey], innerKey);
}

function addPathEventCount(container, path, event) {
  const current = container[path];
  if (!current || typeof current !== "object" || Array.isArray(current)) {
    container[path] = {};
    if (Number(current)) container[path].page_view = Number(current);
  }
  addCount(container[path], event);
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
