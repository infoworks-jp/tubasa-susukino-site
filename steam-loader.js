(()=>{
  // One shared solver drives every bowl on desktop and mobile.  Keeping a
  // single animation loop avoids loading three near-identical GPU engines on
  // phones and lets off-screen/visibility throttling work consistently.
  const script=document.createElement('script');
  script.src='effects.js?v=natural-steam-20260908';
  document.body.appendChild(script);
  if(matchMedia('(max-width:700px)').matches){
    const showcase=document.createElement('script');
    showcase.src='fluid-showcase.js?v=mobile-fluid-showcase-1';
    document.body.appendChild(showcase);
  }
})();
