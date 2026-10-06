const { chromium } = require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:8893/personal-portfolio-concept/combined.html');
  const slider = page.locator('#world-slider');
  const world = () => page.getAttribute('body', 'data-world');
  assert.equal(await world(), 'neutral');
  assert.equal(await slider.evaluate(element => getComputedStyle(element).opacity), '0');
  const track = await page.locator('.world-slider').boundingBox();
  const orb = await page.locator('.slider-orb').boundingBox();
  assert(orb.height > track.height, 'Glass orb must protrude from capsule');
  assert.equal(track.width, 350);
  assert.equal(track.height, 48);
  assert(await page.locator('.world-intros').isVisible());
  const heroBounds = await page.locator('.hero').boundingBox();
  const panelBounds = await page.locator('.world-selector').boundingBox();
  assert(Math.abs(panelBounds.y + panelBounds.height / 2 - heroBounds.y - heroBounds.height / 2) < 2, 'Selector group centered in hero');
  const artIntroBounds = await page.locator('.world-intro-art').boundingBox();
  const digitalIntroBounds = await page.locator('.world-intro-digital').boundingBox();
  assert(artIntroBounds.x + artIntroBounds.width < track.x, 'SoulArt to the left of switch');
  assert(digitalIntroBounds.x > track.x + track.width, 'Reform to the right of switch');
  assert.equal(await page.locator('.world-intro-digital').evaluate(element => getComputedStyle(element).textAlign), 'right');
  await slider.hover();
  assert.equal(await world(), 'neutral');
  await page.screenshot({ path: path.join(__dirname, 'glass-neutral.png') });
  await page.mouse.click(track.x + 20, track.y + track.height / 2);
  assert.equal(await world(), 'art');
  assert.equal(await page.locator('.world-slider').evaluate(element => getComputedStyle(element).outlineStyle), 'none');
  assert(!await page.locator('.world-intros').isVisible());
  assert(await page.locator('.portfolio-content').isVisible());
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(__dirname, 'glass-soulart.png') });
  await slider.focus();
  await slider.press('End');
  assert.equal(await page.locator('.world-slider').evaluate(element => getComputedStyle(element).outlineStyle), 'solid');
  assert.equal(await world(), 'digital');
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(__dirname, 'glass-reform.png') });
  await slider.press('ArrowLeft');
  assert.equal(await world(), 'neutral');
  const dragTrack = await page.locator('.world-slider').boundingBox();
  await page.mouse.move(dragTrack.x + dragTrack.width / 2, dragTrack.y + dragTrack.height / 2);
  await page.mouse.down();
  await page.mouse.move(dragTrack.x + dragTrack.width - 10, dragTrack.y + dragTrack.height / 2, { steps: 12 });
  await page.mouse.up();
  assert.equal(await world(), 'digital');
  await page.keyboard.press('Escape');
  assert.equal(await world(), 'neutral');
  assert.equal(await slider.evaluate(element => element === document.activeElement), true);
  for (const width of [320, 390, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: width < 800 ? 844 : 1000 });
    for (const state of ['neutral', 'art', 'digital']) {
      await page.evaluate(state => choose(state), state);
      await page.waitForTimeout(100);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow ${width}/${state}`);
      if (state === 'neutral') assert.equal(await page.locator('.digital-frame').evaluate(element => getComputedStyle(element).visibility), 'hidden');
      const bounds = await page.locator('.world-selector').boundingBox();
      assert(bounds.x >= 0 && bounds.x + bounds.width <= width, `Selector outside viewport ${width}/${state}`);
    }
    if (width === 390) {
      await page.evaluate(() => choose('neutral'));
      await slider.blur();
      await page.screenshot({ path: path.join(__dirname, 'glass-mobile.png') });
    }
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.locator('.slider-orb').evaluate(element => getComputedStyle(element).transitionDuration), '0s');
  assert.deepEqual(errors, []);
  console.log('PASS: glass appearance, mouse click/drag, keyboard, reset, five viewport sizes, reduced motion, no JS errors');
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
