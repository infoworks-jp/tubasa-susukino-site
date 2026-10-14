// Independently drawn sign artwork from the names, colours and ordering in the
// user's August 2025 reference. No Street View pixels are included. Dimensions
// are illustrative proportions, not an architectural survey. Render this SVG
// to the committed WebP using a Japanese-font-capable local browser.
import fs from "node:fs/promises";
const out = new URL("../location/assets/manga/", import.meta.url);
const esc = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
const rect = (x, y, w, h, fill, stroke = "#454944", sw = 5) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const line = (x, y, X, Y, c = "#454944", w = 3) =>
  `<path d="M${x} ${y}L${X} ${Y}" stroke="${c}" stroke-width="${w}" fill="none"/>`;
const text = (s, x, y, size, fill = "#17201e", opt = "") =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${opt}>${esc(s)}</text>`;
const centre = 'text-anchor="middle"';
const title = (s, x, y, size, fill = "#17201e", opt = "") =>
  text(s, x, y, size, fill, `font-weight="900" ${opt}`);
const defs = `<defs><linearGradient id="concrete" x2="1" y2="1"><stop stop-color="#acb2a6"/><stop offset=".45" stop-color="#ccd1c4"/><stop offset="1" stop-color="#888f84"/></linearGradient><linearGradient id="glass"><stop stop-color="#36433d"/><stop offset=".45" stop-color="#728177"/><stop offset=".52" stop-color="#34463e"/><stop offset="1" stop-color="#152a25"/></linearGradient><linearGradient id="bottle"><stop stop-color="#050d17"/><stop offset=".4" stop-color="#1d3040"/><stop offset=".5" stop-color="#51715c"/><stop offset=".58" stop-color="#1b2630"/><stop offset="1" stop-color="#08101c"/></linearGradient><linearGradient id="beer" x2="0" y2="1"><stop stop-color="#f9edb3"/><stop offset=".3" stop-color="#f1c34b"/><stop offset="1" stop-color="#bf6c19"/></linearGradient><pattern id="tile" width="76" height="58" patternUnits="userSpaceOnUse"><rect width="76" height="58" fill="#bdbfb4"/><path d="M0 0H76V58" fill="none" stroke="#848b82" stroke-width="3"/></pattern></defs>`;
const start = (w, h) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><title>Independently illustrated Green Building signs, August 2025 reference</title>${defs}<g font-family="Hiragino Kaku Gothic ProN, Noto Sans CJK JP, sans-serif">`;
const end = "</g></svg>";
const star = (x, y, r, fill) => {
  let d = "";
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 - Math.PI / 2,
      R = i % 2 ? r * 0.39 : r;
    d += `${i ? "L" : "M"}${x + Math.cos(a) * R} ${y + Math.sin(a) * R}`;
  }
  return `<path d="${d}Z" fill="${fill}"/>`;
};
const frame = (x, y, w, h, bg = "#f3f0e6") =>
  rect(x, y, w, h, "#242c27") +
  rect(x + 5, y + 5, w - 10, h - 10, "#b8bcb3", "#e0e0d6", 2) +
  rect(x + 13, y + 13, w - 26, h - 26, bg, "#555d55", 2);
function cat(x, y, s) {
  return `<g transform="translate(${x} ${y}) scale(${s})" stroke="#665744" stroke-width="3" stroke-linejoin="round"><path d="M35 56Q18 8 50 12L74 34Q97 28 117 35Q150 -5 155 39L152 58Q178 82 166 118Q162 153 125 167L128 206L45 204L47 165Q20 151 18 117Q12 80 35 56" fill="#fffdf2"/><path d="M37 48Q28 18 47 23L59 39M125 39Q147 14 146 43" fill="#dac18d"/><path d="M97 33Q122 24 145 48L136 78Q108 66 97 33" fill="#b1a07b"/><path d="M45 102Q57 90 68 102M106 101Q118 89 131 100M78 115Q87 128 96 115M87 120V129Q73 146 63 132M87 129Q99 143 111 131" fill="none"/><path d="M27 114L43 119M25 126L44 127M135 115L153 110M135 125L155 126"/><ellipse cx="168" cy="96" rx="23" ry="28" fill="#fffdf2"/><path d="M156 89V100M166 84V98M176 87V102"/><path d="M41 162Q85 181 128 162L128 176Q83 195 44 175Z" fill="#c23238"/><circle cx="88" cy="181" r="16" fill="#e7b937"/><path d="M82 180H95M88 180V192"/><path d="M36 142L12 165L26 180L54 151" fill="#e3b232"/><ellipse cx="13" cy="166" rx="16" ry="19" fill="#c6c8c3"/><path d="M3 158L23 175M0 169L18 153" stroke-width="1"/></g>`;
}
let s = start(2400, 2150);
s += rect(0, 0, 2400, 2150, "url(#concrete)");
// Continuous roof panel, main wall and right stair/billboard bay.
s += frame(20, 14, 2358, 390, "#f3f2e8") + star(260, 171, 125, "#e9b638");
s += title("北海道は", 610, 163, 147) + title("サッポロビール", 600, 333, 147);
s += title("SAPPORO", 260, 339, 59, "#182425", centre);
s += `<path d="M2170 20Q2170 0 2265 0Q2360 0 2360 20L2347 365Q2265 402 2182 365Z" fill="url(#beer)" stroke="#b1b2aa" stroke-width="9"/>`;
s +=
  title("CLASSIC", 2266, 191, 47, "#243d6e", centre) +
  star(2266, 108, 28, "#c02b30");
s += text("SAPPORO", 2266, 252, 25, "#fff5bb", centre);
// Sign proportions: broad karaoke, small black restaurant, left convenience
// store, large yellow Promise, 2 small restaurants under the left sign.
s += frame(38, 421, 1320, 415, "#eeeede") + cat(116, 471, 1.42);
s += title(
  "カラオケ",
  899,
  565,
  96,
  "#c83a3b",
  `${centre} stroke="#f8f5df" stroke-width="9" paint-order="stroke"`,
);
s += title(
  "まねきねこ",
  888,
  744,
  146,
  "#cc393c",
  `${centre} stroke="#566665" stroke-width="16" paint-order="stroke"`,
);
s += title(
  "まねきねこ",
  888,
  744,
  146,
  "#cc393c",
  `${centre} stroke="#fff9dc" stroke-width="9" paint-order="stroke"`,
);
s +=
  frame(1367, 421, 452, 415, "#1e2430") + text("8F", 1392, 462, 29, "#eee8d9");
s +=
  `<circle cx="1592" cy="551" r="91" fill="#f2f0e3"/>` +
  title("炉", 1592, 579, 89, "#232731", centre);
s +=
  title("炉端とおでん", 1590, 709, 39, "#efe9df", centre) +
  text("KORONAGIRAI", 1592, 766, 33, "#efebe4", centre);
s += frame(38, 844, 846, 446, "#df563b");
s +=
  title("北海道は", 400, 983, 96, "#fff7df", centre) +
  title(
    "Seicomart",
    420,
    1152,
    102,
    "#fff7df",
    `${centre} font-style="italic"`,
  );
s += `<path d="M728 906Q658 973 729 1058Q808 1120 842 925Q820 937 812 975Q783 1043 762 1003Q745 983 774 913Z" fill="#fff5dd"/>`;
s +=
  frame(891, 844, 928, 631, "#f6cd20") +
  title("プロミス", 1352, 1198, 173, "#1b3b9c", centre);
s +=
  frame(38, 1298, 414, 177, "#e5b64a") +
  title("鳥貴族", 245, 1387, 64, "#9d4332", centre) +
  title("TORIKIZOKU", 245, 1438, 31, "#6b4734", centre);
s +=
  frame(459, 1298, 425, 177) +
  title("牛角", 678, 1423, 108, "#182022", centre) +
  text("1階", 478, 1446, 27);
const low = [
  ["炭火居酒屋", "生つくね炎", 38, 486, "#f0eadc", "#1b2520"],
  ["5F", "nicolico", 531, 230, "#efede3", "#864d65"],
  ["酒類・食品", "ワタショウ", 768, 581, "#bf333b", "#fff6dd"],
  ["北海道　網走沖", "魚鮮水産", 1356, 463, "#f2f0df", "#244a39"],
];
for (const [a, b, x, w, bg, fg] of low) {
  s +=
    frame(x, 1483, w, 203, bg) +
    title(a, x + w / 2, 1544, w > 400 ? 34 : 28, fg, centre) +
    title(b, x + w / 2, 1644, w > 400 ? 70 : 38, fg, centre);
}
s +=
  frame(38, 1694, 358, 103) +
  frame(404, 1694, 445, 103, "#252925") +
  title("THE NIKKA BAR", 626, 1758, 34, "#f5ebd2", centre);
s +=
  frame(857, 1694, 474, 103, "#7bb64c") +
  title("レイク", 1094, 1767, 62, "#fffbe6", centre) +
  frame(1339, 1694, 480, 103, "#7bb64c") +
  title("レイク", 1578, 1767, 62, "#fffbe6", centre);
s += text("B1F", 1773, 1777, 24, "#eff5d9");
// Upper shop windows and mullions. These are illustrative openings; the supplied
// entrance photograph remains the detailed surface at the western end below.
for (let i = 0; i < 15; i++) {
  let x = 46 + i * 118;
  s +=
    rect(x, 1815, 109, 183, "url(#glass)", "#5a6056", 6) +
    line(x + 54, 1817, x + 54, 1994, "#a4ab98", 5) +
    line(x + 4, 1938, x + 105, 1938, "#a4ab98", 5);
}
s +=
  frame(38, 2003, 1778, 73, "#e6ddbc") +
  title("松屋", 915, 2060, 42, "#32527a", centre);
for (let i = 0; i < 17; i++)
  s += rect(41 + i * 104, 2082, 92, 68, "#27362e", "#aab09b", 6);
// Eight landings, continuous vertical piers and closely spaced metal rails.
s += rect(1830, 419, 260, 1441, "#7f9981", "#4e6354", 6);
for (let y = 440; y < 1770; y += 169) {
  s +=
    rect(1848, y + 8, 223, 102, "#24392c", "#a5b89c", 4) +
    rect(1889, y + 27, 124, 56, "#12251d", "#526d53", 3) +
    rect(1842, y + 107, 236, 56, "#93a98b", "#4c6650", 4);
  for (let x = 1851; x < 2075; x += 12)
    s += line(x, y + 105, x, y + 162, "#48684d", 3);
  s += line(1840, y + 107, 2078, y + 107, "#c3d0b5", 6);
}
// Champagne case: full-height image, never split into floor-sized strips.
s += frame(2100, 421, 279, 1439, "#10213e");
for (let i = 0; i < 135; i++) {
  const x = 2118 + ((i * 67) % 237),
    y = 450 + ((i * 113) % 1320);
  s += star(x, y, i % 5 === 0 ? 6 : 2.5, i % 2 ? "#d6b859" : "#f8e8a0");
}
s +=
  title("HATHYR", 2237, 586, 48, "#e1c375", centre) +
  text("Cuvée", 2237, 647, 39, "#e5c983", `${centre} font-style="italic"`) +
  text("Capella", 2237, 697, 38, "#e5c983", `${centre} font-style="italic"`);
s += `<path d="M2206 779Q2210 747 2238 747Q2266 747 2271 779L2277 960Q2279 1010 2315 1050L2333 1681Q2335 1743 2238 1752Q2140 1743 2143 1681L2160 1050Q2195 1010 2198 960Z" fill="url(#bottle)" stroke="#e8e8db" stroke-width="6"/><path d="M2204 797Q2238 814 2272 797L2277 884Q2240 901 2201 884Z" fill="#dddccf"/><path d="M2150 1403Q2236 1420 2327 1403L2330 1638Q2240 1672 2148 1638Z" fill="#eee9d9"/>`;
s +=
  text("CHAMPAGNE", 2238, 1461, 25, "#38433a", centre) +
  title("HATHYR", 2238, 1524, 39, "#38433a", centre) +
  text(
    "Cuvée Capella",
    2238,
    1598,
    21,
    "#38433a",
    `${centre} font-style="italic"`,
  );
s += rect(1830, 1864, 548, 286, "url(#tile)");
// Calibrate the lower fascia to the entrance photograph's 9.16 m top and
// 5.55 m window sill, while keeping the entire champagne case continuous.
const original = s.slice(start(2400, 2150).length);
const bands = [
  [0, 404, 0, 404],
  [404, 836, 404, 836],
  [836, 1483, 836, 1667],
  [1483, 1686, 1667, 1808],
  [1686, 1815, 1808, 1933],
  [1815, 1998, 1933, 2016],
  [1998, 2150, 2016, 2150],
];
let calibrated = start(2400, 2150);
bands.forEach(([a, b, c, d], i) => {
  const sy = (d - c) / (b - a),
    ty = c - a * sy;
  calibrated += `<defs><clipPath id="band${i}"><rect x="0" y="${a}" width="1830" height="${b - a}"/></clipPath></defs><g transform="matrix(${1920 / 1830} 0 0 ${sy} 0 ${ty})"><g clip-path="url(#band${i})">${original}</g></g>`;
});
for (const [id, l, r, L, R] of [
  ["stair", 1830, 2100, 1920, 2160],
  ["champagne", 2100, 2400, 2160, 2400],
]) {
  const sx = (R - L) / (r - l),
    tx = L - l * sx;
  calibrated += `<defs><clipPath id="${id}"><rect x="${l}" y="0" width="${r - l}" height="2150"/></clipPath></defs><g transform="matrix(${sx} 0 0 1 ${tx} 0)"><g clip-path="url(#${id})">${original}</g></g>`;
}
await fs.writeFile(new URL("green-no3-signs-2025.svg", out), calibrated + end);
// No.2 panels retain individual physical cases. This atlas records the updated
// ad identities and colour scheme; stadium/mascot drawings are illustrations.
let t = start(1600, 3200) + rect(0, 0, 1600, 3200, "#545951");
t += frame(0, 0, 1600, 780, "#eee9dd");
t += `<path d="M20 100Q410 -70 920 85L1030 590Q670 750 40 650Z" fill="#a53e49"/><path d="M140 380Q290 490 420 368Q380 590 150 451M560 366Q710 480 842 345Q820 565 590 451" fill="#eee8d7"/><ellipse cx="480" cy="514" rx="79" ry="58" fill="#ceb98f"/>`;
t +=
  title("マルハン", 1293, 187, 94, "#2d3031", centre) +
  text("人生にヨロコビを", 1293, 250, 30, "#353634", centre) +
  title(
    "ジャパニーズ娯楽",
    1293,
    584,
    47,
    "#3e3a36",
    `${centre} writing-mode="tb"`,
  );
t +=
  frame(0, 780, 1600, 670, "#276d9e") +
  title(
    "エスコンフィールドで、まだ見ぬ感動を。",
    800,
    858,
    49,
    "#fff2bc",
    centre,
  );
t += `<path d="M55 1101L554 906L1322 969L1541 1110L1460 1300L146 1290Z" fill="#344b54" stroke="#c0cbca" stroke-width="8"/><path d="M120 1110L560 948L1336 1004L1485 1120Z" fill="#a3d0df"/><path d="M220 1223Q820 1060 1400 1230L1158 1374L447 1374Z" fill="#4a8b49"/><path d="M570 1283L815 1187L1060 1283L815 1375Z" fill="#ac704a"/><path d="M640 1284L815 1216L991 1284L815 1352Z" fill="#548a44"/>`;
for (let i = 0; i < 20; i++)
  t += line(160 + i * 62, 1094, 160 + i * 62, 1175, "#456471", 4);
for (let i = 0; i < 10; i++)
  t += line(160, 1181 + i * 8, 1460, 1181 + i * 8, "#c1c8bc", 2);
t +=
  title("F VILLAGE", 175, 1386, 43, "#e4e9db", centre) +
  title("FIGHTERS", 357, 1042, 40, "#21495a");
t +=
  frame(0, 1450, 770, 300, "#171d22") +
  title("くろねこ", 380, 1600, 130, "#eeeedd", centre) +
  title("Lounge", 380, 1699, 57, "#dbc261", centre);
t +=
  frame(770, 1450, 405, 300, "#e3e2d9") +
  text("◎◎", 968, 1573, 98, "#393b3c", centre) +
  text("ag", 968, 1672, 69, "#393b3c", centre);
t +=
  frame(1175, 1450, 425, 300) +
  text("2F", 1214, 1510, 34) +
  title("温馨亭", 1383, 1647, 75, "#272a27", centre);
t +=
  frame(0, 1750, 670, 640, "#e6e4d9") +
  text("9F", 40, 1810, 37) +
  text(
    "Premier",
    336,
    1882,
    69,
    "#333c38",
    `${centre} font-family="Georgia,serif" font-style="italic"`,
  ) +
  text("世界の夜は、", 336, 2020, 53, "#3b3d35", centre) +
  text("シティーグループ。", 336, 2112, 53, "#3b3d35", centre) +
  text(
    "City Group",
    336,
    2277,
    58,
    "#353b34",
    `${centre} font-family="Georgia,serif" font-style="italic"`,
  );
t +=
  frame(670, 1750, 930, 238, "#151d25") +
  title("響", 817, 1927, 145, "#eae9df", centre) +
  title("HIBIKI", 1200, 1842, 62, "#edeadc", centre) +
  title("Group", 1200, 1930, 66, "#edeadc", centre);
t += frame(670, 1988, 930, 402, "#233f61");
for (let i = 0; i < 90; i++) {
  const x = 685 + ((i * 59) % 900),
    y = 2008 + ((i * 71) % 359);
  t += `<path d="M${x} ${y}l39 -26l20 75l-55 20Z" fill="${["#a13977", "#cdba3e", "#47744b", "#548daa"][i % 4]}" opacity=".7"/>`;
}
t +=
  title(
    "ACQUA",
    1050,
    2220,
    134,
    "#f1e9d7",
    `${centre} font-family="Georgia,serif" stroke="#284160" stroke-width="6" paint-order="stroke"`,
  ) +
  text("300坪", 1470, 2071, 48, "#efcf54", centre) +
  text("114席", 1470, 2141, 44, "#efcf54", centre);
t +=
  frame(0, 2390, 1600, 280, "#161d20") +
  text("北の味紀行", 210, 2540, 42, "#e9e7dd", centre) +
  title("さっぽろっこ", 879, 2591, 132, "#efede4", centre) +
  title("2F", 1494, 2553, 75, "#c94132", centre);
t +=
  frame(0, 2670, 750, 395, "#08704e") +
  title(
    "エイブル",
    375,
    2890,
    137,
    "#eeeede",
    `${centre} font-style="italic"`,
  ) +
  title("お部屋探し", 375, 3002, 42, "#e5aa47", centre);
t +=
  frame(750, 2670, 390, 395, "#eee4c8") +
  title("元祖串かつ", 945, 2783, 50, "#313931", centre) +
  title("恵美須商店", 945, 2890, 51, "#313931", centre) +
  text("大阪", 945, 3009, 63, "#a73f35", centre);
t +=
  frame(1140, 2670, 460, 395, "#1b4e95") +
  title("✚✚", 1370, 2807, 85, "#e5d453", centre) +
  title("サツドラ", 1370, 2921, 78, "#f4f0d3", centre) +
  text("SAPPORO DRUG STORE", 1370, 2995, 23, "#dddccf", centre);
t +=
  frame(0, 3065, 1600, 135, "#223950") +
  title("SUSUKINO HAPPY LIFESTYLE", 800, 3149, 44, "#e1dab1", centre);
await fs.writeFile(new URL("green-no2-signs-2025.svg", out), t + end);
console.log("Wrote independently drawn No.2 and No.3 sign SVGs");
