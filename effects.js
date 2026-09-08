/* Tsubasa steam fluid. Solver architecture adapted from Pavel Dobryakov WebGL Fluid Simulation (MIT). */
(() => {
  const canvases = [
    ...document.querySelectorAll('.signature .fx-canvas[data-effect="steam"]'),
    ...document.querySelectorAll('.food-grid .favorites-steam[data-effect="steam"]'),
  ];
  if (!canvases.length) return;
  const fine = true,
    reduced = matchMedia("(prefers-reduced-motion:reduce)").matches,
    mobile = matchMedia("(max-width:700px)").matches,
    lowPower = (navigator.hardwareConcurrency || 4) <= 4 ||
      (navigator.deviceMemory || 4) <= 4;
  const VS = `#version 300 es
precision highp float;in vec2 a;out vec2 uv,l,r,t,b;uniform vec2 texel;void main(){uv=a*.5+.5;l=uv-vec2(texel.x,0);r=uv+vec2(texel.x,0);t=uv+vec2(0,texel.y);b=uv-vec2(0,texel.y);gl_Position=vec4(a,0,1);}`;
  const SPLAT = `#version 300 es
precision highp float;in vec2 uv;out vec4 o;uniform sampler2D u;uniform vec2 point;uniform vec3 value;uniform float radius,aspect;void main(){vec2 p=uv-point;p.x*=aspect;vec3 s=exp(-dot(p,p)/radius)*value;o=vec4(texture(u,uv).xyz+s,1);}`;
  const ADV = `#version 300 es
precision highp float;in vec2 uv;out vec4 o;uniform sampler2D velocity,source;uniform vec2 texel;uniform float dt,dissipation;void main(){vec2 coord=uv-dt*texture(velocity,uv).xy*texel;o=texture(source,coord)/(1.+dissipation*dt);}`;
  const DIV = `#version 300 es
precision highp float;in vec2 uv,l,r,t,b;out vec4 o;uniform sampler2D velocity;void main(){float L=texture(velocity,l).x,R=texture(velocity,r).x,T=texture(velocity,t).y,B=texture(velocity,b).y;o=vec4(.5*(R-L+T-B),0,0,1);}`;
  const CURL = `#version 300 es
precision highp float;in vec2 l,r,t,b;out vec4 o;uniform sampler2D velocity;void main(){float L=texture(velocity,l).y,R=texture(velocity,r).y,T=texture(velocity,t).x,B=texture(velocity,b).x;o=vec4(.5*(R-L-T+B),0,0,1);}`;
  const VORT = `#version 300 es
precision highp float;in vec2 uv,l,r,t,b;out vec4 o;uniform sampler2D velocity,curlTex;uniform float curl,dt;void main(){float L=texture(curlTex,l).x,R=texture(curlTex,r).x,T=texture(curlTex,t).x,B=texture(curlTex,b).x,C=texture(curlTex,uv).x;vec2 f=.5*vec2(abs(T)-abs(B),abs(R)-abs(L));f/=length(f)+.0001;f*=curl*C;f.y*=-1.;vec2 v=texture(velocity,uv).xy+f*dt;o=vec4(clamp(v,vec2(-1000),vec2(1000)),0,1);}`;
  const PRESS = `#version 300 es
precision highp float;in vec2 uv,l,r,t,b;out vec4 o;uniform sampler2D pressure,divergence;void main(){float L=texture(pressure,l).x,R=texture(pressure,r).x,T=texture(pressure,t).x,B=texture(pressure,b).x,D=texture(divergence,uv).x;o=vec4((L+R+B+T-D)*.25,0,0,1);}`;
  const GRAD = `#version 300 es
precision highp float;in vec2 uv,l,r,t,b;out vec4 o;uniform sampler2D pressure,velocity;void main(){float L=texture(pressure,l).x,R=texture(pressure,r).x,T=texture(pressure,t).x,B=texture(pressure,b).x;vec2 v=texture(velocity,uv).xy-vec2(R-L,T-B);o=vec4(v,0,1);}`;
  const CLEAR = `#version 300 es
precision highp float;in vec2 uv;out vec4 o;uniform sampler2D u;uniform float value;void main(){o=texture(u,uv)*value;}`;
  const DISPLAY = `#version 300 es
precision highp float;in vec2 uv;out vec4 o;uniform sampler2D dye;uniform float time;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
void main(){
  vec2 drift=vec2(noise(vec2(uv.y*3.7-time*.055,time*.031))-.5,0.)*.014;
  vec3 c=texture(dye,clamp(uv+drift,0.,1.)).rgb;
  float d=max(c.r,max(c.g,c.b));
  float broad=noise(vec2(uv.x*7.2+time*.036,uv.y*5.4-time*.029));
  float fineGrain=noise(vec2(uv.x*18.0-time*.021,uv.y*14.0+time*.017));
  float breakup=smoothstep(.22,.82,broad*.72+fineGrain*.28);
  float base=${mobile ? "smoothstep(.014,.125,d)*.43" : "smoothstep(.005,.105,d)*.49"};
  float a=base*(.47+.53*breakup);
  vec3 steam=mix(vec3(.72,.75,.77),vec3(.96,.97,.98),smoothstep(.025,.16,d));
  o=vec4(steam,a);
}`;
  function make(c) {
    const favorites = c.dataset.profile === "favorites";
    const gl = c.getContext("webgl2", {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
    });
    if (!gl || !gl.getExtension("EXT_color_buffer_float")) return null;
    gl.getExtension("OES_texture_float_linear");
    const sh = (type, src) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
      },
      program = (src) => {
        const p = gl.createProgram();
        gl.attachShader(p, sh(gl.VERTEX_SHADER, VS));
        gl.attachShader(p, sh(gl.FRAGMENT_SHADER, src));
        gl.linkProgram(p);
        return p;
      };
    const P = {
      splat: program(SPLAT),
      advection: program(ADV),
      divergence: program(DIV),
      curl: program(CURL),
      vorticity: program(VORT),
      pressure: program(PRESS),
      gradient: program(GRAD),
      clear: program(CLEAR),
      display: program(DISPLAY),
    };
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    for (const p of Object.values(P)) {
      const loc = gl.getAttribLocation(p, "a");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    }
    let W, H, velocity, dye, pressure, divergence, curlTex;
    const uni = (p, n) => gl.getUniformLocation(p, n),
      bind = (p, n, tex, id) => {
        gl.activeTexture(gl.TEXTURE0 + id);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform1i(uni(p, n), id);
      };
    function tex(filter = gl.LINEAR) {
      const x = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, x);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA16F,
        W,
        H,
        0,
        gl.RGBA,
        gl.HALF_FLOAT,
        null,
      );
      return x;
    }
    function fbo(texture) {
      const f = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, f);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0,
      );
      return f;
    }
    function single(filter) {
      const texture = tex(filter);
      return { texture, fbo: fbo(texture) };
    }
    function double(filter) {
      let A = single(filter),
        B = single(filter);
      return {
        get read() {
          return A;
        },
        get write() {
          return B;
        },
        swap() {
          [A, B] = [B, A];
        },
      };
    }
    function alloc() {
      const r = mobile
          ? c.parentElement.getBoundingClientRect()
          : c.getBoundingClientRect(),
        base = favorites
          ? (lowPower ? 104 : 144)
          : lowPower ? (mobile ? 48 : 64) : (mobile ? 64 : 88),
        effectiveDPR = Math.min(devicePixelRatio || 1, mobile ? 1.35 : 1.5);
      W = base;
      H = Math.max(56, Math.round((base * r.height) / r.width));
      c.width = favorites
        ? Math.min(720, Math.max(320, Math.round(r.width * effectiveDPR * (lowPower ? .34 : .46))))
        : mobile
          ? Math.max(160, Math.round(r.width * effectiveDPR * (lowPower ? 0.42 : 0.52)))
          : lowPower ? 176 : 208;
      c.height = Math.max(120, Math.round((c.width * r.height) / r.width));
      velocity = double(gl.LINEAR);
      dye = double(gl.LINEAR);
      pressure = double(gl.NEAREST);
      divergence = single(gl.NEAREST);
      curlTex = single(gl.NEAREST);
    }
    alloc();
    function draw(p, target, texel = true) {
      gl.useProgram(p);
      if (texel) gl.uniform2f(uni(p, "texel"), 1 / W, 1 / H);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target?.fbo || null);
      gl.viewport(0, 0, target ? W : c.width, target ? H : c.height);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    function splat(x, y, dx, dy, density, radius = 0.00008) {
      let p = P.splat;
      gl.useProgram(p);
      bind(p, "u", velocity.read.texture, 0);
      gl.uniform2f(uni(p, "point"), x, y);
      gl.uniform3f(uni(p, "value"), dx, dy, 0);
      gl.uniform1f(uni(p, "radius"), radius);
      gl.uniform1f(uni(p, "aspect"), c.width / c.height);
      draw(p, velocity.write, false);
      velocity.swap();
      gl.useProgram(p);
      bind(p, "u", dye.read.texture, 0);
      gl.uniform2f(uni(p, "point"), x, y);
      gl.uniform3f(uni(p, "value"), density, density * 0.96, density * 0.92);
      gl.uniform1f(uni(p, "radius"), radius);
      gl.uniform1f(uni(p, "aspect"), c.width / c.height);
      draw(p, dye.write, false);
      dye.swap();
    }
    function step(dt) {
      let p = P.curl;
      gl.useProgram(p);
      bind(p, "velocity", velocity.read.texture, 0);
      draw(p, curlTex);
      p = P.vorticity;
      gl.useProgram(p);
      bind(p, "velocity", velocity.read.texture, 0);
      bind(p, "curlTex", curlTex.texture, 1);
      gl.uniform1f(uni(p, "curl"), mobile ? 17 : 22);
      gl.uniform1f(uni(p, "dt"), dt);
      draw(p, velocity.write);
      velocity.swap();
      p = P.divergence;
      gl.useProgram(p);
      bind(p, "velocity", velocity.read.texture, 0);
      draw(p, divergence);
      p = P.clear;
      gl.useProgram(p);
      bind(p, "u", pressure.read.texture, 0);
      gl.uniform1f(uni(p, "value"), 0.8);
      draw(p, pressure.write, false);
      pressure.swap();
      for (let i = 0; i < (mobile ? 7 : 10); i++) {
        p = P.pressure;
        gl.useProgram(p);
        bind(p, "pressure", pressure.read.texture, 0);
        bind(p, "divergence", divergence.texture, 1);
        draw(p, pressure.write);
        pressure.swap();
      }
      p = P.gradient;
      gl.useProgram(p);
      bind(p, "pressure", pressure.read.texture, 0);
      bind(p, "velocity", velocity.read.texture, 1);
      draw(p, velocity.write);
      velocity.swap();
      p = P.advection;
      gl.useProgram(p);
      bind(p, "velocity", velocity.read.texture, 0);
      bind(p, "source", velocity.read.texture, 1);
      gl.uniform1f(uni(p, "dt"), dt);
      gl.uniform1f(uni(p, "dissipation"), 0.34);
      draw(p, velocity.write);
      velocity.swap();
      gl.useProgram(p);
      bind(p, "velocity", velocity.read.texture, 0);
      bind(p, "source", dye.read.texture, 1);
      gl.uniform1f(uni(p, "dt"), dt);
      gl.uniform1f(uni(p, "dissipation"), mobile ? 0.78 : 0.78);
      draw(p, dye.write);
      dye.swap();
    }
    function render(now) {
      const p = P.display;
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.useProgram(p);
      bind(p, "dye", dye.read.texture, 0);
      gl.uniform1f(uni(p, "time"), now * 0.001);
      draw(p, null, false);
      gl.disable(gl.BLEND);
    }
    return { alloc, splat, step, render };
  }

  const sourceAnchors = {
    // Center of the existing photographic steam where it meets the bowl rim.
    miso: [910, 470],
    butter: [610, 300],
    "tsubasa-a": [470, 480],
    "tsubasa-b": [950, 430],
  };
  const percentage = (value, fallback = 0.5) => {
    if (!value) return fallback;
    if (value.endsWith("%")) return parseFloat(value) / 100;
    return fallback;
  };
  function imageSource(profile, canvas) {
    const image = canvas.parentElement.querySelector("img.media"),
      anchor = sourceAnchors[profile];
    if (!mobile || !image || !anchor || !image.naturalWidth || !image.naturalHeight)
      return null;
    const width = canvas.parentElement.clientWidth,
      height = canvas.parentElement.clientHeight,
      style = getComputedStyle(image),
      positions = style.objectPosition.split(/\s+/),
      positionX = percentage(positions[0]),
      positionY = percentage(positions[1], positionX),
      scale = Math.max(width / image.naturalWidth, height / image.naturalHeight),
      renderedWidth = image.naturalWidth * scale,
      renderedHeight = image.naturalHeight * scale;
    let pointX = (width - renderedWidth) * positionX + anchor[0] * scale,
      pointY = (height - renderedHeight) * positionY + anchor[1] * scale;
    let transformScale = 1;
    if (style.transform && style.transform !== "none") {
      const origins = style.transformOrigin.split(/\s+/),
        originX = parseFloat(origins[0]) || width / 2,
        originY = parseFloat(origins[1]) || height / 2,
        matrix = new DOMMatrixReadOnly(style.transform),
        point = new DOMPoint(pointX - originX, pointY - originY).matrixTransform(matrix);
      transformScale = Math.max(
        Math.hypot(matrix.a, matrix.b),
        Math.hypot(matrix.c, matrix.d),
        1,
      );
      pointX = point.x + originX;
      pointY = point.y + originY;
    }
    // The left Tsubasa plume originates just outside the cropped mobile
    // photograph.  Start its continuation at the first visible part of the
    // bowl instead of collapsing it against the viewport edge.
    const minX = mobile && profile === "tsubasa-a" ? 0.08 : 0.02;
    return {
      x: Math.max(minX, Math.min(0.98, pointX / width)),
      y: Math.max(0.02, Math.min(0.98, 1 - pointY / height)),
      natural: anchor,
      imageScale: transformScale,
    };
  }
  const sims = [];
  for (const c of canvases) {
    let sim;
    try {
      sim = make(c);
    } catch (e) {
      continue;
    }
    if (!sim) {
      c.style.display = "none";
      continue;
    }
    const profile = c.dataset.profile || "miso";
    const s = {
      c,
      sim,
      profile,
      visible: false,
      last: null,
      pointer: null,
      nextEmit: 0,
      lastStep: 0,
      source: null,
      phase: ({ miso: 0.4, butter: 2.1, "tsubasa-a": 4.0, "tsubasa-b": 5.7, favorites: 1.25 })[profile] || 0,
      favoriteCursor: 0,
      emissions: 0,
    };
    const syncSource = () => {
      s.source = imageSource(profile, c);
      c.dataset.anchorX = s.source?.x?.toFixed(4) || "desktop";
      c.dataset.anchorY = s.source?.y?.toFixed(4) || "desktop";
      if (mobile && s.source) {
        // Scale the transparent fluid around the same image-derived source point
        // so the zoomed photo and live steam remain one visual layer.
        c.style.setProperty(
          "--steam-image-scale",
          Math.min(1.65, Math.max(1, s.source.imageScale)).toFixed(4),
        );
        c.style.setProperty("--steam-origin-x", `${(s.source.x * 100).toFixed(3)}%`);
        c.style.setProperty(
          "--steam-origin-y",
          `${((1 - s.source.y) * 100).toFixed(3)}%`,
        );
      }
    };
    syncSource();
    c.parentElement.querySelector("img.media")?.addEventListener("load", syncSource, {
      once: true,
    });
    s.syncSource = syncSource;
    sims.push(s);
    new IntersectionObserver((e) => (s.visible = e[0].isIntersecting), {
      rootMargin: "40px",
    }).observe(c);
    if (fine) {
      const interact = (e) => {
          const r = c.getBoundingClientRect(),
            x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
            y = Math.max(0, Math.min(1, 1 - (e.clientY - r.top) / r.height));
          if (s.last)
            s.pointer = {
              x,
              y,
              dx: (e.clientX - s.last.x) / r.width,
              dy: -(e.clientY - s.last.y) / r.height,
            };
          s.last = { x: e.clientX, y: e.clientY };
        };
      c.parentElement.addEventListener("pointerdown", interact, { passive: true });
      c.parentElement.addEventListener("pointermove", interact, { passive: true });
      c.parentElement.addEventListener("pointerleave", () => (s.last = null), {
        passive: true,
      });
    }
  }
  const resize = () => sims.forEach((s) => {
    s.sim.alloc();
    s.syncSource();
  });
  addEventListener("resize", resize, { passive: true });
  visualViewport?.addEventListener("resize", resize, { passive: true });
  let last = performance.now(), pageVisible = !document.hidden;
  document.addEventListener("visibilitychange", () => {
    pageVisible = !document.hidden;
    last = performance.now();
  }, { passive: true });
  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.025);
    last = now;
    for (const s of sims)
      if (pageVisible && s.visible && now - s.lastStep >= (lowPower ? 42 : mobile ? 34 : 26)) {
        s.lastStep = now;
        if (now >= s.nextEmit) {
          const phase = now * 0.001 + s.phase,
            tsubasa = s.profile.startsWith("tsubasa");
          if (s.profile === "favorites") {
            const grid = s.c.parentElement;
            const cards = [...grid.querySelectorAll('.food-card')];
            const gr = grid.getBoundingClientRect();
            // Four staggered sources keep all eight cards visibly alive while
            // retaining one shared WebGL context for the entire grid.
            for (let n = 0; n < 4; n++) {
              const card = cards[(s.favoriteCursor + n) % cards.length];
              const r = card.getBoundingClientRect();
              const x = (r.left - gr.left + r.width * (.46 + .13 * Math.sin(phase * .71 + n * 1.9))) / gr.width;
              const y = 1 - (r.top - gr.top + r.height * .54) / gr.height;
              for (let k = -1; k <= 1; k++) s.sim.splat(
                x + k * .014,
                y + Math.abs(k) * .003,
                Math.sin(phase * .57 + k * 1.8 + n) * 1.15,
                12.5 + Math.sin(phase * .37 + k + n) * 2.4,
                mobile ? .026 : .038,
                mobile ? .00018 : .00024,
              );
              s.emissions++;
            }
            s.favoriteCursor = (s.favoriteCursor + 4) % cards.length;
            s.nextEmit = now + (mobile ? 132 : 108);
            s.sim.step(dt);
            s.sim.render(now);
            continue;
          }
          let srcX = mobile ? 0.66 : 0.605,
            srcY = mobile ? 0.5 : 0.5;
          if (s.profile === "tsubasa-a") {
            srcX = mobile ? 0.34 : 0.34;
            srcY = mobile ? 0.48 : 0.48;
          } else if (s.profile === "tsubasa-b") {
            srcX = mobile ? 0.67 : 0.66;
            srcY = mobile ? 0.48 : 0.48;
          }
          if (mobile && s.source) {
            srcX = s.source.x;
            srcY = s.source.y;
          }
          const breath = .68 + .20 * Math.sin(phase * .41) +
            .12 * Math.sin(phase * .17 + 1.8);
          const wind = Math.sin(phase * .19 + Math.sin(phase * .071)) *
            (tsubasa ? .62 : .85);
          srcX += Math.sin(phase * 0.68) * 0.0035;
          for (let k = tsubasa ? -1 : -2; k <= (tsubasa ? 1 : 2); k++) {
            const spread = tsubasa ? 0.0064 : 0.0040,
              x =
                srcX +
                k * spread +
                Math.sin(phase * (tsubasa ? 0.72 : 1.05) + k) * 0.0028,
              y = srcY + Math.abs(k) * 0.0015;
            s.sim.splat(
              x,
              y,
              wind + Math.sin(phase * (tsubasa ? 0.92 : 1.37) + k * 2.1) *
                (tsubasa ? 1.15 : 1.85),
              ((tsubasa ? 19 : 25) + Math.cos(phase + k) * (tsubasa ? 2.5 : 3.5)) * breath,
              (tsubasa ? (mobile ? 0.034 : 0.080) : mobile ? 0.040 : 0.122) * breath,
              (tsubasa ? 0.00016 + k * k * 0.000009 : 0.00009 + k * k * 0.000006) *
                (mobile ? 0.35 : 1),
            );
          }
          // A faint blanket rises from the wider noodle surface. These broad,
          // low-density splats keep the photo breathing even without input.
          for (const [i, offset] of [-.19, -.095, .095, .19].entries()) {
            s.sim.splat(
              Math.max(.04, Math.min(.96, srcX + offset)),
              srcY - .018 - Math.abs(offset) * .025,
              wind * .45 + Math.sin(phase * .43 + i) * .34,
              8.5 + 1.4 * Math.sin(phase * .31 + i * 1.7),
              mobile ? .010 : .020,
              mobile ? .00018 : .00030,
            );
          }
          const irregular = .82 + .34 * (.5 + .5 * Math.sin(phase * 1.73 + s.phase));
          s.nextEmit = now + (tsubasa ? (mobile ? 108 : 86) : mobile ? 78 : 60) * irregular;
        }
        s.sim.step(dt);
        if (s.pointer) {
          s.sim.splat(
            s.pointer.x,
            s.pointer.y,
            s.pointer.dx * 420,
            s.pointer.dy * 420,
              mobile ? 0.08 : 0.065,
            0.00135,
          );
          s.pointer = null;
        }
        s.sim.render(now);
      }
    if (!reduced) requestAnimationFrame(frame);
    if (window.__tsubasaEffects) {
      window.__tsubasaEffects.emissions = Object.fromEntries(
        sims.map((s) => [s.profile, s.emissions]),
      );
    }
  }
  if (!reduced) requestAnimationFrame(frame);
  window.__tsubasaEffects = {
    engine: "paveldogreat-fluid-solver-adapted",
    effects: ["steam", "advection", "pressure", "vorticity", "splat"],
    upstream: "PavelDoGreat/WebGL-Fluid-Simulation",
    interactive: fine,
    canvasCount: sims.length,
    gpu: true,
    mobile,
    profiles: sims.map((s) => s.profile),
    calibration: mobile ? "image-coordinate-anchor-2026-08-18" : "desktop-approved-2026-08-17",
    quality: lowPower ? "adaptive-low" : "adaptive-high",
    anchors: Object.fromEntries(sims.map((s) => [s.profile, s.source])),
  };
})();
