import * as THREE from "three";
// Independent screen-space renderer. Depth and normal discontinuities produce
// silhouette/crease lines; the color pass retains artwork and material edges.
export class MangaRenderer {
  constructor(renderer) {
    this.renderer = renderer;
    this.color = new THREE.WebGLRenderTarget(1, 1, { samples: 4 });
    this.normal = new THREE.WebGLRenderTarget(1, 1, {
      depthTexture: new THREE.DepthTexture(1, 1),
    });
    this.normalMaterial = new THREE.MeshNormalMaterial();
    // Alpha is a material mask, not transparency. Authored ink must survive
    // the post-process without being thresholded or halftoned a second time.
    this.normalMaterial.defaultAttributeValues = { inkArtwork: [0] };
    this.normalMaterial.onBeforeCompile = (shader) => {
      shader.vertexShader =
        "attribute float inkArtwork; varying float artworkMask;\n" +
        shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\n artworkMask = inkArtwork;",
      );
      shader.fragmentShader =
        "varying float artworkMask;\n" + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        /\n}\s*$/,
        "\n gl_FragColor.a = artworkMask;\n}",
      );
    };
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        colorMap: { value: this.color.texture },
        normalMap: { value: this.normal.texture },
        depthMap: { value: this.normal.depthTexture },
        pixel: { value: new THREE.Vector2() },
        near: { value: 0.2 },
        far: { value: 2000 },
        tone: { value: 1 },
        pitch: { value: 5 },
      },
      vertexShader:
        "varying vec2 uv0; void main(){uv0=uv;gl_Position=vec4(position.xy,0.,1.);}",
      fragmentShader: `varying vec2 uv0;
      uniform sampler2D colorMap,normalMap,depthMap;
      uniform vec2 pixel;uniform float near,far,tone,pitch;
      float distanceAt(vec2 p){float z=texture2D(depthMap,p).r*2.-1.;return 2.*near*far/(far+near-z*(far-near));}
      void main(){
        vec3 base=texture2D(colorMap,uv0).rgb;
        float d=distanceAt(uv0);vec3 n=texture2D(normalMap,uv0).rgb*2.-1.;float crease=0.;float silhouette=0.;
        for(int j=0;j<4;j++){
          vec2 offset=j==0?vec2(pixel.x,0.):j==1?vec2(-pixel.x,0.):j==2?vec2(0.,pixel.y):vec2(0.,-pixel.y);
          float other=distanceAt(uv0+offset);vec3 nn=texture2D(normalMap,uv0+offset).rgb*2.-1.;
          silhouette=max(silhouette,smoothstep(.015,.04,abs(other-d)/max(d,1.)));
          crease=max(crease,smoothstep(.35,.65,length(n-nn)));
        }
        float edge=max(silhouette,crease*.65);
        float l=dot(base,vec3(.299,.587,.114));
        vec3 paper=mix(vec3(1.),vec3(.003),1.-smoothstep(.035,.16,l));
        if(tone>.5){
          float perceptual=pow(max(l,0.),1./2.2);
          float density=clamp((.45-perceptual)*1.1,0.,.46);
          vec2 q=fract(gl_FragCoord.xy/pitch)-.5;
          float radius=sqrt(density/3.14159265);float a=max(fwidth(length(q)),.025);
          float dotInk=1.-smoothstep(radius-a,radius+a,length(q));
          paper=mix(vec3(1.),vec3(.008),dotInk);
          paper=mix(paper,vec3(.003),1.-smoothstep(.035,.16,l));
        }
        float artwork=texture2D(normalMap,uv0).a;
        if(d<far*.99) paper=mix(paper,base,step(.5,artwork));
        gl_FragColor=vec4(mix(paper,vec3(.004),edge*(1.-artwork*.8)),1.);
        #include <colorspace_fragment>
      }`,
      depthTest: false,
      depthWrite: false,
    });
    this.overlay = new THREE.Scene();
    this.scene = new THREE.Scene();
    this.camera = new THREE.Camera();
    this.scene.add(
      new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material),
    );
  }
  render(scene, camera, mode, excluded = []) {
    const renderer = this.renderer,
      size = renderer.getDrawingBufferSize(new THREE.Vector2());
    if (this.color.width !== size.x || this.color.height !== size.y) {
      this.color.setSize(size.x, size.y);
      this.normal.setSize(size.x, size.y);
    }
    this.material.uniforms.pixel.value.set(1.15 / size.x, 1.15 / size.y);
    this.material.uniforms.near.value = camera.near;
    this.material.uniforms.far.value = camera.far;
    this.material.uniforms.tone.value = mode === "tone" ? 1 : 0;
    this.material.uniforms.pitch.value = 5 * renderer.getPixelRatio();
    const target = renderer.getRenderTarget(),
      background = scene.background,
      override = scene.overrideMaterial;
    const hidden = [];
    scene.traverse((o) => {
      if (o.isLine || o.isLineSegments || o.isSprite) {
        hidden.push([o, o.visible]);
        o.visible = false;
      }
    });
    for (const o of excluded) {
      hidden.push([o, o.visible]);
      o.visible = false;
    }
    scene.overrideMaterial = this.normalMaterial;
    scene.background = new THREE.Color(0x808080);
    renderer.setRenderTarget(this.normal);
    renderer.render(scene, camera);
    scene.overrideMaterial = override;
    scene.background = background;
    hidden.forEach(([o, v]) => (o.visible = v));
    this.overlay.clear();
    for (const [object, visible] of hidden) {
      if (object.isSprite && visible) {
        this.overlay.add(object.clone());
        object.visible = false;
      }
    }
    renderer.setRenderTarget(this.color);
    renderer.render(scene, camera);
    hidden.forEach(([o, v]) => (o.visible = v));
    document.documentElement.dataset.mangaTriangles = String(
      renderer.info.render.triangles,
    );
    renderer.setRenderTarget(target);
    renderer.render(this.scene, this.camera);
    const autoClear = renderer.autoClear;
    renderer.autoClear = false;
    renderer.clearDepth();
    renderer.render(this.overlay, camera);
    renderer.autoClear = autoClear;
  }
}
