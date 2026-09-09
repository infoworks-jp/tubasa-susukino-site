// Verify the approved v3 boundaries on the real homepage (not the preview iframe).
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs/promises";
const require = createRequire(process.env.STEAM_QA_PLAYWRIGHT || import.meta.url);
const { chromium, webkit } = require("playwright");
const base = process.env.STEAM_QA_URL || "http://127.0.0.1:4174/";
const out = process.env.BOUNDARY_QA_OUTPUT || "output/steam-qa/boundaries";
const names = (process.env.STEAM_QA_CASES || "chromium-desktop,chromium-mobile,webkit-desktop,webkit-390").split(",");
await fs.mkdir(out, { recursive: true });
const report = { base, cases: [], note: "Mobile viewport/touch emulation, not a physical phone." };
for (const name of names) {
  const mobile = !name.endsWith("desktop");
  const width = mobile ? Number(name.split("-")[1]) || 390 : 1440;
  const height = mobile ? 844 : 900;
  const browser = await (name.startsWith("webkit") ? webkit : chromium).launch({
    headless: true,
    ...(name.startsWith("chromium") && process.env.STEAM_QA_CHROME === "1" ? { channel: "chrome" } : {}),
  });
  const errors = [], checks = [];
  const result = { name, width, height, errors, checks, passed: false };
  try {
    const context = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile });
    const page = await context.newPage();
    page.on("pageerror", e => errors.push(e.message));
    page.on("response", r => { if (r.status() >= 400 && new URL(r.url()).origin === new URL(base).origin) errors.push(`${r.status()} ${r.url()}`); });
    await page.goto(base, { waitUntil: "load" });
    await page.waitForFunction(() => window.__tsubasaBoundaryPreview?.state.enabled && window.__tsubasaEffects?.surfaces.slice(0, 3).every(s => s.image.naturalWidth));
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.evaluate(() => scrollY), 0, "Autostart must not scroll away from the hero");
    assert.equal(await page.locator("#site-preview,#preview-status").count(), 0, "No preview UI on the homepage");
    const geometry = () => page.evaluate(() => {
      const photos = [...document.querySelectorAll(".signature > img.media,.food-card > img")].map(e => {
        const r = e.getBoundingClientRect(), p = e.parentElement.getBoundingClientRect(), c = getComputedStyle(e);
        return { width:r.width, height:r.height, x:r.x-p.x, y:r.y-p.y, transform:c.transform, filter:c.filter };
      });
      const copy = [...document.querySelectorAll(".signature-copy")].map(e => {
        const c = getComputedStyle(e); return { top:c.top, bottom:c.bottom, left:c.left, right:c.right, fontSize:c.fontSize, mask:c.maskImage };
      });
      const a = document.querySelector("#signature > .media").getBoundingClientRect();
      const b = document.querySelector(".signature-butter-corn > .media").getBoundingClientRect();
      return { photos, copy, distance:b.top-a.top, centers:b.top+b.height/2-a.top-a.height/2 };
    });
    const blended = await geometry();
    await page.evaluate(() => __tsubasaBoundaryPreview.setEnabled(false));
    const original = await geometry();
    assert.deepEqual(blended.copy, original.copy);
    for (const k of ["distance", "centers"]) assert(Math.abs(blended[k]-original[k]) < .002, `Keep original bowl spacing: ${k}`);
    blended.photos.forEach((p, i) => {
      for (const k of ["width", "height", "x", "y"]) assert(Math.abs(p[k]-original.photos[i][k]) < .002, `Preserve photo ${i} ${k}`);
      for (const k of ["transform", "filter"]) assert.equal(p[k], original.photos[i][k]);
    });
    result.originalDistance = original.distance;
    result.publishedDistance = blended.distance;
    await page.evaluate(() => __tsubasaBoundaryPreview.setEnabled(true));
    // Reveal the crossing's text before inspecting its lower edge.
    await page.locator("#top").evaluate(e => e.scrollIntoView({ behavior:"instant" }));
    await page.waitForFunction(() => getComputedStyle(document.querySelector("#top .hero-copy")).opacity === "1");
    for (let index = 0; index < 3; index++) {
      await page.evaluate(i => __tsubasaBoundaryPreview.focusBoundary(i), index);
      await page.waitForTimeout(700);
      const check = await page.evaluate(i => {
        const sections = [document.querySelector("#top"), ...document.querySelectorAll(".signature")];
        const from = sections[i], to = sections[i+1], state = __tsubasaBoundaryPreview.state;
        const image = from.querySelector(i ? ".media" : ".fluid-text-stage");
        const copy = from.querySelector(".hero-copy,.signature-copy");
        const canvas = i ? from.querySelector(".steam-photo") : null;
        const a = image.getBoundingClientRect(), b = canvas?.getBoundingClientRect();
        return { index:i, gap:to.getBoundingClientRect().top-from.getBoundingClientRect().bottom, overlap:state.overlap,
          mask:getComputedStyle(image).maskImage, copyMask:getComputedStyle(copy).maskImage, copyOpacity:getComputedStyle(copy).opacity,
          aligned:!canvas || ["x","y","width","height"].every(k => Math.abs(a[k]-b[k]) < .02),
          sameMask:!canvas || getComputedStyle(image).maskImage === getComputedStyle(canvas).maskImage };
      }, index);
      assert.equal(check.gap, index === 1 ? 0 : -check.overlap);
      assert.notEqual(check.mask, "none");
      assert.equal(check.copyMask, "none");
      assert.equal(check.copyOpacity, "1");
      assert(check.aligned && check.sameMask);
      await page.screenshot({ path:`${out}/${name}-${index}.png` });
      if (index !== 1) {
        const hit = await page.evaluate(i => {
          const sections=[document.querySelector("#top"),...document.querySelectorAll(".signature")];
          const from=sections[i],to=sections[i+1],bottom=from.getBoundingClientRect().bottom;
          const overlap=__tsubasaBoundaryPreview.state.overlap,x=innerWidth*.55;
          const upper=bottom-overlap*.75,lower=bottom-overlap*.25;
          return {x,upper,lower,upperOwns:from.contains(document.elementFromPoint(x,upper)),
            lowerOwns:to.contains(document.elementFromPoint(x,lower)),
            streetPointer:i===0&&!!window.__tsubasaFluid?.fluidTextStage?.pointer,
            presses:window.__tsubasaFluid?.fluidTextStage?.pointerPresses||0};
        },index);
        assert(hit.upperOwns && hit.lowerOwns, `Overlap hit regions: ${JSON.stringify(hit)}`);
        await page.mouse.move(hit.x,hit.lower);
        await page.mouse.down();
        await page.waitForFunction(i => __tsubasaEffects.surfaces[i].contact?.down===true,index);
        await page.mouse.up();
        if (hit.streetPointer) {
          await page.mouse.click(hit.x,hit.upper);
          await page.waitForFunction(n => __tsubasaFluid.fluidTextStage.pointerPresses>n,hit.presses);
        }
        check.hitRegions=hit;
      }
      const alphas = [];
      for (const delta of [0, 240, 0]) {
        await page.evaluate(({index,delta}) => { const s=__tsubasaBoundaryPreview.state; scrollTo({top:s.boundaries[index].bottom-s.overlap/2-s.viewport*.65+delta,behavior:"instant"}); }, {index,delta});
        await page.waitForTimeout(100);
        alphas.push(await page.evaluate(i => getComputedStyle([document.querySelector("#top"), ...document.querySelectorAll(".signature")][i]).getPropertyValue("--boundary-alpha"), index));
      }
      assert(Number(alphas[1]) < Number(alphas[0]));
      assert.equal(alphas[0], alphas[2]);
      checks.push({...check, alphas});
    }
    await page.emulateMedia({ reducedMotion:"reduce" });
    await page.waitForTimeout(120);
    assert(await page.evaluate(() => [document.querySelector("#top"),...document.querySelectorAll("[data-boundary-exit]")].every(e => getComputedStyle(e).getPropertyValue("--boundary-alpha") === "0.460")));
    const idle = await page.evaluate(() => __tsubasaBoundaryPreview.state.updates);
    await page.waitForTimeout(300);
    assert.equal(await page.evaluate(() => __tsubasaBoundaryPreview.state.updates), idle, "No idle rendering loop added");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.goto(new URL("#signature", base).href, {waitUntil:"load"});
    await page.locator("#signature").waitFor({state:"visible"});
    // Same-document hash navigation uses the site's existing smooth scroll.
    // Navigation completion precedes scroll completion in both browser engines.
    await page.waitForFunction(() => Math.abs(document.querySelector("#signature").getBoundingClientRect().top) < 2);
    assert(Math.abs(await page.locator("#signature").evaluate(e => e.getBoundingClientRect().top)) < 2, "Signature anchor remains usable");
    assert.deepEqual(errors, []);
    result.passed = true;
  } catch (error) {
    errors.push(error.stack);
    process.exitCode = 1;
  } finally {
    await browser.close();
    report.cases.push(result);
    console.log(`${name}: ${result.passed ? "PASS" : "FAIL"} ${errors.join("\n")}`);
  }
}
report.passed = report.cases.every(c => c.passed);
await fs.writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
