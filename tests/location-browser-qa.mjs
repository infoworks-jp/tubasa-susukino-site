import { chromium } from "playwright";
import { PNG } from "pngjs";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  executablePath: process.env.LOCATION_QA_EXECUTABLE || undefined,
  args:
    process.env.LOCATION_QA_HARDWARE === "1" && process.platform === "darwin"
      ? ["--use-angle=metal"]
      : [
          "--use-angle=swiftshader",
          "--enable-unsafe-swiftshader",
          "--disable-dev-shm-usage",
        ],
});
await fs.mkdir("location-qa", { recursive: true });
const base = process.env.LOCATION_QA_BASE || "http://127.0.0.1:8080";
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  locale: "ja-JP",
});
// Detailed exported geometry is intentionally preserved. SwiftShader may need
// longer to drain GPU commands before the two stable frames required by capture.
// This changes the capture wait budget, never assertions or visual checks.
page.setDefaultTimeout(90000);
const reference =
  "https://tools.oyasumi-gamedev.com/rokehan/#ll=35.659500%2C139.700500&s=300&far=2&n=%E6%B8%8B%E8%B0%B7%E3%82%B9%E3%82%AF%E3%83%A9%E3%83%B3%E3%83%96%E3%83%AB%E4%BA%A4%E5%B7%AE%E7%82%B9";
let referenceError;
try {
  await page.goto(reference, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForFunction(
    () =>
      document.querySelector("#status")?.textContent.includes("組み立てました"),
    {},
    { timeout: 180000 },
  );
  await page
    .locator("#v3wrap")
    .screenshot({ path: "location-qa/reference-desktop.png" });
  await page.waitForTimeout(1000);
  await page
    .locator("#v3wrap")
    .screenshot({ path: "location-qa/reference-desktop-1s.png" });
  await page.waitForTimeout(2000);
  await page
    .locator("#v3wrap")
    .screenshot({ path: "location-qa/reference-desktop-3s.png" });
  await page.locator("#far").selectOption("0");
  await page.waitForFunction(
    () =>
      document.querySelector("#farCredit")?.hidden &&
      !document.querySelector("#info")?.textContent.includes("遠景 2km") &&
      document.querySelector("#status")?.textContent.includes("組み立てました"),
    {},
    { timeout: 60000 },
  );
  await page.mouse.move(400, 400);
  await page.mouse.down();
  await page.mouse.move(480, 440, { steps: 10 });
  await page.screenshot({
    path: "location-qa/reference-desktop-dragging.png",
    timeout: 90000,
  });
  await page.mouse.up();
  await page.screenshot({
    path: "location-qa/reference-desktop-moved.png",
    timeout: 90000,
  });
  await page.getByRole("button", { name: "線画＋トーン", exact: true }).click();
  await page.screenshot({
    path: "location-qa/reference-tone.png",
    timeout: 90000,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "location-qa/reference-mobile.png",
    fullPage: true,
    timeout: 90000,
  });
  await fs.writeFile(
    "location-qa/reference.json",
    JSON.stringify(
      {
        reference,
        status: await page.locator("#status").textContent(),
        pass: true,
      },
      null,
      2,
    ),
  );
} catch (e) {
  await page
    .screenshot({ path: "location-qa/reference-failure.png", fullPage: true })
    .catch(() => {});
  await fs.writeFile(
    "location-qa/reference.json",
    JSON.stringify({ reference, pass: false, error: String(e) }, null, 2),
  );
  referenceError = e;
}
for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
]) {
  await page.setViewportSize(viewport);
  const errors = [];
  const listener = (e) => errors.push(String(e));
  page.on("pageerror", listener);
  const consoleListener = (msg) => {
    if (
      msg.type() === "error" &&
      /THREE|shader|WebGL|Tsubasa Location/.test(msg.text())
    )
      errors.push(msg.text());
  };
  page.on("console", consoleListener);
  await page.goto(base + "/location/", { waitUntil: "networkidle" });
  await page.waitForFunction(
    () => document.documentElement.dataset.cityReady === "true",
    {},
    { timeout: 45000 },
  );
  const geometry = await page.evaluate(() => ({
    buildings: Number(document.documentElement.dataset.buildings),
    vertices: Number(document.documentElement.dataset.geometryVertices),
  }));
  assert.ok(geometry.buildings > 10);
  assert.ok(geometry.vertices > 1000);
  assert.equal(
    await page.evaluate(() => document.documentElement.dataset.detailSource),
    "rokehan-permitted-glb",
  );
  assert.equal(
    Number(
      await page.evaluate(
        () => document.documentElement.dataset.collisionMeshes,
      ),
    ),
    6,
  );
  assert.equal(
    await page.evaluate(() =>
      Number(document.documentElement.dataset.plateauBuildings),
    ),
    85,
  );
  assert.ok(
    (await page.evaluate(() =>
      Number(document.documentElement.dataset.plateauReplacedTriangles),
    )) > 1000,
    "photographed buildings replace overlapping procedural walls",
  );
  assert.ok(
    Number(
      await page.evaluate(
        () => document.documentElement.dataset.treeDetailVertices,
      ),
    ) <= 2500000,
    "near trees stay within the reference display budget",
  );
  assert.ok(
    Number(
      await page.evaluate(
        () => document.documentElement.dataset.treeDrawVertices,
      ),
    ) <= 2500000,
    "far high-detail instances are removed from GPU draws, not merely shrunk",
  );
  assert.equal(
    await page.locator('[data-view="north"]').getAttribute("aria-pressed"),
    "true",
    "detailed street is the initial view",
  );
  assert.equal(
    await page.evaluate(() =>
      Number(document.documentElement.dataset.surveyedPanels),
    ),
    28,
  );
  for (const mode of ["color", "line", "tone", "night"]) {
    await page.locator(`[data-mode="${mode}"]`).click();
    await page.waitForTimeout(250);
    const shot = await page
      .locator(".stage")
      .screenshot({ path: `location-qa/${viewport.width}-${mode}.png` });
    const png = PNG.sync.read(shot);
    const colors = new Set();
    for (let y = 70; y < png.height - 120; y += 7)
      for (let x = 20; x < png.width - 20; x += 7) {
        const i = (y * png.width + x) * 4;
        colors.add(`${png.data[i]},${png.data[i + 1]},${png.data[i + 2]}`);
      }
    assert.ok(colors.size > 20, mode + " must render real geometry");
    if (mode === "line" || mode === "tone") {
      let chromatic = 0,
        sampled = 0;
      for (let y = 90; y < png.height - 130; y += 5)
        for (let x = 30; x < png.width - 70; x += 5) {
          const i = (y * png.width + x) * 4,
            rgb = [...png.data.subarray(i, i + 3)];
          sampled++;
          if (Math.max(...rgb) - Math.min(...rgb) > 25) chromatic++;
        }
      assert.ok(
        chromatic / sampled < 0.02,
        "artwork mask must not bypass monochrome for ordinary geometry",
      );
      if (viewport.width === 1440) {
        // A known unobstructed sky area in the north preset must remain paper
        // white. Zero-radius halftone AA previously left dots even at density 0.
        let ink = 0, pixels = 0;
        for (let y = Math.floor(png.height * .07); y < png.height * .2; y++)
          for (let x = Math.floor(png.width * .75); x < png.width * .85; x++) {
            pixels++;
            if (png.data[(y * png.width + x) * 4] < 250) ink++;
          }
        assert.ok(ink / pixels < .005, "empty sky has no residual halftone dots");
      }
    }
  }
  for (const view of [
    "entrance",
    "crossing",
    "north",
    "signs",
    "street",
    "shop",
    "overview",
  ]) {
    await page.locator(`[data-view="${view}"]`).click();
    const state = await page.evaluate(() =>
      JSON.parse(document.documentElement.dataset.cameraState),
    );
    assert.ok(
      state.position[1] >= state.floor,
      "camera outside mapped buildings",
    );
    if (["crossing", "north", "signs"].includes(view))
      assert.ok(
        state.floor <= 4.5 && state.position[1] <= 13,
        "street preset starts over ground, not on a roof edge",
      );
    if (["shop", "overview"].includes(view)) {
      assert.equal(state.labelVisible, true);
      assert.ok(
        Math.abs(state.label[0]) < 1 && Math.abs(state.label[1]) < 1,
        "visible label remains inside viewport",
      );
    } else
      assert.equal(
        state.labelVisible,
        false,
        "street detail is not obscured by a clamped shop label",
      );
    await page
      .locator(".stage")
      .screenshot({ path: `location-qa/${viewport.width}-${view}.png` });
  }
  let highestFloor = 4;
  await page.locator('[data-zoom="0.85"]').click();
  await page.locator("#city").focus();
  for (let i = 0; i < 36; i++) {
    await page.keyboard.press("+");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowRight");
    const state = await page.evaluate(() =>
      JSON.parse(document.documentElement.dataset.cameraState),
    );
    highestFloor = Math.max(highestFloor, state.floor);
    assert.ok(
      state.position[1] >= state.floor,
      "zoom/orbit cannot enter a building",
    );
  }
  assert.ok(highestFloor > 4, "stress sequence exercises building collision");
  if (viewport.width === 390) {
    const cdp = await page.context().newCDPSession(page),
      box = await page.locator("#city").boundingBox(),
      x = box.x + box.width / 2,
      y = box.y + box.height / 2;
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [
        { x: x - 25, y, id: 0 },
        { x: x + 25, y, id: 1 },
      ],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [
        { x: x - 45, y: y + 15, id: 0 },
        { x: x + 45, y: y + 15, id: 1 },
      ],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await cdp.detach();
    const state = await page.evaluate(() =>
      JSON.parse(document.documentElement.dataset.cameraState),
    );
    assert.ok(state.position[1] >= state.floor);
  }
  await page.locator('[data-view="entrance"]').click();
  const entrance = await page.evaluate(() =>
    JSON.parse(document.documentElement.dataset.cameraState),
  );
  assert.ok(entrance.position[1] >= entrance.floor);
  for (const mode of ["color", "line", "tone", "night"]) {
    await page.locator(`[data-mode="${mode}"]`).click();
    await page.locator(".stage").screenshot({
      path: `location-qa/${viewport.width}-entrance-${mode}.png`,
    });
  }
  await page.locator('[data-view="overview"]').click();
  await page.locator("#city").focus();
  await page.keyboard.press("ArrowRight");
  for (const [id, extension] of [
    ["png", ".png"],
    ["glb", ".glb"],
  ]) {
    const downloaded = page.waitForEvent("download");
    await page.locator("#" + id).click();
    const d = await downloaded;
    assert.ok(d.suggestedFilename().endsWith(extension));
    const path = `location-qa/${viewport.width}${extension}`;
    await d.saveAs(path);
    const file = await fs.readFile(path);
    if (id === "png") {
      const png = PNG.sync.read(file);
      assert.equal(png.width, 2400);
      assert.match(await page.locator("#status").textContent(), /2400px/);
      assert.ok(png.height > 1000);
      let ink = 0;
      for (let y = png.height - 105; y < png.height; y++)
        for (let x = 20; x < 1900; x++) {
          const i = (y * png.width + x) * 4;
          if (
            png.data[i] > 180 &&
            png.data[i + 1] > 180 &&
            png.data[i + 2] > 180
          )
            ink++;
        }
      assert.ok(ink > 1000, "night PNG footer contains readable attribution");
    } else {
      assert.equal(file.readUInt32LE(0), 0x46546c67);
      const json = JSON.parse(
        file.subarray(20, 20 + file.readUInt32LE(12)).toString(),
      );
      assert.ok(
        json.nodes.some((n) =>
          n.extras?.attribution?.includes("OpenStreetMap"),
        ),
      );
      assert.ok(
        json.nodes.some((n) => n.extras?.limitations?.includes("decorative")),
      );
      assert.ok(json.meshes.length > 100);
      assert.ok(
        json.nodes.some((n) =>
          n.name?.includes("permitted Rokehan GLB output"),
        ),
        "export contains the detailed reference city",
      );
      assert.ok(
        json.nodes.some((n) =>
          n.name?.includes("Photograph: Shin Ramen Yokocho sign"),
        ),
        "export contains the photograph-aligned entrance sign",
      );
      assert.ok(
        json.images?.length >= 6,
        "export preserves two manga textures, two street photo atlases and two PLATEAU photo atlases",
      );
      for (const name of [
        "Nikka / corner facade",
        "Asahi / billboard",
        "SAMTY / west roof sign",
        "West street / karaoke vertical sign",
        "Brown brick / south facade",
        "Toyoko Inn / south windows",
      ])
        assert.ok(
          json.nodes.some((n) => n.name === name),
          `export preserves ${name}`,
        );
      const artwork = json.nodes.find((n) => n.extras?.artworkSources)?.extras;
      assert.equal(
        artwork?.artworkSources.length,
        4,
        "export retains all source photograph records",
      );
      assert.ok(artwork.artworkAttribution.includes("MIKI Yoshihito"));
      assert.ok(artwork.artworkAttribution.includes("jegal gihwan"));
      const photographed = json.nodes.find(
        (n) => n.name === "Susukino / photographed street detail",
      );
      assert.equal(photographed.extras.panelCount, 28);
      assert.equal(photographed.extras.sources.length, 2);
      assert.equal(
        json.nodes.filter((n) => n.extras?.measuredPhotoCorners).length,
        28,
      );
      const plateau = json.nodes.find(
        (n) => n.extras?.buildingCount === 85,
      )?.extras;
      assert.equal(plateau?.year, 2020);
      assert.equal(plateau?.buildings.length, 85);
      assert.ok(plateau?.license.includes("CC BY 4.0"));
      const plateauMeshes = json.nodes
        .filter(
          (n) => n.name?.startsWith("PLATEAU_") && Number.isInteger(n.mesh),
        )
        .map((n) => json.meshes[n.mesh]);
      assert.equal(
        plateauMeshes.length,
        4,
        "export retains all photographed wall and roof meshes",
      );
      assert.equal(
        plateauMeshes.reduce(
          (sum, m) =>
            sum +
            m.primitives.reduce(
              (n, p) => n + json.accessors[p.attributes.POSITION].count,
              0,
            ),
          0,
        ),
        40914,
      );
      assert.equal(
        plateauMeshes.filter((m) =>
          m.primitives.some((p) => p.attributes.TEXCOORD_0 !== undefined),
        ).length,
        2,
        "both photo atlases retain UV mappings",
      );
      const landmark = json.nodes.find((n) => n.extras?.landmarks)?.extras
        .landmarks;
      assert.deepEqual(landmark.shop.coordinates, [141.3544949, 43.055336]);
      assert.equal(landmark.shop.floor, "B1F");
      assert.ok(
        json.nodes.some((n) => n.name?.includes("photograph-based entrance")),
      );
    }
  }
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
    "no horizontal overflow",
  );
  assert.deepEqual(errors, []);
  page.off("pageerror", listener);
  page.off("console", consoleListener);
  await fs.writeFile(
    `location-qa/${viewport.width}-receipt.json`,
    JSON.stringify({ viewport, geometry, pass: true }),
  );
}
await page.route("**/location-data.geojson", (route) =>
  route.fulfill({ status: 503, body: "unavailable" }),
);
await page.goto(base + "/location/");
await page.locator("#failure").waitFor({ state: "visible" });
assert.equal(await page.locator("#png").isEnabled(), false);
await page.unroute("**/location-data.geojson");
await page.locator("#retry").click();
await page.waitForFunction(
  () => document.documentElement.dataset.cityReady === "true",
);
await page.route("**/assets/plateau/data44.glb", (route) =>
  route.fulfill({ status: 503, body: "unavailable" }),
);
await page.reload();
await page.locator("#failure").waitFor({ state: "visible" });
assert.equal(
  await page.locator("#glb").isEnabled(),
  false,
  "missing photographed geometry must fail closed",
);
await page.unroute("**/assets/plateau/data44.glb");
await page.locator("#retry").click();
await page.waitForFunction(
  () => document.documentElement.dataset.cityReady === "true",
);
assert.equal(
  await page.evaluate(() =>
    Number(document.documentElement.dataset.plateauBuildings),
  ),
  85,
);
await page.evaluate(() =>
  document
    .querySelector("#city")
    .getContext("webgl2")
    .getExtension("WEBGL_lose_context")
    .loseContext(),
);
await page.locator("#failure").waitFor({ state: "visible" });
assert.equal(await page.locator("#glb").isEnabled(), false);
await browser.close();
if (referenceError) throw referenceError;
console.log(
  "LOCATION QA PASS: reference + desktop/mobile + 4 modes/entrance + PNG/GLB/landmarks + collision/touch + recovery.",
);
