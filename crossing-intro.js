/* White paper -> fine apertures in the paper -> the actual photograph.
   No new GPU context, particle physics, image copies, or endless render loop. */
(() => {
  const root = document.documentElement, hero = document.querySelector('#top');
  const photo = hero?.querySelector('.hero-bg');
  const motion = matchMedia('(prefers-reduced-motion:reduce)');
  const state = { phase:'pending', progress:0, dots:0, total:0, frames:0, raf:0, duration:2850 };
  window.__tsubasaCrossing = state;
  let canvas, timer, started = 0, lastFrame = 0, points = [], cursor = 0;
  const smooth = x => { x=Math.max(0,Math.min(1,x)); return x*x*(3-2*x); };
  function finish(reason) {
    if (state.phase === 'complete') return;
    cancelAnimationFrame(state.raf); clearTimeout(timer);
    state.raf=0; state.progress=1; state.phase='complete'; state.reason=reason;
    root.classList.remove('crossing-pending','crossing-ink','crossing-photo');
    canvas?.remove(); canvas=null; points=[];
    removeEventListener('scroll',onScroll); removeEventListener('resize',onResize);
    removeEventListener('keydown',onKey); removeEventListener('pagehide',onPageHide);
    document.removeEventListener('visibilitychange',onHidden); motion.removeEventListener('change',onMotion);
    hero?.removeEventListener('pointerdown',onPress);
    document.dispatchEvent(new Event('tsubasa:crossing-ready'));
  }
  const onScroll=()=>{ if(scrollY>40)finish('scroll'); };
  const onResize=()=>finish('resize');
  const onKey=e=>{if(e.key==='Escape')finish('escape');};
  const onPress=()=>finish('interaction');
  const onHidden=()=>{if(document.hidden)finish('hidden');};
  const onMotion=()=>{if(motion.matches)finish('reduced-motion');};
  const onPageHide=()=>finish('pagehide');
  if(!hero || !photo || motion.matches || document.hidden || scrollY>40 || (location.hash && location.hash!=='#top') || !root.classList.contains('crossing-pending')) {
    finish('immediate'); return;
  }
  addEventListener('scroll',onScroll,{passive:true}); addEventListener('resize',onResize,{passive:true});
  addEventListener('keydown',onKey); addEventListener('pagehide',onPageHide);
  document.addEventListener('visibilitychange',onHidden); motion.addEventListener('change',onMotion);
  hero.addEventListener('pointerdown',onPress,{passive:true});
  timer=setTimeout(()=>finish('deadline'),4300);
  function begin() {
    if(state.phase==='complete')return;
    if(!photo.naturalWidth || scrollY>40){finish('photo-unavailable');return;}
    try {
      const setupStart=performance.now();
      const width=hero.clientWidth, height=hero.clientHeight, scale=Math.min(1,1050/width);
      canvas=document.createElement('canvas'); canvas.className='crossing-dots'; canvas.setAttribute('aria-hidden','true');
      canvas.width=Math.round(width*scale); canvas.height=Math.round(height*scale);
      const ctx=canvas.getContext('2d'); if(!ctx){finish('canvas-unavailable');return;}
      ctx.fillStyle='#faf9f6'; ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.globalCompositeOperation='destination-out';
      // Spatially jittered dots: never a square pixel grid or a confetti burst.
      const step=Math.max(2.2,Math.sqrt(canvas.width*canvas.height/60000));
      const buckets=Array.from({length:96},()=>[]);
      let seed=0x51ba5a;
      const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
      for(let y=step/2;y<canvas.height;y+=step)for(let x=step/2;x<canvas.width;x+=step){
        const distance=Math.hypot((x/canvas.width-.53)*.65,(y/canvas.height-.58)*.85);
        const dot={x:x+(rand()-.5)*step*.72,y:y+(rand()-.5)*step*.72,r:step*(.25+rand()*.18)};
        buckets[Math.min(95,Math.floor((rand()*.75+distance*.25)*96))].push(dot);
      }
      // Linear-time buckets retain the organic arrival pattern without sorting
      // sixty thousand objects on a phone's main thread.
      points=buckets.flat(); state.total=points.length; state.setupMs=performance.now()-setupStart;
      hero.append(canvas); root.classList.add('crossing-ink'); root.classList.remove('crossing-pending');
      state.phase='ink'; started=performance.now();
      function frame(now) {
        if(state.phase==='complete')return;
        const p=Math.min(1,(now-started)/state.duration); state.progress=p;
        if(now-lastFrame>30 || p===1){
          lastFrame=now; state.frames++;
          const amount=smooth((p-.035)/.7);
          const end=Math.min(points.length,Math.floor(amount*points.length));
          ctx.beginPath();
          for(;cursor<end;cursor++){
            const dot=points[cursor]; ctx.moveTo(dot.x+dot.r,dot.y); ctx.arc(dot.x,dot.y,dot.r,0,Math.PI*2);
          }
          ctx.fill(); state.dots=cursor;
          canvas.style.opacity=String(1-smooth((p-.56)/.44));
          if(p>.59 && state.phase==='ink'){
            state.phase='photo'; root.classList.add('crossing-photo'); root.classList.remove('crossing-ink');
          }
        }
        if(p===1)finish('revealed'); else state.raf=requestAnimationFrame(frame);
      }
      state.raf=requestAnimationFrame(frame);
    } catch { finish('fallback'); }
  }
  if(photo.complete)begin();
  else { photo.addEventListener('load',begin,{once:true}); photo.addEventListener('error',()=>finish('image-error'),{once:true}); }
})();
