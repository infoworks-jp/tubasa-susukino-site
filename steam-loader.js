(() => {
  const root = document.documentElement;
  const phone = matchMedia("(pointer:coarse)").matches &&
    Math.min(innerWidth, innerHeight) <= 700;
  root.classList.toggle("phone-steam-preview", phone);
  root.dataset.phoneSteamImpact = "dynamic";
  const script = document.createElement("script");
  script.src = "effects.js?v=dynamic-steam-20260909-1";
  document.body.appendChild(script);
})();
