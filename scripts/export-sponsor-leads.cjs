const fs = require("fs");
const path = require("path");
const { execFileSync, spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const reportsDir = path.join(root, "reports");
const namespaceId = readKvNamespaceId();
const month = parseMonth(process.argv.find((arg) => arg.startsWith("--month="))?.split("=")[1]) || new Date().toISOString().slice(0, 7);

main();

function main() {
  if (!namespaceId) {
    console.error("Missing PTL_EVENTS KV namespace id in wrangler.toml.");
    process.exit(2);
  }
  const token = process.env.CLOUDFLARE_API_TOKEN || process.env.CF_API_TOKEN || readUserEnv("CLOUDFLARE_API_TOKEN") || readUserEnv("CF_API_TOKEN") || readLocalSecret("cloudflare-api-token.txt");
  if (!token) {
    console.error("Missing Cloudflare API token. Sponsor lead export was not attempted.");
    process.exit(2);
  }

  const indexKey = `sponsor:lead_index:${month}`;
  const rows = readKvJson(indexKey, [], token);
  const leads = rows.map((row) => readKvJson(`sponsor:lead:${row.id}`, row, token));
  fs.mkdirSync(reportsDir, { recursive: true });
  const jsonPath = path.join(reportsDir, `sponsor-leads-${month}.json`);
  const csvPath = path.join(reportsDir, `sponsor-leads-${month}.csv`);
  fs.writeFileSync(jsonPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    month,
    count: leads.length,
    leads,
  }, null, 2) + "\n");
  fs.writeFileSync(csvPath, toCsv(leads));
  console.log(`Exported ${leads.length} sponsor lead(s) to ${path.relative(root, jsonPath)} and ${path.relative(root, csvPath)}`);
}

function readKvJson(key, fallback, token) {
  const output = runWranglerKvGet(key, token);
  const text = String(output || "").trim();
  if (!text || text === "null") return fallback;
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

function runWranglerKvGet(key, token) {
  const wranglerArgs = ["wrangler", "kv", "key", "get", key, "--namespace-id", namespaceId];
  const options = {
    cwd: root,
    env: { ...process.env, CLOUDFLARE_API_TOKEN: token },
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    shell: false,
  };
  if (process.platform === "win32") {
    return execFileSync("powershell.exe", [
      "-NoProfile",
      "-NonInteractive",
      "-ExecutionPolicy",
      "Bypass",
      "-Command",
      "$ErrorActionPreference = 'Stop'; & npx.cmd @args",
      ...wranglerArgs,
    ], options);
  }
  return execFileSync("npx", wranglerArgs, options);
}

function toCsv(leads) {
  const headers = ["createdAt", "company", "contactEmail", "website", "placement", "budgetRange", "timeline", "source", "utmSource", "utmMedium", "utmCampaign", "utmContent", "vertical", "path", "audienceFit", "notes"];
  const rows = [headers, ...leads.map((lead) => headers.map((header) => lead?.[header] || ""))];
  return rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n") + "\n";
}

function parseMonth(value) {
  const text = String(value || "").trim();
  return /^\d{4}-\d{2}$/.test(text) ? text : "";
}

function readKvNamespaceId() {
  const file = path.join(root, "wrangler.toml");
  try {
    const text = fs.readFileSync(file, "utf8");
    const match = text.match(/binding\s*=\s*"PTL_EVENTS"[\s\S]*?id\s*=\s*"([^"]+)"/);
    return match ? match[1] : "";
  } catch {
    return "";
  }
}

function readUserEnv(name) {
  if (process.platform !== "win32") return "";
  const result = spawnSync("powershell.exe", [
    "-NoProfile",
    "-Command",
    `[Environment]::GetEnvironmentVariable('${name}', 'User')`,
  ], {
    encoding: "utf8",
    shell: false,
  });
  return String(result.stdout || "").trim();
}

function readLocalSecret(fileName) {
  const base = process.env.LOCALAPPDATA
    ? path.join(process.env.LOCALAPPDATA, "Codex", "secrets")
    : path.join(process.env.HOME || root, ".codex", "secrets");
  try {
    return fs.readFileSync(path.join(base, fileName), "utf8").trim();
  } catch {
    return "";
  }
}
