(() => {
  const hero = document.querySelector('.hero');
  const sourceIntros = document.querySelectorAll('.world-intro');
  const projects = {
    art: [
      { image: '../dual-world/assets/profile/brandbook.jpg', name: 'Brand Book GxSoul/KRTY' },
      { image: '../dual-world/assets/profile/xfit.jpg', name: 'XFit Rebranding' },
      { image: '../dual-world/assets/profile/journal.jpg', name: 'Journal' }
    ],
    digital: [
      { image: 'assets/blaze-activity.jpg', name: 'BLAZE / Активность' },
      { image: 'assets/blaze-widgets.jpg', name: 'BLAZE / Виджеты' },
      { image: 'assets/reform-life-month.png', name: 'RE: FORM LIFE / Планер' }
    ]
  };
  const choices = document.createElement('div');
  choices.className = 'folder-choices';
  choices.setAttribute('aria-label', 'Папки проектов SoulArt и Reform');
  let touchMode = false;
  const items = [];
  for (const [index, world] of ['art', 'digital'].entries()) {
    const name = world === 'art' ? 'SoulArt' : 'Reform';
    const item = document.createElement('div');
    item.className = 'folder-item folder-' + world;
    item.dataset.open = 'false';
    const trigger = document.createElement('button');
    trigger.className = 'folder-launch';
    trigger.type = 'button';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', 'folder-details-' + world);
    trigger.setAttribute('aria-label', 'Показать работы ' + name);
    trigger.innerHTML = `<span class="folder-back" aria-hidden="true"></span><span class="folder-cards" aria-hidden="true">${projects[world].map((project, cardIndex) => `<span class="folder-card" style="--card:${cardIndex}"><img data-src="${project.image}" alt="" loading="lazy" decoding="async"><span>${project.name}</span></span>`).join('')}</span><span class="folder-front"><span class="folder-number">0${index + 1} / SELECTED WORK</span><span class="folder-name">${name}</span><span class="folder-mark" aria-hidden="true">↗</span><span class="folder-caption">${world === 'art' ? 'ГРАФИКА · АЙДЕНТИКА' : 'ЦИФРОВЫЕ ПРОЕКТЫ'}</span></span>`;
    const info = document.createElement('div');
    const action = document.createElement('span');
    action.className = 'folder-action';
    action.setAttribute('aria-hidden', 'true');
    action.innerHTML = 'Открыть папку <span>' + (world === 'art' ? '←' : '→') + '</span>';
    trigger.querySelector('.folder-mark').textContent = world === 'art' ? '↖' : '↗';
    trigger.querySelector('.folder-front').append(action);
    trigger.setAttribute('aria-label', 'Открыть ' + name + ' - посмотреть работы');
    info.className = 'folder-info';
    info.id = 'folder-details-' + world;
    info.inert = true;
    const description = sourceIntros[index].querySelector('p').cloneNode(true);
    const list = document.createElement('span');
    list.className = 'folder-project-list';
    list.textContent = world === 'digital' ? 'BLAZE · RE: FORM LIFE' : projects[world].map(project => project.name).join(' · ');
    const enter = document.createElement('button');
    enter.type = 'button';
    enter.className = 'folder-enter';
    enter.textContent = 'Открыть ' + name + ' ↗';
    enter.addEventListener('click', () => {
      setOpen(false);
      choose(world);
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    });
    info.append(description, list, enter);
    item.append(trigger, info);
    function setOpen(open) {
      item.dataset.open = String(open);
      trigger.setAttribute('aria-expanded', String(open));
      info.inert = !open;
    }
    item.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'touch') {
        touchMode = false;
        setOpen(true);
      }
    });
    item.addEventListener('pointerleave', event => {
      if (event.pointerType !== 'touch' && !touchMode && !item.contains(document.activeElement)) setOpen(false);
    });
    item.addEventListener('focusin', () => { if (!touchMode) setOpen(true); });
    item.addEventListener('focusout', event => {
      if (!item.contains(event.relatedTarget) && !item.matches(':hover')) setOpen(false);
    });
    trigger.addEventListener('pointerdown', event => { touchMode = event.pointerType === 'touch'; });
    trigger.addEventListener('click', () => {
      setOpen(false);
      choose(world);
      document.querySelector('.world-reset').focus({ preventScroll: true });
    });
    items.push({ item, setOpen });
    choices.append(item);
  }
  hero.append(choices);
  const selector = document.querySelector('.world-selector');
  selector.hidden = true;
  selector.inert = true;
  selector.setAttribute('aria-hidden', 'true');
  document.querySelector('.world-reset').textContent = 'К папкам ↔';
  document.querySelector('.hero .small-note').innerHTML = 'Наведи на папку.<br>На телефоне - нажми.';
  function updateCaption() {
    if (document.body.dataset.world === 'neutral') {
      document.getElementById('hero-caption').innerHTML = 'Матвеева Мария. Мультидисциплинарный дизайнер.<br>Открой папку SoulArt, Reform или же нажми на камеру, чтобы посмотреть работы.';
    }
  }
  updateCaption();
  document.addEventListener('keydown', event => {
    const world = document.body.dataset.world;
    if (event.key === 'Escape' && world !== 'neutral') {
      requestAnimationFrame(() => choices.querySelector('.folder-' + world + ' .folder-launch')?.focus({ preventScroll: true }));
    }
  }, true);
  document.addEventListener('pointerdown', event => {
    items.forEach(({ item, setOpen }) => { if (!item.contains(event.target)) setOpen(false); });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') items.forEach(({ setOpen }) => setOpen(false));
  });
  addEventListener('world-preview', () => {
    items.forEach(({ setOpen }) => setOpen(false));
    updateCaption();
  });
})();
