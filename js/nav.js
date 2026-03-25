// Navigation — injected per page type (anakatana pattern)
document.addEventListener("DOMContentLoaded", () => {
  const pageType = document.body.dataset.pageType;
  if (!pageType) return;

  // === TOP RIGHT NAV (all pages) ===
  const topRight = document.createElement("div");
  topRight.classList.add("nav-top-right");

  if (pageType === "home" || pageType === "about" || pageType === "games") {
    topRight.innerHTML = `
      <a href="index.html" class="nav-link ${pageType === 'home' ? 'active' : ''}">home</a>
      <a href="about.html" class="nav-link ${pageType === 'about' ? 'active' : ''}">about</a>
      <a href="games.html" class="nav-link ${pageType === 'games' ? 'active' : ''}">games</a>
    `;
    document.body.appendChild(topRight);
  }

  // === BACK LINK (animation detail) ===
  if (pageType === "animacion") {
    const back = document.createElement("a");
    back.href = "index.html";
    back.className = "nav-back";
    back.textContent = "back";
    document.body.appendChild(back);
  }

  // === BOTTOM CENTER NAV (home only — section tabs) ===
  if (pageType === "home") {
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
        // Hide all sections
        document.querySelectorAll(".home-section").forEach(s => s.classList.remove("active"));
        // Show target
        document.getElementById(tab.id)?.classList.add("active");
        // Update active link
        bottomCenter.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
        a.classList.add("active");
      });
      bottomCenter.appendChild(a);
    });

    document.body.appendChild(bottomCenter);
  }
});
