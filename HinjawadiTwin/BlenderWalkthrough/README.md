# Hinjawadi & PCCRC First-Person Walkthrough System for Blender 5.2 LTS

A native, one-click interactive first-person walking simulation directly inside your existing Blender 5.2 LTS scene (`hinjawadi_offices_refined.blend`).

---

## 1. Installation

You can install and use the walkthrough controller using **either** of these two methods:

### Method A: One-Click Batch Launch (Easiest)
Simply double-click the included batch script:
```cmd
C:\Users\Dhairyashil\website\HinjawadiTwin\BlenderWalkthrough\INSTALL_WALKTHROUGH.bat
```
This automatically launches Blender 5.2, opens `hinjawadi_offices_refined.blend`, and registers the walkthrough controller.

### Method B: Inside Blender (Scripting Workspace)
1. Open your existing scene in Blender 5.2:
   ```
   C:\Users\Dhairyashil\website\hinjawadi_output\hinjawadi_offices_refined.blend
   ```
2. Switch to the **Scripting** workspace (top tab).
3. Click **Open** (folder icon) and select:
   ```
   C:\Users\Dhairyashil\website\HinjawadiTwin\BlenderWalkthrough\walkthrough_controller.py
   ```
4. Click **Run Script** (Play button or press `Alt + P`).
5. The panel will register and appear immediately in the 3D Viewport sidebar.

---

## 2. Where to Find the Walkthrough (3 Instant Ways)

If the walkthrough panel is not visible, use any of these **3 instant ways** to start walking immediately:

### Way 1: Global Shortcut (Fastest)
- Simply press **`Alt + W`** anywhere inside the **3D Viewport**.
- The walkthrough will launch instantly!

### Way 2: Top Header Button
- Look at the **top-left header bar** of the 3D Viewport (right next to `Object Mode / View / Select`):
- Click the button: **`[ WALKTHROUGH (Alt+W) ]`**

### Way 3: Right Sidebar (N-Panel)
1. In the 3D Viewport, press **`N`** on your keyboard to open the sidebar.
2. Click either:
   - The dedicated **`Hinjawadi Walkthrough`** tab on the right edge, OR
   - The standard **`View`** tab -> expand **`Hinjawadi Walkthrough`**.
3. Click the prominent button: **`[ START WALKTHROUGH (Alt+W) ]`**.

---

## 3. Teleport to Route Waypoints

Inside the walkthrough panel, you can click any of the **Instant Teleport** buttons to jump directly to key landmarks:
- **`Right in Front of PCCRC (Start)`**: Standing directly in front of monumental entrance steps (`-82.33, -772, 1.65m`)
- **`Entrance Steps & Portico`**: Sandstone 4-tier steps and grand glazed portal (`-82.33, -769, 1.95m`)
- **`Central Atrium (Ground)`**: 5-story void, polished stone floor & star inlays (`-82.33, -755.2, 1.65m`)
- **`Level 2 Gallery Balcony`**: Second-floor overlook with handrails (`-82.33, -758, 10.05m`)
- **`Top Skylight & Dome`**: 5th floor roof void looking down (`-82.33, -754, 22.65m`)
- **`Phase 1 Road Approach`**: Distant road network 150m away (`-140, -740, 1.65m`)

---

## 4. Controls

| Key / Action | Function |
| :--- | :--- |
| **`Up Arrow` / `W`** | Move Forward |
| **`Down Arrow` / `S`** | Move Backward |
| **`Left Arrow` / `A`** | Strafe Left |
| **`Right Arrow` / `D`** | Strafe Right |
| **`Q` / `E`** | Turn / Rotate Camera Left / Right (keyboard only) |
| **`Mouse Move`** | Look Around (Yaw & Pitch clamped to ±85° to prevent flipping) |
| **`Shift` (Hold)** | Sprint (2.5x speed boost, up to 22+ m/s) |
| **`Space`** | Jump (When on the ground and Gravity is ON) |
| **`1`** | Set Walk Mode (3.0 m/s - indoor precision) |
| **`2`** | Set Normal Mode (8.0 m/s - standard city pace) |
| **`3`** | Set Fast Mode (18.0 m/s - fast road cruise) |
| **`4`** | Set Turbo Mode (35.0 m/s - rapid city flight/tour) |
| **`Mouse Wheel Up`** | Increase speed by +2.0 m/s (shown live in HUD) |
| **`Mouse Wheel Down`** | Decrease speed by -2.0 m/s |
| **`R`** | Reset camera directly in front of PCCRC building |
| **`Esc`** | Exit Walkthrough and restore Blender UI |

---

## 5. How Collision Works

- **Raycast Dependency Graph**: The system uses Blender's native `scene.ray_cast()` evaluated against all mesh objects in the evaluated dependency graph without requiring geometry modification or physics baking.
- **Three-Tier Capsule Probing**: Probes are cast forward at:
  - Foot height (`ground + 0.25m`)
  - Waist height (`ground + 0.95m`)
  - Chest height (`ground + 1.45m`)
- **Obstacle Blocking**: Solid walls, building facades, columns, railings, and barriers within a 0.45m player radius immediately block forward motion.
- **Smooth Wall Sliding**: When walking obliquely against a wall or barrier, the system projects your movement vector along the obstacle's surface tangent, allowing you to slide along walls naturally instead of freezing.
- **Stair & Step Climbing**: If an obstacle is lower than 0.35m (such as the 4 monumental entrance steps of the PCCRC building or street curbs), the controller recognizes it as a step and smoothly steps up rather than blocking movement.

---

## 6. Ground Detection & Gravity

- **Ground Following**: Downward raycasts probe the actual road, sidewalk, and interior floor surfaces up to 60 metres below.
- **Eye Height**: Maintains the camera at exactly `1.65m` (customizable in the panel) above whatever surface you are standing on.
- **Gravity & Jump**: When `Gravity & Ground` is enabled:
  - Downward acceleration is computed at `9.81 m/s²`.
  - Pressing **`Space`** applies a vertical jump impulse of `4.2 m/s` (approx. 0.9m jump height).
  - Landing on roads, steps, or atrium floors halts vertical velocity and resets the grounded state.
- **No Terrain Fabrication**: Uses the scene's exact ground and floor surfaces without altering terrain elevation or geometry.

---

## 7. How to Reset the Camera

You can reset the camera to the starting road position in two ways:
1. **While Walking**: Press the **`R`** key on your keyboard.
2. **From the Sidebar Panel**: Click the **`[ RESET CAMERA ]`** button.

This repositions the camera to the starting position on Hinjawadi Phase 1 road (`[-140.0, -740.0, 1.65]` ENU) facing towards the PCCRC campus entrance.

---

## 8. How to Stop the Walkthrough

1. **Quickest (Keyboard)**: Press **`Esc`** at any time while walking.
2. **UI Button**: Click **`[ STOP WALKTHROUGH ]`** in the sidebar panel.

When stopped, the controller:
- Restores the mouse cursor.
- Restores viewport overlays.
- Restores original camera focal length / settings.
- Restores the camera's original animation action if one was attached.
- Does **not** modify or overwrite the `.blend` file.

---

## 9. Blender Version Compatibility

- **Target**: Blender 5.2 LTS (tested on 5.2.1 LTS).
- **Python Version**: Python 3.11+ / 3.12 embedded in Blender 5.2.
- **API Standards**: Uses modern dependency graph evaluation (`context.evaluated_depsgraph_get()`), viewport drawing (`blf`), and modal event handling.

---

## 10. Safety Guarantees

The controller strictly adheres to non-destructive design:
- Never deletes or modifies existing scene objects, collections, materials, or GIS metadata.
- Never joins meshes or applies modifiers.
- Never saves over the source `.blend` file automatically.
- Only drives the camera location and rotation during an active session.
