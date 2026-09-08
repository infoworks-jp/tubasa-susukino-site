(() => {
  const shell = document.querySelector('[data-night-walk]');
  const button = shell?.querySelector('[data-walk-start]');
  const status = shell?.querySelector('[data-walk-status]');
  const mapNode = shell?.querySelector('#nightWalkMap');
  if (!shell || !button || !status || !mapNode) return;

  const route = [
    [141.35336, 43.05563],
    [141.35363, 43.05555],
    [141.35391, 43.05546],
    [141.354277879, 43.055365148368],
  ];
  const labels = ['すすきの交差点', '南4条通を東へ', '新ラーメン横丁', '味一番つばさ'];
  let map;
  let running = false;

  const loadStyle = () => new Promise((resolve, reject) => {
    if (document.querySelector('link[data-maplibre]')) return resolve();
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'vendor/maplibre-gl.css?v=6.8.0';
    link.dataset.maplibre = '';
    link.onload = resolve;
    link.onerror = reject;
    document.head.append(link);
  });

  const setupMap = async () => {
    if (map) return map;
    await loadStyle();
    const { Map, Marker, NavigationControl } = await import('./vendor/maplibre-gl.mjs?v=6.8.0');
    map = new Map({
      container: mapNode,
      style: 'https://tiles.openfreemap.org/styles/fiord',
      center: route[0],
      zoom: 18.55,
      pitch: 62,
      bearing: 94,
      attributionControl: true,
      cooperativeGestures: true,
      maxBounds: [[141.349, 43.052], [141.359, 43.059]],
    });
    map.setMissingStyleImageResolver((id) => {
      if (!map.hasImage(id)) map.addImage(id, {
        width: 2, height: 2, data: new Uint8Array(16),
      });
    });
    map.addControl(new NavigationControl({ showCompass: true }), 'bottom-right');
    const marker = document.createElement('div');
    marker.className = 'walk-destination';
    marker.innerHTML = '<span>翼</span>';
    new Marker({ element: marker, anchor: 'bottom' }).setLngLat(route.at(-1)).addTo(map);
    await new Promise((resolve, reject) => {
      map.once('load', resolve);
      map.once('error', reject);
    });
    const style = map.getStyle();
    const building = style.layers.find((layer) => layer['source-layer'] === 'building' && layer.source);
    if (building && !map.getLayer('tsubasa-buildings')) {
      const firstSymbol = style.layers.find((layer) => layer.type === 'symbol')?.id;
      map.addLayer({
        id: 'tsubasa-buildings', type: 'fill-extrusion', source: building.source,
        'source-layer': 'building', minzoom: 15,
        paint: {
          'fill-extrusion-color': ['interpolate', ['linear'], ['get', 'render_height'], 0, '#111318', 60, '#2b2025'],
          'fill-extrusion-height': ['coalesce', ['get', 'render_height'], ['get', 'height'], 12],
          'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
          'fill-extrusion-opacity': .82,
        },
      }, firstSymbol);
    }
    map.addSource('tsubasa-route', {
      type: 'geojson',
      data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: route } },
    });
    map.addLayer({
      id: 'tsubasa-route-glow', type: 'line', source: 'tsubasa-route',
      paint: { 'line-color': '#ff155e', 'line-width': 8, 'line-opacity': .18, 'line-blur': 7 },
    });
    map.addLayer({
      id: 'tsubasa-route', type: 'line', source: 'tsubasa-route',
      paint: { 'line-color': '#f0c167', 'line-width': 3, 'line-opacity': .95, 'line-dasharray': [1, 1.6] },
    });
    return map;
  };

  const lerp = (a, b, t) => a + (b - a) * t;
  const pointAt = (t) => {
    const scaled = Math.min(.9999, t) * (route.length - 1);
    const i = Math.floor(scaled), p = scaled - i;
    return [lerp(route[i][0], route[i + 1][0], p), lerp(route[i][1], route[i + 1][1], p)];
  };

  const play = async () => {
    if (running) return;
    running = true;
    button.disabled = true;
    button.textContent = 'LOADING…';
    shell.classList.add('is-active');
    try {
      const instance = await setupMap();
      instance.resize();
      button.textContent = '歩いています…';
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const duration = reduced ? 1 : 9000;
      const started = performance.now();
      const tick = (now) => {
        const raw = Math.min(1, (now - started) / duration);
        const t = raw < .5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
        const center = pointAt(t);
        instance.jumpTo({ center, zoom: 18.55 + Math.sin(t * Math.PI) * .26, pitch: 62, bearing: 94 + Math.sin(t * Math.PI * 2) * 4 });
        const step = Math.min(labels.length - 1, Math.floor(raw * labels.length));
          status.textContent = labels[step];
          shell.style.setProperty('--walk-progress', `${Math.round(raw * 100)}%`);
          window.__tsubasaNightWalk = { engine: 'MapLibre GL JS', running: raw < 1, progress: Math.round(raw * 100), step: labels[step] };
        if (raw < 1) requestAnimationFrame(tick);
        else {
          running = false;
          button.disabled = false;
          button.textContent = 'もう一度歩く';
          shell.classList.add('has-arrived');
          status.textContent = '味一番つばさに到着';
        }
      };
      requestAnimationFrame(tick);
    } catch (error) {
      running = false;
      button.disabled = false;
      button.textContent = 'もう一度試す';
      status.textContent = '地図を読み込めませんでした';
      shell.classList.remove('is-active');
      console.error('[Tsubasa Night Walk]', error);
    }
  };

  button.addEventListener('click', play);

  /* Warm the map only when the section is near the viewport. The visible
     photograph remains the fallback if tiles, WebGL, or the network fail. */
  new IntersectionObserver((entries, observer) => {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();
    setupMap().then(() => shell.classList.add('map-ready')).catch(() => {});
  }, { rootMargin: '320px 0px' }).observe(shell);
})();
