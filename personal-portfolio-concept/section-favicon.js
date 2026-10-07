(() => {
  const assetBase = new URL('assets/', document.currentScript.src);
  const validWorlds = new Set(['neutral', 'art', 'digital', 'photography']);
  let previousWorld;
  const update = () => {
    const requested = document.body.dataset.world || (location.pathname.includes('/reform-space/') ? 'digital' : 'neutral');
    const world = validWorlds.has(requested) ? requested : 'neutral';
    if (world === previousWorld) return;
    previousWorld = world;
    const href = new URL(`header-hat-${world}-105.png`, assetBase).href;
    const icons = document.head.querySelectorAll('link[rel="icon"]');
    for (const icon of icons) {
      icon.type = 'image/png';
      icon.sizes = '256x256';
      icon.href = href;
    }
  };
  update();
  new MutationObserver(update).observe(document.body, {attributes: true, attributeFilter: ['data-world']});
})();
