import bpy
import mathutils
import math
import os

def create_combined_building():
    inner_blend = r"c:\Users\Dhairyashil\website\Innerviewpccrc.blend1"
    recon_blend = r"c:\Users\Dhairyashil\website\Building_Reconstruction.blend"
    output_blend_main = r"c:\Users\Dhairyashil\website\Innerviewpccrc.blend"
    output_blend_named = r"c:\Users\Dhairyashil\website\Innerviewpccrc_combined.blend"
    
    print(f"Loading base inner view: {inner_blend}")
    bpy.ops.wm.open_mainfile(filepath=inner_blend)
    
    initial_obj_count = len(bpy.data.objects)
    print(f"Initial inner objects count: {initial_obj_count}")
    
    # Check collections from reconstruction blend
    with bpy.data.libraries.load(recon_blend, link=False) as (data_from, data_to):
        data_to.collections = list(data_from.collections)
        
    print(f"Imported collections: {len(data_to.collections)}")
    
    # Y-offset to align facade with inner building entrance
    Y_OFFSET = -14.0
    
    # Link imported collections to scene and shift Y
    for col in data_to.collections:
        # Don't link empty Collection if it already exists
        if col.name == "Collection" and len(col.objects) == 0:
            continue
            
        bpy.context.scene.collection.children.link(col)
        print(f"Linking collection '{col.name}' with {len(col.objects)} objects")
        
        for obj in col.objects:
            obj.location.y += Y_OFFSET
            
        # For 08_INFERRED_Rear_Massing:
        # Keep collection for completeness, but disable visibility so the placeholder rear wall
        # does not bisect or obstruct the interior atrium!
        if col.name == "08_INFERRED_Rear_Massing":
            col.hide_viewport = True
            col.hide_render = True
            print("Set 08_INFERRED_Rear_Massing hidden in viewport and render to preserve open interior.")
            
    # Move INFERRED_central_roof to 04_Cornices_and_Ornament or make it visible so portico top is capped
    central_roof = bpy.data.objects.get("INFERRED_central_roof")
    if central_roof:
        cornice_col = bpy.data.collections.get("04_Cornices_and_Ornament")
        if cornice_col and central_roof.name not in cornice_col.objects:
            cornice_col.objects.link(central_roof)
            central_roof.hide_viewport = False
            central_roof.hide_render = False
            print("Linked INFERRED_central_roof to 04_Cornices_and_Ornament to cap the monumental portico pediment.")

    # In 09_Presentation:
    # Ensure exterior camera points properly at facade
    ext_cam = bpy.data.objects.get("Low angle facade camera")
    if ext_cam:
        print(f"Exterior camera location: {ext_cam.location}")
        
    total_objects = len(bpy.data.objects)
    print(f"Total objects after combining: {total_objects}")
    
    # Save main file
    print(f"Saving combined file to: {output_blend_main}")
    bpy.ops.wm.save_as_mainfile(filepath=output_blend_main)
    
    # Save named file
    print(f"Saving combined file to: {output_blend_named}")
    bpy.ops.wm.save_as_mainfile(filepath=output_blend_named)
    print("Files saved successfully!")

create_combined_building()
