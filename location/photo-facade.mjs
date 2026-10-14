import * as THREE from "three";
import { loadArtwork, artworkPlane, outlinedBox } from "./artwork.mjs";

export function setPhotoMode(material, mode) {
  // The drawing is intentionally retained in all four views; night subtly
  // warms the paper, without running the old noisy photograph threshold.
  material.color.set(mode === "night" ? 0xe4d9bc : 0xffffff);
}
export async function addPhotoFacade(group) {
  const texture = await loadArtwork("./assets/manga/yokocho-facade.webp");
  const materials = [],
    scale = 3.2 / 288,
    origin = 1240,
    ground = 810;
  const source =
    "Authorized user photograph; manga adaptation 2026-10-14. Dimensions approximate.";
  function panel(name, rect, depth = 0.12, z = -0.46) {
    const [x0, y0, x1, y1] = rect,
      w = (x1 - x0) * scale,
      h = (y1 - y0) * scale;
    const x = (origin - (x0 + x1) / 2) * scale,
      y = (ground - (y0 + y1) / 2) * scale;
    outlinedBox(group, [w, h, depth], [x, y, z + depth / 2 + 0.015]);
    const mesh = artworkPlane(texture, w, h, rect);
    mesh.rotation.y = Math.PI;
    mesh.position.set(x, y, z);
    mesh.name = name;
    mesh.userData = { source, artwork: true };
    group.add(mesh);
    materials.push(mesh.material);
    return mesh;
  }
  // Cut the facade at the real doorway, not a pasted rectangle over an opening.
  panel("Manga: upper north frontage", [0, 0, 1430, 653]);
  panel("Manga: neighboring shopfronts", [0, 653, 1095, 810]);
  panel("Manga: west brick jamb", [1385, 653, 1430, 810]);
  panel(
    "Photograph: Shin Ramen Yokocho sign",
    [1095, 440, 1385, 653],
    0.38,
    -0.94,
  );
  panel("Manga: Uosen Suisan sign", [88, 0, 675, 178], 0.23, -0.75);
  panel("Manga: Lake broad sign", [0, 184, 675, 315], 0.27, -0.8);
  panel("Manga: champagne billboard", [1062, 0, 1430, 275], 0.32, -0.86);
  panel("Manga: FamilyMart fascia", [0, 523, 580, 598], 0.18, -0.72);
  panel("Manga: Torikizoku projecting sign", [847, 167, 1056, 278], 0.8, -1.18);
  panel("Manga: Lake projecting sign", [847, 282, 1056, 370], 0.8, -1.18);
  panel("Manga: pudding shop canopy", [843, 610, 1050, 652], 0.7, -1.02);
  // Shallow visible vestibule only. The photograph does not provide a surveyed
  // corridor to the shop; no invented shops or underground route is added.
  outlinedBox(group, [3.2, 1.75, 0.1], [0, 0.85, -0.64], 0x252525);
  for (const x of [-1.63, 1.63])
    outlinedBox(group, [0.15, 1.75, 0.6], [x, 0.85, -0.96]);
  outlinedBox(group, [3.4, 0.15, 0.6], [0, 1.8, -0.96]);
  outlinedBox(group, [3.2, 0.06, 0.7], [0, 0.05, -0.99], 0x777777);
  for (let i = 0; i < 4; i++)
    outlinedBox(
      group,
      [1.25, 0.15, 0.3],
      [-0.91, 0.08 + i * 0.15, -1.22 + i * 0.15],
      0xaaaaaa,
    );
  for (const x of [0.05, 1.33]) {
    outlinedBox(group, [0.045, 0.85, 0.045], [x, 0.42, -0.56], 0x444444);
    outlinedBox(group, [0.045, 0.045, 1.25], [x, 0.84, -0.02], 0x444444);
  }
  outlinedBox(group, [16, 0.18, 3.4], [5.8, -0.06, -2.2], 0xe1dfd5);
  outlinedBox(group, [16, 0.22, 0.15], [5.8, -0.03, -3.9], 0xbab8ae);
  for (let x = -2; x < 13.8; x += 0.8)
    outlinedBox(group, [0.012, 0.005, 3.2], [x, 0.034, -2.2], 0x888888);
  return materials;
}
