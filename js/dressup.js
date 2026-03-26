// Dress Up Game
document.addEventListener("DOMContentLoaded", () => {
  const layersEl = document.getElementById("dressup-layers");
  if (!layersEl) return;

  // Image heights at native 2048px width
  // pelo=576  tops=480  bottoms=976  shoes=700  total=2732
  const heights = { pelo: 576, tops: 480, bottoms: 976, shoes: 700 };
  const totalH = 576 + 480 + 976 + 700; // 2732

  const categories = {
    pelo: {
      items: [
        "data/games/DRESS UP GAME/01-PELO/pelo_amarillo.png",
        "data/games/DRESS UP GAME/01-PELO/pelo_azul.png",
        "data/games/DRESS UP GAME/01-PELO/pelo_negro.png",
        "data/games/DRESS UP GAME/01-PELO/pelo_rosa.png",
      ],
      current: 0,
      topPct: 0,
      heightPct: (576 / totalH) * 100,
    },
    tops: {
      items: [
        "data/games/DRESS UP GAME/02-TOPS/top01.png",
        "data/games/DRESS UP GAME/02-TOPS/top02.png",
        "data/games/DRESS UP GAME/02-TOPS/top03.png",
        "data/games/DRESS UP GAME/02-TOPS/top04.png",
        "data/games/DRESS UP GAME/02-TOPS/top05.png",
      ],
      current: 0,
      topPct: (576 / totalH) * 100,
      heightPct: (480 / totalH) * 100,
    },
    bottoms: {
      items: [
        "data/games/DRESS UP GAME/03-BOTTOMS/bottom01.png",
        "data/games/DRESS UP GAME/03-BOTTOMS/bottom02.png",
        "data/games/DRESS UP GAME/03-BOTTOMS/bottom03.png",
        "data/games/DRESS UP GAME/03-BOTTOMS/bottom04.png",
      ],
      current: 0,
      topPct: ((576 + 480) / totalH) * 100,
      heightPct: (976 / totalH) * 100,
    },
    shoes: {
      items: [
        "data/games/DRESS UP GAME/04-SHOES/shoes01.png",
        "data/games/DRESS UP GAME/04-SHOES/shoes02.png",
        "data/games/DRESS UP GAME/04-SHOES/shoes03.png",
        "data/games/DRESS UP GAME/04-SHOES/shoes04.png",
      ],
      current: 0,
      topPct: ((576 + 480 + 976) / totalH) * 100,
      heightPct: (700 / totalH) * 100,
    },
  };

  // Create image elements for each category — positioned vertically
  const images = {};
  for (const [cat, data] of Object.entries(categories)) {
    const img = document.createElement("img");
    img.src = data.items[0];
    img.alt = cat;
    img.style.top = data.topPct + "%";
    img.style.height = data.heightPct + "%";
    img.dataset.cat = cat;
    layersEl.appendChild(img);
    images[cat] = img;
  }

  // Position arrow buttons to align with their body part strip
  // Layers container: top 3%, bottom 2% → spans 95% of frame, starting at 3%
  const layerTop = 3;   // %
  const layerSpan = 95;  // %
  const scaleFactor = 0.15;
  document.querySelectorAll(".arrow-btn").forEach(btn => {
    const cat = btn.dataset.cat;
    const data = categories[cat];
    if (data) {
      // Center of this strip in the frame's coordinate space
      const centerInFrame = layerTop + (data.topPct + data.heightPct / 2) * layerSpan / 100;
      btn.style.top = centerInFrame + "%";
      // Random scale: 1 ± scaleFactor
      const randomScale = 1 + (Math.random() * 2 - 1) * scaleFactor;
      btn.style.setProperty("--btn-scale", randomScale);
    }
  });

  // Arrow button handlers
  document.querySelectorAll(".arrow-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.cat;
      const dir = parseInt(btn.dataset.dir, 10);
      const data = categories[cat];
      if (!data) return;

      data.current = (data.current + dir + data.items.length) % data.items.length;
      images[cat].src = data.items[data.current];
    });
  });

  // Random button
  const btnRandom = document.getElementById("btn-random");
  if (btnRandom) {
    btnRandom.addEventListener("click", () => {
      for (const [cat, data] of Object.entries(categories)) {
        data.current = Math.floor(Math.random() * data.items.length);
        images[cat].src = data.items[data.current];
      }
    });
  }

  // Download button — render parts stacked vertically on canvas
  const btnDownload = document.getElementById("btn-download");
  if (btnDownload) {
    btnDownload.addEventListener("click", async () => {
      const canvasW = 2048;
      const canvasH = totalH; // 2732 — native stacked height
      const canvas = document.createElement("canvas");
      canvas.width = canvasW;
      canvas.height = canvasH;
      const ctx = canvas.getContext("2d");

      // Draw each part at its vertical offset (top → bottom)
      const order = ["pelo", "tops", "bottoms", "shoes"];
      let y = 0;
      for (const cat of order) {
        const h = heights[cat];
        await new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            ctx.drawImage(img, 0, y, canvasW, h);
            y += h;
            resolve();
          };
          img.onerror = () => { y += h; resolve(); };
          img.src = categories[cat].items[categories[cat].current];
        });
      }

      // Download
      const link = document.createElement("a");
      link.download = "blurberrie-dressup.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  }
});
