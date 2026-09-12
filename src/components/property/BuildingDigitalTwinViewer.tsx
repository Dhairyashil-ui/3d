// NAKSHA V2.0 - Futuristic 3D Building Digital Twin Engine
// Requirements Implemented:
// 1. Floor Pattern: Exact match to reference photo (Terracotta rust-red tiles with cream grid, black granite borders, radial bar-inlaid pathways, central concentric marble rings with potted plants, and high-gloss specular reflections)
// 2. Full Door Visible on Zoom: Comfortable distance (3.65m) so the entire double door, architrave, closer, and skirting are fully visible without cut-off
// 3. Detail Mark on Door Mid: Positioned directly at the center/middle of the door, NOT above/upside
// 4. Straight-on frontal zoom without showing from another angle
// 5. No camera hijacking/attaching: When camera comes in range of a room, just show its details while camera remains 100% free
// 6. Interactive Controls: X-Ray Mode, Realistic Colors, BIM Wireframe, Floor Isolator

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Sparkles, 
  Scan, 
  Layers, 
  RotateCcw, 
  ShieldCheck, 
  MapPin,
  Compass,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { getRoomCadastre, RoomCadastreRecord, PCCRC_ROOMS_CADASTRE } from '../../data/pccrcRoomCadastre';

export type DisplayMode = 'realistic' | 'xray' | 'wireframe';

export interface RoomDoorGeometry {
  roomCode: string;
  floor: number;
  doorMidPos: THREE.Vector3;
  normal: THREE.Vector3;
}

export function getRoomDoorGeometry(roomCode: string): RoomDoorGeometry {
  const digits = roomCode.replace(/[^0-9]/g, '');
  const f = Math.min(Math.max(parseInt(digits[0] || '1', 10), 1), 5);
  const r = parseInt(digits.slice(1) || '19', 10);

  const floorBaseY = (f - 1) * 4.2;
  const midY = floorBaseY + 1.23; // Exact middle of 2.44m door leaves

  let midX = 11.47;
  let midZ = -7.40;
  let normal = new THREE.Vector3(-1, 0, 0); // Faces -X into corridor

  if (r >= 11 && r <= 13) {
    // Left Gallery (faces +X into corridor)
    midX = -11.47;
    normal = new THREE.Vector3(1, 0, 0);
    if (r === 11) midZ = -7.40;
    else if (r === 12) midZ = -12.60;
    else if (r === 13) midZ = -17.80;
  } else if (r >= 14 && r <= 16) {
    // Rear Gallery (faces +Z into corridor)
    normal = new THREE.Vector3(0, 0, 1);
    midZ = -24.07;
    if (r === 14) midX = -5.50;
    else if (r === 15) midX = 0.00;
    else if (r === 16) midX = 5.50;
  } else {
    // Right Gallery (faces -X into corridor, includes A-119)
    midX = 11.47;
    normal = new THREE.Vector3(-1, 0, 0);
    if (r === 17) midZ = -17.80;
    else if (r === 18) midZ = -12.60;
    else if (r === 19) midZ = -7.40;
  }

  return {
    roomCode,
    floor: f,
    doorMidPos: new THREE.Vector3(midX, midY, midZ),
    normal
  };
}

interface RoomDoorRecord {
  roomCode: string;
  floor: number;
  doorMidPos: THREE.Vector3;
  normal: THREE.Vector3;
  worldPos: THREE.Vector3;
  mesh?: THREE.Mesh;
  cadastre: RoomCadastreRecord;
}

interface BuildingDigitalTwinViewerProps {
  targetRoomNumber: string; // e.g. "A-119"
  isActive: boolean;
  onConstructionComplete?: () => void;
  onArrivedAtRoom?: (room: string) => void;
  onRoomSelect?: (room: string) => void;
  onProximityRoomChange?: (room: string | null) => void;
  onExplorationModeChange?: (mode: DisplayMode) => void;
}

// ---------------------------------------------------------------------------
// Procedural High-Resolution Texture for Authentic Atrium Floor (2048x2048)
// Matches user reference photo: Terracotta rust-red tiles with cream grid,
// black granite borders with corner accents, radial pathways with black bars,
// and concentric center rings with green-grey glass tile center.
// ---------------------------------------------------------------------------
function createAtriumFloorTexture(): THREE.CanvasTexture {
  const size = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const cx = size / 2;
  const cy = size / 2;

  // 1. Deep Black Polished Granite Perimeter
  ctx.fillStyle = '#0f1115';
  ctx.fillRect(0, 0, size, size);

  // 2. Terracotta Rust-Red Quadrants with Cream Marble Grid Lines
  const quadInset = 160;
  const quadW = cx - quadInset - 80;
  const quadH = cy - quadInset - 80;
  const tileSize = 60;
  const groutSize = 8;

  const drawTerracottaGrid = (x0: number, y0: number, w: number, h: number) => {
    // Cream marble underlay (grout lines)
    ctx.fillStyle = '#eae4d9';
    ctx.fillRect(x0, y0, w, h);

    // Terracotta tiles
    ctx.fillStyle = '#b74931';
    for (let x = x0 + groutSize; x < x0 + w - groutSize; x += tileSize + groutSize) {
      for (let y = y0 + groutSize; y < y0 + h - groutSize; y += tileSize + groutSize) {
        const curW = Math.min(tileSize, x0 + w - x - groutSize);
        const curH = Math.min(tileSize, y0 + h - y - groutSize);
        if (curW > 4 && curH > 4) {
          ctx.fillRect(x, y, curW, curH);
        }
      }
    }
  };

  // 4 Quadrants
  drawTerracottaGrid(quadInset, quadInset, quadW, quadH); // Top-Left
  drawTerracottaGrid(cx + 80, quadInset, quadW, quadH); // Top-Right
  drawTerracottaGrid(quadInset, cy + 80, quadW, quadH); // Bottom-Left
  drawTerracottaGrid(cx + 80, cy + 80, quadW, quadH); // Bottom-Right

  // 3. Outer Black Granite Inner Border Frames around Quadrants
  ctx.strokeStyle = '#0f1115';
  ctx.lineWidth = 28;
  ctx.strokeRect(quadInset, quadInset, quadW, quadH);
  ctx.strokeRect(cx + 80, quadInset, quadW, quadH);
  ctx.strokeRect(quadInset, cy + 80, quadW, quadH);
  ctx.strokeRect(cx + 80, cy + 80, quadW, quadH);

  // 4. Corner Geometric Terracotta Outline Squares (as visible in reference photo)
  const drawCornerDeco = (x: number, y: number) => {
    ctx.strokeStyle = '#b74931';
    ctx.lineWidth = 7;
    ctx.strokeRect(x - 42, y - 42, 84, 84);
    ctx.strokeRect(x - 22, y - 22, 44, 44);
  };
  drawCornerDeco(quadInset / 2, quadInset / 2);
  drawCornerDeco(size - quadInset / 2, quadInset / 2);
  drawCornerDeco(quadInset / 2, size - quadInset / 2);
  drawCornerDeco(size - quadInset / 2, size - quadInset / 2);

  // 5. Cream Marble Radial Cross Pathways with Black Granite Bar Inserts
  const pathW = 120;
  ctx.fillStyle = '#eae4d9';

  // Horizontal pathway
  ctx.fillRect(0, cy - pathW / 2, size, pathW);
  // Vertical pathway
  ctx.fillRect(cx - pathW / 2, 0, pathW, size);

  // Inlaid Black Granite Bars (Rhythmic piano bar pattern along radial paths)
  ctx.fillStyle = '#121418';
  for (let d = 360; d < size - 360; d += 64) {
    if (Math.abs(d - cx) > 280) {
      // Horizontal bars
      const barW = (d % 128 === 0) ? 36 : 18;
      ctx.fillRect(d, cy - 40, barW, 80);
      // Vertical bars
      ctx.fillRect(cx - 40, d, 80, barW);
    }
  }

  // 6. Central Circular Inlay Medallion
  // Outer Black Granite Ring
  ctx.fillStyle = '#121418';
  ctx.beginPath();
  ctx.arc(cx, cy, 320, 0, Math.PI * 2);
  ctx.fill();

  // Outer Cream Marble Ring
  ctx.fillStyle = '#ede7dc';
  ctx.beginPath();
  ctx.arc(cx, cy, 300, 0, Math.PI * 2);
  ctx.fill();

  // Secondary Black Ring
  ctx.fillStyle = '#121418';
  ctx.beginPath();
  ctx.arc(cx, cy, 270, 0, Math.PI * 2);
  ctx.fill();

  // Inner Concentric Cream Marble Ring
  ctx.fillStyle = '#f4efe6';
  ctx.beginPath();
  ctx.arc(cx, cy, 250, 0, Math.PI * 2);
  ctx.fill();

  // Fine Concentric Circles
  ctx.strokeStyle = '#b74931';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, 200, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#121418';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, 150, 0, Math.PI * 2);
  ctx.stroke();

  // Center core glass/tile floor (greenish-grey tint with light grid as in photo)
  ctx.fillStyle = '#9cb0a3';
  ctx.beginPath();
  ctx.arc(cx, cy, 110, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#7d9184';
  ctx.lineWidth = 2.5;
  for (let gx = cx - 110; gx <= cx + 110; gx += 22) {
    ctx.beginPath();
    ctx.moveTo(gx, cy - 110);
    ctx.lineTo(gx, cy + 110);
    ctx.stroke();
  }
  for (let gy = cy - 110; gy <= cy + 110; gy += 22) {
    ctx.beginPath();
    ctx.moveTo(cx - 110, gy);
    ctx.lineTo(cx + 110, gy);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 16;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// ---------------------------------------------------------------------------
// 3D Point Cloud Floor Segmentation (Downward start point cloud & upward end point cloud)
// ---------------------------------------------------------------------------
function createFloorSegmentationPointClouds(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'floorSegmentationGroup';

  for (let f = 1; f <= 5; f++) {
    const startDownY = (f - 1) * 4.20;
    const endUpY = f * 4.20;

    const createLevelPoints = (y: number, colorHex: number) => {
      const pts: number[] = [];
      // Outer building perimeter LiDAR returns
      for (let x = -17; x <= 17; x += 0.6) {
        pts.push(x, y, -27);
        pts.push(x, y, 7);
      }
      for (let z = -27; z <= 7; z += 0.6) {
        pts.push(-17, y, z);
        pts.push(17, y, z);
      }
      // Inner Atrium opening perimeter LiDAR returns
      for (let x = -8.5; x <= 8.5; x += 0.4) {
        pts.push(x, y, -21);
        pts.push(x, y, -4.2);
      }
      for (let z = -21; z <= -4.2; z += 0.4) {
        pts.push(-8.5, y, z);
        pts.push(8.5, y, z);
      }
      // Structural column intersection point cloud nodes
      const colXs = [-17, -11.47, -5.5, 0, 5.5, 11.47, 17];
      const colZs = [-27, -21, -12.6, -4.2, 7];
      for (const cx of colXs) {
        for (const cz of colZs) {
          for (let k = 0; k < 6; k++) {
            pts.push(cx + (Math.random() - 0.5) * 0.4, y + (Math.random() - 0.5) * 0.08, cz + (Math.random() - 0.5) * 0.4);
          }
        }
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      const mat = new THREE.PointsMaterial({
        color: colorHex,
        size: 0.18,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending
      });
      return new THREE.Points(geo, mat);
    };

    const floorGroup = new THREE.Group();
    floorGroup.name = `floor_seg_${f}`;
    // Downward start point cloud (Cyan #06b6d4)
    const downCloud = createLevelPoints(startDownY, 0x06b6d4);
    // Upward end point cloud (Emerald #10b981)
    const upCloud = createLevelPoints(endUpY, 0x10b981);
    floorGroup.add(downCloud);
    floorGroup.add(upCloud);
    group.add(floorGroup);
  }

  return group;
}

// ---------------------------------------------------------------------------
// 3D Door Bounding Volume Prism (1.80m x 2.44m x 0.22m) & Center Cloud Reticle
// ---------------------------------------------------------------------------
function createDoorVolumeMarker(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'doorVolumeMarker';

  // 1.80m W x 2.44m H x 0.22m D bounding volume — clearly visible selected-door outline
  const boxGeo = new THREE.BoxGeometry(1.80, 2.44, 0.22);
  const edges = new THREE.EdgesGeometry(boxGeo);
  const edgeLine = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0x00eeff, transparent: true, opacity: 0.92, linewidth: 2 })
  );
  group.add(edgeLine);

  // Subtle fill so the selected boundary stands out even in bright scenes
  const fillMesh = new THREE.Mesh(
    boxGeo,
    new THREE.MeshBasicMaterial({ color: 0x00ccff, transparent: true, opacity: 0.07, depthWrite: false, side: THREE.BackSide })
  );
  group.add(fillMesh);

  // Center Cloud Reticle: Glowing Center Point
  const centerDotGeo = new THREE.SphereGeometry(0.045, 12, 12);
  const centerDotMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const centerDot = new THREE.Mesh(centerDotGeo, centerDotMat);
  group.add(centerDot);

  // Mini 3D Axis crosshairs
  const crosshairGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-0.25, 0, 0), new THREE.Vector3(0.25, 0, 0),
    new THREE.Vector3(0, -0.25, 0), new THREE.Vector3(0, 0.25, 0),
    new THREE.Vector3(0, 0, -0.20), new THREE.Vector3(0, 0, 0.20)
  ]);
  const crosshair = new THREE.LineSegments(
    crosshairGeo,
    new THREE.LineBasicMaterial({ color: 0x4ade80 })
  );
  group.add(crosshair);

  // Local LiDAR Point Cloud Returns
  const lidarPts: number[] = [];
  for (let i = 0; i < 28; i++) {
    const rx = (Math.random() - 0.5) * 1.6;
    const ry = (Math.random() - 0.5) * 2.2;
    const rz = (Math.random() - 0.5) * 0.18;
    lidarPts.push(rx, ry, rz);
  }
  const lidarGeo = new THREE.BufferGeometry();
  lidarGeo.setAttribute('position', new THREE.Float32BufferAttribute(lidarPts, 3));
  const lidarPoints = new THREE.Points(
    lidarGeo,
    new THREE.PointsMaterial({ color: 0xa7f3d0, size: 0.08, transparent: true, opacity: 0.9 })
  );
  group.add(lidarPoints);

  return group;
}

// ---------------------------------------------------------------------------
// Procedural Micro-Cloud Points Builder (4,500+ luminous points stacked layer-by-layer)
// ---------------------------------------------------------------------------
function createMicroPointCloudMesh(): { points: THREE.Points; origPositions: Float32Array; pointCount: number } {
  const pts: number[] = [];
  const colors: number[] = [];
  const colCyan = new THREE.Color(0x38bdf8);
  const colEmerald = new THREE.Color(0x34d399);
  const colGold = new THREE.Color(0xfbbf24);

  // 1. Column vertical stacks (RCC Moment Columns)
  const colXs = [-17, -11.47, -5.5, 0, 5.5, 11.47, 17];
  const colZs = [-27, -21, -12.6, -4.2, 7];
  for (const cx of colXs) {
    for (const cz of colZs) {
      for (let y = 0; y <= 21; y += 0.35) {
        pts.push(cx + (Math.random() - 0.5) * 0.25, y, cz + (Math.random() - 0.5) * 0.25);
        const c = y % 4.2 < 0.35 ? colEmerald : colCyan;
        colors.push(c.r, c.g, c.b);
      }
    }
  }

  // 2. Floor slabs & gallery perimeter points (5 tiers)
  for (let f = 1; f <= 5; f++) {
    const fy = (f - 1) * 4.2;
    for (let x = -17; x <= 17; x += 0.9) {
      for (let z = -27; z <= 7; z += 0.9) {
        const inAtrium = (x > -8.5 && x < 8.5 && z > -21 && z < -4.2);
        if (!inAtrium || f === 1) {
          pts.push(x + (Math.random() - 0.5) * 0.2, fy + (Math.random() - 0.5) * 0.05, z + (Math.random() - 0.5) * 0.2);
          colors.push(colEmerald.r, colEmerald.g, colEmerald.b);
        }
      }
    }
  }

  // 3. Facade & room door portals
  for (let f = 1; f <= 5; f++) {
    const fy = (f - 1) * 4.2;
    for (let dy = 0; dy <= 2.44; dy += 0.3) {
      for (let r = 11; r <= 19; r++) {
        const geom = getRoomDoorGeometry(`A-${f}${r}`);
        pts.push(geom.doorMidPos.x + (Math.random() - 0.5) * 1.6, fy + dy, geom.doorMidPos.z + (Math.random() - 0.5) * 0.2);
        colors.push(colGold.r, colGold.g, colGold.b);
      }
    }
  }

  const origPositions = new Float32Array(pts);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(pts.length), 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.16,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending
  });

  const points = new THREE.Points(geo, mat);
  points.name = 'microPointCloud';
  points.visible = false;
  return { points, origPositions, pointCount: pts.length / 3 };
}

// ---------------------------------------------------------------------------
// Glowing Laser Scanner Plane & Tile Wave Ring
// ---------------------------------------------------------------------------
function createLaserScannerPlane(): THREE.Mesh {
  const geo = new THREE.PlaneGeometry(38, 38);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.visible = false;
  mesh.name = 'laserScannerPlane';
  return mesh;
}

function createTileWaveRing(): THREE.Mesh {
  const geo = new THREE.RingGeometry(0.1, 0.6, 64);
  const mat = new THREE.MeshBasicMaterial({
    color: 0xfbbf24,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(0, 0.09, -12.6);
  mesh.visible = false;
  mesh.name = 'tileWaveRing';
  return mesh;
}

export const BuildingDigitalTwinViewer: React.FC<BuildingDigitalTwinViewerProps> = ({
  targetRoomNumber = 'A-119',
  isActive,
  onConstructionComplete,
  onArrivedAtRoom,
  onRoomSelect,
  onProximityRoomChange,
  onExplorationModeChange
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);

  // Mesh & Room Tracking
  const meshesRef = useRef<{ mesh: THREE.Mesh; originalMat: any; origY: number; floor: number; isDoor: boolean; isExterior: boolean; name: string }[]>([]);
  const roomDoorsRef = useRef<RoomDoorRecord[]>([]);
  const atriumFloorMeshRef  = useRef<THREE.Mesh | null>(null);
  const groundMeshRef        = useRef<THREE.Mesh | null>(null);
  // buildingGroundMeshRef removed (sky blue sheet removed per user request)
  const frontPillarsRef = useRef<THREE.Group[]>([]);
  const pottedPlantsRef = useRef<THREE.Group[]>([]);
  const floorSegmentationGroupRef = useRef<THREE.Group | null>(null);
  const doorVolumeMarkerRef = useRef<THREE.Group | null>(null);
  const microPointCloudRef = useRef<{ points: THREE.Points; origPositions: Float32Array; pointCount: number } | null>(null);
  const laserScannerPlaneRef = useRef<THREE.Mesh | null>(null);
  const tileWaveRingRef = useRef<THREE.Mesh | null>(null);
  const hasConstructedRef = useRef(false);
  const isFlyingRef = useRef(false);
  const targetRoomRef = useRef(targetRoomNumber);
  targetRoomRef.current = targetRoomNumber;
  const prevTargetRoomRef = useRef(targetRoomNumber);

  // States
  const [animStage, setAnimStage] = useState<'idle' | 'empty' | 'building' | 'entering' | 'at_room' | 'free_orbit'>('idle');
  const [telemetryText, setTelemetryText] = useState('STANDBY: WAITING FOR SEARCH COMMAND');
  const [buildPercent, setBuildPercent] = useState(0);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('realistic');
  const [selectedFloor, setSelectedFloor] = useState<string>('all');
  const [showPointCloudSegmentation, setShowPointCloudSegmentation] = useState(false); // Dots visible only after clicking
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // Dynamic Proximity Detection: shows room mark on door mid when near, hides when > 5.5m
  const [proximityRoom, setProximityRoom] = useState<{ 
    record: RoomCadastreRecord; 
    distance: number; 
    screenPos: { x: number; y: number } 
  } | null>(null);

  // -------------------------------------------------------------------------
  // 1. Initialize Daylight Scene, Lighting & Controls
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Atmospheric Nishita Daylight Sky matching front_reconstruction.png
    const createAtmosphericSky = (): THREE.CanvasTexture => {
      const cv = document.createElement('canvas');
      cv.width = 1024;
      cv.height = 1024;
      const ctx = cv.getContext('2d')!;
      const grad = ctx.createLinearGradient(0, 0, 0, 1024);
      // Beautiful Nishita Daylight Sky matching front_reconstruction.png:
      // Equirectangular mapping: Y=0 is zenith (+90°), Y=512 is horizon (0°), Y=1024 is nadir (-90°)
      grad.addColorStop(0.00, '#78aee4'); // Deep azure zenith
      grad.addColorStop(0.20, '#93c2ec'); // Mid-upper sky
      grad.addColorStop(0.36, '#b4d6f3'); // Sky angle right behind building roof (+25°)
      grad.addColorStop(0.46, '#d9eaf7'); // Soft atmospheric haze right above horizon
      grad.addColorStop(0.50, '#f2f7fc'); // Luminous horizon
      grad.addColorStop(0.54, '#e4ebf2'); // Below horizon ground haze
      grad.addColorStop(1.00, '#7e786e'); // Diffuse ground reflection tone
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1024);
      const tex = new THREE.CanvasTexture(cv);
      tex.mapping = THREE.EquirectangularReflectionMapping;
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const skyTex = createAtmosphericSky();
    scene.background = skyTex;
    scene.environment = skyTex;
    scene.fog = new THREE.Fog('#edf5fc', 220, 800);

    // Frame entire building vertically from steps to roof parapet with margins
    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(48, aspect, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(3.4, 1.80, 36.5); // Perfectly framed front elevation
    camera.lookAt(0.174, 11.20, 1.50);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.target.set(0.174, 11.20, 1.50);
    controls.maxPolarAngle = Math.PI / 2 + 0.04;
    controls.enabled = true;

    // --- Atmospheric Daylight Lighting matching front_reconstruction.png ---
    // Primary directional sunlight matching Blender Cycles sun (elevation 42°, azimuth upper left)
    const sunLight = new THREE.DirectionalLight(0xfffaee, 1.95);
    sunLight.position.set(-28, 44, 32);
    sunLight.target.position.set(0, 8, -6);
    scene.add(sunLight.target);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 4096;
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.camera.left = -38;
    sunLight.shadow.camera.right = 38;
    sunLight.shadow.camera.top = 34;
    sunLight.shadow.camera.bottom = -18;
    sunLight.shadow.camera.near = 5;
    sunLight.shadow.camera.far = 160;
    sunLight.shadow.bias = -0.0002;
    sunLight.shadow.normalBias = 0.025;
    scene.add(sunLight);

    // Soft open-sky daylight + subtle warm ground bounce
    const hemiLight = new THREE.HemisphereLight(0xc8e0f7, 0x6e665d, 0.58);
    scene.add(hemiLight);

    // Cool open-sky atmospheric fill from upper right
    const skyFill = new THREE.DirectionalLight(0xadd0f2, 0.32);
    skyFill.position.set(26, 30, 22);
    scene.add(skyFill);

    // Warm forecourt upward bounce softly illuminating soffits, overhangs and portico ceiling
    const groundBounce = new THREE.DirectionalLight(0xe5dcce, 0.32);
    groundBounce.position.set(0, -10, 16);
    scene.add(groundBounce);

    // Bright Multi-Level Atrium Lights (Centered at Atrium Center Z = -12.6)
    const atriumLight1 = new THREE.PointLight(0xfff8f0, 3.8, 45);
    atriumLight1.position.set(0, 3.5, -12.6);
    scene.add(atriumLight1);

    const atriumLight2 = new THREE.PointLight(0xfff8f0, 3.2, 45);
    atriumLight2.position.set(0, 11.0, -12.6);
    scene.add(atriumLight2);

    const atriumLight3 = new THREE.PointLight(0xfff8f0, 3.2, 50);
    atriumLight3.position.set(0, 18.0, -12.6);
    scene.add(atriumLight3);

    // --- Forecourt Ground Paving matching front_reconstruction.png ---
    const groundGeo = new THREE.PlaneGeometry(600, 600);
    const groundMat = new THREE.MeshStandardMaterial({ 
      color: 0xd8dde2, // Bright, clean daylight forecourt paving matching reference photo
      roughness: 0.92, 
      metalness: 0.02 
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.90; // Placed at -0.90 matching Blender GROUND
    groundMesh.receiveShadow = true;
    groundMesh.visible = false; // Hidden until construction sequence reveals it
    scene.add(groundMesh);
    groundMeshRef.current = groundMesh;

    const frontPillars: THREE.Group[] = [];
    frontPillarsRef.current = frontPillars;

    // -----------------------------------------------------------------------
    // ACCURATE ATRIUM FLOOR MESH (Terracotta Rust-Red + Black Granite + Inlay)
    // Matches the photograph provided by the user with high-gloss reflection!
    // Centered at the Atrium opening (0, 0.02, -12.6)
    // -----------------------------------------------------------------------
    const floorTexture = createAtriumFloorTexture();
    const atriumFloorGeo = new THREE.PlaneGeometry(23.2, 23.2);
    const atriumFloorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.22, // High-gloss polished stone reflectivity
      metalness: 0.12,
      envMapIntensity: 1.5
    });
    const atriumFloorMesh = new THREE.Mesh(atriumFloorGeo, atriumFloorMat);
    atriumFloorMesh.rotation.x = -Math.PI / 2;
    atriumFloorMesh.position.set(0, 0.07, -12.6); // Elevated at y=0.07 above the slab so it's fully visible and crisp
    atriumFloorMesh.receiveShadow = true;
    atriumFloorMesh.visible = false; // Hidden until Phase 1 of construction sequence
    atriumFloorMesh.scale.set(0.01, 0.01, 0.01);
    scene.add(atriumFloorMesh);
    atriumFloorMeshRef.current = atriumFloorMesh;

    // Add 4 Potted Plants around Central Circle as seen in reference photo
    const plants: THREE.Group[] = [];
    const createPottedPlant = (px: number, pz: number) => {
      const plantGroup = new THREE.Group();
      // Terracotta Pot
      const potGeo = new THREE.CylinderGeometry(0.25, 0.19, 0.38, 16);
      const potMat = new THREE.MeshStandardMaterial({ color: 0xba4530, roughness: 0.55 });
      const pot = new THREE.Mesh(potGeo, potMat);
      pot.position.y = 0.19;
      pot.castShadow = true;
      plantGroup.add(pot);

      // Dark Soil
      const soilGeo = new THREE.CylinderGeometry(0.23, 0.23, 0.04, 16);
      const soilMat = new THREE.MeshStandardMaterial({ color: 0x2a1a12, roughness: 0.9 });
      const soil = new THREE.Mesh(soilGeo, soilMat);
      soil.position.y = 0.36;
      plantGroup.add(soil);

      // Green Leaves
      const foliageGeo = new THREE.SphereGeometry(0.30, 10, 10);
      foliageGeo.scale(1.1, 1.3, 1.1);
      const foliageMat = new THREE.MeshStandardMaterial({ color: 0x22543d, roughness: 0.65 });
      const foliage = new THREE.Mesh(foliageGeo, foliageMat);
      foliage.position.y = 0.54;
      foliage.castShadow = true;
      plantGroup.add(foliage);

      plantGroup.position.set(px, 0.07, pz);
      plantGroup.visible = false; // Hidden until construction Phase 5 reveals them
      scene.add(plantGroup);
      plants.push(plantGroup);
    };

    createPottedPlant(0, -12.6 + 1.8);
    createPottedPlant(0, -12.6 - 1.8);
    createPottedPlant(1.8, -12.6);
    createPottedPlant(-1.8, -12.6);
    pottedPlantsRef.current = plants;

    // -----------------------------------------------------------------------
    // 3D Point Cloud Floor Segmentation (Downward start & Upward end LiDAR bounds)
    // -----------------------------------------------------------------------
    const floorSegGroup = createFloorSegmentationPointClouds();
    floorSegmentationGroupRef.current = floorSegGroup;
    floorSegGroup.visible = false; // "dots should be visible only after clicking"
    scene.add(floorSegGroup);

    // -----------------------------------------------------------------------
    // 3D Door Bounding Volume Prism (1.80m x 2.44m x 0.22m) & Center Cloud Reticle
    // -----------------------------------------------------------------------
    const doorVolMarker = createDoorVolumeMarker();
    doorVolumeMarkerRef.current = doorVolMarker;
    doorVolMarker.visible = false;
    scene.add(doorVolMarker);

    // Micro Point Cloud Building Structure & Laser Scanner
    const microCloud = createMicroPointCloudMesh();
    microPointCloudRef.current = microCloud;
    scene.add(microCloud.points);

    const laserScanner = createLaserScannerPlane();
    laserScannerPlaneRef.current = laserScanner;
    scene.add(laserScanner);

    const tileWave = createTileWaveRing();
    tileWaveRingRef.current = tileWave;
    scene.add(tileWave);

    // Resize Handler maintaining exact Blender 25mm lens framing
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.fov = 48;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (controls.enabled) {
        controls.update();
      }

      // Free vertical camera orbit: anti-mid-floor camera snap removed per user instruction.
      // Proximity auto-attraction removed per user instruction:
      // Details & markers ONLY show upon clicking on a room door or performing a search.

      // Keep active door reticle positioned on screen if a room was clicked
      if (proximityRoom && cameraRef.current && mountRef.current) {
        const centerPt = new THREE.Vector3(
          proximityRoom.record.centerCloud.x,
          proximityRoom.record.centerCloud.y,
          proximityRoom.record.centerCloud.z
        );
        const screenVector = centerPt.clone().project(cameraRef.current);
        const hw = mountRef.current.clientWidth / 2;
        const hh = mountRef.current.clientHeight / 2;
        const sx = screenVector.x * hw + hw;
        const sy = -screenVector.y * hh + hh;
        if (Math.abs(proximityRoom.screenPos.x - sx) > 1.5 || Math.abs(proximityRoom.screenPos.y - sy) > 1.5) {
          setProximityRoom(prev => prev ? { ...prev, screenPos: { x: sx, y: sy } } : null);
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(reqId);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onProximityRoomChange]);

  // -------------------------------------------------------------------------
  // 2. Load Model (/h.glb) & Apply Color Calibration to Match front_reconstruction.png
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    const loader = new GLTFLoader();
    loader.load(
      '/h.glb',
      (gltf) => {
        const root = gltf.scene;
        modelGroupRef.current = root;

        root.position.set(0, 0, 0);
        const collected: any[] = [];

        // Procedural Stucco Wall Texture (fine grain + subtle plaster color variation + rainwater runoff + hairline cracks)
        const createWallStuccoTexture = (): THREE.CanvasTexture => {
          const sz = 1024;
          const cv = document.createElement('canvas');
          cv.width = sz;
          cv.height = sz;
          const ctx = cv.getContext('2d')!;
          ctx.fillStyle = '#D8D0C2'; // Warm ivory / off-white base #D8D0C2
          ctx.fillRect(0, 0, sz, sz);

          const img = ctx.getImageData(0, 0, sz, sz);
          const d = img.data;
          for (let y = 0; y < sz; y++) {
            for (let x = 0; x < sz; x++) {
              const idx = (y * sz + x) * 4;
              // Multi-frequency noise for stucco granular tooth and subtle plaster undulation
              const n1 = Math.sin(x * 0.05) * Math.cos(y * 0.05);
              const n2 = Math.sin(x * 0.15 + y * 0.12);
              const n3 = Math.sin(x * 0.40) * Math.sin(y * 0.40);
              const grain = (Math.random() - 0.5) * 16 + (n1 * 5 + n2 * 4 + n3 * 3);
              d[idx] = Math.min(255, Math.max(0, d[idx] + grain));
              d[idx + 1] = Math.min(255, Math.max(0, d[idx + 1] + grain * 0.94));
              d[idx + 2] = Math.min(255, Math.max(0, d[idx + 2] + grain * 0.85));
            }
          }
          ctx.putImageData(img, 0, 0);

          // Vertical rainwater runoff streaks underneath horizontal projections & parapets
          for (let i = 0; i < 44; i++) {
            const sx = Math.random() * sz;
            const sw = 2 + Math.random() * 4;
            const len = sz * (0.20 + Math.random() * 0.55);
            const grad = ctx.createLinearGradient(sx, 0, sx, len);
            grad.addColorStop(0, 'rgba(64, 56, 46, 0.15)');
            grad.addColorStop(0.65, 'rgba(64, 56, 46, 0.05)');
            grad.addColorStop(1, 'rgba(64, 56, 46, 0.0)');
            ctx.fillStyle = grad;
            ctx.fillRect(sx, 0, sw, len);
          }

          // Localized hairline plaster cracks (branching clusters in stress zones)
          ctx.strokeStyle = 'rgba(52, 45, 38, 0.28)';
          ctx.lineWidth = 1.0;
          for (let cluster = 0; cluster < 5; cluster++) {
            let startX = (cluster * 200 + 70 + Math.random() * 60) % sz;
            let startY = Math.random() * (sz * 0.7);
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            let curX = startX;
            let curY = startY;
            for (let seg = 0; seg < 6; seg++) {
              curX += (Math.random() - 0.5) * 40;
              curY += (Math.random() * 0.8 + 0.2) * 30;
              ctx.lineTo(curX, curY);
              if (Math.random() > 0.5) {
                ctx.moveTo(curX, curY);
                ctx.lineTo(curX + (Math.random() - 0.5) * 25, curY + Math.random() * 20);
                ctx.moveTo(curX, curY);
              }
            }
            ctx.stroke();
          }

          const tex = new THREE.CanvasTexture(cv);
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;
          tex.repeat.set(4, 4);
          tex.colorSpace = THREE.SRGBColorSpace;
          return tex;
        };

        // Procedural Granular Coating Texture for Round Columns
        const createColumnGranularTexture = (): THREE.CanvasTexture => {
          const sz = 256;
          const cv = document.createElement('canvas');
          cv.width = sz;
          cv.height = sz;
          const ctx = cv.getContext('2d')!;
          ctx.fillStyle = '#9A7358';
          ctx.fillRect(0, 0, sz, sz);

          const img = ctx.getImageData(0, 0, sz, sz);
          const d = img.data;
          for (let i = 0; i < d.length; i += 4) {
            const grain = (Math.random() - 0.5) * 32;
            d[i] = Math.min(255, Math.max(0, d[i] + grain));
            d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + grain * 0.86));
            d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + grain * 0.76));
          }
          ctx.putImageData(img, 0, 0);

          const tex = new THREE.CanvasTexture(cv);
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;
          tex.repeat.set(2, 6);
          tex.colorSpace = THREE.SRGBColorSpace;
          return tex;
        };

        // Procedural Stone-Clad Ramp Texture (irregular grey-blue natural stone pieces + dark grey grout)
        const createStoneRampTexture = (): THREE.CanvasTexture => {
          const sz = 512;
          const cv = document.createElement('canvas');
          cv.width = sz;
          cv.height = sz;
          const ctx = cv.getContext('2d')!;
          // Dark grey grout #222528
          ctx.fillStyle = '#222528';
          ctx.fillRect(0, 0, sz, sz);

          const stones = ['#556470', '#3E4A54', '#687988', '#5C6166', '#4E5A65', '#606F7C'];
          const cols = 6;
          const rows = 6;
          const cw = sz / cols;
          const ch = sz / rows;

          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const x = c * cw + 3;
              const y = r * ch + 3;
              const w = cw - 6;
              const h = ch - 6;
              ctx.fillStyle = stones[(r * 7 + c * 3) % stones.length];

              ctx.beginPath();
              ctx.moveTo(x + 5, y);
              ctx.lineTo(x + w - 5, y + (Math.random() - 0.5) * 3);
              ctx.lineTo(x + w, y + 5);
              ctx.lineTo(x + w + (Math.random() - 0.5) * 3, y + h - 5);
              ctx.lineTo(x + w - 5, y + h);
              ctx.lineTo(x + 5, y + h + (Math.random() - 0.5) * 3);
              ctx.lineTo(x, y + h - 5);
              ctx.lineTo(x + (Math.random() - 0.5) * 3, y + 5);
              ctx.closePath();
              ctx.fill();
            }
          }

          const tex = new THREE.CanvasTexture(cv);
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;
          tex.repeat.set(3, 3);
          tex.colorSpace = THREE.SRGBColorSpace;
          return tex;
        };

        // ------------------------------------------------------------------
        // Procedural Photorealistic Institutional Door Texture
        // Painted composite/metal institutional door: warm dusty peach
        // Base colour approx #B98F7D – #C49A87, matte, slightly rough,
        // with surface grain, edge scuffs, wear marks, and subtle paint variation.
        // ------------------------------------------------------------------
        const createDoorPeachTexture = (): THREE.CanvasTexture => {
          const sz = 512;
          const cv = document.createElement('canvas');
          cv.width = sz;
          cv.height = sz;
          const ctx = cv.getContext('2d')!;

          // Base warm dusty peach
          ctx.fillStyle = '#C49A87';
          ctx.fillRect(0, 0, sz, sz);

          // Subtle paint colour variation – patches of lighter ivory and deeper salmon
          const patches = [
            { x: 80, y: 100, r: 140, color: 'rgba(185,143,125,0.18)' },
            { x: 380, y: 80, r: 110, color: 'rgba(155,110,90,0.12)' },
            { x: 260, y: 370, r: 130, color: 'rgba(210,175,155,0.15)' },
            { x: 60, y: 400, r: 80, color: 'rgba(140,100,82,0.10)' },
            { x: 460, y: 280, r: 90, color: 'rgba(220,185,165,0.12)' },
          ];
          for (const p of patches) {
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
            g.addColorStop(0, p.color);
            g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, sz, sz);
          }

          // Fine surface grain (matte painted metal/composite)
          const img = ctx.getImageData(0, 0, sz, sz);
          const d = img.data;
          for (let y = 0; y < sz; y++) {
            for (let x = 0; x < sz; x++) {
              const idx = (y * sz + x) * 4;
              const grain = (Math.random() - 0.5) * 18;
              d[idx]     = Math.min(255, Math.max(0, d[idx]     + grain));
              d[idx + 1] = Math.min(255, Math.max(0, d[idx + 1] + grain * 0.88));
              d[idx + 2] = Math.min(255, Math.max(0, d[idx + 2] + grain * 0.80));
            }
          }
          ctx.putImageData(img, 0, 0);

          // Horizontal low-contrast panel lines (institutional door panels)
          ctx.strokeStyle = 'rgba(80, 54, 40, 0.12)';
          ctx.lineWidth = 1.5;
          for (const fy of [sz * 0.22, sz * 0.48, sz * 0.74]) {
            ctx.beginPath(); ctx.moveTo(10, fy); ctx.lineTo(sz - 10, fy); ctx.stroke();
          }

          // Edge scuff / wear marks along perimeter
          ctx.strokeStyle = 'rgba(60, 38, 28, 0.18)';
          ctx.lineWidth = 6;
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, sz); ctx.stroke(); // left
          ctx.beginPath(); ctx.moveTo(sz, 0); ctx.lineTo(sz, sz); ctx.stroke(); // right
          ctx.beginPath(); ctx.moveTo(0, sz); ctx.lineTo(sz, sz); ctx.stroke(); // bottom kick

          // Subtle vertical dust streaks
          for (let i = 0; i < 8; i++) {
            const sx = 20 + Math.random() * (sz - 40);
            const sw = 1 + Math.random() * 2;
            const sl = sz * (0.3 + Math.random() * 0.5);
            const sg = ctx.createLinearGradient(sx, 0, sx, sl);
            sg.addColorStop(0, 'rgba(90,64,48,0.06)');
            sg.addColorStop(1, 'rgba(90,64,48,0.0)');
            ctx.fillStyle = sg;
            ctx.fillRect(sx, 0, sw, sl);
          }

          const tex = new THREE.CanvasTexture(cv);
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;
          tex.repeat.set(1, 1);
          tex.colorSpace = THREE.SRGBColorSpace;
          return tex;
        };

        // Procedural Door Frame Peach Texture (slightly darker/richer than leaf)
        const createDoorFrameTexture = (): THREE.CanvasTexture => {
          const sz = 256;
          const cv = document.createElement('canvas');
          cv.width = sz;
          cv.height = sz;
          const ctx = cv.getContext('2d')!;
          ctx.fillStyle = '#A97A68'; // Slightly deeper dusty peach for frame
          ctx.fillRect(0, 0, sz, sz);
          const img = ctx.getImageData(0, 0, sz, sz);
          const d = img.data;
          for (let i = 0; i < d.length; i += 4) {
            const g = (Math.random() - 0.5) * 20;
            d[i]     = Math.min(255, Math.max(0, d[i]     + g));
            d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + g * 0.85));
            d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + g * 0.76));
          }
          ctx.putImageData(img, 0, 0);
          const tex = new THREE.CanvasTexture(cv);
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;
          tex.repeat.set(2, 4);
          tex.colorSpace = THREE.SRGBColorSpace;
          return tex;
        };

        const wallTexture      = createWallStuccoTexture();
        const columnTexture    = createColumnGranularTexture();
        const stoneRampTexture = createStoneRampTexture();
        const doorPeachTexture = createDoorPeachTexture();
        const doorFrameTexture = createDoorFrameTexture();

        // Calibrated Reference Materials matching updated PCCRC Building specification
        const matCream = new THREE.MeshStandardMaterial({
          color: 0xffffff, // White multiplier so canvas texture #D8D0C2 base is accurately retained
          roughness: 0.94,
          metalness: 0.0,
          map: wallTexture,
          bumpMap: wallTexture,
          bumpScale: 0.022
        });
        const matRecessedPeach = new THREE.MeshStandardMaterial({
          color: 0xA98A72,
          roughness: 0.88,
          metalness: 0.02
        });
        const matColumn = new THREE.MeshStandardMaterial({
          color: 0xffffff, // White multiplier so column canvas texture #9A7358 is accurately retained
          roughness: 0.92,
          metalness: 0.0,
          map: columnTexture,
          bumpMap: columnTexture,
          bumpScale: 0.038
        });
        const matParapetBand = new THREE.MeshStandardMaterial({
          color: 0x8C7F70,
          roughness: 0.88,
          metalness: 0.02
        });
        const matStoneTread = new THREE.MeshStandardMaterial({
          color: 0xb5aca0, // Weathered cream stair stone
          roughness: 0.84,
          metalness: 0.02
        });
        const matTerracotta = new THREE.MeshStandardMaterial({
          color: 0x783c30, // Aged terracotta red stair stone
          roughness: 0.88,
          metalness: 0.02
        });
        // ── Photorealistic Peach Institutional Door Leaf ─────────────────────
        // Warm dusty peach painted composite door panel. Matte, slightly rough
        // surface with paint ageing, grain, edge scuffs and subtle colour variation.
        const matDoorLeaf = new THREE.MeshStandardMaterial({
          color: 0xffffff,          // white multiplier — true colour lives in texture
          roughness: 0.86,          // matte institutional painted door
          metalness: 0.04,          // minimal metal hint (composite/painted steel)
          map: doorPeachTexture,
          bumpMap: doorPeachTexture,
          bumpScale: 0.015
        });

        // ── Door Frame / Architrave / Reveal ─────────────────────────────────
        // Thick peach-toned door frame, same family as leaf but richer and rougher
        const matDoorFrame = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.90,
          metalness: 0.02,
          map: doorFrameTexture,
          bumpMap: doorFrameTexture,
          bumpScale: 0.022
        });

        // ── Door Vision Glass ─────────────────────────────────────────────────
        // Small inset vision windows in the door — dark semi-transparent with slight tint
        const matDoorGlass = new THREE.MeshStandardMaterial({
          color: 0x162028,
          roughness: 0.08,
          metalness: 0.70,
          transparent: true,
          opacity: 0.82,
          envMapIntensity: 1.8
        });

        // ── Door Hardware (handles, hydraulic closers, push plate, latch) ─────
        // Brushed stainless handles and closer arms — aged/matte brushed metal
        const matDoorHardware = new THREE.MeshStandardMaterial({
          color: 0x7a7f82,
          roughness: 0.38,
          metalness: 0.78
        });

        // ── Room Number Placard (white sign plate on door face) ───────────────
        // Bright off-white plate — high contrast so text is readable
        const matPushPlate = new THREE.MeshStandardMaterial({
          color: 0xf5f0e8,   // Bright off-white / very light ivory
          roughness: 0.60,
          metalness: 0.04
        });

        // ── Room Number Text Block (dark embossed text on placard) ────────────
        // Near-black so room numbers contrast sharply against the white plate
        const matPlacardText = new THREE.MeshStandardMaterial({
          color: 0x0a0a0a,   // Near-black text
          roughness: 0.70,
          metalness: 0.02
        });

        // Legacy alias (kept so any unreachable branch still compiles)
        const matWoodBeech = matDoorLeaf;
        const matStainless = new THREE.MeshStandardMaterial({
          color: 0x606468, // Aged silver/grey railing
          roughness: 0.52,
          metalness: 0.68
        });
        const matGlass = new THREE.MeshStandardMaterial({
          color: 0x08101a, // Dark blue-charcoal glass reflecting bright sky
          roughness: 0.03, // Ultra-slick polished glass
          metalness: 0.85, // High specular mirror reflectance of sky
          envMapIntensity: 2.4
        });
        const matWindowGrill = new THREE.MeshStandardMaterial({
          color: 0x585c60,
          roughness: 0.54,
          metalness: 0.75
        });
        const matStoneRamp = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          map: stoneRampTexture,
          bumpMap: stoneRampTexture,
          bumpScale: 0.04,
          roughness: 0.84,
          metalness: 0.02
        });
        const matFireRed = new THREE.MeshStandardMaterial({
          color: 0xdc2626,
          roughness: 0.3,
          metalness: 0.1
        });
        const matGranite = new THREE.MeshStandardMaterial({
          color: 0x27272a,
          roughness: 0.4,
          metalness: 0.1
        });
        const matWindowFrame = new THREE.MeshStandardMaterial({
          color: 0x222528, // Aged dark bronze/charcoal aluminum frame
          roughness: 0.62,
          metalness: 0.72
        });
        const matPlinth = new THREE.MeshStandardMaterial({
          color: 0x544f48, // Dark moisture-stained, chipped concrete
          roughness: 0.96,
          metalness: 0.02
        });

        const toRemove: THREE.Object3D[] = [];

        root.traverse((child) => {
          const name = child.name || '';
          const parentName = child.parent ? child.parent.name || '' : '';
          const ln = (name + ' ' + parentName).toLowerCase();

          // Completely detach legacy procedural paving, platform, and planter meshes from scene graph
          const isLegacyGroundOrPlanter = 
            ln.includes('glossy tile') ||
            ln.includes('stone paving') ||
            ln.includes('planter') ||
            ln.includes('plant leaf') ||
            ln.includes('plant stem') ||
            ln.includes('concrete platform') ||
            ln.includes('circular platform') ||
            ln.includes('stone inlay') ||
            ln.includes('polished stone ground') ||
            ln.includes('atrium polished') ||
            ln.includes('burgundy planter') ||
            ln.includes('sparse low planting') ||
            ln.includes('planting') ||
            ln.includes('circular raised stone') ||
            ln.includes('central circular concrete platform') ||
            ln.includes('circular edging mortar seam') ||
            ln.includes('circular bed soil');

          if (isLegacyGroundOrPlanter) {
            child.visible = false;
            child.scale.set(0, 0, 0);
            child.position.set(0, -9999, 0);
            toRemove.push(child);
            return;
          }

          if ((child as THREE.Mesh).isMesh) {
            const m = child as THREE.Mesh;
            m.castShadow = true;
            m.receiveShadow = true;
            const yPos = m.position.y;

            // Accurate Color & Material Assignment matching front_reconstruction.png
            if (ln.includes('glass')) {
              m.material = matGlass;
            } else if (
              ln.includes('security grille') || 
              ln.includes('grille crossbar') ||
              ln.includes('rectangular grille')
            ) {
              m.material = matWindowGrill;
            } else if (
              ln.includes('mullion') || 
              ln.includes('transom') || 
              ln.includes('window frame') || 
              ln.includes('perimeter seal') ||
              ln.includes('window latch') ||
              ln.includes('bay latch') ||
              ln.includes('bay horizontal transom') ||
              ln.includes('bay vertical mullion')
            ) {
              m.material = matWindowFrame;
            } else if (
              ln.includes('cylindrical column') ||
              ln.includes('paired small columns') ||
              ln.includes('tall bay column') ||
              ln.includes('monumental central column') ||
              (name.includes('column') && !name.includes('square') && !name.includes('pier') && !name.includes('rectangular'))
            ) {
              m.material = matColumn;
            } else if (
              name.includes('Peach') || 
              name.includes('pediment') || 
              name.includes('arch reveal') || 
              name.includes('reveal rim') ||
              name.includes('arched opening spandrel') ||
              name.includes('lower façade')
            ) {
              m.material = matRecessedPeach;
            } else if (
              name.includes('coping') ||
              name.includes('moulded cornice') ||
              ln.includes('parapet coping')
            ) {
              m.material = matParapetBand;
            } else if (
              name.includes('ramp') ||
              name.includes('access ramp') ||
              ln.includes('access ramp')
            ) {
              m.material = matStoneRamp;
            } else if (name.includes('riser') || name.includes('Wide entrance stair riser')) {
              m.material = matTerracotta;
            } else if (name.includes('tread') || name.includes('stair tread') || name.includes('nosing') || name.includes('Cream worn stair nosing')) {
              m.material = matStoneTread;
            } else if (name.includes('pier plinth') || name.includes('foundation') || name.includes('ground structural slab')) {
              m.material = matPlinth;
            } else if (
              // Vision / sidelite glass inserts in the door leaf
              name.includes('Vision_Glass') ||
              name.includes('Sidelite_Glass') ||
              name.includes('Door_Glass')
            ) {
              m.material = matDoorGlass;
            } else if (
              // Door leaves (main panel)
              name.includes('Door_Left') ||
              name.includes('Door_Right') ||
              name.includes('Door_Leaf') ||
              name.includes('Portal_') ||
              (name.includes('Door_') && !name.includes('Frame') && !name.includes('Jamb') && !name.includes('Head') && !name.includes('Sill'))
            ) {
              m.material = matDoorLeaf;
            } else if (
              // Door frame, jamb, head, threshold, architrave, reveal
              name.includes('Door_Frame') ||
              name.includes('Door_Jamb') ||
              name.includes('Door_Head') ||
              name.includes('Door_Sill') ||
              name.includes('Door_Thresh') ||
              name.includes('Architrave') ||
              name.includes('Door_Reveal')
            ) {
              m.material = matDoorFrame;
            } else if (
              // Room number text on placard — MUST be assigned before generic Placard match
              name.includes('Placard_Text')
            ) {
              m.material = matPlacardText;
            } else if (
              // PUSH/PULL sign plate, door placard plate
              name.includes('Push_Plate') ||
              name.includes('Pull_Plate') ||
              name.includes('Placard_Plate') ||
              name.includes('Placard') ||
              name.includes('Door_Sign')
            ) {
              m.material = matPushPlate;
            } else if (
              // Hydraulic closers, handles, latches, bolts, padlocks
              name.includes('Handle_') ||
              name.includes('Closer_') ||
              name.includes('Door_Handle') ||
              name.includes('Door_Closer') ||
              name.includes('Slide_Bolt') ||
              name.includes('Padlock') ||
              name.includes('railing')
            ) {
              m.material = matDoorHardware;
            } else if (name.includes('Fire_Alarm')) {
              m.material = matFireRed;
            } else if (name.includes('Skirting')) {
              m.material = matGranite;
            } else {
              // Main exterior walls, square portico piers, canopies, solid parapets, spandrels
              m.material = matCream;
            }

            let floor = 0;
            if (name.includes('51') || name.includes('Floor_4') || yPos > 16.8) floor = 4;
            else if (name.includes('41') || name.includes('Floor_3') || yPos > 12.6) floor = 3;
            else if (name.includes('31') || name.includes('Floor_2') || yPos > 8.4) floor = 2;
            else if (name.includes('21') || name.includes('Floor_1') || yPos > 4.2) floor = 1;
            else floor = 0;

            const isDoor = name.includes('Door') || name.includes('Placard') || name.includes('Closer') || name.includes('Handle');
            const isExterior = name.includes('Front') || name.includes('pediment') || name.includes('facade') || name.includes('Wing') || name.includes('parapet');

            collected.push({
              mesh: m,
              originalMat: Array.isArray(m.material) ? m.material.map(mat => mat.clone()) : m.material.clone(),
              origY: m.position.y,
              floor,
              isDoor,
              isExterior,
              name
            });

            // All GLB meshes start HIDDEN — the construction sequence reveals them
            // progressively. Setting visible=true here caused the 5-6 second
            // full-building flash before executeConstructionSequence ran.
            m.visible = false;
          }
        });

        // Detach all legacy ground, paving, and planter meshes from the model
        toRemove.forEach((obj) => {
          obj.visible = false;
          obj.scale.set(0, 0, 0);
          obj.position.set(0, -9999, 0);
          if (obj.parent) {
            obj.parent.remove(obj);
          }
        });

        // Ensure all 45 rooms are accurately registered with exact door midpoint and outward normal
        const allDoors: RoomDoorRecord[] = [];
        for (let f = 1; f <= 5; f++) {
          for (let r = 11; r <= 19; r++) {
            const code = `A-${f}${r}`;
            const geom = getRoomDoorGeometry(code);
            allDoors.push({
              roomCode: code,
              floor: f,
              doorMidPos: geom.doorMidPos,
              normal: geom.normal,
              worldPos: geom.doorMidPos.clone(),
              cadastre: getRoomCadastre(code)
            });
          }
        }
        roomDoorsRef.current = allDoors;
        meshesRef.current = collected;
        scene.add(root);
        setIsModelLoaded(true);
      },
      undefined,
      (err) => console.warn('Model load issue:', err)
    );

    return () => {
      if (modelGroupRef.current && sceneRef.current) {
        sceneRef.current.remove(modelGroupRef.current);
      }
    };
  }, []);

  // -------------------------------------------------------------------------
  // 3. Continuous Realistic Indoor Architectural Flight Path (No Cuts!)
  //    Traces realistic paths: Front Plaza -> Portico Colonnade -> Entrance Portal ->
  //    Atrium Foyer -> Central Atrium Medallion -> Open Light Well Ascent (for Upper Floors) ->
  //    Gallery Walkway Corridor -> Straight-on Door Center Lock at 3.20m Safe Distance!
  // -------------------------------------------------------------------------
  const executeContinuousIndoorPath = useCallback((roomCode: string) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    isFlyingRef.current = true;
    controls.enabled = false;
    setAnimStage('entering');
    setTelemetryText(`ENTERING MAIN PORTICO → REALISTIC PATH TO ROOM ${roomCode}`);

    const targetCad = getRoomCadastre(roomCode);
    const f = targetCad.floorNumber;
    const centerPoint = new THREE.Vector3(targetCad.centerCloud.x, targetCad.centerCloud.y, targetCad.centerCloud.z);
    const normal = new THREE.Vector3(targetCad.centerCloud.normalX, targetCad.centerCloud.normalY, targetCad.centerCloud.normalZ);

    if (doorVolumeMarkerRef.current) {
      doorVolumeMarkerRef.current.visible = true;
      doorVolumeMarkerRef.current.position.copy(centerPoint);
      if (targetCad.centerCloud.normalX !== 0) {
        doorVolumeMarkerRef.current.rotation.y = Math.PI / 2;
      } else {
        doorVolumeMarkerRef.current.rotation.y = 0;
      }
    }

    const targetElevation = centerPoint.y + 0.15;
    const endLook = new THREE.Vector3(centerPoint.x, targetElevation, centerPoint.z);
    const endPos = endLook.clone().add(normal.clone().multiplyScalar(3.20));

    const floorBaseY = (f - 1) * 4.20;
    const floorEyeY = floorBaseY + 1.65;

    // Ensure 100% unobstructed sightline: hide any railings, balustrades, or columns near this door's sightline
    meshesRef.current.forEach(item => {
      const ln = item.name.toLowerCase();
      if (ln.includes('railing') || ln.includes('balustrade') || ln.includes('column') || ln.includes('pier') || ln.includes('post')) {
        const itemPos = new THREE.Vector3();
        item.mesh.getWorldPosition(itemPos);
        const distToDoor = itemPos.distanceTo(endLook);
        const distToCam = itemPos.distanceTo(endPos);
        if (distToDoor < 4.8 || distToCam < 3.8) {
          item.mesh.visible = false;
        }
      }
    });

    // Build Architectural Path Waypoints (No clipping through solid floors or walls)
    const posPoints: THREE.Vector3[] = [];
    const lookPoints: THREE.Vector3[] = [];

    // WP 0: Front exterior plaza (matches exactly where circular orbit completed: NO CUT!)
    posPoints.push(new THREE.Vector3(3.4, 1.65, 33.0));
    lookPoints.push(new THREE.Vector3(0, 11.45, -0.2));

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
      // Level 1: Ground Atrium Floor
      posPoints.push(new THREE.Vector3(0, 1.8, -12.6));
      if (normal.x < -0.5) {
        // Right Gallery (East wing, e.g. A-119)
        lookPoints.push(new THREE.Vector3(8.27, 1.8, -12.6));

        posPoints.push(new THREE.Vector3(4.8, 1.8, -12.6));
        lookPoints.push(new THREE.Vector3(8.27, 1.8, centerPoint.z));

        posPoints.push(new THREE.Vector3(8.27, 1.8, -12.6));
        lookPoints.push(new THREE.Vector3(8.27, targetElevation, centerPoint.z));

        posPoints.push(new THREE.Vector3(8.27, targetElevation, (centerPoint.z + (-12.6)) * 0.5));
        lookPoints.push(new THREE.Vector3(centerPoint.x, targetElevation, centerPoint.z));
      } else if (normal.x > 0.5) {
        // Left Gallery (West wing)
        lookPoints.push(new THREE.Vector3(-8.27, 1.8, -12.6));

        posPoints.push(new THREE.Vector3(-4.8, 1.8, -12.6));
        lookPoints.push(new THREE.Vector3(-8.27, 1.8, centerPoint.z));

        posPoints.push(new THREE.Vector3(-8.27, 1.8, -12.6));
        lookPoints.push(new THREE.Vector3(-8.27, targetElevation, centerPoint.z));

        posPoints.push(new THREE.Vector3(-8.27, targetElevation, (centerPoint.z + (-12.6)) * 0.5));
        lookPoints.push(new THREE.Vector3(centerPoint.x, targetElevation, centerPoint.z));
      } else {
        // Rear Gallery (North wing)
        lookPoints.push(new THREE.Vector3(0, 1.8, -20.87));

        posPoints.push(new THREE.Vector3(0, 1.8, -16.5));
        lookPoints.push(new THREE.Vector3(centerPoint.x, 1.8, -20.87));

        posPoints.push(new THREE.Vector3(0, 1.8, -20.87));
        lookPoints.push(new THREE.Vector3(centerPoint.x, targetElevation, -24.07));

        posPoints.push(new THREE.Vector3(centerPoint.x * 0.6, targetElevation, -20.87));
        lookPoints.push(new THREE.Vector3(centerPoint.x, targetElevation, -24.07));
      }
    } else {
      // Upper Floors (Floors 2 to 5, e.g. Level 5 Room A-519)
      // Open central atrium light well base
      posPoints.push(new THREE.Vector3(0, 2.4, -12.6));
      lookPoints.push(new THREE.Vector3(0, floorEyeY * 0.6 + 2.0, -12.6));

      // Majestic ascent up through open central atrium void (no solid slabs in the atrium opening!)
      posPoints.push(new THREE.Vector3(0, floorEyeY * 0.55 + 1.2, -12.6));
      lookPoints.push(new THREE.Vector3(0, floorEyeY + 1.0, -12.6));

      // Arrive at target floor level in the atrium void
      posPoints.push(new THREE.Vector3(0, floorEyeY, -12.6));

      if (normal.x < -0.5) {
        // Right Gallery (East wing, e.g. Room A-519)
        lookPoints.push(new THREE.Vector3(8.27, floorEyeY, -12.6));

        posPoints.push(new THREE.Vector3(4.8, floorEyeY, -12.6));
        lookPoints.push(new THREE.Vector3(8.27, floorEyeY, centerPoint.z));

        posPoints.push(new THREE.Vector3(8.27, floorEyeY, -12.6));
        lookPoints.push(new THREE.Vector3(8.27, targetElevation, centerPoint.z));

        posPoints.push(new THREE.Vector3(8.27, targetElevation, (centerPoint.z + (-12.6)) * 0.5));
        lookPoints.push(new THREE.Vector3(centerPoint.x, targetElevation, centerPoint.z));
      } else if (normal.x > 0.5) {
        // Left Gallery (West wing)
        lookPoints.push(new THREE.Vector3(-8.27, floorEyeY, -12.6));

        posPoints.push(new THREE.Vector3(-4.8, floorEyeY, -12.6));
        lookPoints.push(new THREE.Vector3(-8.27, floorEyeY, centerPoint.z));

        posPoints.push(new THREE.Vector3(-8.27, floorEyeY, -12.6));
        lookPoints.push(new THREE.Vector3(-8.27, targetElevation, centerPoint.z));

        posPoints.push(new THREE.Vector3(-8.27, targetElevation, (centerPoint.z + (-12.6)) * 0.5));
        lookPoints.push(new THREE.Vector3(centerPoint.x, targetElevation, centerPoint.z));
      } else {
        // Rear Gallery (North wing)
        lookPoints.push(new THREE.Vector3(0, floorEyeY, -20.87));

        posPoints.push(new THREE.Vector3(0, floorEyeY, -16.5));
        lookPoints.push(new THREE.Vector3(centerPoint.x, floorEyeY, -20.87));

        posPoints.push(new THREE.Vector3(0, floorEyeY, -20.87));
        lookPoints.push(new THREE.Vector3(centerPoint.x, targetElevation, -24.07));

        posPoints.push(new THREE.Vector3(centerPoint.x * 0.6, targetElevation, -20.87));
        lookPoints.push(new THREE.Vector3(centerPoint.x, targetElevation, -24.07));
      }
    }

    // Final door framing waypoint
    posPoints.push(endPos.clone());
    lookPoints.push(endLook.clone());

    const posCurve = new THREE.CatmullRomCurve3(posPoints, false, 'centripetal');
    const lookCurve = new THREE.CatmullRomCurve3(lookPoints, false, 'centripetal');

    const flyStart = performance.now();
    const flyDuration = 6200; // 6.2s continuous, cinematic indoor architectural flight
    const initialFov = camera.fov;
    const targetFov = 52;

    const animateIndoor = (now: number) => {
      const elapsed = Math.max(0, now - flyStart);
      const t = Math.min(Math.max(elapsed / flyDuration, 0), 1);
      // Smooth cubic ease-in-out
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const safeU = Math.min(Math.max(ease, 0.0), 0.99999);

      try {
        const curPos = t >= 1 ? endPos : posCurve.getPoint(safeU);
        const curLook = t >= 1 ? endLook : lookCurve.getPoint(safeU);

        camera.position.copy(curPos);
        camera.lookAt(curLook);
        if (controlsRef.current) {
          controlsRef.current.target.copy(curLook);
        }
        camera.fov = THREE.MathUtils.lerp(initialFov, targetFov, ease);
        camera.updateProjectionMatrix();
      } catch (err) {
        console.warn('Indoor flight interpolation fallback:', err);
        camera.position.lerpVectors(new THREE.Vector3(0, 3.4, 32.0), endPos, ease);
        camera.lookAt(new THREE.Vector3().lerpVectors(new THREE.Vector3(0, 2.4, 4.0), endLook, ease));
      }

      if (t < 1) {
        requestAnimationFrame(animateIndoor);
      } else {
        isFlyingRef.current = false;
        controls.enabled = true;
        controls.target.copy(endLook);
        setAnimStage('at_room');
        setTelemetryText(`TARGET LOCKED: ROOM ${targetCad.roomCode} • VOL: ${targetCad.doorVolume.volumeM3}m³ • CENTER CLOUD: [${targetCad.centerCloud.x}, ${targetCad.centerCloud.y}, ${targetCad.centerCloud.z}]`);

        // Set proximityRoom ONLY for targeted room
        const hw = (mountRef.current?.clientWidth || 800) / 2;
        const hh = (mountRef.current?.clientHeight || 600) / 2;
        const screenVector = centerPoint.clone().project(camera);
        setProximityRoom({
          record: targetCad,
          distance: 3.20,
          screenPos: { x: screenVector.x * hw + hw, y: -screenVector.y * hh + hh }
        });

        // Web Speech API Voice Telemetry
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          try {
            window.speechSynthesis.cancel();
            const floorSpokenMap: Record<number, string> = {
              1: 'Level 1, Ground Floor Atrium Tier',
              2: 'Level 2, Second Floor Gallery',
              3: 'Level 3, Third Floor Gallery',
              4: 'Level 4, Fourth Floor Gallery',
              5: 'Level 5, Fifth Floor Gallery'
            };
            const floorSpoken = floorSpokenMap[targetCad.floorNumber] || `Level ${targetCad.floorNumber}`;
            const speechText = `Room ${targetCad.roomCode.replace('-', ' ')}. ${floorSpoken}. ${targetCad.roomName}. Center of door volume locked at elevation ${targetCad.centerCloud.elevationMsl} meters MSL.`;
            const utterance = new SpeechSynthesisUtterance(speechText);
            utterance.rate = 0.95;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
          } catch (e) {
            console.warn('SpeechSynthesis error:', e);
          }
        }

        if (onArrivedAtRoom) {
          onArrivedAtRoom(targetCad.roomCode);
        }
      }
    };

    requestAnimationFrame(animateIndoor);
  }, [onArrivedAtRoom]);

  // -------------------------------------------------------------------------
  // 4. Smooth Camera Zoom / Navigation to Specific Room Door
  // -------------------------------------------------------------------------
  const zoomToRoom = useCallback((roomCode: string) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    // If camera is outside the front entrance, execute full continuous indoor path!
    if (camera.position.z > 20 || camera.position.distanceTo(new THREE.Vector3(0, 0, -12.6)) > 30) {
      executeContinuousIndoorPath(roomCode);
      return;
    }

    isFlyingRef.current = true;
    controls.enabled = false;

    const cad = getRoomCadastre(roomCode);
    const centerPoint = new THREE.Vector3(cad.centerCloud.x, cad.centerCloud.y, cad.centerCloud.z);
    const normal = new THREE.Vector3(cad.centerCloud.normalX, cad.centerCloud.normalY, cad.centerCloud.normalZ);

    // Update 3D Door Volume Marker & Center Cloud Reticle
    if (doorVolumeMarkerRef.current) {
      doorVolumeMarkerRef.current.visible = true;
      doorVolumeMarkerRef.current.position.copy(centerPoint);
      if (cad.centerCloud.normalX !== 0) {
        doorVolumeMarkerRef.current.rotation.y = Math.PI / 2;
      } else {
        doorVolumeMarkerRef.current.rotation.y = 0;
      }
    }

    const targetElevation = centerPoint.y + 0.15;
    const endLook = new THREE.Vector3(centerPoint.x, targetElevation, centerPoint.z);
    const endPos = endLook.clone().add(normal.clone().multiplyScalar(3.20));

    const startPos = camera.position.clone();
    const startLook = controls.target.clone();

    const startFov = camera.fov;
    const endFov = 52;

    // Ensure 100% unobstructed view
    meshesRef.current.forEach(item => {
      const ln = item.name.toLowerCase();
      if (ln.includes('railing') || ln.includes('balustrade') || ln.includes('column') || ln.includes('pier') || ln.includes('post')) {
        const itemPos = new THREE.Vector3();
        item.mesh.getWorldPosition(itemPos);
        const distToDoor = itemPos.distanceTo(endLook);
        const distToCam = itemPos.distanceTo(endPos);
        if (distToDoor < 4.8 || distToCam < 3.8) {
          item.mesh.visible = false;
        }
      }
    });

    const isDiffFloor = Math.abs(startPos.y - endPos.y) > 2.0;

    if (isDiffFloor) {
      // Architectural multi-floor transit via the open central atrium void (no clipping through floor slabs!)
      const midPoints: THREE.Vector3[] = [
        startPos.clone(),
        new THREE.Vector3(0, startPos.y, -12.6),
        new THREE.Vector3(0, endPos.y, -12.6),
        endPos.clone()
      ];
      const lookPoints: THREE.Vector3[] = [
        startLook.clone(),
        new THREE.Vector3(0, startPos.y, -12.6),
        new THREE.Vector3(endLook.x * 0.5, endLook.y, -12.6),
        endLook.clone()
      ];

      const pCurve = new THREE.CatmullRomCurve3(midPoints, false, 'centripetal');
      const lCurve = new THREE.CatmullRomCurve3(lookPoints, false, 'centripetal');

      const startTime = performance.now();
      const duration = 2800;

      const flyDiff = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        camera.position.copy(pCurve.getPoint(ease));
        camera.lookAt(lCurve.getPoint(ease));
        camera.fov = THREE.MathUtils.lerp(startFov, endFov, ease);
        camera.updateProjectionMatrix();

        if (t < 1) {
          requestAnimationFrame(flyDiff);
        } else {
          finishArrival();
        }
      };
      requestAnimationFrame(flyDiff);
    } else {
      // Same-floor corridor glide
      const startTime = performance.now();
      const duration = 2000;

      const flySame = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        camera.position.lerpVectors(startPos, endPos, ease);
        camera.lookAt(new THREE.Vector3().lerpVectors(startLook, endLook, ease));
        camera.fov = THREE.MathUtils.lerp(startFov, endFov, ease);
        camera.updateProjectionMatrix();

        if (t < 1) {
          requestAnimationFrame(flySame);
        } else {
          finishArrival();
        }
      };
      requestAnimationFrame(flySame);
    }

    const finishArrival = () => {
      isFlyingRef.current = false;
      controls.enabled = true;
      controls.target.copy(endLook);
      setAnimStage('at_room');
      setTelemetryText(`TARGET REACHED: ROOM ${cad.roomCode} • VOL: ${cad.doorVolume.volumeM3}m³ • CENTER CLOUD: [${cad.centerCloud.x}, ${cad.centerCloud.y}, ${cad.centerCloud.z}]`);

      const hw = (mountRef.current?.clientWidth || 800) / 2;
      const hh = (mountRef.current?.clientHeight || 600) / 2;
      const screenVector = centerPoint.clone().project(camera);
      setProximityRoom({
        record: cad,
        distance: 3.20,
        screenPos: { x: screenVector.x * hw + hw, y: -screenVector.y * hh + hh }
      });

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const floorSpokenMap: Record<number, string> = {
            1: 'Level 1, Ground Floor Atrium Tier',
            2: 'Level 2, Second Floor Gallery',
            3: 'Level 3, Third Floor Gallery',
            4: 'Level 4, Fourth Floor Gallery',
            5: 'Level 5, Fifth Floor Gallery'
          };
          const floorSpoken = floorSpokenMap[cad.floorNumber] || `Level ${cad.floorNumber}`;
          const text = `Room ${cad.roomCode.replace('-', ' ')}. ${floorSpoken}. ${cad.roomName}. Center of door volume locked at elevation ${cad.centerCloud.elevationMsl} meters MSL.`;
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.95;
          utterance.pitch = 1.0;
          window.speechSynthesis.speak(utterance);
        } catch (e) {
          console.warn('SpeechSynthesis error:', e);
        }
      }

      if (onArrivedAtRoom) onArrivedAtRoom(cad.roomCode);
    };
  }, [executeContinuousIndoorPath, onArrivedAtRoom]);

  // Expose test helpers for automated headless verification
  useEffect(() => {
    (window as any).__twinViewer = {
      zoomToRoom,
      executeContinuousIndoorPath,
      setCamera: (px: number, py: number, pz: number, tx: number, ty: number, tz: number) => {
        if (cameraRef.current && controlsRef.current) {
          isFlyingRef.current = false;
          controlsRef.current.enabled = true;
          cameraRef.current.position.set(px, py, pz);
          controlsRef.current.target.set(tx, ty, tz);
          cameraRef.current.lookAt(tx, ty, tz);
          controlsRef.current.update();
        }
      },
      getControls: () => controlsRef.current,
      getCamera: () => cameraRef.current,
      getScene: () => sceneRef.current,
      togglePointCloud: (visible?: boolean) => {
        if (floorSegmentationGroupRef.current) {
          const v = visible !== undefined ? visible : !floorSegmentationGroupRef.current.visible;
          floorSegmentationGroupRef.current.visible = v;
          setShowPointCloudSegmentation(v);
        }
      }
    };
  }, [zoomToRoom, executeContinuousIndoorPath]);

  // -------------------------------------------------------------------------
  // 5. Interactive 3D Room Clicking (Raycasting)
  // -------------------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerClick = (e: MouseEvent) => {
      if (!cameraRef.current || !sceneRef.current || isFlyingRef.current) return;
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(sceneRef.current.children, true);

      if (intersects.length > 0) {
        for (const hit of intersects) {
          let curr: THREE.Object3D | null = hit.object;
          let match: RegExpMatchArray | null = null;
          while (curr) {
            match = (curr.name || '').match(/A___?([1-5][0-9]{2})/);
            if (match) break;
            curr = curr.parent;
          }
          if (match) {
            const detectedCode = `A-${match[1]}`;
            zoomToRoom(detectedCode);
            if (onRoomSelect) onRoomSelect(detectedCode);
            break;
          }
        }
      }
    };

    const handleControlsStart = () => {
      // Restore all structural meshes when user freely orbits or zooms out
      meshesRef.current.forEach(item => {
        item.mesh.visible = true;
      });
    };
    const ctrl = controlsRef.current;
    if (ctrl) ctrl.addEventListener('start', handleControlsStart);

    container.addEventListener('click', handlePointerClick);
    return () => {
      container.removeEventListener('click', handlePointerClick);
      if (ctrl) ctrl.removeEventListener('start', handleControlsStart);
    };
  }, [zoomToRoom, onRoomSelect]);

  // -------------------------------------------------------------------------
  // 6. One-Time 14-Second Construction: Front Start -> High-Speed 360 Orbit -> Stop at Front -> Continuous Indoor Path
  // -------------------------------------------------------------------------
  const executeConstructionSequence = useCallback(() => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    controls.enabled = false;
    // Start directly from front at proper camera angle
    camera.position.set(0, 16, 52);
    camera.lookAt(0, 7.5, -6);

    meshesRef.current.forEach(item => { item.mesh.visible = false; });
    if (atriumFloorMeshRef.current) {
      atriumFloorMeshRef.current.visible = false;
      atriumFloorMeshRef.current.scale.set(0.01, 0.01, 0.01);
    }
    // buildingGroundMesh removed
    frontPillarsRef.current.forEach(p => { p.visible = false; });
    pottedPlantsRef.current.forEach(p => { p.visible = false; });
    if (doorVolumeMarkerRef.current) doorVolumeMarkerRef.current.visible = false;
    setProximityRoom(null);

    setAnimStage('empty');
    setBuildPercent(0);
    setTelemetryText('INITIALIZING QUANTUM BIM SYNCHRONIZATION • GROUND CALIBRATION');

    setTimeout(() => {
      setAnimStage('building');
      const startTime = performance.now();
      const constructDuration = 13500;

      const animateBuild = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / constructDuration, 1);
        const percent = Math.round(progress * 100);
        setBuildPercent(percent);

        // Phase 1: Materialize Tiles in Style (0.00 to 0.20)
        if (progress < 0.20) {
          const tileP = progress / 0.20;
          setTelemetryText(`[STAGE 1/5] MATERIALIZING AUTHENTIC ATRIUM TILES IN STYLE: ${percent}%`);
          
          if (atriumFloorMeshRef.current) {
            atriumFloorMeshRef.current.visible = true;
            const scale = Math.min(tileP * 1.08, 1.0);
            atriumFloorMeshRef.current.scale.set(scale, scale, scale);
          }
          // Reveal ground plane together with the floor tiles
          if (groundMeshRef.current) {
            groundMeshRef.current.visible = true;
          }
          if (tileWaveRingRef.current) {
            tileWaveRingRef.current.visible = true;
            const radius = tileP * 16.5;
            tileWaveRingRef.current.scale.set(radius, radius, 1);
            (tileWaveRingRef.current.material as THREE.MeshBasicMaterial).opacity = (1 - tileP) * 0.9;
          }
          if (microPointCloudRef.current) {
            microPointCloudRef.current.points.visible = false;
          }
          if (laserScannerPlaneRef.current) {
            laserScannerPlaneRef.current.visible = false;
          }
        } 
        // Phase 2-4: Micro-Cloud Points building construction (0.20 to 0.85)
        else if (progress < 0.85) {
          if (tileWaveRingRef.current) tileWaveRingRef.current.visible = false;
          if (atriumFloorMeshRef.current) atriumFloorMeshRef.current.scale.set(1, 1, 1);

          const cloudP = (progress - 0.20) / 0.65;
          const scanY = cloudP * 21.0;

          if (cloudP < 0.25) {
            setTelemetryText(`[STAGE 2/5] STACKING FLOOR 1 MICRO-CLOUD POINTS (COLUMNS & BEAMS): ${percent}%`);
          } else if (cloudP < 0.50) {
            setTelemetryText(`[STAGE 3/5] STACKING FLOOR 2 & 3 MICRO-CLOUD POINTS (GALLERIES): ${percent}%`);
          } else if (cloudP < 0.75) {
            setTelemetryText(`[STAGE 4/5] STACKING FLOOR 4 & 5 MICRO-CLOUD POINTS (UPPER TIER): ${percent}%`);
          } else {
            setTelemetryText(`[STAGE 5/5] ASSEMBLING PORTICO PEDIMENT & 45 NUMBERED DOORS: ${percent}%`);
          }

          // Update Laser Scanner Plane
          if (laserScannerPlaneRef.current) {
            laserScannerPlaneRef.current.visible = true;
            laserScannerPlaneRef.current.position.y = scanY;
          }

          // Update Micro Point Cloud: activate points with origY <= scanY
          if (microPointCloudRef.current) {
            const { points, origPositions, pointCount } = microPointCloudRef.current;
            points.visible = true;
            const posAttr = points.geometry.attributes.position as THREE.BufferAttribute;
            const posArray = posAttr.array as Float32Array;

            for (let i = 0; i < pointCount; i++) {
              const idx = i * 3;
              const oy = origPositions[idx + 1];
              if (oy <= scanY) {
                posArray[idx] = origPositions[idx];
                const jitter = Math.abs(oy - scanY) < 1.2 ? (Math.random() - 0.5) * 0.08 : 0;
                posArray[idx + 1] = oy + jitter;
                posArray[idx + 2] = origPositions[idx + 2];
              } else {
                posArray[idx + 1] = -9999;
              }
            }
            posAttr.needsUpdate = true;
          }

          // Meshes solidify behind the rising micro point cloud
          meshesRef.current.forEach(item => {
            const itemThreshold = 0.20 + (item.floor * 0.13) + (item.isDoor ? 0.08 : 0.01);
            if (progress >= itemThreshold) {
              item.mesh.visible = true;
              const localP = Math.min((progress - itemThreshold) / 0.12, 1);
              item.mesh.position.y = item.origY;
              item.mesh.scale.set(1, localP, 1);
            } else {
              item.mesh.visible = false;
            }
          });

          pottedPlantsRef.current.forEach(p => {
            p.visible = progress >= 0.75;
          });
        }
        // Phase 5: Final Crystallization (0.85 to 1.00)
        else {
          setTelemetryText(`[FINAL STAGE] SYNCHRONIZING BIM TELEMETRY & COLOR ACCURACY: ${percent}%`);
          if (laserScannerPlaneRef.current) laserScannerPlaneRef.current.visible = false;
          if (microPointCloudRef.current) {
            const fadeP = (progress - 0.85) / 0.15;
            (microPointCloudRef.current.points.material as THREE.PointsMaterial).opacity = (1 - fadeP) * 0.95;
            if (fadeP >= 1) microPointCloudRef.current.points.visible = false;
          }
          meshesRef.current.forEach(item => {
            item.mesh.visible = true;
            item.mesh.position.y = item.origY;
            item.mesh.scale.set(1, 1, 1);
          });
          pottedPlantsRef.current.forEach(p => { p.visible = true; });
          if (groundMeshRef.current) groundMeshRef.current.visible = true;
          if (atriumFloorMeshRef.current) atriumFloorMeshRef.current.visible = true;
        }

        // Camera Motion: High-speed 360-degree circle orbit during construction, then stop smoothly at front
        if (progress < 0.88) {
          const orbitP = progress / 0.88;
          // Full 360 circle around building center (0, 7.5, -6) starting at front (angle = PI/2)
          const angle = Math.PI / 2 + Math.PI * 2 * orbitP;
          const r = 50 - 4 * Math.sin(Math.PI * orbitP);
          camera.position.x = r * Math.cos(angle);
          camera.position.z = -6 + r * Math.sin(angle);
          camera.position.y = 15 + 4.5 * Math.sin(Math.PI * 2 * orbitP);
          camera.lookAt(0, 5 + 8 * orbitP, -6);
        } else {
          // When construction completes, stop smoothly at the front entrance
          const decelP = (progress - 0.88) / 0.12;
          const smoothP = decelP * decelP * (3 - 2 * decelP); // smoothstep
          const endOrbitPos = new THREE.Vector3(3.4, 6.0, 38.0);
          const frontStopPos = new THREE.Vector3(3.4, 1.65, 33.0);
          const endOrbitLook = new THREE.Vector3(0, 9.0, -2.0);
          const frontStopLook = new THREE.Vector3(0, 11.45, -0.2);
          camera.position.lerpVectors(endOrbitPos, frontStopPos, smoothP);
          camera.lookAt(new THREE.Vector3().lerpVectors(endOrbitLook, frontStopLook, smoothP));
        }

        if (progress < 1) {
          requestAnimationFrame(animateBuild);
        } else {
          if (microPointCloudRef.current) microPointCloudRef.current.points.visible = false;
          if (laserScannerPlaneRef.current) laserScannerPlaneRef.current.visible = false;
          if (tileWaveRingRef.current) tileWaveRingRef.current.visible = false;

          meshesRef.current.forEach(item => {
            item.mesh.visible = true;
            item.mesh.position.y = item.origY;
            item.mesh.scale.set(1, 1, 1);
          });
          if (atriumFloorMeshRef.current) atriumFloorMeshRef.current.visible = true;
          // buildingGroundMesh removed
          frontPillarsRef.current.forEach(p => { p.visible = true; });
          pottedPlantsRef.current.forEach(p => { p.visible = true; });

          setTelemetryText(`CONSTRUCTION 100% COMPLETE • ENTERING MAIN PORTICO`);
          if (onConstructionComplete) onConstructionComplete();

          // CONTINUOUS MASTER JOURNEY: Without frame cut, move inside and navigate realistic path to room
          executeContinuousIndoorPath(targetRoomRef.current);
        }
      };

      requestAnimationFrame(animateBuild);
    }, 1500);
  }, [onConstructionComplete, executeContinuousIndoorPath]);

  // When model is loaded and viewer becomes active, trigger the full 14s construction and room approach
  useEffect(() => {
    if (isActive && isModelLoaded && !hasConstructedRef.current) {
      hasConstructedRef.current = true;
      executeConstructionSequence();
    }
  }, [isActive, isModelLoaded, executeConstructionSequence]);

  // Expose global controller for room zoom, BIM reconstruction replay, or view reset
  useEffect(() => {
    (window as any).__twinViewer = {
      zoomToRoom,
      executeConstructionSequence,
      resetToFrontView: () => {
        if (!cameraRef.current || !controlsRef.current) return;
        cameraRef.current.position.set(3.4, 1.80, 36.5);
        cameraRef.current.lookAt(0.174, 11.20, 1.50);
        controlsRef.current.target.set(0.174, 11.20, 1.50);
        controlsRef.current.update();
        setAnimStage('idle');
      }
    };
  }, [zoomToRoom, executeConstructionSequence]);

  useEffect(() => {
    if (prevTargetRoomRef.current !== targetRoomNumber) {
      prevTargetRoomRef.current = targetRoomNumber;
      if (animStage === 'at_room' || animStage === 'free_orbit') {
        zoomToRoom(targetRoomNumber);
      }
    }
  }, [targetRoomNumber, zoomToRoom, animStage]);

  // -------------------------------------------------------------------------
  // 6. Interactive Shading Modes
  // -------------------------------------------------------------------------
  const applyDisplayMode = useCallback((mode: DisplayMode) => {
    setDisplayMode(mode);
    if (onExplorationModeChange) onExplorationModeChange(mode);

    meshesRef.current.forEach(item => {
      const m = item.mesh;
      if (mode === 'xray') {
        if (item.isExterior) {
          m.material = new THREE.MeshPhysicalMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.18,
            roughness: 0.1,
            transmission: 0.75,
            thickness: 0.4
          });
        } else {
          m.material = item.originalMat;
        }
      } else if (mode === 'wireframe') {
        m.material = new THREE.MeshBasicMaterial({
          color: item.isDoor ? 0x22c55e : (item.isExterior ? 0x0284c7 : 0x64748b),
          wireframe: true
        });
      } else {
        m.material = item.originalMat;
      }
    });
  }, [onExplorationModeChange]);

  const applyFloorFilter = (floorKey: string) => {
    setSelectedFloor(floorKey);
    meshesRef.current.forEach(item => {
      if (floorKey === 'all') {
        item.mesh.visible = true;
      } else {
        const floorNum = parseInt(floorKey, 10);
        item.mesh.visible = item.floor === floorNum;
      }
    });
    const showGround = (floorKey === 'all' || floorKey === '0');
    if (atriumFloorMeshRef.current) atriumFloorMeshRef.current.visible = showGround;
    // buildingGroundMesh removed
    pottedPlantsRef.current.forEach(p => { p.visible = showGround; });

    // Synchronize 3D Point Cloud Floor Segmentation
    if (floorSegmentationGroupRef.current) {
      floorSegmentationGroupRef.current.children.forEach((fGroup) => {
        if (floorKey === 'all') {
          fGroup.visible = true;
        } else {
          // floorKey '0' corresponds to Floor 1 (Ground Tier)
          const targetF = parseInt(floorKey, 10) + 1;
          fGroup.visible = fGroup.name === `floor_seg_${targetF}`;
        }
      });
    }
  };

  const handleManualReplay = () => {
    hasConstructedRef.current = false;
    executeConstructionSequence();
  };

  useEffect(() => {
    if ((window as any).__twinViewer) {
      (window as any).__twinViewer.applyDisplayMode = applyDisplayMode;
      (window as any).__twinViewer.applyFloorFilter = applyFloorFilter;
      (window as any).__twinViewer.handleManualReplay = handleManualReplay;
      (window as any).__twinViewer.togglePointCloud = (visible?: boolean) => {
        if (floorSegmentationGroupRef.current) {
          const v = visible !== undefined ? visible : !floorSegmentationGroupRef.current.visible;
          floorSegmentationGroupRef.current.visible = v;
          setShowPointCloudSegmentation(v);
        }
      };
    }
  }, [applyDisplayMode]);

  return (
    <div 
      ref={mountRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#949aa2',
        overflow: 'hidden'
      }}
    >


      {/* 1. Top Telemetry & Precision GNSS Strip */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '70px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        pointerEvents: 'none',
        zIndex: 20
      }}>
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '8px',
          padding: '7px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 18px rgba(0,0,0,0.3)'
        }}>
          <div style={{
            width: '9px',
            height: '9px',
            borderRadius: '50%',
            backgroundColor: animStage === 'at_room' ? '#22c55e' : '#38bdf8',
            boxShadow: `0 0 10px ${animStage === 'at_room' ? '#22c55e' : '#38bdf8'}`
          }} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc', fontFamily: 'monospace' }}>
            {telemetryText}
          </span>
        </div>

        {animStage === 'building' && (
          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '6px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#38bdf8',
            fontSize: '12px',
            fontFamily: 'monospace',
            fontWeight: 700
          }}>
            <span>15s QUANTUM BUILD:</span>
            <div style={{ width: '100px', height: '6px', backgroundColor: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${buildPercent}%`, height: '100%', backgroundColor: '#38bdf8', transition: 'width 0.1s linear' }} />
            </div>
            <span>{buildPercent}%</span>
          </div>
        )}
      </div>

      {/* 2. Detail Mark ON DOOR MID (Center of the Door Leaf, NOT Above/Upside!) */}
      {proximityRoom && (
        <div style={{
          position: 'absolute',
          left: `${proximityRoom.screenPos.x}px`,
          top: `${proximityRoom.screenPos.y}px`,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 35,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeInScale 0.25s ease-out'
        }}>
          {/* Glowing Crosshair ring */}
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            border: '2.5px solid #00eeff',
            backgroundColor: 'rgba(0,238,255,0.12)',
            boxShadow: '0 0 18px #00eeff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'pulseRing 1.6s ease-in-out infinite'
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00eeff', boxShadow: '0 0 8px #00eeff' }} />
          </div>

          {/* Connector pip */}
          <div style={{ width: '2px', height: '8px', backgroundColor: '#00eeff', opacity: 0.7, borderRadius: '1px' }} />

          {/* High-Contrast Info Panel */}
          <div style={{
            backgroundColor: 'rgba(5, 10, 22, 0.97)',
            backdropFilter: 'blur(14px)',
            border: '1.5px solid #00eeff',
            borderRadius: '10px',
            padding: '9px 15px',
            boxShadow: '0 0 24px rgba(0,238,255,0.35), 0 6px 24px rgba(0,0,0,0.8)',
            color: '#ffffff',
            textAlign: 'center',
            whiteSpace: 'nowrap'
          }}>
            {/* Room number — large and unmissable */}
            <div style={{ fontSize: '15px', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '0.08em', textShadow: '0 0 10px rgba(0,238,255,0.6)' }}>
              ROOM <span style={{ color: '#00eeff' }}>{proximityRoom.record.roomCode}</span>
            </div>
            {/* Badges row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '5px' }}>
              <span style={{ fontSize: '10px', backgroundColor: 'rgba(0,238,255,0.15)', color: '#00eeff', padding: '2px 7px', borderRadius: '4px', fontWeight: 700, fontFamily: 'monospace', border: '1px solid rgba(0,238,255,0.4)' }}>
                VOL: {proximityRoom.record.doorVolume.volumeM3} m³
              </span>
              <span style={{ fontSize: '10px', backgroundColor: 'rgba(52,211,153,0.15)', color: '#34d399', padding: '2px 7px', borderRadius: '4px', fontWeight: 700, fontFamily: 'monospace', border: '1px solid rgba(52,211,153,0.4)' }}>
                F{proximityRoom.record.floorNumber}
              </span>
            </div>
            {/* Coords */}
            <div style={{ fontSize: '9px', color: '#94d8e8', fontFamily: 'monospace', marginTop: '4px', opacity: 0.85 }}>
              [{proximityRoom.record.centerCloud.x}, {proximityRoom.record.centerCloud.y}, {proximityRoom.record.centerCloud.z}]
            </div>
            <div style={{ fontSize: '8.5px', color: '#64748b', marginTop: '2px', fontFamily: 'monospace' }}>
              {proximityRoom.record.centerCloud.elevationMsl}m MSL
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1);    }
        }
        @keyframes pulseRing {
          0%, 100% { box-shadow: 0 0 10px #00eeff; }
          50%       { box-shadow: 0 0 28px #00eeff, 0 0 10px #00eeff inset; }
        }
      `}</style>
    </div>
  );
};
