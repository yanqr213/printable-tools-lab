const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const reportsDir = path.join(root, "reports");
const endpoint = "https://nosignuptools.com/api/submit";

const common = {
  icon_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
  screenshots: ["https://printable-tools-lab.pages.dev/assets/images/free-pdf-tools-screenshot.png"],
  tag_ids: [3, 5],
  submitter_name: "PrintableTools Lab",
  submitter_email: null,
};

const backlog = [
  {
    report: "nosignuptools-image-dimensions-600x600-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/image-dimensions-600x600-upload-fix-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Image+Dimensions+600x600+Upload+Fix",
    payload: {
      ...common,
      name: "Image Dimensions 600x600 Upload Fix by PrintableTools Lab",
      slug: "image-dimensions-600x600-upload-fix-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/image-dimensions-600x600/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=image_dimensions_600x600_fix_2026_06&utm_content=image_dimensions_600x600_landing",
      category: "productivity",
      short_description: "Free no-signup 600 x 600 image resize and crop fix for blocked upload forms.",
      long_description: "A free browser-based 600 x 600 image resize and crop fixer for people blocked by school forms, profile photos, marketplace listings, and application portals that require exact square dimensions. It points to local resize, crop, and image compression tools, requires no account and no server file upload, and includes an optional USD 9 manual upload fix-plan request only after a public-safe fit check.",
    },
  },
  {
    report: "nosignuptools-pdf-not-accepted-jpg-required-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/pdf-not-accepted-jpg-required-fix-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=PDF+Not+Accepted+JPG+Required+Fix",
    payload: {
      ...common,
      name: "PDF Not Accepted JPG Required Fix by PrintableTools Lab",
      slug: "pdf-not-accepted-jpg-required-fix-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/pdf-not-accepted-jpg-required/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=pdf_not_accepted_jpg_required_fix_2026_06&utm_content=pdf_to_jpg_required_landing",
      category: "productivity",
      short_description: "Free no-signup PDF to JPG or PNG fix for upload forms that reject PDFs.",
      long_description: "A free browser-based PDF not accepted JPG required fixer for people whose portal rejects a PDF but accepts JPG, JPEG, PNG, or another image upload. It points to local PDF-to-image conversion and image compression tools, requires no account and no server file upload, and includes an optional USD 9 manual upload fix-plan request only after a public-safe fit check.",
    },
  },
  {
    report: "nosignuptools-compress-image-to-kb-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/compress-image-to-kb-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Compress+Image+to+KB",
    payload: {
      ...common,
      name: "Compress Image to KB by PrintableTools Lab",
      slug: "compress-image-to-kb-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/tools/compress-image-to-kb/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=compress_image_kb_invoice_first_2026_06&utm_content=compress_image_kb_tool",
      category: "productivity",
      short_description: "Free no-signup image-to-KB compressor with an optional one-contact USD 9 upload fix-plan request.",
      long_description: "A free browser-based image-to-KB compressor for people whose forms, portals, profiles, or applications reject photos over a target size. It works without an account or server upload and now exposes a one-contact optional USD 9 Upload Limit Fix Plan request for exact settings, fallback steps, and a review-before-upload checklist after fit is confirmed.",
    },
  },
  {
    report: "nosignuptools-email-attachment-too-large-submit.json",
    expectedReviewUrl: "https://nosignuptools.com/tools/email-attachment-too-large-fix-by-printabletools-lab",
    searchUrl: "https://nosignuptools.com/?q=Email+Attachment+Too+Large+Fix",
    payload: {
      ...common,
      name: "Email Attachment Too Large Fix by PrintableTools Lab",
      slug: "email-attachment-too-large-fix-by-printabletools-lab",
      url: "https://printable-tools-lab.pages.dev/email-attachment-too-large/?utm_source=nosignuptools&utm_medium=directory&utm_campaign=email_attachment_too_large_fix_2026_06&utm_content=email_attachment_too_large_landing",
      category: "productivity",
      short_description: "Free no-signup PDF and image attachment-size fix for email upload limits.",
      long_description: "A free browser-based email attachment too large fixer for Gmail, Outlook, webmail, and inbox size errors. It points to PDF compression and image-to-KB tools without an account or server upload and includes an optional USD 9 Upload Limit Fix Plan request for public-safe target settings, fallback steps, and a review-before-upload checklist after fit is confirmed.",
    },
  },
];

async function main() {
  fs.mkdirSync(reportsDir, { recursive: true });
  const results = [];

  for (const item of backlog) {
    const result = await submitOrSkip(item);
    results.push(result);
    await delay(3000);
  }

  console.log(JSON.stringify({ ok: results.every((item) => item.ok || item.skipped), results }, null, 2));
  if (results.some((item) => !item.ok && !item.skipped)) process.exitCode = 1;
}

async function submitOrSkip(item) {
  const reportPath = path.join(reportsDir, item.report);
  const existing = readJson(reportPath);
  if (existing && existing.ok) {
    return { report: item.report, skipped: true, reason: "existing_api_acceptance", expectedReviewUrl: existing.expectedReviewUrl };
  }

  const preSubmitEvidence = {
    expectedReviewUrl: await checkUrl(item.expectedReviewUrl),
    searchUrl: await checkUrl(item.searchUrl),
  };

  if (preSubmitEvidence.expectedReviewUrl.status === 200 && preSubmitEvidence.expectedReviewUrl.matched) {
    const report = {
      generatedAt: new Date().toISOString(),
      directory: "NoSignupTools",
      endpoint,
      status: 200,
      ok: true,
      skipped: true,
      result: "already_public_before_submit",
      preSubmitEvidence,
      payload: item.payload,
      response: { success: true },
      reviewStatus: "already_public",
      reviewWindow: "",
      expectedReviewUrl: item.expectedReviewUrl,
    };
    writeReport(item.report, report);
    return { report: item.report, skipped: true, reason: "already_public_before_submit", expectedReviewUrl: item.expectedReviewUrl };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item.payload),
  });
  const body = await response.json().catch(async () => ({ raw: await response.text().catch(() => "") }));
  const accepted = response.ok && body?.success === true;
  const report = {
    generatedAt: new Date().toISOString(),
    directory: "NoSignupTools",
    endpoint,
    status: response.status,
    ok: accepted,
    preSubmitEvidence: {
      expectedReviewUrlStatus: preSubmitEvidence.expectedReviewUrl.status,
      searchMatchedExistingListing: preSubmitEvidence.searchUrl.matched,
    },
    payload: item.payload,
    response: body,
    reviewStatus: accepted ? "pending_manual_review" : "api_submit_failed_pending_retry",
    reviewWindow: accepted ? "24-48 hours" : "",
    expectedReviewUrl: item.expectedReviewUrl,
  };
  writeReport(accepted ? item.report : item.report.replace(/\.json$/, "-failed.json"), report);
  return { report: item.report, ok: accepted, status: response.status, expectedReviewUrl: item.expectedReviewUrl };
}

async function checkUrl(url) {
  try {
    const response = await fetch(url, { redirect: "follow" });
    const text = await response.text().catch(() => "");
    return {
      url,
      ok: response.ok,
      status: response.status,
      matched: text.includes("printable-tools-lab.pages.dev") || text.includes("PrintableTools Lab"),
      bytes: text.length,
    };
  } catch (error) {
    return {
      url,
      ok: false,
      status: 0,
      matched: false,
      error: error.message,
    };
  }
}

function writeReport(name, data) {
  fs.writeFileSync(path.join(reportsDir, name), `${JSON.stringify(data, null, 2)}\n`);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    return null;
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
