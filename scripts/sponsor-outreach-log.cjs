const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const reportsDir = path.join(root, "reports");
const queuePath = path.join(reportsDir, "sponsor-prospect-queue.json");
const logPath = path.join(reportsDir, "sponsor-outreach-log.json");
const csvPath = path.join(reportsDir, "sponsor-outreach-log.csv");
const nextBatchPath = path.join(reportsDir, "sponsor-next-submission-batch.md");
const now = new Date().toISOString();

main();

function main() {
  const queue = readJson(queuePath, null);
  if (!queue || !Array.isArray(queue.rows) || !queue.rows.length) {
    console.error("Missing reports/sponsor-prospect-queue.json. Run npm.cmd run sponsor:prospects first.");
    process.exit(2);
  }
  const existing = readJson(logPath, { rows: [] });
  const existingById = new Map((existing.rows || []).map((row) => [row.id, row]));
  const rows = queue.rows.map((prospect) => normalizeLogRow(prospect, existingById.get(prospect.id)));
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
    rules: [
      "Use public contact, partner, or sales forms only.",
      "Do not submit fake identity, phone, payment, tax, or bank details.",
      "If a form requires a reply email that is not available and no publicReplyUrl exists, leave the row queued and set evidenceNote accordingly.",
      "If outbound email is unavailable, send only the proposal URL through an allowed public contact route and point partners to publicReplyUrl or the site sponsor form.",
      "Change status to sent only after a real form submission or email send with timestamped evidence.",
      "Change status to settled only after an external provider or signed agreement confirms settled payment.",
    ],
    rows,
  };
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(logPath, `${JSON.stringify(log, null, 2)}\n`);
  fs.writeFileSync(csvPath, toCsv(rows));
  fs.writeFileSync(nextBatchPath, nextBatchMarkdown(rows));
  console.log(`Sponsor outreach log ready: ${log.count} row(s), ${log.queued} queued, ${log.sent} sent, ${log.settled} settled.`);
}

function normalizeLogRow(prospect, existing = {}) {
  const publicReplyAvailable = Boolean(prospect.publicReplyUrl);
  const existingNextAction = String(existing.nextAction || "");
  const existingEvidenceNote = String(existing.evidenceNote || "");
  const staleReplyEmailBlocker = /legitimate reply email|private reply email|reply email is available|needs a real reply email/i;
  const defaultEvidenceNote = publicReplyAvailable
    ? "Public reply fallback is ready; mark sent only after a real public contact form submission, public-safe issue reply, or legitimate email send."
    : "Needs a real public contact form submission or legitimate email send before marking sent.";
  const defaultNextAction = publicReplyAvailable
    ? "Open contactUrl, submit contactFormMessage only if the form allows a public-safe partner note, and include proposalUrl plus publicReplyUrl so the partner can request invoice review without private email."
    : "Open contactUrl and submit the prepared proposal pitch only if a legitimate reply email or public-safe contact route is available, then record timestamp and evidence.";
  return {
    id: prospect.id,
    name: prospect.name,
    vertical: prospect.vertical,
    contactUrl: prospect.contactUrl,
    suggestedDealId: prospect.suggestedDealId || "",
    suggestedDealTitle: prospect.suggestedDealTitle || "",
    suggestedDealPrice: prospect.suggestedDealPrice || "",
    proposalUrl: prospect.proposalUrl || prospect.trackedUrl || "",
    contactFormProposalUrl: prospect.contactFormProposalUrl || prospect.proposalUrl || prospect.trackedUrl || "",
    dealRoomUrl: prospect.dealRoomUrl || prospect.trackedUrl,
    publicReplyUrl: prospect.publicReplyUrl || "",
    verticalTrackedUrl: prospect.verticalTrackedUrl || "",
    trackedUrl: prospect.trackedUrl,
    subject: prospect.subject,
    status: existing.status || "queued",
    needsReplyEmail: existing.needsReplyEmail !== undefined ? Boolean(existing.needsReplyEmail) : true,
    publicReplyAvailable,
    submittedAt: existing.submittedAt || "",
    replyAt: existing.replyAt || "",
    qualifiedAt: existing.qualifiedAt || "",
    settledAt: existing.settledAt || "",
    evidenceUrl: existing.evidenceUrl || "",
    evidenceNote: existingEvidenceNote && !(publicReplyAvailable && staleReplyEmailBlocker.test(existingEvidenceNote)) ? existingEvidenceNote : defaultEvidenceNote,
    nextAction: existingNextAction && !(publicReplyAvailable && staleReplyEmailBlocker.test(existingNextAction)) ? existingNextAction : defaultNextAction,
    successSignal: prospect.successSignal || "qualified sponsor inquiry, signed agreement, or settled external payment",
    contactFormMessage: prospect.contactFormMessage || "",
    body: prospect.body,
  };
}

function toCsv(rows) {
  const headers = ["id", "name", "vertical", "contactUrl", "suggestedDealId", "suggestedDealTitle", "suggestedDealPrice", "proposalUrl", "contactFormProposalUrl", "dealRoomUrl", "publicReplyUrl", "verticalTrackedUrl", "trackedUrl", "status", "needsReplyEmail", "publicReplyAvailable", "submittedAt", "replyAt", "qualifiedAt", "settledAt", "evidenceUrl", "evidenceNote", "nextAction", "contactFormMessage"];
  return [
    headers,
    ...rows.map((row) => headers.map((header) => row[header] || "")),
  ].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n") + "\n";
}

function nextBatchMarkdown(rows) {
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
    ...queued.map((row, index) => [
      `## ${index + 1}. ${row.name}`,
      "",
      `- Status: ${row.status}`,
      `- Contact: ${row.contactUrl}`,
      `- Recommended deal: ${row.suggestedDealTitle} (${row.suggestedDealPrice})`,
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

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}
