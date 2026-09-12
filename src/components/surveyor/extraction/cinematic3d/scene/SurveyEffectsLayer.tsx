import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import {
    dronePosition,
    gcpData,
    trajectory,
    engineeringCoordinates
} from "../data/surveyData";
import {
    normalSegments,
    registrationRMSE,
    measureObject
} from "../processing/surveyProcessor";
import {
    transport,
    stageAt,
    useTimeline
} from "../cinematic/cinematicTimeline";

const laserTargets = [
    [7, 8, 7.2],
    [-5, 10.34, 0],
    [3.8, 5.12, 7.18],
    [-1.1, 1.05, 7.34],
    [18, 0.03, 9],
    [-23, 6.5, -12],
    [11, 10.34, 4],
    [-10, 3.2, 7.2]
];

interface PulseProps {
    index: number;
    single: boolean;
}

function Pulse({ index, single }: PulseProps) {
    const outgoing = useRef<THREE.Mesh>(null!);
    const returning = useRef<THREE.Mesh>(null!);
    const ray = useRef<THREE.Line>(null!);
    const hit = useRef<THREE.Mesh>(null!);

    const array = useMemo(() => new Float32Array(6), []);

    useFrame(() => {
        if (!outgoing.current || !returning.current || !ray.current || !hit.current) return;
        const time = transport.read().time;
        const stage = stageAt(time);

        const origin = dronePosition(time);
        origin.y -= 0.52;

        const targetCoords = laserTargets[single ? 0 : index % laserTargets.length];
        const target = new THREE.Vector3(targetCoords[0], targetCoords[1], targetCoords[2]);

        const cycle = ((time - stage.start + index * 0.83) % 8) / 8;

        const outbound = Math.min(1, cycle / 0.42);
        const inbound = Math.max(0, Math.min(1, (cycle - 0.54) / 0.42));

        outgoing.current.position.copy(origin).lerp(target, outbound);
        returning.current.position.copy(target).lerp(origin, inbound);

        outgoing.current.visible = cycle <= 0.54;
        returning.current.visible = cycle >= 0.54 && cycle <= 0.96;

        hit.current.position.copy(target);
        hit.current.scale.setScalar(0.8 + Math.sin(time * 5) * 0.1);
        hit.current.visible = cycle >= 0.42;

        const attribute = ray.current.geometry.attributes.position as THREE.BufferAttribute;

        attribute.setXYZ(0, origin.x, origin.y, origin.z);
        attribute.setXYZ(1, target.x, target.y, target.z);
        attribute.needsUpdate = true;

        ray.current.geometry.computeBoundingSphere();
    });

    return (
        <group>
            <primitive object={new THREE.Line(
                new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(array, 3)),
                new THREE.LineBasicMaterial({ color: 0x83c6b5, transparent: true, opacity: 0.15, depthWrite: false })
            )} ref={ray} />

            <mesh ref={outgoing}>
                <sphereGeometry args={[single ? 0.105 : 0.07, 12, 12]} />
                <meshBasicMaterial color="#c8ffe8" />
            </mesh>

            <mesh ref={returning}>
                <sphereGeometry args={[single ? 0.1 : 0.065, 12, 12]} />
                <meshBasicMaterial color="#e7bc81" />
            </mesh>

            <mesh ref={hit}>
                <sphereGeometry args={[0.09, 12, 12]} />
                <meshBasicMaterial color="#d6fff2" />
            </mesh>
        </group>
    );
}

function LaserExperiment() {
    const { stage, time } = useTimeline();
    const single = ["tof", "xyz", "sync"].includes(stage.id);

    if (!["tof", "xyz", "sync", "lidar"].includes(stage.id)) return null;

    const cycle = ((time - stage.start) % 8) / 8;
    const label =
        cycle < 0.42
            ? "LASER OUT"
            : cycle < 0.54
                ? "SURFACE RETURN"
                : cycle < 0.96
                    ? "RETURN TO SENSOR"
                    : "ROUND-TRIP TIME";

    const drone = dronePosition(time);
    const target = new THREE.Vector3(laserTargets[0][0], laserTargets[0][1], laserTargets[0][2]);
    const range = drone.clone().add(new THREE.Vector3(0, -0.52, 0)).distanceTo(target);
    const nanoseconds = (2 * range / 299792458) * 1e9;

    return (
        <group>
            {Array.from({ length: single ? 1 : 8 }, (_, index) => (
                <Pulse key={index} index={index} single={single} />
            ))}

            {stage.id === "tof" && (
                <Html position={target.clone().add(new THREE.Vector3(0, 1.8, 0))}>
                    <div className="world-label">
                        <span>{label}</span>
                        <strong>Δt {nanoseconds.toFixed(2)} ns</strong>
                        <small>RANGE {range.toFixed(3)} m</small>
                        <small>DISTANCE = c × Δt / 2</small>
                        <small>Propagation slowed for visibility</small>
                    </div>
                </Html>
            )}

            {stage.id === "xyz" && (
                <group position={drone}>
                    <Line
                        points={[[0, -0.52, 0], [0, -2.7, 0], [2.2, -2.7, 0]]}
                        color="#dcbb88"
                        lineWidth={1}
                    />

                    <Html position={[1.8, -2.8, 0]}>
                        <div className="world-label">
                            <span>SPHERICAL → CARTESIAN</span>
                            <small>x = r cos ε cos α</small>
                            <small>y = r sin ε</small>
                            <small>z = r cos ε sin α</small>
                            <strong>LOCAL 3D POINT</strong>
                        </div>
                    </Html>
                </group>
            )}
        </group>
    );
}

function Trajectory() {
    const { stage, time } = useTimeline();

    if (!["trajectory", "sync", "geo"].includes(stage.id)) return null;

    const count = Math.max(
        2,
        Math.floor(
            trajectory.length *
            (stage.id === "trajectory" ? Math.max(0.05, stage.progress) : 1)
        )
    );

    const positions = trajectory.slice(0, count).map(record => record.position);
    const drone = dronePosition(time);

    const ghostRecords = [0, 24, 48, 72, 96]
        .map(index => trajectory[index]);

    const world = engineeringCoordinates(drone);

    return (
        <group>
            <Line
                points={positions}
                color="#91c3b4"
                lineWidth={1.6}
                transparent
                opacity={0.7}
            />

            {ghostRecords.map((record, index) => (
                <group key={index} position={record.position}>
                    <mesh>
                        <octahedronGeometry args={[0.24]} />
                        <meshBasicMaterial color="#aecdc1" wireframe />
                    </mesh>
                    <primitive object={new THREE.AxesHelper(1.3)} />
                    <Html position={[0, 0.8, 0]} center>
                        <span className="image-tag">T{index + 1}</span>
                    </Html>
                </group>
            ))}

            {[[-35, 54, -20], [30, 60, -30], [10, 56, 40]].map((pos, index) => (
                <group key={index}>
                    <mesh position={pos as [number, number, number]}>
                        <octahedronGeometry args={[0.5]} />
                        <meshBasicMaterial color="#b4c6cc" wireframe />
                    </mesh>
                    <Line
                        points={[pos as [number, number, number], drone.toArray()]}
                        color="#8ea7b2"
                        transparent
                        opacity={0.13}
                        dashed
                        dashSize={0.6}
                        gapSize={0.5}
                    />
                </group>
            ))}

            <Html position={[0, 18, 0]} center>
                <div className="world-label centered">
                    <span>
                        {stage.id === "sync"
                            ? "LiDAR TIMESTAMP T3 → INTERPOLATED POSE T3"
                            : "GNSS / INS → SENSOR TRAJECTORY"}
                    </span>

                    <strong>
                        {stage.id === "geo"
                            ? "LOCAL SENSOR FRAME → WORLD FRAME"
                            : "POSITION + ORIENTATION"}
                    </strong>

                    <small>GNSS: latitude · longitude · altitude</small>
                    <small>IMU: roll · pitch · yaw</small>

                    <small>
                        E {world.easting.toFixed(2)} · N {world.northing.toFixed(2)}
                    </small>

                    {stage.id === "sync" && (
                        <small>pworld = Tpose(t) · Tboresight · psensor</small>
                    )}
                </div>
            </Html>

            {stage.id === "geo" && (
                <group>
                    <primitive object={new THREE.AxesHelper(15)} />
                    <Html position={[14, 0, 0]}>
                        <span className="image-tag">EAST</span>
                    </Html>
                    <Html position={[0, 15, 0]}>
                        <span className="image-tag">UP</span>
                    </Html>
                    <Html position={[0, 0, 15]}>
                        <span className="image-tag">NORTH</span>
                    </Html>
                </group>
            )}
        </group>
    );
}

function ControlTargets() {
    const { stage } = useTimeline();

    return (
        <group>
            {gcpData.map((gcp, index) => {
                const p = new THREE.Vector3(gcp.x, gcp.y, gcp.z);

                const correction =
                    stage.id === "gcp"
                        ? THREE.MathUtils.smoothstep(stage.progress, 0.15, 0.8)
                        : 1;

                const residual = new THREE.Vector3(0.12, 0.035, -0.08).lerp(
                    new THREE.Vector3(0.012, 0.006, -0.008),
                    correction
                );

                const displayEnd = p.clone().add(residual.clone().multiplyScalar(12));
                const coordinates = engineeringCoordinates(p);

                return (
                    <group key={gcp.id}>
                        <group position={p} rotation={[-Math.PI / 2, 0, 0]}>
                            {[-1, 1].flatMap(x =>
                                [-1, 1].map(y => (
                                    <mesh
                                        key={`${x}-${y}`}
                                        position={[x * 0.16, y * 0.16, 0]}
                                    >
                                        <planeGeometry args={[0.32, 0.32]} />
                                        <meshStandardMaterial
                                            color={x === y ? "#e7e5da" : "#20272b"}
                                            side={THREE.DoubleSide}
                                        />
                                    </mesh>
                                ))
                            )}
                        </group>

                        {stage.id === "gcp" && index === 0 && (
                            <>
                                <Line
                                    points={[p, displayEnd]}
                                    color="#e6b27e"
                                    lineWidth={2}
                                />

                                <mesh position={displayEnd}>
                                    <sphereGeometry args={[0.055, 12, 12]} />
                                    <meshBasicMaterial color="#edc394" />
                                </mesh>

                                <Html position={p.clone().add(new THREE.Vector3(0, 1.2, 0))}>
                                    <div className="world-label">
                                        <span>{gcp.id} / SIMULATED CONTROL</span>
                                        <strong>KNOWN REFERENCE POSITION</strong>
                                        <small>E {coordinates.easting.toFixed(3)}</small>
                                        <small>N {coordinates.northing.toFixed(3)}</small>
                                        <small>H {coordinates.height.toFixed(3)}</small>
                                        <small>Residual {(residual.length() * 1000).toFixed(1)} mm</small>
                                        <small>Residual vector displayed ×12</small>
                                        <small>CHK-01 remains an independent check</small>
                                    </div>
                                </Html>
                            </>
                        )}
                    </group>
                );
            })}
        </group>
    );
}

function Registration() {
    const { stage } = useTimeline();

    if (!["separate", "registration", "xyzmatch"].includes(stage.id)) return null;

    const p = THREE.MathUtils.smoothstep(stage.progress, 0, 0.87);

    const name =
        stage.id === "separate"
            ? "INDEPENDENT COORDINATE FRAMES"
            : stage.progress < 0.28
                ? "INITIAL ALIGNMENT"
                : stage.progress < 0.55
                    ? "GEOMETRIC REFINEMENT"
                    : stage.progress < 0.9
                        ? "ICP — SIMULATED REFINEMENT"
                        : "REGISTERED";

    const metricText =
        stage.id === "xyzmatch" || (stage.id === "registration" && stage.progress >= 0.9)
            ? `Synthetic aligned-pair RMSE: ${registrationRMSE().toFixed(3)} m`
            : "KNOWN TRANSFORM ANIMATION / NOT AN ICP SOLVER";

    return (
        <group>
            <Html position={[-38, 20, 0]} center>
                <span className="image-tag">LiDAR</span>
            </Html>

            <Html position={[38, 20, 0]} center>
                <span className="image-tag">PHOTOGRAMMETRY</span>
            </Html>

            <Html position={[0, 26, 0]} center>
                <div className="world-label centered">
                    <span>{stage.id === "xyzmatch" ? "COORDINATE CORRESPONDENCE" : name}</span>
                    <strong>{metricText}</strong>
                </div>
            </Html>

            {stage.id !== "separate" && Array.from({ length: 6 }, (_, index) => {
                const x = -25 + index * 10;
                const offset = stage.id === "xyzmatch" ? 0.02 : (1 - p) * 6;

                return (
                    <Line
                        key={index}
                        points={[[x, 8.5, 18], [x + offset, 8.5 + offset * 0.25, 18]]}
                        color="#dfbc83"
                        transparent
                        opacity={0.7}
                        lineWidth={1}
                    />
                );
            })}
        </group>
    );
}

function SurfaceNormals() {
    const { stage } = useTimeline();
    const array = useMemo(() => normalSegments(), []);

    if (!["normals", "geometry"].includes(stage.id)) return null;

    const count = Math.max(
        2,
        Math.floor((array.length / 3) * Math.max(0.02, stage.progress) / 2) * 2
    );

    return (
        <lineSegments>
            <bufferGeometry drawRange={{ start: 0, count }}>
                <bufferAttribute
                    attach="attributes-position"
                    args={[array, 3]}
                />
            </bufferGeometry>
            <lineBasicMaterial
                color="#d8c698"
                transparent
                opacity={0.65}
            />
        </lineSegments>
    );
}

function ObjectRelationships() {
    const { stage } = useTimeline();
    if (stage.id !== "relationships") return null;

    const root = new THREE.Vector3(0, 14, 0);
    const host = new THREE.Vector3(0, 5, 7);
    const ids = [127, 201, 301];

    return (
        <group>
            <Line points={[root, host]} color="#a9cfc2" lineWidth={1} />

            <Html position={root} center>
                <span className="image-tag">BUILDING-001</span>
            </Html>

            <Html position={host} center>
                <span className="image-tag">HOST SURFACE / WALL</span>
            </Html>

            {ids.map(id => {
                const object = measureObject(id);
                if (!object) return null;

                return (
                    <group key={id}>
                        <Line
                            points={[host, object.center]}
                            color="#c1baa1"
                            lineWidth={1}
                        />

                        <Html position={object.center}>
                            <span className="image-tag">
                                {object.class} #{id}
                            </span>
                        </Html>
                    </group>
                );
            })}
        </group>
    );
}

export default function SurveyEffectsLayer() {
    return (
        <>
            <LaserExperiment />
            <Trajectory />
            <ControlTargets />
            <Registration />
            <SurfaceNormals />
            <ObjectRelationships />
        </>
    );
}
