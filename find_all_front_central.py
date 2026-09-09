import json, struct

with open('public/h.glb', 'rb') as f:
    data = f.read()

chunk_len, chunk_type = struct.unpack('<II', data[12:20])
gltf = json.loads(data[20:20+chunk_len])
accessors = gltf['accessors']
meshes = gltf.get('meshes', [])
nodes = gltf.get('nodes', [])

for n_idx, node in enumerate(nodes):
    mesh_idx = node.get('mesh')
    if mesh_idx is None:
        continue
    name = node.get('name', f'mesh_{mesh_idx}')
    m = meshes[mesh_idx]
    for p in m.get('primitives', []):
        pos_acc_idx = p.get('attributes', {}).get('POSITION')
        if pos_acc_idx is not None:
            acc = accessors[pos_acc_idx]
            min_val = acc.get('min', [0,0,0])
            max_val = acc.get('max', [0,0,0])
            trans = node.get('translation', [0,0,0])
            world_min = [min_val[i] + trans[i] for i in range(3)]
            world_max = [max_val[i] + trans[i] for i in range(3)]
            # If anywhere near front facade (z > -6) and x between -5 and 5
            if abs(world_min[0]) < 4.0 and abs(world_max[0]) < 4.0 and world_min[2] > -6.0:
                print(f'{n_idx}: "{name}" Y:[{world_min[1]:.2f}, {world_max[1]:.2f}] X:[{world_min[0]:.2f}, {world_max[0]:.2f}] Z:[{world_min[2]:.2f}, {world_max[2]:.2f}]')
