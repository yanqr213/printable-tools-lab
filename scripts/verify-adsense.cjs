const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const configPath = path.join(root, "site-config.js");
const appPath = path.join(root, "app.js");
const staticUiFiles = [
  appPath,
  path.join(root, "index.html"),
  path.join(root, "site-config.js"),
];
const adsTxtPath = path.join(root, "ads.txt");
const failures = [];

const config = fs.existsSync(configPath) ? fs.readFileSync(configPath, "utf8") : "";
const app = fs.existsSync(appPath) ? fs.readFileSync(appPath, "utf8") : "";

const clientId = readString(config, "adsenseClientId");
const toolSlot = readString(config, "adsenseToolSlot");
const contentSlot = readString(config, "adsenseContentSlot");
const enableAds = readBool(config, "enableAds");

if (enableAds) {
  if (!/^ca-pub-\d{10,30}$/.test(clientId)) failures.push("enableAds is true but adsenseClientId is missing or invalid.");
  if (!app.includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js")) failures.push("AdSense script loader is missing.");
  if (!app.includes('aria-label="Advertisement"')) failures.push("Ad units should be clearly labeled as Advertisement.");
  if (!app.includes("content-adjacent only, never blocking the download button")) failures.push("Tool ad placement note is missing.");
  if (!fs.existsSync(adsTxtPath)) failures.push("ads.txt missing while AdSense is enabled.");
  else {
    const adsTxt = fs.readFileSync(adsTxtPath, "utf8").trim();
    const publisher = clientId.replace(/^ca-/, "");
    const expected = `google.com, ${publisher}, DIRECT, f08c47fec0942fa0`;
    if (adsTxt !== expected) failures.push("ads.txt does not match the configured publisher ID.");
  }
  if ((toolSlot && !/^\d{4,30}$/.test(toolSlot)) || (contentSlot && !/^\d{4,30}$/.test(contentSlot))) {
    failures.push("Configured ad slots must be numeric.");
  }
} else {
  if (clientId) failures.push("adsenseClientId should be empty when enableAds is false.");
  if (!fs.existsSync(adsTxtPath)) failures.push("ads.txt should exist with a no-sellers placeholder while AdSense is disabled.");
  else {
    const adsTxt = fs.readFileSync(adsTxtPath, "utf8").trim();
    if (adsTxt !== "# No authorized advertising sellers configured yet.") failures.push("ads.txt should contain the no-sellers placeholder while AdSense is disabled.");
  }
}

for (const file of staticUiFiles) {
  if (!fs.existsSync(file)) continue;
  const source = fs.readFileSync(file, "utf8").toLowerCase();
  if (source.includes("click ads") || source.includes("watch ads")) {
    failures.push(`${path.basename(file)} should not ask users to click or watch ads.`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`AdSense verification passed. Ads enabled: ${enableAds ? "yes" : "no"}.`);

function readString(source, key) {
  const match = source.match(new RegExp(`${key}:\\s*"([^"]*)"`));
  return match ? match[1] : "";
}

function readBool(source, key) {
  const match = source.match(new RegExp(`${key}:\\s*(true|false)`));
  return match ? match[1] === "true" : false;
}
