import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { loadArtwork, artworkPlane, outlinedBox } from "./artwork.mjs";
export const artworkCredits =
  "写真翻案: x768 (CC BY-SA 2.0), ノボホショコロトソ (CC BY 4.0), MIKI Yoshihito (CC BY 2.0)";
export const artworkSources = [
  {
    author: "x768",
    date: "2016-07-31",
    url: "https://commons.wikimedia.org/wiki/File:Susukino_2016_(28870538075).jpg",
    license: "https://creativecommons.org/licenses/by-sa/2.0/",
  },
  {
    author: "ノボホショコロトソ",
    date: "2024-03-25",
    url: "https://commons.wikimedia.org/wiki/File:すすきの交差点_01.jpg",
    license: "https://creativecommons.org/licenses/by/4.0/",
  },
  {
    author: "MIKI Yoshihito",
    date: "2024-03-05",
    url: "https://commons.wikimedia.org/wiki/File:Susukino_Intersection,_Sapporo_-_Mar_5,_2024.jpg",
    license: "https://creativecommons.org/licenses/by/2.0/",
  },
];
const northBuildings = [
  {
    ring: [
      [-57.7, -84.8],
      [-43, -87.4],
      [-39, -63.8],
      [-44, -62.9],
      [-56, -72.5],
    ],
    height: 19,
  },
  {
    ring: [
      [-43, -87.4],
      [-12.3, -92.8],
      [-8.2, -69.1],
      [-39, -63.8],
    ],
    height: 22,
  },
  {
    ring: [
      [-6, -97.7],
      [30.7, -104],
      [34.8, -81.1],
      [-1.9, -74.8],
    ],
    height: 46,
  },
];
// Replace the procedural north-side masses as well as their windows. Otherwise
// random tall walls protrude through the photo-derived facades. The resulting
// geometry stays in the original collision mesh and its BVH is rebuilt by caller.
export function refineLandmarkMasses(mesh) {
  if (!["buildings", "buildingsDetail"].includes(mesh.name)) return;
  mesh.updateWorldMatrix(true, false);
  const source = mesh.geometry.index
    ? mesh.geometry.toNonIndexed()
    : mesh.geometry.clone();
  const pos = source.attributes.position,
    keep = [],
    p = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 3) {
    let replaced = false;
    for (let j = 0; j < 3; j++) {
      p.fromBufferAttribute(pos, i + j).applyMatrix4(mesh.matrixWorld);
      replaced ||= p.x > -62 && p.x < 43 && p.z > -108 && p.z < -57;
    }
    if (!replaced) keep.push(i, i + 1, i + 2);
  }
  const geometry = new THREE.BufferGeometry();
  for (const [name, attribute] of Object.entries(source.attributes)) {
    const values = new attribute.array.constructor(
      keep.length * attribute.itemSize,
    );
    keep.forEach((index, i) => {
      for (let j = 0; j < attribute.itemSize; j++)
        values[i * attribute.itemSize + j] =
          attribute.array[index * attribute.itemSize + j];
    });
    geometry.setAttribute(
      name,
      new THREE.BufferAttribute(
        values,
        attribute.itemSize,
        attribute.normalized,
      ),
    );
  }
  const parts = [geometry];
  if (mesh.name === "buildings")
    for (const { ring, height } of northBuildings) {
      const shape = new THREE.Shape(
        ring.map(([x, z]) => new THREE.Vector2(x, -z)),
      );
      const body = new THREE.ExtrudeGeometry(shape, {
        depth: height,
        bevelEnabled: false,
      });
      body.rotateX(-Math.PI / 2);
      body.applyMatrix4(mesh.matrixWorld.clone().invert());
      // Match the exported geometry's attribute representation for a safe merge.
      for (const name of Object.keys(body.attributes))
        if (!geometry.attributes[name]) body.deleteAttribute(name);
      for (const [name, attribute] of Object.entries(geometry.attributes)) {
        const current = body.attributes[name],
          count = body.attributes.position.count;
        const values = new attribute.array.constructor(
          count * attribute.itemSize,
        );
        for (let i = 0; i < count; i++)
          for (let j = 0; j < attribute.itemSize; j++) {
            let value = current
              ? current.array[i * current.itemSize + j]
              : name === "color"
                ? 0.72
                : 0;
            if (attribute.normalized) {
              const maximum =
                attribute.array instanceof Int16Array
                  ? 32767
                  : attribute.array instanceof Int8Array
                    ? 127
                    : attribute.array instanceof Uint16Array
                      ? 65535
                      : 255;
              value = Math.round(value * maximum);
            }
            values[i * attribute.itemSize + j] = value;
          }
        body.setAttribute(
          name,
          new THREE.BufferAttribute(
            values,
            attribute.itemSize,
            attribute.normalized,
          ),
        );
      }
      parts.push(body);
    }
  const previous = mesh.geometry;
  mesh.geometry = mergeGeometries(parts, false);
  mesh.geometry.computeBoundingBox();
  mesh.geometry.computeBoundingSphere();
  previous.dispose();
  source.dispose();
  parts.forEach((g) => g.dispose());
}
export async function addIllustratedStreet(city) {
  const group = new THREE.Group();
  group.name = "Susukino / illustrated landmark facades";
  group.userData = {
    sources: artworkSources,
    adaptation:
      "AI-assisted manga redraw, cropped facade panels and shallow geometric relief. Advertisements reflect source photographs, not a current advertising survey.",
    license:
      "Nikka artwork CC BY-SA 4.0; north artwork CC BY 4.0. See artwork-sources.md.",
  };
  city.add(group);
  const [nikka, north] = await Promise.all([
    loadArtwork("./assets/manga/nikka-facade.webp"),
    loadArtwork("./assets/manga/north-facades.webp"),
  ]);
  const materials = [];
  // a is the image-left corner viewed from the street. Each plane follows an
  // actual footprint edge. Textures are never repeated across unrelated blocks.
  function face(name, texture, rect, a, b, bottom, height, outset = 0.5) {
    const direction = new THREE.Vector3(b[0] - a[0], 0, b[1] - a[1]),
      w = direction.length();
    const angle = -Math.atan2(direction.z, direction.x),
      normal = new THREE.Vector3(-direction.z, 0, direction.x).normalize();
    const center = new THREE.Vector3(
      (a[0] + b[0]) / 2,
      bottom + height / 2,
      (a[1] + b[1]) / 2,
    ).addScaledVector(normal, outset);
    const root = new THREE.Group();
    root.position.copy(center);
    root.rotation.y = angle;
    root.name = name;
    group.add(root);
    outlinedBox(root, [w, height, 0.28], [0, 0, -0.15]);
    const mesh = artworkPlane(texture, w, height, rect);
    root.add(mesh);
    materials.push(mesh.material);
    mesh.userData = {
      artwork: true,
      source: "See scene artworkSources and /location/artwork-sources.md",
    };
    return root;
  }
  // Susukino Building's north wall, chamfer and west wall (OSM footprint 273).
  // Exclude the adjacent Maruhan/Hibiki panels that the atlas renderer included.
  face(
    "Nikka / north fluted wall",
    nikka,
    [27, 286, 476, 800],
    [-43.7, -10.6],
    [-50.3, -9.7],
    5.7,
    17.5,
    1.1,
  );
  face(
    "Nikka / corner facade",
    nikka,
    [642, 190, 885, 991],
    [-50.3, -9.7],
    [-57.7, 2.5],
    0,
    27,
    1.1,
  );
  face(
    "Nikka / west fluted wall",
    nikka,
    [1030, 282, 1515, 991],
    [-57.7, 2.5],
    [-54.2, 21.3],
    0,
    24,
    1.1,
  );
  face(
    "Nikka / Kirin roof sign",
    nikka,
    [609, 0, 922, 177],
    [-50.3, -9.7],
    [-57.7, 2.5],
    27.2,
    7.2,
    1.1,
  );
  face(
    "Nikka / west Kirin roof sign",
    nikka,
    [1030, 0, 1515, 225],
    [-57.7, 2.5],
    [-54.2, 21.3],
    27.2,
    7.2,
    1.1,
  );
  // Photo-identified north-side sequence: Asahi corner, brown low commercial
  // building, Toyoko Inn. Ground lines align to the map; absolute heights approximate.
  face(
    "Asahi / corner advertisement",
    north,
    [155, 8, 498, 453],
    [-56, -72.5],
    [-44, -62.9],
    12,
    19,
    1.1,
  );
  face(
    "North block / brown brick frontage",
    north,
    [499, 188, 1312, 639],
    [-39, -63.8],
    [-8.2, -69.1],
    4,
    18,
    1.1,
  );
  face(
    "Toyoko Inn / south frontage",
    north,
    [1500, 10, 1950, 777],
    [-1.9, -74.8],
    [34.8, -81.1],
    0,
    46,
    1.1,
  );
  face(
    "Toyoko Inn / west frontage",
    north,
    [1320, 10, 1730, 777],
    [-6, -97.7],
    [-1.9, -74.8],
    0,
    46,
    1.1,
  );
  return materials;
}
