// Dress Up Game
document.addEventListener("DOMContentLoaded", () => {
  const layersEl = document.getElementById("dressup-layers");
  if (!layersEl) return;

  const categories = {
    pelo: {
      items: [
        "data/games/DRESS UP GAME/01-PELO/pelo_amarillo.png",
        "data/games/DRESS UP GAME/01-PELO/pelo_azul.png",
        "data/games/DRESS UP GAME/01-PELO/pelo_negro.png",
        "data/games/DRESS UP GAME/01-PELO/pelo_rosa.png",
      ],
      current: 0,
      zIndex: 40,
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
      zIndex: 30,
    },
    bottoms: {
      items: [
        "data/games/DRESS UP GAME/03-BOTTOMS/bottom01.png",
        "data/games/DRESS UP GAME/03-BOTTOMS/bottom02.png",
        "data/games/DRESS UP GAME/03-BOTTOMS/bottom03.png",
        "data/games/DRESS UP GAME/03-BOTTOMS/bottom04.png",
      ],
      current: 0,
      zIndex: 20,
    },
    shoes: {
      items: [
        "data/games/DRESS UP GAME/04-SHOES/shoes01.png",
        "data/games/DRESS UP GAME/04-SHOES/shoes02.png",
        "data/games/DRESS UP GAME/04-SHOES/shoes03.png",
        "data/games/DRESS UP GAME/04-SHOES/shoes04.png",
      ],
      current: 0,
      zIndex: 10,
    },
  };

  // Create image elements for each category
  const images = {};
  for (const [cat, data] of Object.entries(categories)) {
    const img = document.createElement("img");
    img.src = data.items[0];
    img.alt = cat;
    img.style.zIndex = data.zIndex;
    img.dataset.cat = cat;
    layersEl.appendChild(img);
    images[cat] = img;
  }

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
});
