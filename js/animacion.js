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

    // Nav link colors — same CSS vars as other pages
    const root = document.documentElement;
    root.style.setProperty("--btn-color", anim.colorBotones);
    root.style.setProperty("--btn-active-hover", anim.colorBotonesActiveHover);
  }

  // Position motivos: left-upper half + right-lower half
  const motivos = document.querySelectorAll(".anim-motivo");
  if (motivos.length >= 2) {
    // First motivo: left half, upper area
    const m1 = motivos[0];
    m1.style.top = (-5 + Math.random() * 30) + "%";
    m1.style.left = (-10 + Math.random() * 30) + "%";
    m1.style.right = "auto";
    m1.style.bottom = "auto";
    m1.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;

    // Second motivo: right half, lower area
    const m2 = motivos[1];
    m2.style.bottom = (-5 + Math.random() * 30) + "%";
    m2.style.right = (-10 + Math.random() * 30) + "%";
    m2.style.top = "auto";
    m2.style.left = "auto";
    m2.style.transform = `rotate(${160 + Math.random() * 40}deg)`;
  }
});
