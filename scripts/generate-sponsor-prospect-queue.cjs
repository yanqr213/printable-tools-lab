const fs = require("fs");
const path = require("path");

const { SPONSOR_DEALS, SPONSOR_VERTICALS, siteUrl, sponsorPublicReplyUrl } = require("./seo-content.cjs");

const root = path.resolve(__dirname, "..");
const reportsDir = path.join(root, "reports");
const generatedAt = new Date().toISOString();
const PUBLIC_REPLY_FORM_URL = "https://github.com/yanqr213/printable-tools-lab/issues/new?template=sponsor-partner-inquiry.yml";

const prospects = [
  {
    id: "pdfco-pdf-api",
    name: "PDF.co",
    vertical: "pdf-image-qr-saas",
    category: "PDF API and document automation",
    website: "https://pdf.co/",
    contactUrl: "https://pdf.co/contact",
    evidenceUrl: "https://pdf.co/",
    fitReason: "PDF.co sells PDF and document automation APIs, which fits visitors compressing, converting, and editing PDF files.",
    offer: "Guide sponsorship pilot around no-upload PDF workflow pages.",
    dealId: "guide-sponsor-pilot",
  },
  {
    id: "cloudmersive-document-api",
    name: "Cloudmersive",
    vertical: "pdf-image-qr-saas",
    category: "Document conversion API",
    website: "https://cloudmersive.com/",
    contactUrl: "https://cloudmersive.com/contact-sales",
    evidenceUrl: "https://cloudmersive.com/convert-api",
    fitReason: "Cloudmersive offers file conversion and document APIs, adjacent to PrintableTools Lab's PDF and image conversion intent.",
    offer: "Starter media review or guide sponsorship pilot for developer-facing file workflow pages.",
    dealId: "starter-fit-review",
  },
  {
    id: "uniqode-qr-platform",
    name: "Uniqode",
    vertical: "local-marketing-qr-sponsors",
    category: "QR code platform",
    website: "https://www.uniqode.com/",
    contactUrl: "https://www.uniqode.com/contact-sales",
    evidenceUrl: "https://www.uniqode.com/qr-code-generator",
    fitReason: "Uniqode sells QR code and offline-to-online marketing tools, matching QR, WiFi QR, contact QR, flyer, and coupon workflows.",
    offer: "Local marketing and QR sponsorship pilot.",
    dealId: "vertical-category-pilot",
  },
  {
    id: "qrcodechimp-qr-marketing",
    name: "QRCodeChimp",
    vertical: "local-marketing-qr-sponsors",
    category: "QR code marketing",
    website: "https://www.qrcodechimp.com/",
    contactUrl: "https://www.qrcodechimp.com/contact",
    evidenceUrl: "https://www.qrcodechimp.com/",
    fitReason: "QRCodeChimp targets business QR code use cases, a close fit for printable QR signs, flyers, coupons, and local service handouts.",
    offer: "Starter review or guide sponsorship around QR print assets.",
    dealId: "guide-sponsor-pilot",
  },
  {
    id: "jobscan-ats-resume",
    name: "Jobscan",
    vertical: "resume-career-sponsors",
    category: "ATS resume checker",
    website: "https://www.jobscan.co/",
    contactUrl: "https://www.jobscan.co/partners",
    evidenceUrl: "https://www.jobscan.co/resume-scanner",
    fitReason: "Jobscan's ATS and resume optimization product fits visitors using resume builder, ATS checker, and resume upload-size pages.",
    offer: "Resume and career tool sponsorship pilot.",
    dealId: "vertical-category-pilot",
  },
  {
    id: "teal-career-resume",
    name: "Teal",
    vertical: "resume-career-sponsors",
    category: "Career and resume software",
    website: "https://www.tealhq.com/",
    contactUrl: "https://www.tealhq.com/contact-us",
    evidenceUrl: "https://www.tealhq.com/resume-builder",
    fitReason: "Teal offers job-search and resume tools, matching job seekers creating application PDFs and ATS-friendly documents.",
    offer: "Guide sponsorship pilot near resume and cover-letter workflows.",
    dealId: "guide-sponsor-pilot",
  },
  {
    id: "invoice-ninja-small-business",
    name: "Invoice Ninja",
    vertical: "small-business-paperwork-sponsors",
    category: "Invoicing software",
    website: "https://www.invoiceninja.com/",
    contactUrl: "https://www.invoiceninja.com/contact/",
    evidenceUrl: "https://www.invoiceninja.com/",
    fitReason: "Invoice Ninja sells invoicing and small-business payment workflow software, fitting invoice, estimate, receipt, and client paperwork pages.",
    offer: "Small business paperwork sponsorship pilot.",
    dealId: "vertical-category-pilot",
  },
  {
    id: "zoho-invoice-small-business",
    name: "Zoho Invoice",
    vertical: "small-business-paperwork-sponsors",
    category: "Small-business invoicing",
    website: "https://www.zoho.com/invoice/",
    contactUrl: "https://www.zoho.com/contactus.html",
    evidenceUrl: "https://www.zoho.com/invoice/",
    fitReason: "Zoho Invoice targets small businesses that need invoices, estimates, payments, and client records.",
    offer: "Guide sponsorship around free invoice and small-business paperwork pages.",
    dealId: "guide-sponsor-pilot",
  },
  {
    id: "educationcom-worksheets",
    name: "Education.com",
    vertical: "classroom-printable-sponsors",
    category: "Worksheets and learning resources",
    website: "https://www.education.com/",
    contactUrl: "https://www.education.com/contact-us/",
    evidenceUrl: "https://www.education.com/worksheets/",
    fitReason: "Education.com publishes worksheets and learning resources, matching name tracing, flashcards, classroom labels, and printable routine pages.",
    offer: "Classroom printable sponsorship pilot with child-safety review.",
    dealId: "vertical-category-pilot",
  },
  {
    id: "twinkl-teacher-resources",
    name: "Twinkl",
    vertical: "classroom-printable-sponsors",
    category: "Teacher resources",
    website: "https://www.twinkl.com/",
    contactUrl: "https://www.twinkl.com/contact",
    evidenceUrl: "https://www.twinkl.com/resources",
    fitReason: "Twinkl's teacher-resource catalog fits visitors making classroom printables, labels, worksheets, and routine charts.",
    offer: "Classroom printable guide sponsorship pilot.",
    dealId: "guide-sponsor-pilot",
  },
];

main();

function main() {
  const verticals = Object.fromEntries(SPONSOR_VERTICALS.map((vertical) => [vertical.slug, vertical]));
  const rows = prospects.map((prospect, index) => prospectRow(prospect, verticals, index));
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(path.join(reportsDir, "sponsor-prospect-queue.json"), `${JSON.stringify({
    name: "PrintableTools Lab Sponsor Prospect Queue",
    generatedAt,
    count: rows.length,
    rules: [
      "Send only to public contact, partner, or sales forms.",
      "Do not scrape private emails or use purchased lead lists.",
      "Stop contacting a prospect after an opt-out or negative reply.",
      "Do not claim guaranteed traffic, guaranteed conversions, or existing revenue.",
      "Use the proposalUrl as the first-touch URL so sponsor intent lands on a partner-specific, noindex proposal page.",
      "Use publicReplyUrl only for public-safe sponsor replies; the site form remains the preferred private lead path.",
      "Keep dealRoomUrl available as the transparent pricing and inquiry fallback.",
      "Revenue is real only after a signed agreement or settled external payment.",
    ],
    rows,
  }, null, 2)}\n`);
  fs.writeFileSync(path.join(reportsDir, "sponsor-prospect-queue.csv"), toCsv(rows));
  const markdown = toMarkdown(rows);
  fs.writeFileSync(path.join(reportsDir, "sponsor-outreach-batch.md"), markdown);
  fs.writeFileSync(path.join(reportsDir, "sponsor-proposal-outreach-batch.md"), markdown);
  console.log(`Generated ${rows.length} sponsor prospect row(s) in reports/sponsor-prospect-queue.*, reports/sponsor-outreach-batch.md, and reports/sponsor-proposal-outreach-batch.md`);
}

function prospectRow(prospect, verticals, index) {
  const vertical = verticals[prospect.vertical];
  if (!vertical) throw new Error(`Unknown sponsor vertical: ${prospect.vertical}`);
  const suggestedDeal = SPONSOR_DEALS.find((deal) => deal.id === prospect.dealId) || SPONSOR_DEALS.find((deal) => deal.id === "guide-sponsor-pilot") || SPONSOR_DEALS[0];
  const commitment = sponsorDealCommitment(suggestedDeal);
  const verticalTrackedUrl = `${siteUrl(`sponsor/${vertical.slug}`).replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=${encodeURIComponent(vertical.campaign)}&utm_content=${encodeURIComponent(prospect.id)}`;
  const dealRoomUrl = `${siteUrl("sponsor-deal-room").replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=sponsor_deal_room&utm_content=${encodeURIComponent(prospect.id)}&deal=${encodeURIComponent(suggestedDeal.id)}&vertical=${encodeURIComponent(vertical.slug)}&commitment=${encodeURIComponent(commitment)}#sponsor-inquiry`;
  const proposalUrl = `${siteUrl("sponsor-proposal").replace(/\/$/, "")}?prospect=${encodeURIComponent(prospect.id)}&deal=${encodeURIComponent(suggestedDeal.id)}&vertical=${encodeURIComponent(vertical.slug)}&utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=sponsor_proposal&utm_content=${encodeURIComponent(prospect.id)}&commitment=${encodeURIComponent(commitment)}#sponsor-inquiry`;
  const contactFormProposalUrl = `${siteUrl("sponsor-proposal").replace(/\/$/, "")}?prospect=${encodeURIComponent(prospect.id)}&deal=${encodeURIComponent(suggestedDeal.id)}&vertical=${encodeURIComponent(vertical.slug)}#sponsor-inquiry`;
  const publicReplyUrl = sponsorPublicReplyUrl({
    prospectName: prospect.name,
    website: prospect.website,
    verticalTitle: vertical.title,
    dealTitle: suggestedDeal.title,
    dealPrice: suggestedDeal.price,
    proposalUrl,
  });
  const subject = `${suggestedDeal.title} for ${vertical.title}`;
  const contactFormMessage = [
    `Hi ${prospect.name} team - I run PrintableTools Lab, a free no-signup browser utility site for PDF, image, QR, resume, classroom, and small-business document workflows.`,
    `Your product looks relevant to this audience.`,
    `Sponsor proposal: ${contactFormProposalUrl}`,
    `Public-safe reply form: ${PUBLIC_REPLY_FORM_URL}`,
    "Please keep private payment, tax, bank, phone, customer, identity, password, or file data out of the public reply.",
  ].join(" ");
  const body = [
    `Hi ${prospect.name} team,`,
    "",
    "I run PrintableTools Lab, a free no-signup browser utility site for PDF, image, QR, resume, classroom, and small-business document workflows.",
    "",
    `Your product looks relevant because ${prospect.fitReason}`,
    "",
    `I opened a short partner-specific sponsor proposal for this audience: ${proposalUrl}`,
    "",
    `The best starting option is "${suggestedDeal.title}" (${suggestedDeal.price}): ${suggestedDeal.deliverable}`,
    "",
    commitment === "request-invoice" ? "If there is a fit, the form opens on Request pilot invoice so the next step is explicit while still requiring manual review." : "The form opens on a question/fit-review step because this is a non-cash exploratory path.",
    "",
    `The transparent deal-room fallback is here: ${dealRoomUrl}`,
    "",
    `If email is inconvenient, this public-safe GitHub reply form is also available: ${publicReplyUrl}`,
    "",
    `For vertical context, this is the audience fit page: ${verticalTrackedUrl}`,
    "",
    "Downloads stay free, sponsor copy is separated from generator controls, and placements are manually reviewed for policy fit. I am not claiming guaranteed traffic or conversions; this is a small validation pilot before any placement goes live.",
    "",
    "Would this be relevant for your partnership or marketing team?",
  ].join("\n");
  return {
    priority: index + 1,
    id: prospect.id,
    name: prospect.name,
    vertical: prospect.vertical,
    category: prospect.category,
    website: prospect.website,
    contactUrl: prospect.contactUrl,
    evidenceUrl: prospect.evidenceUrl,
    fitReason: prospect.fitReason,
    offer: prospect.offer,
    suggestedDealId: suggestedDeal.id,
    suggestedDealTitle: suggestedDeal.title,
    suggestedDealPrice: suggestedDeal.price,
    suggestedDealDeliverable: suggestedDeal.deliverable,
    requestedCommitment: commitment,
    proposalUrl,
    contactFormProposalUrl,
    dealRoomUrl,
    publicReplyUrl,
    verticalTrackedUrl,
    trackedUrl: proposalUrl,
    subject,
    contactFormMessage,
    body,
    status: "ready_to_send",
    successSignal: "qualified sponsor inquiry, signed agreement, or settled external payment",
  };
}

function sponsorDealCommitment(deal) {
  return deal?.commitment || (String(deal?.price || "").toLowerCase().includes("no-cash") ? "question-only" : "request-invoice");
}

function toCsv(rows) {
  const headers = ["priority", "id", "name", "vertical", "category", "website", "contactUrl", "evidenceUrl", "offer", "suggestedDealId", "suggestedDealTitle", "suggestedDealPrice", "requestedCommitment", "proposalUrl", "contactFormProposalUrl", "dealRoomUrl", "publicReplyUrl", "verticalTrackedUrl", "trackedUrl", "subject", "contactFormMessage", "status", "successSignal"];
  return [
    headers,
    ...rows.map((row) => headers.map((header) => row[header] || "")),
  ].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n") + "\n";
}

function toMarkdown(rows) {
  return [
    "# Sponsor Outreach Batch",
    "",
    `Generated: ${generatedAt}`,
    "",
    "Use public contact, partner, or sales forms only. Do not include private payment, tax, phone, bank, or identity details.",
    "",
    ...rows.map((row) => [
      `## ${row.priority}. ${row.name}`,
      "",
      `- Vertical: ${row.vertical}`,
      `- Contact: ${row.contactUrl}`,
      `- Evidence: ${row.evidenceUrl}`,
      `- Recommended deal: ${row.suggestedDealTitle} (${row.suggestedDealPrice})`,
      `- Proposal URL: ${row.proposalUrl}`,
      `- Short contact-form proposal URL: ${row.contactFormProposalUrl}`,
      `- Deal room URL: ${row.dealRoomUrl}`,
      `- Public-safe reply URL: ${row.publicReplyUrl}`,
      `- Vertical fit URL: ${row.verticalTrackedUrl}`,
      `- Subject: ${row.subject}`,
      "",
      "Short contact form message:",
      "",
      "```text",
      row.contactFormMessage,
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
