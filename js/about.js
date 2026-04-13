// About — generate random decorative elements from data.json
document.addEventListener("DOMContentLoaded", async () => {
  if (document.body.dataset.pageType !== "about") return;

  let data;
  try {
    const res = await fetch("data/data.json");
    data = await res.json();
  } catch (e) { return; }
  const cfg = data.about;
  if (!cfg?.decos) return;

  // Apply container background
  const container = document.getElementById("about-container");
  if (container && cfg.containerBg) {
    container.style.backgroundColor = cfg.containerBg;
  }

  // Populate title from data
  const titleEl = document.querySelector(".page-title");
  if (titleEl && cfg.titulo?.texto) {
    titleEl.textContent = cfg.titulo.texto;
  }

  // Populate footer text from data
  const footerText = document.querySelector(".about-footer-text");
  if (footerText && cfg.footerText) {
    footerText.textContent = cfg.footerText;
  }

  // Populate bio text from data
  const bioEl = document.getElementById("about-bio");
  if (bioEl && cfg.bio) {
    bioEl.innerHTML = cfg.bio.map(p => `<p>${p}</p>`).join("");
  }

  // Remove existing static decos
  document.querySelectorAll(".about-deco").forEach(el => el.remove());

  // Generate random decos
  cfg.decos.forEach(deco => {
    const [minCount, maxCount] = deco.count;
    const count = minCount + Math.floor(Math.random() * (maxCount - minCount + 1));
    const [minSize, maxSize] = deco.sizeRange;

    // Shuffle and pick positions
    const shuffled = [...deco.positions].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, count);

    picked.forEach(pos => {
      const size = minSize + Math.floor(Math.random() * (maxSize - minSize));
      const video = document.createElement("video");
      video.className = "about-deco";
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.style.width = size + "px";
      video.style.height = "auto";

      // Apply position
      Object.entries(pos).forEach(([prop, val]) => {
        video.style[prop] = val;
      });

      // HEVC with alpha first (Safari), WebM second (Chrome/Firefox)
      if (deco.srcFallback) {
        const hevc = document.createElement("source");
        hevc.src = deco.srcFallback;
        // No type — let Safari auto-detect HEVC with alpha from .mov
        video.appendChild(hevc);
      }

      const source = document.createElement("source");
      source.src = deco.src;
      source.type = "video/webm";
      video.appendChild(source);

      document.body.appendChild(video);
    });
  });
});
