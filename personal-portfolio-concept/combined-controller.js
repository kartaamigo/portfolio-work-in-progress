const hero = document.querySelector('.hero');
const body = document.body;
const caption = document.getElementById('hero-caption');
const returnButton = document.querySelector('.world-center-return');
const portfolio = document.querySelector('.portfolio-content');
const names = { neutral: 'Два мира, один автор', art: 'SoulArt / KRTY', digital: 'RE: FORM' };
const captions = {
  neutral: 'Мария Матвеева. Графический дизайнер.<br>Включи SoulArt или Reform, чтобы начать.',
  art: 'Айдентика. Постеры. Обложки.<br>Графический дизайн и иллюстрация.',
  digital: 'Reform - один из моих проектов.<br>Пространство для собственных цифровых идей.'
};
let selectedWorld = 'neutral';
const sectionNames = { art: 'soulart', digital: 'reform', photography: 'photography' };
function rememberSection(world) {
  const url = new URL(location.href);
  if (sectionNames[world]) url.searchParams.set('section', sectionNames[world]);
  else url.searchParams.delete('section');
  history.replaceState({...history.state, portfolioWorld: world}, '', url);
}
function preview(world) {
  body.dataset.preview = world;
  caption.innerHTML = captions[world];
  const digitalFrame = document.querySelector('.digital-frame');
  digitalFrame.inert = world !== 'digital';
  if (world !== 'digital') document.getElementById('reform-dialog').hidden = true;
  window.dispatchEvent(new CustomEvent('world-preview', { detail: world }));
}
function choose(world, remember = true) {
  if (!Object.hasOwn(names, world)) return;
  selectedWorld = world;
  body.dataset.world = world;
  if (remember) rememberSection(world);
  portfolio.hidden = world === 'neutral';
  preview(world);
  document.querySelectorAll('[data-switch]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.switch === world));
  });
  returnButton.hidden = world === 'neutral';
  document.getElementById('world-status').textContent = 'Выбрано направление: ' + names[world];
  window.scrollTo({ top: 0, behavior: 'instant' });
}
document.querySelectorAll('[data-pick]').forEach(button => {
  button.removeAttribute('data-pick');
  button.tabIndex = -1;
  button.disabled = true;
});
document.querySelectorAll('[data-switch]').forEach(button => {
  button.addEventListener('click', () => {
    choose(selectedWorld === button.dataset.switch ? 'neutral' : button.dataset.switch);
    if (scrollY > hero.offsetTop) window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth' });
  });
});
document.querySelector('.world-reset').addEventListener('click', () => choose('neutral'));
returnButton.addEventListener('click', () => choose('neutral'));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    const previous = selectedWorld;
    choose('neutral');
    if (previous !== 'neutral') document.getElementById('world-slider').focus({ preventScroll: true });
  }
});
document.querySelectorAll('header nav a,.hero .scroll-cue').forEach(link => {
  link.addEventListener('click', event => {
    const href = link.getAttribute('href');
    if (!href?.startsWith('#')) return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    if (selectedWorld === 'neutral' || target.id === 'reform') choose(target.id === 'reform' ? 'digital' : 'art');
    requestAnimationFrame(() => target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth', block: 'start' }));
  });
});
hero.addEventListener('pointermove', event => {
  if (body.dataset.preview !== 'digital' || event.pointerType === 'touch' || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const bounds = hero.getBoundingClientRect();
  hero.style.setProperty('--motion-x', ((event.clientX - bounds.left) / bounds.width - .5) * 24 + 'px');
  hero.style.setProperty('--motion-y', ((event.clientY - bounds.top) / bounds.height - .5) * 16 + 'px');
});
hero.addEventListener('pointerleave', () => {
  hero.style.setProperty('--motion-x', '0px');
  hero.style.setProperty('--motion-y', '0px');
});
document.querySelector('.hero .small-note').innerHTML = 'Ползунок влево - SoulArt.<br>Вправо - Reform.';
// A fresh visit starts at home. Reloading restores this tab's selected world.
choose('neutral', false);
document.addEventListener('DOMContentLoaded', () => {
  const url = new URL(location.href);
  const section = url.searchParams.get('section');
  const world = Object.keys(sectionNames).find(world => sectionNames[world] === section);
  const navigation = performance.getEntriesByType('navigation')[0]?.type;
  let requested = false;
  try {
    const pending = JSON.parse(sessionStorage.getItem('portfolio-navigation') || 'null');
    sessionStorage.removeItem('portfolio-navigation');
    requested = pending?.pathname === url.pathname && pending?.section === section && Date.now() - pending.created < 30000;
  } catch {}
  const reloading = navigation === 'reload' && history.state?.portfolioWorld === world;
  choose(world && Object.hasOwn(names, world) && (reloading || requested) ? world : 'neutral');
}, { once: true });

window.addEventListener('pageshow', event => { if (event.persisted) choose('neutral'); });
