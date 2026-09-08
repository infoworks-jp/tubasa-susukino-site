(()=>{
  const target=document.querySelector('#signature');
  if(!target)return;
  const load=()=>{
    if(document.querySelector('script[data-steam-engine]'))return;
    const style=document.createElement('link');
    style.rel='stylesheet';
    style.href='steam-safari-baseline.css?v=20260908-1';
    document.head.appendChild(style);
    const script=document.createElement('script');
    script.src='steam-canvas2d.js?v=safari-baseline-20260908-1';
    script.dataset.steamEngine='';
    document.body.appendChild(script);
  };
  if(!('IntersectionObserver'in window)){load();return;}
  const observer=new IntersectionObserver(entries=>{
    if(!entries[0].isIntersecting)return;
    observer.disconnect();
    load();
  },{rootMargin:'320px 0px'});
  observer.observe(target);
})();
