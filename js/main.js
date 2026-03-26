// Main — home page logic
async function initHome() {
  const pageType = document.body.dataset.pageType;
  if (pageType !== "home") return;

  // Load data.json
  const res = await fetch("data/data.json");
  const data = await res.json();

  // === ANIMATION THUMBNAILS ===
  const grid = document.getElementById("anim-grid") || document.querySelector(".anim-grid");
  if (grid && data.animaciones) {
    // Generate random positions that don't overlap too much
    const positions = generateRandomPositions(data.animaciones.length);

    data.animaciones.forEach((anim, i) => {
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

  // === SKETCHBOOK ===
  const sketchGallery = document.getElementById("sketch-gallery") || document.querySelector(".sketch-gallery");
  if (sketchGallery && data.sketchbook) {
    const cfg = data.sketchbook;
    for (let i = 1; i <= cfg.imgCount; i++) {
      const num = String(i).padStart(2, "0");
      loadSketchImage(sketchGallery, cfg.basePath, cfg.prefix + num, cfg.extensions, 0);
    }
  }

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

// Generate well-distributed random positions for thumbnails
function generateRandomPositions(count) {
  // Divide the full area into zones, then add jitter
  // Thumbnail is ~14vw wide, so leave ~15% margin to avoid clipping
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  const maxLeft = 100;
  const maxTop = 100;
  const cellW = maxLeft / cols;
  const cellH = maxTop / rows;
  const positions = [];

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    // Base position in cell + jitter across full cell
    const left = col * cellW + Math.random() * cellW;
    const top = row * cellH + Math.random() * cellH;
    positions.push({ top: top + "%", left: left + "%" });
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
