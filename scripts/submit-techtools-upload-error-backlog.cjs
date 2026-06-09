const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const reportsDir = path.join(root, "reports");
const endpoint = "https://techtools.cz/launchpad-api/tools";

const backlog = [
  {
    report: "techtools-image-dimensions-600x600-upload-fix-submit.json",
    payload: {
      name: "Image Dimensions 600x600 Upload Fix by PrintableTools Lab",
      tagline: "No-signup 600 x 600 image resize/crop fix with a public-safe $9 upload plan request.",
      description: "PrintableTools Lab Image Dimensions 600x600 Upload Fix helps people blocked by image dimensions must be 600 x 600 px, square profile photo, school form, application portal, and marketplace image rejection errors. The page points to the browser image resizer with 600 x 600 cover settings and includes a public-safe $9 Upload Limit Fix Plan request for exact settings, fallback steps, and a review-before-upload checklist without uploading the private image.",
      url: "https://printable-tools-lab.pages.dev/image-dimensions-600x600/?utm_source=techtools&utm_medium=directory&utm_campaign=image_dimensions_600x600_fix_2026_06&utm_content=image_dimensions_600x600_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 image dimensions 600x600 upload fix path",
    },
  },
  {
    report: "techtools-pdf-not-accepted-jpg-required-submit.json",
    payload: {
      name: "PDF Not Accepted JPG Required Fix by PrintableTools Lab",
      tagline: "No-signup PDF-to-JPG upload fix with a public-safe $9 fallback plan request.",
      description: "PrintableTools Lab PDF Not Accepted JPG Required Fix helps people blocked when a website rejects a PDF but asks for JPG, JPEG, PNG, or image upload instead. The page points to the browser PDF-to-images converter, explains the safe local conversion workflow, and includes a public-safe $9 Upload Limit Fix Plan request for exact settings, fallback steps, and a review-before-upload checklist without uploading the private PDF.",
      url: "https://printable-tools-lab.pages.dev/pdf-not-accepted-jpg-required/?utm_source=techtools&utm_medium=directory&utm_campaign=pdf_not_accepted_jpg_required_fix_2026_06&utm_content=pdf_to_jpg_required_landing",
      category: "productivity",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 PDF not accepted JPG required upload fix path",
    },
  },
  {
    report: "techtools-email-attachment-too-large-upload-fix-submit.json",
    payload: {
      name: "Email Attachment Too Large PDF Fix by PrintableTools Lab",
      tagline: "No-signup PDF and image attachment-size fix with a public-safe $9 upload plan request.",
      description: "PrintableTools Lab Email Attachment Too Large PDF Fix helps people blocked by email attachment too large, Gmail attachment size, Outlook attachment size, scanned PDF too large, and photo attachment too large errors. The page points to the browser PDF compressor and image-to-KB compressor, starts from practical email-friendly targets, and includes a public-safe $9 Upload Limit Fix Plan request without asking for private files, inbox access, IDs, logins, payment, or tax details.",
      url: "https://printable-tools-lab.pages.dev/email-attachment-too-large/?utm_source=techtools&utm_medium=directory&utm_campaign=email_attachment_too_large_fix_2026_06&utm_content=email_attachment_too_large_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 email attachment too large upload fix path",
    },
  },
  {
    report: "techtools-compress-image-to-kb-submit.json",
    payload: {
      name: "Compress Image to KB by PrintableTools Lab",
      tagline: "No-signup image-to-KB compressor with a one-contact $9 upload fix request.",
      description: "PrintableTools Lab Compress Image to KB helps people blocked by photo, profile, application, marketplace, and portal file-size limits. The free tool runs in the browser without account creation or server upload, supports exact target KB settings, and includes an optional public-safe $9 Upload Limit Fix Plan request for exact settings, fallback steps, and a review-before-upload checklist.",
      url: "https://printable-tools-lab.pages.dev/tools/compress-image-to-kb/?utm_source=techtools&utm_medium=directory&utm_campaign=compress_image_kb_invoice_first_2026_06&utm_content=compress_image_kb_tool",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 compress image to KB invoice-first tool path",
    },
  },
  {
    report: "techtools-compress-pdf-to-500kb-submit.json",
    payload: {
      name: "Compress PDF to 500KB by PrintableTools Lab",
      tagline: "Free no-signup PDF compressor for strict 500KB upload limits.",
      description: "PrintableTools Lab Compress PDF to 500KB helps people blocked by strict PDF must be under 500KB limits on forms, exam portals, school uploads, application portals, and government-style upload pages. It opens the browser PDF compressor with the 500KB target selected, keeps files local, and offers an optional public-safe $9 Upload Limit Fix Plan request for exact settings and fallback steps after fit is confirmed.",
      url: "https://printable-tools-lab.pages.dev/compress-pdf-to-500kb/?utm_source=techtools&utm_medium=directory&utm_campaign=pdf_500kb_2026_06&utm_content=compress_pdf_to_500kb_landing",
      category: "utilities",
      maker_name: "PrintableTools Lab",
      maker_url: "https://printable-tools-lab.pages.dev/",
      logo_url: "https://printable-tools-lab.pages.dev/assets/images/app-icon-512.png",
      submitted_by: "Codex traffic acquisition run 2026-06-09 compress PDF to 500KB high-intent landing path",
    },
  },
];

async function main() {
  fs.mkdirSync(reportsDir, { recursive: true });
  const results = [];
  for (const item of backlog) {
    const reportPath = path.join(reportsDir, item.report);
    if (fs.existsSync(reportPath)) {
      const existing = readJson(reportPath);
      if (existing && existing.ok && existing.shareUrl) {
        results.push({ report: item.report, skipped: true, shareUrl: existing.shareUrl });
        continue;
      }
    }
    const result = await submitItem(item);
    results.push(result);
    if (result.rateLimited) {
      writeReport("techtools-upload-error-backlog-rate-limit.json", {
        generatedAt: new Date().toISOString(),
        endpoint,
        ok: false,
        rateLimited: true,
        retryAfter: result.retryAfter || "Wait 1 hour",
        blockedAt: item.payload.name,
        remaining: backlog.slice(backlog.findIndex((entry) => entry.report === item.report)).map((entry) => entry.payload.name),
      });
      break;
    }
    await delay(3000);
  }
  console.log(JSON.stringify({ ok: results.every((item) => item.ok || item.skipped), results }, null, 2));
  if (results.some((item) => item.rateLimited)) process.exitCode = 2;
}

async function submitItem(item) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item.payload),
  });
  const body = await response.json().catch(() => ({}));
  const id = body && body.data && body.data.id;
  const report = {
    generatedAt: new Date().toISOString(),
    endpoint,
    status: response.status,
    ok: response.ok && body.success === true,
    payload: item.payload,
    response: body,
    shareUrl: body.share_url || (id ? `https://techtools.cz/tools/launchpad/?tool=${id}` : ""),
    evidenceApiUrl: id ? `https://techtools.cz/launchpad-api/tools/${id}` : "",
  };
  if (report.ok) {
    writeReport(item.report, report);
    return { report: item.report, ok: true, id, shareUrl: report.shareUrl, evidenceApiUrl: report.evidenceApiUrl };
  }
  if (response.status === 429 || /rate limit/i.test(String(body.error || ""))) {
    return { report: item.report, ok: false, rateLimited: true, retryAfter: body.retry_after || "" };
  }
  writeReport(item.report.replace(/\.json$/, "-failed.json"), report);
  return { report: item.report, ok: false, status: response.status, error: body.error || "submit_failed" };
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
  console.error(error);
  process.exit(1);
});
