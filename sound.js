/* Original procedural soundscape: rolling soup, restrained steam and scene-specific ambience. */
(() => {
  'use strict';
  const button = document.querySelector('#sound-toggle');
  const label = button.querySelector('span');
  const Audio = window.AudioContext || window.webkitAudioContext;
  let ctx, master, brush, brushFilter, noise, enabled = false, busy = false;
  let lastDrop = -10, lastBrush = -10, bowlTimer;
  let soupLevel, streetLevel, roomLevel, currentScene = null, sceneFrame = 0;
  function display(on) {
    enabled = on;
    button.setAttribute('aria-pressed', String(on));
    button.setAttribute('aria-label', on ? 'SOUND ON — 音をオフにする' : 'SOUND OFF — 音をオンにする');
    label.textContent = on ? 'SOUND ON' : 'SOUND OFF';
  }
  if (!Audio) { button.hidden = true; return; }
  button.hidden = false;
  function setup() {
    ctx = new Audio();
    master = ctx.createGain(); master.gain.value = 0;
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -18; limiter.knee.value = 12;
    limiter.ratio.value = 5; limiter.attack.value = .005; limiter.release.value = .25;
    master.connect(limiter); limiter.connect(ctx.destination);
    noise = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const samples = noise.getChannelData(0);
    let brown = 0;
    for (let i = 0; i < samples.length; i++) {
      brown = (brown + (Math.random() * 2 - 1) * .025) / 1.025;
      samples[i] = brown * 3.5;
    }
    function bed(filterType, frequency, gain) {
      const source = ctx.createBufferSource(); source.buffer = noise; source.loop = true;
      const filter = ctx.createBiquadFilter(); filter.type = filterType; filter.frequency.value = frequency;
      const level = ctx.createGain(); level.gain.value = gain;
      source.connect(filter); filter.connect(level); level.connect(master); source.start();
      return {level, filter};
    }
    // A seamless, quiet soup simmer made from small overlapping bubbles.
    const waterBuffer = ctx.createBuffer(2, ctx.sampleRate * 16, ctx.sampleRate);
    const waterLeft = waterBuffer.getChannelData(0), waterRight = waterBuffer.getChannelData(1);
    for (let bubble = 0; bubble < 380; bubble++) {
      const start = Math.floor(Math.random() * waterBuffer.length);
      const duration = .18 + Math.random() * .28;
      const count = Math.floor(duration * ctx.sampleRate);
      const frequency = 95 + Math.random() * 330;
      const volume = .028 + Math.random() * .040;
      const position = .25 + Math.random() * .5;
      let phase = 0, wet = 0;
      for (let i = 0; i < count; i++) {
        const t = i / ctx.sampleRate;
        const envelope = (1 - Math.exp(-t * 350)) * Math.exp(-t * 15)
          * Math.min(1, (duration - t) / .025);
        phase += 2 * Math.PI * frequency * (1 + .45 * t / duration) / ctx.sampleRate;
        wet = wet * .80 + (Math.random() * 2 - 1) * .20;
        const value = (Math.sin(phase) * .68 + Math.sin(phase * 1.47) * .20 + wet * .55) * envelope * volume;
        const at = (start + i) % waterBuffer.length;
        waterLeft[at] += value * Math.sqrt(1 - position);
        waterRight[at] += value * Math.sqrt(position);
      }
    }
    const water = ctx.createBufferSource(), waterLevel = ctx.createGain();
    water.buffer = waterBuffer; water.loop = true; waterLevel.gain.value = 0; soupLevel = waterLevel;
    water.connect(waterLevel); waterLevel.connect(master); water.start();
    // Distant traffic swells, only audible in the intersection/night-walk scenes.
    const traffic = ctx.createBufferSource(), roadFilter = ctx.createBiquadFilter();
    const passing = ctx.createGain(), motion = ctx.createOscillator(), depth = ctx.createGain();
    traffic.buffer = noise; traffic.loop = true;
    roadFilter.type = 'lowpass'; roadFilter.frequency.value = 650;
    passing.gain.value = .35; motion.frequency.value = .075; depth.gain.value = .22;
    streetLevel = ctx.createGain(); streetLevel.gain.value = 0;
    traffic.connect(roadFilter); roadFilter.connect(passing); passing.connect(streetLevel); streetLevel.connect(master);
    motion.connect(depth); depth.connect(passing.gain); traffic.start(); motion.start();
    roomLevel = bed('lowpass', 360, 0).level;
    const ink = bed('lowpass', 420, 0);
    brush = ink.level; brushFilter = ink.filter; brushFilter.Q.value = .35;
    ctx.addEventListener('statechange', () => {
      if (ctx.state !== 'running' && enabled) silence();
    });
  }
  function updateScene() {
    sceneFrame = 0;
    if (!enabled || !ctx || document.hidden) return;
    const center = innerHeight * .5;
    const section = [...document.querySelectorAll('main section')].find(el => {
      const r = el.getBoundingClientRect(); return r.top <= center && r.bottom > center;
    });
    const id = section?.id;
    const next = id === 'top' || id === 'night-walk' || id === 'access' ? 'street'
      : id === 'shop' || id === 'menu' ? 'room' : 'soup';
    if (next === currentScene) return;
    currentScene = next;
    button.dataset.soundScene = next;
    const now = ctx.currentTime;
    [[soupLevel, next === 'soup' ? .85 : next === 'room' ? .16 : 0],
     [streetLevel, next === 'street' ? .13 : 0],
     [roomLevel, next === 'room' ? .018 : 0]].forEach(([node, volume]) => {
      node.gain.cancelScheduledValues(now);
      node.gain.setTargetAtTime(volume, now, .45);
    });
    if (next === 'room') bowl();
  }
  function queueScene() {
    if (enabled && !sceneFrame) sceneFrame = requestAnimationFrame(updateScene);
  }
  addEventListener('scroll', queueScene, {passive:true});
  addEventListener('resize', queueScene, {passive:true});
  function silence() {
    display(false);
    clearInterval(bowlTimer);
    cancelAnimationFrame(sceneFrame); sceneFrame = 0; currentScene = null;
    if (!ctx) return;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(0, ctx.currentTime);
    brush.gain.cancelScheduledValues(ctx.currentTime);
    brush.gain.setValueAtTime(0, ctx.currentTime);
    void ctx.suspend().catch(() => {});
  }
  function bowl() {
    if (!enabled || document.hidden || ctx.state !== 'running' || currentScene === 'street') return;
    const now = ctx.currentTime;
    if (now - lastDrop < 6) return;
    lastDrop = now;
    // Restrained ceramic resonance with a short wooden contact note.
    [310, 840, 1370].forEach((hz, i) => {
      const tone = ctx.createOscillator(), gain = ctx.createGain();
      tone.frequency.value = hz;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime([.025, .011, .005][i], now + .003);
      gain.gain.exponentialRampToValueAtTime(.0001, now + [.10, .22, .16][i]);
      tone.connect(gain); gain.connect(master); tone.start(); tone.stop(now + .25);
      tone.onended = () => { tone.disconnect(); gain.disconnect(); };
    });
  }
  button.addEventListener('click', async () => {
    if (busy) return;
    if (enabled) { silence(); return; }
    busy = true;
    try {
      if (!ctx) setup();
      await ctx.resume();
      if (document.hidden || ctx.state !== 'running') { silence(); return; }
      display(true);
      master.gain.setTargetAtTime(.65, ctx.currentTime, .2);
      updateScene();
      clearInterval(bowlTimer);
      bowlTimer = setInterval(() => { if (currentScene === 'room') bowl(); }, 11000);
    } catch (_) {
      silence();
      label.textContent = '再試行';
      button.setAttribute('aria-label', '音をオンにする（再試行）');
    } finally { busy = false; }
  });
  let lastPoint;
  document.addEventListener('pointermove', e => {
    if (!enabled || document.hidden || ctx.state !== 'running') return;
    const section = e.target instanceof Element && e.target.closest('.signature, #shop');
    if (!section || e.target.closest('button,a,dialog')) { lastPoint = null; return; }
    const now = ctx.currentTime;
    const previous = lastPoint;
    lastPoint = {x:e.clientX, y:e.clientY, time:now};
    if (!previous || now - lastBrush < .04) return;
    const distance = Math.hypot(e.clientX - previous.x, e.clientY - previous.y);
    if (distance < 1) return;
    lastBrush = now;
    const speed = Math.min(1, distance / Math.max(.016, now - previous.time) / 1200);
    brushFilter.frequency.setTargetAtTime(240 + speed * 180, now, .12);
    brush.gain.cancelScheduledValues(now);
    brush.gain.setTargetAtTime(.002 + speed * .006, now, .16);
    brush.gain.setTargetAtTime(0, now + .09, .22);
  }, {passive:true});
  document.addEventListener('pointerdown', e => {
    if (enabled && e.target instanceof Element && e.target.closest('.signature, #shop') &&
        !e.target.closest('button,a,dialog')) bowl();
  }, {passive:true});
  // Let spoken/music video audio take precedence. Re-enable ambience explicitly afterwards.
  document.addEventListener('play', e => {
    if (e.target instanceof HTMLMediaElement && !e.target.muted) silence();
  }, true);
  document.addEventListener('visibilitychange', () => { if (document.hidden) silence(); });
  addEventListener('pagehide', silence);
})();
