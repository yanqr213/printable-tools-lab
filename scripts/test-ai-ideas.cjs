const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourcePath = path.join(root, "functions", "api", "ideas.js");
let source = fs.readFileSync(sourcePath, "utf8");

source = source.replace(/export async function onRequestPost/, "async function onRequestPost");
source = source.replace(/export function onRequestGet/, "function onRequestGet");
source += "\nreturn { onRequestPost, onRequestGet };\n";

async function main() {
  const calls = [];
  const previousFetch = global.fetch;
  global.fetch = async (url, init) => {
    calls.push({ url, body: JSON.parse(init.body) });
    return new Response(JSON.stringify({
      choices: [{
        message: {
          content: JSON.stringify({
            suggestions: [
              {
                title: "Consulting invoice",
                summary: "A simple invoice for project services",
                fields: {
                  business: "Bright Studio",
                  client: "Client Name",
                  invoiceNo: "INV-002",
                  due: "Net 7",
                  items: "Consulting session | 2 | 150\nProject notes | 1 | 75",
                  notes: "Thank you for your business.",
                  chores: "This field should be removed",
                },
              },
            ],
          }),
        },
      }],
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  };

  const { onRequestPost, onRequestGet } = new Function(source)();
  const response = await onRequestPost({
    request: new Request("https://example.test/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tool: "invoice-generator",
        values: {
          business: "Bright Studio",
          client: "Client Name",
          items: "Design work | 1 | 350",
          ignored: "must not pass through",
        },
      }),
    }),
    env: {
      AI_BASE_URL: "https://ai.example.test/v1",
      AI_API_KEY: "test-key",
      AI_MODEL: "test-model",
    },
  });

  const payload = await response.json();
  assert(response.status === 200, "AI helper should return 200");
  assert(payload.suggestions.length === 1, "AI helper should normalize suggestions");
  assert(payload.suggestions[0].fields.items.includes("Consulting session"), "AI helper should include generated fields");
  assert(payload.suggestions[0].fields.business === undefined, "AI helper should reject private invoice fields");
  assert(payload.suggestions[0].fields.client === undefined, "AI helper should reject private client fields");
  assert(payload.suggestions[0].fields.chores === undefined, "AI helper should reject fields that do not belong to the tool");
  const promptPayload = JSON.parse(calls[0].body.messages[1].content);
  assert(!Object.prototype.hasOwnProperty.call(promptPayload.currentValues, "ignored"), "Prompt should only include allowed fields");
  assert(promptPayload.allowedFields.includes("items"), "Prompt should include invoice fields");
  assert(calls[0].body.model === "test-model", "AI helper should use configured model");

  const status = await onRequestGet();
  const statusPayload = await status.json();
  assert(statusPayload.ok === true, "GET health endpoint should work");

  global.fetch = async () => {
    throw new Error("network unavailable");
  };
  const fallbackResponse = await onRequestPost({
    request: new Request("https://example.test/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tool: "resume-builder",
        values: {
          headline: "Operations Coordinator",
          summary: "Organized professional",
        },
      }),
    }),
    env: {
      AI_BASE_URL: "https://ai.example.test/v1",
      AI_API_KEY: "test-key",
      AI_MODEL: "test-model",
    },
  });
  const fallbackPayload = await fallbackResponse.json();
  assert(fallbackResponse.status === 200, "AI helper should fall back when model request fails");
  assert(fallbackPayload.suggestions.length === 3, "Fallback should return useful suggestions");

  const estimateFallback = await onRequestPost({
    request: new Request("https://example.test/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tool: "estimate-generator",
        values: {
          due: "Valid for 14 days",
          items: "Labor | 2 | 80",
        },
      }),
    }),
    env: {
      AI_BASE_URL: "https://ai.example.test/v1",
      AI_API_KEY: "test-key",
      AI_MODEL: "test-model",
    },
  });
  const estimatePayload = await estimateFallback.json();
  assert(estimatePayload.suggestions.length === 3, "New business document tools should have fallback ideas");
  global.fetch = previousFetch;
  console.log("AI helper test passed.");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
