/* ==========================================================================
   Jinu J Saju — Portfolio
   Vanilla JS: DOM rendering from data, event-driven UI, regex form
   validation, and localStorage persistence.
   ========================================================================== */

// ---------- Project data (B1: array of objects, rendered via DOM) ----------
const projects = [
  {
    id: "deepsea",
    title: "Deep Sea — Fisherman Safety Mesh",
    description:
      "Long-range LoRa + GPS mesh network giving fishing vessels real-time tracking and emergency distress alerts in zones with no internet access.",
    image: "images/project-deepsea.svg",
    tags: ["LoRa", "GPS", "IoT", "Embedded Systems"],
    repo: "https://github.com/JinuSaju",
    demo: null,
  },
  {
    id: "orthoclinic",
    title: "Ortho Clinic Mangalore Website",
    description:
      "Responsive healthcare site for an orthopedic clinic with doctor profiles, service pages, WhatsApp booking, and Google Maps integration.",
    image: "images/project-orthoclinic.svg",
    tags: ["HTML5", "CSS3", "JavaScript", "Google Maps API"],
    repo: "https://github.com/JinuSaju",
    demo: null,
  },
  {
    id: "library",
    title: "Library Management System",
    description:
      "MERN-stack platform with authentication, CRUD operations, and RESTful APIs to manage books, users, and issue/return transactions.",
    image: "images/project-library.svg",
    tags: ["MongoDB", "Express.js", "React.js", "Node.js", "Nodemailer"],
    repo: "https://github.com/JinuSaju",
    demo: null,
  },
];

// ---------- Storage keys ----------
const THEME_KEY = "jjs-portfolio-theme";
const SAVED_KEY = "jjs-portfolio-saved-projects";

// ============================================================
// Render projects (data → DOM), with tag filtering
// ============================================================
const projectGrid = document.getElementById("projectGrid");
const filterBar = document.getElementById("filterBar");

const getSavedIds = () => {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY)) ?? [];
  } catch {
    return [];
  }
};

const toggleSaved = (id) => {
  const saved = getSavedIds();
  const next = saved.includes(id) ? saved.filter((s) => s !== id) : [...saved, id];
  localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  return next;
};

const renderProjects = (list) => {
  const savedIds = getSavedIds();

  projectGrid.innerHTML = list
    .map(({ id, title, description, image, tags, repo, demo }) => `
      <article class="project-card" data-id="${id}">
        <div class="project-thumb">
          <img src="${image}" alt="${title} preview graphic" loading="lazy">
        </div>
        <div class="project-body">
          <h3>${title}</h3>
          <p>${description}</p>
          <div class="project-tags">
            ${tags.map((tag) => `<span>${tag}</span>`).join("")}
          </div>
          <div class="project-links">
            ${repo ? `<a href="${repo}" target="_blank" rel="noopener">Repository ↗</a>` : ""}
            ${demo ? `<a href="${demo}" target="_blank" rel="noopener">Live demo ↗</a>` : ""}
            <a href="#contact">Ask about this ↗</a>
          </div>
          <button type="button" class="save-btn ${savedIds.includes(id) ? "is-saved" : ""}" data-save="${id}">
            ${savedIds.includes(id) ? "★ Saved" : "☆ Save project"}
          </button>
        </div>
      </article>
    `)
    .join("");
};

const renderFilters = () => {
  const allTags = [...new Set(projects.flatMap((p) => p.tags))];
  const tagsToShow = ["All", ...allTags.slice(0, 6)];

  filterBar.innerHTML = tagsToShow
    .map(
      (tag, i) =>
        `<button type="button" class="filter-btn ${i === 0 ? "is-active" : ""}" data-tag="${tag}">${tag}</button>`
    )
    .join("");
};

// Event delegation: filter buttons (B2: event handling — project filter)
filterBar?.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;

  filterBar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("is-active"));
  btn.classList.add("is-active");

  const { tag } = btn.dataset;
  const filtered = tag === "All" ? projects : projects.filter((p) => p.tags.includes(tag));
  renderProjects(filtered);
});

// Event delegation: save/favourite a project (B4: localStorage persistence)
projectGrid?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-save]");
  if (!btn) return;

  const id = btn.dataset.save;
  const saved = toggleSaved(id);
  btn.classList.toggle("is-saved", saved.includes(id));
  btn.textContent = saved.includes(id) ? "★ Saved" : "☆ Save project";
});

renderFilters();
renderProjects(projects);

// ============================================================
// Mobile nav toggle (B2: event handling — hamburger menu)
// ============================================================
const navToggle = document.getElementById("navToggle");
const primaryNav = document.getElementById("primaryNav");

navToggle?.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

primaryNav?.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    primaryNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

// ============================================================
// Theme toggle — dark/light, persisted (B2 + B4)
// ============================================================
const themeToggle = document.getElementById("themeToggle");
const themeLabel = themeToggle?.querySelector(".theme-toggle-label");

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle?.setAttribute("aria-pressed", String(theme === "dark"));
  if (themeLabel) themeLabel.textContent = theme === "dark" ? "Day mode" : "Night mode";
  themeToggle?.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
};

const storedTheme = localStorage.getItem(THEME_KEY);
const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
applyTheme(storedTheme ?? (prefersDark ? "dark" : "light"));

themeToggle?.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem(THEME_KEY, next);
});

// ============================================================
// Contact form validation with regex (B3)
// ============================================================
const form = document.getElementById("contactForm");
const fields = {
  name: { input: document.getElementById("name"), error: document.getElementById("nameError") },
  email: { input: document.getElementById("email"), error: document.getElementById("emailError") },
  message: { input: document.getElementById("message"), error: document.getElementById("messageError") },
};
const formSuccess = document.getElementById("formSuccess");

const NAME_RE = /^[A-Za-z][A-Za-z\s'.-]{1,49}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const validators = {
  name: (value) =>
    NAME_RE.test(value.trim()) ? "" : "Enter a name using letters only (2–50 characters).",
  email: (value) => (EMAIL_RE.test(value.trim()) ? "" : "Enter a valid email address."),
  message: (value) =>
    value.trim().length >= 10 ? "" : "Message should be at least 10 characters.",
};

const validateField = (key) => {
  const { input, error } = fields[key];
  const message = validators[key](input.value);
  error.textContent = message;
  input.closest(".form-row").classList.toggle("has-error", Boolean(message));
  return !message;
};

// Validate as the user types (B3)
Object.keys(fields).forEach((key) => {
  fields[key].input.addEventListener("input", () => {
    if (fields[key].input.closest(".form-row").classList.contains("has-error")) {
      validateField(key);
    }
  });
  fields[key].input.addEventListener("blur", () => validateField(key));
});

form?.addEventListener("submit", (e) => {
  e.preventDefault(); // no page reload

  const results = Object.keys(fields).map(validateField);
  const isValid = results.every(Boolean);

  if (!isValid) {
    formSuccess.textContent = "";
    return;
  }

  const { name } = fields;
  formSuccess.textContent = `Thanks, ${name.input.value.trim().split(" ")[0]} — your message is ready to send. (Connect this form to a backend or a service like Formspree to deliver it.)`;
  form.reset();
  Object.values(fields).forEach(({ input }) => input.closest(".form-row").classList.remove("has-error"));
});

// ============================================================
// Hero signal animation — one orchestrated moment on load
// ============================================================
const hero = document.querySelector(".hero");
requestAnimationFrame(() => hero?.classList.add("is-live"));

// ============================================================
// Footer year
// ============================================================
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();