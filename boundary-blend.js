/* Approved photographic boundaries: no perpetual animation or steam changes. */
(() => {
  const autoStart = document.currentScript?.hasAttribute("data-boundary-autostart");
  const root = document.documentElement;
  const definitions = [
    ["street-miso", "交差点 → 究極", "#top", "#signature"],
    ["miso-butter", "究極 → バターコーン", "#signature", ".signature-butter-corn"],
    ["butter-tsubasa", "バターコーン → つばさ", ".signature-butter-corn", ".signature-tsubasa"],
  ];
  const boundaries = definitions.map(([id, label, from, to], index) => ({
    id, label, index, from:document.querySelector(from), to:document.querySelector(to),
    bottom:0, progress:0, previousAlpha:"", updates:0,
  }));
  if (boundaries.some(b => !b.from || !b.to) || window.__tsubasaBoundaryPreview) return;
  for (const b of boundaries.slice(1)) b.from.dataset.boundaryExit = "ramen";
  boundaries[1].to.dataset.boundarySpacing = "original";
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let enabled = false, raf = 0, overlap = 0, viewport = innerHeight, updates = 0;
  const clamp = n => Math.max(0, Math.min(1, n));
  // A CSS mask changes pixels, not hit testing. Keep the upper scene's input
  // on its visible half of an overlap and let the lower half reach the bowl.
  // The street renderer listens on its canvas; relay only its input surface,
  // leaving the real canvas, shader, geometry and native vertical pan intact.
  const hitRegions = boundaries.filter(b => b.index !== 1).map(b => {
    const street = b.index === 0;
    const host = street ? b.from.querySelector(".fluid-text-stage") : b.from;
    const hit = document.createElement("div");
    hit.className = "boundary-hit-region";
    hit.setAttribute("aria-hidden", "true");
    b.from.dataset.boundaryHitRegion = "";
    if (street) {
      for (const type of ["pointerenter", "pointerdown", "pointermove", "pointerup", "pointercancel", "pointerleave"])
        hit.addEventListener(type, event => {
          const canvas = host.querySelector("canvas");
          if (canvas) canvas.dispatchEvent(new PointerEvent(type, {
            clientX:event.clientX, clientY:event.clientY, pointerId:event.pointerId,
            pointerType:event.pointerType, isPrimary:event.isPrimary,
            button:event.button, buttons:event.buttons, pressure:event.pressure,
            width:event.width, height:event.height, bubbles:false,
          }));
        }, { passive:true });
    }
    host.append(hit);
    return { from:b.from, hit };
  });
  function paint() {
    raf = 0;
    if (!enabled || document.hidden) return;
    for (const b of boundaries) {
      b.progress = clamp((viewport * .87 - (b.bottom - scrollY - overlap / 2)) / (viewport * .75));
      const eased = b.progress * b.progress * (3 - 2 * b.progress);
      const alpha = (motion.matches ? .46 : .66 - eased * .40).toFixed(3);
      if (alpha !== b.previousAlpha) {
        b.from.style.setProperty("--boundary-alpha", alpha);
        if (b.index === 0) root.style.setProperty("--boundary-alpha", alpha);
        b.previousAlpha = alpha;
        b.updates++;
        updates++;
      }
    }
  }
  function queue() {
    if (enabled && !raf && !document.hidden) raf = requestAnimationFrame(paint);
  }
  function measure() {
    viewport = innerHeight;
    overlap = Math.round(innerWidth <= 700
      ? Math.max(130, Math.min(210, viewport * .23))
      : Math.max(180, Math.min(330, viewport * .32)));
    root.style.setProperty("--boundary-overlap", `${overlap}px`);
    for (const b of boundaries) {
      const scene = b.from.getBoundingClientRect();
      const bottom = scene.bottom;
      b.bottom = bottom + scrollY;
      if (b.index === 0) continue;
      const photo = b.from.querySelector("img.media").getBoundingClientRect();
      if (!photo.height) continue;
      for (const [name, fraction] of [["start",1],["mid1",.72],["mid2",.38],["end",0]]) {
        const stop = (bottom - overlap * fraction - photo.top) / photo.height * 100;
        b.from.style.setProperty(`--boundary-photo-${name}`, `${stop.toFixed(5)}%`);
      }
      if (b.from.dataset.boundarySpacing === "original") {
        for (const [name, fraction] of [["start",0],["mid",.26],["end",.55]]) {
          const stop = (scene.top + overlap * fraction - photo.top) / photo.height * 100;
          b.from.style.setProperty(`--boundary-photo-entry-${name}`, `${stop.toFixed(5)}%`);
        }
      }
    }
    queue();
  }
  function setEnabled(value) {
    // Keep the nearest boundary at the same screen position when comparing.
    const nearest = boundaries.reduce((a,b) =>
      Math.abs(b.bottom-scrollY-viewport*.5) < Math.abs(a.bottom-scrollY-viewport*.5) ? b : a);
    const oldBottom = nearest.bottom;
    const y = scrollY;
    enabled = !!value;
    root.classList.toggle("boundary-blend", enabled);
    measure();
    scrollTo({ top:y + nearest.bottom - oldBottom, behavior:"instant" });
    if (!enabled) {
      // The existing renderer copies the source mask during a hover/resize.
      // Restore that copied presentation state as well as removing our CSS.
      for (const b of boundaries.slice(1)) {
        const source = getComputedStyle(b.from.querySelector("img.media"));
        for (const canvas of b.from.querySelectorAll(":scope > .steam-photo")) {
          canvas.style.maskImage = source.maskImage;
          canvas.style.webkitMaskImage = source.webkitMaskImage;
        }
      }
    }
    queue();
  }
  function focusBoundary(index = 0) {
    measure();
    const b = boundaries[Number(index)] || boundaries[0];
    const inset = b.id === "miso-butter" ? 0 : overlap / 2;
    scrollTo({ top:b.bottom - inset - viewport * .43, behavior:"instant" });
    queue();
  }
  const resize = new ResizeObserver(measure);
  for (const b of boundaries) {
    resize.observe(b.from);
    if (b.index) resize.observe(b.from.querySelector("img.media"));
  }
  addEventListener("resize", measure, { passive:true });
  addEventListener("scroll", queue, { passive:true });
  addEventListener("pageshow", measure);
  document.addEventListener("visibilitychange", queue);
  motion.addEventListener("change", queue);
  window.__tsubasaBoundaryPreview = {
    setEnabled, focusBoundary,
    get state() { return { enabled, overlap, progress:boundaries[0].progress, updates, raf,
      bottom:boundaries[0].bottom, viewport,
      boundaries:boundaries.map(({id,label,bottom,progress,updates}) => ({id,label,bottom,progress,updates})),
    }; },
    destroy() {
      setEnabled(false);
      if (raf) cancelAnimationFrame(raf);
      resize.disconnect();
      removeEventListener("resize", measure);
      removeEventListener("scroll", queue);
      removeEventListener("pageshow", measure);
      document.removeEventListener("visibilitychange", queue);
      motion.removeEventListener("change", queue);
      root.style.removeProperty("--boundary-alpha");
      root.style.removeProperty("--boundary-overlap");
      for (const {from,hit} of hitRegions) {
        hit.remove();
        delete from.dataset.boundaryHitRegion;
      }
      for (const b of boundaries) {
        delete b.from.dataset.boundaryExit;
        delete b.from.dataset.boundarySpacing;
        for (const name of ["alpha","photo-start","photo-mid1","photo-mid2","photo-end","photo-entry-start","photo-entry-mid","photo-entry-end"])
          b.from.style.removeProperty(`--boundary-${name}`);
      }
      delete window.__tsubasaBoundaryPreview;
    },
  };
  measure();
  if (autoStart) {
    // Start before the first paint without moving the visitor's scroll position.
    enabled = true;
    root.classList.add("boundary-blend");
    measure();
  }
})();
