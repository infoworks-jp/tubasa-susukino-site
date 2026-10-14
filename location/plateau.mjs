import * as THREE from "three";
export const plateauCredit =
  "出典：札幌市・国土交通省 PLATEAU（2020年度）を加工";
export const plateauSource = {
  title: "3D都市モデル（Project PLATEAU）札幌市（2020年度）",
  url: "https://www.geospatial.jp/ckan/dataset/plateau-01100-sapporo-shi-2020",
  policy: "https://www.mlit.go.jp/plateau/site-policy/",
  license: "CC BY 4.0 (PLATEAU site policy compatible use)",
  year: 2020,
  adaptation:
    "85 textured LOD2 buildings selected, building bases flattened, UV atlases repacked losslessly; runtime texture contours and halftone. Historical photography, not current shop information.",
};
function inside(x, z, ring, padding = 0.8) {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i],
      b = ring[j];
    if (
      a[1] > z !== b[1] > z &&
      x < ((b[0] - a[0]) * (z - a[1])) / (b[1] - a[1]) + a[0]
    )
      hit = !hit;
    const dx = b[0] - a[0],
      dz = b[1] - a[1],
      t = THREE.MathUtils.clamp(
        ((x - a[0]) * dx + (z - a[1]) * dz) / (dx * dx + dz * dz || 1),
        0,
        1,
      );
    if (Math.hypot(x - a[0] - t * dx, z - a[1] - t * dz) < padding) return true;
  }
  return hit;
}
// Remove overlapping invented walls/windows before inserting photographed models.
// Use each measured model's footprint hull rather than a blanket rectangular cut.
export function replaceProceduralMasses(mesh, features) {
  if (!["buildings", "buildingsDetail"].includes(mesh.name)) return;
  mesh.updateWorldMatrix(true, false);
  const source = mesh.geometry.index
      ? mesh.geometry.toNonIndexed()
      : mesh.geometry.clone(),
    pos = source.attributes.position;
  const candidates = features.map((f) => ({
    ring: f.hull,
    minX: Math.min(...f.hull.map((p) => p[0])) - 0.8,
    maxX: Math.max(...f.hull.map((p) => p[0])) + 0.8,
    minZ: Math.min(...f.hull.map((p) => p[1])) - 0.8,
    maxZ: Math.max(...f.hull.map((p) => p[1])) + 0.8,
  }));
  const keep = [],
    points = Array.from({ length: 3 }, () => new THREE.Vector3());
  let removed = 0;
  const replaced = (x, z) =>
    candidates.some(
      (f) =>
        x >= f.minX &&
        x <= f.maxX &&
        z >= f.minZ &&
        z <= f.maxZ &&
        inside(x, z, f.ring),
    );
  for (let i = 0; i < pos.count; i += 3) {
    for (let j = 0; j < 3; j++)
      points[j].fromBufferAttribute(pos, i + j).applyMatrix4(mesh.matrixWorld);
    const center = points
      .reduce((v, p) => v.add(p), new THREE.Vector3())
      .multiplyScalar(1 / 3);
    if (replaced(center.x, center.z) || points.some((p) => replaced(p.x, p.z)))
      removed++;
    else keep.push(i, i + 1, i + 2);
  }
  const g = new THREE.BufferGeometry();
  for (const [name, a] of Object.entries(source.attributes)) {
    const values = new a.array.constructor(keep.length * a.itemSize);
    for (let i = 0; i < keep.length; i++)
      for (let j = 0; j < a.itemSize; j++)
        values[i * a.itemSize + j] = a.array[keep[i] * a.itemSize + j];
    g.setAttribute(
      name,
      new THREE.BufferAttribute(values, a.itemSize, a.normalized),
    );
  }
  g.computeBoundingBox();
  g.computeBoundingSphere();
  mesh.geometry.dispose();
  source.dispose();
  mesh.geometry = g;
  return removed;
}
export async function loadPlateau(loader, clippingPlanes) {
  const group = new THREE.Group();
  group.name = "Susukino / PLATEAU photographed architecture 2020";
  group.userData = { ...plateauSource };
  const features = [],
    materials = [],
    photographs = [];
  const tiles = await Promise.all(["data30", "data44"].map(
    (name) => loader.loadAsync("./assets/plateau/" + name + ".geometry.glb"),
  ));
  for (const [index, result] of tiles.entries()) {
    features.push(...result.userData.buildings);
    result.scene.traverse((o) => {
      if (!o.isMesh) return;
      const photographic = o.material.userData.deferredPhotograph;
      if (photographic) {
        o.material = new THREE.MeshBasicMaterial({
          side: THREE.DoubleSide,
        });
        photographs.push({ material: o.material, tile: ["data30", "data44"][index] });
        o.geometry.setAttribute(
          "inkArtwork",
          new THREE.Float32BufferAttribute(
            new Float32Array(o.geometry.attributes.position.count).fill(0.4),
            1,
          ),
        );
      }
      if (!photographic)
        o.geometry.setAttribute(
          "inkArtwork",
          new THREE.Float32BufferAttribute(
            new Float32Array(o.geometry.attributes.position.count).fill(0.1),
            1,
          ),
        );
      o.material.clippingPlanes = clippingPlanes;
      o.material.clipShadows = true;
      o.castShadow = true;
      o.receiveShadow = true;
      o.material.userData.plateau = true;
      materials.push(o.material);
    });
    group.add(result.scene);
  }
  group.userData.buildings = features;
  group.userData.buildingCount = features.length;
  return { group, features, materials, photographs };
}

// Geometry and photographic bytes are split without changing either. Keeping
// exact collision geometry in the first stage prevents later camera jumps.
export async function loadPlateauTextures(plateau) {
  const loader = new THREE.TextureLoader();
  const textures = new Map(await Promise.all(["data30", "data44"].map(async (tile) => {
    const texture = await loader.loadAsync("./assets/plateau/" + tile + ".webp");
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return [tile, texture];
  })));
  for (const {material, tile} of plateau.photographs) {
    material.map = textures.get(tile);
    material.needsUpdate = true;
  }
}
