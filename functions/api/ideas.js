const TOOL_FIELDS = {
  "name-tracing": ["name", "subtitle"],
  "chore-chart": ["title", "names", "chores"],
  "reward-chart": ["title", "goal", "reward"],
  flashcards: ["title", "cards"],
  "weekly-planner": ["title", "focus", "notes"],
  "habit-tracker": ["title", "habits"],
  "invoice-generator": ["due", "items", "notes"],
  "estimate-generator": ["due", "items", "notes"],
  "purchase-order": ["due", "items", "notes"],
  "bill-of-sale": ["due", "items", "notes"],
  "rent-receipt": ["period", "method", "notes"],
  "resume-builder": ["headline", "summary", "experience", "skills", "education"],
  "cover-letter": ["role", "company", "opening", "strengths", "closing"],
  "resignation-letter": ["role", "company", "lastDay", "tone", "appreciation", "handoff"],
  "monthly-calendar": ["title", "month", "year", "notes"],
  "meal-planner": ["title", "meals", "grocery", "notes"],
  "sign-in-sheet": ["title", "event", "date", "notes"],
  "packing-list": ["title", "destination", "sections", "notes"],
  "text-to-pdf": ["title", "body"],
  "receipt-generator": ["description", "notes"],
  "timesheet-generator": ["period", "rows", "notes"],
  "certificate-generator": ["title", "reason", "signer"],
  "todo-list": ["title", "sections", "notes"],
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
  role: 90,
  company: 90,
  opening: 360,
  strengths: 520,
  closing: 320,
  lastDay: 42,
  tone: 32,
  appreciation: 260,
  handoff: 260,
  year: 4,
  month: 16,
  meals: 620,
  grocery: 420,
  event: 90,
  destination: 90,
  sections: 680,
  body: 1800,
  description: 220,
  rows: 760,
  reason: 220,
  signer: 70,
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
    "estimate-generator": [
      {
        title: "Home service estimate",
        summary: "A clear estimate for local service work",
        fields: {
          due: values.due || "Valid for 14 days",
          items: "Site visit | 1 | 0\nLabor estimate | 4 | 85\nMaterials allowance | 1 | 120",
          notes: "This estimate is based on the scope currently described and may change if the scope changes.",
        },
      },
      {
        title: "Freelance project quote",
        summary: "Project quote wording for creative or consulting work",
        fields: {
          due: "Valid for 30 days",
          items: "Discovery and planning | 1 | 150\nProject delivery | 1 | 650\nRevision round | 1 | 120",
          notes: "Approval of this estimate confirms the listed scope only.",
        },
      },
      {
        title: "Repair estimate",
        summary: "Simple repair quote with labor and parts",
        fields: {
          due: "Valid while parts pricing is available",
          items: "Diagnostic review | 1 | 45\nLabor | 2 | 75\nParts estimate | 1 | 90",
          notes: "Final cost may change after inspection or parts confirmation.",
        },
      },
    ],
    "purchase-order": [
      {
        title: "Office supply PO",
        summary: "Purchase order for supplies and delivery",
        fields: {
          due: values.due || "Requested delivery: next available date",
          items: "Office supplies | 1 | 125\nDelivery | 1 | 18\nSetup or handling | 1 | 25",
          notes: "Please reference this purchase order on the invoice.",
        },
      },
      {
        title: "Vendor service PO",
        summary: "Purchase order for an approved service",
        fields: {
          due: "Service window to be confirmed",
          items: "Approved service work | 1 | 500\nMaterials allowance | 1 | 150",
          notes: "Work should not exceed the listed amount without approval.",
        },
      },
      {
        title: "Project materials PO",
        summary: "Itemized materials order",
        fields: {
          due: "Deliver by project start date",
          items: "Project materials | 10 | 24\nShipping | 1 | 35\nHandling | 1 | 20",
          notes: "Notify the buyer if any item is unavailable or substituted.",
        },
      },
    ],
    "bill-of-sale": [
      {
        title: "Private item sale",
        summary: "Simple wording for a private sale record",
        fields: {
          due: values.due || "Sold as-is unless otherwise noted",
          items: "Used item, condition noted by seller | 1 | 250",
          notes: "Buyer and seller acknowledge the item and price listed above.",
        },
      },
      {
        title: "Equipment sale",
        summary: "Bill of sale for equipment or tools",
        fields: {
          due: "Seller confirms ownership to the best of their knowledge",
          items: "Used equipment, model/serial noted separately | 1 | 900",
          notes: "Record any serial number, included accessories, and visible condition before signing.",
        },
      },
      {
        title: "Furniture sale",
        summary: "Simple receipt for furniture or household item sale",
        fields: {
          due: "Final sale after pickup",
          items: "Furniture item, buyer inspected before pickup | 1 | 180",
          notes: "Buyer accepts the item in the condition observed at pickup.",
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
    "cover-letter": [
      {
        title: "Operations cover letter",
        summary: "A practical job application letter",
        fields: {
          role: values.role || "Operations Coordinator",
          company: values.company || "the company",
          opening: "I am excited to apply for the Operations Coordinator role because it matches my experience with schedules, documentation, and team coordination.",
          strengths: "In previous roles, I have helped organize busy workflows, track deadlines, communicate next steps, and keep records accurate for the team.",
          closing: "I would welcome the opportunity to discuss how my organization and follow-through can support your team.",
        },
      },
      {
        title: "Customer support cover letter",
        summary: "Clear wording for service and support roles",
        fields: {
          role: "Customer Support Specialist",
          company: values.company || "your team",
          opening: "I am applying for the Customer Support Specialist role and am interested in helping customers get clear, timely answers.",
          strengths: "My strengths include careful listening, organized follow-up, documentation, and calm communication when solving customer issues.",
          closing: "I would be glad to share how my support experience can contribute to a reliable customer experience.",
        },
      },
      {
        title: "Entry-level cover letter",
        summary: "Simple structure for early career applications",
        fields: {
          role: values.role || "Entry-Level Assistant",
          company: values.company || "your organization",
          opening: "I am interested in this role because it offers the chance to contribute, learn quickly, and support a team with practical daily work.",
          strengths: "I bring strong organization, communication, attention to detail, and a willingness to learn new processes carefully.",
          closing: "Thank you for considering my application. I would appreciate the chance to discuss how I can help the team.",
        },
      },
    ],
    "resignation-letter": [
      {
        title: "Standard resignation",
        summary: "Professional notice with handoff language",
        fields: {
          role: values.role || "my position",
          company: values.company || "the company",
          lastDay: values.lastDay || "two weeks from today",
          tone: "professional",
          appreciation: "I appreciate the opportunities and support I have received during my time with the team.",
          handoff: "I will help document current work and support a smooth transition before my last day.",
        },
      },
      {
        title: "Warm resignation",
        summary: "Appreciative tone for a positive departure",
        fields: {
          role: values.role || "my position",
          company: values.company || "the company",
          lastDay: values.lastDay || "my final working day",
          tone: "warm",
          appreciation: "I am grateful for the experience, collaboration, and growth I have had while working with the team.",
          handoff: "I will do what I can to make the transition organized and helpful for the people taking over my work.",
        },
      },
      {
        title: "Brief resignation",
        summary: "Short and neutral wording",
        fields: {
          role: values.role || "my position",
          company: values.company || "the company",
          lastDay: values.lastDay || "my last working day",
          tone: "brief",
          appreciation: "Thank you for the opportunity to work with the team.",
          handoff: "I will complete current handoff tasks before my final day.",
        },
      },
    ],
    "monthly-calendar": [
      {
        title: "Family calendar",
        summary: "Appointments, school, and household reminders",
        fields: {
          title: "Family Monthly Calendar",
          month: values.month || "June",
          year: values.year || "2026",
          notes: "Appointments\nSchool events\nBills\nFamily plans",
        },
      },
      {
        title: "Student calendar",
        summary: "Study dates and deadlines",
        fields: {
          title: "Study Calendar",
          month: values.month || "June",
          year: values.year || "2026",
          notes: "Assignments\nExam dates\nStudy blocks\nProject deadlines",
        },
      },
      {
        title: "Work planning calendar",
        summary: "Simple monthly work overview",
        fields: {
          title: "Work Planning Calendar",
          month: values.month || "June",
          year: values.year || "2026",
          notes: "Meetings\nDeadlines\nFollow-ups\nAdmin tasks",
        },
      },
    ],
    "meal-planner": [
      {
        title: "Simple family meal plan",
        summary: "Balanced week with repeatable meals",
        fields: {
          title: "Weekly Family Meal Plan",
          meals: "Monday | oatmeal | leftovers | pasta\nTuesday | eggs | salad | tacos\nWednesday | yogurt | soup | stir fry\nThursday | toast | wraps | chicken rice\nFriday | smoothie | sandwiches | pizza\nSaturday | pancakes | picnic | burgers\nSunday | fruit | noodles | roast dinner",
          grocery: "Fruit\nVegetables\nEggs\nChicken or tofu\nRice or pasta\nSalad greens\nSnacks",
          notes: "Prep vegetables early in the week and keep one flexible dinner for leftovers.",
        },
      },
      {
        title: "Budget meal plan",
        summary: "Low-waste groceries and leftovers",
        fields: {
          title: "Budget Weekly Meal Plan",
          meals: "Monday | oats | rice bowl | chili\nTuesday | eggs | leftovers | pasta\nWednesday | toast | soup | fried rice\nThursday | yogurt | wraps | baked potatoes\nFriday | oatmeal | leftovers | tacos\nSaturday | pancakes | sandwiches | curry\nSunday | fruit | noodles | soup night",
          grocery: "Oats\nRice\nBeans\nEggs\nFrozen vegetables\nPotatoes\nPasta\nFruit",
          notes: "Use leftovers for lunch and repeat ingredients across meals to reduce waste.",
        },
      },
      {
        title: "Busy week meal plan",
        summary: "Fast dinners and prep notes",
        fields: {
          title: "Busy Week Meal Planner",
          meals: "Monday | yogurt | salad | sheet pan dinner\nTuesday | smoothie | wraps | tacos\nWednesday | eggs | leftovers | stir fry\nThursday | toast | soup | pasta\nFriday | oats | sandwiches | takeout backup\nSaturday | pancakes | leftovers | burgers\nSunday | fruit | noodles | batch cook",
          grocery: "Quick breakfasts\nWraps\nSalad kit\nProtein\nFrozen vegetables\nPasta\nFruit",
          notes: "Choose two prep tasks on Sunday and leave Friday flexible.",
        },
      },
    ],
    "sign-in-sheet": [
      {
        title: "Workshop sign-in",
        summary: "Simple event attendance sheet",
        fields: {
          title: "Workshop Sign-in Sheet",
          event: values.event || "Workshop",
          date: values.date || "Event date",
          notes: "Please print clearly and sign on your row.",
        },
      },
      {
        title: "Class attendance",
        summary: "Attendance wording for a class or club",
        fields: {
          title: "Class Attendance Sheet",
          event: values.event || "Class or club name",
          date: values.date || "Today",
          notes: "Mark attendance at the start of the session.",
        },
      },
      {
        title: "Visitor log",
        summary: "Front-desk visitor record wording",
        fields: {
          title: "Visitor Sign-in Sheet",
          event: values.event || "Visitor log",
          date: values.date || "Today",
          notes: "Collect only the contact details required for this visit.",
        },
      },
    ],
    "packing-list": [
      {
        title: "Weekend trip",
        summary: "Short packing list for a weekend away",
        fields: {
          title: "Weekend Packing List",
          destination: values.destination || "Weekend trip",
          sections: "Clothing: shirts, pants, socks, sleepwear\nToiletries: toothbrush, toothpaste, shampoo, sunscreen\nDocuments: ID, tickets, reservation notes\nElectronics: phone charger, headphones, power bank",
          notes: "Check weather and luggage size before packing.",
        },
      },
      {
        title: "Family vacation",
        summary: "Family trip checklist with shared items",
        fields: {
          title: "Family Vacation Packing List",
          destination: values.destination || "Family vacation",
          sections: "Kids: outfits, pajamas, comfort item, snacks\nDocuments: IDs, tickets, insurance cards, booking notes\nHealth: medicine, sunscreen, first-aid items\nTravel: chargers, headphones, entertainment, water bottles",
          notes: "Pack shared items once and keep important documents in one easy-to-reach bag.",
        },
      },
      {
        title: "Business travel",
        summary: "Work trip packing checklist",
        fields: {
          title: "Business Travel Checklist",
          destination: values.destination || "Work trip",
          sections: "Work: laptop, charger, notebook, business cards\nClothing: outfits, shoes, sleepwear, jacket\nDocuments: ID, itinerary, hotel details, meeting notes\nPersonal: toiletries, medicine, headphones, snacks",
          notes: "Confirm meeting dress code, airport timing, and charger compatibility.",
        },
      },
    ],
    "text-to-pdf": [
      {
        title: "Meeting notes PDF",
        summary: "A clean one-page meeting note",
        fields: {
          title: values.title || "Meeting Notes",
          body: "Topic:\nDecisions:\nAction items:\nOwners:\nNext check-in:",
        },
      },
      {
        title: "Short instruction sheet",
        summary: "Printable steps for a simple process",
        fields: {
          title: "Instruction Sheet",
          body: "Purpose:\nStep 1:\nStep 2:\nStep 3:\nReminder:\nContact:",
        },
      },
      {
        title: "Plain letter draft",
        summary: "Short one-page letter layout",
        fields: {
          title: "Plain Letter",
          body: "Date:\n\nRecipient:\n\nMessage:\n\nThank you,\nName",
        },
      },
    ],
    "receipt-generator": [
      {
        title: "Service payment receipt",
        summary: "Receipt wording for a completed service",
        fields: {
          description: values.description || "Service payment",
          notes: "Payment received for the item or service listed above.",
        },
      },
      {
        title: "Deposit receipt",
        summary: "Short note for a deposit record",
        fields: {
          description: "Deposit payment",
          notes: "Deposit received and applied to the listed service or order.",
        },
      },
      {
        title: "Reimbursement receipt",
        summary: "Simple reimbursement record",
        fields: {
          description: "Reimbursement payment",
          notes: "Payment issued for the approved reimbursement described above.",
        },
      },
    ],
    "timesheet-generator": [
      {
        title: "Freelance weekly hours",
        summary: "Project rows for a client timesheet",
        fields: {
          period: values.period || "Current week",
          rows: "Monday | Client project | 8 | Drafting and review\nTuesday | Client project | 7.5 | Revisions\nWednesday | Admin | 2 | Follow-up and notes\nThursday | Client project | 8 | Delivery work\nFriday | Client project | 6 | Handoff",
          notes: "Review hours before sending for approval.",
        },
      },
      {
        title: "Staff weekly log",
        summary: "Simple work log for staff approval",
        fields: {
          period: values.period || "Current pay period",
          rows: "Monday | Operations | 8 | Daily tasks\nTuesday | Operations | 8 | Customer follow-up\nWednesday | Training | 4 | Documentation\nThursday | Operations | 8 | Project support\nFriday | Operations | 7 | Weekly wrap-up",
          notes: "Manager approval:",
        },
      },
      {
        title: "Project tracking sheet",
        summary: "Hours grouped by project",
        fields: {
          period: values.period || "Project week",
          rows: "Monday | Project A | 4 | Planning\nMonday | Project B | 3 | Support\nTuesday | Project A | 6 | Build work\nWednesday | Admin | 2 | Notes\nFriday | Project B | 5 | Review",
          notes: "Use project names that match the client or internal record.",
        },
      },
    ],
    "certificate-generator": [
      {
        title: "Completion award",
        summary: "Certificate for finishing a course or challenge",
        fields: {
          title: values.title || "Certificate of Completion",
          reason: "for completing the activity with focus, effort, and steady progress",
          signer: values.signer || "Organizer",
        },
      },
      {
        title: "Participation certificate",
        summary: "Simple event participation wording",
        fields: {
          title: "Certificate of Participation",
          reason: "for participating in the workshop and contributing to the group activity",
          signer: values.signer || "Event organizer",
        },
      },
      {
        title: "Classroom award",
        summary: "Positive classroom certificate wording",
        fields: {
          title: "Classroom Award",
          reason: "for showing kindness, responsibility, and a helpful attitude",
          signer: values.signer || "Teacher",
        },
      },
    ],
    "todo-list": [
      {
        title: "Daily priorities",
        summary: "A focused task list for one day",
        fields: {
          title: values.title || "Today To Do",
          sections: "Top priorities: finish main task, send update, review calendar\nErrands: groceries, post office, return item\nFollow-up: email Sam, confirm schedule",
          notes: "Pick three tasks that matter most today.",
        },
      },
      {
        title: "Event prep checklist",
        summary: "Checklist for a small event",
        fields: {
          title: "Event Prep Checklist",
          sections: "Before event: confirm time, print signs, pack supplies\nAt venue: set up table, test equipment, place sign-in sheet\nAfter event: collect forms, send follow-up, clean up",
          notes: "Print one copy for the organizer and one for the venue bag.",
        },
      },
      {
        title: "Study session checklist",
        summary: "Short checklist for study planning",
        fields: {
          title: "Study Session Checklist",
          sections: "Prepare: choose topic, gather notes, set timer\nPractice: review examples, solve problems, mark questions\nFinish: summarize, plan next session, pack materials",
          notes: "Keep the list visible while studying.",
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
