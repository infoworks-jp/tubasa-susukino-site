// The logo uses the same photograph on all viewports. Only the crossing copy
// follows the hand; there is no perpetual idle rendering loop.
(()=>{
  const stage=document.getElementById('fluidTextStage');
  const copy=document.querySelector('#top .hero-copy');
  const motion=matchMedia('(prefers-reduced-motion:reduce)');
  if(!stage||!copy)return;
  let tx=0,ty=0,x=0,y=0,energy=0,raf=0;
  function tick(){
    raf=0; x+=(tx-x)*.14; y+=(ty-y)*.14; energy*=.94;
    copy.style.setProperty('--fx-x',x.toFixed(2));
    copy.style.setProperty('--fx-y',y.toFixed(2));
    copy.style.setProperty('--fx-energy',Math.max(.16,energy).toFixed(3));
    if(Math.abs(tx-x)+Math.abs(ty-y)>.02 || energy>.17)raf=requestAnimationFrame(tick);
  }
  const queue=()=>{if(!raf&&!document.hidden&&!motion.matches)raf=requestAnimationFrame(tick);};
  const pointer=event=>{
    if(motion.matches)return;
    const r=stage.getBoundingClientRect(), gain=innerWidth<=700?18:28;
    tx=((event.clientX-r.left)/r.width-.5)*gain;
    ty=((event.clientY-r.top)/r.height-.5)*gain*.68;energy=1;queue();
  };
  const release=()=>{tx=0;ty=0;queue();};
  stage.addEventListener('pointerdown',pointer,{passive:true});
  stage.addEventListener('pointermove',pointer,{passive:true});
  stage.addEventListener('pointerleave',release,{passive:true});
  stage.addEventListener('pointerup',release,{passive:true});
  stage.addEventListener('pointercancel',release,{passive:true});
})();
