/* Tsubasa photographic steam. Advection, pressure projection and vorticity
 * solver adapted from Pavel Dobryakov's WebGL Fluid Simulation (MIT).
 * All dishes share one WebGL context. Each visible photo gets its own fluid
 * state and a Canvas2D presentation surface; copy occurs in the render call.
 * The original photograph remains the accessible, no-GPU fallback.
 */
(() => {
  "use strict";
  const images = [
    ...document.querySelectorAll(".signature > img.media, .food-card > img"),
  ];
  if (!images.length) return;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  // Opt-in trial; older preview URLs retain their previous pressure behavior.
  const dynamicPressure = document.documentElement.dataset.phoneSteamImpact === "dynamic";
  const phoneRefinement = document.documentElement.classList.contains("phone-steam-preview");
  const state = (window.__tsubasaEffects = {
    engine: "photographic-steam-fluid",
    phoneRefinement,
    pressureStyle: dynamicPressure ? "dynamic" : "classic",
    gestureHoldMs: 200,
    effects: ["steam", "advection", "pressure", "vorticity", "splat"],
    upstream: "PavelDoGreat/WebGL-Fluid-Simulation",
    gpu: false,
    contextCount: 0,
    frames: 0,
    errors: [],
    surfaces: [],
    paused: motion.matches,
    interactive: true,
  });
  const output = document.createElement("canvas");
  const gl = output.getContext("webgl2", {
    alpha: false,
    premultipliedAlpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
  });
  if (!gl || !gl.getExtension("EXT_color_buffer_float")) {
    state.errors.push(
      "Floating-point WebGL2 unavailable; original photos retained.",
    );
    return;
  }
  state.gpu = true;
  state.contextCount = 1;
  const VS = `#version 300 es
precision highp float;layout(location=0) in vec2 a;out vec2 uv,l,r,t,b;uniform vec2 texel;void main(){uv=a*.5+.5;l=uv-vec2(texel.x,0);r=uv+vec2(texel.x,0);t=uv+vec2(0,texel.y);b=uv-vec2(0,texel.y);gl_Position=vec4(a,0,1);}`;
  const SPLAT = `#version 300 es
precision highp float;in vec2 uv;out vec4 o;uniform sampler2D u;uniform vec2 point;uniform vec3 value;uniform float radius,aspect;void main(){vec2 p=uv-point;p.x*=aspect;vec3 s=exp(-dot(p,p)/radius)*value;o=vec4(texture(u,uv).xyz+s,1);}`;
  const ADV = `#version 300 es
precision highp float;in vec2 uv;out vec4 o;uniform sampler2D velocity,source;uniform vec2 texel;uniform float dt,dissipation;void main(){vec2 coord=uv-dt*texture(velocity,uv).xy*texel;o=texture(source,coord)/(1.+dissipation*dt);}`;
  const DIV = `#version 300 es
precision highp float;in vec2 uv,l,r,t,b;out vec4 o;uniform sampler2D velocity;void main(){float L=texture(velocity,l).x,R=texture(velocity,r).x,T=texture(velocity,t).y,B=texture(velocity,b).y;o=vec4(.5*(R-L+T-B),0,0,1);}`;
  // Limited MacCormack correction retains thin fingertip strands instead of
  // letting repeated bilinear advection diffuse them into a grey brush mark.
  // This pass is used only by the temporary finger field, never ambient steam.
  const CORRECT = `#version 300 es
precision highp float;in vec2 uv;out vec4 o;
uniform sampler2D velocity,source,forwardDye;uniform vec2 texel;uniform float dt,dissipation;
void main(){
 vec2 travel=dt*texture(velocity,uv).xy*texel;
 vec2 back=uv-travel;
 vec2 cell=(floor(back/texel-.5)+.5)*texel;
 float decay=1.+dissipation*dt;
 vec3 a=texture(source,cell).rgb/decay,b=texture(source,cell+vec2(texel.x,0)).rgb/decay;
 vec3 c=texture(source,cell+vec2(0,texel.y)).rgb/decay,d=texture(source,cell+texel).rgb/decay;
 vec3 corrected=texture(forwardDye,uv).rgb+.5*(texture(source,uv).rgb/decay-texture(forwardDye,uv+travel).rgb);
 o=vec4(clamp(corrected,min(min(a,b),min(c,d)),max(max(a,b),max(c,d))),1.);
}`;
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

  const BUOYANCY = `#version 300 es
precision highp float;in vec2 uv;out vec4 o;
uniform sampler2D velocity,dye;uniform float dt,time;
void main(){
 vec2 v=texture(velocity,uv).xy;
 float d=texture(dye,uv).r;
 // Warm air continues upwards after leaving the source, without an explosive
 // injection. Velocity uses solver cells/second, not viewport pixels.
 v.y+=(3.5+min(d,.4)*48.)*dt;
 v.x+=sin(uv.y*21.-time*.7)*min(d,.25)*4.*dt;
 o=vec4(v,0.,1.);
}`;
  const FINGER_BUOYANCY = BUOYANCY.replace(
    "v.y+=(3.5+min(d,.4)*48.)*dt;",
    "v.y+=(9.+min(d,.6)*90.)*dt;",
  ).replace(
    "v.x+=sin(uv.y*21.-time*.7)*min(d,.25)*4.*dt;",
    "v.x+=(sin(uv.y*24.-time*1.1)+sin(uv.x*31.+time*.8)) *min(d,.45)*12.*dt;",
  );
  const DISPLAY = `#version 300 es
precision highp float;in vec2 uv;out vec4 o;
uniform sampler2D photo,velocity,dye;
uniform vec2 texel;
uniform vec4 roots[2];uniform int rootCount;
uniform float time,seed,motionAmount,steamVisibility;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
void main(){
 vec2 q=vec2(uv.x,1.-uv.y);
 vec3 original=texture(photo,q).rgb;
 vec2 offset=vec2(0.);
 float mask=0.;
 for(int i=0;i<2;i++){
   if(i>=rootCount)break;
   vec4 root=roots[i]; // image x/y, half-width and plume height
   float h=(root.y-q.y)/root.w;
   float vertical=smoothstep(.0,.16,h)*(1.-smoothstep(1.12,1.45,h));
   float width=root.z*(.72+.55*clamp(h,0.,1.));
   float horizontal=1.-smoothstep(.65,1.3,abs(q.x-root.x)/width);
   float m=vertical*horizontal;
   float t=time+seed+float(i)*3.7;
   // Travelling folds move upward; separate scales break up a periodic sway.
   float fold=sin(uv.y*22.-t*.8+sin(uv.y*8.+t*.23));
   float fine=sin(uv.y*51.-t*1.4+uv.x*17.);
   float eddy=noise(vec2(uv.x*16.+t*.09,uv.y*19.-t*.22))-.5;
   vec2 flow=texture(velocity,uv).xy;
   vec2 drift=vec2(fold*.010+fine*.003+eddy*.009, sin(uv.x*31.+uv.y*17.-t*.65)*.006);
   drift+=clamp(flow*texel*.027,vec2(-.018),vec2(.018));
   offset+=drift*m;mask=max(mask,m);
 }
 offset*=motionAmount;
 // Leave the bowl, lettering, garnish and background outside each plume fixed.
 vec3 moving=texture(photo,clamp(q+offset,vec2(.001),vec2(.999))).rgb;
 vec3 color=mix(original,moving,mask);
 float d=texture(dye,uv).r;
 float dx=texture(dye,uv+vec2(texel.x,0)).r-texture(dye,uv-vec2(texel.x,0)).r;
 float dy=texture(dye,uv+vec2(0,texel.y)).r-texture(dye,uv-vec2(0,texel.y)).r;
 float detail=noise(vec2(uv.x*37.+time*.10,uv.y*29.-time*.3));
 float edge=smoothstep(.001,.028,length(vec2(dx,dy)));
 // A thin veil supports the photographic strands; it cannot turn into a
 // solid white particle. Output is opaque photo + steam, with no alpha square.
 float veil=(1.-exp(-d*2.8))*(.2+.8*edge)*(.35+.65*detail)*mask*.10*motionAmount*steamVisibility;
 color=1.-(1.-color)*(1.-vec3(.80,.82,.83)*veil);
 o=vec4(color,1.);
}`;
  // Keep the approved idle shader byte-for-byte. A separate variant composites
  // new vapor only while a finger field exists; no extra idle texture samples.
  const FINGER_DISPLAY = DISPLAY.replace(
    "uniform sampler2D photo,velocity,dye;",
    "uniform sampler2D photo,velocity,dye,fingerDye;uniform float fingerStrength;",
  ).replace(
    " o=vec4(color,1.);",
    ` float fd=texture(fingerDye,uv).r;
 float fingerDetail=noise(uv*vec2(72.,58.)+vec2(time*.15,-time*.45));
 float alpha=(1.-exp(-fd*2.3))*fingerStrength*(.4+.6*fingerDetail)*min(motionAmount,1.);
 color=1.-(1.-color)*(1.-vec3(.80,.82,.83)*alpha);
 o=vec4(color,1.);`,
  );
  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      throw Error(gl.getShaderInfoLog(shader));
    return shader;
  };
  const programs = {};
  try {
    const vertex = compile(gl.VERTEX_SHADER, VS);
    for (const [name, source] of Object.entries({
      splat: SPLAT,
      advection: ADV,
      correct: CORRECT,
      divergence: DIV,
      curl: CURL,
      vorticity: VORT,
      pressure: PRESS,
      gradient: GRAD,
      clear: CLEAR,
      buoyancy: BUOYANCY,
      fingerBuoyancy: FINGER_BUOYANCY,
      display: DISPLAY,
      fingerDisplay: FINGER_DISPLAY,
    })) {
      const p = gl.createProgram(),
        frag = compile(gl.FRAGMENT_SHADER, source);
      gl.attachShader(p, vertex);
      gl.attachShader(p, frag);
      gl.linkProgram(p);
      gl.deleteShader(frag);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS))
        throw Error(gl.getProgramInfoLog(p));
      const uniforms = {};
      for (let i = 0; i < gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); i++) {
        const u = gl.getActiveUniform(p, i);
        uniforms[u.name.replace("[0]", "")] = gl.getUniformLocation(p, u.name);
      }
      programs[name] = { p, u: uniforms };
    }
    gl.deleteShader(vertex);
  } catch (error) {
    state.errors.push(String(error));
    return;
  }
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.disable(gl.BLEND);
  // Measured against the original photos, before object-fit, crop or scale.
  // Keeping physics in image space eliminates the former double transform.
  const profiles = {
    "ultimate-miso.webp": [[0.635, 0.486, 0.13, 0.486]],
    "butter-corn.webp": [[0.52, 0.335, 0.225, 0.335]],
    "tsubasa-ramen.webp": [
      [0.319, 0.502, 0.125, 0.502],
      [0.692, 0.475, 0.112, 0.475],
    ],
    "spicy-miso-limited.png": [[0.57, 0.205, 0.245, 0.205]],
    "chashu.webp": [[0.55, 0.318, 0.19, 0.318]],
    "negi.webp": [[0.56, 0.34, 0.205, 0.34]],
    "spicy-negi.webp": [[0.54, 0.294, 0.215, 0.294]],
    "shio-shoyu.webp": [[0.48, 0.235, 0.235, 0.235]],
    "fried-rice.webp": [[0.51, 0.253, 0.22, 0.253]],
    "gyoza.webp": [[0.585, 0.344, 0.245, 0.344]],
    "kimchi.webp": [[0.61, 0.323, 0.2, 0.323]],
  };
  let current = null;
  function texture(w, h, filter = gl.LINEAR) {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA16F,
      w,
      h,
      0,
      gl.RGBA,
      gl.HALF_FLOAT,
      null,
    );
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      t,
      0,
    );
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
      throw Error("Incomplete steam framebuffer");
    return { texture: t, fbo };
  }
  function pair(s, filter) {
    const a = texture(s.w, s.h, filter),
      b = texture(s.w, s.h, filter);
    return {
      read: a,
      write: b,
      swap() {
        [this.read, this.write] = [this.write, this.read];
      },
    };
  }
  function use(name) {
    const p = programs[name];
    gl.useProgram(p.p);
    if (p.u.texel) gl.uniform2f(p.u.texel, 1 / current.w, 1 / current.h);
    return p.u;
  }
  function bind(u, name, t, n) {
    gl.activeTexture(gl.TEXTURE0 + n);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.uniform1i(u[name], n);
  }
  function draw(target) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.fbo : null);
    gl.viewport(
      0,
      0,
      target ? current.w : output.width,
      target ? current.h : output.height,
    );
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  function allocateFluid(s) {
    current = s;
    s.velocity = pair(s);
    s.dye = pair(s);
    s.pressure = pair(s, gl.NEAREST);
    s.divergence = texture(s.w, s.h, gl.NEAREST);
    s.curl = texture(s.w, s.h, gl.NEAREST);
  }
  function allocate(s) {
    allocateFluid(s);
    s.photo = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, s.photo);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      s.image,
    );
    s.allocated = true;
  }
  function splat(s, x, y, dx, dy, density, radius) {
    let u = use("splat");
    bind(u, "u", s.velocity.read.texture, 0);
    gl.uniform2f(u.point, x, y);
    gl.uniform3f(u.value, dx, dy, 0);
    gl.uniform1f(u.radius, radius);
    gl.uniform1f(u.aspect, s.w / s.h);
    draw(s.velocity.write);
    s.velocity.swap();
    bind(u, "u", s.dye.read.texture, 0);
    gl.uniform3f(u.value, density, density * 0.97, density * 0.94);
    draw(s.dye.write);
    s.dye.swap();
  }
  function step(s, dt, t, dyeDissipation = 0.9) {
    let u = use(s.dynamicPressure ? "fingerBuoyancy" : "buoyancy");
    bind(u, "velocity", s.velocity.read.texture, 0);
    bind(u, "dye", s.dye.read.texture, 1);
    gl.uniform1f(u.dt, dt);
    gl.uniform1f(u.time, t);
    draw(s.velocity.write);
    s.velocity.swap();
    u = use("curl");
    bind(u, "velocity", s.velocity.read.texture, 0);
    draw(s.curl);
    u = use("vorticity");
    bind(u, "velocity", s.velocity.read.texture, 0);
    bind(u, "curlTex", s.curl.texture, 1);
    gl.uniform1f(u.curl, s.dynamicPressure ? 20 : 9);
    gl.uniform1f(u.dt, dt);
    draw(s.velocity.write);
    s.velocity.swap();
    u = use("divergence");
    bind(u, "velocity", s.velocity.read.texture, 0);
    draw(s.divergence);
    u = use("clear");
    bind(u, "u", s.pressure.read.texture, 0);
    gl.uniform1f(u.value, 0.8);
    draw(s.pressure.write);
    s.pressure.swap();
    u = use("pressure");
    bind(u, "divergence", s.divergence.texture, 1);
    for (let i = 0; i < 8; i++) {
      bind(u, "pressure", s.pressure.read.texture, 0);
      draw(s.pressure.write);
      s.pressure.swap();
    }
    u = use("gradient");
    bind(u, "velocity", s.velocity.read.texture, 0);
    bind(u, "pressure", s.pressure.read.texture, 1);
    draw(s.velocity.write);
    s.velocity.swap();
    u = use("advection");
    gl.uniform1f(u.dt, dt);
    gl.uniform1f(u.dissipation, s.dynamicPressure ? 0.55 : 0.7);
    bind(u, "velocity", s.velocity.read.texture, 0);
    bind(u, "source", s.velocity.read.texture, 1);
    draw(s.velocity.write);
    s.velocity.swap();
    bind(u, "velocity", s.velocity.read.texture, 0);
    bind(u, "source", s.dye.read.texture, 1);
    gl.uniform1f(u.dissipation, dyeDissipation);
    draw(s.dye.write);
    if (s.detail) {
      u = use("correct");
      bind(u, "velocity", s.velocity.read.texture, 0);
      bind(u, "source", s.dye.read.texture, 1);
      bind(u, "forwardDye", s.dye.write.texture, 2);
      gl.uniform1f(u.dt, dt);
      gl.uniform1f(u.dissipation, dyeDissipation);
      draw(s.detail);
      [s.detail, s.dye.write] = [s.dye.write, s.detail];
    }
    s.dye.swap();
  }
  function sync(s) {
    if (!s.image.naturalWidth) return;
    const c = s.canvas,
      img = s.image,
      css = getComputedStyle(img);
    // Canvas is a replaced element too: object-fit and object-position perform
    // exactly the same mapping as the original img, once, in both browsers.
    for (const prop of [
      "objectFit",
      "objectPosition",
      "transform",
      "transformOrigin",
      "filter",
      "borderRadius",
      "transition",
      "maskImage",
      "webkitMaskImage",
    ]) {
      c.style[prop] = css[prop];
    }
    c.style.left = img.offsetLeft + "px";
    c.style.top = img.offsetTop + "px";
    c.style.width = img.offsetWidth + "px";
    c.style.height = img.offsetHeight + "px";
    // Keep the cover crop crisp, while avoiding unneeded original-resolution
    // composition when a photo is displayed smaller. Physics is unchanged.
    const r = img.getBoundingClientRect();
    const photoWidth = Math.max(r.width, r.height * img.naturalWidth / img.naturalHeight);
    if (s.hint) {
      const photoHeight = photoWidth * img.naturalHeight / img.naturalWidth;
      const pos = css.objectPosition.split(" ").map(x => parseFloat(x)/100);
      const y = r.top + (r.height-photoHeight)*pos[1] + s.roots[0][1]*photoHeight;
      s.hint.style.top = Math.max(86, y-img.parentElement.getBoundingClientRect().top-20)+"px";
    }
    const width = s.signature
      ? (phoneRefinement ? Math.min(img.naturalWidth, Math.max(720, Math.ceil(photoWidth * 1.35))) : img.naturalWidth)
      : Math.min(660, img.naturalWidth);
    const height = Math.round((width * img.naturalHeight) / img.naturalWidth);
    if (c.width !== width || c.height !== height) {
      c.width = width;
      c.height = height;
      s.needsDraw = true;
    }
  }
  function render(s, t) {
    const c = s.canvas;
    if (output.width !== c.width || output.height !== c.height) {
      output.width = c.width;
      output.height = c.height;
    }
    const u = use(s.finger ? "fingerDisplay" : "display");
    bind(u, "photo", s.photo, 0);
    bind(u, "velocity", s.velocity.read.texture, 1);
    bind(u, "dye", s.dye.read.texture, 2);
    if (s.finger) {
      bind(u, "fingerDye", s.finger.dye.read.texture, 3);
      gl.uniform1f(u.fingerStrength, dynamicPressure ? 0.68 : 0.43);
    }
    gl.uniform4fv(u.roots, s.rootArray);
    gl.uniform1i(u.rootCount, s.roots.length);
    gl.uniform1f(u.time, t);
    gl.uniform1f(u.seed, s.seed);
    gl.uniform1f(u.motionAmount, motion.matches ? 0 : (s.signature && phoneRefinement ? 1.24 : 1));
    gl.uniform1f(u.steamVisibility, s.signature && phoneRefinement ? 1.55 : 1);
    draw(null);
    // Synchronous copy while the WebGL buffer is valid. The DOM never has a
    // partially transparent WebGL layer or a browser-specific blend/filter stack.
    s.ctx.drawImage(output, 0, 0);
    s.draws++;
    s.needsDraw = false;
    if (!s.ready) {
      s.image.classList.add("steam-photo-source");
      s.ready = true;
      s.canvas.classList.add("is-ready");
    }
  }
  const systems = [];
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const s = systems.find((x) => x.image.parentElement === entry.target);
        if (!s) continue;
        s.visible = entry.isIntersecting && entry.intersectionRatio >= 0.005;
        if (!s.visible) { clearFinger(s); s.resetPhoneTouch?.(); }
        s.last = 0;
      }
      wake();
    },
    { rootMargin: "0px", threshold: [0, 0.005] },
  );
  const resizeObserver = new ResizeObserver((entries) => {
    for (const { target } of entries) {
      const s = systems.find((x) => x.image === target);
      if (s) sync(s);
    }
    wake();
  });
  const localPoint = (s, e) => {
    const r = s.image.getBoundingClientRect(),
      css = getComputedStyle(s.image);
    const positions = css.objectPosition
      .split(" ")
      .map((x) => parseFloat(x) / 100);
    const fit = css.objectFit === "contain" ? Math.min : Math.max;
    const scale = fit(
      r.width / s.image.naturalWidth,
      r.height / s.image.naturalHeight,
    );
    const w = s.image.naturalWidth * scale,
      h = s.image.naturalHeight * scale;
    return {
      x: Math.max(
        0,
        Math.min(1, (e.clientX - r.left - (r.width - w) * positions[0]) / w),
      ),
      y: Math.max(
        0,
        Math.min(
          1,
          1 -
            (e.clientY -
              r.top -
              (r.height - h) * (positions[1] ?? positions[0])) /
              h,
        ),
      ),
    };
  };
  // A press on a bowl must reach its steam, not an invisible area below the
  // display mask. Keep the approved display shader and ambient emitter intact.
  function steamPoint(s, p) {
    const root = s.roots.reduce((nearest, r) =>
      Math.abs(p.x - r[0]) < Math.abs(p.x - nearest[0]) ? r : nearest,
    );
    return {
      x: Math.max(
        root[0] - root[2] * 0.7,
        Math.min(root[0] + root[2] * 0.7, p.x),
      ),
      y: Math.max(
        1 - root[1] + root[3] * 0.3,
        Math.min(1 - root[1] + root[3] * 0.85, p.y),
      ),
      width: root[2],
    };
  }
  function stir(s, dt) {
    if (s.pointer) {
      const p = s.pointer,
        at = steamPoint(s, p);
      // Velocity only: move the existing strands, never paint a white spot.
      const force = dynamicPressure ? 2600 : 1800;
      splat(s, at.x, at.y, p.dx * force, p.dy * force, 0, 0.0024);
      s.pointer = null;
    }
    const contact = s.contact;
    if (!contact) return;
    contact.age += dt;
    if (!contact.down && contact.age > 0.35) {
      s.contact = null;
      return;
    }
    const at = steamPoint(s, contact);
    const strength =
      (dynamicPressure ? 28 : 18) * dt * 30 * (contact.down ? 1 : Math.exp(-contact.age * 12));
    // Two small opposing forces part the plume around the fingertip. The
    // existing pressure/advection/vorticity stages carry and dissipate them.
    for (const side of [-1, 1])
      splat(
        s,
        at.x + side * at.width * 0.3,
        at.y,
        side * strength,
        strength * 0.25,
        0,
        0.0018,
      );
  }
  function clearFinger(s) {
    s.fingerPending = null;
    const f = s.finger;
    if (!f) return;
    for (const buffer of [
      f.velocity.read,
      f.velocity.write,
      f.dye.read,
      f.dye.write,
      f.pressure.read,
      f.pressure.write,
      f.divergence,
      f.curl,
      f.detail,
    ]) {
      gl.deleteTexture(buffer.texture);
      gl.deleteFramebuffer(buffer.fbo);
    }
    s.finger = null;
  }
  function updateFinger(s, dt) {
    const pending = s.fingerPending;
    if (!s.finger && !pending) return;
    if (!s.finger) {
      s.finger = {
        w: 384,
        h: Math.round((384 * s.h) / s.w),
        time: 0,
        idle: 0,
        emitIn: 0,
        lastPoint: null,
        dynamicPressure,
      };
      allocateFluid(s.finger);
      s.finger.detail = texture(s.finger.w, s.finger.h);
    }
    const f = s.finger;
    current = f;
    f.time += dt;
    f.idle += dt;
    f.emitIn -= dt;
    const p = pending || (s.contact?.down && f.emitIn <= 0 ? s.contact : null);
    if (p) {
      const from = p.start ? p.origin : f.lastPoint || p;
      const dx = p.x - from.x,
        dy = p.y - from.y;
      const distance = Math.hypot((dx * f.w) / f.h, dy);
      const stationary = distance < 0.002;
      const count = Math.max(1, Math.min(dynamicPressure ? 6 : 8,
        Math.ceil(distance / (dynamicPressure ? 0.018 : 0.01))));
      const limit = dynamicPressure ? 170 : 90, force = dynamicPressure ? 1.1 : 0.45;
      const vx = Math.max(-limit, Math.min(limit, ((dx * f.w) / dt) * force));
      const vy = Math.max(-limit, Math.min(limit, ((dy * f.h) / dt) * force)) + 3;
      // Closely spaced, slightly separated injections form a continuous trail,
      // not isolated circles. Existing pressure/curl stages roll it into wisps.
      for (let j = 1; j <= count; j++) {
        const x = from.x + (dx * j) / count,
          y = from.y + (dy * j) / count;
        const turn = f.time * 3.1 + j * 0.7;
        for (const side of (dynamicPressure ? [-1, 0, 1] : [-1, 1]))
          splat(
            f,
            x + (side * (dynamicPressure ? 0.014 : 0.006) * f.h) / f.w
              + (dynamicPressure ? Math.sin(turn * 1.7 + side) * 0.008 : 0),
            y + Math.sin(turn + side) * (dynamicPressure ? 0.012 : 0.005),
            vx + side * (dynamicPressure ? 9 : 3.5),
            vy + Math.sin(turn) * (dynamicPressure ? 6 : 2)
              + (dynamicPressure ? (stationary ? 18 : 8) : 0),
            // Three wandering ribbons spread the source without a solid disk.
            (dynamicPressure ? (stationary ? 0.10 : 0.28) : (stationary ? 0.09 : 0.22))
              * (0.65 + 0.35 * Math.sin(turn + side)),
            dynamicPressure ? 0.00020 : 0.000026,
          );
      }
      f.lastPoint = p;
      f.idle = 0;
      f.emitIn = 0.06;
      s.fingerPending = null;
    }
    if (f.idle > (dynamicPressure ? 6.5 : 5)) clearFinger(s);
    else step(f, dt, f.time, dynamicPressure ? 0.68 : 1.1);
    current = s;
  }
  for (const [i, img] of images.entries()) {
    const file =
      img.currentSrc.split("/").pop()?.split("?")[0] ||
      img.src.split("/").pop();
    const roots = profiles[file];
    if (!roots) continue;
    const canvas = document.createElement("canvas");
    canvas.className = "steam-photo";
    canvas.setAttribute("aria-hidden", "true");
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) continue;
    img.insertAdjacentElement("afterend", canvas);
    const signature = img.matches(".media"),
      w = signature ? 192 : 112;
    const s = {
      image: img,
      canvas,
      ctx,
      roots,
      rootArray: new Float32Array([
        ...roots.flat(),
        ...Array((2 - roots.length) * 4).fill(0),
      ]),
      profile: signature
        ? img.parentElement
            .querySelector("[data-profile]")
            ?.dataset.profile.replace("-a", "")
        : file,
      signature,
      w,
      h: Math.round((w * 2) / 3),
      seed: i * 2.37,
      visible: false,
      allocated: false,
      ready: false,
      draws: 0,
      steps: 0,
      last: 0,
      time: 0,
      nextEmit: 0,
      pointer: null,
      prevPointer: null,
      contact: null,
      finger: null,
      fingerPending: null,
      needsDraw: true,
    };
    systems.push(s);
    state.surfaces.push(s);
    const prepare = () => {
      s.h = Math.round((s.w * img.naturalHeight) / img.naturalWidth);
      sync(s);
      observer.observe(img.parentElement);
      resizeObserver.observe(img);
    };
    if (img.complete && img.naturalWidth) prepare();
    else img.addEventListener("load", prepare, { once: true });
    const move = (e) => {
      if (e.target.closest?.("a, button, input, select, textarea")) return;
      if (e.type === "pointerdown" && e.button !== 0) return;
      if (
        e.pointerType === "touch" &&
        e.type === "pointermove" &&
        !s.prevPointer
      )
        return;
      const p = localPoint(s, e),
        prev = s.prevPointer || p;
      s.pointer = {
        ...p,
        dx: Math.max(-0.08, Math.min(0.08, p.x - prev.x)),
        dy:
          e.type === "pointerdown"
            ? 0.025
            : Math.max(-0.08, Math.min(0.08, p.y - prev.y)),
      };
      if (signature) {
        const down = e.type === "pointerdown" || !!s.contact?.down;
        // Hover keeps the existing directional response. A press/tap also
        // displaces steam while stationary, including on touch-only devices.
        if (down) {
          s.contact = { ...p, down, id: e.pointerId, age: 0 };
          s.fingerPending = {
            ...p,
            start: e.type === "pointerdown" || !!s.fingerPending?.start,
            // Retain the down point when an entire quick stroke arrives
            // between two animation frames, including a down/move/up burst.
            origin: e.type === "pointerdown" ? p : s.fingerPending?.origin,
          };
        }
      }
      s.prevPointer = p;
      wake();
    };
    img.parentElement.addEventListener("pointerdown", move, { passive: true });
    img.parentElement.addEventListener("pointermove", move, { passive: true });
    for (const name of ["pointerleave", "pointerup", "pointercancel"])
      img.parentElement.addEventListener(
        name,
        () => {
          s.prevPointer = null;
          if (s.contact) {
            s.contact.down = false;
            s.contact.age = 0;
          }
        },
        { passive: true },
      );
    if (signature) {
      img.draggable = false;
      // A release outside the photograph, browser blur or native touch scroll
      // must never leave pressure held. Pointer release listeners stay passive.
      const release = (e) => {
        if (e.pointerId != null && s.contact?.id !== e.pointerId) return;
        if (e.type !== "pointerup") s.fingerPending = null;
        s.prevPointer = null;
        if (s.contact) {
          s.contact.down = false;
          s.contact.age = 0;
        }
      };
      for (const name of ["pointerup", "pointercancel", "blur"])
        addEventListener(name, release, { passive: true });
    }

    if (signature && phoneRefinement) {
      const host = img.parentElement;
      const hint = document.createElement("p");
      hint.className = "phone-steam-hint";
      hint.textContent = "少し押してから、湯気をなぞる";
      hint.setAttribute("aria-hidden", "true");
      host.append(hint);
      s.hint = hint;
      sync(s);
      let holdTimer = 0, touch = null;
      s.phoneGesture = { phase:"idle", holds:0, moves:0, scrolls:0 };
      const resetTouch = () => {
        clearTimeout(holdTimer); touch = null;
        s.phoneGesture.phase = "idle";
        host.classList.remove("phone-steam-held");
      };
      s.resetPhoneTouch = resetTouch;
      host.addEventListener("touchstart", e => {
        resetTouch();
        if (motion.matches || !state.gpu || e.touches.length !== 1 ||
            e.target.closest?.("a,button,input,select,textarea")) return;
        const t = e.touches[0];
        touch = { id:t.identifier, x:t.clientX, y:t.clientY, started:e.timeStamp, scrolling:false, held:false };
        s.phoneGesture.phase = "pending";
        holdTimer = setTimeout(() => {
          if (!touch || touch.scrolling || document.hidden || !state.gpu) return;
          touch.held = true;
          s.phoneGesture.phase = "held"; s.phoneGesture.holds++;
          host.classList.add("phone-steam-held");
        }, state.gestureHoldMs);
      }, { passive:true });
      host.addEventListener("touchmove", e => {
        if (!touch) return;
        if (e.touches.length !== 1) { resetTouch(); return; }
        const t = [...e.touches].find(t => t.identifier === touch.id);
        if (!t) { resetTouch(); return; }
        // A busy renderer can deliver a quick move after the hold timer fired.
        // Use the input's original timestamp, not delivery time, so that swipe
        // still scrolls. A genuine move after a stationary hold remains held.
        if (Math.hypot(t.clientX-touch.x,t.clientY-touch.y) > 7 &&
            e.timeStamp-touch.started < state.gestureHoldMs) {
          clearTimeout(holdTimer); touch.scrolling = true; touch.held = false;
          host.classList.remove("phone-steam-held");
          if (s.phoneGesture.phase !== "scrolling") s.phoneGesture.scrolls++;
          s.phoneGesture.phase = "scrolling";
          return;
        }
        if (touch.held && e.cancelable) {
          // Cancel only an intentional held gesture. Never change touch-action
          // mid-gesture, and never prevent a normal quick page swipe.
          e.preventDefault();
          s.phoneGesture.moves++;
        } else if (!touch.held && Math.hypot(t.clientX-touch.x,t.clientY-touch.y) > 7) {
          clearTimeout(holdTimer); touch.scrolling = true;
          if (s.phoneGesture.phase !== "scrolling") s.phoneGesture.scrolls++;
          s.phoneGesture.phase = "scrolling";
        }
      }, { passive:false });
      for (const name of ["touchend", "touchcancel"])
        host.addEventListener(name, resetTouch, { passive:true });
      host.addEventListener("contextmenu", e => {
        if (touch?.held) e.preventDefault();
      });
      addEventListener("blur", resetTouch, { passive:true });
      addEventListener("resize", resetTouch, { passive:true });
    }

    // Source hover transitions must be identical on the presentation canvas.
    img.parentElement.addEventListener("pointerenter", () => sync(s), {
      passive: true,
    });
    img.parentElement.addEventListener("pointerleave", () => sync(s), {
      passive: true,
    });
  }
  let raf = 0,
    hidden = document.hidden;
  function wake() {
    if (!raf && !hidden) raf = requestAnimationFrame(tick);
  }
  function tick(now) {
    raf = 0;
    if (hidden) return;
    let active = false;
    for (const s of systems) {
      if (!s.visible || !s.image.naturalWidth) continue;
      active = true;
      const interval = s.signature ? 1000 / 30 : 1000 / 24;
      if (s.last && now - s.last < interval - 1) continue;
      if (motion.matches && s.ready && !s.needsDraw) continue;
      const dt = s.last ? Math.min(0.05, (now - s.last) / 1000) : 1 / 30;
      s.last = now;
      s.time += dt;
      current = s;
      try {
        if (!s.allocated) allocate(s);
        if (!motion.matches) {
          if (s.time >= s.nextEmit) {
            for (const [j, r] of s.roots.entries())
              for (let k = -1; k <= 1; k++) {
                const pulse =
                  0.65 + 0.25 * Math.sin(s.time * 0.63 + s.seed + k * 2.1 + j);
                splat(
                  s,
                  r[0] + k * r[2] * 0.22,
                  1 - r[1] + 0.012,
                  Math.sin(s.time * 0.4 + k + s.seed) * 0.7,
                  6.5 * pulse,
                  0.019 * pulse,
                  0.00012,
                );
              }
            s.nextEmit = s.time + 0.11;
          }
          if (s.signature) stir(s, dt);
          else if (s.pointer) {
            const p = s.pointer;
            splat(s, p.x, p.y, p.dx * 280, p.dy * 280, 0.004, 0.0014);
            s.pointer = null;
          }
          step(s, dt, s.time);
          if (s.signature) updateFinger(s, dt);
          s.steps++;
        }
        render(s, s.time);
        state.frames++;
      } catch (error) {
        state.errors.push(String(error));
        s.visible = false;
        s.image.classList.remove("steam-photo-source");
        s.canvas.classList.remove("is-ready");
      }
    }
    if (active && !motion.matches) wake();
  }
  state.inspect = () => ({
    engine: state.engine,
    gpu: state.gpu,
    contextCount: state.contextCount,
    frames: state.frames,
    paused: motion.matches,
    errors: [...state.errors],
    surfaces: systems.map((s) => ({
      profile: s.profile,
      visible: s.visible,
      ready: s.ready,
      draws: s.draws,
      steps: s.steps,
      time: s.time,
      roots: s.roots,
      width: s.canvas.width,
      height: s.canvas.height,
    })),
  });
  document.addEventListener(
    "visibilitychange",
    () => {
      hidden = document.hidden || !state.gpu;
      for (const s of systems) {
        s.last = 0;
        s.contact = s.pointer = s.prevPointer = null;
        s.resetPhoneTouch?.();
        clearFinger(s);
      }
      if (!hidden) wake();
    },
    { passive: true },
  );
  addEventListener(
    "resize",
    () => {
      for (const s of systems) sync(s);
      wake();
    },
    { passive: true },
  );
  motion.addEventListener("change", () => {
    state.paused = motion.matches;
    for (const s of systems) {
      s.last = 0;
      s.needsDraw = true;
      s.contact = s.pointer = s.prevPointer = null;
        s.resetPhoneTouch?.();
      clearFinger(s);
    }
    wake();
  });
  output.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    hidden = true;
    state.gpu = false;
    state.errors.push("WebGL context lost; original photos restored.");
    for (const s of systems) {
      s.resetPhoneTouch?.();
      s.image.classList.remove("steam-photo-source");
      s.canvas.classList.remove("is-ready");
    }
  });
  // Keep the readable photo fallback after context loss. Never reload the
  // entire page unexpectedly or resume with invalid GPU textures.
  wake();
})();
