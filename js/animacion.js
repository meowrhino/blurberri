// Animation detail page — loads colors and config from data.json
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const videoSlug = params.get("v");
  if (!videoSlug) return;

  // Load data.json
  const res = await fetch("data/data.json");
  const data = await res.json();
  const anim = data.animaciones.find(a => a.slug === videoSlug);

  // Set page title
  const name = anim ? anim.name : videoSlug.charAt(0).toUpperCase() + videoSlug.slice(1);
  const titleEl = document.getElementById("anim-title");
  const titleBottomEl = document.getElementById("anim-title-bottom");
  if (titleEl) titleEl.textContent = anim ? anim.textoDecorativo : name;
  if (titleBottomEl) titleBottomEl.textContent = anim ? anim.textoDecorativo : name;
  document.title = `${name} — Blurberrie`;

  // Set video source
  const video = document.getElementById("anim-video");
  if (video) {
    const source = document.createElement("source");
    source.src = `data/_ANIMATION/_VIDEOS/${videoSlug}.webm`;
    source.type = "video/webm";
    video.appendChild(source);
    video.load();
  }

  // Apply colors from data.json
  if (anim) {
    document.body.style.backgroundColor = anim.color1;
    const container = document.querySelector(".page-container");
    if (container) container.style.backgroundColor = anim.color2;

    // Decorative text color (color3)
    if (titleEl) titleEl.style.color = anim.color3;
    if (titleBottomEl) titleBottomEl.style.color = anim.color3;

    // Nav link colors (colorBotones)
    document.documentElement.style.setProperty("--anim-btn-color", anim.colorBotones);
  }

  // Randomize motivo positions
  document.querySelectorAll(".anim-motivo").forEach(motivo => {
    const top = -10 + Math.random() * 80;
    const left = -10 + Math.random() * 80;
    const rotation = Math.random() * 360;
    const scale = 0.8 + Math.random() * 0.6;
    motivo.style.top = top + "%";
    motivo.style.left = left + "%";
    motivo.style.right = "auto";
    motivo.style.bottom = "auto";
    motivo.style.transform = `rotate(${rotation}deg) scale(${scale})`;
  });
});
