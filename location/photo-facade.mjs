import * as THREE from "three";
import { loadArtwork, artworkPlane, outlinedBox } from "./artwork.mjs";

export function setPhotoMode(material, mode) {
  // The drawing is intentionally retained in all four views; night subtly
  // warms the paper, without running the old noisy photograph threshold.
  material.color.set(mode === "night" ? 0xe4d9bc : 0xffffff);
}
export async function addPhotoFacade(group) {
  const texture = await loadArtwork("./assets/manga/yokocho-facade.webp");
  const materials = [];
  // Preserve the approved manga underdrawing where the source photo is hidden
  // by trees. Measured photographic signs are placed above it by route-facades.
  for (const [name, rect] of [
    ["Approved manga / frontage underdrawing", [0, 0, 1430, 653]],
    ["Approved manga / lower shops", [0, 653, 1095, 810]],
    ["Approved manga / brick jamb", [1385, 653, 1430, 810]],
  ]) {
    const [x0, y0, x1, y1] = rect,
      s = 3.2 / 288;
    const mesh = artworkPlane(texture, (x1 - x0) * s, (y1 - y0) * s, rect);
    mesh.rotation.y = Math.PI;
    mesh.position.set(
      (1240 - (x0 + x1) / 2) * s,
      (810 - (y0 + y1) / 2) * s,
      -0.07,
    );
    mesh.name = name;
    mesh.userData = {
      source:
        "Authorized user photograph; approved manga adaptation. Unseen details approximate.",
    };
    group.add(mesh);
    materials.push(mesh.material);
  }
  // Visible shallow doorway only; its parent uses No.3's shared mapped edge.
  // The supplied photo shows a handrail and a dark descending vestibule, not
  // the invented four exterior steps used in the previous version.
  outlinedBox(group, [3.18, 1.66, 0.08], [0, 0.83, -0.16], 0x242322);
  for (const x of [-1.63, 1.63])
    outlinedBox(group, [0.13, 1.7, 0.42], [x, 0.85, -0.24], 0x8b8580);
  outlinedBox(group, [3.4, 0.12, 0.42], [0, 1.72, -0.24], 0xaaa69e);
  outlinedBox(group, [3.2, 0.05, 0.8], [0, 0.025, -0.5], 0x74716a);
  for (const x of [-0.8, 0.2]) {
    outlinedBox(group, [0.045, 0.9, 0.045], [x, 0.45, -0.18], 0xbab8b0);
    outlinedBox(group, [0.045, 0.045, 0.72], [x, 0.88, 0.16], 0xbab8b0);
  }
  return materials;
}
