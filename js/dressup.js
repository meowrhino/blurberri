// Dress Up Game — config loaded from data.json
async function initDressup() {
  const layersEl = document.getElementById("dressup-layers");
  if (!layersEl) return;

  // Load config from data.json
  const res = await fetch("data/data.json");
  const data = await res.json();
  const cfg = data.games?.dressup;
  if (!cfg) return;

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

  // Create image elements — positioned vertically
  const images = {};
  for (const [id, cat] of Object.entries(categories)) {
    const img = document.createElement("img");
    img.src = cat.items[0];
    img.alt = id;
    img.style.top = cat.topPct + "%";
    img.style.height = cat.heightPct + "%";
    img.dataset.cat = id;
    layersEl.appendChild(img);
    images[id] = img;
  }

  // Position arrows to align with body part strips
  const layerTop = 3;    // % (matches CSS .dressup-layers top)
  const layerSpan = 95;  // % (100 - top 3% - bottom 2%)
  const scaleFactor = cfg.scaleFlechas || 0.39;

  document.querySelectorAll(".arrow-btn").forEach(btn => {
    const cat = categories[btn.dataset.cat];
    if (!cat) return;
    const centerInFrame = layerTop + (cat.topPct + cat.heightPct / 2) * layerSpan / 100;
    btn.style.top = centerInFrame + "%";
    btn.style.setProperty("--btn-scale", 1 + (Math.random() * 2 - 1) * scaleFactor);
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
    img.style.transition = "transform 0.25s ease-in";
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
      img.style.transition = "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)";
      img.style.transform = "translateX(0)";

      setTimeout(() => {
        img.style.transition = "";
        img.style.transform = "";
        delete img.dataset.animating;
      }, 300);
    }, 250);
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

        img.style.transition = "transform 0.25s ease-in";
        img.style.transform = `translateX(${slideOut})`;

        setTimeout(() => {
          cat.current = newIdx;
          img.src = cat.items[cat.current];
          img.style.transition = "none";
          img.style.transform = `translateX(${slideIn})`;
          void img.offsetWidth;
          img.style.transition = "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)";
          img.style.transform = "translateX(0)";
          setTimeout(() => { img.style.transition = ""; img.style.transform = ""; delete img.dataset.animating; }, 300);
        }, 250);
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
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDressup);
} else {
  initDressup();
}
