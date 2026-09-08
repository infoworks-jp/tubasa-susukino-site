// Actual rendered pixels, not just animation counters. Run against a preview
// or the exact deployed URL. No screenshots/versions from another repository.
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import path from "node:path";
import { pressureQA } from "./steam-pressure-qa.mjs";
import { fingerQA } from "./steam-finger-qa.mjs";
const require = createRequire(
  process.env.STEAM_QA_PLAYWRIGHT || import.meta.url,
);
const { chromium, webkit } = require("playwright");
const base = process.env.STEAM_QA_URL || "http://127.0.0.1:4174/";
const directory = process.env.STEAM_QA_OUTPUT || "output/steam-qa";
const names = (
  process.env.STEAM_QA_CASES ||
  "chromium-desktop,chromium-mobile,webkit-375,webkit-390,webkit-430"
).split(",");
await fs.mkdir(directory, { recursive: true });
const results = {
  url: base,
  date: new Date().toISOString(),
  note: "Mobile layouts are emulation, not a physical iPhone.",
  cases: [],
};
const selectors = [
  ".signature-miso",
  ".signature-butter-corn",
  ".signature-tsubasa",
];

async function startSample(page) {
  await page.evaluate(() => {
    window.__steamSample = window.__tsubasaEffects.surfaces
      .filter((s) => s.visible && s.ready)
      .map((s) => ({
        s,
        draws: s.draws,
        steps: s.steps,
        data: s.ctx.getImageData(0, 0, s.canvas.width, s.canvas.height).data,
      }));
  });
}
async function endSample(page) {
  return page.evaluate(() =>
    window.__steamSample.map(({ s, data, draws, steps }) => {
      const { width: w, height: h } = s.canvas;
      const next = s.ctx.getImageData(0, 0, w, h).data;
      let steam = 0,
        bowl = 0;
      const roots = s.roots.map(() => 0);
      for (let i = 0; i < data.length; i += 4) {
        if (
          Math.max(
            Math.abs(next[i] - data[i]),
            Math.abs(next[i + 1] - data[i + 1]),
            Math.abs(next[i + 2] - data[i + 2]),
          ) <= 6
        )
          continue;
        const x = ((i / 4) % w) / w,
          y = Math.floor(i / 4 / w) / h;
        if (y > 0.55) bowl++;
        else steam++;
        s.roots.forEach((r, j) => {
          if (y < r[1] - 0.03 && Math.abs(x - r[0]) < r[2]) roots[j]++;
        });
      }
      const a = s.image.getBoundingClientRect(),
        b = s.canvas.getBoundingClientRect();
      return {
        profile: s.profile,
        steam,
        bowl,
        roots,
        frames: s.draws - draws,
        steps: s.steps - steps,
        alignmentError: Math.max(
          ...["x", "y", "width", "height"].map((k) => Math.abs(a[k] - b[k])),
        ),
      };
    }),
  );
}
async function scrollTo(page, selector) {
  await page.locator(selector).evaluate((el) => {
    const y = el.getBoundingClientRect().top + scrollY;
    scrollTo({ top: y - 55, behavior: "instant" });
  });
  await page.waitForTimeout(700);
}

for (const name of names) {
  const isWebkit = name.startsWith("webkit");
  const mobile = name !== "chromium-desktop" && name !== "brave-desktop";
  const width = mobile ? Number(name.split("-")[1]) || 390 : 1440;
  const browser = await (isWebkit ? webkit : chromium).launch({
    headless: process.env.STEAM_QA_HEADED !== "1",
    ...(name.startsWith("chromium") && process.env.STEAM_QA_CHROME === "1"
      ? { channel: "chrome" }
      : {}),
    ...(name.startsWith("brave")
      ? {
          executablePath:
            "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
        }
      : {}),
    ...(!isWebkit && process.env.STEAM_QA_SOFTWARE === "1"
      ? {
          args: [
            "--enable-webgl",
            "--use-angle=swiftshader",
            "--enable-unsafe-swiftshader",
          ],
        }
      : {}),
  });
  const context = await browser.newContext({
    viewport: { width, height: mobile ? 844 : 1000 },
    isMobile: mobile,
    hasTouch: mobile,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const result = {
    name,
    viewport: { width, height: mobile ? 844 : 1000 },
    errors: [],
    samples: [],
    screenshots: [],
  };
  const fail = (message) => result.errors.push(message);
  page.on("pageerror", (e) => fail(e.message));
  page.on("response", (r) => {
    if (r.status() >= 400 && new URL(r.url()).origin === new URL(base).origin)
      fail(`HTTP ${r.status()} ${r.url()}`);
  });
  const shot = async (label) => {
    const filename = `${name}-${label}.jpg`;
    await page.screenshot({
      path: path.join(directory, filename),
      type: "jpeg",
      quality: 85,
    });
    result.screenshots.push(filename);
  };
  try {
    console.log(`${name}: opening ${base}`);
    await page.goto(base, { waitUntil: "load" });
    await page.waitForFunction(
      () => window.__tsubasaEffects?.surfaces.length === 11,
      { timeout: 20000 },
    );
    result.engine = await page.evaluate(() =>
      window.__tsubasaEffects.inspect(),
    );
    if (!result.engine.gpu || result.engine.contextCount !== 1)
      fail("Single GPU steam context unavailable");
    const targets = [
      ...selectors,
      ...Array.from(
        { length: mobile ? 8 : 2 },
        (_, i) => `.food-card:nth-child(${mobile ? i + 1 : i * 4 + 1})`,
      ),
    ];
    for (const [i, selector] of targets.entries()) {
      await scrollTo(page, selector);
      await page.waitForFunction(
        (selector) => {
          const target = document.querySelector(selector);
          return window.__tsubasaEffects.surfaces.some(
            (s) => target.contains(s.image) && s.visible && s.ready,
          );
        },
        selector,
        { timeout: 15000 },
      );
      await startSample(page);
      await shot(`${i}-t0`);
      await page.waitForTimeout(1300);
      const pixels = await endSample(page);
      if (!pixels.length) fail(`No rendered steam at ${selector}`);
      for (const p of pixels) {
        if (p.frames < 2 || p.steam < 30 || p.roots.some((n) => n < 10))
          fail(`Steam stopped or missing root: ${JSON.stringify(p)}`);
        if (p.bowl !== 0) fail(`Bowl was distorted: ${JSON.stringify(p)}`);
        if (p.alignmentError > 1)
          fail(`Photo/canvas misalignment: ${JSON.stringify(p)}`);
      }
      result.samples.push({ selector, pixels });
      await shot(`${i}-t1`);
    }
    const allProfiles = new Set(
      result.samples.flatMap((s) => s.pixels.map((p) => p.profile)),
    );
    if (allProfiles.size !== 11)
      fail(`Only ${allProfiles.size}/11 photographs tested`);
    await scrollTo(page, ".signature-miso");
    result.pointer = await page.locator(".signature-miso").evaluate((el) => {
      const s = window.__tsubasaEffects.surfaces[0],
        r = el.getBoundingClientRect();
      el.dispatchEvent(
        new PointerEvent("pointerdown", {
          pointerType: "touch",
          clientX: r.left + r.width * 0.55,
          clientY: r.top + r.height * 0.3,
          bubbles: true,
        }),
      );
      el.dispatchEvent(
        new PointerEvent("pointermove", {
          pointerType: "touch",
          clientX: r.left + r.width * 0.63,
          clientY: r.top + r.height * 0.25,
          bubbles: true,
        }),
      );
      const accepted =
        !!s.pointer && (s.pointer.dx !== 0 || s.pointer.dy !== 0);
      el.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
      return { accepted, released: s.prevPointer === null };
    });
    if (!result.pointer.accepted || !result.pointer.released)
      fail("Pointer input/release failed");
    await page.waitForTimeout(500);
    await shot("pointer");
    // Software GPU runners can take seconds per frame. Observe a bounded
    // wall-clock interval; waiting for 120 frames could take many minutes.
    result.frameTiming = await page.evaluate(
      () =>
        new Promise((resolve) => {
          const samples = [];
          const started = performance.now();
          let previous = started,
            raf = 0;
          function sample(t) {
            samples.push(t - previous);
            previous = t;
            raf = requestAnimationFrame(sample);
          }
          raf = requestAnimationFrame(sample);
          setTimeout(() => {
            cancelAnimationFrame(raf);
            samples.sort((a, b) => a - b);
            resolve({
              duration: performance.now() - started,
              sampleCount: samples.length,
              average: samples.length
                ? samples.reduce((a, b) => a + b, 0) / samples.length
                : null,
              p95: samples[Math.floor(samples.length * 0.95)] ?? null,
              over50ms: samples.filter((x) => x > 50).length,
            });
          }, 2000);
        }),
    );
    await scrollTo(page, "#access");
    await page.waitForTimeout(600);
    const stopped = await page.evaluate(
      () => window.__tsubasaEffects.surfaces[0].draws,
    );
    await page.waitForTimeout(600);
    if (
      stopped !==
      (await page.evaluate(() => window.__tsubasaEffects.surfaces[0].draws))
    )
      fail("Offscreen steam kept rendering");
    await scrollTo(page, ".signature-miso");
    // A draw made while leaving the section is not proof that it resumed.
    // Slow software-GPU runners can still have a pending intersection update
    // after scrollTo's fixed delay. Require a new, visible draw after stopping.
    await page.waitForFunction(
      (draws) => {
        const s = window.__tsubasaEffects.surfaces[0];
        return s.visible && s.ready && s.draws > draws;
      },
      stopped,
      { timeout: 15000 },
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForFunction(() => {
      const s = window.__tsubasaEffects.surfaces[0];
      return (
        matchMedia("(prefers-reduced-motion: reduce)").matches &&
        s.visible &&
        s.ready
      );
    });
    // A media change may render the unwarped photo once. It must never run
    // another simulation step, and then must reach two unchanged samples.
    // Do not confuse this final static paint with continued animation, or
    // rely on a change-event diagnostic that can lag the effective query.
    result.reducedMotion = [];
    const reducedDraws = new Map();
    let quietSamples = 0;
    for (let attempt = 0; attempt < 6 && quietSamples < 2; attempt++) {
      await startSample(page);
      await page.waitForTimeout(500);
      const sample = await endSample(page);
      result.reducedMotion.push(...sample);
      if (!sample.length) {
        fail("Reduced-motion photograph missing");
        break;
      }
      for (const p of sample) {
        reducedDraws.set(
          p.profile,
          (reducedDraws.get(p.profile) || 0) + p.frames,
        );
        if (p.steps || reducedDraws.get(p.profile) > 1)
          fail("Reduced motion kept simulating or rendering");
      }
      quietSamples = sample.every((p) => !p.frames && !p.steam && !p.bowl)
        ? quietSamples + 1
        : 0;
    }
    if (quietSamples < 2) fail("Reduced-motion pixels did not settle");
    const resumeSteps = await page.evaluate(() =>
      Object.fromEntries(
        window.__tsubasaEffects.surfaces.map((s) => [s.profile, s.steps]),
      ),
    );
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.waitForFunction(
      (before) =>
        window.__tsubasaEffects.surfaces.some(
          (s) => s.visible && s.steps > before[s.profile],
        ),
      resumeSteps,
      { timeout: 15000 },
    );
    await startSample(page);
    await page.waitForTimeout(1500);
    if (!(await endSample(page)).some((p) => p.steam > 30))
      fail("Motion did not restart");
    result.finalState = await page.evaluate(() =>
      window.__tsubasaEffects.inspect(),
    );
    result.errors.push(...result.finalState.errors);
    if (
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      )
    )
      fail("Horizontal page overflow");
    result.pressure = await pressureQA(
      context,
      base,
      async (pressurePage, label) => {
        const filename = `${name}-pressure-${label}.jpg`;
        await pressurePage.screenshot({
          path: path.join(directory, filename),
          type: "jpeg",
          quality: 85,
        });
        result.screenshots.push(filename);
      },
      undefined,
      mobile,
    );
    result.errors.push(...result.pressure.errors);
    const approvedSource = await fs.readFile(
      new URL("./fixtures/steam-approved-4e6b68e.js", import.meta.url),
      "utf8",
    );
    const approved = await pressureQA(context, base, undefined, approvedSource);
    result.errors.push(...approved.errors);
    result.preservation = result.pressure.results.map((s, i) => ({
      profile: s.profile,
      rootIndex: s.rootIndex,
      ambientExact: s.controlSHA256 === approved.results[i].controlSHA256,
      pressureExact:
        s.fraction === approved.results[i].fraction &&
        s.meanDifference === approved.results[i].meanDifference,
    }));
    if (result.preservation.some((s) => !s.ambientExact || !s.pressureExact))
      fail(`Approved steam changed: ${JSON.stringify(result.preservation)}`);
    result.finger = await fingerQA(
      context,
      base,
      async (fingerPage, label) => {
        const filename = `${name}-${label}.jpg`;
        await fingerPage.screenshot({
          path: path.join(directory, filename),
          type: "jpeg",
          quality: 85,
        });
        result.screenshots.push(filename);
      },
      mobile,
    );
    result.errors.push(...result.finger.errors);
    // A GPU failure must keep original photographs and text readable.
    const fallback = await context.newPage();
    await fallback.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        return /webgl/.test(type) ? null : original.call(this, type, ...args);
      };
    });
    await fallback.goto(base, { waitUntil: "domcontentloaded" });
    await scrollTo(fallback, ".signature-miso");
    result.fallback = await fallback
      .locator(".signature-miso img")
      .evaluate((img) => ({
        loaded: img.complete && img.naturalWidth > 0,
        opacity: getComputedStyle(img).opacity,
      }));
    if (!result.fallback.loaded || result.fallback.opacity === "0")
      fail("GPU fallback hid the photograph");
    await fallback.close();
  } catch (e) {
    fail(String(e.stack || e));
  }
  result.passed = result.errors.length === 0;
  results.cases.push(result);
  console.log(
    `${name}: ${result.passed ? "PASS" : "FAIL"} ${JSON.stringify(result.errors)} timing=${JSON.stringify(result.frameTiming)}`,
  );
  await browser.close();
  await fs.writeFile(
    path.join(directory, "report.json"),
    JSON.stringify(results, null, 2),
  );
}
results.passed = results.cases.every((r) => r.passed);
await fs.writeFile(
  path.join(directory, "report.json"),
  JSON.stringify(results, null, 2),
);
if (!results.passed) process.exitCode = 1;
