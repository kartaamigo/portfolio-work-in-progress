(() => {
  function reveal(image) {
    if (!image.dataset.src) return;
    image.src = image.dataset.src;
    delete image.dataset.src;
  }
  let pending = false;
  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      document.querySelectorAll('img[data-src]').forEach(image => {
        if (image.closest('.folder-cards') || !image.getClientRects().length) return;
        const box = image.getBoundingClientRect();
        if (getComputedStyle(image).visibility !== 'hidden' && box.width > 0 && box.bottom > -300 && box.top < innerHeight + 500) reveal(image);
      });
    });
  }
  window.addEventListener('world-preview', schedule);
  window.addEventListener('scroll', schedule, {passive: true});
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
  for (const eventName of ['pointerover', 'focusin']) document.addEventListener(eventName, event => {
    const folder = event.target.closest('.folder-item');
    if (folder) folder.querySelectorAll('img[data-src]').forEach(reveal);
  });
  schedule();
})();
