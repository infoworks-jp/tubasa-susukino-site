// Preserve original vertices in the two approved arrival views. The complete
// original model is loaded after first paint; this file is a spatial subset,
// never a simplified or lower-detail replacement.
import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { gzipSync } from "node:zlib";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { MeshoptEncoder } from "meshoptimizer";
import { refineLandmarkMasses } from "../location/illustrated-street.mjs";
import { replaceProceduralMasses } from "../location/plateau.mjs";
import { routeBuildings } from "../location/route-facades.mjs";

globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((v) => {
      this.result = v;
      this.onloadend?.();
    });
  }
};
const raw = await fs.readFile(
  new URL("../location/susukino-detail.glb", import.meta.url),
);
const gltf = await new GLTFLoader()
  .setMeshoptDecoder(MeshoptDecoder)
  .parseAsync(
    raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength),
    "",
  );
const features = [];
for (const tile of ["data30", "data44"]) {
  const b = await fs.readFile(
    new URL(`../location/assets/plateau/${tile}.geometry.glb`, import.meta.url),
  );
  features.push(
    ...JSON.parse(b.subarray(20, 20 + b.readUInt32LE(12))).extras.buildings,
  );
}
const portrait = process.argv.includes("--portrait");
const cameraSpecs = portrait
  ? [[[-120, 26, -50], [-26, 21, -14], 52, 1.05]]
  : [
      [[-75, 16, -50], [-18, 20, -14], 66, 2.8],
      [[-120, 26, -50], [-26, 21, -14], 58, 0.85],
    ];
const frustums = cameraSpecs.map(([position, target, fov, aspect]) => {
  const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 2000);
  camera.position.set(...position);
  camera.lookAt(...target);
  camera.updateMatrixWorld();
  return new THREE.Frustum().setFromProjectionMatrix(
    new THREE.Matrix4().multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse,
    ),
  );
});
const nearCamera = new THREE.Box3(
  new THREE.Vector3(-145, -20, -75),
  new THREE.Vector3(portrait ? -100 : -50, 80, -25),
);
const viewpoints = cameraSpecs.map((c) => new THREE.Vector3(...c[0]));
// A triangle is omitted only when all three rays cross the interior of one
// opaque, convex wall rectangle. Insets protect silhouettes and camera guards.
const walls = routeBuildings.flatMap(({ ring, height }) =>
  ring.map((a, i) => ({ a, b: ring[(i + 1) % ring.length], height })),
);
function hidden(points, camera) {
  return walls.some(({ a, b, height }) => {
    const dx = b[0] - a[0],
      dz = b[1] - a[1],
      length2 = dx * dx + dz * dz;
    return points.every((p) => {
      const rx = p.x - camera.x,
        ry = p.y - camera.y,
        rz = p.z - camera.z;
      const den = -dz * rx + dx * rz;
      if (Math.abs(den) < 1e-8) return false;
      const t = (-dz * (a[0] - camera.x) + dx * (a[1] - camera.z)) / den;
      if (t <= 0 || t >= 0.995) return false;
      const x = camera.x + t * rx,
        z = camera.z + t * rz,
        y = camera.y + t * ry;
      const u = ((x - a[0]) * dx + (z - a[1]) * dz) / length2;
      return u > 0.08 && u < 0.92 && y > 1 && y < height - 1;
    });
  });
}
gltf.scene.updateMatrixWorld(true);
const meshes = [];
gltf.scene.traverse((o) => {
  if (o.isMesh) meshes.push(o);
});
let before = 0,
  after = 0;
for (const mesh of meshes) {
  if (["buildings", "buildingsDetail"].includes(mesh.name)) {
    refineLandmarkMasses(mesh);
    mesh.userData.arrivalReplacedTriangles = replaceProceduralMasses(
      mesh,
      features,
    );
    mesh.userData.arrivalPrepared = true;
  }
  const source = mesh.geometry;
  before += source.attributes.position.count;
  if (mesh.isInstancedMesh) {
    source.computeBoundingBox();
    let visible = false;
    for (let i = 0; i < mesh.count; i++) {
      const m = new THREE.Matrix4();
      mesh.getMatrixAt(i, m);
      const box = source.boundingBox
        .clone()
        .applyMatrix4(m)
        .applyMatrix4(mesh.matrixWorld);
      const center = box.getCenter(new THREE.Vector3());
      if (center.x > -130 && center.x < 60 && center.z > -125 && center.z < 65)
        continue;
      if (
        frustums.some((f) => f.intersectsBox(box)) &&
        viewpoints.some((p) => box.distanceToPoint(p) < 115)
      ) {
        visible = true;
        break;
      }
    }
    if (!visible) mesh.removeFromParent();
    else after += source.attributes.position.count;
    continue;
  }
  // Keep the mapped solid buildings whole for identical camera collision.
  if (mesh.name === "buildings") {
    after += source.attributes.position.count;
    continue;
  }
  const pos = source.attributes.position,
    index = source.index;
  const keep = [],
    points = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
  for (let i = 0; i < (index?.count ?? pos.count); i += 3) {
    const ids = [0, 1, 2].map((j) => (index ? index.getX(i + j) : i + j));
    points.forEach((p, j) =>
      p.fromBufferAttribute(pos, ids[j]).applyMatrix4(mesh.matrixWorld),
    );
    const box = new THREE.Box3().setFromPoints(points);
    if (
      frustums.some(
        (f, i) => f.intersectsBox(box) && !hidden(points, viewpoints[i]),
      ) ||
      nearCamera.intersectsBox(box)
    )
      keep.push(...ids);
  }
  if (!keep.length) {
    mesh.removeFromParent();
    continue;
  }
  const unique = [...new Set(keep)],
    remap = new Map(unique.map((id, i) => [id, i]));
  const geometry = new THREE.BufferGeometry();
  for (const [name, a] of Object.entries(source.attributes)) {
    const values = new a.array.constructor(unique.length * a.itemSize);
    const stride = a.isInterleavedBufferAttribute ? a.data.stride : a.itemSize,
      offset = a.isInterleavedBufferAttribute ? a.offset : 0;
    unique.forEach((id, i) => {
      for (let c = 0; c < a.itemSize; c++)
        values[i * a.itemSize + c] = a.array[id * stride + offset + c];
    });
    geometry.setAttribute(
      name,
      new THREE.BufferAttribute(values, a.itemSize, a.normalized),
    );
  }
  geometry.setIndex(keep.map((id) => remap.get(id)));
  mesh.geometry = geometry;
  after += unique.length;
}
const exported = Buffer.from(
  await new GLTFExporter().parseAsync(gltf.scene, {
    binary: true,
    onlyVisible: false,
  }),
);
const jsonLength = exported.readUInt32LE(12),
  g = JSON.parse(exported.subarray(20, 20 + jsonLength)),
  bin = exported.subarray(28 + jsonLength);
await MeshoptEncoder.ready;
const parts = [];
let encodedOffset = 0,
  decodedOffset = 0;
for (const [vi, view] of g.bufferViews.entries()) {
  const accessor = g.accessors.find((a) => a.bufferView === vi);
  const indices = view.target === 34963;
  const stride = indices
    ? accessor.componentType === 5123
      ? 2
      : 4
    : view.byteStride || 4;
  const data = Buffer.alloc(
    indices ? accessor.count * stride : view.byteLength,
  );
  bin.copy(data, 0, view.byteOffset || 0, (view.byteOffset || 0) + data.length);
  const encoded = Buffer.from(
    MeshoptEncoder.encodeGltfBuffer(
      data,
      data.length / stride,
      stride,
      indices ? "TRIANGLES" : "ATTRIBUTES",
    ),
  );
  view.buffer = 1;
  view.byteOffset = decodedOffset;
  view.byteLength = data.length;
  view.extensions = {
    EXT_meshopt_compression: {
      buffer: 0,
      byteOffset: encodedOffset,
      byteLength: encoded.length,
      byteStride: stride,
      count: data.length / stride,
      mode: indices ? "TRIANGLES" : "ATTRIBUTES",
      filter: "NONE",
    },
  };
  const padding = Buffer.alloc((4 - (encoded.length % 4)) % 4);
  parts.push(encoded, padding);
  encodedOffset += encoded.length + padding.length;
  decodedOffset += data.length + ((4 - (data.length % 4)) % 4);
}
g.buffers = [
  { byteLength: encodedOffset },
  {
    byteLength: decodedOffset,
    extensions: { EXT_meshopt_compression: { fallback: true } },
  },
];
g.extensionsUsed = [
  ...new Set([...(g.extensionsUsed || []), "EXT_meshopt_compression"]),
];
g.extensionsRequired = [
  ...new Set([...(g.extensionsRequired || []), "EXT_meshopt_compression"]),
];
const json = Buffer.from(JSON.stringify(g)),
  padded = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 32)]),
  header = Buffer.alloc(20),
  bh = Buffer.alloc(8);
header.write("glTF");
header.writeUInt32LE(2, 4);
header.writeUInt32LE(28 + padded.length + encodedOffset, 8);
header.writeUInt32LE(padded.length, 12);
header.write("JSON", 16);
bh.writeUInt32LE(encodedOffset);
bh.write("BIN\0", 4);
const output = Buffer.concat([header, padded, bh, ...parts]);
const destination = new URL(
  portrait
    ? "../location/susukino-arrival-portrait.glb"
    : "../location/susukino-arrival.glb",
  import.meta.url,
);
assert.ok(
  gzipSync(output).length < 1800000,
  "Arrival geometry must fit the measured initial transfer budget",
);
if (process.argv.includes("--check"))
  assert.deepEqual(
    await fs.readFile(destination),
    output,
    "Regenerate arrival model after source changes",
  );
else await fs.writeFile(destination, output);
console.log(
  JSON.stringify({
    portrait,
    beforeVertices: before,
    arrivalVertices: after,
    sourceBytes: raw.length,
    arrivalBytes: output.length,
  }),
);
