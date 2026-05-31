const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = path.resolve(__dirname, "..");
const SITE_URL = normalizeSiteUrl(process.env.SEARCH_CONSOLE_SITE_URL || process.env.PUBLIC_SITE_URL || "https://printable-tools-lab.pages.dev/");
const KEY_FILE = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.argv[3];
const COMMAND = process.argv[2] || "verify-file";
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID || "967823041457";
const SCOPE = COMMAND === "enable-api"
  ? "https://www.googleapis.com/auth/cloud-platform"
  : "https://www.googleapis.com/auth/siteverification";

if (!KEY_FILE) {
  console.error("Set GOOGLE_APPLICATION_CREDENTIALS or pass the service account JSON path as the last argument.");
  process.exit(1);
}

async function main() {
  const token = await getAccessToken(KEY_FILE, SCOPE);
  if (COMMAND === "enable-api") return enableSiteVerificationApi(token);
  if (COMMAND === "token") return createFileToken(token);
  if (COMMAND === "list") return listVerifiedResources(token);
  if (COMMAND === "claim") return claimFileVerification(token);
  if (COMMAND === "verify-file") {
    const verification = await createFileToken(token);
    console.log(`Wrote verification file: ${verification.fileName}`);
    console.log("Deploy the new verification file, then run: npm.cmd run site-verification -- claim");
    return;
  }
  throw new Error(`Unknown command: ${COMMAND}`);
}

async function enableSiteVerificationApi(accessToken) {
  const url = `https://serviceusage.googleapis.com/v1/projects/${PROJECT_ID}/services/siteverification.googleapis.com:enable`;
  const response = await googleFetch(url, accessToken, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  console.log(JSON.stringify(response, null, 2));
  return response;
}

async function createFileToken(accessToken) {
  const response = await googleFetch("https://www.googleapis.com/siteVerification/v1/token", accessToken, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      site: {
        type: "SITE",
        identifier: SITE_URL,
      },
      verificationMethod: "FILE",
    }),
  });

  const fileName = response.token;
  if (!/^google[a-zA-Z0-9_-]+\.html$/.test(fileName)) {
    throw new Error(`Unexpected FILE verification token: ${fileName}`);
  }

  const content = `google-site-verification: ${fileName}\n`;
  fs.writeFileSync(path.join(root, fileName), content);
  fs.writeFileSync(path.join(root, fileName.replace(/\.html$/, "")), content);
  return { fileName, method: response.method };
}

async function claimFileVerification(accessToken) {
  const response = await googleFetch("https://www.googleapis.com/siteVerification/v1/webResource?verificationMethod=FILE", accessToken, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      site: {
        type: "SITE",
        identifier: SITE_URL,
      },
    }),
  });
  console.log(JSON.stringify(response, null, 2));
  return response;
}

async function listVerifiedResources(accessToken) {
  const response = await googleFetch("https://www.googleapis.com/siteVerification/v1/webResource", accessToken);
  console.log(JSON.stringify(response, null, 2));
  return response;
}

async function googleFetch(url, token, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Google API ${response.status}: ${text}`);
  }
  return text ? JSON.parse(text) : {};
}

async function getAccessToken(keyFile, scope) {
  const credentials = JSON.parse(fs.readFileSync(keyFile, "utf8"));
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: credentials.client_email,
    scope,
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(credentials.private_key, "base64url");
  const assertion = `${unsigned}.${signature}`;
  const params = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  });
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Token error ${response.status}: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

function base64url(input) {
  return Buffer.from(input).toString("base64url");
}

function normalizeSiteUrl(value) {
  return `${String(value).replace(/\/+$/, "")}/`;
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
