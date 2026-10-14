import fs from "node:fs/promises";
import assert from "node:assert/strict";
const ids = new Set();
let triangles = 0,
  textured = 0;
for (const [tile, count] of [
  ["data30", 55],
  ["data44", 30],
]) {
  const raw = await fs.readFile(`location/assets/plateau/${tile}.glb`);
  assert.equal(raw.toString("utf8", 0, 4), "glTF");
  assert.equal(raw.readUInt32LE(8), raw.length);
  const length = raw.readUInt32LE(12),
    g = JSON.parse(raw.subarray(20, 20 + length)),
    bin = raw.subarray(28 + length);
  assert.equal(g.extras.sourceYear, 2020);
  assert.equal(g.extras.buildings.length, count);
  assert.match(g.extras.license, /CC BY 4.0/);
  assert.equal(
    g.extras.atlas.width * g.extras.atlas.height,
    2048 * 4096,
    "lossless repack memory budget",
  );
  for (const f of g.extras.buildings) {
    assert.ok(!ids.has(f.id));
    ids.add(f.id);
    assert.ok(f.height > 1 && f.height < 100);
    assert.ok(f.hull.length >= 3);
    const [x, z] = f.hull.reduce(
      ([x, z], p) => [x + p[0] / f.hull.length, z + p[1] / f.hull.length],
      [0, 0],
    );
    const expectedX =
        (f.sourceCenter[0] - g.extras.center[0]) *
        111320 *
        Math.cos((g.extras.center[1] * Math.PI) / 180),
      expectedZ = -(f.sourceCenter[1] - g.extras.center[1]) * 111320;
    assert.ok(
      Math.hypot(x - expectedX, z - expectedZ) < 30,
      "ECEF transform agrees with geographic metadata",
    );
    assert.ok(f.texturedTriangles > 0);
  }
  for (const mesh of g.meshes)
    for (const p of mesh.primitives) {
      for (const [name, index] of Object.entries(p.attributes)) {
        const a = g.accessors[index],
          v = g.bufferViews[a.bufferView],
          size = { VEC3: 3, VEC2: 2 }[a.type];
        assert.equal(a.componentType, 5126);
        let min = Infinity,
          max = -Infinity;
        for (let i = 0; i < a.count; i++) {
          const values = Array.from({ length: size }, (_, j) =>
            bin.readFloatLE(
              (v.byteOffset || 0) + (a.byteOffset || 0) + (i * size + j) * 4,
            ),
          );
          assert.ok(values.every(Number.isFinite));
          if (name === "POSITION") {
            assert.ok(
              Math.abs(values[0]) < 240 && Math.abs(values[2]) < 240,
              "bounded local meters",
            );
            min = Math.min(min, values[1]);
            max = Math.max(max, values[1]);
          }
          if (name === "NORMAL")
            assert.ok(Math.abs(Math.hypot(...values) - 1) < 0.001);
          if (name === "TEXCOORD_0")
            assert.ok(
              values.every((n) => n >= 0 && n <= 1),
              "packed UV inside atlas",
            );
        }
        if (name === "POSITION") {
          assert.ok(min >= 0.19);
          assert.ok(max < 100);
          triangles += a.count / 3;
        }
      }
      if (p.attributes.TEXCOORD_0 !== undefined)
        textured += g.accessors[p.attributes.POSITION].count / 3;
    }
  const iv = g.bufferViews[g.images[0].bufferView];
  assert.equal(bin.toString("ascii", iv.byteOffset, iv.byteOffset + 4), "RIFF");
  assert.equal(
    bin.toString("ascii", iv.byteOffset + 8, iv.byteOffset + 12),
    "WEBP",
  );
}
assert.equal(ids.size, 85);
assert.ok(triangles > 10000);
assert.ok(textured > 5000);
console.log(
  `PLATEAU DATA PASS: ${ids.size} unique buildings, ${triangles} triangles (${textured} textured), correct local coordinates, bounded heights, valid UV, 2020 source and license retained.`,
);
