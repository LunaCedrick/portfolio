// Start a static server in the repo root, then run this with Playwright and Chromium installed.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const baseUrl = process.env.PORTFOLIO_URL || 'http://127.0.0.1:8000/';
const widths = [390, 768, 1024, 1440];
const artifacts = path.join(__dirname, 'artifacts');
const suffix = process.argv.includes('--before') ? '-before' : '';
const failures = [];

async function main() {
  fs.mkdirSync(artifacts, { recursive: true });
  const installedChrome = process.platform === 'win32'
    ? ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'].find(fs.existsSync)
    : undefined;
  const executablePath = process.env.CHROME_PATH || installedChrome;
  const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });

  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    await page.emulateMedia({ reducedMotion: 'reduce' });

    for (const width of widths) {
      await page.setViewportSize({ width, height: 844 });

      for (const [project, title] of [['taskly', 'Taskly'], ['weather', 'Weather Dashboard']]) {
        await page.goto(`${baseUrl}?qa=${width}-${project}#/projects/${project}`, { waitUntil: 'networkidle' });
        const image = page.locator(`#sin img[src*="${project === 'taskly' ? 'taskly' : 'weather-dashboard'}.webp"]`);
        await image.waitFor({ state: 'visible' });
        await image.evaluate(img => img.decode());

        const result = await image.evaluate(img => {
          const box = img.getBoundingClientRect();
          return {
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            renderedWidth: box.width,
            renderedHeight: box.height,
          };
        });
        check(`${width}px ${title}`, result);
        if (width <= 820) {
          const order = await page.evaluate(() => ['.ov-summary', '.ov-image', '.ov-meta', '.ov-links']
            .map(selector => document.querySelector(`#sin ${selector}`)?.getBoundingClientRect().top));
          const validOrder = order.every(Number.isFinite) && order.every((top, index) => index === 0 || top > order[index - 1]);
          console.log(`${validOrder ? 'PASS' : 'FAIL'} ${width}px ${title} mobile order: summary, screenshot, details, links`);
          if (!validOrder) failures.push(`${width}px ${title}: Overview items are out of order`);
        }
        if (width === 390) {
          await page.screenshot({ path: path.join(artifacts, `${project}-overview-390${suffix}.png`) });
        }
      }

      await page.goto(`${baseUrl}?qa=${width}-certs#/certs`, { waitUntil: 'networkidle' });
      const badges = page.locator('#sin img');
      await badges.first().waitFor({ state: 'visible' });
      await badges.evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
      const results = await badges.evaluateAll(imgs => imgs.map(img => {
        const box = img.getBoundingClientRect();
        return {
          alt: img.alt,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          renderedWidth: box.width,
          renderedHeight: box.height,
        };
      }));
      for (const result of results) check(`${width}px ${result.alt}`, result);
    }
  } finally {
    await browser.close();
  }

  if (failures.length) {
    console.error('\nImage aspect ratio check failed (>2% deviation):');
    for (const failure of failures) console.error(`FAIL ${failure}`);
    process.exitCode = 1;
  } else {
    console.log('PASS: all project screenshots and certification badges stay within 2% of natural aspect ratio.');
  }
}

function check(label, result) {
  const naturalRatio = result.naturalWidth / result.naturalHeight;
  const renderedRatio = result.renderedWidth / result.renderedHeight;
  const deviation = Math.abs(renderedRatio / naturalRatio - 1);
  const status = result.naturalWidth && result.renderedWidth && deviation <= 0.02 ? 'PASS' : 'FAIL';
  console.log(`${status} ${label}: natural ${result.naturalWidth}x${result.naturalHeight}, rendered ${result.renderedWidth.toFixed(1)}x${result.renderedHeight.toFixed(1)}, deviation ${(deviation * 100).toFixed(2)}%`);
  if (status === 'FAIL') failures.push(`${label}: ${(deviation * 100).toFixed(2)}% deviation`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
