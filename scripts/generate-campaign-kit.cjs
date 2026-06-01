const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright-core");
const qrcode = require("qrcode-generator");
const { SHARE_KIT_RULES, siteUrl } = require("./seo-content.cjs");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "reports", "campaign-kit");
const posterDir = path.join(outDir, "posters");
const generatedAt = new Date().toISOString();
const screenshotPath = path.join(root, "assets", "images", "free-pdf-tools-screenshot.png");

const campaigns = [
  {
    id: "pdf-under-1mb",
    title: "Compress PDF to 1MB",
    pathName: "compress-pdf-to-1mb",
    pain: "Portal says your PDF must be under 1MB?",
    target: "Job, school, email, and application portal uploads",
    proof: "Best for scanned or image-heavy PDFs. Users still need to review the output.",
    demoSteps: ["Open the 1MB PDF compressor", "Choose a PDF locally in the browser", "Download a smaller copy", "Try a lower quality setting if needed"],
    captionEn: "PDF upload blocked by a 1MB limit? This free no-upload tool tries to compress scans and image-heavy PDFs in your browser.",
    captionZh: "表格要求 PDF 小于 1MB？这个免费工具在浏览器里压缩，不用上传文件，适合扫描件和图片型 PDF，下载前记得检查效果。",
    hashtags: ["#PDFTools", "#FileUpload", "#NoSignup", "#JobSearch", "#StudentTools"],
  },
  {
    id: "pdf-under-500kb",
    title: "Compress PDF to 500KB",
    pathName: "compress-pdf-to-500kb",
    pain: "Government-style form rejects PDFs over 500KB?",
    target: "Strict file-size portals and form uploads",
    proof: "A 500KB target may require visible quality loss. Keep the wording honest.",
    demoSteps: ["Open the 500KB landing page", "Select a scanned PDF", "Use stronger compression", "Compare before submitting"],
    captionEn: "When a form asks for a tiny 500KB PDF, use a no-upload compressor and check the result before submitting.",
    captionZh: "遇到 500KB 的 PDF 上传限制，可以先用这个无上传压缩工具试一下。压得越小画质可能越差，提交前一定检查。",
    hashtags: ["#PDFCompressor", "#UploadLimit", "#NoUpload", "#FormHelp", "#FreeTools"],
  },
  {
    id: "image-under-100kb",
    title: "Compress Image to 100KB",
    pathName: "compress-image-to-100kb",
    pain: "Profile photo rejected because it is over 100KB?",
    target: "Job forms, school portals, profile photos, and exam uploads",
    proof: "The original image stays local. JPG and WebP often compress best.",
    demoSteps: ["Open the 100KB image compressor", "Pick a photo", "Adjust quality if needed", "Download a smaller file"],
    captionEn: "Photo upload too large? Compress an image toward 100KB locally in the browser, without creating an account.",
    captionZh: "照片超过 100KB 被表单拒绝？这个工具可以在浏览器本地压缩，不需要注册账号，也不用上传原图。",
    hashtags: ["#ImageCompressor", "#100KB", "#ProfilePhoto", "#NoSignup", "#BrowserTools"],
  },
  {
    id: "image-under-50kb",
    title: "Compress Image to 50KB",
    pathName: "compress-image-to-50kb",
    pain: "Tiny photo limit: 50KB or less?",
    target: "Strict ID, exam, and lightweight profile-image uploads",
    proof: "A 50KB target can require resizing and stronger compression.",
    demoSteps: ["Open the 50KB image compressor", "Select an image", "Let the tool try smaller quality", "Check the final preview"],
    captionEn: "Need a very small 50KB image? Try browser-local compression and review the preview before uploading it anywhere.",
    captionZh: "如果系统要求图片小于 50KB，可以先用这个本地压缩工具试一下。50KB 很小，预览确认后再提交。",
    hashtags: ["#50KB", "#ImageTools", "#UploadFix", "#NoUpload", "#FreeUtility"],
  },
  {
    id: "pdf-to-jpg-no-upload",
    title: "PDF to JPG Without Upload",
    pathName: "pdf-to-jpg-no-upload",
    pain: "The form accepts images but rejects your PDF?",
    target: "PDF-to-image conversion for forms, previews, and thumbnails",
    proof: "Useful when a page needs an image file instead of a PDF.",
    demoSteps: ["Open the PDF-to-JPG tool", "Choose a PDF locally", "Convert pages to images", "Download the page images"],
    captionEn: "If a form rejects PDF but accepts JPG, convert PDF pages to images locally in the browser.",
    captionZh: "有些表单不要 PDF、只收 JPG。这个工具可以在浏览器里把 PDF 页面转成图片，不用上传文件。",
    hashtags: ["#PDFToJPG", "#NoUpload", "#FileConverter", "#FormHelp", "#FreeTools"],
  },
  {
    id: "background-removal",
    title: "Remove Background Without Upload",
    pathName: "remove-background-no-upload",
    pain: "Need a transparent PNG for a product, logo, or signature scan?",
    target: "Simple white, solid, and near-solid image backgrounds",
    proof: "Not an AI portrait cutout. It is best for simple backgrounds.",
    demoSteps: ["Open the background remover", "Choose a simple-background image", "Tune tolerance", "Export a transparent PNG"],
    captionEn: "For simple white or solid backgrounds, remove the background locally and export a transparent PNG.",
    captionZh: "白底商品图、Logo 或签名扫描件，可以试试这个本地去背景工具。它适合简单背景，不是人像精修工具。",
    hashtags: ["#TransparentPNG", "#BackgroundRemover", "#ProductPhoto", "#NoUpload", "#DesignTools"],
  },
];

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});

async function main() {
  fs.mkdirSync(posterDir, { recursive: true });
  const prepared = campaigns.map((campaign, index) => prepareCampaign(campaign, index));

  writeUtf8(path.join(outDir, "campaigns.json"), `${JSON.stringify({
    generatedAt,
    site: siteUrl(""),
    campaign: "zero_cost_push",
    purpose: "Get real visits, downloads, and search discovery before paid ads or paid features.",
    manualAccountsNeeded: ["Bilibili", "Douyin", "TikTok or YouTube Shorts", "one relevant community account if allowed"],
    rules: SHARE_KIT_RULES,
    campaigns: prepared,
  }, null, 2)}\n`);
  writeUtf8Bom(path.join(outDir, "runbook.md"), renderRunbook(prepared));
  writeUtf8Bom(path.join(outDir, "platform-posts.md"), renderPlatformPosts(prepared));
  writeUtf8Bom(path.join(outDir, "posting-calendar.csv"), renderCalendar(prepared));
  writeUtf8Bom(path.join(outDir, "community-replies.md"), renderCommunityReplies(prepared));
  writeUtf8(path.join(outDir, "validation-gates.json"), `${JSON.stringify(renderGates(prepared), null, 2)}\n`);

  await renderPosters(prepared);
  console.log(`Campaign kit generated in ${path.relative(root, outDir)}`);
  console.log(`Campaigns: ${prepared.length}`);
}

function prepareCampaign(campaign, index) {
  const source = index % 2 === 0 ? "short-video" : "community";
  const trackedUrl = `${siteUrl(campaign.pathName).replace(/\/$/, "")}?utm_source=${source}&utm_medium=organic&utm_campaign=zero_cost_push&utm_content=${campaign.id}`;
  const displayUrl = siteUrl(campaign.pathName).replace(/^https?:\/\//, "").replace(/\/$/, "");
  return {
    ...campaign,
    trackedUrl,
    displayUrl,
    source,
    posterHtml: `posters/${campaign.id}.html`,
    posterPng: `posters/${campaign.id}.png`,
    videoOutline: [
      `0-2s: Show the pain: ${campaign.pain}`,
      "2-5s: Show the file-size or format rejection as generic sample text.",
      `5-11s: ${campaign.demoSteps.slice(0, 3).join(" -> ")}.`,
      "11-16s: Show the downloaded result and remind users to review it.",
      `16-20s: CTA: ${campaign.title}.`,
    ],
    communityReply: [
      `If your issue is specifically "${campaign.pain.replace(/\?$/, "")}", this free browser tool may help: ${trackedUrl}`,
      campaign.proof,
      "No signup is needed. Do not upload private IDs or payment documents in public examples.",
    ].join(" "),
  };
}

async function renderPosters(prepared) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 720, height: 1280 }, deviceScaleFactor: 1 });
  for (const campaign of prepared) {
    const htmlPath = path.join(outDir, campaign.posterHtml);
    writeUtf8(htmlPath, renderPosterHtml(campaign));
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(outDir, campaign.posterPng), fullPage: true });
  }
  await browser.close();
}

function renderPosterHtml(campaign) {
  const qrSvg = makeQrSvg(campaign.trackedUrl);
  const screenshotSrc = path.relative(path.join(outDir, "posters"), screenshotPath).replace(/\\/g, "/");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(campaign.title)}</title>
<style>
* { box-sizing: border-box; }
body {
  margin: 0;
  width: 720px;
  min-height: 1280px;
  font-family: Inter, Arial, sans-serif;
  color: #182226;
  background: #f7f4ea;
}
.poster {
  min-height: 1280px;
  padding: 44px;
  display: grid;
  grid-template-rows: auto auto 1fr auto;
  gap: 28px;
  border-top: 22px solid #0d6b70;
}
.brand {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 25px;
  font-weight: 800;
}
.tag {
  padding: 10px 16px;
  border: 2px solid #182226;
  background: #f3c64d;
  font-size: 18px;
  font-weight: 800;
}
h1 {
  margin: 0;
  max-width: 640px;
  font-size: 70px;
  line-height: 0.98;
  letter-spacing: 0;
}
.pain {
  margin: 0;
  font-size: 31px;
  line-height: 1.16;
  color: #9c3f32;
  font-weight: 800;
}
.screen {
  width: 100%;
  border: 3px solid #182226;
  background: #ffffff;
  padding: 12px;
  box-shadow: 14px 14px 0 #0d6b70;
}
.screen img {
  display: block;
  width: 100%;
  height: 328px;
  object-fit: cover;
  object-position: top left;
}
.steps {
  display: grid;
  gap: 13px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.steps li {
  padding: 15px 18px;
  border: 2px solid #182226;
  background: #fffdf7;
  font-size: 24px;
  font-weight: 800;
}
.foot {
  display: grid;
  grid-template-columns: 1fr 158px;
  gap: 22px;
  align-items: end;
}
.url {
  font-size: 21px;
  line-height: 1.25;
  font-weight: 800;
  overflow-wrap: anywhere;
}
.note {
  margin-top: 12px;
  font-size: 17px;
  line-height: 1.25;
  color: #4b5a5c;
}
.qr {
  border: 3px solid #182226;
  background: #fff;
  padding: 9px;
}
.qr svg {
  width: 136px;
  height: 136px;
  display: block;
}
</style>
</head>
<body>
<main class="poster">
  <div class="brand"><span>PrintableTools Lab</span><span class="tag">Free / No signup</span></div>
  <section>
    <h1>${escapeHtml(campaign.title)}</h1>
    <p class="pain">${escapeHtml(campaign.pain)}</p>
  </section>
  <section>
    <div class="screen"><img src="${escapeHtml(screenshotSrc)}" alt="PrintableTools Lab screenshot"></div>
    <ul class="steps">
      ${campaign.demoSteps.slice(0, 3).map((step) => `<li>${escapeHtml(step)}</li>`).join("\n      ")}
    </ul>
  </section>
  <section class="foot">
    <div>
      <div class="url">${escapeHtml(campaign.displayUrl)}</div>
      <div class="note">${escapeHtml(campaign.proof)}</div>
    </div>
    <div class="qr">${qrSvg}</div>
  </section>
</main>
</body>
</html>`;
}

function renderRunbook(prepared) {
  return [
    "# Zero-cost Distribution Runbook",
    "",
    `Generated: ${generatedAt}`,
    "",
    "## Purpose",
    "",
    "Use the existing no-signup tools to get real traffic, downloads, and Search Console signals before paid ads or paid features. This is distribution work, not an ad-click scheme.",
    "",
    "## What Is Ready",
    "",
    "- Six high-intent campaigns.",
    "- English captions for global short-video platforms.",
    "- Chinese captions for Bilibili and Douyin posting.",
    "- Community replies that only fit real user questions.",
    "- UTM links for separating short-video and community tests.",
    "- Vertical 9:16 poster images in `posters/`.",
    "",
    "## Accounts Needed",
    "",
    "- Bilibili or Douyin account for Chinese distribution.",
    "- TikTok, YouTube Shorts, Instagram Reels, or similar account for global distribution.",
    "- One relevant community account only if self-promotion is allowed and the reply directly solves a user's problem.",
    "",
    "## Safe Posting Rules",
    "",
    ...SHARE_KIT_RULES.map((rule) => `- ${rule}`),
    "",
    "## First 24 Hours",
    "",
    "1. Publish one PDF upload-limit short video using `pdf-under-1mb`.",
    "2. Publish one image upload-limit short video using `image-under-100kb`.",
    "3. Do one useful community reply only if someone has asked about the exact file-size or format problem.",
    "4. Run `npm.cmd run validate:ops` after posting to check whether UTM traffic or downloads moved.",
    "",
    "## Campaigns",
    "",
    ...prepared.flatMap((campaign) => [
      `### ${campaign.title}`,
      "",
      `- Pain: ${campaign.pain}`,
      `- Target: ${campaign.target}`,
      `- Link: ${campaign.trackedUrl}`,
      `- Poster: ${campaign.posterPng}`,
      `- English caption: ${campaign.captionEn}`,
      `- Chinese caption: ${campaign.captionZh}`,
      `- Hashtags: ${campaign.hashtags.join(" ")}`,
      "",
    ]),
  ].join("\n");
}

function renderPlatformPosts(prepared) {
  return [
    "# Platform Posts",
    "",
    `Generated: ${generatedAt}`,
    "",
    ...prepared.flatMap((campaign) => [
      `## ${campaign.title}`,
      "",
      "### TikTok / YouTube Shorts / Instagram Reels",
      "",
      `Hook: ${campaign.pain}`,
      "",
      "Shot list:",
      "",
      ...campaign.videoOutline.map((line) => `- ${line}`),
      "",
      `Caption: ${campaign.captionEn}`,
      "",
      `Link: ${campaign.trackedUrl}`,
      "",
      `Hashtags: ${campaign.hashtags.join(" ")}`,
      "",
      "### Bilibili / Douyin",
      "",
      `标题: ${campaign.title} - 免费无上传工具`,
      "",
      `文案: ${campaign.captionZh}`,
      "",
      `链接: ${campaign.trackedUrl}`,
      "",
      "注意: 不要说保证压缩成功，不要诱导用户点击广告，不要展示真实身份证、银行卡、简历或私密文件。",
      "",
    ]),
  ].join("\n");
}

function renderCommunityReplies(prepared) {
  return [
    "# Community Replies",
    "",
    `Generated: ${generatedAt}`,
    "",
    "Use these only when the original post asks for the exact problem. Do not cold-post them into unrelated communities.",
    "",
    ...prepared.flatMap((campaign) => [
      `## ${campaign.title}`,
      "",
      campaign.communityReply,
      "",
    ]),
  ].join("\n");
}

function renderCalendar(prepared) {
  const rows = [["day", "slot", "campaign_id", "channel", "asset", "tracked_url", "success_signal"]];
  prepared.forEach((campaign, index) => {
    const day = index < 2 ? 1 : index < 4 ? 2 : 3;
    rows.push([
      String(day),
      index % 2 === 0 ? "short-video" : "community",
      campaign.id,
      index % 2 === 0 ? "Bilibili/Douyin/TikTok/Shorts" : "Relevant community reply",
      campaign.posterPng,
      campaign.trackedUrl,
      index % 2 === 0 ? "one tracked visit or one tool use" : "one relevant reply without moderation removal",
    ]);
  });
  rows.push(["7", "review", "all", "Validation report", "reports/validation-report.json", siteUrl("dashboard"), "continue if UTM visits or downloads moved"]);
  return rows.map((row) => row.map(csvCell).join(",")).join("\n") + "\n";
}

function renderGates(prepared) {
  return {
    generatedAt,
    campaign: "zero_cost_push",
    gates: [
      {
        checkpoint: "24 hours after first post",
        continueIf: ["At least 1 tracked UTM visit", "or at least 1 tool generation/download"],
        actionIfMissed: "Change hook wording and publish the image-under-100kb campaign.",
      },
      {
        checkpoint: "72 hours",
        continueIf: ["At least 10 tracked UTM visits", "or at least 3 tool generations/downloads", "or one useful external comment remains live"],
        actionIfMissed: "Stop posting generic tool-pack messages; only post exact upload-limit fixes.",
      },
      {
        checkpoint: "7 days",
        continueIf: ["30 tracked UTM visits", "or 10 tool generations/downloads", "or Search Console impressions start moving"],
        actionIfMissed: "Do not add more tools. Rework titles, covers, and external examples.",
      },
    ],
    inspectWith: ["npm.cmd run validate:ops", "reports/validation-report.json", "reports/campaign-kit/posting-calendar.csv"],
    campaigns: prepared.map((campaign) => ({
      id: campaign.id,
      title: campaign.title,
      trackedUrl: campaign.trackedUrl,
      poster: campaign.posterPng,
    })),
  };
}

function makeQrSvg(value) {
  const qr = qrcode(0, "M");
  qr.addData(value);
  qr.make();
  return qr.createSvgTag(4, 1).replace("<svg", "<svg aria-label=\"tracked campaign link\"");
}

function writeUtf8(filePath, content) {
  fs.writeFileSync(filePath, content, "utf8");
}

function writeUtf8Bom(filePath, content) {
  fs.writeFileSync(filePath, `\ufeff${content}`, "utf8");
}

function csvCell(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
