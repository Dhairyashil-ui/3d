import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { measureObject } from "../processing/surveyProcessor";
import { useTimeline } from "../cinematic/cinematicTimeline";
import { BuildingOptions } from "./BuildingModel";

interface DimensionProps {
    from: THREE.Vector3;
    to: THREE.Vector3;
    label: string;
    color?: string;
}

function Dimension({ from, to, label, color = "#e9c38e" }: DimensionProps) {
    const midpoint = from.clone().lerp(to, 0.5);
    const vertical = Math.abs(to.y - from.y) > Math.abs(to.x - from.x);

    const tick = vertical
        ? new THREE.Vector3(0.1, 0, 0)
        : new THREE.Vector3(0, 0.1, 0);

    return (
        <group>
            <Line points={[from, to]} color={color} lineWidth={1.2} />

            {[from, to].map((point, index) => (
                <Line
                    key={index}
                    points={[point.clone().sub(tick), point.clone().add(tick)]}
                    color={color}
                    lineWidth={1}
                />
            ))}

            <Html position={midpoint} center>
                <span className="dimension-label">{label}</span>
            </Html>
        </group>
    );
}

interface MeasurementOverlaysProps {
    options: BuildingOptions;
}

export default function MeasurementOverlays({ options }: MeasurementOverlaysProps) {
    const { stage } = useTimeline();

    let id: number | string = 127;
    let visible = ["door", "measure", "other"].includes(stage.id);

    if (stage.id === "other") {
        const ids = [201, 301, 401, 403];
        id = ids[Math.min(ids.length - 1, Math.floor(stage.progress * ids.length))];
    }

    if (stage.id === "inspect") {
        id = options.selected;
        visible = options.measurements;
    }

    const object = measureObject(id);
    if (!visible || !object) return null;

    const { min, max } = object.boundingBox;
    const size = object.size;
    const center = object.center;

    const z = max.z + 0.2;
    const x = max.x + Math.max(0.28, size.x * 0.08);

    const showDimensions = stage.id !== "door" || stage.progress > 0.55;

    return (
        <group>
            <mesh position={center}>
                <boxGeometry args={[size.x + 0.025, size.y + 0.025, size.z + 0.025]} />
                <meshBasicMaterial
                    color="#e8be84"
                    wireframe
                    transparent
                    opacity={0.72}
                    depthTest={false}
                />
            </mesh>

            {showDimensions && (
                <>
                    <Dimension
                        from={new THREE.Vector3(min.x, min.y - 0.2, z)}
                        to={new THREE.Vector3(max.x, min.y - 0.2, z)}
                        label={`${size.x.toFixed(2)} m`}
                    />

                    <Dimension
                        from={new THREE.Vector3(x, min.y, z)}
                        to={new THREE.Vector3(x, max.y, z)}
                        label={`${size.y.toFixed(2)} m`}
                    />

                    <Dimension
                        from={new THREE.Vector3(x, min.y, min.z)}
                        to={new THREE.Vector3(x, min.y, max.z)}
                        label={`${size.z.toFixed(2)} m`}
                    />
                </>
            )}

            <Html position={[max.x + 0.5, max.y + 0.25, max.z]}>
                <div className="world-label">
                    <span>INSTANCE POINT MASK</span>
                    <strong>{object.class} #{object.instanceId}</strong>

                    {stage.id === "door" ? (
                        <>
                            <small>X {min.x.toFixed(3)} → {max.x.toFixed(3)}</small>
                            <small>Y {min.y.toFixed(3)} → {max.y.toFixed(3)}</small>
                            <small>Z {min.z.toFixed(3)} → {max.z.toFixed(3)}</small>
                        </>
                    ) : (
                        <>
                            <small>WIDTH {object.width.toFixed(2)} m</small>
                            <small>HEIGHT {object.height.toFixed(2)} m</small>
                            <small>DEPTH {object.depth.toFixed(2)} m</small>
                            <small>AREA {object.area.toFixed(2)} m²</small>
                            <small>ELEVATION {object.elevation.toFixed(2)} m local</small>

                            {object.slopeDegrees != null && (
                                <small>SLOPE {object.slopeDegrees.toFixed(1)}°</small>
                            )}
                        </>
                    )}
                </div>
            </Html>
        </group>
    );
}
