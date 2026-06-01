const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "reports", "campaign-kit");
const requiredFiles = [
  "campaigns.json",
  "runbook.md",
  "platform-posts.md",
  "posting-calendar.csv",
  "community-replies.md",
  "validation-gates.json",
];
const failures = [];

for (const file of requiredFiles) {
  const filePath = path.join(outDir, file);
  if (!fs.existsSync(filePath)) failures.push(`Missing ${file}`);
  else if (fs.statSync(filePath).size < 200) failures.push(`${file} looks too small`);
}

const campaigns = readJson("campaigns.json");
if (campaigns) {
  if (!Array.isArray(campaigns.campaigns) || campaigns.campaigns.length < 6) failures.push("campaigns.json needs at least 6 campaigns");
  for (const campaign of campaigns.campaigns || []) {
    if (!campaign.trackedUrl || !campaign.trackedUrl.includes("utm_campaign=zero_cost_push")) failures.push(`${campaign.id} missing tracked UTM URL`);
    if (!Array.isArray(campaign.videoOutline) || campaign.videoOutline.length < 5) failures.push(`${campaign.id} missing video outline`);
    if (!campaign.captionEn || !campaign.captionZh) failures.push(`${campaign.id} missing bilingual captions`);
    const pngPath = path.join(outDir, campaign.posterPng || "");
    const htmlPath = path.join(outDir, campaign.posterHtml || "");
    if (!fs.existsSync(htmlPath)) failures.push(`${campaign.id} missing poster HTML`);
    if (!fs.existsSync(pngPath)) failures.push(`${campaign.id} missing poster PNG`);
    else if (fs.statSync(pngPath).size < 15000) failures.push(`${campaign.id} poster PNG looks too small`);
  }
}

const platformPosts = readText("platform-posts.md");
if (platformPosts) {
  const forbidden = [/click\s+ads?/i, /tap\s+ads?/i, /watch\s+ads?\s+to\s+unlock/i, /guaranteed\s+compression/i, /guaranteed\s+approval/i];
  for (const pattern of forbidden) {
    if (pattern.test(platformPosts)) failures.push(`platform-posts.md includes risky phrase: ${pattern}`);
  }
}

const gates = readJson("validation-gates.json");
if (gates && (!Array.isArray(gates.gates) || gates.gates.length < 3)) failures.push("validation-gates.json needs 3 validation gates");

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Campaign kit verification passed.");

function readJson(file) {
  const filePath = path.join(outDir, file);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    failures.push(`${file} is invalid JSON: ${error.message}`);
    return null;
  }
}

function readText(file) {
  const filePath = path.join(outDir, file);
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
}
