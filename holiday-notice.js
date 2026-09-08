// Expiry is a Japanese instant, independent of the visitor's time zone.
// Hidden in HTML: old cached pages never flash an expired announcement.
(() => {
  "use strict";
  const notice = document.getElementById("holiday-notice");
  if (!notice) return;
  const expires = Date.parse(notice.dataset.expires);
  let timer;
  function sync() {
    clearTimeout(timer);
    const remaining = expires - Date.now();
    if (!(remaining > 0)) {
      notice.remove();
      window.removeEventListener("pageshow", sync);
      document.removeEventListener("visibilitychange", sync);
      return;
    }
    notice.hidden = false;
    // Check at most once daily; stay below setTimeout's 32-bit limit.
    timer = setTimeout(sync, Math.min(remaining, 24 * 60 * 60 * 1000));
  }
  window.addEventListener("pageshow", sync);
  document.addEventListener("visibilitychange", sync);
  sync();
})();
