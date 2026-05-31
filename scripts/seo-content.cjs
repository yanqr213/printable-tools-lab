const BASE_URL = (process.env.PUBLIC_SITE_URL || "https://printable-tools-lab.pages.dev").replace(/\/+$/, "");

const SITE_SUMMARY = {
  name: "PrintableTools Lab",
  description: "Free browser-based PDF generators for image conversion, text conversion, invoices, estimates, purchase orders, sale records, receipts, timesheets, resumes, cover letters, resignation letters, certificates, calendars, meal planners, worksheets, charts, flashcards, graph paper, sign-in sheets, packing lists, to-do lists, and habit trackers.",
  audience: "Freelancers, small businesses, job seekers, parents, teachers, tutors, homeschool families, students, event organizers, travelers, tenants, landlords, and household planners.",
  monetization: "Free tools first, then responsible display advertising after the site has useful public content and Search Console visibility. Paid checkout is deferred.",
};

const HIGH_INTENT_TOOL_PATHS = [
  "tools/image-to-pdf",
  "tools/multi-image-pdf",
  "tools/text-to-pdf",
  "tools/invoice-generator",
  "tools/receipt-generator",
  "tools/timesheet-generator",
  "tools/resume-builder",
  "tools/certificate-generator",
  "tools/todo-list",
  "tools/graph-paper",
];

const TOOL_FINDER_ROWS = [
  {
    need: "I need to turn a photo, scan, or screenshot into a PDF",
    toolPath: "tools/image-to-pdf",
    why: "Best for one image or a small gallery on one page. The file is processed locally in the browser.",
  },
  {
    need: "I need one PDF with several image pages",
    toolPath: "tools/multi-image-pdf",
    why: "Best when each image should become its own PDF page, such as receipts, scans, or phone photos.",
  },
  {
    need: "I have plain text and need a simple PDF",
    toolPath: "tools/text-to-pdf",
    why: "Best for notes, short letters, checklists, or copied text that needs a clean one-page export.",
  },
  {
    need: "I need to bill a client or record a service payment",
    toolPath: "tools/invoice-generator",
    why: "Use an invoice before payment is due. Use the receipt tool after money has been paid.",
  },
  {
    need: "I need a quote before work starts",
    toolPath: "tools/estimate-generator",
    why: "Best for service quotes, repair estimates, consulting scopes, and small project proposals.",
  },
  {
    need: "I need proof that something was paid",
    toolPath: "tools/receipt-generator",
    why: "Best for deposits, reimbursements, service payments, and simple sale records.",
  },
  {
    need: "I need to track hours for a week or pay period",
    toolPath: "tools/timesheet-generator",
    why: "Best for freelancers, contractors, staff records, project approvals, and recurring weekly hour logs.",
  },
  {
    need: "I need a job application PDF",
    toolPath: "tools/resume-builder",
    why: "Start with the resume. Use the cover letter tool when the application asks for a separate letter.",
  },
  {
    need: "I need an event or classroom printable",
    toolPath: "tools/sign-in-sheet",
    why: "Best for attendance, workshop check-in, visitor logs, and simple event records.",
  },
  {
    need: "I need a blank printable page for math, notes, or sketches",
    toolPath: "tools/graph-paper",
    why: "Best for quarter-inch grids, half-inch grids, dot grids, math practice, and design planning.",
  },
  {
    need: "I need a certificate or award quickly",
    toolPath: "tools/certificate-generator",
    why: "Best for participation, completion, classroom awards, clubs, and small event recognition.",
  },
  {
    need: "I need a practical checklist",
    toolPath: "tools/todo-list",
    why: "Best for errands, study sessions, event prep, home projects, or work tasks that should fit on one page.",
  },
];

const landingPages = [
  {
    path: "free-invoice-generator-no-signup",
    title: "Free Invoice Generator Without Signup",
    description: "Create and download a clean invoice PDF without creating an account, uploading data, or hitting a surprise export paywall.",
    headline: "Free invoice generator without signup",
    lead: "Make a practical invoice PDF in the browser, review it, and download it without creating an account. This page is built for freelancers and small businesses who need one clean invoice now.",
    primaryTool: "tools/invoice-generator",
    intent: "invoice PDF now, no account, no hidden export fee",
    sections: [
      ["Why this page exists", "Many invoice tools are free until the export step. PrintableTools Lab keeps the first invoice workflow lightweight: fill the form, generate the PDF locally, and keep your own copy."],
      ["What the invoice includes", "Business and client details, invoice number, date, payment terms, line items, currency, totals, and a footer note. It is a simple record format, not tax or accounting advice."],
      ["Best fit", "Use it for freelance services, consulting work, small one-off jobs, deposits, creative work, or quick client records when full accounting software is unnecessary."],
    ],
    relatedTools: ["tools/estimate-generator", "tools/receipt-generator", "tools/timesheet-generator"],
  },
  {
    path: "jpg-to-pdf-no-upload",
    title: "JPG to PDF Without Uploading",
    description: "Convert JPG, PNG, or WebP images to PDF in your browser without uploading private files to a conversion server.",
    headline: "JPG to PDF without uploading",
    lead: "Choose an image and create a PDF locally in the browser. It is useful for receipts, scans, forms, screenshots, homework pages, and other files you do not want to send to a converter server.",
    primaryTool: "tools/image-to-pdf",
    intent: "private image conversion, no upload, fast PDF",
    sections: [
      ["Local-first conversion", "The image is loaded into your browser preview and drawn into the PDF on your device. Avoid entering or uploading private documents unless you have reviewed them first."],
      ["One image or several", "Use the one-image converter for a single page or gallery layout. Use the multi-image converter when each image should become its own PDF page."],
      ["Before sharing", "Open the downloaded PDF and confirm the image is readable, oriented correctly, and not cropped in a way that hides important information."],
    ],
    relatedTools: ["tools/multi-image-pdf", "tools/text-to-pdf", "tools/packing-list"],
  },
  {
    path: "multiple-images-to-pdf-no-upload",
    title: "Multiple Images to PDF Without Uploading",
    description: "Combine several JPG, PNG, or WebP images into one multi-page PDF locally in your browser.",
    headline: "Multiple images to PDF without uploading",
    lead: "Create a multi-page PDF where each selected image becomes one page. This is designed for quick scans, receipts, forms, screenshots, homework, and grouped photo documents.",
    primaryTool: "tools/multi-image-pdf",
    intent: "combine images into one PDF without upload",
    sections: [
      ["One PDF, several pages", "Select up to eight images and export them as a single PDF. The first version keeps the workflow simple so the page can load fast on mobile and desktop."],
      ["Privacy positioning", "The images stay in the browser for ordinary generation. That is a stronger promise than tools that require an upload before showing the final PDF."],
      ["Practical limits", "Very large images can make large PDFs. Resize or crop photos first if the receiving website has strict upload limits."],
    ],
    relatedTools: ["tools/image-to-pdf", "tools/text-to-pdf", "tools/receipt-generator"],
  },
  {
    path: "text-to-pdf-no-signup",
    title: "Text to PDF Converter Without Signup",
    description: "Paste plain text and download a clean PDF without installing an editor, uploading a file, or creating an account.",
    headline: "Text to PDF converter without signup",
    lead: "Turn notes, instructions, short letters, meeting summaries, or plain text drafts into a simple one-page PDF. No account is required for the free export.",
    primaryTool: "tools/text-to-pdf",
    intent: "plain text to PDF with no account",
    sections: [
      ["Fast plain text workflow", "Paste text, choose a readable size, generate the preview, and download the PDF. This is intentionally simpler than a full document editor."],
      ["Good use cases", "Use it for short notes, printable instructions, handouts, simple letters, checklists, and text copied from another app."],
      ["One-page focus", "The free version is best for concise documents. Long text should be shortened or split into sections before export."],
    ],
    relatedTools: ["tools/image-to-pdf", "tools/todo-list", "tools/sign-in-sheet"],
  },
  {
    path: "free-resume-builder-no-signup",
    title: "Free Resume Builder Without Signup",
    description: "Build and download a clean one-page resume PDF without creating an account or paying at the export step.",
    headline: "Free resume builder without signup",
    lead: "Create a simple resume PDF for job applications without a hidden download fee. The layout is plain, readable, and built for quick edits before applying.",
    primaryTool: "tools/resume-builder",
    intent: "resume PDF download without account or paywall",
    sections: [
      ["Avoid the export surprise", "Some resume builders let users type the whole resume and then charge at download. This tool is positioned around a free one-page PDF export first."],
      ["Readable structure", "The resume includes name, headline, contact line, summary, experience, skills, and education in a simple single-column format."],
      ["Before applying", "Proofread every line, avoid private details you do not want to share, and tailor the summary and experience bullets to the role."],
    ],
    relatedTools: ["tools/cover-letter", "tools/resignation-letter", "tools/text-to-pdf"],
  },
  {
    path: "free-receipt-generator-no-signup",
    title: "Free Receipt Generator Without Signup",
    description: "Create a printable receipt PDF for a sale, deposit, service payment, reimbursement, or rent record without an account.",
    headline: "Free receipt generator without signup",
    lead: "Make a simple dated receipt PDF when money has already changed hands. It is useful for service payments, deposits, private sales, reimbursements, and basic records.",
    primaryTool: "tools/receipt-generator",
    intent: "receipt PDF now, no account, quick proof of payment",
    sections: [
      ["Invoice vs receipt", "Use an invoice before payment is due. Use a receipt after payment is made and both sides need a record."],
      ["What to include", "Payer, recipient, payment date, amount, method, description, and a short note. Keep copies with your own records."],
      ["Limits", "This is a practical receipt format, not legal, tax, or accounting advice. Requirements vary by business type and location."],
    ],
    relatedTools: ["tools/invoice-generator", "tools/rent-receipt", "tools/bill-of-sale"],
  },
  {
    path: "weekly-timesheet-pdf-no-signup",
    title: "Weekly Timesheet PDF Without Signup",
    description: "Create a printable weekly timesheet PDF for freelance hours, staff records, project tracking, or approvals without creating an account.",
    headline: "Weekly timesheet PDF without signup",
    lead: "Track days, projects, hours, notes, total hours, and approval signature on one printable page. Good for freelancers, contractors, and small teams.",
    primaryTool: "tools/timesheet-generator",
    intent: "weekly timesheet PDF with fast export",
    sections: [
      ["Repeat use", "Timesheets are naturally recurring. A fast no-signup page can serve weekly or pay-period workflows without forcing a full HR app."],
      ["What it includes", "Worker, period, day/project/hour rows, notes, total hours, and signature lines. Review hours before submitting them."],
      ["When to use a system", "If payroll, compliance, overtime, or approvals are complex, use proper time-tracking or payroll software. This page is for simple printable records."],
    ],
    relatedTools: ["tools/invoice-generator", "tools/receipt-generator", "tools/todo-list"],
  },
  {
    path: "free-certificate-maker-no-signup",
    title: "Free Certificate Maker Without Signup",
    description: "Create and download a printable certificate PDF for classroom awards, participation, completion, clubs, and small events.",
    headline: "Free certificate maker without signup",
    lead: "Generate a certificate PDF quickly for a classroom, club, workshop, team, or small event. The first version focuses on a clean printable layout instead of a template marketplace.",
    primaryTool: "tools/certificate-generator",
    intent: "certificate PDF download without account",
    sections: [
      ["Useful moments", "Use it for completion, participation, appreciation, classroom awards, clubs, small events, and workshops."],
      ["Simple fields", "Certificate title, recipient name, reason, date, style, and signer are enough for a practical printable certificate."],
      ["Print check", "Preview the PDF before printing and confirm names, dates, and signer spelling. Certificates are usually noticed for typos."],
    ],
    relatedTools: ["tools/sign-in-sheet", "tools/todo-list", "tools/flashcards"],
  },
];

const HIGH_INTENT_LANDING_PATHS = landingPages.map((page) => page.path);

const tools = [
  {
    path: "tools/name-tracing",
    title: "Name Tracing Worksheet Generator",
    description: "Create a free one-page name tracing worksheet PDF for preschool and kindergarten handwriting practice.",
    body: [
      "Enter a name or short word, choose US Letter or A4, and download a printable worksheet with tracing lines and a small drawing prompt.",
      "The free version is intentionally limited to one clean page while the project validates demand through downloads, search visibility, and responsible advertising readiness.",
    ],
  },
  {
    path: "tools/chore-chart",
    title: "Chore Chart Generator",
    description: "Make a weekly printable chore chart PDF for children, families, roommates, or classroom jobs.",
    body: [
      "Add names, chores, and a paper size to create a simple weekly chart with checkboxes for each day.",
      "The generator is designed for practical home and classroom routines rather than decorative one-off templates.",
    ],
  },
  {
    path: "tools/reward-chart",
    title: "Reward Chart Generator",
    description: "Build a printable reward chart PDF with goals, sticker boxes, and a reward note.",
    body: [
      "Choose the number of boxes, write a goal statement, and print a chart that works for short behavior or habit challenges.",
      "The free PDF includes one clean page while the product validates which free chart formats get real downloads.",
    ],
  },
  {
    path: "tools/flashcards",
    title: "Flashcard Generator",
    description: "Create a free one-page printable flashcard PDF for vocabulary, classroom review, memory games, and homeschool practice.",
    body: [
      "Enter one card per line, choose six or eight cards per page, and download a printable sheet with cut lines.",
      "This tool targets evergreen teacher and homeschool searches while keeping the first version simple enough to run without a backend.",
    ],
  },
  {
    path: "tools/weekly-planner",
    title: "Weekly Planner Generator",
    description: "Make a free printable weekly planner PDF for family schedules, class planning, errands, and meal notes.",
    body: [
      "Create a one-page weekly planner with seven day boxes and optional note sections for meals, errands, calls, or school items.",
      "Weekly planning is a broader audience test than kids-only worksheets and helps validate whether utility printables can bring non-teacher traffic.",
    ],
  },
  {
    path: "tools/habit-tracker",
    title: "Habit Tracker Generator",
    description: "Create a free printable habit tracker PDF for daily routines, reading goals, wellness habits, or classroom practice.",
    body: [
      "Add four to six habits, choose 21, 30, or 31 days, and print a simple grid for daily check-ins.",
      "Habit trackers are a high-intent printable category that can later support more free templates or affiliate links for planners and stationery.",
    ],
  },
  {
    path: "tools/invoice-generator",
    title: "Invoice Generator",
    description: "Create a clean free invoice PDF for freelance work, small business services, consulting, or one-off projects.",
    body: [
      "Add your business details, client details, invoice number, line items, terms, and notes to download a one-page invoice PDF.",
      "This tool targets users who need a document immediately and do not want an account, template marketplace, or surprise fee at download time.",
    ],
  },
  {
    path: "tools/estimate-generator",
    title: "Estimate Generator",
    description: "Create a free estimate PDF for freelance work, home services, consulting, repairs, or small business quotes.",
    body: [
      "Add business details, client details, estimate number, scope items, validity terms, and notes to download a one-page estimate PDF.",
      "Estimate and quote searches are high-intent because the user is often trying to win a job or respond to a client request quickly.",
    ],
  },
  {
    path: "tools/purchase-order",
    title: "Purchase Order Generator",
    description: "Make a free purchase order PDF for supplies, services, small vendors, internal approvals, or project records.",
    body: [
      "Enter buyer and vendor details, a PO number, order items, delivery terms, and notes to generate a clean purchase order PDF.",
      "Purchase order PDFs are useful for small teams that need an approval record before an invoice arrives.",
    ],
  },
  {
    path: "tools/bill-of-sale",
    title: "Bill of Sale Generator",
    description: "Create a simple bill of sale PDF for a private item sale, equipment transfer, furniture sale, or vehicle record draft.",
    body: [
      "Add seller, buyer, sale date, item description, price, terms, and disclosure notes to create a practical sale record PDF.",
      "This generator is a simple record template, not legal advice. Requirements vary by location and item type.",
    ],
  },
  {
    path: "tools/rent-receipt",
    title: "Rent Receipt Generator",
    description: "Make a free printable rent receipt PDF for a tenant payment, room rental, cash payment record, or landlord file.",
    body: [
      "Enter the tenant, recipient, property, amount, rental period, payment date, and payment method to generate a simple receipt PDF.",
      "Receipt searches have clear intent because the user often needs a printable record immediately after a payment.",
    ],
  },
  {
    path: "tools/resume-builder",
    title: "Resume Builder PDF",
    description: "Build a simple free resume PDF without an account, paywall, or surprise download fee.",
    body: [
      "Create a one-page resume with contact details, summary, experience, skills, and education in a clean single-column layout.",
      "Many resume builders let users type for free and charge at download. This version keeps the first PDF export free to build trust and search demand.",
    ],
  },
  {
    path: "tools/cover-letter",
    title: "Cover Letter Generator",
    description: "Create a free one-page cover letter PDF for job applications without an account or surprise download fee.",
    body: [
      "Write a clean cover letter with target role, company, opening paragraph, strengths, and closing text, then download a one-page PDF.",
      "Cover letter searches are high-intent because users often need a document right before submitting an application.",
    ],
  },
  {
    path: "tools/resignation-letter",
    title: "Resignation Letter Generator",
    description: "Make a simple resignation letter PDF with notice date, last day, appreciation, and handoff wording.",
    body: [
      "Create a professional resignation letter that states the role, company, date, last working day, appreciation, and transition note.",
      "This free generator targets a common urgent document need while keeping the result practical and editable.",
    ],
  },
  {
    path: "tools/monthly-calendar",
    title: "Monthly Calendar Generator",
    description: "Create a free printable monthly calendar PDF for appointments, school events, chores, meals, or family planning.",
    body: [
      "Choose a month, year, week start, and note headings to generate a simple black-and-white monthly calendar PDF.",
      "Monthly calendars are broad utility printables with repeat use and a larger audience than a single niche worksheet.",
    ],
  },
  {
    path: "tools/meal-planner",
    title: "Meal Planner Generator",
    description: "Make a printable weekly meal planner PDF with breakfast, lunch, dinner, grocery list, and prep notes.",
    body: [
      "Plan breakfast, lunch, dinner, grocery items, and prep notes on one printable page for the week.",
      "Meal planning has recurring weekly intent, which helps test whether free tools can produce return visits and ad-supported usage.",
    ],
  },
  {
    path: "tools/image-to-pdf",
    title: "Image to PDF Converter",
    description: "Convert JPG, PNG, or WebP images into a clean one-page PDF in your browser without uploading files.",
    body: [
      "Select up to four images, choose a fit, fill, or gallery layout, and generate a one-page PDF locally in the browser.",
      "Image conversion is a broad high-intent search category because users often need a PDF immediately for a form, upload, receipt, or scan.",
    ],
  },
  {
    path: "tools/multi-image-pdf",
    title: "Multiple Images to PDF Converter",
    description: "Turn several JPG, PNG, or WebP images into one multi-page PDF in your browser without uploading files.",
    body: [
      "Select up to eight images, choose US Letter or A4, and download one PDF where each image gets its own page.",
      "Multi-image conversion is a high-intent utility category because many paid or ad-heavy converters monetize exactly at the export step.",
    ],
  },
  {
    path: "tools/text-to-pdf",
    title: "Text to PDF Converter",
    description: "Paste plain text and download a clean one-page PDF without an account or file upload.",
    body: [
      "Paste notes, instructions, a short letter, or a plain text draft, choose a readable text size, and export a simple PDF.",
      "Text-to-PDF searches often come from people who need a document immediately and do not want to install an editor or upload content.",
    ],
  },
  {
    path: "tools/sign-in-sheet",
    title: "Sign-in Sheet Generator",
    description: "Create a printable sign-in sheet PDF for events, classrooms, workshops, meetings, or visitor logs.",
    body: [
      "Add an event name, date, row count, columns, and a short note to create a clean attendance or visitor log page.",
      "Sign-in sheets are recurring utility printables for organizers, teachers, clubs, front desks, and small events.",
    ],
  },
  {
    path: "tools/graph-paper",
    title: "Graph Paper Generator",
    description: "Generate printable graph paper PDF with quarter-inch, half-inch, or small grid spacing for math, notes, and design sketches.",
    body: [
      "Choose a paper size, grid spacing, grid style, and line color to create a printable graph paper page.",
      "Graph paper has broad evergreen demand from students, teachers, planners, makers, and anyone who needs a quick grid page.",
    ],
  },
  {
    path: "tools/packing-list",
    title: "Packing List Generator",
    description: "Make a printable packing list PDF for travel, school trips, business travel, camping, or family vacations.",
    body: [
      "Enter trip details and grouped packing sections to create a one-page checklist with checkboxes and reminder space.",
      "Packing lists are practical repeat-use printables that can reach travelers, families, students, and event planners without requiring an account.",
    ],
  },
  {
    path: "tools/receipt-generator",
    title: "Receipt Generator",
    description: "Create a simple printable receipt PDF for a sale, service payment, deposit, or reimbursement record.",
    body: [
      "Enter payer, recipient, amount, method, date, description, and notes to generate a practical one-page receipt PDF.",
      "Receipts are urgent business paperwork with clear user intent, and a free no-signup export can compete against paywalled template tools.",
    ],
  },
  {
    path: "tools/timesheet-generator",
    title: "Timesheet Generator",
    description: "Make a printable weekly timesheet PDF for freelance hours, staff records, projects, or approvals.",
    body: [
      "Add a worker, period, rows of day/project/hours/notes, and create a printable sheet with a total-hours line and approval signature.",
      "Timesheets can bring repeat use from freelancers, contractors, small teams, and service businesses that need a quick printable record.",
    ],
  },
  {
    path: "tools/certificate-generator",
    title: "Certificate Generator",
    description: "Create a printable certificate PDF for completion, participation, classroom awards, or small events.",
    body: [
      "Enter a certificate title, recipient, award reason, date, and signer to generate a clean award page.",
      "Certificate makers are commonly paywalled around templates or downloads; a simple free printable version gives teachers and organizers immediate value.",
    ],
  },
  {
    path: "tools/todo-list",
    title: "To Do List Generator",
    description: "Build a printable checklist PDF for errands, work tasks, study sessions, home projects, or event prep.",
    body: [
      "Group tasks into sections, add a reminder note, and download a one-page checklist with clear checkboxes.",
      "Checklist searches are broad and repeatable, making this a useful ad-supported free tool while the site validates demand.",
    ],
  },
];

const guides = [
  ["guides/free-printable-name-tracing-worksheet-maker", "Free printable name tracing worksheet maker", "How to create a readable name tracing page for preschool and kindergarten handwriting practice.", "A name tracing page works best as a short, familiar writing warmup. Children already recognize their own name, so the page can focus on letter direction, pencil control, spacing, and confidence."],
  ["guides/free-chore-chart-generator-for-kids", "Free chore chart generator for kids", "Make a printable weekly chore chart that children can understand without a complicated app.", "A printed chore chart turns family expectations into something visible. It works especially well for younger children because they can check boxes and see progress across the week."],
  ["guides/free-reward-chart-generator", "Free reward chart generator", "Create a printable sticker chart for goals, habits, classroom behavior, or family routines.", "A reward chart is strongest when it tracks one clear behavior. Name the exact action and choose a realistic number of boxes before the reward."],
  ["guides/free-sticker-chart-printable-maker", "Free sticker chart printable maker", "Create a simple printable sticker chart for reading, bedtime, chores, classroom behavior, or kindness goals.", "A sticker chart works best when the child can understand exactly what earns a sticker. Choose one behavior and keep the target short."],
  ["guides/bedtime-routine-chart-printable", "Bedtime routine chart printable", "Make a bedtime routine chart that turns repeated reminders into a simple printable checklist.", "A bedtime routine chart should be short enough to finish without negotiation. Good steps include pajamas, bathroom, brush teeth, story, and lights out."],
  ["guides/classroom-job-chart-printable", "Classroom job chart printable", "Use a printable job chart for weekly classroom helpers, centers, small groups, and clean-up routines.", "Classroom job charts work when job names stay short and consistent. A weekly chart gives students enough time to learn the role."],
  ["guides/free-printable-weekly-calendar-for-kids", "Free printable weekly calendar for kids", "Create a simple weekly calendar printable for school events, chores, reading, meals, and family reminders.", "A weekly calendar helps children see what is coming without overwhelming them with a full monthly planner."],
  ["guides/printable-routine-chart-for-mornings", "Printable morning routine chart ideas", "Simple morning chart layouts that help kids move from wake-up to school without constant reminders.", "A morning chart works when each step is short, visible, and in the order it happens. Good first steps include get dressed, brush teeth, eat breakfast, pack bag, and shoes on."],
  ["guides/weekly-family-planner-printable", "How to build a weekly family planner printable", "Plan meals, school events, chores, and appointments on one printable weekly page.", "A family planner should reduce coordination, not become a second calendar system. Use it for the few decisions everyone needs to see."],
  ["guides/classroom-label-generator-ideas", "Classroom label generator ideas", "Use printable labels for bins, centers, cubbies, small groups, and take-home folders.", "The best classroom labels are easy to scan. Use a consistent size, strong contrast, and short nouns."],
  ["guides/habit-tracker-printable-for-beginners", "Habit tracker printable for beginners", "Create a printable habit tracker that tracks progress without turning into a guilt chart.", "A beginner habit tracker should track one to three behaviors. Too many boxes make the page look impressive but harder to keep using."],
  ["guides/flashcard-generator-printable-guide", "Printable flashcard generator guide", "Make flashcards that are easy to cut, review, and reuse for vocabulary or classroom games.", "Printable flashcards should have clear cut lines, enough margin, and a predictable card size. Leave extra white space if children will draw or color on the cards."],
  ["guides/printable-worksheets-for-preschool-at-home", "Printable worksheets for preschool at home", "A practical way to use short printable pages without overloading young children.", "Preschool worksheets work best when they are quick, concrete, and connected to a real routine. A five-minute page can support a habit."],
  ["guides/black-and-white-printable-design-tips", "Black-and-white printable design tips", "Design worksheets and charts that still look clear on a basic home printer.", "Most printable pages are used on ordinary printers. Strong borders, readable headings, and clean spacing matter more than color fills."],
  ["guides/a4-vs-us-letter-printable-guide", "A4 vs US Letter for printable PDFs", "Choose the right paper size for families, schools, and international downloads.", "US Letter is common in the United States and Canada, while A4 is common in many other countries. Offering both sizes reduces printing frustration."],
  ["guides/batch-printable-generator-for-classrooms", "When batch printable generation is worth it", "Understand when a free one-page printable is enough and when repeated printable workflows need a better process.", "Teachers, tutors, and homeschool families sometimes need many personalized pages at once. The free tools are the first test for which workflows deserve more automation later."],
  ["guides/free-weekly-planner-generator", "Free weekly planner generator", "Create a printable weekly planner for family schedules, classroom planning, errands, and meal notes.", "A weekly planner should show only the decisions that need to stay visible: appointments, meals, tasks, and reminders. One printable page is enough for a lightweight planning loop."],
  ["guides/free-habit-tracker-generator", "Free habit tracker generator", "Build a simple habit tracker printable for routines, reading goals, wellness habits, or classroom practice.", "A habit tracker works best when it tracks a few repeatable behaviors. A simple grid is easier to keep using than a heavily decorated page with too many categories."],
  ["guides/free-invoice-generator-no-signup", "Free invoice generator without signup", "Create a clean invoice PDF without an account, template marketplace, or surprise download fee.", "Many freelancers only need one invoice today. A tool that opens quickly, avoids account creation, and downloads a clean PDF can satisfy a high-intent search faster than a full accounting app."],
  ["guides/freelance-invoice-pdf-template", "Freelance invoice PDF template", "Make a one-page freelance invoice PDF for design, writing, consulting, development, and project work.", "A freelance invoice should make it easy for the client to approve payment. Keep each line item short: project phase, quantity, rate, and the resulting amount."],
  ["guides/free-estimate-generator-pdf", "Free estimate generator PDF", "Create a free estimate PDF for services, repairs, project work, consulting, or home jobs.", "A user searching for an estimate generator is often preparing to win a job today. A fast PDF with line items and clear validity terms can solve that moment without forcing accounting software."],
  ["guides/service-quote-pdf-template", "Service quote PDF template", "Make a printable service quote PDF for contractors, freelancers, consultants, or small local businesses.", "A service quote should make the work, assumptions, timeline, and price easy to scan. Keep each line item short and avoid promising work that is not included."],
  ["guides/free-purchase-order-generator", "Free purchase order generator", "Create a purchase order PDF for vendor orders, supply requests, services, or internal approvals.", "A purchase order gives the buyer and vendor a shared reference before an invoice arrives. It is useful for supplies, project materials, services, and approvals."],
  ["guides/purchase-order-pdf-template", "Purchase order PDF template", "Use a clean purchase order PDF template when a small team needs approval before buying goods or services.", "Even small teams benefit from a simple PO because it records what was approved, who the vendor is, and what cost was expected."],
  ["guides/free-bill-of-sale-generator", "Free bill of sale generator", "Create a simple bill of sale PDF for a private item sale, equipment transfer, or sale record.", "A bill of sale records who sold an item, who bought it, what was sold, the price, and the date. It is useful for private sales and simple transfers."],
  ["guides/private-sale-receipt-pdf", "Private sale receipt PDF", "Make a printable receipt for a private sale of equipment, furniture, electronics, or household items.", "Use a short description that identifies the item well enough for both parties. Add model, serial number, or condition notes when appropriate."],
  ["guides/free-rent-receipt-generator", "Free rent receipt generator", "Generate a printable rent receipt PDF for tenant records, landlord files, or cash payment documentation.", "A rent receipt gives both sides a simple record of who paid, how much was paid, when it was received, and what rental period the payment covers."],
  ["guides/rent-receipt-for-cash-payment", "Rent receipt for cash payment", "Create a simple receipt PDF when rent is paid by cash, bank transfer, check, or another payment method.", "Cash rent payments can be easy to dispute later if no record is created. A dated receipt gives both parties a reference."],
  ["guides/free-resume-builder-pdf", "Free resume builder PDF", "Build a clean resume PDF without an account, paywall, or complicated design tool.", "Many job seekers do not need a heavy design template. They need a readable document with a clear name, contact line, summary, experience, skills, and education."],
  ["guides/ats-friendly-resume-pdf-guide", "ATS friendly resume PDF guide", "Format a simple resume PDF so it stays readable for recruiters and applicant tracking systems.", "Use clear section headings, normal text, and a single-column structure. Avoid putting important experience inside images, icons, or complex tables."],
  ["guides/free-cover-letter-generator-pdf", "Free cover letter generator PDF", "Create a one-page cover letter PDF for job applications without an account or download paywall.", "A job seeker often needs a cover letter right before submitting an application. A fast generator that exports a PDF without signup solves that moment better than a hidden download fee."],
  ["guides/cover-letter-no-signup", "Cover letter generator without signup", "Use a free cover letter PDF maker when you need a quick application document without creating an account.", "Many writing tools let users type a letter for free and then ask for payment at export. This generator keeps the first one-page PDF free so the value is visible immediately."],
  ["guides/free-resignation-letter-generator", "Free resignation letter generator", "Create a professional resignation letter PDF with last working day, appreciation, and transition wording.", "A resignation letter does not need to be long. It should state the role, company, date, last working day, appreciation, and a simple handoff offer."],
  ["guides/two-weeks-notice-letter-pdf", "Two weeks notice letter PDF", "Make a simple two weeks notice PDF that states your resignation date and final working day.", "A two weeks notice letter works best when the message is direct: you are resigning, your final day is listed, and you will help with transition tasks where possible."],
  ["guides/free-monthly-calendar-generator", "Free monthly calendar generator", "Create a printable monthly calendar PDF for appointments, bills, family plans, classes, or routines.", "A monthly calendar is useful for families, students, small teams, and anyone planning appointments or recurring tasks. It is a wider audience test than kids-only printables."],
  ["guides/printable-calendar-pdf-maker", "Printable calendar PDF maker", "Generate a simple black-and-white monthly calendar PDF that works on home printers.", "A printable calendar should leave enough writing space in each day cell. Heavy decoration can make the page harder to use after printing."],
  ["guides/free-meal-planner-generator", "Free meal planner generator", "Make a weekly meal planner PDF with meals, grocery list, and prep notes.", "Families often repeat meal planning every week, which makes it a useful validation category for downloads and return visits."],
  ["guides/weekly-meal-plan-grocery-list-pdf", "Weekly meal plan and grocery list PDF", "Create one printable page that combines a weekly meal plan with a grocery list and prep reminders.", "A meal plan is easier to use when the grocery list is on the same sheet. That keeps the planning decision connected to the shopping task."],
  ["guides/free-image-to-pdf-converter", "Free image to PDF converter", "Convert a JPG, PNG, or WebP image into a one-page PDF without uploading files.", "Image-to-PDF searches are urgent: people often need to submit a document, receipt, form, or photo as a PDF. This converter keeps the file in the browser instead of uploading it to a server."],
  ["guides/jpg-to-pdf-without-uploading", "JPG to PDF without uploading", "Make a PDF from a JPG file in the browser when you do not want to send the image to a conversion server.", "Photos of receipts, IDs, forms, and school documents can contain private information. A local converter is a safer first choice because the image is drawn into a PDF on your device."],
  ["guides/multiple-images-to-pdf-without-uploading", "Multiple images to PDF without uploading", "Combine several JPG, PNG, or WebP images into one multi-page PDF in the browser.", "Multi-image PDF conversion is useful for receipts, homework pages, forms, screenshots, and photo scans that need to be submitted together. A browser-side workflow avoids sending those files to a conversion server."],
  ["guides/text-to-pdf-converter-no-signup", "Text to PDF converter without signup", "Paste plain text and download a clean one-page PDF without installing an editor.", "Text-to-PDF searches are practical and time-sensitive. People often need to turn notes, instructions, or a plain letter into a PDF without creating an account or uploading the text to a file service."],
  ["guides/free-sign-in-sheet-generator", "Free sign-in sheet generator", "Create a printable sign-in sheet PDF for events, classes, workshops, meetings, or visitor logs.", "For small events, a printed sign-in sheet is often enough. It gives the organizer names, attendance, signatures, and contact details without needing a registration app."],
  ["guides/attendance-sheet-pdf-template", "Attendance sheet PDF template", "Use a simple printable attendance sheet for classes, clubs, workshops, and small meetings.", "A useful attendance sheet leaves enough writing space. Fewer rows per page can be better than a cramped page nobody can read later."],
  ["guides/free-printable-graph-paper-generator", "Free printable graph paper generator", "Generate graph paper PDF with quarter-inch, half-inch, or small grid spacing.", "Students, teachers, makers, and planners often need graph paper immediately. A generator with paper size and spacing options is useful even without decorative templates."],
  ["guides/quarter-inch-graph-paper-pdf", "Quarter inch graph paper PDF", "Create a quarter-inch graph paper PDF for math practice, planning, and sketching.", "Quarter-inch graph paper is readable without using too much page space. It is a good default for math work, simple layouts, and hand-drawn plans."],
  ["guides/free-packing-list-generator", "Free packing list generator", "Make a printable packing checklist PDF for travel, camping, family vacations, or business trips.", "A printed checklist works well because packing happens away from the screen: bedroom, laundry area, suitcase, car, or entryway."],
  ["guides/travel-checklist-pdf", "Travel checklist PDF", "Create a one-page travel checklist PDF with categories, checkboxes, and reminder notes.", "A travel checklist is easier to use when items are grouped by where they are packed or used. Separate clothes, toiletries, documents, and electronics."],
  ["guides/free-receipt-generator-pdf", "Free receipt generator PDF", "Create a simple printable receipt for a sale, service payment, deposit, or reimbursement.", "Receipt searches usually have immediate intent. Someone has received or sent money and needs a dated record that is clear enough for both parties to keep."],
  ["guides/weekly-timesheet-generator-pdf", "Weekly timesheet generator PDF", "Make a printable timesheet for freelance hours, staff records, project tracking, or approvals.", "Timesheets have repeat use because hours need to be recorded again every week or pay period. A quick printable sheet can be enough for freelancers, contractors, and small teams."],
  ["guides/free-certificate-generator-pdf", "Free certificate generator PDF", "Create a printable certificate for completion, participation, classroom awards, or small events.", "A certificate generator is useful when a teacher, coach, organizer, or club needs a polished award quickly without paying for a template package."],
  ["guides/printable-to-do-list-generator", "Printable to do list generator", "Build a one-page checklist for errands, work tasks, study sessions, home projects, or events.", "A printable to-do list works best when it limits the day to a few visible sections. The goal is action, not a giant task archive."],
].map(([path, title, description, intro]) => ({ path, title, description, intro }));

const keywordClusters = [
  {
    title: "Kids routine charts",
    description: "Morning, bedtime, chore, and reward charts for families who want a visible routine instead of another app.",
    links: [
      ["Chore chart generator", "tools/chore-chart"],
      ["Bedtime routine chart printable", "guides/bedtime-routine-chart-printable"],
      ["Printable morning routine chart ideas", "guides/printable-routine-chart-for-mornings"],
    ],
  },
  {
    title: "Preschool worksheets",
    description: "Name tracing, handwriting warmups, and short black-and-white pages designed for ordinary home printers.",
    links: [
      ["Name tracing worksheet generator", "tools/name-tracing"],
      ["Free printable name tracing worksheet maker", "guides/free-printable-name-tracing-worksheet-maker"],
      ["Printable worksheets for preschool at home", "guides/printable-worksheets-for-preschool-at-home"],
    ],
  },
  {
    title: "Classroom printables",
    description: "Fast one-page resources for teachers, tutors, homeschool groups, and small classroom routines.",
    links: [
      ["Flashcard generator", "tools/flashcards"],
      ["Classroom job chart printable", "guides/classroom-job-chart-printable"],
      ["Printable flashcard generator guide", "guides/flashcard-generator-printable-guide"],
    ],
  },
  {
    title: "Family planning pages",
    description: "Weekly planners, monthly calendars, meal plans, habit trackers, and simple pages for families that need one visible plan.",
    links: [
      ["Weekly planner generator", "tools/weekly-planner"],
      ["Monthly calendar generator", "tools/monthly-calendar"],
      ["Meal planner generator", "tools/meal-planner"],
      ["Habit tracker generator", "tools/habit-tracker"],
    ],
  },
  {
    title: "Everyday utility PDFs",
    description: "High-intent PDF tools for image conversion, text conversion, checklists, sign-in sheets, graph paper, and travel paperwork.",
    links: [
      ["Image to PDF converter", "tools/image-to-pdf"],
      ["JPG to PDF without uploading", "jpg-to-pdf-no-upload"],
      ["Multiple images to PDF", "tools/multi-image-pdf"],
      ["Multiple images to PDF without uploading", "multiple-images-to-pdf-no-upload"],
      ["Text to PDF converter", "tools/text-to-pdf"],
      ["Text to PDF converter without signup", "text-to-pdf-no-signup"],
      ["Sign-in sheet generator", "tools/sign-in-sheet"],
      ["Graph paper generator", "tools/graph-paper"],
      ["Packing list generator", "tools/packing-list"],
      ["To do list generator", "tools/todo-list"],
    ],
  },
  {
    title: "Business paperwork",
    description: "Clean PDF invoices, estimates, purchase orders, sale records, receipts, and timesheets for people who need a document now.",
    links: [
      ["Invoice generator", "tools/invoice-generator"],
      ["Free invoice generator without signup", "free-invoice-generator-no-signup"],
      ["Estimate generator", "tools/estimate-generator"],
      ["Purchase order generator", "tools/purchase-order"],
      ["Receipt generator", "tools/receipt-generator"],
      ["Free receipt generator without signup", "free-receipt-generator-no-signup"],
      ["Timesheet generator", "tools/timesheet-generator"],
      ["Weekly timesheet PDF without signup", "weekly-timesheet-pdf-no-signup"],
      ["Rent receipt generator", "tools/rent-receipt"],
    ],
  },
  {
    title: "Events and awards",
    description: "Printable certificates, sign-in sheets, and checklists for small events, classrooms, workshops, and clubs.",
    links: [
      ["Certificate generator", "tools/certificate-generator"],
      ["Free certificate maker without signup", "free-certificate-maker-no-signup"],
      ["Sign-in sheet generator", "tools/sign-in-sheet"],
      ["To do list generator", "tools/todo-list"],
    ],
  },
  {
    title: "Career documents",
    description: "Free resume, cover letter, and resignation letter PDFs for job seekers who need useful documents without a surprise paywall.",
    links: [
      ["Resume builder PDF", "tools/resume-builder"],
      ["Free resume builder without signup", "free-resume-builder-no-signup"],
      ["Cover letter generator", "tools/cover-letter"],
      ["Resignation letter generator", "tools/resignation-letter"],
      ["Free resume builder PDF guide", "guides/free-resume-builder-pdf"],
    ],
  },
];

const pages = [
  {
    path: "",
    title: "Free Printable PDF Generators",
    description: "Create image-to-PDF conversions, invoices, rent receipts, resumes, worksheets, charts, and planners as free printable PDF files.",
    html: `
      <section class="shell hero">
        <div>
          <h1>Make useful printable PDFs in under a minute.</h1>
          <p>Free browser-based generators for image conversion, text-to-PDF, invoices, receipts, timesheets, resumes, certificates, worksheets, sign-in sheets, graph paper, checklists, and planners. No account, no surprise download fee.</p>
          <div class="hero-actions">
            <a class="button" href="/free-pdf-tools/">Browse free PDF tools</a>
            <a class="button secondary" href="/tools/invoice-generator/">Create an invoice</a>
          </div>
          <div class="hero-proof" aria-label="Launch validation goals">
            <div class="proof-tile"><strong>26</strong><span>high-frequency tools</span></div>
            <div class="proof-tile"><strong>5/day</strong><span>free generations</span></div>
            <div class="proof-tile"><strong>52</strong><span>SEO-ready guides</span></div>
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
        <h2>Popular printable searches</h2>
        <div class="grid-2">
          ${keywordClusters.map(keywordClusterHtml).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Free printable tools</h2>
        <div class="cluster-links">
          ${landingPages.slice(0, 8).map((page) => `<a href="/${page.path}/">${escapeHtml(page.headline)}</a>`).join("")}
        </div>
        <ul>
          <li><a href="/tools/name-tracing/">Name Tracing Worksheet Generator</a></li>
          <li><a href="/tools/chore-chart/">Chore Chart Generator</a></li>
          <li><a href="/tools/reward-chart/">Reward Chart Generator</a></li>
          <li><a href="/tools/flashcards/">Flashcard Generator</a></li>
          <li><a href="/tools/weekly-planner/">Weekly Planner Generator</a></li>
          <li><a href="/tools/habit-tracker/">Habit Tracker Generator</a></li>
          <li><a href="/tools/invoice-generator/">Invoice Generator</a></li>
          <li><a href="/tools/estimate-generator/">Estimate Generator</a></li>
          <li><a href="/tools/purchase-order/">Purchase Order Generator</a></li>
          <li><a href="/tools/bill-of-sale/">Bill of Sale Generator</a></li>
          <li><a href="/tools/rent-receipt/">Rent Receipt Generator</a></li>
          <li><a href="/tools/resume-builder/">Resume Builder PDF</a></li>
          <li><a href="/tools/cover-letter/">Cover Letter Generator</a></li>
          <li><a href="/tools/resignation-letter/">Resignation Letter Generator</a></li>
          <li><a href="/tools/monthly-calendar/">Monthly Calendar Generator</a></li>
          <li><a href="/tools/meal-planner/">Meal Planner Generator</a></li>
          <li><a href="/tools/image-to-pdf/">Image to PDF Converter</a></li>
          <li><a href="/tools/multi-image-pdf/">Multiple Images to PDF Converter</a></li>
          <li><a href="/tools/text-to-pdf/">Text to PDF Converter</a></li>
          <li><a href="/tools/sign-in-sheet/">Sign-in Sheet Generator</a></li>
          <li><a href="/tools/graph-paper/">Graph Paper Generator</a></li>
          <li><a href="/tools/packing-list/">Packing List Generator</a></li>
          <li><a href="/tools/receipt-generator/">Receipt Generator</a></li>
          <li><a href="/tools/timesheet-generator/">Timesheet Generator</a></li>
          <li><a href="/tools/certificate-generator/">Certificate Generator</a></li>
          <li><a href="/tools/todo-list/">To Do List Generator</a></li>
        </ul>
      </section>`,
  },
  {
    path: "tools",
    title: "Free PDF Tools",
    description: "Browse free printable PDF tools for image conversion, business paperwork, career documents, calendars, meal planning, worksheets, and classroom routines.",
    html: toolsIndexHtml(),
  },
  {
    path: "free-pdf-tools",
    title: "Free PDF Tools Without Signup",
    description: "Start with free browser PDF tools for image conversion, text-to-PDF, invoices, receipts, timesheets, certificates, checklists, and printable pages.",
    html: freePdfToolsHtml(),
  },
  {
    path: "pdf-tool-finder",
    title: "Which Free PDF Tool Should I Use?",
    description: "Find the right free PDF generator for images, text, invoices, receipts, timesheets, resumes, certificates, checklists, graph paper, and event sheets.",
    html: pdfToolFinderHtml(),
  },
  ...landingPages.map((page) => ({
    path: page.path,
    title: page.title,
    description: page.description,
    html: landingPageHtml(page),
  })),
  {
    path: "guides",
    title: "Printable Guides",
    description: "Original guides for printable worksheets, charts, planners, flashcards, and classroom resources.",
    html: guideIndexHtml(),
  },
  {
    path: "dashboard",
    title: "Local Validation Dashboard",
    description: "Local browser dashboard for PrintableTools Lab validation events.",
    index: false,
    html: `<section class="shell section"><h1>Local validation dashboard</h1><p>This page shows local browser validation events after the app loads.</p></section>`,
  },
  {
    path: "about",
    title: "About PrintableTools Lab",
    description: "PrintableTools Lab makes quick, practical PDF generators for families, teachers, tutors, and home organizers.",
    html: `<article class="article-shell article"><h1>About PrintableTools Lab</h1><p>PrintableTools Lab makes useful printable pages fast to make, easy to print, and readable on ordinary home or school printers.</p><p>The current version focuses on practical browser-side PDF work: image conversion, business documents, career documents, planning pages, classroom resources, and household checklists.</p></article>`,
  },
  {
    path: "privacy",
    title: "Privacy Policy",
    description: "Privacy policy for PrintableTools Lab.",
    html: `<article class="article-shell article"><h1>Privacy Policy</h1><p>PrintableTools Lab generates PDFs in your browser. Ordinary PDF generation does not require an account and keeps form text on your device.</p><p>If you choose the optional AI idea helper, the current tool type and short form text are sent to the site's AI service only to return printable suggestions. Do not enter sensitive personal information.</p><p>The site stores local generation counts and validation events in your browser.</p></article>`,
  },
  {
    path: "terms",
    title: "Terms of Use",
    description: "Terms of use for PrintableTools Lab.",
    html: `<article class="article-shell article"><h1>Terms of Use</h1><p>The free printable generators are provided as-is for personal, classroom, and small-group use.</p><p>Do not use the tools to create unlawful, harmful, infringing, or misleading materials.</p></article>`,
  },
  {
    path: "license",
    title: "AI & License Disclosure",
    description: "How PrintableTools Lab handles generated content, design assets, and licensing.",
    html: `<article class="article-shell article"><h1>AI & License Disclosure</h1><p>PrintableTools Lab uses code-driven templates and may use AI assistance during product design, wording, and template ideation.</p><p>The default templates avoid third-party characters, trademarked brands, and protected artwork.</p></article>`,
  },
  {
    path: "roadmap",
    title: "PrintableTools Lab Roadmap",
    description: "A noindex roadmap for future PrintableTools Lab product decisions after the free version is validated.",
    index: false,
    html: `<article class="article-shell article"><h1>PrintableTools Lab Roadmap</h1><p>The current product focus is the free ad-supported printable tool site.</p><p>Paid features are intentionally deferred until the free tools show search traffic, downloads, and repeated usage.</p></article>`,
  },
  {
    path: "launch-kit",
    title: "Launch Kit",
    description: "Distribution copy, links, and validation steps for launching PrintableTools Lab.",
    index: false,
    html: `<article class="article-shell article"><h1>Launch Kit</h1><p>Use this page to coordinate the first distribution push. Share the homepage and tool links, then measure downloads and Search Console impressions.</p></article>`,
  },
];

const GUIDE_HINTS_FOR_LINKS = {
  "invoice-generator": ["invoice"],
  "estimate-generator": ["estimate", "quote"],
  "purchase-order": ["purchase order"],
  "bill-of-sale": ["bill of sale", "private sale"],
  "rent-receipt": ["rent receipt"],
  "resume-builder": ["resume", "ATS"],
  "cover-letter": ["cover letter"],
  "resignation-letter": ["resignation", "two weeks"],
  "monthly-calendar": ["monthly calendar", "calendar"],
  "meal-planner": ["meal planner", "meal plan", "grocery"],
  "image-to-pdf": ["image to PDF", "JPG to PDF"],
  "multi-image-pdf": ["multiple images", "image to PDF"],
  "text-to-pdf": ["text to PDF"],
  "sign-in-sheet": ["sign-in", "attendance sheet"],
  "graph-paper": ["graph paper", "quarter inch"],
  "packing-list": ["packing list", "travel checklist"],
  "receipt-generator": ["receipt"],
  "timesheet-generator": ["timesheet"],
  "certificate-generator": ["certificate"],
  "todo-list": ["to do list"],
  "name-tracing": ["name tracing", "preschool"],
  "chore-chart": ["chore", "routine", "job chart"],
  "reward-chart": ["reward", "sticker"],
  flashcards: ["flashcard"],
  "weekly-planner": ["weekly"],
  "habit-tracker": ["habit"],
};

const routes = [
  ...pages,
  ...tools.map((tool) => ({
    path: tool.path,
    title: tool.title,
    description: tool.description,
    html: toolHtml(tool),
  })),
  ...guides.map((guide) => ({
    path: guide.path,
    title: guide.title,
    description: guide.description,
    html: guideHtml(guide),
  })),
];

function renderRoute(route) {
  return {
    title: route.title,
    description: route.description,
    html: route.html,
    path: route.path,
  };
}

function siteUrl(pathName) {
  const suffix = pathName ? `/${pathName.replace(/^\/+|\/+$/g, "")}/` : "/";
  return `${BASE_URL}${suffix}`;
}

function toolHtml(tool) {
  const details = toolDetails(tool);
  const related = relatedGuideLinks(tool.path);
  return `
      <section class="shell tool-header">
        <a href="/tools/">All tools</a>
        <h1>${escapeHtml(tool.title)}</h1>
        <p class="lead">${escapeHtml(tool.description)}</p>
      </section>
      <section class="shell section">
        ${tool.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n")}
        <p><a class="button" href="/${tool.path}/">Open generator</a></p>
      </section>
      <section class="shell section">
        <h2>How to use this free PDF tool</h2>
        <ol>
          ${details.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("\n")}
        </ol>
      </section>
      <section class="shell section">
        <h2>Good use cases</h2>
        <div class="grid-3">
          ${details.useCases.map((item) => `<article class="panel"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></article>`).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Privacy and limits</h2>
        <p>${escapeHtml(details.privacy)}</p>
        <p>${escapeHtml(details.limit)}</p>
      </section>
      <section class="shell section">
        <h2>Frequently asked questions</h2>
        <div class="faq-list">
          ${details.faq.map((item) => `<details><summary>${escapeHtml(item.q)}</summary><p>${escapeHtml(item.a)}</p></details>`).join("\n")}
        </div>
        <p>${related.map((guide) => `<a class="tag" href="/${guide.path}/">${escapeHtml(guide.title)}</a>`).join(" ")}</p>
        ${jsonLdHtml(softwareSchema(tool))}
        ${jsonLdHtml(faqSchema(details.faq))}
      </section>`;
}

function toolsIndexHtml() {
  return `
      <section class="shell page-title section">
        <h1>Free PDF tools</h1>
        <p>Choose a browser-based generator for business paperwork, job applications, image conversion, text conversion, planning pages, classroom printables, event certificates, checklists, and family routines. Each tool creates a practical PDF without requiring an account.</p>
      </section>
      <section class="shell section">
        <h2>Tools by use case</h2>
        <div class="grid-2">
          ${keywordClusters.map(keywordClusterHtml).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>All generators</h2>
        <div class="grid-3">
          ${tools.map((tool) => `<article class="tool-card"><h3>${escapeHtml(tool.title)}</h3><p>${escapeHtml(tool.description)}</p><a class="button" href="/${tool.path}/">Open generator</a></article>`).join("\n")}
        </div>
        ${jsonLdHtml(itemListSchema("Free PDF tools", tools))}
      </section>`;
}

function freePdfToolsHtml() {
  const groups = [
    {
      title: "No-upload conversion tools",
      text: "Use these when a photo, scan, screenshot, or plain text note needs to become a PDF quickly. The image tools load files in the browser instead of uploading them to a converter server.",
      links: ["image-to-pdf", "multi-image-pdf", "text-to-pdf"],
    },
    {
      title: "Free business PDF tools",
      text: "Create simple paperwork for freelance jobs, small services, deposits, timesheets, private sales, rent payments, and vendor orders without opening a full accounting app.",
      links: ["invoice-generator", "estimate-generator", "purchase-order", "receipt-generator", "timesheet-generator", "bill-of-sale", "rent-receipt"],
    },
    {
      title: "Free career PDF tools",
      text: "Make a clean resume, cover letter, or resignation letter PDF without the common hidden export fee many document builders add at the end.",
      links: ["resume-builder", "cover-letter", "resignation-letter"],
    },
    {
      title: "Free printable planning tools",
      text: "Print simple one-page calendars, meal plans, checklists, graph paper, certificates, and routine pages for home, school, work, or events.",
      links: ["monthly-calendar", "meal-planner", "todo-list", "graph-paper", "certificate-generator", "sign-in-sheet", "packing-list"],
    },
  ];
  return `
      <section class="shell page-title section">
        <h1>Free PDF tools without signup</h1>
        <p>Open a browser-based generator, edit the sample fields, and download a practical PDF. No account, no surprise download fee, and no ad-click requirement.</p>
      </section>
      <section class="shell section">
        <h2>Start with the PDF job</h2>
        <div class="grid-2">
          ${groups.map((group) => `
            <article class="panel tool-directory">
              <h3>${escapeHtml(group.title)}</h3>
              <p>${escapeHtml(group.text)}</p>
              <div class="cluster-links">
                ${group.links.map((slug) => {
                  const tool = tools.find((item) => item.path === `tools/${slug}`);
                  return tool ? `<a href="/${tool.path}/">${escapeHtml(tool.title)}</a>` : "";
                }).join("")}
              </div>
            </article>
          `).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Why the tools are free</h2>
        <p>The validation version is free because the project is testing which PDF jobs attract real search traffic and repeat downloads. If ads are enabled later, they should sit away from generator controls and never become a condition for downloading.</p>
        <p>For privacy-sensitive jobs, avoid entering unnecessary personal details. Image conversion stays local in the browser; optional AI suggestions are limited to generic writing fields.</p>
      </section>
      <section class="shell section">
        <h2>All free PDF generators</h2>
        <div class="grid-3">
          ${tools.map((tool) => `<article class="tool-card"><h3>${escapeHtml(tool.title)}</h3><p>${escapeHtml(tool.description)}</p><a class="button" href="/${tool.path}/">Open generator</a></article>`).join("\n")}
        </div>
        ${jsonLdHtml(itemListSchema("Free PDF tools without signup", tools))}
      </section>`;
}

function pdfToolFinderHtml() {
  const rows = TOOL_FINDER_ROWS.map((row) => {
    const tool = tools.find((item) => item.path === row.toolPath);
    if (!tool) return "";
    return `
      <tr>
        <td>${escapeHtml(row.need)}</td>
        <td><a href="/${tool.path}/">${escapeHtml(tool.title)}</a></td>
        <td>${escapeHtml(row.why)}</td>
      </tr>`;
  }).join("\n");
  const businessTools = ["invoice-generator", "estimate-generator", "receipt-generator", "purchase-order", "bill-of-sale", "rent-receipt", "timesheet-generator"];
  const personalTools = ["resume-builder", "cover-letter", "resignation-letter", "certificate-generator", "todo-list", "packing-list", "monthly-calendar", "meal-planner"];
  return `
      <section class="shell page-title section">
        <h1>Which free PDF tool should I use?</h1>
        <p>Start with the job, not the template name. This finder points you to the free browser PDF generator that best matches the document you need right now.</p>
      </section>
      <section class="shell section">
        <h2>Quick PDF tool finder</h2>
        <table class="event-table">
          <thead><tr><th>What you need</th><th>Use this tool</th><th>Why it fits</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </section>
      <section class="shell section">
        <h2>Common choices</h2>
        <div class="grid-2">
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
        <h2>Business document tools</h2>
        <div class="cluster-links">
          ${businessTools.map((slug) => {
            const tool = tools.find((item) => item.path === `tools/${slug}`);
            return tool ? `<a href="/${tool.path}/">${escapeHtml(tool.title)}</a>` : "";
          }).join("")}
        </div>
      </section>
      <section class="shell section">
        <h2>Personal, school, and event tools</h2>
        <div class="cluster-links">
          ${personalTools.map((slug) => {
            const tool = tools.find((item) => item.path === `tools/${slug}`);
            return tool ? `<a href="/${tool.path}/">${escapeHtml(tool.title)}</a>` : "";
          }).join("")}
        </div>
      </section>
      <section class="shell section">
        <h2>Free tool limits</h2>
        <p>The tools are designed for fast one-page PDFs and simple records. They do not replace legal, tax, accounting, or employment advice. Review every document before sending or printing it.</p>
        <p>Ads are disabled during validation and should never be used as a condition for downloading a PDF.</p>
        ${jsonLdHtml(itemListSchema("PDF tool finder", TOOL_FINDER_ROWS.map((row) => tools.find((tool) => tool.path === row.toolPath)).filter(Boolean)))}
      </section>`;
}

function landingPageHtml(page) {
  const tool = tools.find((item) => item.path === page.primaryTool);
  const related = page.relatedTools
    .map((toolPath) => tools.find((item) => item.path === toolPath))
    .filter(Boolean);
  return `
      <section class="shell page-title section">
        <a href="/free-pdf-tools/">Free PDF tools</a>
        <h1>${escapeHtml(page.headline)}</h1>
        <p>${escapeHtml(page.lead)}</p>
        <p><a class="button" href="/${tool.path}/">Open ${escapeHtml(tool.shortTitle || tool.title)}</a> <a class="button secondary" href="/pdf-tool-finder/">Compare PDF tools</a></p>
      </section>
      <section class="shell section">
        <h2>Why this matches the search</h2>
        <div class="grid-3">
          <article class="panel"><h3>Intent</h3><p>${escapeHtml(page.intent)}</p></article>
          <article class="panel"><h3>No signup</h3><p>The free workflow starts in the browser and does not require an account before PDF export.</p></article>
          <article class="panel"><h3>Ad-safe</h3><p>Downloads are not gated behind ad clicks or ad views. Ads remain disabled until policy review and search visibility are ready.</p></article>
        </div>
      </section>
      ${page.sections.map(([heading, text]) => `
      <section class="shell section">
        <h2>${escapeHtml(heading)}</h2>
        <p>${escapeHtml(text)}</p>
      </section>`).join("\n")}
      <section class="shell section">
        <h2>Related free PDF tools</h2>
        <div class="grid-3">
          ${related.map((item) => `<article class="tool-card"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p><a class="button" href="/${item.path}/">Open generator</a></article>`).join("\n")}
        </div>
        ${jsonLdHtml(landingPageSchema(page, tool, related))}
      </section>`;
}

function softwareSchema(tool) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${tool.title} - PrintableTools Lab`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    url: siteUrl(tool.path),
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
  };
}

function faqSchema(faq) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

function itemListSchema(name, items) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      url: siteUrl(item.path),
    })),
  };
}

function landingPageSchema(page, tool, related) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: page.title,
    url: siteUrl(page.path),
    description: page.description,
    mainEntity: {
      "@type": "SoftwareApplication",
      name: tool.title,
      url: siteUrl(tool.path),
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    hasPart: related.map((item) => ({
      "@type": "SoftwareApplication",
      name: item.title,
      url: siteUrl(item.path),
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
    })),
  };
}

function toolDetails(tool) {
  const title = tool.title.replace(/\s+PDF$/, "");
  const shared = {
    steps: [
      `Open the ${title} and review the example text already in the form.`,
      "Replace the sample fields with your own short, accurate wording.",
      "Choose US Letter or A4 before generating if the tool offers paper size options.",
      "Preview the page, then download the PDF and review it before printing or sharing.",
    ],
    useCases: [
      {
        title: "One-off document",
        text: "Use the tool when you need a single clean PDF quickly and do not want to create an account.",
      },
      {
        title: "Printable copy",
        text: "The layout is designed for ordinary home or office printers with clear spacing and readable text.",
      },
      {
        title: "Fast first draft",
        text: "Start from the built-in example, then edit the wording so the final PDF matches your situation.",
      },
    ],
    privacy: "Most PDF generation happens in your browser. For tools with the optional AI idea helper, only limited non-sensitive writing fields are sent to the server for suggestions.",
    limit: "The free version is limited to one-page PDFs and a small daily generation count in the same browser while usage is validated.",
    faq: [
      {
        q: "Do I need an account?",
        a: "No. The generator opens in the browser and lets you download a PDF without creating an account.",
      },
      {
        q: "Is the PDF really free?",
        a: "Yes. The first version is free and does not hide the PDF export behind a checkout.",
      },
      {
        q: "Can I edit the PDF later?",
        a: "The simplest workflow is to edit the form fields and generate a fresh PDF. Keep your own copy of important documents.",
      },
    ],
  };
  const slug = tool.path.replace(/^tools\//, "");
  const overrides = {
    "invoice-generator": {
      useCases: [
        { title: "Freelance invoice", text: "Create a simple invoice for design, writing, consulting, repair, tutoring, or project work." },
        { title: "Small business service", text: "List service visits, materials, labor, or support time with quantity and rate." },
        { title: "Client payment record", text: "Use invoice numbers and payment terms so both sides know what is being requested." },
      ],
      faq: [
        { q: "Does this store invoices?", a: "No. Download the PDF and keep your own copy with your bookkeeping records." },
        { q: "Can I add payment instructions?", a: "Yes, use the note field, but only include payment details you are comfortable putting in a document." },
        { q: "Is it accounting software?", a: "No. It is a fast PDF generator for simple invoices, not bookkeeping or tax software." },
      ],
    },
    "estimate-generator": {
      useCases: [
        { title: "Service quote", text: "Prepare a clear quote for repair, consulting, freelance, or home service work." },
        { title: "Scope preview", text: "List the work and assumptions before creating a final invoice." },
        { title: "Client approval", text: "Give clients a one-page document they can review before work begins." },
      ],
    },
    "purchase-order": {
      useCases: [
        { title: "Vendor order", text: "Create a PO for supplies, materials, or small service purchases." },
        { title: "Internal approval", text: "Record what was approved before an invoice arrives." },
        { title: "Project buying", text: "List project items, quantities, unit prices, and requested delivery notes." },
      ],
    },
    "bill-of-sale": {
      privacy: "This tool creates a practical draft in your browser. Requirements vary by location and item type, especially for vehicles or regulated items.",
      useCases: [
        { title: "Private sale record", text: "Record the buyer, seller, item, price, date, and terms for a private sale." },
        { title: "Equipment transfer", text: "Document a transfer of tools, furniture, electronics, or equipment." },
        { title: "Signed handoff", text: "Print copies so both parties can sign after payment and item handoff." },
      ],
    },
    "rent-receipt": {
      useCases: [
        { title: "Cash rent record", text: "Create a dated receipt when rent is paid in cash or in person." },
        { title: "Tenant copy", text: "Give tenants a simple record of amount, date, property, and rental period." },
        { title: "Landlord files", text: "Keep a printable copy for household or property records." },
      ],
    },
    "resume-builder": {
      useCases: [
        { title: "Simple resume", text: "Build a clean one-page resume without decorative layouts or hidden export fees." },
        { title: "ATS-friendly draft", text: "Use a single-column structure with readable headings and normal text." },
        { title: "Quick application", text: "Create a practical first PDF when you need to apply soon and improve the wording later." },
      ],
      privacy: "Contact details, names, and work history are generated locally unless you choose to place generic text in the AI idea fields.",
    },
    "cover-letter": {
      useCases: [
        { title: "Last-minute application", text: "Write a concise cover letter when an application requires one before submission." },
        { title: "Role-specific draft", text: "Mention the role and company, then add a short strengths paragraph." },
        { title: "No signup export", text: "Avoid writing into a tool that asks for payment only after the letter is complete." },
      ],
      privacy: "Name and contact fields stay local. Use the AI idea helper only for generic wording, not private personal details.",
    },
    "resignation-letter": {
      useCases: [
        { title: "Two weeks notice", text: "State your resignation, final working day, appreciation, and handoff plan." },
        { title: "Professional handoff", text: "Keep the tone clear and neutral for workplace records." },
        { title: "Personal copy", text: "Download a PDF copy for your own records after sending or printing." },
      ],
      privacy: "This is a practical draft, not legal advice. Review employment policies and local requirements before sending.",
    },
    "monthly-calendar": {
      useCases: [
        { title: "Family schedule", text: "Track appointments, school events, bills, and household plans on one month page." },
        { title: "Student planner", text: "Mark assignments, exams, study blocks, and project deadlines." },
        { title: "Printable wall calendar", text: "Print a clean black-and-white calendar with enough writing space." },
      ],
    },
    "meal-planner": {
      useCases: [
        { title: "Weekly meals", text: "Plan breakfast, lunch, and dinner for each day of the week." },
        { title: "Grocery list", text: "Keep shopping items on the same page as the meal plan." },
        { title: "Budget planning", text: "Repeat ingredients across meals and leave a flexible dinner for leftovers." },
      ],
    },
    "image-to-pdf": {
      privacy: "Selected image files are loaded into the browser preview and are not uploaded by the converter.",
      limit: "The free version creates a one-page PDF from the selected images and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "JPG to PDF", text: "Turn a photo, screenshot, receipt, or scanned image into a one-page PDF." },
        { title: "No upload conversion", text: "Use the browser-side converter when an image may contain private information." },
        { title: "Gallery page", text: "Place up to four related images on one PDF page for quick sharing or printing." },
      ],
      faq: [
        { q: "Are images uploaded?", a: "No. The selected image is drawn into the PDF preview in your browser." },
        { q: "Which image formats work?", a: "The converter accepts common JPG, PNG, and WebP image files." },
        { q: "Can I add several images?", a: "Yes. Gallery mode places up to four images on one page." },
      ],
    },
    "multi-image-pdf": {
      privacy: "Selected image files are loaded into the browser preview and are not uploaded by the converter.",
      limit: "The free version exports up to eight selected images as a multi-page PDF and uses the same daily generation limit as the other tools.",
      useCases: [
        { title: "Receipts to PDF", text: "Combine several receipt photos into one PDF for a reimbursement or expense record." },
        { title: "Homework scan", text: "Turn several worksheet or homework photos into a single file." },
        { title: "No upload conversion", text: "Use browser-side conversion when the images may contain private information." },
      ],
      faq: [
        { q: "Are the images uploaded?", a: "No. The selected images are drawn into PDF pages in your browser." },
        { q: "How many images can I add?", a: "The free tool accepts up to eight images for one multi-page PDF." },
        { q: "Does each image get its own page?", a: "Yes. The export creates a multi-page PDF with one image per page." },
      ],
    },
    "text-to-pdf": {
      privacy: "Text is rendered into the PDF in your browser. Use the AI helper only for generic wording, not private or sensitive content.",
      useCases: [
        { title: "Plain notes", text: "Turn short notes, meeting summaries, or instructions into a clean PDF." },
        { title: "Letter draft", text: "Create a simple one-page letter without opening a heavier editor." },
        { title: "Printable instructions", text: "Paste a short process or checklist explanation for a quick handout." },
      ],
      faq: [
        { q: "Can I paste a long document?", a: "The first version is designed for a readable one-page PDF, so long text is trimmed in the preview." },
        { q: "Do I need to upload a text file?", a: "No. Paste text into the form and generate the PDF locally." },
        { q: "Can I choose a font size?", a: "Yes. Choose small, medium, or large text before generating the PDF." },
      ],
    },
    "sign-in-sheet": {
      useCases: [
        { title: "Event check-in", text: "Print a sign-in page for workshops, clubs, meetings, and community events." },
        { title: "Class attendance", text: "Use rows with names and signatures for classroom or tutoring attendance." },
        { title: "Visitor log", text: "Choose contact columns only when that information is genuinely needed." },
      ],
    },
    "graph-paper": {
      useCases: [
        { title: "Math practice", text: "Generate a clean grid page for graphing, arithmetic, notes, or classroom work." },
        { title: "Sketch planning", text: "Use quarter-inch or half-inch grids for layouts, room sketches, and craft planning." },
        { title: "Dot grid notes", text: "Choose dot grid for lighter planning pages or bullet-journal style notes." },
      ],
    },
    "packing-list": {
      useCases: [
        { title: "Travel checklist", text: "Plan clothing, toiletries, documents, electronics, and trip-specific items." },
        { title: "Family vacation", text: "Group shared items so the same charger, document, or medicine is not packed twice." },
        { title: "Business trip", text: "Create a focused list for work gear, documents, clothing, and personal essentials." },
      ],
    },
    "receipt-generator": {
      useCases: [
        { title: "Service receipt", text: "Create a simple receipt after a service payment or local job." },
        { title: "Deposit record", text: "Record a deposit amount, date, payment method, and description." },
        { title: "Reimbursement proof", text: "Make a printable receipt record for small reimbursements or shared expenses." },
      ],
      privacy: "The receipt is generated locally. Only generic description and note fields are eligible for optional AI suggestions.",
      faq: [
        { q: "Is this accounting software?", a: "No. It creates a simple printable receipt PDF and does not store bookkeeping records." },
        { q: "Can I use it for cash payments?", a: "Yes, choose cash or write another payment method, then keep signed copies as needed." },
        { q: "Does it store customer details?", a: "No. The tool runs in the browser and does not create an account or receipt archive." },
      ],
    },
    "timesheet-generator": {
      useCases: [
        { title: "Freelance hours", text: "Track day, project, hours, and notes for a client approval record." },
        { title: "Staff timesheet", text: "Create a printable weekly sheet for small teams that do not need payroll software." },
        { title: "Project log", text: "Group hours by project when you need a simple approval page." },
      ],
      faq: [
        { q: "Does the timesheet calculate totals?", a: "Yes. The PDF shows a total-hours line based on the rows you enter." },
        { q: "Can I use decimals?", a: "Yes. Hours such as 7.5 are supported." },
        { q: "Is it payroll software?", a: "No. It is a printable record only. Confirm hours and payroll rules separately." },
      ],
    },
    "certificate-generator": {
      useCases: [
        { title: "Classroom award", text: "Create a quick completion, participation, kindness, or reading certificate." },
        { title: "Workshop certificate", text: "Print an award or participation record after a small event." },
        { title: "Club recognition", text: "Make a simple printable certificate without buying a template pack." },
      ],
      faq: [
        { q: "Can I print it on regular paper?", a: "Yes. The design is built for ordinary US Letter or A4 paper." },
        { q: "Does it use copyrighted artwork?", a: "No. The default certificate uses simple code-driven borders and text." },
        { q: "Can I use it for official credentials?", a: "Only use it for events or recognition you are authorized to issue. It is not a licensing system." },
      ],
    },
    "todo-list": {
      useCases: [
        { title: "Daily checklist", text: "Print a short task list for errands, home projects, or focused work." },
        { title: "Event prep", text: "Group before, during, and after tasks for a small event or workshop." },
        { title: "Study session", text: "Break a study block into preparation, practice, and finish steps." },
      ],
      faq: [
        { q: "How should I enter sections?", a: "Use one line per section, such as Errands: grocery, post office, return item." },
        { q: "How many sections fit?", a: "The PDF shows up to six sections clearly on one page." },
        { q: "Can I use it every day?", a: "Yes. Edit the form and download a fresh one-page checklist whenever needed." },
      ],
    },
    "name-tracing": {
      useCases: [
        { title: "Preschool practice", text: "Create a familiar handwriting warmup using a child's name or short word." },
        { title: "Take-home page", text: "Print one simple worksheet for quick daily practice." },
        { title: "Letter confidence", text: "Use tracing lines and blank lines to build pencil control." },
      ],
    },
    "chore-chart": {
      useCases: [
        { title: "Family chores", text: "List weekly tasks and make progress visible with daily checkboxes." },
        { title: "Roommates", text: "Use one page for shared chores without needing another app." },
        { title: "Classroom jobs", text: "Assign helpers and rotate responsibilities across the week." },
      ],
    },
    "reward-chart": {
      useCases: [
        { title: "Sticker chart", text: "Track one clear behavior with a short, visible reward target." },
        { title: "Reading goal", text: "Use boxes for reading practice, bedtime routines, or kindness goals." },
        { title: "Classroom behavior", text: "Print a simple progress chart for a small group or individual student." },
      ],
    },
    flashcards: {
      useCases: [
        { title: "Vocabulary review", text: "Create cut-out cards for words, definitions, language practice, or memory games." },
        { title: "Classroom activity", text: "Print a small set for centers, tutoring, or homeschool practice." },
        { title: "Study deck starter", text: "Use one page to test a topic before creating a larger deck." },
      ],
    },
    "weekly-planner": {
      useCases: [
        { title: "Family week", text: "Plan appointments, errands, meals, school notes, and reminders." },
        { title: "Class planning", text: "Use day boxes for lessons, materials, or tutoring sessions." },
        { title: "Simple task view", text: "Keep one visible page for the week instead of a complicated planner app." },
      ],
    },
    "habit-tracker": {
      useCases: [
        { title: "Daily routines", text: "Track reading, water, walks, sleep routines, or practice habits." },
        { title: "Wellness check-in", text: "Use a simple grid to mark progress without turning it into a guilt chart." },
        { title: "Classroom practice", text: "Track repeatable student routines or reading goals." },
      ],
    },
  };
  return mergeDetails(shared, overrides[slug] || {});
}

function mergeDetails(base, override) {
  return {
    steps: override.steps || base.steps,
    useCases: override.useCases || base.useCases,
    privacy: override.privacy || base.privacy,
    limit: override.limit || base.limit,
    faq: override.faq || base.faq,
  };
}

function jsonLdHtml(payload) {
  return `<script type="application/ld+json">${escapeScript(JSON.stringify(payload))}</script>`;
}

function guideHtml(guide) {
  const slug = Object.keys(GUIDE_HINTS_FOR_LINKS).find((toolSlug) => {
    const hints = GUIDE_HINTS_FOR_LINKS[toolSlug] || [];
    return hints.some((hint) => guide.title.toLowerCase().includes(hint.toLowerCase()));
  });
  return `
      <article class="article-shell article">
        <a href="/guides/">All guides</a>
        <h1>${escapeHtml(guide.title)}</h1>
        <p class="lead">${escapeHtml(guide.description)}</p>
        <p>${escapeHtml(guide.intro)}</p>
        <h2>Use this guide with the free tools</h2>
        <p>PrintableTools Lab focuses on one-page PDFs that can be generated quickly, tested with real users, and improved based on downloads and Search Console data.</p>
        ${slug ? `<p><a class="button" href="/tools/${slug}/">Open related generator</a></p>` : ""}
      </article>`;
}

function guideIndexHtml() {
  return `
      <section class="shell page-title section">
        <h1>Printable guides</h1>
        <p>Short practical guides for parents, teachers, and organizers. These pages support real search intent while the tools validate demand.</p>
      </section>
      <section class="shell section">
        <h2>Search by use case</h2>
        <div class="grid-2">
          ${keywordClusters.map(keywordClusterHtml).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <div class="grid-3">
          ${guides.map((guide) => `<a class="guide-card" href="/${guide.path}/"><h3>${escapeHtml(guide.title)}</h3><p>${escapeHtml(guide.description)}</p></a>`).join("\n")}
        </div>
      </section>`;
}

function keywordClusterHtml(cluster) {
  return `<article class="panel keyword-cluster"><h3>${escapeHtml(cluster.title)}</h3><p>${escapeHtml(cluster.description)}</p><div class="cluster-links">${cluster.links.map(([label, href]) => `<a href="/${href}/">${escapeHtml(label)}</a>`).join("")}</div></article>`;
}

function relatedGuideLinks(toolPath) {
  const slug = toolPath.replace(/^tools\//, "");
  const hints = GUIDE_HINTS_FOR_LINKS[slug] || [];
  return guides.filter((guide) => hints.some((hint) => guide.title.toLowerCase().includes(hint.toLowerCase()))).slice(0, 3);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeScript(value) {
  return String(value).replace(/</g, "\\u003c");
}

module.exports = { routes, renderRoute, siteUrl, tools, guides, keywordClusters, landingPages, SITE_SUMMARY, HIGH_INTENT_TOOL_PATHS, HIGH_INTENT_LANDING_PATHS };
