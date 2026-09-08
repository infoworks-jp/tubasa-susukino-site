(() => {
  const target = document.querySelector('#top');
  if (!target) return;
  const load = () => import('./vendor/fluid-text.bundle.js?v=surface-fluid-20260908');
  if (!('IntersectionObserver' in window)) { load(); return; }
  const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();
    load();
  }, { threshold: .05 });
  observer.observe(target);
})();
