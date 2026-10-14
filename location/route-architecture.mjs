import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import {
  routePanels,
  routeBuildings,
  entrancePoint,
  entranceSpan,
} from "./route-facades.mjs";

// Compact structural meshes, measured against the photographs already credited
// by the facades. Openings and fins are not random procedural decoration.
export function addRouteArchitecture(city, imported) {
  const group = new THREE.Group();
  group.name = "Route 36 / architectural relief and continuous pavement";
  group.userData = {
    technique:
      "Measured photograph features, approximate relief; walkway outer edge sampled from the existing OSM-derived walk mesh",
    limitations:
      "Depths, tile sizes and tactile-strip offset are approximate, not an accessibility or dimensional survey",
  };
  city.add(group);
  const buckets = new Map();
  function box(size, position, angle = 0, color = 0xb4b3ad) {
    const g = new THREE.BoxGeometry(...size);
    g.rotateY(angle);
    g.translate(...position);
    if (!buckets.has(color)) buckets.set(color, []);
    buckets.get(color).push(g);
  }
  function onPanel(name, u, v, size, depth = 0, color) {
    const p = routePanels.find((p) => p.name === name),
      dx = p.b[0] - p.a[0],
      dz = p.b[1] - p.a[1],
      w = Math.hypot(dx, dz),
      n = [-dz / w, dx / w];
    const offset = (p.offset ?? 0.12) + (p.depth || 0) + depth;
    box(
      size,
      [
        p.a[0] + u * dx + n[0] * offset,
        p.bottom + p.height * (1 - v),
        p.a[1] + u * dz + n[1] * offset,
      ],
      -Math.atan2(dz, dx),
      color,
    );
  }
  // Source photo x495..768 / y48..145: actual balustrade, including its returns.
  const east = entrancePoint(500),
    west = entrancePoint(762),
    dx = west[0] - east[0],
    dz = west[1] - east[1],
    w = Math.hypot(dx, dz),
    angle = -Math.atan2(dz, dx),
    n = [-dz / w, dx / w];
  for (const y of [58, 140])
    box(
      [w, 0.045, 0.045],
      [
        (east[0] + west[0]) / 2 + n[0] * 0.5,
        (566 - y) * entranceSpan.scale,
        (east[1] + west[1]) / 2 + n[1] * 0.5,
      ],
      angle,
      0x686d69,
    );
  for (let x = 505; x <= 755; x += 16) {
    const p = entrancePoint(x);
    box(
      [0.025, 82 * entranceSpan.scale, 0.035],
      [p[0] + n[0] * 0.5, (566 - 99) * entranceSpan.scale, p[1] + n[1] * 0.5],
      angle,
      0x686d69,
    );
  }
  // Canopy lip seen directly above the shop glazing (source y441..460).
  onPanel(
    "Yokocho / pudding shop sign and canopy",
    0.5,
    0.94,
    [3.22, 0.12, 0.68],
    0.18,
    0x8b8b84,
  );
  // No.2 ground-floor glazing and piers visible below the photographed shop
  // fascia (2018 preview: x548..836, y1250..1330). Pedestrians/cars obscure the
  // panes, so model neutral glass and visible posts without baking people into
  // the facade or inventing shop names/interiors. Opening widths are approximate.
  const shop = routePanels.find((p) => p.name === "No.2 / street level fascia");
  const shopWidth = Math.hypot(shop.b[0] - shop.a[0], shop.b[1] - shop.a[1]);
  const posts = [0, 0.14, 0.31, 0.5, 0.69, 0.87, 1];
  const shopV = (y) => 1 + (shop.bottom - y) / shop.height;
  for (let i = 0; i < posts.length - 1; i++)
    onPanel(
      shop.name,
      (posts[i] + posts[i + 1]) / 2,
      shopV(1.25),
      [shopWidth * (posts[i + 1] - posts[i]) - 0.16, 2.12, 0.045],
      -0.22,
      0x414749,
    );
  for (const u of posts)
    onPanel(shop.name, u, shopV(1.3), [0.14, 2.3, 0.32], 0.01, 0xa2a39e);
  onPanel(shop.name, 0.5, shopV(2.38), [shopWidth, 0.12, 0.5], 0.04, 0xb4b3ad);
  group.userData.groundFloorSource = {
    photo: "Choi2451, 2018-07-17",
    preview: [1824, 1368],
    bounds: [548, 1250, 836, 1330],
    limitations:
      "Glazing obscured by people/vehicles remains neutral; no invented tenants or interiors",
  };
  // Masonry jambs, copings and plinths of the three adjoining buildings.
  for (const [i, building] of routeBuildings.entries()) {
    const [a, b] = building.ring,
      dx = b[0] - a[0],
      dz = b[1] - a[1],
      w = Math.hypot(dx, dz),
      angle = -Math.atan2(dz, dx),
      n = [dz / w, -dx / w];
    const y = i === 1 ? 15 : 33;
    box(
      [w, 0.22, 0.44],
      [(a[0] + b[0]) / 2 + n[0] * 0.28, y, (a[1] + b[1]) / 2 + n[1] * 0.28],
      angle,
      0xc4c4bc,
    );
    if (i !== 1)
      for (const end of [a, b])
        box(
          [0.24, 32.8, 0.4],
          [end[0] + n[0] * 0.15, 16.6, end[1] + n[1] * 0.15],
          angle,
          0x9c9c96,
        );
  }
  // The brick portal and white plinth have photographed thickness, not a
  // freestanding billboard. Narrow caps remain outside the measured glass.
  onPanel(
    "Koban / glazed bay plinth",
    0.5,
    0,
    [3.5, 0.09, 0.32],
    0.08,
    0xd0d0c8,
  );
  onPanel(
    "Koban / brick door and red lamps",
    0.5,
    0,
    [2.7, 0.12, 0.32],
    0.06,
    0xb6b4aa,
  );
  const paving = addContinuousPavement(group, imported);
  const materials = [];
  for (const [color, parts] of buckets) {
    const geometry = mergeGeometries(parts, false);
    parts.forEach((g) => g.dispose());
    const material = new THREE.MeshStandardMaterial({ color, roughness: 1 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = "Photographed railings, jambs and cornices";
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    materials.push(material);
  }
  materials.push(...paving.materials);
  document.documentElement.dataset.routeRelief = String(
    routePanels.filter((p) => p.relief?.length).length,
  );
  document.documentElement.dataset.routePavement = JSON.stringify(
    paving.receipt,
  );
  group.userData.pavement = paving.receipt;
  return { group, materials };
}

export function pavementProfile(imported) {
  imported.updateMatrixWorld(true);
  let walk;
  imported.traverse((o) => {
    if (o.name === "walk") walk = o;
  });
  if (!walk) throw new Error("Mapped walk mesh missing");
  const a = [-50.3, -9.7],
    b = [33.93, -25.42],
    dx = b[0] - a[0],
    dz = b[1] - a[1],
    length = Math.hypot(dx, dz),
    n = [dz / length, -dx / length],
    ray = new THREE.Raycaster();
  const count = Math.ceil(length / 0.9),
    samples = [];
  for (let i = 0; i <= count; i++) {
    const t = i / count,
      x = a[0] + dx * t;
    const frontage = [
      a,
      ...routeBuildings.flatMap((b) => b.ring.slice(0, 2)),
      b,
    ].sort((a, b) => a[0] - b[0]);
    let z = a[1] + dz * t;
    for (let k = 0; k < frontage.length - 1; k++)
      if (
        x >= frontage[k][0] &&
        x <= frontage[k + 1][0] &&
        frontage[k + 1][0] > frontage[k][0]
      ) {
        const f = (x - frontage[k][0]) / (frontage[k + 1][0] - frontage[k][0]);
        z = frontage[k][1] + f * (frontage[k + 1][1] - frontage[k][1]);
        break;
      }
    let width = null,
      seen = false;
    for (let d = 0.25; d <= 18; d += 0.125) {
      ray.set(
        new THREE.Vector3(x + n[0] * d, 1, z + n[1] * d),
        new THREE.Vector3(0, -1, 0),
      );
      const hit = ray.intersectObject(walk, false).length > 0;
      if (hit) {
        seen = true;
        width = d;
      } else if (seen) break;
    }
    if (width === null || width === 18)
      throw new Error("No complete mapped sidewalk edge at route station " + i);
    samples.push({ x, z, width });
  }
  return { samples, n, length };
}
function addContinuousPavement(group, imported) {
  const { samples, n, length } = pavementProfile(imported),
    vertices = [],
    lines = [],
    tactile = [];
  const point = (s, d, y = 0.17) => [s.x + n[0] * d, y, s.z + n[1] * d];
  const quad = (a, b, c, d, target) => {
    for (const p of [a, b, c, a, c, d]) target.push(...p);
  };
  const line = (a, b) => lines.push(...a, ...b);
  for (let i = 0; i < samples.length - 1; i++) {
    const a = samples[i],
      b = samples[i + 1];
    quad(
      point(a, 0),
      point(b, 0),
      point(b, b.width),
      point(a, a.width),
      vertices,
    );
    // Continuous curb face uses the original mapped outer walk boundary.
    quad(
      point(a, a.width),
      point(b, b.width),
      point(b, b.width, 0.01),
      point(a, a.width, 0.01),
      vertices,
    );
    line(point(a, 0, 0.178), point(a, a.width, 0.178));
    line(point(a, a.width, 0.178), point(b, b.width, 0.178));
    for (let d = 0.6; d < Math.min(a.width, b.width); d += 0.6)
      line(point(a, d, 0.178), point(b, d, 0.178));
    // Source photos show a continuous tactile strip beside the facades. Offset
    // and 30cm tile width are schematic; do not present this as a surveyed route.
    quad(
      point(a, 1.25, 0.18),
      point(b, 1.25, 0.18),
      point(b, 1.55, 0.18),
      point(a, 1.55, 0.18),
      tactile,
    );
    for (const d of [1.29, 1.35, 1.41, 1.47, 1.53])
      line(point(a, d, 0.19), point(b, d, 0.19));
  }
  const materials = [];
  for (const [name, positions, color] of [
    ["continuous mapped sidewalk", vertices, 0xb6b5b0],
    ["photographed tactile strip (approximate)", tactile, 0xb6ac7f],
  ]) {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    g.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness: 1,
      side: THREE.DoubleSide,
    });
    materials.push(material);
    const mesh = new THREE.Mesh(g, material);
    mesh.name = name;
    mesh.receiveShadow = true;
    group.add(mesh);
  }
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(lines, 3),
  );
  group.add(
    new THREE.LineSegments(
      lineGeometry,
      new THREE.LineBasicMaterial({ color: 0x272824 }),
    ),
  );
  return {
    materials,
    receipt: {
      stations: samples.length,
      length: Number(length.toFixed(2)),
      minWidth: Number(Math.min(...samples.map((p) => p.width)).toFixed(3)),
      maxWidth: Number(Math.max(...samples.map((p) => p.width)).toFixed(3)),
      mappedOuterEdge: true,
    },
  };
}
