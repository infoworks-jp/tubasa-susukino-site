import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs/promises";
const require = createRequire(process.env.STEAM_QA_PLAYWRIGHT || import.meta.url);
const { chromium, webkit } = require("playwright");
const base = process.env.STEAM_QA_URL || "http://127.0.0.1:4174/";
const output = process.env.NOTICE_QA_OUTPUT || "output/september-notice";
const engine = process.env.NOTICE_QA_ENGINE || "chromium";
const browser = await (engine === "webkit" ? webkit : chromium).launch({
  headless: true,
  ...(engine === "chromium" && process.env.STEAM_QA_CHROME === "1" ? { channel: "chrome" } : {}),
});
const report = { base, engine, cases: [], errors: [] };
await fs.mkdir(output, { recursive: true });
try {
  for (const [width, height] of [[1440,900], [390,844], [320,568], [768,1024], [844,390]]) {
    const context = await browser.newContext({
      viewport: { width, height }, reducedMotion: "reduce", timezoneId: "Asia/Tokyo",
      isMobile: width < 701, hasTouch: width < 701,
    });
    const page = await context.newPage();
    page.on("pageerror", e => report.errors.push(e.message));
    await page.clock.setFixedTime(new Date("2026-09-09T12:00:00+09:00"));
    await page.goto(base, { waitUntil: "load" });
    const notice = page.locator("#holiday-notice");
    assert.equal(await notice.isVisible(), true);
    assert.match(await notice.innerText(), /9月21日（月）[\s\S]*営業します[\s\S]*9月24日（木）[\s\S]*振替休業/);
    const layout = await page.evaluate(() => {
      const n = document.querySelector("#holiday-notice"), r = n.getBoundingClientRect();
      const overlap = [...document.querySelectorAll("#videoTop .hero-copy h1, #videoTop .top-logo, #openCmPreview")]
        .filter(e => { const b=e.getBoundingClientRect(); return r.left<b.right && r.right>b.left && r.top<b.bottom && r.bottom>b.top; })
        .map(e => e.className || e.tagName);
      return { box:r.toJSON(), overlap, fits:r.left>=0 && r.right<=innerWidth && r.top>=0 && r.bottom<=innerHeight,
        overflow:document.documentElement.scrollWidth>innerWidth,
        dates:[...n.querySelectorAll("time")].map(e=>({text:e.textContent, fits:e.scrollWidth<=e.clientWidth})) };
    });
    await page.screenshot({ path:`${output}/${engine}-${width}x${height}.png`, scale:"css" });
    assert.equal(layout.fits, true, JSON.stringify(layout));
    assert.equal(layout.overflow, false, JSON.stringify(layout));
    assert.deepEqual(layout.overlap, [], JSON.stringify(layout));
    assert(layout.dates.every(x=>x.fits), JSON.stringify(layout));
    // The announcement must not cover or intercept the existing CM control.
    await page.locator("#openCmPreview").click();
    await page.locator("dialog[open]").waitFor({ state:"visible" });
    assert.equal(await page.locator("dialog[open]").count(), 1);
    await page.keyboard.press("Escape");
    // Native WebKit dialog cancellation can complete after key dispatch returns.
    // Wait for the observable close; an immediate count races the browser task.
    await page.locator("dialog[open]").waitFor({ state:"detached" });
    assert.equal(await page.locator("dialog[open]").count(), 0);
    report.cases.push({ width, height, layout, cmControl:true });
    await context.close();
  }
  for (const timezoneId of ["Asia/Tokyo", "America/Los_Angeles"]) {
    const context = await browser.newContext({ viewport:{width:390,height:844}, timezoneId, reducedMotion:"reduce" });
    const page = await context.newPage();
    await page.clock.install({ time:new Date("2026-09-24T23:59:59.900+09:00") });
    await page.clock.pauseAt(new Date("2026-09-24T23:59:59.900+09:00"));
    await page.goto(base, { waitUntil:"load" });
    assert.equal(await page.locator("#holiday-notice").isVisible(), true, timezoneId);
    await page.clock.runFor(99);
    assert.equal(await page.locator("#holiday-notice").isVisible(), true, timezoneId);
    await page.clock.runFor(1);
    assert.equal(await page.locator("#holiday-notice").count(), 0, timezoneId);
    await page.reload({ waitUntil:"load" });
    assert.equal(await page.locator("#holiday-notice").count(), 0, "Expired cached HTML must not reappear");
    await page.screenshot({ path:`${output}/${engine}-expired-${timezoneId.replaceAll('/','-')}.png`, scale:"css" });
    report.cases.push({ timezoneId, expiresExactlyAtJstMidnight:true, reloadAfterExpiry:true });
    await context.close();
  }
  const context = await browser.newContext({ reducedMotion:"reduce" });
  const page = await context.newPage();
  await page.clock.setFixedTime(new Date("2026-09-24T00:00:00+09:00"));
  await page.goto(base, { waitUntil:"load" });
  assert.equal(await page.locator("#holiday-notice").isVisible(), true, "Keep notice throughout the closed day");
  // A suspended/BFCache page must catch up to the new date when shown again.
  await page.clock.setFixedTime(new Date("2026-09-25T10:00:00+09:00"));
  await page.evaluate(() => window.dispatchEvent(new Event("pageshow")));
  assert.equal(await page.locator("#holiday-notice").count(), 0);
  report.cases.push({ closedDayVisible:true, suspendedPageExpiry:true });
  await context.close();
  assert.deepEqual(report.errors, []);
  report.passed = true;
} catch (error) {
  report.passed = false;
  report.errors.push(error.stack);
  process.exitCode = 1;
} finally {
  await browser.close();
  await fs.writeFile(`${output}/${engine}-report.json`, JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));
}
