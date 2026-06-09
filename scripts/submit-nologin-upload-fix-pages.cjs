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

const latestExactUploadLimitBacklog = [
  ["photo-150x200-20kb", "Photo 150x200 Under 20KB", "photo_150x200_20kb_2026_06", "photo_150x200_20kb_landing", "Free no-signup 150 x 200 photo under 20KB workflow for exam, profile, school, and application upload limits.", "Resize and compress a photo toward 150 x 200 pixels under 20KB without creating an account."],
  ["photo-180x240-50kb", "Photo 180x240 Under 50KB", "photo_180x240_50kb_2026_06", "photo_180x240_50kb_landing", "Free no-signup 180 x 240 photo under 50KB workflow for school, exam, profile, and admin upload forms.", "Resize and compress a photo toward 180 x 240 pixels under 50KB without creating an account."],
  ["photo-400x514-100kb", "Photo 400x514 Under 100KB", "photo_400x514_100kb_2026_06", "photo_400x514_100kb_landing", "Free no-signup 400 x 514 photo under 100KB workflow for portals that require exact portrait pixels and a strict file-size cap.", "Resize and compress a photo toward 400 x 514 pixels under 100KB without creating an account."],
  ["photo-600x800-200kb", "Photo 600x800 Under 200KB", "photo_600x800_200kb_2026_06", "photo_600x800_200kb_landing", "Free no-signup 600 x 800 photo under 200KB workflow for applications, profile forms, school portals, and admin uploads.", "Resize and compress a photo toward 600 x 800 pixels under 200KB without creating an account."],
  ["signature-100x50-10kb", "Signature 100x50 Under 10KB", "signature_100x50_10kb_2026_06", "signature_100x50_10kb_landing", "Free no-signup 100 x 50 signature under 10KB workflow for forms that require a very small signature image.", "Resize and compress a signature image toward 100 x 50 pixels under 10KB without creating an account."],
  ["signature-200x60-20kb", "Signature 200x60 Under 20KB", "signature_200x60_20kb_2026_06", "signature_200x60_20kb_landing", "Free no-signup 200 x 60 signature under 20KB workflow for job, exam, school, bank, and admin upload pages.", "Resize and compress a signature image toward 200 x 60 pixels under 20KB without creating an account."],
  ["signature-256x64-20kb", "Signature 256x64 Under 20KB", "signature_256x64_20kb_2026_06", "signature_256x64_20kb_landing", "Free no-signup 256 x 64 signature under 20KB workflow for portals that validate both exact signature pixels and file size.", "Resize and compress a signature image toward 256 x 64 pixels under 20KB without creating an account."],
  ["signature-400x200-100kb", "Signature 400x200 Under 100KB", "signature_400x200_100kb_2026_06", "signature_400x200_100kb_landing", "Free no-signup 400 x 200 signature under 100KB workflow for document, job, school, bank, and admin upload pages.", "Resize and compress a signature image toward 400 x 200 pixels under 100KB without creating an account."],
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
  ...latestExactUploadLimitBacklog.map(([slug, name, campaign, content, description, coreTask]) => ({
    report: `nologin-${slug}-submit.json`,
    reviewUrl: `https://nologin.tools/tool/printable-tools-lab-pages-dev-${slug}`,
    payload: {
      name,
      url: `https://printable-tools-lab.pages.dev/${slug}/?utm_source=nologin&utm_medium=directory&utm_campaign=${campaign}&utm_content=${content}`,
      description: `${description} It routes users to local browser resize and image-to-KB compression steps with an optional USD 9 public-safe upload fix-plan request.`,
      pledge: true,
      coreTask,
      submitterEmail: "",
      repoUrl: "",
      twitterUrl: "",
      githubUrl: "",
      discordUrl: "",
      tags,
    },
  })),
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
  {
    report: "nologin-photo-200x230-20kb-submit.json",
    reviewUrl: "https://nologin.tools/tool/printable-tools-lab-pages-dev-photo-200x230-20kb",
    payload: {
      name: "Photo 200x230 Under 20KB",
      url: "https://printable-tools-lab.pages.dev/photo-200x230-20kb/?utm_source=nologin&utm_medium=directory&utm_campaign=photo_200x230_20kb_2026_06&utm_content=photo_200x230_20kb_landing",
      description: "Free no-signup 200 x 230 photo under 20KB workflow for strict exam, profile, school, and application upload limits. It points to local browser resize and image-to-KB compression steps and includes an optional USD 9 public-safe upload fix-plan request.",
      pledge: true,
      coreTask: "Resize and compress a photo toward 200 x 230 pixels under 20KB without creating an account.",
      submitterEmail: "",
      repoUrl: "",
      twitterUrl: "",
      githubUrl: "",
      discordUrl: "",
      tags,
    },
  },
  {
    report: "nologin-photo-200x230-100kb-submit.json",
    reviewUrl: "https://nologin.tools/tool/printable-tools-lab-pages-dev-photo-200x230-100kb",
    payload: {
      name: "Photo 200x230 Under 100KB",
      url: "https://printable-tools-lab.pages.dev/photo-200x230-100kb/?utm_source=nologin&utm_medium=directory&utm_campaign=photo_200x230_100kb_2026_06&utm_content=photo_200x230_100kb_landing",
      description: "Free no-signup 200 x 230 photo under 100KB workflow for job, profile, school, exam, and application upload forms. It runs through local browser resize and compression steps and includes an optional USD 9 public-safe upload fix-plan request.",
      pledge: true,
      coreTask: "Resize and compress a photo toward 200 x 230 pixels under 100KB without creating an account.",
      submitterEmail: "",
      repoUrl: "",
      twitterUrl: "",
      githubUrl: "",
      discordUrl: "",
      tags,
    },
  },
  {
    report: "nologin-photo-413x531-100kb-submit.json",
    reviewUrl: "https://nologin.tools/tool/printable-tools-lab-pages-dev-photo-413x531-100kb",
    payload: {
      name: "Photo 413x531 Under 100KB",
      url: "https://printable-tools-lab.pages.dev/photo-413x531-100kb/?utm_source=nologin&utm_medium=directory&utm_campaign=photo_413x531_100kb_2026_06&utm_content=photo_413x531_100kb_landing",
      description: "Free no-signup 413 x 531 photo under 100KB workflow for application, profile, exam, and document upload forms. It points to local browser portrait resize and image-to-KB compression steps with an optional USD 9 public-safe upload fix-plan request.",
      pledge: true,
      coreTask: "Resize and compress a photo toward 413 x 531 pixels under 100KB without creating an account.",
      submitterEmail: "",
      repoUrl: "",
      twitterUrl: "",
      githubUrl: "",
      discordUrl: "",
      tags,
    },
  },
  {
    report: "nologin-photo-240x320-50kb-submit.json",
    reviewUrl: "https://nologin.tools/tool/printable-tools-lab-pages-dev-photo-240x320-50kb",
    payload: {
      name: "Photo 240x320 Under 50KB",
      url: "https://printable-tools-lab.pages.dev/photo-240x320-50kb/?utm_source=nologin&utm_medium=directory&utm_campaign=photo_240x320_50kb_2026_06&utm_content=photo_240x320_50kb_landing",
      description: "Free no-signup 240 x 320 photo under 50KB workflow for application, exam, school, profile, and admin upload forms. It points to local browser portrait resize and image-to-KB compression steps with an optional USD 9 public-safe upload fix-plan request.",
      pledge: true,
      coreTask: "Resize and compress a photo toward 240 x 320 pixels under 50KB without creating an account.",
      submitterEmail: "",
      repoUrl: "",
      twitterUrl: "",
      githubUrl: "",
      discordUrl: "",
      tags,
    },
  },
  {
    report: "nologin-photo-413x531-50kb-submit.json",
    reviewUrl: "https://nologin.tools/tool/printable-tools-lab-pages-dev-photo-413x531-50kb",
    payload: {
      name: "Photo 413x531 Under 50KB",
      url: "https://printable-tools-lab.pages.dev/photo-413x531-50kb/?utm_source=nologin&utm_medium=directory&utm_campaign=photo_413x531_50kb_2026_06&utm_content=photo_413x531_50kb_landing",
      description: "Free no-signup 413 x 531 photo under 50KB workflow for application, profile, exam, and document upload forms. It points to local browser portrait resize and strict image-to-KB compression steps with an optional USD 9 public-safe upload fix-plan request.",
      pledge: true,
      coreTask: "Resize and compress a photo toward 413 x 531 pixels under 50KB without creating an account.",
      submitterEmail: "",
      repoUrl: "",
      twitterUrl: "",
      githubUrl: "",
      discordUrl: "",
      tags,
    },
  },
  {
    report: "nologin-photo-300x300-100kb-submit.json",
    reviewUrl: "https://nologin.tools/tool/printable-tools-lab-pages-dev-photo-300x300-100kb",
    payload: {
      name: "Photo 300x300 Under 100KB",
      url: "https://printable-tools-lab.pages.dev/photo-300x300-100kb/?utm_source=nologin&utm_medium=directory&utm_campaign=photo_300x300_100kb_2026_06&utm_content=photo_300x300_100kb_landing",
      description: "Free no-signup 300 x 300 photo under 100KB workflow for profile, job, school, marketplace, and application upload forms. It runs through local browser square resize and image-to-KB compression steps with an optional USD 9 public-safe upload fix-plan request.",
      pledge: true,
      coreTask: "Resize and compress a photo toward 300 x 300 pixels under 100KB without creating an account.",
      submitterEmail: "",
      repoUrl: "",
      twitterUrl: "",
      githubUrl: "",
      discordUrl: "",
      tags,
    },
  },
  {
    report: "nologin-photo-600x600-100kb-submit.json",
    reviewUrl: "https://nologin.tools/tool/printable-tools-lab-pages-dev-photo-600x600-100kb",
    payload: {
      name: "Photo 600x600 Under 100KB",
      url: "https://printable-tools-lab.pages.dev/photo-600x600-100kb/?utm_source=nologin&utm_medium=directory&utm_campaign=photo_600x600_100kb_2026_06&utm_content=photo_600x600_100kb_landing",
      description: "Free no-signup 600 x 600 photo under 100KB workflow for profile, school, marketplace, application, and admin upload forms. It points to local browser square resize and image-to-KB compression steps with an optional USD 9 public-safe upload fix-plan request.",
      pledge: true,
      coreTask: "Resize and compress a photo toward 600 x 600 pixels under 100KB without creating an account.",
      submitterEmail: "",
      repoUrl: "",
      twitterUrl: "",
      githubUrl: "",
      discordUrl: "",
      tags,
    },
  },
  {
    report: "nologin-signature-140x60-20kb-submit.json",
    reviewUrl: "https://nologin.tools/tool/printable-tools-lab-pages-dev-signature-140x60-20kb",
    payload: {
      name: "Signature 140x60 Under 20KB",
      url: "https://printable-tools-lab.pages.dev/signature-140x60-20kb/?utm_source=nologin&utm_medium=directory&utm_campaign=signature_140x60_20kb_2026_06&utm_content=signature_140x60_20kb_landing",
      description: "Free no-signup 140 x 60 signature under 20KB workflow for exam, job, school, and admin upload pages. It routes users to local browser signature resize and compression steps with an optional USD 9 public-safe upload fix-plan request.",
      pledge: true,
      coreTask: "Resize and compress a signature image toward 140 x 60 pixels under 20KB without creating an account.",
      submitterEmail: "",
      repoUrl: "",
      twitterUrl: "",
      githubUrl: "",
      discordUrl: "",
      tags,
    },
  },
  {
    report: "nologin-signature-150x50-20kb-submit.json",
    reviewUrl: "https://nologin.tools/tool/printable-tools-lab-pages-dev-signature-150x50-20kb",
    payload: {
      name: "Signature 150x50 Under 20KB",
      url: "https://printable-tools-lab.pages.dev/signature-150x50-20kb/?utm_source=nologin&utm_medium=directory&utm_campaign=signature_150x50_20kb_2026_06&utm_content=signature_150x50_20kb_landing",
      description: "Free no-signup 150 x 50 signature under 20KB workflow for exam, job, school, bank, and admin upload pages. It routes users to local browser signature resize and compression steps with an optional USD 9 public-safe upload fix-plan request.",
      pledge: true,
      coreTask: "Resize and compress a signature image toward 150 x 50 pixels under 20KB without creating an account.",
      submitterEmail: "",
      repoUrl: "",
      twitterUrl: "",
      githubUrl: "",
      discordUrl: "",
      tags,
    },
  },
  {
    report: "nologin-signature-200x50-20kb-submit.json",
    reviewUrl: "https://nologin.tools/tool/printable-tools-lab-pages-dev-signature-200x50-20kb",
    payload: {
      name: "Signature 200x50 Under 20KB",
      url: "https://printable-tools-lab.pages.dev/signature-200x50-20kb/?utm_source=nologin&utm_medium=directory&utm_campaign=signature_200x50_20kb_2026_06&utm_content=signature_200x50_20kb_landing",
      description: "Free no-signup 200 x 50 signature under 20KB workflow for exam, job, school, bank, and admin upload pages. It routes users to local browser signature resize and compression steps with an optional USD 9 public-safe upload fix-plan request.",
      pledge: true,
      coreTask: "Resize and compress a signature image toward 200 x 50 pixels under 20KB without creating an account.",
      submitterEmail: "",
      repoUrl: "",
      twitterUrl: "",
      githubUrl: "",
      discordUrl: "",
      tags,
    },
  },
  {
    report: "nologin-signature-140x60-50kb-submit.json",
    reviewUrl: "https://nologin.tools/tool/printable-tools-lab-pages-dev-signature-140x60-50kb",
    payload: {
      name: "Signature 140x60 Under 50KB",
      url: "https://printable-tools-lab.pages.dev/signature-140x60-50kb/?utm_source=nologin&utm_medium=directory&utm_campaign=signature_140x60_50kb_2026_06&utm_content=signature_140x60_50kb_landing",
      description: "Free no-signup 140 x 60 signature under 50KB workflow for application, school, job, and admin upload forms. It points to local browser signature resize and compression checks with an optional USD 9 public-safe upload fix-plan request.",
      pledge: true,
      coreTask: "Resize and compress a signature image toward 140 x 60 pixels under 50KB without creating an account.",
      submitterEmail: "",
      repoUrl: "",
      twitterUrl: "",
      githubUrl: "",
      discordUrl: "",
      tags,
    },
  },
  {
    report: "nologin-signature-300x80-50kb-submit.json",
    reviewUrl: "https://nologin.tools/tool/printable-tools-lab-pages-dev-signature-300x80-50kb",
    payload: {
      name: "Signature 300x80 Under 50KB",
      url: "https://printable-tools-lab.pages.dev/signature-300x80-50kb/?utm_source=nologin&utm_medium=directory&utm_campaign=signature_300x80_50kb_2026_06&utm_content=signature_300x80_50kb_landing",
      description: "Free no-signup 300 x 80 signature under 50KB workflow for application, school, job, bank, and admin upload forms. It points to local browser signature resize and compression checks with an optional USD 9 public-safe upload fix-plan request.",
      pledge: true,
      coreTask: "Resize and compress a signature image toward 300 x 80 pixels under 50KB without creating an account.",
      submitterEmail: "",
      repoUrl: "",
      twitterUrl: "",
      githubUrl: "",
      discordUrl: "",
      tags,
    },
  },
  {
    report: "nologin-signature-300x100-50kb-submit.json",
    reviewUrl: "https://nologin.tools/tool/printable-tools-lab-pages-dev-signature-300x100-50kb",
    payload: {
      name: "Signature 300x100 Under 50KB",
      url: "https://printable-tools-lab.pages.dev/signature-300x100-50kb/?utm_source=nologin&utm_medium=directory&utm_campaign=signature_300x100_50kb_2026_06&utm_content=signature_300x100_50kb_landing",
      description: "Free no-signup 300 x 100 signature under 50KB workflow for job, exam, school, bank, document, and admin upload pages. It routes users to local browser resize and image-to-KB compression steps with an optional USD 9 public-safe upload fix-plan request.",
      pledge: true,
      coreTask: "Resize and compress a signature image toward 300 x 100 pixels under 50KB without creating an account.",
      submitterEmail: "",
      repoUrl: "",
      twitterUrl: "",
      githubUrl: "",
      discordUrl: "",
      tags,
    },
  },
  {
    report: "nologin-signature-200x100-50kb-submit.json",
    reviewUrl: "https://nologin.tools/tool/printable-tools-lab-pages-dev-signature-200x100-50kb",
    payload: {
      name: "Signature 200x100 Under 50KB",
      url: "https://printable-tools-lab.pages.dev/signature-200x100-50kb/?utm_source=nologin&utm_medium=directory&utm_campaign=signature_200x100_50kb_2026_06&utm_content=signature_200x100_50kb_landing",
      description: "Free no-signup 200 x 100 signature under 50KB workflow for job, exam, document, and admin upload pages. It routes users to local browser resize and image-to-KB compression steps with an optional USD 9 public-safe upload fix-plan request.",
      pledge: true,
      coreTask: "Resize and compress a signature image toward 200 x 100 pixels under 50KB without creating an account.",
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
  const recentRateLimit = findRecentRateLimit();

  for (const item of backlog) {
    const result = await submitOrSkip(item, recentRateLimit);
    results.push(result);
    if (result.rateLimited) break;
    if (!result.skipped) await delay(3000);
  }

  console.log(JSON.stringify({ ok: results.every((item) => item.ok || item.skipped), results }, null, 2));
  if (results.some((item) => !item.ok && !item.skipped)) process.exitCode = 1;
}

async function submitOrSkip(item, recentRateLimit) {
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
  if (recentRateLimit) {
    return { report: item.report, skipped: true, reason: "global_recent_rate_limit_pending_retry", blockedBy: recentRateLimit.name, retryAfter: recentRateLimit.retryAfter };
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

function findRecentRateLimit() {
  const now = Date.now();
  const files = fs.existsSync(reportsDir) ? fs.readdirSync(reportsDir) : [];
  const recent = [];
  for (const name of files) {
    if (!/^nologin-.*-failed\.json$/.test(name)) continue;
    const report = readJson(path.join(reportsDir, name));
    const failedAt = Date.parse(report?.generatedAt || "");
    if (report?.postSubmitCheck?.result !== "rate_limited_pending_retry") continue;
    if (!Number.isFinite(failedAt) || now - failedAt >= rateLimitBackoffMs) continue;
    recent.push({ name, failedAt, retryAfter: new Date(failedAt + rateLimitBackoffMs).toISOString() });
  }
  recent.sort((a, b) => b.failedAt - a.failedAt);
  return recent[0] || null;
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
