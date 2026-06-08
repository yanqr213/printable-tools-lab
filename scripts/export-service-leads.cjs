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
    console.error("Missing Cloudflare API token. Service lead export was not attempted.");
    process.exit(2);
  }

  const indexKey = `service:lead_index:${month}`;
  const rows = readKvJson(indexKey, [], token);
  const indexedLeads = rows.map((row) => readKvJson(`service:lead:${row.id}`, row, token));
  const orphanLeads = readLeadKeys(token)
    .map((key) => readKvJson(key.name || key, null, token))
    .filter((lead) => lead && String(lead.createdAt || "").startsWith(month));
  const leads = mergeLeads(indexedLeads, orphanLeads);
  fs.mkdirSync(reportsDir, { recursive: true });
  const jsonPath = path.join(reportsDir, `service-leads-${month}.json`);
  const csvPath = path.join(reportsDir, `service-leads-${month}.csv`);
  fs.writeFileSync(jsonPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    month,
    count: leads.length,
    leads,
  }, null, 2) + "\n");
  fs.writeFileSync(csvPath, toCsv(leads));
  console.log(`Exported ${leads.length} service lead(s) to ${path.relative(root, jsonPath)} and ${path.relative(root, csvPath)}`);
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
  return runWrangler(["wrangler", "kv", "key", "get", key, "--namespace-id", namespaceId], token);
}

function readLeadKeys(token) {
  const monthPrefix = month.replace("-", "");
  const output = runWrangler(["wrangler", "kv", "key", "list", "--namespace-id", namespaceId, "--prefix", `service:lead:${monthPrefix}`], token);
  try {
    const keys = JSON.parse(String(output || "[]"));
    return Array.isArray(keys) ? keys : [];
  } catch {
    return [];
  }
}

function runWrangler(wranglerArgs, token) {
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

function mergeLeads(...groups) {
  const byId = new Map();
  for (const group of groups) {
    for (const lead of group) {
      const id = lead?.id || `${lead?.createdAt || ""}:${lead?.contact || ""}:${lead?.serviceType || ""}`;
      if (!id || id === "::") continue;
      byId.set(id, { ...(byId.get(id) || {}), ...lead });
    }
  }
  return [...byId.values()].sort((a, b) => String(a.createdAt || "").localeCompare(String(b.createdAt || "")));
}

function toCsv(leads) {
  const headers = ["createdAt", "serviceType", "serviceLabel", "businessName", "contact", "requestSummary", "needBy", "source", "utmSource", "utmMedium", "utmCampaign", "utmContent", "path"];
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
