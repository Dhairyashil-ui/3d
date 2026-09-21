import json

with open("public/institutional_reconstruction.glb", "rb") as f:
    f.seek(12)
    chunk0_len = int.from_bytes(f.read(4), "little")
    chunk0_type = int.from_bytes(f.read(4), "little")
    gltf = json.loads(f.read(chunk0_len).decode("utf-8"))

materials = gltf.get("materials", [])
print(f"Total materials in GLTF: {len(materials)}")
for i, m in enumerate(materials):
    pbr = m.get("pbrMetallicRoughness", {})
    bc = pbr.get("baseColorFactor", [1,1,1,1])
    print(f"  [{i}] {m.get('name')}: baseColor={[round(c, 3) for c in bc]}, rough={pbr.get('roughnessFactor')}, metal={pbr.get('metallicFactor')}")
