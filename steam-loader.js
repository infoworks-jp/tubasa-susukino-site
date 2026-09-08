(()=>{
  // One shared solver drives every bowl on desktop and mobile.  Keeping a
  // single animation loop avoids loading three near-identical GPU engines on
  // phones and lets off-screen/visibility throttling work consistently.
  const script=document.createElement('script');
  script.src='effects.js?v=natural-mobile-steam-20260908';
  document.body.appendChild(script);
})();
