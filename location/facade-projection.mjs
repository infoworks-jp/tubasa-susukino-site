// Homography from a unit facade to four measured photographic corners, ordered
// top-left, top-right, bottom-right, bottom-left. Subdivided ordinary UVs retain
// perspective correction in both the interactive scene and exported GLB.
export function projectQuad(quad, u, v) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = quad;
  const dx1 = x1 - x2,
    dx2 = x3 - x2,
    dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2,
    dy2 = y3 - y2,
    dy3 = y0 - y1 + y2 - y3;
  const det = dx1 * dy2 - dx2 * dy1;
  if (Math.abs(det) < 1e-8) throw new Error("Degenerate facade photograph");
  const g = (dx3 * dy2 - dx2 * dy3) / det,
    h = (dx1 * dy3 - dx3 * dy1) / det;
  const w = g * u + h * v + 1;
  return [
    ((x1 - x0 + g * x1) * u + (x3 - x0 + h * x3) * v + x0) / w,
    ((y1 - y0 + g * y1) * u + (y3 - y0 + h * y3) * v + y0) / w,
  ];
}

export const photoAtlas = {
  file: "./assets/manga/north-photo-2024.webp",
  originalSize: [6000, 3375],
  crop: [1020, 520, 2800, 1680],
  measurementSize: [2048, 1152],
  source:
    "https://commons.wikimedia.org/wiki/File:Susukino_Intersection,_Sapporo_-_Mar_5,_2024.jpg",
  author: "MIKI Yoshihito",
  date: "2024-03-05",
  license: "CC BY 2.0",
};
export const baseAtlas = {
  file: "./assets/manga/asahi-base-2022.webp",
  originalSize: [3648, 5472],
  crop: [1380, 2580, 480, 1430],
  measurementSize: [1280, 1920],
  source:
    "https://unsplash.com/photos/a-city-street-at-night-with-cars-and-billboards-qsB8WZkPBZs",
  author: "jegal gihwan",
  date: "2022-12-18 (publication)",
  license: "Unsplash License",
};
// Coordinates were measured on the 2048 × 1152 source preview. No sign text is
// regenerated. Footprint endpoints are local map metres (east, south).
export const surveyedPanels = [
  {
    name: "SAMTY / west roof sign",
    q: [
      [562, 209],
      [638, 184],
      [634, 309],
      [557, 331],
    ],
    a: [-66, -83],
    b: [-63.5, -68.5],
    bottom: 30,
    height: 10,
  },
  {
    name: "SAMTY / south roof sign",
    q: [
      [638, 184],
      [740, 212],
      [736, 346],
      [634, 309],
    ],
    a: [-63.5, -68.5],
    b: [-52, -70.6],
    bottom: 30,
    height: 10,
  },
  {
    name: "SAMTY / west roof enclosure",
    q: [
      [557, 331],
      [634, 309],
      [632, 363],
      [552, 387],
    ],
    a: [-66, -83],
    b: [-63.5, -68.5],
    bottom: 25.5,
    height: 4.5,
  },
  {
    name: "SAMTY / south roof enclosure",
    q: [
      [634, 309],
      [736, 346],
      [732, 375],
      [632, 363],
    ],
    a: [-63.5, -68.5],
    b: [-52, -70.6],
    bottom: 25.5,
    height: 4.5,
  },
  {
    name: "Corner building / west signs and windows",
    q: [
      [550, 390],
      [663, 366],
      [661, 708],
      [540, 707],
    ],
    a: [-68.2, -82.6],
    b: [-65.6, -66.9],
    bottom: 2.1,
    height: 23.4,
  },
  {
    name: "Asahi / billboard",
    q: [
      [665, 376],
      [839, 375],
      [834, 577],
      [665, 578],
    ],
    a: [-65.6, -66.9],
    b: [-55.1, -60.8],
    bottom: 11.5,
    height: 14.2,
  },
  {
    name: "Asahi / raised can top",
    q: [
      [716, 347],
      [798, 348],
      [810, 376],
      [705, 376],
    ],
    a: [-62.7, -65.2],
    b: [-57.8, -62.4],
    bottom: 25.7,
    height: 2.0,
  },
  // Split around the foreground street clock. Its pixels are never mapped onto
  // the facade; the unobserved strip remains the neutral surveyed mass.
  {
    name: "Asahi base / left windows",
    q: [
      [666, 581],
      [713, 581],
      [713, 689],
      [666, 692],
    ],
    a: [-65.6, -66.9],
    b: [-62.6, -65.16],
    bottom: 3.7,
    height: 7.8,
  },
  {
    name: "Asahi base / information centre frontage",
    q: [
      [768, 582],
      [834, 580],
      [833, 736],
      [767, 740],
    ],
    a: [-59.3, -63.24],
    b: [-55.1, -60.8],
    bottom: 0.5,
    height: 11,
  },
  {
    name: "Asahi base / left shop",
    q: [
      [680, 695],
      [713, 695],
      [711, 741],
      [680, 742],
    ],
    a: [-64.7, -66.38],
    b: [-62.6, -65.16],
    bottom: 0.5,
    height: 3.2,
  },
  {
    name: "Asahi base / upper cornice",
    q: [
      [713, 581],
      [768, 581],
      [768, 599],
      [713, 600],
    ],
    a: [-62.6, -65.16],
    b: [-59.3, -63.24],
    bottom: 10.1,
    height: 1.4,
  },
  {
    name: "Asahi base / central lower left",
    q: [
      [713, 662],
      [732, 661],
      [730, 740],
      [713, 741],
    ],
    a: [-62.6, -65.16],
    b: [-61.46, -64.5],
    bottom: 0.5,
    height: 5.5,
  },
  {
    name: "Asahi base / central lower right",
    q: [
      [756, 660],
      [768, 660],
      [767, 740],
      [755, 741],
    ],
    a: [-60.02, -63.66],
    b: [-59.3, -63.24],
    bottom: 0.5,
    height: 5.5,
  },
  {
    name: "Asahi base / clock-obscured central strip",
    atlas: baseAtlas,
    q: [
      [492, 908],
      [643, 907],
      [643, 1393],
      [492, 1399],
    ],
    a: [-62.31, -64.99],
    b: [-59.3, -63.24],
    bottom: 0.5,
    height: 11,
    offset: 0.16,
  },
  {
    name: "Brown brick / south facade",
    q: [
      [840, 443],
      [1054, 489],
      [1054, 716],
      [835, 739],
    ],
    a: [-53.8, -61.2],
    b: [-26.7, -66.9],
    bottom: 0.5,
    height: 18.5,
    courses: [0.02, 0.12, 0.34, 0.52, 0.69, 0.88],
    frames: [
      [0.14, 0.098, 0.995, 0.25],
      [0.14, 0.314, 0.995, 0.435],
      [0.14, 0.497, 0.995, 0.603],
      [0.14, 0.665, 0.995, 0.768],
    ],
  },
  {
    name: "Brown brick / Pegasus projecting sign",
    q: [
      [839, 488],
      [865, 495],
      [865, 647],
      [837, 652],
    ],
    a: [-53.8, -61.2],
    b: [-50.4, -61.91],
    bottom: 5.7,
    height: 10.7,
    depth: 0.42,
  },
  {
    name: "Brown tower / south glass and signs",
    q: [
      [1056, 391],
      [1146, 414],
      [1168, 685],
      [1056, 713],
    ],
    a: [-25.9, -66],
    b: [-8.8, -69.1],
    bottom: 0.5,
    height: 32.5,
    courses: [0.02, 0.18, 0.45, 0.82],
  },
  {
    name: "Brown tower / exposed west upper wall",
    q: [
      [952, 326],
      [1049, 353],
      [1052, 451],
      [948, 429],
    ],
    a: [-28.5, -80.4],
    b: [-25.9, -66],
    bottom: 19,
    height: 14,
  },
  {
    name: "Toyoko Inn / south roof lettering",
    q: [
      [1178, 288],
      [1272, 341],
      [1275, 379],
      [1179, 334],
    ],
    a: [2.5, -73.4],
    b: [34.8, -79.5],
    bottom: 46,
    height: 6,
  },
  {
    name: "Toyoko Inn / west roof lettering",
    q: [
      [1054, 317],
      [1178, 288],
      [1179, 334],
      [1054, 360],
    ],
    a: [-1.9, -95.7],
    b: [2.5, -73.4],
    bottom: 46,
    height: 6,
  },
  {
    name: "Toyoko Inn / south windows",
    q: [
      [1195, 354],
      [1275, 392],
      [1292, 646],
      [1192, 669],
    ],
    a: [5, -73.87],
    b: [34.8, -79.5],
    bottom: 2.5,
    height: 43.5,
    courses: [0.03, 0.14, 0.24, 0.34, 0.44, 0.54, 0.64, 0.74, 0.84, 0.94],
  },
  {
    name: "Toyoko Inn / arched window bay",
    q: [
      [1155, 400],
      [1181, 406],
      [1190, 666],
      [1167, 674],
    ],
    a: [0.9, -81.5],
    b: [2.5, -73.4],
    bottom: 2.5,
    height: 40,
    depth: 0.15,
  },
  {
    name: "Toyoko Inn / west upper services",
    q: [
      [1054, 360],
      [1178, 335],
      [1179, 400],
      [1054, 390],
    ],
    a: [-1.9, -95.7],
    b: [2.5, -73.4],
    bottom: 40,
    height: 6,
  },
  {
    name: "West street / dental clinic windows",
    q: [
      [373, 390],
      [443, 376],
      [441, 595],
      [358, 611],
    ],
    a: [-74.7, -117.5],
    b: [-70.4, -94.4],
    bottom: 6.5,
    height: 22,
    courses: [0.04, 0.19, 0.35, 0.51, 0.67, 0.83],
  },
  {
    name: "West street / east wing windows",
    q: [
      [472, 377],
      [546, 395],
      [537, 609],
      [462, 610],
    ],
    a: [-70.4, -94.4],
    b: [-60.3, -95.7],
    bottom: 6.5,
    height: 22,
  },
  {
    name: "West street / dental projecting sign",
    q: [
      [451, 393],
      [472, 398],
      [465, 493],
      [444, 491],
    ],
    a: [-71.8, -102.4],
    b: [-70.4, -94.4],
    bottom: 16.6,
    height: 9.1,
    depth: 0.45,
  },
  {
    name: "West street / karaoke vertical sign",
    q: [
      [442, 540],
      [460, 542],
      [459, 629],
      [441, 626],
    ],
    a: [-71.3, -99.6],
    b: [-70.4, -94.4],
    bottom: 4.8,
    height: 9.5,
    depth: 0.55,
  },
  {
    name: "West street / karaoke storefront",
    q: [
      [460, 627],
      [536, 625],
      [532, 653],
      [458, 656],
    ],
    a: [-70.4, -94.4],
    b: [-60.3, -95.7],
    bottom: 3.4,
    height: 3.1,
  },
];

export function atlasUV(point, atlas = photoAtlas) {
  const scale = atlas.originalSize[0] / atlas.measurementSize[0];
  const [x, y, w, h] = atlas.crop;
  return [(point[0] * scale - x) / w, 1 - (point[1] * scale - y) / h];
}
