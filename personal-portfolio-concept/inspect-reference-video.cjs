const { chromium } = require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const sharp = require('C:/Users/1/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 850 } });
  const source = process.argv[2] || 'C:/Users/1/Downloads/video_005ffd17d819.mp4';
  const outputPrefix = process.argv[3] || 'reference';
  await page.goto(pathToFileURL(source).href);
  await page.waitForFunction(() => document.querySelector('video')?.readyState >= 2);
  const meta = await page.locator('video').evaluate(video => {
    video.pause();
    video.controls = false;
    return { duration: video.duration, width: video.videoWidth, height: video.videoHeight };
  });
  console.log(meta);
  const tiles = [];
  const frameWidth = 480;
  const frameHeight = Math.round(frameWidth * meta.height / meta.width);
  for (let index = 0; index < 12; index++) {
    const time = Math.max(.1, (meta.duration - .2) * index / 11);
    await page.locator('video').evaluate((video, time) => new Promise(resolve => {
      video.addEventListener('seeked', resolve, { once: true });
      video.currentTime = time;
    }), time);
    const screenshot = await page.locator('video').screenshot();
    const resized = await sharp(screenshot).resize(frameWidth, frameHeight).png().toBuffer();
    const label = Buffer.from(`<svg width="${frameWidth}" height="28"><rect width="100%" height="100%" fill="#151515"/><text x="12" y="19" fill="white" font-size="15" font-family="Arial">${time.toFixed(1)} sec</text></svg>`);
    const tile = await sharp({ create: { width: frameWidth, height: frameHeight + 28, channels: 4, background: '#151515' } }).composite([{ input: resized, top: 28, left: 0 }, { input: label, top: 0, left: 0 }]).png().toBuffer();
    tiles.push({ input: tile, left: (index % 4) * frameWidth, top: Math.floor(index / 4) * (frameHeight + 28) });
    if ([2, 5, 8].includes(index)) await sharp(screenshot).png().toFile(path.join(__dirname, outputPrefix + '-frame-' + index + '.png'));
  }
  await sharp({ create: { width: frameWidth * 4, height: (frameHeight + 28) * 3, channels: 4, background: '#151515' } }).composite(tiles).png().toFile(path.join(__dirname, outputPrefix + '-video-overview.png'));
  await browser.close();
})();
