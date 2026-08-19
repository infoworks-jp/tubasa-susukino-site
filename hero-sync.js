(()=>{
  const stage=document.getElementById('fluidTextStage'),copy=document.querySelector('.hero-copy'),logo=stage?.querySelector('.hero-logo'),background=stage?.querySelector('.hero-bg');
  if(!stage||!copy)return;
  const mobile=matchMedia('(max-width:700px)').matches;
  let tx=0,ty=0,x=0,y=0,energy=0;
  const set=(clientX,clientY)=>{const rect=stage.getBoundingClientRect(),nx=(clientX-rect.left)/rect.width-.5,ny=(clientY-rect.top)/rect.height-.5,gain=mobile?18:28;tx=nx*gain;ty=ny*gain*.68;energy=1};
  const pointer=event=>set(event.clientX,event.clientY);
  stage.addEventListener('pointerdown',pointer,{passive:true});
  stage.addEventListener('pointermove',pointer,{passive:true});
  stage.addEventListener('pointerleave',()=>{tx=0;ty=0},{passive:true});
  stage.addEventListener('touchstart',event=>{const touch=event.touches?.[0];if(touch)set(touch.clientX,touch.clientY)},{passive:true});
  stage.addEventListener('touchmove',event=>{const touch=event.touches?.[0];if(touch)set(touch.clientX,touch.clientY)},{passive:true});

  const syncLogo=()=>{
    if(!mobile||!logo||!background||!background.naturalWidth||!background.naturalHeight)return;
    const width=stage.clientWidth,height=stage.clientHeight;
    if(!width||!height)return;
    const scale=Math.max(width/background.naturalWidth,height/background.naturalHeight);
    const renderedHeight=background.naturalHeight*scale;
    const imageTop=(height-renderedHeight)/2;
    const kirinBillboardTop=imageTop+812*scale;
    const gap=Math.max(8,height*.011);
    const logoHeight=logo.getBoundingClientRect().height;
    const safeTop=Math.max(8,parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--safe-top'))||8);
    const top=Math.max(safeTop,Math.min(height*.30,kirinBillboardTop-logoHeight-gap));
    stage.style.setProperty('--hero-logo-top',`${top.toFixed(2)}px`);
    stage.style.setProperty('--hero-kirin-top',`${kirinBillboardTop.toFixed(2)}px`);
  };
  if(mobile){
    background?.addEventListener('load',syncLogo,{once:true});
    logo?.addEventListener('load',syncLogo,{once:true});
    new ResizeObserver(syncLogo).observe(stage);
    addEventListener('resize',syncLogo,{passive:true});
    visualViewport?.addEventListener('resize',syncLogo,{passive:true});
    requestAnimationFrame(syncLogo);
  }
  function tick(){x+=(tx-x)*.14;y+=(ty-y)*.14;energy*=.975;copy.style.setProperty('--fx-x',x.toFixed(2));copy.style.setProperty('--fx-y',y.toFixed(2));copy.style.setProperty('--fx-energy',Math.max(.16,energy).toFixed(3));requestAnimationFrame(tick)}
  requestAnimationFrame(tick);
})();
