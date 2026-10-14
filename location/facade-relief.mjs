import * as THREE from "three";
import { projectQuad, atlasUV } from "./facade-projection.mjs";

// A facade is cut at measured architectural boundaries, then stepped in depth.
// Fronts keep the exact source-photo UVs; perpendicular reveals are real geometry.
// Recesses never go through the mapped building body (checked in QA).
export function makeReliefGeometry(panel, atlas) {
  if (panel.relief?.some((r) => r.polygon))
    return makePolygonRelief(panel, atlas);
  const width = Math.hypot(panel.b[0] - panel.a[0], panel.b[1] - panel.a[1]);
  const height = panel.height,
    relief = panel.relief || [];
  const grid = (axis) =>
    [
      ...new Set([
        ...Array.from({ length: 33 }, (_, i) => i / 32),
        ...relief.flatMap((r) => [r.rect[axis], r.rect[axis + 2]]),
      ]),
    ].sort((a, b) => a - b);
  const xs = grid(0),
    ys = grid(1),
    fronts = [],
    uvs = [],
    sides = [];
  const depthAt = (u, v) => {
    let z = 0;
    for (const r of relief)
      if (u > r.rect[0] && u < r.rect[2] && v > r.rect[1] && v < r.rect[3])
        z = r.depth;
    return z;
  };
  const vertex = (u, v, z) => [(u - 0.5) * width, (0.5 - v) * height, z];
  function quad(points, target, tex = false) {
    for (const i of [0, 2, 1, 0, 3, 2]) {
      const [u, v, z] = points[i];
      target.push(...vertex(u, v, z));
      if (tex) uvs.push(...atlasUV(projectQuad(panel.q, u, v), atlas));
    }
  }
  for (let j = 0; j < ys.length - 1; j++)
    for (let i = 0; i < xs.length - 1; i++) {
      const [l, r, t, b] = [xs[i], xs[i + 1], ys[j], ys[j + 1]],
        z = depthAt((l + r) / 2, (t + b) / 2);
      quad(
        [
          [l, t, z],
          [r, t, z],
          [r, b, z],
          [l, b, z],
        ],
        fronts,
        true,
      );
      const right =
        i === xs.length - 2 ? 0 : depthAt((r + xs[i + 2]) / 2, (t + b) / 2);
      const bottom =
        j === ys.length - 2 ? 0 : depthAt((l + r) / 2, (b + ys[j + 2]) / 2);
      if (z !== right)
        quad(
          [
            [r, t, z],
            [r, t, right],
            [r, b, right],
            [r, b, z],
          ],
          sides,
        );
      if (z !== bottom)
        quad(
          [
            [l, b, z],
            [r, b, z],
            [r, b, bottom],
            [l, b, bottom],
          ],
          sides,
        );
      if (i === 0 && z !== 0)
        quad(
          [
            [l, t, 0],
            [l, t, z],
            [l, b, z],
            [l, b, 0],
          ],
          sides,
        );
      if (j === 0 && z !== 0)
        quad(
          [
            [l, t, 0],
            [r, t, 0],
            [r, t, z],
            [l, t, z],
          ],
          sides,
        );
    }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(fronts, 3),
  );
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute(
    "inkArtwork",
    new THREE.Float32BufferAttribute(
      new Float32Array(fronts.length / 3).fill(panel.inkMask ?? 0.6),
      1,
    ),
  );
  geometry.computeVertexNormals();
  const reveals = new THREE.BufferGeometry();
  reveals.setAttribute("position", new THREE.Float32BufferAttribute(sides, 3));
  reveals.computeVertexNormals();
  return { geometry, reveals };
}

// A continuous photo registration with holes at measured sign silhouettes.
// Subdivision keeps projective UVs accurate on the large background triangles.
function makePolygonRelief(panel, atlas) {
  const width = Math.hypot(panel.b[0] - panel.a[0], panel.b[1] - panel.a[1]);
  const fronts = [],
    uvs = [],
    sides = [];
  const outer = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ];
  const polygons = panel.relief.map((r) => r.polygon);
  const points = [...outer, ...polygons.flat()];
  const xy = (p) => new THREE.Vector2(...p);
  const vertex = ([u, v], z) => [
    (u - 0.5) * width,
    (0.5 - v) * panel.height,
    z,
  ];
  function triangle(a, b, c, z, level = 0) {
    if (level < 5) {
      const mid = (a, b) => a.map((v, i) => (v + b[i]) / 2);
      const ab = mid(a, b),
        bc = mid(b, c),
        ca = mid(c, a);
      triangle(a, ab, ca, z, level + 1);
      triangle(ab, b, bc, z, level + 1);
      triangle(ca, bc, c, z, level + 1);
      triangle(ab, bc, ca, z, level + 1);
      return;
    }
    for (const p of [a, c, b]) {
      fronts.push(...vertex(p, z));
      uvs.push(...atlasUV(projectQuad(panel.q, ...p), atlas));
    }
  }
  for (const ids of THREE.ShapeUtils.triangulateShape(
    outer.map(xy),
    polygons.map((p) => p.map(xy)),
  ))
    triangle(...ids.map((i) => points[i]), 0);
  for (const r of panel.relief) {
    for (const ids of THREE.ShapeUtils.triangulateShape(r.polygon.map(xy), []))
      triangle(...ids.map((i) => r.polygon[i]), r.depth);
    r.polygon.forEach((a, i) => {
      const b = r.polygon[(i + 1) % r.polygon.length];
      for (const [p, z] of [
        [a, 0],
        [b, 0],
        [b, r.depth],
        [a, 0],
        [b, r.depth],
        [a, r.depth],
      ])
        sides.push(...vertex(p, z));
    });
  }
  const geometry = new THREE.BufferGeometry(),
    reveals = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(fronts, 3),
  );
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute(
    "inkArtwork",
    new THREE.Float32BufferAttribute(
      new Float32Array(fronts.length / 3).fill(panel.inkMask ?? 0.6),
      1,
    ),
  );
  reveals.setAttribute("position", new THREE.Float32BufferAttribute(sides, 3));
  geometry.computeVertexNormals();
  reveals.computeVertexNormals();
  return { geometry, reveals };
}

// Inverse homography for measurements made on the source photograph.
export function unprojectPhoto(q, point) {
  let u = 0.5,
    v = 0.5;
  for (let i = 0; i < 12; i++) {
    const p = projectQuad(q, u, v),
      px = projectQuad(q, u + 1e-5, v),
      py = projectQuad(q, u, v + 1e-5);
    const a = (px[0] - p[0]) / 1e-5,
      b = (py[0] - p[0]) / 1e-5,
      c = (px[1] - p[1]) / 1e-5,
      d = (py[1] - p[1]) / 1e-5;
    const dx = point[0] - p[0],
      dy = point[1] - p[1],
      det = a * d - b * c;
    u += (d * dx - b * dy) / det;
    v += (-c * dx + a * dy) / det;
  }
  return [u, v];
}
