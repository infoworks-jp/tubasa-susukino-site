// Deterministic A/B check: identical GPU state/time, with and without a real
// press. Test-only hooks are injected into the fetched script, never shipped.
// A normal-time visual pass is still required; these pixels are not taste QA.
export async function pressureQA(
  context,
  base,
  saveShot = async () => {},
  sourceOverride,
  touch = false,
) {
  const page = await context.newPage();
  const errors = [];
  const results = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route(/\/effects\.js(?:\?|$)/, async (route) => {
    const response = await route.fetch();
    let source = sourceOverride || (await response.text());
    const schedule = "if (!raf && !hidden) raf = requestAnimationFrame(tick);";
    if (!source.includes(schedule)) throw Error("QA scheduling hook missing");
    source = source.replace(schedule, "window.__pressureTick = tick;");
    source = source.replace(
      "  // Keep the readable photo fallback",
      `
  window.__pressureReset = (index) => {
    for (const [i,s] of systems.entries()) {
      s.visible = i === index;
      s.last = 0; s.time = 0; s.nextEmit = 0;
      s.pointer = s.prevPointer = s.contact = null;
      if (!s.allocated) continue;
      for (const field of [s.velocity, s.dye, s.pressure])
        for (const buffer of [field.read, field.write]) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, buffer.fbo);
          gl.clearBufferfv(gl.COLOR, 0, new Float32Array(4));
        }
    }
    window.__pressureNow = 1000;
  };
  // Keep the readable photo fallback`,
    );
    await route.fulfill({ response, body: source });
  });
  try {
    await page.goto(base, { waitUntil: "load" });
    await page.waitForFunction(
      () =>
        window.__pressureTick &&
        window.__tsubasaEffects.surfaces
          .slice(0, 3)
          .every((s) => s.image.naturalWidth),
    );
    await page.evaluate(() => {
      window.__pressureControls = {};
    });
    const run = async (frames) => {
      // Small GPU batches also work on software-rendered CI browsers.
      for (let n = 0; n < frames; n += 4)
        await page.evaluate(
          (count) => {
            for (let k = 0; k < count; k++)
              window.__pressureTick((window.__pressureNow += 40));
          },
          Math.min(4, frames - n),
        );
    };
    for (const [index, rootIndex] of [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
    ]) {
      const point = await page.evaluate(
        ({ index, rootIndex }) => {
          const s = __tsubasaEffects.surfaces[index],
            img = s.image;
          scrollTo({ top: img.parentElement.offsetTop, behavior: "instant" });
          const r = img.getBoundingClientRect(),
            css = getComputedStyle(img);
          const pos = css.objectPosition
            .split(" ")
            .map((n) => parseFloat(n) / 100);
          const fit = css.objectFit === "contain" ? Math.min : Math.max;
          const scale = fit(
            r.width / img.naturalWidth,
            r.height / img.naturalHeight,
          );
          const w = img.naturalWidth * scale,
            h = img.naturalHeight * scale;
          const root = s.roots[rootIndex];
          return {
            // Press the bowl just below the steam's root: previously invisible.
            x: r.x + (r.width - w) * pos[0] + root[0] * w,
            y: r.y + (r.height - h) * pos[1] + (root[1] + 0.025) * h,
            profile: s.profile,
          };
        },
        { index, rootIndex },
      );
      await page.waitForTimeout(100);
      await page.mouse.move(point.x, point.y);
      const reset = () =>
        page.evaluate((i) => window.__pressureReset(i), index);
      const control = (phase) =>
        page.evaluate(
          ({ index, phase }) => {
            const s = __tsubasaEffects.surfaces[index];
            window.__pressureControls[phase] = s.ctx.getImageData(
              0,
              0,
              s.canvas.width,
              s.canvas.height,
            ).data;
          },
          { index, phase },
        );
      await reset();
      await run(12);
      await run(24);
      await control("hold");
      await run(6);
      await control("drag");
      await reset();
      await run(12);
      await page.mouse.down();
      await run(24);
      const measure = (phase) =>
        page.evaluate(
          async ({ index, rootIndex, phase }) => {
            const s = __tsubasaEffects.surfaces[index],
              root = s.roots[rootIndex];
            const w = s.canvas.width,
              h = s.canvas.height;
            const a = window.__pressureControls[phase],
              b = s.ctx.getImageData(0, 0, w, h).data;
            let changed = 0,
              roi = 0,
              bowl = 0,
              sum = 0;
            for (let i = 0; i < a.length; i += 4) {
              const x = ((i / 4) % w) / w,
                y = Math.floor(i / 4 / w) / h;
              const d = Math.max(
                ...[0, 1, 2].map((c) => Math.abs(a[i + c] - b[i + c])),
              );
              if (y > 0.55 && d > 6) bowl++;
              if (y < root[1] - 0.03 && Math.abs(x - root[0]) < root[2]) {
                roi++;
                sum += d;
                if (d > 8) changed++;
              }
            }
            const hash = await crypto.subtle.digest("SHA-256", a);
            const controlSHA256 = Array.from(new Uint8Array(hash), (n) =>
              n.toString(16).padStart(2, "0"),
            ).join("");
            return {
              profile: s.profile,
              rootIndex,
              changed,
              roi,
              fraction: changed / roi,
              meanDifference: sum / roi,
              bowl,
              held: !!s.contact?.down,
              controlSHA256,
            };
          },
          { index, rootIndex, phase },
        );
      const sample = await measure("hold");
      await saveShot(page, `${point.profile}-${rootIndex}-hold`);
      await page.mouse.move(point.x + 35, point.y - 25, { steps: 6 });
      await run(6);
      sample.drag = await measure("drag");
      if (
        sample.drag.fraction < 0.02 ||
        sample.drag.meanDifference < 0.5 ||
        sample.drag.bowl
      )
        errors.push(`Invisible/unsafe drag: ${JSON.stringify(sample.drag)}`);
      await page.mouse.up();
      await run(24);
      sample.released = await page.evaluate(
        (i) => !__tsubasaEffects.surfaces[i].contact,
        index,
      );
      if (
        !sample.held ||
        !sample.released ||
        sample.fraction < 0.02 ||
        sample.meanDifference < 0.5 ||
        sample.bowl
      )
        errors.push(`Invisible/unsafe pressure: ${JSON.stringify(sample)}`);
      if (touch) {
        await reset();
        await run(18);
        await control("tap");
        await reset();
        await run(12);
        await page.touchscreen.tap(point.x, point.y);
        await run(6);
        sample.tap = await measure("tap");
        if (
          sample.tap.fraction < 0.02 ||
          sample.tap.meanDifference < 0.5 ||
          sample.tap.bowl
        )
          errors.push(`Invisible/unsafe touch: ${JSON.stringify(sample.tap)}`);
        await saveShot(page, `${point.profile}-${rootIndex}-tap`);
      }
      results.push(sample);
    }
  } finally {
    await page.close();
  }
  return { results, errors };
}
