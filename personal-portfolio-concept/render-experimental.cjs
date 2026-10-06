const { chromium } = require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const sharp = require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const assert = require('node:assert/strict');
(async () => {
  const input = await sharp(path.join(__dirname, 'assets/bunny-graffiti.jpg')).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let offset = 0; offset < input.data.length; offset += 4) {
    const brightness = Math.max(input.data[offset], input.data[offset + 1], input.data[offset + 2]);
    input.data[offset + 3] = Math.min(255, Math.max(0, (brightness - 20) * 4));
  }
  await sharp(input.data, { raw: { width: input.info.width, height: input.info.height, channels: 4 } }).png().toFile(path.join(__dirname, 'assets/bunny-cutout.png'));
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1035 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(path.join(__dirname, 'experimental.html')).href);
  await page.evaluate(() => document.fonts.ready);
  assert(await page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)));
  await page.screenshot({ path: path.join(__dirname, 'experimental-desktop.png'), fullPage: true });
  await page.screenshot({ path: path.join(__dirname, 'experimental-hero.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({ path: path.join(__dirname, 'experimental-mobile.png'), fullPage: true });
  console.log(await page.evaluate(() => ({ mobileWidth: innerWidth, contentWidth: document.documentElement.scrollWidth })));
  await browser.close();
})();
