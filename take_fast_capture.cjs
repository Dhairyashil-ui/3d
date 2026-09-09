const puppeteer = require('c:/Users/Dhairyashil/website/node_modules/puppeteer-core');
const path = require('path');

async function main() {
  console.log('1. Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    defaultViewport: { width: 1280, height: 768 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--use-gl=angle', '--use-angle=d3d11']
  });

  const page = await browser.newPage();
  console.log('2. Navigating to page...');
  await page.goto('http://localhost:5173/surveyor/3d-intelligence', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2500));

  console.log('3. Clicking Search & Fly...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Search & Fly'));
    if (btn) btn.click();
  });

  console.log('4. Waiting 21 seconds for construction + indoor flight...');
  await new Promise(r => setTimeout(r, 21000));

  const artifactDir = 'C:\\Users\\Dhairyashil\\.gemini\\antigravity-ide\\brain\\64da4721-10b6-4afd-81f3-928177a566c8';
  console.log('5. Capturing post_construction_room_arrival.png...');
  await page.screenshot({ path: path.join(artifactDir, 'post_construction_room_arrival.png') });

  console.log('6. Orbiting to front facade...');
  await page.evaluate(() => {
    const cam = window.__twinViewer?.getCamera();
    const ctrl = window.__twinViewer?.getControls();
    if (cam && ctrl) {
      cam.position.set(0, 15, 52);
      ctrl.target.set(0, 5, -6);
      ctrl.update();
    }
  });
  await new Promise(r => setTimeout(r, 1200));

  console.log('7. Capturing black_ground_full_building.png...');
  await page.screenshot({ path: path.join(artifactDir, 'black_ground_full_building.png') });

  console.log('8. Zooming to entrance arched window bay...');
  await page.evaluate(() => {
    const cam = window.__twinViewer?.getCamera();
    const ctrl = window.__twinViewer?.getControls();
    if (cam && ctrl) {
      cam.position.set(8.5, 4.2, 12.0);
      ctrl.target.set(10.35, 5.2, -0.4);
      ctrl.update();
    }
  });
  await new Promise(r => setTimeout(r, 1200));

  console.log('9. Capturing fixed_arched_window_bay.png...');
  await page.screenshot({ path: path.join(artifactDir, 'fixed_arched_window_bay.png') });

  await browser.close();
  console.log('ALL_CAPTURES_SUCCESS');
}

main().catch(err => {
  console.error('CAPTURE_ERROR:', err);
  process.exit(1);
});
