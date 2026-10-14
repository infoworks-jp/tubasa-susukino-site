import * as THREE from "three";
import { loadArtwork, outlinedBox } from "./artwork.mjs";
import {
  projectQuad,
  atlasUV,
  photoAtlas,
  baseAtlas,
  surveyedPanels,
} from "./facade-projection.mjs";

export async function addSurveyedFacades(
  city,
  panels = surveyedPanels,
  atlases = [photoAtlas, baseAtlas],
  groupName = "Susukino / photographed street detail",
) {
  const textures = new Map(
      await Promise.all(
        atlases.map(async (a) => [a.file, await loadArtwork(a.file)]),
      ),
    ),
    materials = [];
  const group = new THREE.Group();
  group.name = groupName;
  group.userData = {
    sources: atlases,
    panelCount: panels.length,
    technique:
      "Perspective-correct photographic facade UVs, measured footprint edges, shallow architectural relief. No generated lettering.",
    limitations:
      "Dates are recorded per photo source. Heights and relief are approximate; hidden facade areas and interior shops are not reconstructed.",
  };
  city.add(group);
  for (const panel of panels) {
    const { a, b, bottom, height, q, name } = panel;
    const atlas = panel.atlas || photoAtlas,
      texture = textures.get(atlas.file);
    const w = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const root = new THREE.Group();
    root.name = name;
    root.rotation.y = -Math.atan2(b[1] - a[1], b[0] - a[0]);
    const normal = new THREE.Vector3(
      -(b[1] - a[1]),
      0,
      b[0] - a[0],
    ).normalize();
    root.position
      .set((a[0] + b[0]) / 2, bottom + height / 2, (a[1] + b[1]) / 2)
      .addScaledVector(normal, (panel.offset ?? 0.18) + (panel.depth || 0));
    group.add(root);
    const g = new THREE.PlaneGeometry(w, height, 32, 32),
      pos = g.attributes.position,
      uv = g.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const pixel = projectQuad(
        q,
        pos.getX(i) / w + 0.5,
        0.5 - pos.getY(i) / height,
      );
      uv.setXY(i, ...atlasUV(pixel, atlas));
    }
    g.setAttribute(
      "inkArtwork",
      new THREE.Float32BufferAttribute(
        new Float32Array(pos.count).fill(0.6),
        1,
      ),
    );
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      toneMapped: false,
    });
    material.userData.photographicFacade = true;
    materials.push(material);
    const mesh = new THREE.Mesh(g, material);
    mesh.userData = {
      source: atlas.source,
      photoDate: atlas.date,
      license: atlas.license,
      measuredPhotoCorners: q,
    };
    root.add(mesh);
    // Thin cornices and continuous window frames follow rows visible in this
    // specific photo, never a random/generated window grid.
    for (const y of panel.courses || [])
      outlinedBox(
        root,
        [w, 0.07, 0.16],
        [0, height * (0.5 - y), -0.02],
        0xa3a09b,
      );
    for (const [left, top, right, btm] of panel.frames || []) {
      for (const y of [top, btm])
        outlinedBox(
          root,
          [w * (right - left), 0.045, 0.1],
          [w * ((left + right) / 2 - 0.5), height * (0.5 - y), 0.035],
          0x34383b,
        );
    }
    if (panel.depth)
      outlinedBox(
        root,
        [w, height, panel.depth],
        [0, 0, -panel.depth / 2 - 0.015],
        0xbdbcb7,
      );
  }
  document.documentElement.dataset[
    groupName.includes("Route 36") ? "routePanels" : "surveyedPanels"
  ] = String(panels.length);
  return materials;
}
