(()=>{
  const target=document.querySelector('#signature');
  if(!target)return;
  const load=()=>{
    if(document.querySelector('script[data-steam-engine]'))return;
    const script=document.createElement('script');
    script.src='effects.js?v=experience-20260908-1';
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
