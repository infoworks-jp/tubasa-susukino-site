import { chromium } from "playwright";
import { PNG } from "pngjs";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { verifyProgressiveLoading } from "./location-loading-qa.mjs";
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
await verifyProgressiveLoading(browser, base, "location-qa");
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
    await page.locator('[data-view="route"]').getAttribute("aria-pressed"),
    "true",
    "continuous crossing-to-Yokocho street is the initial view",
  );
  assert.equal(
    await page.evaluate(() =>
      Number(document.documentElement.dataset.surveyedPanels),
    ),
    28,
  );
  assert.equal(
    await page.evaluate(() =>
      Number(document.documentElement.dataset.routePanels),
    ),
    23,
  );
  assert.ok(
    Number(
      await page.evaluate(() => document.documentElement.dataset.routeRelief),
    ) === 9,
    "route has real window/reveal geometry, not only flat photo panels",
  );
  const pavement = await page.evaluate(() =>
    JSON.parse(document.documentElement.dataset.routePavement),
  );
  assert.ok(
    pavement.mappedOuterEdge &&
      pavement.stations > 80 &&
      pavement.minWidth > 1 &&
      pavement.maxWidth < 18,
    "continuous route pavement follows the existing map mesh",
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
        // Keep the sky regression on its original north camera, independently
        // of changes to the initial street framing.
        await page.locator('[data-view="north"]').click();
        const sky = PNG.sync.read(await page.locator(".stage").screenshot());
        // A known unobstructed sky area in the north preset must remain paper
        // white. Zero-radius halftone AA previously left dots even at density 0.
        let ink = 0,
          pixels = 0;
        for (let y = Math.floor(sky.height * 0.07); y < sky.height * 0.2; y++)
          for (
            let x = Math.floor(sky.width * 0.75);
            x < sky.width * 0.85;
            x++
          ) {
            pixels++;
            if (sky.data[(y * sky.width + x) * 4] < 250) ink++;
          }
        assert.ok(
          ink / pixels < 0.005,
          "empty sky has no residual halftone dots",
        );
        await page.locator('[data-view="route"]').click();
      }
    }
  }
  for (const view of [
    "entrance",
    "facade",
    "route",
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
    if (view === "shop") {
      assert.ok(
        Math.abs(state.guideScreen[0]) < 0.8 &&
          Math.abs(state.guideScreen[1]) < 0.8,
        "entrance sign stays in view",
      );
      assert.ok(
        state.floor <= 4.5 && state.position[1] <= 10,
        "entrance guide approaches from street, not behind building",
      );
      assert.ok(
        await page
          .locator(".scene-note")
          .innerText()
          .then((t) => t.includes("通路の一番奥")),
      );
      await page.locator('[data-mode="tone"]').click();
      const guideImage = PNG.sync.read(
        await page.locator("#city").screenshot({
          path: `location-qa/${viewport.width}-entrance-guide.png`,
          style: ".stage > :not(#city) { visibility: hidden !important; }",
        }),
      );
      const greenBounds = [guideImage.width, guideImage.height, 0, 0];
      let greenPixels = 0;
      for (let y = 0; y < guideImage.height; y++)
        for (let x = 0; x < guideImage.width; x++) {
          const i = (y * guideImage.width + x) * 4;
          const [r, g, b] = guideImage.data.subarray(i, i + 3);
          if (g - r > 25 && g - b > 20) {
            greenPixels++;
            greenBounds[0] = Math.min(greenBounds[0], x);
            greenBounds[1] = Math.min(greenBounds[1], y);
            greenBounds[2] = Math.max(greenBounds[2], x);
            greenBounds[3] = Math.max(greenBounds[3], y);
          }
        }
      const endpoint = [
        ((state.guideScreen[0] + 1) * guideImage.width) / 2,
        ((1 - state.guideScreen[1]) * guideImage.height) / 2,
      ];
      assert.ok(greenPixels > 30, "entrance guide has visible green sign");
      assert.ok(
        endpoint[0] >= greenBounds[0] - 2 &&
          endpoint[0] <= greenBounds[2] + 2 &&
          endpoint[1] >= greenBounds[1] - 2 &&
          endpoint[1] <= greenBounds[3] + 2,
        "guide endpoint lands inside the rendered green sign",
      );
      await fs.writeFile(
        `location-qa/${viewport.width}-guide-pixels.json`,
        JSON.stringify({ greenBounds, endpoint, label: state.label }, null, 2),
      );
    }
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
  await page.locator('[data-view="entrance"]').click();
  for (const m of ["line", "tone"]) {
    await page.locator('[data-mode="' + m + '"]').click();
    // Capture the composited WebGL image. toDataURL after presentation can
    // read a cleared drawing buffer (SwiftShader), even when the visible scene
    // is correct. Hide only the DOM overlays for this 3D colour-mask assertion;
    // the complete controls/captions are exercised and captured above.
    const rawCanvas = await page.locator("#city").screenshot({
      path: `location-qa/${viewport.width}-${m}-spot-colour.png`,
      style: ".stage > :not(#city) { visibility: hidden !important; }",
    });
    const accent = PNG.sync.read(rawCanvas);
    let green = 0,
      red = 0;
    const bounds = [accent.width, accent.height, 0, 0];
    for (let y = 0; y < accent.height; y++)
      for (let x = 0; x < accent.width; x++) {
        const i = (y * accent.width + x) * 4,
          [r, g, b] = accent.data.subarray(i, i + 3);
        const isGreen = g - r > 25 && g - b > 20,
          isRed = r - g > 35 && r - b > 30;
        green += isGreen ? 1 : 0;
        red += isRed ? 1 : 0;
        if (isGreen || isRed) {
          bounds[0] = Math.min(bounds[0], x);
          bounds[1] = Math.min(bounds[1], y);
          bounds[2] = Math.max(bounds[2], x);
          bounds[3] = Math.max(bounds[3], y);
        }
      }
    assert.ok(
      green > 40 && red > 30,
      "alley sign retains both green frame and red letters",
    );
    assert.ok(
      bounds[2] - bounds[0] < accent.width * 0.3 &&
        bounds[3] - bounds[1] < accent.height * 0.35,
      "spot colour is confined to the entrance sign; surrounding architecture stays manga",
    );
  }
  await page.locator('[data-mode="night"]').click();
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
        json.images?.length >= 8,
        "export preserves manga, photographs, updated sign illustrations and PLATEAU atlases",
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
        8,
        "export retains all photograph and illustration source records",
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
        51,
      );
      const route = json.nodes.find(
        (n) => n.name === "Susukino / Route 36 to Yokocho",
      );
      assert.equal(route.extras.panelCount, 23);
      assert.equal(route.extras.sources.length, 4);
      assert.equal(
        route.extras.sources.filter((s) => s.illustration).length,
        2,
      );
      assert.ok(
        !route.extras.sources.some((s) => s.file.includes("route-2018")),
      );
      const updatedSigns = json.nodes.filter((n) => n.extras?.illustration);
      assert.equal(
        updatedSigns.length,
        9,
        "No.2 and No.3 export all updated sign surfaces",
      );
      assert.ok(
        updatedSigns.every(
          (n) =>
            n.extras.photoDate === null &&
            n.extras.illustrationDate.includes("2025-08"),
        ),
        "drawings are not misidentified as source photographs",
      );
      for (const name of [
        "No.2 / Maruhan roof sign",
        "Koban / POLICE and wall lettering",
        "No.3 / continuous updated frontage",
      ])
        assert.ok(json.nodes.some((n) => n.name === name));
      assert.ok(
        json.nodes.some((n) =>
          n.name?.includes("window reveals and stepped returns"),
        ),
        "GLB retains window depth",
      );
      assert.ok(
        json.nodes.some((n) => n.name === "continuous mapped sidewalk"),
        "GLB retains connected pavement",
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
      const guide = json.nodes.find(
        (n) =>
          n.name === "Tsubasa wayfinding / Shin Ramen Yokocho entrance sign",
      );
      assert.deepEqual(
        guide.extras.coordinates,
        landmark.entrance.coordinates,
        "guide belongs to entrance, separate from restaurant fact",
      );
      assert.ok(guide.extras.role.includes("far end"));
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
await page.locator("#detail-retry").waitFor({ state: "visible" });
assert.equal(await page.locator("#failure").isVisible(), false);
assert.equal(await page.locator("#png").isEnabled(), false);
assert.equal(await page.locator('[data-view="entrance"]').isEnabled(), true);
assert.equal(
  await page.locator("#glb").isEnabled(),
  false,
  "missing photographed geometry must fail closed",
);
await page.unroute("**/assets/plateau/data44.glb");
await page.locator("#detail-retry button").click();
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
