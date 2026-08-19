(()=>{
  if(matchMedia('(max-width:700px)').matches){
    ['steam-production.js','steam-production-butter.js','steam-production-tsubasa-a.js'].forEach(src=>{
      const script=document.createElement('script');
      script.src=`${src}?v=steam-fluid-only-20260819`;
      document.body.appendChild(script);
    });
    const showcase=document.createElement('script');
    showcase.src='fluid-showcase.js?v=mobile-fluid-showcase-1';
    document.body.appendChild(showcase);
    return;
  }
  const script=document.createElement('script');
  script.src='effects.js?v=desktop-unchanged-20260819';
  document.body.appendChild(script);
})();
