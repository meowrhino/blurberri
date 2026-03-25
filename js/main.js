// Main — home page logic
document.addEventListener("DOMContentLoaded", () => {
  const pageType = document.body.dataset.pageType;
  if (pageType !== "home") return;

  // Scroll content frame to top on section change
  const frame = document.getElementById("content-frame");
  document.querySelectorAll(".nav-bottom-center .nav-link").forEach(link => {
    link.addEventListener("click", () => {
      if (frame) frame.scrollTop = 0;
    });
  });
});
