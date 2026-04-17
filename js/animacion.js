// Animation detail page — loads config from data.json
document.addEventListener("DOMContentLoaded", async () => {
  const videoSlug = new URLSearchParams(location.search).get("v");
  if (!videoSlug) return;

  let data;
  try {
    const res = await fetch("data/data.json", { cache: "no-store" });
    data = await res.json();
  } catch (e) { return; }
  const animCfg = data.animaciones || {};
  const anim = (animCfg.proyectos || []).find(a => a.slug === videoSlug);
  const name = anim?.name || videoSlug.charAt(0).toUpperCase() + videoSlug.slice(1);

  // Set page titles
  const titleEl = document.getElementById("anim-title");
  const titleBottomEl = document.getElementById("anim-title-bottom");
  if (titleEl) titleEl.textContent = name;
  if (titleBottomEl) titleBottomEl.textContent = name;
  document.title = `${name} — ${data.siteTitle || "blurberrie930"}`;

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
    const root = document.documentElement;
    const c = anim.colors || {};
    if (c.bg) document.body.style.backgroundColor = c.bg;

    // Title color + shared opacity
    const titleColor = c.title || "#fff";
    const titleOpacity = animCfg.opacidadTitulo ?? 0.3;
    [titleEl, titleBottomEl].forEach(el => {
      if (el) { el.style.color = titleColor; el.style.opacity = titleOpacity; }
    });

    // Button colors
    if (c.button) root.style.setProperty("--btn-color", c.button);
    if (c.buttonHover) root.style.setProperty("--btn-active-hover", c.buttonHover);
  }

  // Shared motivo opacity
  const motivoOpacity = animCfg.opacidadMotivo ?? 0.12;
  document.querySelectorAll(".anim-motivo").forEach(m => m.style.opacity = motivoOpacity);

  // Position motivos: left-upper + right-lower with slight randomness
  const motivos = document.querySelectorAll(".anim-motivo");
  if (motivos.length >= 2) {
    const m1 = motivos[0];
    m1.style.top = (-30 + Math.random() * 25) + "%";
    m1.style.left = (-35 + Math.random() * 30) + "%";
    m1.style.right = "auto";
    m1.style.bottom = "auto";
    m1.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;

    const m2 = motivos[1];
    m2.style.bottom = (-30 + Math.random() * 25) + "%";
    m2.style.right = (-35 + Math.random() * 30) + "%";
    m2.style.top = "auto";
    m2.style.left = "auto";
    m2.style.transform = `rotate(${160 + Math.random() * 40}deg)`;
  }
});
