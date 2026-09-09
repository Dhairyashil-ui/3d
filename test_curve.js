const THREE = require('three');

// Let's copy the room geometry and path logic for A-119
const roomCode = 'A-119';
// From BuildingDigitalTwinViewer.tsx:
// For Room A-119:
// floor = 1
const centerPoint = new THREE.Vector3(8.5, 1.45, -12.6); // approximate or from getRoomCadastre
const normal = new THREE.Vector3(-1, 0, 0);

const f = 1;
const targetElevation = centerPoint.y + 0.15;
const endLook = new THREE.Vector3(centerPoint.x, targetElevation, centerPoint.z);
const endPos = endLook.clone().add(normal.clone().multiplyScalar(3.20));

console.log('endLook:', endLook);
console.log('endPos:', endPos);

const posPoints = [];
const lookPoints = [];

// WP 0:
posPoints.push(new THREE.Vector3(0, 3.4, 32.0));
lookPoints.push(new THREE.Vector3(0, 2.4, 4.0));

// WP 1:
posPoints.push(new THREE.Vector3(0, 2.8, 16.0));
lookPoints.push(new THREE.Vector3(0, 2.2, 2.0));

// WP 2:
posPoints.push(new THREE.Vector3(0, 2.2, 5.0));
lookPoints.push(new THREE.Vector3(0, 2.0, -4.0));

// WP 3:
posPoints.push(new THREE.Vector3(0, 2.0, -2.0));
lookPoints.push(new THREE.Vector3(0, 2.0, -12.6));

// WP 4:
posPoints.push(new THREE.Vector3(0, 2.2, -9.5));
lookPoints.push(new THREE.Vector3(0, 2.2, -12.6));

if (f === 1) {
  posPoints.push(new THREE.Vector3(0, 1.8, -12.6));
  if (normal.x < -0.5) {
    lookPoints.push(new THREE.Vector3(8.27, 1.8, -12.6));

    posPoints.push(new THREE.Vector3(4.8, 1.8, -12.6));
    lookPoints.push(new THREE.Vector3(8.27, 1.8, centerPoint.z));

    posPoints.push(new THREE.Vector3(8.27, 1.8, -12.6));
    lookPoints.push(new THREE.Vector3(8.27, targetElevation, centerPoint.z));

    posPoints.push(new THREE.Vector3(8.27, targetElevation, (centerPoint.z + (-12.6)) * 0.5));
    lookPoints.push(new THREE.Vector3(centerPoint.x, targetElevation, centerPoint.z));
  }
}

posPoints.push(endPos.clone());
lookPoints.push(endLook.clone());

console.log(`posPoints length: ${posPoints.length}, lookPoints length: ${lookPoints.length}`);

posPoints.forEach((p, idx) => console.log(`pos[${idx}]: ${p.x}, ${p.y}, ${p.z}`));

const posCurve = new THREE.CatmullRomCurve3(posPoints, false, 'centripetal');
const lookCurve = new THREE.CatmullRomCurve3(lookPoints, false, 'centripetal');

for (let i = 0; i <= 1000; i++) {
  const t = i / 1000;
  const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  try {
    const cp = posCurve.getPoint(ease);
    const cl = lookCurve.getPoint(ease);
  } catch (err) {
    console.error(`ERROR at t=${t}, ease=${ease}:`, err);
    break;
  }
}
console.log('Finished test without crash?');
