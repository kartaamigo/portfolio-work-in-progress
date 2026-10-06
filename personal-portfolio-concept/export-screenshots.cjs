const { chromium } = require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('node:path');
const output = path.join(__dirname, 'github-screenshots');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (let attempt = 0; attempt < 3; attempt++) {
      await page.goto('http://127.0.0.1:8893/personal-portfolio-concept/folders.html?export=2026-10-06');
      try {
        await page.locator('.studio-camera').waitFor({ timeout: 10000 });
        const valid = await page.locator('header .wordmark').evaluate(element => getComputedStyle(element).textDecorationLine === 'none');
        if (!valid) throw new Error('Styles not loaded');
        break;
      } catch (error) {
        if (attempt === 2) throw error;
      }
    }
    async function prepare() {
      await page.evaluate(() => document.querySelectorAll('img').forEach(image => { image.loading = 'eager'; }));
      await page.waitForFunction(() => [...document.images].filter(image => image.getAttribute('src')).every(image => image.complete && image.naturalWidth > 0));
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(400);
    }
    async function screenshot(name, selector, fullPage = false) {
      await prepare();
      if (selector) await page.locator(selector).scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await page.screenshot({ path: path.join(output, name + '.png'), fullPage });
      console.log(name);
    }
    async function world(name) {
      await page.mouse.move(1, 1);
      await page.evaluate(name => { choose(name); window.scrollTo(0, 0); }, name);
    }
    await screenshot('01-home-desktop');
    await page.locator('.studio-hat').hover();
    await screenshot('02-home-greeting');
    await page.mouse.move(1, 1);
    await page.waitForTimeout(700);
    await page.locator('.folder-art .folder-launch').hover();
    await screenshot('03-soulart-folder-hover');
    await world('art');
    await screenshot('04-soulart-full-page', null, true);
    await screenshot('05-soulart-about', '#about');
    await screenshot('06-soulart-projects', '#projects');
    await screenshot('07-soulart-contacts', '#contacts');
    await world('digital');
    await screenshot('08-reform-drawer', '.reform-drawer');
    await page.locator('.reform-app').first().click();
    await screenshot('09-blaze-details', '.digital-project:visible');
    await page.locator('.digital-project:visible .digital-project-screens button').first().click();
    await screenshot('10-blaze-screen');
    await page.keyboard.press('Escape');
    await page.locator('.reform-app').last().click();
    await screenshot('11-reform-life-details', '.digital-project:visible');
    await screenshot('12-reform-full-page', null, true);
    await world('photography');
    await screenshot('13-photography-home');
    await screenshot('14-photography-albums', '.photography-gallery');
    await screenshot('15-photography-full-page', null, true);
    await page.locator('[data-album="0"]').click();
    await screenshot('16-photography-viewer');
    await page.keyboard.press('Escape');
    await page.locator('[data-album="4"]').click();
    await screenshot('17-photography-edits');
    await page.keyboard.press('Escape');
    await page.setViewportSize({ width: 390, height: 844 });
    await world('neutral');
    await screenshot('18-home-mobile', null, true);
    await world('art');
    await screenshot('19-soulart-mobile', null, true);
    await world('digital');
    await screenshot('20-reform-drawer-mobile', '.reform-drawer');
    await world('photography');
    await screenshot('21-photography-mobile', null, true);
    await page.locator('[data-album="0"]').click();
    await screenshot('22-photography-viewer-mobile');
    console.log('Exported 22 screenshots');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
