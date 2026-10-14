/** Reproducible, offline subset of MLIT PLATEAU Sapporo 2020 textured LOD2.
 * Inputs: official b3dm tiles (see location/plateau-sources.md).
 * No third-party code is copied; Three.js's bundled Apache-2.0 Draco decoder is used.
 */
import fs from "node:fs/promises";
import vm from "node:vm";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url),
  root = path.resolve(".");
const input = process.argv[2] || "output/plateau-v4/tiles";
const dest = process.argv[3] || "output/plateau-v4/processed";
await fs.mkdir(dest, { recursive: true });
const ctx = {
  module: { exports: {} },
  exports: {},
  require,
  __filename: require.resolve("three"),
};
vm.runInNewContext(
  await fs.readFile(
    "node_modules/three/examples/jsm/libs/draco/draco_decoder.js",
    "utf8",
  ),
  ctx,
);
const draco = await ctx.module.exports({});
const center = [141.354277879, 43.055365148368],
  rad = Math.PI / 180;
const lon = center[0] * rad,
  lat = center[1] * rad,
  N = 6378137 / Math.sqrt(1 - 0.00669437999014 * Math.sin(lat) ** 2);
const origin = [
  N * Math.cos(lat) * Math.cos(lon),
  N * Math.cos(lat) * Math.sin(lon),
  N * (1 - 0.00669437999014) * Math.sin(lat),
];
const east = [-Math.sin(lon), Math.cos(lon), 0],
  up = [
    Math.cos(lat) * Math.cos(lon),
    Math.cos(lat) * Math.sin(lon),
    Math.sin(lat),
  ],
  south = [
    Math.sin(lat) * Math.cos(lon),
    Math.sin(lat) * Math.sin(lon),
    -Math.cos(lat),
  ];
const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
function local(p, rtc, normal = false) {
  const e = [p[0], -p[2], p[1]].map((v, i) =>
    normal ? v : v + rtc[i] - origin[i],
  );
  return [east, up, south].map((a) => dot(e, a));
}
function hull(points) {
  const pp = [
    ...new Map(
      points.map((p) => [p.map((v) => v.toFixed(2)).join(","), p]),
    ).values(),
  ].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (a, b, c) =>
    (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  let lo = [],
    hi = [];
  for (const p of pp) {
    while (lo.length > 1 && cross(lo.at(-2), lo.at(-1), p) <= 0) lo.pop();
    lo.push(p);
  }
  for (const p of pp.toReversed()) {
    while (hi.length > 1 && cross(hi.at(-2), hi.at(-1), p) <= 0) hi.pop();
    hi.push(p);
  }
  return lo.slice(0, -1).concat(hi.slice(0, -1));
}
const tiles = [],
  allFeatures = [];
for (const name of ["data30", "data44"]) {
  const raw = await fs.readFile(path.join(input, name + ".b3dm"));
  const [fj, fb, bj, bb] = [12, 16, 20, 24].map((i) => raw.readUInt32LE(i));
  const batch = JSON.parse(raw.subarray(28 + fj + fb, 28 + fj + fb + bj));
  const batchBin = raw.subarray(28 + fj + fb + bj, 28 + fj + fb + bj + bb),
    count = batch.gml_id.length;
  const formats = {
    BYTE: ["readInt8", 1],
    UNSIGNED_BYTE: ["readUInt8", 1],
    DOUBLE: ["readDoubleLE", 8],
    FLOAT: ["readFloatLE", 4],
    SHORT: ["readInt16LE", 2],
    UNSIGNED_SHORT: ["readUInt16LE", 2],
    INT: ["readInt32LE", 4],
    UNSIGNED_INT: ["readUInt32LE", 4],
  };
  for (const [key, value] of Object.entries(batch)) {
    if (value?.byteOffset !== undefined) {
      const [method, size] = formats[value.componentType];
      batch[key] = Array.from({ length: count }, (_, i) =>
        batchBin[method](value.byteOffset + i * size),
      );
    }
  }
  const glb = raw.subarray(28 + fj + fb + bj + bb),
    jsonLength = glb.readUInt32LE(12),
    g = JSON.parse(glb.subarray(20, 20 + jsonLength)),
    bin = glb.subarray(28 + jsonLength),
    rtc = g.extensions.CESIUM_RTC.center;
  const features = new Map();
  for (let i = 0; i < count; i++) {
    const x = (batch._x[i] - center[0]) * 111320 * Math.cos(lat),
      z = -(batch._y[i] - center[1]) * 111320;
    // Keep the user's approved photographed landmark facades and entrance.
    const authored =
      (x > -68 && x < 46 && z > -116 && z < -52) ||
      (x > -65 && x < -32 && z > -16 && z < 35) ||
      (x > -32 && x < 45 && z > -30 && z < 42);
    if (
      batch._lod[i] === 2 &&
      Math.abs(x) < 200 &&
      Math.abs(z) < 200 &&
      !authored
    )
      features.set(i, {
        id: batch.gml_id[i],
        tile: name,
        sourceCenter: [batch._x[i], batch._y[i]],
        points: [],
        minY: Infinity,
        maxY: -Infinity,
        texturedTriangles: 0,
      });
  }
  const parts = [];
  for (const primitive of g.meshes[0].primitives) {
    const ext = primitive.extensions.KHR_draco_mesh_compression,
      view = g.bufferViews[ext.bufferView],
      buffer = new draco.DecoderBuffer(),
      decoder = new draco.Decoder(),
      mesh = new draco.Mesh();
    const bytes = bin.subarray(
      view.byteOffset || 0,
      (view.byteOffset || 0) + view.byteLength,
    );
    buffer.Init(new Int8Array(bytes), bytes.length);
    const status = decoder.DecodeBufferToMesh(buffer, mesh);
    if (!status.ok()) throw Error(status.error_msg());
    const attributes = {};
    for (const [key, id] of Object.entries(ext.attributes)) {
      const attr = decoder.GetAttributeByUniqueId(mesh, id),
        values = new draco.DracoFloat32Array();
      decoder.GetAttributeFloatForAllPoints(mesh, attr, values);
      attributes[key] = Float32Array.from({ length: values.size() }, (_, i) =>
        values.GetValue(i),
      );
      draco.destroy(values);
    }
    const face = new draco.DracoInt32Array(),
      out = {
        position: [],
        normal: [],
        uv: [],
        ids: [],
        textured: !!attributes.TEXCOORD_0,
      };
    for (let i = 0; i < mesh.num_faces(); i++) {
      decoder.GetFaceFromMesh(mesh, i, face);
      const ids = [0, 1, 2].map((j) => face.GetValue(j)),
        bid = Math.round(attributes._BATCHID[ids[0]]),
        feature = features.get(bid);
      if (!feature) continue;
      if (!ids.every((k) => Math.round(attributes._BATCHID[k]) === bid))
        throw Error("Mixed building triangle");
      for (const k of ids) {
        const p = local(attributes.POSITION.subarray(k * 3, k * 3 + 3), rtc),
          n = local(attributes.NORMAL.subarray(k * 3, k * 3 + 3), rtc, true);
        out.position.push(...p);
        out.normal.push(...n);
        out.ids.push(bid);
        if (out.textured)
          out.uv.push(...attributes.TEXCOORD_0.subarray(k * 2, k * 2 + 2));
        feature.points.push([p[0], p[2]]);
        feature.minY = Math.min(feature.minY, p[1]);
        feature.maxY = Math.max(feature.maxY, p[1]);
      }
      if (out.textured) {
        feature.texturedTriangles++;
        const uv = ids.map((k) =>
          Array.from(attributes.TEXCOORD_0.subarray(k * 2, k * 2 + 2)),
        );
        const area =
          (Math.abs(
            (uv[1][0] - uv[0][0]) * (uv[2][1] - uv[0][1]) -
              (uv[1][1] - uv[0][1]) * (uv[2][0] - uv[0][0]),
          ) *
            8192 *
            8192) /
          2;
        feature.maxTextureTriangle = Math.max(
          feature.maxTextureTriangle || 0,
          area,
        );
      }
    }
    parts.push(out);
    for (const item of [face, mesh, buffer, decoder]) draco.destroy(item);
  }
  const selected = [...features.values()].filter(
    (f) => f.points.length && f.texturedTriangles,
  );
  const selectedIds = new Set(selected.map((f) => f.id));
  for (const f of selected) {
    f.hull = hull(f.points).map((p) => p.map((v) => +v.toFixed(3)));
    delete f.points;
    f.height = +(f.maxY - f.minY).toFixed(3);
  }
  const out = {
    asset: {
      version: "2.0",
      generator: "Tsubasa PLATEAU subset; MLIT Sapporo 2020",
    },
    scene: 0,
    scenes: [{ nodes: [] }],
    nodes: [],
    meshes: [],
    materials: [
      {
        name: "PLATEAU architectural surfaces",
        pbrMetallicRoughness: {
          baseColorFactor: [0.8, 0.8, 0.8, 1],
          metallicFactor: 0,
          roughnessFactor: 1,
        },
      },
      {
        name: "PLATEAU surveyed photographic facade",
        pbrMetallicRoughness: {
          baseColorTexture: { index: 0 },
          metallicFactor: 0,
          roughnessFactor: 1,
        },
      },
    ],
    textures: [{ sampler: 0, extensions: { EXT_texture_webp: { source: 0 } } }],
    samplers: [
      { magFilter: 9729, minFilter: 9987, wrapS: 33071, wrapT: 33071 },
    ],
    images: [{ mimeType: "image/webp", bufferView: 0 }],
    extensionsUsed: ["EXT_texture_webp"],
    extensionsRequired: ["EXT_texture_webp"],
    bufferViews: [],
    accessors: [],
    buffers: [],
    extras: {
      source: "MLIT Project PLATEAU Sapporo 2020 (v4)",
      sourceYear: 2020,
      center,
      axes: "Y up, X east, Z south; each building base flattened to 0.2m",
      license: "CC BY 4.0 / PLATEAU site policy",
      buildings: selected,
    },
  };
  const chunks = [];
  let byteOffset = 0;
  function addView(data) {
    const b = Buffer.isBuffer(data)
      ? data
      : Buffer.from(data.buffer, data.byteOffset, data.byteLength);
    const index = out.bufferViews.length;
    out.bufferViews.push({ buffer: 0, byteOffset, byteLength: b.length });
    chunks.push(b);
    byteOffset += b.length;
    const pad = (4 - (byteOffset % 4)) % 4;
    if (pad) {
      chunks.push(Buffer.alloc(pad));
      byteOffset += pad;
    }
    return index;
  }
  const iv = g.bufferViews[g.images[0].bufferView];
  const atlas = bin.subarray(
    iv.byteOffset || 0,
    (iv.byteOffset || 0) + iv.byteLength,
  );
  addView(atlas);
  await fs.writeFile(path.join(dest, name + "-atlas.webp"), atlas);
  for (const part of parts) {
    const p = [],
      n = [],
      uv = [];
    for (let i = 0; i < part.ids.length; i++) {
      const f = features.get(part.ids[i]);
      if (!selectedIds.has(f.id)) continue;
      p.push(
        part.position[i * 3],
        part.position[i * 3 + 1] - f.minY + 0.2,
        part.position[i * 3 + 2],
      );
      n.push(...part.normal.slice(i * 3, i * 3 + 3));
      if (part.textured) uv.push(...part.uv.slice(i * 2, i * 2 + 2));
    }
    if (!p.length) continue;
    const attrs = {};
    for (const [key, values, size] of [
      ["POSITION", p, 3],
      ["NORMAL", n, 3],
      ...(part.textured ? [["TEXCOORD_0", uv, 2]] : []),
    ]) {
      const a = {
        bufferView: addView(new Float32Array(values)),
        componentType: 5126,
        count: values.length / size,
        type: size === 3 ? "VEC3" : "VEC2",
      };
      if (key === "POSITION") {
        a.min = Array.from({ length: 3 }, (_, j) =>
          Math.min(...values.filter((_, i) => i % 3 === j)),
        );
        a.max = Array.from({ length: 3 }, (_, j) =>
          Math.max(...values.filter((_, i) => i % 3 === j)),
        );
      }
      attrs[key] = out.accessors.push(a) - 1;
    }
    const index = out.meshes.length;
    out.meshes.push({
      name: `PLATEAU ${name} ${part.textured ? "photographic walls" : "roof and solid surfaces"}`,
      primitives: [{ attributes: attrs, material: part.textured ? 1 : 0 }],
    });
    out.nodes.push({ mesh: index });
    out.scenes[0].nodes.push(index);
  }
  out.buffers = [{ byteLength: byteOffset }];
  const json = Buffer.from(JSON.stringify(out)),
    jsonPad = Buffer.concat([
      json,
      Buffer.alloc((4 - (json.length % 4)) % 4, 32),
    ]),
    binary = Buffer.concat(chunks),
    header = Buffer.alloc(20),
    bh = Buffer.alloc(8);
  header.write("glTF");
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(28 + jsonPad.length + binary.length, 8);
  header.writeUInt32LE(jsonPad.length, 12);
  header.writeUInt32LE(0x4e4f534a, 16);
  bh.writeUInt32LE(binary.length, 0);
  bh.writeUInt32LE(0x004e4942, 4);
  await fs.writeFile(
    path.join(dest, name + ".glb"),
    Buffer.concat([header, jsonPad, bh, binary]),
  );
  console.log(
    name,
    selected.length,
    "buildings",
    out.accessors
      .filter((a) => a.type === "VEC3")
      .reduce((n, a) => n + a.count / 2, 0),
    "vertices",
  );
  allFeatures.push(...selected);
  tiles.push({ name, buildings: selected.length });
}
await fs.writeFile(
  path.join(dest, "manifest.json"),
  JSON.stringify(
    { center, sourceYear: 2020, tiles, buildings: allFeatures },
    null,
    2,
  ),
);
