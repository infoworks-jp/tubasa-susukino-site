import { configureRouteRelief } from "./route-relief.mjs";
// Photo corners measured in the listed preview dimensions. Every street-facing
// panel is attached to the same OSM edge as its parent building, in local metres.
export const routeBuildings = [
  {
    name: "No.2 Green Building",
    ring: [
      [-43.31, -11.45],
      [-23.24, -14.94],
      [-21.49, -5.35],
      [-11.02, -7.53],
      [-7.96, 8.62],
      [-38.94, 13.85],
    ],
    height: 25.45,
  },
  {
    name: "Susukino Koban",
    ring: [
      [-22.36, -15.82],
      [-15.38, -17.13],
      [-14.07, -8.4],
      [-20.62, -7.09],
    ],
    height: 15,
  },
  {
    name: "No.3 Green Building",
    ring: [
      [-11.02, -17.56],
      [33.93, -25.42],
      [40.91, -20.62],
      [45.71, 7.31],
      [-5.35, 16.47],
    ],
    height: 27.3,
  },
];
export const routeAtlas = {
  file: "./assets/manga/route-2018.webp",
  originalSize: [4032, 3024],
  measurementSize: [1824, 1368],
  crop: [260, 880, 1735, 1920],
  source:
    "https://commons.wikimedia.org/wiki/File:Susukino,_Sapporo_at_night_on_July_17th,_2018.jpg",
  author: "Choi2451",
  date: "2018-07-17",
  license: "CC BY-SA 4.0",
};
export const kobanAtlas = {
  file: "./assets/manga/koban-2022.webp",
  originalSize: [3264, 4928],
  measurementSize: [1280, 1933],
  crop: [0, 0, 3264, 4928],
  source: "https://commons.wikimedia.org/wiki/File:Susukino_Koban_202203.jpg",
  author: "禁樹なずな",
  date: "2022-03-13",
  license: "CC BY-SA 4.0",
};
export const entranceAtlas = {
  file: "./assets/manga/yokocho-photo.webp",
  originalSize: [1322, 979],
  measurementSize: [1322, 979],
  crop: [0, 0, 1322, 979],
  source: "User supplied photograph; permission confirmed 2026-10-14",
  author: "提供写真",
  date: "撮影日未確認",
  license: "Used with permission",
};
// These two atlases are independent illustrations of the confirmed ad layout.
// They contain no Google Maps/Street View imagery. Keep photo and redraw dates
// separate in the downloadable model and credits.
export const greenNo3Atlas = {
  file: "./assets/manga/green-no3-signs-2025.webp",
  originalSize: [2400, 2150],
  measurementSize: [2400, 2150],
  crop: [0, 0, 2400, 2150],
  source:
    "Independently drawn signage; user reference dated August 2025; official tenant directory: https://www.susukino-greenbuilding.com/tenants_cat/no3-gb-8f/",
  author: "味一番つばさサイト制作",
  date: "2025-08 reference / 2026-10-14 redraw",
  license:
    "Site-created illustration; depicted brand marks belong to their respective owners",
  illustration: true,
};
export const greenNo2Atlas = {
  ...greenNo3Atlas,
  file: "./assets/manga/green-no2-signs-2025.webp",
  originalSize: [1600, 3200],
  measurementSize: [1600, 3200],
  crop: [0, 0, 1600, 3200],
  source:
    "Independently drawn signage; names, colours and ordering from user reference dated August 2025",
};
export const routeAtlases = [
  greenNo2Atlas,
  greenNo3Atlas,
  kobanAtlas,
  entranceAtlas,
];
export function edgePoint(building, t) {
  const [west, east] = routeBuildings[building].ring;
  return [east[0] + (west[0] - east[0]) * t, east[1] + (west[1] - east[1]) * t];
}
// image-left is east on this south side of Route 36.
function panel(name, building, from, to, bottom, height, q, extra = {}) {
  return {
    name,
    building,
    a: edgePoint(building, from),
    b: edgePoint(building, to),
    bottom,
    height,
    q,
    atlas: routeAtlas,
    offset: 0.12,
    ...extra,
  };
}
export const routePanels = [
  panel(
    "No.2 / Maruhan roof sign",
    0,
    0,
    1,
    33,
    10,
    [
      [638, 533],
      [878, 417],
      [871, 637],
      [623, 703],
    ],
    { depth: 0.24 },
  ),
  panel(
    "No.2 / Fighters billboard",
    0,
    0,
    1,
    24.5,
    8.5,
    [
      [617, 726],
      [856, 648],
      [850, 836],
      [590, 901],
    ],
    { depth: 0.2 },
  ),
  panel(
    "No.2 / lounge signs",
    0,
    0,
    1,
    20.3,
    4.2,
    [
      [590, 901],
      [849, 841],
      [846, 926],
      [579, 975],
    ],
    { depth: 0.12 },
  ),
  panel(
    "No.2 / Hibiki and ACQUA",
    0,
    0.42,
    1,
    11.8,
    8.5,
    [
      [700, 951],
      [846, 932],
      [840, 1099],
      [692, 1114],
    ],
    { depth: 0.22 },
  ),
  panel("No.2 / western sign band", 0, 0, 0.42, 11.8, 8.5, [
    [579, 981],
    [695, 959],
    [688, 1115],
    [565, 1129],
  ]),
  panel(
    "No.2 / restaurant fascia",
    0,
    0,
    1,
    8.2,
    3.6,
    [
      [565, 1129],
      [839, 1105],
      [838, 1148],
      [560, 1171],
    ],
    { depth: 0.22 },
  ),
  panel(
    "No.2 / Able and Satsudora",
    0,
    0,
    1,
    3.4,
    4.8,
    [
      [559, 1174],
      [838, 1154],
      [837, 1221],
      [550, 1230],
    ],
    { depth: 0.14 },
  ),
  panel(
    "No.2 / street level fascia",
    0,
    0,
    1,
    2.3,
    1.1,
    [
      [549, 1230],
      [837, 1222],
      [836, 1247],
      [548, 1250],
    ],
    { depth: 0.18 },
  ),
  // One registration from roof to shop fascia. Independently stretching four
  // horizontal strips used to break the tall signs and shift the lower shops.
  panel(
    "No.3 / continuous updated frontage",
    2,
    0,
    1,
    2.3,
    30.7,
    [
      [0, 0],
      [2400, 0],
      [2400, 2150],
      [0, 2150],
    ],
    { offset: 0.025, atlas: greenNo3Atlas },
  ),
  // Current police-box front, split around its step-back and entrance frame.
  panel(
    "Koban / eastern stone pier",
    1,
    0,
    0.14,
    0,
    15,
    [
      [485, 4],
      [593, 4],
      [593, 1868],
      [477, 1894],
    ],
    { atlas: kobanAtlas },
  ),
  panel(
    "Koban / glazed window bay",
    1,
    0.14,
    0.63,
    1.4,
    13.6,
    [
      [595, 65],
      [824, 278],
      [926, 1675],
      [595, 1686],
    ],
    { atlas: kobanAtlas, courses: [0.18, 0.39, 0.6, 0.8] },
  ),
  panel(
    "Koban / POLICE and wall lettering",
    1,
    0.63,
    1,
    4,
    11,
    [
      [828, 148],
      [1030, 350],
      [1180, 1307],
      [895, 1265],
    ],
    { atlas: kobanAtlas, depth: 0.14 },
  ),
  panel(
    "Koban / brick door and red lamps",
    1,
    0.63,
    1,
    0,
    4,
    [
      [897, 1276],
      [1184, 1315],
      [1243, 1742],
      [940, 1808],
    ],
    { atlas: kobanAtlas, depth: 0.22 },
  ),
  panel(
    "Koban / glazed bay plinth",
    1,
    0.14,
    0.63,
    0,
    1.4,
    [
      [595, 1696],
      [927, 1681],
      [937, 1809],
      [595, 1853],
    ],
    { atlas: kobanAtlas },
  ),
  {
    name: "Koban / east tile wall and windows",
    building: 1,
    a: [-14.07, -8.4],
    b: [-15.38, -17.13],
    bottom: 0,
    height: 15,
    q: [
      [146, 273],
      [477, 17],
      [477, 1894],
      [22, 1795],
    ],
    atlas: kobanAtlas,
    offset: 0.12,
  },
];
// The authorized photograph covers 14.7m at the western end of No.3's north
// frontage. Its doorway centre is x=889.2 in the source, not the atlas's old
// generated doorway. It and every neighbouring sign share this single transform.
export const entranceSpan = {
  east: edgePoint(2, 0.66),
  west: edgePoint(2, 0.98),
  photoLeft: 100,
  photoRight: 1000,
  ground: 566,
  scale: 14.6 / 900,
};
export function entrancePoint(x) {
  const t =
    (x - entranceSpan.photoLeft) /
    (entranceSpan.photoRight - entranceSpan.photoLeft);
  return entranceSpan.east.map((v, i) => v + (entranceSpan.west[i] - v) * t);
}
export const entranceAnchor = entrancePoint(889);
export const entranceAngle = -Math.atan2(
  entranceSpan.east[1] - entranceSpan.west[1],
  entranceSpan.east[0] - entranceSpan.west[0],
);
function entrance(name, q, extra = {}) {
  const top = (q[0][1] + q[1][1]) / 2,
    btm = (q[2][1] + q[3][1]) / 2;
  return {
    name,
    building: 2,
    a: entrancePoint((q[0][0] + q[3][0]) / 2),
    b: entrancePoint((q[1][0] + q[2][0]) / 2),
    bottom: (566 - btm) * entranceSpan.scale,
    height: (btm - top) * entranceSpan.scale,
    q,
    atlas: entranceAtlas,
    offset: 0.15,
    ...extra,
  };
}
routePanels.push(
  entrance(
    "Yokocho / Uosen lettering",
    [
      [101, 1],
      [490, 1],
      [489, 122],
      [101, 125],
    ],
    { depth: 0.22 },
  ),
  entrance(
    "Yokocho / Lake broad fascia",
    [
      [102, 131],
      [489, 127],
      [488, 221],
      [102, 223],
    ],
    { depth: 0.18 },
  ),
  entrance("Yokocho / window and tile upper band", [
    [103, 225],
    [550, 215],
    [550, 291],
    [102, 299],
  ]),
  entrance("Yokocho / upper railing", [
    [495, 2],
    [768, 2],
    [768, 191],
    [495, 214],
  ]),
  entrance(
    "Yokocho / champagne billboard",
    [
      [772, 1],
      [1045, 1],
      [1043, 184],
      [771, 192],
    ],
    { depth: 0.25 },
  ),
  entrance("Yokocho / wall beneath billboard", [
    [775, 195],
    [994, 185],
    [995, 319],
    [775, 320],
  ]),
  entrance(
    "Yokocho / Torikizoku projecting sign",
    [
      [620, 138],
      [702, 155],
      [702, 196],
      [619, 174],
    ],
    { depth: 0.5 },
  ),
  entrance(
    "Yokocho / Lake projecting sign",
    [
      [618, 202],
      [700, 220],
      [700, 270],
      [617, 248],
    ],
    { depth: 0.5 },
  ),
  entrance(
    "Yokocho / pudding shop sign and canopy",
    [
      [581, 326],
      [786, 325],
      [783, 459],
      [582, 459],
    ],
    { depth: 0.3 },
  ),
  entrance(
    "Photograph: Shin Ramen Yokocho sign",
    [
      [792, 324],
      [986, 320],
      [987, 461],
      [790, 464],
    ],
    { depth: 0.4, inkMask: 0.72 },
  ),
  entrance("Yokocho / pudding shop glass", [
    [621, 465],
    [779, 464],
    [779, 561],
    [621, 561],
  ]),
  entrance("Yokocho / western brick jamb", [
    [989, 321],
    [1017, 321],
    [1019, 568],
    [989, 567],
  ]),
);

const no2Rects = [
  [0, 0, 1600, 780],
  [0, 780, 1600, 1450],
  [0, 1450, 1600, 1750],
  [670, 1750, 1600, 2390],
  [0, 1750, 670, 2390],
  [0, 2390, 1600, 2670],
  [0, 2670, 1600, 3065],
  [0, 3065, 1600, 3200],
];
routePanels
  .filter((p) => p.building === 0)
  .forEach((p, i) => {
    const [l, t, r, b] = no2Rects[i];
    p.q = [
      [l, t],
      [r, t],
      [r, b],
      [l, b],
    ];
    p.atlas = greenNo2Atlas;
  });
// Remove photographic repeats of the four signs/bays now present in the
// continuous updated frontage. The actual alley sign, doorway and lower glass
// photograph stay in place. Each ad appears once, including in GLB exports.
const supersededEntrance = new Set([
  "Yokocho / Uosen lettering",
  "Yokocho / Lake broad fascia",
  "Yokocho / upper railing",
  "Yokocho / champagne billboard",
]);
for (let i = routePanels.length - 1; i >= 0; i--)
  if (supersededEntrance.has(routePanels[i].name)) routePanels.splice(i, 1);
for (const p of routePanels.filter((p) => p.building === 0)) {
  p.bottom = 2.3 + ((p.bottom - 2.3) * 30.7) / 40.7;
  p.height *= 30.7 / 40.7;
}
configureRouteRelief(routePanels);
