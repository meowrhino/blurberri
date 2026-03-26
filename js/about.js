// About — generate random decorative elements from data.json
document.addEventListener("DOMContentLoaded", async () => {
  if (document.body.dataset.pageType !== "about") return;

  const res = await fetch("data/data.json");
  const data = await res.json();
  const cfg = data.about;

  // Apply container background
  const container = document.getElementById("about-container");
  if (container && cfg.containerBg) {
    container.style.backgroundColor = cfg.containerBg;
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

      const source = document.createElement("source");
      source.src = deco.src;
      source.type = "video/webm";
      video.appendChild(source);

      document.body.appendChild(video);
    });
  });
});
