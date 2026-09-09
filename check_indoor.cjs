const puppeteer = require('c:/Users/Dhairyashil/website/node_modules/puppeteer-core');

async function checkIndoor() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--use-gl=angle', '--use-angle=d3d11']
  });

  const page = await browser.newPage();
  page.on('pageerror', err => {
    console.log('PAGE ERROR STACK:', err.stack);
  });
  page.on('console', msg => {
    console.log('BROWSER LOG:', msg.text());
  });

  await page.goto('http://localhost:5173/surveyor/3d-intelligence', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  // Directly trigger executeContinuousIndoorPath via window
  const result = await page.evaluate(() => {
    try {
      const viewer = window.__twinViewer;
      console.log('twinViewer available:', !!viewer);
    } catch (e) {
      console.error(e);
    }
  });

  // Click Search & Fly
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Search & Fly'));
    if (btn) btn.click();
  });

  await new Promise(r => setTimeout(r, 16000));
  await browser.close();
}

checkIndoor().catch(console.error);
