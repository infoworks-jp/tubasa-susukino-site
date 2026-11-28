(() => {
  const root = document.documentElement;
  const phone = matchMedia("(pointer:coarse)").matches &&
    Math.min(innerWidth, innerHeight) <= 700;
  root.classList.toggle("phone-steam-preview", phone);
  root.dataset.phoneSteamImpact = "dynamic";
  let loaded=false,deadline;
  const load=()=>{
    if(loaded)return;
    loaded=true;clearTimeout(deadline);
    document.removeEventListener('tsubasa:crossing-ready',load);
    const script=document.createElement('script');
    script.src='effects.js?v=bold-steam-20260920-2';
    document.body.appendChild(script);
  };
  // The bowls are below the entrance. Keep their identical solver from
  // competing with the stipple reveal; scrolling/deep links still start it.
  if(root.classList.contains('crossing-pending') ||
     (window.__tsubasaCrossing && window.__tsubasaCrossing.phase!=='complete')){
    document.addEventListener('tsubasa:crossing-ready',load,{once:true});
    deadline=setTimeout(load,4700);
  }else load();
})();
