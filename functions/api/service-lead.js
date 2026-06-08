const SERVICE_TYPES = new Set([
  "custom-local-print-pack",
  "invoice-followup-copy-pack",
  "market-table-print-audit",
  "local-seller-starter-kit",
]);

const SERVICE_META = {
  "custom-local-print-pack": {
    label: "Custom Local Print Pack Setup",
    event: "service_request_intent",
    tool: "custom-local-print-pack",
    fallbackTitle: "[Service request]: Custom Local Print Pack Setup",
    fallbackTemplate: "custom-local-print-pack-service.yml",
  },
  "invoice-followup-copy-pack": {
    label: "Invoice Follow-up Copy Pack",
    event: "service_request_intent",
    tool: "invoice-followup-copy-pack",
    fallbackTitle: "[Service request]: Invoice Follow-up Copy Pack",
    fallbackTemplate: "",
  },
  "market-table-print-audit": {
    label: "Free Market Table Print Audit",
    event: "audit_request_intent",
    tool: "market-table-print-audit",
    fallbackTitle: "[Audit request]: Free Market Table Print Audit",
    fallbackTemplate: "market-table-print-audit.yml",
  },
  "local-seller-starter-kit": {
    label: "Local Seller Starter Kit",
    event: "seller_checkout_intent",
    tool: "local-seller-starter-kit",
    fallbackTitle: "[Seller kit request]: Local Seller Starter Kit",
    fallbackTemplate: "",
  },
};

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
  "download_success",
  "short-video",
  "game-platform",
  "sponsor-outreach",
  "directory",
  "community",
  "referral",
]);

export async function onRequestPost({ request, env }) {
  if (!env.PTL_EVENTS) return json({ ok: false, error: "Service lead store unavailable" }, 503);
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
        error: "Service lead storage is temporarily limited. Use the public-safe GitHub request or copy the backup request.",
        fallbackRequired: true,
        fallbackSubject: serviceLeadFallbackSubject(normalizedLead),
        fallbackBody: serviceLeadFallbackText(normalizedLead),
        fallbackPublicReplyUrl: serviceLeadPublicReplyUrl(normalizedLead),
      }, 503);
    }
    if (validation && body.dryRun === true) {
      return json({
        ok: true,
        validation,
        dryRun: true,
        normalized: serviceLeadDryRunPayload(normalizedLead),
      });
    }

    const ipHash = await hashIp(request.headers.get("CF-Connecting-IP") || "");
    let rateLimitSkipped = false;
    if (!validation) {
      const rate = await safeRateLimit(env.PTL_EVENTS, ipHash, normalizedLead.serviceType);
      rateLimitSkipped = Boolean(rate.skipped);
      if (!rate.ok) return json({ ok: false, error: "Too many service requests. Please try again later." }, 429);
    }

    const now = new Date();
    const id = `${now.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}-${crypto.randomUUID().slice(0, 8)}`;
    const payload = {
      id,
      createdAt: now.toISOString(),
      validation,
      ipHash: ipHash ? ipHash.slice(0, 16) : "",
      ...normalizedLead,
    };

    if (validation) {
      await env.PTL_EVENTS.put(`service:validation:${id}`, JSON.stringify(payload), { expirationTtl: 60 * 60 * 24 * 14 });
      await safeOptionalStoreTask(increment(env.PTL_EVENTS, "total:service_lead_tests"));
      return json({ ok: true, id, validation, rateLimitSkipped });
    }

    await env.PTL_EVENTS.put(`service:lead:${id}`, JSON.stringify(payload));
    const sideEffects = await Promise.allSettled([
      appendLeadIndex(env.PTL_EVENTS, payload),
      incrementLeadMetrics(env.PTL_EVENTS, payload, now),
    ]);
    const sideEffectLimited = sideEffects.some((result) => result.status === "rejected" && isKvLimitError(result.reason));
    const sideEffectFailed = sideEffects.some((result) => result.status === "rejected");
    return json({
      ok: true,
      id,
      validation,
      dataQuality: sideEffectFailed ? "stored-private-only" : "stored",
      rateLimitSkipped,
      metricsSampledOut: sideEffectLimited || undefined,
    });
  } catch (error) {
    if (isKvLimitError(error)) return serviceStoreFallbackResponse(normalizedLead, validation);
    return json({ ok: false, error: "Service request rejected" }, 400);
  }
}

export async function onRequestGet({ env }) {
  if (!env.PTL_EVENTS) return json({ ok: false, error: "Service lead store unavailable" }, 503);
  const month = new Date().toISOString().slice(0, 7);
  try {
    const rows = arrayOrEmpty(safeJson(await env.PTL_EVENTS.get(`service:lead_index:${month}`), []));
    return json({
      ok: true,
      service: "PrintableTools Lab service lead intake",
      publicMetricsOnly: true,
      dataQuality: "lead-index",
      month,
      ...publicLeadSummary(rows),
      privateFields: "not exposed",
    });
  } catch (error) {
    return json({
      ok: true,
      service: "PrintableTools Lab service lead intake",
      publicMetricsOnly: true,
      dataQuality: "unavailable",
      dataWarning: "Service lead index read failed, so public service lead totals are unavailable. Use the private export workflow for an authoritative check.",
      month,
      leadCount: null,
      serviceRequestCount: null,
      auditRequestCount: null,
      sellerKitRequestCount: null,
      latestCreatedAt: "",
      privateFields: "not exposed",
    });
  }
}

function normalizeLead(body, request) {
  const serviceType = cleanChoice(body.serviceType || body.service || body.tool, SERVICE_TYPES, "");
  if (!serviceType) return { error: "Choose the service you want reviewed." };

  const contact = cleanContact(body.contact || body.contactEmail || body.email || body.publicContact);
  const businessName = cleanText(body.businessName || body.company || body.project || body.name, 90);
  const requestSummary = cleanText(body.requestSummary || body.details || body.notes || body.message, 1000);
  const needBy = cleanText(body.needBy || body.timeline, 80);
  const source = cleanSource(body.source || body.utmSource || "direct");
  const path = cleanPath(body.path || `/${serviceType}/`);
  const utmSource = cleanKey(body.utmSource, 64);
  const utmMedium = cleanKey(body.utmMedium, 64);
  const utmCampaign = cleanKey(body.utmCampaign, 80);
  const utmContent = cleanKey(body.utmContent, 80);
  const consent = body.consent === true || body.consent === "yes" || body.consent === "on";

  if (!contact) return { error: "Email or public contact link is required." };
  if (requestSummary.length < 12) return { error: "Add one short public-safe note about what you need." };
  if (!consent) return { error: "Confirm that the request avoids payment, tax, identity, password, customer-list, or private file data." };

  return {
    value: {
      serviceType,
      serviceLabel: SERVICE_META[serviceType]?.label || serviceType,
      contact,
      businessName,
      requestSummary,
      needBy,
      source,
      path,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      userAgent: cleanText(request.headers.get("user-agent") || "", 160),
    },
  };
}

async function rateLimit(store, ipHash, serviceType) {
  if (!ipHash) return { ok: true };
  const now = new Date();
  const hour = now.toISOString().slice(0, 13);
  const day = now.toISOString().slice(0, 10);
  const keySuffix = `${cleanKey(serviceType, 40)}:${ipHash.slice(0, 18)}`;
  const hourKey = `service:rate:${hour}:${keySuffix}`;
  const dayKey = `service:rate:${day}:${keySuffix}`;
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

async function safeRateLimit(store, ipHash, serviceType) {
  try {
    return await rateLimit(store, ipHash, serviceType);
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
  const meta = SERVICE_META[lead.serviceType] || SERVICE_META["custom-local-print-pack"];
  const day = now.toISOString().slice(0, 10);
  await appendMetricRollup(store, lead, day, meta.event, meta.tool);
}

async function appendMetricRollup(store, lead, day, event, tool) {
  const month = day.slice(0, 7);
  const key = `rollup:${month}`;
  const rollup = safeJson(await store.get(key), null) || emptyRollup(month);
  const dayBucket = ensureDay(rollup, day);
  addCount(rollup.totals.events, event);
  addCount(dayBucket.events, event);
  addNestedCount(rollup.totals.tools, tool, event);
  addNestedCount(dayBucket.tools, tool, event);
  if (lead.source) {
    addNestedCount(rollup.totals.sources, lead.source, event);
    addNestedCount(dayBucket.sources, lead.source, event);
  }
  const projectTotal = ensureNested(rollup.totals.projects, "printable-tools-lab");
  addCount(projectTotal.events, event);
  addNestedCount(projectTotal.tools, tool, event);
  if (lead.source) addNestedCount(projectTotal.sources, lead.source, event);
  const projectToday = ensureNested(dayBucket.projects, "printable-tools-lab");
  addCount(projectToday.events, event);
  addNestedCount(projectToday.tools, tool, event);
  if (lead.source) addNestedCount(projectToday.sources, lead.source, event);
  rollup.updatedAt = new Date().toISOString();
  await store.put(key, JSON.stringify(rollup));
}

async function appendLeadIndex(store, lead) {
  const month = lead.createdAt.slice(0, 7);
  const key = `service:lead_index:${month}`;
  const current = await store.get(key);
  const rows = arrayOrEmpty(safeJson(current, []));
  rows.push({
    id: lead.id,
    createdAt: lead.createdAt,
    serviceType: lead.serviceType,
    source: lead.source,
    utmSource: lead.utmSource,
    utmMedium: lead.utmMedium,
    utmCampaign: lead.utmCampaign,
    utmContent: lead.utmContent,
    path: lead.path,
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

function cleanContact(value) {
  const text = cleanText(value, 180);
  if (!text) return "";
  const email = text.toLowerCase();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return email;
  try {
    const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
    if (["http:", "https:"].includes(url.protocol) && url.hostname.includes(".")) {
      url.hash = "";
      return url.toString().slice(0, 180);
    }
  } catch {
    // Public handles such as @marketname are allowed below.
  }
  if (/^@[a-z0-9_.-]{3,60}$/i.test(text)) return text;
  return "";
}

function cleanChoice(value, allowed, fallback) {
  const key = cleanKey(value, 60);
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
  const path = String(value || "/custom-local-print-pack/").split("?")[0].replace(/[^a-zA-Z0-9/_-]/g, "");
  return path.startsWith("/") ? path.slice(0, 120) : `/${path.slice(0, 119)}`;
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

function serviceStoreFallbackResponse(lead, validation) {
  return json({
    ok: false,
    error: validation
      ? "Service validation storage is temporarily limited."
      : "Service lead storage is temporarily limited. Use the public-safe GitHub request or copy the backup request.",
    fallbackRequired: !validation,
    fallbackSubject: lead ? serviceLeadFallbackSubject(lead) : "PrintableTools Lab service request",
    fallbackBody: lead ? serviceLeadFallbackText(lead) : "",
    fallbackPublicReplyUrl: !validation && lead ? serviceLeadPublicReplyUrl(lead) : "",
  }, 503);
}

function serviceLeadFallbackSubject(lead) {
  return `PrintableTools Lab ${lead.serviceLabel || "service"} request`;
}

function serviceLeadFallbackText(lead) {
  return [
    "Hi PrintableTools Lab team,",
    "",
    "Please review this service request manually because the website lead store was temporarily limited.",
    "",
    `Service: ${lead.serviceLabel || lead.serviceType || ""}`,
    `Business or project: ${lead.businessName || ""}`,
    `Reply contact: ${lead.contact || ""}`,
    `Need-by / timeline: ${lead.needBy || ""}`,
    `Page path: ${lead.path || ""}`,
    `Source: ${lead.source || ""}`,
    `Campaign: ${lead.utmCampaign || ""}`,
    `Content: ${lead.utmContent || ""}`,
    "",
    "Public-safe request note:",
    lead.requestSummary || "",
    "",
    "I will keep payment, tax, bank, private identity, passwords, customer lists, and private files outside the website form.",
  ].join("\n");
}

function serviceLeadDryRunPayload(lead) {
  return {
    serviceType: lead.serviceType,
    serviceLabel: lead.serviceLabel,
    source: lead.source,
    path: lead.path,
    utmSource: lead.utmSource,
    utmMedium: lead.utmMedium,
    utmCampaign: lead.utmCampaign,
    utmContent: lead.utmContent,
  };
}

function serviceLeadPublicReplyUrl(lead) {
  const meta = SERVICE_META[lead.serviceType] || SERVICE_META["custom-local-print-pack"];
  const url = new URL("https://github.com/yanqr213/printable-tools-lab/issues/new");
  if (meta.fallbackTemplate) url.searchParams.set("template", meta.fallbackTemplate);
  url.searchParams.set("title", meta.fallbackTitle);
  url.searchParams.set("body", [
    "Public-safe service request.",
    "",
    `Service: ${lead.serviceLabel || lead.serviceType || ""}`,
    `Business or project: ${lead.businessName || ""}`,
    "Public contact: add only if you want it visible in a public GitHub issue",
    `Need-by / timeline: ${lead.needBy || ""}`,
    `Source path: https://printable-tools-lab.pages.dev${lead.path || "/"}`,
    "",
    "Request note:",
    lead.requestSummary || "",
    "",
    "Do not include payment, tax, bank, phone, identity, password, customer-list, or private file data in this public issue.",
  ].join("\n"));
  url.searchParams.set("labels", "service,business-review");
  return url.toString();
}

function arrayOrEmpty(value) {
  return Array.isArray(value) ? value : [];
}

function publicLeadSummary(rows) {
  const summary = {
    leadCount: rows.length,
    serviceRequestCount: 0,
    auditRequestCount: 0,
    sellerKitRequestCount: 0,
    latestCreatedAt: "",
    serviceTypes: {},
    sources: {},
    campaigns: {},
    paths: {},
  };
  for (const row of rows) {
    const serviceType = cleanChoice(row?.serviceType, SERVICE_TYPES, "unknown");
    const source = cleanSource(row?.source || row?.utmSource || "direct");
    const campaign = cleanKey(row?.utmCampaign, 80) || "unknown";
    const path = cleanPath(row?.path || "/");
    addCount(summary.serviceTypes, serviceType);
    addCount(summary.sources, source);
    addCount(summary.campaigns, campaign);
    addCount(summary.paths, path);
    if (serviceType === "custom-local-print-pack" || serviceType === "invoice-followup-copy-pack") summary.serviceRequestCount += 1;
    if (serviceType === "market-table-print-audit") summary.auditRequestCount += 1;
    if (serviceType === "local-seller-starter-kit") summary.sellerKitRequestCount += 1;
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
