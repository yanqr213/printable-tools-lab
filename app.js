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
    contactEmail: "",
    enableAds: false,
    enableAnalytics: false,
  }, window.PTL_CONFIG || {});

  bootstrapConfiguredIntegrations();

  const AI_FIELD_ALLOWLIST = {
    "invoice-generator": ["items", "due", "notes"],
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
      watermark: false,
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
    "estimate-generator": {
      id: "estimate-generator",
      icon: "EST",
      title: "Estimate Generator",
      shortTitle: "Estimate",
      description: "Create a free estimate PDF for freelance work, home services, consulting, repairs, or small business quotes.",
      keywords: ["estimate generator", "quote PDF", "free estimate", "service estimate"],
      watermark: false,
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
      watermark: false,
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
      watermark: false,
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
      watermark: false,
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
      watermark: false,
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
    "cover-letter": {
      id: "cover-letter",
      icon: "CL",
      title: "Cover Letter Generator",
      shortTitle: "Cover letter",
      description: "Create a free one-page cover letter PDF for job applications without an account or surprise download fee.",
      keywords: ["cover letter generator", "free cover letter", "job application", "PDF cover letter"],
      watermark: false,
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
      watermark: false,
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
      watermark: false,
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
      title: "Everyday utility PDFs",
      description: "High-intent PDF tools for image conversion, sign-in sheets, graph paper, and travel checklists.",
      links: [
        ["Image to PDF converter", "/tools/image-to-pdf/"],
        ["Sign-in sheet generator", "/tools/sign-in-sheet/"],
        ["Graph paper generator", "/tools/graph-paper/"],
        ["Packing list generator", "/tools/packing-list/"],
      ],
    },
    {
      title: "Business paperwork",
      description: "Clean PDF invoices, estimates, purchase orders, sale records, and receipts for people who need a document now.",
      links: [
        ["Invoice generator", "/tools/invoice-generator/"],
        ["Estimate generator", "/tools/estimate-generator/"],
        ["Purchase order generator", "/tools/purchase-order/"],
        ["Rent receipt generator", "/tools/rent-receipt/"],
      ],
    },
    {
      title: "Career documents",
      description: "Free resume, cover letter, and resignation letter PDFs for job seekers who need useful documents without a surprise paywall.",
      links: [
        ["Resume builder PDF", "/tools/resume-builder/"],
        ["Cover letter generator", "/tools/cover-letter/"],
        ["Resignation letter generator", "/tools/resignation-letter/"],
        ["Free resume builder PDF guide", "/guides/free-resume-builder-pdf/"],
      ],
    },
  ];

  const guides = [
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
  ];

  const pages = {
    about: {
      title: "About PrintableTools Lab",
      description: "PrintableTools Lab makes quick, practical PDF generators for families, teachers, tutors, and home organizers.",
      body: [
        ["p", "PrintableTools Lab is built around a simple idea: useful printable pages should be fast to make, easy to print, and readable on ordinary home or school printers."],
        ["p", "The current version focuses on practical browser-side PDF work: image conversion, business documents, career documents, planning pages, classroom resources, and household checklists."],
        ["p", "The free tools run in the browser. We use a light watermark and a daily generation limit while the project validates demand and prepares for responsible advertising."],
      ],
    },
    privacy: {
      title: "Privacy Policy",
      description: "Privacy policy for PrintableTools Lab.",
      body: [
        ["p", "PrintableTools Lab is designed to generate PDFs in your browser. The first version does not require an account and keeps ordinary PDF generation on your device."],
        ["p", "If you choose the optional AI idea helper, the current tool type and short form text are sent to the site's AI service only to return printable suggestions. Do not enter sensitive personal information."],
        ["p", "The site stores a small amount of local data in your browser to remember daily generation counts and anonymous local event totals such as page views, generate clicks, downloads, and limit notices."],
        ["p", "If analytics, advertising, or payment tools are added later, this policy should be updated before launch to describe those providers, cookies, and opt-out choices."],
      ],
    },
    terms: {
      title: "Terms of Use",
      description: "Terms of use for PrintableTools Lab.",
      body: [
        ["p", "The free printable generators are provided as-is for personal, classroom, and small-group use. You are responsible for checking that a generated worksheet is appropriate before giving it to a child or group."],
        ["p", "Do not use the tools to create unlawful, harmful, infringing, or misleading materials. Do not remove service marks from free downloads."],
        ["p", "Commercial resale of generated pages as standalone products is not allowed in the free version. Future licensing terms may be added only after the free product is validated."],
      ],
    },
    license: {
      title: "AI & License Disclosure",
      description: "How PrintableTools Lab handles generated content, design assets, and licensing.",
      body: [
        ["p", "PrintableTools Lab uses code-driven templates and may use AI assistance during product design, wording, and template ideation. The generated PDFs are assembled in the browser from user input and template rules."],
        ["p", "The default templates avoid third-party characters, trademarked brands, and protected artwork. Users should not enter copyrighted or trademarked content they do not have permission to use."],
        ["p", "If external fonts, icon sets, or datasets are added later, their license notes should be listed here before public launch."],
      ],
    },
    roadmap: {
      title: "PrintableTools Lab Roadmap",
      description: "A noindex roadmap for future PrintableTools Lab product decisions after the free version is validated.",
      body: [
        ["p", "The current product focus is the free ad-supported printable tool site. Paid features are intentionally deferred until the free tools show search traffic, downloads, and repeated usage."],
        ["h2", "Signals to watch"],
        ["ul", ["Search Console impressions for generator keywords.", "PDF downloads by tool.", "Daily limit hits.", "Requests for classroom or batch workflows."]],
        ["h2", "Possible later work"],
        ["p", "If the data proves demand, the next layer can include saved projects, batch generation, higher daily limits, and no-watermark exports. No checkout should be enabled before those features can be delivered."],
      ],
    },
    "launch-kit": {
      title: "Launch Kit",
      description: "Distribution copy, links, and validation steps for launching PrintableTools Lab.",
      body: [
        ["p", "Use this page to coordinate the first distribution push. The goal is not to look busy; it is to create enough real traffic for Search Console, AdSense readiness, and download validation."],
        ["h2", "Primary links"],
        ["ul", ["Homepage: https://printable-tools-lab.pages.dev/", "Tools index: https://printable-tools-lab.pages.dev/tools/", "Image to PDF: https://printable-tools-lab.pages.dev/tools/image-to-pdf/", "Invoice generator: https://printable-tools-lab.pages.dev/tools/invoice-generator/", "Sitemap: https://printable-tools-lab.pages.dev/sitemap.xml"]],
        ["h2", "First distribution copy"],
        ["p", "Free browser PDF tools: convert images to PDF, create invoices, resumes, sign-in sheets, graph paper, calendars, worksheets, and checklists. No account required."],
        ["p", "Try the free image to PDF converter: select a JPG, PNG, or WebP file and generate a one-page PDF locally without uploading the image."],
        ["p", "Need a quick invoice, sign-in sheet, or packing checklist? PrintableTools Lab creates practical one-page PDFs in the browser."],
        ["h2", "Do not do this"],
        ["ul", ["Do not request ad interactions from visitors.", "Do not submit to AdSense before Search Console sees public pages.", "Do not buy traffic before tool usage proves basic conversion."]],
      ],
    },
  };

  window.PRINTABLE_TOOLS_LAB_ROUTES = {
    tools,
    guides,
    pages,
  };

  const toolOrder = [
    "invoice-generator",
    "estimate-generator",
    "purchase-order",
    "bill-of-sale",
    "resume-builder",
    "cover-letter",
    "resignation-letter",
    "monthly-calendar",
    "meal-planner",
    "image-to-pdf",
    "sign-in-sheet",
    "graph-paper",
    "packing-list",
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

  const SOFTWARE_SCHEMA_IDS = new Set(["tools"]);

  function route() {
    const hash = window.location.hash.replace(/^#\/?/, "");
    const path = hash || window.location.pathname.replace(/^\/+|\/+$/g, "");
    const parts = path.split("/").filter(Boolean);
    if (!parts.length) return renderHome();
    if (parts[0] === "tools" && !parts[1]) return renderToolsIndex();
    if (parts[0] === "tools" && tools[parts[1]]) return renderTool(parts[1]);
    if (parts[0] === "guides" && !parts[1]) return renderGuides();
    if (parts[0] === "guides" && parts[1]) return renderGuide(parts[1]);
    if (parts[0] === "dashboard") return renderDashboard();
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
    setTimeout(pushVisibleAds, 0);
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
    setMeta("Free Printable PDF Generators", "Create invoices, rent receipts, resumes, worksheets, charts, and planners as free printable PDF files.");
    app.innerHTML = `
      <section class="shell hero">
        <div>
          <h1>Make useful printable PDFs in under a minute.</h1>
          <p>Free browser-based generators for image-to-PDF conversion, invoices, rent receipts, resumes, worksheets, sign-in sheets, graph paper, and planners. No account, no surprise download fee.</p>
          <div class="hero-actions">
            <a class="button" href="/tools/invoice-generator/">Create an invoice</a>
            <a class="button secondary" href="/guides/">Read printable guides</a>
          </div>
          <div class="hero-proof" aria-label="Launch validation goals">
            <div class="proof-tile"><strong>20</strong><span>high-frequency tools</span></div>
            <div class="proof-tile"><strong>5/day</strong><span>free generations</span></div>
            <div class="proof-tile"><strong>38</strong><span>SEO-ready guides</span></div>
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
        <div class="grid-2">${keywordClusters.map(keywordClusterCard).join("")}</div>
      </section>
      <section class="shell section">
        <div class="section-head">
          <div>
            <h2>Free printable tools</h2>
            <p>Each tool creates a one-page PDF in your browser. Business and career documents export clean PDFs; worksheet tools include a small footer mark while the project validates demand.</p>
          </div>
          <a class="button ghost" href="/dashboard/">View local data</a>
        </div>
        <div class="grid-3">${toolOrder.map((id) => toolCard(tools[id])).join("")}</div>
      </section>
      <section class="shell section">
        <div class="section-head">
          <div>
            <h2>Built for AdSense readiness</h2>
            <p>The site includes original guidance pages, clear policies, and non-intrusive placeholder ad zones so monetization can be added after content and usage are validated.</p>
          </div>
        </div>
        <div class="grid-3">
          <div class="panel"><h3>Original content</h3><p>Guide pages explain practical use cases instead of relying on empty generator pages.</p></div>
          <div class="panel"><h3>Responsible ads later</h3><p>Ad spaces are separated from buttons and never used as a condition for downloading PDFs.</p></div>
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
    setMeta("Free PDF Tools", "Browse free printable PDF tools for business paperwork, career documents, calendars, meal planning, worksheets, and classroom routines.");
    app.innerHTML = `
      <section class="shell page-title section">
        <h1>Free PDF tools</h1>
        <p>Choose a browser-based generator for business paperwork, job applications, image conversion, planning pages, classroom printables, and family routines. Each tool creates a one-page PDF without requiring an account.</p>
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
            <p>All tools run in the browser and are designed for fast, practical one-page PDFs. Image conversion stays local and does not upload files.</p>
          </div>
        </div>
        <div class="grid-3">${toolOrder.map((id) => toolCard(tools[id])).join("")}</div>
      </section>
    `;
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

  function renderTool(id) {
    const tool = tools[id];
    setMeta(tool.title, tool.description);
    setToolJsonLd(tool);
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
            <p class="help">${tool.watermark === false ? "The free version creates one clean one-page PDF. Daily limits are stored locally in this browser." : "The free version creates one page and adds a small footer watermark. Daily limits are stored locally in this browser."}</p>
          </form>
          <div id="aiIdeasPanel" class="ai-panel" hidden></div>
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
        "Browser-based PDF generation",
        "No account required",
        "US Letter and A4 support",
        "One-page printable export",
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
    if (field.type === "select") {
      return `<div class="field"><label for="${field.id}">${escapeHtml(field.label)}</label><select ${common}>${field.options.map(([v, label]) => `<option value="${v}" ${v === value ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}</select>${help}</div>`;
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
      const filename = `${tool.id}-${slugify(values.name || values.title || "printable")}.pdf`;
      const pdf = canvasToPdf(canvas, filename);
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

  function showDownloadComplete(tool, target, remaining) {
    if (!target) return;
    const related = getRelatedTools(tool.id).slice(0, 3);
    target.hidden = false;
    target.innerHTML = `
      <div>
        <strong>PDF downloaded</strong>
        <p class="help">Review the file before sharing or printing. You have ${Math.max(0, remaining)} free ${remaining === 1 ? "generation" : "generations"} left today in this browser.</p>
      </div>
      <div class="next-links">
        ${related.map((item) => `<a class="tag" href="/tools/${item.id}/">${escapeHtml(item.shortTitle)}</a>`).join("")}
        <a class="tag" href="/guides/">Guides</a>
      </div>
      ${renderAdUnit("tool", "download-complete area, clearly separated from the PDF action")}
    `;
    setTimeout(pushVisibleAds, 0);
  }

  function getRelatedTools(currentId) {
    const groups = [
      ["invoice-generator", "estimate-generator", "purchase-order", "bill-of-sale", "rent-receipt"],
      ["resume-builder", "cover-letter", "resignation-letter"],
      ["monthly-calendar", "meal-planner", "weekly-planner", "habit-tracker"],
      ["name-tracing", "chore-chart", "reward-chart", "flashcards"],
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

  function renderDashboard() {
    setMeta("Local Validation Dashboard", "Local browser dashboard for PrintableTools Lab validation events.");
    const events = getEvents();
    const totals = summarizeEvents(events);
    app.innerHTML = `
      <section class="shell dashboard">
        <h1>Local validation dashboard</h1>
        <p class="lead">This zero-cost version records events in localStorage. After launch, supplement this with Search Console, Analytics, and platform revenue data.</p>
        <div class="metric-grid">
          <div class="metric-tile"><strong>${totals.page_view || 0}</strong><span>page views</span></div>
          <div class="metric-tile"><strong>${totals.generate_pdf || 0}</strong><span>PDF generations</span></div>
          <div class="metric-tile"><strong>${totals.download_pdf || 0}</strong><span>downloads</span></div>
          <div class="metric-tile"><strong>${totals.limit_hit || 0}</strong><span>limit hits</span></div>
        </div>
        <div class="panel">
          <h2>Live site signals</h2>
          <p class="help">Cloudflare-hosted counters show whether real visitors are generating and downloading PDFs. They are approximate and anonymous.</p>
          <div id="remoteMetrics" class="metric-remote">Loading live metrics...</div>
        </div>
        <div class="panel">
          <h2>Validation gates</h2>
          <p><strong>30-day continue gate:</strong> 100 PDF downloads, 300 tool generations, or growing Search Console impressions. If no search exposure or downloads after 60 days, pause this track and test HTML5 game distribution.</p>
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

  function loadImageFiles(tool, fileList, draw) {
    if (tool.id !== "image-to-pdf") return;
    const files = Array.from(fileList || [])
      .filter((file) => /^image\/(png|jpeg|webp)$/.test(file.type))
      .slice(0, 4);
    if (!files.length) {
      imageToolState.set(tool.id, []);
      draw();
      return;
    }
    Promise.all(files.map(readImageFile))
      .then((items) => {
        imageToolState.set(tool.id, items.filter(Boolean));
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
    if (tool.watermark !== false) drawWatermark(ctx, paper);
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
    ctx.fillStyle = "#f7faf8";
    ctx.fillRect(box.x, box.y, box.width, box.height);
    ctx.drawImage(image, x, y, drawW, drawH);
    ctx.restore();
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

  function drawWatermark(ctx, paper) {
    ctx.save();
    ctx.font = "20px Arial";
    ctx.fillStyle = "rgba(23,49,59,0.45)";
    ctx.textAlign = "center";
    ctx.fillText("Made with PrintableTools Lab - free version", paper.width / 2, paper.height - 26);
    ctx.restore();
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
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    const imageBytes = base64ToBinary(dataUrl.split(",")[1]);
    const widthPt = canvas.width * 0.48;
    const heightPt = canvas.height * 0.48;
    const objects = [];
    objects.push("<< /Type /Catalog /Pages 2 0 R >>");
    objects.push("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${fmt(widthPt)} ${fmt(heightPt)}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`);
    objects.push(`<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n${imageBytes}\nendstream`);
    const content = `q\n${fmt(widthPt)} 0 0 ${fmt(heightPt)} 0 0 cm\n/Im0 Do\nQ`;
    objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
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
    const events = getEvents();
    events.push({
      time: new Date().toISOString(),
      name,
      data: Object.assign({ ref: document.referrer || "direct" }, data || {}),
    });
    localStorage.setItem("ptl_events", JSON.stringify(events.slice(-1000)));
    if (window.gtag && CONFIG.enableAnalytics) {
      window.gtag("event", name, data || {});
    }
    sendRemoteEvent(name, data || {});
  }

  function sendRemoteEvent(name, data) {
    if (!navigator.sendBeacon && !window.fetch) return;
    const payload = JSON.stringify({
      name,
      tool: data.tool || "site",
      path: getCurrentRoutePath(),
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
      target.innerHTML = `
        <div class="metric-grid compact">
          <div class="metric-tile"><strong>${data.totals.page_view || 0}</strong><span>live page views</span></div>
          <div class="metric-tile"><strong>${data.totals.generate_pdf || 0}</strong><span>live generations</span></div>
          <div class="metric-tile"><strong>${data.totals.download_pdf || 0}</strong><span>live downloads</span></div>
          <div class="metric-tile"><strong>${data.totals.ai_ideas_apply || 0}</strong><span>AI applies</span></div>
        </div>
        <div class="preview-stage">
          <table class="event-table">
            <thead><tr><th>Tool</th><th>Downloads</th><th>Generations</th><th>Limit hits</th></tr></thead>
            <tbody>${data.tools.map((row) => `<tr><td>${escapeHtml(row.tool)}</td><td>${row.download_pdf || 0}</td><td>${row.generate_pdf || 0}</td><td>${row.limit_hit || 0}</td></tr>`).join("")}</tbody>
          </table>
        </div>
      `;
    } catch (error) {
      target.innerHTML = `<p class="help">Live metrics are not available yet. Local browser metrics still work.</p>`;
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
    const link = event.target.closest("a[href]");
    if (!link) return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || !url.pathname.startsWith("/")) return;
    if (url.hash && url.pathname === window.location.pathname) return;
    event.preventDefault();
    window.history.pushState({}, "", url.pathname + url.search + url.hash);
    route();
  });
  window.addEventListener("hashchange", route);
  window.addEventListener("popstate", route);
  window.addEventListener("DOMContentLoaded", route);
})();
