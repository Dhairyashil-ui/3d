import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Building2, 
  Layers, 
  Maximize2, 
  RotateCcw, 
  Ruler, 
  ShieldCheck, 
  Info, 
  Sparkles, 
  Eye, 
  Compass, 
  MapPin, 
  Box, 
  CheckCircle2, 
  Download,
  FileCheck
} from 'lucide-react';
import { INSPECTABLE_OBJECTS, InspectableObject, CURRENT_ASSIGNED_UNIT } from './extractionData';

interface InteractiveBuildingInspectionViewProps {
  onReplayPipeline: () => void;
}

export const InteractiveBuildingInspectionView: React.FC<InteractiveBuildingInspectionViewProps> = ({
  onReplayPipeline
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedObjectId, setSelectedObjectId] = useState<string>('DOOR-127');
  const [displayMode, setDisplayMode] = useState<'realistic' | 'point_cloud' | 'xray'>('realistic');
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showBoundingBox, setShowBoundingBox] = useState<boolean>(true);

  const selectedObject: InspectableObject = INSPECTABLE_OBJECTS.find(o => o.id === selectedObjectId) || INSPECTABLE_OBJECTS[0];

  // Three.js scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const boundingBoxGroupRef = useRef<THREE.Group | null>(null);
  const buildingMeshGroupRef = useRef<THREE.Group | null>(null);
  const pointCloudGroupRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0f1d);

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 580;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(24, 14, 28);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    mountRef.current.replaceChildren(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // don't go below ground
    controls.target.set(0, 6, 0);

    // 5. Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1e293b, 0.8);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(25, 40, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    const cyanRim = new THREE.DirectionalLight(0x06b6d4, 0.8);
    cyanRim.position.set(-25, 10, -20);
    scene.add(cyanRim);

    // 6. Ground Grid & Terrestrial Footprint
    const grid = new THREE.GridHelper(60, 60, 0x2563eb, 0x1e293b);
    grid.position.y = -0.01;
    scene.add(grid);

    // 7. Procedural PCCRC Building Model Structure
    const buildingGroup = new THREE.Group();
    buildingMeshGroupRef.current = buildingGroup;

    // Main Building Envelope (5 Floors)
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.4,
      metalness: 0.2
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transmission: 0.7,
      opacity: 0.8,
      transparent: true,
      roughness: 0.1,
      ior: 1.5
    });

    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.8
    });

    // Main facade blocks
    const mainBody = new THREE.Mesh(new THREE.BoxGeometry(32, 18, 22), buildingMat);
    mainBody.position.set(0, 9, 0);
    buildingGroup.add(mainBody);

    // Floor slab dividers
    for (let f = 1; f <= 4; f++) {
      const slab = new THREE.Mesh(new THREE.BoxGeometry(32.4, 0.4, 22.4), concreteMat);
      slab.position.set(0, f * 3.6, 0);
      buildingGroup.add(slab);
    }

    // Windows band on front facade
    for (let f = 1; f <= 4; f++) {
      for (let w = -4; w <= 4; w++) {
        if (w === 0 && f === 1) continue; // Entrance door space
        const win = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 0.2), glassMat);
        win.position.set(w * 3.2, f * 3.6 + 1.8, 11.05);
        buildingGroup.add(win);
      }
    }

    // Entrance Portico / Door A-119 / Door #127 Area
    const entranceFrame = new THREE.Mesh(new THREE.BoxGeometry(4.2, 3.2, 1.5), concreteMat);
    entranceFrame.position.set(0, 1.6, 11.5);
    buildingGroup.add(entranceFrame);

    // Beech Door #127
    const doorMat = new THREE.MeshStandardMaterial({
      color: 0xb45309, // Beech timber
      roughness: 0.6
    });
    const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(1.80, 2.44, 0.14), doorMat);
    doorMesh.position.set(0, 1.22, 11.75);
    doorMesh.name = 'DOOR-127-MESH';
    buildingGroup.add(doorMesh);

    // Roof parapet
    const parapet = new THREE.Mesh(new THREE.BoxGeometry(32.4, 1.2, 22.4), concreteMat);
    parapet.position.set(0, 18.6, 0);
    buildingGroup.add(parapet);

    scene.add(buildingGroup);

    // 8. Dense LiDAR Point Cloud Mesh (15,000 visual sample points)
    const ptsCount = 12000;
    const ptsPositions = new Float32Array(ptsCount * 3);
    const ptsColors = new Float32Array(ptsCount * 3);

    for (let i = 0; i < ptsCount; i++) {
      // Points distributed on the building shell
      const u = Math.random();
      let px = (Math.random() - 0.5) * 32;
      let py = Math.random() * 18.6;
      let pz = (Math.random() - 0.5) * 22;

      // Snap to walls
      if (u < 0.4) pz = 11 + (Math.random() - 0.5) * 0.3; // Front facade
      else if (u < 0.6) px = 16 * (Math.random() > 0.5 ? 1 : -1); // Side walls
      else if (u < 0.8) py = 18.6 + (Math.random() - 0.5) * 0.2; // Roof

      ptsPositions[i * 3] = px;
      ptsPositions[i * 3 + 1] = py;
      ptsPositions[i * 3 + 2] = pz;

      // Natural LiDAR elevation gradient (cyan to emerald)
      const normY = py / 18.6;
      ptsColors[i * 3] = 0.1 + normY * 0.2;
      ptsColors[i * 3 + 1] = 0.6 + normY * 0.4;
      ptsColors[i * 3 + 2] = 0.9 - normY * 0.4;
    }

    const ptsGeo = new THREE.BufferGeometry();
    ptsGeo.setAttribute('position', new THREE.BufferAttribute(ptsPositions, 3));
    ptsGeo.setAttribute('color', new THREE.BufferAttribute(ptsColors, 3));

    const ptsMat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    const pointCloud = new THREE.Points(ptsGeo, ptsMat);
    pointCloud.visible = false;
    pointCloudGroupRef.current = pointCloud;
    scene.add(pointCloud);

    // 9. Bounding Box & Measurement Callout Overlay Group
    const bboxGroup = new THREE.Group();
    boundingBoxGroupRef.current = bboxGroup;
    scene.add(bboxGroup);

    // 10. Animation render loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 11. Window resize listener
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 580;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, []);

  // Update Display Mode (Realistic / Point Cloud / X-Ray)
  useEffect(() => {
    if (!buildingMeshGroupRef.current || !pointCloudGroupRef.current) return;

    if (displayMode === 'realistic') {
      buildingMeshGroupRef.current.visible = true;
      pointCloudGroupRef.current.visible = false;
      buildingMeshGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.wireframe = false;
          child.material.opacity = 1.0;
          child.material.transparent = false;
        }
      });
    } else if (displayMode === 'point_cloud') {
      buildingMeshGroupRef.current.visible = false;
      pointCloudGroupRef.current.visible = true;
    } else if (displayMode === 'xray') {
      buildingMeshGroupRef.current.visible = true;
      pointCloudGroupRef.current.visible = true;
      buildingMeshGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.wireframe = true;
          child.material.opacity = 0.35;
          child.material.transparent = true;
        }
      });
    }
  }, [displayMode]);

  // Update 3D Bounding Box & Geometric Measurement Lines when Selected Object changes
  useEffect(() => {
    if (!boundingBoxGroupRef.current) return;
    const group = boundingBoxGroupRef.current;
    group.clear();

    if (!showBoundingBox) return;

    // Position coordinates mapping for inspectable objects
    let posX = 0;
    let posY = 1.22;
    let posZ = 11.75;
    let sizeW = selectedObject.widthM;
    let sizeH = selectedObject.heightM;
    let sizeD = selectedObject.depthM;

    if (selectedObject.semanticClass === 'DOOR') {
      posX = 0;
      posY = 1.22;
      posZ = 11.75;
      sizeW = 1.80; // Total door aperture frame
    } else if (selectedObject.semanticClass === 'WINDOW') {
      posX = 3.2;
      posY = 5.4;
      posZ = 11.05;
    } else if (selectedObject.semanticClass === 'AC') {
      posX = -6.4;
      posY = 6.8;
      posZ = 11.25;
    } else if (selectedObject.semanticClass === 'WALL') {
      posX = 0;
      posY = 9.0;
      posZ = 11.0;
    } else if (selectedObject.semanticClass === 'ROOF') {
      posX = 0;
      posY = 18.6;
      posZ = 0;
    }

    // 1. Glowing 3D Wireframe Box
    const boxGeo = new THREE.BoxGeometry(sizeW, sizeH, sizeD);
    const wireframeGeo = new THREE.EdgesGeometry(boxGeo);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      linewidth: 3,
      transparent: true,
      opacity: 0.95
    });
    const wireframeMesh = new THREE.LineSegments(wireframeGeo, wireframeMat);
    wireframeMesh.position.set(posX, posY, posZ);
    group.add(wireframeMesh);

    // 2. Translucent Highlight Fill
    const fillMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide
    });
    const fillMesh = new THREE.Mesh(boxGeo, fillMat);
    fillMesh.position.set(posX, posY, posZ);
    group.add(fillMesh);

    // 3. 3D Measurement Dimension Lines (Req #37)
    if (showDimensions) {
      // Vertical Height Dimension Line
      const heightLineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(posX - sizeW / 2 - 0.4, posY - sizeH / 2, posZ),
        new THREE.Vector3(posX - sizeW / 2 - 0.4, posY + sizeH / 2, posZ)
      ]);
      const dimLineMat = new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 2 });
      const heightLine = new THREE.Line(heightLineGeo, dimLineMat);
      group.add(heightLine);

      // Width Dimension Line
      const widthLineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(posX - sizeW / 2, posY - sizeH / 2 - 0.4, posZ),
        new THREE.Vector3(posX + sizeW / 2, posY - sizeH / 2 - 0.4, posZ)
      ]);
      const widthLine = new THREE.Line(widthLineGeo, dimLineMat);
      group.add(widthLine);
    }

    // Smoothly pan camera target toward selected object
    if (controlsRef.current && cameraRef.current) {
      const targetPos = new THREE.Vector3(posX, posY, posZ);
      controlsRef.current.target.lerp(targetPos, 0.8);
    }
  }, [selectedObjectId, showBoundingBox, showDimensions, selectedObject]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Banner Notice */}
      <div style={{
        backgroundColor: '#f0fdf4',
        border: '1.5px solid #86efac',
        borderRadius: '10px',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            backgroundColor: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#166534' }}>
              RECONSTRUCTION COMPLETED — 3D PPCRC BUILDING ACTIVE
            </div>
            <div style={{ fontSize: '12px', color: '#15803d' }}>
              Georeferenced model derived from Aerial LiDAR returns & photogrammetry exposures. Select any object to view measured dimensions and point cloud bounds.
            </div>
          </div>
        </div>

        <button
          onClick={onReplayPipeline}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #86efac',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '12.5px',
            fontWeight: 700,
            color: '#15803d',
            cursor: 'pointer'
          }}
        >
          <RotateCcw size={14} />
          <span>Replay Construction Pipeline</span>
        </button>
      </div>

      {/* Main 3D Canvas + Object Inspection Panel Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: '18px',
        height: '620px'
      }}>
        {/* Left: Interactive 3D Canvas */}
        <div style={{
          position: 'relative',
          borderRadius: '10px',
          overflow: 'hidden',
          backgroundColor: '#0a0f1d',
          border: '1px solid #1e293b',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {/* Three.js Container */}
          <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

          {/* Floating Canvas Top Overlay Controls */}
          <div style={{
            position: 'absolute',
            top: '14px',
            left: '14px',
            display: 'flex',
            gap: '8px',
            zIndex: 10
          }}>
            {/* Display Mode Switcher */}
            <div style={{
              backgroundColor: 'rgba(15, 23, 42, 0.88)',
              backdropFilter: 'blur(8px)',
              borderRadius: '8px',
              border: '1px solid #334155',
              padding: '4px',
              display: 'flex',
              gap: '4px'
            }}>
              {[
                { id: 'realistic', label: 'Realistic 3D' },
                { id: 'point_cloud', label: 'LiDAR Cloud' },
                { id: 'xray', label: 'BIM Wireframe' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setDisplayMode(m.id as any)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '5px',
                    fontSize: '11px',
                    fontWeight: 700,
                    border: 'none',
                    backgroundColor: displayMode === m.id ? '#2563eb' : 'transparent',
                    color: displayMode === m.id ? '#ffffff' : '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Dimension Line Toggles */}
            <button
              onClick={() => setShowDimensions(!showDimensions)}
              style={{
                backgroundColor: showDimensions ? '#1e3a8a' : 'rgba(15, 23, 42, 0.88)',
                backdropFilter: 'blur(8px)',
                borderRadius: '8px',
                border: '1px solid #334155',
                color: showDimensions ? '#93c5fd' : '#94a3b8',
                padding: '5px 12px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Ruler size={13} />
              <span>Dimension Lines</span>
            </button>
          </div>

          {/* Floating Bottom Navigation Hint */}
          <div style={{
            position: 'absolute',
            bottom: '14px',
            left: '14px',
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(6px)',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '11px',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Compass size={13} color="#38bdf8" />
            <span>Left-click: Rotate • Right-click: Pan • Scroll: Zoom • Click Object to Inspect</span>
          </div>
        </div>

        {/* Right: Object Inspection & Geometry HUD (Req #36, #37) */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
        }}>
          {/* Object Selector Header */}
          <div style={{
            padding: '14px 18px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            borderBottom: '1px solid #1e293b'
          }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>
              RECONSTRUCTED OBJECT INSPECTOR
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
              {selectedObject.name}
            </div>
          </div>

          {/* Quick Object Selection Chips */}
          <div style={{
            padding: '10px 14px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto'
          }}>
            {INSPECTABLE_OBJECTS.map(obj => (
              <button
                key={obj.id}
                onClick={() => setSelectedObjectId(obj.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '14px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: '1px solid #cbd5e1',
                  backgroundColor: selectedObjectId === obj.id ? '#1d4ed8' : '#ffffff',
                  color: selectedObjectId === obj.id ? '#ffffff' : '#334155',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {obj.semanticClass} #{obj.instanceNumber}
              </button>
            ))}
          </div>

          {/* Detailed Metric Inspection Body */}
          <div style={{ padding: '16px 18px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Visual Measurement Diagram Box (Req #37) */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1.5px solid #cbd5e1',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
                TRUE XYZ RECONSTRUCTED GEOMETRY
              </div>
              <div style={{
                fontFamily: 'monospace',
                fontSize: '13px',
                color: '#1e293b',
                marginTop: '6px',
                backgroundColor: '#ffffff',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                lineHeight: '1.4'
              }}>
                <div style={{ color: '#d97706', fontWeight: 700 }}>{selectedObject.heightM} m ↕ (Height)</div>
                <div style={{ color: '#0284c7', fontWeight: 700 }}>┌────────────────┐</div>
                <div style={{ color: '#0284c7', fontWeight: 700 }}>│  {selectedObject.semanticClass} #{selectedObject.instanceNumber}  │</div>
                <div style={{ color: '#0284c7', fontWeight: 700 }}>└────────────────┘</div>
                <div style={{ color: '#16a34a', fontWeight: 700 }}>← {selectedObject.widthM} m → (Width)</div>
              </div>
              <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '4px' }}>
                Wall Recess Depth: <b>{selectedObject.depthM} m</b> • Surface Area: <b>{selectedObject.areaSqm} m²</b>
              </div>
            </div>

            {/* Spatial & Physical Attributes Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ backgroundColor: '#f1f5f9', padding: '8px 10px', borderRadius: '6px' }}>
                <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Classification</div>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1e293b' }}>{selectedObject.semanticClass}</div>
              </div>
              <div style={{ backgroundColor: '#f1f5f9', padding: '8px 10px', borderRadius: '6px' }}>
                <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Confidence</div>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#15803d' }}>{selectedObject.confidencePct}% Match</div>
              </div>
              <div style={{ backgroundColor: '#f1f5f9', padding: '8px 10px', borderRadius: '6px' }}>
                <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Point Returns</div>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0369a1' }}>{selectedObject.pointCount.toLocaleString()} Pts</div>
              </div>
              <div style={{ backgroundColor: '#f1f5f9', padding: '8px 10px', borderRadius: '6px' }}>
                <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Elevation MSL</div>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1e293b' }}>{selectedObject.worldCoordinates.elevationMsl} m</div>
              </div>
            </div>

            {/* Contextual BIM Object Graph Linkage */}
            <div style={{ backgroundColor: '#eff6ff', padding: '10px 12px', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: '10.5px', color: '#1e40af', fontWeight: 700, textTransform: 'uppercase' }}>
                BIM Object Graph Relationship
              </div>
              <div style={{ fontSize: '12px', color: '#1e3a8a', marginTop: '3px' }}>
                {selectedObject.parentRelationship}
              </div>
            </div>

            {/* Verification Notes */}
            <div style={{ fontSize: '11.5px', color: '#475569', lineHeight: '1.4' }}>
              <b>Technical Verification:</b> {selectedObject.verificationNotes}
            </div>

            <div style={{ fontSize: '10.5px', color: '#94a3b8' }}>
              Source: {selectedObject.sourceAttribution}
            </div>
          </div>

          {/* Footer Deliverable Button */}
          <div style={{
            padding: '12px 18px',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Cadastre: <b>{selectedObject.cadastreCode}</b></span>
            <button
              onClick={() => alert(`Exporting 3D BIM Measurement Certificate for ${selectedObject.name} (ULPIN: 27250401420089)...`)}
              style={{
                backgroundColor: '#1e293b',
                color: '#ffffff',
                border: 'none',
                borderRadius: '5px',
                padding: '6px 12px',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Download size={12} />
              <span>Export Cert</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
