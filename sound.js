/* Original procedural soundscape: simmering soup, soft steam and a ceramic bowl. */
(() => {
  'use strict';
  const button = document.querySelector('#sound-toggle');
  const label = button.querySelector('span');
  const Audio = window.AudioContext || window.webkitAudioContext;
  let ctx, master, brush, brushFilter, noise, enabled = false, busy = false;
  let lastDrop = -10, lastBrush = -10, bowlTimer;
  function display(on) {
    enabled = on;
    button.setAttribute('aria-pressed', String(on));
    button.setAttribute('aria-label', on ? '音をオフにする' : '音をオンにする');
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
    for (let bubble = 0; bubble < 115; bubble++) {
      const start = Math.floor(Math.random() * waterBuffer.length);
      const duration = .12 + Math.random() * .22;
      const count = Math.floor(duration * ctx.sampleRate);
      const frequency = 180 + Math.random() * 520;
      const volume = .020 + Math.random() * .024;
      const position = .25 + Math.random() * .5;
      let phase = 0;
      for (let i = 0; i < count; i++) {
        const t = i / ctx.sampleRate;
        const envelope = (1 - Math.exp(-t * 350)) * Math.exp(-t * 24)
          * Math.min(1, (duration - t) / .025);
        phase += 2 * Math.PI * frequency * (1 + .7 * t / duration) / ctx.sampleRate;
        const value = Math.sin(phase) * envelope * volume;
        const at = (start + i) % waterBuffer.length;
        waterLeft[at] += value * Math.sqrt(1 - position);
        waterRight[at] += value * Math.sqrt(position);
      }
    }
    const water = ctx.createBufferSource(), waterLevel = ctx.createGain();
    water.buffer = waterBuffer; water.loop = true; waterLevel.gain.value = .65;
    water.connect(waterLevel); waterLevel.connect(master); water.start();
    const ink = bed('lowpass', 420, 0);
    brush = ink.level; brushFilter = ink.filter; brushFilter.Q.value = .35;
    ctx.addEventListener('statechange', () => {
      if (ctx.state !== 'running' && enabled) silence();
    });
  }
  function silence() {
    display(false);
    clearInterval(bowlTimer);
    if (!ctx) return;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(0, ctx.currentTime);
    brush.gain.cancelScheduledValues(ctx.currentTime);
    brush.gain.setValueAtTime(0, ctx.currentTime);
    void ctx.suspend().catch(() => {});
  }
  function bowl() {
    if (!enabled || document.hidden || ctx.state !== 'running') return;
    const now = ctx.currentTime;
    if (now - lastDrop < 8) return;
    lastDrop = now;
    // Restrained ceramic resonance with a short wooden contact note.
    [310, 840, 1370].forEach((hz, i) => {
      const tone = ctx.createOscillator(), gain = ctx.createGain();
      tone.frequency.value = hz;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime([.04, .015, .006][i], now + .003);
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
      bowl();
      clearInterval(bowlTimer);
      bowlTimer = setInterval(bowl, 24000);
    } catch (_) {
      silence();
      label.textContent = '再試行';
      button.setAttribute('aria-label', '音をオンにする（再試行）');
    } finally { busy = false; }
  });
  let lastPoint;
  document.addEventListener('pointermove', e => {
    if (!enabled || document.hidden || ctx.state !== 'running') return;
    const section = e.target instanceof Element && e.target.closest('.signature');
    if (!section || e.target.closest('button,a,dialog')) { lastPoint = null; return; }
    const now = ctx.currentTime;
    const previous = lastPoint;
    lastPoint = {x:e.clientX, y:e.clientY, time:now};
    if (!previous || now - lastBrush < .04) return;
    const distance = Math.hypot(e.clientX - previous.x, e.clientY - previous.y);
    if (distance < 1) return;
    lastBrush = now;
    const speed = Math.min(1, distance / Math.max(.016, now - previous.time) / 1200);
    brushFilter.frequency.setTargetAtTime(380 + speed * 350, now, .12);
    brush.gain.cancelScheduledValues(now);
    brush.gain.setTargetAtTime(.015 + speed * .04, now, .10);
    brush.gain.setTargetAtTime(0, now + .09, .22);
  }, {passive:true});
  document.addEventListener('pointerdown', e => {
    if (enabled && e.target instanceof Element && e.target.closest('.signature') &&
        !e.target.closest('button,a,dialog')) bowl();
  }, {passive:true});
  // Let spoken/music video audio take precedence. Re-enable ambience explicitly afterwards.
  document.addEventListener('play', e => {
    if (e.target instanceof HTMLMediaElement && !e.target.muted) silence();
  }, true);
  document.addEventListener('visibilitychange', () => { if (document.hidden) silence(); });
  addEventListener('pagehide', silence);
})();
