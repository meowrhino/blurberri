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

  // Arrow click handlers
  document.querySelectorAll(".arrow-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const cat = categories[btn.dataset.cat];
      if (!cat) return;
      const dir = parseInt(btn.dataset.dir, 10);
      cat.current = (cat.current + dir + cat.items.length) % cat.items.length;
      images[btn.dataset.cat].src = cat.items[cat.current];
    });
  });

  // Random button
  document.getElementById("btn-random")?.addEventListener("click", () => {
    for (const [id, cat] of Object.entries(categories)) {
      cat.current = Math.floor(Math.random() * cat.items.length);
      images[id].src = cat.items[cat.current];
    }
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
