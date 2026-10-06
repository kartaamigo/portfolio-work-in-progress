const { chromium } = require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const original = await browser.newPage();
  await original.route('https://**/*', route => route.abort());
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(pathToFileURL(path.join(__dirname, 'combined.html')).href);
  await page.evaluate(() => document.fonts.ready);
  assert(await page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)));
  assert(await page.evaluate(() => !!(document.getElementById('about').compareDocumentPosition(document.getElementById('projects')) & Node.DOCUMENT_POSITION_FOLLOWING)));
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.locator('a[href="mailto:xghostxsoulx@gmail.com"]').count(), 1);
  await page.screenshot({ path: path.join(__dirname, 'combined-desktop.png'), fullPage: true });
  const artworkSize = target => target.locator('.reform-playground').evaluate(element => {
    const bounds = element.getBoundingClientRect();
    return { width: bounds.width, height: bounds.height };
  });
  for (const [width, height] of [[1024, 768], [1366, 768], [1440, 1000], [1920, 1080], [2560, 1440]]) {
    await page.setViewportSize({ width, height });
    await original.setViewportSize({ width, height });
    await original.goto(pathToFileURL(path.join(__dirname, '../dual-world/index.html')).href, { waitUntil: 'domcontentloaded' });
    const originalSize = await artworkSize(original);
    const combinedSize = await artworkSize(page);
    assert(Math.abs(originalSize.width - combinedSize.width) < 1, 'Bunny width changed at ' + width);
    assert(Math.abs(originalSize.height - combinedSize.height) < 1, 'Bunny height changed at ' + width);
    for (const world of ['neutral', 'art', 'digital']) {
      await page.evaluate(value => choose(value), world);
      await page.waitForTimeout(800);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Overflow at ' + width);
      if (width === 1440) await page.screenshot({ path: path.join(__dirname, 'combined-hero-' + world + '.png') });
      if (world === 'digital') assert.equal(await page.locator('.reform-static').evaluate(element => getComputedStyle(element).animationName), 'none');
    }
    console.log('PASS: unchanged bunny dimensions and three states at ' + width + 'x' + height);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator('.world-reset').click();
  assert.equal(await page.getAttribute('body', 'data-world'), 'neutral');
  await page.locator('[data-switch="digital"]').click();
  await page.waitForTimeout(800);
  await page.locator('.motion-card').focus();
  await page.locator('.motion-card').press('Enter');
  await page.waitForTimeout(1000);
  assert(await page.locator('#reform-dialog').isVisible());
  await page.locator('.world-center-return').click();
  assert.equal(await page.getAttribute('body', 'data-world'), 'neutral');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(800);
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({ path: path.join(__dirname, 'combined-mobile.png'), fullPage: true });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(() => choose('digital'));
  assert.equal(await page.locator('.motion-card').evaluate(element => getComputedStyle(element).animationName), 'none');
  assert.deepEqual(errors, []);
  await browser.close();
  console.log('PASS: about before projects, resume contacts, tooltip, world controls, mobile and reduced motion.');
})();
