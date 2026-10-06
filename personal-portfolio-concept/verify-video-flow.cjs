const { chromium } = require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:8893/personal-portfolio-concept/combined.html');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(() => choose('digital'));
  const originalDigital = await page.locator('.portfolio-content').evaluate(element => element.innerText);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => choose('art'));
  const textPreserved = await page.evaluate(async () => {
    const original = new DOMParser().parseFromString(await (await fetch('combined.html')).text(), 'text/html').querySelector('.portfolio-content');
    const current = document.querySelector('.portfolio-content').cloneNode(true);
    current.querySelectorAll('.art-card-heading,.art-stack-anchor,.art-section-word').forEach(element => element.remove());
    const normalize = element => element.textContent.replace(/\s+/g, ' ').trim();
    return normalize(current) === normalize(original);
  });
  assert(textPreserved, 'All original portfolio text remains unchanged');
  assert.equal(await page.locator('.work-a').evaluate(element => getComputedStyle(element).position), 'sticky');
  assert.equal(await page.locator('.resume-about').evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(16, 16, 18)');
  assert(await page.evaluate(() => !!(document.querySelector('#about').compareDocumentPosition(document.querySelector('#projects')) & Node.DOCUMENT_POSITION_FOLLOWING)));
  for (const [selector, file] of [['#about','video-about.png'],['#projects','video-projects.png'],['.create','video-directions.png'],['#contacts','video-contact.png']]) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.evaluate(selector => window.scrollTo({ top: document.querySelector(selector).getBoundingClientRect().top + scrollY - 110, behavior: 'instant' }), selector);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(__dirname, file) });
  }
  await page.evaluate(() => window.scrollTo({ top: document.querySelectorAll('.art-stack-anchor')[1].getBoundingClientRect().top + scrollY - 150, behavior: 'instant' }));
  await page.waitForTimeout(300);
  const pinnedTop = await page.locator('.work-a').evaluate(element => element.getBoundingClientRect().top);
  const headerHeight = await page.locator('body>header').evaluate(element => element.getBoundingClientRect().height);
  assert(Math.abs(pinnedTop - headerHeight - 20) < 12, 'First card stays pinned as next arrives');
  await page.screenshot({ path: path.join(__dirname, 'video-project-stack.png') });
  for (const width of [320,390,800,1024,1920]) {
    await page.setViewportSize({ width, height: 900 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${width}`);
    if (width <= 800) assert.equal(await page.locator('.work-a').evaluate(element => getComputedStyle(element).position), 'relative');
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo({ top: document.querySelector('#about').getBoundingClientRect().top + scrollY, behavior: 'instant' }));
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(__dirname, 'video-about-mobile.png') });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.locator('.art-reveal').first().evaluate(element => getComputedStyle(element).opacity), '1');
  assert(!/отзывы|testimonials/i.test(await page.locator('.portfolio-content').innerText()));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => choose('digital'));
  assert.equal(await page.locator('.portfolio-content').evaluate(element => element.innerText), originalDigital, 'Digital side is unchanged');
  assert.deepEqual(errors, []);
  console.log('PASS: original text/order preserved; desktop stacked cards; mobile layout; reduced motion; no reviews or JS errors');
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
