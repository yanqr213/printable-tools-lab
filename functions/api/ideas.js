const TOOL_FIELDS = {
  "name-tracing": ["name", "subtitle"],
  "chore-chart": ["title", "names", "chores"],
  "reward-chart": ["title", "goal", "reward"],
  flashcards: ["title", "cards"],
  "weekly-planner": ["title", "focus", "notes"],
  "habit-tracker": ["title", "habits"],
  "invoice-generator": ["due", "items", "notes"],
  "rent-receipt": ["period", "method", "notes"],
  "resume-builder": ["headline", "summary", "experience", "skills", "education"],
};

const FIELD_LIMITS = {
  name: 24,
  subtitle: 70,
  title: 60,
  names: 80,
  chores: 280,
  goal: 180,
  reward: 80,
  cards: 420,
  focus: 90,
  notes: 180,
  habits: 220,
  business: 140,
  client: 140,
  invoiceNo: 36,
  date: 32,
  due: 42,
  items: 420,
  receivedFrom: 70,
  landlord: 70,
  property: 140,
  amount: 24,
  period: 70,
  paidDate: 32,
  method: 50,
  headline: 90,
  summary: 360,
  experience: 620,
  skills: 260,
  education: 180,
};

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    const tool = sanitizeTool(body.tool);
    if (!tool) return json({ error: "Unsupported tool" }, 400);

    const baseUrl = String(env.AI_BASE_URL || "").replace(/\/+$/, "");
    const apiKey = env.AI_API_KEY;
    const model = env.AI_MODEL || "gpt-5.4-mini";
    if (!baseUrl || !apiKey) {
      return json({ error: "Idea helper is not configured" }, 503);
    }

    const values = sanitizeValues(tool, body.values || {});
    let suggestions = [];
    try {
      const result = await callIdeaModel({ baseUrl, apiKey, model, tool, values });
      suggestions = normalizeSuggestions(tool, result);
    } catch (error) {
      suggestions = fallbackSuggestions(tool, values);
    }
    if (!suggestions.length) return json({ error: "No printable ideas returned" }, 502);
    return json({ suggestions });
  } catch (error) {
    return json({ error: "Idea helper failed" }, 500);
  }
}

function fallbackSuggestions(tool, values) {
  const fallback = {
    "invoice-generator": [
      {
        title: "Freelance project invoice",
        summary: "A clean service invoice for one project",
        fields: {
          due: values.due || "Due on receipt",
          items: "Project work | 1 | 350\nRevision support | 2 | 45\nAdmin and handoff | 1 | 60",
          notes: "Thank you for your business. Please include the invoice number with payment.",
        },
      },
      {
        title: "Consulting invoice",
        summary: "Short terms and itemized consulting hours",
        fields: {
          due: "Net 7",
          items: "Consulting session | 2 | 150\nResearch and preparation | 1 | 120\nSummary notes | 1 | 40",
          notes: "Payment is appreciated within the listed terms.",
        },
      },
      {
        title: "Small business service invoice",
        summary: "Simple item list for a local service job",
        fields: {
          due: "Due within 14 days",
          items: "Service visit | 1 | 95\nMaterials | 1 | 40\nFollow-up support | 1 | 30",
          notes: "Please review the details and contact us with any questions.",
        },
      },
    ],
    "rent-receipt": [
      {
        title: "Monthly rent receipt",
        summary: "Standard monthly rent payment record",
        fields: {
          period: values.period || "Monthly rent",
          method: values.method || "Bank transfer",
          notes: "Payment received for the rental period listed above.",
        },
      },
      {
        title: "Cash payment receipt",
        summary: "A receipt note for in-person payment",
        fields: {
          period: "Current rental period",
          method: "Cash",
          notes: "Cash payment received. Keep a signed copy for both parties.",
        },
      },
      {
        title: "Room rental receipt",
        summary: "Short receipt wording for a shared home or room rental",
        fields: {
          period: "Room rental payment",
          method: "Electronic transfer",
          notes: "Receipt issued for the room rental payment described above.",
        },
      },
    ],
    "resume-builder": [
      {
        title: "Operations resume",
        summary: "Clear wording for coordination and admin roles",
        fields: {
          headline: values.headline || "Operations Coordinator",
          summary: "Organized professional with experience coordinating schedules, documentation, vendors, and team workflows.",
          experience: "Operations Coordinator | Company | Coordinated weekly schedules and improved handoff reliability.\nAdministrative Assistant | Company | Managed calendars, invoices, records, and client follow-ups.",
          skills: "Scheduling, documentation, spreadsheets, vendor coordination, customer support",
          education: values.education || "Education or certification",
        },
      },
      {
        title: "Customer support resume",
        summary: "Readable resume text for service roles",
        fields: {
          headline: "Customer Support Specialist",
          summary: "Customer-focused professional with experience resolving requests, documenting issues, and supporting repeatable service processes.",
          experience: "Customer Support Specialist | Company | Resolved customer requests and documented common issues for the team.\nService Associate | Company | Assisted customers, tracked follow-ups, and maintained accurate records.",
          skills: "Customer support, email support, issue tracking, documentation, communication",
          education: values.education || "Education or certification",
        },
      },
      {
        title: "Entry-level resume",
        summary: "Simple wording for early career applications",
        fields: {
          headline: "Entry-Level Administrative Assistant",
          summary: "Reliable early-career candidate with strong organization, communication, and follow-through skills.",
          experience: "Team Project | School or Volunteer Role | Coordinated tasks, tracked deadlines, and prepared shared notes.\nPart-Time Role | Organization | Supported customers and maintained accurate daily records.",
          skills: "Organization, communication, spreadsheets, scheduling, attention to detail",
          education: values.education || "Education or certification",
        },
      },
    ],
  };
  return normalizeSuggestions(tool, { suggestions: fallback[tool] || [] });
}

export function onRequestGet() {
  return json({ ok: true, service: "PrintableTools Lab idea helper" });
}

async function callIdeaModel({ baseUrl, apiKey, model, tool, values }) {
  const privacyNote = tool === "resume-builder"
    ? "Do not invent addresses, phone numbers, schools, dates, employers, or credentials. Improve generic wording only."
    : "Do not invent sensitive personal details. Keep placeholders generic when needed.";
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.55,
      max_tokens: 900,
      messages: [
        {
          role: "system",
          content: [
            "You generate safe, original, printer-friendly text for a printable PDF tool.",
            "Return JSON only. No markdown. No brand names, celebrities, copyrighted characters, medical claims, or sensitive personal data.",
            "Use concise English that parents, teachers, tutors, and homeschool families can print immediately.",
          ].join(" "),
        },
        {
          role: "user",
          content: JSON.stringify({
            task: "Create 3 alternatives for the current printable tool.",
            tool,
            currentValues: values,
            allowedFields: TOOL_FIELDS[tool],
            privacyNote,
            schema: {
              suggestions: [
                {
                  title: "short label",
                  summary: "one short printable use case",
                  fields: "object containing only allowedFields; never include private contact, client, tenant, landlord, property, or payment account data",
                },
              ],
            },
          }),
        },
      ],
    }),
  });
  if (!response.ok) throw new Error("Model request failed");
  const payload = await response.json();
  return parseJson(payload?.choices?.[0]?.message?.content || "");
}

function sanitizeTool(tool) {
  const value = String(tool || "").trim();
  return Object.prototype.hasOwnProperty.call(TOOL_FIELDS, value) ? value : "";
}

function sanitizeValues(tool, values) {
  const allowed = TOOL_FIELDS[tool];
  return allowed.reduce((acc, field) => {
    const limit = FIELD_LIMITS[field] || 160;
    acc[field] = cleanText(values[field], limit);
    return acc;
  }, {});
}

function normalizeSuggestions(tool, result) {
  const allowed = TOOL_FIELDS[tool];
  const raw = Array.isArray(result?.suggestions) ? result.suggestions : [];
  return raw
    .map((item, index) => {
      const fields = {};
      for (const field of allowed) {
        if (item?.fields && item.fields[field] != null) {
          fields[field] = cleanText(item.fields[field], FIELD_LIMITS[field] || 160);
        }
      }
      return {
        title: cleanText(item?.title || `Printable idea ${index + 1}`, 48),
        summary: cleanText(item?.summary || "", 96),
        fields,
      };
    })
    .filter((item) => Object.keys(item.fields).length > 0)
    .slice(0, 3);
}

function parseJson(content) {
  const text = String(content || "").trim();
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(text.slice(start, end + 1));
    throw new Error("Invalid JSON");
  }
}

function cleanText(value, maxLength) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, maxLength);
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
