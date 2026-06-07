const fs = require("fs");
const path = require("path");

const { SPONSOR_VERTICALS, siteUrl } = require("./seo-content.cjs");

const root = path.resolve(__dirname, "..");
const reportsDir = path.join(root, "reports");
const generatedAt = new Date().toISOString();

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
  },
  {
    id: "cloudmersive-document-api",
    name: "Cloudmersive",
    vertical: "pdf-image-qr-saas",
    category: "Document conversion API",
    website: "https://cloudmersive.com/",
    contactUrl: "https://cloudmersive.com/contact",
    evidenceUrl: "https://cloudmersive.com/convert-api",
    fitReason: "Cloudmersive offers file conversion and document APIs, adjacent to PrintableTools Lab's PDF and image conversion intent.",
    offer: "Starter media review or guide sponsorship pilot for developer-facing file workflow pages.",
  },
  {
    id: "uniqode-qr-platform",
    name: "Uniqode",
    vertical: "local-marketing-qr-sponsors",
    category: "QR code platform",
    website: "https://www.uniqode.com/",
    contactUrl: "https://www.uniqode.com/contact-us",
    evidenceUrl: "https://www.uniqode.com/qr-code-generator",
    fitReason: "Uniqode sells QR code and offline-to-online marketing tools, matching QR, WiFi QR, contact QR, flyer, and coupon workflows.",
    offer: "Local marketing and QR sponsorship pilot.",
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
  },
  {
    id: "jobscan-ats-resume",
    name: "Jobscan",
    vertical: "resume-career-sponsors",
    category: "ATS resume checker",
    website: "https://www.jobscan.co/",
    contactUrl: "https://www.jobscan.co/contact",
    evidenceUrl: "https://www.jobscan.co/resume-scanner",
    fitReason: "Jobscan's ATS and resume optimization product fits visitors using resume builder, ATS checker, and resume upload-size pages.",
    offer: "Resume and career tool sponsorship pilot.",
  },
  {
    id: "teal-career-resume",
    name: "Teal",
    vertical: "resume-career-sponsors",
    category: "Career and resume software",
    website: "https://www.tealhq.com/",
    contactUrl: "https://www.tealhq.com/contact",
    evidenceUrl: "https://www.tealhq.com/resume-builder",
    fitReason: "Teal offers job-search and resume tools, matching job seekers creating application PDFs and ATS-friendly documents.",
    offer: "Guide sponsorship pilot near resume and cover-letter workflows.",
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
      "Revenue is real only after a signed agreement or settled external payment.",
    ],
    rows,
  }, null, 2)}\n`);
  fs.writeFileSync(path.join(reportsDir, "sponsor-prospect-queue.csv"), toCsv(rows));
  fs.writeFileSync(path.join(reportsDir, "sponsor-outreach-batch.md"), toMarkdown(rows));
  console.log(`Generated ${rows.length} sponsor prospect row(s) in reports/sponsor-prospect-queue.* and reports/sponsor-outreach-batch.md`);
}

function prospectRow(prospect, verticals, index) {
  const vertical = verticals[prospect.vertical];
  if (!vertical) throw new Error(`Unknown sponsor vertical: ${prospect.vertical}`);
  const trackedUrl = `${siteUrl(`sponsor/${vertical.slug}`).replace(/\/$/, "")}?utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=${encodeURIComponent(vertical.campaign)}&utm_content=${encodeURIComponent(prospect.id)}`;
  const subject = `${vertical.title}: small sponsor pilot`;
  const body = [
    `Hi ${prospect.name} team,`,
    "",
    "I run PrintableTools Lab, a free no-signup browser utility site for PDF, image, QR, resume, classroom, and small-business document workflows.",
    "",
    `Your product looks relevant because ${prospect.fitReason}`,
    "",
    `I am opening a small, clearly labeled sponsor pilot for this audience: ${trackedUrl}`,
    "",
    "Downloads stay free, sponsor copy is separated from generator controls, and placements are manually reviewed for policy fit. The early pilot range is USD 49 for a fit review or USD 99-149 for a guide sponsorship pilot.",
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
    trackedUrl,
    subject,
    body,
    status: "ready_to_send",
    successSignal: "qualified sponsor inquiry, signed agreement, or settled external payment",
  };
}

function toCsv(rows) {
  const headers = ["priority", "id", "name", "vertical", "category", "website", "contactUrl", "evidenceUrl", "offer", "trackedUrl", "subject", "status", "successSignal"];
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
      `- Tracked URL: ${row.trackedUrl}`,
      `- Subject: ${row.subject}`,
      "",
      "```text",
      row.body,
      "```",
      "",
    ].join("\n")),
  ].join("\n");
}
