const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const reportsDir = path.join(root, "reports");
const endpoint = "https://nologin.tools/api/submit";
const rateLimitBackoffMs = 24 * 60 * 60 * 1000;

const tags = [
  { key: "category", value: "Productivity" },
  { key: "data", value: "Client-Side Only" },
  { key: "privacy", value: "Privacy Focused" },
  { key: "type", value: "Web App" },
  { key: "pricing", value: "Free" },
];

const backlog = [
  {
    report: "nologin-compress-image-to-kb-submit.json",
    reviewUrl: "https://nologin.tools/tool/printable-tools-lab-pages-dev-tools-compress-image-to-kb",
    payload: {
      name: "Compress Image to KB",
      url: "https://printable-tools-lab.pages.dev/tools/compress-image-to-kb/?utm_source=nologin&utm_medium=directory&utm_campaign=compress_image_kb_invoice_first_2026_06&utm_content=compress_image_kb_tool",
      description: "Free no-signup image-to-KB compressor for portals, profile photos, forms, and applications that reject photos over a target size. It runs in the browser without server upload and includes an optional USD 9 public-safe upload fix-plan invoice request for exact settings and fallback steps.",
      pledge: true,
      coreTask: "Compress an image or photo toward a target KB size without creating an account.",
      submitterEmail: "",
      repoUrl: "",
      twitterUrl: "",
      githubUrl: "",
      discordUrl: "",
      tags,
    },
  },
  {
    report: "nologin-image-dimensions-600x600-submit.json",
    reviewUrl: "https://nologin.tools/tool/printable-tools-lab-pages-dev-image-dimensions-600x600",
    payload: {
      name: "Image Dimensions 600x600 Upload Fix",
      url: "https://printable-tools-lab.pages.dev/image-dimensions-600x600/?utm_source=nologin&utm_medium=directory&utm_campaign=image_dimensions_600x600_fix_2026_06&utm_content=image_dimensions_600x600_landing",
      description: "Free no-signup 600 x 600 image resize and crop fix for profile photos, school forms, marketplace listings, and application portals. It points to browser-based resize, crop, and compress tools. Optional USD 9 fit checks use public-safe error text only.",
      pledge: true,
      coreTask: "Resize or crop an image to 600 x 600 pixels without creating an account.",
      submitterEmail: "",
      repoUrl: "",
      twitterUrl: "",
      githubUrl: "",
      discordUrl: "",
      tags,
    },
  },
  {
    report: "nologin-pdf-not-accepted-jpg-required-submit.json",
    reviewUrl: "https://nologin.tools/tool/printable-tools-lab-pages-dev-pdf-not-accepted-jpg-required",
    payload: {
      name: "PDF Not Accepted JPG Required Fix",
      url: "https://printable-tools-lab.pages.dev/pdf-not-accepted-jpg-required/?utm_source=nologin&utm_medium=directory&utm_campaign=pdf_not_accepted_jpg_required_fix_2026_06&utm_content=pdf_to_jpg_required_landing",
      description: "Free no-signup PDF to JPG or PNG upload fix for portals that reject a PDF but accept an image. It points to local browser conversion and image compression pages. Optional USD 9 fit checks use public-safe error text only.",
      pledge: true,
      coreTask: "Convert PDF pages to JPG or PNG locally when an upload form requires an image.",
      submitterEmail: "",
      repoUrl: "",
      twitterUrl: "",
      githubUrl: "",
      discordUrl: "",
      tags,
    },
  },
  {
    report: "nologin-email-attachment-too-large-submit.json",
    reviewUrl: "https://nologin.tools/tool/printable-tools-lab-pages-dev-email-attachment-too-large",
    payload: {
      name: "Email Attachment Too Large Fix",
      url: "https://printable-tools-lab.pages.dev/email-attachment-too-large/?utm_source=nologin&utm_medium=directory&utm_campaign=email_attachment_too_large_fix_2026_06&utm_content=email_attachment_too_large_landing",
      description: "Free no-signup PDF and image attachment-size fix for Gmail, Outlook, webmail, and inbox size errors. It points to browser-based PDF compression and image-to-KB tools. Optional USD 9 fit checks use public-safe error text only.",
      pledge: true,
      coreTask: "Reduce a PDF or image attachment before emailing it without creating an account.",
      submitterEmail: "",
      repoUrl: "",
      twitterUrl: "",
      githubUrl: "",
      discordUrl: "",
      tags,
    },
  },
  {
    report: "nologin-compress-image-to-50kb-submit.json",
    reviewUrl: "https://nologin.tools/tool/printable-tools-lab-pages-dev-compress-image-to-50kb",
    payload: {
      name: "Compress Image to 50KB",
      url: "https://printable-tools-lab.pages.dev/compress-image-to-50kb/?utm_source=nologin&utm_medium=directory&utm_campaign=image_50kb_2026_06&utm_content=compress_image_to_50kb_landing",
      description: "Free no-signup 50KB image compressor for strict upload forms, passport-style photos, portals, and applications. It runs locally in the browser without server upload and includes an optional one-contact USD 9 public-safe upload fix-plan invoice request for exact settings and fallback steps.",
      pledge: true,
      coreTask: "Compress an image toward a 50KB target without creating an account.",
      submitterEmail: "",
      repoUrl: "",
      twitterUrl: "",
      githubUrl: "",
      discordUrl: "",
      tags,
    },
  },
  {
    report: "nologin-compress-image-to-100kb-submit.json",
    reviewUrl: "https://nologin.tools/tool/printable-tools-lab-pages-dev-compress-image-to-100kb",
    payload: {
      name: "Compress Image to 100KB",
      url: "https://printable-tools-lab.pages.dev/compress-image-to-100kb/?utm_source=nologin&utm_medium=directory&utm_campaign=image_100kb_2026_06&utm_content=compress_image_to_100kb_landing",
      description: "Free no-signup 100KB image compressor for profile photos, job portals, school forms, and application uploads. It runs locally in the browser without server upload and includes an optional one-contact USD 9 public-safe upload fix-plan invoice request for exact settings and fallback steps.",
      pledge: true,
      coreTask: "Compress an image toward a 100KB target without creating an account.",
      submitterEmail: "",
      repoUrl: "",
      twitterUrl: "",
      githubUrl: "",
      discordUrl: "",
      tags,
    },
  },
  {
    report: "nologin-compress-image-to-200kb-submit.json",
    reviewUrl: "https://nologin.tools/tool/printable-tools-lab-pages-dev-compress-image-to-200kb",
    payload: {
      name: "Compress Image to 200KB",
      url: "https://printable-tools-lab.pages.dev/compress-image-to-200kb/?utm_source=nologin&utm_medium=directory&utm_campaign=image_200kb_2026_06&utm_content=compress_image_to_200kb_landing",
      description: "Free no-signup 200KB image compressor for JPG, PNG, portal, and form upload limits. It runs locally in the browser without server upload and includes an optional one-contact USD 9 public-safe upload fix-plan invoice request for exact settings and fallback steps.",
      pledge: true,
      coreTask: "Compress an image toward a 200KB target without creating an account.",
      submitterEmail: "",
      repoUrl: "",
      twitterUrl: "",
      githubUrl: "",
      discordUrl: "",
      tags,
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
  if (existing && existing.ok && existing.response?.data?.slug) {
    return { report: item.report, skipped: true, reason: "existing_api_acceptance", reviewUrl: existing.reviewUrl };
  }
  const failedReportPath = path.join(reportsDir, item.report.replace(/\.json$/, "-failed.json"));
  const failed = readJson(failedReportPath);
  const failedAt = Date.parse(failed?.generatedAt || "");
  const rateLimitedRecently = failed?.postSubmitCheck?.result === "rate_limited_pending_retry" && Number.isFinite(failedAt) && Date.now() - failedAt < rateLimitBackoffMs;
  if (rateLimitedRecently) {
    return { report: item.report, skipped: true, reason: "recent_rate_limit_pending_retry", reviewUrl: failed.reviewUrl };
  }

  const preSubmitCheck = await checkReviewUrl(item.reviewUrl);
  if (preSubmitCheck.status === 200 && preSubmitCheck.matched) {
    const report = {
      generatedAt: new Date().toISOString(),
      endpoint,
      status: 200,
      ok: true,
      skipped: true,
      result: "already_public_before_submit",
      preSubmitCheck,
      payload: item.payload,
      response: { ok: true, data: { slug: item.reviewUrl.split("/").pop() } },
      reviewUrl: item.reviewUrl,
      postSubmitCheck: preSubmitCheck,
    };
    writeReport(item.report, report);
    return { report: item.report, skipped: true, reason: "already_public_before_submit", reviewUrl: item.reviewUrl };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item.payload),
  });
  const body = await response.json().catch(async () => ({ raw: await response.text().catch(() => "") }));
  const slug = body?.data?.slug || item.reviewUrl.split("/").pop();
  const reviewUrl = slug ? `https://nologin.tools/tool/${slug}` : item.reviewUrl;
  const postSubmitCheck = await checkReviewUrl(reviewUrl);
  const accepted = response.ok && body?.ok === true;
  const rateLimited = response.status === 429 || /limit/i.test(String(body?.error || ""));
  const report = {
    generatedAt: new Date().toISOString(),
    endpoint,
    status: response.status,
    ok: accepted,
    preSubmitCheck,
    payload: item.payload,
    response: body,
    reviewUrl,
    postSubmitCheck: {
      checkedAt: postSubmitCheck.checkedAt,
      status: postSubmitCheck.status,
      result: !accepted
        ? rateLimited
          ? "rate_limited_pending_retry"
          : "api_submit_failed_pending_retry"
        : postSubmitCheck.status === 200 && postSubmitCheck.matched
        ? "accepted_by_api_and_public_listing_visible"
        : "accepted_by_api_pending_public_review",
    },
  };

  writeReport(accepted ? item.report : item.report.replace(/\.json$/, "-failed.json"), report);
  return { report: item.report, ok: accepted, status: response.status, rateLimited, reviewUrl, slug, postSubmitStatus: postSubmitCheck.status };
}

async function checkReviewUrl(url) {
  const checkedAt = new Date().toISOString();
  try {
    const response = await fetch(url, { redirect: "follow" });
    const text = await response.text().catch(() => "");
    return {
      checkedAt,
      url,
      ok: response.ok,
      status: response.status,
      matched: text.includes("printable-tools-lab.pages.dev") || text.includes("PrintableTools Lab"),
      bytes: text.length,
    };
  } catch (error) {
    return {
      checkedAt,
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
