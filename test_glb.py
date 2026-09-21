import json

with open("public/institutional_reconstruction.glb", "rb") as f:
    f.seek(12)
    chunk0_len = int.from_bytes(f.read(4), "little")
    chunk0_type = int.from_bytes(f.read(4), "little")
    gltf = json.loads(f.read(chunk0_len).decode("utf-8"))

nodes = gltf.get("nodes", [])

filter_keywords = [
    'glossy tile', 'stone paving', 'planter', 'plant leaf', 'plant stem',
    'concrete platform', 'circular platform', 'stone inlay', 'polished stone ground',
    'atrium polished', 'burgundy planter', 'sparse low planting', 'planting',
    'circular raised stone', 'central circular concrete platform',
    'circular edging mortar seam', 'circular bed soil'
]

parent_map = {}
for p_idx, n in enumerate(nodes):
    for c_idx in n.get("children", []):
        parent_map[c_idx] = p_idx

non_ac = []
for i, n in enumerate(nodes):
    name = n.get("name", "")
    p_idx = parent_map.get(i)
    p_name = nodes[p_idx].get("name", "") if p_idx is not None else ""
    ln = (name + " " + p_name).lower()
    if any(k in ln for k in filter_keywords):
        continue
    if not name.startswith("AC "):
        non_ac.append((i, name, n.get("mesh")))

print(f"Non-AC unmatched nodes: {len(non_ac)}")
# Group by prefix
prefixes = {}
for idx, name, mesh in non_ac:
    prefix = name.split(".")[0]
    prefixes[prefix] = prefixes.get(prefix, 0) + 1

for pfx, count in sorted(prefixes.items(), key=lambda x: -x[1])[:50]:
    print(f"  {pfx}: {count}")
