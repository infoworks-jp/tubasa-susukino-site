(() => {
  const target = document.querySelector('#top');
  if (!target) return;
  let loaded = false;
  const load = () => {
    if(loaded) return;
    loaded = true;
    let started = false, deadline;
    const start = () => {
      if(started)return;
      started=true; clearTimeout(deadline);
      document.removeEventListener('tsubasa:crossing-ready',start);
      import('./vendor/fluid-text.bundle.js?v=crossing-20260920');
    };
    if(document.documentElement.classList.contains('crossing-pending') ||
       (window.__tsubasaCrossing && window.__tsubasaCrossing.phase !== 'complete')) {
      document.addEventListener('tsubasa:crossing-ready',start,{once:true});
      // If the optional entrance file is blocked, its watchdog reveals the
      // regular image and this fallback still enables the original interaction.
      deadline=setTimeout(start,4700);
    }
    else start();
  };
  if (!('IntersectionObserver' in window)) { load(); return; }
  const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();
    load();
  }, { threshold: .05 });
  observer.observe(target);
})();
