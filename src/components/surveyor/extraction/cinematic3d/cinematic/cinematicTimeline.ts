import { useSyncExternalStore } from "react";

export type StageDefinition = [string, string, number, string, string, number];

export interface Stage {
    id: string;
    name: string;
    duration: number;
    input: string;
    output: string;
    chapter: number;
    index: number;
    start: number;
    progress?: number;
}

const definitions: StageDefinition[] = [
    ["establish", "Survey area", 45, "site location", "Building selected for survey", 0],
    ["arrival", "Survey drone arrival", 35, "Flight plan", "Lidar sensors", 0],
    ["init", "LiDAR initialization", 25, "Sensor calibration", "System ready", 0],
    ["tof", "Laser range acquisition", 55, "Laser return timing", "Range = c × Δt / 2", 0],
    ["xyz", "Range + angle → XYZ", 35, "Range · azimuth · elevation", "Local sensor points", 0],
    ["trajectory", "GNSS / INS trajectory", 45, "GNSS position + IMU orientation", "Timestamped sensor poses", 0],
    ["sync", "Timestamp synchronization", 30, "Point timestamp + interpolated pose", "World-frame transform", 0],
    ["geo", "World coordinate transformation", 30, "Local XYZ + trajectory + boresight", "Georeferenced XYZ", 0],
    ["gcp", "Survey control / validation", 35, "Known control and check positions", "Residual vectors", 0],
    ["lidar", "Progressive LiDAR acquisition", 55, "Georeferenced returns", "Dense LiDAR cloud", 0],

    ["capture", "Overlapping image acquisition", 40, "Calibrated drone camera", "Overlapping observations", 1],
    ["matching", "Common feature matching", 35, "Repeated image features", "Cross-image correspondences", 1],
    ["sfm", "Camera pose estimation", 35, "Feature tracks + camera intrinsics", "Poses + sparse structure", 1],
    ["triangulation", "Multi-view triangulation", 40, "Camera poses + viewing rays", "Intersected 3D features", 1],
    ["mvs", "Multi-view stereo", 45, "Images + reconstructed poses", "Dense photogrammetry cloud", 1],

    ["separate", "Two independent datasets", 25, "LiDAR + photogrammetry", "Separate coordinate frames", 2],
    ["registration", "Cloud registration", 45, "Initial transform + correspondences", "Refined spatial alignment", 2],
    ["xyzmatch", "Coordinate correspondence", 25, "Aligned surface neighborhoods", "X ≈ X′ · Y ≈ Y′ · Z ≈ Z′", 2],
    ["projection", "Camera → pixel → RGB", 40, "3D point + camera calibration", "Projected image color", 2],
    ["fused", "Fused spatial appearance", 25, "Aligned geometry + imagery", "XYZ + RGB", 2],
    ["clean", "Outlier removal", 25, "Fused cloud + neighborhood support", "Clean point cloud", 2],

    ["normals", "Local surface analysis", 30, "Point neighborhoods", "Normals + surface structure", 3],
    ["geometry", "Geometric region extraction", 35, "Normals + connectivity + geometry", "Planes + openings + structure", 3],
    ["semantic", "3D semantic segmentation", 40, "Geometry + RGB + features + context", "Semantic point masks", 3],
    ["instance", "Instance segmentation", 30, "Class masks + object separation", "Unique object IDs", 3],
    ["door", "Door #127 extraction", 25, "Instance point mask", "3D bounds", 3],
    ["measure", "Boundary-based measurement", 35, "Object XYZ point set", "Width · height · depth", 3],
    ["other", "Structured object measurement", 40, "Windows · AC · floors · walls · roof", "Dimensions + areas + elevations", 3],
    ["relationships", "Spatial object relationships", 25, "Objects + host surfaces", "Structured building hierarchy", 3],

    ["mesh", "Surface reconstruction", 45, "Clean points + surface structure", "Progressive triangle mesh", 4],
    ["texture", "Image-projected surface appearance", 40, "Mesh + simulated camera imagery", "Textured demonstration model", 4],
    ["final", "Digital building reveal", 50, "Geometry + semantics + appearance", "Interactive digital building", 4],
    ["inspect", "Explore the reconstruction", 1, "Structured demonstration dataset", "Object inspection", 4]
];

let start = 0;

export const stages: Stage[] = definitions.map(
    ([id, name, duration, input, output, chapter], index) => {
        const stage: Stage = { id, name, duration, input, output, chapter, index, start };
        start += duration;
        return stage;
    }
);

export const END = stages[stages.length - 1].start;

export const chapters = [
    "ACQUISITION",
    "PHOTOGRAMMETRY",
    "FUSION",
    "UNDERSTANDING",
    "RECONSTRUCTION"
];

export function stageAt(time: number): Stage & { progress: number } {
    const stage =
        [...stages].reverse().find(item => time >= item.start) || stages[0];

    return {
        ...stage,
        progress: Math.max(0, Math.min(1, (time - stage.start) / stage.duration))
    };
}

export interface TimelineState {
    time: number;
    playing: boolean;
    rate: number;
    camera: "cinematic" | "free";
    isFastForwarding: boolean;
    fastForwardRate: number;
    targetTime: number | null;
}

let state: TimelineState = {
    time: 0,
    playing: true,
    rate: 1,
    camera: "cinematic",
    isFastForwarding: false,
    fastForwardRate: 8,
    targetTime: null
};

let targetSeekTime: number | null = null;
let returnToRate = 1;
let wasPlayingBeforeSeek = true;

let snapshot = { ...state };
const subscribers = new Set<() => void>();

function emit() {
    snapshot = { ...state };
    subscribers.forEach(listener => listener());
}

function update(patch: Partial<TimelineState>) {
    state = { ...state, ...patch };
    emit();
}

export const transport = {
    read: (): TimelineState => state,

    play() {
        targetSeekTime = null;
        if (state.time >= END) {
            update({ time: 0, playing: true, camera: "cinematic", isFastForwarding: false, targetTime: null });
        } else {
            update({ playing: !state.playing, isFastForwarding: false, targetTime: null });
        }
    },

    seek(time: number) {
        targetSeekTime = null;
        const bounded = Math.max(0, Math.min(END, time));

        update({
            time: bounded,
            isFastForwarding: false,
            targetTime: null,
            ...(bounded >= END ? { playing: false, camera: "free" } : {})
        });
    },

    // Smooth live speedup forward without cut and go!
    seekLive(target: number, speedMultiplier = 8) {
        const bounded = Math.max(0, Math.min(END, target));
        if (bounded <= state.time) {
            this.seek(bounded);
            return;
        }

        targetSeekTime = bounded;
        wasPlayingBeforeSeek = state.playing;
        update({
            playing: true,
            isFastForwarding: true,
            fastForwardRate: speedMultiplier,
            targetTime: bounded
        });
    },

    // Fast-forward forward by N seconds live without cut!
    forwardLive(seconds = 5, speedMultiplier = 8) {
        const base = targetSeekTime !== null ? targetSeekTime : state.time;
        this.seekLive(base + seconds, speedMultiplier);
    },

    step() {
        this.forwardLive(2, 4);
    },

    skip() {
        const current = stageAt(state.time);
        const nextStage = stages[Math.min(current.index + 1, stages.length - 1)];
        this.seekLive(nextStage.start, 12);
    },

    startHoldingFastForward(multiplier = 6) {
        targetSeekTime = null;
        returnToRate = state.rate;
        update({
            playing: true,
            isFastForwarding: true,
            fastForwardRate: multiplier
        });
    },

    stopHoldingFastForward() {
        update({
            isFastForwarding: false,
            rate: returnToRate,
            targetTime: null
        });
    },

    restart() {
        targetSeekTime = null;
        update({ time: 0, playing: true, rate: 1, camera: "cinematic", isFastForwarding: false, targetTime: null });
    },

    rate(rate: number) {
        targetSeekTime = null;
        update({ rate, isFastForwarding: false, targetTime: null });
    },

    camera() {
        update({ camera: state.camera === "cinematic" ? "free" : "cinematic" });
    }
};

export function startTimeline() {
    let frame: number;
    let previous = performance.now();
    let lastEmission = 0;

    function tick(now: number) {
        const delta = Math.min(0.1, (now - previous) / 1000);
        previous = now;

        if (state.playing) {
            if (targetSeekTime !== null) {
                // Live speedup to target time without cut and go
                const remaining = targetSeekTime - state.time;
                if (remaining > 0.05) {
                    // Dynamically calculate speed: completes the forward leap in ~0.5s - 0.7s,
                    // or at least fastForwardRate (e.g. 8x)
                    const speed = Math.max(state.fastForwardRate, remaining / 0.55);
                    state.time = Math.min(targetSeekTime, state.time + delta * speed);
                } else {
                    state.time = targetSeekTime;
                    targetSeekTime = null;
                    state.isFastForwarding = false;
                    state.targetTime = null;
                    state.playing = wasPlayingBeforeSeek;
                    if (state.time >= END) {
                        state.playing = false;
                        state.camera = "free";
                    }
                }
            } else if (state.isFastForwarding) {
                state.time = Math.min(END, state.time + delta * state.fastForwardRate);
                if (state.time >= END) {
                    state.playing = false;
                    state.camera = "free";
                    state.isFastForwarding = false;
                }
            } else {
                state.time = Math.min(END, state.time + delta * state.rate);
                if (state.time >= END) {
                    state.playing = false;
                    state.camera = "free";
                }
            }
        }

        // Higher emission rate during live acceleration so UI scrubber and HUD glide at 30+ fps
        const emissionInterval = (state.isFastForwarding || targetSeekTime !== null) ? 33 : 80;
        if (now - lastEmission > emissionInterval) {
            emit();
            lastEmission = now;
        }

        frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
}

export function useTimeline(): TimelineState & { stage: Stage & { progress: number } } {
    const value = useSyncExternalStore(
        listener => {
            subscribers.add(listener);
            return () => subscribers.delete(listener);
        },
        () => snapshot,
        () => snapshot
    );

    return { ...value, stage: stageAt(value.time) };
}

export function formatTime(seconds: number): string {
    const whole = Math.floor(seconds);
    return `${String(Math.floor(whole / 60)).padStart(2, "0")}:${String(
        whole % 60
    ).padStart(2, "0")}`;
}

export function phaseIndex(id: string): number {
    return stages.findIndex(stage => stage.id === id);
}
