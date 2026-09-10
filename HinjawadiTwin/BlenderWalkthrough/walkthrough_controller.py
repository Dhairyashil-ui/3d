"""
Hinjawadi & PCCRC First-Person Walkthrough Controller for Blender 5.2 LTS
========================================================================

A one-click, interactive first-person walking simulation directly inside
Blender 5.2 LTS for the Hinjawadi Phase 1 city reconstruction and the PCCRC
research center architectural twin.

Key Features:
- One-Click Activation: Press [ START WALKTHROUGH ] to immediately walk.
- Uses Existing Camera: Controls 'PCCRC_Walkthrough_Camera' without creating replacements.
- Metric Physics: 1 Blender unit = 1 metre (Walk: 1.5 m/s, Sprint: 4.0 m/s).
- Realistic Collision: Raycast obstacle detection prevents walking through walls,
  columns, and buildings, with smooth wall sliding.
- Ground Following & Gravity: Automatic terrain / road / sidewalk following with
  smooth stair climbing (e.g. PCCRC 4-step entrance).
- Preserves Scene: Never deletes, modifies, or renames any buildings, roads,
  materials, GIS data, or geometry. Restores camera settings on exit.

Installation:
- In Blender: Scripting -> Open 'walkthrough_controller.py' -> Run Script.
- Or launch via 'INSTALL_WALKTHROUGH.bat'.
- The panel appears in View3D -> Sidebar (N) -> Tab: 'Hinjawadi Walkthrough'.
"""

bl_info = {
    "name": "Hinjawadi First-Person Walkthrough Controller",
    "author": "Antigravity",
    "version": (1, 0, 0),
    "blender": (5, 2, 0),
    "location": "View3D > Sidebar > Hinjawadi Walkthrough",
    "description": "One-click interactive first-person walkthrough controller for Hinjawadi and PCCRC",
    "category": "3D View",
}

import math
import time
import bpy
import blf
import mathutils
from mathutils import Vector, Euler

CAMERA_NAME = "PCCRC_Walkthrough_Camera"
DEFAULT_PCCRC_FRONT = Vector((-82.33, -772.0, 1.65))  # Directly in front of PCCRC entrance steps
DEFAULT_ROAD_START = Vector((-140.0, -740.0, 1.65))

# Global reference for active modal instance to allow programmatic stopping
_ACTIVE_MODAL = None


# ------------------------------------------------------------------------------
# 1. Properties
# ------------------------------------------------------------------------------
class HinjawadiWalkthroughProperties(bpy.types.PropertyGroup):
    walk_speed: bpy.props.FloatProperty(
        name="Walk Speed (m/s)",
        description="Base walking movement speed in metres per second (press 1, 2, 3, 4 or mouse wheel to change)",
        default=8.0,
        min=0.5,
        max=100.0,
        step=50,
        precision=1
    )
    sprint_speed: bpy.props.FloatProperty(
        name="Sprint Speed (m/s)",
        description="Sprinting movement speed while holding Shift",
        default=22.0,
        min=1.0,
        max=200.0,
        step=100,
        precision=1
    )
    mouse_sensitivity: bpy.props.FloatProperty(
        name="Mouse Sensitivity",
        description="Look rotation sensitivity multiplier",
        default=1.2,
        min=0.1,
        max=10.0,
        step=10,
        precision=2
    )
    eye_height: bpy.props.FloatProperty(
        name="Eye Height (m)",
        description="Player eye height above ground/floor surface in metres",
        default=1.65,
        min=0.5,
        max=3.0,
        step=5,
        precision=2
    )
    use_collision: bpy.props.BoolProperty(
        name="Collision",
        description="Block movement through buildings, walls, and structural obstacles",
        default=True
    )
    use_gravity: bpy.props.BoolProperty(
        name="Gravity & Ground",
        description="Enable ground detection, slope/stair climbing, and jump physics",
        default=True
    )
    natural_lens: bpy.props.BoolProperty(
        name="70mm Natural Lens",
        description="Temporarily set camera focal length to ~70mm natural human perspective while walking",
        default=True
    )
    is_walking: bpy.props.BoolProperty(
        name="Is Walking",
        description="Flag indicating whether the walkthrough modal is currently running",
        default=False
    )
    # Stored initial transform for camera reset
    has_stored_init: bpy.props.BoolProperty(default=False)
    init_loc: bpy.props.FloatVectorProperty(size=3, default=(-140.0, -740.0, 1.65))
    init_rot: bpy.props.FloatVectorProperty(size=3, default=(math.pi / 2, 0.0, 0.0))
    init_lens: bpy.props.FloatProperty(default=28.0)


# ------------------------------------------------------------------------------
# 2. Viewport HUD Drawing Callback
# ------------------------------------------------------------------------------
_draw_handler = None

def draw_walkthrough_hud(self, context):
    if not context.scene.hinjawadi_walkthrough.is_walking:
        return

    font_id = 0
    props = context.scene.hinjawadi_walkthrough

    # Status Banner
    blf.size(font_id, 15)
    blf.color(font_id, 0.22, 0.74, 0.97, 1.0) # Bright cyan
    blf.position(font_id, 30, 75, 0)
    blf.draw(font_id, "[HINJAWADI WALKTHROUGH ACTIVE]")

    # Instructions & Controls
    blf.size(font_id, 13)
    blf.color(font_id, 0.95, 0.95, 0.95, 0.95)
    blf.position(font_id, 30, 52, 0)
    mode_str = f"SPEED: {props.walk_speed:.1f} m/s (Sprint: {props.sprint_speed:.1f} m/s) | Eye Height: {props.eye_height:.2f} m"
    blf.draw(font_id, mode_str)

    blf.color(font_id, 0.85, 0.85, 0.85, 0.9)
    blf.position(font_id, 30, 30, 0)
    blf.draw(font_id, "[WASD / Arrow Keys] Move | [Q,E / Mouse] Turn | [Shift] Sprint | [Space] Jump | [R] Reset | [ESC] Exit")


# ------------------------------------------------------------------------------
# 3. Modal Walkthrough Operator
# ------------------------------------------------------------------------------
class HINJAWADI_OT_walkthrough_modal(bpy.types.Operator):
    bl_idname = "hinjawadi.walkthrough_modal"
    bl_label = "Hinjawadi Walkthrough Modal"
    bl_description = "Interactive first-person walkthrough modal loop"
    bl_options = {'INTERNAL'}

    def invoke(self, context, event):
        global _ACTIVE_MODAL, _draw_handler
        props = context.scene.hinjawadi_walkthrough

        self.cam_obj = None
        self.keys = set()
        self.yaw = 0.0
        self.pitch = 0.0
        self.vertical_vel = 0.0
        self.on_ground = True
        self.center_x = 0
        self.center_y = 0
        self._warped = False
        self._timer = None
        self.last_time = 0.0
        self.saved_lens = 28.0
        self.saved_overlays = True
        self.saved_action = None

        # 1. Locate the existing PCCRC camera
        self.cam_obj = bpy.data.objects.get(CAMERA_NAME)
        if not self.cam_obj:
            self.report({'ERROR'}, f"Camera '{CAMERA_NAME}' not found in scene!")
            return {'CANCELLED'}

        # 2. Make camera active
        context.scene.camera = self.cam_obj

        # 3. Position camera directly in front of the PCCRC building if far away or first start
        if self.cam_obj.location.x < -100.0 or self.cam_obj.location.y < -780.0 or not props.has_stored_init:
            self.cam_obj.location = DEFAULT_PCCRC_FRONT.copy()
            self.cam_obj.rotation_euler = Euler((math.pi / 2, 0.0, 0.0), 'XYZ')

        # Store initial camera transform for Reset
        props.init_loc = DEFAULT_PCCRC_FRONT.copy()
        props.init_rot = (math.pi / 2, 0.0, 0.0)
        props.init_lens = 28.0
        props.has_stored_init = True

        self.saved_lens = self.cam_obj.data.lens

        # 4. Temporarily detach animation action if present so keyframes don't override manual walk
        if self.cam_obj.animation_data and self.cam_obj.animation_data.action:
            self.saved_action = self.cam_obj.animation_data.action
            self.cam_obj.animation_data.action = None

        # 5. Extract starting Yaw and Pitch from camera's current orientation
        forward = (self.cam_obj.matrix_world.to_3x3() @ Vector((0, 0, -1))).normalized()
        self.yaw = math.atan2(-forward.x, forward.y)
        self.pitch = math.asin(max(-1.0, min(1.0, forward.z)))

        # 6. Apply 70mm natural human perspective if enabled
        if props.natural_lens:
            self.cam_obj.data.lens = 70.0

        # 7. Switch 3D Viewport to Camera View and clean overlays
        window_region = None
        for area in context.screen.areas:
            if area.type == 'VIEW_3D':
                for space in area.spaces:
                    if space.type == 'VIEW_3D':
                        space.region_3d.view_perspective = 'CAMERA'
                        self.saved_overlays = space.overlay.show_overlays
                        space.overlay.show_overlays = False
                for r in area.regions:
                    if r.type == 'WINDOW':
                        window_region = r
                        break

        # Calculate center coordinates of 3D window region for mouse locking
        if window_region:
            self.center_x = window_region.x + window_region.width // 2
            self.center_y = window_region.y + window_region.height // 2
        else:
            self.center_x = context.window.width // 2
            self.center_y = context.window.height // 2

        # 8. Add HUD Draw Handler
        if _draw_handler is None:
            _draw_handler = bpy.types.SpaceView3D.draw_handler_add(
                draw_walkthrough_hud, (self, context), 'WINDOW', 'POST_PIXEL'
            )

        # 9. Lock cursor to center
        context.window.cursor_warp(self.center_x, self.center_y)
        self._warped = True
        context.window.cursor_modal_set('CROSSHAIR')

        # 10. Start modal timer (approx. 60 Hz physics tick)
        self._timer = context.window_manager.event_timer_add(0.016, window=context.window)
        context.window_manager.modal_handler_add(self)

        props.is_walking = True
        _ACTIVE_MODAL = self
        self.last_time = time.time()

        self.report({'INFO'}, "Hinjawadi Walkthrough Started! Press ESC to exit.")
        return {'RUNNING_MODAL'}

    def cleanup(self, context):
        global _ACTIVE_MODAL, _draw_handler
        props = context.scene.hinjawadi_walkthrough
        props.is_walking = False
        _ACTIVE_MODAL = None

        # Remove timer
        if self._timer:
            context.window_manager.event_timer_remove(self._timer)
            self._timer = None

        # Remove HUD Draw Handler
        if _draw_handler:
            bpy.types.SpaceView3D.draw_handler_remove(_draw_handler, 'WINDOW')
            _draw_handler = None

        # Restore mouse cursor
        context.window.cursor_modal_restore()

        # Restore camera focal length
        if self.cam_obj and hasattr(self.cam_obj, "data"):
            self.cam_obj.data.lens = self.saved_lens

        # Restore animation action if one was attached
        if self.cam_obj and self.saved_action:
            if self.cam_obj.animation_data:
                self.cam_obj.animation_data.action = self.saved_action

        # Restore viewport overlays
        for area in context.screen.areas:
            if area.type == 'VIEW_3D':
                for space in area.spaces:
                    if space.type == 'VIEW_3D':
                        space.overlay.show_overlays = self.saved_overlays

        # Force redraw
        for area in context.screen.areas:
            if area.type == 'VIEW_3D':
                area.tag_redraw()

    def modal(self, context, event):
        props = context.scene.hinjawadi_walkthrough

        # Exit if stop was requested externally or via ESC
        if not props.is_walking or (event.type == 'ESC' and event.value == 'PRESS'):
            self.cleanup(context)
            self.report({'INFO'}, "Walkthrough stopped.")
            return {'FINISHED'}

        # Reset camera to start on 'R' key
        if event.type == 'R' and event.value == 'PRESS':
            if props.has_stored_init and self.cam_obj:
                self.cam_obj.location = Vector(props.init_loc)
                self.cam_obj.rotation_euler = Euler(props.init_rot, 'XYZ')
                forward = (self.cam_obj.matrix_world.to_3x3() @ Vector((0, 0, -1))).normalized()
                self.yaw = math.atan2(-forward.x, forward.y)
                self.pitch = math.asin(max(-1.0, min(1.0, forward.z)))
                self.vertical_vel = 0.0
                context.area.tag_redraw()
            return {'RUNNING_MODAL'}

        # Quick Speed presets: 1=Walk (3 m/s), 2=Normal (8 m/s), 3=Fast (18 m/s), 4=Turbo (35 m/s)
        if event.value == 'PRESS':
            if event.type in {'ONE', 'NUMPAD_1'}:
                props.walk_speed = 3.0
                props.sprint_speed = 8.0
                context.area.tag_redraw()
                return {'RUNNING_MODAL'}
            elif event.type in {'TWO', 'NUMPAD_2'}:
                props.walk_speed = 8.0
                props.sprint_speed = 22.0
                context.area.tag_redraw()
                return {'RUNNING_MODAL'}
            elif event.type in {'THREE', 'NUMPAD_3'}:
                props.walk_speed = 18.0
                props.sprint_speed = 45.0
                context.area.tag_redraw()
                return {'RUNNING_MODAL'}
            elif event.type in {'FOUR', 'NUMPAD_4'}:
                props.walk_speed = 35.0
                props.sprint_speed = 80.0
                context.area.tag_redraw()
                return {'RUNNING_MODAL'}

        # Speed adjustment via Mouse Wheel: step by 2.0 m/s
        if event.type == 'WHEELUPMOUSE' and event.value == 'PRESS':
            props.walk_speed = min(100.0, props.walk_speed + 2.0)
            props.sprint_speed = props.walk_speed * 2.5
            context.area.tag_redraw()
            return {'RUNNING_MODAL'}

        if event.type == 'WHEELDOWNMOUSE' and event.value == 'PRESS':
            props.walk_speed = max(1.0, props.walk_speed - 2.0)
            props.sprint_speed = max(props.walk_speed * 1.5, props.sprint_speed)
            context.area.tag_redraw()
            return {'RUNNING_MODAL'}

        # Track keyboard movement states (WASD, Arrow Keys, Q/E, Sprint, Jump)
        if event.type in {
            'W', 'S', 'A', 'D',
            'UP_ARROW', 'DOWN_ARROW', 'LEFT_ARROW', 'RIGHT_ARROW',
            'Q', 'E',
            'LEFT_SHIFT', 'RIGHT_SHIFT',
            'SPACE'
        }:
            if event.value == 'PRESS':
                self.keys.add(event.type)
            elif event.value == 'RELEASE':
                self.keys.discard(event.type)
            return {'RUNNING_MODAL'}

        # Handle Mouse Look
        if event.type == 'MOUSEMOVE':
            if self._warped:
                self._warped = False
                return {'RUNNING_MODAL'}

            dx = event.mouse_x - self.center_x
            dy = event.mouse_y - self.center_y

            if abs(dx) > 0 or abs(dy) > 0:
                sens = props.mouse_sensitivity * 0.0016
                self.yaw -= dx * sens
                self.pitch += dy * sens

                # Clamp pitch to prevent camera flip (-85 deg to +85 deg)
                self.pitch = max(-1.48, min(1.48, self.pitch))

                # Update camera rotation in XYZ Euler (looking +Y when yaw=0, pitch=0)
                if self.cam_obj:
                    self.cam_obj.rotation_euler = Euler((math.pi / 2 + self.pitch, 0.0, self.yaw), 'XYZ')

                # Re-center cursor to prevent reaching screen boundaries
                context.window.cursor_warp(self.center_x, self.center_y)
                self._warped = True
                context.area.tag_redraw()

            return {'RUNNING_MODAL'}

        # Physics & Movement Tick (runs on TIMER event)
        if event.type == 'TIMER':
            now = time.time()
            dt = now - self.last_time if self.last_time > 0 else 0.016
            dt = max(0.001, min(0.20, dt)) # accurately scale movement to actual elapsed time
            self.last_time = now

            if not self.cam_obj:
                return {'RUNNING_MODAL'}

            # Keyboard look rotation (Q = turn left, E = turn right)
            turn_speed = 1.8  # radians/sec (~103 deg/sec)
            rotated_keyboard = False
            if 'Q' in self.keys:
                self.yaw += turn_speed * dt
                rotated_keyboard = True
            if 'E' in self.keys:
                self.yaw -= turn_speed * dt
                rotated_keyboard = True
            if rotated_keyboard:
                self.cam_obj.rotation_euler = Euler((math.pi / 2 + self.pitch, 0.0, self.yaw), 'XYZ')

            depsgraph = context.evaluated_depsgraph_get()
            pos = self.cam_obj.location.copy()

            # Determine movement speed (Walk vs Sprint)
            is_sprinting = bool(self.keys & {'LEFT_SHIFT', 'RIGHT_SHIFT'})
            current_speed = props.sprint_speed if is_sprinting else props.walk_speed

            # Calculate movement vectors in horizontal XY plane (ENU)
            forward_h = Vector((-math.sin(self.yaw), math.cos(self.yaw), 0.0)).normalized()
            right_h = Vector((math.cos(self.yaw), math.sin(self.yaw), 0.0)).normalized()

            # Support BOTH WASD and Keyboard Arrow Keys (Up, Down, Left, Right)
            move_dir = Vector((0.0, 0.0, 0.0))
            if 'W' in self.keys or 'UP_ARROW' in self.keys:
                move_dir += forward_h
            if 'S' in self.keys or 'DOWN_ARROW' in self.keys:
                move_dir -= forward_h
            if 'A' in self.keys or 'LEFT_ARROW' in self.keys:
                move_dir -= right_h
            if 'D' in self.keys or 'RIGHT_ARROW' in self.keys:
                move_dir += right_h

            # Ground elevation probe
            ray_down_origin = Vector((pos.x, pos.y, pos.z + 1.5))
            hit_g, loc_g, norm_g, _, obj_g, _ = context.scene.ray_cast(
                depsgraph, ray_down_origin, Vector((0, 0, -1)), distance=35.0
            )

            ground_z = loc_g.z if (hit_g and obj_g != self.cam_obj) else 0.0
            target_eye_z = ground_z + props.eye_height

            # Horizontal movement & obstacle collision
            if move_dir.length_squared > 1e-5:
                move_dir.normalize()
                displacement = move_dir * current_speed * dt

                if props.use_collision:
                    probe_dist = max(0.45, current_speed * dt + 0.2)
                    can_move = True
                    collision_normal = None

                    # Single forward probe at waist height (0.8m above ground)
                    probe_origin = Vector((pos.x, pos.y, ground_z + 0.8))
                    hit_c, loc_c, norm_c, _, obj_c, _ = context.scene.ray_cast(
                        depsgraph, probe_origin, move_dir, distance=probe_dist
                    )

                    if hit_c and obj_c != self.cam_obj:
                        # Check if obstacle is a step/stair (step <= 0.35m)
                        step_check_origin = Vector((pos.x + move_dir.x * 0.4, pos.y + move_dir.y * 0.4, pos.z + 1.2))
                        hit_step, loc_step, _, _, obj_step, _ = context.scene.ray_cast(
                            depsgraph, step_check_origin, Vector((0, 0, -1)), distance=10.0
                        )
                        step_rise = (loc_step.z - ground_z) if (hit_step and obj_step != self.cam_obj) else 999.0

                        if 0.0 < step_rise <= 0.35:
                            can_move = True
                        else:
                            can_move = False
                            collision_normal = norm_c

                    if can_move:
                        pos.x += displacement.x
                        pos.y += displacement.y
                    elif collision_normal:
                        # Smooth wall sliding along tangent
                        slide = displacement - collision_normal * (displacement.dot(collision_normal))
                        slide.z = 0.0
                        if slide.length_squared > 1e-6:
                            pos.x += slide.x
                            pos.y += slide.y
                else:
                    pos.x += displacement.x
                    pos.y += displacement.y

            # Gravity, Jumping, and Vertical Position
            if props.use_gravity:
                # Handle Jump impulse
                if 'SPACE' in self.keys and self.on_ground:
                    self.vertical_vel = 4.2  # Approx 0.9m jump height
                    self.on_ground = False

                # Apply Gravity acceleration (-9.81 m/s²)
                self.vertical_vel -= 9.81 * dt
                pos.z += self.vertical_vel * dt

                # Floor landing & stair climbing
                if pos.z <= target_eye_z or (self.on_ground and abs(pos.z - target_eye_z) < 0.4):
                    pos.z = target_eye_z
                    self.vertical_vel = 0.0
                    self.on_ground = True
                else:
                    self.on_ground = False
            else:
                # Snap smoothly to eye height above surface
                pos.z = target_eye_z
                self.vertical_vel = 0.0
                self.on_ground = True

            # Apply final position to camera
            self.cam_obj.location = pos
            context.area.tag_redraw()
            return {'RUNNING_MODAL'}

        return {'RUNNING_MODAL'}


# ------------------------------------------------------------------------------
# 4. Start, Stop, and Reset Operators
# ------------------------------------------------------------------------------
class HINJAWADI_OT_start_walkthrough(bpy.types.Operator):
    bl_idname = "hinjawadi.start_walkthrough"
    bl_label = "START WALKTHROUGH"
    bl_description = "Start interactive first-person walkthrough from PCCRC_Walkthrough_Camera"
    bl_options = {'REGISTER'}

    def execute(self, context):
        props = context.scene.hinjawadi_walkthrough
        if props.is_walking:
            self.report({'INFO'}, "Walkthrough is already active.")
            return {'FINISHED'}

        # Invoke modal operator
        bpy.ops.hinjawadi.walkthrough_modal('INVOKE_DEFAULT')
        return {'FINISHED'}


class HINJAWADI_OT_stop_walkthrough(bpy.types.Operator):
    bl_idname = "hinjawadi.stop_walkthrough"
    bl_label = "STOP WALKTHROUGH"
    bl_description = "Stop active first-person walkthrough and restore camera settings"
    bl_options = {'REGISTER'}

    def execute(self, context):
        global _ACTIVE_MODAL
        props = context.scene.hinjawadi_walkthrough
        if not props.is_walking and _ACTIVE_MODAL is None:
            self.report({'INFO'}, "Walkthrough is not running.")
            return {'FINISHED'}

        props.is_walking = False
        if _ACTIVE_MODAL:
            _ACTIVE_MODAL.cleanup(context)

        self.report({'INFO'}, "Walkthrough stopped successfully.")
        return {'FINISHED'}


class HINJAWADI_OT_reset_camera(bpy.types.Operator):
    bl_idname = "hinjawadi.reset_camera"
    bl_label = "RESET CAMERA"
    bl_description = "Reset PCCRC_Walkthrough_Camera to the initial road starting point"
    bl_options = {'REGISTER', 'UNDO'}

    def execute(self, context):
        cam_obj = bpy.data.objects.get(CAMERA_NAME)
        if not cam_obj:
            self.report({'ERROR'}, f"Camera '{CAMERA_NAME}' not found.")
            return {'CANCELLED'}

        props = context.scene.hinjawadi_walkthrough

        cam_obj.location = DEFAULT_PCCRC_FRONT.copy()
        cam_obj.rotation_euler = Euler((math.pi / 2, 0.0, 0.0), 'XYZ')
        cam_obj.data.lens = 28.0
        props.init_loc = cam_obj.location
        props.init_rot = cam_obj.rotation_euler
        props.init_lens = cam_obj.data.lens
        props.has_stored_init = True

        global _ACTIVE_MODAL
        if _ACTIVE_MODAL:
            _ACTIVE_MODAL.yaw = 0.0
            _ACTIVE_MODAL.pitch = 0.0

        self.report({'INFO'}, f"Reset '{CAMERA_NAME}' right in front of PCCRC building: {cam_obj.location}")
        for area in context.screen.areas:
            if area.type == 'VIEW_3D':
                area.tag_redraw()
        return {'FINISHED'}


class HINJAWADI_OT_set_speed(bpy.types.Operator):
    bl_idname = "hinjawadi.set_speed"
    bl_label = "Set Walk Speed"
    bl_description = "Quickly switch walk speed preset"
    bl_options = {'INTERNAL'}

    speed: bpy.props.FloatProperty(default=8.0)
    sprint: bpy.props.FloatProperty(default=22.0)

    def execute(self, context):
        props = context.scene.hinjawadi_walkthrough
        props.walk_speed = self.speed
        props.sprint_speed = self.sprint
        for area in context.screen.areas:
            if area.type == 'VIEW_3D':
                area.tag_redraw()
        return {'FINISHED'}


# ------------------------------------------------------------------------------
# 5. Waypoints & Teleport Operator
# ------------------------------------------------------------------------------
WAYPOINTS = {
    "PCCRC_FRONT": {
        "name": "Right in Front of PCCRC (Start)",
        "loc": Vector((-82.33, -772.0, 1.65)),
        "look": Vector((-82.33, -760.0, 1.85)),
        "icon": 'OUTLINER_OB_MESH',
        "desc": "Standing directly in front of PCCRC monumental entrance steps"
    },
    "STEPS": {
        "name": "Entrance Steps & Portico",
        "loc": Vector((-82.33, -769.0, 1.95)),
        "look": Vector((-82.33, -760.0, 1.95)),
        "icon": 'OUTLINER_OB_CURVE',
        "desc": "4-tier sandstone steps and grand glazed entrance portals"
    },
    "ATRIUM": {
        "name": "Central Atrium (Ground)",
        "loc": Vector((-82.33, -755.2, 1.65)),
        "look": Vector((-82.33, -745.0, 1.65)),
        "icon": 'HOME',
        "desc": "5-story atrium, polished stone and marble star inlays"
    },
    "GALLERY_L2": {
        "name": "Level 2 Gallery Balcony",
        "loc": Vector((-82.33, -758.0, 10.05)),
        "look": Vector((-82.33, -750.0, 10.05)),
        "icon": 'MOD_ARRAY',
        "desc": "Second floor atrium gallery with stainless handrails"
    },
    "SKYLIGHT": {
        "name": "Top Skylight & Dome",
        "loc": Vector((-82.33, -754.0, 22.65)),
        "look": Vector((-82.33, -754.0, 0.0)),
        "icon": 'LIGHT_SUN',
        "desc": "Roof level overlooking entire 5-story central void"
    },
    "ROAD": {
        "name": "Phase 1 Road Approach",
        "loc": Vector((-140.0, -740.0, 1.65)),
        "look": Vector((-110.0, -755.0, 1.65)),
        "icon": 'TRIP_POINT',
        "desc": "Starting road network looking towards PCCRC campus"
    },
}

class HINJAWADI_OT_teleport(bpy.types.Operator):
    bl_idname = "hinjawadi.teleport"
    bl_label = "Teleport to Waypoint"
    bl_description = "Instantly move camera to a specific milestone along the walkthrough route"
    bl_options = {'REGISTER', 'UNDO'}

    target: bpy.props.StringProperty(default="ROAD")

    def execute(self, context):
        wp = WAYPOINTS.get(self.target)
        if not wp:
            return {'CANCELLED'}

        cam_obj = bpy.data.objects.get(CAMERA_NAME)
        if not cam_obj:
            self.report({'ERROR'}, f"Camera '{CAMERA_NAME}' not found.")
            return {'CANCELLED'}

        cam_obj.location = wp["loc"].copy()
        look_dir = (wp["look"] - wp["loc"]).normalized()
        cam_obj.rotation_euler = look_dir.to_track_quat("-Z", "Y").to_euler()
        cam_obj.data.lens = 28.0
        context.scene.camera = cam_obj

        # If modal is currently running, synchronize its look yaw & pitch
        global _ACTIVE_MODAL
        if _ACTIVE_MODAL and _ACTIVE_MODAL.cam_obj:
            forward = (cam_obj.matrix_world.to_3x3() @ Vector((0, 0, -1))).normalized()
            _ACTIVE_MODAL.yaw = math.atan2(-forward.x, forward.y)
            _ACTIVE_MODAL.pitch = math.asin(max(-1.0, min(1.0, forward.z)))

        self.report({'INFO'}, f"Teleported to {wp['name']}")
        for area in context.screen.areas:
            if area.type == 'VIEW_3D':
                for space in area.spaces:
                    if space.type == 'VIEW_3D':
                        space.region_3d.view_perspective = 'CAMERA'
                area.tag_redraw()
        return {'FINISHED'}


# ------------------------------------------------------------------------------
# 6. UI Panels (Sidebar and Header)
# ------------------------------------------------------------------------------
def draw_panel_contents(layout, context):
    props = context.scene.hinjawadi_walkthrough
    cam_obj = bpy.data.objects.get(CAMERA_NAME)

    # 1. Main Action Button (Huge & Prominent)
    col_main = layout.column(align=True)
    col_main.scale_y = 1.35
    if not props.is_walking:
        col_main.operator("hinjawadi.walkthrough_modal", text="START WALKTHROUGH (Alt+W)", icon='PLAY')
    else:
        col_main.operator("hinjawadi.stop_walkthrough", text="STOP WALKTHROUGH (ESC)", icon='PAUSE')

    col_sub = layout.column(align=True)
    col_sub.operator("hinjawadi.reset_camera", text="RESET IN FRONT OF PCCRC (R)", icon='FILE_REFRESH')

    # 2. Camera Status
    box = layout.box()
    row = box.row()
    if cam_obj:
        row.label(text=f"Camera: {CAMERA_NAME}", icon='CAMERA_DATA')
    else:
        row.label(text=f"Missing: {CAMERA_NAME}", icon='ERROR')

    # 3. Teleport Waypoints (Instant Jump)
    box_tp = layout.box()
    box_tp.label(text="Jump / Teleport To:", icon='TRACKING')
    col_tp = box_tp.column(align=True)
    for key, wp in WAYPOINTS.items():
        op = col_tp.operator("hinjawadi.teleport", text=wp["name"], icon=wp["icon"])
        op.target = key

    # 4. Speed Presets
    layout.separator()
    col_speeds = layout.column(align=True)
    col_speeds.label(text="Speed Presets (Keys 1-4):", icon='FORWARD')
    row_sp = col_speeds.row(align=True)
    for spd, spr, lbl in [(3.0, 8.0, "Walk (1)"), (8.0, 22.0, "Normal (2)"), (18.0, 45.0, "Fast (3)"), (35.0, 80.0, "Turbo (4)")]:
        op = row_sp.operator("hinjawadi.set_speed", text=lbl)
        op.speed = spd
        op.sprint = spr

    # 5. Movement & Physics
    layout.separator()
    box_set = layout.box()
    box_set.label(text="Movement & Physics:", icon='SETTINGS')
    box_set.prop(props, "walk_speed")
    box_set.prop(props, "sprint_speed")
    box_set.prop(props, "mouse_sensitivity")
    box_set.prop(props, "eye_height")
    row_tog = box_set.row(align=True)
    row_tog.prop(props, "use_gravity", toggle=True)
    row_tog.prop(props, "use_collision", toggle=True)
    box_set.prop(props, "natural_lens")

    # 6. Controls Cheatsheet
    layout.separator()
    help_box = layout.box()
    help_box.label(text="Controls:", icon='HAND')
    help_col = help_box.column(align=True)
    help_col.scale_y = 0.85
    help_col.label(text="Alt + W : Start Walkthrough")
    help_col.label(text="Arrow Keys or W,A,S,D : Move & Strafe")
    help_col.label(text="Mouse or Q, E : Look / Rotate")
    help_col.label(text="Shift : Sprint (2.5x speed)")
    help_col.label(text="Space : Jump")
    help_col.label(text="1, 2, 3, 4 : Speed Presets")
    help_col.label(text="Mouse Wheel : Adjust Speed (+/- 2 m/s)")
    help_col.label(text="R : Reset Camera")
    help_col.label(text="ESC : Exit Walkthrough")


class VIEW3D_PT_hinjawadi_walkthrough(bpy.types.Panel):
    """Primary Sidebar panel in dedicated 'Hinjawadi Walkthrough' tab"""
    bl_space_type = 'VIEW_3D'
    bl_region_type = 'UI'
    bl_category = 'Hinjawadi Walkthrough'
    bl_label = "HINJAWADI WALKTHROUGH"

    def draw(self, context):
        draw_panel_contents(self.layout, context)


class VIEW3D_PT_hinjawadi_walkthrough_viewtab(bpy.types.Panel):
    """Secondary Sidebar panel in standard 'View' tab for instant discoverability"""
    bl_space_type = 'VIEW_3D'
    bl_region_type = 'UI'
    bl_category = 'View'
    bl_label = "Hinjawadi Walkthrough"
    bl_options = {'DEFAULT_CLOSED'}

    def draw(self, context):
        draw_panel_contents(self.layout, context)


def draw_header_button(self, context):
    layout = self.layout
    props = getattr(context.scene, "hinjawadi_walkthrough", None)
    if not props:
        return
    row = layout.row(align=True)
    if not props.is_walking:
        row.operator("hinjawadi.walkthrough_modal", text="WALKTHROUGH (Alt+W)", icon='PLAY')
    else:
        row.operator("hinjawadi.stop_walkthrough", text="STOP WALK (ESC)", icon='PAUSE')
    row.operator("hinjawadi.reset_camera", text="", icon='FILE_REFRESH')


def draw_view_menu(self, context):
    layout = self.layout
    layout.separator()
    layout.operator("hinjawadi.walkthrough_modal", text="Start Hinjawadi Walkthrough (Alt+W)", icon='PLAY')
    layout.operator("hinjawadi.reset_camera", text="Reset in Front of PCCRC (R)", icon='FILE_REFRESH')


# ------------------------------------------------------------------------------
# 7. Keymaps & Registration
# ------------------------------------------------------------------------------
classes = (
    HinjawadiWalkthroughProperties,
    HINJAWADI_OT_walkthrough_modal,
    HINJAWADI_OT_start_walkthrough,
    HINJAWADI_OT_stop_walkthrough,
    HINJAWADI_OT_reset_camera,
    HINJAWADI_OT_set_speed,
    HINJAWADI_OT_teleport,
    VIEW3D_PT_hinjawadi_walkthrough,
    VIEW3D_PT_hinjawadi_walkthrough_viewtab,
)

_keymaps = []

def register_keymaps():
    wm = bpy.context.window_manager
    kc = getattr(wm, "keyconfigs", None)
    if not kc:
        return
    addon_kc = getattr(kc, "addon", None)
    if not addon_kc:
        return
    km = addon_kc.keymaps.new(name='3D View', space_type='VIEW_3D')
    kmi = km.keymap_items.new("hinjawadi.walkthrough_modal", 'W', 'PRESS', alt=True)
    _keymaps.append((km, kmi))

def unregister_keymaps():
    for km, kmi in _keymaps:
        try:
            km.keymap_items.remove(kmi)
        except Exception:
            pass
    _keymaps.clear()

def register():
    for cls in classes:
        bpy.utils.register_class(cls)
    bpy.types.Scene.hinjawadi_walkthrough = bpy.props.PointerProperty(type=HinjawadiWalkthroughProperties)
    
    # Prepend prominent button to top-left of 3D Viewport Header
    bpy.types.VIEW3D_HT_header.prepend(draw_header_button)
    # Add to View menu
    bpy.types.VIEW3D_MT_view.append(draw_view_menu)
    # Register Alt+W shortcut
    register_keymaps()
    
    print("Hinjawadi Walkthrough Controller registered successfully.")

def unregister():
    global _draw_handler
    if _draw_handler:
        try:
            bpy.types.SpaceView3D.draw_handler_remove(_draw_handler, 'WINDOW')
        except Exception:
            pass
        _draw_handler = None

    unregister_keymaps()

    try:
        bpy.types.VIEW3D_HT_header.remove(draw_header_button)
    except Exception:
        pass
    try:
        bpy.types.VIEW3D_MT_view.remove(draw_view_menu)
    except Exception:
        pass

    if hasattr(bpy.types.Scene, "hinjawadi_walkthrough"):
        del bpy.types.Scene.hinjawadi_walkthrough

    for cls in reversed(classes):
        try:
            bpy.utils.unregister_class(cls)
        except Exception:
            pass
    print("Hinjawadi Walkthrough Controller unregistered.")

if __name__ == "__main__":
    register()

