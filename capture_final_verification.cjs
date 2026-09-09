const puppeteer = require('c:/Users/Dhairyashil/website/node_modules/puppeteer-core');
const path = require('path');

async function capture() {
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

  // Wait 14s for construction to finish
  await new Promise(r => setTimeout(r, 14000));

  // Screenshot 1: Front entrance with black ground and windows
  const artifactDir = 'C:\\Users\\Dhairyashil\\.gemini\\antigravity-ide\\brain\\64da4721-10b6-4afd-81f3-928177a566c8';
  await page.screenshot({ path: path.join(artifactDir, 'black_ground_and_facade.png') });

  // Move camera slightly to look at the arched bay windows closely like user's screenshot
  await page.evaluate(() => {
    const cam = window.__twinViewer?.getCamera();
    if (cam) {
      cam.position.set(8.5, 4.5, 12);
      cam.lookAt(10.35, 5.5, -0.4);
    }
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(artifactDir, 'arched_windows_close_up.png') });

  // Wait for flight to complete to room
  await new Promise(r => setTimeout(r, 6000));
  await page.screenshot({ path: path.join(artifactDir, 'room_destination_final.png') });

  await browser.close();
  console.log('CAPTURES_DONE');
}

capture().catch(console.error);
