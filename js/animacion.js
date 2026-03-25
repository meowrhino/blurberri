// Animation detail page
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const videoName = params.get("v");
  if (!videoName) return;

  // Set page title
  const title = videoName.charAt(0).toUpperCase() + videoName.slice(1);
  const titleEl = document.getElementById("anim-title");
  const titleBottomEl = document.getElementById("anim-title-bottom");
  if (titleEl) titleEl.textContent = title;
  if (titleBottomEl) titleBottomEl.textContent = title;
  document.title = `${title} — Blurberrie`;

  // Set video source
  const video = document.getElementById("anim-video");
  if (video) {
    const source = document.createElement("source");
    source.src = `data/_ANIMATION/_VIDEOS/${videoName}.webm`;
    source.type = "video/webm";
    video.appendChild(source);
    video.load();
  }

  // Set color theme
  document.body.classList.add(`anim-${videoName}`);
});
