import { unprojectPhoto } from "./facade-relief.mjs";

// All x/y measurements below refer to the source previews declared in
// route-facades.mjs. Depths are conservative modelling estimates, not a survey.
export function configureRouteRelief(panels) {
  const get = (name) => panels.find((p) => p.name === name);
  function pixelRect(p, corners, depth, label) {
    const uv = corners.map((pt) => unprojectPhoto(p.q, pt));
    const rect = [
      (uv[0][0] + uv[3][0]) / 2,
      (uv[0][1] + uv[1][1]) / 2,
      (uv[1][0] + uv[2][0]) / 2,
      (uv[2][1] + uv[3][1]) / 2,
    ].map((n) => Math.max(0.001, Math.min(0.999, n)));
    p.relief ||= [];
    p.relief.push({ rect, depth, label, photoCorners: corners });
  }
  let p = get("Koban / glazed window bay");
  p.offset = 0.52;
  p.courses = [];
  // Four mullion bays. Rows measured at the left jamb in the 1280x1933 photo.
  const cols = [0, 0.225, 0.49, 0.75, 1];
  const rows = [65, 177, 403, 472, 734, 807, 1194, 1365, 1686].map(
    (y) => unprojectPhoto(p.q, [595, y])[1],
  );
  p.relief = [];
  for (let y = 0; y < rows.length - 1; y++)
    for (let x = 0; x < cols.length - 1; x++)
      p.relief.push({
        rect: [
          cols[x] + 0.014,
          rows[y] + 0.004,
          cols[x + 1] - 0.014,
          rows[y + 1] - 0.004,
        ],
        depth: -0.29,
        label: "recessed photographed glass pane",
      });
  p.measurement = {
    photo: "koban-2022",
    leftJamb: [595, 65, 1686],
    rows: [65, 177, 403, 472, 734, 807, 1194, 1365, 1686],
    columns: cols,
  };
  p = get("Koban / POLICE and wall lettering");
  p.offset = 0.55;
  p.depth = 0.12;
  pixelRect(
    p,
    [
      [967, 458],
      [1008, 493],
      [1031, 650],
      [986, 629],
    ],
    -0.34,
    "upper recessed window",
  );
  pixelRect(
    p,
    [
      [933, 655],
      [1009, 698],
      [1037, 901],
      [962, 873],
    ],
    -0.34,
    "lower recessed window",
  );
  p = get("Koban / brick door and red lamps");
  p.offset = 0.58;
  p.depth = 0.12;
  pixelRect(
    p,
    [
      [1008, 1448],
      [1134, 1457],
      [1153, 1752],
      [1041, 1777],
    ],
    -0.42,
    "recessed doorway",
  );
  pixelRect(
    p,
    [
      [924, 1344],
      [999, 1354],
      [1006, 1403],
      [931, 1393],
    ],
    0.14,
    "left red lamp housing",
  );
  pixelRect(
    p,
    [
      [1138, 1374],
      [1191, 1381],
      [1197, 1429],
      [1145, 1421],
    ],
    0.14,
    "right red lamp housing",
  );
  p = get("Koban / eastern stone pier");
  p.offset = 0.58;
  p = get("Koban / glazed bay plinth");
  p.offset = 0.52;
  p = get("Koban / east tile wall and windows");
  p.offset = 0.48;
  pixelRect(
    p,
    [
      [281, 291],
      [326, 250],
      [324, 394],
      [278, 426],
    ],
    -0.28,
    "upper side window",
  );
  pixelRect(
    p,
    [
      [146, 500],
      [174, 474],
      [172, 541],
      [145, 566],
    ],
    -0.22,
    "small side window",
  );
  pixelRect(
    p,
    [
      [207, 664],
      [260, 610],
      [257, 777],
      [205, 819],
    ],
    -0.28,
    "middle side window",
  );
  pixelRect(
    p,
    [
      [317, 924],
      [399, 857],
      [398, 1049],
      [316, 1090],
    ],
    -0.28,
    "lower side window",
  );
  p = get("Yokocho / window and tile upper band");
  p.offset = 0.42;
  for (const [l, r] of [
    [200, 230],
    [237, 267],
    [274, 305],
    [372, 408],
  ])
    pixelRect(
      p,
      [
        [l, 239],
        [r, 237],
        [r, 289],
        [l, 291],
      ],
      -0.24,
      "photographed upper window",
    );
  p = get("Yokocho / wall beneath billboard");
  p.offset = 0.32;
  p.relief = [];
  // The concrete cladding joints visible between the champagne and alley signs.
  for (const u of [0.13, 0.31, 0.49, 0.67, 0.85])
    p.relief.push({
      rect: [u, 0, u + 0.008, 1],
      depth: -0.035,
      label: "cladding joint",
    });
  for (const v of [0.32, 0.64, 0.94])
    p.relief.push({
      rect: [0, v, 1, v + 0.012],
      depth: -0.035,
      label: "cladding joint",
    });
  p = get("Yokocho / pudding shop glass");
  p.offset = 0.38;
  p.relief = [
    { rect: [0.035, 0.04, 0.47, 0.95], depth: -0.23, label: "left shop glass" },
    {
      rect: [0.52, 0.04, 0.965, 0.95],
      depth: -0.23,
      label: "right shop glass",
    },
  ];
  p = get("Yokocho / upper railing");
  p.offset = 0.22;
  p.relief = [
    {
      rect: [0.06, 0.07, 0.92, 0.8],
      depth: -0.15,
      label: "wall behind metal balustrade",
    },
  ];
  p = get("No.2 / lounge signs");
  p.relief = [
    {
      rect: [0.02, 0.04, 0.41, 0.96],
      depth: 0.13,
      label: "left individual sign case",
    },
    { rect: [0.43, 0.04, 0.72, 0.96], depth: 0.07, label: "middle sign case" },
    { rect: [0.74, 0.04, 0.98, 0.96], depth: 0.18, label: "right sign case" },
  ];
  p = get("No.3 / continuous photographed frontage");
  // Actual sign corners in the 1824 × 1368 photo. Keep the quadrilaterals;
  // axis-aligned guessed boxes sliced through lettering and made false ledges.
  p.relief = [
    {
      photoCorners: [
        [176, 884],
        [286, 855],
        [276, 939],
        [158, 968],
      ],
      depth: 0.3,
      label: "Big Echo sign case",
    },
    {
      photoCorners: [
        [280, 952],
        [383, 928],
        [362, 1081],
        [260, 1091],
      ],
      depth: 0.29,
      label: "PROMISE sign case",
    },
    {
      photoCorners: [
        [440, 799],
        [497, 776],
        [448, 1157],
        [399, 1165],
      ],
      depth: 0.42,
      label: "continuous vertical sign case",
    },
  ].map((r) => ({
    ...r,
    polygon: r.photoCorners.map((pt) => unprojectPhoto(p.q, pt)),
  }));
  return panels;
}
