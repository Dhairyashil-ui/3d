import * as THREE from 'three';
import { getRoomCadastre, PCCRC_ROOMS_CADASTRE } from './src/data/pccrcRoomCadastre.ts';

for (const targetCad of PCCRC_ROOMS_CADASTRE) {
  const roomCode = targetCad.roomCode;
  const f = targetCad.floorNumber;
  const centerPoint = new THREE.Vector3(targetCad.centerCloud.x, targetCad.centerCloud.y, targetCad.centerCloud.z);
  const normal = new THREE.Vector3(targetCad.centerCloud.normalX, targetCad.centerCloud.normalY, targetCad.centerCloud.normalZ);

  const targetElevation = centerPoint.y + 0.15;
  const endLook = new THREE.Vector3(centerPoint.x, targetElevation, centerPoint.z);
  const endPos = endLook.clone().add(normal.clone().multiplyScalar(3.20));

  const floorBaseY = (f - 1) * 4.20;
  const floorEyeY = floorBaseY + 1.65;

  const posPoints = [];
  const lookPoints = [];

  // WP 0: Front exterior plaza
  posPoints.push(new THREE.Vector3(0, 3.4, 32.0));
  lookPoints.push(new THREE.Vector3(0, 2.4, 4.0));

  // WP 1: Between front portico columns
  posPoints.push(new THREE.Vector3(0, 2.8, 16.0));
  lookPoints.push(new THREE.Vector3(0, 2.2, 2.0));

  // WP 2: Passing through main entrance portal
  posPoints.push(new THREE.Vector3(0, 2.2, 5.0));
  lookPoints.push(new THREE.Vector3(0, 2.0, -4.0));

  // WP 3: Entering ground-floor atrium foyer
  posPoints.push(new THREE.Vector3(0, 2.0, -2.0));
  lookPoints.push(new THREE.Vector3(0, 2.0, -12.6));

  // WP 4: Center of the open central atrium
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
    } else if (normal.x > 0.5) {
      lookPoints.push(new THREE.Vector3(-8.27, 1.8, -12.6));

      posPoints.push(new THREE.Vector3(-4.8, 1.8, -12.6));
      lookPoints.push(new THREE.Vector3(-8.27, 1.8, centerPoint.z));

      posPoints.push(new THREE.Vector3(-8.27, 1.8, -12.6));
      lookPoints.push(new THREE.Vector3(-8.27, targetElevation, centerPoint.z));

      posPoints.push(new THREE.Vector3(-8.27, targetElevation, (centerPoint.z + (-12.6)) * 0.5));
      lookPoints.push(new THREE.Vector3(centerPoint.x, targetElevation, centerPoint.z));
    } else {
      lookPoints.push(new THREE.Vector3(0, 1.8, -20.87));

      posPoints.push(new THREE.Vector3(0, 1.8, -16.5));
      lookPoints.push(new THREE.Vector3(centerPoint.x, 1.8, -20.87));

      posPoints.push(new THREE.Vector3(0, 1.8, -20.87));
      lookPoints.push(new THREE.Vector3(centerPoint.x, targetElevation, -24.07));

      posPoints.push(new THREE.Vector3(centerPoint.x * 0.6, targetElevation, -20.87));
      lookPoints.push(new THREE.Vector3(centerPoint.x, targetElevation, -24.07));
    }
  } else {
    posPoints.push(new THREE.Vector3(0, 2.4, -12.6));
    lookPoints.push(new THREE.Vector3(0, floorEyeY * 0.6 + 2.0, -12.6));

    posPoints.push(new THREE.Vector3(0, floorEyeY * 0.55 + 1.2, -12.6));
    lookPoints.push(new THREE.Vector3(0, floorEyeY + 1.0, -12.6));

    posPoints.push(new THREE.Vector3(0, floorEyeY, -12.6));

    if (normal.x < -0.5) {
      lookPoints.push(new THREE.Vector3(8.27, floorEyeY, -12.6));

      posPoints.push(new THREE.Vector3(4.8, floorEyeY, -12.6));
      lookPoints.push(new THREE.Vector3(8.27, floorEyeY, centerPoint.z));

      posPoints.push(new THREE.Vector3(8.27, floorEyeY, -12.6));
      lookPoints.push(new THREE.Vector3(8.27, targetElevation, centerPoint.z));

      posPoints.push(new THREE.Vector3(8.27, targetElevation, (centerPoint.z + (-12.6)) * 0.5));
      lookPoints.push(new THREE.Vector3(centerPoint.x, targetElevation, centerPoint.z));
    } else if (normal.x > 0.5) {
      lookPoints.push(new THREE.Vector3(-8.27, floorEyeY, -12.6));

      posPoints.push(new THREE.Vector3(-4.8, floorEyeY, -12.6));
      lookPoints.push(new THREE.Vector3(-8.27, floorEyeY, centerPoint.z));

      posPoints.push(new THREE.Vector3(-8.27, floorEyeY, -12.6));
      lookPoints.push(new THREE.Vector3(-8.27, targetElevation, centerPoint.z));

      posPoints.push(new THREE.Vector3(-8.27, targetElevation, (centerPoint.z + (-12.6)) * 0.5));
      lookPoints.push(new THREE.Vector3(centerPoint.x, targetElevation, centerPoint.z));
    } else {
      lookPoints.push(new THREE.Vector3(0, floorEyeY, -20.87));

      posPoints.push(new THREE.Vector3(0, floorEyeY, -16.5));
      lookPoints.push(new THREE.Vector3(centerPoint.x, floorEyeY, -20.87));

      posPoints.push(new THREE.Vector3(0, floorEyeY, -20.87));
      lookPoints.push(new THREE.Vector3(centerPoint.x, targetElevation, -24.07));

      posPoints.push(new THREE.Vector3(centerPoint.x * 0.6, targetElevation, -20.87));
      lookPoints.push(new THREE.Vector3(centerPoint.x, targetElevation, -24.07));
    }
  }

  posPoints.push(endPos.clone());
  lookPoints.push(endLook.clone());

  if (posPoints.some(p => !p || isNaN(p.x) || isNaN(p.y) || isNaN(p.z))) {
    console.error(`Invalid posPoint in room ${roomCode}!`);
  }
  if (lookPoints.some(p => !p || isNaN(p.x) || isNaN(p.y) || isNaN(p.z))) {
    console.error(`Invalid lookPoint in room ${roomCode}!`);
  }

  const posCurve = new THREE.CatmullRomCurve3(posPoints, false, 'centripetal');
  const lookCurve = new THREE.CatmullRomCurve3(lookPoints, false, 'centripetal');

  for (let s = 0; s <= 100; s++) {
    const t = s / 100;
    try {
      posCurve.getPoint(t);
      lookCurve.getPoint(t);
    } catch (e) {
      console.error(`Curve failure for room ${roomCode} at t=${t}:`, e.message);
    }
  }
}
console.log('All 45 rooms verified for posCurve and lookCurve.');
