// Real pointer/touch input, deterministic time, full production fluid/shader.
// Test-only hooks expose density and isolate composite pixels; none are shipped.
export async function fingerQA(
  context,
  base,
  saveShot = async () => {},
  touch = false,
) {
  const page = await context.newPage(),
    errors = [],
    results = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route(/\/effects\.js(?:\?|$)/, async (route) => {
    const response = await route.fetch();
    let source = await response.text();
    const schedule = "if (!raf && !hidden) raf = requestAnimationFrame(tick);";
    if (!source.includes(schedule))
      throw Error("Finger QA scheduling hook missing");
    source = source.replace(schedule, "window.__fingerTick = tick;");
    source = source.replace(
      "  // Keep the readable photo fallback",
      `
  window.__fingerReset = index => {
    for (const [i,s] of systems.entries()) {
      s.visible = i === index; s.last = 0; s.time = 0; s.nextEmit = 0;
      s.pointer = s.prevPointer = s.contact = null;
      clearFinger(s);
      s.canvas.width = Math.min(480, s.image.naturalWidth);
      s.canvas.height = Math.round(s.canvas.width*s.image.naturalHeight/s.image.naturalWidth);
    }
    window.__fingerNow = 1000;
  };
  window.__fingerRead = index => {
    const s = systems[index], f = s.finger;
    if (!f) return {mass:0, maximum:0, x:0, y:0, active:false};
    gl.bindFramebuffer(gl.FRAMEBUFFER, f.dye.read.fbo);
    const pixels = new Float32Array(f.w*f.h*4);
    gl.readPixels(0,0,f.w,f.h,gl.RGBA,gl.FLOAT,pixels);
    let mass=0, x=0, y=0, maximum=0,minX=1,maxX=0;
    for(let i=0;i<pixels.length;i+=4){
      const d=pixels[i]; mass+=d; maximum=Math.max(maximum,d);
      x+=d*((i/4)%f.w+.5)/f.w;
      y+=d*(Math.floor(i/4/f.w)+.5)/f.h;
      if(d>.01){const px=((i/4)%f.w+.5)/f.w;minX=Math.min(minX,px);maxX=Math.max(maxX,px);}
    }
    return {mass,maximum,x:x/mass,y:y/mass,minX,maxX,active:true};
  };
  window.__fingerPixels = index => {
    const s=systems[index],f=s.finger,w=s.canvas.width,h=s.canvas.height;
    current=s; render(s,s.time);
    const a=s.ctx.getImageData(0,0,w,h).data;
    s.finger=null; render(s,s.time);
    const b=s.ctx.getImageData(0,0,w,h).data;
    s.finger=f; render(s,s.time);
    let changed=0,max=0,darkened=0;
    for(let i=0;i<a.length;i+=4){
      const d=Math.max(a[i]-b[i],a[i+1]-b[i+1],a[i+2]-b[i+2]);
      max=Math.max(max,d);if(d>3)changed++;
      if(Math.min(a[i]-b[i],a[i+1]-b[i+1],a[i+2]-b[i+2]) < -1)darkened++;
    }
    return {changed,max,darkened};
  };
  // Keep the readable photo fallback`,
    );
    await route.fulfill({ response, body: source });
  });
  const run = async (frames) => {
    for (let n = 0; n < frames; n += 4)
      await page.evaluate(
        (count) => {
          for (let j = 0; j < count; j++)
            __fingerTick((window.__fingerNow += 40));
        },
        Math.min(4, frames - n),
      );
  };
  try {
    await page.goto(base, { waitUntil: "load" });
    await page.waitForFunction(
      () =>
        window.__fingerTick &&
        __tsubasaEffects.surfaces
          .slice(0, 3)
          .every((s) => s.image.naturalWidth),
    );
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
            css = getComputedStyle(img),
            pos = css.objectPosition.split(" ").map((x) => parseFloat(x) / 100);
          const fit = css.objectFit === "contain" ? Math.min : Math.max;
          const scale = fit(
              r.width / img.naturalWidth,
              r.height / img.naturalHeight,
            ),
            w = img.naturalWidth * scale,
            h = img.naturalHeight * scale;
          const root = s.roots[rootIndex],
            x = root[0],
            y = root[1] - 0.06;
          return {
            x: r.x + (r.width - w) * pos[0] + x * w,
            y: r.y + (r.height - h) * pos[1] + y * h,
            ix: x,
            iy: 1 - y,
            profile: s.profile,
            imageWidth: w,
          };
        },
        { index, rootIndex },
      );
      await page.waitForTimeout(100);
      await page.mouse.move(point.x, point.y);
      await page.evaluate((i) => __fingerReset(i), index);
      await run(3);
      const idle = await page.evaluate(
        (i) => ({ density: __fingerRead(i), pixels: __fingerPixels(i) }),
        index,
      );
      if (idle.density.active || idle.pixels.changed)
        errors.push(`Unexpected idle finger layer: ${index}/${rootIndex}`);
      await page.mouse.down();
      await run(1);
      const initial = await page.evaluate((i) => __fingerRead(i), index);
      if (
        initial.mass <= 0 ||
        Math.hypot(initial.x - point.ix, initial.y - point.iy) > 0.025
      )
        errors.push(
          `Vapor did not originate at fingertip: ${JSON.stringify({ point, initial })}`,
        );
      await run(8);
      const hold = await page.evaluate(
        (i) => ({ density: __fingerRead(i), pixels: __fingerPixels(i) }),
        index,
      );
      if (
        hold.density.mass <= initial.mass ||
        hold.pixels.changed < 5 ||
        hold.pixels.max < 8 ||
        hold.pixels.darkened
      )
        errors.push(`Invisible/opaque finger vapor: ${JSON.stringify(hold)}`);
      // Alternate drag directions so both signs, and all four roots, are tested.
      const sign = rootIndex === 1 || index === 1 ? -1 : 1;
      for (let j = 1; j <= 5; j++) {
        await page.mouse.move(point.x + sign * j * 7, point.y - j * 3);
        await run(1);
      }
      const drag = await page.evaluate((i) => __fingerRead(i), index);
      if (sign * (drag.x - hold.density.x) <= 0.001)
        errors.push(
          `Wrong drag direction: ${JSON.stringify({ sign, hold: hold.density, drag })}`,
        );
      await saveShot(page, `${point.profile}-${rootIndex}-finger-drag`);
      await page.mouse.up();
      await run(10);
      const drift = await page.evaluate((i) => __fingerRead(i), index);
      if (sign * (drift.x - drag.x) <= 0)
        errors.push(
          `No directional momentum after release: ${JSON.stringify({ sign, drag, drift })}`,
        );
      let fade = null,
        disposed = null;
      // Approved dynamic vapor has a 6.5-second lifetime; check full disposal.
      // all four roots above still exercise origin, hold, drag and momentum.
      if (index === 2 && rootIndex === 1) {
        await run(80);
        fade = await page.evaluate((i) => __fingerRead(i), index);
        // The approved dynamic plume unfolds over a wider area: at 1.4s its
        // peak has faded but the advected area can still grow. At 3.6s require
        // both 65% peak decay and 25% integrated density loss, before disposal.
        if (
          fade.maximum >= drag.maximum * 0.35 ||
          fade.mass >= drag.mass * 0.75
        )
          errors.push(
            `Finger vapor did not fade: ${JSON.stringify({ drag, fade })}`,
          );
        await run(80);
        disposed = await page.evaluate(
          (i) => ({
            density: __fingerRead(i),
            pixels: __fingerPixels(i),
            held: !!__tsubasaEffects.surfaces[i].contact,
          }),
          index,
        );
        if (disposed.density.active || disposed.pixels.changed || disposed.held)
          errors.push(
            `Finger resources/input not cleared: ${JSON.stringify(disposed)}`,
          );
      }
      const sample = {
        profile: point.profile,
        rootIndex,
        idle,
        initial,
        hold,
        drag,
        drift,
        fade,
        disposed,
      };
      if (disposed) {
        await page.mouse.move(point.x, point.y);
        await page.evaluate((i) => __fingerReset(i), index);
        await run(2);
        // The whole stroke occurs before the next simulated animation frame.
        await page.mouse.down();
        await page.mouse.move(point.x - 50, point.y, { steps: 4 });
        await page.mouse.up();
        await run(1);
        sample.quick = await page.evaluate((i) => __fingerRead(i), index);
        if (
          !sample.quick.mass ||
          sample.quick.maxX - sample.quick.minX < (50 / point.imageWidth) * 0.7
        )
          errors.push(
            `Quick stroke lost its path: ${JSON.stringify(sample.quick)}`,
          );
      }
      if (touch) {
        await page.touchscreen.tap(point.x, point.y);
        await run(3);
        sample.tap = await page.evaluate(
          (i) => ({ density: __fingerRead(i), pixels: __fingerPixels(i) }),
          index,
        );
        if (!sample.tap.density.active || sample.tap.pixels.changed < 3)
          errors.push(`Rapid touch tap lost: ${JSON.stringify(sample.tap)}`);
        await saveShot(page, `${point.profile}-${rootIndex}-finger-tap`);
      }
      results.push(sample);
    }
    if (touch && context.browser().browserType().name() === "chromium") {
      // Mouse emulation alone misses native gesture cancellation. Exercise real
      // browser touch input: horizontal vapor trails AND ordinary vertical scroll.
      await page.evaluate(() =>
        scrollTo({
          top: document.querySelector("#signature").offsetTop,
          behavior: "instant",
        }),
      );
      await page.waitForTimeout(150);
      await page.evaluate(() => __fingerReset(0));
      await run(2);
      const p = await page.evaluate(() => ({
        x: innerWidth * 0.3,
        y: innerHeight * 0.35,
        scrollY,
      }));
      const cdp = await context.newCDPSession(page);
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x: p.x, y: p.y }],
      });
      for (let j = 1; j <= 8; j++) {
        await cdp.send("Input.dispatchTouchEvent", {
          type: "touchMove",
          touchPoints: [{ x: p.x + j * 12, y: p.y }],
        });
        await run(1);
      }
      const horizontal = await page.evaluate(() => ({
        held: !!__tsubasaEffects.surfaces[0].contact?.down,
        scrollY,
        density: __fingerRead(0),
      }));
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
      if (
        !horizontal.held ||
        !horizontal.density.mass ||
        Math.abs(horizontal.scrollY - p.scrollY) > 1
      )
        errors.push(
          `Horizontal touch gesture cancelled: ${JSON.stringify(horizontal)}`,
        );
      // Let the browser schedule one quick native swipe. Awaiting individual
      // CDP events on a software GPU can unintentionally hold >200ms before
      // the first move, testing a long press instead of a scrolling gesture.
      await cdp.send("Input.synthesizeScrollGesture", {
        x: p.x, y: p.y + 150, yDistance: -128,
        speed: 800, preventFling: true, gestureSourceType: "touch",
      });
      await page.waitForTimeout(150);
      const vertical = await page.evaluate(() => ({
        held: !!__tsubasaEffects.surfaces[0].contact?.down,
        scrollY,
        pending: !!__tsubasaEffects.surfaces[0].fingerPending,
      }));
      if (
        vertical.held ||
        vertical.pending ||
        vertical.scrollY < p.scrollY + 20
      )
        errors.push(
          `Vertical scroll blocked/stuck input: ${JSON.stringify(vertical)}`,
        );
      results.push({ nativeTouch: { horizontal, vertical } });
      await cdp.detach();
    }
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    // Software-rendered CI can take >300ms per frame. Wait for the actual
    // offscreen observer cleanup, not a delay shorter than one browser frame.
    await page.waitForFunction(
      () => __tsubasaEffects.surfaces.every((s) => !s.finger),
      null,
      { timeout: 10000 },
    );
    const remaining = await page.evaluate(
      () => __tsubasaEffects.surfaces.filter((s) => s.finger).length,
    );
    if (remaining) errors.push("Offscreen finger resources retained");
    const engineErrors = await page.evaluate(() => __tsubasaEffects.errors);
    errors.push(...engineErrors);
  } finally {
    await page.close();
  }
  return { results, errors };
}
