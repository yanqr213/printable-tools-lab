const BASE_URL = (process.env.PUBLIC_SITE_URL || "https://printable-tools-lab.pages.dev").replace(/\/+$/, "");

const tools = [
  {
    path: "tools/name-tracing",
    title: "Name Tracing Worksheet Generator",
    description: "Create a free one-page name tracing worksheet PDF for preschool and kindergarten handwriting practice.",
    body: [
      "Enter a name or short word, choose US Letter or A4, and download a printable worksheet with tracing lines and a small drawing prompt.",
      "The free version is intentionally limited to one page and includes a light PrintableTools Lab footer watermark while the project validates demand.",
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
      "The free PDF includes one page with a light watermark while the product validates which free chart formats get real downloads.",
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
    title: "Business paperwork",
    description: "Clean PDF invoices, estimates, purchase orders, sale records, and receipts for people who need a document now.",
    links: [
      ["Invoice generator", "tools/invoice-generator"],
      ["Estimate generator", "tools/estimate-generator"],
      ["Purchase order generator", "tools/purchase-order"],
      ["Rent receipt generator", "tools/rent-receipt"],
    ],
  },
  {
    title: "Career documents",
    description: "Free resume, cover letter, and resignation letter PDFs for job seekers who need useful documents without a surprise paywall.",
    links: [
      ["Resume builder PDF", "tools/resume-builder"],
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
    description: "Create invoices, rent receipts, resumes, worksheets, charts, and planners as free printable PDF files.",
    html: `
      <section class="shell hero">
        <div>
          <h1>Make useful printable PDFs in under a minute.</h1>
          <p>Free browser-based generators for invoices, rent receipts, resumes, worksheets, chore charts, and planners. No account, no surprise download fee.</p>
          <div class="hero-actions">
            <a class="button" href="/tools/invoice-generator/">Create an invoice</a>
            <a class="button secondary" href="/guides/">Read printable guides</a>
          </div>
          <div class="hero-proof" aria-label="Launch validation goals">
            <div class="proof-tile"><strong>16</strong><span>high-frequency tools</span></div>
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
        <h2>Popular printable searches</h2>
        <div class="grid-2">
          ${keywordClusters.map(keywordClusterHtml).join("\n")}
        </div>
      </section>
      <section class="shell section">
        <h2>Free printable tools</h2>
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
        </ul>
      </section>`,
  },
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
    html: `<article class="article-shell article"><h1>About PrintableTools Lab</h1><p>PrintableTools Lab makes useful printable pages fast to make, easy to print, and readable on ordinary home or school printers.</p><p>The first version focuses on name tracing worksheets, chore charts, and reward charts because these have clear everyday use cases and can be generated without storing personal data on a server.</p></article>`,
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
  return `
      <section class="shell tool-header">
        <a href="/">All tools</a>
        <h1>${escapeHtml(tool.title)}</h1>
        <p class="lead">${escapeHtml(tool.description)}</p>
      </section>
      <section class="shell section">
        ${tool.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n")}
        <p><a class="button" href="/${tool.path}/">Open generator</a></p>
        <p>${relatedGuideLinks(tool.path).map((guide) => `<a class="tag" href="/${guide.path}/">${escapeHtml(guide.title)}</a>`).join(" ")}</p>
      </section>`;
}

function guideHtml(guide) {
  return `
      <article class="article-shell article">
        <a href="/guides/">All guides</a>
        <h1>${escapeHtml(guide.title)}</h1>
        <p class="lead">${escapeHtml(guide.description)}</p>
        <p>${escapeHtml(guide.intro)}</p>
        <h2>Use this guide with the free tools</h2>
        <p>PrintableTools Lab focuses on one-page PDFs that can be generated quickly, tested with real users, and improved based on downloads and Search Console data.</p>
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
  const guideHints = {
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
    "name-tracing": ["name tracing", "preschool"],
    "chore-chart": ["chore", "routine", "job chart"],
    "reward-chart": ["reward", "sticker"],
    flashcards: ["flashcard"],
    "weekly-planner": ["weekly"],
    "habit-tracker": ["habit"],
  };
  const hints = guideHints[slug] || [];
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

module.exports = { routes, renderRoute, siteUrl };
