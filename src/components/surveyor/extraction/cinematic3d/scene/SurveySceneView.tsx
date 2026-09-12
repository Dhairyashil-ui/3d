import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
    OrbitControls,
    PerspectiveCamera,
    Grid,
    Stars
} from "@react-three/drei";
import {
    EffectComposer,
    Bloom,
    Vignette
} from "@react-three/postprocessing";
import * as THREE from "three";

import CinematicCameraController from "../cinematic/CinematicCameraController";
import { useTimeline } from "../cinematic/cinematicTimeline";
import BuildingModel, { BuildingOptions } from "./BuildingModel";
import PointCloudLayer from "./PointCloudLayer";
import DronePlatform from "./DronePlatform";
import AcquisitionSystem, { useSurveyImages } from "./AcquisitionSystem";
import SurveyEffectsLayer from "./SurveyEffectsLayer";
import MeasurementOverlays from "./MeasurementOverlays";

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
    return (
        <group position={position} scale={scale}>
            <mesh castShadow position={[0, 2, 0]}>
                <cylinderGeometry args={[0.15, 0.24, 4, 8]} />
                <meshStandardMaterial color="#44493d" />
            </mesh>

            {[
                [0, 5.2, 0, 2.2],
                [-0.8, 4.2, 0.6, 1.65],
                [0.7, 4.1, -0.5, 1.8]
            ].map(([x, y, z, radius], index) => (
                <mesh key={index} castShadow position={[x, y, z]}>
                    <icosahedronGeometry args={[radius, 2]} />
                    <meshStandardMaterial
                        color={index % 2 ? "#3d5347" : "#465d4f"}
                        roughness={1}
                    />
                </mesh>
            ))}
        </group>
    );
}

function Environment() {
    const treePositions: [number, number, number][] = Array.from({ length: 28 }, (_, index) => {
        const side = index % 2 ? -1 : 1;

        return [
            side * (23 + (index % 4) * 4.3),
            0,
            -40 + Math.floor(index / 2) * 6.5
        ];
    });

    return (
        <group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.35, 0]} receiveShadow>
                <planeGeometry args={[500, 500]} />
                <meshStandardMaterial color="#273c37" roughness={1} />
            </mesh>

            <Grid
                position={[0, -0.32, 0]}
                args={[300, 300]}
                cellSize={5}
                cellThickness={0.3}
                cellColor="#3e504c"
                sectionSize={25}
                sectionThickness={0.6}
                sectionColor="#52635b"
                fadeDistance={130}
                fadeStrength={2}
                infiniteGrid
            />

            {[-31, 31].map((z) => (
                <group key={z}>
                    <mesh
                        rotation={[-Math.PI / 2, 0, 0]}
                        position={[0, -0.28, z]}
                        receiveShadow
                    >
                        <planeGeometry args={[220, 8]} />
                        <meshStandardMaterial color="#303b3d" roughness={0.98} />
                    </mesh>

                    {Array.from({ length: 28 }, (_, index) => (
                        <mesh
                            key={index}
                            rotation={[-Math.PI / 2, 0, 0]}
                            position={[-100 + index * 7.5, -0.265, z]}
                        >
                            <planeGeometry args={[3, 0.09]} />
                            <meshBasicMaterial color="#87918a" transparent opacity={0.4} />
                        </mesh>
                    ))}
                </group>
            ))}

            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -0.26, 21]}
                receiveShadow
            >
                <planeGeometry args={[7, 17]} />
                <meshStandardMaterial color="#777f74" roughness={0.95} />
            </mesh>

            {treePositions.map((position, index) => (
                <Tree
                    key={index}
                    position={position}
                    scale={0.75 + (index % 4) * 0.15}
                />
            ))}

            {Array.from({ length: 14 }, (_, index) => {
                const x = -85 + (index % 7) * 27;
                const z = index < 7 ? -65 : 65;
                const height = 5 + (index % 4) * 3;

                return (
                    <group key={index} position={[x, 0, z]}>
                        <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
                            <boxGeometry args={[15 + (index % 3) * 3, height, 15]} />
                            <meshStandardMaterial color="#66726b" roughness={0.94} />
                        </mesh>

                        <mesh position={[0, height + 0.15, 0]}>
                            <boxGeometry args={[16 + (index % 3) * 3, 0.3, 16]} />
                            <meshStandardMaterial color="#747e73" roughness={0.95} />
                        </mesh>
                    </group>
                );
            })}
        </group>
    );
}

interface WorldProps {
    options: BuildingOptions;
    onSelect: (instanceId: number) => void;
}

function World({ options, onSelect }: WorldProps) {
    const { camera: cameraMode } = useTimeline();
    const images = useSurveyImages();

    return (
        <>
            <color attach="background" args={["#101b24"]} />
            <fogExp2 attach="fog" args={["#111e27", 0.007]} />

            <PerspectiveCamera
                makeDefault
                position={[105, 68, 100]}
                fov={43}
                near={0.08}
                far={650}
            />

            <hemisphereLight args={["#a9c9dc", "#364a3c", 1.5]} />
            <ambientLight intensity={0.18} />

            <directionalLight
                position={[-35, 65, 30]}
                color="#fff0d7"
                intensity={3.4}
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-left={-70}
                shadow-camera-right={70}
                shadow-camera-top={70}
                shadow-camera-bottom={-70}
                shadow-camera-near={1}
                shadow-camera-far={180}
                shadow-normalBias={0.04}
            />

            <directionalLight
                position={[25, 20, -35]}
                color="#90b8d1"
                intensity={0.85}
            />

            <Stars
                radius={250}
                depth={80}
                count={700}
                factor={1.2}
                saturation={0}
                fade
                speed={0}
            />

            <Environment />

            <BuildingModel images={images} options={options} onSelect={onSelect} />

            <PointCloudLayer source="lidar" options={options} onSelect={onSelect} />
            <PointCloudLayer source="photo" options={options} onSelect={onSelect} />

            <DronePlatform />
            <AcquisitionSystem images={images} />
            <SurveyEffectsLayer />
            <MeasurementOverlays options={options} />

            <CinematicCameraController />

            {cameraMode === "free" && (
                <OrbitControls
                    makeDefault
                    target={[0, 4, 0]}
                    enableDamping
                    dampingFactor={0.06}
                    minDistance={1.2}
                    maxDistance={160}
                    maxPolarAngle={Math.PI * 0.49}
                    panSpeed={0.55}
                    rotateSpeed={0.45}
                    zoomSpeed={0.6}
                />
            )}

            <EffectComposer multisampling={0}>
                <Bloom
                    intensity={0.22}
                    luminanceThreshold={0.9}
                    luminanceSmoothing={0.35}
                    mipmapBlur
                />
                <Vignette eskil={false} offset={0.18} darkness={0.65} />
            </EffectComposer>
        </>
    );
}

interface SurveySceneViewProps {
    options: BuildingOptions;
    onSelect: (instanceId: number) => void;
}

export default function SurveySceneView(props: SurveySceneViewProps) {
    return (
        <Canvas
            shadows
            dpr={[1, 1.6]}
            gl={{
                antialias: true,
                alpha: false,
                powerPreference: "high-performance",
                toneMapping: THREE.ACESFilmicToneMapping,
                toneMappingExposure: 1.05
            }}
            raycaster={{ params: { Points: { threshold: 0.14 } } as unknown as THREE.RaycasterParameters }}
        >
            <Suspense fallback={null}>
                <World {...props} />
            </Suspense>
        </Canvas>
    );
}
