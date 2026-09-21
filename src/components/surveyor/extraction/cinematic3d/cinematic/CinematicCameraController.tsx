import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { dronePosition } from "../data/surveyData";
import { transport, stageAt } from "./cinematicTimeline";

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const smooth = (value: number) => value * value * (3 - 2 * value);

export default function CinematicCameraController() {
    const { camera } = useThree();
    const look = useRef(v(0, 3.5, 0));
    const initialized = useRef(false);

    useFrame((_, delta) => {
        const state = transport.read();
        if (state.camera !== "cinematic") return;

        const stage = stageAt(state.time);
        const p = stage.progress;
        const drone = dronePosition(state.time);

        let target = v(0, 3.5, 0);
        let position: THREE.Vector3;

        switch (stage.id) {
            case "establish":
                position = v(105, 68, 100).lerp(v(44, 29, 45), smooth(p));
                target = v(0, 3.5, 0);
                break;

            case "arrival":
                target = drone.clone();
                position = drone.clone().add(
                    v(9, 5, 12).lerp(v(12, 2.5, 2), smooth(p))
                );
                break;

            case "init":
            case "xyz":
                target = drone.clone().add(v(0, -0.4, 0));
                position = drone.clone().add(v(3.8, 1.4, 4.5));
                break;

            case "tof": {
                const pulse = ((state.time - stage.start) % 8) / 8;
                const travel = pulse < 0.42
                    ? pulse / 0.42
                    : pulse < 0.54
                        ? 1
                        : pulse < 0.96
                            ? 1 - (pulse - 0.54) / 0.42
                            : 0;

                target = drone.clone().lerp(v(7, 8, 7.2), travel);
                position = target.clone().add(v(4.5, 2.7, 5.5));
                break;
            }

            case "trajectory":
            case "sync":
                position = v(7, 68, 0.1);
                target = v(0, 2, 0);
                break;

            case "gcp":
                target = v(-17, 0.1, 12);
                position = v(-12, 5, 18);
                break;

            case "matching":
            case "sfm":
            case "capture":
                position = v(39, 29, 41);
                target = v(0, 8, 0);
                break;

            case "triangulation":
                position = v(29, 22, 38);
                target = v(5, 8, 8);
                break;

            case "separate":
            case "registration":
                position = v(53, 31, 69);
                target = v(0, 5, 0);
                break;

            case "xyzmatch":
            case "projection":
                position = v(19, 16, 29);
                target = v(6, 7, 7);
                break;

            case "normals":
            case "geometry":
            case "semantic":
            case "instance":
                position = v(24 - p * 4, 14, 27);
                target = v(2, 5, 6);
                break;

            case "door":
            case "measure":
                target = v(-1.1, 1.05, 7.26);
                position = v(2.5 - p, 2.65, 12.8);
                break;

            case "other":
                position = v(24, 17, 28);
                target = v(0, 5, 4);
                break;

            case "relationships":
                position = v(19, 11, 28);
                target = v(0, 5, 5);
                break;

            case "final": {
                const angle = 0.6 + p * Math.PI * 1.6;
                const radius = 36 - Math.sin(p * Math.PI) * 11;

                position = v(
                    Math.sin(angle) * radius,
                    p < 0.65 ? 25 - p * 32 : 4 + (p - 0.65) * 75,
                    Math.cos(angle) * radius
                );
                target = v(0, 4.5, 0);
                break;
            }

            default: {
                const angle = 0.58 + p * 0.45;
                position = v(Math.sin(angle) * 43, 25, Math.cos(angle) * 43);
                target = v(0, 3.5, 0);
            }
        }

        if (!initialized.current) {
            camera.position.copy(position);
            look.current.copy(target);
            initialized.current = true;
        }

        const isFast = state.isFastForwarding || state.rate >= 3;
        const responsiveness = isFast ? 3.8 : 0.9;
        const damping = 1 - Math.exp(-delta * responsiveness);
        camera.position.lerp(position, damping);
        look.current.lerp(target, damping);
        camera.lookAt(look.current);
    });

    return null;
}
