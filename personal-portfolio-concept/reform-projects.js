(() => {
  const projects = [
    {
      name: 'BLAZE',
      icon: 'B',
      color: '#b5ff24',
      features: ['Виджеты и заметки', 'Активность и статистика времени', 'Рабочие дни и цель месяца'],
      description: 'Рабочее пространство с виджетами, заметками, активностью и рабочими днями.',
      screens: [
        { image: 'assets/blaze-widgets.jpg', label: 'Виджеты и настройка заметки' },
        { image: 'assets/blaze-activity.jpg', label: 'Активность и статистика времени' },
        { image: 'assets/blaze-workdays.jpg', label: 'Рабочие дни и цель месяца' }
      ]
    },
    {
      name: 'RE: FORM LIFE',
      icon: 'R:',
      color: '#6680ff',
      features: ['Месячный планер', 'Задачи и личные дела', 'Интерфейс планирования'],
      description: 'Планирование задач и личных дел: месячный планер и интерфейс приложения.',
      screens: [
        { image: 'assets/reform-life-month.png', label: 'Месячный планер' },
        { image: 'assets/reform-life-screen.svg', label: 'Макет интерфейса' }
      ]
    }
  ];
  const gallery = document.createElement('div');
  gallery.className = 'digital-projects';
  gallery.innerHTML = projects.map((project, projectIndex) => `<article class="digital-project"><div class="digital-project-header"><span>0${projectIndex + 1} / ДИЗАЙН ИНТЕРФЕЙСА</span><h3>${project.name}</h3><p>${project.description}</p></div><div class="digital-project-screens">${project.screens.map((screen, screenIndex) => `<button type="button" data-project="${projectIndex}" data-screen="${screenIndex}" aria-label="Увеличить: ${project.name} - ${screen.label}"><img src="${screen.image}" alt="${project.name}: ${screen.label}" loading="lazy"><span>${screen.label}<b aria-hidden="true">↗</b></span></button>`).join('')}</div></article>`).join('');
  document.getElementById('projects').append(gallery);
  const drawer = document.createElement('div');
  drawer.className = 'reform-drawer';
  drawer.innerHTML = '<div class="reform-drawer-heading"><span>REFORM / МОИ ПРОЕКТЫ</span><h3>Идеи в одном ящике.</h3><p>Наведи на приложение и выбери, какое открыть.</p></div><div class="reform-drawer-cabinet"><div class="reform-drawer-tray">' + projects.map((project, index) => `<button type="button" class="reform-app" data-app="${index}" style="--app-color:${project.color}" aria-expanded="false" aria-controls="reform-detail-${index}"><span class="reform-app-icon" aria-hidden="true">${project.icon}</span><strong>${project.name}</strong><small>Открыть проект ↗</small></button>`).join('') + '</div><div class="reform-drawer-front" aria-hidden="true"><span></span></div></div>';
  gallery.before(drawer);
  gallery.querySelectorAll('.digital-project').forEach((article, index) => {
    article.hidden = true;
    article.id = `reform-detail-${index}`;
    const heading = article.querySelector('h3');
    heading.tabIndex = -1;
    const info = document.createElement('div');
    info.className = 'reform-project-info';
    info.innerHTML = `<span>АВТОРСКИЙ ПРОЕКТ / ДИЗАЙН ИНТЕРФЕЙСА</span><h4>Что внутри</h4><ul>${projects[index].features.map(feature => `<li>${feature}</li>`).join('')}</ul><p>Ниже - макеты проекта. Нажми на экран, чтобы рассмотреть его крупнее.</p><button type="button" class="reform-back">← К приложениям</button>`;
    article.querySelector('.digital-project-header').after(info);
    info.querySelector('button').addEventListener('click', () => {
      article.hidden = true;
      drawer.querySelector(`[data-app="${index}"]`).setAttribute('aria-expanded', 'false');
      drawer.scrollIntoView({ block: 'center', behavior: 'instant' });
      drawer.querySelector(`[data-app="${index}"]`).focus({ preventScroll: true });
    });
  });
  drawer.addEventListener('click', event => {
    const trigger = event.target.closest('[data-app]');
    if (!trigger) return;
    const selected = Number(trigger.dataset.app);
    drawer.querySelectorAll('[data-app]').forEach(button => button.setAttribute('aria-expanded', String(button === trigger)));
    gallery.querySelectorAll('.digital-project').forEach((article, index) => { article.hidden = index !== selected; });
    const article = gallery.querySelectorAll('.digital-project')[selected];
    article.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth' });
    article.querySelector('h3').focus({ preventScroll: true });
  });
  const dialog = document.createElement('dialog');
  dialog.className = 'project-lightbox';
  dialog.setAttribute('aria-labelledby', 'project-lightbox-title');
  dialog.innerHTML = '<div class="project-lightbox-bar"><h2 id="project-lightbox-title"></h2><button type="button" class="project-lightbox-close" aria-label="Закрыть макет">✕</button></div><div class="project-lightbox-image"><img alt=""></div><div class="project-lightbox-controls"><button type="button" class="project-lightbox-prev" aria-label="Предыдущий экран">←</button><span aria-live="polite"></span><button type="button" class="project-lightbox-next" aria-label="Следующий экран">→</button></div>';
  document.body.append(dialog);
  let projectIndex = 0;
  let screenIndex = 0;
  function render() {
    const project = projects[projectIndex];
    const screen = project.screens[screenIndex];
    dialog.querySelector('h2').textContent = project.name + ' / ' + screen.label;
    const image = dialog.querySelector('img');
    image.src = screen.image;
    image.alt = project.name + ': ' + screen.label;
    dialog.querySelector('.project-lightbox-controls span').textContent = (screenIndex + 1) + ' / ' + project.screens.length;
  }
  function step(direction) {
    screenIndex = (screenIndex + direction + projects[projectIndex].screens.length) % projects[projectIndex].screens.length;
    render();
  }
  gallery.addEventListener('click', event => {
    const trigger = event.target.closest('button[data-project]');
    if (!trigger) return;
    projectIndex = Number(trigger.dataset.project);
    screenIndex = Number(trigger.dataset.screen);
    render();
    dialog.showModal();
  });
  dialog.querySelector('.project-lightbox-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.project-lightbox-prev').addEventListener('click', () => step(-1));
  dialog.querySelector('.project-lightbox-next').addEventListener('click', () => step(1));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  document.addEventListener('keydown', event => {
    if (!dialog.open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopImmediatePropagation();
      dialog.close();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      event.stopImmediatePropagation();
      step(event.key === 'ArrowLeft' ? -1 : 1);
    }
  }, true);
})();
