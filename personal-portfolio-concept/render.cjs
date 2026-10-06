const { chromium } = require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(path.join(__dirname, 'index.html')).href);
  await page.evaluate(() => document.fonts.ready);
  assert(await page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)));
  await page.screenshot({ path: path.join(__dirname, 'portfolio-design-desktop.png'), fullPage: true });
  await page.screenshot({ path: path.join(__dirname, 'portfolio-first-screen.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({ path: path.join(__dirname, 'portfolio-design-mobile.png'), fullPage: true });
  console.log('Saved desktop, first-screen and mobile previews; images loaded; mobile fits viewport.');
  await browser.close();
})();
