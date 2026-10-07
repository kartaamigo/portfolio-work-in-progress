(() => {
  const hero = document.querySelector('.hero');
  document.querySelector('.artwork-neutral')?.remove();
  document.querySelector('.header-worlds').innerHTML = '<button class="world-reset" type="button">Выбрать мир ↔</button>';
  const panel = document.createElement('div');
  panel.className = 'world-selector';
  panel.dataset.selection = 'neutral';
  panel.innerHTML = `<div class="selector-heading"><span>МАРИЯ МАТВЕЕВА / MULTIDISCIPLINARY DESIGNER</span><h2>Два мира. Один автор.</h2><p>Передвинь ползунок в сторону своего мира.</p></div><div class="world-slider"><div class="slider-light" aria-hidden="true"></div><span class="slider-label slider-label-art" aria-hidden="true"><b>SoulArt</b><small>ГРАФИКА · АЙДЕНТИКА</small></span><span class="slider-label slider-label-digital" aria-hidden="true"><b>Reform</b><small>ИДЕИ · ПРОЕКТЫ</small></span><span class="slider-orb" aria-hidden="true"><span>↔</span></span><input id="world-slider" type="range" min="-1" max="1" step="1" value="0" aria-label="Выбор мира: влево SoulArt, вправо Reform, по центру начальный экран" aria-valuetext="Начальный экран - выбери сторону" aria-controls="portfolio-content"></div><p class="selector-hint">← SOULART &nbsp;&nbsp; / &nbsp;&nbsp; REFORM →</p>`;
  hero.append(panel);
  const introductions = document.createElement('div');
  introductions.className = 'world-intros';
  introductions.innerHTML = `<section class="world-intro world-intro-art" id="soulart-intro"><span>01</span><h2>SoulArt <small>/ KRTY</small></h2><p>Иллюстрация. Айдентика.<br>Дизайн для брендов и проектов.</p></section><section class="world-intro world-intro-digital" id="reform-intro"><span>02</span><h2>RE: FORM <small>design · code · life</small></h2><p>Дизайн | Код | Удобство.<br>Идея, которая поможет.</p></section></div>`;
  panel.prepend(introductions);
  document.querySelector('.portfolio-content').id = 'portfolio-content';
  const slider = panel.querySelector('input');
  slider.setAttribute('aria-describedby', 'soulart-intro reform-intro');
  slider.addEventListener('pointerdown', () => { panel.dataset.focusMode = 'pointer'; });
  slider.addEventListener('keydown', () => { panel.dataset.focusMode = 'keyboard'; });
  document.addEventListener('keydown', event => {
    if (event.key === 'Tab') panel.dataset.focusMode = 'keyboard';
  });
  const values = { '-1': 'art', '0': 'neutral', '1': 'digital' };
  const descriptions = { art: 'SoulArt - визуальные истории', neutral: 'Начальный экран - выбери сторону', digital: 'Reform - цифровые проекты' };
  slider.addEventListener('input', () => {
    const selection = values[slider.value];
    panel.dataset.selection = selection;
    slider.setAttribute('aria-valuetext', descriptions[selection]);
    panel.querySelector('.slider-orb>span').textContent = selection === 'art' ? '✳' : selection === 'digital' ? '↗' : '↔';
  });
  slider.addEventListener('change', () => choose(values[slider.value]));
  addEventListener('world-preview', () => {
    const selection = document.body.dataset.world;
    panel.dataset.selection = selection;
    slider.value = selection === 'art' ? '-1' : selection === 'digital' ? '1' : '0';
    slider.setAttribute('aria-valuetext', descriptions[selection]);
    panel.querySelector('.slider-orb>span').textContent = selection === 'art' ? '✳' : selection === 'digital' ? '↗' : '↔';
  });
})();
