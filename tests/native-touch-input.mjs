import {setTimeout as delay} from 'node:timers/promises';

// Replay one native, 160ms finger swipe. Preserve the input timestamps when
// software rendering delays CDP acknowledgements; acknowledgement latency is
// not time spent intentionally holding a finger still.
// Input.synthesizeScrollGesture in Playwright 1.55's Linux Chromium emitted
// pointermove but no touchmove and could not scroll even plain tall HTML.
export async function quickSwipe(cdp, {x, y, distance = 128}) {
  const start = Date.now();
  for (const [offset, type, dy] of [
    [0, 'touchStart', 0],
    [40, 'touchMove', distance * .375],
    [100, 'touchMove', distance],
    [160, 'touchEnd', 0],
  ]) {
    await delay(Math.max(0, start + offset - Date.now()));
    await cdp.send('Input.dispatchTouchEvent', {
      type,
      timestamp: (start + offset) / 1000,
      touchPoints: type === 'touchEnd' ? [] : [{x, y: y - dy, id: 1, radiusX: 5, radiusY: 5, force: .6}],
    });
  }
}

export async function verifyScrollControl(context) {
  const page = await context.newPage();
  try {
    await page.setContent('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;height:15000px}div{height:15000px;touch-action:pan-y pinch-zoom}</style><div>Native scroll input control</div>');
    await page.evaluate(() => {
      scrollTo(0, 3000);
      window.controlEvents = [];
      for (const type of ['touchmove', 'pointercancel'])
        document.addEventListener(type, e => controlEvents.push(e.type), {passive: true});
      document.querySelector('div').addEventListener('touchmove', () => {}, {passive: false});
    });
    const cdp = await context.newCDPSession(page);
    await quickSwipe(cdp, {x: 180, y: 260});
    await page.waitForFunction(() => scrollY > 3020);
    const result = await page.evaluate(() => ({delta: scrollY - 3000, events: controlEvents}));
    if (!result.events.includes('touchmove') || !result.events.includes('pointercancel'))
      throw new Error('Native input control did not emit scrolling touch events');
    await cdp.detach();
    return result;
  } finally { await page.close(); }
}
