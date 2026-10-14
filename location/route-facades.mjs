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
    height: 33,
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
    height: 33,
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
export const routeAtlases = [routeAtlas, kobanAtlas, entranceAtlas];
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
    "No.2 / Hibiki and PopEye",
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
    "No.2 / Lake and Satsudora",
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
  panel(
    "No.3 / Sapporo roof billboard",
    2,
    0,
    1,
    33,
    10,
    [
      [197, 758],
      [580, 620],
      [573, 785],
      [177, 880],
    ],
    { depth: 0.25 },
  ),
  panel(
    "No.3 / Big Echo and Torikizoku",
    2,
    0,
    1,
    24,
    9,
    [
      [176, 881],
      [573, 787],
      [565, 951],
      [156, 1006],
    ],
    { depth: 0.2 },
  ),
  panel(
    "No.3 / northern wall sign stack",
    2,
    0,
    1,
    8.8,
    15.2,
    [
      [155, 1009],
      [564, 954],
      [554, 1125],
      [133, 1151],
    ],
    { depth: 0.14 },
  ),
  panel(
    "No.3 / eastern lower signs",
    2,
    0,
    0.66,
    2.3,
    6.5,
    [
      [133, 1153],
      [351, 1140],
      [344, 1235],
      [121, 1251],
    ],
    { depth: 0.15 },
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
    { depth: 0.4, inkMask: 0.66 },
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
