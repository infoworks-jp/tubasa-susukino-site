import * as THREE from "three";
import { makeReliefGeometry } from "./facade-relief.mjs";
import { loadArtwork, outlinedBox } from "./artwork.mjs";
import {
  projectQuad,
  atlasUV,
  photoAtlas,
  baseAtlas,
  northSignAtlas,
  surveyedPanels,
} from "./facade-projection.mjs";

export async function addSurveyedFacades(
  city,
  panels = surveyedPanels,
  atlases = [photoAtlas, baseAtlas, northSignAtlas],
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
      "Perspective-correct photo UVs and explicitly credited independent sign illustrations, registered to mapped footprint edges with shallow architectural relief.",
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
    const { geometry: g, reveals } = makeReliefGeometry(panel, atlas);
    if (reveals.attributes.position.count) {
      const reveal = new THREE.Mesh(
        reveals,
        new THREE.MeshStandardMaterial({
          color: 0xaaa9a4,
          roughness: 1,
          side: THREE.DoubleSide,
        }),
      );
      reveal.name = name + " / window reveals and stepped returns";
      reveal.castShadow = true;
      reveal.receiveShadow = true;
      reveal.userData = {
        architecturalRelief: true,
        depths: panel.relief,
        source: atlas.source,
      };
      root.add(reveal);
    } else reveals.dispose();
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      toneMapped: false,
    });
    material.userData.photographicFacade = true;
    materials.push(material);
    const mesh = new THREE.Mesh(g, material);
    mesh.castShadow = true;
    mesh.userData = {
      source: atlas.source,
      photoDate: atlas.illustration ? null : atlas.date,
      illustrationDate: atlas.illustration ? atlas.date : null,
      illustration: !!atlas.illustration,
      license: atlas.license,
      measuredPhotoCorners: q,
      architecturalRelief: panel.relief || [],
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
        [
          0,
          0,
          -Math.max(
            panel.depth / 2 + 0.015,
            ...(panel.relief || []).map(
              (r) => -r.depth + panel.depth / 2 + 0.015,
            ),
          ),
        ],
        0xbdbcb7,
      );
  }
  document.documentElement.dataset[
    groupName.includes("Route 36") ? "routePanels" : "surveyedPanels"
  ] = String(panels.length);
  return materials;
}
