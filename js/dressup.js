// Dress Up Game — config loaded from data.json
async function initDressup() {
  const layersEl = document.getElementById("dressup-layers");
  if (!layersEl) return;

  // Load config from data.json
  let data;
  try {
    const res = await fetch("data/data.json", { cache: "no-store" });
    data = await res.json();
  } catch (e) { return; }
  const cfg = data.dressme;
  if (!cfg) return;

  // Populate titles from data
  const titleText = cfg.titulo?.texto;
  if (titleText) {
    document.querySelectorAll(".page-title").forEach(el => el.textContent = titleText);
  }

  const basePath = cfg.basePath;

  // Build categories from JSON config
  const totalH = cfg.categorias.reduce((sum, c) => sum + c.altura, 0);
  let cumulativeH = 0;
  const categories = {};
  const catOrder = [];

  for (const cat of cfg.categorias) {
    // Build file list: either explicit "archivos" array or numbered (prefijo + 01..imgCount)
    let items;
    if (cat.archivos) {
      items = cat.archivos.map(f => `${basePath}${cat.carpeta}/${f}`);
    } else {
      items = [];
      for (let i = 1; i <= cat.imgCount; i++) {
        items.push(`${basePath}${cat.carpeta}/${cat.prefijo}${String(i).padStart(2, "0")}.png`);
      }
    }

    categories[cat.id] = {
      items,
      current: 0,
      topPct: (cumulativeH / totalH) * 100,
      heightPct: (cat.altura / totalH) * 100,
      altura: cat.altura,
    };
    catOrder.push(cat.id);
    cumulativeH += cat.altura;
  }

  // Preload all images for snappy swaps
  for (const id of catOrder) {
    const cat = categories[id];
    cat.items.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  // Create image elements — positioned vertically with slight overlap to hide gaps
  const images = {};
  for (const [id, cat] of Object.entries(categories)) {
    const img = document.createElement("img");
    img.src = cat.items[0];
    img.alt = id;
    img.style.top = cat.topPct + "%";
    img.style.height = (cat.heightPct + 0.5) + "%";
    img.dataset.cat = id;
    layersEl.appendChild(img);
    images[id] = img;
  }

  // === GENERATE ARROW BUTTONS FROM CONFIG ===
  buildArrows(cfg, categories, basePath);

  // Position arrows to align with body part strips
  const layerTop = 5;    // % (matches CSS .dressup-layers top)
  const layerSpan = 92;  // % (100 - top 5% - bottom 3%)
  const flechasCfg = cfg.flechas || {};
  const scaleRandom = flechasCfg.scaleRandom ?? 0.39;

  document.querySelectorAll(".arrow-btn").forEach(btn => {
    const cat = categories[btn.dataset.cat];
    if (!cat) return;
    const centerInFrame = layerTop + (cat.topPct + cat.heightPct / 2) * layerSpan / 100;
    btn.style.top = centerInFrame + "%";
    btn.style.setProperty("--btn-scale", 1 + (Math.random() * 2 - 1) * scaleRandom);
  });

  // Roulette animation: slide out current, slide in new
  function animateSwap(catId, dir) {
    const img = images[catId];
    const cat = categories[catId];
    if (!img || img.dataset.animating) return;
    img.dataset.animating = "1";

    // dir: 1 = right arrow (new enters from right), -1 = left arrow (new enters from left)
    const slideOut = dir > 0 ? "-110%" : "110%";
    const slideIn = dir > 0 ? "110%" : "-110%";

    // Slide out current
    img.style.transition = "transform 0.18s ease-in";
    img.style.transform = `translateX(${slideOut})`;

    setTimeout(() => {
      // Change image while off-screen
      cat.current = (cat.current + dir + cat.items.length) % cat.items.length;
      img.src = cat.items[cat.current];

      // Position on entry side (no transition)
      img.style.transition = "none";
      img.style.transform = `translateX(${slideIn})`;

      // Force reflow
      void img.offsetWidth;

      // Slide in to center
      img.style.transition = "transform 0.22s cubic-bezier(0.22, 1, 0.36, 1)";
      img.style.transform = "translateX(0)";

      setTimeout(() => {
        img.style.transition = "";
        img.style.transform = "";
        delete img.dataset.animating;
      }, 220);
    }, 180);
  }

  // Arrow click handlers
  document.querySelectorAll(".arrow-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const catId = btn.dataset.cat;
      const dir = parseInt(btn.dataset.dir, 10);
      animateSwap(catId, dir);
    });
  });

  // Random button — staggered roulette on all parts
  document.getElementById("btn-random")?.addEventListener("click", () => {
    catOrder.forEach((id, i) => {
      setTimeout(() => {
        const dir = Math.random() > 0.5 ? 1 : -1;
        // Pick a random item (not the current one if possible)
        const cat = categories[id];
        let newIdx;
        do { newIdx = Math.floor(Math.random() * cat.items.length); }
        while (newIdx === cat.current && cat.items.length > 1);

        const img = images[id];
        if (img.dataset.animating) return;
        img.dataset.animating = "1";

        const slideOut = dir > 0 ? "-110%" : "110%";
        const slideIn = dir > 0 ? "110%" : "-110%";

        img.style.transition = "transform 0.18s ease-in";
        img.style.transform = `translateX(${slideOut})`;

        setTimeout(() => {
          cat.current = newIdx;
          img.src = cat.items[cat.current];
          img.style.transition = "none";
          img.style.transform = `translateX(${slideIn})`;
          void img.offsetWidth;
          img.style.transition = "transform 0.22s cubic-bezier(0.22, 1, 0.36, 1)";
          img.style.transform = "translateX(0)";
          setTimeout(() => { img.style.transition = ""; img.style.transform = ""; delete img.dataset.animating; }, 220);
        }, 180);
      }, i * 80); // stagger each part by 80ms
    });
  });

  // Download button — stack parts vertically on canvas
  document.getElementById("btn-download")?.addEventListener("click", async () => {
    const canvasW = 2048;
    const canvas = document.createElement("canvas");
    canvas.width = canvasW;
    canvas.height = totalH;
    const ctx = canvas.getContext("2d");

    let y = 0;
    for (const id of catOrder) {
      const cat = categories[id];
      await new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => { ctx.drawImage(img, 0, y, canvasW, cat.altura); y += cat.altura; resolve(); };
        img.onerror = () => { y += cat.altura; resolve(); };
        img.src = cat.items[cat.current];
      });
    }

    const link = document.createElement("a");
    link.download = "blurberrie-dressup.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  // Button labels from data.json
  const uiLabels = cfg.labels || {};
  const btnRandom = document.getElementById("btn-random");
  const btnDownload = document.getElementById("btn-download");
  if (btnRandom && uiLabels.random) btnRandom.textContent = uiLabels.random;
  if (btnDownload && uiLabels.download) btnDownload.textContent = uiLabels.download;

  // Music toggle
  if (cfg.musica) {
    const audio = new Audio(cfg.musica.src);
    audio.loop = cfg.musica.loop !== false;
    const playLabel = cfg.musica.playLabel || "play";
    const pauseLabel = cfg.musica.pauseLabel || "pause";
    const btn = document.getElementById("btn-music");
    if (btn) {
      btn.textContent = playLabel;
      btn.addEventListener("click", () => {
        if (audio.paused) {
          audio.play();
          btn.textContent = pauseLabel;
        } else {
          audio.pause();
          btn.textContent = playLabel;
        }
      });
    }
  }
}

// Generate left/right arrow buttons from cfg.flechas (8 total: 4 categorías × 2 lados)
function buildArrows(cfg, categories, basePath) {
  const leftContainer  = document.getElementById("dressup-arrows-left");
  const rightContainer = document.getElementById("dressup-arrows-right");
  if (!leftContainer || !rightContainer) return;

  const flechas = cfg.flechas;
  if (!flechas || !flechas.asignacion || !flechas.sets) return;

  const arrowsBase = basePath + (flechas.basePath || "");

  for (const asg of flechas.asignacion) {
    if (!categories[asg.cat]) continue;
    const leftSet  = flechas.sets[asg.left];
    const rightSet = flechas.sets[asg.right];

    if (leftSet)  leftContainer.appendChild(makeArrow(asg.cat, -1, arrowsBase + leftSet.left,  leftSet.size));
    if (rightSet) rightContainer.appendChild(makeArrow(asg.cat, 1, arrowsBase + rightSet.right, rightSet.size));
  }
}

function makeArrow(cat, dir, imgSrc, size) {
  const btn = document.createElement("button");
  btn.className = "arrow-btn";
  btn.dataset.cat = cat;
  btn.dataset.dir = String(dir);
  const img = document.createElement("img");
  img.src = imgSrc;
  img.alt = (dir < 0 ? "prev " : "next ") + cat;
  if (size) img.style.height = size;
  btn.appendChild(img);
  return btn;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDressup);
} else {
  initDressup();
}
