import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { landmarks } from "./landmarks.mjs";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
const canvas = document.querySelector("#city"),
  status = document.querySelector("#status");
const buttons = [
  ...document.querySelectorAll("[data-mode],[data-view],[data-zoom],#png,#glb"),
];
buttons.forEach((b) => (b.disabled = true));
document
  .querySelector("#retry")
  .addEventListener("click", () => location.reload());
const center = [141.354277879, 43.055365148368],
  metersLon = 111320 * Math.cos((center[1] * Math.PI) / 180),
  limit = 210;
const xy = (p) => [(p[0] - center[0]) * metersLon, (p[1] - center[1]) * 111320];
const shopXZ = xy(landmarks.shop.coordinates).map((v, i) => (i ? -v : v)),
  entryXZ = xy(landmarks.entrance.coordinates).map((v, i) => (i ? -v : v));
function clipRing(input) {
  let ring = input.map(xy);
  for (const [axis, bound, sign] of [
    [0, -limit, 1],
    [0, limit, -1],
    [1, -limit, 1],
    [1, limit, -1],
  ]) {
    const out = [];
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i],
        b = ring[(i + 1) % ring.length],
        insideA = (a[axis] - bound) * sign >= 0,
        insideB = (b[axis] - bound) * sign >= 0;
      if (insideA) out.push(a);
      if (insideA !== insideB) {
        const t = (bound - a[axis]) / (b[axis] - a[axis]);
        out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
      }
    }
    ring = out;
    if (!ring.length) break;
  }
  return ring;
}
const makeShape = (poly) => {
  const rings = poly.map(clipRing).filter((r) => r.length >= 3);
  if (!rings.length) return null;
  const shape = new THREE.Shape(rings[0].map((p) => new THREE.Vector2(...p)));
  for (const r of rings.slice(1))
    shape.holes.push(new THREE.Path(r.map((p) => new THREE.Vector2(...p))));
  return shape;
};
let renderer,
  scene,
  camera,
  controls,
  city,
  mode = "color";
const buildingMaterials = [],
  edges = [],
  windows = [],
  landMaterials = [],
  roadMaterials = [],
  footprints = [],
  glass = [],
  fatEdges = [],
  frontMaterials = [];
let shopLabel,
  comicContours,
  frontage,
  entryMarker,
  activeView = "overview",
  exporting = false,
  constraining = false;
const credits = "© OpenStreetMap contributors / © OpenMapTiles / OpenFreeMap";
function save(blob, name) {
  const url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
function makeLabel(text, subtitle = "新ラーメン横丁の一番奥 · B1F") {
  const c = document.createElement("canvas");
  c.width = 640;
  c.height = 160;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#9b2628";
  ctx.fillRect(0, 0, 640, 160);
  ctx.fillStyle = "#fff5e8";
  ctx.textAlign = "center";
  ctx.font = "bold 48px sans-serif";
  ctx.fillText(text, 320, 70);
  ctx.font = "26px sans-serif";
  ctx.fillText(subtitle, 320, 119);
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.SpriteMaterial({
    map: texture,
    depthTest: false,
    depthWrite: false,
    fog: false,
    toneMapped: false,
  });
  const sprite = new THREE.Sprite(m);
  sprite.scale.set(70, 17.5, 1);
  sprite.position.set(0, 85, 0);
  sprite.renderOrder = 99;
  return sprite;
}
// The collision check uses actual clipped footprints, including courtyards.
function inRing(x, z, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i],
      b = ring[j];
    if (
      a[1] > -z !== b[1] > -z &&
      x < ((b[0] - a[0]) * (-z - a[1])) / (b[1] - a[1]) + a[0]
    )
      inside = !inside;
  }
  return inside;
}
function cameraFloor(x, z) {
  let floor = 4;
  for (const f of footprints)
    if (
      inRing(x, z, f.rings[0]) &&
      !f.rings.slice(1).some((r) => inRing(x, z, r))
    )
      floor = Math.max(floor, f.height + 5);
  return floor;
}
function constrainCamera() {
  if (constraining) return;
  constraining = true;
  const t = controls.target;
  const old = t.clone();
  t.x = THREE.MathUtils.clamp(t.x, -180, 180);
  t.z = THREE.MathUtils.clamp(t.z, -180, 180);
  t.y = THREE.MathUtils.clamp(t.y, 0, 80);
  camera.position.add(t.clone().sub(old));
  camera.position.y = Math.max(
    camera.position.y,
    cameraFloor(camera.position.x, camera.position.z),
  );
  camera.lookAt(t);
  constraining = false;
}
function render() {
  if (!renderer) return;
  constrainCamera();
  camera.updateMatrixWorld();
  if (shopLabel) {
    const rect = canvas.getBoundingClientRect(),
      anchor = new THREE.Vector3(shopXZ[0], 45, shopXZ[1]),
      screen = anchor.clone().project(camera);
    if (screen.z < 1 && activeView !== "entrance") {
      const w = Math.min(200, rect.width * 0.55),
        h = w / 4;
      screen.x = THREE.MathUtils.clamp(
        screen.x,
        -1 + (w + 20) / rect.width,
        1 - (w + 20) / rect.width,
      );
      screen.y = THREE.MathUtils.clamp(
        screen.y,
        -1 + (h + 150) / rect.height,
        1 - (h + 130) / rect.height,
      );
      shopLabel.position.copy(screen.unproject(camera));
      const distance = shopLabel.position
        .clone()
        .sub(camera.position)
        .dot(camera.getWorldDirection(new THREE.Vector3()));
      const units =
        (2 * distance * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) /
        rect.height;
      shopLabel.scale.set(w * units, h * units, 1);
      shopLabel.visible = true;
    } else shopLabel.visible = false;
  }
  const outputScale =
    renderer.getSize(new THREE.Vector2()).x / canvas.clientWidth;
  fatEdges.forEach(
    (e) =>
      (e.material.linewidth = (mode === "tone" ? 1.5 : 1.25) * outputScale),
  );
  document.documentElement.dataset.cameraState = JSON.stringify({
    position: camera.position.toArray(),
    target: controls.target.toArray(),
    floor: cameraFloor(camera.position.x, camera.position.z),
    label: shopLabel?.position.clone().project(camera).toArray(),
  });
  renderer.render(scene, camera);
}
function roadSegment(a, b, width) {
  const aa = xy(a),
    bb = xy(b);
  let t0 = 0,
    t1 = 1;
  const dx = bb[0] - aa[0],
    dy = bb[1] - aa[1];
  for (const [p, q] of [
    [-dx, aa[0] + limit],
    [dx, limit - aa[0]],
    [-dy, aa[1] + limit],
    [dy, limit - aa[1]],
  ]) {
    if (Math.abs(p) < 1e-9) {
      if (q < 0) return;
    } else {
      const r = q / p;
      if (p < 0) t0 = Math.max(t0, r);
      else t1 = Math.min(t1, r);
      if (t0 > t1) return;
    }
  }
  const x1 = aa[0] + t0 * dx,
    z1 = -aa[1] - t0 * dy,
    x2 = aa[0] + t1 * dx,
    z2 = -aa[1] - t1 * dy;
  const length = Math.hypot(x2 - x1, z2 - z1);
  if (length < 0.1) return;
  const m = new THREE.MeshStandardMaterial({ color: 0xb8b7b4, roughness: 1 });
  roadMaterials.push(m);
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, length), m);
  mesh.rotation.x = -Math.PI / 2;
  mesh.rotation.z = Math.atan2(x2 - x1, z2 - z1);
  mesh.position.set((x1 + x2) / 2, 0.14, (z1 + z2) / 2);
  mesh.receiveShadow = true;
  city.add(mesh);
}
function addBuilding(poly, properties, index) {
  const shape = makeShape(poly);
  if (!shape) return;
  const raw = Number(properties.render_height ?? properties.height),
    h = Number.isFinite(raw) && raw > 0 ? Math.min(raw, 180) : 15;
  footprints.push({
    rings: poly.map(clipRing).filter((r) => r.length >= 3),
    height: h,
  });
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: h,
    bevelEnabled: false,
    steps: 1,
  });
  geometry.rotateX(-Math.PI / 2);
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(
      0.07 + (index % 5) * 0.018,
      0.09,
      0.62 + (index % 4) * 0.035,
    ),
    roughness: 0.92,
  });
  buildingMaterials.push(material);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData = {
    height: h,
    heightSource: Number.isFinite(raw) && raw > 0 ? "map" : "estimated",
    mapProperties: properties,
  };
  city.add(mesh);
  const edge = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry, 30),
    new THREE.LineBasicMaterial({
      color: 0x28272b,
      transparent: true,
      opacity: 0.68,
    }),
  );
  edges.push(edge);
  city.add(edge);
  const contour = new LineSegments2(
    new LineSegmentsGeometry().setPositions(
      edge.geometry.attributes.position.array,
    ),
    new LineMaterial({ color: 0x161619, linewidth: 1.4 }),
  );
  contour.computeLineDistances();
  fatEdges.push(contour);
  comicContours.add(contour);
  const verts = [];
  const ring = clipRing(poly[0]);
  const orientation =
    Math.sign(
      ring.reduce((sum, a, i) => {
        const b = ring[(i + 1) % ring.length];
        return sum + a[0] * b[1] - b[0] * a[1];
      }, 0),
    ) || 1;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i],
      b = ring[(i + 1) % ring.length],
      len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len < 6) continue;
    for (let height = 3.5; height < h - 1; height += 3.7) {
      for (let d = 2; d < len - 1; d += 3.3) {
        const ox = ((b[1] - a[1]) / len) * 0.08 * orientation,
          oy = (-(b[0] - a[0]) / len) * 0.08 * orientation;
        const t = d / len,
          t2 = Math.min((d + 1.2) / len, 0.97);
        const left = [
            a[0] + (b[0] - a[0]) * t + ox,
            -a[1] - oy - (b[1] - a[1]) * t,
          ],
          right = [
            a[0] + (b[0] - a[0]) * t2 + ox,
            -a[1] - oy - (b[1] - a[1]) * t2,
          ];
        for (const [u, v] of [
          [
            [left[0], height, left[1]],
            [right[0], height, right[1]],
          ],
          [
            [right[0], height, right[1]],
            [right[0], height + 1.6, right[1]],
          ],
          [
            [right[0], height + 1.6, right[1]],
            [left[0], height + 1.6, left[1]],
          ],
          [
            [left[0], height + 1.6, left[1]],
            [left[0], height, left[1]],
          ],
        ])
          verts.push(...u, ...v);
      }
    }
  }
  const filled = [];
  for (let k = 0; k < verts.length; k += 24)
    for (const n of [0, 1, 3, 0, 3, 5])
      filled.push(...verts.slice(k + n * 3, k + n * 3 + 3));
  const gg = new THREE.BufferGeometry();
  gg.setAttribute("position", new THREE.Float32BufferAttribute(filled, 3));
  const gm = new THREE.MeshBasicMaterial({
    color: 0x313136,
    transparent: true,
    opacity: 0.65,
    side: THREE.DoubleSide,
  });
  const glazing = new THREE.Mesh(gg, gm);
  glazing.userData = { detail: "Decorative windows, not surveyed" };
  glass.push(glazing);
  city.add(glazing);
  const wm = new THREE.LineBasicMaterial({
    color: 0x47464a,
    transparent: true,
    opacity: 0.5,
    depthTest: true,
  });
  const wg = new THREE.BufferGeometry();
  wg.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  const w = new THREE.LineSegments(wg, wm);
  w.renderOrder = 2;
  windows.push(w);
  city.add(w);
}
function comicMaterial(m, tone, line) {
  m.onBeforeCompile = (shader) => {
    if (line)
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        "#include <dithering_fragment>\n gl_FragColor.rgb=vec3(1.0);",
      );
    if (tone)
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        `#include <dithering_fragment>\nfloat luminance=dot(gl_FragColor.rgb,vec3(0.299,0.587,0.114));vec2 dots=fract(gl_FragCoord.xy/(3.0*${renderer.getPixelRatio().toFixed(3)}))-0.5;float coverage=clamp((1.0-luminance)*0.42,0.0,0.42);float radius=sqrt(coverage/3.14159265);float aa=max(fwidth(length(dots))*.45,0.025);float ink=1.0-smoothstep(radius-aa,radius+aa,length(dots));gl_FragColor.rgb=mix(vec3(0.97),vec3(0.12),ink);`,
      );
  };
  m.customProgramCacheKey = () =>
    tone
      ? "tsubasa-halftone-" + renderer.getPixelRatio()
      : line
        ? "tsubasa-white-line"
        : "tsubasa-standard";
  m.needsUpdate = true;
}
function describeMode() {
  status.textContent =
    { color: "カラー", line: "線画", tone: "線画＋トーン", night: "夜景" }[
      mode
    ] +
    (activeView === "entrance"
      ? " · 横丁入口（つばさは通路の奥）"
      : " · すすきの / つばさ周辺");
}
function applyMode(next) {
  mode = next;
  const night = mode === "night",
    line = mode === "line",
    tone = mode === "tone";
  scene.background = new THREE.Color(
    night ? 0x12121d : line || tone ? 0xfaf8f3 : 0xe8e6df,
  );
  scene.fog.color.copy(scene.background);
  scene.getObjectByName("sun").intensity = night ? 0.25 : 2.4;
  scene.getObjectByName("ambient").intensity = night ? 0.8 : tone ? 0.65 : 1.5;
  buildingMaterials.forEach((m, i) => {
    m.color.set(
      line || tone
        ? 0xffffff
        : night
          ? 0x282b40
          : new THREE.Color().setHSL(
              0.07 + (i % 5) * 0.018,
              0.09,
              0.62 + (i % 4) * 0.035,
            ),
    );
    m.emissive.set(night ? 0x090c20 : 0x000000);
    m.userData.tone = tone;
    comicMaterial(m, tone, line);
  });
  edges.forEach((e) => {
    e.material.color.set(night ? 0x555d85 : 0x28272b);
    e.material.opacity = line || tone ? 0.95 : 0.5;
  });
  comicContours.visible = line || tone;
  glass.forEach((w) => {
    w.material.color.set(night ? 0xf0c167 : 0x202026);
    w.material.opacity = night ? 0.5 : line ? 0.9 : tone ? 0.8 : 0.5;
  });
  frontage?.traverse((o) => {
    if (o.material?.userData?.isEntranceSign) {
      o.material.map =
        line || tone ? o.material.monoTexture : o.material.colorTexture;
      o.material.needsUpdate = true;
    }
  });
  frontMaterials.forEach((m) => {
    m.color.set(line || tone ? 0xffffff : m.userData.dayColor);
    m.emissive?.set(night ? 0x111711 : 0x000000);
    comicMaterial(m, tone, line);
  });
  windows.forEach((w) => {
    w.material.color.set(night ? 0xf0c167 : 0x47464a);
    w.material.opacity = night ? 0.75 : 0.45;
  });
  landMaterials.forEach((m) =>
    m.color.set(night ? 0x161622 : line || tone ? 0xffffff : 0xd7d8d2),
  );
  roadMaterials.forEach((m) =>
    m.color.set(night ? 0x242536 : line || tone ? 0xe5e5e5 : 0xb8b7b4),
  );
  document
    .querySelectorAll("[data-mode]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.mode === mode)),
    );
  describeMode();
  render();
}
function view(name) {
  activeView = name;
  const aspect = canvas.clientWidth / canvas.clientHeight;
  if (name === "overview") {
    controls.target.set(-15, 12, 10);
    const distance = aspect < 1 ? 1200 : 900;
    camera.position
      .copy(controls.target)
      .add(
        new THREE.Vector3(1, 1.2, 1.15).normalize().multiplyScalar(distance),
      );
  } else if (name === "crossing") {
    const p = xy([141.35336, 43.05563]);
    controls.target.set(-25, 20, 0);
    camera.position.set(p[0] - 60, 100, -p[1] + 85);
  } else {
    if (name === "entrance") {
      controls.target.set(entryXZ[0] + 4, 4, entryXZ[1]);
      camera.position.set(
        entryXZ[0] + 4,
        6.5,
        entryXZ[1] - (aspect < 1 ? 34 : 23),
      );
    } else {
      controls.target.set(shopXZ[0], 16, shopXZ[1]);
      camera.position.set(shopXZ[0] + 75, 100, shopXZ[1] + 100);
    }
  }
  controls.update();
  document.querySelector(".scene-note b").textContent =
    name === "entrance" ? "新ラーメン横丁 入口" : "味一番つばさ";
  document.querySelector(".scene-note span").textContent =
    name === "entrance"
      ? "つばさは通路の一番奥 / B1F"
      : "新ラーメン横丁の一番奥 / B1F";
  document
    .querySelectorAll("[data-view]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.view === name)),
    );
  describeMode();
  render();
}
// Photo-derived north frontage: the green sign and recessed half-basement
// entrance are real visible features. Only advertisements visible in the supplied photo are represented.
function addFrontage() {
  frontage = new THREE.Group();
  frontage.name = "Shin Ramen Yokocho / photograph-based entrance";
  frontage.position.set(entryXZ[0], 0, entryXZ[1]);
  frontage.rotation.y = 0.173;
  frontage.userData = {
    ...landmarks.entrance,
    source: "User street photograph, 2026-10-13",
    limitations: "Dimensions approximate; interior route is a schematic",
  };
  city.add(frontage);
  const box = (w, h, d, x, y, z, color) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 1 });
    m.userData.dayColor = color;
    frontMaterials.push(m);
    const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    o.position.set(x, y, z);
    o.castShadow = true;
    o.receiveShadow = true;
    frontage.add(o);
    const e = new THREE.LineSegments(
      new THREE.EdgesGeometry(o.geometry),
      new THREE.LineBasicMaterial({ color: 0x151519 }),
    );
    e.position.copy(o.position);
    frontage.add(e);
    frontage.updateMatrixWorld(true);
    const contour = new LineSegments2(
      new LineSegmentsGeometry().setPositions(
        e.geometry.attributes.position.array,
      ),
      new LineMaterial({ color: 0x161619, linewidth: 1.4 }),
    );
    contour.applyMatrix4(o.matrixWorld);
    fatEdges.push(contour);
    comicContours.add(contour);
    return o;
  };
  box(3.6, 3.3, 0.35, 0, 1.55, -0.18, 0x736b59);
  box(3.05, 2.75, 0.06, 0, 1.25, -0.39, 0x17181a);
  box(0.15, 2.6, 0.15, -1.52, 1.25, -0.5, 0xc1bbb0);
  box(0.15, 2.6, 0.15, 1.52, 1.25, -0.5, 0xc1bbb0);
  box(3.5, 2.4, 0.3, 0, 4, -0.35, 0x397d57);
  box(3.2, 2.1, 0.06, 0, 4, -0.53, 0xf3eedc);
  box(3.45, 0.2, 0.3, 0, 2.75, -0.5, 0x397d57);
  const sign = document.createElement("canvas");
  sign.width = 1024;
  sign.height = 768;
  const ctx = sign.getContext("2d");
  ctx.fillStyle = "#f4efdf";
  ctx.fillRect(0, 0, 1024, 768);
  ctx.strokeStyle = "#376d4c";
  ctx.lineWidth = 20;
  ctx.strokeRect(20, 20, 984, 728);
  for (let x = 40; x < 980; x += 100) {
    ctx.strokeRect(x, 45, 65, 45);
    ctx.strokeRect(x, 650, 65, 45);
  }
  ctx.textAlign = "center";
  ctx.fillStyle = "#ac3034";
  ctx.font = "bold 100px serif";
  ctx.fillText("さっぽろ名所", 512, 230);
  ctx.font = "bold 135px serif";
  ctx.fillText("新ラーメン横丁", 512, 440);
  ctx.fillStyle = "#31362e";
  ctx.font = "60px sans-serif";
  ctx.fillText("No.3 グリーンビル", 512, 610);
  const texture = new THREE.CanvasTexture(sign);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    toneMapped: false,
  });
  material.userData.isEntranceSign = true;
  const mono = document.createElement("canvas");
  mono.width = 1024;
  mono.height = 768;
  const mc = mono.getContext("2d");
  mc.fillStyle = "#fff";
  mc.fillRect(0, 0, 1024, 768);
  mc.strokeStyle = "#111";
  mc.lineWidth = 20;
  mc.strokeRect(20, 20, 984, 728);
  for (let x = 40; x < 980; x += 100) {
    mc.strokeRect(x, 45, 65, 45);
    mc.strokeRect(x, 650, 65, 45);
  }
  mc.fillStyle = "#111";
  mc.textAlign = "center";
  mc.font = "bold 100px serif";
  mc.fillText("さっぽろ名所", 512, 230);
  mc.font = "bold 135px serif";
  mc.fillText("新ラーメン横丁", 512, 440);
  mc.font = "60px sans-serif";
  mc.fillText("No.3 グリーンビル", 512, 610);
  const monoTexture = new THREE.CanvasTexture(mono);
  monoTexture.colorSpace = THREE.SRGBColorSpace;
  material.colorTexture = texture;
  material.monoTexture = monoTexture;
  const plaque = new THREE.Mesh(new THREE.PlaneGeometry(3.15, 2.05), material);
  plaque.position.set(0, 4, -0.58);
  plaque.rotation.y = Math.PI;
  frontage.add(plaque);
  // Entry handrail and curb, visible in the supplied photo; sizes are approximate.
  for (const x of [-1.2, 1.2]) {
    box(0.06, 0.85, 0.06, x, 0.35, -1, 0xb4b0a4);
    box(0.06, 0.06, 1.9, x, 0.8, -1.5, 0xb4b0a4);
  }
  box(13, 0.16, 3.5, 4, -0.04, -2.2, 0xb8b6aa);
  box(13, 0.3, 0.2, 4, -0.1, -4, 0x8a887e);
  // Measured relationships in the user's 1321×979 image: the entrance sign
  // is x≈790..985, while the broad green tenant sign is x≈105..495.
  // Approximate dimensions use a person as scale, not a surveyed elevation.
  box(14, 8.8, 0.12, 7, 4.4, -0.24, 0x9b9487);
  // Brick piers and horizontal framing visible beside the alley entrance.
  for (const x of [1.85, 5.7, 13.8]) {
    box(0.5, 8.8, 0.25, x, 4.4, -0.45, 0x76534b);
    for (let y = 0.5; y < 8.8; y += 0.35)
      box(0.52, 0.015, 0.02, x, y, -0.6, 0x443735);
  }
  const board = (text, w, h, x, y, bg, fg, font = 90) => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 512;
    const k = c.getContext("2d");
    k.fillStyle = bg;
    k.fillRect(0, 0, 1024, 512);
    k.strokeStyle = fg;
    k.lineWidth = 10;
    k.strokeRect(12, 12, 1000, 488);
    k.fillStyle = fg;
    k.textAlign = "center";
    k.font = `bold ${font}px sans-serif`;
    const lines = text.split("|");
    lines.forEach((t, i) =>
      k.fillText(t, 512, (512 / (lines.length + 1)) * (i + 1)),
    );
    const color = new THREE.CanvasTexture(c);
    color.colorSpace = THREE.SRGBColorSpace;
    const mono = document.createElement("canvas");
    mono.width = 1024;
    mono.height = 512;
    const mk = mono.getContext("2d");
    mk.fillStyle = "#fff";
    mk.fillRect(0, 0, 1024, 512);
    mk.strokeStyle = "#111";
    mk.lineWidth = 10;
    mk.strokeRect(12, 12, 1000, 488);
    mk.fillStyle = "#111";
    mk.textAlign = "center";
    mk.font = `bold ${font}px sans-serif`;
    lines.forEach((t, i) =>
      mk.fillText(t, 512, (512 / (lines.length + 1)) * (i + 1)),
    );
    const ink = new THREE.CanvasTexture(mono);
    ink.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.MeshBasicMaterial({ map: color, toneMapped: false });
    m.userData.isEntranceSign = true;
    m.colorTexture = color;
    m.monoTexture = ink;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m);
    mesh.rotation.y = Math.PI;
    mesh.position.set(x, y, -0.68);
    mesh.userData = {
      source: "Visible in user street photograph; not current tenant guarantee",
    };
    frontage.add(mesh);
    box(w + 0.15, h + 0.15, 0.12, x, y, -0.54, 0x8c897c);
  };
  board("レイク　B1", 6, 1.7, 9, 6.1, "#5b984b", "#f3f4dd", 135);
  board("F.UOSEN-SUISAN|魚鮮水産", 6, 2.2, 9, 8.2, "#f3f2e7", "#2f584c", 100);
  board("鳥貴族|TORIKIZOKU", 2.2, 1.0, 3.4, 6.6, "#d5b86f", "#694238", 86);
  board("レイク B1", 2.2, 1.1, 3.4, 5.5, "#589c49", "#f3f4e4", 125);
  // Only the visible silhouette of the upper blue advertisement is retained;
  // the cropped product wording is not invented.
  box(4.2, 3, 0.1, -0.5, 8.5, -0.39, 0x202d4e);
  for (let x = 2.1; x < 6.9; x += 0.25)
    box(0.035, 1.5, 0.07, x, 9.2, -0.62, 0x447054);
  box(5, 0.055, 0.1, 4.5, 9.8, -0.64, 0x447054);
  box(2.8, 0.22, 0.9, 3.5, 2.4, -0.85, 0x8b3838);
  box(2.8, 2.1, 0.08, 3.5, 1.15, -0.63, 0x353a3b);
  // One street tree is visible in the provided photo. Its crown is schematic.
  box(0.14, 3.8, 0.14, 10.6, 1.9, -2.4, 0x685144);
  for (const [x, y, z, r] of [
    [10.6, 3.1, -2.4, 1.25],
    [9.7, 3.4, -2.3, 1],
    [11.5, 3.4, -2.4, 1],
  ]) {
    const m = new THREE.MeshStandardMaterial({ color: 0x3a593d, roughness: 1 });
    m.userData.dayColor = 0x3a593d;
    frontMaterials.push(m);
    const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), m);
    crown.position.set(x, y, z);
    crown.castShadow = true;
    crown.scale.y = 0.65;
    frontage.add(crown);
    const e = new THREE.LineSegments(
      new THREE.EdgesGeometry(crown.geometry, 35),
      new THREE.LineBasicMaterial({ color: 0x1d2720 }),
    );
    e.position.copy(crown.position);
    e.scale.copy(crown.scale);
    frontage.add(e);
  }
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.1, 0.14, 8, 48),
    new THREE.MeshBasicMaterial({ color: 0x378864 }),
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(entryXZ[0], 0.3, entryXZ[1] - 1.8);
  ring.name = "Shin Ramen Yokocho entrance vicinity";
  ring.userData = landmarks.entrance;
  city.add(ring);
}
function drawLocator(data) {
  const map = document.querySelector("#locator"),
    ctx = map.getContext("2d"),
    size = 420;
  map.width = size;
  map.height = size;
  ctx.fillStyle = "#f4efe6";
  ctx.fillRect(0, 0, size, size);
  const point = (p) => {
    const v = xy(p);
    return [size / 2 + v[0] * 0.88, size / 2 - v[1] * 0.88];
  };
  for (const f of data.features) {
    if (f.properties.layer === "building") {
      ctx.fillStyle = "#c4c1bb";
      const polys =
        f.geometry.type === "MultiPolygon"
          ? f.geometry.coordinates
          : [f.geometry.coordinates];
      for (const poly of polys) {
        ctx.beginPath();
        for (const ring of poly) {
          ring.forEach((p, i) => {
            const v = point(p);
            i ? ctx.lineTo(...v) : ctx.moveTo(...v);
          });
          ctx.closePath();
        }
        ctx.fill("evenodd");
      }
    }
  }
  for (const f of data.features) {
    if (
      f.properties.layer !== "transportation" ||
      f.properties.brunnel === "tunnel" ||
      f.properties.class === "transit"
    )
      continue;
    ctx.strokeStyle = "#93918d";
    ctx.lineWidth = 3;
    const lines =
      f.geometry.type === "MultiLineString"
        ? f.geometry.coordinates
        : [f.geometry.coordinates];
    for (const l of lines) {
      ctx.beginPath();
      l.forEach((p, i) => {
        const v = point(p);
        i ? ctx.lineTo(...v) : ctx.moveTo(...v);
      });
      ctx.stroke();
    }
  }
  const shop = point(landmarks.shop.coordinates),
    crossing = point([141.35336, 43.05563]);
  ctx.strokeStyle = "#ad3035";
  ctx.setLineDash([5, 5]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(...shop);
  ctx.lineTo(...crossing);
  ctx.stroke();
  ctx.setLineDash([]);
  for (const [v, n, color] of [
    [crossing, "1", "#292b37"],
    [point(landmarks.entrance.coordinates), "2", "#287657"],
    [shop, "3", "#ad3035"],
  ]) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(...v, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(n, v[0], v[1] + 6);
  }
  ctx.fillStyle = "#292b37";
  ctx.font = "bold 20px sans-serif";
  ctx.fillText("↑ 北", size - 42, 28);
  ctx.textAlign = "left";
  ctx.font = "16px sans-serif";
  ctx.fillText("50m", 24, size - 20);
  ctx.fillRect(24, size - 44, 44, 3);
}
async function start() {
  try {
    const data = await fetch("../location-data.geojson").then((r) => {
      if (!r.ok) throw Error("地図データの読み込みに失敗");
      return r.json();
    });
    drawLocator(data);
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xe8e6df, 1500, 2200);
    comicContours = new THREE.Group();
    scene.add(comicContours);
    city = new THREE.Group();
    city.name = "Susukino — Tsubasa";
    city.userData = {
      attribution: credits,
      center,
      source: data.metadata,
      landmarks,
      units: "meters",
      axes: "Y up, X east, Z south",
      limitations:
        "Estimated heights where absent; decorative windows; approximate road widths; photograph-based alley entrance and signage approximate; no surveyed indoor corridor or terrain elevation; halftone screen shader is not baked into GLB; decorative windows exported as lines",
      license:
        "OpenStreetMap ODbL; see https://www.openstreetmap.org/copyright",
    };
    scene.add(city);
    camera = new THREE.PerspectiveCamera(42, 1, 0.2, 2000);
    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = false;
    controls.minDistance = 8;
    controls.maxDistance = 1400;
    controls.maxPolarAngle = Math.PI * 0.47;
    controls.screenSpacePanning = false;
    controls.touches.ONE = THREE.TOUCH.ROTATE;
    controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
    controls.addEventListener("change", render);
    const ambient = new THREE.HemisphereLight(0xffffff, 0x777777, 1.5);
    ambient.name = "ambient";
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xffffff, 2.4);
    sun.name = "sun";
    sun.position.set(-150, 300, 150);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -250;
    sun.shadow.camera.right = 250;
    sun.shadow.camera.top = 250;
    sun.shadow.camera.bottom = -250;
    sun.shadow.camera.far = 850;
    sun.shadow.normalBias = 0.5;
    scene.add(sun);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xd7d8d2,
      roughness: 1,
    });
    landMaterials.push(groundMat);
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(limit * 2, limit * 2),
      groundMat,
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    city.add(ground);
    let count = 0;
    for (const f of data.features) {
      if (
        f.properties.layer === "transportation" &&
        f.properties.brunnel !== "tunnel" &&
        f.properties.class !== "transit"
      ) {
        const klass = f.properties.class;
        const width =
          {
            motorway: 22,
            trunk: 20,
            primary: 19,
            secondary: 16,
            tertiary: 12,
            minor: 9,
            service: 5,
            path: 2,
            footway: 2,
          }[klass] ?? 6;
        const ls =
          f.geometry.type === "MultiLineString"
            ? f.geometry.coordinates
            : f.geometry.type === "LineString"
              ? [f.geometry.coordinates]
              : [];
        for (const l of ls)
          for (let i = 1; i < l.length; i++) roadSegment(l[i - 1], l[i], width);
      }
      if (f.properties.layer === "building") {
        const polys =
          f.geometry.type === "MultiPolygon"
            ? f.geometry.coordinates
            : f.geometry.type === "Polygon"
              ? [f.geometry.coordinates]
              : [];
        for (const poly of polys) addBuilding(poly, f.properties, count++);
      }
    }
    addFrontage();
    const marker = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.65, 80, 8),
      new THREE.MeshBasicMaterial({ color: 0xce3035 }),
    );
    marker.position.set(shopXZ[0], 22.5, shopXZ[1]);
    marker.geometry.dispose();
    marker.geometry = new THREE.CylinderGeometry(0.4, 0.4, 45, 8);
    marker.name = "Tsubasa / Shin Ramen Yokocho vicinity (not entrance)";
    marker.userData = {
      coordinates: landmarks.shop.coordinates,
      role: "Approximate place marker, not entrance",
    };
    city.add(marker);
    shopLabel = makeLabel("味一番つばさ");
    scene.add(shopLabel);
    const resize = () => {
      if (exporting) return;
      const r = canvas.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
      render();
    };
    new ResizeObserver(resize).observe(canvas);
    view("entrance");
    applyMode("tone");
    resize();
    buttons.forEach((b) => (b.disabled = false));
    document
      .querySelectorAll("[data-mode]")
      .forEach((b) =>
        b.addEventListener("click", () => applyMode(b.dataset.mode)),
      );
    document
      .querySelectorAll("[data-view]")
      .forEach((b) => b.addEventListener("click", () => view(b.dataset.view)));
    canvas.addEventListener("keydown", (e) => {
      if (
        ![
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "+",
          "=",
          "-",
        ].includes(e.key)
      )
        return;
      e.preventDefault();
      const offset = camera.position.clone().sub(controls.target),
        s = new THREE.Spherical().setFromVector3(offset);
      if (e.key === "ArrowLeft") s.theta -= 0.12;
      if (e.key === "ArrowRight") s.theta += 0.12;
      if (e.key === "ArrowUp") s.phi = Math.max(0.1, s.phi - 0.1);
      if (e.key === "ArrowDown") s.phi = Math.min(Math.PI * 0.47, s.phi + 0.1);
      if (e.key === "+" || e.key === "=")
        s.radius = Math.max(8, s.radius * 0.9);
      if (e.key === "-") s.radius = Math.min(1400, s.radius * 1.1);
      camera.position
        .copy(controls.target)
        .add(new THREE.Vector3().setFromSpherical(s));
      controls.update();
    });
    document.querySelectorAll("[data-zoom]").forEach((b) =>
      b.addEventListener("click", () => {
        const offset = camera.position.clone().sub(controls.target);
        offset.setLength(
          THREE.MathUtils.clamp(
            offset.length() * Number(b.dataset.zoom),
            8,
            1400,
          ),
        );
        camera.position.copy(controls.target).add(offset);
        controls.update();
        render();
      }),
    );
    document.querySelector("#png").addEventListener("click", async () => {
      const b = document.querySelector("#png");
      b.disabled = true;
      exporting = true;
      const original = {
        ratio: renderer.getPixelRatio(),
        width: canvas.clientWidth,
        height: canvas.clientHeight,
      };
      try {
        const width = 2400,
          height = Math.round((width / original.width) * original.height);
        renderer.setPixelRatio(1);
        renderer.setSize(width, height, false);
        applyMode(mode);
        render();
        const image = document.createElement("canvas");
        image.width = width;
        image.height = height + 110;
        const ctx = image.getContext("2d");
        ctx.fillStyle = mode === "night" ? "#12121d" : "#faf8f3";
        ctx.fillRect(0, 0, width, image.height);
        ctx.drawImage(canvas, 0, 0);
        ctx.fillStyle = mode === "night" ? "#fff" : "#222";
        ctx.font = "28px sans-serif";
        ctx.fillText(
          "味一番つばさ / すすきの — 概略3D街区（窓・入口寸法は概略）",
          24,
          height + 40,
        );
        ctx.font = "24px sans-serif";
        ctx.fillText(credits, 24, height + 80);
        const blob = await new Promise((resolve) => image.toBlob(resolve));
        if (!blob) throw Error("PNG encoding failed");
        save(blob, "tsubasa-susukino-" + mode + ".png");
        status.textContent =
          "幅2400pxの画像を保存しました。下部に地図データの出典を含みます。";
      } catch {
        status.textContent =
          "画像の保存に失敗しました。もう一度お試しください。";
      } finally {
        const message = status.textContent;
        renderer.setPixelRatio(original.ratio);
        renderer.setSize(original.width, original.height, false);
        applyMode(mode);
        render();
        status.textContent = message;
        exporting = false;
        b.disabled = false;
      }
    });
    document.querySelector("#glb").addEventListener("click", async () => {
      const b = document.querySelector("#glb");
      b.disabled = true;
      try {
        const result = await new GLTFExporter().parseAsync(city, {
          binary: true,
          onlyVisible: true,
        });
        save(
          new Blob([result], { type: "model/gltf-binary" }),
          "tsubasa-susukino.glb",
        );
        status.textContent =
          "3Dモデルを保存しました。出典はモデルのメタデータに含まれます。";
      } catch {
        status.textContent = "3Dモデルの保存に失敗しました。";
      } finally {
        b.disabled = false;
      }
    });
    document.documentElement.dataset.cityReady = "true";
    canvas.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      buttons.forEach((b) => (b.disabled = true));
      document.querySelector("#failure").hidden = false;
      status.textContent =
        "3D描画が中断されました。もう一度読み込んでください。";
      document.documentElement.dataset.cityReady = "error";
    });
    document.documentElement.dataset.buildings = String(count);
    document.documentElement.dataset.geometryVertices = String(
      city.children
        .filter((c) => c.isMesh)
        .reduce((n, m) => n + (m.geometry.attributes.position?.count ?? 0), 0),
    );
  } catch (error) {
    console.error("[Tsubasa Location]", error);
    document.querySelector("#failure").hidden = false;
    status.textContent = "3D表示を開始できませんでした";
    document.documentElement.dataset.cityReady = "error";
  }
}
start();
