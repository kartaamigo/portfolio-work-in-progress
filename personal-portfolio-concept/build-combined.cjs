const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const sharp = require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const patchEngine = 'C:/Users/1/AppData/Local/OpenAI/Codex/bin/be3fd7e5c1969ff6/codex.exe';
const root = __dirname;
function addFile(filename, content) {
  const target = path.join(root, filename);
  if (fs.existsSync(target)) throw new Error('Refusing to replace existing file: ' + target);
  const patch = '*** Begin Patch\n*** Add File: ' + target.replaceAll('\\', '/') + '\n' + content.split('\n').map(line => '+' + line).join('\n') + '\n*** End Patch\n';
  console.log(execFileSync(patchEngine, ['--codex-run-as-apply-patch', patch], { encoding: 'utf8' }));
}
(async () => {
  const original = fs.readFileSync(path.join(root, '../dual-world/index.html'), 'utf8');
  let hero = original.match(/<section class="hero"[\s\S]*?<\/section>/)[0];
  hero = hero.replaceAll('src="assets/', 'src="../dual-world/assets/').replace('href="#content"', 'href="#about"');
  hero = hero.replace('alt="" fetchpriority="high"', 'alt="Мария Матвеева и розовый заяц" fetchpriority="high"');
  hero = hero.replace('<h1>SoulArt', '<h2>SoulArt').replace('/ KRTY</span></h1>', '/ KRTY</span></h2>');
  hero = hero.replace('<div class="artwork-track">', '<div class="artwork-track"><h1 class="background-manifesto">НЕ ПО ШАБЛОНУ<span>.</span></h1>');
  hero = hero.replace('../dual-world/assets/hero-art-v2.png', 'assets/world-art-transparent.png');
  const reference = await sharp(path.join(root, '../dual-world/assets/hero-art-v2.png')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let offset = 0; offset < reference.data.length; offset += 4) {
    const brightness = Math.max(reference.data[offset], reference.data[offset + 1], reference.data[offset + 2]);
    reference.data[offset + 3] = Math.round(reference.data[offset + 3] * Math.min(1, Math.max(0, (brightness - 22) / 30)));
  }
  await sharp(reference.data, { raw: { width: reference.info.width, height: reference.info.height, channels: 4 } }).png().toFile(path.join(root, 'assets/world-art-transparent.png'));
  fs.copyFileSync('Z:/_Flame. Custom&KRTY/резюме/resume3.0.jpg', path.join(root, 'assets/maria-resume.jpg'));
  await sharp(path.join(root, 'assets/maria-resume.jpg')).extract({ left: 40, top: 151, width: 474, height: 549 }).jpeg({ quality: 94 }).toFile(path.join(root, 'assets/maria-portrait.jpg'));
  const about = `<section class="resume-about" id="about">
<div class="resume-title"><span class="tiny">01 / ОБО МНЕ — ПЕРЕД ТЕМ, КАК СМОТРЕТЬ РАБОТЫ</span><span class="hand-note">знакомимся ↘</span></div>
<div class="resume-intro"><div class="portrait"><img src="assets/maria-portrait.jpg" alt="Иллюстрированный портрет Марии из резюме"><span>DESIGNER / SINCE 2022</span></div><div class="resume-intro-copy"><div class="tiny">MATVEEVA MARIA / GRAPHIC DESIGNER</div><h2>Мария<br>Матвеева<span>✳</span></h2><h3>Стиль уже со мной.<br><em>Опыт приходит.</em></h3><p>С 2022 года занимаюсь графическим дизайном. За это время освоила композицию, типографику, цветовую гармонию и работу со стилем. Понимаю, как визуал должен решать задачу, и всегда ищу в каждом элементе смысл.</p><p>Работала над учебными и личными проектами: айдентика, постеры, обложки, контент для соцсетей. Постоянно слежу за трендами, развиваю навыки. Открыта к реальным проектам, чтобы расти как специалист и создавать качественный продукт.</p><div class="resume-actions"><a href="assets/maria-resume.jpg" target="_blank" rel="noopener">Резюме целиком ↗</a><a href="https://t.me/designeramigo" target="_blank" rel="noopener">Обсудить проект ↗</a></div></div></div>
<div class="resume-details"><div class="resume-block"><h4><span>01</span> Опыт</h4><article><small>2023 / BEE PRO</small><h5>Графический дизайнер</h5><p>Дизайн карточек товаров для сайта.</p></article><article><small>2025–2026 / КОЛЛЕДЖ</small><h5>Фотограф</h5><p>Съёмка мероприятий и портретов.</p></article><article><small>С 2026 / КОЛЛЕДЖ</small><h5>Графический дизайнер</h5><p>Создание карточек и визуальных материалов.</p></article></div>
<div class="resume-block"><h4><span>02</span> Образование</h4><article><small>2023–2025</small><h5>IT TOP Academy</h5><p>Графический дизайн.<br>Композиция, типографика, цвет, айдентика, digital-дизайн. Практика и современные подходы.</p></article><h4 class="tools-heading">Инструменты</h4><div class="tool-set"><span>Ps</span><span>Ai</span><span>Id</span><span>Figma</span><span>Lr</span></div><p class="tool-names">Photoshop · Illustrator · InDesign · Figma · Lightroom</p></div>
<div class="resume-block"><h4><span>03</span> Навыки</h4><ul><li>Композиция и иерархия</li><li>Типографика</li><li>Цветокоррекция и гармония</li><li>Работа с референсами и мудбордами</li><li>Дизайн постеров и баннеров</li><li>Разработка айдентики и логотипов</li></ul></div>
<div class="resume-block"><h4><span>04</span> В работе</h4><ul><li>Креативное мышление</li><li>Внимание к деталям</li><li>Работа с критикой и гибкость</li><li>Тайм-менеджмент и ответственность</li><li>Быстрая обучаемость</li></ul><h4 class="tools-heading">Языки</h4><div class="languages"><span>Русский</span><span>Английский</span></div></div></div></section>`;
  const experimental = fs.readFileSync(path.join(root, 'experimental.html'), 'utf8');
  let lower = experimental.slice(experimental.indexOf('<section class="works"'), experimental.indexOf('</main>'));
  lower = lower.replace(/<section class="about"[\s\S]*?<\/section>/, '');
  lower = lower.replace('01 / ИЗБРАННЫЕ ПРОЕКТЫ', '02 / ИЗБРАННЫЕ ПРОЕКТЫ');
  lower = lower.replaceAll('НАЗВАНИЯ И ОБЛОЖКИ — ПРИМЕРЫ.', 'ПРОЕКТНЫЕ ОБЛОЖКИ — КОНЦЕПТЫ.');
  lower = lower.replace(/<section class="create">[\s\S]*?<\/section>/, `<section class="create"><div class="tiny">03 / ЧТО Я СОЗДАЮ</div><div class="discipline"><span>01</span><h3>Айдентику</h3><p>Логотипы, стиль и визуальные системы</p><b>↗</b></div><div class="discipline"><span>02</span><h3>Постеры и обложки</h3><p>Типографика, композиция, выразительная подача</p><b>↗</b></div><div class="discipline"><span>03</span><h3>Digital-дизайн</h3><p>Карточки товаров и контент для соцсетей</p><b>↗</b></div><div class="discipline"><span>04</span><h3>Фотографию</h3><p>Портреты и съёмка мероприятий</p><b>↗</b></div></section>`);
  lower = lower.replace('<div class="contact-links"><span>Telegram ↗</span><span>Почта ↗</span><span>Behance ↗</span></div>', '<div class="contact-links"><a href="https://t.me/designeramigo" target="_blank" rel="noopener">Telegram ↗</a><a href="mailto:xghostxsoulx@gmail.com">Почта ↗</a><a href="https://www.behance.net/tuumiyurmirazh" target="_blank" rel="noopener">Behance ↗</a></div>');
  lower = lower.replace('КОНТАКТЫ ДОБАВИМ ПОСЛЕ ТВОИХ РЕАЛЬНЫХ АДРЕСОВ.', 'XGHOSTXSOULX@GMAIL.COM / @DESIGNERAMIGO');
  let scopedCss = fs.readFileSync(path.join(root, 'experimental.css'), 'utf8');
  scopedCss = scopedCss.replace(/(^|[{}])([^{}]+)\{/g, (match, boundary, selector) => {
    if (selector.trim().startsWith('@')) return match;
    return boundary + selector.split(',').map(item => '.portfolio-content ' + item.trim()).join(',') + '{';
  });
  addFile('combined-editorial.css', scopedCss);
  const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#101012"><title>Мария Матвеева — не по шаблону</title>${['style.css', 'hero.css', 'reform-scene.css', 'world-scene.css', 'new-motion.css', 'desktop.css'].map(filename => '<link rel="stylesheet" href="../dual-world/' + filename + '">').join('')}<link rel="stylesheet" href="combined-editorial.css"><link rel="stylesheet" href="combined.css"><script src="combined-controller.js" defer></script><script src="../dual-world/reform-scene.js" defer></script></head><body data-world="neutral" data-preview="neutral"><header><a class="wordmark" href="#home">Мария Матвеева<span>GRAPHIC DESIGNER / KARTAAMIGO</span></a><nav aria-label="Навигация"><a href="#about">Обо мне</a><a href="#projects">Проекты</a><a href="#reform">Reform</a><a href="#contacts">Контакты ↗</a></nav><div class="header-worlds" role="group" aria-label="Выбор мира"><button data-switch="art" aria-pressed="false">SoulArt</button><button class="world-reset" type="button" aria-label="Оба мира">◐</button><button data-switch="digital" aria-pressed="false">RE: FORM</button></div></header><main>${hero}<div class="portfolio-content"><div class="ribbon"><span>ДЕЛАТЬ. ПРОБОВАТЬ. ПЕРЕДЕЛЫВАТЬ. ✳ ДЕЛАТЬ. ПРОБОВАТЬ. ПЕРЕДЕЛЫВАТЬ. ✳</span></div>${about}${lower}<footer><b>МАРИЯ МАТВЕЕВА<span>✳</span></b><span>НЕ ПО ШАБЛОНУ. ПО-НАСТОЯЩЕМУ.</span><a href="#home">НАВЕРХ ↑</a></footer></div></main><button class="world-center-return" type="button" hidden>↩ Вернуться в центр</button><div class="sr-only" id="world-status" aria-live="polite"></div></body></html>`;
  addFile('combined.html', html);
})();
