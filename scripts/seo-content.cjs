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
      "The free PDF includes one page with a light watermark. If usage data supports it, the Pro cloud service can later add saved projects and batch generation.",
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
      "Habit trackers are a high-intent printable category that can later support Pro features such as saved projects, higher limits, or affiliate links for planners and stationery.",
    ],
  },
];

const guides = [
  ["guides/free-printable-name-tracing-worksheet-maker", "Free printable name tracing worksheet maker", "How to create a readable name tracing page for preschool and kindergarten handwriting practice.", "A name tracing page works best as a short, familiar writing warmup. Children already recognize their own name, so the page can focus on letter direction, pencil control, spacing, and confidence."],
  ["guides/free-chore-chart-generator-for-kids", "Free chore chart generator for kids", "Make a printable weekly chore chart that children can understand without a complicated app.", "A printed chore chart turns family expectations into something visible. It works especially well for younger children because they can check boxes and see progress across the week."],
  ["guides/free-reward-chart-generator", "Free reward chart generator", "Create a printable sticker chart for goals, habits, classroom behavior, or family routines.", "A reward chart is strongest when it tracks one clear behavior. Name the exact action and choose a realistic number of boxes before the reward."],
  ["guides/printable-routine-chart-for-mornings", "Printable morning routine chart ideas", "Simple morning chart layouts that help kids move from wake-up to school without constant reminders.", "A morning chart works when each step is short, visible, and in the order it happens. Good first steps include get dressed, brush teeth, eat breakfast, pack bag, and shoes on."],
  ["guides/weekly-family-planner-printable", "How to build a weekly family planner printable", "Plan meals, school events, chores, and appointments on one printable weekly page.", "A family planner should reduce coordination, not become a second calendar system. Use it for the few decisions everyone needs to see."],
  ["guides/classroom-label-generator-ideas", "Classroom label generator ideas", "Use printable labels for bins, centers, cubbies, small groups, and take-home folders.", "The best classroom labels are easy to scan. Use a consistent size, strong contrast, and short nouns."],
  ["guides/habit-tracker-printable-for-beginners", "Habit tracker printable for beginners", "Create a printable habit tracker that tracks progress without turning into a guilt chart.", "A beginner habit tracker should track one to three behaviors. Too many boxes make the page look impressive but harder to keep using."],
  ["guides/flashcard-generator-printable-guide", "Printable flashcard generator guide", "Make flashcards that are easy to cut, review, and reuse for vocabulary or classroom games.", "Printable flashcards should have clear cut lines, enough margin, and a predictable card size. Leave extra white space if children will draw or color on the cards."],
  ["guides/printable-worksheets-for-preschool-at-home", "Printable worksheets for preschool at home", "A practical way to use short printable pages without overloading young children.", "Preschool worksheets work best when they are quick, concrete, and connected to a real routine. A five-minute page can support a habit."],
  ["guides/black-and-white-printable-design-tips", "Black-and-white printable design tips", "Design worksheets and charts that still look clear on a basic home printer.", "Most printable pages are used on ordinary printers. Strong borders, readable headings, and clean spacing matter more than color fills."],
  ["guides/a4-vs-us-letter-printable-guide", "A4 vs US Letter for printable PDFs", "Choose the right paper size for families, schools, and international downloads.", "US Letter is common in the United States and Canada, while A4 is common in many other countries. Offering both sizes reduces printing frustration."],
  ["guides/batch-printable-generator-for-classrooms", "When batch printable generation is worth it", "Understand when a free one-page printable is enough and when cloud batch generation saves real prep time.", "Teachers, tutors, and homeschool families often need many personalized pages at once. A cloud Pro version can save names, generate batches, keep projects, and remove repeated setup work."],
  ["guides/free-weekly-planner-generator", "Free weekly planner generator", "Create a printable weekly planner for family schedules, classroom planning, errands, and meal notes.", "A weekly planner should show only the decisions that need to stay visible: appointments, meals, tasks, and reminders. One printable page is enough for a lightweight planning loop."],
  ["guides/free-habit-tracker-generator", "Free habit tracker generator", "Build a simple habit tracker printable for routines, reading goals, wellness habits, or classroom practice.", "A habit tracker works best when it tracks a few repeatable behaviors. A simple grid is easier to keep using than a heavily decorated page with too many categories."],
].map(([path, title, description, intro]) => ({ path, title, description, intro }));

const pages = [
  {
    path: "",
    title: "Free Printable PDF Generators",
    description: "Create name tracing worksheets, chore charts, and reward charts as free printable PDF files.",
    html: `
      <section class="shell hero">
        <div>
          <h1>Make useful printable PDFs in under a minute.</h1>
          <p>Free browser-based generators for name tracing worksheets, chore charts, and reward charts. No account, no server upload, no design software.</p>
          <div class="hero-actions">
            <a class="button" href="/tools/name-tracing/">Start with name tracing</a>
            <a class="button secondary" href="/guides/">Read printable guides</a>
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
        <h2>Free printable tools</h2>
        <ul>
          <li><a href="/tools/name-tracing/">Name Tracing Worksheet Generator</a></li>
          <li><a href="/tools/chore-chart/">Chore Chart Generator</a></li>
          <li><a href="/tools/reward-chart/">Reward Chart Generator</a></li>
          <li><a href="/tools/flashcards/">Flashcard Generator</a></li>
          <li><a href="/tools/weekly-planner/">Weekly Planner Generator</a></li>
          <li><a href="/tools/habit-tracker/">Habit Tracker Generator</a></li>
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
    html: `<article class="article-shell article"><h1>Privacy Policy</h1><p>PrintableTools Lab generates PDFs in your browser. The first version does not require an account and does not send worksheet text to a server.</p><p>The site stores local generation counts and validation events in your browser.</p></article>`,
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
    path: "pro",
    title: "PrintableTools Pro",
    description: "Cloud printable generation for teachers, tutors, homeschool families, and busy parents who need batch PDFs and saved projects.",
    index: false,
    html: `<article class="article-shell article"><h1>PrintableTools Pro</h1><p>PrintableTools Pro is the planned cloud service layer for users who outgrow one-page free generation.</p><p>The first paid service should unlock saved projects, batch generation, no-watermark exports, and more daily PDFs instead of selling a downloadable template pack.</p></article>`,
  },
  {
    path: "launch-kit",
    title: "Launch Kit",
    description: "Distribution copy, links, and validation steps for launching PrintableTools Lab.",
    index: false,
    html: `<article class="article-shell article"><h1>Launch Kit</h1><p>Use this page to coordinate the first distribution push. Share the homepage and tool links, then measure downloads, Search Console impressions, and Pro clicks.</p></article>`,
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
        <p>PrintableTools Lab focuses on one-page PDFs that can be generated quickly, tested with real users, and improved based on download and Pro-click data.</p>
      </article>`;
}

function guideIndexHtml() {
  return `
      <section class="shell page-title section">
        <h1>Printable guides</h1>
        <p>Short practical guides for parents, teachers, and organizers. These pages support real search intent while the tools validate demand.</p>
      </section>
      <section class="shell section">
        <div class="grid-3">
          ${guides.map((guide) => `<a class="guide-card" href="/${guide.path}/"><h3>${escapeHtml(guide.title)}</h3><p>${escapeHtml(guide.description)}</p></a>`).join("\n")}
        </div>
      </section>`;
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
