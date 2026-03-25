// Main — home page logic
document.addEventListener("DOMContentLoaded", () => {
  const pageType = document.body.dataset.pageType;
  if (pageType !== "home") return;

  // Scroll content area to top on section change
  const scrollArea = document.querySelector(".content-scroll");
  document.addEventListener("click", (e) => {
    if (e.target.closest(".nav-bottom-center .nav-link")) {
      if (scrollArea) scrollArea.scrollTop = 0;
    }
  });
});
