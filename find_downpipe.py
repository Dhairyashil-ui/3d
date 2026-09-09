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
    if mesh_idx is None: continue
    name = node.get('name', '')
    if any(k in name.lower() for k in ['pipe', 'downpipe', 'drain', 'gutter', 'column shaft']):
        m = meshes[mesh_idx]
        pos_acc_idx = m['primitives'][0]['attributes'].get('POSITION')
        if pos_acc_idx is not None:
            acc = accessors[pos_acc_idx]
            min_val = acc.get('min', [0,0,0])
            max_val = acc.get('max', [0,0,0])
            trans = node.get('translation', [0,0,0])
            w_min = [min_val[i] + trans[i] for i in range(3)]
            w_max = [max_val[i] + trans[i] for i in range(3)]
            print(f'{n_idx}: "{name}" Y:[{w_min[1]:.2f}, {w_max[1]:.2f}] X:[{w_min[0]:.2f}, {w_max[0]:.2f}] Z:[{w_min[2]:.2f}, {w_max[2]:.2f}]')
