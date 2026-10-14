import assert from "node:assert/strict";
import fs from "node:fs/promises";
import {
  projectQuad,
  atlasUV,
  photoAtlas,
  baseAtlas,
  surveyedPanels,
} from "../location/facade-projection.mjs";
import {
  routePanels,
  routeAtlases,
  routeBuildings,
  entranceAnchor,
  entrancePoint,
} from "../location/route-facades.mjs";
const allPanels = [...surveyedPanels, ...routePanels];
const corners = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
];
for (const panel of allPanels) {
  const atlas = panel.atlas || photoAtlas;
  corners.forEach(([u, v], i) => {
    const p = projectQuad(panel.q, u, v);
    assert.ok(
      Math.hypot(p[0] - panel.q[i][0], p[1] - panel.q[i][1]) < 1e-7,
      `${panel.name}: measured corner preserved`,
    );
  });
  for (let y = 0; y <= 32; y++)
    for (let x = 0; x <= 32; x++) {
      const uv = atlasUV(projectQuad(panel.q, x / 32, y / 32), atlas);
      assert.ok(
        uv.every((v) => Number.isFinite(v) && v >= 0 && v <= 1),
        `${panel.name}: UV stays in licensed crop`,
      );
      if (x < 32 && y < 32) {
        const a = projectQuad(panel.q, x / 32, y / 32),
          b = projectQuad(panel.q, (x + 1) / 32, y / 32),
          c = projectQuad(panel.q, x / 32, (y + 1) / 32);
        assert.ok(
          (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) > 0,
          `${panel.name}: no folded/mirrored texture cells`,
        );
      }
    }
  assert.ok(Math.hypot(panel.b[0] - panel.a[0], panel.b[1] - panel.a[1]) > 0.1);
}
// A perspective quadrilateral's centre is the intersection of its diagonals,
// not their coordinate average (bilinear mapping would skew photographed signs).
const trapezoid = [
  [0, 0],
  [4, 0],
  [3, 2],
  [1, 2],
];
assert.deepEqual(projectQuad(trapezoid, 0.5, 0.5), [2, 4 / 3]);
for (const atlas of [photoAtlas, baseAtlas, ...routeAtlases]) {
  const data = await fs.readFile(
    new URL("../location/" + atlas.file.slice(2), import.meta.url),
  );
  assert.equal(data.toString("ascii", 0, 4), "RIFF");
  assert.equal(data.toString("ascii", 8, 12), "WEBP");
  assert.ok(data.length < 6_000_000);
}
console.log(
  `PASS: ${allPanels.length} photo panels, exact measured corners, perspective, UV bounds, winding and licensed atlas files`,
);

// All panels along the requested route must follow their own mapped building,
// not a separately rotated floating frontage.
for (const p of routePanels) {
  const ring = routeBuildings[p.building].ring;
  for (const pt of [p.a, p.b]) {
    const distances = ring.map((a, i) => {
      const b = ring[(i + 1) % ring.length],
        dx = b[0] - a[0],
        dz = b[1] - a[1],
        t = Math.max(
          0,
          Math.min(
            1,
            ((pt[0] - a[0]) * dx + (pt[1] - a[1]) * dz) / (dx * dx + dz * dz),
          ),
        );
      return Math.hypot(pt[0] - a[0] - t * dx, pt[1] - a[1] - t * dz);
    });
    assert.ok(Math.min(...distances) < 0.001, p.name + ": same edge as parent");
  }
}
assert.deepEqual(entranceAnchor, entrancePoint(889));
assert.ok(
  routePanels.some((p) => p.name.includes("No.2")) &&
    routePanels.some((p) => p.name.includes("Koban")) &&
    routePanels.some((p) => p.name.includes("No.3")),
  "entire route covered",
);
console.log(
  "PASS: route facade/parent registration, all three intervening buildings, shared entrance anchor",
);
// Regression for the reported protruding wall: test the rebuilt actual GLB,
// including its quantized attributes/transforms, instead of a mock footprint.
const THREE = await import("three");
const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
const { MeshoptDecoder } =
  await import("three/addons/libs/meshopt_decoder.module.js");
const { refineLandmarkMasses } =
  await import("../location/illustrated-street.mjs");
const raw = await fs.readFile(
  new URL("../location/susukino-detail.glb", import.meta.url),
);
const gltf = await new GLTFLoader()
  .setMeshoptDecoder(MeshoptDecoder)
  .parseAsync(
    raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength),
    "",
  );
gltf.scene.updateMatrixWorld(true);
const solids = [];
gltf.scene.traverse((o) => {
  if (["buildings", "buildingsDetail"].includes(o.name)) {
    o.material.side = THREE.DoubleSide;
    solids.push(o);
  }
});
const ray = new THREE.Raycaster();
ray.set(new THREE.Vector3(-47, 5, -50), new THREE.Vector3(0, 0, 1));
const neighbourBefore = ray.intersectObjects(solids)[0].distance;
solids.forEach(refineLandmarkMasses);
const neighbourAfter = ray.intersectObjects(solids)[0].distance;
assert.ok(
  Math.abs(neighbourAfter - neighbourBefore) < 0.001,
  "Nikka's adjacent facade remains intact",
);
for (const building of routeBuildings) {
  const [a, b] = building.ring,
    dx = b[0] - a[0],
    dz = b[1] - a[1],
    n = new THREE.Vector3(dz, 0, -dx).normalize();
  for (const t of [0.2, 0.5, 0.8]) {
    const p = new THREE.Vector3(a[0] + dx * t, 5, a[1] + dz * t);
    ray.set(p.clone().addScaledVector(n, 2), n.clone().negate());
    const hit = ray.intersectObjects(solids)[0];
    assert.ok(
      hit && Math.abs(hit.distance - 2) < 0.06,
      building.name +
        ": replacement wall follows footprint; no old protruding window",
    );
  }
}
console.log(
  "PASS: real exported building meshes have aligned fronts without old window protrusions",
);
