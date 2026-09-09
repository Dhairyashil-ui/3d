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
            # Check if near central portico entrance (x around 0, y between 2 and 10, z between -10 and 5)
            if abs(world_min[0]) < 4 and abs(world_max[0]) < 4:
                if world_max[1] > 2.5 and world_min[1] < 10.0:
                    if world_max[2] > -10.0 and world_min[2] < 5.0:
                        print(f'Node {n_idx}: "{name}" Y:[{world_min[1]:.2f}, {world_max[1]:.2f}] X:[{world_min[0]:.2f}, {world_max[0]:.2f}] Z:[{world_min[2]:.2f}, {world_max[2]:.2f}]')
