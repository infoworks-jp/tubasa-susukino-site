import assert from "node:assert/strict";
import fs from "node:fs/promises";
import {
  projectQuad,
  atlasUV,
  photoAtlas,
  baseAtlas,
  surveyedPanels,
} from "../location/facade-projection.mjs";
const corners = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
];
for (const panel of surveyedPanels) {
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
for (const atlas of [photoAtlas, baseAtlas]) {
  const data = await fs.readFile(
    new URL("../location/" + atlas.file.slice(2), import.meta.url),
  );
  assert.equal(data.toString("ascii", 0, 4), "RIFF");
  assert.equal(data.toString("ascii", 8, 12), "WEBP");
  assert.ok(data.length < 6_000_000);
}
console.log(
  `PASS: ${surveyedPanels.length} photo panels, exact measured corners, perspective, UV bounds, winding and licensed atlas files`,
);
