# September notice and fingertip density

## Scope and design before implementation

- Baseline: c7172bf, approved by the user, including working native Brave after GPU configuration diagnosis.
- Visual thesis: retain the black, photographic restaurant site; use its warm gold as a single readable, temporary announcement above the CM button.
- Content: current hero remains unchanged; announce 2026-09-21 Monday open and 2026-09-24 Thursday substitute closure. No redesign elsewhere.
- Interaction: preserve autonomous steam, original pressure flow and fade; increase only newly emitted fingertip vapor. Notice stays still and scrolls away with the hero.
- Existing unrelated changes in steam-canvas2d.js and steam-safari-baseline.css remain untouched.

## Small, isolated adjustment

Fingertip density injection: 0.16 → 0.21, a 31.25% increase to make contact visible without widening the trail or changing its motion. Render opacity, radii, dissipation, resolution, texture count and update rate remain identical. Ambient shader, ambient emissions, eight favorites, photos and photo sizes stay unchanged.

## Expiration contract

Expire at **2026-09-25 00:00:00 Asia/Tokyo**, exactly after the entire substitute-closure date. The ISO timestamp includes +09:00; overseas browser time zones use the same instant. Initially hidden markup avoids stale-banner flash after expiration. A bounded timeout removes the notice in an already open page; pageshow and visibilitychange cover a suspended/restored tab. No external scheduler, daily agent invocation or paid service is needed for this in-page behavior. Relies on the visitor device clock.

## QA inventory

- Notice date/weekday wording, readable contrast, geometry on desktop, 390px, 320px, tablet and short landscape.
- No overlap with headline, logo or CM button; CM opens and closes; no horizontal overflow.
- September 24 remains visible; 99ms before expiry remains visible; exact JST midnight disappears; expired reload stays absent; Tokyo and Los Angeles zones agree; suspended page catches up.
- Same deterministic finger interaction before/after: increased density and visible pixels, preserved directional motion, fade and full ambient regression.
- Chrome and WebKit layouts; native Brave/Safari visual check when available. Mobile emulation is not physical-device verification.
- Publication gate: source contract, reference baseline, steam regressions, live Lighthouse categories, actual deployed bytes and browser view.

## Local verification receipts

- `output/september-steam/report.json`: Chromium desktop, WebKit 390px touch and clean-profile Brave desktop all pass. Twelve ambient roots move; bowl pixels stay stable. All four approved ambient/pressure comparisons remain pixel-exact.
- Same deterministic initial fingertip injection compared with the prior approved report: density gain 1.3120–1.3129 across the four roots. Visible hold pixels increase (Chrome: 58→60, 59→65, 62→64, 61→63). Directional release and full disposal still pass.
- Local 2s frame samples, unthrottled: Chrome p95 16.7ms, Brave 16.8ms; no frames above 50ms in these samples. This is local lab evidence, not field Core Web Vitals or a physical-phone measurement.
- `tests/holiday-notice-qa.mjs`: Chromium and WebKit pass five viewports (1440×900, 390×844, 320×568, 768×1024, 844×390), CM open/close, Tokyo/Los Angeles exact expiry, expired reload and restored-page expiry.
- First short-landscape test exposed a headline overlap (notice top 160.8px vs headline bottom 186.6px). Only the temporary notice was compacted for short landscape; final notice top 209.1px, no overlap. The regression is retained in CI.
- Lighthouse 13.4.1 live localhost audit: Accessibility 100, Best Practices 100, SEO 100; zero failed scored audits. Performance/field CWV are not represented by these scores.
- Native Brave local preview inspected: notice readable, normal steam visibly moves between captures, pointer input exercised. Browser settings were not changed.
- Public verification follows deployment; do not treat this receipt as evidence of publication.

## CI probe isolation repair (no production changes)

Run 34292961840 caught a WebKit-430 approved-image mismatch on the first root. The deterministic probe manually set 480px output, but native observer/hover callbacks could call the production sizing path and reset the clock after that reset. Its captured ROI changed from 18,250 to 39,876 pixels within the miso case (other tap cases also changed dimensions). These were not equivalent comparison conditions.

The pressure probe now owns presentation dimensions as well as its already-manual clock/visibility; native observers are disconnected only in the injected deterministic probe. Main normal-time lifecycle tests remain unchanged. Both images must have identical width, height and simulation time before pixel comparison; equality thresholds are not relaxed. Production effects.js, photos, styles and notice remain exactly those from ebec291.

Local WebKit-430 passes after this repair. An independent negative-control run intentionally changed ambient injection from 0.019 to 0.03 in the test-only approved source: all four roots were still detected as mismatches, at exactly 480×320 and simulation time 1.433333333333334. Evidence: output/september-pressure-negative.json. No mutated source is deployed.

Run 34293588331 attempt 3 passed the WebKit-390 steam tests (the remaining profiles had already passed). Notice QA then observed the CM dialog still open immediately after Escape dispatch. The native cancellation task is asynchronous; the test now waits for the actual open/closed selector states before asserting their counts. A dialog that never closes still fails. This changes only QA synchronization, not the website or criteria. Earlier retries included a first-root pixel mismatch and a browser-process closure; those intermittent CI issues are not claimed to be fully resolved.
