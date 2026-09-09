const puppeteer = require('c:/Users/Dhairyashil/website/node_modules/puppeteer-core');
const path = require('path');

async function captureAngle() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    defaultViewport: { width: 480, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--use-gl=angle', '--use-angle=d3d11']
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:5173/surveyor/3d-intelligence', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  // Click Search & Fly
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Search & Fly'));
    if (btn) btn.click();
  });

  // Wait 22s for construction + flight
  await new Promise(r => setTimeout(r, 22000));

  // Now move camera to match user's exact portrait crop
  await page.evaluate(() => {
    const cam = window.__twinViewer?.getCamera();
    const ctrl = window.__twinViewer?.getControls();
    if (cam && ctrl) {
      // User perspective looking at the arched bay with the column and downpipe:
      cam.position.set(7.8, 3.4, 15.2);
      ctrl.target.set(10.35, 4.5, -0.4);
      ctrl.update();
    }
  });
  await new Promise(r => setTimeout(r, 1200));

  const artifactDir = 'C:\\Users\\Dhairyashil\\.gemini\\antigravity-ide\\brain\\64da4721-10b6-4afd-81f3-928177a566c8';
  await page.screenshot({ path: path.join(artifactDir, 'user_angle_comparison.png') });

  await browser.close();
  console.log('ANGLE_DONE');
}

captureAngle().catch(console.error);
