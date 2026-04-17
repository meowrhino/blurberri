// About — generate random decorative elements from data.json
document.addEventListener("DOMContentLoaded", async () => {
  if (document.body.dataset.pageType !== "about") return;

  let data;
  try {
    const res = await fetch("data/data.json", { cache: "no-store" });
    data = await res.json();
  } catch (e) { return; }
  const cfg = data.about;
  if (!cfg?.decos) return;

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

  // Update character video sources from data
  const charVideo = document.querySelector(".about-visual video");
  if (charVideo && cfg.character) {
    charVideo.innerHTML = "";
    if (cfg.character.srcFallback) {
      const hevc = document.createElement("source");
      hevc.src = cfg.character.srcFallback;
      hevc.type = "video/quicktime; codecs=hvc1";
      charVideo.appendChild(hevc);
    }
    if (cfg.character.src) {
      const webm = document.createElement("source");
      webm.src = cfg.character.src;
      webm.type = "video/webm";
      charVideo.appendChild(webm);
    }
    charVideo.load();
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
      video.setAttribute("autoplay", "");
      video.setAttribute("loop", "");
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.setAttribute("preload", "auto");
      video.muted = true;
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
        hevc.type = "video/quicktime; codecs=hvc1";
        video.appendChild(hevc);
      }

      const source = document.createElement("source");
      source.src = deco.src;
      source.type = "video/webm";
      video.appendChild(source);

      document.body.appendChild(video);
      const tryPlay = () => video.play().catch(() => {});
      video.addEventListener("loadedmetadata", tryPlay, { once: true });
      tryPlay();
    });
  });

  // Character video — re-kick autoplay after sources swap (iOS Safari)
  if (charVideo) {
    charVideo.setAttribute("playsinline", "");
    charVideo.setAttribute("webkit-playsinline", "");
    charVideo.muted = true;
    const tryPlayChar = () => charVideo.play().catch(() => {});
    charVideo.addEventListener("loadedmetadata", tryPlayChar, { once: true });
    tryPlayChar();
  }
});
