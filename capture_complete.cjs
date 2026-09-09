const puppeteer = require('c:/Users/Dhairyashil/website/node_modules/puppeteer-core');
const path = require('path');

async function captureComplete() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    defaultViewport: { width: 1280, height: 768 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--use-gl=angle', '--use-angle=d3d11']
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:5173/surveyor/3d-intelligence', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));

  // Click Search & Fly
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Search & Fly'));
    if (btn) btn.click();
  });

  // Wait 22 seconds for construction AND indoor flight to complete
  await new Promise(r => setTimeout(r, 22000));

  const artifactDir = 'C:\\Users\\Dhairyashil\\.gemini\\antigravity-ide\\brain\\64da4721-10b6-4afd-81f3-928177a566c8';
  // Screenshot at room door
  await page.screenshot({ path: path.join(artifactDir, 'post_construction_room_arrival.png') });

  // Move camera to view the front facade and black ground
  await page.evaluate(() => {
    const cam = window.__twinViewer?.getCamera();
    const ctrl = window.__twinViewer?.getControls();
    if (cam && ctrl) {
      cam.position.set(0, 15, 52);
      ctrl.target.set(0, 5, -6);
      ctrl.update();
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'black_ground_full_building.png') });

  // Move camera close up to the entrance arched bay (matching user screenshot angle)
  await page.evaluate(() => {
    const cam = window.__twinViewer?.getCamera();
    const ctrl = window.__twinViewer?.getControls();
    if (cam && ctrl) {
      // Zoom right into the arched bay at x=10.35 or x=-10.35
      cam.position.set(10.35, 5.5, 12.0);
      ctrl.target.set(10.35, 5.5, -0.4);
      ctrl.update();
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(artifactDir, 'fixed_arched_window_bay.png') });

  await browser.close();
  console.log('COMPLETE_CAPTURES_DONE');
}

captureComplete().catch(console.error);
