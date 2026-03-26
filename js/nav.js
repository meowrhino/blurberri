// Navigation + page transitions + data.json color injection
document.addEventListener("DOMContentLoaded", async () => {
  const pageType = document.body.dataset.pageType;
  if (!pageType) return;

  // === LOAD DATA.JSON & APPLY COLORS ===
  let data;
  try {
    const res = await fetch("data/data.json");
    data = await res.json();
    const cfg = data[pageType] || null; // home, about, games
    if (cfg) applyColors(cfg);
  } catch (e) { /* fallback to CSS defaults */ }

  // === ENTRANCE ANIMATION (if coming from another page) ===
  if (sessionStorage.getItem("page-transition")) {
    sessionStorage.removeItem("page-transition");
    document.documentElement.classList.remove("transitioning");
    playEntrance();
  }

  // === BUILD NAVIGATION ===
  if (pageType === "home" || pageType === "about" || pageType === "games") {
    buildTopNav(pageType);
  }
  if (pageType === "animacion") {
    buildBackLink();
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

// ─── COLOR APPLICATION ─────────────────────────────────────
function applyColors(cfg) {
  const root = document.documentElement;
  if (cfg.bg) root.style.setProperty("--page-bg", cfg.bg);
  if (cfg.containerBg) root.style.setProperty("--page-container-bg", cfg.containerBg);
  if (cfg.botones) root.style.setProperty("--btn-color", cfg.botones);
  if (cfg.botonesActiveHover) root.style.setProperty("--btn-active-hover", cfg.botonesActiveHover);
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
function buildTopNav(pageType) {
  const topRight = document.createElement("div");
  topRight.classList.add("nav-top-right");
  topRight.innerHTML = `
    <a href="index.html" class="nav-link ${pageType === 'home' ? 'active' : ''}">home</a>
    <a href="about.html" class="nav-link ${pageType === 'about' ? 'active' : ''}">about</a>
    <a href="games.html" class="nav-link ${pageType === 'games' ? 'active' : ''}">games</a>
  `;
  document.body.appendChild(topRight);
}

function buildBackLink() {
  const back = document.createElement("a");
  back.href = "index.html";
  back.className = "nav-back";
  back.textContent = "back";
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
  const tabs = [
    { id: "sec-animaciones", label: "animaciones" },
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
