# Finger steam — approved ambient preserved

## Scope and restore point

- User request: keep the current appearance and add newly generated vapor that follows the fingertip.
- Approved base: `4e6b68e7e865af061fa0ea27893aeb7d532d5ae6`.
- The exact approved `effects.js` is retained in `tests/fixtures/steam-approved-4e6b68e.js` (SHA-256 `f76d1c8c883d4c91722855c8cd457b93bccd442fbdc5eb7d4705095c322fe69b`).
- Only the four upper roots receive the new layer. Eight favorites, images, photo sizes, masks, layout, typography, shop/intersection effects and map are unchanged.
- CSS change is only `touch-action: pan-y pinch-zoom` on signature sections. Horizontal touch movement stays interactive; native vertical scrolling and pinch zoom remain available.

## Implementation

The approved idle DISPLAY shader is unchanged byte-for-byte. A second shader variant adds the temporary density only while it exists. The existing photographic pressure/hover solver still runs as before.

New vapor has its own velocity, dye, pressure, divergence, curl and framebuffer ping-pong fields, using the same Pavel-derived GPU solver and the same shared WebGL context. It is not a particle, CSS, video or noise-only smoke replacement. Limited MacCormack density advection preserves thin strands. Screen compositing adds light without darkening or distorting the food.

- Allocate the new 384-pixel-wide field only after a press, not on idle or hover.
- Interpolate between pointer positions; retain the down point even if an entire down/move/up stroke arrives between animation frames.
- Inject narrow, separated jets at the actual photo-space fingertip position; carry the movement direction into velocity.
- Stop injection on release; fade and free the additional GPU textures after five simulation seconds without input.
- Clear the temporary field when offscreen, hidden or reduced-motion changes. Preserve the original-photo fallback when WebGL is unavailable/lost.
- Additional field storage at 384×256 is approximately 6.75 MiB (nine RGBA16F textures), only while active. No additional asset download, external service, paid API or WebGL context.

## Visual iteration evidence

| Trial | Observation | Scoped correction |
|---|---|---|
| 192-wide field, radius .00013, gradient-edge shading | Flat grey patches and outlined loops | Reject; do not publish |
| 320-wide field, radius .000028, screen composite | Softer, but thin trails diffused into smears | Retain screen composite; improve density transport |
| 384-wide field, radius .000022, bounded MacCormack correction | Fine, folding wisps persist while moving and thin after release | Candidate retained |

These changes apply only to new fingertip vapor. The ambient emission, displacement, root coordinates and old pressure strengths were not adjusted.

## Local verification (2026-09-09 JST)

All six cases passed: Chrome desktop, Chrome 390 mobile emulation, Brave desktop, WebKit 375/390/430 mobile emulation.

Checks include all 12 roots / 11 photographs, ambient pixel motion, zero bowl displacement outside the original masks, alignment, overflow, offscreen pause/resume, reduced motion and no-GPU fallback.

The pressure test isolates the old pressure layer; the finger test separately exercises the complete production shader/solver. Deterministic probes reduce only test presentation canvases to 480 px, retaining full simulation resolution. Normal-time main QA and visual checks use production presentation resolution.

- All four roots: identical ambient control hashes and identical pressure pixel metrics versus the frozen approved source, in every browser case.
- Finger tests: idle layer absent; density originates at input position; visible additive pixels; no darkened pixels; held injection; left/right movement; directional momentum after release; rapid stroke path; rapid touch tap; fade; resource disposal.
- Chrome native touch events: horizontal movement remains held, while vertical movement scrolls and cancels input without leaving it stuck. This catches a failure that mouse-only mobile emulation would miss.
- Fade assertion measures peak density (at least 65% lower after 1.4 seconds) as well as decreasing total density. Integrated density alone is not apparent opacity: unfolding wisps change their sampled area.
- Native Safari UI: approved ambient motion viewed, actual pointer down/move/up delivered, new finger field observed, no engine errors. Normal-speed WebKit phone-size views for butter and both Tsubasa bowls inspected before/after release.
- Screenshots and full reports: local `output/finger-steam/` and `output/finger-steam-final/` (not committed).
- Automated Lighthouse 13.4.1 accessibility / best practices / SEO: 100 / 100 / 100, no scored failures. This is not a manual accessibility certification or field-CWV result.

## Performance conditions

Local Apple M4 / ANGLE Metal, Chrome 152, desktop 1440×1000, warm local origin, no CPU/network throttling. Three isolated 2-second press/drag runs: rAF p95 16.8 / 16.7 / 16.7 ms; zero gaps over 50 ms. Animation itself remains capped at 30 fps for signatures and 24 fps for cards.

An earlier measurement taken concurrently with accelerated WebKit GPU regression probes had p95 249.9 ms. It was not used as a single-page result; after those competing probes finished, the three isolated measurements above were repeated. Do not infer physical-phone performance or field Core Web Vitals from these lab values.

## Publication gate

This is the pre-publication record. The existing release workflow must pass its source contract, unmodified Pavel reference baseline and all five CI browser cases before deployment. After deployment, compare public HTML/JS/CSS bytes with this checkout and re-run browser checks on the public URL. A commit or green local tests alone are not a publication claim.

Physical iPhone/Android hardware is not attached; phone verification here is browser/device emulation, explicitly not real-device sign-off.

## CI synchronization correction

The first release attempt (`34259083820`) was correctly blocked: Chrome desktop's reduced-motion sample was empty. Its other assertions, including all new finger checks and approved-source comparisons, passed. The software-rendered runner had approximately 400 ms rAF p95.

The old resume test compared against a draw count captured **before leaving** the section. A late departing draw could satisfy it before the section became visible again, after which `startSample` captured an empty visible-surface list. The test now requires the target to be visible, ready, and newly drawn **after the offscreen stopped count**, and confirms the media query/visible target before sampling. All existing zero-simulation, at-most-one-static-paint and two-quiet-sample assertions remain. No production shader, parameters, images or CSS were changed for this correction.
