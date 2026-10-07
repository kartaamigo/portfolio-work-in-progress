(() => {
  const content = document.querySelector('.portfolio-content');
  if (!content) return;
  // Remove decorative glyphs from SoulArt; link arrows are provided by CSS.
  for (const area of [...content.children]) {
    if (area.matches('.photography-world,.reform-site')) continue;
    const walker = document.createTreeWalker(area, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement.closest('script,style')) continue;
      node.nodeValue = node.nodeValue.replace(/[↗↘↙↖↑↓←→↔✳✧◈◎]/g, '');
    }
  }
  // Every text link gets its arrow from CSS, including the other worlds.
  for (const link of document.querySelectorAll('a:not(.wordmark)')) {
    const texts = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
    let text;
    while ((text = texts.nextNode())) text.nodeValue = text.nodeValue.replace(/↗/g, '');
  }
  content.querySelector('[data-open-world]')?.addEventListener('click', event => {
    event.preventDefault();
    choose(event.currentTarget.dataset.openWorld);
  });
  const cards = [...content.querySelectorAll('.work-layout>.work')];
  const anchors = [];
  const types = ['САЙТ / КОНЦЕПТ', 'ПРИЛОЖЕНИЕ / КОНЦЕПТ', 'ВИЗУАЛЬНЫЙ ЭКСПЕРИМЕНТ'];
  cards.forEach((card, index) => {
    card.style.setProperty('--card-index', index);
    const anchor = document.createElement('div');
    anchor.className = 'art-stack-anchor';
    anchor.setAttribute('aria-hidden', 'true');
    card.before(anchor);
    anchors.push(anchor);
    const heading = document.createElement('div');
    heading.className = 'art-card-heading';
    const number = document.createElement('b');
    number.textContent = String(index + 1).padStart(2, '0');
    const label = document.createElement('span');
    label.append(number, 'SELECTED WORK');
    const type = document.createElement('span');
    type.className = 'card-type';
    type.textContent = card.dataset.projectType || types[index];
    heading.append(label, type);
    card.prepend(heading);
  });
  const title = document.createElement('span');
  title.className = 'art-section-word';
  title.textContent = 'ОБО МНЕ';
  title.setAttribute('aria-hidden', 'true');
  content.querySelector('.resume-title').append(title);
  const progress = document.createElement('div');
  progress.className = 'art-scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  const revealElements = [...content.querySelectorAll('.resume-intro-copy>*,.resume-details>.resume-block,.section-title,.create>.discipline,.reform .reform-heading,.reform-bottom,.contact h2,.contact-bottom')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting || entry.boundingClientRect.top < 0);
    });
  }, { threshold: .08, rootMargin: '0px 0px -30px 0px' });
  revealElements.forEach((element, index) => {
    element.classList.add('art-reveal');
    element.style.setProperty('--reveal-delay', (index % 3) * 55 + 'ms');
    observer.observe(element);
  });
  const header = document.querySelector('body>header');
  const portrait = content.querySelector('.portrait');
  const reducedMotion = matchMedia('(prefers-reduced-motion:reduce)');
  let frame = null;
  function update() {
    frame = null;
    const enabled = document.body.dataset.world === 'art';
    if (!enabled) return;
    const headerHeight = header.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--art-header-height', headerHeight + 'px');
    const scrollRange = document.documentElement.scrollHeight - innerHeight;
    document.documentElement.style.setProperty('--art-page-progress', Math.max(0, Math.min(1, scrollRange > 0 ? scrollY / scrollRange : 0)));
    const desktop = innerWidth > 800 && !reducedMotion.matches;
    cards.forEach((card, index) => {
      let amount = 0;
      if (desktop && anchors[index + 1]) {
        const distance = anchors[index + 1].getBoundingClientRect().top - headerHeight - 20 - (index + 1) * 15;
        amount = Math.max(0, Math.min(1, 1 - distance / (innerHeight * .75)));
      }
      card.style.setProperty('--stack-scale', (1 - amount * .055).toFixed(4));
      card.style.setProperty('--stack-brightness', (1 - amount * .22).toFixed(4));
    });
    if (desktop) {
      const distance = content.querySelector('.resume-about').getBoundingClientRect().top;
      portrait.style.setProperty('--portrait-shift', Math.max(-14, Math.min(14, -distance * .025)) + 'px');
    } else portrait.style.setProperty('--portrait-shift', '0px');
  }
  function schedule() {
    if (frame === null) frame = requestAnimationFrame(update);
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  addEventListener('world-preview', schedule);
  reducedMotion.addEventListener('change', schedule);
  new ResizeObserver(schedule).observe(header);
  new ResizeObserver(schedule).observe(content);
  schedule();
})();
