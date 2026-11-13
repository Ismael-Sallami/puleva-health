import puppeteer from 'puppeteer-core';
import fs from 'fs';
const [,, url, out, durS, fpsS] = process.argv;
const fps = +fpsS || 30, dur = +durS;
fs.mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--hide-scrollbars', '--force-device-scale-factor=1'] });
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle0' });
await page.waitForFunction('window.__ready === true', { timeout: 30000 });
await new Promise((r) => setTimeout(r, 500));
const n = Math.round(dur * fps);
const t0 = Date.now();
for (let f = 0; f <= n; f++) {
  await page.evaluate((t) => window.__seek(t), f / fps);
  await page.screenshot({ path: `${out}/f${String(f).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 92 });
  if (f % 60 === 0) console.log(`frame ${f}/${n} · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}
await browser.close();
