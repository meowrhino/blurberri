// Navigation + page transitions + data.json color injection
document.addEventListener("DOMContentLoaded", async () => {
  const pageType = document.body.dataset.pageType;
  if (!pageType) return;

  // === LOAD DATA.JSON & APPLY COLORS ===
  let data;
  try {
    const res = await fetch("data/data.json", { cache: "no-store" });
    data = await res.json();
    const cfg = data[pageType] || null; // home, about, dressme
    if (cfg) applyColors(cfg);
  } catch (e) { /* fallback to CSS defaults */ }

  // === ENTRANCE ANIMATION (if coming from another page) ===
  if (sessionStorage.getItem("page-transition")) {
    sessionStorage.removeItem("page-transition");
    document.documentElement.classList.remove("transitioning");
    playEntrance();
  }

  // === BUILD NAVIGATION ===
  if (pageType === "home" || pageType === "about" || pageType === "dressme") {
    buildTopNav(pageType, data);
  }
  if (pageType === "animacion") {
    buildBackLink(data);
  }
  if (pageType === "home") {
    buildHomeTabs(data);
  }

  // === INTERCEPT NAV CLICKS FOR EXIT ANIMATION ===
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href]");
    if (!link || link.href.startsWith("#") || link.dataset.section) return;
    // Only intercept internal navigation
    if (!link.href.includes(location.origin)) return;
    e.preventDefault();
    playExit(() => {
      sessionStorage.setItem("page-transition", "1");
      location.href = link.href;
    });
  });
});

// === BFCACHE RESTORE — fix stuck opacity when using browser back/forward ===
window.addEventListener("pageshow", (e) => {
  if (!e.persisted) return; // only on bfcache restore
  // Clean up any stale state from interrupted transitions
  document.body.classList.remove("page-exit");
  document.documentElement.classList.remove("transitioning");
  const stale = document.querySelectorAll(
    ".page-container, #about-container, .page-title, .logo, .nav-top-right, .nav-bottom-center, .nav-back, .dressup-actions, .anim-motivo"
  );
  stale.forEach(el => {
    el.style.opacity = "";
    el.style.transform = "";
    el.style.transition = "";
  });
  // If there was a pending transition flag, replay the entrance
  if (sessionStorage.getItem("page-transition")) {
    sessionStorage.removeItem("page-transition");
    playEntrance();
  }
});

// ─── COLOR APPLICATION ─────────────────────────────────────
function applyColors(cfg) {
  const root = document.documentElement;
  const c = cfg.colors || {};
  if (c.bg) root.style.setProperty("--page-bg", c.bg);
  if (c.container) root.style.setProperty("--page-container-bg", c.container);
  if (c.button) root.style.setProperty("--btn-color", c.button);
  if (c.buttonHover) root.style.setProperty("--btn-active-hover", c.buttonHover);
  if (cfg.titulo?.color) root.style.setProperty("--title-color", cfg.titulo.color);
}

// ─── PAGE TRANSITIONS ──────────────────────────────────────
function playExit(callback) {
  document.body.classList.add("page-exit");
  setTimeout(callback, 500);
}

function playEntrance() {
  // Elements animate in sequence with calm pacing (~1.8s total)
  const container = document.querySelector(".page-container, #about-container");
  const titleLeft = document.querySelector(".page-title:first-of-type, .logo");
  const titleRight = document.querySelector(".page-title--bottom");
  const nav = document.querySelector(".nav-top-right");
  const navBottom = document.querySelector(".nav-bottom-center, .dressup-actions, .nav-back");

  // Start everything hidden
  [container, titleLeft, titleRight, nav, navBottom].forEach(el => {
    if (el) { el.style.opacity = "0"; el.style.transition = "none"; }
  });
  if (titleLeft) { titleLeft.style.transform = "translateX(-40px)"; titleLeft.style.transition = "none"; }
  if (titleRight) {
    const isRotated = titleRight.classList.contains("page-title--bottom");
    titleRight.style.transform = isRotated ? "rotate(180deg) translateX(-40px)" : "translateX(40px)";
    titleRight.style.transition = "none";
  }

  // Force reflow
  void document.body.offsetWidth;

  // Sequence: container (200ms) → title left (600ms) → title right (900ms) → nav (1200ms)
  setTimeout(() => {
    if (container) { container.style.transition = "opacity 0.7s ease"; container.style.opacity = "1"; }
  }, 200);

  setTimeout(() => {
    if (titleLeft) { titleLeft.style.transition = "opacity 0.6s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)"; titleLeft.style.opacity = "1"; titleLeft.style.transform = "translateX(0)"; }
  }, 600);

  setTimeout(() => {
    if (titleRight) {
      const isRotated = titleRight.classList.contains("page-title--bottom");
      titleRight.style.transition = "opacity 0.6s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)";
      titleRight.style.opacity = "1";
      titleRight.style.transform = isRotated ? "rotate(180deg) translateX(0)" : "translateX(0)";
    }
  }, 900);

  setTimeout(() => {
    [nav, navBottom].forEach(el => {
      if (el) { el.style.transition = "opacity 0.5s ease"; el.style.opacity = "1"; }
    });
  }, 1200);

  // Clean up inline styles after animation
  setTimeout(() => {
    [container, titleLeft, titleRight, nav, navBottom].forEach(el => {
      if (el) { el.style.transition = ""; el.style.opacity = ""; el.style.transform = ""; }
    });
  }, 2200);
}

// ─── NAV BUILDERS ──────────────────────────────────────────
function buildTopNav(pageType, data) {
  const labels = data?.ui?.nav || {};
  const items = [
    { key: "home",    href: "index.html",   label: labels.home    || "home" },
    { key: "about",   href: "about.html",   label: labels.about   || "about" },
    { key: "dressme", href: "dressme.html", label: labels.dressme || "Dress me" },
  ];
  const topRight = document.createElement("div");
  topRight.classList.add("nav-top-right");
  topRight.innerHTML = items.map(it =>
    `<a href="${it.href}" class="nav-link${pageType === it.key ? " active" : ""}">${it.label}</a>`
  ).join("");
  document.body.appendChild(topRight);
}

function buildBackLink(data) {
  const back = document.createElement("a");
  back.href = "index.html";
  back.className = "nav-back";
  back.textContent = data?.ui?.back || "back";
  document.body.appendChild(back);
}

function buildHomeTabs(data) {
  const frame = document.getElementById("content-frame");
  if (!frame) return;

  // Wrap sections in scroll container
  const scrollWrapper = document.createElement("div");
  scrollWrapper.className = "content-scroll";
  while (frame.firstChild) scrollWrapper.appendChild(frame.firstChild);
  frame.appendChild(scrollWrapper);

  // Build tab bar
  const bottomCenter = document.createElement("div");
  bottomCenter.classList.add("nav-bottom-center");
  const tabs = data?.ui?.tabs || [
    { id: "sec-animaciones", label: "portfolio" },
    { id: "sec-sketchbook", label: "sketchbook" },
    { id: "sec-freestuff", label: "free stuff" },
    { id: "sec-bazar", label: "bazar" },
  ];

  tabs.forEach((tab, i) => {
    const a = document.createElement("a");
    a.className = "nav-link" + (i === 0 ? " active" : "");
    a.textContent = tab.label;
    a.href = "#";
    a.dataset.section = tab.id;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      scrollWrapper.querySelectorAll(".home-section").forEach(s => s.classList.remove("active"));
      document.getElementById(tab.id)?.classList.add("active");
      bottomCenter.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
      a.classList.add("active");
      scrollWrapper.scrollTop = 0;
    });
    bottomCenter.appendChild(a);
  });

  document.body.appendChild(bottomCenter);
}
