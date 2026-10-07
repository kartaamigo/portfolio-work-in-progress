(() => {
  const compact = document.body.dataset.studio === 'compact';
  const stage = document.createElement('div');
  stage.className = 'studio-center';
  stage.innerHTML = `<img class="studio-base" src="${compact ? 'assets/studio-center-camera-720.webp' : 'assets/studio-center.png'}" srcset="${compact ? 'assets/studio-center-camera-720.webp 720w, assets/studio-center-camera-1440.webp 1440w' : ''}" sizes="(max-width:800px) 82vw, (min-width:1675px) 720px, 43vw" fetchpriority="high" decoding="async" alt="Моё творческое пространство: монитор с зайцем, графический планшет, скетчбук и музыкальные инструменты"><img class="studio-icon studio-ps" src="assets/studio-photoshop${compact ? '-trim' : ''}.png" alt="" aria-hidden="true"><img class="studio-icon studio-ai" src="assets/studio-illustrator${compact ? '-trim' : ''}.png" alt="" aria-hidden="true"><img class="studio-icon studio-pr" src="assets/studio-premiere${compact ? '-trim' : ''}.png" alt="" aria-hidden="true"><span class="studio-screen" aria-hidden="true"></span><button type="button" class="studio-hat" aria-label="Приветствие Марии - нажми на шапку" aria-expanded="false" aria-controls="studio-greeting"></button><div class="studio-greeting" id="studio-greeting" role="dialog" aria-label="Приветствие Марии" hidden><button type="button" class="studio-greeting-close" aria-label="Закрыть приветствие">×</button><span>МАРИЯ / ПРИВЕТ! ✳</span><p>Привет! Рада, что ты заглянул.</p><p>Здесь можно узнать меня как дизайнера и человека, который превращает идеи в реальные проекты.</p><small>Выбери SoulArt или Reform - и давай знакомиться.</small></div>`;
  document.querySelector('.hero').append(stage);
  if (document.body.dataset.studio === 'compact') {

    stage.querySelector('.studio-base').alt = 'Творческий стол Марии: монитор с зайцем, синяя шапка, наушники, гитара, скетчбук, графический планшет, геймпады и фотоаппарат Canon EOS';

  }
  const hat = stage.querySelector('.studio-hat');
  const greeting = stage.querySelector('.studio-greeting');
  let closeTimer;
  let hideTimer;
  let revealFrame;
  greeting.inert = true;
  function fitGreeting() {
    const headerBottom = document.querySelector('body>header').getBoundingClientRect().bottom;
    const minimumTop = Math.max(20, headerBottom + 20);
    const bottom = stage.getBoundingClientRect().top + greeting.offsetTop + greeting.offsetHeight;
    const fit = Math.min(1, Math.max(.55, (bottom - minimumTop) / greeting.offsetHeight));
    greeting.style.setProperty('--greeting-fit', fit.toFixed(4));
  }
  function show(open) {
    clearTimeout(closeTimer);
    clearTimeout(hideTimer);
    cancelAnimationFrame(revealFrame);
    hat.setAttribute('aria-expanded', String(open));
    greeting.inert = !open;
    if (open) {
      if (greeting.hidden) {
        greeting.hidden = false;
      }
      fitGreeting();
      revealFrame = requestAnimationFrame(() => greeting.classList.add('is-open'));
    } else {
      greeting.classList.remove('is-open');
      hideTimer = setTimeout(() => { greeting.hidden = true; }, matchMedia('(prefers-reduced-motion:reduce)').matches ? 0 : 320);
    }
  }
  function delayClose() {
    closeTimer = setTimeout(() => {
      if (!greeting.matches(':hover') && !greeting.contains(document.activeElement) && document.activeElement !== hat) show(false);
    }, 250);
  }
  hat.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') show(true); });
  hat.addEventListener('pointerleave', delayClose);
  hat.addEventListener('focus', () => show(true));
  hat.addEventListener('click', () => show(true));
  greeting.addEventListener('pointerenter', () => clearTimeout(closeTimer));
  greeting.addEventListener('pointerleave', delayClose);
  stage.addEventListener('focusout', delayClose);
  greeting.querySelector('button').addEventListener('click', () => show(false));
  document.addEventListener('pointerdown', event => { if (!stage.contains(event.target)) show(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !greeting.hidden) {
      event.stopImmediatePropagation();
      show(false);
    }
  }, true);
  addEventListener('world-preview', () => show(false));
  addEventListener('resize', () => { if (!greeting.hidden) fitGreeting(); });
})();
