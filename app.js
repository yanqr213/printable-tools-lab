(function () {
  "use strict";

  const SITE = {
    name: "PrintableTools Lab",
    dailyLimit: 5,
    premiumUrl: "/premium-waitlist/",
  };

  const CONFIG = Object.assign({
    siteUrl: window.location.origin,
    googleSiteVerification: "",
    googleAnalyticsId: "",
    adsenseClientId: "",
    premiumCheckoutUrl: "",
    contactEmail: "",
    enableAds: false,
    enableAnalytics: false,
    enablePremiumCheckout: false,
  }, window.PTL_CONFIG || {});

  if (CONFIG.enablePremiumCheckout && CONFIG.premiumCheckoutUrl) {
    SITE.premiumUrl = CONFIG.premiumCheckoutUrl;
  }

  bootstrapConfiguredIntegrations();

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
      icon: "✓",
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
      icon: "★",
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
  };

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
      slug: "watermark-free-printables-when-to-upgrade",
      title: "When watermark-free printables are worth it",
      description: "Understand when a free printable is enough and when a clean classroom or commercial copy is worth paying for.",
      content: [
        ["h2", "Free is enough for quick home use"],
        ["p", "A light watermark is usually fine for one-time home practice. It helps keep free tools sustainable while still giving families a usable page."],
        ["h2", "Upgrade for repeated use"],
        ["p", "Watermark-free versions make sense for classroom packets, therapy folders, tutoring materials, or any printable that will be used repeatedly with many children."],
      ],
    },
  ];

  const pages = {
    about: {
      title: "About PrintableTools Lab",
      description: "PrintableTools Lab makes quick, practical PDF generators for families, teachers, tutors, and home organizers.",
      body: [
        ["p", "PrintableTools Lab is built around a simple idea: useful printable pages should be fast to make, easy to print, and readable on ordinary home or school printers."],
        ["p", "The first version focuses on name tracing worksheets, chore charts, and reward charts because these have clear everyday use cases and can be generated without storing personal data on a server."],
        ["p", "The free tools run in the browser. We use a light watermark and a daily generation limit while the project validates demand and prepares for responsible advertising."],
      ],
    },
    privacy: {
      title: "Privacy Policy",
      description: "Privacy policy for PrintableTools Lab.",
      body: [
        ["p", "PrintableTools Lab is designed to generate PDFs in your browser. The first version does not require an account and does not send your worksheet text to a server."],
        ["p", "The site stores a small amount of local data in your browser to remember daily generation counts and anonymous local event totals such as page views, generate clicks, downloads, and upgrade clicks."],
        ["p", "If analytics, advertising, or payment tools are added later, this policy should be updated before launch to describe those providers, cookies, and opt-out choices."],
      ],
    },
    terms: {
      title: "Terms of Use",
      description: "Terms of use for PrintableTools Lab.",
      body: [
        ["p", "The free printable generators are provided as-is for personal, classroom, and small-group use. You are responsible for checking that a generated worksheet is appropriate before giving it to a child or group."],
        ["p", "Do not use the tools to create unlawful, harmful, infringing, or misleading materials. Do not remove service marks from free downloads unless a watermark-free option is explicitly provided."],
        ["p", "Commercial resale of generated pages as standalone products is not allowed in the free version. Paid licensing terms may be added if premium versions are launched."],
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
    "premium-waitlist": {
      title: "Premium tools are not open yet",
      description: "The free version is validating demand before any paid plan is launched.",
      body: [
        ["p", "PrintableTools Lab is currently in a zero-cost validation phase. Premium features such as watermark-free PDFs, batch generation, and classroom template bundles are planned only if users show real demand."],
        ["p", "For now, this button records local upgrade interest in your browser. On a live site, it can be replaced with an email waitlist or a no-monthly-fee checkout link after validation gates are met."],
      ],
    },
    "launch-kit": {
      title: "Launch Kit",
      description: "Distribution copy, links, and validation steps for launching PrintableTools Lab.",
      body: [
        ["p", "Use this page to coordinate the first distribution push. The goal is not to look busy; it is to create enough real traffic for Search Console, AdSense readiness, and upgrade-click validation."],
        ["h2", "Primary links"],
        ["ul", ["Homepage: https://printable-tools-lab.pages.dev/", "Name tracing: https://printable-tools-lab.pages.dev/tools/name-tracing/", "Chore chart: https://printable-tools-lab.pages.dev/tools/chore-chart/", "Reward chart: https://printable-tools-lab.pages.dev/tools/reward-chart/", "Sitemap: https://printable-tools-lab.pages.dev/sitemap.xml"]],
        ["h2", "First distribution copy"],
        ["p", "Free printable PDF makers for parents and teachers: create a name tracing worksheet, chore chart, or reward chart in your browser. No account required."],
        ["p", "Try the free name tracing worksheet generator: enter a name, choose A4 or US Letter, and download a printable PDF in under a minute."],
        ["p", "Need a quick chore chart for kids? This free generator makes a one-page weekly PDF with checkboxes for every day."],
        ["h2", "Do not do this"],
        ["ul", ["Do not ask anyone to click ads.", "Do not submit to AdSense before Search Console sees public pages.", "Do not buy traffic before tool usage proves basic conversion."]],
      ],
    },
  };

  window.PRINTABLE_TOOLS_LAB_ROUTES = {
    tools,
    guides,
    pages,
  };

  const app = document.getElementById("app");
  let currentToolState = null;

  function route() {
    const hash = window.location.hash.replace(/^#\/?/, "");
    const path = hash || window.location.pathname.replace(/^\/+|\/+$/g, "");
    const parts = path.split("/").filter(Boolean);
    if (!parts.length) return renderHome();
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
    track("page_view", { path: getCurrentRoutePath() });
    window.scrollTo(0, 0);
    app.focus({ preventScroll: true });
  }

  function setMetaTag(name, content) {
    const el = document.querySelector(`meta[name="${name}"]`);
    if (el) el.setAttribute("content", content);
  }

  function setMetaProperty(property, content) {
    const el = document.querySelector(`meta[property="${property}"]`);
    if (el) el.setAttribute("content", content);
  }

  function renderHome() {
    setMeta("Free Printable PDF Generators", "Create name tracing worksheets, chore charts, and reward charts as free printable PDF files.");
    app.innerHTML = `
      <section class="shell hero">
        <div>
          <h1>Make useful printable PDFs in under a minute.</h1>
          <p>Free browser-based generators for name tracing worksheets, chore charts, and reward charts. No account, no server upload, no design software.</p>
          <div class="hero-actions">
            <a class="button" href="/tools/name-tracing/">Start with name tracing</a>
            <a class="button secondary" href="/guides/">Read printable guides</a>
          </div>
          <div class="hero-proof" aria-label="Launch validation goals">
            <div class="proof-tile"><strong>3</strong><span>high-frequency tools</span></div>
            <div class="proof-tile"><strong>5/day</strong><span>free generations</span></div>
            <div class="proof-tile"><strong>12</strong><span>SEO-ready guides</span></div>
          </div>
        </div>
        <div class="hero-preview" aria-hidden="true">
          <div class="paper-stack">
            <div class="sample-sheet">
              <h2>Weekly Chore Chart</h2>
              <div class="sample-lines">
                <div class="sample-line"></div>
                <div class="sample-line"></div>
                <div class="sample-line"></div>
                <div class="sample-line"></div>
                <div class="sample-line"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="shell section">
        <div class="section-head">
          <div>
            <h2>Free printable tools</h2>
            <p>Each tool creates a one-page PDF in your browser. The free version includes a small footer watermark while the project validates demand.</p>
          </div>
          <a class="button ghost" href="/dashboard/">View local data</a>
        </div>
        <div class="grid-3">${Object.values(tools).map(toolCard).join("")}</div>
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
          <div class="panel"><h3>Responsible ads later</h3><p>Ad spaces are separated from buttons and never require users to click or watch ads to download.</p></div>
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

  function guideCard(guide) {
    return `
      <a class="guide-card" href="/guides/${guide.slug}/">
        <h3>${escapeHtml(guide.title)}</h3>
        <p>${escapeHtml(guide.description)}</p>
        <span class="tag">${guide.tool ? tools[guide.tool].shortTitle : "Printable guide"}</span>
      </a>
    `;
  }

  function renderTool(id) {
    const tool = tools[id];
    setMeta(tool.title, tool.description);
    const count = getDailyCount();
    app.innerHTML = `
      <section class="shell tool-header">
        <a href="/">← All tools</a>
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
              <button class="button secondary" type="button" id="refreshPreview">Refresh preview</button>
            </div>
            <p class="help">The free version creates one page and adds a small footer watermark. Daily limits are stored locally in this browser.</p>
          </form>
          <div id="limitNotice" class="notice" hidden></div>
        </aside>
        <div class="preview-wrap">
          <div class="preview-toolbar">
            <div>
              <h2>Live preview</h2>
              <p class="help">Preview is rendered as the same canvas used for the PDF export.</p>
            </div>
            <a class="button ghost premium-click" href="${escapeHtml(SITE.premiumUrl)}" data-premium-source="${tool.id}">${CONFIG.enablePremiumCheckout ? "Remove watermark" : "Remove watermark later"}</a>
          </div>
          <div class="preview-stage">
            <canvas id="previewCanvas" class="preview-canvas" width="1275" height="1650" aria-label="Printable PDF preview"></canvas>
          </div>
          <div class="placeholder-ad" role="note">Future ad placement: content-adjacent only, never blocking the download button.</div>
          <div class="callout">
            <strong>Validation gate:</strong> continue this tool if it gets repeated downloads, upgrade clicks, or search traffic within the 30-day checkpoint.
          </div>
        </div>
      </section>
      <section class="shell section">
        <div class="section-head">
          <div>
            <h2>Related guides</h2>
            <p>These pages make the tool more useful and provide crawlable content for future AdSense review.</p>
          </div>
        </div>
        <div class="grid-3">${guides.filter((g) => g.tool === id).concat(guides.filter((g) => !g.tool).slice(0, 2)).slice(0, 3).map(guideCard).join("")}</div>
      </section>
    `;
    bindTool(tool);
  }

  function renderField(field, value) {
    const common = `id="${field.id}" name="${field.id}" ${field.maxLength ? `maxlength="${field.maxLength}"` : ""}`;
    const help = field.help ? `<span class="help">${escapeHtml(field.help)}</span>` : "";
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
    const limitCounter = document.getElementById("limitCounter");
    const notice = document.getElementById("limitNotice");
    currentToolState = { tool, form, canvas };

    const draw = () => {
      const values = getFormValues(form);
      renderCanvas(tool, canvas, values);
    };

    form.addEventListener("input", draw);
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
      draw();
      const values = getFormValues(form);
      const filename = `${tool.id}-${slugify(values.name || values.title || "printable")}.pdf`;
      const pdf = canvasToPdf(canvas, filename);
      downloadBlob(pdf, filename);
      incrementDailyCount();
      const remaining = SITE.dailyLimit - getDailyCount();
      limitCounter.textContent = `${remaining} free left today`;
      track("generate_pdf", { tool: tool.id });
      track("download_pdf", { tool: tool.id });
    });
    document.querySelectorAll(".premium-click").forEach((link) => {
      link.addEventListener("click", () => track("premium_click", { source: link.dataset.premiumSource || tool.id }));
    });
    draw();
  }

  function renderGuides() {
    setMeta("Printable Guides", "Original guides for printable worksheets, charts, planners, flashcards, and classroom resources.");
    app.innerHTML = `
      <section class="shell page-title section">
        <h1>Printable guides</h1>
        <p>Short practical guides for parents, teachers, and organizers. These pages support real search intent while the tools validate demand.</p>
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
        <a href="/guides/">← All guides</a>
        <h1>${escapeHtml(guide.title)}</h1>
        <p class="lead">${escapeHtml(guide.description)}</p>
        ${guide.tool ? `<p><a class="button" href="/tools/${guide.tool}/">Open ${escapeHtml(tools[guide.tool].shortTitle)}</a></p>` : ""}
        <div class="placeholder-ad">Future ad placement after AdSense approval. This slot is separated from core actions.</div>
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
        ${key === "premium-waitlist" ? `<p><button class="button" id="recordPremium">Record local upgrade interest</button></p>` : ""}
      </article>
    `;
    const premium = document.getElementById("recordPremium");
    if (premium) {
      premium.addEventListener("click", () => {
        track("premium_click", { source: "waitlist_page" });
        premium.textContent = "Recorded locally";
        premium.disabled = true;
      });
    }
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
          <div class="metric-tile"><strong>${totals.premium_click || 0}</strong><span>upgrade clicks</span></div>
        </div>
        <div class="panel">
          <h2>Validation gates</h2>
          <p><strong>30-day continue gate:</strong> 100 PDF downloads, 300 tool generations, or 20 premium clicks. If no search exposure or downloads after 60 days, pause this track and test HTML5 game distribution.</p>
          <p><strong>Configured integrations:</strong> Analytics ${CONFIG.enableAnalytics && CONFIG.googleAnalyticsId ? "on" : "off"}, AdSense ${CONFIG.enableAds && CONFIG.adsenseClientId ? "on" : "off"}, Premium checkout ${CONFIG.enablePremiumCheckout && CONFIG.premiumCheckoutUrl ? "on" : "off"}.</p>
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

  function getFormValues(form) {
    const data = new FormData(form);
    return Object.fromEntries(data.entries());
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
    drawWatermark(ctx, paper);
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

  function drawPageFrame(ctx, paper, accent) {
    ctx.strokeStyle = accent;
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, paper.width - 80, paper.height - 80);
    ctx.strokeStyle = "rgba(23,49,59,0.16)";
    ctx.lineWidth = 2;
    ctx.strokeRect(58, 58, paper.width - 116, paper.height - 116);
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
    ctx.save();
    ctx.font = font || "24px Arial";
    ctx.fillStyle = color || "#17313b";
    ctx.textAlign = "left";
    const words = sanitizePrintable(text).split(/\s+/).filter(Boolean);
    let lineText = "";
    let lines = 0;
    for (let i = 0; i < words.length; i += 1) {
      const test = lineText ? `${lineText} ${words[i]}` : words[i];
      if (ctx.measureText(test).width > maxWidth && lineText) {
        ctx.fillText(lineText, x, y + lines * lineHeight);
        lines += 1;
        lineText = words[i];
        if (maxLines && lines >= maxLines) break;
      } else {
        lineText = test;
      }
    }
    if (lineText && (!maxLines || lines < maxLines)) ctx.fillText(lineText, x, y + lines * lineHeight);
    ctx.restore();
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
    }
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
