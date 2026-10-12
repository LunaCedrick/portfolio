// Start a static server in the repo root, then run this with Playwright and Chromium installed.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const baseUrl = process.env.PORTFOLIO_URL || 'http://127.0.0.1:8000/';
const widths = [360, 390, 430];
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
      await page.goto(`${baseUrl}?qa=${width}-contact#/contact`, { waitUntil: 'networkidle' });
      await page.locator('#sin .card2.p').waitFor({ state: 'visible' });
      if (width === 390) await page.screenshot({ path: path.join(artifacts, `contact-390${suffix}.png`) });

      const result = await page.evaluate(() => {
        const email = document.querySelector('#sin .contact-email-address')
          || document.querySelector('#sin .card2.p > div:nth-child(2) > div:last-child');
        const range = document.createRange();
        range.selectNodeContents(email);
        const rects = [...range.getClientRects()];
        const emailButtons = [...document.querySelectorAll('#sin .contact-actions .chip')].map(button => {
          const box = button.getBoundingClientRect();
          return { width: box.width, height: box.height };
        });
        const socialCards = [...document.querySelectorAll('#sin a.contact-mobile')].map(link => {
          const rows = [...link.querySelectorAll('.contact-mobile-copy > div')].map(row => row.textContent.trim());
          return { label: rows[0], handle: rows[1], target: link.target, rel: link.rel, height: link.getBoundingClientRect().height };
        });
        const offenders = [...document.querySelectorAll('body *')].filter(el => {
          const style = getComputedStyle(el);
          const box = el.getBoundingClientRect();
          return !el.closest('.sr') && style.display !== 'none' && style.visibility !== 'hidden' && box.width > 0 && box.height > 0
            && (box.left < -0.5 || box.right > innerWidth + 0.5);
        }).map(el => `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.trim().replace(/\s+/g, '.') : ''}`);
        return {
          emailLines: rects.length,
          emailWhiteSpace: getComputedStyle(email).whiteSpace,
          emailFontSize: getComputedStyle(email).fontSize,
          emailButtons,
          socialCards,
          headingDisplay: getComputedStyle(document.querySelector('#sin .contact-title')).display,
          pageWidth: document.documentElement.scrollWidth,
          viewportWidth: innerWidth,
          offenders,
        };
      });

      const emailPass = result.emailLines === 1 && result.emailWhiteSpace === 'nowrap';
      const overflowPass = result.pageWidth <= result.viewportWidth && result.offenders.length === 0;
      console.log(`${emailPass ? 'PASS' : 'FAIL'} ${width}px email stays on one line (${result.emailLines} line${result.emailLines === 1 ? '' : 's'}, ${result.emailWhiteSpace})`);
      console.log(`${overflowPass ? 'PASS' : 'FAIL'} ${width}px no horizontal overflow (${result.pageWidth}/${result.viewportWidth}px)`);
      const buttonsPass = result.emailFontSize === '13px' && result.emailButtons.length === 2
        && result.emailButtons.every(button => button.height >= 44)
        && Math.abs(result.emailButtons[0].width - result.emailButtons[1].width) <= 1;
      const socialPass = JSON.stringify(result.socialCards.map(({ label, handle }) => [label, handle]))
          === JSON.stringify([['GitHub', 'LunaCedrick'], ['LinkedIn', 'in/cedluna'], ['Facebook', 'cedrick.luna.50']])
        && result.socialCards.every(card => card.target === '_blank' && card.rel.split(/\s+/).includes('noopener') && card.height >= 56);
      const headingPass = result.headingDisplay !== 'none';
      console.log(`${buttonsPass ? 'PASS' : 'FAIL'} ${width}px email actions are equal-width, at least 44px tall, and use 13px text`);
      console.log(`${socialPass ? 'PASS' : 'FAIL'} ${width}px social cards are single linked rows, at least 56px tall`);
      console.log(`${headingPass ? 'PASS' : 'FAIL'} ${width}px stage heading is visible`);
      await page.locator('#sin .contact-actions [data-c="send"]').click();
      const composerPass = await page.locator('#sin #cf').waitFor({ state: 'visible', timeout: 2500 }).then(() => true).catch(() => false);
      console.log(`${composerPass ? 'PASS' : 'FAIL'} ${width}px Write a message opens the composer`);
      if (!emailPass) failures.push(`${width}px email wraps`);
      if (!overflowPass) failures.push(`${width}px horizontal overflow: ${result.offenders.join(', ') || `${result.pageWidth}px document width`}`);
      if (!buttonsPass) failures.push(`${width}px email action layout is invalid`);
      if (!socialPass) failures.push(`${width}px social card links are invalid`);
      if (!headingPass) failures.push(`${width}px stage heading is hidden`);
      if (!composerPass) failures.push(`${width}px Write a message did not open the composer`);
    }

    await page.setViewportSize({ width: 1024, height: 844 });
    await page.goto(`${baseUrl}?qa=1024-contact-desktop#/contact`, { waitUntil: 'networkidle' });
    const desktopPass = await page.evaluate(() => {
      const stage = document.querySelector('#sin');
      const text = stage.textContent;
      return stage.querySelectorAll('.card2').length === 4
        && stage.querySelectorAll('a.chip').length === 3
        && !stage.querySelector('.contact-mobile')
        && getComputedStyle(stage.querySelector('.contact-title')).display !== 'none'
        && ['github.com/LunaCedrick', 'linkedin.com/in/cedluna', 'facebook.com/cedrick.luna.50'].every(value => text.includes(value));
    });
    console.log(`${desktopPass ? 'PASS' : 'FAIL'} 1024px desktop retains full handles and open buttons`);
    if (!desktopPass) failures.push('1024px desktop contact layout changed');
  } finally {
    await browser.close();
  }

  if (failures.length) {
    console.error('\nContact phone layout check failed:');
    for (const failure of failures) console.error(`FAIL ${failure}`);
    process.exitCode = 1;
  } else {
    console.log('PASS: the email is single-line and no visible element overflows horizontally at every tested width.');
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
