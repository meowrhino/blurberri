// Main — home page logic
async function initHome() {
  const pageType = document.body.dataset.pageType;
  if (pageType !== "home") return;

  let data;
  try {
    const res = await fetch("data/data.json", { cache: "no-store" });
    data = await res.json();
  } catch (e) { return; }

  // === LOGO LINK (from data.json social.instagram) ===
  const logoLink = document.querySelector("a.logo");
  if (logoLink && data.social?.instagram) {
    logoLink.href = data.social.instagram;
  }

  // === ANIMATION THUMBNAILS ===
  const grid = document.getElementById("anim-grid") || document.querySelector(".anim-grid");
  const proyectos = data.animaciones?.proyectos || [];
  if (grid && proyectos.length) {
    // Generate random positions that don't overlap too much
    const positions = generateRandomPositions(proyectos.length);

    proyectos.forEach((anim, i) => {
      const link = document.createElement("a");
      link.href = `animacion.html?v=${anim.slug}`;
      link.className = "anim-thumb";
      link.style.top = positions[i].top;
      link.style.left = positions[i].left;

      // Webm thumbnail
      const video = document.createElement("video");
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      const source = document.createElement("source");
      source.src = `data/_ANIMATION/_MINIATURAS/${anim.slug}_thumbnail.webm`;
      source.type = "video/webm";
      video.appendChild(source);
      link.appendChild(video);

      // Name label in Jua font
      const label = document.createElement("span");
      label.className = "anim-thumb-label";
      label.textContent = anim.name;
      link.appendChild(label);

      grid.appendChild(link);
    });
  }

  // === SKETCHBOOK / FREESTUFF / BAZAR (all share the horizontal gallery pattern) ===
  const comingSoonText = data.ui?.comingSoon || "coming soon";
  [
    { gallery: "sketch-gallery",    cfg: data.sketchbook },
    { gallery: "freestuff-gallery", cfg: data.freestuff  },
    { gallery: "bazar-gallery",     cfg: data.bazar      },
  ].forEach(({ gallery, cfg }) => {
    const el = document.getElementById(gallery);
    if (!el || !cfg) return;
    if (!cfg.imgCount || cfg.imgCount < 1) {
      // Empty gallery → render coming soon placeholder in its place
      el.classList.add("gallery-empty");
      el.innerHTML = `<p class="coming-soon">${comingSoonText}</p>`;
      return;
    }
    const prefix = cfg.prefijo ?? cfg.prefix ?? "";
    for (let i = 1; i <= cfg.imgCount; i++) {
      loadSketchImage(el, cfg.basePath, prefix + i, cfg.extensions, 0);
    }
  });

  // Scroll content area to top on section change
  const scrollArea = document.querySelector(".content-scroll");
  document.addEventListener("click", (e) => {
    if (e.target.closest(".nav-bottom-center .nav-link")) {
      if (scrollArea) scrollArea.scrollTop = 0;
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHome);
} else {
  initHome();
}

// Generate non-overlapping random positions for thumbnails
function generateRandomPositions(count) {
  const isMobile = window.innerWidth <= 600;
  const maxLeft = isMobile ? 68 : 88;   // reserve more on mobile (thumbs are ~30vw)
  const maxTop = isMobile ? 68 : 72;
  const thumbW = isMobile ? 30 : 12;    // approximate thumbnail width in %
  const thumbH = isMobile ? 32 : 28;    // approximate thumbnail height + label in %
  const positions = [];

  for (let i = 0; i < count; i++) {
    let best = null;
    let bestDist = -1;

    // Try many random positions, pick the one furthest from all existing
    for (let attempt = 0; attempt < 100; attempt++) {
      const left = Math.random() * maxLeft;
      const top = Math.random() * maxTop;

      // Check overlap with existing positions
      let overlaps = false;
      let minDist = Infinity;
      for (const p of positions) {
        const pl = parseFloat(p.left);
        const pt = parseFloat(p.top);
        // Check if bounding boxes overlap
        if (Math.abs(left - pl) < thumbW && Math.abs(top - pt) < thumbH) {
          overlaps = true;
          break;
        }
        const dist = Math.sqrt((left - pl) ** 2 + (top - pt) ** 2);
        minDist = Math.min(minDist, dist);
      }

      if (!overlaps && minDist > bestDist) {
        best = { top: top + "%", left: left + "%" };
        bestDist = minDist;
      }
    }

    positions.push(best || { top: Math.random() * maxTop + "%", left: Math.random() * maxLeft + "%" });
  }

  // Shuffle so the order isn't predictable
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  return positions;
}

// Try loading a sketch image with extension fallback (like mokakopa)
function loadSketchImage(gallery, basePath, name, extensions, extIndex) {
  if (extIndex >= extensions.length) return; // all extensions failed

  const img = document.createElement("img");
  img.alt = name;
  img.src = `${basePath}${name}.${extensions[extIndex]}`;
  img.onload = () => {
    img.classList.add("loaded");
    gallery.appendChild(img);
  };
  img.onerror = () => {
    loadSketchImage(gallery, basePath, name, extensions, extIndex + 1);
  };
}
