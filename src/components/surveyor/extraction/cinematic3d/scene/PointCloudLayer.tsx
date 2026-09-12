import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { pointData } from "../processing/surveyProcessor";
import { stageAt, transport, phaseIndex, Stage } from "../cinematic/cinematicTimeline";
import { BuildingOptions } from "./BuildingModel";

const vertexShader = `
  attribute vec3 rgb;
  attribute vec3 semantic;
  attribute float classId;
  attribute float instanceId;
  attribute float noise;

  uniform float uRGB;
  uniform float uSemantic;
  uniform float uClean;
  uniform float uSelected;
  uniform float uIsolation;
  uniform float uClass;
  uniform float uExplode;
  uniform float uOpacity;
  uniform float uSize;
  uniform vec3 uBase;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 p = position;

    p += vec3(
      sin(instanceId * 1.7),
      0.3 + classId * 0.12,
      cos(instanceId * 1.7)
    ) * uExplode;

    float classified = step((classId + 1.0) / 9.0, uSemantic);

    vColor = mix(uBase, rgb, uRGB);
    vColor = mix(vColor, semantic, classified);

    float chosen = 1.0 - step(0.5, abs(instanceId - uSelected));
    float selectedActive = step(0.0, uSelected);

    vColor = mix(
      vColor,
      vec3(1.0, 0.75, 0.4),
      chosen * selectedActive * 0.75
    );

    vAlpha = uOpacity;
    vAlpha *= 1.0 - noise * uClean;
    vAlpha *= mix(
      1.0,
      mix(0.07, 1.0, chosen),
      uIsolation * selectedActive
    );

    if (uClass >= 0.0 && abs(classId - uClass) > 0.5) vAlpha = 0.0;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = clamp(uSize * 85.0 / -mvPosition.z, 1.0, 5.0);
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float radius = length(gl_PointCoord - 0.5);
    if (radius > 0.5 || vAlpha < 0.01) discard;

    float falloff = 1.0 - smoothstep(0.2, 0.5, radius);
    gl_FragColor = vec4(vColor, vAlpha * falloff);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const clamp = THREE.MathUtils.clamp;
const smooth = (p: number) => p * p * (3 - 2 * p);

function selectedDuringStage(stage: Stage & { progress: number }, options: BuildingOptions) {
    if (["door", "measure"].includes(stage.id)) return 127;

    if (stage.id === "other") {
        const ids = [201, 301, 401, 403];
        return ids[Math.min(ids.length - 1, Math.floor(stage.progress * ids.length))];
    }

    return stage.id === "inspect" ? options.selected : -1;
}

interface PointCloudProps {
    source: "lidar" | "photo";
    options: BuildingOptions;
    onSelect: (instanceId: number) => void;
}

export default function PointCloudLayer({ source, options, onSelect }: PointCloudProps) {
    const group = useRef<THREE.Group>(null!);
    const photo = source === "photo";

    const geometry = useMemo(() => {
        const result = new THREE.BufferGeometry();

        result.setAttribute(
            "position",
            new THREE.BufferAttribute(
                photo ? pointData.photoPosition : pointData.position,
                3
            )
        );

        const attributes: [keyof typeof pointData, number][] = [
            ["rgb", 3],
            ["semantic", 3],
            ["classId", 1],
            ["instanceId", 1],
            ["noise", 1]
        ];

        for (const [name, size] of attributes) {
            result.setAttribute(
                name,
                new THREE.BufferAttribute(pointData[name] as Float32Array, size)
            );
        }

        result.computeBoundingSphere();
        return result;
    }, [photo]);

    const material = useMemo(
        () => new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent: true,
            depthWrite: false,
            uniforms: {
                uRGB: { value: 0 },
                uSemantic: { value: 0 },
                uClean: { value: 0 },
                uSelected: { value: -1 },
                uIsolation: { value: 0 },
                uClass: { value: -1 },
                uExplode: { value: 0 },
                uOpacity: { value: 0.9 },
                uSize: { value: 1.6 },
                uBase: {
                    value: new THREE.Color(photo ? "#d5b383" : "#85c9ce")
                }
            }
        }),
        [photo]
    );

    useEffect(() => () => {
        geometry.dispose();
        material.dispose();
    }, [geometry, material]);

    useFrame(() => {
        if (!group.current) return;
        const stage = stageAt(transport.read().time);
        const index = stage.index;
        const p = stage.progress;
        const u = material.uniforms;

        let count = pointData.count;
        let visible = index >= phaseIndex(photo ? "sfm" : "xyz");
        let opacity = 0.88;
        let rgb = photo ? 0.2 : 0;

        group.current.position.set(0, 0, 0);
        group.current.rotation.set(0, 0, 0);
        group.current.scale.setScalar(1);

        if (!photo) {
            if (stage.id === "xyz") {
                count = Math.floor(8 + p * 240);
            } else if (index < phaseIndex("lidar")) {
                count = 650;
            } else if (stage.id === "lidar") {
                count = Math.floor(650 + p * (pointData.count - 650));
            }

            if (index >= phaseIndex("capture") && index <= phaseIndex("mvs")) {
                opacity = 0.22;
            }

            if (stage.id === "geo") {
                group.current.rotation.y = (1 - smooth(p)) * 0.22;
                group.current.position.set((1 - smooth(p)) * 6, 0, (1 - smooth(p)) * -4);
            }
        } else {
            if (stage.id === "sfm" || stage.id === "triangulation") {
                count = Math.floor(160 + p * 1100);
            }

            if (stage.id === "mvs") {
                count = Math.floor(1200 + p * (pointData.count - 1200));
            }

            if (index > phaseIndex("xyzmatch")) visible = false;
        }

        if (stage.id === "separate") {
            group.current.position.set(photo ? 17 : -17, photo ? 1.2 : 0, 0);

            if (photo) {
                group.current.rotation.y = 0.14;
                group.current.scale.setScalar(1.025);
            }
        }

        if (stage.id === "registration") {
            const residual = 1 - smooth(clamp(p / 0.87, 0, 1));

            group.current.position.set(
                (photo ? 17 : -17) * residual,
                photo ? residual * 1.2 : 0,
                photo ? -residual * 1.1 : 0
            );

            if (photo) {
                group.current.rotation.y = residual * 0.14;
                group.current.scale.setScalar(1 + residual * 0.025);
            }

            opacity = photo ? 0.64 : 0.8;
        }

        if (!photo && index >= phaseIndex("projection")) {
            rgb = stage.id === "projection" ? p : 1;
        }

        if (stage.id === "mesh") opacity = 0.85 * (1 - p);
        if (["texture", "final"].includes(stage.id)) visible = false;

        let semantic = 0;

        if (stage.id === "geometry") semantic = p * 0.48;
        if (stage.id === "semantic") semantic = p;
        if (index > phaseIndex("semantic")) semantic = 1;

        const selected = selectedDuringStage(stage, options);

        let isolation = ["door", "measure", "other"].includes(stage.id) ? 1 : 0;

        if (stage.id === "inspect") {
            visible =
                options.showCloud &&
                (
                    (photo && options.view === "photo") ||
                    (!photo && options.view !== "photo")
                );

            rgb = options.view === "lidar" ? 0 : 1;
            semantic = options.semantic ? 1 : 0;
            isolation = options.isolate ? 1 : 0;
            opacity = options.view === "model" ? 0.35 : 0.95;
        }

        u.uRGB.value = rgb;
        u.uOpacity.value = opacity;
        u.uSemantic.value = semantic;
        u.uSelected.value = selected;
        u.uIsolation.value = isolation;
        u.uClass.value = stage.id === "inspect" ? options.classFilter : -1;

        u.uExplode.value =
            ["semantic", "instance"].includes(stage.id)
                ? Math.sin(p * Math.PI) * (stage.id === "instance" ? 0.75 : 0.35)
                : 0;

        u.uClean.value =
            stage.id === "clean"
                ? p
                : index > phaseIndex("clean")
                    ? 1
                    : 0;

        group.current.visible = visible;
        geometry.setDrawRange(0, count);
    });

    return (
        <group ref={group}>
            <points
                geometry={geometry}
                material={material}
                frustumCulled={false}
                onClick={(event) => {
                    if (stageAt(transport.read().time).id !== "inspect") return;
                    if (event.index == null) return;

                    const id = pointData.instanceId[event.index];
                    if (id < 0) return;

                    event.stopPropagation();
                    onSelect(id);
                }}
            />
        </group>
    );
}
