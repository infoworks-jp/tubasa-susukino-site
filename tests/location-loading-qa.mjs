import assert from "node:assert/strict";

// Delay surroundings deliberately: the real route must remain usable, and an
// unfinished scene must never be offered as a complete model/image download.
export async function verifyProgressiveLoading(browser, base, directory) {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    let release;
    const barrier = new Promise((resolve) => { release = resolve; });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/assets/plateau/*.webp", async (route) => {
      await barrier;
      await route.continue();
    });
    try {
      await page.goto(base + "/location/", { waitUntil: "domcontentloaded" });
      await page.waitForFunction(() => document.documentElement.dataset.cityInteractive === "true", {}, { timeout: 90000 });
      assert.equal(await page.locator("#png").isDisabled(), true);
      assert.equal(await page.locator("#glb").isDisabled(), true);
      assert.equal(await page.locator('[data-view="entrance"]').isEnabled(), true);
      assert.equal(await page.locator('[data-mode="tone"]').getAttribute("aria-pressed"), "true");
      assert.match(await page.locator("#status").textContent(), /操作できます/);
      assert.equal(await page.evaluate(() => Number(document.documentElement.dataset.routePanels)), 23);
      if (width === 390) {
        const initial = await page.evaluate(() => JSON.parse(document.documentElement.dataset.cameraState));
        assert.equal(initial.floor, 4, "first-stage collision geometry keeps the original clear street viewpoint");
        for (const [i, expected] of [-119.42597485145237, 26, -48.61418070123306].entries())
          assert.ok(Math.abs(initial.position[i] - expected) < 1e-6,
            "loading order must not move the approved mobile camera");
      }
      await page.locator(".stage").screenshot({ path: `${directory}/${width}-route-before-surroundings.png`, timeout: 90000 });
      await page.locator('[data-view="entrance"]').click();
      await page.locator('[data-mode="night"]').click();
      await page.locator("#city").press("ArrowLeft");
      const camera = await page.evaluate(() => JSON.parse(document.documentElement.dataset.cameraState));
      release();
      await page.waitForFunction(() => document.documentElement.dataset.cityReady === "true", {}, { timeout: 90000 });
      assert.equal(await page.locator("#png").isEnabled(), true);
      assert.equal(await page.locator("#glb").isEnabled(), true);
      assert.equal(await page.locator('[data-mode="night"]').getAttribute("aria-pressed"), "true");
      assert.equal(await page.locator('[data-view="entrance"]').getAttribute("aria-pressed"), "true");
      const final = await page.evaluate(() => JSON.parse(document.documentElement.dataset.cameraState));
      assert.deepEqual(final.position, camera.position, "background completion must not reset camera");
      assert.deepEqual(final.target, camera.target);
      assert.deepEqual(errors, []);
    } finally { release(); await context.close(); }
  }
  // A failed optional background request leaves the already-loaded route usable.
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  try {
    await page.route("**/assets/plateau/data30.webp", (route) => route.abort("failed"));
    await page.goto(base + "/location/", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => document.documentElement.dataset.cityReady === "partial", {}, { timeout: 90000 });
    assert.equal(await page.locator("#failure").isVisible(), false);
    assert.equal(await page.locator("#detail-retry").isVisible(), true);
    assert.equal(await page.locator("#glb").isDisabled(), true);
    await page.locator('[data-view="entrance"]').click();
    assert.equal(await page.locator('[data-view="entrance"]').getAttribute("aria-pressed"), "true");
    await page.screenshot({ path: `${directory}/surroundings-error.png`, fullPage: true });
    await page.unroute("**/assets/plateau/data30.webp");
    await page.locator("#detail-retry button").click();
    await page.waitForFunction(() => document.documentElement.dataset.cityReady === "true", {}, { timeout: 90000 });
    assert.equal(await page.locator("#detail-retry").isVisible(), false);
    assert.equal(await page.locator("#glb").isEnabled(), true);
  } finally { await context.close(); }
  console.log("PASS: route-first loading, deferred exports, retained controls/camera/mode, background error and retry");
}
