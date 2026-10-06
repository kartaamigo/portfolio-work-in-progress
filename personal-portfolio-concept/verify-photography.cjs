const { chromium } = require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:8893/personal-portfolio-concept/folders.html?v=photo-3');
  await page.locator('.studio-camera').waitFor();
  assert((await page.locator('.studio-base').getAttribute('src')).includes('studio-center-camera'));
  assert(await page.locator('.studio-camera span').isVisible());
  assert(await page.locator('.studio-camera span').evaluate(label => getComputedStyle(label).backgroundColor === 'rgba(0, 0, 0, 0)' && getComputedStyle(label).borderTopWidth === '0px'));
  assert.equal(await page.locator('.studio-camera img').count(), 0);
  assert(await page.locator('.studio-camera-glow').isVisible());
  assert.equal(await page.locator('.photography-gallery button').count(), 5);
  assert.equal(await page.locator('.photography-entry').count(), 0);
  assert.equal(await page.locator('.folder-item').count(), 2);
  await page.screenshot({ path: path.join(__dirname, 'photography-neutral.png') });
  await page.setViewportSize({ width: 1440, height: 780 });
  const stageBox = await page.locator('.studio-center').boundingBox();
  assert(Math.abs(stageBox.width - stageBox.height) < 1, 'Short-window scene stays square so halo aligns');
  await page.screenshot({ path: path.join(__dirname, 'photography-short-window.png') });
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.locator('.studio-camera').hover();
  await page.waitForTimeout(1000);
  assert.equal(await page.getAttribute('body', 'data-world'), 'neutral');
  await page.screenshot({ path: path.join(__dirname, 'photography-camera-hover.png') });
  await page.locator('.studio-camera').click();
  await page.waitForFunction(() => document.body.dataset.world === 'photography');
  await page.locator('.photography-gallery').scrollIntoViewIfNeeded();
  await page.locator('.photography-gallery img').evaluateAll(images => images.forEach(image => { image.loading = 'eager'; }));
  await page.waitForFunction(() => [...document.querySelectorAll('.photography-gallery img')].every(image => image.complete && image.naturalWidth));
  await page.screenshot({ path: path.join(__dirname, 'photography-gallery.png') });
  await page.locator('[data-album="0"]').click();
  assert(await page.locator('.photography-lightbox').isVisible());
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('.photo-controls span').textContent(), '2 / 10');
  assert.equal(await page.locator('.photo-album-title').textContent(), 'Дома и архитектура');
  await page.keyboard.press('Escape');
  assert.equal(await page.getAttribute('body', 'data-world'), 'photography');
  assert(!await page.locator('.photography-lightbox').isVisible());
  const expectedCounts = [10, 7, 2, 1, 2];
  for (const [index, count] of expectedCounts.entries()) {
    await page.locator(`[data-album="${index}"]`).click();
    assert.equal(await page.locator('.photo-controls span').textContent(), `1 / ${count}`);
    for (let photo = 0; photo < count; photo++) {
      await page.waitForFunction(() => {
        const image = document.querySelector('.photography-lightbox>img');
        return image.complete && image.naturalWidth > 0;
      });
      if (count > 1) await page.locator('.photo-next').click();
    }
    assert.equal(await page.locator('.photo-controls span').textContent(), `1 / ${count}`);
    await page.keyboard.press('Escape');
  }
  await page.keyboard.press('Escape');
  assert.equal(await page.getAttribute('body', 'data-world'), 'neutral');
  await page.locator('.studio-camera').click();
  assert.equal(await page.getAttribute('body', 'data-world'), 'photography');
  for (const width of [320, 390, 800, 1024]) {
    await page.setViewportSize({ width, height: 1000 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${width}`);
  }
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await mobile.goto('http://127.0.0.1:8893/personal-portfolio-concept/folders.html?v=photo-3');
  await mobile.locator('.studio-camera').tap();
  assert.equal(await mobile.getAttribute('body', 'data-world'), 'photography');
  await mobile.locator('[data-album="4"]').tap();
  assert(await mobile.locator('.photography-lightbox').isVisible());
  await mobile.locator('.photo-next').tap();
  assert.equal(await mobile.locator('.photo-controls span').textContent(), '2 / 2');
  await mobile.locator('.photography-lightbox>img').evaluate(image => {
    image.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'touch', clientX: 220, clientY: 200 }));
    image.dispatchEvent(new PointerEvent('pointerup', { pointerType: 'touch', clientX: 110, clientY: 200 }));
  });
  assert.equal(await mobile.locator('.photo-controls span').textContent(), '1 / 2');
  await mobile.locator('.photo-close').tap();
  assert.equal(await mobile.getAttribute('body', 'data-world'), 'photography');
  assert.deepEqual(errors, []);
  await browser.close();
  console.log('PASS: camera, five albums, all 22 photos loaded, album-only navigation, swipe, Escape and mobile layout');
})().catch(error => { console.error(error); process.exit(1); });
