(() => {
  const previewDimensions = {"vdnh-6310": [320, 213], "vdnh-6327": [320, 213], "vdnh-6336": [320, 480], "vdnh-6342": [320, 480], "vdnh-6344": [320, 497], "vdnh-6346": [320, 213], "vdnh-6351": [320, 238], "porsche": [320, 441], "flower": [320, 213], "flowers": [320, 213], "dolgo-6704": [320, 480], "dolgo-6706": [320, 212], "dolgo-6708": [320, 480], "dolgo-6709": [320, 480], "dolgo-6711": [320, 480], "dolgo-6715": [320, 480], "dolgo-6717-v2": [320, 458], "dolgo-6717": [320, 458], "dolgo-6720": [320, 480], "dolgo-6732": [320, 480], "dolgo-6751": [320, 480], "dolgo-6752": [320, 480]};
  function previewImage(file, description, sizes) {
    const [width,height]=previewDimensions[file];
    return `<img src="assets/photography/${file}-preview-320.webp" srcset="assets/photography/${file}-preview-320.webp 320w, assets/photography/${file}-preview-640.webp 640w" sizes="${sizes}" width="${width}" height="${height}" alt="${description}" loading="lazy" decoding="async">`;
  }
  names.photography = '#Картавый / Фотография';
  captions.photography = 'Портреты и съёмка мероприятий.<br>Мария Матвеева - фотограф.';
  const section = document.createElement('section');
  section.className = 'photography-world';
  section.id = 'photography';
  section.innerHTML = `<nav class="photo-navigation" aria-label="Навигация фотопортфолио"><a href="#photo-works">Работы</a><a href="#photo-about">Обо мне</a><a href="#photo-contacts">Контакты</a></nav><div class="photo-hero"><div class="photo-hero-copy"><span class="tiny">#КАРТАВЫЙ / ФОТОГРАФИЯ</span><h2 tabindex="-1">Мария Матвеева<br><em>- фотограф.</em></h2><p>Снимаю улицы, людей и жизнь своего колледжа. Замечаю моменты, которые легко пропустить.</p><a class="photography-contact" href="#photo-works">Посмотреть работы ↓</a></div></div><div class="photo-works" id="photo-works"><div class="photo-categories" role="group" aria-label="Категории фотографий"><button type="button" data-photo-category="street" aria-pressed="true" aria-controls="photo-street">Стрит-фотография</button><button type="button" data-photo-category="college" aria-pressed="false" aria-controls="photo-college">Жизнь колледжа</button></div><div id="photo-street"><p class="photography-pending">Подборки фотографий.</p></div><div id="photo-college" hidden><h3>Жизнь колледжа</h3><p>Мероприятия, репортажи и студенческие будни.</p><p>Фотографии этой категории появятся здесь позже.</p></div></div><div class="photography-intro photo-about" id="photo-about"><div class="photography-symbol-frame"><img class="photography-symbol" src="assets/photographer-about.svg" alt="" aria-hidden="true" width="132" height="174" loading="lazy" decoding="async"></div><div><h3>Обо мне</h3><p>Я фотограф, снимаю два года. Больше всего люблю стрит-фотографию - гуляю и ловлю живые моменты.</p><p>Ещё работаю в колледже фотографом: снимаю людей, портреты, мероприятия, всякие студенческие события. Так что умею и поймать случайный кадр, и нормально поработать с человеком, и не растеряться, когда вокруг шумно и всё быстро.</p></div></div><div class="photo-contact-section" id="photo-contacts"><span class="tiny">ДАВАЙ ОБЩАТЬСЯ</span><h3>Есть идея для съёмки?</h3><p>Хотите предложить съёмку или обсудить мои фотографии? Напишите мне.</p><a class="photography-contact" href="https://t.me/designeramigo" target="_blank" rel="noopener">Написать в Telegram</a></div><div class="photo-footer">© 2026 Мария Матвеева / #Картавый <a href="https://t.me/designeramigo" target="_blank" rel="noopener">Telegram</a></div>`;
  document.querySelector('.portfolio-content').prepend(section);
  section.querySelector('.photo-hero').after(section.querySelector('#photo-about'));
  section.querySelectorAll('.photo-navigation a,.photo-hero-copy a').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      if (link.getAttribute('href') === '#photo-works') openAlbum(0);
      else section.querySelector(link.getAttribute('href')).scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth' });
    });
  });
  section.querySelectorAll('[data-photo-category]').forEach(button => {
    button.addEventListener('click', () => {
      const street = button.dataset.photoCategory === 'street';
      section.querySelector('#photo-street').hidden = !street;
      section.querySelector('#photo-college').hidden = street;
      section.querySelectorAll('[data-photo-category]').forEach(tab => tab.setAttribute('aria-pressed', String(tab === button)));
    });
  });
  const photos = [
    ['vdnh-6310', 'Высотное здание под облаками', 'houses'],
    ['vdnh-6327', 'Солнечный сад', 'nature'],
    ['vdnh-6336', 'Геометрия городских фасадов', 'houses'],
    ['vdnh-6342', 'Здание на фоне голубого неба', 'houses'],
    ['vdnh-6344', 'Бетонный фасад и лестницы', 'houses'],
    ['vdnh-6346', 'Облака над деревьями', 'nature'],
    ['vdnh-6351', 'Человек с рюкзаком на прогулке', 'people'],
    ['porsche', 'Porsche в тени деревьев', 'transport'],
    ['flower', 'Белые цветы крупным планом', 'nature'],
    ['flowers', 'Розовые и белые цветы', 'nature'],
    ['dolgo-6704', 'Высотный жилой дом в солнечном свете', 'houses'],
    ['dolgo-6706', 'Дом с жёлтыми деталями фасада', 'houses'],
    ['dolgo-6708', 'Жилой дом за деревьями', 'houses'],
    ['dolgo-6709', 'Дом среди осенней листвы', 'houses'],
    ['dolgo-6711', 'Городской дом и пешеходный переход', 'houses'],
    ['dolgo-6715', 'Электричка у осеннего леса', 'transport'],
    ['dolgo-6717-v2', 'Проезжающий поезд - обработка 2.0', 'edits'],
    ['dolgo-6717', 'Проезжающий поезд - зернистая обработка', 'edits'],
    ['dolgo-6720', 'Современные жилые корпуса', 'houses'],
    ['dolgo-6732', 'Дорожка среди высоких деревьев', 'nature'],
    ['dolgo-6751', 'Лесная аллея с фонарями', 'nature'],
    ['dolgo-6752', 'Прогулка по лесной аллее', 'nature']
  ];
  const albums = [
    { id: 'houses', name: 'Дома и архитектура', cover: 'dolgo-6704' },
    { id: 'nature', name: 'Природа и прогулки', cover: 'dolgo-6751' },
    { id: 'transport', name: 'Транспорт', cover: 'dolgo-6715' },
    { id: 'people', name: 'Люди', cover: 'vdnh-6351' },
    { id: 'edits', name: 'Необычные обработки', cover: 'dolgo-6717-v2' }
  ].map(album => ({ ...album, photos: photos.filter(photo => photo[2] === album.id) }));
  const gallery = document.createElement('div');
  gallery.className = 'photography-gallery';
  gallery.hidden = true;
  gallery.innerHTML = '<div class="photo-albums-heading"><button type="button" class="photo-overview-return">Все подборки</button><h3></h3><p></p></div><div class="photo-album-tabs" aria-label="Подборки"></div><div class="photo-masonry"></div>';
  gallery.querySelector('.photo-album-tabs').innerHTML = albums.map((album,index) => `<button type="button" data-select-album="${index}">${album.name}</button>`).join('');
  section.querySelector('.photography-pending').replaceWith(gallery);
  const hero = section.querySelector('.photo-hero');
  hero.innerHTML = `<div class="photo-mosaic">${photos.map(([file,description,category],index) => `<button type="button" data-preview-album="${albums.findIndex(album=>album.id===category)}" aria-label="Открыть подборку: ${albums.find(album=>album.id===category).name}">${previewImage(file,description,index%7===1 ? '(max-width:480px) 33vw, (max-width:1100px) 50vw, 33vw' : '(max-width:480px) 33vw, (max-width:1100px) 25vw, 16vw')}<span>${albums.find(album=>album.id===category).name}<b>Смотреть подборку ↗</b></span></button>`).join('')}</div><div class="photo-hero-copy"><span class="tiny">#КАРТАВЫЙ ФОТОГРАФ</span><h2 tabindex="-1">Мария Матвеева</h2><p>Стрит-фотография, люди и события.</p><small>Нажми на снимок, чтобы открыть похожие фотографии.</small></div>`;
  function openAlbum(index, scroll = true) {
    albumIndex = index;
    const album = albums[index];
    gallery.hidden = false;
    section.querySelector('#photo-street').hidden = false;
    section.querySelector('#photo-college').hidden = true;
    section.querySelectorAll('[data-photo-category]').forEach(tab=>tab.setAttribute('aria-pressed',String(tab.dataset.photoCategory==='street')));
    gallery.querySelector('h3').textContent = album.name;
    gallery.querySelector('.photo-albums-heading p').textContent = `${album.photos.length} фото. Нажми на снимок, чтобы посмотреть его крупнее.`;
    gallery.querySelectorAll('[data-select-album]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.selectAlbum)===index)));
    gallery.querySelector('.photo-masonry').innerHTML = album.photos.map(([file,description],photo)=>`<button type="button" data-photo="${photo}" aria-label="Посмотреть: ${description}">${previewImage(file,description,'(max-width:800px) 45vw, (max-width:1100px) 30vw, 22vw')}</button>`).join('');
    if(scroll)gallery.scrollIntoView({block:'start',behavior:'instant'});
  }
  hero.querySelectorAll('[data-preview-album]').forEach(button=>{
    button.addEventListener('click',()=>openAlbum(Number(button.dataset.previewAlbum)));
  });
  gallery.querySelector('.photo-overview-return').addEventListener('click',()=>{
    openAlbum(0, false);
    hero.scrollIntoView({block:'start',behavior:'instant'});
    hero.querySelector('[data-preview-album]').focus({preventScroll:true});
  });
  gallery.querySelector('.photo-album-tabs').addEventListener('click',event=>{
    const button=event.target.closest('[data-select-album]');
    if(button)openAlbum(Number(button.dataset.selectAlbum));
  });
  const dialog = document.createElement('dialog');
  dialog.className = 'photography-lightbox';
  dialog.setAttribute('aria-label', 'Просмотр фотографий #Картавый');
  dialog.innerHTML = '<h3 class="photo-album-title" id="photo-album-title"></h3><button type="button" class="photo-close" aria-label="Закрыть фото">✕</button><img alt="" draggable="false"><div class="photo-controls"><button type="button" class="photo-prev" aria-label="Предыдущее фото">←</button><span aria-live="polite"></span><button type="button" class="photo-next" aria-label="Следующее фото">→</button></div>';
  dialog.setAttribute('aria-labelledby', 'photo-album-title');
  document.body.append(dialog);
  let photoIndex = 0;
  let albumIndex = 0;
  function renderPhoto() {
    const album = albums[albumIndex];
    const [file, description] = album.photos[photoIndex];
    dialog.querySelector('.photo-album-title').textContent = album.name;
    dialog.querySelector('img').src = `assets/photography/${file}.webp`;
    dialog.querySelector('img').alt = description;
    dialog.querySelector('.photo-controls span').textContent = `${photoIndex + 1} / ${album.photos.length}`;
    dialog.querySelector('.photo-prev').disabled = album.photos.length < 2;
    dialog.querySelector('.photo-next').disabled = album.photos.length < 2;
  }
  function stepPhoto(direction) {
    const count = albums[albumIndex].photos.length;
    photoIndex = (photoIndex + direction + count) % count;
    renderPhoto();
  }
  gallery.addEventListener('click', event => {
    const button = event.target.closest('[data-photo]');
    if (!button) return;
    photoIndex = Number(button.dataset.photo);
    renderPhoto();
    dialog.showModal();
  });
  dialog.querySelector('.photo-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.photo-prev').addEventListener('click', () => stepPhoto(-1));
  dialog.querySelector('.photo-next').addEventListener('click', () => stepPhoto(1));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  let swipeStart = null;
  dialog.querySelector('img').addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch') return;
    swipeStart = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  });
  dialog.querySelector('img').addEventListener('pointerup', event => {
    if (!swipeStart) return;
    const horizontal = event.clientX - swipeStart.x;
    const vertical = event.clientY - swipeStart.y;
    swipeStart = null;
    if (Math.abs(horizontal) > 40 && Math.abs(horizontal) > Math.abs(vertical)) stepPhoto(horizontal < 0 ? 1 : -1);
  });
  dialog.querySelector('img').addEventListener('pointercancel', () => { swipeStart = null; });
  document.addEventListener('keydown', event => {
    if (!dialog.open || !['Escape', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (event.key === 'Escape') dialog.close();
    else stepPhoto(event.key === 'ArrowLeft' ? -1 : 1);
  }, true);
  function openPhotography() {
    choose('photography');
    window.scrollTo({ top: 0, behavior: 'instant' });
    const heading=section.querySelector('#photo-about h3');
    heading.tabIndex=-1;
    heading.focus({ preventScroll: true });
  }
  window.addEventListener('world-preview',event=>{
    if(event.detail!=='photography')return;
    openAlbum(0, false);
    requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'instant'}));
  });
  const camera = document.createElement('button');
  camera.type = 'button';
  camera.className = 'studio-camera';
  camera.setAttribute('aria-label', 'Открыть фотографии #Картавый');
  camera.innerHTML = '<span>Смотреть фото <b aria-hidden="true">↗</b></span>';
  const stage = document.querySelector('.studio-center');
  const glow = document.createElement('span');
  glow.className = 'studio-camera-glow';
  glow.setAttribute('aria-hidden', 'true');
  stage.prepend(glow);
  stage.append(camera);
  camera.addEventListener('click', openPhotography);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.body.dataset.world === 'photography') {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        camera.focus({ preventScroll: true });
      });
    }
  }, true);
})();
