import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { loadArtwork, artworkPlane, outlinedBox } from "./artwork.mjs";
import { routeBuildings, routeAtlases } from "./route-facades.mjs";
import { northSignAtlas } from "./facade-projection.mjs";
export const artworkCredits =
  "写真: x768 (CC BY-SA 2.0), ノボホショコロトソ (CC BY 4.0), MIKI Yoshihito (CC BY 2.0), jegal gihwan (Unsplash), 禁樹なずな (CC BY-SA 4.0), 提供写真 / グリーンビル・北側広告: 2025年資料から独自作画";
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
  {
    author: "jegal gihwan",
    date: "2022-12-18 (publication)",
    url: "https://unsplash.com/photos/a-city-street-at-night-with-cars-and-billboards-qsB8WZkPBZs",
    license: "https://unsplash.com/license",
  },
];
artworkSources.push(
  ...[...routeAtlases, northSignAtlas].map((a) => ({
    author: a.author,
    date: a.date,
    url: a.source,
    license: a.license,
    illustration: !!a.illustration,
  })),
);
// Map footprints; facade heights are documented approximations where no
// survey is available. The Asahi chamfer is at the actual western corner.
const northBuildings = [
  {
    ring: [
      [-68.2, -82.6],
      [-58.1, -84.3],
      [-53.8, -61.2],
      [-55.1, -60.8],
      [-65.6, -66.9],
    ],
    height: 25.5,
  },
  {
    ring: [
      [-57.7, -84.8],
      [-30.7, -89.6],
      [-26.7, -66.9],
      [-53.8, -61.2],
    ],
    height: 19,
  },
  {
    ring: [
      [-13.2, -92.6],
      [-8.8, -69.1],
      [-25.9, -66],
      [-28.5, -80.4],
      [-21.1, -81.7],
      [-22.8, -90.9],
    ],
    height: 33,
  },
  {
    ring: [
      [-12.3, -93.1],
      [-4.5, -94.8],
      [-0.1, -71.2],
      [-8.4, -69.9],
    ],
    height: 37,
  },
  {
    ring: [
      [-1.9, -95.7],
      [30.4, -101.3],
      [34.8, -79.5],
      [2.5, -73.4],
    ],
    height: 52,
  },
  {
    ring: [
      [-64.3, -119.7],
      [-60.3, -95.7],
      [-70.4, -94.4],
      [-74.7, -117.5],
    ],
    height: 28.5,
  },
];
// Replace the procedural north-side masses as well as their windows. Otherwise
// random tall walls protrude through the photo-derived facades. The resulting
// geometry stays in the original collision mesh and its BVH is rebuilt by caller.
function withinRoute(x, z) {
  // Expanded only 0.32m to include the original decorative window relief.
  return routeBuildings.some(({ ring }) => {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const a = ring[j],
        b = ring[i],
        dx = b[0] - a[0],
        dz = b[1] - a[1];
      const t = Math.max(
        0,
        Math.min(1, ((x - a[0]) * dx + (z - a[1]) * dz) / (dx * dx + dz * dz)),
      );
      if (Math.hypot(x - a[0] - t * dx, z - a[1] - t * dz) < 0.32) return true;
      if (
        a[1] > z !== b[1] > z &&
        x < ((b[0] - a[0]) * (z - a[1])) / (b[1] - a[1]) + a[0]
      )
        inside = !inside;
    }
    return inside;
  });
}
export function refineLandmarkMasses(mesh) {
  if (!["buildings", "buildingsDetail"].includes(mesh.name)) return;
  mesh.updateWorldMatrix(true, false);
  const source = mesh.geometry.index
    ? mesh.geometry.toNonIndexed()
    : mesh.geometry.clone();
  const pos = source.attributes.position,
    keep = [],
    p = new THREE.Vector3(),
    centroid = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 3) {
    let replaced = false;
    centroid.set(0, 0, 0);
    for (let j = 0; j < 3; j++) {
      p.fromBufferAttribute(pos, i + j).applyMatrix4(mesh.matrixWorld);
      centroid.add(p);
      replaced ||=
        (p.x > -73 && p.x < 43 && p.z > -108 && p.z < -57) ||
        (p.x > -76 && p.x < -57 && p.z > -121 && p.z < -92);
    }
    // A shared boundary vertex must not delete the neighbouring building.
    replaced ||= withinRoute(centroid.x / 3, centroid.z / 3);
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
    for (const { ring, height } of [...northBuildings, ...routeBuildings]) {
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
  const nikka = await loadArtwork("./assets/manga/nikka-facade.webp");
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
  return materials;
}
