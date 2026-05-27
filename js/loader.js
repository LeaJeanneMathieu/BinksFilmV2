(function () {
  const bar = document.querySelector(".loader__bar");
  const loader = document.querySelector(".loader");
  if (!bar || !loader) return;

  let progress = 0;
  const duration = 2800;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    progress = Math.min((elapsed / duration) * 100, 100);
    bar.style.width = progress + "%";

    if (progress < 100) {
      requestAnimationFrame(tick);
    } else {
      setTimeout(() => {
        loader.classList.add("is-done");
        setTimeout(() => {
          window.location.href = "home.html";
        }, 600);
      }, 400);
    }
  }

  requestAnimationFrame(tick);
})();
