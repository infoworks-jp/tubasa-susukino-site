// Split geometry and the existing WebP bytes; no resampling or mesh simplification.
import fs from "node:fs/promises";
import assert from "node:assert/strict";
for (const tile of ["data30", "data44"]) {
  const base = new URL(`../location/assets/plateau/${tile}`, import.meta.url);
  const raw = await fs.readFile(new URL(base + ".glb"));
  const length = raw.readUInt32LE(12);
  const g = JSON.parse(raw.subarray(20, 20 + length));
  const bin = raw.subarray(28 + length);
  assert.equal(g.images.length, 1);
  const imageIndex = g.images[0].bufferView;
  const image = g.bufferViews[imageIndex];
  const webp = bin.subarray(image.byteOffset || 0, (image.byteOffset || 0) + image.byteLength);
  const views = [], parts = [], indices = new Map();
  let offset = 0;
  for (const [index, view] of g.bufferViews.entries()) {
    if (index === imageIndex) continue;
    const bytes = bin.subarray(view.byteOffset || 0, (view.byteOffset || 0) + view.byteLength);
    indices.set(index, views.length);
    views.push({ ...view, byteOffset: offset });
    parts.push(bytes, Buffer.alloc((4 - bytes.length % 4) % 4));
    offset += bytes.length + (4 - bytes.length % 4) % 4;
  }
  for (const accessor of g.accessors) accessor.bufferView = indices.get(accessor.bufferView);
  g.bufferViews = views;
  g.buffers = [{ byteLength: offset }];
  for (const material of g.materials) {
    if (!material.pbrMetallicRoughness.baseColorTexture) continue;
    material.extras = { ...material.extras, deferredPhotograph: true };
    delete material.pbrMetallicRoughness.baseColorTexture;
  }
  for (const key of ["images", "textures", "samplers", "extensionsUsed", "extensionsRequired"]) delete g[key];
  const json = Buffer.from(JSON.stringify(g));
  const padded = Buffer.concat([json, Buffer.alloc((4 - json.length % 4) % 4, 32)]);
  const header = Buffer.alloc(20), binHeader = Buffer.alloc(8);
  header.write("glTF"); header.writeUInt32LE(2, 4);
  header.writeUInt32LE(28 + padded.length + offset, 8);
  header.writeUInt32LE(padded.length, 12); header.write("JSON", 16);
  binHeader.writeUInt32LE(offset, 0); binHeader.write("BIN\0", 4);
  const geometry = Buffer.concat([header, padded, binHeader, ...parts]);
  for (const [suffix, bytes] of [[".geometry.glb", geometry], [".webp", webp]]) {
    const file = new URL(base + suffix);
    if (process.argv.includes("--check")) assert.deepEqual(await fs.readFile(file), bytes);
    else await fs.writeFile(file, bytes);
  }
  console.log(`${tile}: geometry ${geometry.length} bytes, unchanged WebP ${webp.length} bytes`);
}
