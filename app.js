(function () {
  "use strict";

  const SITE = {
    name: "PrintableTools Lab",
    dailyLimit: 5,
  };

  const CONFIG = Object.assign({
    siteUrl: window.location.origin,
    googleSiteVerification: "",
    googleAnalyticsId: "",
    adsenseClientId: "",
    adsenseToolSlot: "",
    adsenseContentSlot: "",
    sellerKitCheckoutUrl: "",
    serviceCheckoutUrl: "",
    auditUpgradeCheckoutUrl: "",
    contactEmail: "",
    enableAds: false,
    enableAnalytics: false,
  }, window.PTL_CONFIG || {});

  const TRAFFIC_SOURCES = new Set([
    "direct",
    "google",
    "bing",
    "github",
    "github-pages",
    "github-issue",
    "gist",
    "zearches",
    "listai",
    "techtools",
    "nosignuptools",
    "freenosignup",
    "nologin",
    "nosubscription",
    "share-kit",
    "short-video",
    "game-platform",
    "sponsor-outreach",
    "directory",
    "community",
    "referral",
    "unknown",
  ]);

  const LOCAL_SELLER_FUNNEL_TOOL_IDS = new Set([
    "invoice-generator",
    "invoice-followup-email",
    "estimate-generator",
    "purchase-order",
    "bill-of-sale",
    "rent-receipt",
    "receipt-generator",
    "timesheet-generator",
    "business-card",
    "address-labels",
    "barcode-labels",
    "price-tag",
    "flyer-maker",
    "coupon-maker",
    "packing-slip",
    "work-order",
    "inventory-sheet",
    "qr-code",
    "wifi-qr-code",
    "vcard-qr-code",
    "add-text-image",
    "watermark-image",
    "remove-background",
  ]);

  bootstrapConfiguredIntegrations();

  const AI_FIELD_ALLOWLIST = {
    "invoice-generator": ["items", "due", "notes"],
    "invoice-followup-email": ["clientLabel", "invoiceStatus", "tone", "paymentWording", "context"],
    "estimate-generator": ["items", "due", "notes"],
    "purchase-order": ["items", "due", "notes"],
    "bill-of-sale": ["items", "due", "notes"],
    "rent-receipt": ["period", "method", "notes"],
    "resume-builder": ["headline", "summary", "experience", "skills", "education"],
    "cover-letter": ["role", "company", "opening", "strengths", "closing"],
    "resignation-letter": ["role", "company", "lastDay", "tone", "appreciation", "handoff"],
    "monthly-calendar": ["title", "month", "year", "notes"],
    "meal-planner": ["title", "meals", "grocery", "notes"],
    "sign-in-sheet": ["title", "event", "date", "notes"],
    "packing-list": ["title", "destination", "sections", "notes"],
    "text-to-pdf": ["title", "body"],
    "markdown-to-pdf": ["title", "body"],
    "csv-to-pdf": ["title", "csv"],
    "json-to-pdf": ["title", "json"],
    "receipt-generator": ["description", "notes"],
    "timesheet-generator": ["period", "rows", "notes"],
    "certificate-generator": ["title", "reason", "signer"],
    "todo-list": ["title", "sections", "notes"],
    "business-card": ["role", "tagline"],
    "address-labels": [],
    "price-tag": ["title", "subtitle", "footer"],
    "flyer-maker": ["headline", "subhead", "details", "callToAction"],
    "barcode-labels": [],
    "coupon-maker": ["offer", "details", "finePrint"],
    "packing-slip": ["items", "notes"],
    "work-order": ["items", "instructions", "notes"],
    "inventory-sheet": ["items", "notes"],
  };

  const tools = {
    "name-tracing": {
      id: "name-tracing",
      icon: "Aa",
      title: "Name Tracing Worksheet Generator",
      shortTitle: "Name tracing",
      description: "Create a one-page printable name tracing worksheet for preschool practice, handwriting warmups, and take-home activities.",
      keywords: ["name tracing", "handwriting", "preschool", "worksheet"],
      defaultValues: {
        name: "Maya",
        subtitle: "Trace, write, and color your name",
        paper: "letter",
        style: "primary",
        language: "english",
      },
      fields: [
        { id: "name", label: "Name or short word", type: "text", maxLength: 24, help: "One name works best. Long names are resized to fit." },
        { id: "subtitle", label: "Small instruction line", type: "text", maxLength: 70 },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
        { id: "style", label: "Practice style", type: "select", options: [["primary", "Primary handwriting"], ["outline", "Big outline letters"], ["mixed", "Trace plus blank lines"]] },
        { id: "language", label: "Language note", type: "select", options: [["english", "English only"], ["jyutping", "Traditional Chinese + Jyutping"], ["pinyin", "Chinese + Pinyin"]] },
      ],
      draw: drawNameTracing,
    },
    "chore-chart": {
      id: "chore-chart",
      icon: "CHK",
      title: "Chore Chart Generator",
      shortTitle: "Chore chart",
      description: "Make a weekly chore chart PDF for kids, roommates, family routines, or small classroom jobs.",
      keywords: ["chore chart", "weekly planner", "kids chores", "printable"],
      defaultValues: {
        title: "Weekly Chore Chart",
        names: "Ava, Leo",
        chores: "Make bed\nFeed pet\nPack backpack\nClear dishes\nRead 20 minutes",
        paper: "letter",
        theme: "family",
      },
      fields: [
        { id: "title", label: "Chart title", type: "text", maxLength: 60 },
        { id: "names", label: "Names", type: "text", maxLength: 80, help: "Separate multiple names with commas." },
        { id: "chores", label: "Chores or jobs", type: "textarea", maxLength: 280, help: "One chore per line. The free version prints one page." },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
        { id: "theme", label: "Theme", type: "select", options: [["family", "Family"], ["classroom", "Classroom"], ["minimal", "Minimal"]] },
      ],
      draw: drawChoreChart,
    },
    "reward-chart": {
      id: "reward-chart",
      icon: "STAR",
      title: "Reward Chart Generator",
      shortTitle: "Reward chart",
      description: "Build a printable reward chart with goals, sticker boxes, and a reward note for positive behavior routines.",
      keywords: ["reward chart", "sticker chart", "behavior chart", "kids routine"],
      defaultValues: {
        title: "My Reward Chart",
        goal: "I will practice kind words and finish my bedtime routine.",
        reward: "Reward: choose a family activity",
        boxes: "20",
        paper: "letter",
        theme: "stars",
      },
      fields: [
        { id: "title", label: "Chart title", type: "text", maxLength: 58 },
        { id: "goal", label: "Goal statement", type: "textarea", maxLength: 180 },
        { id: "reward", label: "Reward note", type: "text", maxLength: 80 },
        { id: "boxes", label: "Number of boxes", type: "select", options: [["12", "12"], ["16", "16"], ["20", "20"], ["24", "24"]] },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
        { id: "theme", label: "Theme", type: "select", options: [["stars", "Stars"], ["garden", "Garden"], ["simple", "Simple"]] },
      ],
      draw: drawRewardChart,
    },
    "flashcards": {
      id: "flashcards",
      icon: "CARD",
      title: "Flashcard Generator",
      shortTitle: "Flashcards",
      description: "Create a one-page set of printable flashcards for vocabulary, classroom review, memory games, or homeschool practice.",
      keywords: ["flashcards", "vocabulary", "classroom", "printable"],
      defaultValues: {
        title: "Vocabulary Flashcards",
        cards: "apple - red fruit\nbook - reading\nsun - bright sky\nwater - drink\nhappy - feeling\ntree - plant",
        paper: "letter",
        layout: "six",
        theme: "clean",
      },
      fields: [
        { id: "title", label: "Set title", type: "text", maxLength: 58 },
        { id: "cards", label: "Cards", type: "textarea", maxLength: 420, help: "One card per line. Use word - hint if you want a smaller hint line." },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
        { id: "layout", label: "Cards per page", type: "select", options: [["six", "6 large cards"], ["eight", "8 compact cards"]] },
        { id: "theme", label: "Theme", type: "select", options: [["clean", "Clean"], ["study", "Study"], ["kids", "Kids"]] },
      ],
      draw: drawFlashcards,
    },
    "weekly-planner": {
      id: "weekly-planner",
      icon: "7",
      title: "Weekly Planner Generator",
      shortTitle: "Weekly planner",
      description: "Make a printable weekly planner PDF for family schedules, class planning, errands, and meal notes.",
      keywords: ["weekly planner", "schedule", "meal plan", "printable"],
      defaultValues: {
        title: "Weekly Planner",
        focus: "Top focus: keep the week simple",
        notes: "Meals\nErrands\nCalls\nSchool items",
        paper: "letter",
        layout: "balanced",
      },
      fields: [
        { id: "title", label: "Planner title", type: "text", maxLength: 58 },
        { id: "focus", label: "Focus line", type: "text", maxLength: 90 },
        { id: "notes", label: "Side note headings", type: "textarea", maxLength: 180, help: "One heading per line." },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
        { id: "layout", label: "Layout", type: "select", options: [["balanced", "Balanced"], ["notes", "More notes"], ["minimal", "Minimal"]] },
      ],
      draw: drawWeeklyPlanner,
    },
    "habit-tracker": {
      id: "habit-tracker",
      icon: "HAB",
      title: "Habit Tracker Generator",
      shortTitle: "Habit tracker",
      description: "Create a simple printable habit tracker for daily routines, reading goals, wellness habits, or classroom practice.",
      keywords: ["habit tracker", "routine", "goals", "printable"],
      defaultValues: {
        title: "30-Day Habit Tracker",
        habits: "Read\nWalk\nWater\nSleep routine",
        days: "30",
        paper: "letter",
        theme: "calm",
      },
      fields: [
        { id: "title", label: "Tracker title", type: "text", maxLength: 58 },
        { id: "habits", label: "Habits", type: "textarea", maxLength: 220, help: "One habit per line. Four to six habits print best." },
        { id: "days", label: "Number of days", type: "select", options: [["21", "21"], ["30", "30"], ["31", "31"]] },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
        { id: "theme", label: "Theme", type: "select", options: [["calm", "Calm"], ["bold", "Bold"], ["minimal", "Minimal"]] },
      ],
      draw: drawHabitTracker,
    },
    "invoice-generator": {
      id: "invoice-generator",
      icon: "$",
      title: "Invoice Generator",
      shortTitle: "Invoice",
      description: "Create a clean free invoice PDF for freelance work, small business services, consulting, or one-off projects.",
      keywords: ["invoice generator", "free invoice", "freelance invoice", "PDF invoice"],
      defaultValues: {
        business: "Bright Studio\nhello@example.com",
        client: "Client Name\nclient@example.com",
        invoiceNo: "INV-001",
        date: "2026-06-01",
        due: "Due on receipt",
        items: "Design work | 1 | 350\nRevision support | 2 | 45",
        currency: "USD",
        notes: "Thank you for your business.",
        paper: "letter",
      },
      fields: [
        { id: "business", label: "Your business", type: "textarea", maxLength: 140, help: "Name, email, address, or payment note. Keep private details minimal." },
        { id: "client", label: "Bill to", type: "textarea", maxLength: 140 },
        { id: "invoiceNo", label: "Invoice number", type: "text", maxLength: 36 },
        { id: "date", label: "Invoice date", type: "text", maxLength: 32 },
        { id: "due", label: "Payment terms", type: "text", maxLength: 42 },
        { id: "items", label: "Line items", type: "textarea", maxLength: 420, help: "One item per line: Description | Qty | Rate" },
        { id: "currency", label: "Currency", type: "select", options: [["USD", "USD $"], ["EUR", "EUR"], ["GBP", "GBP"], ["CAD", "CAD $"], ["AUD", "AUD $"]] },
        { id: "notes", label: "Footer note", type: "textarea", maxLength: 160 },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawInvoice,
    },
    "invoice-followup-email": {
      id: "invoice-followup-email",
      icon: "PAY",
      title: "Invoice Follow-up Email Generator",
      shortTitle: "Invoice follow-up",
      description: "Write a polite invoice reminder, due-today note, overdue follow-up, paid thank-you, or next-invoice email without uploading private invoice details.",
      keywords: ["invoice follow up email", "payment reminder email", "overdue invoice reminder", "freelance invoice wording"],
      defaultValues: {
        clientLabel: "Client",
        projectLabel: "recent project",
        invoiceStatus: "sent",
        tone: "friendly",
        dueTiming: "due this Friday",
        paymentWording: "Please use the payment link or invoice portal already sent.",
        context: "Thanks again for the work together. I wanted to keep the invoice easy to find.",
        paper: "letter",
      },
      fields: [
        { id: "clientLabel", label: "Client label", type: "text", maxLength: 60, help: "Use a generic label if you do not want to type a real client name." },
        { id: "projectLabel", label: "Project or service label", type: "text", maxLength: 80 },
        { id: "invoiceStatus", label: "Follow-up type", type: "select", options: [["sent", "Polite reminder"], ["due-today", "Due today"], ["overdue", "First overdue follow-up"], ["paid", "Paid thank-you"], ["next-invoice", "Next invoice note"]] },
        { id: "tone", label: "Tone", type: "select", options: [["friendly", "Friendly"], ["firm", "Firm"], ["concise", "Concise"], ["warm", "Warm"]] },
        { id: "dueTiming", label: "Timing line", type: "text", maxLength: 80, help: "Example: due this Friday, sent last week, paid yesterday." },
        { id: "paymentWording", label: "Payment wording", type: "textarea", maxLength: 220, help: "Avoid private bank, card, invoice number, tax, or client details." },
        { id: "context", label: "Optional context", type: "textarea", maxLength: 260 },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawInvoiceFollowupEmail,
      afterDraw: renderInvoiceFollowupEmailOutput,
    },
    "estimate-generator": {
      id: "estimate-generator",
      icon: "EST",
      title: "Estimate Generator",
      shortTitle: "Estimate",
      description: "Create a free estimate PDF for freelance work, home services, consulting, repairs, or small business quotes.",
      keywords: ["estimate generator", "quote PDF", "free estimate", "service estimate"],
      defaultValues: {
        business: "Bright Studio\nhello@example.com",
        client: "Client Name\nclient@example.com",
        invoiceNo: "EST-001",
        date: "2026-06-01",
        due: "Valid for 14 days",
        items: "Discovery call | 1 | 0\nDesign concept | 1 | 450\nImplementation support | 4 | 75",
        currency: "USD",
        notes: "This estimate is based on the scope listed above.",
        paper: "letter",
      },
      fields: [
        { id: "business", label: "Your business", type: "textarea", maxLength: 140, help: "Name, email, address, or payment note. Keep private details minimal." },
        { id: "client", label: "Prepared for", type: "textarea", maxLength: 140 },
        { id: "invoiceNo", label: "Estimate number", type: "text", maxLength: 36 },
        { id: "date", label: "Estimate date", type: "text", maxLength: 32 },
        { id: "due", label: "Validity or terms", type: "text", maxLength: 42 },
        { id: "items", label: "Estimate items", type: "textarea", maxLength: 420, help: "One item per line: Description | Qty | Rate" },
        { id: "currency", label: "Currency", type: "select", options: [["USD", "USD $"], ["EUR", "EUR"], ["GBP", "GBP"], ["CAD", "CAD $"], ["AUD", "AUD $"]] },
        { id: "notes", label: "Footer note", type: "textarea", maxLength: 160 },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawEstimate,
    },
    "purchase-order": {
      id: "purchase-order",
      icon: "PO",
      title: "Purchase Order Generator",
      shortTitle: "Purchase order",
      description: "Make a free purchase order PDF for supplies, services, small vendors, internal approvals, or project records.",
      keywords: ["purchase order", "PO generator", "free purchase order", "PDF purchase order"],
      defaultValues: {
        business: "Buyer Name\nbuyer@example.com",
        client: "Vendor Name\nvendor@example.com",
        invoiceNo: "PO-001",
        date: "2026-06-01",
        due: "Requested delivery: 2026-06-15",
        items: "Print materials | 100 | 1.25\nSetup fee | 1 | 45\nShipping | 1 | 18",
        currency: "USD",
        notes: "Please reference this purchase order on the invoice.",
        paper: "letter",
      },
      fields: [
        { id: "business", label: "Buyer", type: "textarea", maxLength: 140 },
        { id: "client", label: "Vendor", type: "textarea", maxLength: 140 },
        { id: "invoiceNo", label: "PO number", type: "text", maxLength: 36 },
        { id: "date", label: "PO date", type: "text", maxLength: 32 },
        { id: "due", label: "Delivery or terms", type: "text", maxLength: 60 },
        { id: "items", label: "Order items", type: "textarea", maxLength: 420, help: "One item per line: Description | Qty | Unit price" },
        { id: "currency", label: "Currency", type: "select", options: [["USD", "USD $"], ["EUR", "EUR"], ["GBP", "GBP"], ["CAD", "CAD $"], ["AUD", "AUD $"]] },
        { id: "notes", label: "Footer note", type: "textarea", maxLength: 160 },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawPurchaseOrder,
    },
    "bill-of-sale": {
      id: "bill-of-sale",
      icon: "BOS",
      title: "Bill of Sale Generator",
      shortTitle: "Bill of sale",
      description: "Create a simple bill of sale PDF for a private item sale, equipment transfer, furniture sale, or vehicle record draft.",
      keywords: ["bill of sale", "sale receipt", "private sale", "PDF bill of sale"],
      defaultValues: {
        business: "Seller Name\nseller@example.com",
        client: "Buyer Name\nbuyer@example.com",
        invoiceNo: "SALE-001",
        date: "2026-06-01",
        due: "Sold as-is unless otherwise noted",
        items: "Used laptop, serial/model noted separately | 1 | 650",
        currency: "USD",
        notes: "Buyer and seller should review local requirements before signing.",
        paper: "letter",
      },
      fields: [
        { id: "business", label: "Seller", type: "textarea", maxLength: 140 },
        { id: "client", label: "Buyer", type: "textarea", maxLength: 140 },
        { id: "invoiceNo", label: "Sale record number", type: "text", maxLength: 36 },
        { id: "date", label: "Sale date", type: "text", maxLength: 32 },
        { id: "due", label: "Terms", type: "text", maxLength: 70 },
        { id: "items", label: "Item sold", type: "textarea", maxLength: 420, help: "One item per line: Description | Qty | Price" },
        { id: "currency", label: "Currency", type: "select", options: [["USD", "USD $"], ["EUR", "EUR"], ["GBP", "GBP"], ["CAD", "CAD $"], ["AUD", "AUD $"]] },
        { id: "notes", label: "Disclosure note", type: "textarea", maxLength: 180 },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawBillOfSale,
    },
    "rent-receipt": {
      id: "rent-receipt",
      icon: "RC",
      title: "Rent Receipt Generator",
      shortTitle: "Rent receipt",
      description: "Make a free printable rent receipt PDF for a tenant payment, room rental, cash payment record, or landlord file.",
      keywords: ["rent receipt", "receipt generator", "landlord receipt", "PDF receipt"],
      defaultValues: {
        receivedFrom: "Tenant Name",
        landlord: "Landlord or property manager",
        property: "123 Main Street, Unit 4",
        amount: "1200",
        currency: "USD",
        period: "June 2026 rent",
        paidDate: "2026-06-01",
        method: "Bank transfer",
        notes: "Payment received for the rental period above.",
        paper: "letter",
      },
      fields: [
        { id: "receivedFrom", label: "Received from", type: "text", maxLength: 70 },
        { id: "landlord", label: "Received by", type: "text", maxLength: 70 },
        { id: "property", label: "Property or unit", type: "textarea", maxLength: 140 },
        { id: "amount", label: "Amount", type: "text", maxLength: 24 },
        { id: "currency", label: "Currency", type: "select", options: [["USD", "USD $"], ["EUR", "EUR"], ["GBP", "GBP"], ["CAD", "CAD $"], ["AUD", "AUD $"]] },
        { id: "period", label: "Rental period", type: "text", maxLength: 70 },
        { id: "paidDate", label: "Payment date", type: "text", maxLength: 32 },
        { id: "method", label: "Payment method", type: "text", maxLength: 50 },
        { id: "notes", label: "Note", type: "textarea", maxLength: 160 },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawRentReceipt,
    },
    "resume-builder": {
      id: "resume-builder",
      icon: "CV",
      title: "Resume Builder PDF",
      shortTitle: "Resume",
      description: "Build a simple free resume PDF without an account, paywall, or surprise download fee.",
      keywords: ["resume builder", "free resume", "CV PDF", "job application"],
      defaultValues: {
        name: "Maya Chen",
        headline: "Operations Coordinator",
        contact: "maya@example.com | San Francisco, CA | linkedin.com/in/maya",
        summary: "Organized operations professional with experience coordinating projects, vendors, schedules, and team documentation.",
        experience: "Operations Coordinator | Northstar Studio | Coordinated weekly project schedules and reduced late handoffs by 18%.\nAdministrative Assistant | Greenline Services | Managed calendars, invoices, and client follow-ups for a five-person team.",
        skills: "Scheduling, vendor coordination, spreadsheets, documentation, customer support",
        education: "B.A. Business Administration, State University",
        paper: "letter",
      },
      fields: [
        { id: "name", label: "Name", type: "text", maxLength: 70 },
        { id: "headline", label: "Headline", type: "text", maxLength: 90 },
        { id: "contact", label: "Contact line", type: "text", maxLength: 140, help: "Generated locally. Do not use the AI helper for sensitive details." },
        { id: "summary", label: "Professional summary", type: "textarea", maxLength: 360 },
        { id: "experience", label: "Experience", type: "textarea", maxLength: 620, help: "One role per line: Role | Company | achievement" },
        { id: "skills", label: "Skills", type: "textarea", maxLength: 260 },
        { id: "education", label: "Education", type: "textarea", maxLength: 180 },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawResume,
    },
    "ats-resume-checker": {
      id: "ats-resume-checker",
      icon: "ATS",
      title: "ATS Resume Checker",
      shortTitle: "ATS Checker",
      description: "Check pasted resume text against a job description and download a local ATS keyword and readability report PDF.",
      keywords: ["ATS resume checker", "resume keyword match", "resume checker", "job application"],
      ai: false,
      defaultValues: {
        targetRole: "Operations Coordinator",
        resumeText: "Maya Chen\nOperations Coordinator\nmaya@example.com | San Francisco, CA\n\nSummary\nOperations professional with experience coordinating schedules, vendors, documentation, and customer follow-ups.\n\nExperience\nOperations Coordinator, Northstar Studio\nCoordinated weekly project schedules and reduced late handoffs by 18%.\nManaged vendor communication, order tracking, and team documentation.\n\nSkills\nScheduling, vendor coordination, spreadsheets, documentation, customer support\n\nEducation\nB.A. Business Administration, State University",
        jobDescription: "We are hiring an Operations Coordinator to manage schedules, vendor coordination, documentation, reporting, customer communication, project tracking, and cross-functional follow-up. Experience with spreadsheets, process improvement, and detail-oriented administrative work is preferred.",
        focus: "balanced",
        paper: "letter",
      },
      fields: [
        { id: "targetRole", label: "Target role", type: "text", maxLength: 90 },
        { id: "resumeText", label: "Resume text", type: "textarea", maxLength: 3000, help: "Paste resume text only. It stays in this browser and is not uploaded." },
        { id: "jobDescription", label: "Job description", type: "textarea", maxLength: 2200, help: "Paste the role description to compare keywords and requirements locally." },
        { id: "focus", label: "Report focus", type: "select", options: [["balanced", "Balanced"], ["keywords", "Keyword match"], ["readability", "Readability"]] },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawAtsResumeChecker,
    },
    "cover-letter": {
      id: "cover-letter",
      icon: "CL",
      title: "Cover Letter Generator",
      shortTitle: "Cover letter",
      description: "Create a free one-page cover letter PDF for job applications without an account or surprise download fee.",
      keywords: ["cover letter generator", "free cover letter", "job application", "PDF cover letter"],
      defaultValues: {
        name: "Maya Chen",
        contact: "maya@example.com | San Francisco, CA",
        role: "Operations Coordinator",
        company: "Northstar Studio",
        greeting: "Dear Hiring Manager,",
        opening: "I am excited to apply for the Operations Coordinator role at Northstar Studio.",
        strengths: "I have experience coordinating schedules, vendor follow-ups, documentation, and team handoffs. I enjoy turning busy workflows into clear next steps.",
        closing: "I would welcome the opportunity to discuss how my organization and communication skills can support your team.",
        signoff: "Sincerely,",
        paper: "letter",
      },
      fields: [
        { id: "name", label: "Name", type: "text", maxLength: 70 },
        { id: "contact", label: "Contact line", type: "text", maxLength: 140, help: "This stays local unless you copy it into another field." },
        { id: "role", label: "Target role", type: "text", maxLength: 90 },
        { id: "company", label: "Company", type: "text", maxLength: 90 },
        { id: "greeting", label: "Greeting", type: "text", maxLength: 80 },
        { id: "opening", label: "Opening paragraph", type: "textarea", maxLength: 360 },
        { id: "strengths", label: "Strengths paragraph", type: "textarea", maxLength: 520 },
        { id: "closing", label: "Closing paragraph", type: "textarea", maxLength: 320 },
        { id: "signoff", label: "Signoff", type: "text", maxLength: 60 },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawCoverLetter,
    },
    "resignation-letter": {
      id: "resignation-letter",
      icon: "RL",
      title: "Resignation Letter Generator",
      shortTitle: "Resignation letter",
      description: "Make a simple resignation letter PDF with notice date, last day, appreciation, and handoff wording.",
      keywords: ["resignation letter", "two weeks notice", "free resignation letter", "PDF resignation letter"],
      defaultValues: {
        name: "Maya Chen",
        contact: "maya@example.com",
        manager: "Manager Name",
        company: "Company Name",
        role: "Operations Coordinator",
        date: "2026-06-01",
        lastDay: "2026-06-15",
        tone: "professional",
        appreciation: "I appreciate the opportunities for growth and collaboration during my time with the team.",
        handoff: "I will help document current work and support a smooth transition before my last day.",
        paper: "letter",
      },
      fields: [
        { id: "name", label: "Your name", type: "text", maxLength: 70 },
        { id: "contact", label: "Contact line", type: "text", maxLength: 120, help: "Optional. This stays local unless you copy it into another AI-enabled field." },
        { id: "manager", label: "Manager or recipient", type: "text", maxLength: 90 },
        { id: "company", label: "Company", type: "text", maxLength: 90 },
        { id: "role", label: "Role", type: "text", maxLength: 90 },
        { id: "date", label: "Letter date", type: "text", maxLength: 32 },
        { id: "lastDay", label: "Last working day", type: "text", maxLength: 42 },
        { id: "tone", label: "Tone", type: "select", options: [["professional", "Professional"], ["warm", "Warm"], ["brief", "Brief"]] },
        { id: "appreciation", label: "Appreciation line", type: "textarea", maxLength: 260 },
        { id: "handoff", label: "Handoff line", type: "textarea", maxLength: 260 },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawResignationLetter,
    },
    "monthly-calendar": {
      id: "monthly-calendar",
      icon: "31",
      title: "Monthly Calendar Generator",
      shortTitle: "Monthly calendar",
      description: "Create a free printable monthly calendar PDF for appointments, school events, chores, meals, or family planning.",
      keywords: ["monthly calendar", "printable calendar", "free calendar", "PDF calendar"],
      defaultValues: {
        title: "Monthly Calendar",
        month: "June",
        year: "2026",
        startDay: "monday",
        notes: "Appointments\nSchool events\nBills\nFamily plans",
        paper: "letter",
      },
      fields: [
        { id: "title", label: "Calendar title", type: "text", maxLength: 70 },
        { id: "month", label: "Month", type: "select", options: [["January", "January"], ["February", "February"], ["March", "March"], ["April", "April"], ["May", "May"], ["June", "June"], ["July", "July"], ["August", "August"], ["September", "September"], ["October", "October"], ["November", "November"], ["December", "December"]] },
        { id: "year", label: "Year", type: "text", maxLength: 4 },
        { id: "startDay", label: "Week starts", type: "select", options: [["sunday", "Sunday"], ["monday", "Monday"]] },
        { id: "notes", label: "Note headings", type: "textarea", maxLength: 180, help: "One heading per line for the notes area." },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawMonthlyCalendar,
    },
    "meal-planner": {
      id: "meal-planner",
      icon: "MP",
      title: "Meal Planner Generator",
      shortTitle: "Meal planner",
      description: "Make a printable weekly meal planner PDF with breakfast, lunch, dinner, grocery list, and prep notes.",
      keywords: ["meal planner", "grocery list", "weekly meal plan", "printable meal planner"],
      defaultValues: {
        title: "Weekly Meal Planner",
        meals: "Monday | oatmeal | leftovers | pasta\nTuesday | yogurt | salad | tacos\nWednesday | eggs | soup | stir fry\nThursday | toast | wraps | chicken rice\nFriday | smoothie | sandwiches | pizza\nSaturday | pancakes | picnic | burgers\nSunday | fruit | noodles | roast dinner",
        grocery: "Fruit\nVegetables\nProtein\nRice or pasta\nSnacks",
        notes: "Prep vegetables on Sunday. Keep one flexible dinner for leftovers.",
        paper: "letter",
      },
      fields: [
        { id: "title", label: "Planner title", type: "text", maxLength: 70 },
        { id: "meals", label: "Meals", type: "textarea", maxLength: 620, help: "One day per line: Day | Breakfast | Lunch | Dinner" },
        { id: "grocery", label: "Grocery list", type: "textarea", maxLength: 420, help: "One item per line." },
        { id: "notes", label: "Prep notes", type: "textarea", maxLength: 240 },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawMealPlanner,
    },
    "image-to-pdf": {
      id: "image-to-pdf",
      icon: "IMG",
      title: "Image to PDF Converter",
      shortTitle: "Image to PDF",
      description: "Convert JPG, PNG, or WebP images into a clean one-page PDF in your browser without uploading files.",
      keywords: ["image to PDF", "JPG to PDF", "PNG to PDF", "no upload"],
      ai: false,
      defaultValues: {
        title: "Image to PDF",
        layout: "fit",
        paper: "letter",
        caption: "",
        images: "",
      },
      fields: [
        { id: "images", label: "Images", type: "file", accept: "image/png,image/jpeg,image/webp", multiple: true, help: "Select up to 4 images. They stay in your browser and are not uploaded." },
        { id: "title", label: "PDF title", type: "text", maxLength: 70 },
        { id: "layout", label: "Layout", type: "select", options: [["fit", "Fit first image"], ["gallery", "Gallery up to 4 images"], ["fill", "Fill page with first image"]] },
        { id: "caption", label: "Optional caption", type: "text", maxLength: 90 },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawImageToPdf,
    },
    "multi-image-pdf": {
      id: "multi-image-pdf",
      icon: "PDF",
      title: "Multiple Images to PDF Converter",
      shortTitle: "Images to PDF",
      description: "Turn several JPG, PNG, or WebP images into one multi-page PDF in your browser without uploading files.",
      keywords: ["images to PDF", "JPG to PDF", "multi-page PDF", "no upload"],
      ai: false,
      acceptsImages: true,
      maxImages: 8,
      defaultValues: {
        title: "Images to PDF",
        layout: "fit",
        paper: "letter",
        caption: "Each image becomes one PDF page.",
        images: "",
      },
      fields: [
        { id: "images", label: "Images", type: "file", accept: "image/png,image/jpeg,image/webp", multiple: true, help: "Select up to 8 images. Files stay in your browser and are not uploaded." },
        { id: "title", label: "PDF title", type: "text", maxLength: 70 },
        { id: "layout", label: "Image fit", type: "select", options: [["fit", "Fit each page"], ["fill", "Fill each page"]] },
        { id: "caption", label: "Preview note", type: "text", maxLength: 90 },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawMultiImagePdf,
      exportPdf: exportMultiImagePdf,
    },
    "pdf-to-images": {
      id: "pdf-to-images",
      icon: "JPG",
      title: "PDF to JPG Converter",
      shortTitle: "PDF to JPG",
      description: "Convert PDF pages to JPG or PNG images locally in your browser without uploading the document.",
      keywords: ["PDF to JPG", "PDF to PNG", "convert PDF pages to images", "no upload"],
      ai: false,
      pdfTool: "to-images",
      outputKind: "file",
      defaultValues: {
        pdfs: "",
        pageRange: "all",
        format: "jpeg",
        quality: "0.86",
        scale: "1.5",
      },
      fields: [
        { id: "pdfs", label: "PDF file", type: "file", accept: "application/pdf", multiple: false, help: "Select one PDF. It stays in your browser and is rendered locally." },
        { id: "pageRange", label: "Pages to convert", type: "text", maxLength: 80, help: "Use all, 1, or ranges such as 1,3-5. The free version exports up to 8 pages." },
        { id: "format", label: "Image format", type: "select", options: [["jpeg", "JPG"], ["png", "PNG"]] },
        { id: "quality", label: "JPG quality", type: "select", options: [["0.72", "Small"], ["0.86", "Balanced"], ["0.94", "High"]] },
        { id: "scale", label: "Render quality", type: "select", options: [["1", "Fast"], ["1.5", "Balanced"], ["2", "Sharp"]] },
      ],
    },
    "pdf-to-text": {
      id: "pdf-to-text",
      icon: "TXT",
      title: "PDF to Text Converter",
      shortTitle: "PDF to Text",
      description: "Extract selectable text from PDF pages locally in your browser without uploading the document.",
      keywords: ["PDF to text", "extract text from PDF", "PDF text extractor", "no upload"],
      ai: false,
      pdfTool: "to-text",
      outputKind: "file",
      defaultValues: {
        pdfs: "",
        pageRange: "all",
        layout: "page-breaks",
      },
      fields: [
        { id: "pdfs", label: "PDF file", type: "file", accept: "application/pdf", multiple: false, help: "Select one PDF. The text extractor runs locally in your browser." },
        { id: "pageRange", label: "Pages to extract", type: "text", maxLength: 80, help: "Use all, 1, or ranges such as 1,3-5. Scanned image-only PDFs need OCR, which this free tool does not perform." },
        { id: "layout", label: "Text layout", type: "select", options: [["page-breaks", "Page headings"], ["plain", "Plain text"]] },
      ],
    },
    "pdf-to-word": {
      id: "pdf-to-word",
      icon: "DOC",
      title: "PDF to Word Converter",
      shortTitle: "PDF to Word",
      description: "Convert selectable PDF text into a simple DOCX document locally in your browser without uploading the PDF.",
      keywords: ["PDF to Word", "PDF to DOCX", "convert PDF to Word", "no upload"],
      ai: false,
      pdfTool: "to-docx",
      outputKind: "file",
      defaultValues: {
        pdfs: "",
        pageRange: "all",
        layout: "headings",
      },
      fields: [
        { id: "pdfs", label: "PDF file", type: "file", accept: "application/pdf", multiple: false, help: "Select one PDF. The converter reads selectable text locally in your browser." },
        { id: "pageRange", label: "Pages to convert", type: "text", maxLength: 80, help: "Use all, 1, or ranges such as 1,3-5. The free version exports up to 12 pages into DOCX." },
        { id: "layout", label: "DOCX layout", type: "select", options: [["headings", "Page headings"], ["paragraphs", "Plain paragraphs"]] },
      ],
    },
    "compress-pdf": {
      id: "compress-pdf",
      icon: "ZIP",
      title: "Compress PDF Online",
      shortTitle: "Compress PDF",
      description: "Compress a PDF locally by rendering pages into a smaller image-based PDF without uploading the document.",
      keywords: ["compress PDF", "reduce PDF size", "PDF compressor", "no upload"],
      ai: false,
      pdfTool: "compress",
      outputKind: "file",
      defaultValues: {
        pdfs: "",
        mode: "balanced",
        targetSize: "none",
        pageRange: "all",
      },
      fields: [
        { id: "pdfs", label: "PDF file", type: "file", accept: "application/pdf", multiple: false, help: "Select one PDF. It stays in your browser and is not uploaded." },
        { id: "mode", label: "Compression mode", type: "select", options: [["small", "Small file"], ["balanced", "Balanced"], ["readable", "More readable"]] },
        { id: "targetSize", label: "Target size", type: "select", options: [["none", "No exact target"], ["500kb", "Try under 500 KB"], ["1mb", "Try under 1 MB"], ["2mb", "Try under 2 MB"], ["5mb", "Try under 5 MB"]] },
        { id: "pageRange", label: "Pages to compress", type: "text", maxLength: 80, help: "Use all, 1, or ranges such as 1,3-5. Free compression exports up to 12 pages." },
      ],
    },
    "compress-image": {
      id: "compress-image",
      icon: "CMP",
      title: "Compress Image Online",
      shortTitle: "Compress image",
      description: "Compress JPG, PNG, or WebP images locally in your browser without uploading files.",
      keywords: ["compress image", "image compressor", "reduce image size", "no upload"],
      ai: false,
      acceptsImages: true,
      maxImages: 1,
      outputKind: "image",
      defaultValues: {
        title: "Image Compressor",
        images: "",
        quality: "0.72",
        maxWidth: "1600",
        format: "jpeg",
      },
      fields: [
        { id: "images", label: "Image", type: "file", accept: "image/png,image/jpeg,image/webp", multiple: false, help: "Select one image. It stays in your browser and is not uploaded." },
        { id: "quality", label: "Compression", type: "select", options: [["0.55", "Smaller file"], ["0.72", "Balanced"], ["0.86", "Higher quality"]] },
        { id: "maxWidth", label: "Maximum width", type: "select", options: [["800", "800 px"], ["1200", "1200 px"], ["1600", "1600 px"], ["2400", "2400 px"], ["original", "Keep original width"]] },
        { id: "format", label: "Output format", type: "select", options: [["jpeg", "JPG"], ["webp", "WebP"], ["png", "PNG"]] },
      ],
      draw: drawImageCompressor,
      exportFile: exportCompressedImage,
    },
    "compress-image-to-kb": {
      id: "compress-image-to-kb",
      icon: "KB",
      title: "Compress Image to KB",
      shortTitle: "Image to KB",
      description: "Compress an image toward a target KB size locally for upload limits, forms, profiles, and portals.",
      keywords: ["compress image to KB", "reduce image size to 100KB", "image size reducer", "no upload"],
      ai: false,
      acceptsImages: true,
      maxImages: 1,
      outputKind: "image",
      defaultValues: {
        title: "Image to KB",
        images: "",
        targetKb: "200",
        customKb: "",
        maxWidth: "1600",
        format: "jpeg",
      },
      fields: [
        { id: "images", label: "Image", type: "file", accept: "image/png,image/jpeg,image/webp", multiple: false, help: "Select one image. It stays in your browser and is not uploaded." },
        { id: "targetKb", label: "Target file size", type: "select", options: [["50", "Under 50 KB"], ["100", "Under 100 KB"], ["200", "Under 200 KB"], ["500", "Under 500 KB"], ["custom", "Custom KB"]] },
        { id: "customKb", label: "Custom KB", type: "text", maxLength: 4, help: "Used when Target file size is Custom. Very small targets can make images blurry." },
        { id: "maxWidth", label: "Maximum width", type: "select", options: [["640", "640 px"], ["800", "800 px"], ["1200", "1200 px"], ["1600", "1600 px"], ["original", "Keep original width"]] },
        { id: "format", label: "Output format", type: "select", options: [["jpeg", "JPG"], ["webp", "WebP"]] },
      ],
      draw: drawImageToKb,
      exportFile: exportImageToKb,
    },
    "resize-image": {
      id: "resize-image",
      icon: "RSZ",
      title: "Resize Image Online",
      shortTitle: "Resize image",
      description: "Resize a JPG, PNG, or WebP image locally by width, height, or common social sizes without uploading it.",
      keywords: ["resize image", "image resizer", "change image size", "no upload"],
      ai: false,
      acceptsImages: true,
      maxImages: 1,
      outputKind: "image",
      defaultValues: {
        title: "Image Resizer",
        images: "",
        preset: "custom",
        width: "1200",
        height: "",
        fit: "contain",
        format: "jpeg",
        quality: "0.82",
      },
      fields: [
        { id: "images", label: "Image", type: "file", accept: "image/png,image/jpeg,image/webp", multiple: false, help: "Select one image. It stays in your browser and is not uploaded." },
        { id: "preset", label: "Size preset", type: "select", options: [["custom", "Custom"], ["square-1080", "Square 1080 x 1080"], ["story-1080x1920", "Story 1080 x 1920"], ["thumbnail-1280x720", "Thumbnail 1280 x 720"], ["profile-512", "Profile 512 x 512"]] },
        { id: "width", label: "Custom width", type: "text", maxLength: 5, help: "Used when preset is Custom. Leave height empty to keep the aspect ratio." },
        { id: "height", label: "Custom height", type: "text", maxLength: 5 },
        { id: "fit", label: "Fit mode", type: "select", options: [["contain", "Fit inside"], ["cover", "Fill and crop"]] },
        { id: "format", label: "Output format", type: "select", options: [["jpeg", "JPG"], ["webp", "WebP"], ["png", "PNG"]] },
        { id: "quality", label: "Quality", type: "select", options: [["0.72", "Small"], ["0.82", "Balanced"], ["0.92", "High"]] },
      ],
      draw: drawImageResizer,
      exportFile: exportResizedImage,
    },
    "convert-image": {
      id: "convert-image",
      icon: "CVT",
      title: "Convert Image Format",
      shortTitle: "Convert image",
      description: "Convert JPG, PNG, and WebP images locally in your browser without uploading the file.",
      keywords: ["convert image", "JPG to PNG", "PNG to WebP", "no upload"],
      ai: false,
      acceptsImages: true,
      maxImages: 1,
      outputKind: "image",
      defaultValues: {
        title: "Image Converter",
        images: "",
        format: "webp",
        quality: "0.86",
        background: "white",
      },
      fields: [
        { id: "images", label: "Image", type: "file", accept: "image/png,image/jpeg,image/webp", multiple: false, help: "Select one image. It stays in your browser and is not uploaded." },
        { id: "format", label: "Convert to", type: "select", options: [["webp", "WebP"], ["jpeg", "JPG"], ["png", "PNG"]] },
        { id: "quality", label: "Quality", type: "select", options: [["0.72", "Small"], ["0.86", "Balanced"], ["0.94", "High"]] },
        { id: "background", label: "JPG background", type: "select", options: [["white", "White"], ["black", "Black"], ["transparent", "Transparent if possible"]] },
      ],
      draw: drawImageConverter,
      exportFile: exportConvertedImage,
    },
    "remove-background": {
      id: "remove-background",
      icon: "BG",
      title: "Remove Background Online",
      shortTitle: "Remove background",
      description: "Remove a solid or near-solid image background locally and download a transparent PNG without uploading the file.",
      keywords: ["remove background", "transparent PNG", "white background remover", "no upload"],
      ai: false,
      acceptsImages: true,
      maxImages: 1,
      outputKind: "image",
      defaultValues: {
        title: "Background Remover",
        images: "",
        sample: "auto-corners",
        tolerance: "52",
        softness: "22",
        maxWidth: "original",
      },
      fields: [
        { id: "images", label: "Image", type: "file", accept: "image/png,image/jpeg,image/webp", multiple: false, help: "Select one image. It stays in your browser and is not uploaded." },
        { id: "sample", label: "Background sample", type: "select", options: [["auto-corners", "Auto from corners"], ["top-left", "Top left"], ["top-right", "Top right"], ["bottom-left", "Bottom left"], ["bottom-right", "Bottom right"], ["white", "White"], ["black", "Black"], ["green", "Green screen"], ["blue", "Blue screen"]] },
        { id: "tolerance", label: "Color tolerance", type: "select", options: [["28", "Tight"], ["52", "Balanced"], ["78", "Strong"], ["108", "Very strong"]] },
        { id: "softness", label: "Edge softness", type: "select", options: [["8", "Crisp"], ["22", "Smooth"], ["40", "Soft"]] },
        { id: "maxWidth", label: "Maximum width", type: "select", options: [["1200", "1200 px"], ["1800", "1800 px"], ["2400", "2400 px"], ["original", "Keep original width"]] },
      ],
      draw: drawBackgroundRemover,
      exportFile: exportBackgroundRemovedImage,
    },
    "crop-image": {
      id: "crop-image",
      icon: "CRP",
      title: "Crop Image Online",
      shortTitle: "Crop image",
      description: "Crop JPG, PNG, or WebP images locally for square avatars, wide banners, product photos, and profile uploads without uploading files.",
      keywords: ["crop image", "square crop", "profile photo crop", "no upload"],
      ai: false,
      acceptsImages: true,
      maxImages: 1,
      outputKind: "image",
      defaultValues: {
        title: "Image Cropper",
        images: "",
        preset: "square",
        anchor: "center",
        format: "jpeg",
        quality: "0.86",
      },
      fields: [
        { id: "images", label: "Image", type: "file", accept: "image/png,image/jpeg,image/webp", multiple: false, help: "Select one image. It stays in your browser and is not uploaded." },
        { id: "preset", label: "Crop shape", type: "select", options: [["square", "Square 1:1"], ["wide-16-9", "Wide 16:9"], ["portrait-4-5", "Portrait 4:5"], ["banner-3-1", "Banner 3:1"], ["original", "Keep original ratio"]] },
        { id: "anchor", label: "Keep focus", type: "select", options: [["center", "Center"], ["top", "Top"], ["bottom", "Bottom"], ["left", "Left"], ["right", "Right"]] },
        { id: "format", label: "Output format", type: "select", options: [["jpeg", "JPG"], ["webp", "WebP"], ["png", "PNG"]] },
        { id: "quality", label: "Quality", type: "select", options: [["0.72", "Small"], ["0.86", "Balanced"], ["0.94", "High"]] },
      ],
      draw: drawImageCropper,
      exportFile: exportCroppedImage,
    },
    "rotate-image": {
      id: "rotate-image",
      icon: "ROT",
      title: "Rotate Image Online",
      shortTitle: "Rotate image",
      description: "Rotate or flip a JPG, PNG, or WebP image locally in your browser without uploading the file.",
      keywords: ["rotate image", "flip image", "fix sideways photo", "no upload"],
      ai: false,
      acceptsImages: true,
      maxImages: 1,
      outputKind: "image",
      defaultValues: {
        title: "Image Rotator",
        images: "",
        rotation: "90",
        flip: "none",
        format: "jpeg",
        quality: "0.86",
      },
      fields: [
        { id: "images", label: "Image", type: "file", accept: "image/png,image/jpeg,image/webp", multiple: false, help: "Select one image. It stays in your browser and is not uploaded." },
        { id: "rotation", label: "Rotation", type: "select", options: [["90", "Rotate 90 degrees"], ["180", "Rotate 180 degrees"], ["270", "Rotate 270 degrees"]] },
        { id: "flip", label: "Flip", type: "select", options: [["none", "No flip"], ["horizontal", "Flip horizontal"], ["vertical", "Flip vertical"]] },
        { id: "format", label: "Output format", type: "select", options: [["jpeg", "JPG"], ["webp", "WebP"], ["png", "PNG"]] },
        { id: "quality", label: "Quality", type: "select", options: [["0.72", "Small"], ["0.86", "Balanced"], ["0.94", "High"]] },
      ],
      draw: drawImageRotator,
      exportFile: exportRotatedImage,
    },
    "watermark-image": {
      id: "watermark-image",
      icon: "WMK",
      title: "Watermark Image Online",
      shortTitle: "Watermark image",
      description: "Add a text watermark to JPG, PNG, or WebP images locally for drafts, samples, marketplace photos, and social posts without uploading files.",
      keywords: ["watermark image", "add watermark to photo", "text watermark", "no upload"],
      ai: false,
      acceptsImages: true,
      maxImages: 1,
      outputKind: "image",
      defaultValues: {
        title: "Image Watermark",
        images: "",
        watermarkText: "SAMPLE",
        placement: "bottom-right",
        size: "medium",
        opacity: "0.28",
        format: "jpeg",
        quality: "0.86",
      },
      fields: [
        { id: "images", label: "Image", type: "file", accept: "image/png,image/jpeg,image/webp", multiple: false, help: "Select one image. It stays in your browser and is not uploaded." },
        { id: "watermarkText", label: "Watermark text", type: "text", maxLength: 50 },
        { id: "placement", label: "Placement", type: "select", options: [["bottom-right", "Bottom right"], ["bottom-left", "Bottom left"], ["top-right", "Top right"], ["top-left", "Top left"], ["center", "Center"], ["diagonal-tile", "Diagonal tile"]] },
        { id: "size", label: "Text size", type: "select", options: [["small", "Small"], ["medium", "Medium"], ["large", "Large"]] },
        { id: "opacity", label: "Opacity", type: "select", options: [["0.18", "Light"], ["0.28", "Balanced"], ["0.42", "Strong"]] },
        { id: "format", label: "Output format", type: "select", options: [["jpeg", "JPG"], ["webp", "WebP"], ["png", "PNG"]] },
        { id: "quality", label: "Quality", type: "select", options: [["0.72", "Small"], ["0.86", "Balanced"], ["0.94", "High"]] },
      ],
      draw: drawImageWatermarker,
      exportFile: exportWatermarkedImage,
    },
    "add-text-image": {
      id: "add-text-image",
      icon: "TXT+",
      title: "Add Text to Image Online",
      shortTitle: "Text on image",
      description: "Add a headline, caption, price, label, or meme-style text to an image locally without uploading the file.",
      keywords: ["add text to image", "text on photo", "caption image", "no upload"],
      ai: false,
      acceptsImages: true,
      maxImages: 1,
      outputKind: "image",
      defaultValues: {
        title: "Add Text to Image",
        images: "",
        overlayText: "Summer Sale",
        subText: "Free local export",
        layout: "bottom-banner",
        fontSize: "large",
        textColor: "white",
        boxStyle: "dark",
        format: "jpeg",
        quality: "0.88",
      },
      fields: [
        { id: "images", label: "Image", type: "file", accept: "image/png,image/jpeg,image/webp", multiple: false, help: "Select one image. It stays in your browser and is not uploaded." },
        { id: "overlayText", label: "Main text", type: "text", maxLength: 72, help: "Use a short title, price, label, or caption." },
        { id: "subText", label: "Small text", type: "text", maxLength: 90, help: "Optional second line." },
        { id: "layout", label: "Text placement", type: "select", options: [["bottom-banner", "Bottom banner"], ["top-banner", "Top banner"], ["center-card", "Center card"], ["meme", "Meme top and bottom"], ["bottom-left", "Bottom left label"]] },
        { id: "fontSize", label: "Text size", type: "select", options: [["medium", "Medium"], ["large", "Large"], ["xlarge", "Extra large"]] },
        { id: "textColor", label: "Text color", type: "select", options: [["white", "White"], ["black", "Black"], ["yellow", "Yellow"], ["red", "Red"], ["blue", "Blue"]] },
        { id: "boxStyle", label: "Background", type: "select", options: [["dark", "Dark translucent"], ["light", "Light translucent"], ["solid", "Solid accent"], ["none", "No box"]] },
        { id: "format", label: "Output format", type: "select", options: [["jpeg", "JPG"], ["png", "PNG"], ["webp", "WebP"]] },
        { id: "quality", label: "Quality", type: "select", options: [["0.72", "Small"], ["0.88", "Balanced"], ["0.94", "High"]] },
      ],
      draw: drawTextOnImagePreview,
      exportFile: exportTextOnImage,
    },
    "signature-png": {
      id: "signature-png",
      icon: "SIG",
      title: "Signature PNG Generator",
      shortTitle: "Signature PNG",
      description: "Draw or type a signature and download a transparent PNG locally in your browser without uploading anything.",
      keywords: ["signature PNG", "draw signature online", "transparent signature", "no signup"],
      ai: false,
      outputKind: "image",
      generatedImage: true,
      defaultValues: {
        title: "Signature PNG",
        signatureName: "Alex Rivera",
        inkColor: "ink",
        strokeWidth: "medium",
        style: "auto",
        padding: "balanced",
        background: "transparent",
      },
      fields: [
        { id: "signaturePad", label: "Draw signature", type: "signature-pad", help: "Use a mouse, finger, or stylus. If you leave this blank, the typed name is used." },
        { id: "signatureName", label: "Typed fallback", type: "text", maxLength: 48, help: "Used for typed signature mode or when the drawing pad is blank." },
        { id: "inkColor", label: "Ink color", type: "select", options: [["ink", "Deep ink"], ["black", "Black"], ["blue", "Blue"], ["green", "Green"]] },
        { id: "strokeWidth", label: "Pen width", type: "select", options: [["thin", "Thin"], ["medium", "Medium"], ["bold", "Bold"]] },
        { id: "style", label: "Signature source", type: "select", options: [["auto", "Use drawing, then typed fallback"], ["typed-script", "Typed script"], ["typed-clean", "Typed clean"]] },
        { id: "padding", label: "Export padding", type: "select", options: [["tight", "Tight crop"], ["balanced", "Balanced"], ["wide", "Wide"]] },
        { id: "background", label: "Background", type: "select", options: [["transparent", "Transparent PNG"], ["white", "White PNG"]] },
      ],
      draw: drawSignaturePngPreview,
      exportFile: exportSignaturePng,
    },
    "passport-photo": {
      id: "passport-photo",
      icon: "ID",
      title: "Passport Photo Maker",
      shortTitle: "Passport photo",
      description: "Crop a passport-style photo locally for US 2x2, UK 35x45, Canada 50x70, and Australia 35x45 print sizes without uploading it.",
      keywords: ["passport photo", "2x2 photo", "35x45 photo", "no upload"],
      ai: false,
      acceptsImages: true,
      maxImages: 1,
      outputKind: "image",
      defaultValues: {
        title: "Passport Photo Maker",
        images: "",
        preset: "us-passport",
        zoom: "1.08",
        offsetX: "0",
        offsetY: "0",
        dpi: "300",
        output: "single-jpg",
      },
      fields: [
        { id: "images", label: "Photo", type: "file", accept: "image/png,image/jpeg,image/webp", multiple: false, help: "Select a clear photo. It stays in your browser and is not uploaded." },
        { id: "preset", label: "Photo size", type: "select", options: [["us-passport", "US 2 x 2 in"], ["uk-passport", "UK 35 x 45 mm"], ["eu-35x45", "EU 35 x 45 mm"], ["canada-passport", "Canada 50 x 70 mm"], ["australia-passport", "Australia 35 x 45 mm"]] },
        { id: "zoom", label: "Zoom", type: "range", min: "1", max: "2.2", step: "0.01", help: "Increase zoom until the head fits the guide." },
        { id: "offsetX", label: "Move left / right", type: "range", min: "-100", max: "100", step: "1" },
        { id: "offsetY", label: "Move up / down", type: "range", min: "-100", max: "100", step: "1" },
        { id: "dpi", label: "Export resolution", type: "select", options: [["300", "300 DPI print"], ["600", "600 DPI high resolution"]] },
        { id: "output", label: "Download format", type: "select", options: [["single-jpg", "Single JPG photo"], ["single-png", "Single PNG photo"], ["print-4x6-pdf", "4 x 6 print sheet PDF"]] },
      ],
      draw: drawPassportPhotoPreview,
      exportFile: exportPassportPhoto,
    },
    "qr-code": {
      id: "qr-code",
      icon: "QR",
      title: "Free QR Code Generator",
      shortTitle: "QR code",
      description: "Create a static QR code PDF for a link, menu, event page, sign, flyer, or short text without signup.",
      keywords: ["QR code", "static QR", "no signup", "printable"],
      ai: false,
      defaultValues: {
        title: "Scan This QR Code",
        content: "https://printable-tools-lab.pages.dev/",
        caption: "Static QR code for a link or short text",
        errorCorrection: "M",
        paper: "letter",
      },
      fields: [
        { id: "title", label: "Page title", type: "text", maxLength: 70 },
        { id: "content", label: "Link or text", type: "textarea", maxLength: 700, help: "Use a full URL for best scanning results. Static QR codes cannot be edited after printing." },
        { id: "caption", label: "Caption", type: "text", maxLength: 90 },
        { id: "errorCorrection", label: "Error correction", type: "select", options: [["M", "Balanced"], ["Q", "Stronger"], ["H", "Highest"], ["L", "Smallest code"]] },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawQrCode,
    },
    "wifi-qr-code": {
      id: "wifi-qr-code",
      icon: "WiFi",
      title: "WiFi QR Code Generator",
      shortTitle: "WiFi QR",
      description: "Create a printable WiFi QR code for guests, offices, rentals, classrooms, cafes, events, and waiting rooms.",
      keywords: ["WiFi QR code", "guest WiFi", "printable sign", "no signup"],
      ai: false,
      defaultValues: {
        title: "Guest WiFi",
        networkName: "Guest Network",
        password: "guest-password",
        encryption: "WPA",
        hidden: "false",
        caption: "Scan to join the WiFi network",
        paper: "letter",
      },
      fields: [
        { id: "title", label: "Sign title", type: "text", maxLength: 70 },
        { id: "networkName", label: "Network name", type: "text", maxLength: 80 },
        { id: "password", label: "Password", type: "text", maxLength: 120, help: "Leave empty only if the network has no password." },
        { id: "encryption", label: "Security", type: "select", options: [["WPA", "WPA/WPA2"], ["WEP", "WEP"], ["nopass", "No password"]] },
        { id: "hidden", label: "Hidden network", type: "select", options: [["false", "No"], ["true", "Yes"]] },
        { id: "caption", label: "Caption", type: "text", maxLength: 90 },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawWifiQrCode,
    },
    "vcard-qr-code": {
      id: "vcard-qr-code",
      icon: "VCF",
      title: "Contact QR Code Generator",
      shortTitle: "Contact QR",
      description: "Create a printable contact QR code with vCard details for a business card, booth sign, event badge, or service flyer.",
      keywords: ["vCard QR", "contact QR", "business card", "printable"],
      ai: false,
      defaultValues: {
        title: "Save My Contact",
        fullName: "Alex Morgan",
        company: "Local Studio",
        phone: "+1 555 0100",
        email: "hello@example.com",
        website: "https://example.com",
        note: "Scan to save this contact.",
        paper: "letter",
      },
      fields: [
        { id: "title", label: "Page title", type: "text", maxLength: 70 },
        { id: "fullName", label: "Full name", type: "text", maxLength: 80 },
        { id: "company", label: "Company or role", type: "text", maxLength: 80 },
        { id: "phone", label: "Phone", type: "text", maxLength: 40 },
        { id: "email", label: "Email", type: "text", maxLength: 90 },
        { id: "website", label: "Website", type: "text", maxLength: 120 },
        { id: "note", label: "Caption", type: "text", maxLength: 90 },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawVcardQrCode,
    },
    "merge-pdf": {
      id: "merge-pdf",
      icon: "MRG",
      title: "Merge PDF Tool",
      shortTitle: "Merge PDF",
      description: "Combine several PDF files into one PDF in your browser without uploading documents.",
      keywords: ["merge PDF", "combine PDF", "no upload", "no signup"],
      ai: false,
      pdfTool: "merge",
      defaultValues: {
        pdfs: "",
      },
      fields: [
        { id: "pdfs", label: "PDF files", type: "file", accept: "application/pdf", multiple: true, help: "Select up to 6 PDFs. Files stay in your browser and are not uploaded." },
      ],
    },
    "split-pdf": {
      id: "split-pdf",
      icon: "SPL",
      title: "Split PDF Tool",
      shortTitle: "Split PDF",
      description: "Extract selected pages from a PDF in your browser without uploading the document.",
      keywords: ["split PDF", "extract PDF pages", "no upload", "no signup"],
      ai: false,
      pdfTool: "split",
      defaultValues: {
        pdfs: "",
        pageRange: "1-2",
      },
      fields: [
        { id: "pdfs", label: "PDF file", type: "file", accept: "application/pdf", multiple: false, help: "Select one PDF. It stays in your browser and is not uploaded." },
        { id: "pageRange", label: "Pages to keep", type: "text", maxLength: 80, help: "Use pages or ranges such as 1,3-5. Pages are 1-based." },
      ],
    },
    "pdf-page-numbers": {
      id: "pdf-page-numbers",
      icon: "123",
      title: "Add Page Numbers to PDF",
      shortTitle: "PDF page numbers",
      description: "Add simple page numbers to an existing PDF locally in your browser.",
      keywords: ["PDF page numbers", "add page numbers", "no upload", "PDF tool"],
      ai: false,
      pdfTool: "page-numbers",
      defaultValues: {
        pdfs: "",
        position: "bottom-center",
        startNumber: "1",
      },
      fields: [
        { id: "pdfs", label: "PDF file", type: "file", accept: "application/pdf", multiple: false, help: "Select one PDF. It stays in your browser and is not uploaded." },
        { id: "position", label: "Position", type: "select", options: [["bottom-center", "Bottom center"], ["bottom-right", "Bottom right"], ["top-right", "Top right"]] },
        { id: "startNumber", label: "Start number", type: "text", maxLength: 4 },
      ],
    },
    "rotate-pdf": {
      id: "rotate-pdf",
      icon: "ROT",
      title: "Rotate PDF Pages",
      shortTitle: "Rotate PDF",
      description: "Rotate all pages or selected pages in a PDF locally in your browser without uploading the file.",
      keywords: ["rotate PDF", "PDF orientation", "no upload", "PDF pages"],
      ai: false,
      pdfTool: "rotate",
      defaultValues: {
        pdfs: "",
        rotation: "90",
        pageRange: "all",
      },
      fields: [
        { id: "pdfs", label: "PDF file", type: "file", accept: "application/pdf", multiple: false, help: "Select one PDF. It stays in your browser and is not uploaded." },
        { id: "rotation", label: "Rotation", type: "select", options: [["90", "90 degrees clockwise"], ["180", "180 degrees"], ["270", "90 degrees counter-clockwise"]] },
        { id: "pageRange", label: "Pages to rotate", type: "text", maxLength: 80, help: "Use all, a page number, or ranges such as 1,3-5." },
      ],
    },
    "remove-pdf-pages": {
      id: "remove-pdf-pages",
      icon: "DEL",
      title: "Remove Pages from PDF",
      shortTitle: "Remove PDF pages",
      description: "Delete selected pages from a PDF locally in your browser without uploading the document.",
      keywords: ["remove PDF pages", "delete PDF pages", "no upload", "PDF editor"],
      ai: false,
      pdfTool: "remove-pages",
      defaultValues: {
        pdfs: "",
        removeRange: "1",
      },
      fields: [
        { id: "pdfs", label: "PDF file", type: "file", accept: "application/pdf", multiple: false, help: "Select one PDF. It stays in your browser and is not uploaded." },
        { id: "removeRange", label: "Pages to remove", type: "text", maxLength: 80, help: "Use pages or ranges such as 1,3-5. Pages are 1-based." },
      ],
    },
    "reorder-pdf-pages": {
      id: "reorder-pdf-pages",
      icon: "ORD",
      title: "Reorder PDF Pages",
      shortTitle: "Reorder PDF",
      description: "Rearrange PDF pages by entering a new page order, all locally in your browser.",
      keywords: ["reorder PDF pages", "organize PDF", "arrange PDF pages", "no upload"],
      ai: false,
      pdfTool: "reorder",
      defaultValues: {
        pdfs: "",
        pageOrder: "1,2,3",
      },
      fields: [
        { id: "pdfs", label: "PDF file", type: "file", accept: "application/pdf", multiple: false, help: "Select one PDF. It stays in your browser and is not uploaded." },
        { id: "pageOrder", label: "New page order", type: "text", maxLength: 140, help: "Enter page numbers in the order you want, such as 3,1,2. You can omit pages to create a shorter PDF." },
      ],
    },
    "watermark-pdf": {
      id: "watermark-pdf",
      icon: "WM",
      title: "Add Watermark to PDF",
      shortTitle: "Watermark PDF",
      description: "Add a light text watermark to all pages or selected PDF pages locally in your browser.",
      keywords: ["watermark PDF", "add watermark", "no upload", "PDF editor"],
      ai: false,
      pdfTool: "watermark",
      defaultValues: {
        pdfs: "",
        watermarkText: "CONFIDENTIAL",
        pageRange: "all",
        placement: "diagonal",
        opacity: "0.16",
        size: "large",
      },
      fields: [
        { id: "pdfs", label: "PDF file", type: "file", accept: "application/pdf", multiple: false, help: "Select one PDF. It stays in your browser and is not uploaded." },
        { id: "watermarkText", label: "Watermark text", type: "text", maxLength: 48 },
        { id: "pageRange", label: "Pages to watermark", type: "text", maxLength: 80, help: "Use all, a page number, or ranges such as 1,3-5." },
        { id: "placement", label: "Placement", type: "select", options: [["diagonal", "Large diagonal"], ["center", "Centered"], ["footer", "Footer note"]] },
        { id: "opacity", label: "Opacity", type: "select", options: [["0.10", "Very light"], ["0.16", "Light"], ["0.24", "Medium"]] },
        { id: "size", label: "Text size", type: "select", options: [["medium", "Medium"], ["large", "Large"], ["xlarge", "Extra large"]] },
      ],
    },
    "stamp-pdf": {
      id: "stamp-pdf",
      icon: "STAMP",
      title: "Stamp PDF Pages",
      shortTitle: "Stamp PDF",
      description: "Add a simple APPROVED, PAID, DRAFT, or custom text stamp to PDF pages without uploading the file.",
      keywords: ["stamp PDF", "PDF stamp", "paid stamp", "approved stamp"],
      ai: false,
      pdfTool: "stamp",
      defaultValues: {
        pdfs: "",
        stampText: "APPROVED",
        pageRange: "all",
        position: "top-right",
        style: "approved",
      },
      fields: [
        { id: "pdfs", label: "PDF file", type: "file", accept: "application/pdf", multiple: false, help: "Select one PDF. It stays in your browser and is not uploaded." },
        { id: "stampText", label: "Stamp text", type: "text", maxLength: 32 },
        { id: "pageRange", label: "Pages to stamp", type: "text", maxLength: 80, help: "Use all, a page number, or ranges such as 1,3-5." },
        { id: "position", label: "Position", type: "select", options: [["top-right", "Top right"], ["center", "Center"], ["bottom-right", "Bottom right"]] },
        { id: "style", label: "Style", type: "select", options: [["approved", "Approved green"], ["paid", "Paid blue"], ["draft", "Draft gray"], ["urgent", "Urgent red"]] },
      ],
    },
    "sign-pdf": {
      id: "sign-pdf",
      icon: "SIGN",
      title: "Add Signature Text to PDF",
      shortTitle: "Sign PDF",
      description: "Place a typed signature block on a selected PDF page locally in your browser.",
      keywords: ["sign PDF", "add signature to PDF", "typed signature", "no upload"],
      ai: false,
      pdfTool: "signature",
      defaultValues: {
        pdfs: "",
        signatureName: "Your Name",
        signatureDate: "",
        pageNumber: "1",
        position: "bottom-right",
      },
      fields: [
        { id: "pdfs", label: "PDF file", type: "file", accept: "application/pdf", multiple: false, help: "Select one PDF. It stays in your browser and is not uploaded." },
        { id: "signatureName", label: "Signature name", type: "text", maxLength: 60 },
        { id: "signatureDate", label: "Date line", type: "text", maxLength: 40, help: "Optional, for example Jun 1, 2026." },
        { id: "pageNumber", label: "Page number", type: "text", maxLength: 4, help: "Choose the page where the signature block should appear." },
        { id: "position", label: "Position", type: "select", options: [["bottom-right", "Bottom right"], ["bottom-left", "Bottom left"], ["bottom-center", "Bottom center"]] },
      ],
    },
    "text-to-pdf": {
      id: "text-to-pdf",
      icon: "TXT",
      title: "Text to PDF Converter",
      shortTitle: "Text to PDF",
      description: "Paste plain text and download a clean one-page PDF without an account or file upload.",
      keywords: ["text to PDF", "plain text PDF", "no signup", "document"],
      defaultValues: {
        title: "Text to PDF",
        body: "Paste notes, a short letter, instructions, meeting notes, or a plain text document here.\n\nThe free version creates one readable page in your browser.",
        fontSize: "medium",
        paper: "letter",
      },
      fields: [
        { id: "title", label: "PDF title", type: "text", maxLength: 70 },
        { id: "body", label: "Text", type: "textarea", maxLength: 1800, help: "Keep the first version to one page. Long text is trimmed in the preview." },
        { id: "fontSize", label: "Text size", type: "select", options: [["small", "Small"], ["medium", "Medium"], ["large", "Large"]] },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawTextToPdf,
    },
    "markdown-to-pdf": {
      id: "markdown-to-pdf",
      icon: "MD",
      title: "Markdown to PDF Converter",
      shortTitle: "Markdown to PDF",
      description: "Paste Markdown and download a clean PDF preview without installing an editor or uploading a file.",
      keywords: ["Markdown to PDF", "markdown converter", "readme to PDF", "no signup"],
      defaultValues: {
        title: "Markdown to PDF",
        body: "# Project Notes\n\n- Scope: one useful page\n- Status: ready to review\n- Next step: share the PDF\n\n## Summary\nPaste Markdown notes, docs, README text, or meeting outlines here.",
        style: "document",
        paper: "letter",
      },
      fields: [
        { id: "title", label: "PDF title", type: "text", maxLength: 70 },
        { id: "body", label: "Markdown", type: "textarea", maxLength: 2200, help: "Supports headings, bullets, numbered lists, quotes, and simple paragraphs." },
        { id: "style", label: "Style", type: "select", options: [["document", "Document"], ["notes", "Notes"], ["compact", "Compact"]] },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawMarkdownToPdf,
    },
    "csv-to-pdf": {
      id: "csv-to-pdf",
      icon: "CSV",
      title: "CSV to PDF Table Converter",
      shortTitle: "CSV to PDF",
      description: "Paste CSV rows and export a readable PDF table locally in your browser.",
      keywords: ["CSV to PDF", "CSV table", "spreadsheet to PDF", "no upload"],
      defaultValues: {
        title: "CSV Table",
        csv: "Item,Qty,Status\nLabels,24,Ready\nFlyers,40,Print\nCoupons,80,Cut",
        layout: "fit",
        paper: "letter",
      },
      fields: [
        { id: "title", label: "Table title", type: "text", maxLength: 70 },
        { id: "csv", label: "CSV rows", type: "textarea", maxLength: 2200, help: "First row becomes the header. Commas inside quotes are supported." },
        { id: "layout", label: "Layout", type: "select", options: [["fit", "Fit columns"], ["compact", "Compact rows"], ["wide", "Wide first column"]] },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawCsvToPdf,
    },
    "json-to-pdf": {
      id: "json-to-pdf",
      icon: "JSON",
      title: "JSON to PDF Formatter",
      shortTitle: "JSON to PDF",
      description: "Paste JSON and download a readable formatted PDF locally without uploading data.",
      keywords: ["JSON to PDF", "JSON formatter", "pretty print JSON", "no upload"],
      defaultValues: {
        title: "JSON Summary",
        json: "{\n  \"project\": \"PrintableTools Lab\",\n  \"status\": \"validation\",\n  \"tools\": [\"PDF\", \"image\", \"QR\"],\n  \"free\": true\n}",
        theme: "clean",
        paper: "letter",
      },
      fields: [
        { id: "title", label: "PDF title", type: "text", maxLength: 70 },
        { id: "json", label: "JSON", type: "textarea", maxLength: 2600, help: "Formatted locally. Invalid JSON is shown as plain text with a warning." },
        { id: "theme", label: "Theme", type: "select", options: [["clean", "Clean"], ["technical", "Technical"], ["compact", "Compact"]] },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawJsonToPdf,
    },
    "sign-in-sheet": {
      id: "sign-in-sheet",
      icon: "IN",
      title: "Sign-in Sheet Generator",
      shortTitle: "Sign-in sheet",
      description: "Create a printable sign-in sheet PDF for events, classrooms, workshops, meetings, or visitor logs.",
      keywords: ["sign-in sheet", "attendance sheet", "visitor log", "printable"],
      defaultValues: {
        title: "Event Sign-in Sheet",
        event: "Workshop or meeting name",
        date: "2026-06-01",
        rows: "16",
        columns: "name-email-signature",
        notes: "Please print clearly.",
        paper: "letter",
      },
      fields: [
        { id: "title", label: "Sheet title", type: "text", maxLength: 70 },
        { id: "event", label: "Event or class", type: "text", maxLength: 90 },
        { id: "date", label: "Date", type: "text", maxLength: 32 },
        { id: "rows", label: "Rows", type: "select", options: [["12", "12"], ["16", "16"], ["20", "20"], ["24", "24"]] },
        { id: "columns", label: "Columns", type: "select", options: [["name-signature", "Name + signature"], ["name-email-signature", "Name + email + signature"], ["name-phone-signature", "Name + phone + signature"], ["name-time-signature", "Name + time + signature"]] },
        { id: "notes", label: "Small note", type: "text", maxLength: 90 },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawSignInSheet,
    },
    "graph-paper": {
      id: "graph-paper",
      icon: "GRID",
      title: "Graph Paper Generator",
      shortTitle: "Graph paper",
      description: "Generate printable graph paper PDF with quarter-inch, half-inch, or small grid spacing for math, notes, and design sketches.",
      keywords: ["graph paper", "grid paper", "printable PDF", "math paper"],
      ai: false,
      defaultValues: {
        title: "Printable Graph Paper",
        spacing: "0.25",
        style: "major",
        paper: "letter",
        color: "blue",
      },
      fields: [
        { id: "title", label: "Page title", type: "text", maxLength: 70 },
        { id: "spacing", label: "Grid spacing", type: "select", options: [["0.2", "5 lines per inch"], ["0.25", "Quarter inch"], ["0.5", "Half inch"]] },
        { id: "style", label: "Grid style", type: "select", options: [["major", "Major lines"], ["plain", "Plain grid"], ["dots", "Dot grid"]] },
        { id: "color", label: "Line color", type: "select", options: [["blue", "Soft blue"], ["gray", "Gray"], ["green", "Soft green"]] },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawGraphPaper,
    },
    "packing-list": {
      id: "packing-list",
      icon: "BAG",
      title: "Packing List Generator",
      shortTitle: "Packing list",
      description: "Make a printable packing list PDF for travel, school trips, business travel, camping, or family vacations.",
      keywords: ["packing list", "travel checklist", "vacation packing", "printable"],
      defaultValues: {
        title: "Travel Packing List",
        destination: "Weekend trip",
        sections: "Clothing: shirts, pants, socks, sleepwear\nToiletries: toothbrush, toothpaste, shampoo, sunscreen\nDocuments: ID, tickets, reservation notes\nElectronics: phone charger, headphones, power bank",
        notes: "Check weather and luggage limits before packing.",
        paper: "letter",
      },
      fields: [
        { id: "title", label: "List title", type: "text", maxLength: 70 },
        { id: "destination", label: "Trip or destination", type: "text", maxLength: 90 },
        { id: "sections", label: "Packing sections", type: "textarea", maxLength: 680, help: "One section per line: Category: item, item, item" },
        { id: "notes", label: "Reminder note", type: "textarea", maxLength: 220 },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawPackingList,
    },
    "receipt-generator": {
      id: "receipt-generator",
      icon: "REC",
      title: "Receipt Generator",
      shortTitle: "Receipt",
      description: "Create a simple printable receipt PDF for a sale, service payment, deposit, or reimbursement record.",
      keywords: ["receipt generator", "payment receipt", "cash receipt", "PDF receipt"],
      defaultValues: {
        receivedFrom: "Customer Name",
        receivedBy: "Business or recipient",
        description: "Service payment",
        amount: "125.00",
        currency: "USD",
        date: "2026-06-01",
        method: "Card",
        notes: "Payment received for the item or service listed above.",
        paper: "letter",
      },
      fields: [
        { id: "receivedFrom", label: "Received from", type: "text", maxLength: 70 },
        { id: "receivedBy", label: "Received by", type: "text", maxLength: 70 },
        { id: "description", label: "Description", type: "textarea", maxLength: 220 },
        { id: "amount", label: "Amount", type: "text", maxLength: 24 },
        { id: "currency", label: "Currency", type: "select", options: [["USD", "USD $"], ["EUR", "EUR"], ["GBP", "GBP"], ["CAD", "CAD $"], ["AUD", "AUD $"]] },
        { id: "date", label: "Receipt date", type: "text", maxLength: 32 },
        { id: "method", label: "Payment method", type: "text", maxLength: 50 },
        { id: "notes", label: "Note", type: "textarea", maxLength: 180 },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawReceiptGenerator,
    },
    "timesheet-generator": {
      id: "timesheet-generator",
      icon: "TIME",
      title: "Timesheet Generator",
      shortTitle: "Timesheet",
      description: "Make a printable weekly timesheet PDF for freelance hours, staff records, projects, or approvals.",
      keywords: ["timesheet generator", "weekly timesheet", "hours PDF", "work log"],
      defaultValues: {
        title: "Weekly Timesheet",
        worker: "Worker or team member",
        period: "Week of 2026-06-01",
        rows: "Monday | Client project | 8 | Drafting and review\nTuesday | Client project | 7.5 | Revisions\nWednesday | Admin | 2 | Follow-up and notes\nThursday | Client project | 8 | Delivery work\nFriday | Client project | 6 | Handoff",
        notes: "Manager or client approval:",
        paper: "letter",
      },
      fields: [
        { id: "title", label: "Sheet title", type: "text", maxLength: 70 },
        { id: "worker", label: "Worker", type: "text", maxLength: 80 },
        { id: "period", label: "Period", type: "text", maxLength: 80 },
        { id: "rows", label: "Rows", type: "textarea", maxLength: 760, help: "One row per line: Day | Project | Hours | Notes" },
        { id: "notes", label: "Footer note", type: "textarea", maxLength: 180 },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawTimesheet,
    },
    "certificate-generator": {
      id: "certificate-generator",
      icon: "CERT",
      title: "Certificate Generator",
      shortTitle: "Certificate",
      description: "Create a printable certificate PDF for completion, participation, classroom awards, or small events.",
      keywords: ["certificate generator", "certificate PDF", "classroom award", "completion certificate"],
      defaultValues: {
        title: "Certificate of Completion",
        recipient: "Alex Morgan",
        reason: "for completing the reading challenge with focus and effort",
        date: "2026-06-01",
        signer: "PrintableTools Lab",
        style: "classic",
        paper: "letter",
      },
      fields: [
        { id: "title", label: "Certificate title", type: "text", maxLength: 70 },
        { id: "recipient", label: "Recipient", type: "text", maxLength: 70 },
        { id: "reason", label: "Award reason", type: "textarea", maxLength: 220 },
        { id: "date", label: "Date", type: "text", maxLength: 32 },
        { id: "signer", label: "Signer or organization", type: "text", maxLength: 70 },
        { id: "style", label: "Style", type: "select", options: [["classic", "Classic"], ["school", "School"], ["event", "Event"]] },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawCertificate,
    },
    "todo-list": {
      id: "todo-list",
      icon: "TODO",
      title: "To Do List Generator",
      shortTitle: "To do list",
      description: "Build a printable checklist PDF for errands, work tasks, study sessions, home projects, or event prep.",
      keywords: ["to do list", "checklist PDF", "task list", "printable"],
      defaultValues: {
        title: "Today To Do",
        sections: "Top priorities: send update, book appointment, review notes\nErrands: groceries, post office, return item\nHome: laundry, tidy desk, prep dinner\nFollow-up: email Sam, confirm schedule",
        notes: "One page. Pick the few tasks that actually need to move today.",
        paper: "letter",
      },
      fields: [
        { id: "title", label: "List title", type: "text", maxLength: 70 },
        { id: "sections", label: "Sections", type: "textarea", maxLength: 680, help: "One section per line: Category: task, task, task" },
        { id: "notes", label: "Reminder note", type: "textarea", maxLength: 220 },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawTodoList,
    },
    "business-card": {
      id: "business-card",
      icon: "BC",
      title: "Business Card Generator",
      shortTitle: "Business card",
      description: "Create a printable business card PDF sheet for a small business, side project, local service, or event contact card.",
      keywords: ["business card", "printable cards", "small business", "contact card"],
      defaultValues: {
        name: "Maya Chen",
        role: "Mobile Notary",
        business: "Northline Services",
        email: "hello@example.com",
        phone: "(555) 010-2244",
        website: "northline.example",
        tagline: "Appointments by request",
        style: "clean",
        paper: "letter",
      },
      fields: [
        { id: "name", label: "Name", type: "text", maxLength: 70 },
        { id: "role", label: "Role or service", type: "text", maxLength: 70 },
        { id: "business", label: "Business name", type: "text", maxLength: 70 },
        { id: "email", label: "Email", type: "text", maxLength: 80 },
        { id: "phone", label: "Phone", type: "text", maxLength: 50 },
        { id: "website", label: "Website or social", type: "text", maxLength: 80 },
        { id: "tagline", label: "Short tagline", type: "text", maxLength: 90 },
        { id: "style", label: "Style", type: "select", options: [["clean", "Clean"], ["bold", "Bold"], ["soft", "Soft"]] },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawBusinessCard,
    },
    "address-labels": {
      id: "address-labels",
      icon: "LBL",
      title: "Address Label Generator",
      shortTitle: "Address labels",
      description: "Make a printable sheet of return address labels, mailing labels, classroom labels, or event badge labels.",
      keywords: ["address labels", "mailing labels", "label PDF", "return address"],
      defaultValues: {
        labelTitle: "Northline Services",
        recipient: "Maya Chen",
        address: "120 Market Street\nSuite 400\nSan Francisco, CA 94105",
        note: "Appointments by request",
        layout: "30",
        style: "address",
        paper: "letter",
      },
      fields: [
        { id: "labelTitle", label: "Label title", type: "text", maxLength: 70 },
        { id: "recipient", label: "Recipient or line 1", type: "text", maxLength: 80 },
        { id: "address", label: "Address or label text", type: "textarea", maxLength: 180 },
        { id: "note", label: "Small note", type: "text", maxLength: 80 },
        { id: "layout", label: "Labels per page", type: "select", options: [["30", "30 address labels"], ["14", "14 shipping-style labels"], ["10", "10 badge labels"]] },
        { id: "style", label: "Label type", type: "select", options: [["address", "Address"], ["classroom", "Classroom"], ["event", "Event"]] },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      ai: false,
      draw: drawAddressLabels,
    },
    "price-tag": {
      id: "price-tag",
      icon: "$$",
      title: "Price Tag Generator",
      shortTitle: "Price tags",
      description: "Create printable price tags or shelf labels for yard sales, craft fairs, pop-up shops, and small retail displays.",
      keywords: ["price tag", "shelf label", "yard sale", "retail label"],
      defaultValues: {
        title: "Summer Sale",
        price: "$12",
        subtitle: "Handmade candle",
        footer: "Buy 2, save 10%",
        count: "8",
        theme: "sale",
        paper: "letter",
      },
      fields: [
        { id: "title", label: "Tag title", type: "text", maxLength: 60 },
        { id: "price", label: "Price", type: "text", maxLength: 30 },
        { id: "subtitle", label: "Subtitle", type: "text", maxLength: 90 },
        { id: "footer", label: "Small footer", type: "text", maxLength: 90 },
        { id: "count", label: "Tags per page", type: "select", options: [["8", "8 large tags"], ["10", "10 medium tags"], ["12", "12 small tags"]] },
        { id: "theme", label: "Theme", type: "select", options: [["sale", "Sale"], ["minimal", "Minimal"], ["market", "Market"]] },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawPriceTag,
    },
    "flyer-maker": {
      id: "flyer-maker",
      icon: "FLY",
      title: "Flyer Maker PDF",
      shortTitle: "Flyer",
      description: "Make a one-page printable flyer PDF for a local service, yard sale, class, community event, or small business offer.",
      keywords: ["flyer maker", "poster PDF", "event flyer", "small business flyer"],
      defaultValues: {
        headline: "Weekend Yard Sale",
        subhead: "Saturday 9 AM - 2 PM",
        details: "Home goods, books, kids clothes, small furniture, and kitchen items. Cash and card accepted.",
        callToAction: "Stop by early for the best selection",
        contact: "120 Market Street",
        theme: "community",
        paper: "letter",
      },
      fields: [
        { id: "headline", label: "Headline", type: "text", maxLength: 70 },
        { id: "subhead", label: "Subhead", type: "text", maxLength: 90 },
        { id: "details", label: "Details", type: "textarea", maxLength: 420 },
        { id: "callToAction", label: "Call to action", type: "text", maxLength: 100 },
        { id: "contact", label: "Contact or location", type: "text", maxLength: 120 },
        { id: "theme", label: "Theme", type: "select", options: [["community", "Community"], ["service", "Service"], ["sale", "Sale"]] },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawFlyer,
    },
    "barcode-labels": {
      id: "barcode-labels",
      icon: "BAR",
      title: "Barcode Label Generator",
      shortTitle: "Barcode labels",
      description: "Generate printable Code 39 barcode labels for inventory bins, event check-in, SKU stickers, and internal tracking.",
      keywords: ["barcode generator", "barcode labels", "SKU labels", "inventory labels"],
      defaultValues: {
        title: "Inventory Labels",
        codes: "SKU-1001 | Beeswax Candle\nSKU-1002 | Lavender Soap\nSKU-1003 | Market Tote\nSKU-1004 | Gift Box",
        layout: "12",
        showText: "yes",
        paper: "letter",
      },
      fields: [
        { id: "title", label: "Sheet title", type: "text", maxLength: 70 },
        { id: "codes", label: "Codes", type: "textarea", maxLength: 620, help: "One label per line: CODE | label. Code 39 supports A-Z, 0-9, space, dash, dot, $, /, +, %." },
        { id: "layout", label: "Labels per page", type: "select", options: [["8", "8 large labels"], ["12", "12 standard labels"], ["20", "20 compact labels"]] },
        { id: "showText", label: "Human-readable text", type: "select", options: [["yes", "Show code text"], ["no", "Hide code text"]] },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      ai: false,
      draw: drawBarcodeLabels,
    },
    "coupon-maker": {
      id: "coupon-maker",
      icon: "CPN",
      title: "Coupon Maker PDF",
      shortTitle: "Coupons",
      description: "Create printable coupon cards for a local service, class, pop-up event, small shop, or limited-time offer.",
      keywords: ["coupon maker", "printable coupons", "discount card", "small business promo"],
      defaultValues: {
        business: "Northline Services",
        offer: "10% off your first appointment",
        details: "Show this coupon when booking a weekday service.",
        code: "WELCOME10",
        expires: "Valid through July 31",
        finePrint: "One coupon per customer. Not redeemable for cash.",
        style: "bold",
        paper: "letter",
      },
      fields: [
        { id: "business", label: "Business or event", type: "text", maxLength: 70 },
        { id: "offer", label: "Offer", type: "text", maxLength: 90 },
        { id: "details", label: "Details", type: "textarea", maxLength: 240 },
        { id: "code", label: "Coupon code", type: "text", maxLength: 40 },
        { id: "expires", label: "Expiration note", type: "text", maxLength: 60 },
        { id: "finePrint", label: "Fine print", type: "textarea", maxLength: 180 },
        { id: "style", label: "Style", type: "select", options: [["bold", "Bold"], ["clean", "Clean"], ["market", "Market"]] },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawCoupon,
    },
    "packing-slip": {
      id: "packing-slip",
      icon: "PKG",
      title: "Packing Slip Generator",
      shortTitle: "Packing slip",
      description: "Create a printable packing slip PDF for small orders, marketplace sales, local delivery, and handmade product shipments.",
      keywords: ["packing slip", "order packing", "shipping insert", "small business"],
      defaultValues: {
        business: "Northline Market\nhello@example.com",
        recipient: "Customer Name\n123 Maple Street\nAustin, TX 78701",
        orderNo: "ORDER-1042",
        date: "2026-06-01",
        items: "Beeswax candle | 2 | Packed\nLavender soap | 1 | Packed\nThank-you card | 1 | Inserted",
        notes: "Thank you for your order. Please check the package contents on arrival.",
        paper: "letter",
      },
      fields: [
        { id: "business", label: "Business or sender", type: "textarea", maxLength: 140 },
        { id: "recipient", label: "Ship to", type: "textarea", maxLength: 180 },
        { id: "orderNo", label: "Order number", type: "text", maxLength: 40 },
        { id: "date", label: "Ship date", type: "text", maxLength: 32 },
        { id: "items", label: "Items", type: "textarea", maxLength: 520, help: "One item per line: Item | Qty | Status" },
        { id: "notes", label: "Packing note", type: "textarea", maxLength: 180 },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawPackingSlip,
    },
    "work-order": {
      id: "work-order",
      icon: "WO",
      title: "Work Order Generator",
      shortTitle: "Work order",
      description: "Make a work order PDF for repairs, field service, maintenance visits, cleaning jobs, and contractor tasks.",
      keywords: ["work order", "service order", "maintenance", "contractor form"],
      defaultValues: {
        business: "Northline Services\nservice@example.com",
        client: "Client Name\nclient@example.com",
        orderNo: "WO-1007",
        date: "2026-06-01",
        due: "Scheduled: 2026-06-05 10:00 AM",
        items: "Inspect kitchen sink | 1 | 0\nReplace faucet cartridge | 1 | 85\nCleanup and test | 1 | 25",
        instructions: "Bring replacement cartridge and confirm water shutoff location before starting.",
        notes: "Client approval required before additional parts or labor.",
        currency: "USD",
        paper: "letter",
      },
      fields: [
        { id: "business", label: "Service provider", type: "textarea", maxLength: 140 },
        { id: "client", label: "Client or site", type: "textarea", maxLength: 160 },
        { id: "orderNo", label: "Work order number", type: "text", maxLength: 40 },
        { id: "date", label: "Created date", type: "text", maxLength: 32 },
        { id: "due", label: "Schedule or status", type: "text", maxLength: 70 },
        { id: "items", label: "Tasks or charges", type: "textarea", maxLength: 520, help: "One task per line: Task | Qty | Rate" },
        { id: "instructions", label: "Instructions", type: "textarea", maxLength: 240 },
        { id: "notes", label: "Approval note", type: "textarea", maxLength: 180 },
        { id: "currency", label: "Currency", type: "select", options: [["USD", "USD $"], ["EUR", "EUR"], ["GBP", "GBP"], ["CAD", "CAD $"], ["AUD", "AUD $"]] },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawWorkOrder,
    },
    "inventory-sheet": {
      id: "inventory-sheet",
      icon: "INV",
      title: "Inventory Sheet Generator",
      shortTitle: "Inventory",
      description: "Create a printable inventory count sheet PDF for stock checks, craft fairs, storage bins, classroom supplies, and small retail shelves.",
      keywords: ["inventory sheet", "stock count", "inventory checklist", "small business"],
      defaultValues: {
        title: "Inventory Count Sheet",
        location: "Market table A",
        date: "2026-06-01",
        items: "SKU-1001 | Beeswax candle | 24 | 18 | Restock\nSKU-1002 | Lavender soap | 30 | 27 | OK\nSKU-1003 | Market tote | 12 | 9 | Reorder",
        columns: "sku",
        notes: "Count before opening and after closing. Review low-stock items first.",
        paper: "letter",
      },
      fields: [
        { id: "title", label: "Sheet title", type: "text", maxLength: 70 },
        { id: "location", label: "Location or event", type: "text", maxLength: 80 },
        { id: "date", label: "Count date", type: "text", maxLength: 32 },
        { id: "items", label: "Inventory rows", type: "textarea", maxLength: 760, help: "One row per line: SKU | Item | Expected | Counted | Note" },
        { id: "columns", label: "Layout", type: "select", options: [["sku", "SKU + expected count"], ["simple", "Simple item count"], ["restock", "Restock notes"]] },
        { id: "notes", label: "Footer note", type: "textarea", maxLength: 180 },
        { id: "paper", label: "Paper size", type: "select", options: [["letter", "US Letter"], ["a4", "A4"]] },
      ],
      draw: drawInventorySheet,
    },
  };

  const keywordClusters = [
    {
      title: "Kids routine charts",
      description: "Morning, bedtime, chore, and reward charts for families who want a visible routine instead of another app.",
      links: [
        ["Chore chart generator", "/tools/chore-chart/"],
        ["Bedtime routine chart printable", "/guides/bedtime-routine-chart-printable/"],
        ["Printable morning routine chart ideas", "/guides/printable-routine-chart-for-mornings/"],
      ],
    },
    {
      title: "Preschool worksheets",
      description: "Name tracing, handwriting warmups, and short black-and-white pages designed for ordinary home printers.",
      links: [
        ["Name tracing worksheet generator", "/tools/name-tracing/"],
        ["Free printable name tracing worksheet maker", "/guides/free-printable-name-tracing-worksheet-maker/"],
        ["Printable worksheets for preschool at home", "/guides/printable-worksheets-for-preschool-at-home/"],
      ],
    },
    {
      title: "Classroom printables",
      description: "Fast one-page resources for teachers, tutors, homeschool groups, and small classroom routines.",
      links: [
        ["Flashcard generator", "/tools/flashcards/"],
        ["Classroom job chart printable", "/guides/classroom-job-chart-printable/"],
        ["Printable flashcard generator guide", "/guides/flashcard-generator-printable-guide/"],
      ],
    },
    {
      title: "Family planning pages",
      description: "Weekly planners, monthly calendars, meal plans, habit trackers, and simple pages for families that need one visible plan.",
      links: [
        ["Weekly planner generator", "/tools/weekly-planner/"],
        ["Monthly calendar generator", "/tools/monthly-calendar/"],
        ["Meal planner generator", "/tools/meal-planner/"],
        ["Habit tracker generator", "/tools/habit-tracker/"],
      ],
    },
    {
      title: "Everyday file utilities",
      description: "High-intent image, QR, and PDF tools for compression, resizing, format conversion, static QR codes, existing PDF editing, text conversion, checklists, sign-in sheets, graph paper, and travel paperwork.",
      links: [
        ["Image to PDF converter", "/tools/image-to-pdf/"],
        ["JPG to PDF without uploading", "/jpg-to-pdf-no-upload/"],
        ["Multiple images to PDF", "/tools/multi-image-pdf/"],
        ["Multiple images to PDF without uploading", "/multiple-images-to-pdf-no-upload/"],
        ["Compress PDF", "/tools/compress-pdf/"],
        ["Compress PDF without uploading", "/compress-pdf-no-upload/"],
        ["Compress PDF to 500KB", "/compress-pdf-to-500kb/"],
        ["Compress PDF to 1MB", "/compress-pdf-to-1mb/"],
        ["Compress PDF to 2MB", "/compress-pdf-to-2mb/"],
        ["Compress PDF to 5MB", "/compress-pdf-to-5mb/"],
        ["PDF to JPG converter", "/tools/pdf-to-images/"],
        ["PDF to JPG without uploading", "/pdf-to-jpg-no-upload/"],
        ["PDF to text converter", "/tools/pdf-to-text/"],
        ["Extract text from PDF without uploading", "/extract-text-from-pdf-no-upload/"],
        ["PDF to Word converter", "/tools/pdf-to-word/"],
        ["PDF to Word without uploading", "/pdf-to-word-no-upload/"],
        ["Compress image", "/tools/compress-image/"],
        ["Compress image without uploading", "/compress-image-no-upload/"],
        ["Compress image to KB", "/tools/compress-image-to-kb/"],
        ["Compress image to 50KB", "/compress-image-to-50kb/"],
        ["Compress image to 100KB", "/compress-image-to-100kb/"],
        ["Compress image to 200KB", "/compress-image-to-200kb/"],
        ["Compress image to 500KB", "/compress-image-to-500kb/"],
        ["Resize image", "/tools/resize-image/"],
        ["Resize image without uploading", "/resize-image-no-upload/"],
        ["Convert image format", "/tools/convert-image/"],
        ["Convert image format without uploading", "/convert-image-format-no-upload/"],
        ["Remove background", "/tools/remove-background/"],
        ["Transparent PNG maker", "/remove-background-no-upload/"],
        ["Crop image", "/tools/crop-image/"],
        ["Crop image without uploading", "/crop-image-no-upload/"],
        ["Rotate image", "/tools/rotate-image/"],
        ["Rotate image without uploading", "/rotate-image-no-upload/"],
        ["Watermark image", "/tools/watermark-image/"],
        ["Watermark image without uploading", "/watermark-image-no-upload/"],
        ["Add text to image", "/tools/add-text-image/"],
        ["Add text to photo", "/add-text-to-image-no-upload/"],
        ["Signature PNG generator", "/tools/signature-png/"],
        ["Transparent signature PNG", "/signature-png-generator/"],
        ["Passport photo maker", "/tools/passport-photo/"],
        ["Passport photo 2x2 maker", "/passport-photo-maker/"],
        ["Free QR code generator", "/tools/qr-code/"],
        ["QR code generator without signup", "/free-qr-code-generator-no-signup/"],
        ["WiFi QR code generator", "/tools/wifi-qr-code/"],
        ["Printable WiFi QR code", "/wifi-qr-code-generator/"],
        ["Contact QR code generator", "/tools/vcard-qr-code/"],
        ["vCard contact QR code", "/contact-qr-code-generator/"],
        ["Compress JPG", "/compress-jpg-no-upload/"],
        ["Compress PNG", "/compress-png-no-upload/"],
        ["Upload limit fixer", "/upload-limit-fixer/"],
        ["Image size reducer in KB", "/image-size-reducer-in-kb/"],
        ["PDF size reducer", "/pdf-size-reducer/"],
        ["Resize image to 1080x1080", "/resize-image-1080x1080/"],
        ["Resize image to 512x512", "/resize-image-512x512/"],
        ["PNG to JPG", "/png-to-jpg-no-upload/"],
        ["WebP to JPG", "/webp-to-jpg-no-upload/"],
        ["Merge PDF without uploading", "/merge-pdf-no-upload/"],
        ["Split PDF without uploading", "/split-pdf-no-upload/"],
        ["Add page numbers to PDF", "/add-page-numbers-to-pdf/"],
        ["Rotate PDF pages", "/tools/rotate-pdf/"],
        ["Rotate PDF pages without uploading", "/rotate-pdf-no-upload/"],
        ["Remove PDF pages", "/tools/remove-pdf-pages/"],
        ["Remove pages from PDF without uploading", "/remove-pages-from-pdf-no-upload/"],
        ["Reorder PDF pages", "/tools/reorder-pdf-pages/"],
        ["Reorder PDF pages without uploading", "/reorder-pdf-pages-no-upload/"],
        ["Watermark PDF", "/tools/watermark-pdf/"],
        ["Watermark PDF without uploading", "/watermark-pdf-no-upload/"],
        ["Stamp PDF", "/tools/stamp-pdf/"],
        ["Stamp PDF without uploading", "/stamp-pdf-no-upload/"],
        ["Add signature text to PDF", "/tools/sign-pdf/"],
        ["Sign PDF without uploading", "/sign-pdf-no-upload/"],
        ["Text to PDF converter", "/tools/text-to-pdf/"],
        ["Text to PDF converter without signup", "/text-to-pdf-no-signup/"],
        ["Markdown to PDF converter", "/tools/markdown-to-pdf/"],
        ["Markdown to PDF without signup", "/markdown-to-pdf-no-signup/"],
        ["CSV to PDF table converter", "/tools/csv-to-pdf/"],
        ["CSV to PDF without uploading", "/csv-to-pdf-no-upload/"],
        ["JSON to PDF formatter", "/tools/json-to-pdf/"],
        ["JSON to PDF without uploading", "/json-to-pdf-no-upload/"],
        ["Sign-in sheet generator", "/tools/sign-in-sheet/"],
        ["Graph paper generator", "/tools/graph-paper/"],
        ["Packing list generator", "/tools/packing-list/"],
        ["To do list generator", "/tools/todo-list/"],
      ],
    },
    {
      title: "Business paperwork",
      description: "Clean PDF invoices, estimates, purchase orders, sale records, receipts, work orders, packing slips, inventory sheets, and timesheets for people who need a document now.",
      links: [
        ["Invoice generator", "/tools/invoice-generator/"],
        ["Free invoice generator without signup", "/free-invoice-generator-no-signup/"],
        ["Invoice follow-up email generator", "/tools/invoice-followup-email/"],
        ["Free invoice follow-up email template", "/invoice-follow-up-email-template/"],
        ["Estimate generator", "/tools/estimate-generator/"],
        ["Purchase order generator", "/tools/purchase-order/"],
        ["Packing slip generator", "/tools/packing-slip/"],
        ["Work order generator", "/tools/work-order/"],
        ["Inventory sheet generator", "/tools/inventory-sheet/"],
        ["Business card generator", "/tools/business-card/"],
        ["Address label generator", "/tools/address-labels/"],
        ["Barcode label generator", "/tools/barcode-labels/"],
        ["Receipt generator", "/tools/receipt-generator/"],
        ["Free receipt generator without signup", "/free-receipt-generator-no-signup/"],
        ["Timesheet generator", "/tools/timesheet-generator/"],
        ["Weekly timesheet PDF without signup", "/weekly-timesheet-pdf-no-signup/"],
        ["Rent receipt generator", "/tools/rent-receipt/"],
      ],
    },
    {
      title: "Events and awards",
      description: "Printable certificates, sign-in sheets, and checklists for small events, classrooms, workshops, and clubs.",
      links: [
        ["Certificate generator", "/tools/certificate-generator/"],
        ["Free certificate maker without signup", "/free-certificate-maker-no-signup/"],
        ["Flyer maker", "/tools/flyer-maker/"],
        ["Coupon maker", "/tools/coupon-maker/"],
        ["Price tag generator", "/tools/price-tag/"],
        ["Sign-in sheet generator", "/tools/sign-in-sheet/"],
        ["To do list generator", "/tools/todo-list/"],
      ],
    },
    {
      title: "Career documents",
      description: "Free resume, cover letter, and resignation letter PDFs for job seekers who need useful documents without a surprise paywall.",
      links: [
        ["Resume builder PDF", "/tools/resume-builder/"],
        ["Free resume builder without signup", "/free-resume-builder-no-signup/"],
        ["ATS resume checker", "/tools/ats-resume-checker/"],
        ["ATS resume checker free", "/ats-resume-checker-free/"],
        ["Cover letter generator", "/tools/cover-letter/"],
        ["Resignation letter generator", "/tools/resignation-letter/"],
        ["Free resume builder PDF guide", "/guides/free-resume-builder-pdf/"],
        ["ATS resume keyword match guide", "/guides/ats-resume-keyword-match/"],
      ],
    },
  ];

  const freePdfToolGroups = [
    {
      title: "No-upload conversion tools",
      description: "Use these when a photo, scan, QR code, existing PDF, plain text, Markdown, CSV, or JSON snippet needs to become the right file quickly. Files load in the browser instead of uploading to a converter server.",
      links: ["image-to-pdf", "multi-image-pdf", "compress-pdf", "pdf-to-images", "pdf-to-text", "pdf-to-word", "compress-image", "compress-image-to-kb", "resize-image", "convert-image", "remove-background", "crop-image", "rotate-image", "watermark-image", "add-text-image", "signature-png", "passport-photo", "qr-code", "wifi-qr-code", "vcard-qr-code", "merge-pdf", "split-pdf", "pdf-page-numbers", "rotate-pdf", "remove-pdf-pages", "reorder-pdf-pages", "watermark-pdf", "stamp-pdf", "sign-pdf", "text-to-pdf", "markdown-to-pdf", "csv-to-pdf", "json-to-pdf"],
    },
    {
      title: "Free business PDF tools",
      description: "Create simple paperwork for freelance jobs, small services, deposits, work orders, packing slips, inventory counts, timesheets, private sales, rent payments, and vendor orders without opening a full accounting app.",
      links: ["invoice-generator", "invoice-followup-email", "estimate-generator", "purchase-order", "receipt-generator", "timesheet-generator", "bill-of-sale", "rent-receipt", "packing-slip", "work-order", "inventory-sheet", "business-card", "address-labels", "barcode-labels"],
    },
    {
      title: "Free career PDF tools",
      description: "Make a clean resume, cover letter, or resignation letter PDF without the common hidden export fee many document builders add at the end.",
      links: ["resume-builder", "ats-resume-checker", "cover-letter", "resignation-letter"],
    },
    {
      title: "Free printable planning tools",
      description: "Print one-page calendars, meal plans, checklists, graph paper, certificates, and routine pages for home, school, work, or events.",
      links: ["monthly-calendar", "meal-planner", "todo-list", "graph-paper", "certificate-generator", "sign-in-sheet", "packing-list", "flyer-maker", "price-tag", "coupon-maker"],
    },
  ];

  const uploadLimitShortcuts = [
    ["PDF size reducer", "/pdf-size-reducer/", "Pick 500KB, 1MB, 2MB, or 5MB PDF targets for scanned forms and portal uploads.", "compress-pdf"],
    ["Image size reducer in KB", "/image-size-reducer-in-kb/", "Choose exact image and photo targets from 10KB through 500KB without uploading.", "compress-image-to-kb"],
    ["Compress PDF to 1MB", "/compress-pdf-to-1mb/", "A common job, school, email, and admin portal PDF limit.", "compress-pdf"],
    ["Compress PDF to 500KB", "/compress-pdf-to-500kb/", "A strict PDF target for forms, exam portals, and government-style uploads.", "compress-pdf"],
    ["Compress image to 100KB", "/compress-image-to-100kb/", "A common profile, job, school, and form photo limit.", "compress-image-to-kb"],
    ["Compress JPG to 100KB", "/compress-jpg-to-100kb/", "Use this when the destination asks for JPG and a fixed 100KB limit.", "compress-image-to-kb"],
    ["Compress PNG to 100KB", "/compress-png-to-100kb/", "Use this when a screenshot, graphic, or form upload must stay PNG under 100KB.", "compress-image-to-kb"],
    ["Passport photo size fixer", "/passport-photo-size-fixer/", "Crop, resize, and compress ID-style photos for dimension and file-size rules.", "passport-photo"],
  ];

  const uploadLimitDecisions = [
    ["PDF must be under 1MB", "/tools/compress-pdf/?targetSize=1mb", "Compress PDF", "Use the PDF compressor with the 1MB target for job, school, email, and admin portals.", "compress-pdf"],
    ["PDF must be under 500KB", "/tools/compress-pdf/?targetSize=500kb", "Compress PDF", "Use the strict 500KB target for forms and exam-style upload limits.", "compress-pdf"],
    ["Image must be under 2MB", "/tools/compress-image-to-kb/?targetKb=2048", "Compress image", "Use a 2048KB custom target when the upload page names a 2MB image cap.", "compress-image-to-kb"],
    ["Image must be under 500KB", "/tools/compress-image-to-kb/?targetKb=500", "Compress image", "Use the 500KB image target for profile, marketplace, and portal uploads.", "compress-image-to-kb"],
    ["Photo or image must be under 100KB", "/tools/compress-image-to-kb/?targetKb=100", "Compress image to KB", "Use the image-to-KB compressor when the site names a fixed photo or image file-size limit.", "compress-image-to-kb"],
    ["JPG must be under 100KB", "/tools/compress-image-to-kb/?targetKb=100", "Compress JPG", "Start with the 100KB target and export a smaller JPG or WebP copy locally.", "compress-image-to-kb"],
    ["JPG must be under 200KB", "/tools/compress-image-to-kb/?targetKb=200", "Compress JPG", "Start with the 200KB target when a profile or application form gives a JPG cap.", "compress-image-to-kb"],
    ["PNG screenshot is too large", "/tools/compress-image-to-kb/?targetKb=500", "Compress PNG", "Use this when a support form, portal, or profile page accepts PNG but rejects the screenshot size.", "compress-image-to-kb"],
    ["Resume PDF is too large", "/tools/compress-pdf/?targetSize=1mb", "Compress resume PDF", "Try the 1MB PDF target, then review that resume text remains readable before submitting.", "compress-pdf"],
    ["Email attachment is too large", "/tools/compress-pdf/?targetSize=5mb", "Compress PDF for email", "Start with the 5MB PDF target for large scanned attachments and email limits.", "compress-pdf"],
    ["Wrong file type: needs JPG or PNG", "/tools/convert-image/", "Convert image", "Convert JPG, PNG, or WebP locally when the upload form rejects the current image type.", "convert-image"],
    ["Wrong image dimensions", "/tools/resize-image/", "Resize image", "Resize first when the portal gives width, height, square, thumbnail, or profile-photo dimensions.", "resize-image"],
    ["Passport or ID photo rejected", "/passport-photo-size-fixer/", "Fix passport photo", "Crop, resize, and compress ID-style photos when both dimensions and KB limits matter.", "passport-photo"],
    ["Website accepts image but rejects PDF", "/tools/pdf-to-images/", "PDF to JPG", "Convert PDF pages to JPG or PNG when a form wants image files instead of a PDF.", "pdf-to-images"],
    ["Website accepts PDF but I only have photos", "/tools/image-to-pdf/", "Image to PDF", "Turn a photo, scan, screenshot, or receipt image into a PDF locally.", "image-to-pdf"],
  ];
  const uploadLimitMatcherDefault = {
    badge: "Common match",
    title: "PDF under 1MB",
    href: "/tools/compress-pdf/?targetSize=1mb",
    label: "Open PDF compressor",
    why: "Starts the compressor with the 1MB target already selected.",
    trackTool: "compress-pdf",
  };
  const uploadLimitMatcherExamples = [
    "PDF must be less than 1 MB",
    "Image must be less than 2 MB",
    "Photo must be under 100 KB",
    "Resume PDF too large",
    "Invalid file type. Please upload JPG or PNG",
    "Image dimensions must be 600 x 600 px",
  ];

  const landingPages = [
    {
      slug: "upload-limit-fixer",
      title: "Free Upload Limit Fixer",
      headline: "Fix a file upload limit without signup",
      description: "Find the right free no-upload tool when a form rejects your PDF, image, photo, or document because of file size, format, or dimensions.",
      lead: "Start here when a job application, school portal, marketplace, visa-style form, email, or admin website rejects a file because it is too large, the wrong format, or the wrong image dimensions.",
      tool: "compress-image-to-kb",
      intent: "file upload limit fixer, reduce file size, convert file format, resize photo",
      sections: [
        ["Start from the error message", "If the site says PDF must be under 1MB or 500KB, use the PDF compressor. If it says image must be under 100KB or 200KB, use the image-to-KB compressor. If it asks for JPG, PNG, PDF, or a specific pixel size, choose the matching converter or resizer."],
        ["Keep the file local", "The linked PDF and image tools run in the browser for ordinary use. That is useful when the blocked upload is a resume, ID-style photo, school form, receipt, support screenshot, or private document."],
        ["Review before submitting", "Small file-size targets can blur text, flatten PDF text, or reduce photo detail. Always open the downloaded result before uploading it to the destination website."],
      ],
      related: ["compress-pdf", "compress-image-to-kb", "resize-image", "passport-photo", "pdf-to-images", "image-to-pdf"],
    },
    {
      slug: "file-must-be-less-than-1mb",
      title: "File Must Be Less Than 1MB Fix",
      headline: "Fix file must be less than 1 MB",
      description: "Fix a file must be less than 1MB upload error with free no-signup PDF and image size tools.",
      lead: "Use this when a job portal, school form, email upload, support form, or admin website rejects a file with a message like file must be less than 1 MB.",
      tool: "compress-pdf",
      toolQuery: "targetSize=1mb",
      intent: "file must be less than 1MB, upload file too large, reduce file size",
      uploadErrorMatcher: true,
      sections: [
        ["Start with the file type", "If the blocked file is a PDF, open the PDF compressor with the 1MB target. If it is a photo or screenshot, use the image-to-KB compressor and choose the closest KB target."],
        ["Why this query is urgent", "This error usually appears after the user already has the right document and is trying to submit it. The fastest path is a direct target-size tool, not a general editor."],
        ["Review before upload", "A 1MB target can reduce detail or flatten PDF text. Open the downloaded result before submitting it to the destination website."],
      ],
      related: ["compress-pdf", "compress-image-to-kb", "resize-image"],
    },
    {
      slug: "pdf-must-be-under-500kb",
      title: "PDF Must Be Under 500KB Fix",
      headline: "Fix PDF must be under 500KB",
      description: "Try to reduce a PDF toward a 500KB upload limit locally when a form says the PDF must be under 500KB.",
      lead: "Use this when a form, exam portal, school system, or application page rejects a PDF with a strict 500KB limit.",
      tool: "compress-pdf",
      toolQuery: "targetSize=500kb",
      intent: "PDF must be under 500KB, compress PDF to 500KB, upload limit error",
      uploadErrorMatcher: true,
      sections: [
        ["Use the strict PDF target", "Open the PDF compressor with the 500KB target already selected. This is the smallest built-in PDF target and works best for short scanned documents."],
        ["Know the tradeoff", "A 500KB target is aggressive. Long PDFs, text-heavy documents, or high-detail scans may lose clarity or still miss the exact limit."],
        ["If it still fails", "Split the PDF, convert pages to images, or compress source photos before rebuilding the final upload file."],
      ],
      related: ["compress-pdf", "split-pdf", "pdf-to-images"],
    },
    {
      slug: "photo-must-be-under-100kb",
      title: "Photo Must Be Under 100KB Fix",
      headline: "Fix photo must be under 100KB",
      description: "Compress a photo toward 100KB locally when a job, profile, school, or application form rejects the image file size.",
      lead: "Use this when a form says a photo, image, profile picture, or ID-style upload must be under 100KB.",
      tool: "compress-image-to-kb",
      toolQuery: "targetKb=100",
      intent: "photo must be under 100KB, image under 100KB, upload photo too large",
      uploadErrorMatcher: true,
      sections: [
        ["Use the 100KB image target", "Open the image-to-KB compressor with 100KB selected, then download a smaller JPG or WebP copy from the browser."],
        ["Resize first if dimensions matter", "If the same portal also gives exact width and height, resize or crop before compressing to the KB limit."],
        ["Check face and text clarity", "Small file-size targets can soften faces, text, screenshots, and document photos. Review the output before submitting."],
      ],
      related: ["compress-image-to-kb", "resize-image", "passport-photo"],
    },
    {
      slug: "invalid-file-type-jpg-png",
      title: "Invalid File Type JPG or PNG Fix",
      headline: "Fix invalid file type: upload JPG or PNG",
      description: "Convert an image locally when an upload form says invalid file type and asks for JPG, JPEG, or PNG.",
      lead: "Use this when a website rejects an image because the file type is unsupported, or the message says to upload JPG, JPEG, or PNG.",
      tool: "convert-image",
      intent: "invalid file type JPG PNG, upload JPG or PNG, convert image type",
      uploadErrorMatcher: true,
      sections: [
        ["Convert the image format", "Open the image converter and export a JPG, PNG, or WebP copy that matches the destination website's accepted file type."],
        ["Then check file size", "Changing format can increase or decrease file size. If the converted image is still too large, run it through the image-to-KB compressor."],
        ["Transparency warning", "JPG does not preserve transparency. Use PNG when transparent background or sharp graphics matter and the portal accepts PNG."],
      ],
      related: ["convert-image", "compress-image-to-kb", "resize-image"],
    },
    {
      slug: "image-dimensions-600x600",
      title: "Image Dimensions 600x600 Fix",
      headline: "Fix image dimensions must be 600 x 600",
      description: "Resize or crop an image to 600 x 600 pixels locally when a profile, marketplace, or form upload requires exact dimensions.",
      lead: "Use this when an upload page rejects a photo, product image, avatar, or screenshot because it must be exactly 600 x 600 pixels.",
      tool: "resize-image",
      toolQuery: "width=600&height=600&fit=cover",
      intent: "image dimensions 600x600, resize image to 600x600, exact pixel upload error",
      uploadErrorMatcher: true,
      sections: [
        ["Resize to exact pixels", "Open the image resizer with 600 x 600 prefilled. The cover crop option helps make a square output instead of leaving blank space."],
        ["Crop important content", "Square resizing can cut off edges. Check that faces, product details, logos, or document text remain visible."],
        ["Compress after resizing", "If the 600 x 600 image still exceeds a KB limit, compress the resized result with the image-to-KB tool."],
      ],
      related: ["resize-image", "crop-image", "compress-image-to-kb"],
    },
    {
      slug: "pdf-not-accepted-jpg-required",
      title: "PDF Not Accepted JPG Required Fix",
      headline: "Fix PDF not accepted, JPG required",
      description: "Convert PDF pages to JPG or PNG locally when a website accepts images but rejects a PDF upload.",
      lead: "Use this when a form or website rejects a PDF and asks for JPG, JPEG, PNG, photo, or image files instead.",
      tool: "pdf-to-images",
      intent: "PDF not accepted JPG required, website accepts image not PDF, convert PDF to JPG",
      uploadErrorMatcher: true,
      sections: [
        ["Convert PDF pages to images", "Open the PDF-to-images tool and export selected pages as JPG or PNG files from the browser."],
        ["Watch page count", "If the PDF has several pages, each page becomes its own image. Some websites expect one image per upload field."],
        ["Compress images if needed", "Converted pages can still be large. If the upload page also has a KB limit, compress the resulting image before submitting."],
      ],
      related: ["pdf-to-images", "compress-image-to-kb", "image-to-pdf"],
    },
    {
      slug: "image-must-be-less-than-2mb",
      title: "Image Must Be Less Than 2MB Fix",
      headline: "Fix image must be less than 2 MB",
      description: "Compress an image locally toward a 2MB upload cap when a profile, marketplace, support, or application form rejects the file.",
      lead: "Use this when a website says an image, photo, screenshot, avatar, or product picture must be less than 2 MB before upload.",
      tool: "compress-image-to-kb",
      toolQuery: "targetKb=2048",
      intent: "image must be less than 2MB, image upload too large, compress image under 2MB",
      uploadErrorMatcher: true,
      sections: [
        ["Use a 2048KB custom target", "Open the image-to-KB compressor with a 2048KB custom target. This maps the common 2MB rule to the tool's KB input."],
        ["Keep enough detail", "A 2MB cap is usually generous enough for profile photos, product images, and support screenshots. Resize first only if the dimensions are also rejected."],
        ["Check the final upload", "Open the downloaded image, confirm it is below the portal limit, and verify that faces, text, or product details still look clear."],
      ],
      related: ["compress-image-to-kb", "resize-image", "convert-image"],
    },
    {
      slug: "image-must-be-under-500kb",
      title: "Image Must Be Under 500KB Fix",
      headline: "Fix image must be under 500KB",
      description: "Compress a photo, screenshot, avatar, or product image toward a 500KB upload limit locally without creating an account.",
      lead: "Use this when a portal, marketplace, job form, school page, or support ticket says an image file must be under 500KB.",
      tool: "compress-image-to-kb",
      toolQuery: "targetKb=500",
      intent: "image must be under 500KB, compress image to 500KB, upload image too large",
      uploadErrorMatcher: true,
      sections: [
        ["Use the 500KB target", "Open the image-to-KB compressor with 500KB selected and export a smaller JPG or WebP copy from the browser."],
        ["Resize if it still fails", "Large screenshots and phone photos may need a smaller maximum width before they can fit under 500KB cleanly."],
        ["Review text and faces", "Compression can soften document text, ID photos, screenshots, and product details. Check the file before sending it to the destination site."],
      ],
      related: ["compress-image-to-kb", "resize-image", "crop-image"],
    },
    {
      slug: "jpg-must-be-under-200kb",
      title: "JPG Must Be Under 200KB Fix",
      headline: "Fix JPG must be under 200KB",
      description: "Compress a JPG or photo toward a 200KB upload limit locally for applications, profiles, marketplaces, and school forms.",
      lead: "Use this when a website accepts JPG or JPEG but rejects the file because it is over 200KB.",
      tool: "compress-image-to-kb",
      toolQuery: "targetKb=200",
      intent: "JPG must be under 200KB, compress JPG to 200KB, JPEG upload limit",
      uploadErrorMatcher: true,
      sections: [
        ["Use the 200KB target", "Open the image-to-KB compressor with 200KB selected, then export a smaller JPG or WebP copy locally."],
        ["Convert after checking the rule", "If the portal specifically requires JPG, keep the output as JPG. If it only asks for an image, WebP may be smaller but not accepted everywhere."],
        ["Avoid over-compressing IDs", "For ID-style photos, applications, and resumes with headshots, make sure the face and any printed text remain readable."],
      ],
      related: ["compress-image-to-kb", "convert-image", "passport-photo"],
    },
    {
      slug: "png-screenshot-too-large",
      title: "PNG Screenshot Too Large Fix",
      headline: "Fix PNG screenshot too large",
      description: "Reduce a PNG screenshot locally when a support form, admin portal, or upload page rejects the screenshot as too large.",
      lead: "Use this when a support ticket, bug report, admin upload, school portal, or marketplace page rejects a PNG screenshot because the file size is too large.",
      tool: "compress-image-to-kb",
      toolQuery: "targetKb=500",
      intent: "PNG screenshot too large, compress PNG screenshot, screenshot upload too large",
      uploadErrorMatcher: true,
      sections: [
        ["Start with 500KB", "Open the image-to-KB compressor with a 500KB target. This is a practical first pass for screenshots that need to stay readable."],
        ["Crop first for privacy", "Before compressing, crop out unrelated tabs, messages, account details, or private desktop areas if they are not needed."],
        ["Check text clarity", "Screenshots often contain small UI text. Review the compressed image before attaching it to a ticket or form."],
      ],
      related: ["compress-image-to-kb", "crop-image", "convert-image"],
    },
    {
      slug: "resume-pdf-too-large",
      title: "Resume PDF Too Large Fix",
      headline: "Fix resume PDF too large",
      description: "Compress a resume PDF locally when a job application portal rejects the file because it is too large.",
      lead: "Use this when a job application, recruiter portal, or career site says your resume PDF is too large to upload.",
      tool: "compress-pdf",
      toolQuery: "targetSize=1mb",
      intent: "resume PDF too large, compress resume PDF, job application PDF upload limit",
      uploadErrorMatcher: true,
      sections: [
        ["Try the 1MB PDF target", "Open the PDF compressor with the 1MB target selected. Many job portals accept resumes around this size."],
        ["Preserve readability", "A resume must stay readable after compression. Check name, headings, dates, and contact details before uploading."],
        ["If text becomes blurry", "Return to the source resume editor and export a simpler PDF, remove oversized images, or rebuild from a text-first document."],
      ],
      related: ["compress-pdf", "resume-builder", "pdf-to-word"],
    },
    {
      slug: "email-attachment-too-large",
      title: "Email Attachment Too Large Fix",
      headline: "Fix email attachment too large",
      description: "Reduce a PDF or image before emailing it when an inbox, webmail app, or mail client says the attachment is too large.",
      lead: "Use this when Gmail, Outlook, a school inbox, or a work mail client rejects a PDF, scanned document, or image attachment because it is too large.",
      tool: "compress-pdf",
      toolQuery: "targetSize=5mb",
      intent: "email attachment too large, compress PDF for email, reduce image before email",
      uploadErrorMatcher: true,
      sections: [
        ["Start with the file type", "If the attachment is a PDF, open the PDF compressor with the 5MB target. If it is a photo or screenshot, use the image-to-KB compressor instead."],
        ["Keep the original copy", "Compression makes a new file for sending. Keep the original document or image in case the recipient needs full quality later."],
        ["Review before sending", "Open the smaller file and confirm all pages, text, signatures, and images are visible before attaching it to the email."],
      ],
      related: ["compress-pdf", "compress-image-to-kb", "split-pdf"],
    },
    {
      slug: "free-invoice-generator-no-signup",
      title: "Free Invoice Generator Without Signup",
      headline: "Free invoice generator without signup",
      description: "Create and download a clean invoice PDF without creating an account, uploading data, or hitting a surprise export paywall.",
      lead: "Make a practical invoice PDF in the browser, review it, and download it without creating an account. This page is built for freelancers and small businesses who need one clean invoice now.",
      tool: "invoice-generator",
      intent: "invoice PDF now, no account, no hidden export fee",
      sections: [
        ["Why this page exists", "Many invoice tools are free until the export step. PrintableTools Lab keeps the first invoice workflow lightweight: fill the form, generate the PDF locally, and keep your own copy."],
        ["What the invoice includes", "Business and client details, invoice number, date, payment terms, line items, currency, totals, and a footer note. It is a simple record format, not tax or accounting advice."],
        ["Best fit", "Use it for freelance services, consulting work, small one-off jobs, deposits, creative work, or quick client records when full accounting software is unnecessary."],
      ],
      related: ["invoice-followup-email", "estimate-generator", "receipt-generator"],
    },
    {
      slug: "invoice-follow-up-email-template",
      title: "Free Invoice Follow-up Email Template",
      headline: "Free invoice follow-up email template",
      description: "Write and download a polite invoice reminder, due-today note, overdue follow-up, paid thank-you, or next-invoice email without uploading private invoice details.",
      lead: "Use this when an invoice has been sent and you need a professional reminder or thank-you note without turning it into legal, tax, accounting, or collections advice.",
      tool: "invoice-followup-email",
      intent: "invoice follow-up email, payment reminder wording, overdue invoice reminder",
      sections: [
        ["Why this page exists", "People who generate invoices often need the next message more than another PDF. This page gives a quick, editable follow-up email while keeping private invoice numbers, bank details, tax IDs, and client data out of the tool."],
        ["What it drafts", "A polite reminder, due-today note, first overdue follow-up, paid thank-you, or next-invoice message with tone and timing fields the sender can review."],
        ["Best fit", "Use it for freelancers, consultants, local services, or small teams who need relationship-safe wording after sending an invoice."],
      ],
      related: ["invoice-generator", "estimate-generator", "receipt-generator"],
    },
    {
      slug: "jpg-to-pdf-no-upload",
      title: "JPG to PDF Without Uploading",
      headline: "JPG to PDF without uploading",
      description: "Convert JPG, PNG, or WebP images to PDF in your browser without uploading private files to a conversion server.",
      lead: "Choose an image and create a PDF locally in the browser. It is useful for receipts, scans, forms, screenshots, homework pages, and other files you do not want to send to a converter server.",
      tool: "image-to-pdf",
      intent: "private image conversion, no upload, fast PDF",
      sections: [
        ["Local-first conversion", "The image is loaded into your browser preview and drawn into the PDF on your device. Avoid entering or uploading private documents unless you have reviewed them first."],
        ["One image or several", "Use the one-image converter for a single page or gallery layout. Use the multi-image converter when each image should become its own PDF page."],
        ["Before sharing", "Open the downloaded PDF and confirm the image is readable, oriented correctly, and not cropped in a way that hides important information."],
      ],
      related: ["multi-image-pdf", "text-to-pdf", "packing-list"],
    },
    {
      slug: "multiple-images-to-pdf-no-upload",
      title: "Multiple Images to PDF Without Uploading",
      headline: "Multiple images to PDF without uploading",
      description: "Combine several JPG, PNG, or WebP images into one multi-page PDF locally in your browser.",
      lead: "Create a multi-page PDF where each selected image becomes one page. This is designed for quick scans, receipts, forms, screenshots, homework, and grouped photo documents.",
      tool: "multi-image-pdf",
      intent: "combine images into one PDF without upload",
      sections: [
        ["One PDF, several pages", "Select up to eight images and export them as a single PDF. The first version keeps the workflow simple so the page can load fast on mobile and desktop."],
        ["Privacy positioning", "The images stay in the browser for ordinary generation. That is a stronger promise than tools that require an upload before showing the final PDF."],
        ["Practical limits", "Very large images can make large PDFs. Resize or crop photos first if the receiving website has strict upload limits."],
      ],
      related: ["image-to-pdf", "text-to-pdf", "receipt-generator"],
    },
    {
      slug: "compress-pdf-no-upload",
      title: "Compress PDF Without Uploading",
      headline: "Compress PDF without uploading",
      description: "Compress a PDF locally in your browser by creating a smaller image-based PDF copy.",
      lead: "Choose a PDF, pick a compression mode, and download a smaller PDF copy without sending the file to a server. This works best for scanned forms, image-heavy PDFs, and quick document uploads where file size matters more than selectable text.",
      tool: "compress-pdf",
      intent: "compress PDF, reduce PDF size, no upload",
      sections: [
        ["Why this is high intent", "Compress PDF searches often happen after a form, email, school portal, job application, or government upload rejects a file as too large. Many converters require uploads, queues, accounts, or paid exports."],
        ["Local compression tradeoff", "The browser renders selected pages into images and rebuilds them into a smaller PDF. That keeps the file local, but selectable text and links may become flattened."],
        ["Best fit", "Use it for scanned PDFs, photo-heavy documents, receipts, and one-off upload limits. For contracts, forms, or accessible documents with selectable text, keep the original file too."],
      ],
      related: ["pdf-to-images", "compress-image-to-kb", "merge-pdf"],
    },
    {
      slug: "pdf-size-reducer",
      title: "PDF Size Reducer Without Uploading",
      headline: "PDF size reducer without uploading",
      description: "Reduce a scanned or image-heavy PDF toward exact upload limits locally, including 500KB, 1MB, 2MB, and 5MB targets.",
      lead: "Start here when a job portal, school form, email system, exam site, or admin upload page rejects a PDF because the file is too large. Pick the target size, open the no-upload PDF compressor, and download a smaller copy from your browser.",
      tool: "compress-pdf",
      intent: "PDF size reducer, compress PDF under 1MB, compress PDF under 500KB, no upload",
      sections: [
        ["Pick the target from the upload rule", "Use the exact size from the destination site whenever possible. A 500KB target is strict, 1MB is common for forms, and 2MB or 5MB usually preserves more readable detail."],
        ["Best for scanned PDFs", "The compressor rebuilds image-based pages locally, so it is strongest for scanned forms, photo-heavy documents, and PDFs that are already mostly images."],
        ["Honest limits", "Very small PDF targets can flatten selectable text, lower image quality, or still miss the exact limit on long documents. Review the downloaded PDF before submitting it anywhere important."],
      ],
      targetLinks: [
        ["Compress PDF to 500KB", "compress-pdf-to-500kb", "For strict form, school, government-style, and exam upload limits."],
        ["Compress PDF to 1MB", "compress-pdf-to-1mb", "For common job, school, email, and portal PDF limits."],
        ["Compress PDF to 2MB", "compress-pdf-to-2mb", "For upload forms that allow more readable scanned detail."],
        ["Compress PDF to 5MB", "compress-pdf-to-5mb", "For moderate limits where readability matters more than extreme compression."],
      ],
      related: ["compress-pdf", "pdf-to-images", "split-pdf", "merge-pdf"],
    },
    {
      slug: "compress-pdf-to-500kb",
      title: "Compress PDF to 500KB Without Uploading",
      headline: "Compress PDF to 500KB without uploading",
      description: "Try to compress a scanned or image-heavy PDF toward a 500KB upload limit locally in your browser.",
      lead: "Choose a PDF, use the 500KB target, and download a smaller image-based PDF copy without sending the document to a server. This is for strict upload forms that reject PDFs above 500KB.",
      tool: "compress-pdf",
      toolQuery: "targetSize=500kb",
      intent: "compress PDF to 500KB, reduce PDF size, no upload",
      sections: [
        ["Why this is high intent", "A 500KB PDF limit usually appears after a user has already tried to submit a form, school file, job document, exam upload, or government document and been blocked."],
        ["Local target-size workflow", "The browser renders selected pages into smaller JPEG-backed PDF pages and tries stronger compression passes when a target size is selected."],
        ["Honest limit", "A 500KB target can be too small for long or text-heavy PDFs. The tool tries to get close, but the result may flatten selectable text and can lose detail."],
      ],
      related: ["compress-pdf", "pdf-to-images", "compress-image-to-kb"],
    },
    {
      slug: "compress-pdf-to-1mb",
      title: "Compress PDF to 1MB Without Uploading",
      headline: "Compress PDF to 1MB without uploading",
      description: "Try to reduce a PDF toward a 1MB upload limit locally for forms, portals, email attachments, and applications.",
      lead: "Choose a PDF, use the 1MB target, and download a smaller image-based PDF copy from your browser. It is designed for the common moment when an upload page says the PDF must be under 1MB.",
      tool: "compress-pdf",
      toolQuery: "targetSize=1mb",
      intent: "compress PDF to 1MB, reduce PDF size, no upload",
      sections: [
        ["Why users search this", "Specific 1MB searches are usually urgent. The user already has the right file but a portal, email, job application, or school form rejects the size."],
        ["Local target-size workflow", "The PDF stays in the browser. The tool renders selected pages into an image-based PDF and tries more aggressive compression when needed."],
        ["Best fit", "This works best for scanned PDFs, receipts, photo-heavy documents, and quick uploads. Keep the original if selectable text, links, or accessibility matter."],
      ],
      related: ["compress-pdf", "pdf-to-images", "resize-image"],
    },
    {
      slug: "compress-pdf-to-2mb",
      title: "Compress PDF to 2MB Without Uploading",
      headline: "Compress PDF to 2MB without uploading",
      description: "Try to compress a PDF toward a 2MB file-size limit locally without uploading the document.",
      lead: "Choose a PDF, use the 2MB target, and download a smaller PDF copy in the browser. This target is common for document portals that allow some detail but still reject large scans.",
      tool: "compress-pdf",
      toolQuery: "targetSize=2mb",
      intent: "compress PDF to 2MB, reduce PDF size, no upload",
      sections: [
        ["Why this page exists", "A 2MB limit is common for job, school, support, bank, insurance, and admin portals. Users need a working file immediately, not a heavy editor or account wall."],
        ["Local target-size workflow", "The selected PDF is rendered and rebuilt locally. No ordinary compression step uploads the document to PrintableTools Lab."],
        ["Quality tradeoff", "2MB is friendlier than 500KB or 1MB, but complex PDFs can still flatten text and links. Review the output before submitting."],
      ],
      related: ["compress-pdf", "pdf-to-images", "merge-pdf"],
    },
    {
      slug: "compress-pdf-to-5mb",
      title: "Compress PDF to 5MB Without Uploading",
      headline: "Compress PDF to 5MB without uploading",
      description: "Try to reduce a PDF toward a 5MB upload limit locally for email, portals, support tickets, and applications.",
      lead: "Choose a PDF, use the 5MB target, and download a smaller local copy. This is useful when the destination allows a moderate size and readability matters more than maximum compression.",
      tool: "compress-pdf",
      toolQuery: "targetSize=5mb",
      intent: "compress PDF to 5MB, reduce PDF size, no upload",
      sections: [
        ["Better quality target", "A 5MB target is often enough for multi-page scans, document photos, and support attachments while preserving more detail than tiny file-size limits."],
        ["Local target-size workflow", "The browser rebuilds selected pages into a smaller image-based PDF and keeps the source file local during ordinary use."],
        ["Practical limit", "This tool is best for image-heavy PDFs. Text-first PDFs may be better handled by keeping the original or exporting selected pages."],
      ],
      related: ["compress-pdf", "pdf-to-images", "split-pdf"],
    },
    {
      slug: "pdf-to-jpg-no-upload",
      title: "PDF to JPG Without Uploading",
      headline: "PDF to JPG without uploading",
      description: "Convert PDF pages to JPG or PNG images locally in your browser without uploading the document.",
      lead: "Choose a PDF, pick the pages, and download JPG or PNG images rendered in your browser. It is useful when a website, message, listing, or form needs image files instead of a PDF.",
      tool: "pdf-to-images",
      intent: "PDF to JPG, PDF to PNG, no upload converter",
      sections: [
        ["Why this belongs here", "PDF-to-image conversion is a broad file utility search with immediate pain: users often have the right document but the receiving site asks for JPG or PNG."],
        ["Local rendering", "The PDF is read and rendered in the browser with pdf.js. PrintableTools Lab does not receive the document during ordinary conversion."],
        ["Practical limits", "The free version converts up to eight selected pages at a time. Multiple pages download as a ZIP so the browser can keep the process simple and private."],
      ],
      related: ["image-to-pdf", "compress-image-to-kb", "resize-image"],
    },
    {
      slug: "extract-text-from-pdf-no-upload",
      title: "Extract Text From PDF Without Uploading",
      headline: "Extract text from PDF without uploading",
      description: "Copy selectable PDF text into a downloadable TXT file locally in your browser.",
      lead: "Choose a PDF, select all pages or a page range, and download a plain TXT file extracted in the browser. It is useful for notes, quotes, research, admin review, and quick copy-paste cleanup.",
      tool: "pdf-to-text",
      intent: "PDF to text, extract text from PDF, no upload",
      sections: [
        ["What it extracts", "The tool extracts embedded selectable text from PDF pages. It does not perform OCR on scanned images, photos, or flattened page pictures."],
        ["Local processing", "The PDF is read with pdf.js in the browser. Ordinary extraction does not send the document to PrintableTools Lab."],
        ["Why this is useful", "PDF-to-text searches often happen when a user needs searchable notes, quotes, plain text, or a lightweight copy of a PDF without opening a heavy editor."],
      ],
      related: ["pdf-to-images", "split-pdf", "text-to-pdf"],
    },
    {
      slug: "pdf-to-word-no-upload",
      title: "PDF to Word Without Uploading",
      headline: "PDF to Word without uploading",
      description: "Convert selectable PDF text into a simple DOCX document locally in your browser without uploading the PDF to a converter server.",
      lead: "Choose a PDF and download a simple Word-compatible DOCX made from selectable text in the browser. It is built for quick edits when you do not want to send a private document to an online converter.",
      tool: "pdf-to-word",
      intent: "PDF to Word, PDF to DOCX, no upload PDF converter",
      sections: [
        ["Why this search has urgency", "PDF-to-Word searches often happen when someone must edit a report, letter, assignment, resume, or form right before submitting it. Many converters require upload, queueing, signup, or a paid export step."],
        ["What this free version does", "The browser reads selectable PDF text and writes a clean DOCX with page headings. It is useful for editing the words, not for perfect visual layout reconstruction."],
        ["Important limit", "Scanned image-only PDFs need OCR first, and complex tables, columns, forms, or legal formatting may be simplified. Keep the original PDF when exact layout matters."],
      ],
      related: ["pdf-to-text", "markdown-to-pdf", "text-to-pdf"],
    },
    {
      slug: "compress-image-no-upload",
      title: "Compress Image Without Uploading",
      headline: "Compress image without uploading",
      description: "Compress JPG, PNG, or WebP images in your browser without uploading private files to an image compressor server.",
      lead: "Choose an image, pick a compression level, and download a smaller file locally in the browser. This helps when an upload form, email, profile page, or marketplace listing rejects a large image.",
      tool: "compress-image",
      intent: "compress image online, reduce image size, no upload",
      sections: [
        ["Why this has broad demand", "Image compression is a much wider utility search than printables alone. People often need it immediately after an upload fails because a file is too large."],
        ["Local-first workflow", "The selected image is loaded in the browser, re-encoded locally, and downloaded as a new file. The source image is not uploaded to PrintableTools Lab."],
        ["Best fit", "Use it for profile pictures, marketplace photos, form uploads, support tickets, email attachments, screenshots, and document photos."],
      ],
      related: ["resize-image", "convert-image", "image-to-pdf"],
    },
    {
      slug: "image-size-reducer-in-kb",
      title: "Image Size Reducer in KB Without Uploading",
      headline: "Image size reducer in KB without uploading",
      description: "Reduce JPG, PNG, or WebP image file size toward exact KB limits locally, including 10KB, 20KB, 30KB, 50KB, 100KB, 150KB, 200KB, 300KB, and 500KB targets.",
      lead: "Start here when a form, exam portal, job application, profile page, or support site rejects an image because the file is over a fixed KB limit. Pick the exact target, open the local image-to-KB compressor, and download a smaller copy without creating an account.",
      tool: "compress-image-to-kb",
      intent: "image size reducer in KB, photo size reducer under KB, no upload",
      sections: [
        ["Pick the target from the error message", "Use the exact KB number shown by the portal whenever possible. If the site says under 100KB, use the 100KB target; if it says under 20KB or 50KB, expect stronger quality tradeoffs."],
        ["Local target-size workflow", "The browser tries different dimensions and compression levels locally, then exports the closest smaller JPG or WebP it can make. The original image is not uploaded during ordinary use."],
        ["When to resize first", "If the portal also gives pixel dimensions, resize or crop before compressing. This is especially important for passport-style, exam, school, and profile photos."],
      ],
      targetLinks: [
        ["Compress image to 10KB", "compress-image-to-10kb", "For extremely strict profile, exam, school, and application upload limits."],
        ["Compress image to 20KB", "compress-image-to-20kb", "For severe exam, profile, and application photo limits."],
        ["Compress image to 30KB", "compress-image-to-30kb", "For strict portals that sit between 20KB and 50KB."],
        ["Compress image to 50KB", "compress-image-to-50kb", "For small profile photos, ID-style uploads, and form portals."],
        ["Compress image to 100KB", "compress-image-to-100kb", "For common job, school, profile, and form upload limits."],
        ["Compress image to 150KB", "compress-image-to-150kb", "For portals that allow more clarity than 100KB but still block phone photos."],
        ["Compress image to 200KB", "compress-image-to-200kb", "For forms and listings where image detail still matters."],
        ["Compress image to 300KB", "compress-image-to-300kb", "For support screenshots, listings, documents, and email attachments."],
        ["Compress image to 500KB", "compress-image-to-500kb", "For moderate upload limits where readability and detail are important."],
        ["Compress JPG to 50KB", "compress-jpg-to-50kb", "For strict JPG photo upload limits."],
        ["Compress JPG to 100KB", "compress-jpg-to-100kb", "For common JPG profile, job, and form limits."],
        ["Compress JPG to 200KB", "compress-jpg-to-200kb", "For JPG uploads where detail matters."],
        ["Compress PNG to 50KB", "compress-png-to-50kb", "For strict PNG screenshot or graphic upload limits."],
        ["Compress PNG to 100KB", "compress-png-to-100kb", "For common PNG form and support limits."],
        ["Compress PNG to 200KB", "compress-png-to-200kb", "For PNG uploads that allow more readable detail."],
        ["Passport photo to 50KB", "passport-photo-compress-to-50kb", "For strict ID-style photo file-size limits."],
        ["Passport photo to 100KB", "passport-photo-compress-to-100kb", "For common passport-style and application photo upload limits."],
        ["Passport photo to 200KB", "passport-photo-compress-to-200kb", "For ID-style uploads that allow more detail."],
      ],
      related: ["compress-image-to-kb", "resize-image", "crop-image", "passport-photo"],
    },
    {
      slug: "compress-image-to-10kb",
      title: "Compress Image to 10KB Without Uploading",
      headline: "Compress image to 10KB without uploading",
      description: "Compress a JPG, PNG, or WebP image toward 10KB locally for extremely strict profile, exam, school, and application upload limits.",
      lead: "Choose an image, use the 10KB target, and download the smallest usable copy your browser can create. This page is for severe upload limits where a portal rejects almost every ordinary phone photo.",
      tool: "compress-image-to-kb",
      toolQuery: "targetKb=10",
      intent: "compress image to 10KB, reduce photo size, strict upload limit, no upload",
      sections: [
        ["Why this is urgent", "A 10KB limit usually appears after a user has already tried to upload a photo and hit a hard portal rule. That makes the task immediate and very specific."],
        ["Local target-size workflow", "The image-to-KB compressor runs in the browser, tries smaller dimensions and compression levels, and downloads the closest result it can make without uploading the source image."],
        ["Quality warning", "10KB is tiny. Crop tightly, avoid busy backgrounds, and review the downloaded file before submitting it to an exam, school, job, or ID-style portal."],
      ],
      related: ["compress-image-to-kb", "resize-image", "crop-image"],
    },
    {
      slug: "compress-image-to-20kb",
      title: "Compress Image to 20KB Without Uploading",
      headline: "Compress image to 20KB without uploading",
      description: "Compress a JPG, PNG, or WebP image toward 20KB locally for strict exam, profile, school, and application upload limits.",
      lead: "Choose an image, use the 20KB target, and download a smaller JPG or WebP copy from your browser. This page is for very strict portals that reject profile, exam, school, ID-style, or application photos above 20KB.",
      tool: "compress-image-to-kb",
      toolQuery: "targetKb=20",
      intent: "compress image to 20KB, reduce photo size, exam photo upload, no upload",
      sections: [
        ["Why this is urgent", "A 20KB image limit usually means the user already tried to submit a photo and got blocked by a portal rule. That is high-intent utility traffic, not casual browsing."],
        ["Local target-size workflow", "The image-to-KB compressor runs in the browser, tries smaller dimensions and compression levels, then downloads the closest usable file it can make."],
        ["Quality tradeoff", "20KB is extremely small for faces, IDs, and document text. Use a simple crop, avoid busy backgrounds, and open the result before submitting it anywhere official."],
      ],
      related: ["compress-image-to-kb", "resize-image", "passport-photo"],
    },
    {
      slug: "compress-image-to-30kb",
      title: "Compress Image to 30KB Without Uploading",
      headline: "Compress image to 30KB without uploading",
      description: "Compress a JPG, PNG, or WebP image toward 30KB locally for strict form, profile, school, and exam upload limits.",
      lead: "Choose an image, use the 30KB target, and download a smaller JPG or WebP copy from your browser. This target is common when an upload portal allows slightly more detail than 20KB but still blocks normal photos.",
      tool: "compress-image-to-kb",
      toolQuery: "targetKb=30",
      intent: "compress image to 30KB, reduce photo size, form upload limit, no upload",
      sections: [
        ["Why this page exists", "Specific KB searches usually come from blocked uploads. A 30KB target catches strict portals that do not match the more common 20KB, 50KB, or 100KB limits."],
        ["Local target-size workflow", "The compressor re-encodes the image locally, tries smaller sizes, and exports the closest usable file it can create for the selected target."],
        ["Review the output", "Small targets can blur faces, IDs, screenshots, and product details. Open the downloaded file before sending it anywhere important."],
      ],
      related: ["compress-image-to-kb", "compress-image", "resize-image"],
    },
    {
      slug: "compress-image-to-100kb",
      title: "Compress Image to 100KB Without Uploading",
      headline: "Compress image to 100KB without uploading",
      description: "Compress a JPG, PNG, or WebP image toward 100KB locally for forms, portals, profiles, and upload limits.",
      lead: "Choose an image, select the 100KB target, and download a smaller JPG or WebP copy from your browser. This is for the common moment when a form, exam portal, job application, or profile page rejects a file as too large.",
      tool: "compress-image-to-kb",
      toolQuery: "targetKb=100",
      intent: "compress image to 100KB, reduce image size, no upload",
      sections: [
        ["Why this is high intent", "A user searching for a specific KB target usually has a blocked upload and wants a smaller file immediately, not a design app or account signup."],
        ["Local target-size workflow", "The tool tries several quality and width combinations in the browser and picks the smallest acceptable result it can produce for the selected target."],
        ["Quality tradeoff", "Very small targets can blur text, faces, IDs, or product details. Always open the downloaded image before submitting it elsewhere."],
      ],
      related: ["compress-image-to-kb", "compress-image", "resize-image"],
    },
    {
      slug: "compress-image-to-150kb",
      title: "Compress Image to 150KB Without Uploading",
      headline: "Compress image to 150KB without uploading",
      description: "Compress a JPG, PNG, or WebP image toward 150KB locally for upload forms, profiles, job portals, and support attachments.",
      lead: "Choose an image, use the 150KB target, and download a smaller copy without sending the file to a server. This is useful when a portal allows more clarity than 100KB but still rejects large camera photos.",
      tool: "compress-image-to-kb",
      toolQuery: "targetKb=150",
      intent: "compress image to 150KB, image size reducer, no upload",
      sections: [
        ["Why this target matters", "Some portals publish file limits that sit between common presets. A 150KB page gives those users a direct path instead of making them guess."],
        ["Local target-size workflow", "The tool tries different compression and width settings in the browser, then exports the closest smaller image it can make."],
        ["Before submitting", "Open the downloaded result and confirm the face, product, document, or screenshot detail is still clear enough for the destination site."],
      ],
      related: ["compress-image-to-kb", "compress-image", "resize-image"],
    },
    {
      slug: "compress-image-to-50kb",
      title: "Compress Image to 50KB Without Uploading",
      headline: "Compress image to 50KB without uploading",
      description: "Compress a JPG, PNG, or WebP image toward 50KB locally for strict upload limits, small profile photos, and form portals.",
      lead: "Choose an image, use the 50KB target, and download the smallest usable JPG or WebP copy your browser can create. This page is for strict upload limits where a profile, exam, school, visa-style, or admin form rejects anything larger.",
      tool: "compress-image-to-kb",
      toolQuery: "targetKb=50",
      intent: "compress image to 50KB, reduce photo size, no upload",
      sections: [
        ["Why this is urgent", "A 50KB image limit usually appears after a user has already tried to upload a photo and been blocked. That makes the search intent immediate and practical."],
        ["Local target-size workflow", "The compressor runs in the browser, tries smaller dimensions and compression levels, and downloads a new file without uploading the source image."],
        ["Quality tradeoff", "50KB can be severe for faces, IDs, product details, or screenshots. Review the downloaded file before submitting it to a portal."],
      ],
      related: ["compress-image-to-kb", "compress-image", "resize-image"],
    },
    {
      slug: "compress-image-to-200kb",
      title: "Compress Image to 200KB Without Uploading",
      headline: "Compress image to 200KB without uploading",
      description: "Compress a JPG, PNG, or WebP image toward 200KB locally for job, school, profile, and marketplace upload limits.",
      lead: "Choose an image, use the 200KB target, and download a smaller JPG or WebP copy from your browser. This target is common when an upload form allows more clarity than 50KB or 100KB but still blocks large phone photos.",
      tool: "compress-image-to-kb",
      toolQuery: "targetKb=200",
      intent: "compress image to 200KB, image size reducer, no upload",
      sections: [
        ["Why this page exists", "Specific KB searches often come from blocked uploads, not casual browsing. A 200KB target is useful for profile photos, marketplace images, job portals, school forms, and support screenshots."],
        ["Local target-size workflow", "The tool attempts several quality and width combinations locally, then exports the closest matching image it can produce."],
        ["Before uploading elsewhere", "Open the result and confirm important details still look clear enough for the destination site."],
      ],
      related: ["compress-image-to-kb", "compress-image", "resize-image"],
    },
    {
      slug: "compress-image-to-300kb",
      title: "Compress Image to 300KB Without Uploading",
      headline: "Compress image to 300KB without uploading",
      description: "Compress a JPG, PNG, or WebP image toward 300KB locally for forms, listings, support tickets, and email attachments.",
      lead: "Choose an image, use the 300KB target, and download a smaller copy locally. This target keeps more detail than tiny profile-photo limits while still helping large phone photos pass upload rules.",
      tool: "compress-image-to-kb",
      toolQuery: "targetKb=300",
      intent: "compress image to 300KB, reduce image file size, no upload",
      sections: [
        ["Practical upload limit", "A 300KB target is useful for marketplace photos, document images, support screenshots, job forms, and email attachments where readability still matters."],
        ["Local target-size workflow", "The browser re-encodes the image and tries size reductions locally before exporting a new JPG or WebP copy."],
        ["Review the output", "Compression can still change sharpness or color. Open the downloaded file before submitting, sending, or printing it."],
      ],
      related: ["compress-image-to-kb", "compress-image", "resize-image"],
    },
    {
      slug: "compress-image-to-500kb",
      title: "Compress Image to 500KB Without Uploading",
      headline: "Compress image to 500KB without uploading",
      description: "Compress a JPG, PNG, or WebP image toward 500KB locally while preserving more clarity for forms, listings, and email attachments.",
      lead: "Choose an image, use the 500KB target, and download a smaller copy without sending the file to a server. This target is useful when the receiving site allows a moderate file size and readability matters.",
      tool: "compress-image-to-kb",
      toolQuery: "targetKb=500",
      intent: "compress image to 500KB, reduce image file size, no upload",
      sections: [
        ["Better quality target", "500KB is often a friendlier limit for product images, document photos, support screenshots, and email attachments because it can preserve more detail than tiny KB targets."],
        ["Local target-size workflow", "The browser re-encodes the image and tries size reductions locally before exporting a new JPG or WebP file."],
        ["Review the output", "Even at 500KB, compression can change sharpness or color. Open the file before sending, printing, or submitting it."],
      ],
      related: ["compress-image-to-kb", "compress-image", "resize-image"],
    },
    {
      slug: "compress-jpg-to-50kb",
      title: "Compress JPG to 50KB Without Uploading",
      headline: "Compress JPG to 50KB without uploading",
      description: "Compress a JPG image toward 50KB locally for strict profile, exam, school, and application upload limits.",
      lead: "Choose a JPG photo, use the 50KB target, and download a smaller copy from your browser. This page is for strict JPG upload limits where ordinary phone photos are rejected.",
      tool: "compress-image-to-kb",
      toolQuery: "targetKb=50",
      intent: "compress JPG to 50KB, reduce JPG file size, no upload",
      sections: [
        ["Why JPG gets this search", "Many forms ask for JPG photos and reject files above a fixed KB size. A 50KB limit is usually for profile, exam, school, or ID-style uploads."],
        ["Local target-size workflow", "The image-to-KB compressor runs in the browser, tries smaller dimensions and quality levels, and exports the closest JPG or WebP result it can make."],
        ["Quality tradeoff", "50KB can soften faces, IDs, and small text. Crop tightly and review the output before submitting it to a portal."],
      ],
      related: ["compress-image-to-kb", "resize-image", "crop-image"],
    },
    {
      slug: "compress-jpg-to-100kb",
      title: "Compress JPG to 100KB Without Uploading",
      headline: "Compress JPG to 100KB without uploading",
      description: "Compress a JPG image toward 100KB locally for forms, profiles, job portals, and upload limits.",
      lead: "Choose a JPG, use the 100KB target, and download a smaller copy without sending the source image to a server. This target is common for job applications, profiles, school forms, and admin portals.",
      tool: "compress-image-to-kb",
      toolQuery: "targetKb=100",
      intent: "compress JPG to 100KB, JPG size reducer, no upload",
      sections: [
        ["Why this target is common", "A 100KB JPG limit often appears on profile forms, job portals, school systems, support sites, and application uploads."],
        ["Local target-size workflow", "The compressor re-encodes the image locally, tries smaller sizes, and downloads the closest result it can create for the selected target."],
        ["Before uploading elsewhere", "Open the downloaded JPG or WebP copy and confirm important face, document, or product details are still clear."],
      ],
      related: ["compress-image-to-kb", "compress-image", "resize-image"],
    },
    {
      slug: "compress-jpg-to-200kb",
      title: "Compress JPG to 200KB Without Uploading",
      headline: "Compress JPG to 200KB without uploading",
      description: "Compress a JPG image toward 200KB locally for job, school, marketplace, and support upload limits.",
      lead: "Choose a JPG, use the 200KB target, and download a smaller browser-made copy. This target keeps more detail than tiny profile-photo limits while still helping large camera photos pass upload rules.",
      tool: "compress-image-to-kb",
      toolQuery: "targetKb=200",
      intent: "compress JPG to 200KB, reduce JPG size, no upload",
      sections: [
        ["Practical upload limit", "A 200KB JPG target is useful for forms, listings, support tickets, product photos, and profile uploads where readability still matters."],
        ["Local target-size workflow", "The browser tries different quality and size combinations locally before exporting a smaller image file."],
        ["Review the output", "Compression can change sharpness or color. Open the downloaded file before submitting, sending, or printing it."],
      ],
      related: ["compress-image-to-kb", "compress-image", "resize-image"],
    },
    {
      slug: "compress-png-to-50kb",
      title: "Compress PNG to 50KB Without Uploading",
      headline: "Compress PNG to 50KB without uploading",
      description: "Compress or re-export a PNG image toward 50KB locally for strict screenshot, form, and graphic upload limits.",
      lead: "Choose a PNG screenshot or graphic, use the 50KB target, and download a smaller copy locally. For very small limits, the exported result may use JPG or WebP when that is the only practical way to reduce size.",
      tool: "compress-image-to-kb",
      toolQuery: "targetKb=50",
      intent: "compress PNG to 50KB, reduce PNG size, no upload",
      sections: [
        ["Why PNG can be difficult", "PNG preserves sharp edges and transparency, which can make screenshots and graphics large. A 50KB target is strict and may require format conversion."],
        ["Local target-size workflow", "The image-to-KB compressor works in the browser and tries smaller dimensions and export formats to get near the selected file-size target."],
        ["Transparency note", "If transparency matters, review the result carefully. Small target exports may use a non-transparent format to meet the file-size limit."],
      ],
      related: ["compress-image-to-kb", "convert-image", "resize-image"],
    },
    {
      slug: "compress-png-to-100kb",
      title: "Compress PNG to 100KB Without Uploading",
      headline: "Compress PNG to 100KB without uploading",
      description: "Compress or re-export a PNG image toward 100KB locally for forms, screenshots, support tickets, and upload limits.",
      lead: "Choose a PNG, use the 100KB target, and download a smaller copy from your browser. This is useful when a form accepts PNG but rejects a large screenshot or graphic.",
      tool: "compress-image-to-kb",
      toolQuery: "targetKb=100",
      intent: "compress PNG to 100KB, PNG size reducer, no upload",
      sections: [
        ["Common PNG upload problem", "Screenshots, forms, and graphics often save as PNG and exceed upload limits. A 100KB target gives a direct path for these blocked uploads."],
        ["Local target-size workflow", "The browser re-encodes the image, tries smaller dimensions, and exports the closest result it can create without uploading the source PNG."],
        ["Review before submitting", "Check text, edges, transparency, and colors in the downloaded file before sending it to another site."],
      ],
      related: ["compress-image-to-kb", "compress-image", "convert-image"],
    },
    {
      slug: "compress-png-to-200kb",
      title: "Compress PNG to 200KB Without Uploading",
      headline: "Compress PNG to 200KB without uploading",
      description: "Compress or re-export a PNG image toward 200KB locally for readable screenshots, graphics, forms, and support attachments.",
      lead: "Choose a PNG, use the 200KB target, and download a smaller browser-made copy. This target can preserve more readable screenshot and graphic detail than 50KB or 100KB.",
      tool: "compress-image-to-kb",
      toolQuery: "targetKb=200",
      intent: "compress PNG to 200KB, reduce PNG file size, no upload",
      sections: [
        ["Readable PNG target", "A 200KB limit is useful for screenshots, document images, product graphics, and support attachments that need more detail."],
        ["Local target-size workflow", "The compressor works locally and tries smaller dimensions and export formats before downloading a new file."],
        ["Check the result", "Open the downloaded file and confirm text, lines, transparency, and important details are acceptable for the destination portal."],
      ],
      related: ["compress-image-to-kb", "compress-image", "resize-image"],
    },
    {
      slug: "passport-photo-compress-to-50kb",
      title: "Passport Photo Compress to 50KB",
      headline: "Compress a passport photo to 50KB",
      description: "Compress a passport-style or ID-style photo toward 50KB locally before uploading it to a strict form, exam portal, or application.",
      lead: "Use this when a visa-style form, exam portal, job application, school system, or profile page accepts the photo dimensions but rejects the file size. The linked image-to-KB tool opens with the 50KB target ready.",
      tool: "compress-image-to-kb",
      toolQuery: "targetKb=50",
      intent: "passport photo compress to 50KB, ID photo size reducer, no upload",
      sections: [
        ["Start with the portal error", "If the form says the passport-style photo must be under 50KB, compress the image after cropping and resizing to the required dimensions."],
        ["Local privacy positioning", "Face photos are sensitive, so the workflow keeps the image processing in the browser during ordinary use."],
        ["Review face clarity", "50KB can soften eyes, hair, background edges, and ID-style details. Open the result before uploading it to any official or school portal."],
      ],
      related: ["passport-photo", "resize-image", "compress-image-to-kb"],
    },
    {
      slug: "passport-photo-compress-to-100kb",
      title: "Passport Photo Compress to 100KB",
      headline: "Compress a passport photo to 100KB",
      description: "Compress a passport-style or ID-style photo toward 100KB locally before uploading it to a form, portal, or application.",
      lead: "Use this when a visa-style form, exam portal, job application, school system, or profile page accepts the photo but rejects the file size. The linked image-to-KB tool opens with the 100KB target ready.",
      tool: "compress-image-to-kb",
      toolQuery: "targetKb=100",
      intent: "passport photo compress to 100KB, ID photo size reducer, no upload",
      sections: [
        ["Start with the file-size error", "If the portal says the photo must be under 100KB, compress the image first. If it also gives exact dimensions, resize or crop the photo before compressing."],
        ["Local privacy positioning", "The photo is processed in the browser during ordinary use. That matters because face photos and ID-style images are more sensitive than casual screenshots."],
        ["Review the face details", "Compression can soften eyes, hair, document edges, and background color. Open the result before submitting, and compare it with the destination's current photo rules."],
      ],
      related: ["passport-photo", "resize-image", "compress-image-to-kb"],
    },
    {
      slug: "passport-photo-compress-to-200kb",
      title: "Passport Photo Compress to 200KB",
      headline: "Compress a passport photo to 200KB",
      description: "Compress a passport-style or ID-style photo toward 200KB locally before uploading it to a form, portal, or application.",
      lead: "Use this when a portal allows more clarity than 50KB or 100KB but still rejects a full-size phone photo. The linked image-to-KB tool opens with the 200KB target ready.",
      tool: "compress-image-to-kb",
      toolQuery: "targetKb=200",
      intent: "passport photo compress to 200KB, ID photo size reducer, no upload",
      sections: [
        ["Start with dimensions first", "If the portal gives exact pixels or passport-photo proportions, crop or resize first, then compress toward the 200KB file limit."],
        ["Local privacy positioning", "The face photo is processed in the browser during ordinary use, which is preferable for ID-style and application photos."],
        ["Check before submitting", "Open the downloaded result and compare it with the destination's current rules for file size, dimensions, background, lighting, and face placement."],
      ],
      related: ["passport-photo", "resize-image", "compress-image-to-kb"],
    },
    {
      slug: "passport-photo-size-fixer",
      title: "Passport Photo Size Fixer",
      headline: "Fix passport photo size and file limit",
      description: "Fix passport-style photo dimensions and file size locally with crop, resize, and image-to-KB tools for form uploads.",
      lead: "Start here when a portal rejects a passport-style, ID-style, exam, school, visa, or profile photo because the dimensions, format, or file size are wrong.",
      tool: "passport-photo",
      intent: "passport photo size fixer, ID photo dimensions, compress passport photo, no upload",
      sections: [
        ["Match the error message", "Use the passport photo cropper when the issue is physical size or passport-style layout. Use the resizer when the portal gives exact pixels. Use image-to-KB when the final file is still too large."],
        ["Common blocked-upload path", "A practical sequence is crop the face photo, resize to the required pixels if listed, then compress toward 20KB, 50KB, 100KB, or another portal limit."],
        ["Official rules still matter", "This page helps with crop, dimensions, format, and file size. It does not verify lighting, background, expression, age, pose, or acceptance by any authority."],
      ],
      related: ["resize-image", "compress-image-to-kb", "crop-image"],
    },
    {
      slug: "resize-photo-413x531",
      title: "Resize Photo to 413x531",
      headline: "Resize photo to 413 x 531 pixels",
      description: "Resize a JPG, PNG, or WebP photo to 413 x 531 pixels locally for strict profile, exam, and application upload forms.",
      lead: "Choose a photo and open the resizer with 413 x 531 pixels prefilled. Use it when a form or portal gives this exact dimension requirement and rejects ordinary phone photos.",
      tool: "resize-image",
      toolQuery: "width=413&height=531&fit=cover",
      intent: "resize photo to 413x531, exam photo size, application photo dimensions, no upload",
      sections: [
        ["Why exact dimensions matter", "Some upload forms validate pixel width and height before accepting a photo. Exact-dimension searches usually happen after a user has already been blocked."],
        ["Fill and crop workflow", "The prefilled resizer uses a cover-style crop so the output can become exactly 413 x 531 pixels. Move to the crop or passport photo tools first if the face placement needs more control."],
        ["Then check file size", "After resizing, the image may still exceed a KB limit. If the portal also says under 20KB, 50KB, or 100KB, run the resized output through the image-to-KB compressor."],
      ],
      related: ["resize-image", "passport-photo", "compress-image-to-kb"],
    },
    {
      slug: "resize-image-no-upload",
      title: "Resize Image Without Uploading",
      headline: "Resize image without uploading",
      description: "Resize a JPG, PNG, or WebP image by width, height, or common preset locally in your browser.",
      lead: "Select an image, choose a custom size or a common preset, then download a resized copy without creating an account or uploading the file.",
      tool: "resize-image",
      intent: "resize image online, change image dimensions, no upload",
      sections: [
        ["Why users search", "Image size requirements show up in job portals, ID forms, seller platforms, social profiles, school portals, and support forms. A fast no-upload resizer solves that moment."],
        ["Fit or crop", "Fit inside keeps the whole image visible. Fill and crop is better when the target size must be exact, such as a square profile image or thumbnail."],
        ["Before uploading elsewhere", "Open the downloaded image and confirm important content is still visible, especially faces, text, IDs, product details, or form screenshots."],
      ],
      related: ["compress-image", "convert-image", "image-to-pdf"],
    },
    {
      slug: "convert-image-format-no-upload",
      title: "Convert Image Format Without Uploading",
      headline: "Convert image format without uploading",
      description: "Convert JPG, PNG, and WebP image formats locally in your browser without uploading the source image.",
      lead: "Turn a JPG, PNG, or WebP image into another common format in the browser. Use it when a website rejects the current file type or when you need a lighter web-friendly image.",
      tool: "convert-image",
      intent: "convert image format, JPG to PNG, PNG to WebP, no upload",
      sections: [
        ["Common format mismatch", "Many upload forms accept only one image type. A local converter helps users switch file format without sending private images to a server."],
        ["Format choices", "JPG is useful for photos and small file size. PNG is useful for sharp graphics. WebP is often smaller for web use when the receiving site accepts it."],
        ["Review the result", "After conversion, check that transparency, background color, and image clarity still match the destination requirement."],
      ],
      related: ["compress-image", "resize-image", "multi-image-pdf"],
    },
    {
      slug: "remove-background-no-upload",
      title: "Remove Background Without Uploading",
      headline: "Remove background without uploading",
      description: "Remove a white, solid, green-screen, or near-solid image background locally and download a transparent PNG.",
      lead: "Choose an image, let the browser sample the background color, adjust tolerance, and download a transparent PNG without sending the file to a server.",
      tool: "remove-background",
      intent: "remove background, transparent PNG, white background remover, no upload",
      sections: [
        ["Why this is high intent", "Background removal searches often come from sellers, creators, students, and office users who need a cleaner product image, logo, signature scan, or graphic immediately."],
        ["What this free version does", "The tool removes solid or near-solid backgrounds by color matching in the browser. It works well for white backgrounds, flat product shots, logos, icons, signatures, and green-screen style images."],
        ["Important limit", "This is not a full AI person or hair segmentation tool. Busy backgrounds, shadows, glass, and complex edges may need a dedicated editor."],
      ],
      related: ["compress-image", "convert-image", "signature-png"],
    },
    {
      slug: "crop-image-no-upload",
      title: "Crop Image Without Uploading",
      headline: "Crop image without uploading",
      description: "Crop JPG, PNG, or WebP images locally in your browser for square avatars, product photos, banners, and upload forms.",
      lead: "Choose an image, pick a crop shape, keep the important area in frame, and download a cropped copy without sending the file to a server.",
      tool: "crop-image",
      intent: "crop image online, square crop, no upload",
      sections: [
        ["Why users need it", "Cropping is a common step before a profile photo, marketplace listing, ID-style upload, social post, or banner will look right."],
        ["Local crop workflow", "The image is loaded in the browser, cropped to the selected aspect ratio, and exported as a new image file without requiring an account."],
        ["Before uploading elsewhere", "Check that faces, product edges, text, logos, and important document details are still visible after the crop."],
      ],
      related: ["resize-image", "compress-image", "watermark-image"],
    },
    {
      slug: "rotate-image-no-upload",
      title: "Rotate Image Without Uploading",
      headline: "Rotate image without uploading",
      description: "Rotate or flip JPG, PNG, and WebP images locally in the browser when a photo, scan, or screenshot is sideways.",
      lead: "Fix a sideways image, rotate a scan, or flip a photo locally before using it in a form, profile, document, or listing.",
      tool: "rotate-image",
      intent: "rotate image online, flip image, no upload",
      sections: [
        ["Common use case", "Phone photos and quick scans often come out sideways. A small local rotation tool solves that before the image is attached to another workflow."],
        ["What it changes", "The tool creates a new rotated or flipped copy. It does not edit the original image file on your device."],
        ["Review the result", "Open the downloaded image and confirm orientation, text readability, and any mirrored content before sending it elsewhere."],
      ],
      related: ["crop-image", "resize-image", "image-to-pdf"],
    },
    {
      slug: "watermark-image-no-upload",
      title: "Watermark Image Without Uploading",
      headline: "Watermark image without uploading",
      description: "Add a simple text watermark to JPG, PNG, or WebP images locally for samples, drafts, marketplace photos, and social posts.",
      lead: "Add a visible text watermark in the browser and download a new copy without uploading the source image.",
      tool: "watermark-image",
      intent: "watermark image online, add text watermark, no upload",
      sections: [
        ["Why it can convert", "People often need to share a sample, proof, preview, or product image while keeping a visible ownership or draft mark on the file."],
        ["Ad-safe free workflow", "The watermark export stays free and does not ask visitors to interact with an ad before downloading. That keeps the path safer for future display advertising."],
        ["Practical limits", "A text watermark is a visual deterrent, not copyright enforcement. Keep original files and use proper licensing or platform tools when the image is commercially important."],
      ],
      related: ["compress-image", "resize-image", "crop-image"],
    },
    {
      slug: "add-text-to-image-no-upload",
      title: "Add Text to Image Without Uploading",
      headline: "Add text to image without uploading",
      description: "Add a title, caption, price, label, or meme-style text to a photo locally in your browser.",
      lead: "Choose an image, add short text, pick a placement, and download a new JPG, PNG, or WebP without sending the image to a server.",
      tool: "add-text-image",
      intent: "add text to image, text on photo, caption image, no upload",
      sections: [
        ["Why users need it", "People add text to images for listings, covers, thumbnails, class materials, social posts, memes, announcements, and quick visual notes. Many design tools are heavier than this one-step job."],
        ["Local workflow", "The image is drawn into a canvas in the browser, the text overlay is rendered locally, and the exported file is downloaded as a new image."],
        ["Practical limits", "This is a quick overlay tool, not a full design suite. Keep the message short and check that text remains readable on small screens."],
      ],
      related: ["resize-image", "watermark-image", "crop-image"],
    },
    {
      slug: "signature-png-generator",
      title: "Signature PNG Generator",
      headline: "Signature PNG generator",
      description: "Draw or type a signature and download a transparent PNG locally without signup or upload.",
      lead: "Create a transparent signature PNG for documents, PDF annotations, forms, proposals, and internal paperwork. Draw with a finger, mouse, or stylus, or use a typed fallback when a drawn signature is not needed.",
      tool: "signature-png",
      intent: "signature PNG, transparent signature, draw signature online",
      sections: [
        ["Transparent PNG output", "The export can keep the background transparent so the signature is easier to place on a PDF, image, or document."],
        ["Local-first workflow", "Drawing and typed fallback rendering happen in the browser. PrintableTools Lab does not receive the signature image during ordinary use."],
        ["Important limit", "This creates a visual signature image only. It does not verify identity, manage consent, notarize documents, or replace regulated e-signature platforms."],
      ],
      related: ["sign-pdf", "stamp-pdf", "watermark-image"],
    },
    {
      slug: "passport-photo-maker",
      title: "Passport Photo Maker",
      headline: "Passport photo maker without uploading",
      description: "Crop a passport-style photo locally for US 2x2, UK 35x45, Canada 50x70, and Australia 35x45 sizes.",
      lead: "Upload a photo in your browser, fit it inside a passport-photo guide, and download a correctly sized JPG, PNG, or 4x6 print sheet PDF without sending the image to a server.",
      tool: "passport-photo",
      intent: "passport photo maker, 2x2 photo, 35x45 photo, no upload",
      sections: [
        ["Why this has urgent intent", "Passport photo searches often happen right before an application, renewal, visa form, exam portal, or document upload. Many photo services charge at export or require uploading a private face photo."],
        ["Local crop workflow", "The selected photo stays in the browser. Choose a size preset, adjust zoom and position, then export a single image or a 4x6 print sheet."],
        ["Important limit", "This tool helps with sizing and layout only. It does not check every official lighting, pose, background, expression, recency, or acceptance rule. Always compare the result with the issuing authority's current requirements."],
      ],
      related: ["resize-image", "compress-image-to-kb", "crop-image"],
    },
    {
      slug: "free-qr-code-generator-no-signup",
      title: "Free QR Code Generator Without Signup",
      headline: "Free QR code generator without signup",
      description: "Create a static QR code PDF for a URL, menu, sign, flyer, event page, or short text without creating an account.",
      lead: "Make a printable static QR code in the browser and download a clean PDF without registering. This is useful for signs, menus, flyers, handouts, event pages, packaging notes, and quick links.",
      tool: "qr-code",
      intent: "QR code generator, no signup, printable static QR",
      sections: [
        ["Why this page exists", "Many QR sites advertise a free code and then push account creation, dynamic tracking, or paid downloads. This validation version keeps static QR creation free and simple."],
        ["Static vs dynamic", "A static QR code stores the final link or text directly in the code. It is privacy-friendly and durable, but it cannot be edited after printing."],
        ["Before printing", "Scan the generated code with at least one phone, confirm the destination, and keep enough white space around the code for reliable scanning."],
      ],
      related: ["wifi-qr-code", "vcard-qr-code", "flyer-maker"],
    },
    {
      slug: "wifi-qr-code-generator",
      title: "WiFi QR Code Generator",
      headline: "WiFi QR code generator",
      description: "Create a printable WiFi QR code sign for guest networks, rentals, offices, cafes, classrooms, waiting rooms, and events.",
      lead: "Turn a network name and password into a scannable WiFi QR sign. The PDF is generated locally so you can print a simple guest access page without building a full design.",
      tool: "wifi-qr-code",
      intent: "WiFi QR code generator, guest WiFi sign, printable QR",
      sections: [
        ["Why users need it", "Guests often mistype WiFi passwords. A QR code reduces friction in cafes, rentals, small offices, events, classrooms, and waiting rooms."],
        ["Security note", "Anyone who can scan the printed code can access the encoded network details. Use a guest network and avoid printing private admin credentials."],
        ["Best fit", "Use it for guest WiFi signs, short-term rental welcome sheets, front desk signs, booth check-in areas, and classroom visitor instructions."],
      ],
      related: ["qr-code", "vcard-qr-code", "sign-in-sheet"],
    },
    {
      slug: "contact-qr-code-generator",
      title: "Contact QR Code Generator",
      headline: "Contact QR code generator",
      description: "Create a printable vCard contact QR code for business cards, event badges, service flyers, booth signs, and local promotions.",
      lead: "Enter contact details and download a QR code PDF that phones can scan to save a contact. It is a lightweight alternative to paid digital card services when you only need a printable contact code.",
      tool: "vcard-qr-code",
      intent: "contact QR code, vCard QR generator, printable business contact",
      sections: [
        ["Why this can attract demand", "Small sellers, freelancers, creators, and event exhibitors often need a quick way for visitors to save contact details from a flyer or table sign."],
        ["What the QR stores", "The code uses a vCard-style contact payload with name, company, phone, email, website, and a short note when provided."],
        ["Before sharing", "Scan the code on both iOS and Android if possible, review the saved contact fields, and avoid including sensitive private details on public printouts."],
      ],
      related: ["business-card", "qr-code", "flyer-maker"],
    },
    {
      slug: "compress-jpg-no-upload",
      title: "Compress JPG Without Uploading",
      headline: "Compress JPG without uploading",
      description: "Compress a JPG image locally in your browser before sending it to a form, email, profile, or marketplace listing.",
      lead: "Reduce a JPG photo or screenshot in the browser and download a smaller copy. Use this when an upload form says the image file is too large.",
      tool: "compress-image",
      intent: "compress JPG online, reduce JPG file size, no upload",
      sections: [
        ["Why JPG compression gets searched", "JPG files are common for phone photos, profile pictures, product listings, and support screenshots. The search usually happens after a website rejects the upload size."],
        ["Local compression path", "Choose the JPG, pick a compression level, and download a new file. The browser handles the preview and export without requiring an account."],
        ["Best fit", "Use it for photos, marketplace images, profile uploads, email attachments, help desk screenshots, and form submissions that require smaller JPG files."],
      ],
      related: ["resize-image", "convert-image", "image-to-pdf"],
    },
    {
      slug: "compress-png-no-upload",
      title: "Compress PNG Without Uploading",
      headline: "Compress PNG without uploading",
      description: "Compress or re-export a PNG image locally in your browser when a form or email rejects a large file.",
      lead: "Make a smaller PNG or convert it to a compact JPG/WebP copy locally. This is useful for screenshots, graphics, forms, and support images.",
      tool: "compress-image",
      intent: "compress PNG online, reduce PNG size, no upload",
      sections: [
        ["Why PNG files get large", "Screenshots and graphics often save as PNG because they preserve sharp edges. That can create large files when a website only accepts smaller uploads."],
        ["Compression choices", "Keep PNG when sharp graphics matter, or export as JPG/WebP from the same tool when a smaller photo-style file is acceptable."],
        ["Review before upload", "Open the downloaded image and confirm text, edges, transparency, and important details still look right before sending it elsewhere."],
      ],
      related: ["convert-image", "resize-image", "image-to-pdf"],
    },
    {
      slug: "resize-image-1080x1080",
      title: "Resize Image to 1080x1080",
      headline: "Resize image to 1080x1080",
      description: "Resize an image to a 1080 by 1080 square locally in your browser for profile, listing, or social post requirements.",
      lead: "Create a square 1080x1080 image in the browser without uploading the source file. This is a common size for social posts, product images, and profile-style uploads.",
      tool: "resize-image",
      intent: "resize image to 1080x1080, square image resize, no upload",
      sections: [
        ["Common square requirement", "Many upload workflows prefer square images because they display cleanly in grids, cards, avatars, and listings."],
        ["Fit or crop decision", "Use fit inside when the full image must stay visible. Use fill and crop when the final file must be an exact square."],
        ["Before publishing", "Check faces, product edges, labels, and text after resizing because square crops can remove important context."],
      ],
      related: ["compress-image", "convert-image", "image-to-pdf"],
    },
    {
      slug: "resize-image-512x512",
      title: "Resize Image to 512x512",
      headline: "Resize image to 512x512",
      description: "Resize an image to 512 by 512 pixels locally in your browser for avatars, icons, thumbnails, and small profile uploads.",
      lead: "Create a small square 512x512 image in the browser. This works well for avatars, icons, thumbnail uploads, and profile pictures with strict dimension rules.",
      tool: "resize-image",
      intent: "resize image to 512x512, profile picture resizer, no upload",
      sections: [
        ["Why 512x512 matters", "Small square images are often requested for avatars, account icons, thumbnails, app profiles, and lightweight upload forms."],
        ["Keep it readable", "At 512 pixels, tiny text and product details can become hard to read. Crop around the main subject before uploading the result."],
        ["Privacy angle", "The image is processed locally in the browser, which is helpful when the source is a personal profile photo or ID-related upload preview."],
      ],
      related: ["compress-image", "convert-image", "image-to-pdf"],
    },
    {
      slug: "png-to-jpg-no-upload",
      title: "PNG to JPG Without Uploading",
      headline: "PNG to JPG without uploading",
      description: "Convert PNG to JPG locally in your browser when a website needs a JPG file or a smaller photo-style image.",
      lead: "Turn a PNG screenshot or graphic into a JPG copy in the browser. Use it when an upload form accepts JPG but rejects PNG, or when the PNG is too large.",
      tool: "convert-image",
      intent: "PNG to JPG converter, no upload, browser image conversion",
      sections: [
        ["When PNG to JPG helps", "Many websites accept JPG for photos and listings but reject PNG. JPG can also be smaller for photo-style images."],
        ["Background note", "JPG does not preserve transparency. If the PNG has transparent areas, choose a white or black background before export."],
        ["Check the result", "Open the JPG and confirm text, colors, and any transparent areas look acceptable for the destination site."],
      ],
      related: ["compress-image", "resize-image", "image-to-pdf"],
    },
    {
      slug: "webp-to-jpg-no-upload",
      title: "WebP to JPG Without Uploading",
      headline: "WebP to JPG without uploading",
      description: "Convert WebP to JPG locally in your browser when a form, marketplace, or older app does not accept WebP files.",
      lead: "Convert a WebP image into a JPG copy without sending the source file to a server. Use it when a website accepts JPG but not WebP.",
      tool: "convert-image",
      intent: "WebP to JPG converter, no upload, browser image conversion",
      sections: [
        ["Why WebP gets rejected", "WebP is common on the web, but some forms, portals, marketplaces, and older tools still ask for JPG or PNG uploads."],
        ["Local format conversion", "Select the WebP, choose JPG, and download a compatible copy from the browser. No account is needed for the free conversion."],
        ["Quality check", "Review the converted JPG before uploading it elsewhere, especially if the original WebP contained small text or transparent areas."],
      ],
      related: ["compress-image", "resize-image", "image-to-pdf"],
    },
    {
      slug: "text-to-pdf-no-signup",
      title: "Text to PDF Converter Without Signup",
      headline: "Text to PDF converter without signup",
      description: "Paste plain text and download a clean PDF without installing an editor, uploading a file, or creating an account.",
      lead: "Turn notes, instructions, short letters, meeting summaries, or plain text drafts into a simple one-page PDF. No account is required for the free export.",
      tool: "text-to-pdf",
      intent: "plain text to PDF with no account",
      sections: [
        ["Fast plain text workflow", "Paste text, choose a readable size, generate the preview, and download the PDF. This is intentionally simpler than a full document editor."],
        ["Good use cases", "Use it for short notes, printable instructions, handouts, simple letters, checklists, and text copied from another app."],
        ["One-page focus", "The free version is best for concise documents. Long text should be shortened or split into sections before export."],
      ],
      related: ["image-to-pdf", "todo-list", "sign-in-sheet"],
    },
    {
      slug: "markdown-to-pdf-no-signup",
      title: "Markdown to PDF Converter Without Signup",
      headline: "Markdown to PDF converter without signup",
      description: "Paste Markdown notes, README text, docs, or outlines and download a clean PDF locally in your browser.",
      lead: "Turn Markdown into a readable PDF without creating an account, installing an editor, or uploading the source text. It is useful for README drafts, changelogs, project notes, study notes, and handouts.",
      tool: "markdown-to-pdf",
      intent: "Markdown to PDF, no account, no upload",
      sections: [
        ["Fast Markdown workflow", "Paste Markdown, choose a simple style, generate the preview, and download the PDF. The first version focuses on readable headings, lists, quotes, and paragraphs."],
        ["Good use cases", "Use it for README snapshots, project notes, lesson outlines, meeting summaries, simple docs, and checklists that need a PDF copy."],
        ["Local processing", "The Markdown is rendered in the browser preview and exported as a PDF page without requiring a server upload."],
      ],
      related: ["text-to-pdf", "json-to-pdf", "todo-list"],
    },
    {
      slug: "csv-to-pdf-no-upload",
      title: "CSV to PDF Table Converter Without Uploading",
      headline: "CSV to PDF table converter without uploading",
      description: "Paste CSV rows and export a readable PDF table locally without uploading a spreadsheet.",
      lead: "Create a simple PDF table from CSV rows in the browser. This is useful for inventory lists, event rosters, order lists, task lists, price sheets, and small reports that need a printable copy.",
      tool: "csv-to-pdf",
      intent: "CSV to PDF table, no upload, no account",
      sections: [
        ["Paste rows, get a table", "The first CSV row becomes the header and the remaining rows become table lines. Keep the table small enough to read clearly on one page."],
        ["Why local CSV helps", "CSV files can include customer names, small order details, event rosters, or stock counts. A local converter avoids uploading the data for ordinary quick exports."],
        ["Before sharing", "Open the downloaded PDF and confirm every column is readable, especially when the CSV has long text fields."],
      ],
      related: ["inventory-sheet", "packing-slip", "text-to-pdf"],
    },
    {
      slug: "json-to-pdf-no-upload",
      title: "JSON to PDF Formatter Without Uploading",
      headline: "JSON to PDF formatter without uploading",
      description: "Paste JSON and download a readable formatted PDF locally in your browser.",
      lead: "Format JSON into a clean PDF page without sending the source data to a server. It is useful for API samples, config snippets, bug reports, test fixtures, and technical notes.",
      tool: "json-to-pdf",
      intent: "JSON to PDF formatter, no upload, no account",
      sections: [
        ["Readable technical notes", "The formatter pretty-prints valid JSON and shows invalid JSON as plain text with a warning so you can still export a review copy."],
        ["Local-first workflow", "The JSON is processed in the browser. Do not paste secrets, keys, or private production data unless you have reviewed and removed sensitive values."],
        ["Good use cases", "Use it for sample payloads, documentation snippets, QA notes, configuration examples, and small API response references."],
      ],
      related: ["markdown-to-pdf", "text-to-pdf", "csv-to-pdf"],
    },
    {
      slug: "merge-pdf-no-upload",
      title: "Merge PDF Without Uploading",
      headline: "Merge PDF without uploading",
      description: "Combine PDF files locally in your browser without uploading documents or creating an account.",
      lead: "Select several PDF files, preview the order, and download one combined PDF. This is built for private paperwork, school forms, receipts, and admin documents you do not want to upload to a converter server.",
      tool: "merge-pdf",
      intent: "combine PDF files, no upload, no account",
      sections: [
        ["Local merge workflow", "The selected PDFs are read in the browser and copied into a new combined file. Ordinary merging does not send the documents to a server."],
        ["Best fit", "Use it for forms, receipts, scan batches, school packets, client documents, or any small set of PDFs that needs one file."],
        ["Practical limits", "Very large PDFs can use a lot of browser memory. For sensitive or high-stakes documents, review the final PDF before sharing it."],
      ],
      related: ["split-pdf", "pdf-page-numbers", "multi-image-pdf"],
    },
    {
      slug: "split-pdf-no-upload",
      title: "Split PDF Without Uploading",
      headline: "Split PDF without uploading",
      description: "Extract selected PDF pages locally in your browser without uploading the document.",
      lead: "Choose one PDF, enter the pages you want to keep, and download a smaller extracted PDF. It is designed for quick page removal and document trimming without an upload step.",
      tool: "split-pdf",
      intent: "extract PDF pages, no upload, no account",
      sections: [
        ["Extract only what you need", "Use page numbers or ranges such as 1,3-5 to keep the pages that matter and leave the rest out of the new PDF."],
        ["Privacy positioning", "The source PDF is processed in the browser for ordinary extraction, which is useful when a document includes private pages you do not want to upload."],
        ["Before sharing", "Open the downloaded file and confirm the page order and page count before sending it to a school, client, employer, or portal."],
      ],
      related: ["merge-pdf", "pdf-page-numbers", "text-to-pdf"],
    },
    {
      slug: "add-page-numbers-to-pdf",
      title: "Add Page Numbers to PDF",
      headline: "Add page numbers to PDF",
      description: "Add simple page numbers to an existing PDF locally in your browser without uploading the file.",
      lead: "Select a PDF, choose where the page numbers should appear, and download a numbered copy. It is useful for packets, handouts, client drafts, and documents that need page references.",
      tool: "pdf-page-numbers",
      intent: "add page numbers to PDF, no upload, no account",
      sections: [
        ["Why page numbers matter", "Longer PDF packets are easier to review when each page has a clear number. This tool adds simple numbering without forcing a design app."],
        ["Local-first workflow", "The PDF is loaded and edited in the browser for ordinary numbering. The site does not need the file to add the visible page text."],
        ["Best fit", "Use it for classroom packets, meeting handouts, client drafts, applications, reports, and merged PDFs that need references."],
      ],
      related: ["merge-pdf", "split-pdf", "text-to-pdf"],
    },
    {
      slug: "rotate-pdf-no-upload",
      title: "Rotate PDF Pages Without Uploading",
      headline: "Rotate PDF pages without uploading",
      description: "Rotate PDF pages locally in your browser without uploading the file or creating an account.",
      lead: "Select a PDF, choose a rotation angle, and rotate all pages or only selected pages. It is useful when scans, forms, or phone-generated PDFs are sideways or upside down.",
      tool: "rotate-pdf",
      intent: "rotate PDF pages, no upload, no account",
      sections: [
        ["Fix sideways scans quickly", "Scanned forms and phone photos often become PDFs with the wrong orientation. This tool rotates pages locally before you share the file."],
        ["Selected pages or all pages", "Use all when the whole document is sideways, or enter ranges such as 1,3-5 when only a few pages need correction."],
        ["Review before sending", "Open the downloaded copy and confirm the orientation is correct on every page before uploading it to a portal or sending it to someone else."],
      ],
      related: ["split-pdf", "remove-pdf-pages", "reorder-pdf-pages"],
    },
    {
      slug: "remove-pages-from-pdf-no-upload",
      title: "Remove Pages from PDF Without Uploading",
      headline: "Remove pages from PDF without uploading",
      description: "Delete selected PDF pages locally in your browser without uploading the document.",
      lead: "Choose a PDF, enter the pages you want to remove, and download a new copy without those pages. It is built for trimming blank pages, cover sheets, duplicates, and private pages.",
      tool: "remove-pdf-pages",
      intent: "delete PDF pages, no upload, no account",
      sections: [
        ["Trim only the unwanted pages", "Enter pages or ranges such as 1,3-5. The export keeps the remaining pages in their original order."],
        ["Privacy positioning", "Removing pages locally helps when the source document contains private pages that you do not want to send to an online converter."],
        ["Avoid mistakes", "Check the preview count, then open the downloaded PDF and confirm the removed pages are really gone before sharing it."],
      ],
      related: ["split-pdf", "reorder-pdf-pages", "merge-pdf"],
    },
    {
      slug: "reorder-pdf-pages-no-upload",
      title: "Reorder PDF Pages Without Uploading",
      headline: "Reorder PDF pages without uploading",
      description: "Rearrange PDF pages locally in your browser by entering the new page order.",
      lead: "Select one PDF and type the page order you want, such as 3,1,2. This creates a new PDF in that order without uploading the source document.",
      tool: "reorder-pdf-pages",
      intent: "reorder PDF pages, organize PDF, no upload",
      sections: [
        ["Organize pages by number", "Use a comma-separated page order to move pages around. You can also omit pages when you only want a shorter ordered copy."],
        ["Common use cases", "Reorder scanned forms, handouts, application packets, receipts, classroom files, or client drafts when pages were captured out of sequence."],
        ["Keep it simple", "This first version uses typed page numbers instead of a drag interface so it stays fast, mobile-friendly, and free to run without a server."],
      ],
      related: ["merge-pdf", "remove-pdf-pages", "pdf-page-numbers"],
    },
    {
      slug: "watermark-pdf-no-upload",
      title: "Add Watermark to PDF Without Uploading",
      headline: "Add watermark to PDF without uploading",
      description: "Add a text watermark to PDF pages locally in your browser without uploading the file.",
      lead: "Select a PDF, type the watermark text, choose all pages or selected pages, and download a marked copy. This is useful for drafts, samples, review files, and internal paperwork that should stay local.",
      tool: "watermark-pdf",
      intent: "watermark PDF, no upload, free browser tool",
      sections: [
        ["Mark drafts and samples", "A watermark helps show that a PDF is a draft, sample, confidential copy, or review version without changing the original file."],
        ["Local-first workflow", "The PDF is read and edited in the browser for ordinary watermarking, which avoids sending private documents to a converter server."],
        ["Use a light mark", "A useful watermark is visible but does not hide the actual document. Review the downloaded PDF before sharing it."],
      ],
      related: ["stamp-pdf", "sign-pdf", "pdf-page-numbers"],
    },
    {
      slug: "stamp-pdf-no-upload",
      title: "Stamp PDF Without Uploading",
      headline: "Stamp PDF without uploading",
      description: "Add a PAID, APPROVED, DRAFT, or custom text stamp to PDF pages locally in your browser.",
      lead: "Add a simple status stamp to a PDF copy without creating an account or uploading the source file. Use it for paid receipts, approved drafts, review packets, or internal document routing.",
      tool: "stamp-pdf",
      intent: "stamp PDF, paid stamp, approved stamp, no upload",
      sections: [
        ["Status stamps for real paperwork", "A visible stamp can make a receipt, invoice, work order, or draft easier to scan when it moves between people."],
        ["Choose the pages", "Stamp every page or enter a short range such as 1,3-5 when only the cover or key pages need a status mark."],
        ["Review before relying on it", "A stamp is a visual annotation, not proof of payment or legal approval by itself. Keep the underlying records too."],
      ],
      related: ["watermark-pdf", "receipt-generator", "work-order"],
    },
    {
      slug: "sign-pdf-no-upload",
      title: "Add Signature Text to PDF Without Uploading",
      headline: "Add signature text to PDF without uploading",
      description: "Place a typed signature block on a selected PDF page locally in your browser.",
      lead: "Add a typed signature name and optional date to a selected PDF page. This is a lightweight browser tool for documents where a typed signature block is acceptable.",
      tool: "sign-pdf",
      intent: "sign PDF, typed signature, no upload",
      sections: [
        ["Typed signature block", "The tool adds a signature line, typed name, and optional date to a selected page. It does not claim to be an e-signature platform."],
        ["Local processing", "The PDF is read and annotated in the browser for ordinary use, so the source file does not need to be uploaded to PrintableTools Lab."],
        ["Check acceptance rules", "Some documents require a specific e-sign provider, handwritten signature, witness, or identity check. Use this only where a typed signature is acceptable."],
      ],
      related: ["stamp-pdf", "watermark-pdf", "pdf-page-numbers"],
    },
    {
      slug: "free-resume-builder-no-signup",
      title: "Free Resume Builder Without Signup",
      headline: "Free resume builder without signup",
      description: "Build and download a clean one-page resume PDF without creating an account or paying at the export step.",
      lead: "Create a simple resume PDF for job applications without a hidden download fee. The layout is plain, readable, and built for quick edits before applying.",
      tool: "resume-builder",
      intent: "resume PDF download without account or paywall",
      sections: [
        ["Avoid the export surprise", "Some resume builders let users type the whole resume and then charge at download. This tool is positioned around a free one-page PDF export first."],
        ["Readable structure", "The resume includes name, headline, contact line, summary, experience, skills, and education in a simple single-column format."],
        ["Before applying", "Proofread every line, avoid private details you do not want to share, and tailor the summary and experience bullets to the role."],
      ],
      related: ["cover-letter", "resignation-letter", "text-to-pdf"],
    },
    {
      slug: "ats-resume-checker-free",
      title: "Free ATS Resume Checker",
      headline: "Free ATS resume checker",
      description: "Check resume text against a job description locally and download a one-page ATS keyword match report.",
      lead: "Paste your resume text and a job description to get a local keyword, section, readability, and evidence check. The report is designed for practical editing before you apply.",
      tool: "ats-resume-checker",
      intent: "ATS resume checker, resume keyword match, job description match",
      sections: [
        ["Why this is high intent", "Job seekers often search for ATS checks right before applying. Many resume sites show a score or suggestions only after signup, upload, or paid export."],
        ["Local text check", "This checker runs on pasted text in the browser. It does not upload your resume and does not promise a universal ATS score, interview, or hiring outcome."],
        ["What to fix first", "Use the report to compare honest keywords, section headings, measurable achievements, contact details, and overly complex wording against the role."],
      ],
      related: ["resume-builder", "cover-letter", "text-to-pdf"],
    },
    {
      slug: "free-receipt-generator-no-signup",
      title: "Free Receipt Generator Without Signup",
      headline: "Free receipt generator without signup",
      description: "Create a printable receipt PDF for a sale, deposit, service payment, reimbursement, or rent record without an account.",
      lead: "Make a simple dated receipt PDF when money has already changed hands. It is useful for service payments, deposits, private sales, reimbursements, and basic records.",
      tool: "receipt-generator",
      intent: "receipt PDF now, no account, quick proof of payment",
      sections: [
        ["Invoice vs receipt", "Use an invoice before payment is due. Use a receipt after payment is made and both sides need a record."],
        ["What to include", "Payer, recipient, payment date, amount, method, description, and a short note. Keep copies with your own records."],
        ["Limits", "This is a practical receipt format, not legal, tax, or accounting advice. Requirements vary by business type and location."],
      ],
      related: ["invoice-generator", "rent-receipt", "bill-of-sale"],
    },
    {
      slug: "weekly-timesheet-pdf-no-signup",
      title: "Weekly Timesheet PDF Without Signup",
      headline: "Weekly timesheet PDF without signup",
      description: "Create a printable weekly timesheet PDF for freelance hours, staff records, project tracking, or approvals without creating an account.",
      lead: "Track days, projects, hours, notes, total hours, and approval signature on one printable page. Good for freelancers, contractors, and small teams.",
      tool: "timesheet-generator",
      intent: "weekly timesheet PDF with fast export",
      sections: [
        ["Repeat use", "Timesheets are naturally recurring. A fast no-signup page can serve weekly or pay-period workflows without forcing a full HR app."],
        ["What it includes", "Worker, period, day/project/hour rows, notes, total hours, and signature lines. Review hours before submitting them."],
        ["When to use a system", "If payroll, compliance, overtime, or approvals are complex, use proper time-tracking or payroll software. This page is for simple printable records."],
      ],
      related: ["invoice-generator", "receipt-generator", "todo-list"],
    },
    {
      slug: "free-certificate-maker-no-signup",
      title: "Free Certificate Maker Without Signup",
      headline: "Free certificate maker without signup",
      description: "Create and download a printable certificate PDF for classroom awards, participation, completion, clubs, and small events.",
      lead: "Generate a certificate PDF quickly for a classroom, club, workshop, team, or small event. The first version focuses on a clean printable layout instead of a template marketplace.",
      tool: "certificate-generator",
      intent: "certificate PDF download without account",
      sections: [
        ["Useful moments", "Use it for completion, participation, appreciation, classroom awards, clubs, small events, and workshops."],
        ["Simple fields", "Certificate title, recipient name, reason, date, style, and signer are enough for a practical printable certificate."],
        ["Print check", "Preview the PDF before printing and confirm names, dates, and signer spelling. Certificates are usually noticed for typos."],
      ],
      related: ["sign-in-sheet", "todo-list", "flashcards"],
    },
    {
      slug: "free-business-card-generator-printable",
      title: "Free Printable Business Card Generator",
      headline: "Free printable business card generator",
      description: "Create a printable business card PDF sheet without signing up, uploading a logo, or paying at download.",
      lead: "Make a simple contact card sheet for a side project, local service, pop-up table, class, or event. It is built for people who need usable cards today, not a full design suite.",
      tool: "business-card",
      intent: "printable business cards now, no account, no design software",
      sections: [
        ["Why this works as a free tool", "Business card builders often push users toward print orders or paid template downloads. A browser-side sheet solves the one-time need first and can validate whether small-business searches bring repeat usage."],
        ["Best fit", "Use it for simple service cards, networking cards, appointment cards, event contact cards, and temporary cards before ordering professional prints."],
        ["Print check", "Print one test page, trim along the card edges, and confirm the email, phone, and URL are readable before printing more."],
      ],
      related: ["flyer-maker", "coupon-maker", "address-labels"],
    },
    {
      slug: "free-address-label-generator-printable",
      title: "Free Printable Address Label Generator",
      headline: "Free printable address label generator",
      description: "Create return address labels, mailing labels, badge labels, or classroom labels as a printable PDF sheet.",
      lead: "Generate a clean label sheet in the browser for mail, bins, folders, event badges, or small shipping workflows. No account is required for the free PDF export.",
      tool: "address-labels",
      intent: "mailing label PDF, return address labels, no signup",
      sections: [
        ["Recurring pain", "Labels are needed in bursts: mailing, events, classrooms, inventory, and small office admin. A free printable sheet can attract practical repeat searches without a backend."],
        ["What it includes", "Choose 30 address labels, 14 shipping-style labels, or 10 badge labels, then edit the label title, recipient, address text, and note."],
        ["Before printing on sticker sheets", "Run a plain-paper test first and hold it behind the label sheet to check alignment before using adhesive stock."],
      ],
      related: ["barcode-labels", "business-card", "price-tag"],
    },
    {
      slug: "free-barcode-label-generator-printable",
      title: "Free Printable Barcode Label Generator",
      headline: "Free printable barcode label generator",
      description: "Generate printable Code 39 barcode labels for SKUs, inventory bins, event check-in, and internal tracking.",
      lead: "Create a label sheet with scannable Code 39-style bars and optional human-readable text. It is intended for simple internal labels, not regulated retail compliance.",
      tool: "barcode-labels",
      intent: "barcode label PDF, SKU labels, inventory stickers",
      sections: [
        ["High-intent utility", "Barcode tools are commonly monetized through subscriptions, dynamic inventory systems, or paid label software. A free static label PDF covers small internal workflows."],
        ["Supported codes", "Use uppercase letters, numbers, spaces, dashes, dots, dollar signs, slashes, plus signs, and percent signs. Keep codes short for better scanning."],
        ["Validation note", "Print and test a sample with the scanner or app you plan to use before producing a full sheet."],
      ],
      related: ["address-labels", "price-tag", "purchase-order"],
    },
    {
      slug: "free-price-tag-generator-printable",
      title: "Free Printable Price Tag Generator",
      headline: "Free printable price tag generator",
      description: "Create printable price tags or shelf labels for yard sales, pop-up shops, craft fairs, and small retail tables.",
      lead: "Make a sheet of clean price tags with a title, price, subtitle, and footer. This helps small sellers prepare a table quickly without buying a template pack.",
      tool: "price-tag",
      intent: "price tag PDF, shelf labels, yard sale tags",
      sections: [
        ["Why this has commercial intent", "People searching for price tags are often preparing to sell at a market, garage sale, or shop. That makes the traffic more business-adjacent than generic printables."],
        ["Best fit", "Use it for craft fairs, yard sales, pop-up tables, shelf labels, sale tags, and quick event pricing."],
        ["Print tip", "Use thicker paper if tags will be handled often, and keep prices large enough to read from a few feet away."],
      ],
      related: ["coupon-maker", "flyer-maker", "barcode-labels"],
    },
    {
      slug: "free-flyer-maker-pdf-no-signup",
      title: "Free Flyer Maker PDF Without Signup",
      headline: "Free flyer maker PDF without signup",
      description: "Make a printable flyer PDF for a local service, yard sale, community event, class, or small business offer.",
      lead: "Create a one-page flyer with a headline, subhead, details, call to action, and contact line. The free export is designed for urgent local promotion.",
      tool: "flyer-maker",
      intent: "flyer PDF now, no signup, local event flyer",
      sections: [
        ["Why users click", "Flyer searches often come from time-sensitive local promotion: a sale, class, service, club, or community event. A fast PDF can satisfy that need without a design account."],
        ["What the flyer includes", "The layout keeps the headline prominent, uses short detail copy, and leaves a clear contact or location line."],
        ["Responsible use", "Only create flyers for events, offers, and services you are authorized to promote. Review local posting rules before printing."],
      ],
      related: ["business-card", "coupon-maker", "price-tag"],
    },
    {
      slug: "free-coupon-maker-printable",
      title: "Free Printable Coupon Maker",
      headline: "Free printable coupon maker",
      description: "Create printable coupon cards for local services, small shops, pop-up events, classes, or simple promotions.",
      lead: "Build a coupon sheet with an offer, code, details, expiration note, and fine print. It is useful for local promotions without adding payment or account friction.",
      tool: "coupon-maker",
      intent: "printable coupon cards, discount coupon PDF, no signup",
      sections: [
        ["Commercial intent", "Coupons are attached to offers, services, and local sales. That makes the category a better monetization test than purely decorative printables."],
        ["What to include", "Keep the offer clear, add a short code if needed, state the expiration note, and include simple limitations so customers know how to use it."],
        ["Compliance note", "Do not create misleading offers or coupons for brands you do not own. Keep terms accurate and easy to read."],
      ],
      related: ["flyer-maker", "price-tag", "business-card"],
    },
    {
      slug: "free-packing-slip-generator-printable",
      title: "Free Printable Packing Slip Generator",
      headline: "Free printable packing slip generator",
      description: "Create a printable packing slip PDF for small orders, marketplace sales, handmade products, and local delivery without signing up.",
      lead: "Make a simple packing slip PDF for a customer order, package insert, local delivery, or handmade product shipment. It is built for sellers who need one clear order sheet without full shipping software.",
      tool: "packing-slip",
      intent: "packing slip PDF, order packing sheet, no signup",
      sections: [
        ["Commercial intent", "Packing slip searches often come from sellers preparing real orders. That makes the page business-adjacent and stronger for ad-supported validation than decorative printables."],
        ["What to include", "Sender, ship-to details, order number, ship date, item names, quantities, status, and a short packing note. Keep payment details off the slip unless they are truly needed."],
        ["Best fit", "Use it for marketplace orders, handmade goods, local delivery, pop-up shop pickups, and small warehouse workflows before investing in shipping software."],
      ],
      related: ["inventory-sheet", "barcode-labels", "address-labels"],
    },
    {
      slug: "free-work-order-generator-pdf",
      title: "Free Work Order Generator PDF",
      headline: "Free work order generator PDF",
      description: "Create a work order PDF for repair jobs, field service, maintenance visits, cleaning jobs, contractor tasks, and approval records.",
      lead: "Build a printable work order with provider details, client or site information, tasks, schedule, instructions, and approval notes. No account is required for the free PDF export.",
      tool: "work-order",
      intent: "work order PDF, service order form, contractor job sheet",
      sections: [
        ["Why users search", "Work order searches usually happen right before a service visit, repair task, or client approval. A fast PDF can satisfy that moment without forcing field-service software."],
        ["What it includes", "Provider and client blocks, work order number, date, schedule or status, task rows, estimated total, instructions, and signature lines."],
        ["Limits", "This is a practical job form, not a compliance system. Confirm safety requirements, approval rules, and local regulations before starting work."],
      ],
      related: ["estimate-generator", "invoice-generator", "timesheet-generator"],
    },
    {
      slug: "free-inventory-sheet-generator",
      title: "Free Inventory Sheet Generator",
      headline: "Free inventory sheet generator",
      description: "Create a printable inventory count sheet PDF for stock checks, craft fairs, market tables, storage bins, classrooms, and small retail shelves.",
      lead: "Make a printable inventory count sheet for small stock checks, before-and-after event counts, shelf reviews, storage bins, or classroom supplies.",
      tool: "inventory-sheet",
      intent: "inventory count sheet PDF, stock count template, no signup",
      sections: [
        ["Repeat-use pain", "Inventory counts happen again and again for sellers, classrooms, events, and storage areas. A printable sheet can earn repeat visits if it is faster than opening a spreadsheet."],
        ["What it includes", "Title, location, count date, SKU, item name, expected quantity, counted quantity, notes, and restock reminders."],
        ["Best fit", "Use it for craft fairs, market tables, small retail shelves, supply closets, event materials, or simple stock checks before reordering."],
      ],
      related: ["barcode-labels", "price-tag", "packing-slip"],
    },
  ];

  const landingPagesBySlug = Object.fromEntries(landingPages.map((page) => [page.slug, page]));

  const toolFinderRows = [
    {
      need: "Turn a photo, scan, or screenshot into a PDF",
      tool: "image-to-pdf",
      why: "Best for one image or a small gallery on one page.",
    },
    {
      need: "Create one PDF with several image pages",
      tool: "multi-image-pdf",
      why: "Best when each image should become its own PDF page.",
    },
    {
      need: "Convert PDF pages into JPG or PNG images",
      tool: "pdf-to-images",
      why: "Best when a website, message, listing, or form needs image files instead of a PDF.",
    },
    {
      need: "Extract selectable text from a PDF",
      tool: "pdf-to-text",
      why: "Best when you need a local TXT copy of embedded PDF text for notes, review, or cleanup.",
    },
    {
      need: "Turn a PDF into an editable Word document",
      tool: "pdf-to-word",
      why: "Best for selectable-text PDFs when you need a simple DOCX draft without uploading the file to a converter.",
    },
    {
      need: "Make an image file smaller",
      tool: "compress-image",
      why: "Best for reducing a JPG, PNG, or WebP before uploading it to a form, email, marketplace, or profile.",
    },
    {
      need: "Compress an image to 100KB, 200KB, or another upload limit",
      tool: "compress-image-to-kb",
      why: "Best when a portal, form, exam site, or job application has a strict KB file-size limit.",
    },
    {
      need: "Resize an image to exact dimensions",
      tool: "resize-image",
      why: "Best for custom width, square profile photos, thumbnails, and social image sizes.",
    },
    {
      need: "Convert JPG, PNG, or WebP",
      tool: "convert-image",
      why: "Best when a website rejects the current image type and you need a different format.",
    },
    {
      need: "Remove a white or solid background from an image",
      tool: "remove-background",
      why: "Best for product photos, logos, signature scans, icons, and green-screen images that need a transparent PNG.",
    },
    {
      need: "Add a headline, price, caption, or meme text to an image",
      tool: "add-text-image",
      why: "Best for thumbnails, product labels, announcements, class visuals, and quick social images.",
    },
    {
      need: "Paste text and download a simple PDF",
      tool: "text-to-pdf",
      why: "Best for notes, short letters, and copied text.",
    },
    {
      need: "Combine several PDFs into one file",
      tool: "merge-pdf",
      why: "Best for local no-upload merging when the files should stay in the browser.",
    },
    {
      need: "Extract only a few pages from a PDF",
      tool: "split-pdf",
      why: "Best for keeping page ranges without uploading the source PDF.",
    },
    {
      need: "Add visible page numbers to a PDF",
      tool: "pdf-page-numbers",
      why: "Best for packets, handouts, drafts, and combined PDFs that need references.",
    },
    {
      need: "Rotate sideways or upside-down PDF pages",
      tool: "rotate-pdf",
      why: "Best for correcting scanned forms and phone-generated PDFs without uploading the file.",
    },
    {
      need: "Delete unwanted pages from a PDF",
      tool: "remove-pdf-pages",
      why: "Best for removing blank pages, duplicates, covers, or private pages while keeping the rest.",
    },
    {
      need: "Put PDF pages in a new order",
      tool: "reorder-pdf-pages",
      why: "Best for scanned packets or drafts where pages were captured out of sequence.",
    },
    {
      need: "Add a watermark to a PDF",
      tool: "watermark-pdf",
      why: "Best for marking drafts, samples, review copies, and private files locally before sending.",
    },
    {
      need: "Stamp a PDF as paid, approved, or draft",
      tool: "stamp-pdf",
      why: "Best for simple status stamps on receipts, invoices, work orders, and review files.",
    },
    {
      need: "Add a typed signature line to a PDF",
      tool: "sign-pdf",
      why: "Best for lightweight signature blocks when a typed signature is acceptable for the document.",
    },
    {
      need: "Download a transparent signature PNG",
      tool: "signature-png",
      why: "Best when you need a visual signature image for a document, PDF annotation, proposal, or form.",
    },
    {
      need: "Bill a client or record work before payment",
      tool: "invoice-generator",
      why: "Use an invoice before payment is due.",
    },
    {
      need: "Write a payment reminder or overdue invoice follow-up",
      tool: "invoice-followup-email",
      why: "Best for copy-ready reminder wording after sending an invoice.",
    },
    {
      need: "Show proof after money was paid",
      tool: "receipt-generator",
      why: "Use a receipt after payment happens.",
    },
    {
      need: "Track hours for a week or pay period",
      tool: "timesheet-generator",
      why: "Best for freelancers, contractors, and staff records.",
    },
    {
      need: "Print quick contact cards for a service or side business",
      tool: "business-card",
      why: "Best for one-page business card sheets without ordering prints.",
    },
    {
      need: "Make mailing, return address, badge, or bin labels",
      tool: "address-labels",
      why: "Best for printable label sheets that do not require label software.",
    },
    {
      need: "Create simple barcode or SKU labels",
      tool: "barcode-labels",
      why: "Best for internal Code 39 labels, inventory bins, and event check-in.",
    },
    {
      need: "Print price tags, coupons, or a local flyer",
      tool: "price-tag",
      why: "Start with price tags for selling tables, then use flyer or coupon tools for promotion.",
    },
    {
      need: "Pack and ship a small customer order",
      tool: "packing-slip",
      why: "Best for marketplace sellers and small shops that need a printable order insert.",
    },
    {
      need: "Create a service or repair job form",
      tool: "work-order",
      why: "Best for contractors, maintenance visits, field service, cleaning jobs, and repair tasks.",
    },
    {
      need: "Count stock, bins, or market-table inventory",
      tool: "inventory-sheet",
      why: "Best for small stock counts before or after a sale, event, shelf check, or storage review.",
    },
    {
      need: "Make a job application PDF",
      tool: "resume-builder",
      why: "Start with the resume, then add a cover letter if needed.",
    },
    {
      need: "Make an event or classroom sheet",
      tool: "sign-in-sheet",
      why: "Best for attendance, check-in, and visitor logs.",
    },
    {
      need: "Make graph paper or a blank grid",
      tool: "graph-paper",
      why: "Best for math, notes, sketching, and planning.",
    },
    {
      need: "Make an award or participation certificate",
      tool: "certificate-generator",
      why: "Best for classrooms, clubs, events, and simple recognition.",
    },
  ];

  const guides = [
    {
      slug: "free-invoice-generator-no-signup",
      title: "Free invoice generator without signup",
      description: "Create a clean invoice PDF without an account, upload step, or surprise export paywall.",
      tool: "invoice-generator",
      content: [
        ["h2", "Fast invoice PDF export"],
        ["p", "A user searching for a no-signup invoice generator usually needs one PDF immediately. The invoice tool opens in the browser, exports a clean PDF, and avoids the common pay-at-download surprise."],
        ["h2", "What to check before sending"],
        ["ul", ["Business and client details.", "Invoice number and date.", "Line items, quantity, rate, and total.", "Payment terms and any footer note."]],
      ],
    },
    {
      slug: "jpg-to-pdf-no-upload",
      title: "JPG to PDF without uploading",
      description: "Convert JPG, PNG, or WebP files to PDF locally in the browser without sending images to a server.",
      tool: "image-to-pdf",
      content: [
        ["h2", "Local image conversion"],
        ["p", "Photos and screenshots can contain private information. A no-upload workflow draws the image into a PDF in the browser, then lets you review the downloaded file before sharing it."],
        ["h2", "When to use it"],
        ["ul", ["A photo of a receipt.", "A scan or form image.", "A screenshot that must be submitted as PDF.", "A simple one-page image PDF."]],
      ],
    },
    {
      slug: "multiple-images-to-pdf-no-upload",
      title: "Multiple images to PDF without uploading",
      description: "Combine several image files into one multi-page PDF locally in the browser.",
      tool: "multi-image-pdf",
      content: [
        ["h2", "One PDF for several images"],
        ["p", "Use the multi-image converter when each image should become its own page, such as receipts, homework pages, forms, screenshots, or phone scans."],
        ["h2", "Practical limits"],
        ["p", "Very large photos can make large PDFs. Resize photos first if the receiving website has strict upload limits."],
      ],
    },
    {
      slug: "text-to-pdf-no-signup",
      title: "Text to PDF converter without signup",
      description: "Paste plain text and download a clean one-page PDF without creating an account.",
      tool: "text-to-pdf",
      content: [
        ["h2", "Plain text to PDF"],
        ["p", "Paste notes, instructions, simple letters, or meeting summaries and export a readable one-page PDF without installing an editor."],
        ["h2", "Best for short documents"],
        ["p", "The free version is intentionally focused on one-page drafts. Shorten or split very long text before export."],
      ],
    },
    {
      slug: "free-resume-builder-no-signup",
      title: "Free resume builder without signup",
      description: "Build and download a clean resume PDF without an account or hidden export fee.",
      tool: "resume-builder",
      content: [
        ["h2", "Avoid the export surprise"],
        ["p", "Many resume builders let users type first and pay later. This resume builder is designed around a free one-page PDF export so job seekers can get a usable file quickly."],
        ["h2", "Keep it readable"],
        ["p", "Use clear section headings, normal text, and a single-column structure. Proofread before sending it with a real application."],
      ],
    },
    {
      slug: "free-receipt-generator-no-signup",
      title: "Free receipt generator without signup",
      description: "Create a simple receipt PDF for payments, deposits, sales, reimbursements, or basic records.",
      tool: "receipt-generator",
      content: [
        ["h2", "Receipt vs invoice"],
        ["p", "Use an invoice before payment is due. Use a receipt after payment happens and both sides need a record."],
        ["h2", "What to include"],
        ["ul", ["Payer and recipient.", "Amount and date.", "Payment method.", "Description and notes."]],
      ],
    },
    {
      slug: "weekly-timesheet-pdf-no-signup",
      title: "Weekly timesheet PDF without signup",
      description: "Create a printable weekly timesheet PDF for freelance hours, staff records, project tracking, or approvals.",
      tool: "timesheet-generator",
      content: [
        ["h2", "Repeatable weekly record"],
        ["p", "Timesheets are naturally recurring. A fast no-signup generator can be enough for simple freelance, contractor, and small team hour records."],
        ["h2", "Review before submitting"],
        ["p", "Check dates, projects, hours, notes, and the total-hours line before printing or sending the PDF."],
      ],
    },
    {
      slug: "free-certificate-maker-no-signup",
      title: "Free certificate maker without signup",
      description: "Create a printable certificate PDF for classroom awards, completion, participation, clubs, and small events.",
      tool: "certificate-generator",
      content: [
        ["h2", "Quick certificate PDF"],
        ["p", "Use the certificate maker for classroom awards, participation, completion, clubs, teams, and workshops when a clean printable certificate is enough."],
        ["h2", "Print check"],
        ["p", "Preview the name, date, reason, and signer spelling before printing. Certificate typos are easy to notice."],
      ],
    },
    {
      slug: "free-printable-name-tracing-worksheet-maker",
      title: "Free printable name tracing worksheet maker",
      description: "How to create a readable name tracing page for preschool and kindergarten handwriting practice.",
      tool: "name-tracing",
      content: [
        ["h2", "What this printable is for"],
        ["p", "A name tracing page works best as a short, familiar writing warmup. Children already recognize their own name, so the page can focus on letter direction, pencil control, spacing, and confidence instead of decoding a new word."],
        ["p", "For home practice, keep the page simple: one large model line, two trace lines, two blank writing lines, and a small coloring prompt. For classroom practice, print one page per child and keep the instruction line consistent."],
        ["h2", "How to make the worksheet clearer"],
        ["ul", ["Use one name or one short word per page.", "Choose US Letter for North America and A4 for most other countries.", "Avoid decorative fonts on the tracing line; clean letter shapes are easier to copy.", "Use black-and-white friendly accents so the worksheet still works on a basic printer."]],
        ["h2", "When to upgrade the format"],
        ["p", "If children are ready for more independence, switch from trace-only pages to mixed pages that include blank lines. If they are still building pencil control, use outline letters and larger spacing."],
      ],
    },
    {
      slug: "free-chore-chart-generator-for-kids",
      title: "Free chore chart generator for kids",
      description: "Make a printable weekly chore chart that children can understand without a complicated app.",
      tool: "chore-chart",
      content: [
        ["h2", "Why printable chore charts still work"],
        ["p", "A printed chore chart turns family expectations into something visible. It works especially well for younger children because they can check boxes, see progress, and connect routines with predictable days of the week."],
        ["h2", "Choose chores that can be checked quickly"],
        ["ul", ["Use short action phrases such as make bed, feed pet, pack backpack, or clear dishes.", "Keep the first version to five or fewer chores.", "Use the same chart for one full week before changing the routine.", "Place the chart where the task happens, not hidden in a binder."]],
        ["h2", "For classrooms and groups"],
        ["p", "For classroom jobs, use one chart per week with student names across the side and days across the top. Keep job names consistent so the chart becomes part of the room routine."],
      ],
    },
    {
      slug: "free-reward-chart-generator",
      title: "Free reward chart generator",
      description: "Create a printable sticker chart for goals, habits, classroom behavior, or family routines.",
      tool: "reward-chart",
      content: [
        ["h2", "Use rewards for one behavior at a time"],
        ["p", "A reward chart is strongest when it tracks one clear behavior. Instead of trying to fix an entire routine, name the exact action: finish bedtime steps, use kind words, practice reading, or stay with morning tasks."],
        ["h2", "Pick the right number of boxes"],
        ["ul", ["Use 12 boxes for a short challenge.", "Use 20 boxes for a normal multi-week goal.", "Use 24 boxes when the reward is larger or the behavior happens several times per week.", "Keep the reward visible so the chart feels connected to the goal."]],
        ["h2", "Avoid common mistakes"],
        ["p", "Do not remove earned stickers as punishment. The chart should show progress, not become another source of conflict. If the goal is too hard, lower the difficulty and restart with a smaller target."],
      ],
    },
    {
      slug: "free-sticker-chart-printable-maker",
      title: "Free sticker chart printable maker",
      description: "Create a simple printable sticker chart for reading, bedtime, chores, classroom behavior, or kindness goals.",
      tool: "reward-chart",
      content: [
        ["h2", "Start with one clear goal"],
        ["p", "A sticker chart works best when the child can understand exactly what earns a sticker. Choose one behavior such as read for ten minutes, stay with bedtime steps, use kind words, or finish a morning routine."],
        ["h2", "Pick a short target"],
        ["ul", ["Use 12 boxes for a quick win.", "Use 20 boxes for a normal goal.", "Write the reward before printing.", "Keep the chart where the routine happens."]],
        ["h2", "Print in black and white"],
        ["p", "The free reward chart generator is designed to print clearly on ordinary home printers. Use stickers, stamps, or simple check marks after printing."],
      ],
    },
    {
      slug: "bedtime-routine-chart-printable",
      title: "Bedtime routine chart printable",
      description: "Make a bedtime routine chart that turns repeated reminders into a simple printable checklist.",
      tool: "chore-chart",
      content: [
        ["h2", "Keep bedtime steps predictable"],
        ["p", "A bedtime routine chart should be short enough to finish without negotiation. Good steps include pajamas, bathroom, brush teeth, choose clothes, pack bag, story, and lights out."],
        ["h2", "Use checklist language"],
        ["p", "Children follow short action phrases more easily than long explanations. Print the same chart for a full week before changing the order."],
        ["h2", "Where to put it"],
        ["p", "Place the chart near the bathroom, bedroom door, or nightstand. A plain chart in the right place is more useful than a decorative chart that is hidden away."],
      ],
    },
    {
      slug: "classroom-job-chart-printable",
      title: "Classroom job chart printable",
      description: "Use a printable job chart for weekly classroom helpers, centers, small groups, and clean-up routines.",
      tool: "chore-chart",
      content: [
        ["h2", "Make jobs easy to scan"],
        ["p", "Classroom job charts work when job names stay short and consistent. Use helper, line leader, lights, library, materials, plants, calendar, clean-up, and messenger."],
        ["h2", "Rotate weekly"],
        ["p", "A weekly chart gives students enough time to learn the role without requiring the teacher to rewrite assignments every day."],
        ["h2", "Use the free chart maker"],
        ["p", "Enter student names and job names in the chore chart generator, then print one page for the week."],
      ],
    },
    {
      slug: "free-printable-weekly-calendar-for-kids",
      title: "Free printable weekly calendar for kids",
      description: "Create a simple weekly calendar printable for school events, chores, reading, meals, and family reminders.",
      tool: "weekly-planner",
      content: [
        ["h2", "One week is enough"],
        ["p", "A weekly calendar helps children see what is coming without overwhelming them with a full monthly planner. Use it for school days, practices, appointments, chores, and reading goals."],
        ["h2", "Add a focus line"],
        ["p", "A short focus line such as this week we practice mornings or remember library books turns the calendar into a useful reminder instead of another piece of paper."],
        ["h2", "Print and reuse"],
        ["p", "The weekly planner generator creates a one-page PDF that can be printed each week or placed in a clear sleeve and marked with a dry-erase pen."],
      ],
    },
    {
      slug: "printable-routine-chart-for-mornings",
      title: "Printable morning routine chart ideas",
      description: "Simple morning chart layouts that help kids move from wake-up to school without constant reminders.",
      content: [
        ["h2", "Make mornings visual"],
        ["p", "A morning chart works when each step is short, visible, and in the order it happens. Good first steps include get dressed, brush teeth, eat breakfast, pack bag, and shoes on."],
        ["h2", "Keep the chart near the route"],
        ["p", "Put the chart where the child naturally passes it. A beautiful chart on a desk is less useful than a plain chart near the bedroom door or backpack area."],
      ],
    },
    {
      slug: "weekly-family-planner-printable",
      title: "How to build a weekly family planner printable",
      description: "Plan meals, school events, chores, and appointments on one printable weekly page.",
      content: [
        ["h2", "One page is the point"],
        ["p", "A family planner should reduce coordination, not become a second calendar system. Use it for the few decisions everyone needs to see: meals, rides, appointments, and shared chores."],
        ["h2", "What to include"],
        ["ul", ["A weekly grid.", "A small notes area.", "A grocery reminder box.", "A section for school or daycare items."]],
      ],
    },
    {
      slug: "classroom-label-generator-ideas",
      title: "Classroom label generator ideas",
      description: "Use printable labels for bins, centers, cubbies, small groups, and take-home folders.",
      content: [
        ["h2", "Labels should be boring in the best way"],
        ["p", "The best classroom labels are easy to scan. Use a consistent size, strong contrast, and short nouns. Add icons only when they make the label faster to understand."],
        ["h2", "High-value label sets"],
        ["p", "Start with book bins, art supplies, math manipulatives, literacy centers, and take-home folders. These areas create the most daily friction when they are not labeled."],
      ],
    },
    {
      slug: "habit-tracker-printable-for-beginners",
      title: "Habit tracker printable for beginners",
      description: "Create a printable habit tracker that tracks progress without turning into a guilt chart.",
      content: [
        ["h2", "Track fewer things"],
        ["p", "A beginner habit tracker should track one to three behaviors. Too many boxes make the page look impressive but harder to keep using."],
        ["h2", "Use neutral language"],
        ["p", "Labels such as done, tried, or practiced are often better than perfect. The goal is a visible feedback loop, not a record of failure."],
      ],
    },
    {
      slug: "flashcard-generator-printable-guide",
      title: "Printable flashcard generator guide",
      description: "Make flashcards that are easy to cut, review, and reuse for vocabulary or classroom games.",
      content: [
        ["h2", "Design for cutting"],
        ["p", "Printable flashcards should have clear cut lines, enough margin, and a predictable card size. Leave extra white space if children will draw or color on the cards."],
        ["h2", "Use fewer cards per set"],
        ["p", "Six to twelve cards per set is easier to use than a giant deck. Group cards by a single theme such as weather, colors, family words, or classroom supplies."],
      ],
    },
    {
      slug: "printable-worksheets-for-preschool-at-home",
      title: "Printable worksheets for preschool at home",
      description: "A practical way to use short printable pages without overloading young children.",
      content: [
        ["h2", "Short pages beat big packets"],
        ["p", "Preschool worksheets work best when they are quick, concrete, and connected to a real routine. A five-minute page can support a habit; a long packet can become a negotiation."],
        ["h2", "Mix skills gently"],
        ["p", "Use one handwriting task, one drawing prompt, and one simple choice. The page should feel doable before it feels impressive."],
      ],
    },
    {
      slug: "black-and-white-printable-design-tips",
      title: "Black-and-white printable design tips",
      description: "Design worksheets and charts that still look clear on a basic home printer.",
      content: [
        ["h2", "Contrast matters more than color"],
        ["p", "Most printable pages are used on ordinary printers. Strong borders, readable headings, and clean spacing matter more than color fills."],
        ["h2", "Save ink intentionally"],
        ["ul", ["Use outlines instead of full dark backgrounds.", "Avoid large saturated blocks.", "Keep decorative shapes small.", "Test the page at actual size before sharing it."]],
      ],
    },
    {
      slug: "a4-vs-us-letter-printable-guide",
      title: "A4 vs US Letter for printable PDFs",
      description: "Choose the right paper size for families, schools, and international downloads.",
      content: [
        ["h2", "Offer both when possible"],
        ["p", "US Letter is common in the United States and Canada, while A4 is common in many other countries. If you publish a printable online, offering both sizes reduces printing frustration."],
        ["h2", "Keep safe margins"],
        ["p", "Use generous margins so home printers do not cut off borders or footer notes. Avoid important text at the very edge of the page."],
      ],
    },
    {
      slug: "batch-printable-generator-for-classrooms",
      title: "When batch printable generation is worth it",
      description: "Understand when a free one-page printable is enough and when cloud batch generation saves real prep time.",
      content: [
        ["h2", "Free is enough for quick one-off pages"],
        ["p", "A single free printable works well when a parent or teacher needs one chart, one worksheet, or one planner page today."],
        ["h2", "Batch needs are a useful future signal"],
        ["p", "Teachers, tutors, and homeschool families sometimes need many personalized pages at once. For now, use the free one-page tools and watch which workflows get repeated downloads before building anything larger."],
      ],
    },
    {
      slug: "free-invoice-generator-no-signup",
      title: "Free invoice generator without signup",
      description: "Create a clean invoice PDF without an account, template marketplace, or surprise download fee.",
      tool: "invoice-generator",
      content: [
        ["h2", "Why a free invoice tool wins clicks"],
        ["p", "Many freelancers only need one invoice today. A tool that opens quickly, avoids account creation, and downloads a clean PDF can satisfy a high-intent search faster than a full accounting app."],
        ["h2", "What to include"],
        ["ul", ["Business name and contact line.", "Client name.", "Invoice number and date.", "Line items with quantity and rate.", "Payment terms and a short footer note."]],
        ["h2", "Keep records outside the tool"],
        ["p", "This generator does not store invoices. Download the PDF and keep your own copy with your bookkeeping or client folder."],
      ],
    },
    {
      slug: "invoice-follow-up-email-template",
      title: "Free invoice follow-up email template",
      description: "Write a polite invoice reminder or overdue follow-up without uploading private invoice data.",
      tool: "invoice-followup-email",
      content: [
        ["h2", "Keep the reminder relationship-safe"],
        ["p", "A good first invoice follow-up is short, calm, and specific. It should mention the invoice status, give the payment path, and ask for an update without making legal or collections claims."],
        ["h2", "Avoid private details"],
        ["p", "Use generic client labels in the tool. Do not paste invoice numbers, bank details, tax IDs, private client data, or legal dispute details."],
      ],
    },
    {
      slug: "freelance-invoice-pdf-template",
      title: "Freelance invoice PDF template",
      description: "Make a one-page freelance invoice PDF for design, writing, consulting, development, and project work.",
      tool: "invoice-generator",
      content: [
        ["h2", "Use service descriptions that are clear"],
        ["p", "A freelance invoice should make it easy for the client to approve payment. Keep each line item short: project phase, quantity, rate, and the resulting amount."],
        ["h2", "Avoid payment confusion"],
        ["p", "Add payment terms such as due on receipt, net 7, or net 15. If you include payment instructions, keep them accurate and avoid unnecessary personal details."],
      ],
    },
    {
      slug: "free-estimate-generator-pdf",
      title: "Free estimate generator PDF",
      description: "Create a free estimate PDF for services, repairs, project work, consulting, or home jobs.",
      tool: "estimate-generator",
      content: [
        ["h2", "Why estimates are high-intent"],
        ["p", "A user searching for an estimate generator is often preparing to win a job today. A fast PDF with line items and clear validity terms can solve that moment without forcing accounting software."],
        ["h2", "What to include"],
        ["ul", ["Business and client names.", "Estimate number and date.", "Line items with quantity and rate.", "How long the estimate is valid.", "A note that the estimate may change if scope changes."]],
      ],
    },
    {
      slug: "service-quote-pdf-template",
      title: "Service quote PDF template",
      description: "Make a printable service quote PDF for contractors, freelancers, consultants, or small local businesses.",
      tool: "estimate-generator",
      content: [
        ["h2", "Quote wording should reduce confusion"],
        ["p", "A service quote should make the work, assumptions, timeline, and price easy to scan. Keep each line item short and avoid promising work that is not included."],
        ["h2", "Use it before the invoice"],
        ["p", "Send an estimate or quote first, then create an invoice after the work is approved or completed."],
      ],
    },
    {
      slug: "free-purchase-order-generator",
      title: "Free purchase order generator",
      description: "Create a purchase order PDF for vendor orders, supply requests, services, or internal approvals.",
      tool: "purchase-order",
      content: [
        ["h2", "When a PO helps"],
        ["p", "A purchase order gives the buyer and vendor a shared reference before an invoice arrives. It is useful for supplies, project materials, services, and approvals."],
        ["h2", "Keep the PO simple"],
        ["ul", ["Buyer and vendor details.", "PO number and date.", "Items, quantities, and unit prices.", "Delivery request or terms.", "A footer note for invoice reference."]],
      ],
    },
    {
      slug: "purchase-order-pdf-template",
      title: "Purchase order PDF template",
      description: "Use a clean purchase order PDF template when a small team needs approval before buying goods or services.",
      tool: "purchase-order",
      content: [
        ["h2", "Approval records matter"],
        ["p", "Even small teams benefit from a simple PO because it records what was approved, who the vendor is, and what cost was expected."],
        ["h2", "Before sending"],
        ["p", "Check item quantities, prices, delivery notes, and the vendor name before downloading the PDF."],
      ],
    },
    {
      slug: "free-bill-of-sale-generator",
      title: "Free bill of sale generator",
      description: "Create a simple bill of sale PDF for a private item sale, equipment transfer, or sale record.",
      tool: "bill-of-sale",
      content: [
        ["h2", "A bill of sale is a record"],
        ["p", "A bill of sale records who sold an item, who bought it, what was sold, the price, and the date. It is useful for private sales and simple transfers."],
        ["h2", "Check local rules"],
        ["p", "Requirements vary by location and item type, especially for vehicles. This generator creates a practical draft, not legal advice."],
      ],
    },
    {
      slug: "private-sale-receipt-pdf",
      title: "Private sale receipt PDF",
      description: "Make a printable receipt for a private sale of equipment, furniture, electronics, or household items.",
      tool: "bill-of-sale",
      content: [
        ["h2", "Record the item clearly"],
        ["p", "Use a short description that identifies the item well enough for both parties. Add model, serial number, or condition notes when appropriate."],
        ["h2", "Print before handoff"],
        ["p", "For in-person sales, print a copy for the buyer and seller, then sign after payment and item handoff."],
      ],
    },
    {
      slug: "free-rent-receipt-generator",
      title: "Free rent receipt generator",
      description: "Generate a printable rent receipt PDF for tenant records, landlord files, or cash payment documentation.",
      tool: "rent-receipt",
      content: [
        ["h2", "When a rent receipt is useful"],
        ["p", "A rent receipt gives both sides a simple record of who paid, how much was paid, when it was received, and what rental period the payment covers."],
        ["h2", "Information to check before printing"],
        ["ul", ["Tenant name.", "Landlord or property manager name.", "Property or unit.", "Payment amount.", "Payment date and method.", "Rental period."]],
        ["h2", "Legal note"],
        ["p", "Rules for receipts vary by location. This tool creates a practical record, not legal advice."],
      ],
    },
    {
      slug: "rent-receipt-for-cash-payment",
      title: "Rent receipt for cash payment",
      description: "Create a simple receipt PDF when rent is paid by cash, bank transfer, check, or another payment method.",
      tool: "rent-receipt",
      content: [
        ["h2", "Cash payments need a clear record"],
        ["p", "Cash rent payments can be easy to dispute later if no record is created. A dated receipt with the amount, rental period, and recipient gives both parties a reference."],
        ["h2", "Print two copies when needed"],
        ["p", "For in-person payments, print one copy for the tenant and one for the landlord or property manager."],
      ],
    },
    {
      slug: "free-business-card-generator-printable",
      title: "Free printable business card generator",
      description: "Create printable business cards for a service, side business, class, event, or pop-up table.",
      tool: "business-card",
      content: [
        ["h2", "Why a simple card sheet helps"],
        ["p", "A simple business card sheet is useful when someone needs contact cards today and does not want to create a design account or order a print run."],
        ["h2", "What to include"],
        ["ul", ["Name.", "Role or service.", "Business name.", "Email, phone, or website.", "One short tagline."]],
      ],
    },
    {
      slug: "business-card-pdf-for-local-services",
      title: "Business card PDF for local services",
      description: "Make a practical contact card for notaries, tutors, cleaners, repair services, coaches, and small local businesses.",
      tool: "business-card",
      content: [
        ["h2", "Prioritize readability"],
        ["p", "Local service cards should make the name, service, phone, email, and booking note easy to read. Decorative design matters less than legibility."],
        ["h2", "Test before printing many"],
        ["p", "Print one sheet first, trim one card, and make sure every line is readable at card size."],
      ],
    },
    {
      slug: "free-address-label-generator-printable",
      title: "Free printable address label generator",
      description: "Create return address labels, mailing labels, classroom labels, bin labels, or badge labels as a PDF sheet.",
      tool: "address-labels",
      content: [
        ["h2", "Labels are batch work"],
        ["p", "Label sheets are easiest to use when the first test print is done on plain paper. Check alignment before printing on adhesive stock."],
        ["h2", "Good uses"],
        ["ul", ["Return address labels.", "Mailing labels.", "Classroom bin labels.", "Event badge labels.", "Folder or supply labels."]],
      ],
    },
    {
      slug: "mailing-label-pdf-template",
      title: "Mailing label PDF template",
      description: "Use a printable mailing label sheet for small batches of envelopes, packages, folders, and event materials.",
      tool: "address-labels",
      content: [
        ["h2", "Small batches do not need heavy software"],
        ["p", "A small batch of labels often does not need full shipping software. A clean PDF sheet is enough for mail, folders, badges, and classroom bins."],
        ["h2", "Check the print path"],
        ["p", "Use plain paper first, then compare it against label stock before printing on adhesive sheets."],
      ],
    },
    {
      slug: "free-barcode-label-generator-printable",
      title: "Free printable barcode label generator",
      description: "Generate Code 39 barcode labels for SKU stickers, inventory bins, event check-in, and internal tracking.",
      tool: "barcode-labels",
      content: [
        ["h2", "Static barcodes for internal use"],
        ["p", "Static barcode labels are useful for internal workflows when a full inventory system is unnecessary. Always test scanning before printing a full sheet."],
        ["h2", "Keep codes short"],
        ["p", "Shorter codes print wider bars and scan more reliably on ordinary office or home printers."],
      ],
    },
    {
      slug: "sku-label-pdf-template",
      title: "SKU label PDF template",
      description: "Create a simple SKU label PDF for handmade products, market tables, storage bins, or internal inventory.",
      tool: "barcode-labels",
      content: [
        ["h2", "Use a consistent code system"],
        ["p", "SKU labels work best when the code is short, consistent, and printed with enough white space around the bars."],
        ["h2", "Not for regulated retail distribution"],
        ["p", "Use proper barcode registration and compliance tools for official retail products."],
      ],
    },
    {
      slug: "free-price-tag-generator-printable",
      title: "Free printable price tag generator",
      description: "Make price tags and shelf labels for yard sales, craft fairs, pop-up shops, and small retail tables.",
      tool: "price-tag",
      content: [
        ["h2", "Commercial intent is built in"],
        ["p", "A price tag page has commercial intent because the user is often preparing to sell products. Large prices and short item labels are easier for shoppers to scan."],
        ["h2", "Print tip"],
        ["p", "Use heavier paper if tags will be handled, and keep the price larger than every other line."],
      ],
    },
    {
      slug: "yard-sale-price-tags-pdf",
      title: "Yard sale price tags PDF",
      description: "Create quick printable price tags for garage sales, estate sales, moving sales, and community markets.",
      tool: "price-tag",
      content: [
        ["h2", "Make prices obvious"],
        ["p", "Yard sale tags should be readable from a few feet away and simple enough to cut quickly before the sale starts."],
        ["h2", "Use simple groups"],
        ["p", "If many items share a price, print a few large category tags instead of labeling every small item."],
      ],
    },
    {
      slug: "free-flyer-maker-pdf-no-signup",
      title: "Free flyer maker PDF without signup",
      description: "Make a one-page flyer PDF for a local service, yard sale, class, club, or community event.",
      tool: "flyer-maker",
      content: [
        ["h2", "Flyer searches are urgent"],
        ["p", "Flyer searches are often urgent. A clear headline, date or offer, short details, and contact line matter more than heavy decoration."],
        ["h2", "Keep one call to action"],
        ["p", "Ask the reader to call, visit, save the date, or book. One next step is easier to act on than several choices."],
      ],
    },
    {
      slug: "local-service-flyer-pdf-template",
      title: "Local service flyer PDF template",
      description: "Create a simple printable flyer for cleaning, tutoring, repair, notary, coaching, or neighborhood services.",
      tool: "flyer-maker",
      content: [
        ["h2", "State the service clearly"],
        ["p", "A local service flyer should state what you do, who it helps, how to contact you, and one clear next step."],
        ["h2", "Review posting rules"],
        ["p", "Only post flyers where they are allowed and make sure the offer and contact details are accurate."],
      ],
    },
    {
      slug: "free-coupon-maker-printable",
      title: "Free printable coupon maker",
      description: "Create printable coupon cards for local services, pop-up shops, classes, events, and small offers.",
      tool: "coupon-maker",
      content: [
        ["h2", "Clear terms build trust"],
        ["p", "Coupon pages should make the offer and terms clear. Avoid misleading discounts or unclear expiration notes."],
        ["h2", "Useful fields"],
        ["ul", ["Business or event name.", "Offer.", "Coupon code.", "Expiration note.", "Simple fine print."]],
      ],
    },
    {
      slug: "discount-coupon-pdf-template",
      title: "Discount coupon PDF template",
      description: "Make a coupon PDF sheet with offer text, coupon code, expiration note, and fine print.",
      tool: "coupon-maker",
      content: [
        ["h2", "Coupons connect to real selling"],
        ["p", "Coupons connect directly to local promotion and selling activity, so they are a stronger commercial validation category than generic decorative templates."],
        ["h2", "Use only authorized offers"],
        ["p", "Do not create coupons for brands, products, or events you do not control."],
      ],
    },
    {
      slug: "free-packing-slip-generator-printable",
      title: "Free printable packing slip generator",
      description: "Create a packing slip PDF for small orders, handmade products, marketplace shipments, and local delivery.",
      tool: "packing-slip",
      content: [
        ["h2", "Packing slips are commercial paperwork"],
        ["p", "Packing slip pages have commercial intent because the user is often preparing a real customer order. A useful slip helps the seller confirm what goes into the package before sealing it."],
        ["h2", "What to include"],
        ["ul", ["Business or sender details.", "Ship-to recipient details.", "Order number and ship date.", "Item names, quantities, and status.", "A short packing note or return reminder."]],
        ["h2", "Keep payment details separate"],
        ["p", "A packing slip should help with fulfillment. Keep payment details off the slip unless the package workflow truly needs them."],
      ],
    },
    {
      slug: "order-packing-slip-pdf-template",
      title: "Order packing slip PDF template",
      description: "Use a simple packing slip PDF as a package insert for small shops, pop-up pickups, and marketplace sales.",
      tool: "packing-slip",
      content: [
        ["h2", "Check the package before sealing"],
        ["p", "A packing slip should make it easy to confirm items, quantities, status, order number, and recipient before sealing the package."],
        ["h2", "Best small-seller uses"],
        ["ul", ["Handmade goods.", "Marketplace orders.", "Local delivery.", "Pop-up pickup bags.", "Small warehouse order checks."]],
      ],
    },
    {
      slug: "free-work-order-generator-pdf",
      title: "Free work order generator PDF",
      description: "Create a work order PDF for repairs, maintenance visits, cleaning jobs, field service, and contractor tasks.",
      tool: "work-order",
      content: [
        ["h2", "Work orders support urgent service tasks"],
        ["p", "Work order searches often happen right before a service visit. A useful form records scope, schedule, tasks, instructions, approval notes, and signatures."],
        ["h2", "What to check"],
        ["ul", ["Provider details.", "Client or site details.", "Work order number and date.", "Task rows and estimated total.", "Instructions, notes, and approval lines."]],
        ["h2", "Use it as a practical record"],
        ["p", "This generator creates a printable job form, not a compliance system. Confirm safety, licensing, and approval requirements for the work being performed."],
      ],
    },
    {
      slug: "service-work-order-pdf-template",
      title: "Service work order PDF template",
      description: "Make a printable work order for contractors, local services, maintenance teams, and repair visits.",
      tool: "work-order",
      content: [
        ["h2", "Separate approved work from extra work"],
        ["p", "A work order is strongest when it separates approved work from extra work that needs client approval."],
        ["h2", "Good fit"],
        ["p", "Use it for cleaning jobs, repair visits, maintenance tasks, contractor walkthroughs, and field service records where a simple printed page is enough."],
      ],
    },
    {
      slug: "free-inventory-sheet-generator",
      title: "Free inventory sheet generator",
      description: "Create a printable inventory count sheet for stock checks, market tables, storage bins, and classroom supplies.",
      tool: "inventory-sheet",
      content: [
        ["h2", "Inventory counts repeat"],
        ["p", "Inventory counts repeat often, so a fast printable sheet can earn return visits when it is easier than opening a spreadsheet."],
        ["h2", "Useful columns"],
        ["ul", ["SKU or item code.", "Item name.", "Expected quantity.", "Counted quantity.", "Restock note or item condition."]],
        ["h2", "When a printable sheet is enough"],
        ["p", "Use a printable sheet for small stock checks, market table setup, supply closets, classrooms, and before-and-after event counts."],
      ],
    },
    {
      slug: "stock-count-sheet-pdf-template",
      title: "Stock count sheet PDF template",
      description: "Use a printable stock count sheet for SKU checks, shelf reviews, craft fairs, event supplies, and restock notes.",
      tool: "inventory-sheet",
      content: [
        ["h2", "Leave room to write"],
        ["p", "A stock count sheet should include enough columns to compare expected and counted quantities without making the rows hard to write on."],
        ["h2", "Best uses"],
        ["ul", ["Craft fair inventory.", "Small retail shelves.", "Classroom supplies.", "Storage bins.", "Event materials and restock lists."]],
      ],
    },
    {
      slug: "free-resume-builder-pdf",
      title: "Free resume builder PDF",
      description: "Build a clean resume PDF without an account, paywall, or complicated design tool.",
      tool: "resume-builder",
      content: [
        ["h2", "Why simple resumes work"],
        ["p", "Many job seekers do not need a heavy design template. They need a readable document with a clear name, contact line, summary, experience, skills, and education."],
        ["h2", "Avoid surprise download fees"],
        ["p", "The resume builder creates a one-page PDF directly in the browser. Review the text carefully before using it for a real application."],
      ],
    },
    {
      slug: "ats-friendly-resume-pdf-guide",
      title: "ATS friendly resume PDF guide",
      description: "Format a simple resume PDF so it stays readable for recruiters and applicant tracking systems.",
      tool: "resume-builder",
      content: [
        ["h2", "Keep layout predictable"],
        ["p", "Use clear section headings, normal text, and a single-column structure. Avoid putting important experience inside images, icons, or complex tables."],
        ["h2", "Write achievement bullets"],
        ["ul", ["Start with an action verb.", "Mention the project, customer, or process.", "Add a number when it is true.", "Keep each bullet short enough to scan."]],
      ],
    },
    {
      slug: "ats-resume-keyword-match",
      title: "ATS resume keyword match guide",
      description: "Compare a resume against a job description without stuffing fake keywords or uploading private details.",
      tool: "ats-resume-checker",
      content: [
        ["h2", "Match honest language from the role"],
        ["p", "Use the job description to find skills, tools, job titles, certifications, and repeated responsibilities that genuinely match your background."],
        ["h2", "Avoid keyword stuffing"],
        ["p", "A checker should help you notice missing honest matches, not add claims you cannot support. Keep the wording truthful and readable for a recruiter."],
        ["h2", "Keep the format easy to parse"],
        ["ul", ["Use clear section headings.", "Keep key experience in normal text.", "Use a skills section for tools and methods.", "Add numbers only when they are true."]],
      ],
    },
    {
      slug: "free-cover-letter-generator-pdf",
      title: "Free cover letter generator PDF",
      description: "Create a one-page cover letter PDF for job applications without an account or download paywall.",
      tool: "cover-letter",
      content: [
        ["h2", "Why cover letter tools get search intent"],
        ["p", "A job seeker often needs a cover letter right before submitting an application. A fast generator that exports a PDF without signup solves that moment better than a template marketplace with a hidden download fee."],
        ["h2", "What to include"],
        ["ul", ["The target role and company.", "One opening sentence that names the application.", "A short strengths paragraph with relevant skills.", "A closing paragraph that invites a conversation.", "A clean signoff and contact line."]],
        ["h2", "Keep it honest"],
        ["p", "Use the AI idea helper for structure and wording, then edit every sentence so it matches your real experience. Do not invent credentials or employers."],
      ],
    },
    {
      slug: "cover-letter-no-signup",
      title: "Cover letter generator without signup",
      description: "Use a free cover letter PDF maker when you need a quick application document without creating an account.",
      tool: "cover-letter",
      content: [
        ["h2", "Avoid the common download trap"],
        ["p", "Many writing tools let users type a letter for free and then ask for payment at export. This generator keeps the first one-page PDF free so the value is visible immediately."],
        ["h2", "Best first draft structure"],
        ["p", "Use four short blocks: greeting, opening, strengths, and closing. A simple structure is easier to edit than a long generic letter."],
      ],
    },
    {
      slug: "free-resignation-letter-generator",
      title: "Free resignation letter generator",
      description: "Create a professional resignation letter PDF with last working day, appreciation, and transition wording.",
      tool: "resignation-letter",
      content: [
        ["h2", "Resignation letters should be clear"],
        ["p", "A resignation letter does not need to be long. It should state the role, company, date, last working day, appreciation, and a simple handoff offer."],
        ["h2", "Before downloading"],
        ["ul", ["Confirm the notice period required by your contract or local policy.", "Check the exact last working day.", "Keep the tone professional even if the job was difficult.", "Save a copy for your own records."]],
        ["h2", "Not legal advice"],
        ["p", "This tool creates a practical letter draft. Employment requirements vary by location and agreement."],
      ],
    },
    {
      slug: "two-weeks-notice-letter-pdf",
      title: "Two weeks notice letter PDF",
      description: "Make a simple two weeks notice PDF that states your resignation date and final working day.",
      tool: "resignation-letter",
      content: [
        ["h2", "Use plain wording"],
        ["p", "A two weeks notice letter works best when the message is direct: you are resigning, your final day is listed, and you will help with transition tasks where possible."],
        ["h2", "Tone options"],
        ["p", "Choose brief for a minimal letter, professional for a standard workplace note, or warm when you want a more appreciative tone."],
      ],
    },
    {
      slug: "free-monthly-calendar-generator",
      title: "Free monthly calendar generator",
      description: "Create a printable monthly calendar PDF for appointments, bills, family plans, classes, or routines.",
      tool: "monthly-calendar",
      content: [
        ["h2", "Monthly calendars are broad search tools"],
        ["p", "A monthly calendar is useful for families, students, small teams, and anyone planning appointments or recurring tasks. It is a wider audience test than kids-only printables."],
        ["h2", "Make the page practical"],
        ["ul", ["Choose Sunday or Monday start.", "Keep notes short.", "Print one month at a time.", "Use the notes area for bills, school events, errands, or meals."]],
      ],
    },
    {
      slug: "printable-calendar-pdf-maker",
      title: "Printable calendar PDF maker",
      description: "Generate a simple black-and-white monthly calendar PDF that works on home printers.",
      tool: "monthly-calendar",
      content: [
        ["h2", "Print clarity matters"],
        ["p", "A printable calendar should leave enough writing space in each day cell. Heavy decoration can make the page harder to use after printing."],
        ["h2", "Use it with other tools"],
        ["p", "Pair the monthly calendar with the weekly planner, habit tracker, or meal planner when one page is not enough for the week."],
      ],
    },
    {
      slug: "free-meal-planner-generator",
      title: "Free meal planner generator",
      description: "Make a weekly meal planner PDF with meals, grocery list, and prep notes.",
      tool: "meal-planner",
      content: [
        ["h2", "Meal planning has repeat use"],
        ["p", "Families often repeat meal planning every week, which makes it a useful validation category for downloads and return visits."],
        ["h2", "What to plan"],
        ["ul", ["Breakfast, lunch, and dinner for each day.", "A grocery list grouped by what you actually need.", "One prep note for leftovers or batch cooking.", "One flexible meal for busy nights."]],
      ],
    },
    {
      slug: "weekly-meal-plan-grocery-list-pdf",
      title: "Weekly meal plan and grocery list PDF",
      description: "Create one printable page that combines a weekly meal plan with a grocery list and prep reminders.",
      tool: "meal-planner",
      content: [
        ["h2", "One page reduces friction"],
        ["p", "A meal plan is easier to use when the grocery list is on the same sheet. That keeps the planning decision connected to the shopping task."],
        ["h2", "Keep the first version flexible"],
        ["p", "Do not over-plan every snack and detail. Leave one dinner open for leftovers, schedule, or a quick pantry meal."],
      ],
    },
    {
      slug: "free-image-to-pdf-converter",
      title: "Free image to PDF converter",
      description: "Convert a JPG, PNG, or WebP image into a one-page PDF without uploading files.",
      tool: "image-to-pdf",
      content: [
        ["h2", "Why local conversion matters"],
        ["p", "Image-to-PDF searches are urgent: people often need to submit a document, receipt, form, or photo as a PDF. This converter keeps the file in the browser instead of uploading it to a server."],
        ["h2", "Best uses"],
        ["ul", ["Turn a photo of a form into a PDF.", "Convert a screenshot or image scan for a quick upload.", "Make a single-page PDF from a PNG, JPG, or WebP file.", "Use gallery mode when several images belong on one page."]],
        ["h2", "Before sharing"],
        ["p", "Open the PDF after downloading and confirm the image is readable, not cropped, and oriented the way the receiving site expects."],
      ],
    },
    {
      slug: "jpg-to-pdf-without-uploading",
      title: "JPG to PDF without uploading",
      description: "Make a PDF from a JPG file in the browser when you do not want to send the image to a conversion server.",
      tool: "image-to-pdf",
      content: [
        ["h2", "Use browser-side conversion for sensitive images"],
        ["p", "Photos of receipts, IDs, forms, and school documents can contain private information. A local converter is a safer first choice because the image is drawn into a PDF on your device."],
        ["h2", "Fit or fill"],
        ["p", "Use fit mode when the entire image must remain visible. Use fill mode only for image-heavy pages where edge cropping is acceptable."],
      ],
    },
    {
      slug: "multiple-images-to-pdf-without-uploading",
      title: "Multiple images to PDF without uploading",
      description: "Combine several JPG, PNG, or WebP images into one multi-page PDF in the browser.",
      tool: "multi-image-pdf",
      content: [
        ["h2", "One file for several images"],
        ["p", "Multi-image PDF conversion is useful for receipts, homework pages, forms, screenshots, and photo scans that need to be submitted together."],
        ["h2", "Why local conversion helps"],
        ["p", "The converter loads the images in the browser and creates a PDF locally, so you do not need to send private photos to a conversion server."],
      ],
    },
    {
      slug: "pdf-to-jpg-without-uploading",
      title: "PDF to JPG without uploading",
      description: "Convert PDF pages to JPG or PNG images locally in your browser.",
      tool: "pdf-to-images",
      content: [
        ["h2", "When PDF-to-image solves the problem"],
        ["p", "Some sites, forms, chats, and marketplaces ask for JPG or PNG files even when the original document is a PDF. A local PDF-to-image converter lets you create image files without uploading the source document."],
        ["h2", "Choose only the pages you need"],
        ["p", "Use all for a short PDF or type a page range such as 1,3-5. The free browser workflow exports up to eight pages so ordinary conversions stay fast."],
        ["h2", "Review before uploading elsewhere"],
        ["p", "Open the downloaded JPG or PNG files and confirm text, signatures, photos, and page edges are readable before sending them to another website."],
      ],
    },
    {
      slug: "extract-text-from-pdf-without-uploading",
      title: "Extract text from PDF without uploading",
      description: "Turn selectable PDF text into a downloadable TXT file locally in your browser.",
      tool: "pdf-to-text",
      content: [
        ["h2", "When PDF-to-text helps"],
        ["p", "PDF-to-text is useful when you need quotes, notes, invoice details, report sections, or admin copy in plain text without uploading the source document."],
        ["h2", "Scans need OCR"],
        ["p", "This browser tool extracts text that already exists inside the PDF. If the PDF is a photo or scan, you may need an OCR workflow before text can be copied."],
        ["h2", "Review the output"],
        ["p", "PDF text order can vary by layout. Review the downloaded TXT file before using it in a form, email, research note, or record."],
      ],
    },
    {
      slug: "pdf-to-word-without-uploading",
      title: "PDF to Word without uploading",
      description: "Convert selectable PDF text into a simple DOCX document locally in your browser.",
      tool: "pdf-to-word",
      content: [
        ["h2", "When PDF-to-Word helps"],
        ["p", "PDF-to-Word searches often come from users who need to edit a file now but do not want to upload private documents to a converter server."],
        ["h2", "Text-first DOCX output"],
        ["p", "The converter reads selectable text in the browser and writes a clean Word-compatible DOCX with optional page headings. It is designed for editing words, not recreating every visual detail."],
        ["h2", "Scans and complex layouts"],
        ["p", "Image-only scanned PDFs need OCR before this tool can create useful Word text. Complex tables, forms, and columns may be simplified, so keep the original PDF when exact layout matters."],
      ],
    },
    {
      slug: "signature-png-generator",
      title: "Signature PNG generator",
      description: "Draw or type a signature and download a transparent PNG locally without signup or upload.",
      tool: "signature-png",
      content: [
        ["h2", "When a signature PNG helps"],
        ["p", "A transparent signature image can be useful for proposals, internal approvals, PDF annotations, form screenshots, document drafts, and places where a visual signature image is acceptable."],
        ["h2", "Local visual export"],
        ["p", "The drawing pad and typed fallback render in the browser. The free export downloads a PNG without uploading the signature image to PrintableTools Lab."],
        ["h2", "Not an e-signature service"],
        ["p", "This tool creates a visual signature image only. It does not verify identity, collect consent, notarize documents, or replace a regulated e-signature workflow."],
      ],
    },
    {
      slug: "compress-image-without-uploading",
      title: "Compress image without uploading",
      description: "Reduce JPG, PNG, or WebP file size in the browser before uploading elsewhere.",
      tool: "compress-image",
      content: [
        ["h2", "Solve upload size errors"],
        ["p", "Image compression searches often happen after a form rejects a file as too large. A no-upload workflow lets the user make a smaller copy locally before trying again."],
        ["h2", "Good uses"],
        ["ul", ["Profile photos.", "Marketplace product images.", "Support screenshots.", "Email attachments.", "School or work portal uploads."]],
        ["h2", "Review the result"],
        ["p", "Open the compressed image and confirm text, faces, product details, or document photos are still clear enough for the destination."],
      ],
    },
    {
      slug: "compress-image-to-100kb-without-uploading",
      title: "Compress image to 100KB without uploading",
      description: "Reduce a JPG, PNG, or WebP image toward a 100KB upload limit locally in the browser.",
      tool: "compress-image-to-kb",
      content: [
        ["h2", "For strict upload limits"],
        ["p", "Many forms, portals, job applications, exam sites, and profile pages reject images above a fixed KB size. A target-size compressor helps create a smaller copy without uploading the source image."],
        ["h2", "Check quality before submitting"],
        ["p", "The smaller the target, the more quality can drop. Open the downloaded file and confirm faces, text, IDs, or product details are still readable."],
      ],
    },
    {
      slug: "resize-image-without-uploading",
      title: "Resize image without uploading",
      description: "Change image width, height, or preset size locally in the browser.",
      tool: "resize-image",
      content: [
        ["h2", "Meet exact image dimensions"],
        ["p", "Image resizing is useful for profile photos, thumbnails, marketplace listings, ID forms, and school portals that require exact dimensions."],
        ["h2", "Fit vs fill"],
        ["p", "Fit inside keeps the whole image visible. Fill and crop gives exact dimensions but can trim the edges."],
      ],
    },
    {
      slug: "convert-image-format-without-uploading",
      title: "Convert image format without uploading",
      description: "Convert JPG, PNG, and WebP files locally when a website requires a different image format.",
      tool: "convert-image",
      content: [
        ["h2", "Fix a format mismatch"],
        ["p", "A format converter solves a common upload problem: the image looks fine, but the receiving site accepts only JPG, PNG, or WebP."],
        ["h2", "Pick the right format"],
        ["ul", ["JPG for photos and smaller files.", "PNG for sharp graphics and transparency.", "WebP for smaller web-friendly images when accepted."]],
      ],
    },
    {
      slug: "remove-background-without-uploading",
      title: "Remove background without uploading",
      description: "Create a transparent PNG from a white, solid, or near-solid background image locally in your browser.",
      tool: "remove-background",
      content: [
        ["h2", "When a local background remover helps"],
        ["p", "A transparent PNG is useful for product listings, marketplace images, logos, signatures, icons, school projects, thumbnails, and documents where the original white or solid background looks messy."],
        ["h2", "What this browser tool does"],
        ["p", "It samples the background color and removes similar pixels locally. That keeps the image on your device and avoids a server upload for ordinary use."],
        ["h2", "Know the limit"],
        ["p", "This is a color-based remover, not full AI segmentation. Complex people, hair, shadows, glass, and busy backgrounds may need a dedicated editor or manual cleanup."],
      ],
    },
    {
      slug: "add-text-to-image-without-uploading",
      title: "Add text to image without uploading",
      description: "Put a headline, caption, label, or price on a photo locally in your browser.",
      tool: "add-text-image",
      content: [
        ["h2", "Fast text overlays for images"],
        ["p", "A simple text-on-image tool helps when a photo needs a title, price, note, class label, sale message, thumbnail headline, or meme-style caption before it is posted or shared."],
        ["h2", "Why local export matters"],
        ["p", "The selected image is processed in the browser. That is useful for ordinary product photos, class visuals, internal screenshots, and personal images that do not need to be uploaded to a design service."],
        ["h2", "Keep text readable"],
        ["p", "Use short wording, strong contrast, and a placement that does not cover faces, product details, or important document text."],
      ],
    },
    {
      slug: "text-to-pdf-converter-no-signup",
      title: "Text to PDF converter without signup",
      description: "Paste plain text and download a clean one-page PDF without installing an editor.",
      tool: "text-to-pdf",
      content: [
        ["h2", "Use it for short documents"],
        ["p", "Text-to-PDF is best for notes, instructions, simple letters, meeting summaries, and other short plain text drafts that need to become a PDF quickly."],
        ["h2", "Keep the page readable"],
        ["p", "Choose a smaller text size for dense notes and a larger text size for handouts or instructions that need to be read from a distance."],
      ],
    },
    {
      slug: "markdown-to-pdf-converter-no-signup",
      title: "Markdown to PDF converter without signup",
      description: "Paste Markdown and download a readable PDF without creating an account.",
      tool: "markdown-to-pdf",
      content: [
        ["h2", "Use it for short Markdown docs"],
        ["p", "Markdown-to-PDF is useful for README snapshots, project notes, changelogs, lesson outlines, and meeting summaries that need a clean printable copy."],
        ["h2", "Keep private content out"],
        ["p", "The converter runs locally in the browser, but you should still remove secrets, access tokens, or private production details before sharing the exported PDF."],
      ],
    },
    {
      slug: "csv-to-pdf-table-no-upload",
      title: "CSV to PDF table without uploading",
      description: "Paste CSV rows and download a readable PDF table without uploading a spreadsheet.",
      tool: "csv-to-pdf",
      content: [
        ["h2", "Turn small data into a printable table"],
        ["p", "CSV-to-PDF is useful for inventory lists, order rows, event rosters, price sheets, class lists, task tables, and small reports that need a quick PDF copy."],
        ["h2", "Make the table readable"],
        ["p", "Keep columns short and avoid huge tables. A one-page PDF works best when the viewer can scan the headers and rows without zooming."],
      ],
    },
    {
      slug: "json-to-pdf-formatter-no-upload",
      title: "JSON to PDF formatter without uploading",
      description: "Paste JSON and download a formatted PDF without sending the source data to a server.",
      tool: "json-to-pdf",
      content: [
        ["h2", "Use it for technical notes"],
        ["p", "JSON-to-PDF is useful for API examples, config snippets, bug reports, QA notes, and small payload references that need to be shared or printed."],
        ["h2", "Remove secrets first"],
        ["p", "Do not export private keys, passwords, customer records, or production tokens. The tool is for small reviewed snippets, not sensitive data dumps."],
      ],
    },
    {
      slug: "free-sign-in-sheet-generator",
      title: "Free sign-in sheet generator",
      description: "Create a printable sign-in sheet PDF for events, classes, workshops, meetings, or visitor logs.",
      tool: "sign-in-sheet",
      content: [
        ["h2", "A fast sheet beats a complicated form"],
        ["p", "For small events, a printed sign-in sheet is often enough. It gives the organizer names, attendance, signatures, and contact details without needing a registration app."],
        ["h2", "Choose only the columns you need"],
        ["ul", ["Name and signature for attendance.", "Name, email, and signature for follow-up.", "Name, phone, and signature for visitor logs.", "Name, time, and signature for check-in records."]],
        ["h2", "Privacy note"],
        ["p", "Only collect information you actually need. If the sheet is public on a table, avoid asking for sensitive details."],
      ],
    },
    {
      slug: "attendance-sheet-pdf-template",
      title: "Attendance sheet PDF template",
      description: "Use a simple printable attendance sheet for classes, clubs, workshops, and small meetings.",
      tool: "sign-in-sheet",
      content: [
        ["h2", "Keep attendance rows readable"],
        ["p", "A useful attendance sheet leaves enough writing space. Fewer rows per page can be better than a cramped page nobody can read later."],
        ["h2", "Print before the room gets busy"],
        ["p", "Add the event name, date, and note before printing so people only need to write their own line."],
      ],
    },
    {
      slug: "free-printable-graph-paper-generator",
      title: "Free printable graph paper generator",
      description: "Generate graph paper PDF with quarter-inch, half-inch, or small grid spacing.",
      tool: "graph-paper",
      content: [
        ["h2", "Grid paper is a repeat-use printable"],
        ["p", "Students, teachers, makers, and planners often need graph paper immediately. A generator with paper size and spacing options is useful even without decorative templates."],
        ["h2", "Choose the spacing"],
        ["ul", ["Quarter inch is a common general-purpose grid.", "Half inch is easier for younger students or sketching.", "Five lines per inch gives a tighter technical grid.", "Dot grid works for lighter planning and notes."]],
        ["h2", "Print check"],
        ["p", "Use actual size or 100 percent print scaling when accurate spacing matters."],
      ],
    },
    {
      slug: "quarter-inch-graph-paper-pdf",
      title: "Quarter inch graph paper PDF",
      description: "Create a quarter-inch graph paper PDF for math practice, planning, and sketching.",
      tool: "graph-paper",
      content: [
        ["h2", "A practical default for school and planning"],
        ["p", "Quarter-inch graph paper is readable without using too much page space. It is a good default for math work, simple layouts, and hand-drawn plans."],
        ["h2", "Use major lines for scanning"],
        ["p", "Major lines every inch make the page easier to scan after printing, especially when students or planners write over the grid."],
      ],
    },
    {
      slug: "free-packing-list-generator",
      title: "Free packing list generator",
      description: "Make a printable packing checklist PDF for travel, camping, family vacations, or business trips.",
      tool: "packing-list",
      content: [
        ["h2", "Packing lists prevent last-minute mistakes"],
        ["p", "A printed checklist works well because packing happens away from the screen: bedroom, laundry area, suitcase, car, or entryway."],
        ["h2", "Useful sections"],
        ["ul", ["Clothing.", "Toiletries.", "Documents.", "Electronics.", "Kids or baby items.", "Medicine and health items.", "Camping or outdoor gear."]],
        ["h2", "Before you print"],
        ["p", "Check the weather, activity plan, luggage limits, and any required documents before finalizing the list."],
      ],
    },
    {
      slug: "travel-checklist-pdf",
      title: "Travel checklist PDF",
      description: "Create a one-page travel checklist PDF with categories, checkboxes, and reminder notes.",
      tool: "packing-list",
      content: [
        ["h2", "Keep the checklist grouped"],
        ["p", "A travel checklist is easier to use when items are grouped by where they are packed or used. Separate clothes, toiletries, documents, and electronics."],
        ["h2", "Leave space for trip-specific items"],
        ["p", "Every trip has odd items. Add a notes area for passports, tickets, chargers, gifts, school forms, or event-specific supplies."],
      ],
    },
    {
      slug: "free-receipt-generator-pdf",
      title: "Free receipt generator PDF",
      description: "Create a simple printable receipt for a sale, service payment, deposit, or reimbursement.",
      tool: "receipt-generator",
      content: [
        ["h2", "Receipts solve an immediate record problem"],
        ["p", "Receipt searches usually have immediate intent. Someone has received or sent money and needs a dated record that is clear enough for both parties to keep."],
        ["h2", "Keep sensitive details minimal"],
        ["p", "Use enough information to identify the payment, but avoid unnecessary personal account numbers or private payment details."],
      ],
    },
    {
      slug: "weekly-timesheet-generator-pdf",
      title: "Weekly timesheet generator PDF",
      description: "Make a printable timesheet for freelance hours, staff records, project tracking, or approvals.",
      tool: "timesheet-generator",
      content: [
        ["h2", "Timesheets repeat every week"],
        ["p", "Timesheets have repeat use because hours need to be recorded again every week or pay period. A quick printable sheet can be enough for freelancers, contractors, and small teams."],
        ["h2", "Use clear project names"],
        ["p", "Write project names the same way you use them on invoices, approvals, or internal records so the hours are easier to reconcile later."],
      ],
    },
    {
      slug: "free-certificate-generator-pdf",
      title: "Free certificate generator PDF",
      description: "Create a printable certificate for completion, participation, classroom awards, or small events.",
      tool: "certificate-generator",
      content: [
        ["h2", "A fast award page is enough"],
        ["p", "A certificate generator is useful when a teacher, coach, organizer, or club needs a polished award quickly without paying for a template package."],
        ["h2", "Use accurate award wording"],
        ["p", "Only issue certificates for events, activities, or recognition you are authorized to provide. Avoid making it look like an official credential unless it is one."],
      ],
    },
    {
      slug: "printable-to-do-list-generator",
      title: "Printable to do list generator",
      description: "Build a one-page checklist for errands, work tasks, study sessions, home projects, or events.",
      tool: "todo-list",
      content: [
        ["h2", "A useful list is short"],
        ["p", "A printable to-do list works best when it limits the day to a few visible sections. The goal is action, not a giant task archive."],
        ["h2", "Group by context"],
        ["p", "Separate errands, follow-up, home, study, or event tasks so the printed page can be scanned quickly."],
      ],
    },
  ];

  const pages = {
    about: {
      title: "About PrintableTools Lab",
      description: "PrintableTools Lab makes quick, practical PDF generators for small businesses, families, teachers, tutors, event organizers, and home organizers.",
      body: [
        ["p", "PrintableTools Lab is built around a simple idea: useful printable pages should be fast to make, easy to print, and readable on ordinary home or school printers."],
        ["p", "The current version focuses on practical browser-side PDF work: image conversion, text conversion, business documents, labels, business cards, flyers, coupons, career documents, planning pages, event certificates, classroom resources, and household checklists."],
        ["p", "The free tools run in the browser with clean one-page exports and a small daily generation limit while the project validates demand and prepares for responsible advertising."],
      ],
    },
    privacy: {
      title: "Privacy Policy",
      description: "Privacy policy for PrintableTools Lab.",
      body: [
        ["p", "PrintableTools Lab is designed to generate PDFs in your browser. The first version does not require an account and keeps ordinary PDF generation on your device."],
        ["p", "If you choose the optional AI idea helper, the current tool type and short form text are sent to the site's AI service only to return printable suggestions. Do not enter sensitive personal information."],
        ["p", "The site stores a small amount of local data in your browser to remember daily generation counts and anonymous local event totals such as page views, generate clicks, downloads, and limit notices."],
        ["p", "The site's anonymous event counter may also store a normalized source label such as direct, google, github, gist, directory, share-kit, or referral. It does not store full referrer URLs in that counter."],
        ["p", "If you submit the sponsor inquiry form, the company name, business email, website, placement interest, budget range, timeline, audience-fit note, and public-safe notes are sent to the site API for manual follow-up review. Public dashboards expose only aggregate sponsor lead counts, not contact details."],
        ["p", "If analytics, advertising, or payment tools are added later, this policy should be updated before launch to describe those providers, cookies, and opt-out choices."],
      ],
    },
    terms: {
      title: "Terms of Use",
      description: "Terms of use for PrintableTools Lab.",
      body: [
        ["p", "The free printable generators are provided as-is for personal, classroom, and small-group use. You are responsible for checking that a generated worksheet is appropriate before giving it to a child or group."],
        ["p", "Do not use the tools to create unlawful, harmful, infringing, or misleading materials."],
        ["p", "Commercial resale of generated pages as standalone products is not allowed in the free version. Future licensing terms may be added only after the free product is validated."],
      ],
    },
    license: {
      title: "AI & License Disclosure",
      description: "How PrintableTools Lab handles generated content, design assets, and licensing.",
      body: [
        ["p", "PrintableTools Lab uses code-driven templates and may use AI assistance during product design, wording, and template ideation. The generated PDFs are assembled in the browser from user input and template rules."],
        ["p", "Existing PDF merge, split, and page-number operations use the MIT-licensed pdf-lib JavaScript library in the browser. PDF-to-image rendering uses the Apache-2.0 pdf.js library, ZIP downloads use the MIT-licensed fflate library, and static QR tools use the MIT-licensed qrcode-generator JavaScript library."],
        ["p", "The default templates avoid third-party characters, trademarked brands, and protected artwork. Users should not enter copyrighted or trademarked content they do not have permission to use."],
        ["p", "If external fonts, icon sets, or datasets are added later, their license notes should be listed here before public launch."],
      ],
    },
    roadmap: {
      title: "PrintableTools Lab Roadmap",
      description: "A noindex roadmap for future PrintableTools Lab product decisions after the free version is validated.",
      body: [
        ["p", "The current product focus is the free printable and file utility site plus responsible display advertising after traffic and policy readiness improve."],
        ["h2", "Signals to watch"],
        ["ul", ["Search Console impressions for generator keywords.", "PDF, image, and QR downloads by tool.", "Return visits and high-intent tool depth.", "Requests for classroom, local seller, or batch workflows."]],
        ["h2", "Possible later work"],
        ["p", "Display ads still wait for policy readiness and search visibility. Ads must stay away from generator controls and never block a file download."],
      ],
    },
    "free-pdf-tools": {
      title: "Free PDF Tools Without Signup",
      description: "Start with free browser PDF, image, and QR tools for compression, resizing, format conversion, QR codes, image-to-PDF, text-to-PDF, invoices, receipts, labels, business cards, flyers, coupons, timesheets, certificates, checklists, and printable pages.",
      body: [
        ["p", "Use this directory when you need a PDF or image file now and do not want an account, hidden export fee, or ad interaction requirement."],
        ["h2", "No-upload conversion tools"],
        ["ul", ["Image compressor, image resizer, and image format converter: make smaller or correctly sized JPG, PNG, and WebP files locally.", "QR, WiFi QR, and contact QR tools: create printable static codes without a signup wall.", "Image to PDF Converter: turn JPG, PNG, or WebP images into a one-page PDF.", "Multiple Images to PDF Converter: combine up to eight images into one multi-page PDF.", "Merge, split, rotate, remove, reorder, and number PDF pages locally in the browser.", "Text, Markdown, CSV, and JSON converters: turn common notes, docs, table rows, and technical snippets into readable PDFs."]],
        ["h2", "Business and work PDFs"],
        ["ul", ["Invoice, estimate, purchase order, receipt, timesheet, bill of sale, and rent receipt PDFs are built for quick records, not full accounting software.", "Business card, address label, barcode label, price tag, flyer, and coupon PDFs are built for local-business print needs without design-account friction.", "Resume, cover letter, and resignation letter tools export without a surprise download fee."]],
        ["h2", "Printable planning PDFs"],
        ["ul", ["Calendar, meal planner, graph paper, sign-in sheet, certificate, packing list, to-do list, classroom chart, and worksheet tools support common home, school, and event tasks."]],
        ["h2", "Why free first"],
        ["p", "The project validates demand through downloads, Search Console data, and anonymous usage counters before enabling responsible advertising or paid features."],
      ],
    },
    "share-kit": {
      title: "PrintableTools Lab Share Kit",
      description: "Copy-ready short-video hooks, community posts, directory blurbs, campaign links, and compliance rules for sharing PrintableTools Lab without paid ads.",
      body: [
        ["p", "Use this share kit for zero-budget distribution. It is meant for useful posts, directory listings, short demos, and community replies where a free file utility directly solves the topic."],
        ["h2", "Priority links"],
        ["ul", ["Compress PDF to 1MB: https://printable-tools-lab.pages.dev/compress-pdf-to-1mb/?utm_source=share-kit&utm_medium=organic", "Compress PDF to 500KB: https://printable-tools-lab.pages.dev/compress-pdf-to-500kb/?utm_source=share-kit&utm_medium=organic", "Compress image to 100KB: https://printable-tools-lab.pages.dev/compress-image-to-100kb/?utm_source=share-kit&utm_medium=organic", "PDF to JPG without upload: https://printable-tools-lab.pages.dev/pdf-to-jpg-no-upload/?utm_source=share-kit&utm_medium=organic", "Free QR code generator: https://printable-tools-lab.pages.dev/free-qr-code-generator-no-signup/?utm_source=share-kit&utm_medium=organic"]],
        ["h2", "Copy-ready short posts"],
        ["p", "Portal says your PDF must be under 1MB? Use the free no-upload PDF compressor, choose the 1MB target, select your PDF, and download a smaller copy from the browser."],
        ["p", "Job form rejecting your photo because it is over 100KB? Use the local image-to-KB compressor, pick 100KB, and download a smaller JPG or WebP without uploading the original photo."],
        ["p", "I made a free no-signup file utility site for common upload blockers: PDF compression targets, image-to-KB targets, PDF-to-JPG, image resizing, QR codes, invoices, labels, and small business PDFs."],
        ["h2", "Rules"],
        ["ul", ["Post only where free tools or file utilities are relevant.", "Do not ask for ad interactions, ad impressions, upvotes, or artificial engagement.", "Do not claim guaranteed compression results; say the tool tries toward a target.", "Do not post private documents, IDs, payment details, or user files in examples.", "Use UTM source labels so the live metrics can separate directory, community, video, and social tests."]],
        ["p", "Machine-readable version: https://printable-tools-lab.pages.dev/share-kit.json"],
      ],
    },
    sponsor: {
      title: "Sponsor PrintableTools Lab",
      description: "Sponsor and partner inquiry page for PrintableTools Lab, a free no-signup browser PDF, image, QR, and document utility site with ad-safe placement rules.",
      body: [],
    },
    "upload-error-cheatsheet": {
      title: "Upload error cheatsheet",
      description: "Copy-ready reference for common PDF, image, JPG, PNG, resume, and email attachment upload errors with direct free no-signup tool fixes.",
      body: [
        ["p", "Use this reference when a form, job portal, support ticket, marketplace, or email app rejects a file by size, type, or dimensions."],
        ["h2", "Direct fixes"],
        ["ul", [
          "PDF must be under 1MB: https://printable-tools-lab.pages.dev/file-must-be-less-than-1mb/",
          "PDF must be under 500KB: https://printable-tools-lab.pages.dev/pdf-must-be-under-500kb/",
          "Image must be less than 2MB: https://printable-tools-lab.pages.dev/image-must-be-less-than-2mb/",
          "Image must be under 500KB: https://printable-tools-lab.pages.dev/image-must-be-under-500kb/",
          "Photo must be under 100KB: https://printable-tools-lab.pages.dev/photo-must-be-under-100kb/",
          "JPG must be under 200KB: https://printable-tools-lab.pages.dev/jpg-must-be-under-200kb/",
          "PNG screenshot too large: https://printable-tools-lab.pages.dev/png-screenshot-too-large/",
          "Invalid file type, upload JPG or PNG: https://printable-tools-lab.pages.dev/invalid-file-type-jpg-png/",
          "Image dimensions must be 600 x 600: https://printable-tools-lab.pages.dev/image-dimensions-600x600/",
          "Resume PDF too large: https://printable-tools-lab.pages.dev/resume-pdf-too-large/",
          "Email attachment too large: https://printable-tools-lab.pages.dev/email-attachment-too-large/",
        ]],
        ["h2", "Machine-readable feed"],
        ["p", "JSON: https://printable-tools-lab.pages.dev/upload-error-cheatsheet.json"],
        ["p", "Full upload limit matcher: https://printable-tools-lab.pages.dev/upload-limit-fixer/"],
      ],
    },
    "organic-push-kit": {
      title: "Organic push kit",
      description: "Copy-ready low-risk organic distribution tasks, tracked links, trigger rules, and validation signals for growing free-tool traffic before display ads.",
      body: [
        ["p", "Use this page as a small daily queue for useful posts, directory updates, short demos, and resource replies. Skip a task when the trigger is not true."],
        ["h2", "Today queue"],
        ["ul", [
          "Helpful reply for PDF under 1MB questions",
          "Helpful reply for 100KB photo upload questions",
          "Directory listing for free no-signup file tools",
          "Support thread resource for exact upload errors",
        ]],
        ["h2", "Tracked resources"],
        ["ul", [
          "Organic push JSON: https://printable-tools-lab.pages.dev/organic-push-kit.json",
          "Upload error cheatsheet: https://printable-tools-lab.pages.dev/upload-error-cheatsheet/",
          "Share kit: https://printable-tools-lab.pages.dev/share-kit/",
          "Directory pack: https://printable-tools-lab.pages.dev/submit-directory/",
        ]],
        ["h2", "Rules"],
        ["ul", [
          "Post only where the linked tool directly solves the topic.",
          "Do not ask for ad clicks, ad views, artificial engagement, upvotes, or fake traffic.",
          "Use generic sample files only; never post private IDs, payment documents, or user files.",
          "Revenue is still unproven until ad payout, platform payout, or another payment provider shows settled money.",
        ]],
      ],
    },
    "launch-kit": {
      title: "Launch Kit",
      description: "Distribution copy, links, and validation steps for launching PrintableTools Lab.",
      body: [
        ["p", "Use this page to coordinate the first distribution push. The goal is not to look busy; it is to create enough real traffic for Search Console, AdSense readiness, and download validation."],
        ["h2", "Primary links"],
        ["ul", ["Homepage: https://printable-tools-lab.pages.dev/", "Tools index: https://printable-tools-lab.pages.dev/tools/", "Compress image: https://printable-tools-lab.pages.dev/tools/compress-image/", "Resize image: https://printable-tools-lab.pages.dev/tools/resize-image/", "Convert image: https://printable-tools-lab.pages.dev/tools/convert-image/", "Remove background: https://printable-tools-lab.pages.dev/tools/remove-background/", "Add text to image: https://printable-tools-lab.pages.dev/tools/add-text-image/", "Crop image: https://printable-tools-lab.pages.dev/tools/crop-image/", "Rotate image: https://printable-tools-lab.pages.dev/tools/rotate-image/", "Watermark image: https://printable-tools-lab.pages.dev/tools/watermark-image/", "QR code generator: https://printable-tools-lab.pages.dev/tools/qr-code/", "WiFi QR code generator: https://printable-tools-lab.pages.dev/tools/wifi-qr-code/", "Contact QR code generator: https://printable-tools-lab.pages.dev/tools/vcard-qr-code/", "Image to PDF: https://printable-tools-lab.pages.dev/tools/image-to-pdf/", "Multiple images to PDF: https://printable-tools-lab.pages.dev/tools/multi-image-pdf/", "Merge PDF: https://printable-tools-lab.pages.dev/tools/merge-pdf/", "Split PDF: https://printable-tools-lab.pages.dev/tools/split-pdf/", "PDF page numbers: https://printable-tools-lab.pages.dev/tools/pdf-page-numbers/", "Rotate PDF: https://printable-tools-lab.pages.dev/tools/rotate-pdf/", "Remove PDF pages: https://printable-tools-lab.pages.dev/tools/remove-pdf-pages/", "Reorder PDF pages: https://printable-tools-lab.pages.dev/tools/reorder-pdf-pages/", "Watermark PDF: https://printable-tools-lab.pages.dev/tools/watermark-pdf/", "Stamp PDF: https://printable-tools-lab.pages.dev/tools/stamp-pdf/", "Sign PDF: https://printable-tools-lab.pages.dev/tools/sign-pdf/", "Text to PDF: https://printable-tools-lab.pages.dev/tools/text-to-pdf/", "Invoice generator: https://printable-tools-lab.pages.dev/tools/invoice-generator/", "Business card generator: https://printable-tools-lab.pages.dev/tools/business-card/", "Barcode label generator: https://printable-tools-lab.pages.dev/tools/barcode-labels/", "Sitemap: https://printable-tools-lab.pages.dev/sitemap.xml"]],
        ["h2", "First distribution copy"],
        ["p", "Free browser PDF, image, and QR tools: compress images, resize images, convert image formats, remove simple image backgrounds, add text to photos, create QR codes, WiFi QR signs, contact QR codes, merge PDFs, split PDFs, rotate pages, remove pages, reorder pages, watermark PDFs, stamp PDFs, add typed signature blocks, add PDF page numbers, convert images to PDF, combine multiple images, turn text into PDF, create invoices, receipts, labels, business cards, flyers, coupons, timesheets, resumes, certificates, sign-in sheets, graph paper, calendars, worksheets, and checklists. No account required."],
        ["p", "Try the free image to PDF converter: select a JPG, PNG, or WebP file and generate a one-page PDF locally without uploading the image."],
        ["p", "Need a quick invoice, receipt, timesheet, sign-in sheet, or packing checklist? PrintableTools Lab creates practical PDFs in the browser."],
        ["h2", "Do not do this"],
        ["ul", ["Do not request ad interactions from visitors.", "Do not submit to AdSense before Search Console sees public pages.", "Do not buy traffic before tool usage proves basic conversion."]],
      ],
    },
  };

  window.PRINTABLE_TOOLS_LAB_ROUTES = {
    tools,
    guides,
    landingPages,
    pages,
  };

  const toolOrder = [
    "invoice-generator",
    "invoice-followup-email",
    "estimate-generator",
    "purchase-order",
    "bill-of-sale",
    "business-card",
    "address-labels",
    "price-tag",
    "flyer-maker",
    "barcode-labels",
    "coupon-maker",
    "packing-slip",
    "work-order",
    "inventory-sheet",
    "resume-builder",
    "ats-resume-checker",
    "cover-letter",
    "resignation-letter",
    "monthly-calendar",
    "meal-planner",
    "image-to-pdf",
    "multi-image-pdf",
    "compress-pdf",
    "pdf-to-images",
    "pdf-to-text",
    "pdf-to-word",
    "compress-image",
    "compress-image-to-kb",
    "resize-image",
    "convert-image",
    "remove-background",
    "crop-image",
    "rotate-image",
    "watermark-image",
    "add-text-image",
    "signature-png",
    "passport-photo",
    "qr-code",
    "wifi-qr-code",
    "vcard-qr-code",
    "merge-pdf",
    "split-pdf",
    "pdf-page-numbers",
    "rotate-pdf",
    "remove-pdf-pages",
    "reorder-pdf-pages",
    "watermark-pdf",
    "stamp-pdf",
    "sign-pdf",
    "text-to-pdf",
    "markdown-to-pdf",
    "csv-to-pdf",
    "json-to-pdf",
    "sign-in-sheet",
    "graph-paper",
    "packing-list",
    "receipt-generator",
    "timesheet-generator",
    "certificate-generator",
    "todo-list",
    "rent-receipt",
    "name-tracing",
    "chore-chart",
    "reward-chart",
    "flashcards",
    "weekly-planner",
    "habit-tracker",
  ];

  const app = document.getElementById("app");
  let currentToolState = null;
  const imageToolState = new Map();
  const pdfToolState = new Map();
  const signaturePadState = new Map();

  const SOFTWARE_SCHEMA_IDS = new Set(["tools"]);
  const sponsorPlacements = [
    {
      id: "starter-review",
      name: "Starter media review",
      price: "USD 49 exploratory",
      fit: "A sponsor or partner wants a quick manual fit review before discussing placement.",
      deliverable: "Policy-fit check, suggested placement type, and a public-safe follow-up note.",
    },
    {
      id: "guide-sponsorship",
      name: "Guide sponsorship pilot",
      price: "USD 99-149 pilot",
      fit: "Useful products for privacy-friendly PDF, image, QR, career, classroom, or small-business workflows.",
      deliverable: "Clearly labeled sponsor mention on one relevant guide or resource page after approval.",
    },
    {
      id: "partner-distribution",
      name: "Partner distribution swap",
      price: "No-cash mutual test",
      fit: "Directories, newsletters, or communities that can send relevant visitors to free tools.",
      deliverable: "Tracked partner link and review of whether traffic creates depth, download, or lead signal.",
    },
  ];
  const sponsorDeals = [
    {
      id: "starter-fit-review",
      title: "Starter fit review",
      price: "USD 49",
      budgetRange: "under-250",
      placement: "media-kit-review",
      timeline: "this-week",
      commitment: "request-invoice",
      bestFor: "A sponsor wants to know whether their product is safe and relevant before buying a visible placement.",
      deliverable: "Manual sponsor-fit review, audience match, recommended page family, and safe next-step copy.",
      proofNeeded: "Company URL, product category, intended audience, and any placement rules.",
      trackedUrl: "/sponsor-starter-review/?utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=sponsor_starter_review&utm_content=starter-fit-review&commitment=request-invoice#sponsor-inquiry",
    },
    {
      id: "guide-sponsor-pilot",
      title: "Guide sponsor pilot",
      price: "USD 99-149",
      budgetRange: "250-500",
      placement: "content-sponsorship",
      timeline: "this-month",
      commitment: "request-invoice",
      bestFor: "A PDF, image, QR, career, classroom, or small-business product wants one clearly labeled pilot mention.",
      deliverable: "One manually approved, clearly labeled sponsor mention on a relevant guide or resource page.",
      proofNeeded: "Campaign fit, sponsor copy draft, safe landing URL, and category exclusions.",
      trackedUrl: "/sponsor-deal-room/?utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=sponsor_deal_room&utm_content=guide-sponsor-pilot&commitment=request-invoice#sponsor-inquiry",
    },
    {
      id: "vertical-category-pilot",
      title: "Vertical category pilot",
      price: "USD 149-250",
      budgetRange: "250-500",
      placement: "directory-visibility",
      timeline: "this-month",
      commitment: "request-invoice",
      bestFor: "A partner cares about one audience such as QR/local marketing, resume/career, classroom, or small-business paperwork.",
      deliverable: "Tracked vertical sponsor page, fit review, and one approved contextual placement candidate.",
      proofNeeded: "Target vertical, audience fit, sponsor category, and safe public landing URL.",
      trackedUrl: "/sponsor-deal-room/?utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=sponsor_deal_room&utm_content=vertical-category-pilot&commitment=request-invoice#sponsor-inquiry",
    },
    {
      id: "partner-distribution-test",
      title: "Partner distribution test",
      price: "No-cash mutual test",
      budgetRange: "exploratory",
      placement: "partner-distribution",
      timeline: "exploratory",
      commitment: "question-only",
      bestFor: "A newsletter, directory, resource page, or community wants to test relevant traffic before a paid placement.",
      deliverable: "Tracked partner link, source attribution, and review against page views, depth, downloads, or lead signal.",
      proofNeeded: "Partner page, expected audience, planned link context, and review window.",
      trackedUrl: "/sponsor-deal-room/?utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=sponsor_deal_room&utm_content=partner-distribution-test&commitment=question-only#sponsor-inquiry",
    },
  ];

  const DEFAULT_SPONSOR_DEAL_ID = "starter-fit-review";
  const sponsorVerticals = [
    {
      slug: "pdf-image-qr-saas",
      title: "PDF, Image, and QR SaaS Sponsorship",
      description: "Sponsor pilot page for SaaS products that help people compress files, convert images, generate QR codes, automate documents, or manage privacy-friendly file workflows.",
      audience: "Visitors fixing PDF size limits, converting images, making static QR codes, and choosing no-upload browser utilities.",
      sponsorFit: "PDF APIs, image optimization tools, QR platforms, privacy-friendly document automation, browser utility products, and file-workflow SaaS.",
      pitch: "Reach people who already have a file, upload, conversion, or QR job in progress.",
      campaign: "pdf_image_qr_saas",
      primaryPlacementId: "guide-sponsorship",
      priceHint: "USD 99-149 pilot",
      links: [["Compress PDF", "tools/compress-pdf"], ["Compress image to KB", "tools/compress-image-to-kb"], ["Convert image format", "tools/convert-image"], ["Free QR code generator", "tools/qr-code"], ["Upload limit fixer", "upload-limit-fixer"]],
      sponsorCategories: ["PDF APIs", "image compression SaaS", "QR code platforms", "document automation", "privacy-friendly browser utilities"],
    },
    {
      slug: "resume-career-sponsors",
      title: "Resume and Career Tool Sponsorship",
      description: "Sponsor pilot page for career products that help job seekers with resumes, ATS checks, cover letters, applications, PDF upload limits, and interview preparation.",
      audience: "Job seekers creating resume PDFs, checking ATS keywords, fixing resume upload size limits, and preparing application documents.",
      sponsorFit: "Resume builders, ATS tools, job boards, interview prep products, career coaching, and applicant-document utilities.",
      pitch: "Reach visitors at the moment they are preparing or fixing job-application documents.",
      campaign: "resume_career_sponsors",
      primaryPlacementId: "guide-sponsorship",
      priceHint: "USD 99-149 pilot",
      links: [["Resume builder", "tools/resume-builder"], ["ATS resume checker", "tools/ats-resume-checker"], ["Cover letter generator", "tools/cover-letter"], ["Resume PDF too large", "resume-pdf-too-large"], ["ATS resume keyword guide", "guides/ats-resume-keyword-match"]],
      sponsorCategories: ["resume software", "ATS checkers", "job boards", "career coaching", "interview prep"],
    },
    {
      slug: "classroom-printable-sponsors",
      title: "Classroom Printable Sponsorship",
      description: "Sponsor pilot page for education, homeschool, teacher-resource, and classroom products that fit worksheets, flashcards, tracing pages, planners, and routine charts.",
      audience: "Teachers, homeschool families, and parents making free printable learning, planning, and classroom-management PDFs.",
      sponsorFit: "Teacher marketplaces, homeschool resources, classroom apps, learning printables, family routine products, and child-safe educational tools.",
      pitch: "Reach classroom and homeschool visitors while keeping child-safety and ad-safety review strict.",
      campaign: "classroom_printable_sponsors",
      primaryPlacementId: "guide-sponsorship",
      priceHint: "USD 99-149 pilot",
      links: [["Name tracing worksheet", "tools/name-tracing"], ["Flashcard generator", "tools/flashcards"], ["Chore chart", "tools/chore-chart"], ["Weekly planner", "tools/weekly-planner"], ["Classroom label ideas", "guides/classroom-label-generator-ideas"]],
      sponsorCategories: ["teacher resources", "homeschool tools", "classroom apps", "learning printables", "family routine products"],
    },
    {
      slug: "small-business-paperwork-sponsors",
      title: "Small Business Paperwork Sponsorship",
      description: "Sponsor pilot page for products that help freelancers, local sellers, and small businesses with invoices, receipts, quotes, labels, QR signs, flyers, and operations paperwork.",
      audience: "Freelancers, local sellers, home-service operators, and small teams creating simple business PDFs and print assets.",
      sponsorFit: "Invoicing apps, bookkeeping tools, POS products, local marketing services, shipping tools, label systems, and small-business operations software.",
      pitch: "Reach small-business visitors while they are making paperwork or local promotion files.",
      campaign: "small_business_paperwork_sponsors",
      primaryPlacementId: "guide-sponsorship",
      priceHint: "USD 99-149 pilot",
      links: [["Invoice generator", "tools/invoice-generator"], ["Receipt generator", "tools/receipt-generator"], ["Packing slip generator", "tools/packing-slip"], ["Business card generator", "tools/business-card"], ["Price tag generator", "tools/price-tag"]],
      sponsorCategories: ["invoicing software", "bookkeeping tools", "POS products", "shipping tools", "local marketing services"],
    },
    {
      slug: "local-marketing-qr-sponsors",
      title: "Local Marketing and QR Sponsorship",
      description: "Sponsor pilot page for QR, signage, local promotion, review-management, and small-business marketing products that fit printable flyers, coupons, price tags, and WiFi/contact QR tools.",
      audience: "Local services, shops, event organizers, and small teams creating QR codes, flyers, coupons, signs, and printable promotion assets.",
      sponsorFit: "QR platforms, review-request tools, local SEO products, print shops, signage services, event tools, and small-business marketing software.",
      pitch: "Reach visitors making offline-to-online assets for local promotion.",
      campaign: "local_marketing_qr_sponsors",
      primaryPlacementId: "starter-review",
      priceHint: "USD 49 exploratory or USD 99-149 pilot",
      links: [["Free QR code generator", "tools/qr-code"], ["WiFi QR code generator", "tools/wifi-qr-code"], ["Contact QR code generator", "tools/vcard-qr-code"], ["Flyer maker", "tools/flyer-maker"], ["Coupon maker", "tools/coupon-maker"]],
      sponsorCategories: ["QR code platforms", "review-management tools", "local SEO products", "print shops", "event marketing tools"],
    },
  ];

  function sponsorDealPrefillAttrs(deal) {
    return [
      `data-sponsor-deal-id="${escapeHtml(deal.id)}"`,
      `data-sponsor-placement="${escapeHtml(deal.placement)}"`,
      `data-sponsor-budget-range="${escapeHtml(deal.budgetRange)}"`,
      `data-sponsor-timeline="${escapeHtml(deal.timeline)}"`,
      `data-sponsor-commitment="${escapeHtml(sponsorDealCommitment(deal))}"`,
      `data-sponsor-notes="${escapeHtml(`${deal.title} (${deal.price}): ${deal.deliverable} Needed: ${deal.proofNeeded}`)}"`,
    ].join(" ");
  }

  function sponsorDealCommitment(deal) {
    return deal?.commitment || (String(deal?.price || "").toLowerCase().includes("no-cash") ? "question-only" : "request-invoice");
  }

  function sponsorQuickDealOptions() {
    return sponsorDeals
      .filter((deal) => sponsorDealCommitment(deal) === "request-invoice")
      .map((deal) => `<option value="${escapeHtml(deal.id)}"${deal.id === DEFAULT_SPONSOR_DEAL_ID ? " selected" : ""}>${escapeHtml(deal.title)} - ${escapeHtml(deal.price)}</option>`)
      .join("");
  }

  function sponsorVerticalInvoiceReviewUrl(vertical, content = "prospect") {
    const suffix = `${content}-${vertical.slug}`;
    return `/sponsor-starter-review/?utm_source=sponsor-opportunities&utm_medium=organic&utm_campaign=sponsor_starter_review&utm_content=${encodeURIComponent(suffix)}&vertical=${encodeURIComponent(vertical.slug)}&commitment=request-invoice#sponsor-inquiry`;
  }

  const sponsorExternalDiscoveryProof = {
    directoryListedCount: 4,
    directoryPendingCount: 5,
    indexNowAcceptedTargets: ["github-pages"],
    listedDirectories: [
      { name: "TechTools Launchpad site listing", evidenceUrl: "https://techtools.cz/launchpad-api/tools?per_page=100&sort=recent" },
      { name: "TechTools Launchpad upload-limit listing", evidenceUrl: "https://techtools.cz/launchpad-api/tools/162" },
      { name: "NoLogin.tools", evidenceUrl: "https://nologin.tools/tool/printable-tools-lab-pages-dev" },
      { name: "NoLogin.tools upload-limit listing", evidenceUrl: "https://nologin.tools/tool/printable-tools-lab-pages-dev-upload-limit-fixer" },
    ],
  };

  const sponsorOpsSubmissionQueue = [
    {
      name: "Cloudmersive",
      category: "Document conversion API",
      contactRouteStatus: "ready",
      firstAction: "Prepare only",
      bestContactUrl: "https://portal.cloudmersive.com/partnerships",
      publicEmail: "",
      prospectId: "cloudmersive-document-api",
      dealId: "starter-fit-review",
      vertical: "pdf-image-qr-saas",
      note: "Route is ready but requires real email, name, phone, and consent checkbox.",
    },
    {
      name: "QRCodeChimp",
      category: "QR code marketing",
      contactRouteStatus: "review",
      firstAction: "Open email draft",
      bestContactUrl: "https://www.qrcodechimp.com/contact",
      publicEmail: "support@qrcodechimp.com",
      prospectId: "qrcodechimp-qr-marketing",
      dealId: "guide-sponsor-pilot",
      vertical: "local-marketing-qr-sponsors",
      note: "Public email visible; confirm sponsorship or partnership relevance before sending.",
    },
    {
      name: "Invoice Ninja",
      category: "Invoicing software",
      contactRouteStatus: "review",
      firstAction: "Open email draft",
      bestContactUrl: "https://www.invoiceninja.com/contact/",
      publicEmail: "contact@invoiceninja.com",
      prospectId: "invoice-ninja-small-business",
      dealId: "vertical-category-pilot",
      vertical: "small-business-paperwork-sponsors",
      note: "Warmest business-paperwork fit; use truthful sender identity and record evidence if sent.",
    },
    {
      name: "Education.com",
      category: "Worksheets and learning resources",
      contactRouteStatus: "review",
      firstAction: "Open email draft",
      bestContactUrl: "https://www.education.com/support/contact/",
      publicEmail: "support@education.com",
      prospectId: "educationcom-worksheets",
      dealId: "vertical-category-pilot",
      vertical: "classroom-printable-sponsors",
      note: "Public email visible, but the route asks for real sender details; send only from a truthful authorized sender.",
    },
    {
      name: "Zoho Invoice",
      category: "Small-business invoicing",
      contactRouteStatus: "review",
      firstAction: "Open contact route",
      bestContactUrl: "https://www.zoho.com/partners",
      publicEmail: "",
      prospectId: "zoho-invoice-small-business",
      dealId: "guide-sponsor-pilot",
      vertical: "small-business-paperwork-sponsors",
      note: "Partner route discovered; use public-safe form message only after confirming route fit.",
    },
  ];

  function sponsorExternalDiscoveryProofLine() {
    const listedCount = sponsorExternalDiscoveryProof.directoryListedCount || sponsorExternalDiscoveryProof.listedDirectories.length;
    const pendingCount = sponsorExternalDiscoveryProof.directoryPendingCount || 0;
    const acceptedTargets = sponsorExternalDiscoveryProof.indexNowAcceptedTargets || [];
    return `External discovery proof: ${listedCount} public directory listing(s) are live; ${pendingCount} more listing(s) remain pending; IndexNow accepted ${acceptedTargets.length} target(s). These are discovery signals, not revenue.`;
  }

  function sponsorExternalDiscoveryProofHtml() {
    const links = sponsorExternalDiscoveryProof.listedDirectories
      .map((item) => `<a href="${escapeHtml(item.evidenceUrl)}" target="_blank" rel="noreferrer">${escapeHtml(item.name)}</a>`)
      .join(" ");
    return `
      <section class="shell section sponsor-proof">
        <h2>Public discovery proof</h2>
        <p>${escapeHtml(sponsorExternalDiscoveryProofLine())}</p>
        <p class="help">Live evidence: ${links}. Directory listings, IndexNow submissions, clicks, and views are discovery signals only. Revenue is real only after a signed sponsor agreement or settled external payment.</p>
      </section>`;
  }

  const sponsorProspects = [
    {
      id: "pdfco-pdf-api",
      name: "PDF.co",
      vertical: "pdf-image-qr-saas",
      category: "PDF API and document automation",
      website: "https://pdf.co/",
      contactUrl: "https://pdf.co/contact",
      fitReason: "PDF.co sells PDF and document automation APIs, which fits visitors compressing, converting, and editing PDF files.",
      dealId: "guide-sponsor-pilot",
    },
    {
      id: "cloudmersive-document-api",
      name: "Cloudmersive",
      vertical: "pdf-image-qr-saas",
      category: "Document conversion API",
      website: "https://cloudmersive.com/",
      contactUrl: "https://cloudmersive.com/contact-sales",
      fitReason: "Cloudmersive offers file conversion and document APIs, adjacent to PrintableTools Lab's PDF and image conversion intent.",
      dealId: "starter-fit-review",
    },
    {
      id: "uniqode-qr-platform",
      name: "Uniqode",
      vertical: "local-marketing-qr-sponsors",
      category: "QR code platform",
      website: "https://www.uniqode.com/",
      contactUrl: "https://www.uniqode.com/contact-sales",
      fitReason: "Uniqode sells QR code and offline-to-online marketing tools, matching QR, WiFi QR, contact QR, flyer, and coupon workflows.",
      dealId: "vertical-category-pilot",
    },
    {
      id: "qrcodechimp-qr-marketing",
      name: "QRCodeChimp",
      vertical: "local-marketing-qr-sponsors",
      category: "QR code marketing",
      website: "https://www.qrcodechimp.com/",
      contactUrl: "https://www.qrcodechimp.com/contact",
      fitReason: "QRCodeChimp targets business QR code use cases, a close fit for printable QR signs, flyers, coupons, and local service handouts.",
      dealId: "guide-sponsor-pilot",
    },
    {
      id: "jobscan-ats-resume",
      name: "Jobscan",
      vertical: "resume-career-sponsors",
      category: "ATS resume checker",
      website: "https://www.jobscan.co/",
      contactUrl: "https://www.jobscan.co/partners",
      fitReason: "Jobscan's ATS and resume optimization product fits visitors using resume builder, ATS checker, and resume upload-size pages.",
      dealId: "vertical-category-pilot",
    },
    {
      id: "teal-career-resume",
      name: "Teal",
      vertical: "resume-career-sponsors",
      category: "Career and resume software",
      website: "https://www.tealhq.com/",
      contactUrl: "https://www.tealhq.com/contact-us",
      fitReason: "Teal offers job-search and resume tools, matching job seekers creating application PDFs and ATS-friendly documents.",
      dealId: "guide-sponsor-pilot",
    },
    {
      id: "invoice-ninja-small-business",
      name: "Invoice Ninja",
      vertical: "small-business-paperwork-sponsors",
      category: "Invoicing software",
      website: "https://www.invoiceninja.com/",
      contactUrl: "https://www.invoiceninja.com/contact/",
      fitReason: "Invoice Ninja sells invoicing and small-business payment workflow software, fitting invoice, estimate, receipt, and client paperwork pages.",
      validationSignal: "Current validation snapshot: invoice-generator has 2 PDF downloads, sitewide sponsor intent is 2, and sponsor leads/invoice requests are still 0/0.",
      dealId: "vertical-category-pilot",
    },
    {
      id: "zoho-invoice-small-business",
      name: "Zoho Invoice",
      vertical: "small-business-paperwork-sponsors",
      category: "Small-business invoicing",
      website: "https://www.zoho.com/invoice/",
      contactUrl: "https://www.zoho.com/contactus.html",
      fitReason: "Zoho Invoice targets small businesses that need invoices, estimates, payments, and client records.",
      validationSignal: "Current validation snapshot: invoice-generator has 2 PDF downloads, sitewide sponsor intent is 2, and sponsor leads/invoice requests are still 0/0.",
      dealId: "guide-sponsor-pilot",
    },
    {
      id: "educationcom-worksheets",
      name: "Education.com",
      vertical: "classroom-printable-sponsors",
      category: "Worksheets and learning resources",
      website: "https://www.education.com/",
      contactUrl: "https://www.education.com/contact-us/",
      fitReason: "Education.com publishes worksheets and learning resources, matching name tracing, flashcards, classroom labels, and printable routine pages.",
      dealId: "vertical-category-pilot",
    },
    {
      id: "twinkl-teacher-resources",
      name: "Twinkl",
      vertical: "classroom-printable-sponsors",
      category: "Teacher resources",
      website: "https://www.twinkl.com/",
      contactUrl: "https://www.twinkl.com/contact",
      fitReason: "Twinkl's teacher-resource catalog fits visitors making classroom printables, labels, worksheets, and routine charts.",
      dealId: "guide-sponsor-pilot",
    },
  ];
  const sponsorCallActions = [
    {
      title: "Sponsor a relevant guide",
      audience: "PDF, image, QR, resume, classroom, or small-business workflow products.",
      url: "/sponsor/?utm_source=sponsor-call&utm_medium=organic&utm_campaign=sponsor_call&utm_content=guide-sponsor",
      signal: "A qualified sponsor lead submits audience fit and budget range through the site form.",
    },
    {
      title: "Request a starter fit review",
      audience: "Early partners who want a quick policy-fit review before discussing copy.",
      url: "/sponsor-starter-review/?utm_source=sponsor-call&utm_medium=organic&utm_campaign=sponsor_call&utm_content=starter-review",
      signal: "A business asks for the USD 49 exploratory review or a no-cash partner test.",
    },
    {
      title: "Use a vertical sponsor page",
      audience: "Partners who care about one audience: QR/local marketing, resume, classroom, small business, or file workflow SaaS.",
      url: "/sponsor/pdf-image-qr-saas/?utm_source=sponsor-call&utm_medium=organic&utm_campaign=sponsor_call&utm_content=vertical-pages",
      signal: "A sponsor lead arrives with sponsor-call attribution and a vertical path.",
    },
  ];

  function route() {
    const hash = window.location.hash.startsWith("#/") ? window.location.hash.replace(/^#\/?/, "") : "";
    const path = hash || window.location.pathname.replace(/^\/+|\/+$/g, "");
    const parts = path.split("/").filter(Boolean);
    setInternalRouteChrome(parts[0] === "dashboard" || parts[0] === "ops");
    if (!parts.length) return renderHome();
    if (parts[0] === "tools" && !parts[1]) return renderToolsIndex();
    if (parts[0] === "tools" && tools[parts[1]]) return renderTool(parts[1]);
    if (parts[0] === "guides" && !parts[1]) return renderGuides();
    if (parts[0] === "guides" && parts[1]) return renderGuide(parts[1]);
    if (parts[0] === "free-pdf-tools") return renderFreePdfTools();
    if (parts[0] === "pdf-tool-finder") return renderPdfToolFinder();
    if (parts[0] === "submit-directory") return renderDirectorySubmissionPack();
    if (parts[0] === "share-kit") return renderShareKit();
    if (parts[0] === "sponsor-starter-review") return renderSponsorStarterReviewPage();
    if (parts[0] === "sponsor-proposal") return renderSponsorProposalPage();
    if (parts[0] === "sponsor-deal-room") return renderSponsorDealRoomPage();
    if (parts[0] === "sponsor-call") return renderSponsorCallPage();
    if (parts[0] === "sponsor-opportunities") return renderSponsorOpportunitiesPage();
    if (parts[0] === "sponsor" && parts[1]) {
      const vertical = sponsorVerticals.find((item) => item.slug === parts[1]);
      if (vertical) return renderSponsorVerticalPage(vertical);
    }
    if (parts[0] === "sponsor") return renderSponsorPage();
    if (parts[0] === "local-seller-starter-kit") return renderLocalSellerStarterKit();
    if (parts[0] === "custom-local-print-pack") return renderCustomLocalPrintPackService();
    if (parts[0] === "invoice-followup-copy-pack") return renderInvoiceFollowupCopyPackService();
    if (parts[0] === "market-table-print-audit") return renderMarketTablePrintAudit();
    if (parts[0] === "custom-local-print-pack-sales-pack") return renderServiceSalesPack();
    if (landingPagesBySlug[parts[0]]) return renderLandingPage(parts[0]);
    if (parts[0] === "dashboard") return renderDashboard();
    if (parts[0] === "ops") return renderOpsMonitor();
    if (pages[parts[0]]) return renderStaticPage(parts[0]);
    return renderNotFound();
  }

  function setMeta(title, description) {
    document.title = `${title} - ${SITE.name}`;
    setMetaTag("description", description);
    setMetaProperty("og:title", title);
    setMetaProperty("og:description", description);
    setJsonLd(null);
    track("page_view", { path: getCurrentRoutePath() });
    window.scrollTo(0, 0);
    app.focus({ preventScroll: true });
    setTimeout(initAuditRequestBuilders, 0);
    setTimeout(initServiceRequestCopies, 0);
    setTimeout(initServiceLeadForms, 0);
    setTimeout(initUploadLimitHelpers, 0);
    setTimeout(pushVisibleAds, 0);
  }

  function setInternalRouteChrome(isInternal) {
    document.body.classList.toggle("internal-route", Boolean(isInternal));
  }

  function setMetaTag(name, content) {
    const el = document.querySelector(`meta[name="${name}"]`);
    if (el) el.setAttribute("content", content);
  }

  function setMetaProperty(property, content) {
    const el = document.querySelector(`meta[property="${property}"]`);
    if (el) el.setAttribute("content", content);
  }

  function setJsonLd(payload) {
    let el = document.getElementById("ptl-jsonld");
    if (!payload) {
      if (el) el.remove();
      return;
    }
    if (!el) {
      el = document.createElement("script");
      el.id = "ptl-jsonld";
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(payload);
  }

  function renderHome() {
    const toolCount = toolOrder.length;
    const guideCount = guides.length;
    setMeta("Free Printable PDF, Image, and QR Tools", "Create image-to-PDF conversions, text, Markdown, CSV, and JSON PDF exports, static QR codes, WiFi QR signs, contact QR codes, invoices, receipts, labels, resumes, worksheets, charts, and planners as free browser files.");
    app.innerHTML = `
      <section class="shell hero">
        <div>
          <h1>Make useful PDF, image, and QR files in under a minute.</h1>
          <p>Free browser-based generators for PDF compression, passport photos, image compression, image resizing, image format conversion, QR codes, WiFi QR signs, contact QR codes, PDF edits, text-to-PDF, Markdown-to-PDF, CSV-to-PDF, JSON-to-PDF, invoices, receipts, labels, business cards, flyers, coupons, timesheets, resumes, certificates, worksheets, sign-in sheets, graph paper, checklists, and planners. No account, no surprise download fee.</p>
          <div class="hero-actions">
            <a class="button" href="/free-pdf-tools/">Browse free file tools</a>
            <a class="button secondary" href="/tools/invoice-generator/">Create an invoice</a>
            <a class="button ghost" href="/upload-limit-fixer/">Fix upload limits</a>
          </div>
          <div class="hero-proof" aria-label="Launch validation goals">
            <div class="proof-tile"><strong>${toolCount}</strong><span>high-frequency tools</span></div>
            <div class="proof-tile"><strong>5/day</strong><span>free generations</span></div>
            <div class="proof-tile"><strong>${guideCount}</strong><span>SEO-ready guides</span></div>
          </div>
        </div>
        <div class="hero-preview" aria-hidden="true">
          <picture class="hero-image">
            <source srcset="/assets/images/hero-printable-workspace-small.webp" media="(max-width: 680px)">
            <img src="/assets/images/hero-printable-workspace-web.webp" alt="">
          </picture>
        </div>
      </section>
      <section class="shell section">
        <div class="section-head">
          <div>
            <h2>Popular printable searches</h2>
            <p>Quick entry points for the long-tail searches this site is built around.</p>
          </div>
        </div>
        <div class="cluster-links">${landingPages.map((page) => `<a href="/${page.slug}/">${escapeHtml(page.headline)}</a>`).join("")}</div>
        <div class="grid-2">${keywordClusters.map(keywordClusterCard).join("")}</div>
      </section>
      ${renderUploadLimitShortcuts()}
      <section class="shell section">
        <h2>Ad-supported free tool validation</h2>
        <div class="grid-2">
          <article class="panel">
            <h3>Free tools first</h3>
            <p>The site earns attention by solving useful file jobs: compressing PDFs and images, fixing upload limits, making QR codes, and creating simple business paperwork without signup.</p>
            <p><a class="button" href="/free-pdf-tools/">Browse free tools</a> <a class="button secondary" href="/upload-limit-fixer/">Open upload limit fixer</a></p>
          </article>
          <article class="panel">
            <h3>Ad safety gate</h3>
            <p>Ads are off during validation. When enabled, they must stay away from generator controls, never block downloads, and never ask visitors to click or interact with ads for access.</p>
          </article>
        </div>
      </section>
      <section class="shell section">
        <div class="section-head">
          <div>
            <h2>Free file and printable tools</h2>
            <p>Each tool creates a useful PDF, image, or QR file in your browser. The free version prioritizes clean exports, no account wall, and no ad interaction requirement so visitors have a real reason to return.</p>
          </div>
          <a class="button ghost" href="/share-kit/">Share kit</a>
        </div>
        <div class="grid-3">${toolOrder.map((id) => toolCard(tools[id])).join("")}</div>
      </section>
      <section class="shell section">
        <div class="section-head">
          <div>
            <h2>Built for cautious monetization</h2>
            <p>The site keeps the free tools useful while preparing for responsible display ads. Ads stay disabled until content quality, traffic, and policy readiness are stronger.</p>
          </div>
        </div>
        <div class="grid-3">
          <div class="panel"><h3>Original content</h3><p>Guide pages explain practical use cases instead of relying on empty generator pages.</p></div>
          <div class="panel"><h3>Ad-safe placement</h3><p>Future ad units must stay outside the editing and download path.</p></div>
          <div class="panel"><h3>Zero server cost</h3><p>PDF generation, daily limits, and validation events work locally in the browser.</p></div>
        </div>
      </section>
      <section class="shell section">
        <div class="section-head">
          <div>
            <h2>Fresh guides</h2>
            <p>Search-friendly pages that support real user intent and future AdSense review.</p>
          </div>
          <a href="/guides/">All guides</a>
        </div>
        <div class="grid-3">${guides.slice(0, 6).map(guideCard).join("")}</div>
      </section>
    `;
  }

  function toolCard(tool) {
    return `
      <article class="tool-card">
        <span class="icon" aria-hidden="true">${escapeHtml(tool.icon)}</span>
        <h3>${escapeHtml(tool.title)}</h3>
        <p>${escapeHtml(tool.description)}</p>
        <div class="meta">${tool.keywords.map((k) => `<span class="tag">${escapeHtml(k)}</span>`).join("")}</div>
        <a class="button" href="/tools/${tool.id}/">Open generator</a>
      </article>
    `;
  }

  function renderToolsIndex() {
    setMeta("Free PDF, Image, and QR Tools", "Browse free browser PDF, image, and QR tools for compression, resizing, format conversion, QR codes, PDF edits, text conversion, business paperwork, work orders, packing slips, inventory sheets, local promotion printables, labels, career documents, calendars, meal planning, certificates, checklists, worksheets, and classroom routines.");
    app.innerHTML = `
      <section class="shell page-title section">
        <h1>Free PDF, image, and QR tools</h1>
        <p>Choose a browser-based generator for business paperwork, work orders, packing slips, inventory sheets, job applications, image compression, resizing, format conversion, QR codes, PDF editing, text conversion, planning pages, classroom printables, event certificates, checklists, and family routines. Each tool creates a practical PDF, image, or QR file without requiring an account.</p>
      </section>
      <section class="shell section">
        <div class="section-head">
          <div>
            <h2>Tools by use case</h2>
            <p>Start with the problem you need to solve, then open the matching generator.</p>
          </div>
        </div>
        <div class="grid-2">${keywordClusters.map(keywordClusterCard).join("")}</div>
      </section>
      <section class="shell section">
        <div class="section-head">
          <div>
            <h2>All generators</h2>
            <p>All tools run in the browser and are designed for fast, practical exports. Image, PDF, and static QR processing stays local where the tool says no upload.</p>
          </div>
        </div>
        <div class="grid-3">${toolOrder.map((id) => toolCard(tools[id])).join("")}</div>
      </section>
    `;
  }

  function renderFreePdfTools() {
    setMeta("Free PDF, Image, and QR Tools Without Signup", "Start with free browser PDF, image, and QR tools for compression, resizing, format conversion, QR codes, image-to-PDF, text-to-PDF, invoices, receipts, work orders, packing slips, inventory sheets, timesheets, certificates, checklists, and printable pages.");
    setJsonLd({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Free PDF, Image, and QR Tools Without Signup",
      url: `${CONFIG.siteUrl.replace(/\/$/, "")}/free-pdf-tools/`,
      description: "Free no-signup browser PDF, image, and QR tools for conversion, business paperwork, career documents, and printable planning pages.",
      hasPart: toolOrder.map((id) => ({
        "@type": "SoftwareApplication",
        name: tools[id].title,
        url: `${CONFIG.siteUrl.replace(/\/$/, "")}/tools/${id}/`,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      })),
    });
    app.innerHTML = `
      <section class="shell page-title section">
        <h1>Free PDF, image, and QR tools without signup</h1>
        <p>Open a browser-based generator, edit the sample fields, and download a practical PDF, image, or QR file. No account, no surprise download fee, and no ad interaction requirement.</p>
      </section>
      <section class="shell section">
        <div class="section-head">
          <div>
            <h2>Start with the file job</h2>
            <p>These groups target high-intent searches where users usually want a file immediately.</p>
          </div>
        </div>
        <div class="grid-3">
          ${freePdfToolGroups.map(freePdfToolGroupCard).join("")}
        </div>
      </section>
      ${renderUploadLimitShortcuts()}
      <section class="shell section">
        <div class="section-head">
          <div>
            <h2>Why the tools are free</h2>
            <p>The validation version measures downloads, Search Console visibility, and anonymous usage counters before enabling responsible advertising or paid features.</p>
          </div>
        </div>
        <div class="grid-3">
          <div class="panel"><h3>No account wall</h3><p>Users can generate and download useful files without creating an account, which keeps the first visit lightweight.</p></div>
          <div class="panel"><h3>No ad interaction gate</h3><p>Ads, once approved, should sit away from generator controls and never become a condition for downloading.</p></div>
          <div class="panel"><h3>Local-first tools</h3><p>Image and PDF processing stays in the browser where marked no-upload. For privacy-sensitive documents, users should avoid entering unnecessary personal details.</p></div>
        </div>
      </section>
      <section class="shell section">
        <div class="section-head">
          <div>
            <h2>All free generators</h2>
            <p>Use this full list when you know the document type you need.</p>
          </div>
        </div>
        <div class="grid-3">${toolOrder.map((id) => toolCard(tools[id])).join("")}</div>
      </section>
    `;
  }

  function freePdfToolGroupCard(group) {
    return `
      <article class="panel keyword-cluster">
        <h3>${escapeHtml(group.title)}</h3>
        <p>${escapeHtml(group.description)}</p>
        <div class="cluster-links">
          ${group.links.map((id) => `<a href="/tools/${id}/">${escapeHtml(tools[id].title)}</a>`).join("")}
        </div>
      </article>
    `;
  }

  function renderRetiredPaidExperiment(slug) {
    const labels = {
      "local-seller-starter-kit": "Retired seller kit experiment",
      "custom-local-print-pack": "Retired custom print pack experiment",
      "market-table-print-audit": "Retired print audit experiment",
      "custom-local-print-pack-sales-pack": "Retired service sales pack experiment",
    };
    const title = labels[slug] || "Retired payment experiment";
    setMeta(`${title} retired`, "This older payment experiment is retired from the public site. PrintableTools Lab is now focused on free no-signup tools and future ad-supported monetization.");
    setMetaTag("robots", "noindex,follow");
    app.innerHTML = `
      <section class="shell page-title section">
        <a href="/free-pdf-tools/">Free tools</a>
        <h1>${escapeHtml(title)} has been retired</h1>
        <p>This older direct-payment experiment is no longer part of the public product path. PrintableTools Lab is staying free for visitors and is being validated for responsible display ads later.</p>
        <div class="hero-actions">
          <a class="button" href="/free-pdf-tools/">Browse free tools</a>
          <a class="button secondary" href="/upload-limit-fixer/">Fix upload limits</a>
          <a class="button ghost" href="/tools/">All tools</a>
        </div>
        <p class="notice">No payment is collected here. Current monetization work is traffic, usage depth, ad policy readiness, and future ad-network payout.</p>
      </section>
      <section class="shell section">
        <h2>Use these instead</h2>
        <div class="grid-3">
          <article class="tool-card"><h3>Upload limit fixer</h3><p>Route PDF, image, JPG, PNG, and photo-size upload errors to the matching free no-signup tool.</p><a class="button" href="/upload-limit-fixer/">Open fixer</a></article>
          <article class="tool-card"><h3>Free PDF, image, and QR tools</h3><p>Browse no-signup generators for compression, conversion, QR codes, invoices, receipts, labels, resumes, and printable pages.</p><a class="button" href="/free-pdf-tools/">Browse tools</a></article>
          <article class="tool-card"><h3>Directory submission pack</h3><p>Review the public facts used for free-tool directory listings and organic discovery.</p><a class="button" href="/submit-directory/">Open pack</a></article>
        </div>
      </section>
    `;
  }

  function renderPdfToolFinder() {
    setMeta("Which Free PDF, Image, or QR Tool Should I Use?", "Find the right free PDF, image, or QR tool for compression, resizing, format conversion, QR codes, images, text, invoices, receipts, timesheets, resumes, certificates, checklists, graph paper, and event sheets.");
    setJsonLd({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Which Free PDF, Image, or QR Tool Should I Use?",
      url: `${CONFIG.siteUrl.replace(/\/$/, "")}/pdf-tool-finder/`,
      description: "A practical finder for choosing the right free PDF, image, or QR generator by task.",
    });
    app.innerHTML = `
      <section class="shell page-title section">
        <h1>Which free PDF, image, or QR tool should I use?</h1>
        <p>Start with the job, not the template name. This finder points you to the free browser PDF, image, or QR tool that best matches the file you need right now.</p>
      </section>
      <section class="shell section">
        <div class="section-head">
          <div>
            <h2>Quick file and QR tool finder</h2>
            <p>Pick the row that sounds closest to your task.</p>
          </div>
        </div>
        <table class="event-table">
          <thead><tr><th>What you need</th><th>Use this tool</th><th>Why it fits</th></tr></thead>
          <tbody>
            ${toolFinderRows.map((row) => `
              <tr>
                <td>${escapeHtml(row.need)}</td>
                <td><a href="/tools/${row.tool}/">${escapeHtml(tools[row.tool].title)}</a></td>
                <td>${escapeHtml(row.why)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </section>
      <section class="shell section">
        <div class="grid-2">
          <article class="panel">
            <h3>Compress vs resize vs convert</h3>
            <p>Compress when the file is too large. Resize when dimensions are wrong. Convert when the file type is rejected.</p>
            <p><a class="button" href="/tools/compress-image/">Compress image</a> <a class="button secondary" href="/tools/resize-image/">Resize image</a></p>
          </article>
          <article class="panel">
            <h3>Invoice vs receipt</h3>
            <p>Use an invoice when you are asking someone to pay. Use a receipt when payment has already happened and you need a record.</p>
            <p><a class="button" href="/tools/invoice-generator/">Create an invoice</a> <a class="button secondary" href="/tools/receipt-generator/">Create a receipt</a></p>
          </article>
          <article class="panel">
            <h3>One image vs many images</h3>
            <p>Use the one-page image converter when layout matters on a single sheet. Use multiple images to PDF when each image should become its own page.</p>
            <p><a class="button" href="/tools/image-to-pdf/">One image PDF</a> <a class="button secondary" href="/tools/multi-image-pdf/">Multi-page PDF</a></p>
          </article>
        </div>
      </section>
      <section class="shell section">
        <h2>Browse all tools</h2>
        <div class="cluster-links">
          ${toolOrder.map((id) => `<a href="/tools/${id}/">${escapeHtml(tools[id].title)}</a>`).join("")}
        </div>
      </section>
      <section class="shell section">
        <h2>Free tool limits</h2>
        <p>The tools are designed for fast practical exports and simple records. They do not replace legal, tax, accounting, or employment advice. Review every file before sending, uploading, or printing it.</p>
        <p>Ads are disabled during validation and should never be used as a condition for downloading a PDF or image file.</p>
      </section>
    `;
  }

  function renderDirectorySubmissionPack() {
    const primaryToolIds = [
      "image-to-pdf",
      "multi-image-pdf",
      "pdf-to-images",
      "pdf-to-text",
      "compress-image",
      "resize-image",
      "convert-image",
      "signature-png",
      "qr-code",
      "wifi-qr-code",
      "vcard-qr-code",
      "text-to-pdf",
      "invoice-generator",
      "receipt-generator",
      "packing-slip",
      "work-order",
      "inventory-sheet",
      "resume-builder",
      "ats-resume-checker",
      "certificate-generator",
    ];
    const directoryFields = [
      ["Product name", "PrintableTools Lab"],
      ["URL", absoluteUrl("/")],
      ["Category", "Files, Productivity, PDF Tools, QR Tools, Document Tools, Small Business Tools"],
      ["Pricing", "Free"],
      ["Tagline", "Free no-signup browser PDF, image, and QR tools"],
      ["Short description", "Create practical PDFs, image files, and static QR codes in the browser, including image compression, image resizing, image format conversion, QR codes, WiFi QR signs, contact QR codes, image-to-PDF, invoices, receipts, work orders, packing slips, inventory sheets, labels, resumes, certificates, and printable tools."],
    ];
    setMeta("PrintableTools Lab Directory Submission Pack", "Copy-ready directory submission details, screenshots, core links, and compliance notes for listing PrintableTools Lab as a free no-signup PDF, image, and QR tool site.");
    setJsonLd({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "PrintableTools Lab representative free PDF, image, and QR tools",
      itemListElement: primaryToolIds.map((id, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${CONFIG.siteUrl.replace(/\/$/, "")}/tools/${id}/`,
        name: tools[id].title,
      })),
    });
    app.innerHTML = `
      <section class="shell page-title section">
        <a href="/free-pdf-tools/">Free file tools</a>
        <h1>PrintableTools Lab directory submission pack</h1>
        <p>This page gives directory editors, community moderators, and launch-listing reviewers the exact facts needed to evaluate PrintableTools Lab as a free no-signup PDF, image, and QR tool collection.</p>
      </section>
      <section class="shell section">
        <h2>Copy-ready listing details</h2>
        <table class="event-table">
          <tbody>
            ${directoryFields.map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join("")}
          </tbody>
        </table>
      </section>
      <section class="shell section">
        <h2>Review notes</h2>
        <div class="grid-3">
          <article class="panel"><h3>No signup</h3><p>Core file tools open directly in the browser and do not require an account before export.</p></article>
          <article class="panel"><h3>Free export</h3><p>The validation version keeps PDF, image, and QR downloads free and avoids surprise checkout screens.</p></article>
          <article class="panel"><h3>Ad-safe</h3><p>Ads are disabled during validation and downloads are not gated behind ad interactions or ad impressions.</p></article>
        </div>
      </section>
      <section class="shell section">
        <h2>Primary links for reviewers</h2>
        <div class="cluster-links">
          <a href="/free-pdf-tools/">Free file tools directory</a>
          <a href="/pdf-tool-finder/">File tool finder</a>
          <a href="/tools/">All tools</a>
          <a href="/tools.json">Machine-readable tools.json</a>
          <a href="/feed.xml">RSS feed</a>
          <a href="/llms.txt">llms.txt</a>
        </div>
      </section>
      <section class="shell section">
        <h2>Representative tools</h2>
        <div class="grid-2">
          ${primaryToolIds.map((id) => `<article class="tool-card"><h3>${escapeHtml(tools[id].title)}</h3><p>${escapeHtml(tools[id].description)}</p><a class="button" href="/tools/${id}/">Open generator</a></article>`).join("")}
        </div>
      </section>
      <section class="shell section">
        <h2>Assets</h2>
        <p>Use the icon and screenshot below for directory review. They are provided to make free-tool submissions easier to verify without inventing claims.</p>
        <div class="grid-2">
          <article class="panel"><h3>Icon</h3><p><a href="/assets/images/app-icon-512.png">512px PNG app icon</a></p></article>
          <article class="panel"><h3>Screenshot</h3><p><a href="/assets/images/free-pdf-tools-screenshot.png">Free file tools page screenshot</a></p></article>
        </div>
      </section>
    `;
  }

  function renderShareKit() {
    const featuredLinks = [
      ["Upload limit fixer", "/upload-limit-fixer/?utm_source=share-kit&utm_medium=organic", "Task-first entry for users blocked by file size, format, or photo dimension limits."],
      ["Image size reducer in KB", "/image-size-reducer-in-kb/?utm_source=share-kit&utm_medium=organic", "Hub for exact image and photo file-size limits from 10KB to 500KB."],
      ["PDF size reducer", "/pdf-size-reducer/?utm_source=share-kit&utm_medium=organic", "Hub for exact PDF upload limits including 500KB, 1MB, 2MB, and 5MB."],
      ["Compress image to 20KB", "/compress-image-to-20kb/?utm_source=share-kit&utm_medium=organic", "Strict exam, profile, and application photo size limit intent."],
      ["Fix passport photo size", "/passport-photo-size-fixer/?utm_source=share-kit&utm_medium=organic", "Urgent ID-style photo crop, resize, and file-size workflow."],
      ["Compress PDF to 1MB", "/compress-pdf-to-1mb/?utm_source=share-kit&utm_medium=organic", "Urgent upload-limit search for job, school, email, and portal PDFs."],
      ["Compress PDF to 500KB", "/compress-pdf-to-500kb/?utm_source=share-kit&utm_medium=organic", "Strict form and government-style upload limit intent."],
      ["Compress image to 100KB", "/compress-image-to-100kb/?utm_source=share-kit&utm_medium=organic", "Common profile, exam, job, and form image-size limit."],
      ["Compress image to 50KB", "/compress-image-to-50kb/?utm_source=share-kit&utm_medium=organic", "Severe image upload limit for small photos and documents."],
      ["PDF to JPG without upload", "/pdf-to-jpg-no-upload/?utm_source=share-kit&utm_medium=organic", "Works when a form accepts image files but rejects PDF."],
      ["Remove background without upload", "/remove-background-no-upload/?utm_source=share-kit&utm_medium=organic", "Simple transparent PNG workflow for product photos, logos, and signatures."],
      ["Free QR code generator", "/free-qr-code-generator-no-signup/?utm_source=share-kit&utm_medium=organic", "Fast static QR code for signs, menus, flyers, and labels."],
      ["Free invoice generator", "/free-invoice-generator-no-signup/?utm_source=share-kit&utm_medium=organic", "Small-business PDF document with no signup and no hidden export fee."],
    ];
    const posts = [
      ["Fix a blocked upload", "File upload rejected for size, format, or photo dimensions?", "Start with the upload limit fixer. It points to the no-upload PDF compressor, image-to-KB compressor, image resizer, passport photo cropper, PDF-to-JPG converter, and image-to-PDF tools.", "/upload-limit-fixer/?utm_source=short-video&utm_medium=organic", "Fix an upload limit"],
      ["Exam photo under 20KB", "Application photo must be under 20KB?", "Use the no-upload image-to-KB compressor with the 20KB target, then review the downloaded JPG before submitting it to the exam, school, or application portal.", "/compress-image-to-20kb/?utm_source=short-video&utm_medium=organic", "Compress an image to 20KB"],
      ["Fix an ID photo size", "Photo rejected for dimensions or file size?", "Start with the passport photo size fixer. It points to the local crop, resize, and image-to-KB tools so the file can match a portal's photo rules without uploading the original.", "/passport-photo-size-fixer/?utm_source=short-video&utm_medium=organic", "Fix a passport-style photo"],
      ["Upload limit fix: PDF under 1MB", "Portal says your PDF must be under 1MB?", "Open the no-upload PDF compressor, choose the 1MB target, select your PDF, and download a smaller copy from the browser. It works best for scans and image-heavy PDFs.", "/compress-pdf-to-1mb/?utm_source=short-video&utm_medium=organic", "Try the free 1MB PDF compressor"],
      ["Image under 100KB", "Job form rejecting your photo because it is over 100KB?", "Use the local image-to-KB compressor, pick 100KB, and download a smaller JPG or WebP without uploading the original photo.", "/compress-image-to-100kb/?utm_source=short-video&utm_medium=organic", "Compress an image to 100KB"],
      ["No-upload file utility pack", "I made a free no-signup file utility site for common upload blockers.", "It handles PDF compression targets, image-to-KB targets, PDF-to-JPG, image resizing, QR codes, invoices, labels, and small business PDFs in the browser. Downloads are free during validation and not gated behind ad interactions.", "/free-pdf-tools/?utm_source=community&utm_medium=organic", "Open the free file tools"],
      ["Directory listing blurb", "Free browser PDF, image, and QR tools without signup.", "PrintableTools Lab helps users create and edit practical files locally: compress PDFs to target sizes, compress images to KB limits, convert PDF pages to JPG, resize and convert images, make static QR codes, and generate everyday PDFs.", "/submit-directory/?utm_source=directory&utm_medium=organic", "Open the directory pack"],
    ];
    const rules = [
      "Post only where free tools or file utilities are relevant to the community.",
      "Do not ask for ad interactions, ad impressions, upvotes, or artificial engagement.",
      "Do not claim guaranteed compression results; say the tool tries toward a target and users should review the output.",
      "Do not post private documents, IDs, payment details, or user files in examples.",
      "Use UTM source labels so the live metrics can separate directory, community, video, and social tests.",
    ];
    const uploadErrorCheatsheet = [
      ["PDF must be under 1MB", "/file-must-be-less-than-1mb/?utm_source=share-kit&utm_medium=organic&utm_campaign=upload_error_cheatsheet", "Open the PDF compressor with the 1MB target."],
      ["PDF must be under 500KB", "/pdf-must-be-under-500kb/?utm_source=share-kit&utm_medium=organic&utm_campaign=upload_error_cheatsheet", "Use the strict 500KB PDF target."],
      ["Image must be less than 2MB", "/image-must-be-less-than-2mb/?utm_source=share-kit&utm_medium=organic&utm_campaign=upload_error_cheatsheet", "Use the image-to-KB compressor with a 2048KB target."],
      ["Image must be under 500KB", "/image-must-be-under-500kb/?utm_source=share-kit&utm_medium=organic&utm_campaign=upload_error_cheatsheet", "Use the 500KB image target."],
      ["Photo must be under 100KB", "/photo-must-be-under-100kb/?utm_source=share-kit&utm_medium=organic&utm_campaign=upload_error_cheatsheet", "Use the 100KB image target and review clarity."],
      ["JPG must be under 200KB", "/jpg-must-be-under-200kb/?utm_source=share-kit&utm_medium=organic&utm_campaign=upload_error_cheatsheet", "Use the 200KB image target and keep output as JPG."],
      ["PNG screenshot too large", "/png-screenshot-too-large/?utm_source=share-kit&utm_medium=organic&utm_campaign=upload_error_cheatsheet", "Crop private areas, then compress toward 500KB."],
      ["Invalid file type. Please upload JPG or PNG", "/invalid-file-type-jpg-png/?utm_source=share-kit&utm_medium=organic&utm_campaign=upload_error_cheatsheet", "Convert the image format locally."],
      ["Image dimensions must be 600 x 600 px", "/image-dimensions-600x600/?utm_source=share-kit&utm_medium=organic&utm_campaign=upload_error_cheatsheet", "Resize or crop to exact dimensions."],
      ["PDF not accepted, JPG required", "/pdf-not-accepted-jpg-required/?utm_source=share-kit&utm_medium=organic&utm_campaign=upload_error_cheatsheet", "Convert PDF pages to image files locally."],
      ["Resume PDF too large", "/resume-pdf-too-large/?utm_source=share-kit&utm_medium=organic&utm_campaign=upload_error_cheatsheet", "Try the 1MB PDF target and review readability."],
      ["Email attachment too large", "/email-attachment-too-large/?utm_source=share-kit&utm_medium=organic&utm_campaign=upload_error_cheatsheet", "Compress PDFs toward 5MB or compress image attachments."],
    ];
    const sponsorDiscoveryLinks = [
      ["Public sponsor call", "/sponsor-call/?utm_source=sponsor-outreach&utm_medium=organic&utm_campaign=sponsor_call&utm_content=share-kit", "Open invitation for policy-fit sponsors and partners to use the sponsor form instead of private outreach."],
      ["Sponsor inquiry form", "/sponsor/?utm_source=sponsor-outreach&utm_medium=organic&utm_campaign=sponsor_call&utm_content=share-kit#sponsor-inquiry", "Manual intake for labeled guide sponsorship, starter review, and partner distribution inquiries."],
      ["Sponsor call JSON", "/sponsor-call.json", "Machine-readable sponsor openings, reply path, vertical pages, and success gate."],
      ["Sponsor media kit JSON", "/sponsor-media-kit.json", "Public facts, placement rules, vertical fits, and safety constraints for partners."],
    ];
    const videoAssets = [
      ["Compress PDF to 1MB", "https://github.com/yanqr213/printable-tools-lab/releases/download/free-pdf-tools/ptl-pdf-under-1mb.mp4", "/compress-pdf-to-1mb/?utm_source=short-video&utm_medium=organic&utm_campaign=zero_cost_push&utm_content=pdf-under-1mb"],
      ["Compress PDF to 500KB", "https://github.com/yanqr213/printable-tools-lab/releases/download/free-pdf-tools/ptl-pdf-under-500kb.mp4", "/compress-pdf-to-500kb/?utm_source=community&utm_medium=organic&utm_campaign=zero_cost_push&utm_content=pdf-under-500kb"],
      ["Compress Image to 100KB", "https://github.com/yanqr213/printable-tools-lab/releases/download/free-pdf-tools/ptl-image-under-100kb.mp4", "/compress-image-to-100kb/?utm_source=short-video&utm_medium=organic&utm_campaign=zero_cost_push&utm_content=image-under-100kb"],
      ["Compress Image to 50KB", "https://github.com/yanqr213/printable-tools-lab/releases/download/free-pdf-tools/ptl-image-under-50kb.mp4", "/compress-image-to-50kb/?utm_source=community&utm_medium=organic&utm_campaign=zero_cost_push&utm_content=image-under-50kb"],
      ["PDF to JPG Without Upload", "https://github.com/yanqr213/printable-tools-lab/releases/download/free-pdf-tools/ptl-pdf-to-jpg-no-upload.mp4", "/pdf-to-jpg-no-upload/?utm_source=short-video&utm_medium=organic&utm_campaign=zero_cost_push&utm_content=pdf-to-jpg-no-upload"],
      ["Remove Background Without Upload", "https://github.com/yanqr213/printable-tools-lab/releases/download/free-pdf-tools/ptl-background-removal.mp4", "/remove-background-no-upload/?utm_source=community&utm_medium=organic&utm_campaign=zero_cost_push&utm_content=background-removal"],
    ];
    const gistUrl = "https://gist.github.com/yanqr213/fd9cbd597802dd7343fcfa1834e0beeb";
    const growthIssueUrl = "https://github.com/yanqr213/printable-tools-lab/issues/1";
    setMeta("PrintableTools Lab Share Kit", "Copy-ready short-video hooks, community posts, directory blurbs, campaign links, and compliance rules for sharing PrintableTools Lab without paid ads.");
    setJsonLd({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "PrintableTools Lab share kit priority links",
      itemListElement: featuredLinks.map(([title, href], index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: title,
        url: absoluteUrl(href.split("?")[0]),
      })),
    });
    app.innerHTML = `
      <section class="shell page-title section">
        <a href="/submit-directory/">Directory pack</a>
        <h1>PrintableTools Lab share kit</h1>
        <p>Copy-ready zero-budget distribution assets for sharing the free PDF, image, and QR tools through directories, useful community replies, short videos, and launch updates.</p>
      </section>
      <section class="shell section">
        <h2>Priority links</h2>
        <p>These links point to high-intent pages where visitors usually have an immediate blocked upload, document, or file-format problem.</p>
        <table class="event-table">
          <thead><tr><th>Angle</th><th>Tracked URL</th><th>Why this can earn attention</th></tr></thead>
          <tbody>${featuredLinks.map(([title, href, reason]) => `<tr><td>${escapeHtml(title)}</td><td><a href="${href}">${escapeHtml(absoluteUrl(href))}</a></td><td>${escapeHtml(reason)}</td></tr>`).join("")}</tbody>
        </table>
      </section>
      <section class="shell section">
        <h2>Copy-ready posts</h2>
        <div class="grid-2">
          ${posts.map(([title, hook, body, href, cta]) => `<article class="panel"><h3>${escapeHtml(title)}</h3><p><strong>${escapeHtml(hook)}</strong></p><p>${escapeHtml(body)}</p><p><a href="${href}">${escapeHtml(cta)}</a></p></article>`).join("")}
        </div>
      </section>
      <section class="shell section">
        <h2>Upload error cheatsheet</h2>
        <p>This table is built for directory editors, community replies, support threads, and search crawlers that need exact upload-error wording with a direct free fix.</p>
        <table class="event-table">
          <thead><tr><th>Error</th><th>Tracked landing page</th><th>Fix</th></tr></thead>
          <tbody>${uploadErrorCheatsheet.map(([errorText, href, fix]) => `<tr><td>${escapeHtml(errorText)}</td><td><a href="${href}">${escapeHtml(absoluteUrl(href))}</a></td><td>${escapeHtml(fix)}</td></tr>`).join("")}</tbody>
        </table>
        <p><a class="button" href="/upload-error-cheatsheet/">Open upload error cheatsheet</a> <a class="button secondary" href="/upload-error-cheatsheet.json">Open upload-error JSON</a></p>
      </section>
      <section class="shell section">
        <h2>Sponsor and partner discovery</h2>
        <p>PrintableTools Lab is accepting a small number of manually reviewed sponsor and partner inquiries. Downloads stay free, placements must be labeled, and the site does not collect payment or private payout details.</p>
        <table class="event-table">
          <thead><tr><th>Partner path</th><th>Tracked URL</th><th>Fit</th></tr></thead>
          <tbody>${sponsorDiscoveryLinks.map(([title, href, reason]) => `<tr><td>${escapeHtml(title)}</td><td><a href="${href}">${escapeHtml(absoluteUrl(href))}</a></td><td>${escapeHtml(reason)}</td></tr>`).join("")}</tbody>
        </table>
      </section>
      <section class="shell section">
        <h2>Short video scripts</h2>
        <div class="grid-2">
          ${posts.slice(0, 2).map(([title, hook, body, , cta]) => `<article class="panel"><h3>${escapeHtml(title)}</h3><ol><li>${escapeHtml(hook)}</li><li>Show the source file being rejected or too large.</li><li>${escapeHtml(body)}</li><li>${escapeHtml(cta)}.</li></ol></article>`).join("")}
        </div>
      </section>
      <section class="shell section">
        <h2>Ready-to-upload MP4 assets</h2>
        <p>These silent 9:16 videos are published on the public GitHub release. Use them with the matching caption and tracked landing page; do not ask for ad interactions or imply guaranteed compression.</p>
        <div class="grid-2">
          ${videoAssets.map(([title, downloadUrl, trackedUrl]) => `<article class="panel"><h3>${escapeHtml(title)}</h3><p><a href="${downloadUrl}">Download MP4</a></p><p><a href="${trackedUrl}">Tracked landing page</a></p></article>`).join("")}
        </div>
      </section>
      <section class="shell section">
        <h2>Public Gist mirror</h2>
        <p>The same links, MP4 assets, copy angles, and safe posting rules are mirrored in a public GitHub Gist for one more zero-cost external discovery surface.</p>
        <p><a class="button" href="${gistUrl}">Open public Gist share kit</a></p>
      </section>
      <section class="shell section">
        <h2>Public GitHub growth issue</h2>
        <p>The open issue keeps the validation status, high-intent links, Gist mirror, release MP4 assets, and safety rules in one crawlable update thread.</p>
        <p><a class="button" href="${growthIssueUrl}">Open growth issue</a></p>
      </section>
      <section class="shell section">
        <h2>Rules for safe distribution</h2>
        <ul>${rules.map((rule) => `<li>${escapeHtml(rule)}</li>`).join("")}</ul>
        <p><a class="button" href="/share-kit.json">Open machine-readable share-kit.json</a> <a class="button secondary" href="/submit-directory/">Open directory submission pack</a></p>
      </section>
    `;
  }

  function renderLocalSellerStarterKit() {
    const checkoutUrl = CONFIG.sellerKitCheckoutUrl || CONFIG.checkoutUrl || "";
    const checkoutConfigured = Boolean(checkoutUrl);
    setMeta("Local Seller Starter Kit", "Request the $9 editable local seller starter kit sample and checkout link for price tags, coupon copy, QR sign wording, packing slips, and launch checklists.");
    setJsonLd({
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Local Seller Starter Kit",
      description: "Editable starter templates for small local selling workflows.",
      offers: { "@type": "Offer", price: "9", priceCurrency: "USD", availability: checkoutConfigured ? "https://schema.org/InStock" : "https://schema.org/PreOrder", url: checkoutUrl || absoluteUrl("/local-seller-starter-kit/") },
    });
    app.innerHTML = `
      <section class="shell page-title section product-hero">
        <a href="/tools/price-tag/">Price tag generator</a>
        <h1>Local Seller Starter Kit</h1>
        <p>A small editable template kit for market tables, pop-up sellers, service providers, and first-time local offers: price tags, coupon copy, QR sign wording, pickup notes, and a launch checklist.</p>
        <div class="hero-actions">
          <a class="button" data-track-event="${checkoutConfigured ? "seller_checkout_click" : "seller_checkout_intent"}" data-track-tool="local-seller-starter-kit" href="${escapeHtml(checkoutUrl || localSellerCheckoutRequestUrl())}" target="_blank" rel="noreferrer">${checkoutConfigured ? "Buy for $9" : "Request checkout link"}</a>
          <a class="button secondary" data-track-event="service_request_intent" data-track-tool="custom-local-print-pack" href="/custom-local-print-pack/?utm_source=seller-kit&utm_medium=site&utm_campaign=service_request">Want it assembled for you?</a>
          <a class="button ghost" href="/tools/price-tag/">Try the free tools first</a>
        </div>
        <p class="notice">${checkoutConfigured ? "Checkout is configured through an external payment provider. Revenue is real only after that provider shows a paid order or settled payment." : "No payment is collected on this site. Revenue is real only after a payment provider shows a paid order or settled payment."}</p>
        <div class="hero-proof" aria-label="Kit readiness">
          <div class="proof-tile"><strong>$9</strong><span>target kit price</span></div>
          <div class="proof-tile"><strong>editable</strong><span>templates</span></div>
          <div class="proof-tile"><strong>free</strong><span>tools remain free</span></div>
        </div>
      </section>
      ${renderServiceLeadForm({
        serviceType: "local-seller-starter-kit",
        title: "Request the checkout link",
        cta: "Send checkout request",
        intro: "Send a reply contact and one public-safe note. The kit remains a request path until a real external checkout link is available.",
        placeholder: "I want the starter kit for a market table, pop-up, service offer, or first local product launch.",
      })}
      <section class="shell section">
        <h2>Best for</h2>
        <div class="grid-3">
          <article class="panel"><h3>Market tables</h3><p>Use it for simple price tags, bundle notes, and a QR/contact sign.</p></article>
          <article class="panel"><h3>Local services</h3><p>Use it for a one-page offer, coupon wording, and pickup or booking notes.</p></article>
          <article class="panel"><h3>First offers</h3><p>Use it when you need practical print pieces before learning design software.</p></article>
        </div>
      </section>
      ${renderServiceUpgradeCta({ id: "local-seller-starter-kit" })}
    `;
  }

  function renderCustomLocalPrintPackService() {
    const checkoutUrl = CONFIG.serviceCheckoutUrl || CONFIG.customPrintPackCheckoutUrl || "";
    const checkoutConfigured = Boolean(checkoutUrl);
    const primaryServiceHref = checkoutConfigured ? checkoutUrl : "#service-request";
    const primaryServiceTarget = checkoutConfigured ? ' target="_blank" rel="noreferrer"' : "";
    setMeta("Custom Local Print Pack Setup", "Request a $29 done-for-you printable setup for price tags, flyer copy, QR sign wording, coupon ideas, packing notes, and a launch checklist.");
    setJsonLd({
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Custom Local Print Pack Setup",
      description: "A done-for-you printable starter pack setup for local sellers and small service providers.",
      offers: { "@type": "Offer", price: "29", priceCurrency: "USD", availability: checkoutConfigured ? "https://schema.org/InStock" : "https://schema.org/PreOrder", url: checkoutUrl || absoluteUrl("/custom-local-print-pack/") },
    });
    app.innerHTML = `
      <section class="shell page-title section product-hero">
        <a href="/tools/price-tag/">Free price tag generator</a>
        <h1>Custom Local Print Pack Setup</h1>
        <p>A $29 done-for-you setup for local sellers who want one simple printable pack assembled from their own items, prices, and contact link: price tag rows, flyer copy, QR sign wording, coupon ideas, packing or pickup notes, and a launch checklist.</p>
        <div class="hero-actions">
          <a class="button" data-track-event="${checkoutConfigured ? "service_checkout_click" : "service_request_intent"}" data-track-tool="custom-local-print-pack" href="${escapeHtml(primaryServiceHref)}"${primaryServiceTarget}>${checkoutConfigured ? "Buy setup for $29" : "Request free fit check"}</a>
          <a class="button secondary" data-track-event="audit_request_intent" data-track-tool="market-table-print-audit" href="/market-table-print-audit/?utm_source=service-page&utm_medium=site&utm_campaign=audit_request">Start with free audit</a>
          <button class="button ghost" type="button" data-copy-text="${escapeHtml(customLocalPrintPackRequestCopy())}" data-track-event="service_request_intent" data-track-tool="custom-local-print-pack">Copy request brief</button>
        </div>
        <p class="notice">${checkoutConfigured ? "Checkout is configured through an external payment provider. Revenue is still proven only after that provider shows a paid or settled order." : "Payment starts only after fit is confirmed and a real external checkout or invoice link is paid. Do not send card, bank, tax, identity, password, or customer-list data."}</p>
        <div class="hero-proof" aria-label="Service readiness">
          <div class="proof-tile"><strong>$29</strong><span>setup price</span></div>
          <div class="proof-tile"><strong>6</strong><span>deliverables</span></div>
          <div class="proof-tile"><strong>2 days</strong><span>target turnaround</span></div>
        </div>
      </section>
      ${renderServiceLeadForm({
        serviceType: "custom-local-print-pack",
        title: "Request a free setup fit check",
        cta: "Send free fit check",
        intro: "Send a reply contact and one public-safe brief. Fit is checked manually; if it is useful, the $29 setup starts only through an external checkout or invoice.",
        placeholder: "I sell handmade candles at a Saturday market. I need a quick fit check for price tags, QR sign wording, a flyer line, and a pickup note before next weekend.",
      })}
      <section class="shell section">
        <h2>What you get</h2>
        <div class="grid-3">
          ${customLocalPrintPackDeliverables().map((item) => `<article class="panel"><h3>${escapeHtml(item)}</h3><p>Delivered as editable copy or rows you can review and paste into the free generators.</p></article>`).join("")}
        </div>
      </section>
      <section class="shell section">
        <h2>Details needed</h2>
        <ul>
          <li>Business, event, booth, or service name.</li>
          <li>Up to 12 items or services with prices.</li>
          <li>One URL, social profile, phone, or email for QR sign wording.</li>
          <li>Preferred style: clean, cute, bold, minimal, local, premium, or practical.</li>
          <li>Any claims, words, discounts, or offers to avoid.</li>
        </ul>
      </section>
      ${renderServiceUpgradeTools()}
      <section class="shell section">
        <h2>Money gate</h2>
        <p>Requests and clicks are not revenue. Count revenue only after an external provider shows paid order, payout balance, or settled payment for this service.</p>
      </section>
    `;
  }

  function renderInvoiceFollowupCopyPackService() {
    const checkoutUrl = CONFIG.serviceCheckoutUrl || "";
    const checkoutConfigured = Boolean(checkoutUrl);
    const primaryServiceHref = checkoutConfigured ? checkoutUrl : "#service-request";
    const primaryServiceTarget = checkoutConfigured ? ' target="_blank" rel="noreferrer"' : "";
    setMeta("Invoice Follow-up Copy Pack", "Request a $19 manual copy pack for polite invoice reminders, due-today notes, overdue follow-ups, paid thank-yous, and next-invoice wording.");
    setJsonLd({
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Invoice Follow-up Copy Pack",
      description: "A manual invoice follow-up copy pack for freelancers and small teams.",
      offers: { "@type": "Offer", price: "19", priceCurrency: "USD", availability: checkoutConfigured ? "https://schema.org/InStock" : "https://schema.org/PreOrder", url: checkoutUrl || absoluteUrl("/invoice-followup-copy-pack/") },
    });
    const deliverables = [
      "polite payment reminder email",
      "due-today payment note",
      "first overdue follow-up",
      "paid thank-you message",
      "next-invoice or recurring-work note",
    ];
    app.innerHTML = `
      <section class="shell page-title section product-hero">
        <a href="/tools/invoice-generator/">Free invoice generator</a>
        <h1>Invoice Follow-up Copy Pack</h1>
        <p>A $19 done-for-you copy pack for freelancers and small teams who just made an invoice and need professional follow-up wording: polite reminders, due-today notes, first overdue messages, paid thank-yous, and next-invoice copy.</p>
        <div class="hero-actions">
          <a class="button" data-track-event="${checkoutConfigured ? "service_checkout_click" : "service_request_intent"}" data-track-tool="invoice-followup-copy-pack" href="${escapeHtml(primaryServiceHref)}"${primaryServiceTarget}>${checkoutConfigured ? "Buy copy pack for $19" : "Request invoice fit check"}</a>
          <a class="button secondary" href="/tools/invoice-generator/">Open free invoice generator</a>
          <button class="button ghost" type="button" data-copy-text="${escapeHtml(invoiceFollowupRequestCopy())}" data-track-event="service_request_intent" data-track-tool="invoice-followup-copy-pack">Copy request brief</button>
        </div>
        <p class="notice">${checkoutConfigured ? "Checkout is configured through an external payment provider. Revenue is still proven only after that provider shows a paid or settled order." : "Payment starts only after fit is confirmed and a real external checkout or invoice link is paid. This is editable wording only, not legal, tax, accounting, debt-collection, or financial advice."}</p>
        <div class="hero-proof" aria-label="Invoice follow-up service readiness">
          <div class="proof-tile"><strong>$19</strong><span>copy pack price</span></div>
          <div class="proof-tile"><strong>5</strong><span>message blocks</span></div>
          <div class="proof-tile"><strong>1 day</strong><span>target turnaround</span></div>
        </div>
      </section>
      ${renderServiceLeadForm({
        serviceType: "invoice-followup-copy-pack",
        title: "Request a free invoice follow-up fit check",
        cta: "Send invoice fit check",
        intro: "Send a reply contact and one public-safe note about the invoice status and tone you need. If it fits, the $19 copy pack starts only through an external checkout or invoice.",
        placeholder: "I sent an invoice for a freelance project and need a friendly reminder plus a firmer overdue follow-up. No private invoice or client details included.",
      })}
      <section class="shell section">
        <h2>What you get</h2>
        <div class="grid-3">
          ${deliverables.map((item) => `<article class="panel"><h3>${escapeHtml(item)}</h3><p>Delivered as editable wording you review before sending to your own client.</p></article>`).join("")}
        </div>
      </section>
      <section class="shell section">
        <h2>Details needed</h2>
        <ul>
          <li>Business or project name.</li>
          <li>Invoice status: draft, sent, due today, overdue, paid, or recurring.</li>
          <li>Preferred tone: friendly, firm, concise, or warm.</li>
          <li>Payment wording to mention without private account details.</li>
          <li>Need-by date or follow-up timeline.</li>
        </ul>
      </section>
      <section class="shell section">
        <h2>Money gate</h2>
        <p>Requests and clicks are not revenue. Count revenue only after an external provider shows paid order, payout balance, or settled payment for this invoice follow-up service.</p>
      </section>
    `;
  }

  function renderMarketTablePrintAudit() {
    const auditUrl = "https://github.com/yanqr213/printable-tools-lab/issues/new?template=market-table-print-audit.yml";
    const upgradeCheckoutUrl = CONFIG.auditUpgradeCheckoutUrl || CONFIG.serviceCheckoutUrl || CONFIG.customPrintPackCheckoutUrl || "";
    const upgradeConfigured = Boolean(upgradeCheckoutUrl);
    setMeta("Free Market Table Print Audit", "Request a free public-safe print audit before deciding whether the $29 Custom Local Print Pack Setup is useful.");
    app.innerHTML = `
      <section class="shell page-title section product-hero">
        <a href="/custom-local-print-pack/">Done-for-you setup</a>
        <h1>Free Market Table Print Audit</h1>
        <p>A free checklist request for craft sellers, home bakers, local services, tutors, cleaners, repair providers, and pop-up organizers who need clearer price tags, QR signs, flyer copy, coupons, or pickup notes.</p>
        <div class="hero-actions">
          <a class="button" data-track-event="audit_request_intent" data-track-tool="market-table-print-audit" href="${auditUrl}" target="_blank" rel="noreferrer">Request free audit</a>
          <a class="button secondary" data-track-event="${upgradeConfigured ? "service_checkout_click" : "service_request_intent"}" data-track-tool="custom-local-print-pack" href="${escapeHtml(upgradeCheckoutUrl || "/custom-local-print-pack/?utm_source=audit-page&utm_medium=site&utm_campaign=service_request")}" target="${upgradeConfigured ? "_blank" : "_self"}" rel="${upgradeConfigured ? "noreferrer" : ""}">${upgradeConfigured ? "Buy $29 setup" : "See $29 setup"}</a>
          <button class="button ghost" type="button" data-copy-text="${escapeHtml(marketTableAuditRequestCopy())}" data-track-event="audit_request_intent" data-track-tool="market-table-print-audit">Copy audit request</button>
        </div>
        <p class="notice">The audit is free and does not collect payment. The optional setup starts only after a real external checkout is paid.</p>
      </section>
      ${renderServiceLeadForm({
        serviceType: "market-table-print-audit",
        title: "Request the free audit",
        cta: "Send audit request",
        intro: "Send a public-safe snapshot of what you sell and what feels unfinished. The audit is free; the optional setup stays separate.",
        placeholder: "I sell cookies at a school event. Prices are not clear and I need a QR/contact sign checked before printing.",
      })}
      <section class="shell section">
        <h2>Audit checklist</h2>
        <div class="grid-3">
          ${marketTableAuditChecks().map((item) => `<article class="panel"><h3>${escapeHtml(item)}</h3><p>Use this as practical feedback before printing more table or local-service materials.</p></article>`).join("")}
        </div>
      </section>
      ${renderServiceUpgradeTools()}
    `;
  }

  function renderServiceSalesPack() {
    setMeta("Custom Local Print Pack Sales Pack", "Copy-ready outreach and close path for the $29 Custom Local Print Pack Setup.");
    app.innerHTML = `
      <section class="shell page-title section">
        <a href="/custom-local-print-pack/">Paid service</a>
        <h1>Custom Local Print Pack Sales Pack</h1>
        <p>Use this page to promote the $29 done-for-you setup through low-risk manual outreach. Do not count revenue until a real external payment provider proves a paid order.</p>
        <p><a class="button" href="/custom-local-print-pack/">Open service page</a> <a class="button secondary" href="/market-table-print-audit/">Open free audit</a></p>
      </section>
      <section class="shell section">
        <h2>Copy-ready outreach</h2>
        <div class="grid-2">
          <article class="panel"><h3>Market seller</h3><p>Hi, I noticed your table could use simple printable pieces: price tags, QR/contact sign wording, one flyer note, coupon ideas, and pickup or packing notes. I have a $29 setup if you want the first pack assembled from your own item list.</p></article>
          <article class="panel"><h3>Local service</h3><p>Hi, if you need quick printable promo pieces for your service, I can prepare one small starter pack with flyer copy, QR sign wording, coupon ideas, and a print checklist after fit is confirmed.</p></article>
        </div>
      </section>
    `;
  }
  function renderLandingPage(slug) {
    const page = landingPagesBySlug[slug];
    const tool = tools[page.tool];
    const related = page.related.map((id) => tools[id]).filter(Boolean);
    setMeta(page.title, page.description);
    setJsonLd({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: page.title,
      url: absoluteUrl(`/${page.slug}/`),
      description: page.description,
      mainEntity: {
        "@type": "SoftwareApplication",
        name: tool.title,
        url: absoluteUrl(`/tools/${tool.id}/`),
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
    });
    app.innerHTML = `
      <section class="shell page-title section">
        <a href="/free-pdf-tools/">Free file tools</a>
        <h1>${escapeHtml(page.headline)}</h1>
        <p>${escapeHtml(page.lead)}</p>
        <p><a class="button" href="${toolUrl(page)}">Open ${escapeHtml(tool.shortTitle || tool.title)}</a> <a class="button secondary" href="/pdf-tool-finder/">Compare tools</a></p>
      </section>
      <section class="shell section">
        <h2>Why this matches the search</h2>
        <div class="grid-3">
          <article class="panel"><h3>Intent</h3><p>${escapeHtml(page.intent)}</p></article>
          <article class="panel"><h3>No signup</h3><p>The free workflow starts in the browser and does not require an account before export.</p></article>
          <article class="panel"><h3>Ad-safe</h3><p>Downloads are not gated behind ad interactions or ad impressions. Ads remain disabled until policy review and search visibility are ready.</p></article>
        </div>
      </section>
      ${page.sections.map(([heading, text]) => `
      <section class="shell section">
        <h2>${escapeHtml(heading)}</h2>
        <p>${escapeHtml(text)}</p>
      </section>`).join("")}
      ${page.uploadErrorMatcher ? renderUploadLimitMatcher() : ""}
      ${page.targetLinks ? `
      <section class="shell section">
        <h2>Choose an exact KB target</h2>
        <div class="grid-3">${page.targetLinks.map(([label, pathName, text]) => `<article class="tool-card"><h3>${escapeHtml(label)}</h3><p>${escapeHtml(text)}</p><a class="button" href="/${escapeHtml(pathName)}/">Open target</a></article>`).join("")}</div>
      </section>` : ""}
      ${page.slug === "upload-limit-fixer" ? renderUploadLimitShortcuts("Fast upload limit shortcuts", "If the error message names a file size, start with the matching target page instead of browsing every tool.") : ""}
      <section class="shell section">
        <h2>Related free tools</h2>
        <div class="grid-3">${related.map(toolCard).join("")}</div>
      </section>
    `;
  }

  function toolUrl(page) {
    return `/tools/${page.tool}/${page.toolQuery ? `?${page.toolQuery}` : ""}`;
  }

  function guideCard(guide) {
    return `
      <a class="guide-card" href="/guides/${guide.slug}/">
        <h3>${escapeHtml(guide.title)}</h3>
        <p>${escapeHtml(guide.description)}</p>
        <span class="tag">${guide.tool ? tools[guide.tool].shortTitle : "Printable guide"}</span>
      </a>
    `;
  }

  function keywordClusterCard(cluster) {
    return `
      <article class="panel keyword-cluster">
        <h3>${escapeHtml(cluster.title)}</h3>
        <p>${escapeHtml(cluster.description)}</p>
        <div class="cluster-links">
          ${cluster.links.map(([label, href]) => `<a href="${href}">${escapeHtml(label)}</a>`).join("")}
        </div>
      </article>
    `;
  }

  function renderUploadLimitShortcuts(title = "Fast upload limit shortcuts", text = "Most visitors with a rejected upload already know the target size or file type. These direct routes lead to the free no-upload compressor or fixer that matches the error message.") {
    return `
      <section class="shell section">
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(text)}</p>
        ${renderUploadLimitMatcher()}
        <table class="event-table">
          <thead><tr><th>Upload message</th><th>Open</th><th>Why</th></tr></thead>
          <tbody>
            ${uploadLimitDecisions.map(([message, href, label, why, trackTool]) => `<tr><td>${escapeHtml(message)}</td><td><a href="${escapeHtml(href)}" data-track-event="free_tool_depth" data-track-tool="${escapeHtml(trackTool)}">${escapeHtml(label)}</a></td><td>${escapeHtml(why)}</td></tr>`).join("")}
          </tbody>
        </table>
        <div class="grid-3">
          ${uploadLimitShortcuts.map(([label, href, description, trackTool]) => `<article class="tool-card"><h3>${escapeHtml(label)}</h3><p>${escapeHtml(description)}</p><a class="button" data-track-event="free_tool_depth" data-track-tool="${escapeHtml(trackTool)}" href="${escapeHtml(href)}">Open fixer</a></article>`).join("")}
        </div>
      </section>
    `;
  }

  function renderUploadLimitMatcher() {
    return `<div class="upload-limit-matcher" data-upload-limit-helper>
          <label class="field upload-limit-message-field">
            <span>Upload error text</span>
            <textarea data-upload-limit-input placeholder="PDF must be less than 1 MB"></textarea>
            <span class="help">Local text match only. The pasted message is not sent to the server.</span>
          </label>
          <div class="upload-limit-recommendation">
            <div data-upload-limit-result>
              ${renderUploadLimitRecommendation(uploadLimitMatcherDefault)}
            </div>
            <div class="upload-limit-examples" aria-label="Common upload errors">
              ${uploadLimitMatcherExamples.map((example) => `<button type="button" data-upload-limit-example="${escapeHtml(example)}">${escapeHtml(example)}</button>`).join("")}
            </div>
          </div>
        </div>
    `;
  }

  function renderUploadLimitRecommendation(match) {
    return `<article class="upload-match-card">
                <span class="tag">${escapeHtml(match.badge)}</span>
                <h3>${escapeHtml(match.title)}</h3>
                <p>${escapeHtml(match.why)}</p>
                <a class="button" href="${escapeHtml(match.href)}" data-track-event="free_tool_depth" data-track-tool="${escapeHtml(match.trackTool)}">${escapeHtml(match.label)}</a>
              </article>`;
  }

  function renderTool(id) {
    const tool = tools[id];
    setMeta(tool.title, tool.description);
    setToolJsonLd(tool);
    if (tool.pdfTool) return renderPdfUtilityTool(tool);
    if (tool.outputKind === "image") return renderImageUtilityTool(tool);
    const count = getDailyCount();
    app.innerHTML = `
      <section class="shell tool-header">
        <a href="/">Back to all tools</a>
        <h1>${escapeHtml(tool.title)}</h1>
        <p class="lead">${escapeHtml(tool.description)}</p>
      </section>
      <section class="shell tool-layout">
        <aside class="panel tool-form">
          <div class="preview-toolbar">
            <h2>Customize</h2>
            <span class="counter" id="limitCounter">${SITE.dailyLimit - count} free left today</span>
          </div>
          <form id="generatorForm" class="form-grid">
            ${tool.fields.map((field) => renderField(field, tool.defaultValues[field.id])).join("")}
            <div class="actions">
              <button class="button" type="submit">Generate PDF</button>
              ${tool.ai === false ? "" : `<button class="button secondary" type="button" id="aiIdeas">AI ideas</button>`}
              <button class="button secondary" type="button" id="refreshPreview">Refresh preview</button>
            </div>
            <p class="help">The free version creates one clean one-page PDF. Daily limits are stored locally in this browser.</p>
          </form>
          <div id="aiIdeasPanel" class="ai-panel" hidden></div>
          <div id="toolOutputPanel" class="ai-panel tool-output-panel" hidden></div>
          <div id="limitNotice" class="notice" hidden></div>
        </aside>
        <div class="preview-wrap">
          <div class="preview-toolbar">
            <div>
              <h2>Live preview</h2>
              <p class="help">Preview is rendered as the same canvas used for the PDF export.</p>
            </div>
            <a class="button ghost" href="/guides/">Printable tips</a>
          </div>
          <div class="preview-stage">
            <canvas id="previewCanvas" class="preview-canvas" width="1275" height="1650" aria-label="Printable PDF preview"></canvas>
          </div>
          ${renderAdUnit("tool", "content-adjacent only, never blocking the download button")}
          <div id="downloadComplete" class="download-complete" hidden></div>
          <div class="callout">
            <strong>Validation gate:</strong> continue this tool if it gets repeated downloads, search traffic, or strong free usage within the 30-day checkpoint.
          </div>
        </div>
      </section>
      ${renderFreeToolDepthCta(tool)}
      ${renderServiceUpgradeCta(tool)}
      ${renderInvoiceSponsorCloseCta(tool, "tool_cta")}
      <section class="shell section">
        <div class="section-head">
          <div>
            <h2>Related guides</h2>
            <p>These pages make the free tools more useful and provide crawlable content for future AdSense review.</p>
          </div>
        </div>
        <div class="grid-3">${guides.filter((g) => g.tool === id).concat(guides.filter((g) => !g.tool).slice(0, 2)).slice(0, 3).map(guideCard).join("")}</div>
      </section>
    `;
    bindTool(tool);
  }

  function setToolJsonLd(tool) {
    const isPdfTextTool = tool.id === "pdf-to-text";
    const isPassportPhotoTool = tool.id === "passport-photo";
    setJsonLd({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: `${tool.title} - ${SITE.name}`,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      url: absoluteUrl(`/tools/${tool.id}/`),
      description: tool.description,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        isPassportPhotoTool ? "Browser-based passport photo sizing" : tool.outputKind === "image" ? "Browser-based image processing" : isPdfTextTool ? "Browser-based PDF text extraction" : "Browser-based PDF generation",
        "No account required",
        isPassportPhotoTool ? "No-upload passport photo crop" : tool.outputKind === "image" ? "No-upload image conversion" : isPdfTextTool ? "No-upload PDF text extraction" : tool.pdfTool ? "No-upload PDF file processing" : "US Letter and A4 support",
        isPassportPhotoTool ? "Local JPG, PNG, or print sheet export" : tool.outputKind === "image" ? "Local image file export" : isPdfTextTool ? "Local TXT file export" : tool.pdfTool ? "Local PDF export" : "Clean one-page printable export",
      ],
    });
  }

  function renderField(field, value) {
    const common = `id="${field.id}" name="${field.id}" ${field.maxLength ? `maxlength="${field.maxLength}"` : ""}`;
    const help = field.help ? `<span class="help">${escapeHtml(field.help)}</span>` : "";
    if (field.type === "file") {
      return `<div class="field"><label for="${field.id}">${escapeHtml(field.label)}</label><input ${common} type="file" ${field.accept ? `accept="${escapeHtml(field.accept)}"` : ""} ${field.multiple ? "multiple" : ""}>${help}</div>`;
    }
    if (field.type === "textarea") {
      return `<div class="field"><label for="${field.id}">${escapeHtml(field.label)}</label><textarea ${common}>${escapeHtml(value || "")}</textarea>${help}</div>`;
    }
    if (field.type === "signature-pad") {
      return `
        <div class="field signature-field">
          <label for="${field.id}">${escapeHtml(field.label)}</label>
          <div class="signature-pad-wrap">
            <canvas ${common} class="signature-pad" width="720" height="260" aria-label="${escapeHtml(field.label)}"></canvas>
            <button class="button secondary signature-clear" type="button" data-clear-signature="${escapeHtml(field.id)}">Clear</button>
          </div>
          ${help}
        </div>
      `;
    }
    if (field.type === "select") {
      return `<div class="field"><label for="${field.id}">${escapeHtml(field.label)}</label><select ${common}>${field.options.map(([v, label]) => `<option value="${v}" ${v === value ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}</select>${help}</div>`;
    }
    if (field.type === "range") {
      const min = field.min || "0";
      const max = field.max || "100";
      const step = field.step || "1";
      return `<div class="field"><label for="${field.id}">${escapeHtml(field.label)}</label><input ${common} type="range" min="${escapeHtml(min)}" max="${escapeHtml(max)}" step="${escapeHtml(step)}" value="${escapeHtml(value || "")}">${help}</div>`;
    }
    return `<div class="field"><label for="${field.id}">${escapeHtml(field.label)}</label><input ${common} type="${field.type}" value="${escapeHtml(value || "")}">${help}</div>`;
  }

  function bindTool(tool) {
    const form = document.getElementById("generatorForm");
    const canvas = document.getElementById("previewCanvas");
    const refresh = document.getElementById("refreshPreview");
    const aiIdeas = document.getElementById("aiIdeas");
    const aiIdeasPanel = document.getElementById("aiIdeasPanel");
    const limitCounter = document.getElementById("limitCounter");
    const downloadComplete = document.getElementById("downloadComplete");
    const notice = document.getElementById("limitNotice");
    currentToolState = { tool, form, canvas };

    const draw = () => {
      const values = getFormValues(form);
      renderCanvas(tool, canvas, values);
      if (typeof tool.afterDraw === "function") tool.afterDraw(values);
      initServiceLeadForms(document);
    };

    initializeSignaturePads(tool, form, draw);
    form.addEventListener("input", draw);
    form.addEventListener("change", (event) => {
      if (event.target && event.target.type === "file") {
        loadImageFiles(tool, event.target.files, draw);
        return;
      }
      draw();
    });
    refresh.addEventListener("click", () => {
      track("generate_preview", { tool: tool.id });
      draw();
    });
    if (aiIdeas) {
      aiIdeas.addEventListener("click", async () => {
        await requestAiIdeas(tool, form, aiIdeas, aiIdeasPanel, draw);
      });
    }
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      notice.hidden = true;
      const count = getDailyCount();
      if (count >= SITE.dailyLimit) {
        notice.textContent = "Daily free limit reached in this browser. You can still adjust the preview or come back tomorrow.";
        notice.hidden = false;
        track("limit_hit", { tool: tool.id });
        return;
      }
      draw();
      const values = getFormValues(form);
      const filename = `${tool.id}-${slugify(values.name || values.title || values.targetRole || "printable")}.pdf`;
      const pdf = tool.id === "multi-image-pdf" ? exportMultiImagePdf(canvas, values) : canvasToPdf(canvas);
      downloadBlob(pdf, filename);
      incrementDailyCount();
      const remaining = SITE.dailyLimit - getDailyCount();
      limitCounter.textContent = `${remaining} free left today`;
      showDownloadComplete(tool, downloadComplete, remaining);
      track("generate_pdf", { tool: tool.id });
      track("download_pdf", { tool: tool.id });
    });
    draw();
  }

  function renderPdfUtilityTool(tool) {
    const count = getDailyCount();
    const initialValues = initialToolValues(tool);
    app.innerHTML = `
      <section class="shell tool-header">
        <a href="/tools/">Back to all tools</a>
        <h1>${escapeHtml(tool.title)}</h1>
        <p class="lead">${escapeHtml(tool.description)}</p>
      </section>
      <section class="shell tool-layout">
        <aside class="panel tool-form">
          <div class="preview-toolbar">
            <h2>Choose PDFs</h2>
            <span class="counter" id="limitCounter">${SITE.dailyLimit - count} free left today</span>
          </div>
          <form id="generatorForm" class="form-grid">
            ${tool.fields.map((field) => renderField(field, initialValues[field.id])).join("")}
            <div class="actions">
              <button class="button" type="submit">${escapeHtml(pdfToolActionLabel(tool))}</button>
              <button class="button secondary" type="button" id="refreshPreview">Refresh file preview</button>
            </div>
            <p class="help">Files are read in this browser for ordinary processing. They are not uploaded to PrintableTools Lab.</p>
          </form>
          <div id="limitNotice" class="notice" hidden></div>
        </aside>
        <div class="preview-wrap">
          <div class="preview-toolbar">
            <div>
              <h2>File preview</h2>
              <p class="help">Confirm file order, page counts, and selected page ranges before export.</p>
            </div>
            <a class="button ghost" href="/free-pdf-tools/">PDF tools</a>
          </div>
          <div class="preview-stage">
            <div id="pdfFilePreview" class="pdf-file-preview"></div>
          </div>
          ${renderAdUnit("tool", "content-adjacent only, never blocking the download button")}
          <div id="downloadComplete" class="download-complete" hidden></div>
          <div class="callout">
            <strong>Privacy note:</strong> this tool uses browser-side PDF processing. Very large PDFs may be slow or fail if the browser runs out of memory.
          </div>
        </div>
      </section>
      ${renderFreeToolDepthCta(tool)}
      <section class="shell section">
        <div class="grid-3">${getRelatedTools(tool.id).slice(0, 3).map(toolCard).join("")}</div>
      </section>
    `;
    bindPdfUtilityTool(tool);
  }

  function renderImageUtilityTool(tool) {
    const count = getDailyCount();
    const initialValues = initialToolValues(tool);
    app.innerHTML = `
      <section class="shell tool-header">
        <a href="/tools/">Back to all tools</a>
        <h1>${escapeHtml(tool.title)}</h1>
        <p class="lead">${escapeHtml(tool.description)}</p>
      </section>
      <section class="shell tool-layout">
        <aside class="panel tool-form">
          <div class="preview-toolbar">
            <h2>Choose image</h2>
            <span class="counter" id="limitCounter">${SITE.dailyLimit - count} free left today</span>
          </div>
          <form id="generatorForm" class="form-grid">
            ${tool.fields.map((field) => renderField(field, initialValues[field.id])).join("")}
            <div class="actions">
              <button class="button" type="submit">${escapeHtml(imageToolActionLabel(tool))}</button>
              <button class="button secondary" type="button" id="refreshPreview">Refresh preview</button>
            </div>
            <p class="help">Images are processed locally in this browser. They are not uploaded to PrintableTools Lab.</p>
          </form>
          <div id="limitNotice" class="notice" hidden></div>
        </aside>
        <div class="preview-wrap">
          <div class="preview-toolbar">
            <div>
              <h2>Image preview</h2>
              <p class="help">The preview shows the selected image and estimated export settings before download.</p>
            </div>
            <a class="button ghost" href="/pdf-tool-finder/">Find another tool</a>
          </div>
          <div class="preview-stage">
            <canvas id="previewCanvas" class="preview-canvas" width="1275" height="1650" aria-label="Image processing preview"></canvas>
          </div>
          ${renderAdUnit("tool", "content-adjacent only, never blocking the image download button")}
          <div id="downloadComplete" class="download-complete" hidden></div>
          <div class="callout">
            <strong>Privacy note:</strong> this tool uses browser-side image processing. Very large images may be slow or fail if the browser runs out of memory.
          </div>
        </div>
      </section>
      ${renderFreeToolDepthCta(tool)}
      <section class="shell section">
        <div class="grid-3">${getRelatedTools(tool.id).slice(0, 3).map(toolCard).join("")}</div>
      </section>
    `;
    bindImageUtilityTool(tool);
  }

  function renderFreeToolDepthCta(tool) {
    if (!tool || !LOCAL_SELLER_FUNNEL_TOOL_IDS.has(tool.id)) return "";
    const content = encodeURIComponent(tool.id);
    const uploadHref = `/upload-limit-fixer/?utm_source=tool_cta&utm_medium=site&utm_campaign=free_tool_depth&utm_content=${content}`;
    const finderHref = `/free-pdf-tools/?utm_source=tool_cta&utm_medium=site&utm_campaign=free_tool_depth&utm_content=${content}`;
    return `
      <section class="shell section free-tool-depth-cta" aria-label="More free tools">
        <div>
          <p class="eyebrow">Free tool path</p>
          <h2>Need another file fix before downloading?</h2>
          <p>Keep using the free PDF, image, QR, and business paperwork tools. The current monetization path is future ads, not charging visitors for exports.</p>
        </div>
        <div class="free-tool-depth-actions">
          <a class="button" data-track-event="free_tool_depth" data-track-tool="${escapeHtml(tool.id)}" href="${escapeHtml(uploadHref)}">Fix upload limits</a>
          <a class="button secondary" data-track-event="free_tool_depth" data-track-tool="${escapeHtml(tool.id)}" href="${finderHref}">Browse more free tools</a>
          <p class="help">Downloads stay free. Future ads must stay separated from generator controls and never block a file download.</p>
        </div>
      </section>
    `;
  }

  function renderInvoiceSponsorCloseCta(tool, source = "tool_cta") {
    if (!tool || tool.id !== "invoice-generator") return "";
    const content = encodeURIComponent(tool.id);
    const sponsorHref = `/sponsor-starter-review/?utm_source=${encodeURIComponent(source)}&utm_medium=site&utm_campaign=sponsor_starter_review&utm_content=${content}&vertical=small-business-paperwork-sponsors&commitment=request-invoice#sponsor-inquiry`;
    return `
      <section class="shell section invoice-sponsor-close-cta" aria-label="Sponsor invoice workflow">
        <div>
          <p class="eyebrow">Small-business sponsor pilot</p>
          <h2>Sponsor the free invoice workflow</h2>
          <p>Invoicing, bookkeeping, POS, payment, and small-business workflow products can request a manual USD 49 fit review for a clearly labeled pilot around this free invoice page. Downloads stay free and no payment is collected on-site.</p>
        </div>
        <div class="free-tool-depth-actions">
          <a class="button" data-track-event="sponsor_request_intent" data-track-tool="${escapeHtml(tool.id)}" href="${escapeHtml(sponsorHref)}">Request USD 49 invoice review</a>
          <a class="button secondary" data-track-event="sponsor_request_intent" data-track-tool="${escapeHtml(tool.id)}" href="/sponsor/small-business-paperwork-sponsors/?utm_source=${encodeURIComponent(source)}&utm_medium=site&utm_campaign=small_business_paperwork_sponsors&utm_content=${content}">Open paperwork sponsor fit</a>
          <p class="help">Revenue counts only after a signed sponsor agreement or settled external payment is verified.</p>
        </div>
      </section>
    `;
  }

  function renderServiceUpgradeCta(tool) {
    if (!tool || !LOCAL_SELLER_FUNNEL_TOOL_IDS.has(tool.id)) return "";
    const content = encodeURIComponent(tool.id);
    if (isInvoiceFollowupTool(tool.id)) {
      return `
      <section class="shell section service-upgrade-cta" aria-label="Optional invoice follow-up help">
        <div>
          <p class="eyebrow">Optional done-for-you help</p>
          <h2>Want the full invoice follow-up sequence written for you?</h2>
          <p>The free generator drafts one message. Send a free fit check for the $19 Invoice Follow-up Copy Pack if you want a polished reminder, due-today note, first overdue follow-up, paid thank-you, and next-invoice note prepared for one workflow.</p>
        </div>
        <div class="free-tool-depth-actions">
          <a class="button" data-track-event="service_request_intent" data-track-tool="invoice-followup-copy-pack" href="/invoice-followup-copy-pack/?utm_source=tool_cta&utm_medium=site&utm_campaign=invoice_followup_service&utm_content=${content}#service-request">Start invoice fit check</a>
          <a class="button secondary" data-track-event="free_tool_depth" data-track-tool="${escapeHtml(tool.id)}" href="/tools/invoice-generator/?utm_source=tool_cta&utm_medium=site&utm_campaign=invoice_followup_tool&utm_content=${content}">Create an invoice first</a>
          <a class="button secondary" data-track-event="service_request_intent" data-track-tool="custom-local-print-pack" href="/custom-local-print-pack/?utm_source=tool_cta&utm_medium=site&utm_campaign=service_request&utm_content=${content}">Start free fit check</a>
          <a class="button ghost" data-track-event="audit_request_intent" data-track-tool="market-table-print-audit" href="/market-table-print-audit/?utm_source=tool_cta&utm_medium=site&utm_campaign=audit_request&utm_content=${content}">Free print audit first</a>
          <p class="help">Also selling locally? The optional $29 print-pack setup can turn invoice, receipt, price tag, flyer, QR, coupon, and packing-slip details into a first printable seller pack.</p>
          <p class="help">Payment happens only through a real external checkout or invoice after fit is confirmed.</p>
        </div>
      </section>`;
    }
    return `
      <section class="shell section service-upgrade-cta" aria-label="Optional done-for-you setup">
        <div>
          <p class="eyebrow">Optional done-for-you help</p>
          <h2>Want the first local seller print pack assembled?</h2>
          <p>The free generators stay free. Send a free fit check for the $29 Custom Local Print Pack Setup if you want price tag rows, flyer copy, QR sign wording, coupon ideas, pickup notes, and a print checklist prepared from your item list.</p>
        </div>
        <div class="free-tool-depth-actions">
          <a class="button" data-track-event="service_request_intent" data-track-tool="custom-local-print-pack" href="/custom-local-print-pack/?utm_source=tool_cta&utm_medium=site&utm_campaign=service_request&utm_content=${content}">Start free fit check</a>
          <a class="button secondary" data-track-event="audit_request_intent" data-track-tool="market-table-print-audit" href="/market-table-print-audit/?utm_source=tool_cta&utm_medium=site&utm_campaign=audit_request&utm_content=${content}">Free print audit first</a>
          <p class="help">Payment happens only through a real external checkout or invoice after fit is confirmed.</p>
        </div>
      </section>`;
  }

  function isInvoiceFollowupTool(toolId) {
    return toolId === "invoice-generator" || toolId === "invoice-followup-email";
  }

  function renderServiceUpgradeTools() {
    const links = [
      ["Price tags", "/tools/price-tag/"],
      ["Flyer", "/tools/flyer-maker/"],
      ["Coupon", "/tools/coupon-maker/"],
      ["Packing slip", "/tools/packing-slip/"],
      ["Business card", "/tools/business-card/"],
      ["QR code", "/tools/qr-code/"],
    ];
    return `
      <section class="shell section">
        <h2>Use the finished pack with free tools</h2>
        <div class="cluster-links">${links.map(([label, href]) => `<a href="${href}">${escapeHtml(label)}</a>`).join("")}</div>
      </section>`;
  }

  function customLocalPrintPackDeliverables() {
    return [
      "price tag starter CSV for up to 12 items",
      "one small flyer copy draft",
      "QR sign wording for one link or contact method",
      "three coupon or bundle offer ideas",
      "packing slip or pickup note starter rows",
      "one-page launch checklist for printing and first outreach",
    ];
  }

  function customLocalPrintPackRequestCopy() {
    return [
      "I want a free fit check for the Custom Local Print Pack Setup ($29 USD if it fits).",
      "",
      "Business/event/service name:",
      "Items or services with prices:",
      "Link or contact method for QR sign:",
      "Preferred style:",
      "Words, claims, or offers to avoid:",
      "If it fits, preferred external checkout provider:",
      "",
      "No payment is collected by this request. Please review fit first; send a real external checkout or invoice link only if the service is useful and available.",
    ].join("\n");
  }

  function invoiceFollowupRequestCopy() {
    return [
      "I want a free fit check for the Invoice Follow-up Copy Pack ($19 USD if it fits).",
      "",
      "Business or project name:",
      "Invoice status: draft / sent / due today / overdue / paid / recurring",
      "Preferred tone: friendly / firm / concise / warm",
      "Follow-up copy needed:",
      "Payment wording to mention, without private account details:",
      "Need-by date or timeline:",
      "",
      "No payment is collected by this request. Please review fit first; send a real external checkout or invoice link only if the service is useful and available.",
      "Do not include invoice numbers, bank details, card data, tax IDs, client private data, private customer lists, or legal dispute details.",
    ].join("\n");
  }

  function marketTableAuditChecks() {
    return [
      "Do shoppers see a clear price for each item or service?",
      "Is there one QR/contact sign that opens a public-safe page or contact method?",
      "Is there one simple flyer or table note that says what is available today?",
      "Is there a coupon, bundle, or follow-up offer the seller can actually honor?",
      "Are pickup, packing, or ordering notes clear enough to reduce repeated questions?",
      "Are claims, deadlines, food/health language, and discount rules safe for the seller to review before printing?",
    ];
  }

  function marketTableAuditRequestCopy() {
    return [
      "I want a free Market Table Print Audit.",
      "",
      "What I sell or offer:",
      "Current prices or menu:",
      "Current QR/contact method:",
      "Current print pieces:",
      "Would I want the optional $29 setup if obvious gaps show up? yes / maybe / no:",
      "",
      "Do not include private payment, tax, bank, identity, password, customer-list, or regulated details.",
    ].join("\n");
  }

  function localSellerCheckoutRequestUrl() {
    const url = new URL("https://github.com/yanqr213/printable-tools-lab/issues/new");
    url.searchParams.set("title", "Checkout request: Local Seller Starter Kit");
    url.searchParams.set("body", [
      "I want to request the Local Seller Starter Kit checkout link.",
      "",
      "Store or project name:",
      "Preferred checkout provider: Gumroad / Payhip / Ko-fi / Stripe / other",
      "",
      "No payment is collected by this request. Please reply with a real external checkout link only after the payment product is ready.",
    ].join("\n"));
    return url.toString();
  }

  function renderServiceLeadForm(options = {}) {
    const serviceType = options.serviceType || "custom-local-print-pack";
    const eventName = serviceLeadTrackEvent(serviceType);
    const tool = serviceLeadTrackTool(serviceType);
    const title = options.title || "Request manual follow-up";
    const cta = options.cta || "Send request";
    const intro = options.intro || "Send one public-safe note and a reply contact. Fit is reviewed manually before any external checkout or invoice is sent.";
    const placeholder = options.placeholder || "Tell us what you sell, what print pieces you need, and any date that matters.";
    const fallbackUrl = options.fallbackUrl || serviceLeadFallbackUrl({
      serviceType,
      businessName: "",
      contact: "",
      needBy: "",
      requestSummary: "",
      path: `/${serviceType}/`,
    });
    return `
      <section class="shell section service-lead-section" id="service-request">
        <div class="grid-2">
          <div>
            <h2>${escapeHtml(title)}</h2>
            <p>${escapeHtml(intro)}</p>
            <ul>
              <li>No payment is collected here.</li>
              <li>Use an email, website contact page, or public handle for follow-up.</li>
              <li>Do not send payment, tax, bank, identity, password, customer-list, or private file data.</li>
            </ul>
          </div>
          <form class="panel form-grid service-lead-form" data-service-lead-form data-service-type="${escapeHtml(serviceType)}" data-service-fallback-url="${escapeHtml(fallbackUrl)}">
            <input class="sr-only" type="text" name="websiteTrap" tabindex="-1" autocomplete="off" aria-hidden="true">
            <input type="hidden" name="serviceType" value="${escapeHtml(serviceType)}">
            <label class="field">
              <span>Email or public contact link</span>
              <input name="contact" maxlength="180" autocomplete="email" placeholder="you@example.com or https://example.com/contact" required>
            </label>
            <label class="field">
              <span>Business or project (optional)</span>
              <input name="businessName" maxlength="90" autocomplete="organization" placeholder="Market booth, service name, or shop">
            </label>
            <label class="field">
              <span>What do you need?</span>
              <textarea name="requestSummary" maxlength="1000" required placeholder="${escapeHtml(placeholder)}"></textarea>
            </label>
            <label class="field">
              <span>Need-by date (optional)</span>
              <input name="needBy" maxlength="80" placeholder="Event date, this week, this month">
            </label>
            <label class="check-row">
              <input name="consent" type="checkbox" required>
              <span>I will keep payment, tax, identity, passwords, customer lists, and private files outside this form.</span>
            </label>
            <div class="actions">
              <button class="button" type="submit" data-track-event="${escapeHtml(eventName)}" data-track-tool="${escapeHtml(tool)}">${escapeHtml(cta)}</button>
              <a class="button ghost" data-service-lead-fallback-link data-track-event="${escapeHtml(eventName)}" data-track-tool="${escapeHtml(tool)}" href="${escapeHtml(fallbackUrl)}" target="_blank" rel="noreferrer">Open GitHub backup</a>
            </div>
            <p class="help service-lead-status" data-service-lead-status role="status" aria-live="polite">No payment is collected here. A real external checkout or invoice is sent only after fit is confirmed.</p>
          </form>
        </div>
      </section>`;
  }

  function serviceLeadTrackEvent(serviceType) {
    if (serviceType === "market-table-print-audit") return "audit_request_intent";
    if (serviceType === "local-seller-starter-kit") return "seller_checkout_intent";
    return "service_request_intent";
  }

  function serviceLeadTrackTool(serviceType) {
    if (serviceType === "invoice-followup-copy-pack") return "invoice-followup-copy-pack";
    if (serviceType === "market-table-print-audit") return "market-table-print-audit";
    if (serviceType === "local-seller-starter-kit") return "local-seller-starter-kit";
    return "custom-local-print-pack";
  }

  function serviceLeadTitle(serviceType) {
    if (serviceType === "invoice-followup-copy-pack") return "Invoice Follow-up Copy Pack";
    if (serviceType === "market-table-print-audit") return "Free Market Table Print Audit";
    if (serviceType === "local-seller-starter-kit") return "Local Seller Starter Kit";
    return "Custom Local Print Pack Setup";
  }

  function serviceLeadFallbackUrl(values = {}) {
    const url = new URL("https://github.com/yanqr213/printable-tools-lab/issues/new");
    const serviceType = values.serviceType || "custom-local-print-pack";
    const titlePrefix = serviceType === "market-table-print-audit" ? "Audit request" : serviceType === "local-seller-starter-kit" ? "Seller kit request" : "Service request";
    url.searchParams.set("title", `${titlePrefix}: ${serviceLeadTitle(serviceType)}`);
    url.searchParams.set("body", serviceLeadPublicIssueText(values));
    url.searchParams.set("labels", "service,business-review");
    return url.toString();
  }

  function serviceLeadFallbackText(values = {}) {
    return [
      "Public-safe service request.",
      "",
      `Service: ${serviceLeadTitle(values.serviceType)}`,
      `Business or project: ${values.businessName || ""}`,
      `Public contact or reply email: ${values.contact || ""}`,
      `Need-by / timeline: ${values.needBy || ""}`,
      `Source path: ${absoluteUrl(values.path || getCurrentRoutePath())}`,
      "",
      "Request note:",
      values.requestSummary || "",
      "",
      "Do not include payment, tax, bank, phone, identity, password, customer-list, or private file data in this public issue.",
    ].join("\n");
  }

  function serviceLeadPublicIssueText(values = {}) {
    return [
      "Public-safe service request.",
      "",
      `Service: ${serviceLeadTitle(values.serviceType)}`,
      `Business or project: ${values.businessName || ""}`,
      "Public contact: add only if you want it visible in a public GitHub issue",
      `Need-by / timeline: ${values.needBy || ""}`,
      `Source path: ${absoluteUrl(values.path || getCurrentRoutePath())}`,
      "",
      "Request note:",
      values.requestSummary || "",
      "",
      "Do not include payment, tax, bank, phone, identity, password, customer-list, or private file data in this public issue.",
    ].join("\n");
  }

  function bindImageUtilityTool(tool) {
    const form = document.getElementById("generatorForm");
    const canvas = document.getElementById("previewCanvas");
    const refresh = document.getElementById("refreshPreview");
    const limitCounter = document.getElementById("limitCounter");
    const downloadComplete = document.getElementById("downloadComplete");
    const notice = document.getElementById("limitNotice");
    currentToolState = { tool, form, canvas };

    const draw = () => {
      const values = getFormValues(form);
      renderCanvas(tool, canvas, values);
    };

    form.addEventListener("input", draw);
    form.addEventListener("change", (event) => {
      if (event.target && event.target.type === "file") {
        loadImageFiles(tool, event.target.files, draw);
        return;
      }
      draw();
    });
    refresh.addEventListener("click", () => {
      track("generate_preview", { tool: tool.id });
      draw();
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      notice.hidden = true;
      const count = getDailyCount();
      if (count >= SITE.dailyLimit) {
        notice.textContent = "Daily free limit reached in this browser. You can still adjust the preview or come back tomorrow.";
        notice.hidden = false;
        track("limit_hit", { tool: tool.id });
        return;
      }
      const images = imageToolState.get(tool.id) || [];
      if (!tool.generatedImage && !images.length) {
        notice.textContent = "Select an image before downloading the processed file.";
        notice.hidden = false;
        return;
      }
      try {
        draw();
        const values = getFormValues(form);
        const output = tool.exportFile(values);
        downloadBlob(output.blob, output.filename);
        incrementDailyCount();
        const remaining = SITE.dailyLimit - getDailyCount();
        limitCounter.textContent = `${remaining} free left today`;
        showDownloadComplete(tool, downloadComplete, remaining, output.label || "Image downloaded");
        track("generate_file", { tool: tool.id });
        track("download_file", { tool: tool.id });
      } catch (error) {
        notice.textContent = error.message || "Could not process this image. Try a smaller file or a different output format.";
        notice.hidden = false;
      }
    });
    draw();
  }

  function imageToolActionLabel(tool) {
    if (tool.id === "compress-image") return "Compress image";
    if (tool.id === "compress-image-to-kb") return "Compress to KB";
    if (tool.id === "resize-image") return "Resize image";
    if (tool.id === "convert-image") return "Convert image";
    if (tool.id === "remove-background") return "Download PNG";
    if (tool.id === "crop-image") return "Crop image";
    if (tool.id === "rotate-image") return "Rotate image";
    if (tool.id === "watermark-image") return "Watermark image";
    if (tool.id === "add-text-image") return "Add text";
    if (tool.id === "signature-png") return "Download PNG";
    if (tool.id === "passport-photo") return "Download photo";
    return "Download image";
  }

  function bindPdfUtilityTool(tool) {
    const form = document.getElementById("generatorForm");
    const refresh = document.getElementById("refreshPreview");
    const limitCounter = document.getElementById("limitCounter");
    const downloadComplete = document.getElementById("downloadComplete");
    const notice = document.getElementById("limitNotice");
    const preview = document.getElementById("pdfFilePreview");
    pdfToolState.set(tool.id, []);
    currentToolState = { tool, form };

    const renderPreview = () => {
      preview.innerHTML = pdfUtilityPreviewHtml(tool, getPdfFiles(tool.id), getFormValues(form));
    };

    form.addEventListener("change", async (event) => {
      if (event.target && event.target.type === "file") {
        notice.hidden = true;
        try {
          await loadPdfFiles(tool, event.target.files);
        } catch (error) {
          pdfToolState.set(tool.id, []);
          notice.textContent = error.message || "Could not read the selected PDF file.";
          notice.hidden = false;
        }
      }
      renderPreview();
    });
    form.addEventListener("input", renderPreview);
    refresh.addEventListener("click", () => {
      track("generate_preview", { tool: tool.id });
      renderPreview();
    });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      notice.hidden = true;
      const count = getDailyCount();
      if (count >= SITE.dailyLimit) {
        notice.textContent = "Daily free limit reached in this browser. You can still adjust the selected files or come back tomorrow.";
        notice.hidden = false;
        track("limit_hit", { tool: tool.id });
        return;
      }
      try {
        const values = getFormValues(form);
        const files = getPdfFiles(tool.id);
        const output = await exportPdfUtility(tool, files, values);
        downloadBlob(output, pdfUtilityFilename(tool, files, values));
        incrementDailyCount();
        const remaining = SITE.dailyLimit - getDailyCount();
        limitCounter.textContent = `${remaining} free left today`;
        const fileOutput = tool.pdfTool === "to-images" || tool.pdfTool === "to-text" || tool.pdfTool === "to-docx";
        const outputLabel = tool.pdfTool === "to-images" ? "Images downloaded" : tool.pdfTool === "to-text" ? "Text downloaded" : tool.pdfTool === "to-docx" ? "Word document downloaded" : "PDF downloaded";
        showDownloadComplete(tool, downloadComplete, remaining, outputLabel);
        const eventKind = fileOutput ? "file" : "pdf";
        track(`generate_${eventKind}`, { tool: tool.id });
        track(`download_${eventKind}`, { tool: tool.id });
      } catch (error) {
        notice.textContent = error.message || "Could not generate the PDF. Try a smaller file or a simpler page range.";
        notice.hidden = false;
      }
    });
    renderPreview();
  }

  function pdfToolActionLabel(tool) {
    if (tool.pdfTool === "merge") return "Merge PDF";
    if (tool.pdfTool === "split") return "Extract pages";
    if (tool.pdfTool === "to-images") return "Convert to images";
    if (tool.pdfTool === "to-text") return "Extract text";
    if (tool.pdfTool === "to-docx") return "Convert to DOCX";
    if (tool.pdfTool === "compress") return "Compress PDF";
    if (tool.pdfTool === "page-numbers") return "Add page numbers";
    if (tool.pdfTool === "rotate") return "Rotate pages";
    if (tool.pdfTool === "remove-pages") return "Remove pages";
    if (tool.pdfTool === "reorder") return "Reorder pages";
    if (tool.pdfTool === "watermark") return "Add watermark";
    if (tool.pdfTool === "stamp") return "Stamp PDF";
    if (tool.pdfTool === "signature") return "Add signature";
    return "Generate PDF";
  }

  function getPdfFiles(toolId) {
    return pdfToolState.get(toolId) || [];
  }

  async function loadPdfFiles(tool, fileList) {
    const files = Array.from(fileList || [])
      .filter((file) => file.type === "application/pdf" || /\.pdf$/i.test(file.name || ""))
      .slice(0, tool.pdfTool === "merge" ? 6 : 1);
    if (!files.length) {
      pdfToolState.set(tool.id, []);
      return;
    }
    const items = await Promise.all(files.map(readPdfFile));
    pdfToolState.set(tool.id, items);
  }

  async function readPdfFile(file) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const pdfLib = getPdfLib();
    const doc = await pdfLib.PDFDocument.load(bytes, { ignoreEncryption: true });
    if (doc.isEncrypted) {
      throw new Error("Encrypted PDFs are not supported in the browser tool.");
    }
    return {
      name: file.name || "document.pdf",
      size: file.size || bytes.length,
      bytes,
      pageCount: doc.getPageCount(),
    };
  }

  function pdfUtilityPreviewHtml(tool, files, values) {
    if (!files.length) {
      return `
        <div class="empty-state">
          <strong>Select PDF file${tool.pdfTool === "merge" ? "s" : ""} to start</strong>
          <p>Use the file field on the left. The browser will read page counts locally before export.</p>
        </div>
      `;
    }
    const totalPages = files.reduce((sum, file) => sum + file.pageCount, 0);
    const rows = files.map((file, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHtml(file.name)}</td>
        <td>${file.pageCount}</td>
        <td>${formatBytes(file.size)}</td>
      </tr>
    `).join("");
    let note = "";
    if (tool.pdfTool === "merge") note = `The export will combine ${files.length} PDF file${files.length === 1 ? "" : "s"} into one ${totalPages}-page PDF.`;
    if (tool.pdfTool === "split") {
      const selected = parsePageRange(values.pageRange || "", files[0].pageCount);
      note = `The export will keep ${selected.length} page${selected.length === 1 ? "" : "s"} from ${files[0].pageCount}.`;
    }
    if (tool.pdfTool === "to-images") {
      const selected = limitedPdfImagePages(values.pageRange || "all", files[0].pageCount);
      note = `The export will render ${selected.length} page${selected.length === 1 ? "" : "s"} as ${pdfImageFormatLabel(values.format || "jpeg")} image${selected.length === 1 ? "" : "s"}. Multiple pages download as a ZIP.`;
    }
    if (tool.pdfTool === "to-text") {
      const selected = parsePageRangeOrAll(values.pageRange || "all", files[0].pageCount);
      note = `The export will extract selectable text from ${selected.length} of ${files[0].pageCount} page${files[0].pageCount === 1 ? "" : "s"} into a TXT file. Scanned image-only PDFs need OCR.`;
    }
    if (tool.pdfTool === "to-docx") {
      const selected = limitedPdfWordPages(values.pageRange || "all", files[0].pageCount);
      note = `The export will convert selectable text from ${selected.length} of ${files[0].pageCount} page${files[0].pageCount === 1 ? "" : "s"} into a simple DOCX file. Scanned PDFs need OCR and complex layouts may be simplified.`;
    }
    if (tool.pdfTool === "compress") {
      const selected = limitedPdfCompressPages(values.pageRange || "all", files[0].pageCount);
      const profile = pdfCompressProfile(values.mode || "balanced");
      const targetBytes = pdfTargetBytes(values.targetSize);
      const targetText = targetBytes ? ` and try to stay under ${pdfTargetLabel(values.targetSize)}` : "";
      note = `The export will render ${selected.length} of ${files[0].pageCount} page${files[0].pageCount === 1 ? "" : "s"} into a ${profile.label.toLowerCase()} image-based PDF${targetText}. Selectable text and links may be flattened.`;
    }
    if (tool.pdfTool === "page-numbers") note = `The export will add visible page numbers to ${files[0].pageCount} page${files[0].pageCount === 1 ? "" : "s"}.`;
    if (tool.pdfTool === "rotate") {
      const selected = parsePageRangeOrAll(values.pageRange || "all", files[0].pageCount);
      note = `The export will rotate ${selected.length} of ${files[0].pageCount} page${files[0].pageCount === 1 ? "" : "s"} by ${normalizeRotation(values.rotation || "90")} degrees.`;
    }
    if (tool.pdfTool === "remove-pages") {
      const removed = parsePageRange(values.removeRange || "", files[0].pageCount);
      note = `The export will remove ${removed.length} page${removed.length === 1 ? "" : "s"} and keep ${Math.max(0, files[0].pageCount - removed.length)}.`;
    }
    if (tool.pdfTool === "reorder") {
      const order = parsePageOrder(values.pageOrder || "", files[0].pageCount);
      note = `The export will create a ${order.length}-page PDF in the typed order.`;
    }
    if (tool.pdfTool === "watermark") {
      const selected = parsePageRangeOrAll(values.pageRange || "all", files[0].pageCount);
      note = `The export will place "${sanitizePrintable(values.watermarkText || "Watermark")}" on ${selected.length} of ${files[0].pageCount} page${files[0].pageCount === 1 ? "" : "s"}.`;
    }
    if (tool.pdfTool === "stamp") {
      const selected = parsePageRangeOrAll(values.pageRange || "all", files[0].pageCount);
      note = `The export will stamp "${sanitizePrintable(values.stampText || "STAMP")}" on ${selected.length} of ${files[0].pageCount} page${files[0].pageCount === 1 ? "" : "s"}.`;
    }
    if (tool.pdfTool === "signature") {
      const pageNumber = clampPageNumber(values.pageNumber || "1", files[0].pageCount);
      note = `The export will place a typed signature block on page ${pageNumber} of ${files[0].pageCount}. Review whether typed signatures are accepted for your use case.`;
    }
    return `
      <table class="event-table">
        <thead><tr><th>#</th><th>File</th><th>Pages</th><th>Size</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="help">${escapeHtml(note)}</p>
    `;
  }

  async function exportPdfUtility(tool, files, values) {
    if (!files.length) throw new Error("Select at least one PDF file first.");
    if (tool.pdfTool === "merge") return exportMergedPdf(files);
    if (tool.pdfTool === "split") return exportSplitPdf(files[0], values);
    if (tool.pdfTool === "to-images") return exportPdfAsImages(files[0], values);
    if (tool.pdfTool === "to-text") return exportPdfText(files[0], values);
    if (tool.pdfTool === "to-docx") return exportPdfDocx(files[0], values);
    if (tool.pdfTool === "compress") return exportCompressedPdf(files[0], values);
    if (tool.pdfTool === "page-numbers") return exportNumberedPdf(files[0], values);
    if (tool.pdfTool === "rotate") return exportRotatedPdf(files[0], values);
    if (tool.pdfTool === "remove-pages") return exportRemovedPagesPdf(files[0], values);
    if (tool.pdfTool === "reorder") return exportReorderedPdf(files[0], values);
    if (tool.pdfTool === "watermark") return exportWatermarkedPdf(files[0], values);
    if (tool.pdfTool === "stamp") return exportStampedPdf(files[0], values);
    if (tool.pdfTool === "signature") return exportSignaturePdf(files[0], values);
    throw new Error("Unsupported PDF operation.");
  }

  async function exportMergedPdf(files) {
    if (files.length < 2) throw new Error("Select at least two PDFs to merge.");
    const pdfLib = getPdfLib();
    const output = await pdfLib.PDFDocument.create();
    for (const file of files) {
      const source = await pdfLib.PDFDocument.load(file.bytes, { ignoreEncryption: true });
      const copiedPages = await output.copyPages(source, source.getPageIndices());
      copiedPages.forEach((page) => output.addPage(page));
    }
    return pdfBytesToBlob(await output.save());
  }

  async function exportSplitPdf(file, values) {
    const selected = parsePageRange(values.pageRange || "", file.pageCount);
    if (!selected.length) throw new Error("Enter at least one valid page number or range.");
    const pdfLib = getPdfLib();
    const source = await pdfLib.PDFDocument.load(file.bytes, { ignoreEncryption: true });
    const output = await pdfLib.PDFDocument.create();
    const copiedPages = await output.copyPages(source, selected.map((pageNumber) => pageNumber - 1));
    copiedPages.forEach((page) => output.addPage(page));
    return pdfBytesToBlob(await output.save());
  }

  async function exportPdfAsImages(file, values) {
    const pdfjsLib = getPdfJsLib();
    const selectedPages = limitedPdfImagePages(values.pageRange || "all", file.pageCount);
    if (!selectedPages.length) throw new Error("Enter all or at least one valid page number to convert.");
    const extension = pdfImageExtension(values.format || "jpeg");
    const mime = values.format === "png" ? "image/png" : "image/jpeg";
    const document = await pdfjsLib.getDocument({ data: file.bytes.slice().buffer }).promise;
    const outputs = [];
    for (const pageNumber of selectedPages) {
      const page = await document.getPage(pageNumber);
      const viewport = page.getViewport({ scale: pdfRenderScale(values.scale || "1.5") });
      const canvas = window.document.createElement("canvas");
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const ctx = canvas.getContext("2d", { alpha: values.format === "png" });
      if (values.format !== "png") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      await page.render({ canvasContext: ctx, viewport }).promise;
      outputs.push({
        name: `${fileBaseName(file.name)}-page-${String(pageNumber).padStart(2, "0")}.${extension}`,
        blob: dataUrlToBlob(canvas.toDataURL(mime, normalizeQuality(values.quality || "0.86"))),
      });
      page.cleanup();
    }
    if (document.destroy) await document.destroy();
    if (outputs.length === 1) return outputs[0].blob;
    return await zipImageOutputs(outputs);
  }

  async function exportPdfText(file, values) {
    const parts = await extractPdfTextParts(file, values, parsePageRangeOrAll);
    const output = parts.map((part) => {
      if (values.layout !== "plain") return `--- Page ${part.pageNumber} ---\n${part.text}`;
      return part.text;
    }).join("\n\n").trim();
    if (!output) throw new Error("No selectable text was found. This PDF may be scanned or image-only and may need OCR.");
    return new Blob([output + "\n"], { type: "text/plain;charset=utf-8" });
  }

  async function exportPdfDocx(file, values) {
    const parts = await extractPdfTextParts(file, values, limitedPdfWordPages);
    const hasText = parts.some((part) => part.text.trim());
    if (!hasText) throw new Error("No selectable text was found. This PDF may be scanned or image-only and may need OCR before converting to Word.");
    return createDocxBlob({
      title: fileBaseName(file.name).replace(/[-_]+/g, " ") || "Converted PDF",
      sourceName: file.name,
      parts,
      layout: values.layout || "headings",
    });
  }

  async function extractPdfTextParts(file, values, pageSelector) {
    const pdfjsLib = getPdfJsLib();
    const selectedPages = pageSelector(values.pageRange || "all", file.pageCount);
    if (!selectedPages.length) throw new Error("Enter all or at least one valid page number to extract.");
    const document = await pdfjsLib.getDocument({ data: file.bytes.slice().buffer }).promise;
    const parts = [];
    try {
      for (const pageNumber of selectedPages) {
        const page = await document.getPage(pageNumber);
        const textContent = await page.getTextContent();
        const text = pdfTextItemsToLines(textContent.items || []);
        parts.push({ pageNumber, text });
        page.cleanup();
      }
    } finally {
      if (document.destroy) await document.destroy();
    }
    return parts;
  }

  function createDocxBlob({ title, sourceName, parts, layout }) {
    if (!window.fflate || !window.fflate.zipSync) {
      throw new Error("DOCX engine is still loading. Please try again in a moment.");
    }
    const paragraphs = [
      docxParagraph(title || "Converted PDF", "Title"),
      docxParagraph(`Converted locally from ${sourceName}. Selectable text only; scanned PDFs need OCR and complex layout may be simplified.`, "Subtitle"),
    ];
    parts.forEach((part) => {
      if (layout !== "paragraphs") paragraphs.push(docxParagraph(`Page ${part.pageNumber}`, "Heading1"));
      const lines = part.text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
      if (!lines.length) {
        paragraphs.push(docxParagraph("[No selectable text found on this page]", "Normal"));
        return;
      }
      lines.forEach((line) => paragraphs.push(docxParagraph(line, "Normal")));
    });
    const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>
${paragraphs.join("\n")}
<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr>
</w:body></w:document>`;
    const files = {
      "[Content_Types].xml": utf8Bytes(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`),
      "_rels/.rels": utf8Bytes(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`),
      "word/document.xml": utf8Bytes(documentXml),
      "word/styles.xml": utf8Bytes(docxStylesXml()),
    };
    return new Blob([window.fflate.zipSync(files)], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  }

  function docxParagraph(text, style) {
    const styleXml = style && style !== "Normal" ? `<w:pPr><w:pStyle w:val="${style}"/></w:pPr>` : "";
    return `<w:p>${styleXml}<w:r><w:t xml:space="preserve">${docxEscape(text)}</w:t></w:r></w:p>`;
  }

  function docxStylesXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:pPr><w:spacing w:after="120" w:line="276" w:lineRule="auto"/></w:pPr><w:rPr><w:sz w:val="22"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="180"/></w:pPr><w:rPr><w:b/><w:sz w:val="32"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:basedOn w:val="Normal"/><w:rPr><w:color w:val="53636A"/><w:sz w:val="20"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:before="240" w:after="120"/></w:pPr><w:rPr><w:b/><w:sz w:val="26"/></w:rPr></w:style>
</w:styles>`;
  }

  function docxEscape(value) {
    return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function utf8Bytes(value) {
    return new TextEncoder().encode(value);
  }

  async function exportCompressedPdf(file, values) {
    const pdfLib = getPdfLib();
    const pdfjsLib = getPdfJsLib();
    const profiles = pdfCompressionAttempts(values.mode || "balanced", values.targetSize || "none");
    const targetBytes = pdfTargetBytes(values.targetSize || "none");
    const selectedPages = limitedPdfCompressPages(values.pageRange || "all", file.pageCount);
    if (!selectedPages.length) throw new Error("Enter all or at least one valid page number to compress.");
    const document = await pdfjsLib.getDocument({ data: file.bytes.slice().buffer }).promise;
    let bestBytes = null;
    let bestSize = Infinity;
    let bestMetTarget = false;
    try {
      for (const profile of profiles) {
        const output = await pdfLib.PDFDocument.create();
        let renderedCount = 0;
        for (const pageNumber of selectedPages) {
          const page = await document.getPage(pageNumber);
          const pageSize = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({ scale: profile.scale });
          const canvas = window.document.createElement("canvas");
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          const ctx = canvas.getContext("2d", { alpha: false });
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport }).promise;
          const imageBytes = binaryStringToUint8(base64ToBinary(canvas.toDataURL("image/jpeg", profile.quality).split(",")[1]));
          const image = await output.embedJpg(imageBytes);
          const outputPage = output.addPage([pageSize.width, pageSize.height]);
          outputPage.drawImage(image, { x: 0, y: 0, width: pageSize.width, height: pageSize.height });
          renderedCount += 1;
          page.cleanup();
        }
        if (!renderedCount) continue;
        const bytes = await output.save();
        const size = bytes.byteLength || bytes.length || 0;
        const metTarget = targetBytes > 0 && size <= targetBytes;
        if (!bestBytes || betterCompressedPdfCandidate(size, metTarget, bestSize, bestMetTarget, targetBytes)) {
          bestBytes = bytes;
          bestSize = size;
          bestMetTarget = metTarget;
        }
        if (metTarget) break;
      }
    } finally {
      if (document.destroy) await document.destroy();
    }
    if (!bestBytes) throw new Error("Could not render pages for compression.");
    return pdfBytesToBlob(bestBytes);
  }

  function pdfTextItemsToLines(items) {
    const lines = [];
    let currentY = null;
    let currentLine = [];
    items.forEach((item) => {
      const text = String(item.str || "").replace(/\s+/g, " ").trim();
      if (!text) return;
      const y = item.transform && Number.isFinite(item.transform[5]) ? Math.round(item.transform[5]) : null;
      if (currentY === null) currentY = y;
      if (y !== null && currentY !== null && Math.abs(y - currentY) > 4) {
        if (currentLine.length) lines.push(currentLine.join(" ").replace(/\s+/g, " ").trim());
        currentLine = [];
        currentY = y;
      }
      currentLine.push(text);
    });
    if (currentLine.length) lines.push(currentLine.join(" ").replace(/\s+/g, " ").trim());
    return lines.join("\n");
  }

  async function exportNumberedPdf(file, values) {
    const pdfLib = getPdfLib();
    const doc = await pdfLib.PDFDocument.load(file.bytes, { ignoreEncryption: true });
    const font = await doc.embedFont(pdfLib.StandardFonts.Helvetica);
    const pages = doc.getPages();
    const start = Math.max(1, Number.parseInt(values.startNumber || "1", 10) || 1);
    pages.forEach((page, index) => {
      const { width, height } = page.getSize();
      const text = String(start + index);
      const size = 11;
      const textWidth = font.widthOfTextAtSize(text, size);
      const position = values.position || "bottom-center";
      const margin = 28;
      const x = position === "bottom-right" || position === "top-right" ? width - margin - textWidth : (width - textWidth) / 2;
      const y = position === "top-right" ? height - margin - size : margin;
      page.drawText(text, {
        x,
        y,
        size,
        font,
        color: pdfLib.rgb(0.1, 0.19, 0.23),
      });
    });
    return pdfBytesToBlob(await doc.save());
  }

  async function exportRotatedPdf(file, values) {
    const pdfLib = getPdfLib();
    const doc = await pdfLib.PDFDocument.load(file.bytes, { ignoreEncryption: true });
    const pages = doc.getPages();
    const selected = new Set(parsePageRangeOrAll(values.pageRange || "all", pages.length));
    if (!selected.size) throw new Error("Enter all or at least one valid page number to rotate.");
    const degrees = normalizeRotation(values.rotation || "90");
    pages.forEach((page, index) => {
      if (!selected.has(index + 1)) return;
      const current = page.getRotation().angle || 0;
      page.setRotation(pdfLib.degrees((current + degrees) % 360));
    });
    return pdfBytesToBlob(await doc.save());
  }

  async function exportRemovedPagesPdf(file, values) {
    const removePages = new Set(parsePageRange(values.removeRange || "", file.pageCount));
    if (!removePages.size) throw new Error("Enter at least one valid page number or range to remove.");
    if (removePages.size >= file.pageCount) throw new Error("At least one page must remain in the PDF.");
    const keep = [];
    for (let page = 1; page <= file.pageCount; page += 1) {
      if (!removePages.has(page)) keep.push(page - 1);
    }
    const pdfLib = getPdfLib();
    const source = await pdfLib.PDFDocument.load(file.bytes, { ignoreEncryption: true });
    const output = await pdfLib.PDFDocument.create();
    const copiedPages = await output.copyPages(source, keep);
    copiedPages.forEach((page) => output.addPage(page));
    return pdfBytesToBlob(await output.save());
  }

  async function exportReorderedPdf(file, values) {
    const order = parsePageOrder(values.pageOrder || "", file.pageCount);
    if (!order.length) throw new Error("Enter at least one valid page number for the new order.");
    const pdfLib = getPdfLib();
    const source = await pdfLib.PDFDocument.load(file.bytes, { ignoreEncryption: true });
    const output = await pdfLib.PDFDocument.create();
    const copiedPages = await output.copyPages(source, order.map((pageNumber) => pageNumber - 1));
    copiedPages.forEach((page) => output.addPage(page));
    return pdfBytesToBlob(await output.save());
  }

  async function exportWatermarkedPdf(file, values) {
    const pdfLib = getPdfLib();
    const doc = await pdfLib.PDFDocument.load(file.bytes, { ignoreEncryption: true });
    const pages = doc.getPages();
    const selected = new Set(parsePageRangeOrAll(values.pageRange || "all", pages.length));
    if (!selected.size) throw new Error("Enter all or at least one valid page number for the watermark.");
    const font = await doc.embedFont(pdfLib.StandardFonts.HelveticaBold);
    const text = sanitizePdfText(values.watermarkText || "WATERMARK", 48);
    const opacity = normalizeOpacity(values.opacity || "0.16");
    pages.forEach((page, index) => {
      if (selected.has(index + 1)) drawWatermarkOnPage(pdfLib, page, font, text, values, opacity);
    });
    return pdfBytesToBlob(await doc.save());
  }

  async function exportStampedPdf(file, values) {
    const pdfLib = getPdfLib();
    const doc = await pdfLib.PDFDocument.load(file.bytes, { ignoreEncryption: true });
    const pages = doc.getPages();
    const selected = new Set(parsePageRangeOrAll(values.pageRange || "all", pages.length));
    if (!selected.size) throw new Error("Enter all or at least one valid page number for the stamp.");
    const font = await doc.embedFont(pdfLib.StandardFonts.HelveticaBold);
    const text = sanitizePdfText(values.stampText || "STAMP", 32).toUpperCase();
    pages.forEach((page, index) => {
      if (selected.has(index + 1)) drawStampOnPage(pdfLib, page, font, text, values);
    });
    return pdfBytesToBlob(await doc.save());
  }

  async function exportSignaturePdf(file, values) {
    const pdfLib = getPdfLib();
    const doc = await pdfLib.PDFDocument.load(file.bytes, { ignoreEncryption: true });
    const pages = doc.getPages();
    const pageNumber = clampPageNumber(values.pageNumber || "1", pages.length);
    const font = await doc.embedFont(pdfLib.StandardFonts.Helvetica);
    const scriptFont = await doc.embedFont(pdfLib.StandardFonts.TimesRomanItalic);
    drawSignatureOnPage(pdfLib, pages[pageNumber - 1], font, scriptFont, values);
    return pdfBytesToBlob(await doc.save());
  }

  function parsePageRange(value, pageCount) {
    const pages = new Set();
    String(value || "")
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean)
      .forEach((part) => {
        const match = part.match(/^(\d+)(?:-(\d+))?$/);
        if (!match) return;
        const start = Math.max(1, Number(match[1]));
        const end = Math.min(pageCount, Number(match[2] || match[1]));
        for (let page = Math.min(start, end); page <= Math.max(start, end); page += 1) {
          if (page >= 1 && page <= pageCount) pages.add(page);
        }
      });
    return Array.from(pages).sort((a, b) => a - b);
  }

  function parsePageRangeOrAll(value, pageCount) {
    if (/^\s*all\s*$/i.test(String(value || ""))) {
      return Array.from({ length: pageCount }, (_, index) => index + 1);
    }
    return parsePageRange(value, pageCount);
  }

  function limitedPdfImagePages(value, pageCount) {
    const pages = parsePageRangeOrAll(value || "all", pageCount);
    return pages.slice(0, 8);
  }

  function limitedPdfCompressPages(value, pageCount) {
    const pages = parsePageRangeOrAll(value || "all", pageCount);
    return pages.slice(0, 12);
  }

  function limitedPdfWordPages(value, pageCount) {
    const pages = parsePageRangeOrAll(value || "all", pageCount);
    return pages.slice(0, 12);
  }

  function pdfCompressProfile(value) {
    if (value === "small") return { label: "Small file", scale: 0.85, quality: 0.58 };
    if (value === "readable") return { label: "More readable", scale: 1.35, quality: 0.82 };
    return { label: "Balanced", scale: 1.05, quality: 0.68 };
  }

  function pdfCompressionAttempts(mode, targetSize) {
    const base = pdfCompressProfile(mode);
    const aggressive = [
      base,
      { label: "Smaller target pass", scale: 0.78, quality: 0.5 },
      { label: "Smallest target pass", scale: 0.62, quality: 0.42 },
    ];
    return pdfTargetBytes(targetSize) ? aggressive : [base];
  }

  function betterCompressedPdfCandidate(size, metTarget, bestSize, bestMetTarget, targetBytes) {
    if (!targetBytes) return size < bestSize;
    if (metTarget && !bestMetTarget) return true;
    if (metTarget && bestMetTarget) return size > bestSize;
    return size < bestSize;
  }

  function pdfTargetBytes(value) {
    if (value === "500kb") return 500 * 1024;
    if (value === "1mb") return 1024 * 1024;
    if (value === "2mb") return 2 * 1024 * 1024;
    if (value === "5mb") return 5 * 1024 * 1024;
    return 0;
  }

  function pdfTargetLabel(value) {
    if (value === "500kb") return "500 KB";
    if (value === "1mb") return "1 MB";
    if (value === "2mb") return "2 MB";
    if (value === "5mb") return "5 MB";
    return "the selected target";
  }

  function parsePageOrder(value, pageCount) {
    const pages = [];
    String(value || "")
      .split(",")
      .map((part) => Number(part.trim()))
      .filter((page) => Number.isInteger(page) && page >= 1 && page <= pageCount)
      .forEach((page) => pages.push(page));
    return pages;
  }

  function normalizeRotation(value) {
    const degrees = Number.parseInt(value, 10);
    return [90, 180, 270].includes(degrees) ? degrees : 90;
  }

  function normalizeImageRotation(value) {
    const degrees = Number.parseInt(value, 10);
    return [90, 180, 270].includes(degrees) ? degrees : 90;
  }

  function normalizeOpacity(value) {
    const opacity = Number.parseFloat(value);
    if (!Number.isFinite(opacity)) return 0.16;
    return Math.max(0.06, Math.min(0.35, opacity));
  }

  function normalizeWatermarkOpacity(value) {
    const opacity = Number.parseFloat(value);
    if (!Number.isFinite(opacity)) return 0.28;
    return Math.max(0.12, Math.min(0.55, opacity));
  }

  function clampPageNumber(value, pageCount) {
    const number = Number.parseInt(value, 10);
    if (!Number.isFinite(number)) return 1;
    return Math.max(1, Math.min(pageCount, number));
  }

  function sanitizePdfText(value, maxLength) {
    return sanitizePrintable(value || "")
      .replace(/[^\x20-\x7E]/g, "")
      .trim()
      .slice(0, maxLength)
      || "PDF";
  }

  function drawWatermarkOnPage(pdfLib, page, font, text, values, opacity) {
    const { width, height } = page.getSize();
    const sizeMap = { medium: 42, large: 64, xlarge: 86 };
    const size = sizeMap[values.size] || 64;
    const textWidth = font.widthOfTextAtSize(text, size);
    const color = pdfLib.rgb(0.25, 0.33, 0.36);
    const placement = values.placement || "diagonal";
    if (placement === "footer") {
      const footerSize = Math.min(18, size);
      const footerWidth = font.widthOfTextAtSize(text, footerSize);
      page.drawText(text, {
        x: (width - footerWidth) / 2,
        y: 24,
        size: footerSize,
        font,
        color,
        opacity: Math.max(0.18, opacity),
      });
      return;
    }
    page.drawText(text, {
      x: Math.max(28, (width - textWidth) / 2),
      y: placement === "center" ? Math.max(40, (height - size) / 2) : Math.max(50, height * 0.35),
      size,
      font,
      color,
      opacity,
      rotate: placement === "diagonal" ? pdfLib.degrees(-32) : undefined,
    });
  }

  function drawStampOnPage(pdfLib, page, font, text, values) {
    const { width, height } = page.getSize();
    const palette = stampPalette(pdfLib, values.style || "approved");
    const size = 24;
    const padX = 18;
    const boxW = Math.min(width - 48, Math.max(140, font.widthOfTextAtSize(text, size) + padX * 2));
    const boxH = 54;
    const position = values.position || "top-right";
    let x = width - boxW - 36;
    let y = height - boxH - 36;
    if (position === "center") {
      x = (width - boxW) / 2;
      y = (height - boxH) / 2;
    }
    if (position === "bottom-right") {
      x = width - boxW - 36;
      y = 36;
    }
    page.drawRectangle({
      x,
      y,
      width: boxW,
      height: boxH,
      borderColor: palette.border,
      borderWidth: 2.5,
      color: palette.fill,
      opacity: 0.18,
      borderOpacity: 0.9,
    });
    page.drawText(text, {
      x: x + (boxW - font.widthOfTextAtSize(text, size)) / 2,
      y: y + 17,
      size,
      font,
      color: palette.text,
    });
  }

  function drawSignatureOnPage(pdfLib, page, font, scriptFont, values) {
    const { width } = page.getSize();
    const name = sanitizePdfText(values.signatureName || "Signed", 60);
    const date = sanitizePdfText(values.signatureDate || "", 40);
    const blockW = Math.min(260, width - 72);
    const position = values.position || "bottom-right";
    let x = width - blockW - 48;
    if (position === "bottom-left") x = 48;
    if (position === "bottom-center") x = (width - blockW) / 2;
    const y = 74;
    page.drawLine({
      start: { x, y: y + 30 },
      end: { x: x + blockW, y: y + 30 },
      thickness: 1.2,
      color: pdfLib.rgb(0.1, 0.19, 0.23),
      opacity: 0.65,
    });
    page.drawText(name, {
      x: x + 8,
      y: y + 38,
      size: 20,
      font: scriptFont,
      color: pdfLib.rgb(0.08, 0.16, 0.2),
    });
    page.drawText("Typed signature", {
      x,
      y: y + 12,
      size: 9,
      font,
      color: pdfLib.rgb(0.36, 0.44, 0.47),
    });
    if (date) {
      const label = `Date: ${date}`;
      page.drawText(label, {
        x: x + blockW - font.widthOfTextAtSize(label, 9),
        y: y + 12,
        size: 9,
        font,
        color: pdfLib.rgb(0.36, 0.44, 0.47),
      });
    }
  }

  function stampPalette(pdfLib, style) {
    if (style === "paid") return { fill: pdfLib.rgb(0.88, 0.95, 1), border: pdfLib.rgb(0.08, 0.42, 0.55), text: pdfLib.rgb(0.06, 0.32, 0.44) };
    if (style === "draft") return { fill: pdfLib.rgb(0.93, 0.94, 0.94), border: pdfLib.rgb(0.36, 0.42, 0.44), text: pdfLib.rgb(0.25, 0.3, 0.32) };
    if (style === "urgent") return { fill: pdfLib.rgb(1, 0.92, 0.9), border: pdfLib.rgb(0.75, 0.18, 0.13), text: pdfLib.rgb(0.62, 0.12, 0.09) };
    return { fill: pdfLib.rgb(0.9, 0.97, 0.92), border: pdfLib.rgb(0.24, 0.54, 0.31), text: pdfLib.rgb(0.17, 0.42, 0.23) };
  }

  function pdfUtilityFilename(tool, files) {
    const base = slugify((files[0] && files[0].name.replace(/\.pdf$/i, "")) || tool.shortTitle || tool.id);
    if (tool.pdfTool === "merge") return "merged-pdf.pdf";
    if (tool.pdfTool === "split") return `${base}-selected-pages.pdf`;
    if (tool.pdfTool === "to-images") {
      const values = currentToolState && currentToolState.form ? getFormValues(currentToolState.form) : {};
      const pages = files[0] ? limitedPdfImagePages(values.pageRange || "all", files[0].pageCount) : [];
      return `${base}-page-images${pages.length === 1 ? `.${pdfImageExtension(values.format || "jpeg")}` : ".zip"}`;
    }
    if (tool.pdfTool === "to-text") return `${base}-text.txt`;
    if (tool.pdfTool === "to-docx") return `${base}-word.docx`;
    if (tool.pdfTool === "compress") return `${base}-compressed.pdf`;
    if (tool.pdfTool === "page-numbers") return `${base}-page-numbers.pdf`;
    if (tool.pdfTool === "rotate") return `${base}-rotated.pdf`;
    if (tool.pdfTool === "remove-pages") return `${base}-pages-removed.pdf`;
    if (tool.pdfTool === "reorder") return `${base}-reordered.pdf`;
    if (tool.pdfTool === "watermark") return `${base}-watermarked.pdf`;
    if (tool.pdfTool === "stamp") return `${base}-stamped.pdf`;
    if (tool.pdfTool === "signature") return `${base}-signed.pdf`;
    return `${base}.pdf`;
  }

  function getPdfLib() {
    if (!window.PDFLib) throw new Error("PDF engine is still loading. Please try again in a moment.");
    return window.PDFLib;
  }

  function getPdfJsLib() {
    if (!window.pdfjsLib) throw new Error("PDF rendering engine is still loading. Please try again in a moment.");
    return window.pdfjsLib;
  }

  function zipImageOutputs(outputs) {
    if (!window.fflate || !window.fflate.zipSync) {
      throw new Error("ZIP engine is still loading. Please try again in a moment.");
    }
    return Promise.all(outputs.map((item) => item.blob.arrayBuffer().then((buffer) => [item.name, new Uint8Array(buffer)])))
      .then((entries) => {
        const zipFiles = {};
        entries.forEach(([name, bytes]) => {
          zipFiles[name] = bytes;
        });
        return new Blob([window.fflate.zipSync(zipFiles)], { type: "application/zip" });
      });
  }

  function pdfRenderScale(value) {
    const scale = Number.parseFloat(value);
    return [1, 1.5, 2].includes(scale) ? scale : 1.5;
  }

  function pdfImageExtension(format) {
    return format === "png" ? "png" : "jpg";
  }

  function pdfImageFormatLabel(format) {
    return format === "png" ? "PNG" : "JPG";
  }

  function pdfBytesToBlob(bytes) {
    return new Blob([bytes], { type: "application/pdf" });
  }

  function formatBytes(bytes) {
    const size = Number(bytes || 0);
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  function renderDownloadAfterAction(tool) {
    if (!tool || !LOCAL_SELLER_FUNNEL_TOOL_IDS.has(tool.id)) return "";
    const content = encodeURIComponent(tool.id);
    const uploadHref = `/upload-limit-fixer/?utm_source=download_success&utm_medium=site&utm_campaign=free_tool_depth&utm_content=${content}`;
    const finderHref = `/free-pdf-tools/?utm_source=download_success&utm_medium=site&utm_campaign=free_tool_depth&utm_content=${content}`;
    const serviceHref = `/custom-local-print-pack/?utm_source=download_success&utm_medium=site&utm_campaign=service_request&utm_content=${content}#service-request`;
    const invoiceFollowupHref = `/invoice-followup-copy-pack/?utm_source=download_success&utm_medium=site&utm_campaign=invoice_followup_service&utm_content=${content}#service-request`;
    const auditHref = `/market-table-print-audit/?utm_source=download_success&utm_medium=site&utm_campaign=audit_request&utm_content=${content}#service-request`;
    const sponsorHref = `/sponsor-starter-review/?utm_source=download_success&utm_medium=site&utm_campaign=sponsor_starter_review&utm_content=${content}&vertical=small-business-paperwork-sponsors&commitment=request-invoice#sponsor-inquiry`;
    const invoiceSponsorAction = tool.id === "invoice-generator"
      ? `<a class="button" data-track-event="sponsor_request_intent" data-track-tool="${escapeHtml(tool.id)}" href="${escapeHtml(sponsorHref)}">Request USD 49 invoice review</a>`
      : "";
    const invoiceFollowupAction = isInvoiceFollowupTool(tool.id)
      ? `<a class="button" data-track-event="service_request_intent" data-track-tool="invoice-followup-copy-pack" href="${escapeHtml(invoiceFollowupHref)}">Get $19 follow-up copy</a>`
      : "";
    const serviceAction = isInvoiceFollowupTool(tool.id)
      ? invoiceFollowupAction
      : `<a class="button" data-track-event="service_request_intent" data-track-tool="custom-local-print-pack" href="${escapeHtml(serviceHref)}">Start free fit check</a>`;
    const serviceHeadline = isInvoiceFollowupTool(tool.id) ? "Need words to follow up on this invoice?" : "Want a practical local print pack?";
    const serviceHelp = isInvoiceFollowupTool(tool.id)
      ? "Send a 30-second free fit check for a $19 Invoice Follow-up Copy Pack: polite reminder, due-today note, first overdue follow-up, paid thank-you, and next-invoice wording. Payment starts only after fit is confirmed and a real external checkout or invoice is paid."
      : "Send a 30-second free fit check for the $29 Custom Local Print Pack Setup, or start with a free Market Table Print Audit. Payment starts only after fit is confirmed and a real external checkout or invoice is paid.";
    return `
      <div class="download-after-action" aria-label="Next step after download">
        <div>
          <p class="eyebrow">Keep working free</p>
          <strong>Need another business PDF, label, QR code, or image fix?</strong>
          <p class="help">Try another free browser tool, or use the upload limit fixer if another site rejects a PDF, image, or photo size.</p>
        </div>
        <div class="download-service-close">
          <p class="eyebrow">Optional done-for-you help</p>
          <strong>${escapeHtml(serviceHeadline)}</strong>
          <p class="help">${escapeHtml(serviceHelp)}</p>
        </div>
        ${renderDownloadServiceLeadForm(tool)}
        <div class="download-after-actions">
          ${serviceAction}
          <a class="button secondary" data-track-event="audit_request_intent" data-track-tool="market-table-print-audit" href="${escapeHtml(auditHref)}">Free print audit first</a>
          ${invoiceSponsorAction}
          <a class="button" data-track-event="free_tool_depth" data-track-tool="${escapeHtml(tool.id)}" href="${escapeHtml(uploadHref)}">Fix upload limits</a>
          <a class="button secondary" data-track-event="free_tool_depth" data-track-tool="${escapeHtml(tool.id)}" href="${escapeHtml(finderHref)}">Browse more free tools</a>
        </div>
        <p class="help">Downloads stay free. Future ads must stay separated from generator controls and never block a file download.</p>
      </div>
    `;
  }

  function renderDownloadServiceLeadForm(tool) {
    if (!tool || !LOCAL_SELLER_FUNNEL_TOOL_IDS.has(tool.id)) return "";
    const toolId = tool.id || "download";
    const sourcePath = `/tools/${toolId}/`;
    const isInvoice = isInvoiceFollowupTool(toolId);
    const serviceType = isInvoice ? "invoice-followup-copy-pack" : "custom-local-print-pack";
    const serviceTool = isInvoice ? "invoice-followup-copy-pack" : "custom-local-print-pack";
    const campaign = isInvoice ? "invoice_followup_service" : "service_request";
    const defaultSummary = isInvoice
      ? `I just downloaded ${tool.shortTitle || tool.title || toolId} and want a free fit check for the $19 invoice follow-up copy pack.`
      : `I just downloaded ${tool.shortTitle || tool.title || toolId} and want a free fit check for the $29 local print pack.`;
    const fieldLabel = isInvoice ? "What invoice follow-up copy do you need?" : "What should be assembled?";
    const buttonText = isInvoice ? "Send invoice fit check" : "Send free fit check";
    const fallbackUrl = serviceLeadFallbackUrl({
      serviceType,
      businessName: "",
      contact: "",
      needBy: "",
      requestSummary: defaultSummary,
      path: sourcePath,
    });
    return `
      <form class="download-service-lead-form" data-service-lead-form data-service-type="${escapeHtml(serviceType)}" data-lead-path="${escapeHtml(sourcePath)}" data-utm-source="download_success" data-utm-medium="site" data-utm-campaign="${escapeHtml(campaign)}" data-utm-content="${escapeHtml(toolId)}" data-service-fallback-url="${escapeHtml(fallbackUrl)}">
        <input class="sr-only" type="text" name="websiteTrap" tabindex="-1" autocomplete="off" aria-hidden="true">
        <input type="hidden" name="serviceType" value="${escapeHtml(serviceType)}">
        <input type="hidden" name="businessName" value="Downloaded ${escapeHtml(tool.shortTitle || tool.title || toolId)}">
        <input type="hidden" name="needBy" value="">
        <input type="hidden" name="utmSource" value="download_success">
        <input type="hidden" name="utmMedium" value="site">
        <input type="hidden" name="utmCampaign" value="${escapeHtml(campaign)}">
        <input type="hidden" name="utmContent" value="${escapeHtml(toolId)}">
        <label class="field">
          <span>Reply email or public contact</span>
          <input name="contact" maxlength="180" autocomplete="email" placeholder="you@example.com or @publichandle" required>
        </label>
        <label class="field">
          <span>${escapeHtml(fieldLabel)}</span>
          <textarea name="requestSummary" maxlength="1000" required>${escapeHtml(defaultSummary)}</textarea>
        </label>
        <label class="check-row">
          <input name="consent" type="checkbox" required>
          <span>I will keep payment, tax, identity, passwords, customer lists, and private files outside this request.</span>
        </label>
        <div class="actions">
          <button class="button" type="submit" data-track-event="service_request_intent" data-track-tool="${escapeHtml(serviceTool)}">${escapeHtml(buttonText)}</button>
          <a class="button ghost" data-service-lead-fallback-link data-track-event="service_request_intent" data-track-tool="${escapeHtml(serviceTool)}" href="${escapeHtml(fallbackUrl)}" target="_blank" rel="noreferrer">Open GitHub backup</a>
        </div>
        <p class="help service-lead-status" data-service-lead-status role="status" aria-live="polite">Fastest path: send a public-safe fit check here. Payment still happens only through a real external checkout or invoice after fit is confirmed.</p>
      </form>
    `;
  }

  function renderInvoiceFollowupOutputServiceLeadForm(values, message) {
    const sourcePath = "/tools/invoice-followup-email/";
    const serviceType = "invoice-followup-copy-pack";
    const toolId = "invoice-followup-email";
    const statusLabel = invoiceFollowupStatusLabel(values.invoiceStatus);
    const businessName = sanitizePrintable(values.projectLabel || values.clientLabel || "Invoice follow-up email");
    const messageExcerpt = sanitizePrintable(message).slice(0, 520);
    const defaultSummary = [
      "I used the free invoice follow-up email generator and want a free fit check for the $19 Invoice Follow-up Copy Pack.",
      `Status: ${statusLabel}.`,
      `Tone: ${sanitizePrintable(values.tone || "friendly")}.`,
      `Payment wording: ${sanitizePrintable(values.paymentWording || "use the existing payment method")}.`,
      "Generated draft excerpt to refine:",
      messageExcerpt,
    ].join("\n");
    const fallbackUrl = serviceLeadFallbackUrl({
      serviceType,
      businessName,
      contact: "",
      needBy: "",
      requestSummary: defaultSummary,
      path: sourcePath,
    });
    return `
      <form class="download-service-lead-form tool-output-service-lead-form" data-service-lead-form data-service-type="${escapeHtml(serviceType)}" data-lead-path="${escapeHtml(sourcePath)}" data-utm-source="tool_output" data-utm-medium="site" data-utm-campaign="invoice_followup_service" data-utm-content="${escapeHtml(toolId)}" data-service-fallback-url="${escapeHtml(fallbackUrl)}">
        <input class="sr-only" type="text" name="websiteTrap" tabindex="-1" autocomplete="off" aria-hidden="true">
        <input type="hidden" name="serviceType" value="${escapeHtml(serviceType)}">
        <input type="hidden" name="businessName" value="${escapeHtml(businessName)}">
        <input type="hidden" name="needBy" value="">
        <input type="hidden" name="utmSource" value="tool_output">
        <input type="hidden" name="utmMedium" value="site">
        <input type="hidden" name="utmCampaign" value="invoice_followup_service">
        <input type="hidden" name="utmContent" value="${escapeHtml(toolId)}">
        <label class="field">
          <span>Reply email or public contact</span>
          <input name="contact" maxlength="180" autocomplete="email" placeholder="you@example.com or @publichandle" required>
        </label>
        <label class="field">
          <span>What should the $19 follow-up sequence improve?</span>
          <textarea name="requestSummary" maxlength="1000" required>${escapeHtml(defaultSummary)}</textarea>
        </label>
        <label class="check-row">
          <input name="consent" type="checkbox" required>
          <span>I will keep payment, tax, identity, passwords, customer lists, and private files outside this request.</span>
        </label>
        <div class="actions">
          <button class="button" type="submit" data-track-event="service_request_intent" data-track-tool="invoice-followup-copy-pack">Send invoice fit check</button>
          <a class="button ghost" data-service-lead-fallback-link data-track-event="service_request_intent" data-track-tool="invoice-followup-copy-pack" href="${escapeHtml(fallbackUrl)}" target="_blank" rel="noreferrer">Open GitHub backup</a>
        </div>
        <p class="help service-lead-status" data-service-lead-status role="status" aria-live="polite">Fastest path: send a public-safe fit check here. Payment still happens only through a real external checkout or invoice after fit is confirmed.</p>
      </form>
    `;
  }

  function showDownloadComplete(tool, target, remaining, title = "PDF downloaded") {
    if (!target) return;
    const related = getRelatedTools(tool.id).slice(0, 3);
    const afterAction = renderDownloadAfterAction(tool);
    target.hidden = false;
    target.innerHTML = `
      <div>
        <strong>${escapeHtml(title)}</strong>
        <p class="help">Review the file before sharing or printing. You have ${Math.max(0, remaining)} free ${remaining === 1 ? "generation" : "generations"} left today in this browser.</p>
      </div>
      ${afterAction}
      <div class="next-links">
        ${related.map((item) => `<a class="tag" href="/tools/${item.id}/">${escapeHtml(item.shortTitle)}</a>`).join("")}
        <a class="tag" href="/guides/">Guides</a>
      </div>
      ${renderAdUnit("tool", "download-complete area, clearly separated from the PDF action")}
    `;
    initServiceLeadForms(target);
    setTimeout(pushVisibleAds, 0);
  }

  function getRelatedTools(currentId) {
    const groups = [
      ["invoice-generator", "invoice-followup-email", "estimate-generator", "purchase-order", "bill-of-sale", "rent-receipt", "receipt-generator", "timesheet-generator", "packing-slip", "work-order", "inventory-sheet", "business-card", "address-labels", "barcode-labels", "price-tag", "flyer-maker", "coupon-maker"],
      ["resume-builder", "ats-resume-checker", "cover-letter", "resignation-letter"],
      ["monthly-calendar", "meal-planner", "weekly-planner", "habit-tracker"],
      ["name-tracing", "chore-chart", "reward-chart", "flashcards"],
      ["image-to-pdf", "multi-image-pdf", "compress-pdf", "pdf-to-images", "pdf-to-text", "pdf-to-word", "compress-image", "resize-image", "convert-image", "remove-background", "crop-image", "rotate-image", "watermark-image", "add-text-image", "signature-png", "passport-photo", "qr-code", "wifi-qr-code", "vcard-qr-code", "merge-pdf", "split-pdf", "pdf-page-numbers", "rotate-pdf", "remove-pdf-pages", "reorder-pdf-pages", "watermark-pdf", "stamp-pdf", "sign-pdf", "text-to-pdf", "graph-paper", "todo-list", "packing-list", "sign-in-sheet"],
      ["certificate-generator", "sign-in-sheet", "todo-list", "flyer-maker", "coupon-maker"],
    ];
    const group = groups.find((items) => items.includes(currentId)) || toolOrder;
    return group.filter((id) => id !== currentId && tools[id]).map((id) => tools[id]);
  }

  function renderGuides() {
    setMeta("Printable Guides", "Original guides for printable worksheets, charts, planners, flashcards, and classroom resources.");
    app.innerHTML = `
      <section class="shell page-title section">
        <h1>Printable guides</h1>
        <p>Short practical guides for parents, teachers, and organizers. These pages support real search intent while the tools validate demand.</p>
      </section>
      <section class="shell section">
        <div class="section-head">
          <div>
            <h2>Search by use case</h2>
            <p>Grouped entry points help parents and teachers move from a problem to the right printable.</p>
          </div>
        </div>
        <div class="grid-2">${keywordClusters.map(keywordClusterCard).join("")}</div>
      </section>
      <section class="shell section">
        <div class="grid-3">${guides.map(guideCard).join("")}</div>
      </section>
    `;
  }

  function renderGuide(slug) {
    const guide = guides.find((item) => item.slug === slug);
    if (!guide) return renderNotFound();
    setMeta(guide.title, guide.description);
    app.innerHTML = `
      <article class="article-shell article">
        <a href="/guides/">Back to all guides</a>
        <h1>${escapeHtml(guide.title)}</h1>
        <p class="lead">${escapeHtml(guide.description)}</p>
        ${guide.tool ? `<p><a class="button" href="/tools/${guide.tool}/">Open ${escapeHtml(tools[guide.tool].shortTitle)}</a></p>` : ""}
        ${renderAdUnit("content", "after AdSense approval, separated from core actions")}
        ${renderBlocks(guide.content)}
        ${guide.tool ? `<p><a class="button" href="/tools/${guide.tool}/">Open ${escapeHtml(tools[guide.tool].shortTitle)}</a></p>` : ""}
      </article>
    `;
  }

  function renderStaticPage(key) {
    const page = pages[key];
    setMeta(page.title, page.description);
    app.innerHTML = `
      <article class="article-shell article">
        <h1>${escapeHtml(page.title)}</h1>
        ${renderBlocks(page.body)}
      </article>
    `;
  }

  function renderSponsorPage() {
    const defaultDeal = sponsorDeals.find((deal) => deal.id === DEFAULT_SPONSOR_DEAL_ID) || sponsorDeals[0];
    const defaultVertical = sponsorVerticals[0];
    const publicReplyUrl = sponsorPublicReplyUrl(
      { name: "Sponsor team", website: "" },
      defaultDeal,
      defaultVertical,
      defaultDeal?.trackedUrl || "/sponsor-deal-room/",
    );
    setMeta("Sponsor PrintableTools Lab", "Sponsor and partner inquiry page for PrintableTools Lab, a free no-signup browser PDF, image, QR, and document utility site with ad-safe placement rules.");
    app.innerHTML = `
      <section class="shell page-title section sponsor-hero">
        <a href="/free-pdf-tools/">Free tools</a>
        <h1>Sponsor PrintableTools Lab</h1>
        <p>PrintableTools Lab is a free no-signup browser utility site for PDF compression, image conversion, QR codes, business documents, career PDFs, upload-limit fixes, and printable planners. This page captures responsible sponsorship and partner inquiries without enabling ads or collecting payment on-site.</p>
        <p><a class="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="/sponsor-starter-review/?utm_source=sponsor-page&utm_medium=organic&utm_campaign=sponsor_starter_review&utm_content=hero#sponsor-inquiry">Start USD 49 review</a> <a class="button secondary" data-sponsor-public-invoice-request data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(publicReplyUrl)}" target="_blank" rel="noreferrer">Open public invoice request</a> <a class="button ghost" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="/sponsor-deal-room/?utm_source=sponsor-page&utm_medium=organic&utm_campaign=sponsor_deal_room&utm_content=hero">Open deal room</a></p>
      </section>
      ${renderSponsorLeadForm()}
      <section class="shell section">
        <h2>What can be sponsored</h2>
        <div class="grid-3">
          <article class="panel"><h3>Tool-directory visibility</h3><p>Contextual mentions around free PDF, image, QR, document, and upload-limit workflows after fit review.</p></article>
          <article class="panel"><h3>Content sponsorship</h3><p>Useful guide or resource sponsorship for privacy-friendly file workflows, small-business paperwork, career documents, or classroom printables.</p></article>
          <article class="panel"><h3>Partner distribution</h3><p>Directory, newsletter, or community partnerships that send users to free tools without gated downloads.</p></article>
        </div>
      </section>
      <section class="shell section">
        <h2>Current public facts</h2>
        <div class="metric-grid">
          <div class="metric-tile"><strong>${toolOrder.length}</strong><span>free tools</span></div>
          <div class="metric-tile"><strong>${guides.length}</strong><span>guides</span></div>
          <div class="metric-tile"><strong>${landingPages.length}</strong><span>landing pages</span></div>
          <div class="metric-tile"><strong>free</strong><span>no signup exports</span></div>
        </div>
        <p class="help">Aggregate usage signals are reviewed internally before any sponsor fit review. Search visibility and ad-network eligibility are still validation gates, so this is an early partner inquiry surface rather than a guaranteed media buy.</p>
      </section>
      ${sponsorExternalDiscoveryProofHtml()}
      <section class="shell section">
        <h2>Early sponsor pilots</h2>
        <div class="grid-3">
          ${sponsorPlacements.map((item) => `<article class="panel"><h3>${escapeHtml(item.name)}</h3><p><strong>${escapeHtml(item.price)}</strong></p><p>${escapeHtml(item.fit)}</p><p>${escapeHtml(item.deliverable)}</p></article>`).join("")}
        </div>
        <p class="help">Prices are early validation anchors, not guaranteed inventory. Every placement still requires fit review and a separate external payment or agreement before any sponsor copy goes live.</p>
      </section>
      <section class="shell section">
        <h2>Sponsor pages by audience</h2>
        <p>These vertical pages make outreach clearer for partners who care about one audience instead of the whole tool library.</p>
        <div class="grid-3">
          ${sponsorVerticals.map((vertical) => `<article class="panel"><h3>${escapeHtml(vertical.title)}</h3><p>${escapeHtml(vertical.pitch)}</p><p><strong>${escapeHtml(vertical.priceHint)}</strong></p><p><a class="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="/sponsor/${escapeHtml(vertical.slug)}/">Open sponsor fit page</a></p></article>`).join("")}
        </div>
      </section>
      <section class="shell section">
        <h2>Media kit and outreach pack</h2>
        <p>The machine-readable media kit gives partners the current facts, placement rules, suggested sponsor categories, and copy-safe outreach templates.</p>
        <p><a class="button" href="/sponsor-media-kit.json">Open sponsor media kit JSON</a> <a class="button secondary" href="/sponsor-outreach-pack.json">Open outreach pack JSON</a> <a class="button ghost" href="/sponsor-deal-room.json">Open deal JSON</a></p>
      </section>
      <section class="shell section">
        <h2>Placement rules</h2>
        <ul>
          <li>Downloads stay free and cannot require an ad click, sponsor interaction, account, or payment.</li>
          <li>Sponsor copy must be clearly labeled and separated from generator controls.</li>
          <li>No gambling, adult, deceptive finance, malware, fake document, or misleading upload-service offers.</li>
          <li>No claim of guaranteed traffic, guaranteed compression, legal/tax advice, or official government acceptance.</li>
          <li>Payment, tax, bank, phone, and identity details stay in external official provider dashboards only.</li>
        </ul>
      </section>
      <section class="shell section">
        <h2>Inquiry checklist</h2>
        <p>Use the form above for a public-safe note with the company URL, audience fit, intended placement, and any policy requirements. Do not include private payment details, tax IDs, passwords, or customer files.</p>
        <p><a class="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(publicReplyUrl)}" target="_blank" rel="noreferrer">Open public-safe reply</a> <a class="button secondary" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="/tools.json">Open tools feed</a> <a class="button ghost" href="/privacy/">Privacy policy</a></p>
      </section>
    `;
    initSponsorLeadForms(app);
  }

  function renderSponsorStarterReviewPage() {
    const deal = sponsorDeals.find((item) => item.id === "starter-fit-review") || sponsorDeals[0];
    const vertical = sponsorVerticals[0];
    const reviewUrl = "/sponsor-starter-review/?utm_source=sponsor-outreach&utm_medium=organic&utm_campaign=sponsor_starter_review&utm_content=canonical#sponsor-inquiry";
    const publicReplyUrl = sponsorPublicReplyUrl(
      { name: "Sponsor team", website: "" },
      deal,
      vertical,
      reviewUrl,
    );
    setMeta("USD 49 Starter Sponsor Review", "Direct USD 49 starter sponsor review page for policy-fit partners who want a manual fit check before any visible placement or external invoice.");
    setJsonLd({
      "@context": "https://schema.org",
      "@type": "Offer",
      name: "PrintableTools Lab starter sponsor review",
      price: "49",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: absoluteSponsorUrl("/sponsor-starter-review/"),
      description: "Manual sponsor fit review before any visible placement or external invoice.",
    });
    app.innerHTML = `
      <section class="shell page-title section sponsor-hero sponsor-starter-hero">
        <a href="/sponsor-deal-room/">Sponsor deal room</a>
        <h1>USD 49 starter sponsor review for PrintableTools Lab</h1>
        <p>A short manual fit review for sponsors who want to know whether their product is safe, relevant, and worth discussing before any visible placement. No payment is collected on this page; invoice or agreement steps happen externally after policy fit.</p>
        <p><a class="button" data-sponsor-deal-select ${sponsorDealPrefillAttrs(deal)} data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="#sponsor-inquiry">Start USD 49 review</a> <a class="button secondary" data-sponsor-public-invoice-request data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(publicReplyUrl)}" target="_blank" rel="noreferrer">Open public invoice request</a> <a class="button ghost" href="/sponsor-deal-room.json">Open deal JSON</a></p>
      </section>
      ${renderSponsorLeadForm()}
      <section class="shell section">
        <h2>Starter fit review</h2>
        <div class="grid-3">
          <article class="panel"><h3>${escapeHtml(deal.title)}</h3><p><strong>${escapeHtml(deal.price)}</strong></p><p>${escapeHtml(deal.bestFor)}</p></article>
          <article class="panel"><h3>What it covers</h3><p>${escapeHtml(deal.deliverable)}</p><p class="help">Needed: ${escapeHtml(deal.proofNeeded)}</p></article>
          <article class="panel"><h3>Revenue gate</h3><p>This requests manual review only. Revenue is real only after a signed sponsor agreement or settled external payment is verified.</p></article>
        </div>
      </section>
      ${sponsorExternalDiscoveryProofHtml()}
      <section class="shell section">
        <h2>What the USD 49 review covers</h2>
        <div class="grid-2">
          <article class="panel"><h3>Product and category fit</h3><p>Checks whether the sponsor belongs near PDF, image, QR, classroom, career, or small-business utility pages without misleading visitors.</p></article>
          <article class="panel"><h3>Safe landing URL</h3><p>Reviews the public landing page for clear claims, relevant audience fit, and obvious exclusion risks before any copy is discussed.</p></article>
          <article class="panel"><h3>Best page family</h3><p>Recommends whether the sponsor is better suited to the deal room, a vertical sponsor page, a guide pilot, or no placement.</p></article>
          <article class="panel"><h3>Next-step copy</h3><p>Returns public-safe next-step wording for a sponsor inquiry, invoice request, or partner distribution test.</p></article>
        </div>
      </section>
      <section class="shell section">
        <h2>Policy limits</h2>
        <ul>
          <li>Downloads stay free and cannot require sponsor interaction, ad clicks, accounts, or payment.</li>
          <li>Sponsor copy must be clearly labeled and separated from generator controls.</li>
          <li>No gambling, adult, deceptive finance, malware, fake document, misleading upload-service, or unsafe claims.</li>
          <li>The starter review does not guarantee traffic, placement approval, ranking, or conversion.</li>
        </ul>
        <p><a class="button" href="/sponsor-media-kit.json">Open media kit</a> <a class="button secondary" href="/sponsor-deal-room/">Compare all sponsor options</a> <a class="button ghost" href="/privacy/">Privacy policy</a></p>
      </section>
    `;
    initSponsorLeadForms(app);
  }

  function renderSponsorDealRoomPage() {
    setMeta("Sponsor Deal Room for PrintableTools Lab", "Direct sponsor deal room with pilot pricing, fit rules, tracked sponsor paths, and the business-safe inquiry form for PrintableTools Lab.");
    app.innerHTML = `
      <section class="shell page-title section sponsor-hero">
        <a href="/sponsor/">Sponsor page</a>
        <h1>Sponsor deal room for PrintableTools Lab</h1>
        <p>A direct buyer-facing room for policy-fit sponsors who want a small, manually reviewed pilot around free PDF, image, QR, career, classroom, and small-business workflows. No payment is collected here; the next step is a qualified business inquiry and manual fit review.</p>
        <p><a class="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="#sponsor-inquiry">Start sponsor inquiry</a> <a class="button secondary" href="/sponsor-deal-room.json">Open deal JSON</a> <a class="button ghost" href="/sponsor-media-kit.json">Open media kit</a></p>
      </section>
      <section class="shell section">
        <h2>Available pilot deals</h2>
        <div class="grid-2">
          ${sponsorDeals.map((deal) => `<article class="panel"><h3>${escapeHtml(deal.title)}</h3><p><strong>${escapeHtml(deal.price)}</strong></p><p>${escapeHtml(deal.bestFor)}</p><p>${escapeHtml(deal.deliverable)}</p><p class="help">Needed: ${escapeHtml(deal.proofNeeded)}</p><p><a class="button" data-sponsor-deal-select ${sponsorDealPrefillAttrs(deal)} data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(deal.trackedUrl)}">Use this deal path</a></p></article>`).join("")}
        </div>
      </section>
      <section class="shell section">
        <h2>Copy-ready pilot request</h2>
        <div class="grid-2">
          ${sponsorDeals.filter((deal) => deal.id !== "partner-distribution-test").slice(0, 2).map((deal) => {
            const vertical = sponsorVerticals[0];
            const prospect = { id: deal.id, name: "Sponsor team", category: "Direct buyer", fitReason: deal.bestFor, vertical: vertical.slug };
            const copy = sponsorInvoiceRequestCopy(prospect, deal, vertical, deal.trackedUrl);
            return `<article class="panel"><h3>${escapeHtml(deal.title)}</h3><p><strong>${escapeHtml(deal.price)}</strong></p><p>${escapeHtml(deal.deliverable)}</p><p><button class="button" type="button" data-copy-text="${escapeHtml(copy)}" data-track-event="sponsor_request_intent" data-track-tool="sponsor">Copy invoice request</button></p></article>`;
          }).join("")}
        </div>
      </section>
      <section class="shell section">
        <h2>Best-fit sponsor categories</h2>
        <div class="grid-3">
          ${sponsorVerticals.map((vertical) => `<article class="panel"><h3>${escapeHtml(vertical.title)}</h3><p>${escapeHtml(vertical.sponsorFit)}</p><p><strong>${escapeHtml(vertical.priceHint)}</strong></p><p><a class="button secondary" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="/sponsor/${escapeHtml(vertical.slug)}/?utm_source=sponsor-deal-room&utm_medium=organic&utm_campaign=${escapeHtml(vertical.campaign)}&utm_content=vertical-card">Open vertical fit</a></p></article>`).join("")}
        </div>
      </section>
      ${sponsorExternalDiscoveryProofHtml()}
      <section class="shell section">
        <h2>What happens before money counts</h2>
        <div class="grid-3">
          <article class="panel"><h3>1. Qualified inquiry</h3><p>The sponsor submits business-safe details, website, audience fit, budget range, and timing through the form below.</p></article>
          <article class="panel"><h3>2. Manual fit review</h3><p>The placement is checked for relevance, visitor safety, label clarity, and policy exclusions before any sponsor copy is discussed.</p></article>
          <article class="panel"><h3>3. External agreement</h3><p>Revenue is real only after a signed sponsor agreement or settled external payment. Visits and clicks remain operating signals.</p></article>
        </div>
      </section>
      ${renderSponsorLeadForm()}
      <section class="shell section">
        <h2>Deal-room rules</h2>
        <ul>
          <li>Company/product fit must be relevant to free PDF, image, QR, career, classroom, or small-business workflows.</li>
          <li>Sponsor copy must be clearly labeled and manually approved before placement.</li>
          <li>Downloads stay free and cannot require sponsor interaction, ad clicks, accounts, or payment.</li>
          <li>No gambling, adult, deceptive finance, malware, fake document, misleading upload-service, or unsafe claims.</li>
        </ul>
        <p class="help">Revenue is real only after a sponsor agreement or settled external payment is verified. Deal-room visits, clicks, and lead submissions are operating signals.</p>
      </section>
    `;
    initSponsorLeadForms(app);
  }

  function renderSponsorProposalPage() {
    setMeta("Sponsor Proposal for PrintableTools Lab", "Noindex sponsor proposal page for one policy-fit partner, with a recommended pilot deal and prefilled inquiry path.");
    setMetaTag("robots", "noindex,follow");
    const params = new URLSearchParams(window.location.search || "");
    const prospect = sponsorProspectFromParams(params);
    const vertical = sponsorVerticals.find((item) => item.slug === prospect.vertical) || sponsorVerticals[0];
    const deal = sponsorDeals.find((item) => item.id === (params.get("deal") || prospect.dealId)) || sponsorDeals[1] || sponsorDeals[0];
    const dealUrl = sponsorProspectDealUrl(prospect, deal, vertical);
    const proposalUrl = sponsorProspectProposalUrl(prospect, deal, vertical);
    const pitch = sponsorProspectPitch(prospect, deal, vertical, proposalUrl);
    const invoiceRequest = sponsorInvoiceRequestCopy(prospect, deal, vertical, proposalUrl);
    const publicReplyUrl = sponsorPublicReplyUrl(prospect, deal, vertical, proposalUrl);
    app.innerHTML = `
      <section class="shell page-title section sponsor-hero">
        <a href="/sponsor-deal-room/">Sponsor deal room</a>
        <h1>${escapeHtml(prospect.name)} sponsor proposal</h1>
        <p>A direct, business-safe proposal for a small, clearly labeled sponsor pilot with PrintableTools Lab. Downloads stay free, sponsor copy is manually reviewed, and revenue is counted only after a signed agreement or settled external payment.</p>
        <p><a class="button" data-sponsor-public-invoice-request data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(publicReplyUrl)}" target="_blank" rel="noreferrer">Open public invoice request</a> <button class="button secondary" type="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" data-copy-text="${escapeHtml(invoiceRequest)}">Copy invoice request</button> <a class="button secondary" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="#sponsor-inquiry">Start inquiry</a> <a class="button ghost" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(dealUrl)}">Open deal room path</a> <button class="button ghost" type="button" data-copy-text="${escapeHtml(pitch)}">Copy outreach note</button></p>
      </section>
      <section class="shell section">
        <div class="notice sponsor-public-reply">
          <strong>Fast invoice-review path</strong>
          <p>This prefilled GitHub issue records a public-safe invoice review request for ${escapeHtml(prospect.name)} and ${escapeHtml(deal.title)}. It asks for fit review only; payment, tax, bank, phone, identity, password, and customer-file details stay outside the public issue.</p>
          <p><a class="button" data-sponsor-public-invoice-request data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(publicReplyUrl)}" target="_blank" rel="noreferrer">Open public invoice request</a> <button class="button secondary" type="button" data-copy-text="${escapeHtml(invoiceRequest)}">Copy invoice/agreement request</button></p>
        </div>
      </section>
      <section class="shell section">
        <h2>Why this is a fit</h2>
        <div class="grid-3">
          <article class="panel"><h3>Partner</h3><p><strong>${escapeHtml(prospect.name)}</strong></p><p>${escapeHtml(prospect.category)}</p></article>
          <article class="panel"><h3>Audience match</h3><p>${escapeHtml(prospect.fitReason)}</p></article>
          <article class="panel"><h3>Relevant vertical</h3><p><strong>${escapeHtml(vertical.title)}</strong></p><p>${escapeHtml(vertical.audience)}</p></article>
        </div>
        ${prospect.validationSignal ? `<div class="notice compact-notice"><strong>Current validation signal:</strong> ${escapeHtml(prospect.validationSignal)}</div>` : ""}
      </section>
      ${sponsorExternalDiscoveryProofHtml()}
      <section class="shell section">
        <h2>Recommended pilot</h2>
        <div class="grid-3">
          <article class="panel"><h3>${escapeHtml(deal.title)}</h3><p><strong>${escapeHtml(deal.price)}</strong></p><p>${escapeHtml(deal.bestFor)}</p></article>
          <article class="panel"><h3>Deliverable</h3><p>${escapeHtml(deal.deliverable)}</p></article>
          <article class="panel"><h3>Review needed</h3><p>${escapeHtml(deal.proofNeeded)}</p><p><a class="button ghost" data-sponsor-public-invoice-request data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(publicReplyUrl)}" target="_blank" rel="noreferrer">Open public invoice request</a></p></article>
        </div>
      </section>
      <section class="shell section">
        <h2>Relevant tool inventory</h2>
        <div class="cluster-links">
          ${vertical.links.map(([label, pathName]) => `<a href="/${escapeHtml(pathName)}/?utm_source=sponsor-proposal&utm_medium=proposal&utm_campaign=${escapeHtml(vertical.campaign)}&utm_content=${escapeHtml(prospect.id)}">${escapeHtml(label)}</a>`).join("")}
        </div>
      </section>
      ${renderSponsorLeadForm()}
      <section class="shell section">
        <h2>Proposal rules</h2>
        <ul>
          <li>Sponsor copy must be clearly labeled and manually approved before placement.</li>
          <li>Downloads stay free and cannot require sponsor interaction, ad clicks, accounts, or payment.</li>
          <li>No gambling, adult, deceptive finance, malware, fake document, misleading upload-service, or unsafe claims.</li>
          <li>Payment, tax, bank, private identity, phone, and customer-file details stay outside this form.</li>
        </ul>
        <p class="help">Proposal URL: ${escapeHtml(proposalUrl)}</p>
        <p><a class="button ghost" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(publicReplyUrl)}" target="_blank" rel="noreferrer">Open public-safe GitHub reply form</a></p>
      </section>
    `;
    applySponsorPublicInvoiceLinks(app, publicReplyUrl);
    initSponsorLeadForms(app);
    app.querySelectorAll("[data-sponsor-quick-form], [data-sponsor-lead-form]").forEach((form) => {
      applySponsorProspectPrefill(form, prospect, deal, vertical);
    });
  }

  function renderSponsorCallPage() {
    const starterReviewUrl = "/sponsor-starter-review/?utm_source=sponsor-call&utm_medium=organic&utm_campaign=sponsor_starter_review&utm_content=primary-cta&commitment=request-invoice#sponsor-inquiry";
    setMeta("Sponsor Call for PrintableTools Lab", "Public sponsor call for privacy-friendly PDF, image, QR, resume, classroom, and small-business workflow partners to request a labeled pilot placement.");
    app.innerHTML = `
      <section class="shell page-title section sponsor-hero">
        <a href="/sponsor/">Sponsor page</a>
        <h1>Sponsor call: privacy-friendly file and printable workflows</h1>
        <p>PrintableTools Lab is accepting a small number of manually reviewed sponsor and partner inquiries for free no-signup PDF, image, QR, resume, classroom, and small-business workflows. This public call is designed so partners can respond through the sponsor form instead of private outreach email.</p>
        <p><a class="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${starterReviewUrl}">Request USD 49 invoice review</a> <a class="button secondary" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="/sponsor-deal-room/?utm_source=sponsor-call&utm_medium=organic&utm_campaign=sponsor_deal_room&utm_content=secondary-cta">Open deal room</a> <a class="button ghost" href="/sponsor-call.json">Open sponsor call JSON</a> <a class="button ghost" href="/sponsor-media-kit.json">Open media kit</a></p>
      </section>
      <section class="shell section">
        <h2>Current sponsor openings</h2>
        <div class="grid-3">
          ${sponsorCallActions.map((item) => `<article class="panel"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.audience)}</p><p><a class="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(item.url)}">Open tracked path</a></p><p class="help">${escapeHtml(item.signal)}</p></article>`).join("")}
        </div>
      </section>
      ${sponsorExternalDiscoveryProofHtml()}
      <section class="shell section">
        <h2>Audience-specific sponsor pages</h2>
        <div class="grid-3">
          ${sponsorVerticals.map((vertical) => `<article class="panel"><h3>${escapeHtml(vertical.title)}</h3><p>${escapeHtml(vertical.pitch)}</p><p><strong>${escapeHtml(vertical.priceHint)}</strong></p><p><a class="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="/sponsor/${escapeHtml(vertical.slug)}/?utm_source=sponsor-call&utm_medium=organic&utm_campaign=${escapeHtml(vertical.campaign)}">Open fit page</a></p></article>`).join("")}
        </div>
      </section>
      <section class="shell section">
        <h2>Rules before any placement</h2>
        <ul>
          <li>Downloads stay free and cannot require ad clicks, sponsor interactions, accounts, or payment.</li>
          <li>Sponsor copy must be clearly labeled and separated from generator controls.</li>
          <li>No gambling, adult, deceptive finance, malware, fake document, or misleading upload-service offers.</li>
          <li>Revenue counts only after a qualified inquiry, signed agreement, or settled external payment is verified.</li>
          <li>Do not submit private payment, tax, phone, bank, identity, password, or customer-file details.</li>
        </ul>
      </section>
    `;
  }

  function renderSponsorOpportunitiesPage() {
    const inquiryUrl = "/sponsor/?utm_source=sponsor-opportunities&utm_medium=organic&utm_campaign=sponsor_opportunities&utm_content=board#sponsor-inquiry";
    const starterReviewUrl = "/sponsor-starter-review/?utm_source=sponsor-opportunities&utm_medium=organic&utm_campaign=sponsor_starter_review&utm_content=board-hero&commitment=request-invoice#sponsor-inquiry";
    setMeta("Sponsor Opportunities for PrintableTools Lab", "Crawlable sponsor opportunity board for PDF API, QR marketing, resume, classroom, and small-business workflow partners interested in labeled pilot placements.");
    app.innerHTML = `
      <section class="shell page-title section sponsor-hero">
        <a href="/sponsor-call/">Sponsor call</a>
        <h1>Sponsor opportunities for free PDF, image, and QR workflows</h1>
        <p>This board lists the current policy-fit sponsor categories for PrintableTools Lab. It is built for partners, resource pages, newsletters, and crawlers that need a concise view of the available audiences without private outreach or payment details.</p>
        <p><a class="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${starterReviewUrl}">Request USD 49 invoice review</a> <a class="button secondary" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${inquiryUrl}">Send sponsor inquiry</a> <a class="button ghost" href="/sponsor-opportunities.json">Open opportunities JSON</a> <a class="button ghost" href="/sponsor-intent-feed.json">Open intent feed</a> <a class="button ghost" href="/sponsor-media-kit.json">Open media kit</a></p>
      </section>
      <section class="shell section">
        <h2>Sponsor prospect paths</h2>
        <div class="grid-3">
          ${sponsorVerticals.map((vertical) => `<article class="panel"><h3>${escapeHtml(vertical.title)}</h3><p>${escapeHtml(vertical.sponsorFit)}</p><p><strong>Request USD 49 invoice review</strong></p><p><a class="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${sponsorVerticalInvoiceReviewUrl(vertical)}">Request invoice review for this audience</a></p></article>`).join("")}
        </div>
      </section>
      <section class="shell section">
        <h2>Open sponsor audiences</h2>
        <div class="grid-3">
          ${sponsorVerticals.map((vertical) => `<article class="panel"><h3>${escapeHtml(vertical.title)}</h3><p>${escapeHtml(vertical.audience)}</p><p><strong>${escapeHtml(vertical.priceHint)}</strong></p><p><a class="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="/sponsor/${escapeHtml(vertical.slug)}/?utm_source=sponsor-opportunities&utm_medium=organic&utm_campaign=${escapeHtml(vertical.campaign)}&utm_content=board">Open tracked fit page</a></p></article>`).join("")}
        </div>
      </section>
      <section class="shell section">
        <h2>Good-fit sponsor categories</h2>
        <div class="grid-2">
          ${sponsorVerticals.map((vertical) => `<article class="panel"><h3>${escapeHtml(vertical.title)}</h3><ul>${vertical.sponsorCategories.map((category) => `<li>${escapeHtml(category)}</li>`).join("")}</ul></article>`).join("")}
        </div>
      </section>
      ${sponsorExternalDiscoveryProofHtml()}
      <section class="shell section">
        <h2>Placement options</h2>
        <div class="grid-3">
          ${sponsorPlacements.map((item) => `<article class="panel"><h3>${escapeHtml(item.name)}</h3><p><strong>${escapeHtml(item.price)}</strong></p><p>${escapeHtml(item.deliverable)}</p></article>`).join("")}
        </div>
      </section>
      <section class="shell section">
        <h2>Safety and revenue gate</h2>
        <ul>
          <li>Use this board only for policy-fit sponsor and partner discovery.</li>
          <li>Downloads stay free and cannot require ad clicks, sponsor interaction, accounts, or payment.</li>
          <li>Sponsor copy must be clearly labeled and manually reviewed before placement.</li>
          <li>Do not send payment, tax, bank, phone, private identity, passwords, or customer files through this site.</li>
        </ul>
        <p>A real qualified sponsor inquiry, signed agreement, or settled external payment is required. Views and clicks alone are not revenue.</p>
      </section>
    `;
  }

  function renderSponsorVerticalPage(vertical) {
    const placement = sponsorPlacements.find((item) => item.id === vertical.primaryPlacementId) || sponsorPlacements[0];
    const trackedUrl = `${window.location.origin}/sponsor/${vertical.slug}?utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=${encodeURIComponent(vertical.campaign)}`;
    setMeta(vertical.title, vertical.description);
    app.innerHTML = `
      <section class="shell page-title section sponsor-hero">
        <a href="/sponsor/">All sponsor options</a>
        <h1>${escapeHtml(vertical.title)}</h1>
        <p>${escapeHtml(vertical.description)}</p>
        <p><a class="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="#sponsor-inquiry">Send sponsor inquiry</a> <a class="button secondary" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(trackedUrl)}">Copy tracked landing link</a> <a class="button ghost" href="/sponsor-media-kit.json">Open media kit</a></p>
      </section>
      <section class="shell section">
        <h2>Audience fit</h2>
        <div class="grid-2">
          <article class="panel"><h3>Who this reaches</h3><p>${escapeHtml(vertical.audience)}</p></article>
          <article class="panel"><h3>Best sponsor fit</h3><p>${escapeHtml(vertical.sponsorFit)}</p></article>
        </div>
      </section>
      ${sponsorExternalDiscoveryProofHtml()}
      <section class="shell section">
        <h2>Pilot offer</h2>
        <div class="grid-3">
          <article class="panel"><h3>${escapeHtml(placement.name)}</h3><p><strong>${escapeHtml(vertical.priceHint)}</strong></p><p>${escapeHtml(placement.deliverable)}</p></article>
          <article class="panel"><h3>Manual approval</h3><p>Every inquiry is reviewed for relevance, policy fit, and visitor safety before sponsor copy is discussed.</p></article>
          <article class="panel"><h3>Revenue gate</h3><p>Clicks and form fills are validation. Revenue counts only after a signed agreement or settled external payment.</p></article>
        </div>
      </section>
      ${renderSponsorLeadForm()}
      <section class="shell section">
        <h2>Relevant tool inventory</h2>
        <div class="cluster-links">
          ${vertical.links.map(([label, pathName]) => `<a data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="/${escapeHtml(pathName)}/">${escapeHtml(label)}</a>`).join("")}
        </div>
      </section>
      <section class="shell section">
        <h2>Good-fit sponsor categories</h2>
        <ul>
          ${vertical.sponsorCategories.map((category) => `<li>${escapeHtml(category)}</li>`).join("")}
        </ul>
        <p class="help">Not accepted: gambling, adult, deceptive finance, malware, fake document, misleading upload-service offers, or any placement that gates free downloads.</p>
      </section>
    `;
    initSponsorLeadForms(app);
  }

  function renderSponsorLeadForm() {
    const defaultDeal = sponsorDeals.find((deal) => deal.id === DEFAULT_SPONSOR_DEAL_ID) || sponsorDeals[0];
    const defaultVertical = sponsorVerticals[0];
    const publicReplyUrl = sponsorPublicReplyUrl(
      { name: "Sponsor team", website: "" },
      defaultDeal,
      defaultVertical,
      defaultDeal?.trackedUrl || "/sponsor-deal-room/",
    );
    return `
      <section id="sponsor-inquiry" class="shell section">
        <div class="grid-2">
          <div>
            <h2>Sponsorship inquiry form</h2>
            <p>Share only business-safe details. The inquiry is stored for follow-up review, while public dashboards show only aggregate lead counts.</p>
            <div class="notice sponsor-close-path">
              <strong>Fastest paid pilot path</strong>
              <p>Start with the USD 49 starter fit review. The fast form needs only business email and website; the public invoice request opens a prefilled GitHub issue when a partner wants a verifiable request without using site storage.</p>
              <p><a class="button" data-sponsor-deal-select ${sponsorDealPrefillAttrs(defaultDeal)} data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="#sponsor-inquiry">Use USD 49 starter review</a> <a class="button secondary" data-sponsor-public-invoice-request data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(publicReplyUrl)}" target="_blank" rel="noreferrer">Open public invoice request</a></p>
            </div>
            <ul>
              <li>Best fit: relevant PDF, image, QR, productivity, classroom, career, or small-business tools.</li>
              <li>Not accepted: gambling, adult, deceptive finance, malware, fake document, or misleading upload-service offers.</li>
              <li>Payment, tax, bank, phone, and private identity details stay outside this form.</li>
            </ul>
            <div class="notice sponsor-public-reply">
              <strong>Prefer a public-safe reply?</strong>
              <p>Public-safe reply form: open a prefilled USD 49 invoice-review issue with only public company, website, fit, and deal context. Do not include payment, tax, bank, phone, identity, password, or customer-file details.</p>
              <p><a class="button ghost" data-sponsor-public-invoice-request data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(publicReplyUrl)}" target="_blank" rel="noreferrer">Open public invoice request</a></p>
            </div>
          </div>
          <form class="panel form-grid sponsor-quick-form" data-sponsor-quick-form>
            <input class="sr-only" type="text" name="websiteTrap" tabindex="-1" autocomplete="off" aria-hidden="true">
            <input type="hidden" name="dealId">
            <h3>2-minute pilot invoice review</h3>
            <p class="help">Pick a starter pilot and send two business-safe fields. This requests manual fit review only; any invoice or agreement is sent later through an external provider.</p>
            <label class="field sponsor-deal-picker">
              <span>Selected pilot</span>
              <select name="quickDealId" data-sponsor-quick-deal>
                ${sponsorQuickDealOptions()}
              </select>
            </label>
            <label class="field">
              <span>Company or project (optional)</span>
              <input name="company" maxlength="90" autocomplete="organization" placeholder="Auto-filled from website if blank">
            </label>
            <label class="field">
              <span>Business email</span>
              <input name="contactEmail" type="email" maxlength="140" autocomplete="email" required>
            </label>
            <label class="field">
              <span>Website</span>
              <input name="website" type="url" maxlength="220" placeholder="https://example.com" autocomplete="url" required>
            </label>
            <div class="actions">
              <button class="button" type="submit" data-track-event="sponsor_request_intent" data-track-tool="sponsor">Request pilot invoice review</button>
            </div>
            <p class="notice compact-notice" data-sponsor-quick-summary>Selected pilot: Starter fit review - USD 49. No payment is collected here.</p>
            <p class="help sponsor-lead-status" data-sponsor-lead-status role="status" aria-live="polite">No payment is collected here. Fit is reviewed manually first.</p>
          </form>
          <form class="panel form-grid sponsor-lead-form" data-sponsor-lead-form>
            <input class="sr-only" type="text" name="websiteTrap" tabindex="-1" autocomplete="off" aria-hidden="true">
            <input type="hidden" name="dealId">
            <label class="field">
              <span>Company or project</span>
              <input name="company" maxlength="90" autocomplete="organization" required>
            </label>
            <label class="field">
              <span>Business email</span>
              <input name="contactEmail" type="email" maxlength="140" autocomplete="email" required>
            </label>
            <label class="field">
              <span>Website</span>
              <input name="website" type="url" maxlength="220" placeholder="https://example.com" autocomplete="url" required>
            </label>
            <div class="grid-2 compact-form-grid">
              <label class="field">
                <span>Placement interest</span>
                <select name="placement">
                  <option value="media-kit-review">Media kit review</option>
                  <option value="directory-visibility">Directory visibility</option>
                  <option value="content-sponsorship">Content sponsorship</option>
                  <option value="partner-distribution">Partner distribution</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label class="field">
                <span>Budget range</span>
                <select name="budgetRange">
                  <option value="exploratory">Exploratory</option>
                  <option value="under-250">Under USD 250</option>
                  <option value="250-500">USD 250-500</option>
                  <option value="500-1000">USD 500-1000</option>
                  <option value="1000-plus">USD 1000+</option>
                </select>
              </label>
            </div>
            <label class="field">
              <span>Timeline</span>
              <select name="timeline">
                <option value="exploratory">Exploratory</option>
                <option value="this-week">This week</option>
                <option value="this-month">This month</option>
                <option value="later">Later</option>
              </select>
            </label>
            <label class="field">
              <span>Next step</span>
              <select name="commitment">
                <option value="question-only">Question or fit review</option>
                <option value="request-invoice">Request pilot invoice</option>
                <option value="ready-this-month">Ready to start this month</option>
              </select>
            </label>
            <label class="field">
              <span>Audience fit</span>
              <textarea name="audienceFit" maxlength="420" required placeholder="Why your product or partnership helps free PDF, image, QR, classroom, career, or small-business tool users."></textarea>
            </label>
            <label class="field">
              <span>Notes</span>
              <textarea name="notes" maxlength="1000" placeholder="Placement requirements, policy notes, geography, campaign idea, or useful public context."></textarea>
            </label>
            <p class="notice" data-sponsor-deal-status>Choose a deal above to prefill placement, budget, timeline, and next step.</p>
            <label class="check-row">
              <input name="consent" type="checkbox" required>
              <span>I am sending a business inquiry and will not include payment, tax, private identity, passwords, or customer files.</span>
            </label>
            <div class="actions">
              <button class="button" type="submit" data-track-event="sponsor_request_intent" data-track-tool="sponsor">Send inquiry</button>
              <a class="button ghost" href="/privacy/">Privacy policy</a>
            </div>
            <p class="help sponsor-lead-status" data-sponsor-lead-status role="status" aria-live="polite">No payment is collected here. Invoice requests are reviewed manually and handled only through an external provider.</p>
          </form>
        </div>
      </section>`;
  }

  function renderDashboard() {
    setMeta("Local Validation Dashboard", "Local browser dashboard for PrintableTools Lab validation events.");
    const events = getEvents();
    const totals = summarizeEvents(events);
    const localGenerations = (totals.generate_pdf || 0) + (totals.generate_file || 0);
    const localDownloads = (totals.download_pdf || 0) + (totals.download_file || 0);
    app.innerHTML = `
      <section class="shell dashboard">
        <h1>Local validation dashboard</h1>
        <p class="lead">This zero-cost version records events in localStorage. After launch, supplement this with Search Console, Analytics, and platform revenue data.</p>
        <div class="metric-grid">
          <div class="metric-tile"><strong>${totals.page_view || 0}</strong><span>page views</span></div>
          <div class="metric-tile"><strong>${localGenerations}</strong><span>generations</span></div>
          <div class="metric-tile"><strong>${localDownloads}</strong><span>downloads</span></div>
          <div class="metric-tile"><strong>${totals.limit_hit || 0}</strong><span>limit hits</span></div>
        </div>
        <div class="panel">
          <h2>Live site signals</h2>
          <p class="help">Cloudflare-hosted counters show whether real visitors are generating and downloading files. They are approximate and anonymous.</p>
          <div id="remoteMetrics" class="metric-remote">Loading live metrics...</div>
        </div>
        <div class="panel">
          <h2>Validation gates</h2>
          <p><strong>30-day continue gate:</strong> 100 downloads, 300 tool generations, or growing Search Console impressions. If no search exposure or downloads after 60 days, pause this track and test another ad-supported route.</p>
          <p><strong>Configured integrations:</strong> Analytics ${CONFIG.enableAnalytics && CONFIG.googleAnalyticsId ? "on" : "off"}, AdSense ${CONFIG.enableAds && CONFIG.adsenseClientId ? "on" : "off"}.</p>
          <div class="actions">
            <button class="button" id="exportCsv">Export CSV</button>
            <button class="button secondary" id="clearData">Clear local data</button>
          </div>
        </div>
        <div class="section">
          <h2>Recent events</h2>
          <div class="preview-stage">
            <table class="event-table">
              <thead><tr><th>Time</th><th>Event</th><th>Details</th></tr></thead>
              <tbody>${events.slice(-60).reverse().map((event) => `<tr><td>${escapeHtml(new Date(event.time).toLocaleString())}</td><td>${escapeHtml(event.name)}</td><td>${escapeHtml(JSON.stringify(event.data || {}))}</td></tr>`).join("") || `<tr><td colspan="3">No events yet.</td></tr>`}</tbody>
            </table>
          </div>
        </div>
      </section>
    `;
    document.getElementById("exportCsv").addEventListener("click", exportEventsCsv);
    document.getElementById("clearData").addEventListener("click", () => {
      if (confirm("Clear local validation events and daily count?")) {
        localStorage.removeItem("ptl_events");
        localStorage.removeItem("ptl_daily");
        renderDashboard();
      }
    });
    loadRemoteMetrics();
  }

  function renderOpsMonitor() {
    setMeta("Project Operations Monitor", "Noindex operations monitor for project traffic, source, path, tool, game, and monetization signals.");
    app.innerHTML = `
      <section class="shell dashboard ops-monitor">
        <div class="section-head">
          <div>
            <h1>Project operations monitor</h1>
            <p>Aggregate traffic and monetization signals for the active money projects. This page shows counts only, not private sponsor or service lead details.</p>
          </div>
          <div class="actions">
            <a class="button secondary" href="/api/ops-metrics" target="_blank" rel="noreferrer">Open JSON</a>
            <button class="button" id="refreshOpsMetrics" type="button">Refresh</button>
          </div>
        </div>
        <div id="opsMetrics" class="metric-remote">Loading project metrics...</div>
      </section>
    `;
    document.getElementById("refreshOpsMetrics").addEventListener("click", loadOpsMetrics);
    loadOpsMetrics();
  }

  async function loadOpsMetrics() {
    const target = document.getElementById("opsMetrics");
    if (!target) return;
    target.innerHTML = `<p class="help">Loading live project metrics...</p>`;
    try {
      const response = await fetch("/api/ops-metrics", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error("Metrics unavailable");
      const projects = Array.isArray(data.projects) ? data.projects : [];
      const leadCheck = await loadSponsorLeadCheck();
      const publicReplies = await loadSponsorPublicReplies();
      const serviceLeadCheck = await loadServiceLeadCheck();
      const totals = data.totals || {};
      const totalDownloads = (totals.download_pdf || 0) + (totals.download_file || 0);
      const totalGenerations = (totals.generate_pdf || 0) + (totals.generate_file || 0);
      const totalGameIntent = (totals.game_play_intent || 0) + (totals.game_fullscreen_open || 0) + (totals.game_embed_open || 0);
      const sponsorInvoiceRequests = data.sponsorInvoiceRequests || totals.sponsor_invoice_request || 0;
      const serviceLeadCount = Number.isFinite(Number(serviceLeadCheck?.leadCount)) ? Number(serviceLeadCheck.leadCount) : 0;
      const dataQualityNotice = data.dataQuality && data.dataQuality !== "rollup"
        ? `<p class="notice">Metrics are using a protected baseline because live KV reads are currently limited. Treat counts as conservative until the API returns rollup quality again.</p>`
        : "";
      target.innerHTML = `
        ${dataQualityNotice}
        <div class="metric-grid ops-summary-grid">
          <div class="metric-tile"><strong>${totals.page_view || 0}</strong><span>all page views</span></div>
          <div class="metric-tile"><strong>${data.todayTotals?.page_view || 0}</strong><span>today views</span></div>
          <div class="metric-tile"><strong>${totalDownloads}</strong><span>tool downloads</span></div>
          <div class="metric-tile"><strong>${totalGenerations}</strong><span>tool generations</span></div>
          <div class="metric-tile"><strong>${data.sponsorLeads || 0}</strong><span>sponsor leads</span></div>
          <div class="metric-tile"><strong>${serviceLeadCount}</strong><span>service leads</span></div>
          <div class="metric-tile"><strong>${sponsorInvoiceRequests}</strong><span>invoice requests</span></div>
          <div class="metric-tile"><strong>${totalGameIntent}</strong><span>game play signals</span></div>
        </div>
        ${checkoutActivationHtml(totals)}
        ${leadToPaymentCloseHtml(data, leadCheck, serviceLeadCheck, publicReplies)}
        ${sponsorSprintHtml(data, leadCheck, publicReplies)}
        ${serviceLeadCheckHtml(serviceLeadCheck)}
        <div class="ops-project-list">
          ${projects.map(projectOpsHtml).join("") || `<div class="panel"><p>No project rows returned yet.</p></div>`}
        </div>
        <div class="panel">
          <h2>Global source mix</h2>
          ${opsTable(["Source", "Views", "Today", "Downloads", "Depth", "Sponsor intent", "Game intent"], activeRows(data.sources || [], sourceScore).slice(0, 12).map((row) => [
            row.source,
            row.page_view || 0,
            row.today_page_view || 0,
            (row.download_pdf || 0) + (row.download_file || 0),
            (row.free_tool_depth || 0) + (row.guide_depth || 0),
            row.sponsor_request_intent || 0,
            (row.game_play_intent || 0) + (row.game_fullscreen_open || 0) + (row.game_embed_open || 0),
          ]))}
        </div>
        <div class="panel">
          <h2>Operating actions</h2>
          ${opsActionList(data.nextActions || [])}
        </div>
        <p class="help">Revenue is still counted only after a platform balance, sponsor agreement, or settled payment is verified. Views and clicks are operating signals, not money.</p>
      `;
    } catch (error) {
      target.innerHTML = `
        ${sponsorSprintHtml({ totals: {}, projects: [] }, null, null)}
        <div class="panel"><p>Live project metrics are not available yet.</p><p class="help">${escapeHtml(error.message || "Metrics unavailable")}</p></div>
      `;
    }
  }

  async function loadSponsorLeadCheck() {
    try {
      const response = await fetch("/api/sponsor-lead", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error("Sponsor lead check unavailable");
      return data;
    } catch (error) {
      return { ok: false, dataQuality: "unavailable", dataWarning: error.message || "Sponsor lead check unavailable" };
    }
  }

  async function loadSponsorPublicReplies() {
    try {
      const response = await fetch("/api/sponsor-public-replies", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error("Sponsor public replies unavailable");
      return data;
    } catch (error) {
      return { ok: false, available: false, dataQuality: "unavailable", dataWarning: error.message || "Sponsor public replies unavailable", publicReplyCount: 0, invoiceRequestCount: 0, readyForReviewCount: 0 };
    }
  }

  async function loadServiceLeadCheck() {
    try {
      const response = await fetch("/api/service-lead", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error("Service lead check unavailable");
      return data;
    } catch (error) {
      return { ok: false, dataQuality: "unavailable", dataWarning: error.message || "Service lead check unavailable" };
    }
  }

  function serviceLeadCheckHtml(serviceLeadCheck) {
    if (!serviceLeadCheck) return "";
    const quality = serviceLeadCheck.dataQuality || "unknown";
    const leadCount = Number.isFinite(Number(serviceLeadCheck.leadCount)) ? Number(serviceLeadCheck.leadCount) : "n/a";
    const serviceCount = Number.isFinite(Number(serviceLeadCheck.serviceRequestCount)) ? Number(serviceLeadCheck.serviceRequestCount) : "n/a";
    const auditCount = Number.isFinite(Number(serviceLeadCheck.auditRequestCount)) ? Number(serviceLeadCheck.auditRequestCount) : "n/a";
    const sellerCount = Number.isFinite(Number(serviceLeadCheck.sellerKitRequestCount)) ? Number(serviceLeadCheck.sellerKitRequestCount) : "n/a";
    const latest = serviceLeadCheck.latestCreatedAt || "none";
    const warning = serviceLeadCheck.dataWarning ? `<p class="notice">${escapeHtml(serviceLeadCheck.dataWarning)}</p>` : "";
    return `
      <div class="notice sponsor-lead-check service-lead-check">
        <strong>Service lead index check</strong>
        <p>Private details stay hidden. Public-safe check: ${escapeHtml(String(leadCount))} indexed service lead(s), ${escapeHtml(String(serviceCount))} paid setup request(s), ${escapeHtml(String(auditCount))} free audit request(s), ${escapeHtml(String(sellerCount))} seller kit request(s), latest ${escapeHtml(latest)}, quality ${escapeHtml(quality)}.</p>
        <p><a href="/api/service-lead" target="_blank" rel="noreferrer">Open public-safe service lead JSON</a></p>
        ${warning}
      </div>
    `;
  }

  function numberSignal(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function leadToPaymentCloseRows(data = {}, leadCheck = {}, serviceLeadCheck = {}, publicReplies = {}) {
    const totals = data.totals || {};
    const sponsorLeads = Math.max(numberSignal(data.sponsorLeads), numberSignal(totals.sponsor_lead_submit), numberSignal(leadCheck?.leadCount));
    const sponsorInvoiceRequests = Math.max(numberSignal(data.sponsorInvoiceRequests), numberSignal(totals.sponsor_invoice_request), numberSignal(leadCheck?.invoiceRequestCount), numberSignal(publicReplies?.invoiceRequestCount));
    const serviceRequests = numberSignal(serviceLeadCheck?.serviceRequestCount);
    const auditRequests = numberSignal(serviceLeadCheck?.auditRequestCount);
    const sellerRequests = numberSignal(serviceLeadCheck?.sellerKitRequestCount);
    const serviceTypes = serviceLeadCheck?.serviceTypes || {};
    const invoiceFollowupRequests = numberSignal(serviceTypes["invoice-followup-copy-pack"]);
    const localPrintRequests = numberSignal(serviceTypes["custom-local-print-pack"]);
    const serviceIntent = numberSignal(totals.service_request_intent);
    const auditIntent = numberSignal(totals.audit_request_intent);
    const sellerIntent = numberSignal(totals.seller_checkout_intent);
    const sponsorIntent = numberSignal(totals.sponsor_request_intent);
    return [
      {
        lane: "$29 service setup",
        signal: `${localPrintRequests} lead(s), ${serviceIntent} request intent`,
        state: localPrintRequests ? "lead captured" : serviceIntent ? "intent only" : "waiting",
        nextAction: localPrintRequests
          ? "Export service leads, confirm fit, then send the external checkout or invoice reply."
          : "Keep the request form live and use the payment reply as soon as a qualified service lead arrives.",
        proofGate: "paid_order_verified from external provider",
        command: "npm.cmd run service:leads",
        copy: serviceLeadPaymentReplyCopy({ serviceType: "custom-local-print-pack", path: "/custom-local-print-pack/" }),
        link: "/api/service-lead",
      },
      {
        lane: "$19 invoice follow-up copy",
        signal: `${invoiceFollowupRequests} lead(s), ${serviceIntent} shared service intent`,
        state: invoiceFollowupRequests ? "lead captured" : "waiting",
        nextAction: invoiceFollowupRequests
          ? "Export service leads, confirm the invoice copy scope, then send the external checkout or invoice reply."
          : "Keep the invoice download form live and use this reply as soon as a qualified invoice follow-up lead arrives.",
        proofGate: "paid_order_verified from external provider",
        command: "npm.cmd run service:leads",
        copy: serviceLeadPaymentReplyCopy({ serviceType: "invoice-followup-copy-pack", path: "/invoice-followup-copy-pack/" }),
        link: "/api/service-lead",
      },
      {
        lane: "Free audit to $29 upgrade",
        signal: `${auditRequests} audit lead(s), ${auditIntent} audit intent`,
        state: auditRequests ? "audit follow-up" : auditIntent ? "intent only" : "waiting",
        nextAction: auditRequests
          ? "Export the audit lead, send useful free checks, then offer the $29 setup only if they want assembly."
          : "Use the audit as a low-friction lead magnet before asking for a paid setup.",
        proofGate: "separate paid setup order",
        command: "npm.cmd run service:leads",
        copy: serviceLeadPaymentReplyCopy({ serviceType: "market-table-print-audit", path: "/market-table-print-audit/" }),
        link: "/market-table-print-audit/",
      },
      {
        lane: "$9 seller kit",
        signal: `${sellerRequests} seller request(s), ${sellerIntent} checkout intent`,
        state: sellerRequests ? "buyer requested" : sellerIntent ? "intent only" : "waiting",
        nextAction: sellerRequests
          ? "Export seller kit requests and reply with the real external checkout link once the product is configured."
          : "Connect a real checkout URL before treating clicks as purchase demand.",
        proofGate: "paid digital product order",
        command: "npm.cmd run service:leads",
        copy: serviceLeadPaymentReplyCopy({ serviceType: "local-seller-starter-kit", path: "/local-seller-starter-kit/" }),
        link: "/local-seller-starter-kit/",
      },
      {
        lane: "Sponsor invoice review",
        signal: `${sponsorInvoiceRequests} invoice request(s), ${sponsorLeads} lead(s), ${sponsorIntent} intent`,
        state: sponsorInvoiceRequests ? "invoice review" : sponsorLeads ? "lead captured" : sponsorIntent ? "intent only" : "waiting",
        nextAction: sponsorInvoiceRequests || sponsorLeads
          ? "Export sponsor leads, verify policy fit, then send only an external invoice or agreement."
          : "Use the starter review path for sponsor clicks until a qualified lead arrives.",
        proofGate: "signed sponsor agreement or settled external payment",
        command: "npm.cmd run sponsor:leads",
        copy: leadToPaymentSponsorInvoiceCopy(),
        link: "/sponsor-starter-review/?utm_source=ops&utm_medium=internal&utm_campaign=lead_close&utm_content=close-cockpit&commitment=request-invoice#sponsor-inquiry",
      },
    ];
  }

  function leadToPaymentCloseHtml(data = {}, leadCheck = {}, serviceLeadCheck = {}, publicReplies = {}) {
    const rows = leadToPaymentCloseRows(data, leadCheck, serviceLeadCheck, publicReplies);
    const activeRows = rows.filter((row) => !String(row.state).includes("waiting"));
    const urgentRows = rows.filter((row) => /lead|invoice|buyer|audit/i.test(row.state));
    return `
      <section class="panel ops-lead-close-cockpit">
        <div class="ops-project-head">
          <div>
            <p class="eyebrow">cash close</p>
            <h2>Lead-to-payment close cockpit</h2>
            <p>${urgentRows.length ? "A captured lead or invoice signal exists. Use the matching export and payment reply, then count revenue only after outside proof." : "No captured buyer lead yet. The close runbook is ready for the first qualified service, seller-kit, or sponsor request."}</p>
          </div>
          <div class="actions">
            <a class="button secondary" href="/api/service-lead" target="_blank" rel="noreferrer">Open service index</a>
            <a class="button ghost" href="/api/sponsor-lead" target="_blank" rel="noreferrer">Open sponsor index</a>
          </div>
        </div>
        <div class="metric-grid compact ops-project-grid">
          <div class="metric-tile"><strong>${activeRows.length}/${rows.length}</strong><span>active close lanes</span></div>
          <div class="metric-tile"><strong>${rows.filter((row) => row.state === "lead captured" || row.state === "buyer requested" || row.state === "audit follow-up" || row.state === "invoice review").length}</strong><span>needs reply</span></div>
          <div class="metric-tile"><strong>external only</strong><span>payment channel</span></div>
          <div class="metric-tile"><strong>paid proof</strong><span>revenue gate</span></div>
        </div>
        ${opsTable(["Lane", "Signal", "State", "Next cash action", "Proof gate"], rows.map((row) => [
          row.lane,
          row.signal,
          row.state,
          row.nextAction,
          row.proofGate,
        ]))}
        <div class="ops-action-list">
          ${rows.map((row) => `
            <article class="ops-action-card lead-close-card">
              <div>
                <p class="eyebrow">${escapeHtml(row.state)}</p>
                <h4>${escapeHtml(row.lane)}</h4>
                <p>${escapeHtml(row.nextAction)}</p>
                <p class="help">Close proof: ${escapeHtml(row.proofGate)}. Requests, clicks, exports, and copied replies are not revenue.</p>
              </div>
              <div class="ops-action-buttons">
                <button class="button secondary" type="button" data-copy-text="${escapeHtml(row.copy)}">Copy payment reply</button>
                <button class="button ghost" type="button" data-copy-text="${escapeHtml(row.command)}">Copy export command</button>
                <a class="button ghost" href="${escapeHtml(row.link)}" target="_blank" rel="noreferrer">Open lane</a>
              </div>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }

  function serviceLeadPaymentReplyCopy(values = {}) {
    const serviceType = values.serviceType || "custom-local-print-pack";
    const sourcePath = absoluteUrl(values.path || getCurrentRoutePath());
    if (serviceType === "local-seller-starter-kit") {
      return [
        "Subject: Local Seller Starter Kit checkout link",
        "",
        "Thanks for requesting the Local Seller Starter Kit.",
        "",
        "Price: $9 USD",
        `Request source: ${sourcePath}`,
        "",
        "Next step: I will send the real external checkout link. Please pay only through that external provider and do not send card, bank, payout, tax, identity, password, or private customer-list details through the website, GitHub, or email.",
        "",
        "After the external provider shows a paid order, the editable starter kit files can be delivered. Revenue is counted only from that paid or settled provider record.",
      ].join("\n");
    }
    if (serviceType === "market-table-print-audit") {
      return [
        "Subject: Free market table print audit next steps",
        "",
        "Thanks for sending the public-safe audit details.",
        "",
        "I will check whether your current table/sign/price/QR/flyer flow has obvious printable gaps. The audit itself is free and does not count as revenue.",
        "",
        "If you want the first pack assembled after the audit, the optional Custom Local Print Pack Setup is $29 USD. That paid setup starts only after fit is confirmed and a real external checkout or invoice is paid.",
        `Request source: ${sourcePath}`,
        "",
        "Please keep payment, tax, bank, card, identity, password, customer-list, private address, and private file details outside the website form.",
      ].join("\n");
    }
    if (serviceType === "invoice-followup-copy-pack") {
      return [
        "Subject: Invoice Follow-up Copy Pack - fit confirmed, external payment before work starts",
        "",
        "Thanks for sending the public-safe invoice follow-up request. This looks like it may fit the simple copy-pack scope.",
        "",
        "Scope after payment:",
        "- one polite payment reminder email",
        "- one due-today payment note",
        "- one first overdue follow-up",
        "- one paid thank-you message",
        "- one next-invoice or recurring-work note",
        "",
        "Price: $19 USD",
        `Request source: ${sourcePath}`,
        "",
        "Next step: I will send one real external checkout or invoice link. Please pay only through that external provider. Do not send card, bank, payout, tax, identity, private invoice numbers, client private data, customer lists, or legal dispute details through the website, GitHub, or email.",
        "",
        "After the provider shows paid_order_verified, the copy pack can be prepared and delivered. Revenue is counted only from the external provider's paid or settled order record.",
      ].join("\n");
    }
    return [
      "Subject: Custom Local Print Pack Setup - fit confirmed, external payment before work starts",
      "",
      "Thanks for sending the public-safe setup request. This looks like it may fit the simple local print pack scope.",
      "",
      "Scope after payment:",
      ...customLocalPrintPackDeliverables().map((item) => `- ${item}`),
      "",
      "Price: $29 USD",
      `Request source: ${sourcePath}`,
      "",
      "Next step: I will send one real external checkout or invoice link. Please pay only through that external provider. Do not send card, bank, payout, tax, identity, password, customer-list, or private file details through the website, GitHub, or email.",
      "",
      "After the provider shows paid_order_verified, the pack can be prepared and delivered. Revenue is counted only from the external provider's paid or settled order record.",
    ].join("\n");
  }

  function leadToPaymentSponsorInvoiceCopy() {
    const deal = sponsorDeals.find((item) => item.id === DEFAULT_SPONSOR_DEAL_ID) || sponsorDeals[0];
    const vertical = sponsorVerticals[0] || { title: "PrintableTools Lab sponsor audience" };
    return sponsorInvoiceRequestCopy(
      { id: "ops-close", name: "Sponsor team", website: "", vertical: vertical.slug || "", category: "Sponsor inquiry", fitReason: deal.bestFor || "" },
      deal,
      vertical,
      deal.trackedUrl || "/sponsor-starter-review/",
    );
  }

  function checkoutActivationRows(totals = {}) {
    return [
      {
        sku: "Local Seller Starter Kit",
        price: "$9 USD",
        configured: Boolean(CONFIG.sellerKitCheckoutUrl || CONFIG.checkoutUrl),
        configKey: "sellerKitCheckoutUrl",
        command: "npm.cmd run configure:checkout -- --seller-kit-url https://your-payment-provider.example/local-seller-starter-kit",
        publicPage: "/local-seller-starter-kit/",
        checkoutClicks: totals.seller_checkout_click || 0,
        requestIntent: totals.seller_checkout_intent || 0,
        copy: localSellerCheckoutListingCopy(),
      },
      {
        sku: "Custom Local Print Pack Setup",
        price: "$29 USD",
        configured: Boolean(CONFIG.serviceCheckoutUrl || CONFIG.customPrintPackCheckoutUrl),
        configKey: "serviceCheckoutUrl",
        command: "npm.cmd run configure:checkout -- --service-url https://your-payment-provider.example/custom-local-print-pack",
        publicPage: "/custom-local-print-pack/",
        checkoutClicks: totals.service_checkout_click || 0,
        requestIntent: totals.service_request_intent || 0,
        copy: customLocalPrintPackCheckoutListingCopy(),
      },
      {
        sku: "Invoice Follow-up Copy Pack",
        price: "$19 USD",
        configured: Boolean(CONFIG.serviceCheckoutUrl),
        configKey: "serviceCheckoutUrl",
        command: "npm.cmd run configure:checkout -- --service-url https://your-payment-provider.example/invoice-followup-copy-pack",
        publicPage: "/invoice-followup-copy-pack/",
        checkoutClicks: totals.service_checkout_click || 0,
        requestIntent: totals.service_request_intent || 0,
        copy: invoiceFollowupRequestCopy(),
      },
      {
        sku: "Audit upgrade checkout",
        price: "$29 USD",
        configured: Boolean(CONFIG.auditUpgradeCheckoutUrl || CONFIG.serviceCheckoutUrl || CONFIG.customPrintPackCheckoutUrl),
        configKey: "auditUpgradeCheckoutUrl",
        command: "npm.cmd run configure:checkout -- --audit-upgrade-url https://your-payment-provider.example/custom-local-print-pack",
        publicPage: "/market-table-print-audit/",
        checkoutClicks: totals.service_checkout_click || 0,
        requestIntent: totals.audit_request_intent || 0,
        copy: `Upgrade from the Free Market Table Print Audit to the Custom Local Print Pack Setup.\n\n${customLocalPrintPackCheckoutListingCopy()}`,
      },
    ];
  }

  function checkoutActivationHtml(totals = {}) {
    const rows = checkoutActivationRows(totals);
    const configuredCount = rows.filter((row) => row.configured).length;
    const checkoutClicks = rows.reduce((sum, row) => sum + Number(row.checkoutClicks || 0), 0);
    const requestIntent = rows.reduce((sum, row) => sum + Number(row.requestIntent || 0), 0);
    return `
      <section class="panel ops-checkout-activation">
        <div class="ops-project-head">
          <div>
            <p class="eyebrow">checkout activation</p>
            <h2>External payment link readiness</h2>
            <p>${configuredCount ? `${configuredCount}/${rows.length} external checkout slot(s) are configured.` : "No external checkout URL is configured yet. Public pages collect requests only until a real payment-provider link is connected."}</p>
          </div>
          <a class="button secondary" href="/custom-local-print-pack/">Open service page</a>
        </div>
        <div class="metric-grid compact ops-project-grid">
          <div class="metric-tile"><strong>${configuredCount}/${rows.length}</strong><span>configured slots</span></div>
          <div class="metric-tile"><strong>${checkoutClicks}</strong><span>checkout clicks</span></div>
          <div class="metric-tile"><strong>${requestIntent}</strong><span>request intent</span></div>
          <div class="metric-tile"><strong>settled only</strong><span>revenue proof</span></div>
        </div>
        ${opsTable(["SKU", "Price", "Config key", "Status", "Checkout clicks", "Requests", "Page"], rows.map((row) => [
          row.sku,
          row.price,
          row.configKey,
          row.configured ? "configured" : "missing",
          row.checkoutClicks || 0,
          row.requestIntent || 0,
          row.publicPage,
        ]))}
        <div class="ops-action-list">
          ${rows.map((row) => `
            <article class="ops-action-card checkout-activation-card">
              <div>
                <p class="eyebrow">${escapeHtml(row.configured ? "ready" : "missing checkout")}</p>
                <h4>${escapeHtml(row.sku)}</h4>
                <p>${escapeHtml(row.price)}. Create one real Gumroad, Payhip, Ko-fi, Stripe Payment Link, or invoice product, then paste only the public checkout URL into this repository.</p>
                <p class="help">Do not store payout, tax, bank, card, customer-list, or account credential data here. Revenue is proven only by the external provider's paid or settled order record.</p>
              </div>
              <div class="ops-action-buttons">
                <button class="button secondary" type="button" data-copy-text="${escapeHtml(row.copy)}">Copy listing copy</button>
                <button class="button ghost" type="button" data-copy-text="${escapeHtml(row.command)}">Copy config command</button>
                <a class="button ghost" href="${escapeHtml(row.publicPage)}">Open page</a>
              </div>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }

  function localSellerCheckoutListingCopy() {
    return [
      "Product name: Local Seller Starter Kit",
      "Price: $9 USD",
      "Short description: Editable starter templates for market tables, pop-up sellers, service providers, and first-time local offers: price tags, coupon copy, QR sign wording, pickup notes, packing slip rows, and a launch checklist.",
      "Delivery note: Buyer receives editable CSV, Markdown, HTML, and text templates for their own local-selling workflow.",
      "Buyer safety: This is a digital template kit. Do not send payout, tax, bank, card, password, private identity, or customer-list data through the website form.",
    ].join("\n");
  }

  function customLocalPrintPackCheckoutListingCopy() {
    return [
      "Product name: Custom Local Print Pack Setup",
      "Price: $29 USD",
      "Short description: A done-for-you printable starter pack setup for local sellers and small service providers.",
      "Delivery note: Buyer sends public-safe item, price, style, and contact-link details after payment. Delivery target is 2 business days after paid_order_verified and complete buyer details.",
      "Deliverables:",
      ...customLocalPrintPackDeliverables().map((item) => `- ${item}`),
      "",
      "Buyer safety: Do not send tax, bank, card, password, private identity, customer-list, or private file data through the website form.",
    ].join("\n");
  }

  function sponsorSprintHtml(data, leadCheck, publicReplies) {
    const totals = data.totals || {};
    const sponsorIntent = totals.sponsor_request_intent || 0;
    const indexedLeadCount = Number.isFinite(Number(leadCheck?.leadCount)) ? Number(leadCheck.leadCount) : null;
    const indexedInvoiceCount = Number.isFinite(Number(leadCheck?.invoiceRequestCount)) ? Number(leadCheck.invoiceRequestCount) : null;
    const sponsorLeads = Math.max(data.sponsorLeads || totals.sponsor_lead_submit || 0, indexedLeadCount || 0);
    const sponsorInvoiceRequests = Math.max(data.sponsorInvoiceRequests || totals.sponsor_invoice_request || 0, indexedInvoiceCount || 0);
    const pageViews = totals.page_view || 0;
    const downloads = (totals.download_pdf || 0) + (totals.download_file || 0);
    const topSponsorPaths = sponsorPathRows(data).slice(0, 4);
    const prospectRows = rankedSponsorProspects(data).slice(0, 4);
    const publicReplyCount = Number(publicReplies?.publicReplyCount) || 0;
    const publicInvoiceIssues = Number(publicReplies?.invoiceRequestCount) || 0;
    const action = sponsorNextAction(sponsorLeads, sponsorIntent, pageViews, downloads, sponsorInvoiceRequests, publicInvoiceIssues, publicReplyCount);
    return `
      <section class="panel ops-sponsor-sprint" aria-label="Sponsor revenue sprint">
        <div class="ops-project-head">
          <div>
            <p class="eyebrow">revenue sprint</p>
            <h2>Sponsor close cockpit</h2>
            <p>${escapeHtml(action)}</p>
          </div>
          <a class="button" href="/sponsor-starter-review/?utm_source=ops&utm_medium=internal&utm_campaign=sponsor_close&utm_content=close-cockpit&commitment=request-invoice#sponsor-inquiry">Open invoice review form</a>
        </div>
        <div class="metric-grid compact ops-project-grid">
          <div class="metric-tile"><strong>${sponsorIntent}</strong><span>sponsor intent</span></div>
          <div class="metric-tile"><strong>${sponsorLeads}</strong><span>sponsor leads</span></div>
          <div class="metric-tile"><strong>${sponsorInvoiceRequests}</strong><span>invoice requests</span></div>
          <div class="metric-tile"><strong>${publicReplyCount}</strong><span>public replies</span></div>
          <div class="metric-tile"><strong>${publicInvoiceIssues}</strong><span>public invoice issues</span></div>
          <div class="metric-tile"><strong>${prospectRows.length}</strong><span>priority prospects</span></div>
          <div class="metric-tile"><strong>${topSponsorPaths.length}</strong><span>warm sponsor pages</span></div>
          <div class="metric-tile"><strong>${sponsorDeals[1]?.price || "USD 99-149"}</strong><span>default pilot</span></div>
          <div class="metric-tile"><strong>${sponsorInvoiceRequests ? "Invoice" : sponsorLeads ? "Follow up" : "Outreach"}</strong><span>next mode</span></div>
        </div>
        ${sponsorLeadCheckHtml(leadCheck)}
        ${sponsorPublicRepliesHtml(publicReplies)}
        <div class="ops-detail-grid">
          <section>
            <h3>Priority sponsor prospects</h3>
            <div class="ops-action-list">
              ${prospectRows.map(sponsorProspectCard).join("")}
            </div>
          </section>
          <section>
            <h3>Warm sponsor pages</h3>
            ${opsTable(["Path", "Views", "Today"], topSponsorPaths.map((row) => [
              row.path,
              row.page_view || 0,
              row.today_page_view || 0,
            ]))}
            <div class="ops-deal-links">
              ${sponsorDeals.filter((deal) => deal.id !== "partner-distribution-test").map((deal) => `<a class="tag" href="${escapeHtml(deal.trackedUrl)}">${escapeHtml(deal.title)} ${escapeHtml(deal.price)}</a>`).join("")}
            </div>
          </section>
        </div>
        ${sponsorOpsSubmissionQueueHtml()}
      </section>
    `;
  }

  function sponsorLeadCheckHtml(leadCheck) {
    if (!leadCheck) return "";
    const quality = leadCheck.dataQuality || "unknown";
    const leadCount = Number.isFinite(Number(leadCheck.leadCount)) ? Number(leadCheck.leadCount) : "n/a";
    const invoiceCount = Number.isFinite(Number(leadCheck.invoiceRequestCount)) ? Number(leadCheck.invoiceRequestCount) : "n/a";
    const latest = leadCheck.latestCreatedAt || "none";
    const warning = leadCheck.dataWarning ? `<p class="notice">${escapeHtml(leadCheck.dataWarning)}</p>` : "";
    return `
      <div class="notice sponsor-lead-check">
        <strong>Sponsor lead index check</strong>
        <p>Private details stay hidden. Public-safe check: ${escapeHtml(String(leadCount))} indexed lead(s), ${escapeHtml(String(invoiceCount))} invoice request(s), latest ${escapeHtml(latest)}, quality ${escapeHtml(quality)}.</p>
        ${warning}
      </div>
    `;
  }

  function sponsorPublicRepliesHtml(publicReplies) {
    if (!publicReplies) return "";
    const quality = publicReplies.dataQuality || "unknown";
    const replyCount = Number.isFinite(Number(publicReplies.publicReplyCount)) ? Number(publicReplies.publicReplyCount) : "n/a";
    const invoiceCount = Number.isFinite(Number(publicReplies.invoiceRequestCount)) ? Number(publicReplies.invoiceRequestCount) : "n/a";
    const reviewCount = Number.isFinite(Number(publicReplies.readyForReviewCount)) ? Number(publicReplies.readyForReviewCount) : "n/a";
    const warning = publicReplies.dataWarning ? `<p class="notice">${escapeHtml(publicReplies.dataWarning)}</p>` : "";
    const sourceUrl = publicReplies.sourceUrl || "https://github.com/yanqr213/printable-tools-lab/issues?q=is%3Aissue%20label%3Asponsor%20label%3Apartner%20label%3Abusiness-review";
    return `
      <div class="notice sponsor-lead-check">
        <strong>Public-safe sponsor reply evidence</strong>
        <p>Public GitHub issue check: ${escapeHtml(String(replyCount))} reply issue(s), ${escapeHtml(String(invoiceCount))} invoice request issue(s), ${escapeHtml(String(reviewCount))} ready for manual review, quality ${escapeHtml(quality)}.</p>
        <p><a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noreferrer">Open public evidence search</a></p>
        ${warning}
      </div>
    `;
  }

  function sponsorNextAction(sponsorLeads, sponsorIntent, pageViews, downloads, sponsorInvoiceRequests = 0, publicInvoiceIssues = 0, publicReplyCount = 0) {
    if (sponsorInvoiceRequests > 0) return "A sponsor requested an invoice or this-month pilot. Export the private lead, verify policy fit, and send only an external invoice or agreement.";
    if (sponsorLeads > 0) return "Export the sponsor lead, reply with the selected deal, and move only signed agreement or settled external payment into revenue.";
    if (publicInvoiceIssues > 0) return "A public-safe GitHub sponsor issue asks for invoice review. Confirm fit, then use only an external invoice or agreement before counting revenue.";
    if (publicReplyCount > 0) return "Public-safe GitHub sponsor replies exist. Triage them and move only qualified partners toward the invoice review path.";
    if (sponsorIntent > 0) return "There is sponsor intent without a lead. Send the deal-room link to four matched prospects and keep the inquiry form prefilled.";
    if (pageViews >= 100 || downloads > 0) return "Traffic exists but sponsor intent is thin. Push one vertical sponsor pitch tied to the warmest PDF, QR, resume, or paperwork audience.";
    return "Keep free-tool distribution running while sending a small sponsor pilot pitch to the first two highest-fit prospects.";
  }

  function sponsorPathRows(data) {
    const projects = Array.isArray(data.projects) ? data.projects : [];
    const printable = projects.find((project) => project.id === "printable-tools-lab") || {};
    return activeRows(printable.paths || [], (row) => {
      const path = String(row.path || "");
      const sponsorBonus = path.includes("/sponsor") ? 20 : 0;
      return (row.page_view || 0) + (row.today_page_view || 0) * 2 + sponsorBonus;
    }).filter((row) => String(row.path || "").includes("/sponsor") || (row.page_view || 0) > 0);
  }

  function rankedSponsorProspects(data) {
    const printable = (Array.isArray(data.projects) ? data.projects : []).find((project) => project.id === "printable-tools-lab") || {};
    const tools = printable.tools || [];
    const scoreFor = (prospect) => {
      const vertical = sponsorVerticals.find((item) => item.slug === prospect.vertical);
      if (!vertical) return 0;
      const linkedTools = vertical.links.map(([, pathName]) => String(pathName).split("/").pop());
      const toolSignal = tools
        .filter((row) => linkedTools.includes(row.tool))
        .reduce((sum, row) => sum + toolScore(row), 0);
      const deal = sponsorDeals.find((item) => item.id === prospect.dealId);
      const priceWeight = deal?.id === "vertical-category-pilot" ? 8 : deal?.id === "guide-sponsor-pilot" ? 5 : 2;
      return toolSignal + priceWeight;
    };
    return sponsorProspects
      .map((prospect, index) => ({ ...prospect, priority: index + 1, score: scoreFor(prospect) }))
      .sort((a, b) => b.score - a.score || a.priority - b.priority);
  }

  function sponsorProspectCard(prospect) {
    const vertical = sponsorVerticals.find((item) => item.slug === prospect.vertical) || sponsorVerticals[0];
    const deal = sponsorDeals.find((item) => item.id === prospect.dealId) || sponsorDeals[1] || sponsorDeals[0];
    const dealUrl = sponsorProspectDealUrl(prospect, deal, vertical);
    const proposalUrl = sponsorProspectProposalUrl(prospect, deal, vertical);
    const pitch = sponsorProspectPitch(prospect, deal, vertical, proposalUrl);
    const invoiceRequest = sponsorInvoiceRequestCopy(prospect, deal, vertical, proposalUrl);
    const publicReplyUrl = sponsorPublicReplyUrl(prospect, deal, vertical, proposalUrl);
    return `
      <article class="ops-action-card">
        <div>
          <p class="eyebrow">${escapeHtml(prospect.category)}</p>
          <h4>${escapeHtml(prospect.name)}</h4>
          <p>${escapeHtml(prospect.fitReason)}</p>
          <p><strong>${escapeHtml(deal.title)}:</strong> ${escapeHtml(deal.price)} · ${escapeHtml(vertical.title)}</p>
        </div>
        <div class="ops-action-buttons">
          <a class="button secondary" href="${escapeHtml(prospect.contactUrl)}" target="_blank" rel="noreferrer">Contact</a>
          <a class="button secondary" href="${escapeHtml(proposalUrl)}" target="_blank" rel="noreferrer">Proposal</a>
          <a class="button" data-sponsor-public-invoice-request href="${escapeHtml(publicReplyUrl)}" target="_blank" rel="noreferrer">Open public invoice issue</a>
          <a class="button ghost" href="${escapeHtml(dealUrl)}" target="_blank" rel="noreferrer">Deal link</a>
          <button class="button ghost" type="button" data-copy-text="${escapeHtml(invoiceRequest)}">Copy invoice request</button>
          <button class="button ghost" type="button" data-copy-text="${escapeHtml(pitch)}">Copy pitch</button>
        </div>
      </article>
    `;
  }

  function sponsorOpsSubmissionQueueHtml() {
    return `
      <div class="ops-submission-queue">
        <h3>Next sponsor submissions</h3>
        <p class="help">Use only with a truthful sender identity. Mark sent only after a real public form submission or legitimate email send with evidence.</p>
        <div class="ops-action-list">
          ${sponsorOpsSubmissionQueue.map(sponsorOpsSubmissionCard).join("")}
        </div>
      </div>`;
  }

  function sponsorOpsSubmissionCard(row) {
    const prospect = sponsorProspects.find((item) => item.id === row.prospectId) || {
      id: row.prospectId,
      name: row.name,
      category: row.category,
      website: "",
      contactUrl: row.bestContactUrl,
      fitReason: row.note,
      vertical: row.vertical,
      dealId: row.dealId,
    };
    const vertical = sponsorVerticals.find((item) => item.slug === row.vertical) || sponsorVerticals[0];
    const deal = sponsorDeals.find((item) => item.id === row.dealId) || sponsorDeals[1] || sponsorDeals[0];
    const proposalUrl = sponsorProspectProposalUrl(prospect, deal, vertical);
    const publicReplyUrl = sponsorPublicReplyUrl(prospect, deal, vertical, proposalUrl);
    const pitch = sponsorProspectPitch(prospect, deal, vertical, proposalUrl);
    const mailtoUrl = row.publicEmail ? sponsorMailtoDraft(row.publicEmail, `${deal.title} for ${vertical.title}`, pitch) : "";
    return `
      <article class="ops-action-card sponsor-submission-card">
        <div>
          <p class="eyebrow">${escapeHtml(row.contactRouteStatus)} / ${escapeHtml(row.firstAction)}</p>
          <h4>${escapeHtml(row.name)}</h4>
          <p><strong>${escapeHtml(deal.title)}:</strong> ${escapeHtml(deal.price)} · ${escapeHtml(row.category)}</p>
          <p class="help">${escapeHtml(row.note)}</p>
        </div>
        <div class="ops-action-buttons">
          <a class="button secondary" href="${escapeHtml(row.bestContactUrl)}" target="_blank" rel="noreferrer">Open route</a>
          ${mailtoUrl ? `<a class="button" href="${escapeHtml(mailtoUrl)}">Open email draft</a>` : ""}
          <a class="button secondary" href="${escapeHtml(proposalUrl)}" target="_blank" rel="noreferrer">Short proposal</a>
          <a class="button ghost" href="${escapeHtml(sponsorVerticalInvoiceReviewUrl(vertical, row.prospectId))}" target="_blank" rel="noreferrer">Invoice URL</a>
          <a class="button ghost" href="${escapeHtml(publicReplyUrl)}" target="_blank" rel="noreferrer">Public reply</a>
          <button class="button ghost" type="button" data-copy-text="${escapeHtml(pitch)}">Copy message</button>
        </div>
      </article>`;
  }

  function sponsorMailtoDraft(email, subject, body) {
    const params = new URLSearchParams();
    params.set("subject", subject || "PrintableTools Lab sponsor pilot");
    params.set("body", body || "");
    return `mailto:${email}?${params.toString()}`;
  }

  function sponsorProspectFromParams(params) {
    const id = String(params.get("prospect") || params.get("utm_content") || "").trim();
    const found = sponsorProspects.find((item) => item.id === id);
    if (found) return found;
    const vertical = sponsorVerticals.find((item) => item.slug === params.get("vertical")) || sponsorVerticals[0];
    return {
      id: id || "direct-sponsor",
      name: "Policy-fit partner",
      vertical: vertical.slug,
      category: "Sponsor prospect",
      contactUrl: "/sponsor-deal-room/",
      fitReason: `This proposal is for partners that fit ${vertical.title} and can help visitors with ${vertical.audience.toLowerCase()}`,
      dealId: params.get("deal") || "guide-sponsor-pilot",
    };
  }

  function sponsorProspectDealUrl(prospect, deal, vertical) {
    const params = new URLSearchParams({
      utm_source: "sponsor-outreach",
      utm_medium: "manual",
      utm_campaign: "sponsor_deal_room",
      utm_content: prospect.id,
      deal: deal.id,
      vertical: vertical.slug,
      commitment: sponsorDealCommitment(deal),
    });
    return `/sponsor-deal-room/?${params.toString()}#sponsor-inquiry`;
  }

  function sponsorProspectProposalUrl(prospect, deal, vertical) {
    const params = new URLSearchParams({
      prospect: prospect.id,
      deal: deal.id,
      vertical: vertical.slug,
      utm_source: "sponsor-outreach",
      utm_medium: "manual",
      utm_campaign: "sponsor_proposal",
      utm_content: prospect.id,
      commitment: sponsorDealCommitment(deal),
    });
    return `/sponsor-proposal/?${params.toString()}#sponsor-inquiry`;
  }

  function sponsorProspectPitch(prospect, deal, vertical, dealUrl) {
    const absoluteDealUrl = absoluteSponsorUrl(dealUrl);
    const contextUrl = absoluteSponsorUrl(`/sponsor/${vertical.slug}/?utm_source=sponsor-outreach&utm_medium=manual&utm_campaign=${encodeURIComponent(vertical.campaign)}&utm_content=${encodeURIComponent(prospect.id)}`);
    const publicReplyUrl = sponsorPublicReplyUrl(prospect, deal, vertical, dealUrl);
    return [
      `Hi ${prospect.name} team,`,
      "",
      "I run PrintableTools Lab, a free no-signup browser utility site for PDF, image, QR, resume, classroom, and small-business document workflows.",
      "",
      `Your product looks relevant because ${prospect.fitReason}`,
      "",
      prospect.validationSignal ? `Current validation signal: ${prospect.validationSignal}` : "",
      prospect.validationSignal ? "" : "",
      sponsorExternalDiscoveryProofLine(),
      "",
      `I am opening a small, clearly labeled sponsor pilot for this audience: ${absoluteDealUrl}`,
      "",
      `The best starting option is "${deal.title}" (${deal.price}): ${deal.deliverable}`,
      "",
      `For vertical context, this is the audience fit page: ${contextUrl}`,
      "",
      `If email is inconvenient, this public-safe GitHub reply form is also available: ${publicReplyUrl}`,
      "",
      "Downloads stay free, sponsor copy is separated from generator controls, and placements are manually reviewed for policy fit. I am not claiming guaranteed traffic or conversions; this is a small validation pilot before any placement goes live.",
      "",
      "Would this be relevant for your partnership or marketing team?",
    ].join("\n");
  }

  function sponsorPublicReplyUrl(prospect, deal, vertical, proposalPath) {
    const title = `[Sponsor/Partner]: ${prospect.name || "Sponsor pilot review"}`;
    const body = [
      "Public-safe sponsor reply.",
      "",
      `Company / project: ${prospect.name || ""}`,
      `Public website URL: ${prospect.website || ""}`,
      `Audience fit: ${vertical.title || ""}`,
      `Selected pilot deal: ${deal.title || ""}${deal.price ? ` (${deal.price})` : ""}`,
      `Proposal or deal URL: ${absoluteSponsorUrl(proposalPath)}`,
      "",
      "Requested next step: Request pilot invoice review",
      "",
      "Do not include private payment, tax, bank, phone, customer, identity, password, or confidential file data in this public issue.",
    ].join("\n");
    const url = new URL("https://github.com/yanqr213/printable-tools-lab/issues/new");
    url.searchParams.set("title", title);
    url.searchParams.set("body", body);
    url.searchParams.set("labels", "sponsor,partner,business-review");
    return url.toString();
  }

  function sponsorInvoiceRequestCopy(prospect, deal, vertical, dealUrl) {
    const absoluteDealUrl = absoluteSponsorUrl(dealUrl);
    return [
      "Hi PrintableTools Lab team,",
      "",
      `We are interested in the ${deal.title} (${deal.price}) for ${vertical.title}.`,
      `Company/prospect: ${prospect.name}`,
      `Pilot link: ${absoluteDealUrl}`,
      sponsorExternalDiscoveryProofLine(),
      "",
      "Please review fit and send the external invoice/agreement if this sponsor placement is policy-safe.",
      "We will keep payment, tax, bank, phone, and private customer details outside the website form.",
    ].join("\n");
  }

  function absoluteSponsorUrl(pathName) {
    try {
      return new URL(pathName, CONFIG.siteUrl || window.location.origin).toString();
    } catch (error) {
      return pathName;
    }
  }

  function projectOpsHtml(project) {
    const summary = project.summary || {};
    const totals = project.totals || {};
    const isGameProject = project.id === "pocket-arcade-shelf";
    const primarySignal = isGameProject ? (summary.gamePlayIntent || 0) : (summary.sponsorLeads || 0);
    const primaryLabel = isGameProject ? "play intent" : "sponsor leads";
    const sourceRows = activeRows(project.sources || [], sourceScore).slice(0, 10);
    const pathRows = activeRows(project.paths || [], (row) => (row.page_view || 0) + (row.today_page_view || 0) * 2).slice(0, 10);
    const toolRows = activeRows(project.tools || [], toolScore).slice(0, 12);
    return `
      <article class="panel ops-project">
        <div class="ops-project-head">
          <div>
            <p class="eyebrow">${escapeHtml(project.id || "project")}</p>
            <h2>${escapeHtml(project.name || "Project")}</h2>
            <p>${escapeHtml(project.goal || "")}</p>
          </div>
          <a class="button secondary" href="${escapeHtml(project.url || "#")}" target="_blank" rel="noreferrer">Open project</a>
        </div>
        <div class="metric-grid compact ops-project-grid">
          <div class="metric-tile"><strong>${summary.pageViews || 0}</strong><span>views</span></div>
          <div class="metric-tile"><strong>${summary.todayPageViews || 0}</strong><span>today views</span></div>
          <div class="metric-tile"><strong>${primarySignal}</strong><span>${escapeHtml(primaryLabel)}</span></div>
          <div class="metric-tile"><strong>${summary.downloads || 0}</strong><span>downloads</span></div>
          <div class="metric-tile"><strong>${summary.todayDownloads || 0}</strong><span>today downloads</span></div>
          <div class="metric-tile"><strong>${summary.generations || 0}</strong><span>generations</span></div>
          <div class="metric-tile"><strong>${summary.todayGenerations || summary.todayGamePlayIntent || 0}</strong><span>${isGameProject ? "today plays" : "today generations"}</span></div>
          <div class="metric-tile"><strong>${summary.commercialIntent || summary.gameFullscreenOpen || 0}</strong><span>${isGameProject ? "fullscreen opens" : "commercial intent"}</span></div>
          <div class="metric-tile"><strong>${summary.todayCommercialIntent || summary.todayGameFullscreenOpen || 0}</strong><span>${isGameProject ? "today fullscreen" : "today commercial"}</span></div>
        </div>
        <div class="notice compact-notice">${escapeHtml(project.nextAction || "Watch the next live signal before expanding this project.")}</div>
        <div class="ops-detail-grid">
          <section>
            <h3>Sources</h3>
            ${opsTable(["Source", "Views", "Today", "Intent", "Today intent"], sourceRows.map((row) => [
              row.source,
              row.page_view || 0,
              row.today_page_view || 0,
              (row.sponsor_request_intent || 0) + (row.game_play_intent || 0) + (row.game_fullscreen_open || 0) + (row.game_embed_open || 0),
              (row.today_sponsor_request_intent || 0) + (row.today_game_play_intent || 0) + (row.today_game_fullscreen_open || 0) + (row.today_game_embed_open || 0),
            ]))}
          </section>
          <section>
            <h3>Pages</h3>
            ${opsTable(["Path", "Views", "Today"], pathRows.map((row) => [
              row.path,
              row.page_view || 0,
              row.today_page_view || 0,
            ]))}
          </section>
          <section>
            <h3>${isGameProject ? "Games" : "Tools and offers"}</h3>
            ${opsTable([isGameProject ? "Game" : "Tool", "Score", "Today", "Downloads"], toolRows.map((row) => [
              row.tool,
              toolScore(row),
              todayToolScore(row),
              (row.download_pdf || 0) + (row.download_file || 0),
            ]))}
          </section>
          <section>
            <h3>Event totals</h3>
            ${opsTable(["Event", "Total", "Today"], eventRows(totals, project.todayTotals || {}))}
          </section>
        </div>
      </article>
    `;
  }

  function eventRows(totals, todayTotals) {
    const names = [
      ["page_view", "Page views"],
      ["download_pdf", "PDF downloads"],
      ["download_file", "File downloads"],
      ["free_tool_depth", "Free-tool depth"],
      ["sponsor_request_intent", "Sponsor intent"],
      ["sponsor_lead_submit", "Sponsor leads"],
      ["sponsor_invoice_request", "Invoice requests"],
      ["game_play_intent", "Game play intent"],
      ["game_fullscreen_open", "Fullscreen opens"],
      ["game_embed_open", "Embed opens"],
    ];
    return names
      .filter(([key]) => (totals[key] || 0) || (todayTotals[key] || 0))
      .map(([key, label]) => [label, totals[key] || 0, todayTotals[key] || 0]);
  }

  function activeRows(rows, scoreFn) {
    return rows
      .slice()
      .filter((row) => scoreFn(row) > 0)
      .sort((a, b) => scoreFn(b) - scoreFn(a) || String(a.tool || a.source || a.path).localeCompare(String(b.tool || b.source || b.path)));
  }

  function sourceScore(row) {
    return (row.page_view || 0)
      + ((row.download_pdf || 0) + (row.download_file || 0)) * 4
      + ((row.free_tool_depth || 0) + (row.guide_depth || 0)) * 3
      + (row.sponsor_request_intent || 0) * 5
      + ((row.game_play_intent || 0) + (row.game_fullscreen_open || 0) + (row.game_embed_open || 0)) * 4;
  }

  function toolScore(row) {
    return ((row.download_pdf || 0) + (row.download_file || 0)) * 4
      + ((row.generate_pdf || 0) + (row.generate_file || 0)) * 2
      + (row.free_tool_depth || 0) * 3
      + (row.limit_hit || 0)
      + (row.seller_checkout_intent || 0) * 4
      + (row.service_request_intent || 0) * 4
      + (row.audit_request_intent || 0) * 4
      + (row.sponsor_request_intent || 0) * 5
      + ((row.game_play_intent || 0) + (row.game_fullscreen_open || 0) + (row.game_embed_open || 0)) * 4;
  }

  function todayToolScore(row) {
    return ((row.today_download_pdf || 0) + (row.today_download_file || 0)) * 4
      + ((row.today_generate_pdf || 0) + (row.today_generate_file || 0)) * 2
      + (row.today_free_tool_depth || 0) * 3
      + (row.today_limit_hit || 0)
      + (row.today_seller_checkout_intent || 0) * 4
      + (row.today_service_request_intent || 0) * 4
      + (row.today_audit_request_intent || 0) * 4
      + (row.today_sponsor_request_intent || 0) * 5
      + ((row.today_game_play_intent || 0) + (row.today_game_fullscreen_open || 0) + (row.today_game_embed_open || 0)) * 4;
  }

  function opsTable(headers, rows) {
    const body = rows.length
      ? rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")
      : `<tr><td colspan="${headers.length}">No signal yet.</td></tr>`;
    return `<div class="preview-stage compact-table"><table class="event-table"><thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${body}</tbody></table></div>`;
  }

  function opsActionList(actions) {
    const rows = Array.isArray(actions) ? actions.filter(Boolean) : [];
    return rows.length
      ? `<ul class="ops-action-summary">${rows.map((action) => `<li>${escapeHtml(action)}</li>`).join("")}</ul>`
      : `<p class="help">No operating action returned yet.</p>`;
  }

  function renderNotFound() {
    setMeta("Page not found", "The requested PrintableTools Lab page could not be found.");
    app.innerHTML = `<section class="shell section"><h1>Page not found</h1><p><a href="/">Return home</a></p></section>`;
  }

  function getCurrentRoutePath() {
    return window.location.hash ? window.location.hash : window.location.pathname;
  }

  function renderBlocks(blocks) {
    return blocks.map((block) => {
      const [type, value] = block;
      if (type === "p") return `<p>${escapeHtml(value)}</p>`;
      if (type === "h2") return `<h2>${escapeHtml(value)}</h2>`;
      if (type === "h3") return `<h3>${escapeHtml(value)}</h3>`;
      if (type === "ul") return `<ul>${value.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
      if (type === "ol") return `<ol>${value.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
      return "";
    }).join("");
  }

  function renderAdUnit(kind, note) {
    const slot = kind === "tool" ? CONFIG.adsenseToolSlot : CONFIG.adsenseContentSlot;
    if (CONFIG.enableAds && CONFIG.adsenseClientId && slot) {
      return `
        <div class="ad-wrap" aria-label="Advertisement">
          <span>Advertisement</span>
          <ins class="adsbygoogle"
            style="display:block"
            data-ad-client="${escapeHtml(CONFIG.adsenseClientId)}"
            data-ad-slot="${escapeHtml(slot)}"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
        </div>
      `;
    }
    return `<div class="placeholder-ad" role="note">Future ad placement: ${escapeHtml(note)}.</div>`;
  }

  function getFormValues(form) {
    const data = new FormData(form);
    const values = {};
    for (const [key, value] of data.entries()) {
      if (value instanceof File) continue;
      values[key] = value;
    }
    return values;
  }

  function initialToolValues(tool) {
    const values = { ...tool.defaultValues };
    if (tool.id === "compress-image-to-kb") {
      const params = new URLSearchParams(window.location.search || "");
      const targetKb = params.get("targetKb");
      if (["50", "100", "200", "500"].includes(targetKb)) values.targetKb = targetKb;
      else if (targetKb && /^\d{1,4}$/.test(targetKb)) {
        values.targetKb = "custom";
        values.customKb = targetKb;
      }
    }
    if (tool.id === "resize-image") {
      const params = new URLSearchParams(window.location.search || "");
      const width = params.get("width");
      const height = params.get("height");
      const fit = params.get("fit");
      if (width && /^\d{2,5}$/.test(width)) {
        values.preset = "custom";
        values.width = width;
      }
      if (height && /^\d{2,5}$/.test(height)) {
        values.preset = "custom";
        values.height = height;
      }
      if (["contain", "cover"].includes(fit)) values.fit = fit;
    }
    if (tool.id === "compress-pdf") {
      const params = new URLSearchParams(window.location.search || "");
      const targetSize = String(params.get("targetSize") || "").toLowerCase();
      if (["500kb", "1mb", "2mb", "5mb"].includes(targetSize)) {
        values.targetSize = targetSize;
        values.mode = targetSize === "5mb" ? "balanced" : "small";
      }
    }
    return values;
  }

  function loadImageFiles(tool, fileList, draw) {
    if (!tool.acceptsImages && tool.id !== "image-to-pdf") return;
    const files = Array.from(fileList || [])
      .filter((file) => /^image\/(png|jpeg|webp)$/.test(file.type))
      .slice(0, tool.maxImages || 4);
    if (!files.length) {
      imageToolState.set(tool.id, []);
      draw();
      return;
    }
    Promise.all(files.map(readImageFile))
      .then((items) => {
        const loaded = items.filter((item) => item && item.image);
        if (loaded.length) {
          imageToolState.set(tool.id, loaded);
        } else {
          imageToolState.set(tool.id, files.map((file, index) => createFallbackImageFile(file, index)));
        }
        draw();
      })
      .catch(() => {
        imageToolState.set(tool.id, []);
        draw();
      });
  }

  function readImageFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => resolve({ image, name: file.name, width: image.naturalWidth || image.width, height: image.naturalHeight || image.height });
        image.onerror = () => resolve(null);
        image.src = reader.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }

  function createFallbackImageFile(file, index) {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 420;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#edf7f6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#176b87";
    ctx.lineWidth = 10;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
    drawTextFit(ctx, `Image ${index + 1}`, canvas.width / 2, 165, canvas.width - 120, 54, { align: "center", weight: "900", color: "#17313b" });
    drawTextFit(ctx, file.name || "Selected file", canvas.width / 2, 230, canvas.width - 120, 28, { align: "center", weight: "600", color: "#5b6f78" });
    drawTextFit(ctx, "Preview placeholder", canvas.width / 2, 285, canvas.width - 120, 22, { align: "center", weight: "500", color: "#176b87" });
    return { image: canvas, name: file.name, width: canvas.width, height: canvas.height };
  }

  async function requestAiIdeas(tool, form, button, panel, draw) {
    button.disabled = true;
    button.textContent = "Thinking...";
    panel.hidden = false;
    panel.innerHTML = `<p class="help">Creating printable-safe ideas for this ${escapeHtml(tool.shortTitle.toLowerCase())}...</p>`;
    track("ai_ideas", { tool: tool.id });
    try {
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: tool.id, values: getAiIdeaValues(tool, form) }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !Array.isArray(data.suggestions) || !data.suggestions.length) {
        throw new Error(data.error || "No suggestions returned");
      }
      renderAiIdeas(tool, form, panel, data.suggestions.slice(0, 3), draw);
    } catch (error) {
      panel.innerHTML = `
        <strong>Idea helper is unavailable right now.</strong>
        <p class="help">You can still use the examples already in the form and generate the PDF locally.</p>
      `;
      track("ai_ideas_error", { tool: tool.id });
    } finally {
      button.disabled = false;
      button.textContent = "AI ideas";
    }
  }

  function renderAiIdeas(tool, form, panel, suggestions, draw) {
    panel.innerHTML = `
      <strong>AI idea helper</strong>
      <p class="help">Pick an option to fill the printable. Review it before downloading.</p>
      <div class="idea-list">
        ${suggestions.map((suggestion, index) => renderIdeaButton(tool, suggestion, index)).join("")}
      </div>
    `;
    panel.querySelectorAll("[data-idea-index]").forEach((button) => {
      button.addEventListener("click", () => {
        const suggestion = suggestions[Number(button.dataset.ideaIndex)];
        applySuggestion(form, suggestion);
        draw();
        track("ai_ideas_apply", { tool: tool.id });
      });
    });
  }

  function renderIdeaButton(tool, suggestion, index) {
    const title = suggestion.title || `${tool.shortTitle} idea ${index + 1}`;
    const summary = suggestion.summary || summarizeSuggestion(suggestion);
    return `
      <button class="idea-button" type="button" data-idea-index="${index}">
        <span>${escapeHtml(title)}</span>
        <small>${escapeHtml(summary)}</small>
      </button>
    `;
  }

  function summarizeSuggestion(suggestion) {
    const fields = Object.keys(suggestion.fields || {});
    return fields.length ? `Updates ${fields.join(", ")}` : "Apply printable-ready text";
  }

  function applySuggestion(form, suggestion) {
    const fields = suggestion.fields || {};
    Object.keys(fields).forEach((key) => {
      const input = form.elements[key];
      if (!input) return;
      const maxLength = input.getAttribute("maxlength");
      input.value = maxLength ? String(fields[key]).slice(0, Number(maxLength)) : String(fields[key]);
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }

  function getAiIdeaValues(tool, form) {
    const values = getFormValues(form);
    const allowlist = AI_FIELD_ALLOWLIST[tool.id] || tool.fields.map((field) => field.id);
    return allowlist.reduce((acc, field) => {
      if (values[field] != null) acc[field] = values[field];
      return acc;
    }, {});
  }

  function renderCanvas(tool, canvas, values) {
    const paper = getPaper(values.paper);
    if (canvas.width !== paper.width || canvas.height !== paper.height) {
      canvas.width = paper.width;
      canvas.height = paper.height;
    }
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    tool.draw(ctx, paper, values);
    ctx.restore();
  }

  function getPaper(key) {
    if (key === "a4") return { width: 1240, height: 1754, label: "A4" };
    return { width: 1275, height: 1650, label: "US Letter" };
  }

  function drawNameTracing(ctx, paper, values) {
    const margin = 88;
    const name = sanitizePrintable(values.name || "Maya").slice(0, 24) || "Maya";
    const subtitle = sanitizePrintable(values.subtitle || "Trace, write, and color your name");
    drawPageFrame(ctx, paper, "#176b87");
    drawTextFit(ctx, name, paper.width / 2, 160, paper.width - margin * 2, 82, {
      align: "center",
      weight: "800",
      color: "#17313b",
    });
    ctx.font = "28px Arial";
    ctx.fillStyle = "#5b6f78";
    ctx.textAlign = "center";
    ctx.fillText(subtitle, paper.width / 2, 220);
    const langNote = languageNote(values.language, name);
    if (langNote) {
      ctx.font = "24px Arial";
      ctx.fillStyle = "#176b87";
      ctx.fillText(langNote, paper.width / 2, 260);
    }

    if (values.style === "outline") {
      drawOutlineName(ctx, name, paper, margin);
    } else {
      const startY = 330;
      const rowGap = 170;
      for (let i = 0; i < 5; i += 1) {
        const y = startY + i * rowGap;
        drawHandwritingGuides(ctx, margin, y, paper.width - margin * 2);
        if (values.style === "primary" || i < 3) {
          drawTextFit(ctx, name, paper.width / 2, y + 68, paper.width - margin * 2, 58, {
            align: "center",
            weight: i < 3 ? "700" : "400",
            color: i < 3 ? "rgba(23,49,59,0.35)" : "#17313b",
          });
        }
      }
    }
    drawPromptBox(ctx, margin, paper.height - 270, paper.width - margin * 2, "Draw something that starts with your name or word.");
  }

  function drawOutlineName(ctx, name, paper, margin) {
    const y = 380;
    ctx.save();
    ctx.strokeStyle = "rgba(23,49,59,0.38)";
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 10]);
    drawTextFit(ctx, name, paper.width / 2, y, paper.width - margin * 2, 130, {
      align: "center",
      weight: "900",
      color: "transparent",
      stroke: true,
    });
    ctx.restore();
    for (let i = 0; i < 4; i += 1) {
      drawHandwritingGuides(ctx, margin, 610 + i * 170, paper.width - margin * 2);
    }
  }

  function drawChoreChart(ctx, paper, values) {
    const margin = 70;
    const title = sanitizePrintable(values.title || "Weekly Chore Chart");
    const names = splitList(values.names || "Ava, Leo", ",").slice(0, 3);
    const chores = splitList(values.chores || "", "\n").slice(0, 7);
    const accent = values.theme === "classroom" ? "#5a9367" : values.theme === "minimal" ? "#17313b" : "#e76f51";
    drawPageFrame(ctx, paper, accent);
    drawTextFit(ctx, title, paper.width / 2, 135, paper.width - margin * 2, 60, { align: "center", weight: "800", color: "#17313b" });
    ctx.font = "25px Arial";
    ctx.fillStyle = "#5b6f78";
    ctx.textAlign = "center";
    ctx.fillText(names.length ? `For ${names.join(" & ")}` : "For this week", paper.width / 2, 184);

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const x = margin;
    const y = 250;
    const w = paper.width - margin * 2;
    const choreCol = w * 0.36;
    const dayW = (w - choreCol) / 7;
    const rowH = Math.min(105, (paper.height - y - 260) / Math.max(5, chores.length + 1));
    ctx.strokeStyle = "#17313b";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, rowH * (chores.length + 1));
    ctx.fillStyle = "#edf7f6";
    ctx.fillRect(x, y, w, rowH);
    drawCellText(ctx, "Chore", x, y, choreCol, rowH, "700");
    days.forEach((day, index) => drawCellText(ctx, day, x + choreCol + dayW * index, y, dayW, rowH, "700"));
    for (let i = 0; i < chores.length; i += 1) {
      const rowY = y + rowH * (i + 1);
      drawCellText(ctx, chores[i], x, rowY, choreCol, rowH, "600", "left");
      for (let d = 0; d < 7; d += 1) {
        drawCheckBox(ctx, x + choreCol + dayW * d + dayW / 2 - 18, rowY + rowH / 2 - 18, 36);
      }
    }
    for (let i = 1; i <= chores.length + 1; i += 1) line(ctx, x, y + rowH * i, x + w, y + rowH * i);
    line(ctx, x + choreCol, y, x + choreCol, y + rowH * (chores.length + 1));
    for (let d = 1; d < 7; d += 1) line(ctx, x + choreCol + dayW * d, y, x + choreCol + dayW * d, y + rowH * (chores.length + 1));
    drawPromptBox(ctx, margin, paper.height - 220, paper.width - margin * 2, "Notes, swaps, or family reminders");
  }

  function drawRewardChart(ctx, paper, values) {
    const margin = 78;
    const title = sanitizePrintable(values.title || "My Reward Chart");
    const goal = sanitizePrintable(values.goal || "");
    const reward = sanitizePrintable(values.reward || "");
    const boxes = Number(values.boxes || 20);
    const accent = values.theme === "garden" ? "#5a9367" : values.theme === "simple" ? "#176b87" : "#f2b84b";
    drawPageFrame(ctx, paper, accent);
    drawTextFit(ctx, title, paper.width / 2, 130, paper.width - margin * 2, 64, { align: "center", weight: "800", color: "#17313b" });
    drawWrappedText(ctx, goal, margin + 26, 220, paper.width - margin * 2 - 52, 30, "#5b6f78", "24px Arial");
    const cols = boxes <= 12 ? 4 : boxes <= 16 ? 4 : 5;
    const rows = Math.ceil(boxes / cols);
    const gridW = paper.width - margin * 2;
    const cell = Math.min(150, gridW / cols - 14, (paper.height - 520) / rows - 14);
    const startX = paper.width / 2 - (cols * cell + (cols - 1) * 14) / 2;
    const startY = 360;
    for (let i = 0; i < boxes; i += 1) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (cell + 14);
      const y = startY + row * (cell + 14);
      drawRewardBox(ctx, x, y, cell, accent, values.theme);
      ctx.font = "20px Arial";
      ctx.fillStyle = "#5b6f78";
      ctx.textAlign = "center";
      ctx.fillText(String(i + 1), x + cell / 2, y + cell - 14);
    }
    drawPromptBox(ctx, margin, paper.height - 235, paper.width - margin * 2, reward || "Reward:");
  }

  function drawFlashcards(ctx, paper, values) {
    const margin = 70;
    const title = sanitizePrintable(values.title || "Vocabulary Flashcards");
    const cards = splitList(values.cards || "", "\n").slice(0, values.layout === "eight" ? 8 : 6);
    const accent = values.theme === "study" ? "#176b87" : values.theme === "kids" ? "#e76f51" : "#17313b";
    drawPageFrame(ctx, paper, accent);
    drawTextFit(ctx, title, paper.width / 2, 120, paper.width - margin * 2, 54, { align: "center", weight: "800", color: "#17313b" });
    ctx.font = "22px Arial";
    ctx.fillStyle = "#5b6f78";
    ctx.textAlign = "center";
    ctx.fillText("Cut along the dashed lines. Fold or laminate for repeated practice.", paper.width / 2, 170);

    const cols = 2;
    const rows = values.layout === "eight" ? 4 : 3;
    const gap = 18;
    const gridTop = 230;
    const gridW = paper.width - margin * 2;
    const gridH = paper.height - gridTop - 170;
    const cardW = (gridW - gap) / cols;
    const cardH = (gridH - gap * (rows - 1)) / rows;

    for (let i = 0; i < rows * cols; i += 1) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = margin + col * (cardW + gap);
      const y = gridTop + row * (cardH + gap);
      drawDashedRect(ctx, x, y, cardW, cardH, "rgba(23,49,59,0.42)");
      const [front, hint] = parseCard(cards[i] || "");
      drawTextFit(ctx, front || "Blank card", x + cardW / 2, y + cardH / 2 - 16, cardW - 34, 36, {
        align: "center",
        weight: "800",
        color: front ? "#17313b" : "rgba(23,49,59,0.35)",
      });
      if (hint) {
        ctx.font = "22px Arial";
        ctx.fillStyle = "#5b6f78";
        ctx.textAlign = "center";
        ctx.fillText(hint, x + cardW / 2, y + cardH / 2 + 34);
      }
    }
  }

  function drawWeeklyPlanner(ctx, paper, values) {
    const margin = 66;
    const title = sanitizePrintable(values.title || "Weekly Planner");
    const focus = sanitizePrintable(values.focus || "");
    const noteHeads = splitList(values.notes || "", "\n").slice(0, values.layout === "notes" ? 5 : 4);
    drawPageFrame(ctx, paper, "#5a9367");
    drawTextFit(ctx, title, paper.width / 2, 118, paper.width - margin * 2, 58, { align: "center", weight: "800", color: "#17313b" });
    ctx.font = "24px Arial";
    ctx.fillStyle = "#5b6f78";
    ctx.textAlign = "center";
    ctx.fillText(focus, paper.width / 2, 166);

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const top = 220;
    const fullW = paper.width - margin * 2;
    const notesW = values.layout === "minimal" ? 0 : values.layout === "notes" ? fullW * 0.34 : fullW * 0.28;
    const dayW = notesW ? fullW - notesW - 18 : fullW;
    const rowH = (paper.height - top - 170) / 7;

    for (let i = 0; i < 7; i += 1) {
      const y = top + i * rowH;
      ctx.strokeStyle = "#17313b";
      ctx.lineWidth = 2;
      ctx.strokeRect(margin, y, dayW, rowH - 10);
      ctx.fillStyle = i >= 5 ? "rgba(242,184,75,0.16)" : "rgba(237,247,246,0.9)";
      ctx.fillRect(margin + 2, y + 2, dayW - 4, rowH - 14);
      ctx.fillStyle = "#17313b";
      ctx.font = "700 23px Arial";
      ctx.textAlign = "left";
      ctx.fillText(days[i], margin + 18, y + 32);
      drawNoteLines(ctx, margin + 18, y + 55, dayW - 36, Math.max(2, Math.floor((rowH - 70) / 30)));
    }

    if (notesW) {
      const x = margin + dayW + 18;
      const blockH = (paper.height - top - 170) / Math.max(2, noteHeads.length);
      noteHeads.forEach((heading, index) => {
        const y = top + index * blockH;
        ctx.strokeStyle = "rgba(23,49,59,0.35)";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, notesW, blockH - 12);
        ctx.fillStyle = "#176b87";
        ctx.font = "700 22px Arial";
        ctx.textAlign = "left";
        ctx.fillText(heading, x + 14, y + 34);
        drawNoteLines(ctx, x + 14, y + 60, notesW - 28, Math.max(2, Math.floor((blockH - 75) / 28)));
      });
    }
  }

  function drawHabitTracker(ctx, paper, values) {
    const margin = 62;
    const title = sanitizePrintable(values.title || "30-Day Habit Tracker");
    const habits = splitList(values.habits || "", "\n").slice(0, 7);
    const days = Number(values.days || 30);
    const accent = values.theme === "bold" ? "#e76f51" : values.theme === "minimal" ? "#17313b" : "#176b87";
    drawPageFrame(ctx, paper, accent);
    drawTextFit(ctx, title, paper.width / 2, 118, paper.width - margin * 2, 56, { align: "center", weight: "800", color: "#17313b" });
    ctx.font = "23px Arial";
    ctx.fillStyle = "#5b6f78";
    ctx.textAlign = "center";
    ctx.fillText("Mark each day you complete the habit. Progress beats perfection.", paper.width / 2, 168);

    const gridTop = 240;
    const labelW = 220;
    const gridW = paper.width - margin * 2 - labelW;
    const cell = Math.min(30, gridW / days, (paper.height - gridTop - 180) / Math.max(1, habits.length));
    const rowH = cell + 28;
    const startX = margin + labelW;

    ctx.font = "18px Arial";
    ctx.fillStyle = "#5b6f78";
    ctx.textAlign = "center";
    for (let d = 1; d <= days; d += 1) {
      if (d === 1 || d % 5 === 0 || d === days) ctx.fillText(String(d), startX + (d - 0.5) * cell, gridTop - 14);
    }

    habits.forEach((habit, row) => {
      const y = gridTop + row * rowH;
      ctx.fillStyle = "#17313b";
      ctx.font = "700 22px Arial";
      ctx.textAlign = "left";
      drawTextFit(ctx, habit, margin, y + cell / 2, labelW - 18, 22, { align: "left", weight: "700", color: "#17313b" });
      for (let d = 0; d < days; d += 1) {
        const x = startX + d * cell;
        ctx.strokeStyle = "rgba(23,49,59,0.48)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x + 2, y, cell - 4, cell - 4);
        if (values.theme === "calm" && d % 2 === 0) {
          ctx.fillStyle = "rgba(23,107,135,0.06)";
          ctx.fillRect(x + 3, y + 1, cell - 6, cell - 6);
        }
      }
    });

    drawPromptBox(ctx, margin, paper.height - 235, paper.width - margin * 2, "Reflection: What made this easier this week?");
  }

  function drawInvoice(ctx, paper, values) {
    drawBusinessDocument(ctx, paper, values, {
      title: "INVOICE",
      accent: "#176b87",
      fromLabel: "From",
      toLabel: "Bill to",
      numberFallback: "INV-001",
      metaLabel: "Date",
      tableHeaders: ["Description", "Qty", "Rate", "Amount"],
      totalLabel: "Total",
      footer: "Generated locally with PrintableTools Lab. Review before sending.",
      defaultNote: "Thank you for your business.",
    });
  }

  function drawInvoiceFollowupEmail(ctx, paper, values) {
    const margin = 78;
    const message = invoiceFollowupEmailText(values);
    const statusLabel = invoiceFollowupStatusLabel(values.invoiceStatus);
    drawBusinessFrame(ctx, paper, "#176b87");
    drawTextFit(ctx, "INVOICE FOLLOW-UP EMAIL", margin, 104, paper.width - margin * 2, 46, { align: "left", weight: "900", color: "#17313b" });
    drawTextFit(ctx, statusLabel, paper.width - margin, 104, 380, 24, { align: "right", weight: "800", color: "#176b87" });
    drawTextFit(ctx, `${sanitizePrintable(values.tone || "friendly")} tone`, paper.width - margin, 140, 380, 20, { align: "right", weight: "600", color: "#5b6f78" });

    ctx.save();
    ctx.fillStyle = "#edf7f6";
    roundRect(ctx, margin, 190, paper.width - margin * 2, 128, 8, true, false);
    ctx.restore();
    drawTextFit(ctx, `For: ${sanitizePrintable(values.clientLabel || "Client")}`, margin + 26, 232, paper.width - margin * 2 - 52, 24, { align: "left", weight: "900", color: "#17313b" });
    drawTextFit(ctx, `Project: ${sanitizePrintable(values.projectLabel || "recent project")}`, margin + 26, 270, paper.width - margin * 2 - 52, 21, { align: "left", weight: "600", color: "#5b6f78" });

    const emailY = 380;
    ctx.save();
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, margin, emailY, paper.width - margin * 2, paper.height - emailY - 148, 8, true, false);
    ctx.strokeStyle = "rgba(23,49,59,0.16)";
    ctx.lineWidth = 2;
    roundRect(ctx, margin, emailY, paper.width - margin * 2, paper.height - emailY - 148, 8, false, true);
    ctx.restore();
    drawWrappedText(ctx, message, margin + 34, emailY + 54, paper.width - margin * 2 - 68, 31, "#17313b", "23px Arial", 22);
    drawFooterNote(ctx, paper, "Editable wording only. Not legal, tax, accounting, collections, or financial advice.");
  }

  function invoiceFollowupEmailText(values) {
    const client = sanitizePrintable(values.clientLabel || "Client");
    const project = sanitizePrintable(values.projectLabel || "recent project");
    const timing = sanitizePrintable(values.dueTiming || "due soon");
    const payment = sanitizePrintable(values.paymentWording || "Please use the payment link or invoice portal already sent.");
    const context = sanitizePrintable(values.context || "");
    const status = values.invoiceStatus || "sent";
    const tone = values.tone || "friendly";
    const greeting = tone === "concise" ? `Hi ${client},` : `Hi ${client},`;
    const signoff = tone === "warm" ? "Thanks again," : tone === "firm" ? "Thank you," : "Thanks,";
    const bodyByStatus = {
      sent: [
        `I wanted to gently follow up on the invoice for ${project}.`,
        `My note shows it is ${timing}, so I am keeping the details easy to find.`,
        payment,
      ],
      "due-today": [
        `A quick note that the invoice for ${project} is ${timing}.`,
        "If it is already in process, please disregard this reminder.",
        payment,
      ],
      overdue: [
        `I am following up because the invoice for ${project} appears to be ${timing}.`,
        "Could you let me know whether anything else is needed from my side to help complete it?",
        payment,
      ],
      paid: [
        `Thank you for taking care of the invoice for ${project}.`,
        "I appreciate the prompt update and enjoyed working together.",
        "I will keep the records on my side updated.",
      ],
      "next-invoice": [
        `For the next invoice connected to ${project}, I will keep the same simple format unless you prefer a different wording or schedule.`,
        `The current timing note I have is: ${timing}.`,
        payment,
      ],
    };
    const toneLine = tone === "firm"
      ? "I appreciate a quick update when you have a moment."
      : tone === "warm"
        ? "I appreciate your help and hope the week is going smoothly."
        : tone === "concise"
          ? "Please send a quick update when convenient."
          : "No rush if it is already queued; a quick update would be helpful.";
    return [
      greeting,
      "",
      context,
      ...(bodyByStatus[status] || bodyByStatus.sent),
      toneLine,
      "",
      signoff,
    ].filter((line, index, lines) => line || lines[index - 1]).join("\n").trim();
  }

  function invoiceFollowupStatusLabel(value) {
    const labels = {
      sent: "Polite reminder",
      "due-today": "Due today",
      overdue: "First overdue",
      paid: "Paid thank-you",
      "next-invoice": "Next invoice",
    };
    return labels[value] || "Polite reminder";
  }

  function drawEstimate(ctx, paper, values) {
    drawBusinessDocument(ctx, paper, values, {
      title: "ESTIMATE",
      accent: "#5a9367",
      fromLabel: "Prepared by",
      toLabel: "Prepared for",
      numberFallback: "EST-001",
      metaLabel: "Date",
      tableHeaders: ["Description", "Qty", "Rate", "Estimate"],
      totalLabel: "Estimated total",
      footer: "Estimate only. Final scope and cost may change after approval.",
      defaultNote: "This estimate is based on the scope listed above.",
    });
  }

  function drawPurchaseOrder(ctx, paper, values) {
    drawBusinessDocument(ctx, paper, values, {
      title: "PURCHASE ORDER",
      accent: "#17313b",
      fromLabel: "Buyer",
      toLabel: "Vendor",
      numberFallback: "PO-001",
      metaLabel: "Date",
      tableHeaders: ["Item", "Qty", "Unit", "Amount"],
      totalLabel: "Order total",
      footer: "Purchase order format only. Confirm vendor terms before ordering.",
      defaultNote: "Please reference this purchase order on the invoice.",
    });
  }

  function drawBillOfSale(ctx, paper, values) {
    drawBusinessDocument(ctx, paper, values, {
      title: "BILL OF SALE",
      accent: "#e76f51",
      fromLabel: "Seller",
      toLabel: "Buyer",
      numberFallback: "SALE-001",
      metaLabel: "Sale date",
      tableHeaders: ["Item sold", "Qty", "Price", "Amount"],
      totalLabel: "Sale total",
      footer: "Bill of sale draft only. Local requirements may vary.",
      defaultNote: "Buyer and seller should review local requirements before signing.",
      signatures: true,
    });
  }

  function drawBusinessDocument(ctx, paper, values, config) {
    const margin = 70;
    const currency = currencySymbol(values.currency);
    const items = parseMoneyItems(values.items);
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    drawBusinessFrame(ctx, paper, config.accent);
    drawTextFit(ctx, config.title, margin, 110, 520, config.title.length > 14 ? 46 : 58, { align: "left", weight: "900", color: "#17313b" });
    ctx.font = "22px Arial";
    ctx.fillStyle = "#5b6f78";
    ctx.textAlign = "right";
    ctx.fillText(sanitizePrintable(values.invoiceNo || config.numberFallback), paper.width - margin, 92);
    ctx.fillText(`${config.metaLabel}: ${sanitizePrintable(values.date || "")}`, paper.width - margin, 126);
    ctx.fillText(sanitizePrintable(values.due || "Due on receipt"), paper.width - margin, 160);

    drawBusinessBlock(ctx, config.fromLabel, values.business, margin, 215, (paper.width - margin * 2 - 24) / 2);
    drawBusinessBlock(ctx, config.toLabel, values.client, paper.width / 2 + 12, 215, (paper.width - margin * 2 - 24) / 2);

    const tableY = 420;
    const tableW = paper.width - margin * 2;
    const descW = tableW * 0.54;
    const qtyW = tableW * 0.14;
    const rateW = tableW * 0.16;
    const totalW = tableW - descW - qtyW - rateW;
    drawTableHeader(ctx, margin, tableY, tableW, config.tableHeaders, [descW, qtyW, rateW, totalW]);
    let y = tableY + 58;
    items.slice(0, 8).forEach((item) => {
      drawInvoiceRow(ctx, margin, y, [descW, qtyW, rateW, totalW], item, currency);
      y += 64;
    });
    if (!items.length) {
      drawInvoiceRow(ctx, margin, y, [descW, qtyW, rateW, totalW], { description: "Service", qty: 1, rate: 0, total: 0 }, currency);
      y += 64;
    }

    const totalBoxW = 320;
    const totalX = paper.width - margin - totalBoxW;
    ctx.strokeStyle = "rgba(23,49,59,0.25)";
    ctx.lineWidth = 2;
    ctx.strokeRect(totalX, y + 22, totalBoxW, 92);
    ctx.fillStyle = "#edf7f6";
    ctx.fillRect(totalX + 2, y + 24, totalBoxW - 4, 88);
    ctx.fillStyle = "#17313b";
    ctx.font = "700 24px Arial";
    ctx.textAlign = "left";
    ctx.fillText(config.totalLabel, totalX + 22, y + 77);
    ctx.textAlign = "right";
    ctx.font = "800 30px Arial";
    ctx.fillText(formatMoney(subtotal, currency), totalX + totalBoxW - 22, y + 77);

    drawWrappedText(ctx, sanitizePrintable(values.notes || config.defaultNote), margin, paper.height - 230, paper.width - margin * 2, 28, "#5b6f78", "22px Arial", 4);
    if (config.signatures) {
      drawSignatureLine(ctx, margin, paper.height - 135, "Seller signature");
      drawSignatureLine(ctx, paper.width / 2 + 30, paper.height - 135, "Buyer signature");
    }
    drawFooterNote(ctx, paper, config.footer);
  }

  function drawRentReceipt(ctx, paper, values) {
    const margin = 78;
    const currency = currencySymbol(values.currency);
    drawBusinessFrame(ctx, paper, "#5a9367");
    drawTextFit(ctx, "RENT RECEIPT", paper.width / 2, 120, paper.width - margin * 2, 58, { align: "center", weight: "900", color: "#17313b" });
    ctx.font = "24px Arial";
    ctx.fillStyle = "#5b6f78";
    ctx.textAlign = "center";
    ctx.fillText(`Payment date: ${sanitizePrintable(values.paidDate || "")}`, paper.width / 2, 166);

    const amountText = formatMoney(parseAmount(values.amount), currency);
    ctx.fillStyle = "#edf7f6";
    roundRect(ctx, margin, 220, paper.width - margin * 2, 130, 8, true, false);
    drawTextFit(ctx, amountText, paper.width / 2, 286, paper.width - margin * 2 - 40, 54, { align: "center", weight: "900", color: "#176b87" });

    const rows = [
      ["Received from", values.receivedFrom],
      ["Received by", values.landlord],
      ["Property", values.property],
      ["Rental period", values.period],
      ["Payment method", values.method],
    ];
    let y = 410;
    rows.forEach(([label, value]) => {
      drawReceiptLine(ctx, margin, y, paper.width - margin * 2, label, sanitizePrintable(value));
      y += 82;
    });

    drawWrappedText(ctx, sanitizePrintable(values.notes || ""), margin, y + 20, paper.width - margin * 2, 28, "#5b6f78", "22px Arial", 4);
    drawSignatureLine(ctx, margin, paper.height - 260, "Recipient signature");
    drawSignatureLine(ctx, paper.width / 2 + 30, paper.height - 260, "Date");
    drawFooterNote(ctx, paper, "Receipt format only. Local laws and record requirements may vary.");
  }

  function drawResume(ctx, paper, values) {
    const margin = 76;
    drawBusinessFrame(ctx, paper, "#17313b");
    drawTextFit(ctx, sanitizePrintable(values.name || "Your Name"), paper.width / 2, 104, paper.width - margin * 2, 50, { align: "center", weight: "900", color: "#17313b" });
    drawTextFit(ctx, sanitizePrintable(values.headline || ""), paper.width / 2, 154, paper.width - margin * 2, 26, { align: "center", weight: "700", color: "#176b87" });
    drawTextFit(ctx, sanitizePrintable(values.contact || ""), paper.width / 2, 192, paper.width - margin * 2, 20, { align: "center", weight: "400", color: "#5b6f78" });

    let y = 260;
    y = drawResumeSection(ctx, "Summary", values.summary, margin, y, paper.width - margin * 2, 4);
    y = drawResumeSection(ctx, "Experience", values.experience, margin, y + 18, paper.width - margin * 2, 10, true);
    y = drawResumeSection(ctx, "Skills", values.skills, margin, y + 18, paper.width - margin * 2, 4);
    drawResumeSection(ctx, "Education", values.education, margin, y + 18, paper.width - margin * 2, 4);
    drawFooterNote(ctx, paper, "Generated locally with PrintableTools Lab. Proofread before applying.");
  }

  function drawAtsResumeChecker(ctx, paper, values) {
    const margin = 72;
    const report = buildAtsResumeReport(values);
    drawBusinessFrame(ctx, paper, "#2563eb");
    drawTextFit(ctx, "ATS RESUME CHECK", margin, 100, paper.width - margin * 2, 44, { align: "left", weight: "900", color: "#17313b" });
    drawTextFit(ctx, sanitizePrintable(values.targetRole || "Target role"), margin, 142, paper.width - margin * 2, 24, { align: "left", weight: "700", color: "#2563eb" });
    drawTextFit(ctx, "Local report only - no upload, no universal hiring score", margin, 176, paper.width - margin * 2, 18, { align: "left", weight: "500", color: "#5b6f78" });

    const scoreX = paper.width - margin - 265;
    drawScoreBadge(ctx, scoreX, 76, 235, 126, report.score);
    drawMetricCard(ctx, margin, 230, 250, 110, "Keyword match", `${report.matchPercent}%`, `${report.matched.length}/${report.keywords.length || 1} role terms`);
    drawMetricCard(ctx, margin + 278, 230, 250, 110, "Sections", `${report.sectionScore}/${report.requiredSections.length}`, report.missingSections.length ? "Missing basics" : "Core headings found");
    drawMetricCard(ctx, margin + 556, 230, 250, 110, "Evidence", `${report.numberCount}`, report.numberCount ? "Numbers found" : "Add true metrics");
    drawMetricCard(ctx, margin + 834, 230, 250, 110, "Readability", report.readabilityLabel, `${report.wordCount} words`);

    let y = 395;
    drawAtsListPanel(ctx, margin, y, paper.width - margin * 2, 165, "Matched role keywords", report.matched.length ? report.matched.slice(0, 12) : ["No strong job-description matches found yet."], "#edf7ff");
    y += 195;
    drawAtsListPanel(ctx, margin, y, paper.width - margin * 2, 165, "Missing honest keywords to review", report.missing.length ? report.missing.slice(0, 12) : ["No obvious high-priority missing terms from the pasted job description."], "#fff7ed");
    y += 195;

    const leftW = Math.floor((paper.width - margin * 2 - 28) * 0.48);
    const rightW = paper.width - margin * 2 - leftW - 28;
    drawAtsListPanel(ctx, margin, y, leftW, 245, "Format checks", report.formatChecks, "#f8fafc");
    drawAtsListPanel(ctx, margin + leftW + 28, y, rightW, 245, "Next edits", report.recommendations, "#f0fdf4");

    drawFooterNote(ctx, paper, "This local checker supports editing decisions. It does not guarantee ATS parsing, interviews, or hiring outcomes.");
  }

  function buildAtsResumeReport(values) {
    const resumeText = normalizeAtsText(values.resumeText || "");
    const jobText = normalizeAtsText(values.jobDescription || "");
    const resumeTokens = keywordSet(resumeText);
    const keywords = extractAtsKeywords(jobText).slice(0, 18);
    const matched = keywords.filter((keyword) => phraseMatchesText(resumeText, keyword) || resumeTokens.has(keyword));
    const missing = keywords.filter((keyword) => !matched.includes(keyword));
    const requiredSections = ["summary", "experience", "skills", "education"];
    const missingSections = requiredSections.filter((section) => !new RegExp(`\\b${section}\\b`, "i").test(resumeText));
    const wordCount = resumeText.split(/\s+/).filter(Boolean).length;
    const numberCount = (resumeText.match(/\b\d+[%+]?\b/g) || []).length;
    const bulletLikeCount = (resumeText.match(/(^|\n)\s*[-*•]/g) || []).length;
    const longSentenceCount = resumeText.split(/[.!?]\s+/).filter((sentence) => sentence.split(/\s+/).filter(Boolean).length > 34).length;
    const matchPercent = keywords.length ? Math.round(matched.length / keywords.length * 100) : 0;
    const sectionScore = requiredSections.length - missingSections.length;
    const readabilityLabel = longSentenceCount > 4 ? "Dense" : wordCount < 140 ? "Thin" : "Clear";
    const score = clampNumber(Math.round(matchPercent * 0.48 + sectionScore / requiredSections.length * 28 + Math.min(numberCount, 4) * 4 + (readabilityLabel === "Clear" ? 8 : 3)), 0, 100);
    const formatChecks = [
      missingSections.length ? `Add section heading(s): ${missingSections.join(", ")}.` : "Core section headings are present.",
      bulletLikeCount ? "Bullet-style lines are present for scanning." : "Consider bullets for experience achievements.",
      numberCount ? "At least one measurable result appears in the resume." : "Add true numbers such as %, $, volume, time saved, or team size.",
      longSentenceCount > 4 ? "Several sentences are long; shorten before applying." : "Sentence length looks reasonably scannable.",
      wordCount < 140 ? "Resume text may be too thin for a full application." : "Resume text has enough substance for a first review.",
    ];
    const recommendations = [];
    if (missing.length) recommendations.push(`Review honest matches for: ${missing.slice(0, 5).join(", ")}.`);
    if (missingSections.length) recommendations.push("Use standard headings so recruiters and parsers can find key sections.");
    if (!numberCount) recommendations.push("Turn one responsibility into a measurable achievement if the number is true.");
    if (longSentenceCount > 4) recommendations.push("Split dense sentences into shorter action-result bullets.");
    if (!recommendations.length) recommendations.push("Tailor the top summary and first experience bullet to the exact role before applying.");
    recommendations.push("Keep claims truthful; do not add keywords you cannot support in an interview.");
    return { score, keywords, matched, missing, matchPercent, requiredSections, missingSections, sectionScore, numberCount, wordCount, readabilityLabel, formatChecks, recommendations };
  }

  function normalizeAtsText(value) {
    return String(value || "").toLowerCase().replace(/[^\w\s+#.%/-]/g, " ").replace(/\s+/g, " ").trim();
  }

  function keywordSet(text) {
    return new Set(normalizeAtsText(text).split(/\s+/).filter((token) => token.length > 2 && !ATS_STOP_WORDS.has(token)));
  }

  function extractAtsKeywords(text) {
    const normalized = normalizeAtsText(text);
    const tokens = normalized.split(/\s+/).filter((token) => token.length > 2 && !ATS_STOP_WORDS.has(token));
    const counts = new Map();
    tokens.forEach((token) => counts.set(token, (counts.get(token) || 0) + 1));
    const phrases = [];
    const rawWords = normalized.split(/\s+/);
    for (let size = 3; size >= 2; size -= 1) {
      for (let i = 0; i <= rawWords.length - size; i += 1) {
        const phraseTokens = rawWords.slice(i, i + size);
        if (phraseTokens.every((token) => token.length > 2 && !ATS_STOP_WORDS.has(token))) phrases.push(phraseTokens.join(" "));
      }
    }
    const phraseCounts = new Map();
    phrases.forEach((phrase) => phraseCounts.set(phrase, (phraseCounts.get(phrase) || 0) + 1));
    const rankedPhrases = Array.from(phraseCounts.entries())
      .filter(([phrase]) => !phrase.split(" ").every((part) => counts.get(part) === 1))
      .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
      .map(([phrase]) => phrase);
    const rankedTokens = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
      .map(([token]) => token);
    return uniqueItems([...rankedPhrases, ...rankedTokens]).slice(0, 24);
  }

  function phraseMatchesText(text, phrase) {
    if (!phrase || !phrase.includes(" ")) return false;
    return normalizeAtsText(text).includes(phrase);
  }

  function uniqueItems(items) {
    const seen = new Set();
    return items.filter((item) => {
      const key = String(item || "").trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function drawScoreBadge(ctx, x, y, width, height, score) {
    ctx.save();
    ctx.fillStyle = "#eef6ff";
    roundRect(ctx, x, y, width, height, 8, true, false);
    ctx.strokeStyle = "rgba(37,99,235,0.3)";
    ctx.lineWidth = 2;
    roundRect(ctx, x, y, width, height, 8, false, true);
    drawTextFit(ctx, String(score), x + width / 2, y + 58, width - 36, 54, { align: "center", weight: "900", color: score >= 72 ? "#15803d" : score >= 50 ? "#b45309" : "#b91c1c" });
    drawTextFit(ctx, "local fit check", x + width / 2, y + 96, width - 36, 19, { align: "center", weight: "700", color: "#5b6f78" });
    ctx.restore();
  }

  function drawMetricCard(ctx, x, y, width, height, label, value, note) {
    ctx.save();
    ctx.fillStyle = "#f8fafc";
    roundRect(ctx, x, y, width, height, 8, true, false);
    ctx.strokeStyle = "rgba(23,49,59,0.16)";
    ctx.lineWidth = 1.5;
    roundRect(ctx, x, y, width, height, 8, false, true);
    drawTextFit(ctx, label, x + 18, y + 30, width - 36, 17, { align: "left", weight: "700", color: "#5b6f78" });
    drawTextFit(ctx, value, x + 18, y + 68, width - 36, 30, { align: "left", weight: "900", color: "#17313b" });
    drawTextFit(ctx, note, x + 18, y + 96, width - 36, 15, { align: "left", weight: "500", color: "#5b6f78" });
    ctx.restore();
  }

  function drawAtsListPanel(ctx, x, y, width, height, title, items, fill) {
    ctx.save();
    ctx.fillStyle = fill || "#f8fafc";
    roundRect(ctx, x, y, width, height, 8, true, false);
    ctx.strokeStyle = "rgba(23,49,59,0.16)";
    ctx.lineWidth = 1.5;
    roundRect(ctx, x, y, width, height, 8, false, true);
    drawTextFit(ctx, title, x + 22, y + 36, width - 44, 22, { align: "left", weight: "900", color: "#17313b" });
    let cursor = y + 72;
    const max = Math.max(3, Math.floor((height - 80) / 26));
    items.slice(0, max).forEach((item) => {
      drawTextFit(ctx, `- ${sanitizePrintable(item)}`, x + 24, cursor, width - 48, 18, { align: "left", weight: "500", color: "#17313b" });
      cursor += 27;
    });
    ctx.restore();
  }

  const ATS_STOP_WORDS = new Set([
    "the", "and", "for", "with", "you", "your", "our", "are", "will", "this", "that", "from", "have", "has", "job", "role", "work", "team", "teams", "candidate", "candidates", "responsibilities", "requirements", "preferred", "experience", "years", "about", "into", "using", "use", "able", "ability", "including", "such", "must", "plus", "good", "strong", "excellent", "company", "within", "across", "support", "supports"
  ]);

  function drawCoverLetter(ctx, paper, values) {
    const margin = 94;
    drawBusinessFrame(ctx, paper, "#176b87");
    drawTextFit(ctx, sanitizePrintable(values.name || "Your Name"), paper.width / 2, 112, paper.width - margin * 2, 46, { align: "center", weight: "900", color: "#17313b" });
    drawTextFit(ctx, sanitizePrintable(values.contact || ""), paper.width / 2, 154, paper.width - margin * 2, 20, { align: "center", weight: "400", color: "#5b6f78" });

    const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    let y = 230;
    ctx.fillStyle = "#5b6f78";
    ctx.font = "21px Arial";
    ctx.textAlign = "left";
    ctx.fillText(date, margin, y);
    y += 58;
    drawTextFit(ctx, sanitizePrintable(values.greeting || "Dear Hiring Manager,"), margin, y, paper.width - margin * 2, 24, { align: "left", weight: "700", color: "#17313b" });
    y += 58;

    const role = sanitizePrintable(values.role || "the open role");
    const company = sanitizePrintable(values.company || "your organization");
    const paragraphs = [
      values.opening || `I am excited to apply for the ${role} role at ${company}.`,
      values.strengths || "My background includes practical coordination, communication, and follow-through skills that can support the team from day one.",
      values.closing || "I would welcome the opportunity to discuss how my experience can support your team.",
    ];
    paragraphs.forEach((paragraph) => {
      y = drawWrappedTextReturnY(ctx, sanitizePrintable(paragraph), margin, y, paper.width - margin * 2, 32, "#17313b", "23px Arial", 5);
      y += 34;
    });
    drawTextFit(ctx, sanitizePrintable(values.signoff || "Sincerely,"), margin, y + 20, paper.width - margin * 2, 23, { align: "left", weight: "500", color: "#17313b" });
    drawTextFit(ctx, sanitizePrintable(values.name || "Your Name"), margin, y + 78, paper.width - margin * 2, 24, { align: "left", weight: "800", color: "#17313b" });
    drawFooterNote(ctx, paper, "Generated locally with PrintableTools Lab. Edit carefully before sending.");
  }

  function drawResignationLetter(ctx, paper, values) {
    const margin = 94;
    drawBusinessFrame(ctx, paper, "#5a9367");
    let y = 108;
    drawTextFit(ctx, "RESIGNATION LETTER", paper.width / 2, y, paper.width - margin * 2, 46, { align: "center", weight: "900", color: "#17313b" });
    y += 74;
    drawWrappedText(ctx, sanitizePrintable(values.name || "Your Name"), margin, y, paper.width - margin * 2, 28, "#17313b", "23px Arial", 2);
    drawTextFit(ctx, sanitizePrintable(values.contact || ""), margin, y + 34, paper.width - margin * 2, 20, { align: "left", weight: "400", color: "#5b6f78" });
    y += 105;
    ctx.fillStyle = "#5b6f78";
    ctx.font = "22px Arial";
    ctx.textAlign = "left";
    ctx.fillText(sanitizePrintable(values.date || ""), margin, y);
    y += 58;
    drawTextFit(ctx, sanitizePrintable(values.manager || "Manager Name"), margin, y, paper.width - margin * 2, 23, { align: "left", weight: "700", color: "#17313b" });
    drawTextFit(ctx, sanitizePrintable(values.company || "Company Name"), margin, y + 34, paper.width - margin * 2, 22, { align: "left", weight: "500", color: "#5b6f78" });
    y += 100;

    const greeting = `Dear ${sanitizePrintable(values.manager || "Manager")},`;
    const role = sanitizePrintable(values.role || "my role");
    const company = sanitizePrintable(values.company || "the company");
    const lastDay = sanitizePrintable(values.lastDay || "my final working day");
    const intro = values.tone === "brief"
      ? `Please accept this letter as notice of my resignation from my position as ${role} at ${company}. My last working day will be ${lastDay}.`
      : `Please accept this letter as formal notice of my resignation from my position as ${role} at ${company}. My last working day will be ${lastDay}.`;
    const paragraphs = [
      greeting,
      intro,
      sanitizePrintable(values.appreciation || "I appreciate the opportunities and support I have received during my time with the team."),
      sanitizePrintable(values.handoff || "I will help document current work and support a smooth transition before my last day."),
      values.tone === "warm" ? "Thank you again for the opportunity to be part of the team." : "Thank you for your understanding.",
    ];
    paragraphs.forEach((paragraph, index) => {
      y = drawWrappedTextReturnY(ctx, paragraph, margin, y, paper.width - margin * 2, 31, "#17313b", index === 0 ? "700 23px Arial" : "23px Arial", index === 0 ? 1 : 4);
      y += index === 0 ? 38 : 32;
    });
    drawTextFit(ctx, "Sincerely,", margin, y + 15, paper.width - margin * 2, 23, { align: "left", weight: "500", color: "#17313b" });
    drawTextFit(ctx, sanitizePrintable(values.name || "Your Name"), margin, y + 74, paper.width - margin * 2, 24, { align: "left", weight: "800", color: "#17313b" });
    drawFooterNote(ctx, paper, "Practical letter draft only. Review contract, policy, and local requirements.");
  }

  function drawMonthlyCalendar(ctx, paper, values) {
    const margin = 66;
    const monthName = sanitizePrintable(values.month || "June");
    const year = Math.max(1970, Math.min(2100, Number(String(values.year || "2026").replace(/\D/g, "")) || 2026));
    const monthIndex = Math.max(0, MONTHS.indexOf(monthName));
    const weekStartsMonday = values.startDay === "monday";
    drawPageFrame(ctx, paper, "#176b87");
    drawTextFit(ctx, sanitizePrintable(values.title || "Monthly Calendar"), paper.width / 2, 112, paper.width - margin * 2, 52, { align: "center", weight: "900", color: "#17313b" });
    drawTextFit(ctx, `${MONTHS[monthIndex]} ${year}`, paper.width / 2, 162, paper.width - margin * 2, 34, { align: "center", weight: "700", color: "#176b87" });

    const days = weekStartsMonday ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const first = new Date(year, monthIndex, 1);
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const startOffset = weekStartsMonday ? (first.getDay() + 6) % 7 : first.getDay();
    const gridTop = 230;
    const gridW = paper.width - margin * 2;
    const dayW = gridW / 7;
    const rowH = 154;
    ctx.fillStyle = "#17313b";
    ctx.fillRect(margin, gridTop, gridW, 46);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 18px Arial";
    ctx.textAlign = "center";
    days.forEach((day, index) => ctx.fillText(day, margin + dayW * index + dayW / 2, gridTop + 30));
    let day = 1;
    for (let row = 0; row < 6; row += 1) {
      for (let col = 0; col < 7; col += 1) {
        const x = margin + col * dayW;
        const y = gridTop + 46 + row * rowH;
        ctx.strokeStyle = "rgba(23,49,59,0.26)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y, dayW, rowH);
        if (row === 0 && col < startOffset) continue;
        if (day > daysInMonth) continue;
        ctx.fillStyle = "#17313b";
        ctx.font = "700 22px Arial";
        ctx.textAlign = "left";
        ctx.fillText(String(day), x + 12, y + 30);
        drawNoteLines(ctx, x + 12, y + 55, dayW - 24, 3);
        day += 1;
      }
    }
    const notes = splitList(values.notes || "", "\n").slice(0, 4);
    drawPromptBox(ctx, margin, paper.height - 215, gridW, notes.length ? `Notes: ${notes.join(" / ")}` : "Notes");
  }

  function drawMealPlanner(ctx, paper, values) {
    const margin = 64;
    drawPageFrame(ctx, paper, "#5a9367");
    drawTextFit(ctx, sanitizePrintable(values.title || "Weekly Meal Planner"), paper.width / 2, 112, paper.width - margin * 2, 54, { align: "center", weight: "900", color: "#17313b" });
    const tableTop = 188;
    const tableW = paper.width - margin * 2;
    const dayW = tableW * 0.16;
    const mealW = (tableW - dayW) / 3;
    drawTableHeader(ctx, margin, tableTop, tableW, ["Day", "Breakfast", "Lunch", "Dinner"], [dayW, mealW, mealW, mealW]);
    const rows = parseMealRows(values.meals);
    let y = tableTop + 54;
    rows.slice(0, 7).forEach((row) => {
      drawMealRow(ctx, margin, y, [dayW, mealW, mealW, mealW], row);
      y += 80;
    });
    const lowerTop = y + 36;
    const groceryW = tableW * 0.46;
    drawListPanel(ctx, margin, lowerTop, groceryW, paper.height - lowerTop - 110, "Grocery list", splitList(values.grocery || "", "\n").slice(0, 12));
    drawListPanel(ctx, margin + groceryW + 30, lowerTop, tableW - groceryW - 30, paper.height - lowerTop - 110, "Prep notes", wrapText(ctx, sanitizePrintable(values.notes || ""), tableW - groceryW - 70, "22px Arial", 8));
    drawFooterNote(ctx, paper, "Generated locally with PrintableTools Lab. Adjust meals and groceries before shopping.");
  }

  function drawImageToPdf(ctx, paper, values) {
    const margin = 70;
    const images = imageToolState.get("image-to-pdf") || [];
    drawBusinessFrame(ctx, paper, "#176b87");
    drawTextFit(ctx, sanitizePrintable(values.title || "Image to PDF"), paper.width / 2, 108, paper.width - margin * 2, 46, { align: "center", weight: "900", color: "#17313b" });
    const caption = sanitizePrintable(values.caption || "");
    const contentTop = caption ? 182 : 154;
    if (caption) drawTextFit(ctx, caption, paper.width / 2, 158, paper.width - margin * 2, 22, { align: "center", weight: "500", color: "#5b6f78" });

    if (!images.length) {
      ctx.save();
      ctx.strokeStyle = "rgba(23,49,59,0.28)";
      ctx.lineWidth = 3;
      ctx.setLineDash([14, 10]);
      roundRect(ctx, margin, contentTop + 40, paper.width - margin * 2, paper.height - contentTop - 230, 8, false, true);
      ctx.setLineDash([]);
      drawTextFit(ctx, "Select an image to preview the PDF", paper.width / 2, paper.height / 2 - 28, paper.width - margin * 2 - 60, 38, { align: "center", weight: "800", color: "#17313b" });
      drawTextFit(ctx, "JPG, PNG, and WebP files are processed locally in this browser.", paper.width / 2, paper.height / 2 + 26, paper.width - margin * 2 - 80, 23, { align: "center", weight: "500", color: "#5b6f78" });
      ctx.restore();
      drawFooterNote(ctx, paper, "No upload image-to-PDF tool. Review the downloaded PDF before sharing.");
      return;
    }

    if (values.layout === "gallery" && images.length > 1) {
      drawImageGallery(ctx, paper, images, margin, contentTop);
    } else {
      const box = { x: margin, y: contentTop, width: paper.width - margin * 2, height: paper.height - contentTop - 125 };
      drawImageInBox(ctx, images[0].image, box, values.layout === "fill");
      drawTextFit(ctx, images[0].name || "Selected image", margin, paper.height - 86, paper.width - margin * 2, 18, { align: "left", weight: "500", color: "#5b6f78" });
    }
    drawFooterNote(ctx, paper, "Image converted locally with PrintableTools Lab. No image upload required.");
  }

  function drawImageGallery(ctx, paper, images, margin, top) {
    const gap = 22;
    const cols = 2;
    const rows = 2;
    const gridW = paper.width - margin * 2;
    const gridH = paper.height - top - 125;
    const cellW = (gridW - gap) / cols;
    const cellH = (gridH - gap) / rows;
    images.slice(0, 4).forEach((item, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = margin + col * (cellW + gap);
      const y = top + row * (cellH + gap);
      ctx.strokeStyle = "rgba(23,49,59,0.2)";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, cellW, cellH);
      drawImageInBox(ctx, item.image, { x: x + 10, y: y + 10, width: cellW - 20, height: cellH - 48 }, false);
      drawTextFit(ctx, item.name || `Image ${index + 1}`, x + 12, y + cellH - 20, cellW - 24, 17, { align: "left", weight: "500", color: "#5b6f78" });
    });
  }

  function drawMultiImagePdf(ctx, paper, values) {
    const margin = 72;
    const images = imageToolState.get("multi-image-pdf") || [];
    drawBusinessFrame(ctx, paper, "#17313b");
    drawTextFit(ctx, sanitizePrintable(values.title || "Images to PDF"), paper.width / 2, 108, paper.width - margin * 2, 46, { align: "center", weight: "900", color: "#17313b" });
    drawTextFit(ctx, `${images.length || 0} selected image${images.length === 1 ? "" : "s"} - each image exports as its own PDF page`, paper.width / 2, 152, paper.width - margin * 2, 22, { align: "center", weight: "500", color: "#5b6f78" });
    const caption = sanitizePrintable(values.caption || "");
    if (caption) drawTextFit(ctx, caption, paper.width / 2, 188, paper.width - margin * 2, 21, { align: "center", weight: "500", color: "#5b6f78" });
    if (!images.length) {
      drawDashedRect(ctx, margin, 260, paper.width - margin * 2, paper.height - 420, "rgba(23,49,59,0.34)");
      drawTextFit(ctx, "Select images to preview a multi-page PDF", paper.width / 2, paper.height / 2 - 26, paper.width - margin * 2 - 80, 38, { align: "center", weight: "800", color: "#17313b" });
      drawTextFit(ctx, "JPG, PNG, and WebP files are processed locally in this browser.", paper.width / 2, paper.height / 2 + 30, paper.width - margin * 2 - 80, 23, { align: "center", weight: "500", color: "#5b6f78" });
      drawFooterNote(ctx, paper, "No-upload multi-image PDF converter. Review the PDF before sharing.");
      return;
    }
    drawImageGallery(ctx, paper, images.slice(0, 4), margin, 235);
    if (images.length > 4) {
      drawTextFit(ctx, `Plus ${images.length - 4} more image${images.length - 4 === 1 ? "" : "s"} in the PDF export`, margin, paper.height - 104, paper.width - margin * 2, 21, { align: "left", weight: "700", color: "#176b87" });
    }
    drawFooterNote(ctx, paper, "Images converted locally with PrintableTools Lab. No image upload required.");
  }

  function drawQrCode(ctx, paper, values) {
    const payload = qrTextPayload(values.content);
    drawQrSheet(ctx, paper, {
      title: values.title || "Scan This QR Code",
      caption: values.caption || "Static QR code for a link or short text",
      payload,
      errorCorrection: values.errorCorrection || "M",
      accent: "#176b87",
      metaLines: [
        "Static QR code",
        payload.startsWith("http") ? displayUrl(payload) : "Short text QR payload",
        "Test before printing",
      ],
      footer: "Static QR generated locally. The printed code cannot be edited later.",
    });
  }

  function drawWifiQrCode(ctx, paper, values) {
    const ssid = qrPlainText(values.networkName, 80) || "Guest Network";
    const payload = wifiQrPayload(values);
    drawQrSheet(ctx, paper, {
      title: values.title || "Guest WiFi",
      caption: values.caption || "Scan to join the WiFi network",
      payload,
      errorCorrection: "Q",
      accent: "#5a9367",
      metaLines: [
        `Network: ${ssid}`,
        values.encryption === "nopass" ? "No password network" : "Password encoded in QR",
        values.hidden === "true" ? "Hidden network" : "Visible network",
      ],
      footer: "WiFi QR generated locally. Use a guest network for public signs.",
    });
  }

  function drawVcardQrCode(ctx, paper, values) {
    const payload = vcardQrPayload(values);
    const name = qrPlainText(values.fullName, 80) || "Contact";
    drawQrSheet(ctx, paper, {
      title: values.title || "Save My Contact",
      caption: values.note || "Scan to save this contact",
      payload,
      errorCorrection: "Q",
      accent: "#b85c38",
      metaLines: [
        name,
        qrPlainText(values.company, 80) || "Contact card",
        [qrPlainText(values.email, 90), qrPlainText(values.phone, 40)].filter(Boolean).join(" | ") || "Review details before sharing",
      ],
      footer: "Contact QR generated locally. Scan and verify fields before printing.",
    });
  }

  function drawQrSheet(ctx, paper, config) {
    const margin = 76;
    const title = sanitizePrintable(config.title || "QR Code");
    const caption = sanitizePrintable(config.caption || "");
    const payload = String(config.payload || "https://printable-tools-lab.pages.dev/").slice(0, 1200);
    const matrix = buildQrMatrix(payload, config.errorCorrection || "M");
    drawBusinessFrame(ctx, paper, config.accent || "#176b87");
    drawTextFit(ctx, title, paper.width / 2, 104, paper.width - margin * 2, 48, { align: "center", weight: "900", color: "#17313b" });
    if (caption) {
      drawTextFit(ctx, caption, paper.width / 2, 154, paper.width - margin * 2, 23, { align: "center", weight: "500", color: "#5b6f78" });
    }

    const qrSize = Math.min(670, paper.width - margin * 2 - 120, paper.height - 620);
    const qrX = (paper.width - qrSize) / 2;
    const qrY = caption ? 218 : 196;
    ctx.save();
    ctx.shadowColor = "rgba(23,49,59,0.16)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, qrX - 22, qrY - 22, qrSize + 44, qrSize + 44, 8, true, false);
    ctx.restore();
    ctx.strokeStyle = "rgba(23,49,59,0.18)";
    ctx.lineWidth = 2;
    roundRect(ctx, qrX - 22, qrY - 22, qrSize + 44, qrSize + 44, 8, false, true);

    if (matrix.ok) {
      drawQrMatrix(ctx, matrix, qrX, qrY, qrSize, "#17313b", "#ffffff");
    } else {
      drawDashedRect(ctx, qrX, qrY, qrSize, qrSize, "rgba(184,92,56,0.7)");
      drawTextFit(ctx, "QR code could not be rendered", paper.width / 2, qrY + qrSize / 2 - 22, qrSize - 70, 30, { align: "center", weight: "900", color: "#b85c38" });
      drawTextFit(ctx, matrix.error || "Shorten the content and try again.", paper.width / 2, qrY + qrSize / 2 + 24, qrSize - 90, 21, { align: "center", weight: "500", color: "#5b6f78" });
    }

    const metaTop = qrY + qrSize + 82;
    const metaLines = (config.metaLines || []).map((lineText) => sanitizePrintable(lineText)).filter(Boolean).slice(0, 4);
    ctx.fillStyle = "#edf7f6";
    roundRect(ctx, margin, metaTop, paper.width - margin * 2, 168, 8, true, false);
    ctx.strokeStyle = "rgba(23,49,59,0.18)";
    ctx.lineWidth = 1.5;
    roundRect(ctx, margin, metaTop, paper.width - margin * 2, 168, 8, false, true);
    drawTextFit(ctx, "Print and scan check", margin + 26, metaTop + 35, paper.width - margin * 2 - 52, 23, { align: "left", weight: "900", color: "#17313b" });
    metaLines.forEach((lineText, index) => {
      drawTextFit(ctx, lineText, margin + 26, metaTop + 74 + index * 29, paper.width - margin * 2 - 52, 20, { align: "left", weight: "500", color: "#5b6f78" });
    });
    drawTextFit(ctx, "Leave white space around the code and avoid stretching it in print settings.", paper.width / 2, metaTop + 204, paper.width - margin * 2, 20, { align: "center", weight: "600", color: "#176b87" });
    drawFooterNote(ctx, paper, config.footer || "QR generated locally with PrintableTools Lab. Scan before sharing.");
  }

  function drawSignaturePngPreview(ctx, paper, values) {
    const margin = 72;
    const ink = signatureInkColor(values.inkColor);
    const signatureCanvas = renderSignatureOutputCanvas(values, { preview: true, width: 980, height: 360 });
    drawBusinessFrame(ctx, paper, "#4f46e5");
    drawTextFit(ctx, "Signature PNG", paper.width / 2, 104, paper.width - margin * 2, 48, { align: "center", weight: "900", color: "#17313b" });
    drawTextFit(ctx, "Draw or type a visual signature image. Export can be transparent and local.", paper.width / 2, 150, paper.width - margin * 2, 23, { align: "center", weight: "500", color: "#5b6f78" });

    const box = { x: margin, y: 220, width: paper.width - margin * 2, height: 520 };
    ctx.save();
    ctx.fillStyle = values.background === "white" ? "#ffffff" : "#f8fafc";
    roundRect(ctx, box.x, box.y, box.width, box.height, 8, true, false);
    ctx.strokeStyle = "rgba(23,49,59,0.18)";
    ctx.lineWidth = 2;
    roundRect(ctx, box.x, box.y, box.width, box.height, 8, false, true);
    if (values.background !== "white") drawTransparencyGrid(ctx, box.x + 24, box.y + 24, box.width - 48, box.height - 48, 22);
    ctx.restore();
    drawImageInBox(ctx, signatureCanvas, { x: box.x + 72, y: box.y + 84, width: box.width - 144, height: box.height - 168 }, true);

    const detailY = 820;
    const source = signaturePadHasInk("signature-png", "signaturePad") && values.style === "auto" ? "Drawn signature" : values.style === "typed-clean" ? "Typed clean signature" : "Typed script signature";
    const background = values.background === "white" ? "white PNG background" : "transparent PNG background";
    const lines = [
      source,
      `${background}; ${signaturePaddingLabel(values.padding)} crop`,
      `${signatureStrokeLabel(values.strokeWidth)} ${signatureInkLabel(values.inkColor)} ink`,
      "Visual signature image only, not identity verification.",
    ];
    ctx.fillStyle = "#eef2ff";
    roundRect(ctx, margin, detailY, paper.width - margin * 2, 190, 8, true, false);
    drawTextFit(ctx, "Export details", margin + 26, detailY + 38, paper.width - margin * 2 - 52, 25, { align: "left", weight: "900", color: "#17313b" });
    lines.forEach((lineText, index) => {
      drawTextFit(ctx, lineText, margin + 26, detailY + 78 + index * 30, paper.width - margin * 2 - 52, 21, { align: "left", weight: index === 0 ? "800" : "500", color: index === 0 ? ink : "#5b6f78" });
    });
    drawFooterNote(ctx, paper, "Signature PNG generated locally with PrintableTools Lab. Check acceptance rules before using it.");
  }

  function buildQrMatrix(payload, errorCorrection) {
    const level = ["L", "M", "Q", "H"].includes(errorCorrection) ? errorCorrection : "M";
    if (typeof window.qrcode !== "function") {
      return { ok: false, error: "QR engine is still loading. Refresh the preview." };
    }
    try {
      const qr = window.qrcode(0, level);
      qr.addData(String(payload || " "));
      qr.make();
      return {
        ok: true,
        count: qr.getModuleCount(),
        isDark: (row, col) => qr.isDark(row, col),
      };
    } catch (error) {
      return { ok: false, error: "The content is too long for a printable QR code." };
    }
  }

  function drawQrMatrix(ctx, matrix, x, y, size, darkColor, lightColor) {
    const quiet = 4;
    const modules = matrix.count + quiet * 2;
    const moduleSize = Math.max(1, Math.floor(size / modules));
    const actual = moduleSize * modules;
    const offsetX = x + (size - actual) / 2;
    const offsetY = y + (size - actual) / 2;
    ctx.save();
    ctx.fillStyle = lightColor || "#ffffff";
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle = darkColor || "#17313b";
    for (let row = 0; row < matrix.count; row += 1) {
      for (let col = 0; col < matrix.count; col += 1) {
        if (matrix.isDark(row, col)) {
          ctx.fillRect(offsetX + (col + quiet) * moduleSize, offsetY + (row + quiet) * moduleSize, moduleSize, moduleSize);
        }
      }
    }
    ctx.restore();
  }

  function qrTextPayload(value) {
    return String(value || "https://printable-tools-lab.pages.dev/").trim().slice(0, 700) || "https://printable-tools-lab.pages.dev/";
  }

  function qrPlainText(value, maxLength) {
    return String(value || "").replace(/[\r\n]+/g, " ").replace(/[<>]/g, "").trim().slice(0, maxLength || 120);
  }

  function displayUrl(value) {
    const text = String(value || "").trim();
    try {
      const url = new URL(text);
      return `${url.hostname}${url.pathname === "/" ? "" : url.pathname}`.slice(0, 84);
    } catch (error) {
      return text.slice(0, 84);
    }
  }

  function wifiQrPayload(values) {
    const type = values.encryption === "nopass" ? "nopass" : values.encryption === "WEP" ? "WEP" : "WPA";
    const ssid = escapeWifiQr(values.networkName || "Guest Network");
    const password = escapeWifiQr(values.password || "");
    const hidden = values.hidden === "true" ? "true" : "false";
    const passwordPart = type === "nopass" ? "" : `P:${password};`;
    return `WIFI:T:${type};S:${ssid};${passwordPart}H:${hidden};;`;
  }

  function escapeWifiQr(value) {
    return String(value || "").replace(/([\\;,:"])/g, "\\$1");
  }

  function vcardQrPayload(values) {
    const name = escapeVcard(values.fullName || "Contact");
    const company = escapeVcard(values.company || "");
    const phone = escapeVcard(values.phone || "");
    const email = escapeVcard(values.email || "");
    const website = escapeVcard(values.website || "");
    const note = escapeVcard(values.note || "");
    return [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${name}`,
      company ? `ORG:${company}` : "",
      phone ? `TEL:${phone}` : "",
      email ? `EMAIL:${email}` : "",
      website ? `URL:${website}` : "",
      note ? `NOTE:${note}` : "",
      "END:VCARD",
    ].filter(Boolean).join("\n");
  }

  function escapeVcard(value) {
    return String(value || "")
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;")
      .replace(/[<>]/g, "")
      .trim()
      .slice(0, 180);
  }

  function exportMultiImagePdf(canvas, values) {
    const images = imageToolState.get("multi-image-pdf") || [];
    if (!images.length) return canvasToPdf(canvas);
    const paper = getPaper(values.paper);
    const pages = images.map((item, index) => {
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = paper.width;
      pageCanvas.height = paper.height;
      const ctx = pageCanvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
      drawBusinessFrame(ctx, paper, "#17313b");
      drawTextFit(ctx, sanitizePrintable(values.title || "Images to PDF"), paper.width / 2, 82, paper.width - 140, 34, { align: "center", weight: "900", color: "#17313b" });
      drawImageInBox(ctx, item.image, { x: 72, y: 130, width: paper.width - 144, height: paper.height - 270 }, values.layout === "fill");
      drawTextFit(ctx, item.name || `Image ${index + 1}`, 72, paper.height - 86, paper.width - 144, 18, { align: "left", weight: "500", color: "#5b6f78" });
      drawTextFit(ctx, `Page ${index + 1} of ${images.length}`, paper.width - 72, paper.height - 86, 240, 18, { align: "right", weight: "500", color: "#5b6f78" });
      return pageCanvas;
    });
    return canvasesToPdf(pages);
  }

  function drawImageCompressor(ctx, paper, values) {
    drawImageUtilityPreview(ctx, paper, values, {
      toolId: "compress-image",
      title: "Compress Image",
      accent: "#5a9367",
      empty: "Select an image to compress",
      note: "JPG, PNG, and WebP files are compressed locally in this browser.",
      statLines: (image) => {
        const target = imageTransformPlan(image, {
          maxWidth: values.maxWidth,
          format: values.format,
          quality: values.quality,
        });
        return [
          `${image.width} x ${image.height} px original`,
          `${target.width} x ${target.height} px export`,
          `${imageFormatLabel(values.format)} at ${Math.round(normalizeQuality(values.quality) * 100)}% quality`,
        ];
      },
      footer: "Image compressed locally with PrintableTools Lab. No image upload required.",
    });
  }

  function drawImageToKb(ctx, paper, values) {
    drawImageUtilityPreview(ctx, paper, values, {
      toolId: "compress-image-to-kb",
      title: "Compress Image to KB",
      accent: "#2563eb",
      empty: "Select an image to compress to a KB target",
      note: "Reduce an image toward a specific upload limit without sending it to a server.",
      previewCanvas: (image) => {
        const result = compressImageToTarget(image, values);
        return result.canvas;
      },
      statLines: (image) => {
        const result = compressImageToTarget(image, values);
        return [
          `${image.width} x ${image.height} px original`,
          `${result.width} x ${result.height} px export`,
          `${formatBytes(result.size)} estimated file size`,
          `${result.metTarget ? "Target met" : "Closest local result"}: ${targetKbLabel(values)}`,
        ];
      },
      footer: "Image compressed locally toward a KB target. Review quality before uploading elsewhere.",
    });
  }

  function drawImageResizer(ctx, paper, values) {
    drawImageUtilityPreview(ctx, paper, values, {
      toolId: "resize-image",
      title: "Resize Image",
      accent: "#176b87",
      empty: "Select an image to resize",
      note: "Set a custom size or choose a common social image preset.",
      statLines: (image) => {
        const target = resizePlan(image, values);
        return [
          `${image.width} x ${image.height} px original`,
          `${target.width} x ${target.height} px export`,
          `${values.fit === "cover" ? "Fill and crop" : "Fit inside"} mode`,
        ];
      },
      footer: "Image resized locally with PrintableTools Lab. No image upload required.",
    });
  }

  function drawImageConverter(ctx, paper, values) {
    drawImageUtilityPreview(ctx, paper, values, {
      toolId: "convert-image",
      title: "Convert Image",
      accent: "#e76f51",
      empty: "Select an image to convert",
      note: "Convert between JPG, PNG, and WebP without sending the file to a server.",
      statLines: (image) => [
        `${image.width} x ${image.height} px original`,
        `Export as ${imageFormatLabel(values.format)}`,
        values.format === "png" ? "Lossless PNG export" : `${Math.round(normalizeQuality(values.quality) * 100)}% quality`,
      ],
      footer: "Image converted locally with PrintableTools Lab. No image upload required.",
    });
  }

  function drawBackgroundRemover(ctx, paper, values) {
    drawImageUtilityPreview(ctx, paper, values, {
      toolId: "remove-background",
      title: "Remove Background",
      accent: "#0891b2",
      empty: "Select an image to remove a simple background",
      note: "Create a transparent PNG locally. Best for white, solid, and green-screen backgrounds.",
      previewCanvas: (image) => renderBackgroundRemovedCanvas(image.image, values, { preview: true }),
      statLines: (image) => {
        const plan = backgroundRemovalPlan(image, values);
        return [
          `${image.width} x ${image.height} px original`,
          `${plan.width} x ${plan.height} px transparent PNG`,
          `${backgroundSampleLabel(values.sample)} sample`,
          `${backgroundToleranceLabel(values.tolerance)} tolerance, ${backgroundSoftnessLabel(values.softness)} edge`,
        ];
      },
      footer: "Background removed locally. Works best on solid backgrounds; complex images may need manual cleanup.",
    });
  }

  function drawImageCropper(ctx, paper, values) {
    drawImageUtilityPreview(ctx, paper, values, {
      toolId: "crop-image",
      title: "Crop Image",
      accent: "#7c3aed",
      empty: "Select an image to crop",
      note: "Crop avatars, product photos, banners, and upload-ready images locally.",
      previewCanvas: (image) => renderCroppedImageCanvas(image.image, values),
      statLines: (image) => {
        const source = cropSourceRect(image, values);
        return [
          `${image.width} x ${image.height} px original`,
          `${Math.round(source.width)} x ${Math.round(source.height)} px crop`,
          `${cropPresetLabel(values.preset)} with ${cropAnchorLabel(values.anchor)} focus`,
        ];
      },
      footer: "Image cropped locally with PrintableTools Lab. No image upload required.",
    });
  }

  function drawImageRotator(ctx, paper, values) {
    drawImageUtilityPreview(ctx, paper, values, {
      toolId: "rotate-image",
      title: "Rotate Image",
      accent: "#0f766e",
      empty: "Select an image to rotate",
      note: "Fix sideways photos, screenshots, and scans without sending files to a server.",
      previewCanvas: (image) => renderRotatedImageCanvas(image.image, values),
      statLines: (image) => {
        const rotation = normalizeImageRotation(values.rotation);
        return [
          `${image.width} x ${image.height} px original`,
          `${rotation === 180 ? image.width : image.height} x ${rotation === 180 ? image.height : image.width} px export`,
          `${rotation} degree rotation${values.flip && values.flip !== "none" ? ` plus ${values.flip} flip` : ""}`,
        ];
      },
      footer: "Image rotated locally with PrintableTools Lab. No image upload required.",
    });
  }

  function drawImageWatermarker(ctx, paper, values) {
    drawImageUtilityPreview(ctx, paper, values, {
      toolId: "watermark-image",
      title: "Watermark Image",
      accent: "#b45309",
      empty: "Select an image to watermark",
      note: "Add a visible text mark for samples, drafts, proofs, or product photos.",
      previewCanvas: (image) => renderWatermarkedImageCanvas(image.image, values),
      statLines: (image) => [
        `${image.width} x ${image.height} px original`,
        `${watermarkPlacementLabel(values.placement)} placement`,
        `${Math.round(normalizeWatermarkOpacity(values.opacity) * 100)}% opacity text watermark`,
      ],
      footer: "Image watermarked locally with PrintableTools Lab. No image upload required.",
    });
  }

  function drawTextOnImagePreview(ctx, paper, values) {
    drawImageUtilityPreview(ctx, paper, values, {
      toolId: "add-text-image",
      title: "Add Text to Image",
      accent: "#c026d3",
      empty: "Select an image to add text",
      note: "Add a title, price, label, caption, or meme-style text locally.",
      previewCanvas: (image) => renderTextOnImageCanvas(image.image, values),
      statLines: (image) => [
        `${image.width} x ${image.height} px original`,
        `${textImageLayoutLabel(values.layout)} layout`,
        `${textImageFontSizeLabel(values.fontSize)} text, ${textImageColorLabel(values.textColor)}`,
        `Export as ${imageFormatLabel(values.format)}`,
      ],
      footer: "Text overlay added locally with PrintableTools Lab. No image upload required.",
    });
  }

  function drawPassportPhotoPreview(ctx, paper, values) {
    const margin = 72;
    const images = imageToolState.get("passport-photo") || [];
    const preset = passportPhotoPreset(values.preset);
    drawBusinessFrame(ctx, paper, "#1d4ed8");
    drawTextFit(ctx, "Passport Photo Maker", paper.width / 2, 104, paper.width - margin * 2, 46, { align: "center", weight: "900", color: "#17313b" });
    drawTextFit(ctx, "Crop locally for common passport-style photo sizes. Check official rules before submitting.", paper.width / 2, 148, paper.width - margin * 2, 22, { align: "center", weight: "500", color: "#5b6f78" });
    if (!images.length) {
      drawDashedRect(ctx, margin, 240, paper.width - margin * 2, paper.height - 410, "rgba(23,49,59,0.34)");
      drawTextFit(ctx, "Select a clear photo to crop", paper.width / 2, paper.height / 2 - 26, paper.width - margin * 2 - 80, 38, { align: "center", weight: "800", color: "#17313b" });
      drawTextFit(ctx, "The photo stays on this device during processing.", paper.width / 2, paper.height / 2 + 30, paper.width - margin * 2 - 80, 23, { align: "center", weight: "500", color: "#5b6f78" });
      drawFooterNote(ctx, paper, "Passport-style sizing helper only. Always compare with the issuing authority's current photo rules.");
      return;
    }

    const photo = renderPassportPhotoCanvas(images[0].image, values);
    const box = { x: margin + 142, y: 220, width: paper.width - margin * 2 - 284, height: 640 };
    ctx.save();
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, box.x - 24, box.y - 24, box.width + 48, box.height + 48, 8, true, false);
    ctx.shadowColor = "rgba(23,49,59,0.12)";
    ctx.shadowBlur = 14;
    ctx.shadowOffsetY = 6;
    ctx.restore();
    drawImageInBox(ctx, photo, box, false);
    drawPassportGuideOverlay(ctx, box, preset);

    const detailY = 930;
    const lines = [
      `${preset.label}: ${preset.widthLabel} x ${preset.heightLabel}`,
      `${passportExportPixels(values, preset).width} x ${passportExportPixels(values, preset).height} px at ${passportDpi(values)} DPI`,
      values.output === "print-4x6-pdf" ? "Exports a 4 x 6 inch print sheet PDF" : `Exports a ${values.output === "single-png" ? "PNG" : "JPG"} photo`,
      "Sizing helper only, not an official acceptance check.",
    ];
    ctx.fillStyle = "#eff6ff";
    roundRect(ctx, margin, detailY, paper.width - margin * 2, 194, 8, true, false);
    drawTextFit(ctx, "Export details", margin + 26, detailY + 38, paper.width - margin * 2 - 52, 25, { align: "left", weight: "900", color: "#17313b" });
    lines.forEach((lineText, index) => {
      drawTextFit(ctx, lineText, margin + 26, detailY + 78 + index * 30, paper.width - margin * 2 - 52, 21, { align: "left", weight: index === 0 ? "800" : "500", color: index === 0 ? "#1d4ed8" : "#5b6f78" });
    });
    drawFooterNote(ctx, paper, "Generated locally with PrintableTools Lab. Confirm background, pose, lighting, expression, and recency rules yourself.");
  }

  function initializeSignaturePads(tool, form, draw) {
    const pads = Array.from(form.querySelectorAll("canvas.signature-pad"));
    if (!pads.length) return;
    pads.forEach((pad) => {
      const key = signaturePadKey(tool.id, pad.id);
      const ctx = pad.getContext("2d");
      signaturePadState.set(key, { strokes: [], drawing: false, last: null });
      ctx.clearRect(0, 0, pad.width, pad.height);
      drawSignaturePadGuide(pad);
      const pointFromEvent = (event) => {
        const rect = pad.getBoundingClientRect();
        const source = event.touches && event.touches[0] ? event.touches[0] : event;
        return {
          x: ((source.clientX - rect.left) / Math.max(1, rect.width)) * pad.width,
          y: ((source.clientY - rect.top) / Math.max(1, rect.height)) * pad.height,
        };
      };
      const start = (event) => {
        event.preventDefault();
        const state = signaturePadState.get(key);
        state.drawing = true;
        state.last = pointFromEvent(event);
        state.strokes.push([state.last]);
      };
      const move = (event) => {
        const state = signaturePadState.get(key);
        if (!state || !state.drawing) return;
        event.preventDefault();
        const point = pointFromEvent(event);
        const stroke = state.strokes[state.strokes.length - 1];
        stroke.push(point);
        drawSignaturePadStroke(pad, state.last, point, getFormValues(form));
        state.last = point;
        draw();
      };
      const end = () => {
        const state = signaturePadState.get(key);
        if (!state) return;
        state.drawing = false;
        state.last = null;
        draw();
      };
      pad.addEventListener("pointerdown", start);
      pad.addEventListener("pointermove", move);
      pad.addEventListener("pointerup", end);
      pad.addEventListener("pointerleave", end);
      pad.addEventListener("touchstart", start, { passive: false });
      pad.addEventListener("touchmove", move, { passive: false });
      pad.addEventListener("touchend", end);
    });
    form.querySelectorAll("[data-clear-signature]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-clear-signature");
        const pad = form.querySelector(`#${CSS.escape(id)}`);
        const key = signaturePadKey(tool.id, id);
        signaturePadState.set(key, { strokes: [], drawing: false, last: null });
        if (pad) drawSignaturePadGuide(pad);
        draw();
      });
    });
  }

  function drawSignaturePadGuide(canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.strokeStyle = "rgba(23,49,59,0.18)";
    ctx.lineWidth = 3;
    ctx.setLineDash([18, 14]);
    ctx.beginPath();
    ctx.moveTo(42, canvas.height - 64);
    ctx.lineTo(canvas.width - 42, canvas.height - 64);
    ctx.stroke();
    ctx.restore();
  }

  function drawSignaturePadStroke(canvas, from, to, values) {
    if (!from || !to) return;
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.strokeStyle = signatureInkColor(values.inkColor);
    ctx.lineWidth = signatureStrokeWidth(values.strokeWidth);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.restore();
  }

  function drawImageUtilityPreview(ctx, paper, values, config) {
    const margin = 72;
    const images = imageToolState.get(config.toolId) || [];
    drawBusinessFrame(ctx, paper, config.accent);
    drawTextFit(ctx, config.title, paper.width / 2, 104, paper.width - margin * 2, 46, { align: "center", weight: "900", color: "#17313b" });
    drawTextFit(ctx, config.note, paper.width / 2, 148, paper.width - margin * 2, 22, { align: "center", weight: "500", color: "#5b6f78" });
    if (!images.length) {
      drawDashedRect(ctx, margin, 240, paper.width - margin * 2, paper.height - 410, "rgba(23,49,59,0.34)");
      drawTextFit(ctx, config.empty, paper.width / 2, paper.height / 2 - 26, paper.width - margin * 2 - 80, 38, { align: "center", weight: "800", color: "#17313b" });
      drawTextFit(ctx, "The file stays on this device during processing.", paper.width / 2, paper.height / 2 + 30, paper.width - margin * 2 - 80, 23, { align: "center", weight: "500", color: "#5b6f78" });
      drawFooterNote(ctx, paper, config.footer);
      return;
    }
    const item = images[0];
    const previewBox = { x: margin, y: 220, width: paper.width - margin * 2, height: paper.height - 500 };
    const previewSource = typeof config.previewCanvas === "function" ? config.previewCanvas(item) : item.image;
    drawImageInBox(ctx, previewSource, previewBox, false);
    const statY = paper.height - 238;
    drawTextFit(ctx, item.name || "Selected image", margin, statY, paper.width - margin * 2, 24, { align: "left", weight: "900", color: "#17313b" });
    const lines = config.statLines(item).slice(0, 4);
    lines.forEach((lineText, index) => {
      drawTextFit(ctx, lineText, margin, statY + 42 + index * 32, paper.width - margin * 2, 22, { align: "left", weight: index === 0 ? "700" : "500", color: index === 0 ? config.accent : "#5b6f78" });
    });
    drawFooterNote(ctx, paper, config.footer);
  }

  function exportCompressedImage(values) {
    const image = getSelectedImageOrThrow("compress-image");
    const plan = imageTransformPlan(image, {
      maxWidth: values.maxWidth,
      format: values.format,
      quality: values.quality,
    });
    const canvas = renderImageToCanvas(image.image, plan.width, plan.height, "contain", values.format === "jpeg" ? "#ffffff" : "transparent");
    const blob = canvasToImageBlob(canvas, values.format, values.quality);
    return { blob, filename: `${fileBaseName(image.name)}-compressed.${imageExtension(values.format)}` };
  }

  function exportImageToKb(values) {
    const image = getSelectedImageOrThrow("compress-image-to-kb");
    const result = compressImageToTarget(image, values);
    const blob = dataUrlToBlob(result.dataUrl);
    return { blob, filename: `${fileBaseName(image.name)}-${targetKbValue(values)}kb.${imageExtension(values.format)}` };
  }

  function exportResizedImage(values) {
    const image = getSelectedImageOrThrow("resize-image");
    const plan = resizePlan(image, values);
    const canvas = renderImageToCanvas(image.image, plan.width, plan.height, values.fit, values.format === "jpeg" ? "#ffffff" : "transparent");
    const blob = canvasToImageBlob(canvas, values.format, values.quality);
    return { blob, filename: `${fileBaseName(image.name)}-${plan.width}x${plan.height}.${imageExtension(values.format)}` };
  }

  function exportConvertedImage(values) {
    const image = getSelectedImageOrThrow("convert-image");
    const background = values.format === "jpeg" ? (values.background === "black" ? "#000000" : "#ffffff") : "transparent";
    const canvas = renderImageToCanvas(image.image, image.width, image.height, "contain", background);
    const blob = canvasToImageBlob(canvas, values.format, values.quality);
    return { blob, filename: `${fileBaseName(image.name)}.${imageExtension(values.format)}` };
  }

  function exportBackgroundRemovedImage(values) {
    const image = getSelectedImageOrThrow("remove-background");
    const canvas = renderBackgroundRemovedCanvas(image.image, values);
    const blob = canvasToImageBlob(canvas, "png", 1);
    return { blob, filename: `${fileBaseName(image.name)}-transparent.png`, label: "Transparent PNG downloaded" };
  }

  function exportCroppedImage(values) {
    const image = getSelectedImageOrThrow("crop-image");
    const canvas = renderCroppedImageCanvas(image.image, values);
    const blob = canvasToImageBlob(canvas, values.format, values.quality);
    return { blob, filename: `${fileBaseName(image.name)}-cropped.${imageExtension(values.format)}` };
  }

  function exportRotatedImage(values) {
    const image = getSelectedImageOrThrow("rotate-image");
    const canvas = renderRotatedImageCanvas(image.image, values);
    const blob = canvasToImageBlob(canvas, values.format, values.quality);
    return { blob, filename: `${fileBaseName(image.name)}-rotated.${imageExtension(values.format)}` };
  }

  function exportWatermarkedImage(values) {
    const image = getSelectedImageOrThrow("watermark-image");
    const canvas = renderWatermarkedImageCanvas(image.image, values);
    const blob = canvasToImageBlob(canvas, values.format, values.quality);
    return { blob, filename: `${fileBaseName(image.name)}-watermarked.${imageExtension(values.format)}` };
  }

  function exportTextOnImage(values) {
    const image = getSelectedImageOrThrow("add-text-image");
    const canvas = renderTextOnImageCanvas(image.image, values);
    const blob = canvasToImageBlob(canvas, values.format, values.quality);
    return { blob, filename: `${fileBaseName(image.name)}-text.${imageExtension(values.format)}`, label: "Text image downloaded" };
  }

  function exportSignaturePng(values) {
    const canvas = renderSignatureOutputCanvas(values, { preview: false, width: 1200, height: 420 });
    return {
      blob: canvasToImageBlob(canvas, "png", 1),
      filename: `${slugify(values.signatureName || "signature")}-signature.png`,
    };
  }

  function exportPassportPhoto(values) {
    const image = getSelectedImageOrThrow("passport-photo");
    const preset = passportPhotoPreset(values.preset);
    const canvas = values.output === "print-4x6-pdf"
      ? renderPassportPrintSheetCanvas(image.image, values)
      : renderPassportPhotoCanvas(image.image, values);
    if (values.output === "print-4x6-pdf") {
      return {
        blob: canvasesToPdf([canvas]),
        filename: `${fileBaseName(image.name)}-${preset.slug}-4x6-sheet.pdf`,
        label: "Print sheet downloaded",
      };
    }
    const format = values.output === "single-png" ? "png" : "jpeg";
    return {
      blob: canvasToImageBlob(canvas, format, 0.94),
      filename: `${fileBaseName(image.name)}-${preset.slug}.${imageExtension(format)}`,
      label: "Passport photo downloaded",
    };
  }

  function getSelectedImageOrThrow(toolId) {
    const images = imageToolState.get(toolId) || [];
    if (!images.length) throw new Error("Select an image before downloading.");
    return images[0];
  }

  function passportPhotoPreset(value) {
    const presets = {
      "uk-passport": { slug: "uk-35x45", label: "UK passport photo", widthMm: 35, heightMm: 45, widthLabel: "35 mm", heightLabel: "45 mm", headMin: 0.64, headMax: 0.8, eyeLine: 0.47 },
      "eu-35x45": { slug: "eu-35x45", label: "EU-style ID photo", widthMm: 35, heightMm: 45, widthLabel: "35 mm", heightLabel: "45 mm", headMin: 0.62, headMax: 0.78, eyeLine: 0.47 },
      "canada-passport": { slug: "canada-50x70", label: "Canada passport photo", widthMm: 50, heightMm: 70, widthLabel: "50 mm", heightLabel: "70 mm", headMin: 0.44, headMax: 0.51, eyeLine: 0.42 },
      "australia-passport": { slug: "australia-35x45", label: "Australia passport photo", widthMm: 35, heightMm: 45, widthLabel: "35 mm", heightLabel: "45 mm", headMin: 0.71, headMax: 0.8, eyeLine: 0.46 },
      "us-passport": { slug: "us-2x2", label: "US passport photo", widthIn: 2, heightIn: 2, widthLabel: "2 in", heightLabel: "2 in", headMin: 0.5, headMax: 0.69, eyeLine: 0.45 },
    };
    return presets[value] || presets["us-passport"];
  }

  function passportDpi(values) {
    return Number(values.dpi) === 600 ? 600 : 300;
  }

  function passportExportPixels(values, preset = passportPhotoPreset(values.preset)) {
    const dpi = passportDpi(values);
    const widthIn = preset.widthIn || preset.widthMm / 25.4;
    const heightIn = preset.heightIn || preset.heightMm / 25.4;
    return {
      width: Math.max(1, Math.round(widthIn * dpi)),
      height: Math.max(1, Math.round(heightIn * dpi)),
    };
  }

  function passportSheetPixels(preset) {
    const pdfPixelsPerInch = 150;
    const widthIn = preset.widthIn || preset.widthMm / 25.4;
    const heightIn = preset.heightIn || preset.heightMm / 25.4;
    return {
      width: Math.max(1, Math.round(widthIn * pdfPixelsPerInch)),
      height: Math.max(1, Math.round(heightIn * pdfPixelsPerInch)),
    };
  }

  function renderPassportPhotoCanvas(image, values, overrideSize) {
    const preset = passportPhotoPreset(values.preset);
    const size = overrideSize || passportExportPixels(values, preset);
    const canvas = document.createElement("canvas");
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawPassportPhotoImage(ctx, image, values, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  function renderPassportPrintSheetCanvas(image, values) {
    const pdfPixelsPerInch = 150;
    const preset = passportPhotoPreset(values.preset);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(6 * pdfPixelsPerInch);
    canvas.height = Math.round(4 * pdfPixelsPerInch);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const photo = renderPassportPhotoCanvas(image, values, passportSheetPixels(preset));
    const margin = Math.round(0.18 * pdfPixelsPerInch);
    const gap = Math.round(0.12 * pdfPixelsPerInch);
    let index = 0;
    for (let y = margin; y + photo.height <= canvas.height - margin; y += photo.height + gap) {
      for (let x = margin; x + photo.width <= canvas.width - margin; x += photo.width + gap) {
        ctx.drawImage(photo, x, y);
        ctx.strokeStyle = "rgba(23,49,59,0.45)";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, photo.width, photo.height);
        index += 1;
        if (index >= 6) return canvas;
      }
    }
    return canvas;
  }

  function drawPassportPhotoImage(ctx, image, values, x, y, width, height) {
    const imageW = image.naturalWidth || image.width || 1;
    const imageH = image.naturalHeight || image.height || 1;
    const zoom = clampNumber(Number(values.zoom) || 1, 1, 2.2);
    const coverScale = Math.max(width / imageW, height / imageH) * zoom;
    const drawW = imageW * coverScale;
    const drawH = imageH * coverScale;
    const moveX = Math.min(100, Math.max(-100, Number(values.offsetX) || 0)) / 100;
    const moveY = Math.min(100, Math.max(-100, Number(values.offsetY) || 0)) / 100;
    const maxShiftX = Math.max(0, (drawW - width) / 2);
    const maxShiftY = Math.max(0, (drawH - height) / 2);
    const drawX = x + (width - drawW) / 2 + moveX * maxShiftX;
    const drawY = y + (height - drawH) / 2 + moveY * maxShiftY;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.clip();
    ctx.drawImage(image, drawX, drawY, drawW, drawH);
    ctx.restore();
  }

  function drawPassportGuideOverlay(ctx, box, preset) {
    const minH = box.height * preset.headMin;
    const maxH = box.height * preset.headMax;
    const centerX = box.x + box.width / 2;
    const topY = box.y + box.height * 0.12;
    const minY = topY + (maxH - minH) / 2;
    ctx.save();
    ctx.strokeStyle = "rgba(29,78,216,0.9)";
    ctx.lineWidth = 3;
    ctx.setLineDash([14, 10]);
    ctx.strokeRect(box.x, box.y, box.width, box.height);
    ctx.strokeStyle = "rgba(220,38,38,0.86)";
    ctx.strokeRect(centerX - minH * 0.34, minY, minH * 0.68, minH);
    ctx.strokeStyle = "rgba(245,158,11,0.78)";
    ctx.strokeRect(centerX - maxH * 0.34, topY, maxH * 0.68, maxH);
    ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(22,163,74,0.9)";
    line(ctx, box.x + 18, box.y + box.height * preset.eyeLine, box.x + box.width - 18, box.y + box.height * preset.eyeLine);
    ctx.fillStyle = "rgba(255,255,255,0.88)";
    roundRect(ctx, box.x + 14, box.y + box.height - 64, box.width - 28, 44, 6, true, false);
    drawTextFit(ctx, "Guide only: align head and eyes, then verify official rules", box.x + box.width / 2, box.y + box.height - 42, box.width - 52, 18, { align: "center", weight: "800", color: "#17313b" });
    ctx.restore();
  }

  function renderSignatureOutputCanvas(values, options = {}) {
    const width = options.width || 1200;
    const height = options.height || 420;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (values.background === "white") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.clearRect(0, 0, width, height);
    }
    const pad = signaturePaddingPixels(values.padding);
    const ink = signatureInkColor(values.inkColor);
    const strokes = signaturePadStrokes("signature-png", "signaturePad");
    const useDrawn = values.style === "auto" && strokes.length > 0;
    if (useDrawn) {
      drawSignatureStrokes(ctx, strokes, { x: pad, y: pad, width: width - pad * 2, height: height - pad * 2 }, values);
    } else {
      drawTypedSignature(ctx, values, { x: pad, y: pad, width: width - pad * 2, height: height - pad * 2 });
    }
    if (options.preview && !useDrawn && !(values.signatureName || "").trim()) {
      drawTextFit(ctx, "Type a name or draw in the signature pad", width / 2, height / 2, width - pad * 2, 34, { align: "center", weight: "700", color: "rgba(23,49,59,0.45)" });
    }
    if (values.background !== "white") return trimTransparentCanvas(canvas, signaturePaddingPixels(values.padding, true));
    return canvas;
  }

  function drawSignatureStrokes(ctx, strokes, target, values) {
    const bounds = signatureStrokesBounds(strokes);
    if (!bounds) return;
    const scale = Math.min(target.width / Math.max(1, bounds.width), target.height / Math.max(1, bounds.height));
    const offsetX = target.x + (target.width - bounds.width * scale) / 2 - bounds.minX * scale;
    const offsetY = target.y + (target.height - bounds.height * scale) / 2 - bounds.minY * scale;
    ctx.save();
    ctx.strokeStyle = signatureInkColor(values.inkColor);
    ctx.lineWidth = Math.max(3, signatureStrokeWidth(values.strokeWidth) * scale * 0.72);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    strokes.forEach((stroke) => {
      if (!stroke.length) return;
      ctx.beginPath();
      stroke.forEach((point, index) => {
        const x = offsetX + point.x * scale;
        const y = offsetY + point.y * scale;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      if (stroke.length === 1) {
        const point = stroke[0];
        const x = offsetX + point.x * scale;
        const y = offsetY + point.y * scale;
        ctx.arc(x, y, ctx.lineWidth / 2, 0, Math.PI * 2);
        ctx.fillStyle = signatureInkColor(values.inkColor);
        ctx.fill();
      } else {
        ctx.stroke();
      }
    });
    ctx.restore();
  }

  function drawTypedSignature(ctx, values, target) {
    const name = sanitizePrintable(values.signatureName || "Alex Rivera").slice(0, 48) || "Alex Rivera";
    const script = values.style !== "typed-clean";
    ctx.save();
    ctx.fillStyle = signatureInkColor(values.inkColor);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const family = script ? '"Brush Script MT", "Segoe Script", "Lucida Handwriting", cursive' : 'Georgia, "Times New Roman", serif';
    let fontSize = Math.min(target.height * 0.48, target.width / Math.max(7, name.length * (script ? 0.46 : 0.58)));
    fontSize = clampNumber(fontSize, 52, 190);
    ctx.font = `${script ? "400" : "600"} ${fontSize}px ${family}`;
    ctx.fillText(name, target.x + target.width / 2, target.y + target.height / 2);
    ctx.restore();
  }

  function trimTransparentCanvas(canvas, padding) {
    const ctx = canvas.getContext("2d");
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let minX = canvas.width;
    let minY = canvas.height;
    let maxX = -1;
    let maxY = -1;
    for (let y = 0; y < canvas.height; y += 1) {
      for (let x = 0; x < canvas.width; x += 1) {
        const alpha = data.data[(y * canvas.width + x) * 4 + 3];
        if (alpha > 12) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }
    if (maxX < minX || maxY < minY) return canvas;
    const cropX = Math.max(0, minX - padding);
    const cropY = Math.max(0, minY - padding);
    const cropW = Math.min(canvas.width - cropX, maxX - minX + 1 + padding * 2);
    const cropH = Math.min(canvas.height - cropY, maxY - minY + 1 + padding * 2);
    const output = document.createElement("canvas");
    output.width = Math.max(1, Math.ceil(cropW));
    output.height = Math.max(1, Math.ceil(cropH));
    output.getContext("2d").drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
    return output;
  }

  function signaturePadKey(toolId, fieldId) {
    return `${toolId}:${fieldId}`;
  }

  function signaturePadStrokes(toolId, fieldId) {
    const state = signaturePadState.get(signaturePadKey(toolId, fieldId));
    return state ? state.strokes.filter((stroke) => stroke.length) : [];
  }

  function signaturePadHasInk(toolId, fieldId) {
    return signaturePadStrokes(toolId, fieldId).length > 0;
  }

  function signatureStrokesBounds(strokes) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    strokes.forEach((stroke) => stroke.forEach((point) => {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }));
    if (!Number.isFinite(minX)) return null;
    return { minX, minY, maxX, maxY, width: Math.max(1, maxX - minX), height: Math.max(1, maxY - minY) };
  }

  function signatureInkColor(value) {
    if (value === "black") return "#050608";
    if (value === "blue") return "#1d4ed8";
    if (value === "green") return "#047857";
    return "#172033";
  }

  function signatureInkLabel(value) {
    if (value === "black") return "black";
    if (value === "blue") return "blue";
    if (value === "green") return "green";
    return "deep ink";
  }

  function signatureStrokeWidth(value) {
    if (value === "thin") return 5;
    if (value === "bold") return 12;
    return 8;
  }

  function signatureStrokeLabel(value) {
    if (value === "thin") return "thin";
    if (value === "bold") return "bold";
    return "medium";
  }

  function signaturePaddingPixels(value, cropped = false) {
    if (value === "tight") return cropped ? 8 : 24;
    if (value === "wide") return cropped ? 52 : 86;
    return cropped ? 24 : 54;
  }

  function signaturePaddingLabel(value) {
    if (value === "tight") return "tight";
    if (value === "wide") return "wide";
    return "balanced";
  }

  function drawTransparencyGrid(ctx, x, y, width, height, size) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.clip();
    for (let row = 0; row * size < height; row += 1) {
      for (let col = 0; col * size < width; col += 1) {
        ctx.fillStyle = (row + col) % 2 ? "rgba(148,163,184,0.24)" : "rgba(255,255,255,0.85)";
        ctx.fillRect(x + col * size, y + row * size, size, size);
      }
    }
    ctx.restore();
  }

  function compressImageToTarget(image, values) {
    const targetBytes = targetKbValue(values) * 1024;
    const format = values.format === "webp" ? "webp" : "jpeg";
    const mime = imageMimeType(format);
    const originalW = Math.max(1, Number(image.width || image.image?.naturalWidth || image.image?.width || 1));
    const originalH = Math.max(1, Number(image.height || image.image?.naturalHeight || image.image?.height || 1));
    const maxWidth = values.maxWidth === "original" ? originalW : clampNumber(Number(values.maxWidth || originalW), 240, 6000);
    const baseScale = Math.min(1, maxWidth / originalW);
    const widthScales = [1, 0.92, 0.82, 0.72, 0.62, 0.52, 0.42, 0.34].map((scale) => scale * baseScale);
    const qualities = [0.9, 0.82, 0.74, 0.66, 0.58, 0.5, 0.42, 0.34, 0.26];
    let best = null;
    for (const widthScale of widthScales) {
      const width = Math.max(64, Math.round(originalW * widthScale));
      const height = Math.max(64, Math.round(originalH * widthScale));
      const canvas = renderImageToCanvas(image.image, width, height, "contain", "#ffffff");
      for (const quality of qualities) {
        const dataUrl = canvas.toDataURL(mime, quality);
        const size = dataUrlByteSize(dataUrl);
        const candidate = { canvas, dataUrl, size, width, height, quality, metTarget: size <= targetBytes };
        if (candidate.metTarget) {
          if (!best || !best.metTarget || candidate.size > best.size) best = candidate;
        } else if (!best || (!best.metTarget && candidate.size < best.size)) {
          best = candidate;
        }
      }
      if (best?.metTarget) break;
    }
    return best;
  }

  function targetKbValue(values) {
    if (values.targetKb === "custom") return clampNumber(Number(String(values.customKb || "").replace(/\D/g, "")) || 200, 10, 5000);
    return clampNumber(Number(values.targetKb || 200), 10, 5000);
  }

  function targetKbLabel(values) {
    return `${targetKbValue(values)} KB`;
  }

  function dataUrlByteSize(dataUrl) {
    const base64 = String(dataUrl || "").split(",")[1] || "";
    return Math.floor(base64.length * 3 / 4);
  }

  function imageTransformPlan(image, options) {
    const originalW = Math.max(1, Number(image.width || image.image?.naturalWidth || image.image?.width || 1));
    const originalH = Math.max(1, Number(image.height || image.image?.naturalHeight || image.image?.height || 1));
    const maxWidth = options.maxWidth === "original" ? originalW : clampNumber(Number(options.maxWidth || originalW), 64, 6000);
    const scale = Math.min(1, maxWidth / originalW);
    return {
      width: Math.max(1, Math.round(originalW * scale)),
      height: Math.max(1, Math.round(originalH * scale)),
    };
  }

  function resizePlan(image, values) {
    const preset = values.preset || "custom";
    const originalW = Math.max(1, Number(image.width || image.image?.naturalWidth || image.image?.width || 1));
    const originalH = Math.max(1, Number(image.height || image.image?.naturalHeight || image.image?.height || 1));
    if (preset === "square-1080") return { width: 1080, height: 1080 };
    if (preset === "story-1080x1920") return { width: 1080, height: 1920 };
    if (preset === "thumbnail-1280x720") return { width: 1280, height: 720 };
    if (preset === "profile-512") return { width: 512, height: 512 };
    const width = clampNumber(Number(String(values.width || "").replace(/\D/g, "")) || 0, 1, 6000);
    const heightInput = Number(String(values.height || "").replace(/\D/g, "")) || 0;
    const height = heightInput ? clampNumber(heightInput, 1, 6000) : Math.max(1, Math.round(width * originalH / originalW));
    return { width, height };
  }

  function backgroundRemovalPlan(image, values) {
    return imageTransformPlan(image, { maxWidth: values.maxWidth });
  }

  function renderBackgroundRemovedCanvas(image, values, options = {}) {
    const source = {
      image,
      width: image.naturalWidth || image.width || 1,
      height: image.naturalHeight || image.height || 1,
    };
    const plan = backgroundRemovalPlan(source, values);
    const canvas = renderImageToCanvas(image, plan.width, plan.height, "contain", "transparent");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const bg = backgroundSampleColor(imageData, canvas.width, canvas.height, values.sample);
    const tolerance = clampNumber(Number(values.tolerance) || 52, 8, 180);
    const softness = clampNumber(Number(values.softness) || 22, 1, 90);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3];
      if (!alpha) continue;
      const distance = backgroundColorDistance(data[i], data[i + 1], data[i + 2], bg.r, bg.g, bg.b);
      if (distance <= tolerance) {
        data[i + 3] = 0;
      } else if (distance <= tolerance + softness) {
        const t = (distance - tolerance) / softness;
        const smooth = t * t * (3 - 2 * t);
        data[i + 3] = Math.round(alpha * smooth);
      }
    }
    ctx.putImageData(imageData, 0, 0);
    return options.preview ? transparentPreviewCanvas(canvas) : canvas;
  }

  function transparentPreviewCanvas(canvas) {
    const preview = document.createElement("canvas");
    preview.width = canvas.width;
    preview.height = canvas.height;
    const ctx = preview.getContext("2d");
    drawTransparencyGrid(ctx, 0, 0, preview.width, preview.height, Math.max(12, Math.round(Math.min(preview.width, preview.height) / 22)));
    ctx.drawImage(canvas, 0, 0);
    return preview;
  }

  function backgroundSampleColor(imageData, width, height, sample) {
    if (sample === "white") return { r: 255, g: 255, b: 255 };
    if (sample === "black") return { r: 0, g: 0, b: 0 };
    if (sample === "green") return { r: 0, g: 177, b: 64 };
    if (sample === "blue") return { r: 0, g: 116, b: 217 };
    const size = Math.max(3, Math.min(18, Math.round(Math.min(width, height) * 0.04)));
    const rects = {
      "top-left": [[0, 0]],
      "top-right": [[width - size, 0]],
      "bottom-left": [[0, height - size]],
      "bottom-right": [[width - size, height - size]],
      "auto-corners": [[0, 0], [width - size, 0], [0, height - size], [width - size, height - size]],
    }[sample] || [[0, 0], [width - size, 0], [0, height - size], [width - size, height - size]];
    let r = 0;
    let g = 0;
    let b = 0;
    let total = 0;
    const data = imageData.data;
    rects.forEach(([startX, startY]) => {
      const safeX = clampNumber(startX, 0, Math.max(0, width - size));
      const safeY = clampNumber(startY, 0, Math.max(0, height - size));
      for (let y = safeY; y < safeY + size && y < height; y += 1) {
        for (let x = safeX; x < safeX + size && x < width; x += 1) {
          const index = (y * width + x) * 4;
          const alpha = data[index + 3] / 255;
          if (alpha <= 0.02) continue;
          r += data[index] * alpha;
          g += data[index + 1] * alpha;
          b += data[index + 2] * alpha;
          total += alpha;
        }
      }
    });
    if (!total) return { r: 255, g: 255, b: 255 };
    return { r: r / total, g: g / total, b: b / total };
  }

  function backgroundColorDistance(r1, g1, b1, r2, g2, b2) {
    const redMean = (r1 + r2) / 2;
    const red = r1 - r2;
    const green = g1 - g2;
    const blue = b1 - b2;
    return Math.sqrt((2 + redMean / 256) * red * red + 4 * green * green + (2 + (255 - redMean) / 256) * blue * blue) / 2;
  }

  function backgroundSampleLabel(value) {
    if (value === "top-left") return "top-left corner";
    if (value === "top-right") return "top-right corner";
    if (value === "bottom-left") return "bottom-left corner";
    if (value === "bottom-right") return "bottom-right corner";
    if (value === "white") return "white";
    if (value === "black") return "black";
    if (value === "green") return "green-screen";
    if (value === "blue") return "blue-screen";
    return "auto-corner";
  }

  function backgroundToleranceLabel(value) {
    if (Number(value) <= 30) return "tight";
    if (Number(value) >= 100) return "very strong";
    if (Number(value) >= 75) return "strong";
    return "balanced";
  }

  function backgroundSoftnessLabel(value) {
    if (Number(value) <= 10) return "crisp";
    if (Number(value) >= 35) return "soft";
    return "smooth";
  }

  function cropSourceRect(image, values) {
    const imageW = Math.max(1, Number(image.width || image.naturalWidth || image.image?.width || 1));
    const imageH = Math.max(1, Number(image.height || image.naturalHeight || image.image?.height || 1));
    const ratio = cropAspectRatio(values.preset, imageW / imageH);
    let width = imageW;
    let height = imageW / ratio;
    if (height > imageH) {
      height = imageH;
      width = imageH * ratio;
    }
    let x = (imageW - width) / 2;
    let y = (imageH - height) / 2;
    if (values.anchor === "top") y = 0;
    if (values.anchor === "bottom") y = imageH - height;
    if (values.anchor === "left") x = 0;
    if (values.anchor === "right") x = imageW - width;
    return {
      x: Math.max(0, Math.round(x)),
      y: Math.max(0, Math.round(y)),
      width: Math.max(1, Math.round(width)),
      height: Math.max(1, Math.round(height)),
    };
  }

  function cropAspectRatio(preset, fallback) {
    if (preset === "wide-16-9") return 16 / 9;
    if (preset === "portrait-4-5") return 4 / 5;
    if (preset === "banner-3-1") return 3;
    if (preset === "original") return fallback || 1;
    return 1;
  }

  function renderCroppedImageCanvas(image, values) {
    const source = cropSourceRect(image, values);
    const canvas = document.createElement("canvas");
    canvas.width = source.width;
    canvas.height = source.height;
    const ctx = canvas.getContext("2d");
    const background = values.format === "jpeg" ? "#ffffff" : "transparent";
    if (background !== "transparent") {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(image, source.x, source.y, source.width, source.height, 0, 0, source.width, source.height);
    return canvas;
  }

  function renderRotatedImageCanvas(image, values) {
    const imageW = image.naturalWidth || image.width || 1;
    const imageH = image.naturalHeight || image.height || 1;
    const rotation = normalizeImageRotation(values.rotation);
    const swap = rotation === 90 || rotation === 270;
    const canvas = document.createElement("canvas");
    canvas.width = swap ? imageH : imageW;
    canvas.height = swap ? imageW : imageH;
    const ctx = canvas.getContext("2d");
    if (values.format === "jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotation * Math.PI / 180);
    const flipX = values.flip === "horizontal" ? -1 : 1;
    const flipY = values.flip === "vertical" ? -1 : 1;
    ctx.scale(flipX, flipY);
    ctx.drawImage(image, -imageW / 2, -imageH / 2, imageW, imageH);
    ctx.restore();
    return canvas;
  }

  function renderWatermarkedImageCanvas(image, values) {
    const imageW = image.naturalWidth || image.width || 1;
    const imageH = image.naturalHeight || image.height || 1;
    const canvas = document.createElement("canvas");
    canvas.width = imageW;
    canvas.height = imageH;
    const ctx = canvas.getContext("2d");
    if (values.format === "jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, imageW, imageH);
    }
    ctx.drawImage(image, 0, 0, imageW, imageH);
    drawImageWatermarkText(ctx, canvas, values);
    return canvas;
  }

  function renderTextOnImageCanvas(image, values) {
    const imageW = image.naturalWidth || image.width || 1;
    const imageH = image.naturalHeight || image.height || 1;
    const canvas = document.createElement("canvas");
    canvas.width = imageW;
    canvas.height = imageH;
    const ctx = canvas.getContext("2d");
    if (values.format === "jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, imageW, imageH);
    }
    ctx.drawImage(image, 0, 0, imageW, imageH);
    drawTextOnImageOverlay(ctx, canvas, values);
    return canvas;
  }

  function drawTextOnImageOverlay(ctx, canvas, values) {
    const main = sanitizePrintable(values.overlayText || "Your Text").trim().slice(0, 72) || "Your Text";
    const sub = sanitizePrintable(values.subText || "").trim().slice(0, 90);
    const base = Math.min(canvas.width, canvas.height);
    const mainSize = textImageFontPixels(values.fontSize, base);
    const subSize = Math.max(16, Math.round(mainSize * 0.42));
    const margin = Math.max(20, Math.round(base * 0.06));
    const gap = Math.max(8, Math.round(mainSize * 0.22));
    const layout = values.layout || "bottom-banner";
    ctx.save();
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    const textColor = textImageColor(values.textColor);
    const box = textImageOverlayBox(ctx, canvas, values, main, sub, mainSize, subSize, margin, gap);
    if (values.boxStyle !== "none") drawTextImageBox(ctx, box, values);
    if (layout === "meme") {
      drawMemeText(ctx, main, canvas.width / 2, margin + mainSize * 0.6, canvas.width - margin * 2, mainSize, textColor);
      if (sub) drawMemeText(ctx, sub, canvas.width / 2, canvas.height - margin - mainSize * 0.28, canvas.width - margin * 2, Math.max(subSize, mainSize * 0.72), textColor);
      ctx.restore();
      return;
    }
    const align = layout === "bottom-left" ? "left" : "center";
    const x = align === "left" ? box.x + Math.max(16, margin * 0.45) : box.x + box.width / 2;
    let y = box.y + box.height / 2 - (sub ? subSize * 0.52 : 0);
    drawFittedOverlayText(ctx, main, x, y, box.width - margin, mainSize, textColor, align);
    if (sub) {
      y += mainSize * 0.62 + gap;
      drawFittedOverlayText(ctx, sub, x, y, box.width - margin, subSize, textColor, align, "700");
    }
    ctx.restore();
  }

  function textImageOverlayBox(ctx, canvas, values, main, sub, mainSize, subSize, margin, gap) {
    const layout = values.layout || "bottom-banner";
    const fullW = canvas.width - margin * 2;
    if (layout === "meme") return { x: margin, y: margin, width: fullW, height: canvas.height - margin * 2, radius: 0 };
    const subHeight = sub ? subSize + gap : 0;
    const boxH = Math.min(canvas.height - margin * 2, Math.max(mainSize * 1.85, mainSize + subHeight + margin * 0.95));
    if (layout === "top-banner") return { x: margin, y: margin, width: fullW, height: boxH, radius: 8 };
    if (layout === "center-card") {
      const maxText = Math.max(ctx.measureText(main).width, sub ? ctx.measureText(sub).width : 0);
      const width = Math.min(fullW, Math.max(canvas.width * 0.52, maxText + margin * 1.4));
      return { x: (canvas.width - width) / 2, y: (canvas.height - boxH) / 2, width, height: boxH, radius: 8 };
    }
    if (layout === "bottom-left") {
      const maxText = Math.max(ctx.measureText(main).width, sub ? ctx.measureText(sub).width : 0);
      const width = Math.min(fullW, Math.max(canvas.width * 0.42, maxText + margin * 1.2));
      return { x: margin, y: canvas.height - margin - boxH, width, height: boxH, radius: 8 };
    }
    return { x: margin, y: canvas.height - margin - boxH, width: fullW, height: boxH, radius: 8 };
  }

  function drawTextImageBox(ctx, box, values) {
    ctx.save();
    if (values.boxStyle === "light") ctx.fillStyle = "rgba(255,255,255,0.78)";
    else if (values.boxStyle === "solid") ctx.fillStyle = "rgba(192,38,211,0.88)";
    else ctx.fillStyle = "rgba(12,22,27,0.68)";
    roundRect(ctx, box.x, box.y, box.width, box.height, box.radius || 8, true, false);
    ctx.restore();
  }

  function drawFittedOverlayText(ctx, text, x, y, width, size, color, align, weight = "900") {
    const family = "Arial, Helvetica, sans-serif";
    let fontSize = size;
    ctx.textAlign = align;
    ctx.fillStyle = color;
    ctx.strokeStyle = overlayStrokeColor(color);
    ctx.lineWidth = Math.max(2, Math.round(size / 13));
    do {
      ctx.font = `${weight} ${fontSize}px ${family}`;
      if (ctx.measureText(text).width <= width || fontSize <= 16) break;
      fontSize -= 2;
    } while (fontSize > 16);
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
  }

  function drawMemeText(ctx, text, x, y, width, size, color) {
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.strokeStyle = "#050608";
    ctx.lineWidth = Math.max(4, Math.round(size / 9));
    drawFittedOverlayText(ctx, String(text).toUpperCase(), x, y, width, size, color, "center", "900");
    ctx.restore();
  }

  function drawImageWatermarkText(ctx, canvas, values) {
    const text = sanitizePrintable(values.watermarkText || "SAMPLE").trim().slice(0, 50) || "SAMPLE";
    const base = Math.min(canvas.width, canvas.height);
    const sizeMap = { small: 0.055, medium: 0.075, large: 0.105 };
    const fontSize = Math.max(18, Math.round(base * (sizeMap[values.size] || sizeMap.medium)));
    const opacity = normalizeWatermarkOpacity(values.opacity);
    ctx.save();
    ctx.font = `900 ${fontSize}px Arial, sans-serif`;
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    const margin = Math.max(18, Math.round(fontSize * 0.9));
    if (values.placement === "diagonal-tile") {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 5);
      ctx.textAlign = "center";
      const stepX = Math.max(fontSize * 6, ctx.measureText(text).width + fontSize * 2);
      const stepY = fontSize * 3.2;
      for (let y = -canvas.height; y <= canvas.height; y += stepY) {
        for (let x = -canvas.width; x <= canvas.width; x += stepX) {
          strokeAndFillWatermark(ctx, text, x, y, opacity);
        }
      }
      ctx.restore();
      return;
    }
    const metrics = ctx.measureText(text);
    let x = canvas.width - margin;
    let y = canvas.height - margin;
    ctx.textAlign = "right";
    if (values.placement === "bottom-left") {
      x = margin;
      y = canvas.height - margin;
      ctx.textAlign = "left";
    } else if (values.placement === "top-right") {
      x = canvas.width - margin;
      y = margin + fontSize / 2;
    } else if (values.placement === "top-left") {
      x = margin;
      y = margin + fontSize / 2;
      ctx.textAlign = "left";
    } else if (values.placement === "center") {
      x = canvas.width / 2;
      y = canvas.height / 2;
      ctx.textAlign = "center";
    }
    if (ctx.textAlign === "right") x = Math.max(margin + metrics.width, x);
    strokeAndFillWatermark(ctx, text, x, y, opacity);
    ctx.restore();
  }

  function strokeAndFillWatermark(ctx, text, x, y, opacity) {
    ctx.lineWidth = Math.max(2, Math.round(Number.parseInt(ctx.font, 10) / 12));
    ctx.save();
    ctx.globalAlpha = Math.min(0.92, opacity + 0.32);
    ctx.strokeStyle = "#ffffff";
    ctx.strokeText(text, x, y);
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = Math.min(0.95, opacity + 0.2);
    ctx.fillStyle = "#0c161b";
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function renderImageToCanvas(image, width, height, fitMode, background) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (background && background !== "transparent") {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.clearRect(0, 0, width, height);
    }
    const imageW = image.naturalWidth || image.width || 1;
    const imageH = image.naturalHeight || image.height || 1;
    const scale = fitMode === "cover" ? Math.max(width / imageW, height / imageH) : Math.min(width / imageW, height / imageH);
    const drawW = imageW * scale;
    const drawH = imageH * scale;
    const x = (width - drawW) / 2;
    const y = (height - drawH) / 2;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.clip();
    ctx.drawImage(image, x, y, drawW, drawH);
    ctx.restore();
    return canvas;
  }

  function canvasToImageBlob(canvas, format, quality) {
    const mime = imageMimeType(format);
    const dataUrl = canvas.toDataURL(mime, normalizeQuality(quality));
    return dataUrlToBlob(dataUrl);
  }

  function dataUrlToBlob(dataUrl) {
    const [header, body] = String(dataUrl).split(",");
    const mime = (header.match(/data:([^;]+)/) || [])[1] || "application/octet-stream";
    const binary = atob(body || "");
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  }

  function normalizeQuality(value) {
    return clampNumber(Number(value) || 0.82, 0.35, 0.98);
  }

  function clampNumber(value, min, max) {
    return Math.min(max, Math.max(min, Number(value) || min));
  }

  function imageMimeType(format) {
    if (format === "png") return "image/png";
    if (format === "webp") return "image/webp";
    return "image/jpeg";
  }

  function imageExtension(format) {
    return format === "jpeg" ? "jpg" : format === "webp" ? "webp" : "png";
  }

  function imageFormatLabel(format) {
    return format === "jpeg" ? "JPG" : format === "webp" ? "WebP" : "PNG";
  }

  function cropPresetLabel(preset) {
    if (preset === "wide-16-9") return "Wide 16:9 crop";
    if (preset === "portrait-4-5") return "Portrait 4:5 crop";
    if (preset === "banner-3-1") return "Banner 3:1 crop";
    if (preset === "original") return "Original ratio crop";
    return "Square 1:1 crop";
  }

  function cropAnchorLabel(anchor) {
    if (anchor === "top") return "top";
    if (anchor === "bottom") return "bottom";
    if (anchor === "left") return "left";
    if (anchor === "right") return "right";
    return "center";
  }

  function watermarkPlacementLabel(placement) {
    if (placement === "bottom-left") return "Bottom left";
    if (placement === "top-right") return "Top right";
    if (placement === "top-left") return "Top left";
    if (placement === "center") return "Center";
    if (placement === "diagonal-tile") return "Diagonal tiled";
    return "Bottom right";
  }

  function textImageFontPixels(value, base) {
    if (value === "xlarge") return Math.max(32, Math.round(base * 0.12));
    if (value === "medium") return Math.max(24, Math.round(base * 0.072));
    return Math.max(28, Math.round(base * 0.092));
  }

  function textImageLayoutLabel(value) {
    if (value === "top-banner") return "Top banner";
    if (value === "center-card") return "Center card";
    if (value === "meme") return "Meme";
    if (value === "bottom-left") return "Bottom-left label";
    return "Bottom banner";
  }

  function textImageFontSizeLabel(value) {
    if (value === "xlarge") return "extra-large";
    if (value === "medium") return "medium";
    return "large";
  }

  function textImageColor(value) {
    if (value === "black") return "#050608";
    if (value === "yellow") return "#fde047";
    if (value === "red") return "#ef4444";
    if (value === "blue") return "#38bdf8";
    return "#ffffff";
  }

  function textImageColorLabel(value) {
    if (value === "black") return "black";
    if (value === "yellow") return "yellow";
    if (value === "red") return "red";
    if (value === "blue") return "blue";
    return "white";
  }

  function overlayStrokeColor(color) {
    return color === "#050608" ? "rgba(255,255,255,0.72)" : "rgba(5,6,8,0.76)";
  }

  function fileBaseName(name) {
    const clean = String(name || "image").replace(/\.[^.]+$/, "");
    return slugify(clean || "image");
  }

  function drawImageInBox(ctx, image, box, fill) {
    const imageW = image.naturalWidth || image.width || 1;
    const imageH = image.naturalHeight || image.height || 1;
    const scale = fill ? Math.max(box.width / imageW, box.height / imageH) : Math.min(box.width / imageW, box.height / imageH);
    const drawW = imageW * scale;
    const drawH = imageH * scale;
    const x = box.x + (box.width - drawW) / 2;
    const y = box.y + (box.height - drawH) / 2;
    ctx.save();
    ctx.beginPath();
    ctx.rect(box.x, box.y, box.width, box.height);
    ctx.clip();
    if (box.x || box.y) {
      ctx.fillStyle = "#f7faf8";
      ctx.fillRect(box.x, box.y, box.width, box.height);
    }
    ctx.drawImage(image, x, y, drawW, drawH);
    ctx.restore();
  }

  function drawTextToPdf(ctx, paper, values) {
    const margin = 86;
    const title = sanitizePrintable(values.title || "Text to PDF");
    const font = values.fontSize === "small" ? "22px Arial" : values.fontSize === "large" ? "28px Arial" : "24px Arial";
    const lineHeight = values.fontSize === "small" ? 30 : values.fontSize === "large" ? 38 : 34;
    drawBusinessFrame(ctx, paper, "#176b87");
    drawTextFit(ctx, title, paper.width / 2, 112, paper.width - margin * 2, 48, { align: "center", weight: "900", color: "#17313b" });
    ctx.strokeStyle = "rgba(23,49,59,0.22)";
    ctx.lineWidth = 2;
    line(ctx, margin, 172, paper.width - margin, 172);
    const maxLines = Math.floor((paper.height - 330) / lineHeight);
    drawWrappedText(ctx, sanitizePrintable(values.body || ""), margin, 230, paper.width - margin * 2, lineHeight, "#17313b", font, maxLines);
    drawFooterNote(ctx, paper, "Plain text converted locally with PrintableTools Lab. Long text may need a shorter one-page draft.");
  }

  function drawMarkdownToPdf(ctx, paper, values) {
    const margin = 82;
    const title = sanitizePrintable(values.title || "Markdown to PDF");
    const accent = values.style === "notes" ? "#5a9367" : values.style === "compact" ? "#6b7280" : "#176b87";
    drawBusinessFrame(ctx, paper, accent);
    drawTextFit(ctx, title, paper.width / 2, 106, paper.width - margin * 2, 44, { align: "center", weight: "900", color: "#17313b" });
    ctx.strokeStyle = "rgba(23,49,59,0.22)";
    ctx.lineWidth = 2;
    line(ctx, margin, 166, paper.width - margin, 166);
    const tokens = parseMarkdownBlocks(values.body || "");
    let y = 222;
    const bottom = paper.height - 86;
    for (const token of tokens) {
      if (y > bottom) break;
      if (token.type === "h1" || token.type === "h2") {
        const size = token.type === "h1" ? 31 : 25;
        drawTextFit(ctx, token.text, margin, y, paper.width - margin * 2, size, { align: "left", weight: "900", color: "#17313b" });
        y += token.type === "h1" ? 46 : 38;
        continue;
      }
      if (token.type === "bullet" || token.type === "number") {
        ctx.save();
        ctx.fillStyle = accent;
        ctx.font = "700 21px Arial";
        ctx.textAlign = "left";
        ctx.fillText(token.type === "bullet" ? "-" : `${token.index}.`, margin, y);
        ctx.restore();
        y = drawWrappedTextReturnY(ctx, token.text, margin + 32, y, paper.width - margin * 2 - 32, 29, "#17313b", values.style === "compact" ? "20px Arial" : "22px Arial", 2) + 7;
        continue;
      }
      if (token.type === "quote") {
        ctx.save();
        ctx.fillStyle = "rgba(23,107,135,0.08)";
        ctx.fillRect(margin, y - 22, paper.width - margin * 2, 52);
        ctx.fillStyle = accent;
        ctx.fillRect(margin, y - 22, 6, 52);
        ctx.restore();
        y = drawWrappedTextReturnY(ctx, token.text, margin + 22, y, paper.width - margin * 2 - 34, 28, "#17313b", "italic 21px Arial", 2) + 18;
        continue;
      }
      y = drawWrappedTextReturnY(ctx, token.text, margin, y, paper.width - margin * 2, values.style === "compact" ? 27 : 31, "#17313b", values.style === "compact" ? "20px Arial" : "22px Arial", 4) + 16;
    }
    drawFooterNote(ctx, paper, "Markdown converted locally. Review the PDF before sharing.");
  }

  function drawCsvToPdf(ctx, paper, values) {
    const margin = 58;
    const title = sanitizePrintable(values.title || "CSV Table");
    const rows = parseCsvRows(values.csv || "").slice(0, values.layout === "compact" ? 16 : 12);
    const headers = (rows[0] || ["Column 1", "Column 2", "Column 3"]).slice(0, 5).map((item) => item || "Column");
    const dataRows = rows.slice(1);
    const accent = "#176b87";
    drawBusinessFrame(ctx, paper, accent);
    drawTextFit(ctx, title, paper.width / 2, 95, paper.width - margin * 2, 42, { align: "center", weight: "900", color: "#17313b" });
    drawTextFit(ctx, `${Math.max(0, rows.length - 1)} row PDF table generated locally`, paper.width / 2, 138, paper.width - margin * 2, 20, { align: "center", weight: "500", color: "#5b6f78" });
    const tableTop = 190;
    const tableW = paper.width - margin * 2;
    const widths = csvColumnWidths(headers.length, tableW, values.layout);
    drawTableHeader(ctx, margin, tableTop, tableW, headers, widths);
    const rowH = values.layout === "compact" ? 58 : 74;
    const maxRows = Math.floor((paper.height - tableTop - 145) / rowH);
    const rowsToDraw = dataRows.length ? dataRows.slice(0, maxRows) : [["Paste", "CSV", "rows"]];
    rowsToDraw.forEach((row, index) => {
      drawCsvRow(ctx, margin, tableTop + 50 + index * rowH, widths, row, rowH, index);
    });
    if (dataRows.length > rowsToDraw.length) {
      drawTextFit(ctx, `${dataRows.length - rowsToDraw.length} row(s) not shown in this one-page preview.`, margin, paper.height - 78, tableW, 20, { align: "left", weight: "600", color: "#9a3412" });
    }
    drawFooterNote(ctx, paper, "CSV table generated locally. Keep private data out of shared exports.");
  }

  function drawJsonToPdf(ctx, paper, values) {
    const margin = 82;
    const title = sanitizePrintable(values.title || "JSON Summary");
    const parsed = formatJsonForDisplay(values.json || "");
    const accent = values.theme === "technical" ? "#0f766e" : values.theme === "compact" ? "#6b7280" : "#176b87";
    drawBusinessFrame(ctx, paper, accent);
    drawTextFit(ctx, title, paper.width / 2, 95, paper.width - margin * 2, 42, { align: "center", weight: "900", color: "#17313b" });
    drawTextFit(ctx, parsed.valid ? "Valid JSON formatted locally" : "Plain text export: JSON could not be parsed", paper.width / 2, 138, paper.width - margin * 2, 20, { align: "center", weight: "600", color: parsed.valid ? "#0f766e" : "#9a3412" });
    const box = { x: margin, y: 185, width: paper.width - margin * 2, height: paper.height - 280 };
    ctx.save();
    ctx.fillStyle = values.theme === "technical" ? "#f0fdfa" : "#f7faf8";
    roundRect(ctx, box.x, box.y, box.width, box.height, 8, true, false);
    ctx.strokeStyle = "rgba(23,49,59,0.22)";
    ctx.lineWidth = 2;
    roundRect(ctx, box.x, box.y, box.width, box.height, 8, false, true);
    ctx.restore();
    const font = values.theme === "compact" ? "19px Consolas, monospace" : "21px Consolas, monospace";
    const lineHeight = values.theme === "compact" ? 25 : 29;
    const maxLines = Math.floor((box.height - 42) / lineHeight);
    drawCodeLines(ctx, parsed.text, box.x + 24, box.y + 42, box.width - 48, lineHeight, font, maxLines);
    drawFooterNote(ctx, paper, "JSON formatted locally. Remove secrets before exporting or sharing.");
  }

  function drawSignInSheet(ctx, paper, values) {
    const margin = 64;
    const rowCount = Number(values.rows || 16);
    const columns = signInColumns(values.columns);
    drawPageFrame(ctx, paper, "#176b87");
    drawTextFit(ctx, sanitizePrintable(values.title || "Sign-in Sheet"), paper.width / 2, 105, paper.width - margin * 2, 48, { align: "center", weight: "900", color: "#17313b" });
    drawTextFit(ctx, sanitizePrintable(values.event || "Event"), margin, 158, paper.width * 0.58, 24, { align: "left", weight: "700", color: "#17313b" });
    drawTextFit(ctx, sanitizePrintable(values.date || ""), paper.width - margin, 158, paper.width * 0.3, 22, { align: "right", weight: "500", color: "#5b6f78" });
    const tableTop = 215;
    const tableW = paper.width - margin * 2;
    const headerH = 52;
    const rowH = Math.min(70, (paper.height - tableTop - 185) / rowCount);
    const widths = columns.map((column) => column.width * tableW);
    drawTableHeader(ctx, margin, tableTop, tableW, columns.map((column) => column.label), widths);
    for (let i = 0; i < rowCount; i += 1) {
      const y = tableTop + headerH + i * rowH;
      ctx.strokeStyle = "rgba(23,49,59,0.24)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(margin, y, tableW, rowH);
      let cursor = margin;
      for (let c = 0; c < widths.length - 1; c += 1) {
        cursor += widths[c];
        line(ctx, cursor, y, cursor, y + rowH);
      }
    }
    drawWrappedText(ctx, sanitizePrintable(values.notes || "Please print clearly."), margin, paper.height - 135, tableW, 26, "#5b6f78", "21px Arial", 3);
  }

  function signInColumns(key) {
    const map = {
      "name-signature": [
        { label: "Name", width: 0.55 },
        { label: "Signature", width: 0.45 },
      ],
      "name-phone-signature": [
        { label: "Name", width: 0.4 },
        { label: "Phone", width: 0.28 },
        { label: "Signature", width: 0.32 },
      ],
      "name-time-signature": [
        { label: "Name", width: 0.42 },
        { label: "Time", width: 0.2 },
        { label: "Signature", width: 0.38 },
      ],
    };
    return map[key] || [
      { label: "Name", width: 0.38 },
      { label: "Email", width: 0.34 },
      { label: "Signature", width: 0.28 },
    ];
  }

  function parseMarkdownBlocks(value) {
    const lines = String(value || "").replace(/\r/g, "").split("\n");
    const blocks = [];
    let paragraph = [];
    const flush = () => {
      if (!paragraph.length) return;
      blocks.push({ type: "p", text: sanitizePrintable(paragraph.join(" ")) });
      paragraph = [];
    };
    for (const rawLine of lines) {
      const lineText = rawLine.trim();
      if (!lineText) {
        flush();
        continue;
      }
      const heading = lineText.match(/^(#{1,3})\s+(.+)/);
      if (heading) {
        flush();
        blocks.push({ type: heading[1].length === 1 ? "h1" : "h2", text: sanitizeMarkdownInline(heading[2]) });
        continue;
      }
      const bullet = lineText.match(/^[-*]\s+(.+)/);
      if (bullet) {
        flush();
        blocks.push({ type: "bullet", text: sanitizeMarkdownInline(bullet[1]) });
        continue;
      }
      const numbered = lineText.match(/^(\d+)[.)]\s+(.+)/);
      if (numbered) {
        flush();
        blocks.push({ type: "number", index: Number(numbered[1]), text: sanitizeMarkdownInline(numbered[2]) });
        continue;
      }
      const quote = lineText.match(/^>\s*(.+)/);
      if (quote) {
        flush();
        blocks.push({ type: "quote", text: sanitizeMarkdownInline(quote[1]) });
        continue;
      }
      paragraph.push(sanitizeMarkdownInline(lineText));
    }
    flush();
    return blocks.length ? blocks.slice(0, 42) : [{ type: "p", text: "Paste Markdown content to preview a readable PDF." }];
  }

  function sanitizeMarkdownInline(value) {
    return sanitizePrintable(String(value || "")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/__([^_]+)__/g, "$1")
      .replace(/_([^_]+)_/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"));
  }

  function parseCsvRows(value) {
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;
    const text = String(value || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      const next = text[i + 1];
      if (char === "\"") {
        if (quoted && next === "\"") {
          cell += "\"";
          i += 1;
        } else {
          quoted = !quoted;
        }
        continue;
      }
      if (char === "," && !quoted) {
        row.push(sanitizePrintable(cell));
        cell = "";
        continue;
      }
      if (char === "\n" && !quoted) {
        row.push(sanitizePrintable(cell));
        rows.push(row);
        row = [];
        cell = "";
        continue;
      }
      cell += char;
    }
    row.push(sanitizePrintable(cell));
    rows.push(row);
    return rows
      .map((items) => items.map((item) => item.trim()).filter((item, index, list) => item || list.length > 1 || index === 0))
      .filter((items) => items.some(Boolean));
  }

  function csvColumnWidths(count, tableW, layout) {
    const cols = Math.max(1, Math.min(5, count || 3));
    if (layout === "wide" && cols > 1) {
      const first = tableW * 0.42;
      const rest = (tableW - first) / (cols - 1);
      return [first, ...Array.from({ length: cols - 1 }, () => rest)];
    }
    return Array.from({ length: cols }, () => tableW / cols);
  }

  function drawCsvRow(ctx, x, y, widths, row, rowH, index) {
    const rowW = widths.reduce((sum, width) => sum + width, 0);
    ctx.save();
    ctx.fillStyle = index % 2 ? "rgba(23,107,135,0.04)" : "#ffffff";
    ctx.fillRect(x, y, rowW, rowH);
    ctx.strokeStyle = "rgba(23,49,59,0.20)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, rowW, rowH);
    let cursor = x;
    widths.forEach((width, columnIndex) => {
      const value = row[columnIndex] || "";
      drawTextFit(ctx, value || "-", cursor + 10, y + Math.min(42, rowH / 2 + 9), width - 20, rowH < 62 ? 17 : 19, { align: "left", weight: columnIndex === 0 ? "700" : "500", color: "#17313b" });
      cursor += width;
      if (columnIndex < widths.length - 1) line(ctx, cursor, y, cursor, y + rowH);
    });
    ctx.restore();
  }

  function formatJsonForDisplay(value) {
    const raw = String(value || "").trim();
    if (!raw) return { valid: false, text: "Paste JSON content here." };
    try {
      return { valid: true, text: JSON.stringify(JSON.parse(raw), null, 2) };
    } catch {
      return { valid: false, text: raw };
    }
  }

  function drawCodeLines(ctx, text, x, y, maxWidth, lineHeight, font, maxLines) {
    const lines = String(text || "").split("\n");
    let drawn = 0;
    for (const lineText of lines) {
      if (drawn >= maxLines) break;
      const wrapped = wrapText(ctx, lineText || " ", maxWidth, font, 4);
      for (const wrappedLine of wrapped) {
        if (drawn >= maxLines) break;
        ctx.save();
        ctx.font = font || "20px Consolas, monospace";
        ctx.fillStyle = /^\s*"/.test(wrappedLine) ? "#0f766e" : "#17313b";
        ctx.textAlign = "left";
        ctx.fillText(wrappedLine, x, y + drawn * lineHeight);
        ctx.restore();
        drawn += 1;
      }
    }
    if (lines.length > drawn) {
      ctx.save();
      ctx.font = "700 18px Arial";
      ctx.fillStyle = "#9a3412";
      ctx.fillText("Output truncated to fit one PDF page.", x, y + Math.min(maxLines, drawn + 1) * lineHeight);
      ctx.restore();
    }
  }

  function drawGraphPaper(ctx, paper, values) {
    const margin = 64;
    const title = sanitizePrintable(values.title || "Printable Graph Paper");
    const accent = values.color === "green" ? "#5a9367" : values.color === "gray" ? "#6b7280" : "#176b87";
    const minorColor = values.color === "gray" ? "rgba(107,114,128,0.30)" : values.color === "green" ? "rgba(90,147,103,0.28)" : "rgba(23,107,135,0.28)";
    const majorColor = values.color === "gray" ? "rgba(23,49,59,0.45)" : values.color === "green" ? "rgba(90,147,103,0.52)" : "rgba(23,107,135,0.52)";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, paper.width, paper.height);
    drawTextFit(ctx, title, paper.width / 2, 70, paper.width - margin * 2, 32, { align: "center", weight: "800", color: "#17313b" });
    const grid = { x: margin, y: 112, width: paper.width - margin * 2, height: paper.height - 185 };
    const pxPerInch = 150;
    const step = Math.max(18, Number(values.spacing || 0.25) * pxPerInch);
    ctx.save();
    if (values.style === "dots") {
      ctx.fillStyle = minorColor;
      for (let x = grid.x; x <= grid.x + grid.width + 1; x += step) {
        for (let y = grid.y; y <= grid.y + grid.height + 1; y += step) {
          ctx.beginPath();
          ctx.arc(x, y, 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else {
      ctx.strokeStyle = minorColor;
      ctx.lineWidth = 1;
      for (let x = grid.x; x <= grid.x + grid.width + 1; x += step) line(ctx, x, grid.y, x, grid.y + grid.height);
      for (let y = grid.y; y <= grid.y + grid.height + 1; y += step) line(ctx, grid.x, y, grid.x + grid.width, y);
      if (values.style === "major") {
        ctx.strokeStyle = majorColor;
        ctx.lineWidth = 2;
        const majorEvery = Math.max(1, Math.round(pxPerInch / step));
        let index = 0;
        for (let x = grid.x; x <= grid.x + grid.width + 1; x += step) {
          if (index % majorEvery === 0) line(ctx, x, grid.y, x, grid.y + grid.height);
          index += 1;
        }
        index = 0;
        for (let y = grid.y; y <= grid.y + grid.height + 1; y += step) {
          if (index % majorEvery === 0) line(ctx, grid.x, y, grid.x + grid.width, y);
          index += 1;
        }
      }
    }
    ctx.strokeStyle = accent;
    ctx.lineWidth = 4;
    ctx.strokeRect(grid.x, grid.y, grid.width, grid.height);
    ctx.restore();
    drawFooterNote(ctx, paper, "Print at actual size when grid spacing matters.");
  }

  function drawPackingList(ctx, paper, values) {
    const margin = 68;
    drawPageFrame(ctx, paper, "#5a9367");
    drawTextFit(ctx, sanitizePrintable(values.title || "Packing List"), paper.width / 2, 104, paper.width - margin * 2, 48, { align: "center", weight: "900", color: "#17313b" });
    drawTextFit(ctx, sanitizePrintable(values.destination || "Trip"), paper.width / 2, 154, paper.width - margin * 2, 24, { align: "center", weight: "600", color: "#5b6f78" });
    const sections = parsePackingSections(values.sections);
    const top = 220;
    const gap = 18;
    const cols = 2;
    const rows = Math.max(2, Math.ceil(Math.min(sections.length || 1, 6) / cols));
    const gridW = paper.width - margin * 2;
    const panelW = (gridW - gap) / cols;
    const panelH = Math.min(310, (paper.height - top - 270 - gap * (rows - 1)) / rows);
    sections.slice(0, 6).forEach((section, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = margin + col * (panelW + gap);
      const y = top + row * (panelH + gap);
      drawChecklistPanel(ctx, x, y, panelW, panelH, section.title, section.items);
    });
    drawPromptBox(ctx, margin, paper.height - 220, gridW, sanitizePrintable(values.notes || "Trip reminders"));
  }

  function drawReceiptGenerator(ctx, paper, values) {
    const margin = 86;
    drawBusinessFrame(ctx, paper, "#176b87");
    drawTextFit(ctx, "RECEIPT", paper.width / 2, 118, paper.width - margin * 2, 58, { align: "center", weight: "900", color: "#17313b" });
    const amountText = `${values.currency || "USD"} ${sanitizePrintable(values.amount || "0.00")}`;
    ctx.save();
    ctx.fillStyle = "#edf7f6";
    roundRect(ctx, margin, 210, paper.width - margin * 2, 120, 8, true, false);
    ctx.restore();
    drawTextFit(ctx, amountText, paper.width / 2, 270, paper.width - margin * 2 - 40, 52, { align: "center", weight: "900", color: "#176b87" });
    const lines = [
      ["Received from", values.receivedFrom],
      ["Received by", values.receivedBy],
      ["Description", values.description],
      ["Date", values.date],
      ["Payment method", values.method],
    ];
    let y = 405;
    lines.forEach(([label, value]) => {
      drawReceiptLine(ctx, margin, y, paper.width - margin * 2, label, sanitizePrintable(value));
      y += label === "Description" ? 104 : 82;
    });
    drawWrappedText(ctx, sanitizePrintable(values.notes || ""), margin, y + 15, paper.width - margin * 2, 28, "#5b6f78", "22px Arial", 4);
    drawSignatureLine(ctx, margin, paper.height - 230, "Recipient signature");
    drawSignatureLine(ctx, paper.width / 2 + 30, paper.height - 230, "Date");
    drawFooterNote(ctx, paper, "Simple payment receipt only. Keep your own accounting records.");
  }

  function drawTimesheet(ctx, paper, values) {
    const margin = 66;
    drawPageFrame(ctx, paper, "#17313b");
    drawTextFit(ctx, sanitizePrintable(values.title || "Weekly Timesheet"), paper.width / 2, 105, paper.width - margin * 2, 48, { align: "center", weight: "900", color: "#17313b" });
    drawTextFit(ctx, sanitizePrintable(values.worker || "Worker"), margin, 158, paper.width * 0.46, 24, { align: "left", weight: "700", color: "#17313b" });
    drawTextFit(ctx, sanitizePrintable(values.period || "Period"), paper.width - margin, 158, paper.width * 0.42, 22, { align: "right", weight: "500", color: "#5b6f78" });
    const tableTop = 225;
    const tableW = paper.width - margin * 2;
    const widths = [0.16, 0.29, 0.12, 0.43].map((value) => value * tableW);
    drawTableHeader(ctx, margin, tableTop, tableW, ["Day", "Project", "Hours", "Notes"], widths);
    const rows = parseTimesheetRows(values.rows);
    let y = tableTop + 50;
    let total = 0;
    rows.slice(0, 10).forEach((row) => {
      drawTimesheetRow(ctx, margin, y, widths, row);
      total += row.hours;
      y += 72;
    });
    ctx.save();
    ctx.fillStyle = "#edf7f6";
    roundRect(ctx, margin, y + 20, tableW, 74, 8, true, false);
    ctx.restore();
    drawTextFit(ctx, `Total hours: ${formatHours(total)}`, margin + 24, y + 58, tableW * 0.42, 26, { align: "left", weight: "900", color: "#17313b" });
    drawWrappedText(ctx, sanitizePrintable(values.notes || ""), margin + tableW * 0.46, y + 50, tableW * 0.5, 25, "#5b6f78", "20px Arial", 3);
    drawSignatureLine(ctx, margin, paper.height - 145, "Approval signature");
    drawSignatureLine(ctx, paper.width / 2 + 30, paper.height - 145, "Date");
    drawFooterNote(ctx, paper, "Printable timesheet only. Review hours before submitting.");
  }

  function drawCertificate(ctx, paper, values) {
    const margin = 84;
    const accent = values.style === "school" ? "#5a9367" : values.style === "event" ? "#176b87" : "#17313b";
    drawPageFrame(ctx, paper, accent);
    ctx.save();
    ctx.strokeStyle = "rgba(242,184,75,0.78)";
    ctx.lineWidth = 8;
    ctx.strokeRect(86, 86, paper.width - 172, paper.height - 172);
    ctx.restore();
    drawTextFit(ctx, sanitizePrintable(values.title || "Certificate"), paper.width / 2, 215, paper.width - margin * 2, 54, { align: "center", weight: "900", color: "#17313b" });
    drawTextFit(ctx, "Presented to", paper.width / 2, 340, paper.width - margin * 2, 28, { align: "center", weight: "500", color: "#5b6f78" });
    drawTextFit(ctx, sanitizePrintable(values.recipient || "Recipient Name"), paper.width / 2, 430, paper.width - margin * 2, 72, { align: "center", weight: "900", color: accent });
    drawWrappedText(ctx, sanitizePrintable(values.reason || ""), margin + 70, 560, paper.width - margin * 2 - 140, 38, "#17313b", "27px Arial", 5);
    drawTextFit(ctx, sanitizePrintable(values.date || ""), paper.width / 2, paper.height - 410, paper.width - margin * 2, 28, { align: "center", weight: "700", color: "#5b6f78" });
    drawSignatureLine(ctx, margin + 70, paper.height - 250, "Signature");
    drawTextFit(ctx, sanitizePrintable(values.signer || ""), margin + 70, paper.height - 198, 360, 23, { align: "left", weight: "700", color: "#17313b" });
    drawFooterNote(ctx, paper, "Printable certificate generated with PrintableTools Lab.");
  }

  function drawTodoList(ctx, paper, values) {
    const margin = 70;
    drawPageFrame(ctx, paper, "#176b87");
    drawTextFit(ctx, sanitizePrintable(values.title || "To Do List"), paper.width / 2, 105, paper.width - margin * 2, 50, { align: "center", weight: "900", color: "#17313b" });
    const sections = parseChecklistSections(values.sections);
    const cols = 2;
    const gap = 28;
    const gridW = paper.width - margin * 2;
    const panelW = (gridW - gap) / cols;
    const top = 190;
    const rows = Math.ceil(Math.min(sections.length, 6) / cols);
    const panelH = Math.min(270, (paper.height - top - 290 - gap * (rows - 1)) / rows);
    sections.slice(0, 6).forEach((section, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = margin + col * (panelW + gap);
      const y = top + row * (panelH + gap);
      drawChecklistPanel(ctx, x, y, panelW, panelH, section.title, section.items);
    });
    drawPromptBox(ctx, margin, paper.height - 220, gridW, sanitizePrintable(values.notes || "Notes"));
    drawFooterNote(ctx, paper, "Printable checklist only. Keep the list short enough to act on today.");
  }

  function drawBusinessCard(ctx, paper, values) {
    const margin = 72;
    const gap = 24;
    const cols = 2;
    const rows = 5;
    const cardW = (paper.width - margin * 2 - gap) / cols;
    const cardH = Math.min(210, (paper.height - margin * 2 - gap * (rows - 1)) / rows);
    const accent = values.style === "bold" ? "#e76f51" : values.style === "soft" ? "#5a9367" : "#176b87";
    drawCutGuides(ctx, paper, margin);
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const x = margin + col * (cardW + gap);
        const y = margin + row * (cardH + gap);
        drawBusinessCardUnit(ctx, x, y, cardW, cardH, values, accent);
      }
    }
    drawFooterNote(ctx, paper, "Printable contact cards. Test print before using card stock.");
  }

  function drawAddressLabels(ctx, paper, values) {
    const margin = 52;
    const config = labelLayout(values.layout, paper, margin);
    const accent = values.style === "classroom" ? "#5a9367" : values.style === "event" ? "#e76f51" : "#176b87";
    drawTextFit(ctx, sanitizePrintable(values.labelTitle || "Address Labels"), paper.width / 2, 36, paper.width - 160, 26, { align: "center", weight: "800", color: "#5b6f78" });
    for (let i = 0; i < config.count; i += 1) {
      const col = i % config.cols;
      const row = Math.floor(i / config.cols);
      const x = margin + col * (config.w + config.gapX);
      const y = config.top + row * (config.h + config.gapY);
      drawLabelUnit(ctx, x, y, config.w, config.h, values, accent);
    }
    drawFooterNote(ctx, paper, "Plain-paper test recommended before printing on adhesive label sheets.");
  }

  function drawPriceTag(ctx, paper, values) {
    const margin = 70;
    const count = Number(values.count || 8);
    const cols = count >= 12 ? 3 : count >= 10 ? 2 : 2;
    const rows = Math.ceil(count / cols);
    const gap = 24;
    const tagW = (paper.width - margin * 2 - gap * (cols - 1)) / cols;
    const tagH = Math.min(260, (paper.height - margin * 2 - 64 - gap * (rows - 1)) / rows);
    const accent = values.theme === "market" ? "#5a9367" : values.theme === "minimal" ? "#17313b" : "#e76f51";
    drawTextFit(ctx, "Printable price tags", paper.width / 2, 58, paper.width - 160, 32, { align: "center", weight: "900", color: "#17313b" });
    for (let i = 0; i < count; i += 1) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = margin + col * (tagW + gap);
      const y = 104 + row * (tagH + gap);
      drawPriceTagUnit(ctx, x, y, tagW, tagH, values, accent);
    }
    drawFooterNote(ctx, paper, "Printable price tags only. Keep prices large and easy to read.");
  }

  function drawFlyer(ctx, paper, values) {
    const margin = 86;
    const accent = values.theme === "service" ? "#176b87" : values.theme === "sale" ? "#e76f51" : "#5a9367";
    drawPageFrame(ctx, paper, accent);
    ctx.save();
    ctx.fillStyle = accent;
    ctx.fillRect(margin, 110, paper.width - margin * 2, 18);
    ctx.fillRect(margin, paper.height - 178, paper.width - margin * 2, 18);
    ctx.restore();
    drawTextFit(ctx, sanitizePrintable(values.headline || "Flyer"), paper.width / 2, 235, paper.width - margin * 2, 78, { align: "center", weight: "900", color: "#17313b" });
    drawTextFit(ctx, sanitizePrintable(values.subhead || ""), paper.width / 2, 332, paper.width - margin * 2, 34, { align: "center", weight: "800", color: accent });
    drawWrappedText(ctx, sanitizePrintable(values.details || ""), margin + 28, 465, paper.width - margin * 2 - 56, 42, "#17313b", "31px Arial", 8);
    ctx.save();
    ctx.fillStyle = "#edf7f6";
    roundRect(ctx, margin + 45, paper.height - 425, paper.width - margin * 2 - 90, 128, 8, true, false);
    ctx.restore();
    drawTextFit(ctx, sanitizePrintable(values.callToAction || "Learn more"), paper.width / 2, paper.height - 360, paper.width - margin * 2 - 140, 36, { align: "center", weight: "900", color: "#17313b" });
    drawTextFit(ctx, sanitizePrintable(values.contact || ""), paper.width / 2, paper.height - 235, paper.width - margin * 2, 28, { align: "center", weight: "700", color: "#5b6f78" });
    drawFooterNote(ctx, paper, "Printable flyer PDF. Review event details and posting rules before printing.");
  }

  function drawBarcodeLabels(ctx, paper, values) {
    const margin = 66;
    const count = Number(values.layout || 12);
    const cols = count >= 20 ? 4 : count >= 12 ? 3 : 2;
    const rows = Math.ceil(count / cols);
    const gap = 18;
    const labelW = (paper.width - margin * 2 - gap * (cols - 1)) / cols;
    const labelH = Math.min(180, (paper.height - 160 - margin - gap * (rows - 1)) / rows);
    const entries = parseBarcodeEntries(values.codes).slice(0, count);
    drawTextFit(ctx, sanitizePrintable(values.title || "Barcode Labels"), paper.width / 2, 64, paper.width - margin * 2, 34, { align: "center", weight: "900", color: "#17313b" });
    for (let i = 0; i < count; i += 1) {
      const entry = entries[i % Math.max(1, entries.length)] || { code: "SKU-1001", label: "Label" };
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = margin + col * (labelW + gap);
      const y = 118 + row * (labelH + gap);
      drawBarcodeLabelUnit(ctx, x, y, labelW, labelH, entry, values.showText !== "no");
    }
    drawFooterNote(ctx, paper, "Code 39-style labels for internal use. Test scanning before full printing.");
  }

  function drawCoupon(ctx, paper, values) {
    const margin = 70;
    const cols = 2;
    const rows = 4;
    const gap = 24;
    const couponW = (paper.width - margin * 2 - gap) / cols;
    const couponH = Math.min(255, (paper.height - margin * 2 - gap * (rows - 1)) / rows);
    const accent = values.style === "market" ? "#5a9367" : values.style === "clean" ? "#176b87" : "#e76f51";
    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const x = margin + col * (couponW + gap);
        const y = margin + row * (couponH + gap);
        drawCouponUnit(ctx, x, y, couponW, couponH, values, accent);
      }
    }
    drawFooterNote(ctx, paper, "Printable coupons only. Use accurate offers and clear terms.");
  }

  function drawPackingSlip(ctx, paper, values) {
    const margin = 70;
    const rows = parsePipeRows(values.items, ["Item", "Qty", "Status"]);
    drawBusinessFrame(ctx, paper, "#176b87");
    drawTextFit(ctx, "PACKING SLIP", margin, 108, 520, 56, { align: "left", weight: "900", color: "#17313b" });
    ctx.font = "22px Arial";
    ctx.fillStyle = "#5b6f78";
    ctx.textAlign = "right";
    ctx.fillText(sanitizePrintable(values.orderNo || "ORDER-1001"), paper.width - margin, 94);
    ctx.fillText(`Ship date: ${sanitizePrintable(values.date || "")}`, paper.width - margin, 130);
    drawBusinessBlock(ctx, "Sender", values.business, margin, 205, (paper.width - margin * 2 - 24) / 2);
    drawBusinessBlock(ctx, "Ship to", values.recipient, paper.width / 2 + 12, 205, (paper.width - margin * 2 - 24) / 2);

    const tableY = 430;
    const tableW = paper.width - margin * 2;
    const widths = [tableW * 0.58, tableW * 0.16, tableW * 0.26];
    drawTableHeader(ctx, margin, tableY, tableW, ["Item", "Qty", "Status"], widths);
    let y = tableY + 56;
    rows.slice(0, 9).forEach((row) => {
      drawSimpleTableRow(ctx, margin, y, widths, [row.values[0], row.values[1], row.values[2]]);
      y += 58;
    });
    drawWrappedText(ctx, sanitizePrintable(values.notes || "Check package contents before shipping."), margin, paper.height - 210, paper.width - margin * 2, 28, "#5b6f78", "22px Arial", 4);
    drawFooterNote(ctx, paper, "Packing slip only. Do not include private payment details unless needed.");
  }

  function drawWorkOrder(ctx, paper, values) {
    drawBusinessDocument(ctx, paper, Object.assign({}, values, {
      invoiceNo: values.orderNo,
      notes: `${sanitizePrintable(values.instructions || "")}\n${sanitizePrintable(values.notes || "")}`.trim(),
    }), {
      title: "WORK ORDER",
      accent: "#5a9367",
      fromLabel: "Provider",
      toLabel: "Client / site",
      numberFallback: "WO-001",
      metaLabel: "Created",
      tableHeaders: ["Task", "Qty", "Rate", "Amount"],
      totalLabel: "Estimated total",
      footer: "Work order draft only. Confirm scope, approval, and safety requirements.",
      defaultNote: "Client approval required before additional parts or labor.",
      signatures: true,
    });
  }

  function drawInventorySheet(ctx, paper, values) {
    const margin = 64;
    const rows = parsePipeRows(values.items, ["SKU", "Item", "Expected", "Counted", "Note"]);
    drawBusinessFrame(ctx, paper, "#17313b");
    drawTextFit(ctx, sanitizePrintable(values.title || "Inventory Count Sheet"), paper.width / 2, 88, paper.width - margin * 2, 44, { align: "center", weight: "900", color: "#17313b" });
    drawTextFit(ctx, `${sanitizePrintable(values.location || "Location")} · ${sanitizePrintable(values.date || "")}`, paper.width / 2, 134, paper.width - margin * 2, 23, { align: "center", weight: "700", color: "#5b6f78" });
    const tableY = 198;
    const tableW = paper.width - margin * 2;
    const simple = values.columns === "simple";
    const restock = values.columns === "restock";
    const headers = simple ? ["Item", "Counted", "Note"] : restock ? ["SKU", "Item", "Counted", "Restock note"] : ["SKU", "Item", "Expected", "Counted", "Note"];
    const widths = simple
      ? [tableW * 0.5, tableW * 0.2, tableW * 0.3]
      : restock
        ? [tableW * 0.18, tableW * 0.38, tableW * 0.18, tableW * 0.26]
        : [tableW * 0.16, tableW * 0.34, tableW * 0.16, tableW * 0.16, tableW * 0.18];
    drawTableHeader(ctx, margin, tableY, tableW, headers, widths);
    let y = tableY + 56;
    rows.slice(0, 13).forEach((row) => {
      const valuesForRow = simple
        ? [row.values[1] || row.values[0], row.values[3] || "", row.values[4] || ""]
        : restock
          ? [row.values[0], row.values[1], row.values[3] || "", row.values[4] || ""]
          : row.values.slice(0, 5);
      drawSimpleTableRow(ctx, margin, y, widths, valuesForRow);
      y += 56;
    });
    drawWrappedText(ctx, sanitizePrintable(values.notes || "Review low-stock items before reordering."), margin, paper.height - 105, paper.width - margin * 2, 24, "#5b6f78", "19px Arial", 2);
    drawFooterNote(ctx, paper, "Printable inventory count sheet. Verify counts before ordering or reporting.");
  }

  function parseChecklistSections(value) {
    const lines = splitList(value || "", "\n");
    const sections = lines.map((lineText) => {
      const parts = lineText.split(":");
      const title = sanitizePrintable(parts[0] || "Tasks");
      const items = parts.slice(1).join(":").split(",").map((item) => sanitizePrintable(item)).filter(Boolean);
      return { title, items: items.length ? items : [""] };
    });
    return sections.length ? sections : [
      { title: "Top priorities", items: ["First task", "Second task", "Third task"] },
      { title: "Errands", items: ["Grocery", "Post office", "Return item"] },
      { title: "Follow-up", items: ["Email", "Call", "Confirm"] },
    ];
  }

  function parseTimesheetRows(value) {
    const rows = splitList(value || "", "\n").map((lineText) => {
      const parts = lineText.split("|").map((part) => sanitizePrintable(part));
      const hours = Math.max(0, Math.min(24, Number((parts[2] || "0").replace(/[^0-9.]/g, "")) || 0));
      return {
        day: parts[0] || "Day",
        project: parts[1] || "Project",
        hours,
        notes: parts[3] || "",
      };
    });
    return rows.length ? rows : [
      { day: "Monday", project: "Project", hours: 8, notes: "" },
      { day: "Tuesday", project: "Project", hours: 8, notes: "" },
      { day: "Wednesday", project: "Project", hours: 8, notes: "" },
      { day: "Thursday", project: "Project", hours: 8, notes: "" },
      { day: "Friday", project: "Project", hours: 8, notes: "" },
    ];
  }

  function drawTimesheetRow(ctx, x, y, widths, row) {
    const rowW = widths.reduce((sum, width) => sum + width, 0);
    ctx.save();
    ctx.strokeStyle = "rgba(23,49,59,0.22)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, rowW, 72);
    const values = [row.day, row.project, formatHours(row.hours), row.notes];
    let cursor = x;
    values.forEach((value, index) => {
      const align = index === 2 ? "right" : "left";
      const textX = align === "right" ? cursor + widths[index] - 12 : cursor + 12;
      drawTextFit(ctx, value || "-", textX, y + 38, widths[index] - 24, index === 2 ? 20 : 18, { align, weight: index === 0 ? "800" : "500", color: "#17313b" });
      cursor += widths[index];
      if (index < values.length - 1) {
        ctx.strokeStyle = "rgba(23,49,59,0.16)";
        line(ctx, cursor, y, cursor, y + 72);
      }
    });
    ctx.restore();
  }

  function formatHours(value) {
    return Number(value || 0).toFixed(2).replace(/\.00$/, "").replace(/0$/, "");
  }

  function parsePackingSections(value) {
    const lines = splitList(value || "", "\n");
    const sections = lines.map((lineText) => {
      const parts = lineText.split(":");
      const title = sanitizePrintable(parts[0] || "Items");
      const items = parts.slice(1).join(":").split(",").map((item) => sanitizePrintable(item)).filter(Boolean);
      return { title, items: items.length ? items : [""] };
    });
    return sections.length ? sections : [
      { title: "Clothing", items: ["Shirts", "Pants", "Socks", "Sleepwear"] },
      { title: "Toiletries", items: ["Toothbrush", "Toothpaste", "Shampoo"] },
      { title: "Documents", items: ["ID", "Tickets", "Reservation notes"] },
      { title: "Electronics", items: ["Phone charger", "Headphones"] },
    ];
  }

  function parsePipeRows(value, fallbackHeaders) {
    const lines = splitList(value || "", "\n");
    const rows = lines.map((lineText) => {
      const values = lineText.split("|").map((part) => sanitizePrintable(part));
      return { values };
    });
    if (rows.length) return rows;
    return [
      { values: (fallbackHeaders || ["Item", "Qty", "Note"]).map((header, index) => (index === 0 ? "Sample item" : index === 1 ? "1" : "")) },
    ];
  }

  function drawSimpleTableRow(ctx, x, y, widths, values) {
    const rowW = widths.reduce((sum, width) => sum + width, 0);
    ctx.save();
    ctx.strokeStyle = "rgba(23,49,59,0.2)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, rowW, 52);
    let cursor = x;
    widths.forEach((width, index) => {
      if (index > 0) {
        ctx.strokeStyle = "rgba(23,49,59,0.12)";
        line(ctx, cursor, y, cursor, y + 52);
      }
      const value = values[index] || "";
      drawTextFit(ctx, value || "-", cursor + 12, y + 28, width - 24, 18, { align: "left", weight: index === 0 ? "700" : "500", color: "#17313b" });
      cursor += width;
    });
    ctx.restore();
  }

  function drawChecklistPanel(ctx, x, y, width, height, title, items) {
    ctx.save();
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, x, y, width, height, 8, true, false);
    ctx.strokeStyle = "rgba(23,49,59,0.24)";
    ctx.lineWidth = 2;
    roundRect(ctx, x, y, width, height, 8, false, true);
    ctx.fillStyle = "#edf7f6";
    ctx.fillRect(x + 2, y + 2, width - 4, 48);
    drawTextFit(ctx, title, x + 18, y + 28, width - 36, 22, { align: "left", weight: "800", color: "#17313b" });
    let cursor = y + 78;
    items.slice(0, Math.floor((height - 78) / 34)).forEach((item) => {
      drawCheckBox(ctx, x + 18, cursor - 18, 22);
      drawTextFit(ctx, item || "Item", x + 52, cursor - 7, width - 70, 18, { align: "left", weight: "500", color: "#17313b" });
      cursor += 34;
    });
    ctx.restore();
  }

  function drawBusinessCardUnit(ctx, x, y, width, height, values, accent) {
    ctx.save();
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, x, y, width, height, 8, true, false);
    ctx.strokeStyle = "rgba(23,49,59,0.28)";
    ctx.lineWidth = 2;
    roundRect(ctx, x, y, width, height, 8, false, true);
    ctx.fillStyle = accent;
    ctx.fillRect(x, y, width, 12);
    drawTextFit(ctx, sanitizePrintable(values.name || "Name"), x + 24, y + 58, width - 48, 27, { align: "left", weight: "900", color: "#17313b" });
    drawTextFit(ctx, sanitizePrintable(values.role || ""), x + 24, y + 92, width - 48, 19, { align: "left", weight: "700", color: accent });
    drawTextFit(ctx, sanitizePrintable(values.business || ""), x + 24, y + 126, width - 48, 21, { align: "left", weight: "800", color: "#17313b" });
    const contact = [values.email, values.phone, values.website].map(sanitizePrintable).filter(Boolean).join("  |  ");
    drawTextFit(ctx, contact, x + 24, y + 161, width - 48, 17, { align: "left", weight: "500", color: "#5b6f78" });
    drawTextFit(ctx, sanitizePrintable(values.tagline || ""), x + 24, y + height - 26, width - 48, 16, { align: "left", weight: "700", color: "#5b6f78" });
    ctx.restore();
  }

  function drawLabelUnit(ctx, x, y, width, height, values, accent) {
    ctx.save();
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, x, y, width, height, 8, true, false);
    ctx.strokeStyle = "rgba(23,49,59,0.18)";
    ctx.lineWidth = 1.5;
    roundRect(ctx, x, y, width, height, 8, false, true);
    ctx.fillStyle = accent;
    ctx.fillRect(x + 10, y + 12, 5, height - 24);
    drawTextFit(ctx, sanitizePrintable(values.recipient || values.labelTitle || "Label"), x + 28, y + 33, width - 46, 18, { align: "left", weight: "900", color: "#17313b" });
    drawWrappedText(ctx, sanitizePrintable(values.address || ""), x + 28, y + 60, width - 46, 20, "#17313b", "16px Arial", Math.max(2, Math.floor((height - 78) / 20)));
    drawTextFit(ctx, sanitizePrintable(values.note || ""), x + 28, y + height - 22, width - 46, 14, { align: "left", weight: "700", color: "#5b6f78" });
    ctx.restore();
  }

  function drawPriceTagUnit(ctx, x, y, width, height, values, accent) {
    ctx.save();
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, x, y, width, height, 8, true, false);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    roundRect(ctx, x, y, width, height, 8, false, true);
    ctx.fillStyle = "rgba(242,184,75,0.18)";
    if (accent === "#5a9367") ctx.fillStyle = "rgba(90,147,103,0.15)";
    if (accent === "#17313b") ctx.fillStyle = "rgba(23,49,59,0.08)";
    ctx.fillRect(x + 8, y + 8, width - 16, 52);
    drawTextFit(ctx, sanitizePrintable(values.title || "Sale"), x + width / 2, y + 36, width - 32, 22, { align: "center", weight: "900", color: "#17313b" });
    drawTextFit(ctx, sanitizePrintable(values.price || "$0"), x + width / 2, y + height / 2 + 2, width - 34, Math.min(58, height * 0.28), { align: "center", weight: "900", color: accent });
    drawTextFit(ctx, sanitizePrintable(values.subtitle || ""), x + width / 2, y + height - 68, width - 32, 19, { align: "center", weight: "700", color: "#17313b" });
    drawTextFit(ctx, sanitizePrintable(values.footer || ""), x + width / 2, y + height - 34, width - 32, 16, { align: "center", weight: "600", color: "#5b6f78" });
    ctx.restore();
  }

  function drawBarcodeLabelUnit(ctx, x, y, width, height, entry, showText) {
    ctx.save();
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, x, y, width, height, 8, true, false);
    ctx.strokeStyle = "rgba(23,49,59,0.24)";
    ctx.lineWidth = 1.5;
    roundRect(ctx, x, y, width, height, 8, false, true);
    drawTextFit(ctx, entry.label || "Label", x + width / 2, y + 28, width - 24, 16, { align: "center", weight: "800", color: "#17313b" });
    drawCode39(ctx, entry.code, x + 18, y + 52, width - 36, Math.max(54, height - 98));
    if (showText) drawTextFit(ctx, entry.code, x + width / 2, y + height - 23, width - 28, 16, { align: "center", weight: "700", color: "#17313b" });
    ctx.restore();
  }

  function drawCouponUnit(ctx, x, y, width, height, values, accent) {
    ctx.save();
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, x, y, width, height, 8, true, false);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 8]);
    roundRect(ctx, x, y, width, height, 8, false, true);
    ctx.setLineDash([]);
    ctx.fillStyle = accent;
    ctx.fillRect(x, y, width, 46);
    drawTextFit(ctx, sanitizePrintable(values.business || "Coupon"), x + width / 2, y + 26, width - 32, 18, { align: "center", weight: "900", color: "#ffffff" });
    drawTextFit(ctx, sanitizePrintable(values.offer || "Special offer"), x + width / 2, y + 88, width - 34, 30, { align: "center", weight: "900", color: "#17313b" });
    drawWrappedText(ctx, sanitizePrintable(values.details || ""), x + 22, y + 122, width - 44, 21, "#5b6f78", "17px Arial", 3);
    drawTextFit(ctx, `Code: ${sanitizePrintable(values.code || "OFFER")}`, x + 24, y + height - 70, width - 48, 17, { align: "left", weight: "900", color: accent });
    drawTextFit(ctx, sanitizePrintable(values.expires || ""), x + width - 24, y + height - 70, width * 0.48, 15, { align: "right", weight: "700", color: "#5b6f78" });
    drawTextFit(ctx, sanitizePrintable(values.finePrint || ""), x + 24, y + height - 30, width - 48, 13, { align: "left", weight: "500", color: "#5b6f78" });
    ctx.restore();
  }

  function drawCutGuides(ctx, paper, margin) {
    ctx.save();
    ctx.strokeStyle = "rgba(23,49,59,0.14)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 8]);
    ctx.strokeRect(margin - 14, margin - 14, paper.width - margin * 2 + 28, paper.height - margin * 2 + 28);
    ctx.restore();
  }

  function labelLayout(layout, paper, margin) {
    if (layout === "14") return { count: 14, cols: 2, w: (paper.width - margin * 2 - 18) / 2, h: 134, gapX: 18, gapY: 16, top: 72 };
    if (layout === "10") return { count: 10, cols: 2, w: (paper.width - margin * 2 - 18) / 2, h: 180, gapX: 18, gapY: 18, top: 82 };
    return { count: 30, cols: 3, w: (paper.width - margin * 2 - 24) / 3, h: 92, gapX: 12, gapY: 10, top: 72 };
  }

  function parseBarcodeEntries(value) {
    const entries = splitList(value || "", "\n").map((lineText) => {
      const parts = lineText.split("|").map((part) => sanitizePrintable(part));
      const code = normalizeCode39(parts[0] || "SKU-1001");
      return { code, label: parts[1] || code };
    });
    return entries.length ? entries : [{ code: "SKU-1001", label: "Label" }];
  }

  function normalizeCode39(value) {
    const clean = String(value || "SKU-1001").toUpperCase().replace(/[^A-Z0-9 \-.$/+%]/g, "-").replace(/\s+/g, " ").trim();
    return clean.slice(0, 22) || "SKU-1001";
  }

  function drawCode39(ctx, value, x, y, width, height) {
    const encoded = `*${normalizeCode39(value)}*`;
    const bits = code39Bits(encoded);
    const unit = Math.max(1, Math.floor(width / bits.length));
    const totalW = unit * bits.length;
    let cursor = x + (width - totalW) / 2;
    ctx.save();
    ctx.fillStyle = "#17313b";
    for (let i = 0; i < bits.length; i += 1) {
      if (bits[i] === "1") ctx.fillRect(cursor, y, unit, height);
      cursor += unit;
    }
    ctx.restore();
  }

  function code39Bits(text) {
    const patterns = {
      "0": "101001101101",
      "1": "110100101011",
      "2": "101100101011",
      "3": "110110010101",
      "4": "101001101011",
      "5": "110100110101",
      "6": "101100110101",
      "7": "101001011011",
      "8": "110100101101",
      "9": "101100101101",
      A: "110101001011",
      B: "101101001011",
      C: "110110100101",
      D: "101011001011",
      E: "110101100101",
      F: "101101100101",
      G: "101010011011",
      H: "110101001101",
      I: "101101001101",
      J: "101011001101",
      K: "110101010011",
      L: "101101010011",
      M: "110110101001",
      N: "101011010011",
      O: "110101101001",
      P: "101101101001",
      Q: "101010110011",
      R: "110101011001",
      S: "101101011001",
      T: "101011011001",
      U: "110010101011",
      V: "100110101011",
      W: "110011010101",
      X: "100101101011",
      Y: "110010110101",
      Z: "100110110101",
      "-": "100101011011",
      ".": "110010101101",
      " ": "100110101101",
      "$": "100100100101",
      "/": "100100101001",
      "+": "100101001001",
      "%": "101001001001",
      "*": "100101101101",
    };
    return String(text).split("").map((char) => patterns[char] || patterns["-"]).join("0");
  }

  function drawPageFrame(ctx, paper, accent) {
    ctx.strokeStyle = accent;
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, paper.width - 80, paper.height - 80);
    ctx.strokeStyle = "rgba(23,49,59,0.16)";
    ctx.lineWidth = 2;
    ctx.strokeRect(58, 58, paper.width - 116, paper.height - 116);
  }

  function drawBusinessFrame(ctx, paper, accent) {
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, paper.width, paper.height);
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, paper.width, 18);
    ctx.strokeStyle = "rgba(23,49,59,0.18)";
    ctx.lineWidth = 2;
    ctx.strokeRect(44, 44, paper.width - 88, paper.height - 88);
    ctx.restore();
  }

  function drawBusinessBlock(ctx, label, value, x, y, width) {
    ctx.save();
    ctx.fillStyle = "#176b87";
    ctx.font = "700 21px Arial";
    ctx.textAlign = "left";
    ctx.fillText(label, x, y);
    drawWrappedText(ctx, sanitizePrintable(value), x, y + 38, width, 27, "#17313b", "22px Arial", 4);
    ctx.restore();
  }

  function drawTableHeader(ctx, x, y, width, labels, widths) {
    ctx.save();
    ctx.fillStyle = "#17313b";
    ctx.fillRect(x, y, width, 50);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 18px Arial";
    ctx.textAlign = "left";
    let cursor = x;
    labels.forEach((label, index) => {
      ctx.fillText(label, cursor + 12, y + 32);
      cursor += widths[index];
    });
    ctx.restore();
  }

  function drawInvoiceRow(ctx, x, y, widths, item, currency) {
    ctx.save();
    const rowW = widths.reduce((sum, width) => sum + width, 0);
    ctx.strokeStyle = "rgba(23,49,59,0.2)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, rowW, 58);
    ctx.fillStyle = "#17313b";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    drawTextFit(ctx, item.description || "Service", x + 12, y + 30, widths[0] - 24, 20, { align: "left", weight: "500", color: "#17313b" });
    ctx.textAlign = "right";
    ctx.fillText(String(item.qty || 1), x + widths[0] + widths[1] - 16, y + 36);
    ctx.fillText(formatMoney(item.rate || 0, currency), x + widths[0] + widths[1] + widths[2] - 16, y + 36);
    ctx.fillText(formatMoney(item.total || 0, currency), x + rowW - 16, y + 36);
    ctx.restore();
  }

  function drawReceiptLine(ctx, x, y, width, label, value) {
    ctx.save();
    ctx.fillStyle = "#5b6f78";
    ctx.font = "700 20px Arial";
    ctx.textAlign = "left";
    ctx.fillText(label, x, y);
    ctx.strokeStyle = "rgba(23,49,59,0.28)";
    ctx.lineWidth = 2;
    line(ctx, x, y + 50, x + width, y + 50);
    drawTextFit(ctx, value, x + 190, y + 28, width - 210, 24, { align: "left", weight: "500", color: "#17313b" });
    ctx.restore();
  }

  function drawSignatureLine(ctx, x, y, label) {
    ctx.save();
    ctx.strokeStyle = "rgba(23,49,59,0.42)";
    ctx.lineWidth = 2;
    line(ctx, x, y, x + 360, y);
    ctx.fillStyle = "#5b6f78";
    ctx.font = "18px Arial";
    ctx.textAlign = "left";
    ctx.fillText(label, x, y + 30);
    ctx.restore();
  }

  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  function parseMealRows(value) {
    const defaults = [
      ["Monday", "", "", ""],
      ["Tuesday", "", "", ""],
      ["Wednesday", "", "", ""],
      ["Thursday", "", "", ""],
      ["Friday", "", "", ""],
      ["Saturday", "", "", ""],
      ["Sunday", "", "", ""],
    ];
    const rows = splitList(value || "", "\n").map((lineText) => {
      const parts = lineText.split("|").map((part) => sanitizePrintable(part));
      return [parts[0] || "Day", parts[1] || "", parts[2] || "", parts[3] || ""];
    });
    return rows.length ? rows.concat(defaults).slice(0, 7) : defaults;
  }

  function drawMealRow(ctx, x, y, widths, row) {
    const rowW = widths.reduce((sum, width) => sum + width, 0);
    ctx.save();
    ctx.strokeStyle = "rgba(23,49,59,0.22)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, rowW, 74);
    let cursor = x;
    row.forEach((value, index) => {
      drawTextFit(ctx, value || "-", cursor + 12, y + 40, widths[index] - 24, index === 0 ? 20 : 18, { align: "left", weight: index === 0 ? "800" : "500", color: "#17313b" });
      cursor += widths[index];
      if (index < row.length - 1) {
        ctx.strokeStyle = "rgba(23,49,59,0.16)";
        line(ctx, cursor, y, cursor, y + 74);
      }
    });
    ctx.restore();
  }

  function drawListPanel(ctx, x, y, width, height, title, items) {
    ctx.save();
    ctx.fillStyle = "#edf7f6";
    roundRect(ctx, x, y, width, height, 8, true, false);
    ctx.strokeStyle = "rgba(23,49,59,0.2)";
    ctx.lineWidth = 1.5;
    roundRect(ctx, x, y, width, height, 8, false, true);
    ctx.fillStyle = "#17313b";
    ctx.font = "800 23px Arial";
    ctx.textAlign = "left";
    ctx.fillText(title, x + 22, y + 38);
    const list = items.length ? items : [""];
    let cursor = y + 78;
    list.slice(0, Math.floor((height - 85) / 34)).forEach((item) => {
      ctx.strokeStyle = "rgba(23,49,59,0.32)";
      ctx.lineWidth = 1.5;
      line(ctx, x + 22, cursor + 12, x + width - 22, cursor + 12);
      if (item) drawTextFit(ctx, item, x + 30, cursor + 4, width - 60, 18, { align: "left", weight: "500", color: "#17313b" });
      cursor += 34;
    });
    ctx.restore();
  }

  function drawResumeSection(ctx, title, content, x, y, width, maxLines, isExperience) {
    ctx.save();
    ctx.fillStyle = "#17313b";
    ctx.font = "800 22px Arial";
    ctx.textAlign = "left";
    ctx.fillText(title.toUpperCase(), x, y);
    ctx.strokeStyle = "rgba(23,49,59,0.25)";
    ctx.lineWidth = 1.5;
    line(ctx, x, y + 12, x + width, y + 12);
    ctx.restore();

    const lines = splitList(content || "", "\n");
    let cursor = y + 48;
    if (isExperience) {
      lines.slice(0, 4).forEach((lineText) => {
        const parts = lineText.split("|").map((part) => sanitizePrintable(part));
        const heading = [parts[0], parts[1]].filter(Boolean).join(" - ");
        if (heading) {
          drawTextFit(ctx, heading, x, cursor, width, 21, { align: "left", weight: "800", color: "#17313b" });
          cursor += 28;
        }
        const detail = parts.slice(2).join(" - ") || lineText;
        cursor = drawWrappedTextReturnY(ctx, detail, x + 18, cursor, width - 18, 25, "#5b6f78", "20px Arial", 2);
        cursor += 12;
      });
      return cursor;
    }

    const text = lines.length ? lines.join("; ") : sanitizePrintable(content || "");
    return drawWrappedTextReturnY(ctx, text, x, cursor, width, 25, "#5b6f78", "20px Arial", maxLines) + 8;
  }

  function drawWrappedTextReturnY(ctx, text, x, y, maxWidth, lineHeight, color, font, maxLines) {
    const lines = wrapText(ctx, text, maxWidth, font, maxLines);
    ctx.save();
    ctx.font = font || "24px Arial";
    ctx.fillStyle = color || "#17313b";
    ctx.textAlign = "left";
    lines.forEach((lineText, index) => ctx.fillText(lineText, x, y + index * lineHeight));
    ctx.restore();
    return y + lines.length * lineHeight;
  }

  function drawFooterNote(ctx, paper, note) {
    ctx.save();
    ctx.font = "17px Arial";
    ctx.fillStyle = "rgba(23,49,59,0.48)";
    ctx.textAlign = "center";
    ctx.fillText(note, paper.width / 2, paper.height - 26);
    ctx.restore();
  }

  function drawHandwritingGuides(ctx, x, y, width) {
    ctx.save();
    ctx.strokeStyle = "rgba(23,49,59,0.22)";
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    line(ctx, x, y, x + width, y);
    line(ctx, x, y + 70, x + width, y + 70);
    ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(23,49,59,0.45)";
    line(ctx, x, y + 140, x + width, y + 140);
    ctx.restore();
  }

  function drawPromptBox(ctx, x, y, width, label) {
    ctx.save();
    ctx.strokeStyle = "rgba(23,49,59,0.35)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.strokeRect(x, y, width, 145);
    ctx.setLineDash([]);
    ctx.fillStyle = "#5b6f78";
    ctx.font = "24px Arial";
    ctx.textAlign = "left";
    ctx.fillText(label, x + 18, y + 42);
    ctx.restore();
  }

  function drawDashedRect(ctx, x, y, width, height, color) {
    ctx.save();
    ctx.strokeStyle = color || "rgba(23,49,59,0.42)";
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 8]);
    ctx.strokeRect(x, y, width, height);
    ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(23,49,59,0.16)";
    ctx.strokeRect(x + 8, y + 8, width - 16, height - 16);
    ctx.restore();
  }

  function drawNoteLines(ctx, x, y, width, count) {
    ctx.save();
    ctx.strokeStyle = "rgba(23,49,59,0.22)";
    ctx.lineWidth = 1.5;
    for (let i = 0; i < count; i += 1) {
      line(ctx, x, y + i * 28, x + width, y + i * 28);
    }
    ctx.restore();
  }

  function parseCard(value) {
    const text = sanitizePrintable(value);
    if (!text) return ["", ""];
    const parts = text.split(/\s[-:]\s/);
    return [parts[0] || text, parts.slice(1).join(" - ")];
  }

  function languageNote(kind, text) {
    if (kind === "jyutping") return "Traditional Chinese + Jyutping mode is ready for short words and names.";
    if (kind === "pinyin") return "Chinese + Pinyin mode is ready for short words and names.";
    return "";
  }

  function drawCellText(ctx, text, x, y, w, h, weight, align) {
    ctx.save();
    ctx.font = `${weight || "400"} 24px Arial`;
    ctx.fillStyle = "#17313b";
    ctx.textAlign = align === "left" ? "left" : "center";
    ctx.textBaseline = "middle";
    const value = sanitizePrintable(text);
    if (align === "left") {
      drawWrappedText(ctx, value, x + 16, y + 32, w - 24, 25, "#17313b", `${weight || "400"} 22px Arial`, 2);
    } else {
      ctx.fillText(value, x + w / 2, y + h / 2);
    }
    ctx.restore();
  }

  function drawCheckBox(ctx, x, y, size) {
    ctx.save();
    ctx.strokeStyle = "#17313b";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, size, size);
    ctx.restore();
  }

  function drawRewardBox(ctx, x, y, size, accent, theme) {
    ctx.save();
    ctx.strokeStyle = "#17313b";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, size, size);
    ctx.fillStyle = "rgba(242,184,75,0.16)";
    if (theme === "garden") ctx.fillStyle = "rgba(90,147,103,0.14)";
    if (theme === "simple") ctx.fillStyle = "rgba(23,107,135,0.10)";
    ctx.fillRect(x + 3, y + 3, size - 6, size - 6);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    if (theme === "stars") drawStar(ctx, x + size / 2, y + size / 2 - 4, size * 0.25, size * 0.11);
    else if (theme === "garden") {
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2 - 5, size * 0.18, 0, Math.PI * 2);
      ctx.stroke();
      line(ctx, x + size / 2, y + size / 2 + size * 0.12, x + size / 2, y + size / 2 + size * 0.28);
    } else {
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2 - 4, size * 0.2, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawStar(ctx, cx, cy, outer, inner) {
    ctx.beginPath();
    for (let i = 0; i < 10; i += 1) {
      const radius = i % 2 === 0 ? outer : inner;
      const angle = -Math.PI / 2 + (i * Math.PI) / 5;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  function drawTextFit(ctx, text, x, y, maxWidth, size, options) {
    const opts = options || {};
    let fontSize = size;
    const value = sanitizePrintable(text);
    ctx.save();
    ctx.textAlign = opts.align || "left";
    ctx.textBaseline = "middle";
    do {
      ctx.font = `${opts.weight || "400"} ${fontSize}px Arial`;
      if (ctx.measureText(value).width <= maxWidth || fontSize <= 18) break;
      fontSize -= 2;
    } while (fontSize > 18);
    if (opts.stroke) {
      ctx.strokeStyle = "rgba(23,49,59,0.5)";
      ctx.strokeText(value, x, y);
    } else {
      ctx.fillStyle = opts.color || "#17313b";
      ctx.fillText(value, x, y);
    }
    ctx.restore();
  }

  function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, color, font, maxLines) {
    const lines = wrapText(ctx, text, maxWidth, font, maxLines);
    ctx.save();
    ctx.font = font || "24px Arial";
    ctx.fillStyle = color || "#17313b";
    ctx.textAlign = "left";
    lines.forEach((lineText, index) => ctx.fillText(lineText, x, y + index * lineHeight));
    ctx.restore();
  }

  function wrapText(ctx, text, maxWidth, font, maxLines) {
    ctx.save();
    ctx.font = font || "24px Arial";
    const words = sanitizePrintable(text).split(/\s+/).filter(Boolean);
    let lineText = "";
    const lines = [];
    for (let i = 0; i < words.length; i += 1) {
      const test = lineText ? `${lineText} ${words[i]}` : words[i];
      if (ctx.measureText(test).width > maxWidth && lineText) {
        lines.push(lineText);
        lineText = words[i];
        if (maxLines && lines.length >= maxLines) break;
      } else {
        lineText = test;
      }
    }
    if (lineText && (!maxLines || lines.length < maxLines)) lines.push(lineText);
    ctx.restore();
    return lines.length ? lines : [""];
  }

  function parseMoneyItems(value) {
    return splitList(value || "", "\n").map((lineText) => {
      const parts = lineText.split("|").map((part) => sanitizePrintable(part));
      const description = parts[0] || "Service";
      const qty = Math.max(0, Number((parts[1] || "1").replace(/[^0-9.]/g, "")) || 1);
      const rate = parseAmount(parts[2]);
      return { description, qty, rate, total: qty * rate };
    });
  }

  function parseAmount(value) {
    return Number(String(value || "0").replace(/[^0-9.-]/g, "")) || 0;
  }

  function currencySymbol(currency) {
    if (currency === "EUR") return "EUR ";
    if (currency === "GBP") return "GBP ";
    if (currency === "CAD") return "CAD ";
    if (currency === "AUD") return "AUD ";
    return "$";
  }

  function formatMoney(value, symbol) {
    return `${symbol}${Number(value || 0).toFixed(2)}`;
  }

  function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    const r = Math.min(radius || 8, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  function line(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function sanitizePrintable(value) {
    return String(value || "").replace(/[<>]/g, "").trim();
  }

  function splitList(value, separator) {
    return String(value || "")
      .split(separator)
      .map((item) => sanitizePrintable(item))
      .filter(Boolean);
  }

  function canvasToPdf(canvas) {
    return canvasesToPdf([canvas]);
  }

  function canvasesToPdf(canvases, options = {}) {
    const pages = Array.isArray(canvases) && canvases.length ? canvases : [];
    const quality = Math.max(0.35, Math.min(0.96, Number(options.quality) || 0.92));
    const objects = [];
    objects.push("<< /Type /Catalog /Pages 2 0 R >>");
    const pageObjectIds = pages.map((_, index) => 3 + index * 3);
    objects.push(`<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pages.length} >>`);
    pages.forEach((canvas, index) => {
      const pageObjectId = pageObjectIds[index];
      const imageObjectId = pageObjectId + 1;
      const contentObjectId = pageObjectId + 2;
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      const imageBytes = base64ToBinary(dataUrl.split(",")[1]);
      const widthPt = canvas.width * 0.48;
      const heightPt = canvas.height * 0.48;
      const imageName = `Im${index}`;
      objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${fmt(widthPt)} ${fmt(heightPt)}] /Resources << /XObject << /${imageName} ${imageObjectId} 0 R >> >> /Contents ${contentObjectId} 0 R >>`);
      objects.push(`<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n${imageBytes}\nendstream`);
      const content = `q\n${fmt(widthPt)} 0 0 ${fmt(heightPt)} 0 0 cm\n/${imageName} Do\nQ`;
      objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
    });
    let pdf = "%PDF-1.4\n";
    const offsets = [0];
    objects.forEach((object, index) => {
      offsets.push(pdf.length);
      pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });
    const xref = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i < offsets.length; i += 1) {
      pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
    }
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
    return new Blob([binaryStringToUint8(pdf)], { type: "application/pdf" });
  }

  function base64ToBinary(base64) {
    return atob(base64);
  }

  function binaryStringToUint8(str) {
    const bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i += 1) bytes[i] = str.charCodeAt(i) & 255;
    return bytes;
  }

  function fmt(value) {
    return Number(value).toFixed(2).replace(/\.00$/, "");
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function absoluteUrl(path) {
    const base = String(CONFIG.siteUrl || window.location.origin).replace(/\/+$/, "");
    const suffix = String(path || "/").startsWith("/") ? path : `/${path}`;
    return `${base}${suffix}`;
  }

  function getDailyKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function getDailyCount() {
    const data = JSON.parse(localStorage.getItem("ptl_daily") || "{}");
    return data.date === getDailyKey() ? Number(data.count || 0) : 0;
  }

  function incrementDailyCount() {
    const count = getDailyCount() + 1;
    localStorage.setItem("ptl_daily", JSON.stringify({ date: getDailyKey(), count }));
  }

  function track(name, data) {
    const source = getTrafficSource();
    const details = Object.assign({}, data || {}, { source });
    const events = getEvents();
    events.push({
      time: new Date().toISOString(),
      name,
      data: details,
    });
    localStorage.setItem("ptl_events", JSON.stringify(events.slice(-1000)));
    if (window.gtag && CONFIG.enableAnalytics) {
      window.gtag("event", name, details);
    }
    sendRemoteEvent(name, details);
  }

  function sendRemoteEvent(name, data) {
    if (!navigator.sendBeacon && !window.fetch) return;
    const payload = JSON.stringify({
      name,
      tool: data.tool || "site",
      path: getCurrentRoutePath(),
      source: data.source || getTrafficSource(),
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/event", new Blob([payload], { type: "application/json" }));
      return;
    }
    fetch("/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }

  async function loadRemoteMetrics() {
    const target = document.getElementById("remoteMetrics");
    if (!target) return;
    try {
      const response = await fetch("/api/metrics", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error("Metrics unavailable");
      const depthSignal = (row) => (row.free_tool_depth || 0) + (row.guide_depth || 0) + (row.seller_sample_download || 0) + (row.seller_checkout_intent || 0) + (row.seller_checkout_click || 0) + (row.service_checkout_click || 0) + (row.service_request_intent || 0) + (row.audit_request_intent || 0) + (row.sponsor_request_intent || 0) + (row.sponsor_lead_submit || 0);
      const rows = (data.tools || []).slice().sort((a, b) => {
        const bScore = ((b.download_pdf || 0) + (b.download_file || 0)) * 3 + depthSignal(b) * 4 + (b.generate_pdf || 0) + (b.generate_file || 0);
        const aScore = ((a.download_pdf || 0) + (a.download_file || 0)) * 3 + depthSignal(a) * 4 + (a.generate_pdf || 0) + (a.generate_file || 0);
        return bScore - aScore || String(a.tool).localeCompare(String(b.tool));
      });
      const sourceRows = (data.sources || []).slice().sort((a, b) => {
        const bScore = ((b.download_pdf || 0) + (b.download_file || 0)) * 3 + depthSignal(b) * 4 + (b.generate_pdf || 0) + (b.generate_file || 0) + (b.page_view || 0);
        const aScore = ((a.download_pdf || 0) + (a.download_file || 0)) * 3 + depthSignal(a) * 4 + (a.generate_pdf || 0) + (a.generate_file || 0) + (a.page_view || 0);
        return bScore - aScore || String(a.source).localeCompare(String(b.source));
      });
      const activeSourceRows = sourceRows.filter((row) => (row.page_view || 0) || (row.generate_pdf || 0) || (row.download_pdf || 0) || (row.generate_file || 0) || (row.download_file || 0) || depthSignal(row));
      const activeRows = rows.filter((row) => (row.download_pdf || 0) || (row.generate_pdf || 0) || (row.download_file || 0) || (row.generate_file || 0) || (row.limit_hit || 0) || depthSignal(row));
      const displayRows = activeRows.length ? activeRows : rows;
      const totalGenerations = (data.totals.generate_pdf || 0) + (data.totals.generate_file || 0);
      const totalDownloads = (data.totals.download_pdf || 0) + (data.totals.download_file || 0);
      const depthIntent = depthSignal(data.totals || {});
      const sponsorLeads = data.sponsorLeads || data.totals.sponsor_lead_submit || 0;
      const dataQualityNotice = data.dataQuality && data.dataQuality !== "rollup"
        ? `<p class="notice">Live metrics are temporarily using the last verified baseline while KV reads are limited.</p>`
        : "";
      target.innerHTML = `
        ${dataQualityNotice}
        <div class="metric-grid compact">
          <div class="metric-tile"><strong>${data.totals.page_view || 0}</strong><span>live page views</span></div>
          <div class="metric-tile"><strong>${totalGenerations}</strong><span>live generations</span></div>
          <div class="metric-tile"><strong>${totalDownloads}</strong><span>live downloads</span></div>
          <div class="metric-tile"><strong>${depthIntent}</strong><span>depth signals</span></div>
          <div class="metric-tile"><strong>${sponsorLeads}</strong><span>sponsor leads</span></div>
        </div>
        <p class="help">Rows are sorted by downloads, free-tool depth, and generation signal so the next monetization decision starts from actual usage.</p>
        <div class="preview-stage">
          <table class="event-table">
            <thead><tr><th>Source</th><th>Views</th><th>Generations</th><th>Downloads</th><th>Depth</th></tr></thead>
            <tbody>${(activeSourceRows.length ? activeSourceRows : sourceRows).map((row) => `<tr><td>${escapeHtml(row.source)}</td><td>${row.page_view || 0}</td><td>${(row.generate_pdf || 0) + (row.generate_file || 0)}</td><td>${(row.download_pdf || 0) + (row.download_file || 0)}</td><td>${depthSignal(row)}</td></tr>`).join("")}</tbody>
          </table>
        </div>
        <div class="preview-stage">
          <table class="event-table">
            <thead><tr><th>Tool</th><th>Downloads</th><th>Depth</th><th>Generations</th><th>Limit hits</th></tr></thead>
            <tbody>${displayRows.map((row) => `<tr><td>${escapeHtml(row.tool)}</td><td>${(row.download_pdf || 0) + (row.download_file || 0)}</td><td>${depthSignal(row)}</td><td>${(row.generate_pdf || 0) + (row.generate_file || 0)}</td><td>${row.limit_hit || 0}</td></tr>`).join("")}</tbody>
          </table>
        </div>
      `;
    } catch (error) {
      target.innerHTML = `<p class="help">Live metrics are not available yet. Local browser metrics still work.</p>`;
    }
  }

  function getTrafficSource() {
    const params = new URLSearchParams(window.location.search || "");
    const taggedSource = normalizeTrafficSource(params.get("utm_source") || params.get("ref"));
    if (taggedSource) {
      saveSessionSource(taggedSource);
      return taggedSource;
    }
    const storedSource = normalizeTrafficSource(getSessionSource());
    if (storedSource) return storedSource;
    const inferredSource = inferTrafficSourceFromReferrer(document.referrer);
    saveSessionSource(inferredSource);
    return inferredSource;
  }

  function getSponsorAttribution() {
    const params = new URLSearchParams(window.location.search || "");
    const parts = getCurrentRoutePath().split("?")[0].split("/").filter(Boolean);
    const clean = (value, max = 64) => String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, max);
    return {
      utmSource: clean(params.get("utm_source")),
      utmMedium: clean(params.get("utm_medium")),
      utmCampaign: clean(params.get("utm_campaign")),
      utmContent: clean(params.get("utm_content")) || clean(params.get("prospect")),
      vertical: clean(params.get("vertical")) || (parts[0] === "sponsor" && parts[1] ? clean(parts[1]) : ""),
    };
  }

  function renderInvoiceFollowupEmailOutput(values) {
    const panel = document.getElementById("toolOutputPanel");
    if (!panel) return;
    const message = invoiceFollowupEmailText(values);
    panel.hidden = false;
    panel.innerHTML = `
      <strong>Copy-ready email</strong>
      <p class="help">Review tone, dates, payment wording, and local rules before sending.</p>
      <pre>${escapeHtml(message)}</pre>
      <div class="actions">
        <button class="button secondary" type="button" data-copy-text="${escapeHtml(message)}" data-track-event="free_tool_depth" data-track-tool="invoice-followup-email">Copy email</button>
        <a class="button" data-track-event="service_request_intent" data-track-tool="invoice-followup-copy-pack" href="/invoice-followup-copy-pack/?utm_source=tool_output&utm_medium=site&utm_campaign=invoice_followup_service&utm_content=invoice-followup-email#service-request">Get the $19 full sequence</a>
      </div>
      <div class="tool-output-service-lead">
        <strong>Want the full $19 sequence?</strong>
        <p class="help">Send a 30-second free fit check from this generated draft. No payment is collected here.</p>
        ${renderInvoiceFollowupOutputServiceLeadForm(values, message)}
      </div>
    `;
  }

  function initSponsorLeadForms(root = document) {
    root.querySelectorAll("[data-sponsor-deal-select]").forEach((link) => {
      if (link.dataset.boundSponsorDeal === "true") return;
      link.dataset.boundSponsorDeal = "true";
      link.addEventListener("click", () => {
        saveSponsorDealPrefill(link.dataset);
      });
    });
    root.querySelectorAll("[data-sponsor-lead-form]").forEach((form) => {
      if (form.dataset.boundSponsorLead === "true") return;
      form.dataset.boundSponsorLead = "true";
      applySponsorDealPrefill(form, sponsorDealPrefillFromUrl() || loadSponsorDealPrefill());
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        await submitSponsorLeadForm(form);
      });
    });
    root.querySelectorAll("[data-sponsor-quick-form]").forEach((form) => {
      if (form.dataset.boundSponsorQuickLead === "true") return;
      form.dataset.boundSponsorQuickLead = "true";
      applySponsorDealPrefill(form, sponsorDealPrefillFromUrl() || loadSponsorDealPrefill() || sponsorDealPrefillFromDeal(sponsorDeals.find((deal) => deal.id === DEFAULT_SPONSOR_DEAL_ID) || sponsorDeals[0]));
      initSponsorQuickDealPicker(form);
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        await submitSponsorQuickLeadForm(form);
      });
    });
  }

  function initServiceLeadForms(root = document) {
    root.querySelectorAll("[data-service-lead-form]").forEach((form) => {
      if (form.dataset.boundServiceLead === "true") return;
      form.dataset.boundServiceLead = "true";
      updateServiceLeadFallbackLink(form);
      form.addEventListener("input", () => updateServiceLeadFallbackLink(form));
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        await submitServiceLeadForm(form);
      });
    });
  }

  function clearServiceLeadFallback(form) {
    const fallback = form.querySelector("[data-service-lead-fallback]");
    if (fallback) fallback.remove();
  }

  function clearServiceLeadSuccess(form) {
    const success = form.querySelector("[data-service-lead-success]");
    if (success) success.remove();
  }

  function serviceLeadPayload(form) {
    const values = getFormValues(form);
    const params = new URLSearchParams(window.location.search || "");
    const fieldOrDataOrParam = (field, data, param) => values[field] || form.dataset[data] || params.get(param) || "";
    return {
      ...values,
      serviceType: values.serviceType || form.dataset.serviceType || "custom-local-print-pack",
      consent: Boolean(form.querySelector("input[name='consent']")?.checked),
      path: values.path || form.dataset.leadPath || getCurrentRoutePath(),
      source: getTrafficSource(),
      utmSource: fieldOrDataOrParam("utmSource", "utmSource", "utm_source"),
      utmMedium: fieldOrDataOrParam("utmMedium", "utmMedium", "utm_medium"),
      utmCampaign: fieldOrDataOrParam("utmCampaign", "utmCampaign", "utm_campaign"),
      utmContent: fieldOrDataOrParam("utmContent", "utmContent", "utm_content"),
    };
  }

  function updateServiceLeadFallbackLink(form) {
    const link = form.querySelector("[data-service-lead-fallback-link]");
    if (!link) return;
    const values = serviceLeadPayload(form);
    const fallbackUrl = serviceLeadFallbackUrl(values);
    link.href = fallbackUrl;
    form.dataset.serviceFallbackUrl = fallbackUrl;
  }

  function renderServiceLeadSuccess(form, values, response = {}) {
    const serviceType = values.serviceType || form.dataset.serviceType || "custom-local-print-pack";
    const copy = serviceLeadFallbackText(values);
    const paymentReply = serviceLeadPaymentReplyCopy(values);
    let panel = form.querySelector("[data-service-lead-success]");
    if (!panel) {
      panel = document.createElement("div");
      panel.className = "notice service-lead-success";
      panel.dataset.serviceLeadSuccess = "true";
      const status = form.querySelector("[data-service-lead-status]");
      if (status && status.parentNode) status.parentNode.insertBefore(panel, status.nextSibling);
      else form.appendChild(panel);
    }
    panel.innerHTML = `
      <p><strong>Request received.</strong> Your request ID is ${escapeHtml(response.id || "pending-review")}. Fit is reviewed manually; payment still counts only after a real external checkout, invoice, or platform balance proves it.</p>
      <textarea class="request-copy-output service-lead-success-output" readonly>${escapeHtml(copy)}</textarea>
      <p><strong>Payment reply ready.</strong> Use this only after fit is confirmed; it keeps payment on an external provider and keeps private data out of this site.</p>
      <textarea class="request-copy-output service-lead-payment-output" readonly>${escapeHtml(paymentReply)}</textarea>
      <div class="actions">
        <button class="button" type="button" data-copy-text="${escapeHtml(copy)}">Copy request summary</button>
        <button class="button secondary" type="button" data-copy-text="${escapeHtml(paymentReply)}">Copy payment reply</button>
        <a class="button ghost" data-track-event="${escapeHtml(serviceLeadTrackEvent(serviceType))}" data-track-tool="${escapeHtml(serviceLeadTrackTool(serviceType))}" href="${escapeHtml(serviceLeadFallbackUrl(values))}" target="_blank" rel="noreferrer">Open GitHub backup</a>
      </div>
    `;
  }

  function renderServiceLeadFallback(form, values, publicReplyUrl = "") {
    const serviceType = values.serviceType || form.dataset.serviceType || "custom-local-print-pack";
    const text = typeof values === "string" ? values : serviceLeadFallbackText(values);
    if (!text.trim()) return;
    let panel = form.querySelector("[data-service-lead-fallback]");
    if (!panel) {
      panel = document.createElement("div");
      panel.className = "notice service-lead-fallback";
      panel.dataset.serviceLeadFallback = "true";
      const status = form.querySelector("[data-service-lead-status]");
      if (status && status.parentNode) status.parentNode.insertBefore(panel, status.nextSibling);
      else form.appendChild(panel);
    }
    const replyUrl = publicReplyUrl || (typeof values === "string" ? "" : serviceLeadFallbackUrl(values));
    panel.innerHTML = `
      <p><strong>Backup request ready.</strong> Lead storage is temporarily limited, so open the public-safe GitHub request or copy this text before leaving the page.</p>
      <textarea class="request-copy-output service-lead-fallback-output" readonly>${escapeHtml(text)}</textarea>
      <div class="actions">
        ${replyUrl ? `<a class="button" data-track-event="${escapeHtml(serviceLeadTrackEvent(serviceType))}" data-track-tool="${escapeHtml(serviceLeadTrackTool(serviceType))}" href="${escapeHtml(replyUrl)}" target="_blank" rel="noreferrer">Open GitHub backup</a>` : ""}
        <button class="button" type="button" data-copy-text="${escapeHtml(text)}">Copy backup request</button>
      </div>
    `;
  }

  async function submitServiceLeadForm(form) {
    const status = form.querySelector("[data-service-lead-status]");
    const submit = form.querySelector("button[type='submit']");
    const setStatus = (message, kind = "") => {
      if (!status) return;
      status.textContent = message;
      status.dataset.status = kind;
    };
    const values = serviceLeadPayload(form);
    setStatus("Sending request...", "pending");
    clearServiceLeadFallback(form);
    clearServiceLeadSuccess(form);
    updateServiceLeadFallbackLink(form);
    if (submit) submit.disabled = true;
    try {
      const response = await fetch("/api/service-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) {
        if (data.fallbackRequired) {
          renderServiceLeadFallback(form, data.fallbackBody || values, data.fallbackPublicReplyUrl || "");
          setStatus(data.error || "Lead storage is temporarily limited. Copy the backup request below.", "error");
          return;
        }
        const apiError = new Error(data.error || "Could not send request.");
        apiError.skipFallback = Boolean(data.error);
        throw apiError;
      }
      track(serviceLeadTrackEvent(values.serviceType), { tool: serviceLeadTrackTool(values.serviceType) });
      setStatus("Request received. Fit will be reviewed manually before any external checkout or invoice is sent.", "success");
      clearServiceLeadFallback(form);
      renderServiceLeadSuccess(form, values, data);
      form.reset();
      updateServiceLeadFallbackLink(form);
    } catch (error) {
      if (!error.skipFallback) renderServiceLeadFallback(form, values);
      setStatus(error.message || "Could not send request. Please use the GitHub backup or copy the backup request.", "error");
    } finally {
      if (submit) submit.disabled = false;
    }
  }

  function sponsorDealPrefillFromUrl() {
    const params = new URLSearchParams(window.location.search || "");
    const dealId = String(params.get("deal") || params.get("deal_id") || params.get("sponsor_deal") || params.get("utm_content") || "").trim();
    if (!dealId) return null;
    const deal = sponsorDeals.find((item) => item.id === dealId);
    if (!deal) return null;
    return {
      ...sponsorDealPrefillFromDeal(deal),
      sponsorCommitment: sponsorCommitmentFromParams(params) || sponsorDealCommitment(deal),
    };
  }

  function sponsorDealPrefillFromDeal(deal) {
    return {
      sponsorDealId: deal.id,
      sponsorPlacement: deal.placement,
      sponsorBudgetRange: deal.budgetRange,
      sponsorTimeline: deal.timeline,
      sponsorCommitment: sponsorDealCommitment(deal),
      sponsorNotes: `${deal.title} (${deal.price}): ${deal.deliverable} Needed: ${deal.proofNeeded}`,
    };
  }

  function sponsorCommitmentFromParams(params) {
    const value = String(params.get("commitment") || params.get("next_step") || params.get("intent") || "").trim();
    return ["question-only", "request-invoice", "ready-this-month"].includes(value) ? value : "";
  }

  function saveSponsorDealPrefill(dataset) {
    const prefill = {
      sponsorDealId: dataset.sponsorDealId || "",
      sponsorPlacement: dataset.sponsorPlacement || "",
      sponsorBudgetRange: dataset.sponsorBudgetRange || "",
      sponsorTimeline: dataset.sponsorTimeline || "",
      sponsorCommitment: dataset.sponsorCommitment || "",
      sponsorNotes: dataset.sponsorNotes || "",
    };
    try {
      sessionStorage.setItem("ptl_sponsor_deal_prefill", JSON.stringify(prefill));
    } catch (error) {
      // Session storage can be unavailable in strict privacy modes; URL prefill still works.
    }
  }

  function loadSponsorDealPrefill() {
    try {
      return JSON.parse(sessionStorage.getItem("ptl_sponsor_deal_prefill") || "null");
    } catch (error) {
      return null;
    }
  }

  function applySponsorDealPrefill(form, prefill) {
    if (!form || !prefill || !prefill.sponsorDealId) return;
    setFormFieldValue(form, "dealId", prefill.sponsorDealId);
    setFormFieldValue(form, "quickDealId", prefill.sponsorDealId);
    setFormFieldValue(form, "placement", prefill.sponsorPlacement);
    setFormFieldValue(form, "budgetRange", prefill.sponsorBudgetRange);
    setFormFieldValue(form, "timeline", prefill.sponsorTimeline);
    setFormFieldValue(form, "commitment", prefill.sponsorCommitment);
    const notes = form.elements.notes;
    if (notes && !String(notes.value || "").trim()) notes.value = prefill.sponsorNotes || "";
    const status = form.querySelector("[data-sponsor-deal-status]");
    if (status) status.textContent = `Selected sponsor path: ${prefill.sponsorDealId}. Placement, budget, timeline, and next step are prefilled.`;
    updateSponsorQuickSummary(form);
  }

  function applySponsorProspectPrefill(form, prospect, deal, vertical) {
    if (!form || !prospect) return;
    form.dataset.sponsorProspectId = prospect.id || "";
    form.dataset.sponsorProspectName = prospect.name || "";
    form.dataset.sponsorProspectWebsite = prospect.website || "";
    form.dataset.sponsorProspectFit = prospect.fitReason || "";
    form.dataset.sponsorProspectValidation = prospect.validationSignal || "";
    form.dataset.sponsorProspectVertical = vertical?.slug || prospect.vertical || "";
    form.dataset.sponsorProspectDeal = deal?.id || prospect.dealId || "";
    setFormFieldValue(form, "company", prospect.name);
    setFormFieldValue(form, "website", prospect.website);
    setFormFieldValue(form, "dealId", deal?.id || prospect.dealId);
    setFormFieldValue(form, "quickDealId", deal?.id || prospect.dealId);
    setFormFieldValue(form, "audienceFit", sponsorProspectAudienceFit(prospect, deal, vertical));
    const notes = form.elements.notes;
    if (notes && !String(notes.value || "").trim()) notes.value = sponsorProspectReviewNotes(prospect, deal, vertical);
    const quickSummary = form.querySelector("[data-sponsor-quick-summary]");
    if (quickSummary && prospect.name && prospect.website) {
      quickSummary.textContent = `Selected pilot: ${deal.title} - ${deal.price}. ${prospect.name} and ${prospect.website} are prefilled; add a business email to request invoice review.`;
    }
  }

  function applySponsorPublicInvoiceLinks(root, publicReplyUrl) {
    if (!root || !publicReplyUrl) return;
    root.querySelectorAll("[data-sponsor-public-invoice-request]").forEach((link) => {
      link.href = publicReplyUrl;
    });
  }

  function sponsorProspectAudienceFit(prospect, deal, vertical) {
    return [
      `Prospect-specific invoice review request for ${prospect.name || "this sponsor"}.`,
      prospect.fitReason || deal?.bestFor || "",
      vertical?.title ? `Audience: ${vertical.title}.` : "",
      prospect.validationSignal || "",
    ].filter(Boolean).join(" ");
  }

  function sponsorProspectReviewNotes(prospect, deal, vertical) {
    return [
      deal ? `${deal.title} (${deal.price}). ${deal.deliverable} Needed: ${deal.proofNeeded}` : "",
      prospect.website ? `Prefilled prospect website: ${prospect.website}` : "",
      vertical?.title ? `Vertical: ${vertical.title}` : "",
      prospect.validationSignal ? `Validation: ${prospect.validationSignal}` : "",
    ].filter(Boolean).join("\n");
  }

  function sponsorProspectQuickNotes(form, deal) {
    const existing = String(form.elements.notes?.value || "").trim();
    const rows = [
      existing || `${deal.title} (${deal.price}). ${deal.deliverable} Needed: ${deal.proofNeeded}`,
      form.dataset.sponsorProspectName ? `Prospect: ${form.dataset.sponsorProspectName}` : "",
      form.dataset.sponsorProspectWebsite ? `Website: ${form.dataset.sponsorProspectWebsite}` : "",
      form.dataset.sponsorProspectValidation ? `Validation: ${form.dataset.sponsorProspectValidation}` : "",
    ];
    return rows.filter(Boolean).join("\n");
  }

  function setFormFieldValue(form, name, value) {
    const field = form.elements[name];
    if (!field || value === undefined || value === null || value === "") return;
    field.value = value;
  }

  function initSponsorQuickDealPicker(form) {
    const picker = form.querySelector("[data-sponsor-quick-deal]");
    if (!picker) return;
    picker.addEventListener("change", () => {
      const deal = sponsorDeals.find((item) => item.id === picker.value);
      if (deal) applySponsorDealPrefill(form, sponsorDealPrefillFromDeal(deal));
    });
    if (!picker.value) picker.value = form.elements.dealId?.value || DEFAULT_SPONSOR_DEAL_ID;
    const selectedDeal = sponsorDeals.find((item) => item.id === picker.value);
    if (selectedDeal) applySponsorDealPrefill(form, sponsorDealPrefillFromDeal(selectedDeal));
    updateSponsorQuickSummary(form);
  }

  function updateSponsorQuickSummary(form) {
    const summary = form.querySelector("[data-sponsor-quick-summary]");
    const dealId = form.elements.quickDealId?.value || form.elements.dealId?.value || "";
    const deal = sponsorDeals.find((item) => item.id === dealId);
    if (!summary || !deal) return;
    summary.textContent = `Selected pilot: ${deal.title} - ${deal.price}. ${deal.deliverable} No payment is collected here.`;
  }

  function clearSponsorLeadFallback(form) {
    const fallback = form.querySelector("[data-sponsor-lead-fallback]");
    if (fallback) fallback.remove();
  }

  function clearSponsorLeadSuccess(form) {
    const success = form.querySelector("[data-sponsor-lead-success]");
    if (success) success.remove();
  }

  function renderSponsorLeadSuccess(form, values, response = {}) {
    const deal = sponsorDeals.find((item) => item.id === values.dealId) || sponsorDeals.find((item) => item.id === values.quickDealId) || sponsorDeals.find((item) => item.id === DEFAULT_SPONSOR_DEAL_ID) || sponsorDeals[0];
    const vertical = sponsorVerticals.find((item) => item.slug === values.vertical) || sponsorVerticals.find((item) => item.campaign === values.utmCampaign) || sponsorVerticals[0];
    const dealPath = sponsorProspectDealUrl({ id: values.utmContent || values.dealId || "direct-sponsor" }, deal, vertical);
    const invoiceText = sponsorInvoiceRequestCopy(
      {
        id: values.utmContent || values.dealId || "direct-sponsor",
        name: values.company || "Sponsor team",
        website: values.website || "",
        vertical: vertical.slug,
        category: "Sponsor inquiry",
        fitReason: values.audienceFit || deal.bestFor,
      },
      deal,
      vertical,
      values.path || dealPath,
    );
    const replyUrl = response.fallbackPublicReplyUrl || sponsorLeadPublicReplyUrl(values);
    let panel = form.querySelector("[data-sponsor-lead-success]");
    if (!panel) {
      panel = document.createElement("div");
      panel.className = "notice sponsor-lead-success";
      panel.dataset.sponsorLeadSuccess = "true";
      const status = form.querySelector("[data-sponsor-lead-status]");
      if (status && status.parentNode) status.parentNode.insertBefore(panel, status.nextSibling);
      else form.appendChild(panel);
    }
    panel.innerHTML = `
      <p><strong>Next step ready.</strong> Your inquiry ID is ${escapeHtml(response.id || "pending-review")}. Copy the invoice/agreement request below if you want the fastest manual follow-up.</p>
      <textarea class="request-copy-output sponsor-lead-success-output" readonly>${escapeHtml(invoiceText)}</textarea>
      <div class="actions">
        <button class="button" type="button" data-copy-text="${escapeHtml(invoiceText)}">Copy invoice/agreement request</button>
        <a class="button secondary" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(dealPath)}">Review deal path</a>
        <a class="button ghost" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(replyUrl)}" target="_blank" rel="noreferrer">Open public-safe reply</a>
      </div>
    `;
  }

  function renderSponsorLeadFallback(form, values, subject = "PrintableTools Lab sponsor inquiry", publicReplyUrl = "") {
    const text = typeof values === "string" ? values : sponsorLeadFallbackText(values);
    if (!text.trim()) return;
    let panel = form.querySelector("[data-sponsor-lead-fallback]");
    if (!panel) {
      panel = document.createElement("div");
      panel.className = "notice sponsor-lead-fallback";
      panel.dataset.sponsorLeadFallback = "true";
      const status = form.querySelector("[data-sponsor-lead-status]");
      if (status && status.parentNode) status.parentNode.insertBefore(panel, status.nextSibling);
      else form.appendChild(panel);
    }
    const replyUrl = publicReplyUrl || (typeof values === "string" ? "" : sponsorLeadPublicReplyUrl(values));
    panel.innerHTML = `
      <p><strong>Backup request ready.</strong> Lead storage is temporarily limited, so open the public-safe reply form or copy this request before leaving the page.</p>
      <textarea class="request-copy-output sponsor-lead-fallback-output" readonly>${escapeHtml(text)}</textarea>
      <div class="actions">
        ${replyUrl ? `<a class="button" data-track-event="sponsor_request_intent" data-track-tool="sponsor" href="${escapeHtml(replyUrl)}" target="_blank" rel="noreferrer">Open public-safe reply</a>` : ""}
        <button class="button" type="button" data-copy-text="${escapeHtml(text)}">Copy backup request</button>
      </div>
    `;
  }

  function sponsorLeadFallbackText(values) {
    return [
      "Hi PrintableTools Lab team,",
      "",
      "Please review this sponsor inquiry manually because the website lead store was temporarily limited.",
      "",
      `Company / project: ${values.company || ""}`,
      `Business email: ${values.contactEmail || ""}`,
      `Website: ${values.website || ""}`,
      `Placement interest: ${values.placement || ""}`,
      `Budget range: ${values.budgetRange || ""}`,
      `Timeline: ${values.timeline || ""}`,
      `Next step: ${values.commitment || ""}`,
      `Deal ID: ${values.dealId || ""}`,
      `Page path: ${values.path || ""}`,
      `Source: ${values.source || ""}`,
      `Campaign: ${values.utmCampaign || ""}`,
      `Content: ${values.utmContent || ""}`,
      `Vertical: ${values.vertical || ""}`,
      "",
      "Audience fit:",
      values.audienceFit || "",
      "",
      "Notes:",
      values.notes || "",
      "",
      "I will keep payment, tax, bank, phone, private identity, password, and customer-file details outside the website form.",
    ].join("\n");
  }

  function sponsorLeadPublicReplyUrl(values) {
    const deal = sponsorDeals.find((item) => item.id === values.dealId) || sponsorDeals.find((item) => item.id === values.quickDealId) || sponsorDeals.find((item) => item.id === DEFAULT_SPONSOR_DEAL_ID) || sponsorDeals[0];
    const vertical = sponsorVerticals.find((item) => item.slug === values.vertical) || sponsorVerticals.find((item) => item.campaign === values.utmCampaign) || sponsorVerticals[0];
    const proposalPath = values.path || deal?.trackedUrl || "/sponsor-deal-room/";
    return sponsorPublicReplyUrl(
      {
        name: values.company || "Sponsor pilot review",
        website: values.website || "",
      },
      deal || {},
      vertical || {},
      proposalPath,
    );
  }

  async function submitSponsorLeadForm(form) {
    const status = form.querySelector("[data-sponsor-lead-status]");
    const submit = form.querySelector("button[type='submit']");
    const setStatus = (message, kind = "") => {
      if (!status) return;
      status.textContent = message;
      status.dataset.status = kind;
    };
    const values = getFormValues(form);
    values.consent = Boolean(form.querySelector("input[name='consent']")?.checked);
    values.path = getCurrentRoutePath();
    values.source = getTrafficSource();
    Object.assign(values, getSponsorAttribution());
    setStatus("Sending sponsor inquiry...", "pending");
    clearSponsorLeadFallback(form);
    clearSponsorLeadSuccess(form);
    if (submit) submit.disabled = true;
    try {
      const response = await fetch("/api/sponsor-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) {
        if (data.fallbackRequired) {
          renderSponsorLeadFallback(form, data.fallbackBody || values, data.fallbackSubject || "PrintableTools Lab sponsor inquiry", data.fallbackPublicReplyUrl || "");
          setStatus(data.error || "Lead storage is temporarily limited. Copy the backup request below.", "error");
          return;
        }
        const apiError = new Error(data.error || "Could not send inquiry.");
        apiError.skipFallback = Boolean(data.error);
        throw apiError;
      }
      track("sponsor_request_intent", { tool: "sponsor" });
      if (values.commitment === "request-invoice" || values.commitment === "ready-this-month") {
        setStatus("Invoice request received. Sponsorship fit will be reviewed manually before any external invoice or agreement is sent.", "success");
      } else {
        setStatus("Inquiry received. Sponsorship fit will be reviewed manually before any placement is discussed.", "success");
      }
      clearSponsorLeadFallback(form);
      renderSponsorLeadSuccess(form, values, data);
      form.reset();
    } catch (error) {
      if (!error.skipFallback) renderSponsorLeadFallback(form, values, "PrintableTools Lab sponsor inquiry");
      setStatus(error.message || "Could not send inquiry. Please use the public-safe reply or copy the backup request.", "error");
    } finally {
      if (submit) submit.disabled = false;
    }
  }

  async function submitSponsorQuickLeadForm(form) {
    const values = getFormValues(form);
    const deal = sponsorDeals.find((item) => item.id === values.quickDealId) || sponsorDeals.find((item) => item.id === values.dealId) || sponsorDeals.find((item) => item.id === DEFAULT_SPONSOR_DEAL_ID) || sponsorDeals[0];
    const prospectFit = form.dataset.sponsorProspectFit || "";
    const prospectValidation = form.dataset.sponsorProspectValidation || "";
    const prospectNotes = sponsorProspectQuickNotes(form, deal);
    const status = form.querySelector("[data-sponsor-lead-status]");
    const submit = form.querySelector("button[type='submit']");
    const setStatus = (message, kind = "") => {
      if (!status) return;
      status.textContent = message;
      status.dataset.status = kind;
    };
    const payload = {
      ...values,
      dealId: deal.id,
      placement: deal.placement,
      budgetRange: deal.budgetRange,
      timeline: deal.timeline,
      commitment: sponsorDealCommitment(deal),
      audienceFit: [
        `Fast invoice review request for ${deal.title}.`,
        prospectFit || "Sponsor says their website may fit PrintableTools Lab's free PDF, image, QR, career, classroom, or small-business workflows.",
        prospectValidation,
      ].filter(Boolean).join(" "),
      notes: prospectNotes || `${deal.title} (${deal.price}). ${deal.deliverable} Needed: ${deal.proofNeeded}`,
      consent: true,
      path: getCurrentRoutePath(),
      source: getTrafficSource(),
      ...getSponsorAttribution(),
      utmContent: form.dataset.sponsorProspectId || getSponsorAttribution().utmContent || values.utmContent,
      vertical: form.dataset.sponsorProspectVertical || getSponsorAttribution().vertical || values.vertical,
    };
    setStatus("Sending fast invoice review request...", "pending");
    clearSponsorLeadFallback(form);
    clearSponsorLeadSuccess(form);
    if (submit) submit.disabled = true;
    try {
      const response = await fetch("/api/sponsor-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) {
        if (data.fallbackRequired) {
          renderSponsorLeadFallback(form, data.fallbackBody || payload, data.fallbackSubject || "PrintableTools Lab sponsor invoice review", data.fallbackPublicReplyUrl || "");
          setStatus(data.error || "Lead storage is temporarily limited. Copy the backup request below.", "error");
          return;
        }
        const apiError = new Error(data.error || "Could not send request.");
        apiError.skipFallback = Boolean(data.error);
        throw apiError;
      }
      track("sponsor_request_intent", { tool: "sponsor" });
      setStatus("Invoice review request received. Fit will be checked manually before any external invoice or agreement is sent.", "success");
      clearSponsorLeadFallback(form);
      renderSponsorLeadSuccess(form, payload, data);
      form.reset();
    } catch (error) {
      if (!error.skipFallback) renderSponsorLeadFallback(form, payload, "PrintableTools Lab sponsor invoice review");
      setStatus(error.message || "Could not send request. Please use the full inquiry form.", "error");
    } finally {
      if (submit) submit.disabled = false;
    }
  }

  function getSessionSource() {
    try {
      return sessionStorage.getItem("ptl_source");
    } catch (error) {
      return "";
    }
  }

  function saveSessionSource(source) {
    try {
      sessionStorage.setItem("ptl_source", source);
    } catch (error) {
      // Session storage can be unavailable in strict privacy modes; metrics still work.
    }
  }

  function normalizeTrafficSource(value) {
    const source = String(value || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48);
    if (!source) return "";
    if (source === "free-no-signup") return "freenosignup";
    if (source === "no-login") return "nologin";
    if (source === "no-subscription") return "nosubscription";
    if (source === "github-issues") return "github-issue";
    if (source === "sharekit") return "share-kit";
    if (source === "short_video") return "short-video";
    if (source === "game_platform") return "game-platform";
    if (source === "sponsor-call") return "sponsor-outreach";
    if (TRAFFIC_SOURCES.has(source)) return source;
    return "referral";
  }

  function inferTrafficSourceFromReferrer(referrer) {
    if (!referrer) return "direct";
    try {
      const host = new URL(referrer).hostname.toLowerCase();
      const currentHost = window.location.hostname.toLowerCase();
      if (!host || host === currentHost) return "direct";
      if (host.includes("google.")) return "google";
      if (host.includes("bing.")) return "bing";
      if (host.includes("github.io")) return "github-pages";
      if (host.includes("gist.github.com")) return "gist";
      if (host.includes("github.com")) return "github";
      if (host.includes("zearches.com")) return "zearches";
      if (host.includes("listai.cc")) return "listai";
      if (host.includes("techtools.cz")) return "techtools";
      if (host.includes("nosignuptools.com")) return "nosignuptools";
      if (host.includes("freenosignup.com")) return "freenosignup";
      if (host.includes("nologin.tools")) return "nologin";
      if (host.includes("nosubscription.org")) return "nosubscription";
      return "referral";
    } catch (error) {
      return "unknown";
    }
  }

  function bootstrapConfiguredIntegrations() {
    if (CONFIG.googleSiteVerification) {
      const meta = document.createElement("meta");
      meta.name = "google-site-verification";
      meta.content = CONFIG.googleSiteVerification;
      document.head.appendChild(meta);
    }

    if (CONFIG.enableAnalytics && CONFIG.googleAnalyticsId) {
      const ga = document.createElement("script");
      ga.async = true;
      ga.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(CONFIG.googleAnalyticsId)}`;
      document.head.appendChild(ga);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", CONFIG.googleAnalyticsId);
    }

    if (CONFIG.enableAds && CONFIG.adsenseClientId) {
      const ads = document.createElement("script");
      ads.async = true;
      ads.crossOrigin = "anonymous";
      ads.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(CONFIG.adsenseClientId)}`;
      document.head.appendChild(ads);
      ads.addEventListener("load", pushVisibleAds);
    }
  }

  function pushVisibleAds() {
    if (!window.adsbygoogle) return;
    document.querySelectorAll("ins.adsbygoogle").forEach((unit) => {
      if (unit.dataset.adsPushed) return;
      unit.dataset.adsPushed = "true";
      try {
        window.adsbygoogle.push({});
      } catch (error) {
        unit.dataset.adsPushed = "";
      }
    });
  }

  function getEvents() {
    try {
      return JSON.parse(localStorage.getItem("ptl_events") || "[]");
    } catch {
      return [];
    }
  }

  function summarizeEvents(events) {
    return events.reduce((acc, event) => {
      acc[event.name] = (acc[event.name] || 0) + 1;
      return acc;
    }, {});
  }

  function exportEventsCsv() {
    const rows = [["time", "event", "details"]].concat(getEvents().map((event) => [
      event.time,
      event.name,
      JSON.stringify(event.data || {}),
    ]));
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), "printable-tools-lab-events.csv");
  }

  function initAuditRequestBuilders(root = document) {
    void root;
  }

  function initServiceRequestCopies(root = document) {
    void root;
  }
  function initUploadLimitHelpers(root = document) {
    root.querySelectorAll("[data-upload-limit-helper]").forEach((helper) => {
      if (helper.dataset.uploadLimitReady === "true") return;
      helper.dataset.uploadLimitReady = "true";
      const input = helper.querySelector("[data-upload-limit-input]");
      const result = helper.querySelector("[data-upload-limit-result]");
      const update = () => {
        if (!result) return;
        result.innerHTML = renderUploadLimitRecommendation(matchUploadLimitMessage(input ? input.value : ""));
      };
      if (input) {
        input.addEventListener("input", update);
        input.addEventListener("change", update);
      }
      helper.querySelectorAll("[data-upload-limit-example]").forEach((button) => {
        button.addEventListener("click", () => {
          if (!input) return;
          input.value = button.dataset.uploadLimitExample || "";
          update();
          input.focus();
        });
      });
      update();
    });
  }

  function matchUploadLimitMessage(message) {
    const normalized = String(message || "").toLowerCase().replace(/,/g, "").replace(/\s+/g, " ");
    const hasPdf = /\bpdf\b/.test(normalized);
    const hasImage = /\b(image|photo|picture|jpg|jpeg|png|webp|screenshot|avatar|profile|passport|id photo)\b/.test(normalized);
    const hasJpgPng = /\b(jpg|jpeg|png)\b/.test(normalized);
    const tooLarge = /\b(too large|file too big|file is too big|exceeds|exceed|maximum size|max size|attachment too large|over limit|larger than|less than|under)\b/.test(normalized);
    const isResume = /\b(resume|cv)\b/.test(normalized);
    const isEmail = /\b(email|e-mail|mail|attachment|gmail|outlook)\b/.test(normalized);
    const hasDimension = /\b(dimension|dimensions|pixel|pixels|px|width|height|resolution|resize|crop|square)\b/.test(normalized) || /\d{2,5}\s*(x|by|\*)\s*\d{2,5}/.test(normalized);
    const needsPdf = /\b(pdf only|pdf required|upload pdf|accepts pdf|must be pdf|as pdf)\b/.test(normalized);
    const rejectsPdfForImage = hasPdf && /\b(jpg|jpeg|png|image|photo)\b/.test(normalized) && /\b(need|needs|required|only|accepted|accepts|upload)\b/.test(normalized);
    const size = parseUploadLimitSize(normalized);

    if (hasPdf && size) {
      if (size.unit === "mb") {
        if (size.value <= 0.6) return uploadLimitMatch("PDF under 500KB", "/tools/compress-pdf/?targetSize=500kb", "Open PDF compressor", "Uses the strict 500KB PDF target for small portal limits.", "compress-pdf");
        if (size.value <= 1.2) return uploadLimitMatch("PDF under 1MB", "/tools/compress-pdf/?targetSize=1mb", "Open PDF compressor", "Uses the 1MB PDF target already selected.", "compress-pdf");
        if (size.value <= 2.2) return uploadLimitMatch("PDF under 2MB", "/tools/compress-pdf/?targetSize=2mb", "Open PDF compressor", "Uses the 2MB PDF target for larger application and email limits.", "compress-pdf");
        return uploadLimitMatch("PDF under 5MB", "/tools/compress-pdf/?targetSize=5mb", "Open PDF compressor", "Uses the 5MB PDF target for broad upload caps.", "compress-pdf");
      }
      return uploadLimitMatch(`PDF under ${size.value}KB`, `/tools/compress-pdf/?targetSize=${size.value <= 500 ? "500kb" : "1mb"}`, "Open PDF compressor", "Starts with the closest built-in PDF target. Review the result before uploading.", "compress-pdf");
    }

    if (hasImage && size) {
      const targetKb = size.unit === "mb" ? Math.min(5000, Math.round(size.value * 1024)) : size.value;
      return uploadLimitMatch(`Image under ${targetKb}KB`, `/tools/compress-image-to-kb/?targetKb=${targetKb}`, "Open image compressor", "Starts the image-to-KB compressor with the target from the error message.", "compress-image-to-kb");
    }

    if (hasPdf && (tooLarge || isResume || isEmail)) {
      if (isEmail) return uploadLimitMatch("Email PDF attachment too large", "/tools/compress-pdf/?targetSize=5mb", "Compress PDF for email", "Starts the PDF compressor with the 5MB email-friendly target.", "compress-pdf");
      return uploadLimitMatch(isResume ? "Resume PDF too large" : "PDF too large", "/tools/compress-pdf/?targetSize=1mb", "Open PDF compressor", "Starts the PDF compressor with the common 1MB upload target.", "compress-pdf");
    }

    if (hasImage && tooLarge) {
      const targetKb = normalized.includes("2 mb") || normalized.includes("2mb") ? 2048 : 500;
      return uploadLimitMatch("Image too large", `/tools/compress-image-to-kb/?targetKb=${targetKb}`, "Open image compressor", "Starts the image-to-KB compressor with a practical upload target.", "compress-image-to-kb");
    }

    if (hasDimension) return uploadLimitMatch("Wrong image dimensions", "/tools/resize-image/", "Open image resizer", "Resize or crop first when the portal names width, height, pixels, or a square photo rule.", "resize-image");
    if (rejectsPdfForImage) return uploadLimitMatch("PDF rejected, image required", "/tools/pdf-to-images/", "Convert PDF to images", "Turn PDF pages into JPG or PNG files when the form asks for image uploads.", "pdf-to-images");
    if (needsPdf && hasImage) return uploadLimitMatch("Photos need to become PDF", "/tools/image-to-pdf/", "Convert image to PDF", "Turn one or more photos, scans, or screenshots into a PDF locally.", "image-to-pdf");
    if (hasJpgPng || /\b(file type|format|invalid type|unsupported type|convert)\b/.test(normalized)) return uploadLimitMatch("Wrong file type", "/tools/convert-image/", "Open image converter", "Convert JPG, PNG, or WebP locally when the upload form rejects the current type.", "convert-image");
    if (/\b(passport|visa|id photo|profile photo)\b/.test(normalized)) return uploadLimitMatch("Passport or ID photo rejected", "/passport-photo-size-fixer/", "Open passport photo fixer", "Crop, resize, and compress ID-style photos when size and dimensions both matter.", "passport-photo");
    return uploadLimitMatcherDefault;
  }

  function parseUploadLimitSize(text) {
    const match = String(text || "").match(/(\d+(?:\.\d+)?)\s*(kb|k|kilobytes?|mb|m|megabytes?)/i);
    if (!match) return null;
    const value = Number(match[1]);
    if (!Number.isFinite(value) || value <= 0) return null;
    const unit = match[2].toLowerCase().startsWith("m") ? "mb" : "kb";
    return { value: Math.round(value * 10) / 10, unit };
  }

  function uploadLimitMatch(title, href, label, why, trackTool) {
    return {
      badge: "Best match",
      title,
      href,
      label,
      why,
      trackTool,
    };
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function slugify(value) {
    const clean = String(value || "printable")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return clean || "printable";
  }

  document.addEventListener("click", (event) => {
    const copyButton = event.target.closest("[data-copy-text]");
    if (copyButton) {
      event.preventDefault();
      copyTextToClipboard(copyButton.dataset.copyText || "", copyButton);
      return;
    }
    const link = event.target.closest("a[href]");
    if (!link) return;
    if (link.dataset.trackEvent) {
      track(link.dataset.trackEvent, { tool: link.dataset.trackTool || "site" });
    }
    if (link.hasAttribute("download") || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target && link.target !== "_self") return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || !url.pathname.startsWith("/")) return;
    if (url.hash && url.pathname === window.location.pathname) return;
    event.preventDefault();
    window.history.pushState({}, "", url.pathname + url.search + url.hash);
    route();
  });

  async function copyTextToClipboard(text, button) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      if (button) {
        const original = button.textContent;
        button.textContent = "Copied";
        setTimeout(() => {
          button.textContent = original;
        }, 1600);
      }
    } catch (error) {
      window.prompt("Copy this text", text);
    }
  }
  window.addEventListener("hashchange", route);
  window.addEventListener("popstate", route);
  window.addEventListener("DOMContentLoaded", () => {
    initSponsorLeadForms(document);
    route();
  });
})();
