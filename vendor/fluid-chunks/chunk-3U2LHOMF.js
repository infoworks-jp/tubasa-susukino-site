import{$ as Kn,$a as Pn,$b as ma,A as Ir,Ab as wi,Ac as Sa,Ad as Ua,Ae as Ki,Af as Ha,B as Nr,Ba as St,Bb as Ii,Bc as Dn,Bf as Va,C as yr,Ca as sa,Cb as Ni,Cc as Ea,Ce as mn,D as Fr,Da as la,Db as yi,Dc as xa,Dd as wn,De as Oa,E as Or,Ea as dn,Eb as Fi,Ec as Un,Ed as Qe,Ee as $i,F as Br,Fa as ti,Fb as Oi,Fc as Ma,Fe as In,G as Gr,Ga as Ft,Gb as Bi,H as Hr,Ha as Ut,I as Vr,Ia as wt,J as kr,Ja as ni,K as Wr,Ka as ii,L as zr,La as tn,Ld as pn,M as Xr,Ma as ca,N as Yr,Na as fa,O as qr,Oa as da,P as Kr,Pa as ua,Q as $r,Qa as At,Qc as Hi,Qd as wa,R as Zr,Ra as kt,Rc as Vi,S as qn,Sa as Wt,Sd as Ia,T as Qr,Ta as pa,U as Jr,Ua as ri,Ud as Yi,V as jr,Va as nn,W as ea,Wa as ai,Wd as hn,X as ta,Y as na,Ya as oi,Yc as Ta,Z as ia,Za as Cn,Zc as Aa,_ as vt,_a as bn,_b as ha,a as Ar,aa as $n,ab as Ln,ac as zt,ad as ki,ba as Zn,bb as si,bc as _a,bd as ze,ca as Qn,cb as li,cc as un,cd as Ze,ce as Na,d as Rr,da as Jn,db as ci,dc as Gi,dd as Wi,de as Rt,e as Wn,ea as jn,eb as fi,ec as qe,ed as Ra,ef as Zi,f as Cr,fa as ei,fb as di,fd as Ca,fg as _n,gb as ui,gd as ba,ge as ya,hb as pi,hd as Pa,i as sn,ib as hi,ig as Ji,ih as ji,j as br,ja as en,jb as mi,jd as dt,k as Qt,ka as Ht,kb as _i,ke as Fa,l as Jt,la as Mn,lb as gi,ld as Be,le as qi,m as ht,ma as Tn,mb as vi,md as Fe,n as Mt,na as cn,nb as Si,nd as tt,o as Tt,oa as ra,ob as Ei,of as Nn,p as ln,pa as An,pb as xi,pf as pt,q as zn,qa as aa,qb as Mi,qd as La,qf as Qi,r as Xn,ra as yt,rb as Ti,rd as ut,rf as Ba,s as Yn,sa as oa,sb as Ai,sf as Ct,t as Pr,tb as Ri,td as Et,tf as Ga,ua as fn,ub as Ci,ud as zi,v as jt,vb as bi,w as Lr,wa as mt,wb as Pi,wd as Da,x as Dr,xa as Rn,xb as Li,xg as ka,y as Ur,yb as Di,yc as ga,yd as Xt,yg as Wa,z as wr,za as Vt,zb as Ui,zc as va,zd as Xi}from"./chunk-JPLSRTB5.js";function ho(){let e=null,n=!1,t=null,i=null;function c(a,d){t(a,d),i=e.requestAnimationFrame(c)}return{start:function(){n!==!0&&t!==null&&(i=e.requestAnimationFrame(c),n=!0)},stop:function(){e.cancelAnimationFrame(i),n=!1},setAnimationLoop:function(a){t=a},setContext:function(a){e=a}}}function Co(e){let n=new WeakMap;function t(_,L){let C=_.array,B=_.usage,D=C.byteLength,p=e.createBuffer();e.bindBuffer(L,p),e.bufferData(L,C,B),_.onUploadCallback();let S;if(C instanceof Float32Array)S=e.FLOAT;else if(typeof Float16Array<"u"&&C instanceof Float16Array)S=e.HALF_FLOAT;else if(C instanceof Uint16Array)_.isFloat16BufferAttribute?S=e.HALF_FLOAT:S=e.UNSIGNED_SHORT;else if(C instanceof Int16Array)S=e.SHORT;else if(C instanceof Uint32Array)S=e.UNSIGNED_INT;else if(C instanceof Int32Array)S=e.INT;else if(C instanceof Int8Array)S=e.BYTE;else if(C instanceof Uint8Array)S=e.UNSIGNED_BYTE;else if(C instanceof Uint8ClampedArray)S=e.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+C);return{buffer:p,type:S,bytesPerElement:C.BYTES_PER_ELEMENT,version:_.version,size:D}}function i(_,L,C){let B=L.array,D=L.updateRanges;if(e.bindBuffer(C,_),D.length===0)e.bufferSubData(C,0,B);else{D.sort((S,M)=>S.start-M.start);let p=0;for(let S=1;S<D.length;S++){let M=D[p],y=D[S];y.start<=M.start+M.count+1?M.count=Math.max(M.count,y.start+y.count-M.start):(++p,D[p]=y)}D.length=p+1;for(let S=0,M=D.length;S<M;S++){let y=D[S];e.bufferSubData(C,y.start*B.BYTES_PER_ELEMENT,B,y.start,y.count)}L.clearUpdateRanges()}L.onUploadCallback()}function c(_){return _.isInterleavedBufferAttribute&&(_=_.data),n.get(_)}function a(_){_.isInterleavedBufferAttribute&&(_=_.data);let L=n.get(_);L&&(e.deleteBuffer(L.buffer),n.delete(_))}function d(_,L){if(_.isInterleavedBufferAttribute&&(_=_.data),_.isGLBufferAttribute){let B=n.get(_);(!B||B.version<_.version)&&n.set(_,{buffer:_.buffer,type:_.type,bytesPerElement:_.elementSize,version:_.version});return}let C=n.get(_);if(C===void 0)n.set(_,t(_,L));else if(C.version<_.version){if(C.size!==_.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(C.buffer,_,L),C.version=_.version}}return{get:c,remove:a,update:d}}var bo=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Po=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Lo=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Do=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Uo=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,wo=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Io=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,No=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,yo=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Fo=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Oo=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Bo=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Go=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Ho=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Vo=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,ko=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Wo=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,zo=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Xo=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Yo=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,qo=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Ko=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,$o=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Zo=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Qo=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Jo=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,jo=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,es=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ts=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ns=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,is="gl_FragColor = linearToOutputTexel( gl_FragColor );",rs=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,as=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,os=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,ss=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,ls=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,cs=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fs=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ds=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,us=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ps=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,hs=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,ms=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,_s=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,gs=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,vs=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Ss=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Es=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,xs=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ms=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ts=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,As=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Rs=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Cs=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,bs=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Ps=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ls=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Ds=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Us=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ws=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Is=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Ns=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ys=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Fs=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Os=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Bs=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Gs=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Hs=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Vs=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ks=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Ws=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,zs=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Xs=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Ys=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,qs=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ks=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,$s=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Zs=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Qs=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Js=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,js=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,el=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,tl=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,nl=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,il=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,rl=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,al=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ol=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,sl=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ll=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,cl=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,fl=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,dl=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,ul=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,pl=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,hl=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ml=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,_l=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,gl=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,vl=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Sl=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,El=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,xl=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Ml=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Tl=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Al=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Rl=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Cl=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,bl=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Pl=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ll=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Dl=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ul=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wl=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Il=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Nl=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,yl=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Fl=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ol=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bl=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Gl=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Hl=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Vl=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,kl=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Wl=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zl=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Xl=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Yl=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,ql=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Kl=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,$l=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Zl=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Ql=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Jl=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,jl=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ec=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,tc=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,nc=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ic=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,rc=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ac=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,De={alphahash_fragment:bo,alphahash_pars_fragment:Po,alphamap_fragment:Lo,alphamap_pars_fragment:Do,alphatest_fragment:Uo,alphatest_pars_fragment:wo,aomap_fragment:Io,aomap_pars_fragment:No,batching_pars_vertex:yo,batching_vertex:Fo,begin_vertex:Oo,beginnormal_vertex:Bo,bsdfs:Go,iridescence_fragment:Ho,bumpmap_pars_fragment:Vo,clipping_planes_fragment:ko,clipping_planes_pars_fragment:Wo,clipping_planes_pars_vertex:zo,clipping_planes_vertex:Xo,color_fragment:Yo,color_pars_fragment:qo,color_pars_vertex:Ko,color_vertex:$o,common:Zo,cube_uv_reflection_fragment:Qo,defaultnormal_vertex:Jo,displacementmap_pars_vertex:jo,displacementmap_vertex:es,emissivemap_fragment:ts,emissivemap_pars_fragment:ns,colorspace_fragment:is,colorspace_pars_fragment:rs,envmap_fragment:as,envmap_common_pars_fragment:os,envmap_pars_fragment:ss,envmap_pars_vertex:ls,envmap_physical_pars_fragment:Ss,envmap_vertex:cs,fog_vertex:fs,fog_pars_vertex:ds,fog_fragment:us,fog_pars_fragment:ps,gradientmap_pars_fragment:hs,lightmap_pars_fragment:ms,lights_lambert_fragment:_s,lights_lambert_pars_fragment:gs,lights_pars_begin:vs,lights_toon_fragment:Es,lights_toon_pars_fragment:xs,lights_phong_fragment:Ms,lights_phong_pars_fragment:Ts,lights_physical_fragment:As,lights_physical_pars_fragment:Rs,lights_fragment_begin:Cs,lights_fragment_maps:bs,lights_fragment_end:Ps,logdepthbuf_fragment:Ls,logdepthbuf_pars_fragment:Ds,logdepthbuf_pars_vertex:Us,logdepthbuf_vertex:ws,map_fragment:Is,map_pars_fragment:Ns,map_particle_fragment:ys,map_particle_pars_fragment:Fs,metalnessmap_fragment:Os,metalnessmap_pars_fragment:Bs,morphinstance_vertex:Gs,morphcolor_vertex:Hs,morphnormal_vertex:Vs,morphtarget_pars_vertex:ks,morphtarget_vertex:Ws,normal_fragment_begin:zs,normal_fragment_maps:Xs,normal_pars_fragment:Ys,normal_pars_vertex:qs,normal_vertex:Ks,normalmap_pars_fragment:$s,clearcoat_normal_fragment_begin:Zs,clearcoat_normal_fragment_maps:Qs,clearcoat_pars_fragment:Js,iridescence_pars_fragment:js,opaque_fragment:el,packing:tl,premultiplied_alpha_fragment:nl,project_vertex:il,dithering_fragment:rl,dithering_pars_fragment:al,roughnessmap_fragment:ol,roughnessmap_pars_fragment:sl,shadowmap_pars_fragment:ll,shadowmap_pars_vertex:cl,shadowmap_vertex:fl,shadowmask_pars_fragment:dl,skinbase_vertex:ul,skinning_pars_vertex:pl,skinning_vertex:hl,skinnormal_vertex:ml,specularmap_fragment:_l,specularmap_pars_fragment:gl,tonemapping_fragment:vl,tonemapping_pars_fragment:Sl,transmission_fragment:El,transmission_pars_fragment:xl,uv_pars_fragment:Ml,uv_pars_vertex:Tl,uv_vertex:Al,worldpos_vertex:Rl,background_vert:Cl,background_frag:bl,backgroundCube_vert:Pl,backgroundCube_frag:Ll,cube_vert:Dl,cube_frag:Ul,depth_vert:wl,depth_frag:Il,distance_vert:Nl,distance_frag:yl,equirect_vert:Fl,equirect_frag:Ol,linedashed_vert:Bl,linedashed_frag:Gl,meshbasic_vert:Hl,meshbasic_frag:Vl,meshlambert_vert:kl,meshlambert_frag:Wl,meshmatcap_vert:zl,meshmatcap_frag:Xl,meshnormal_vert:Yl,meshnormal_frag:ql,meshphong_vert:Kl,meshphong_frag:$l,meshphysical_vert:Zl,meshphysical_frag:Ql,meshtoon_vert:Jl,meshtoon_frag:jl,points_vert:ec,points_frag:tc,shadow_vert:nc,shadow_frag:ic,sprite_vert:rc,sprite_frag:ac},ae={common:{diffuse:{value:new Qe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Fe}},envmap:{envMap:{value:null},envMapRotation:{value:new Fe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Fe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Fe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Fe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Fe},normalScale:{value:new dt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Fe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Fe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Fe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Fe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Qe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Qe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0},uvTransform:{value:new Fe}},sprite:{diffuse:{value:new Qe(16777215)},opacity:{value:1},center:{value:new dt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}}},Pt={basic:{uniforms:pt([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.fog]),vertexShader:De.meshbasic_vert,fragmentShader:De.meshbasic_frag},lambert:{uniforms:pt([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,ae.lights,{emissive:{value:new Qe(0)},envMapIntensity:{value:1}}]),vertexShader:De.meshlambert_vert,fragmentShader:De.meshlambert_frag},phong:{uniforms:pt([ae.common,ae.specularmap,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,ae.lights,{emissive:{value:new Qe(0)},specular:{value:new Qe(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:De.meshphong_vert,fragmentShader:De.meshphong_frag},standard:{uniforms:pt([ae.common,ae.envmap,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.roughnessmap,ae.metalnessmap,ae.fog,ae.lights,{emissive:{value:new Qe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:De.meshphysical_vert,fragmentShader:De.meshphysical_frag},toon:{uniforms:pt([ae.common,ae.aomap,ae.lightmap,ae.emissivemap,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.gradientmap,ae.fog,ae.lights,{emissive:{value:new Qe(0)}}]),vertexShader:De.meshtoon_vert,fragmentShader:De.meshtoon_frag},matcap:{uniforms:pt([ae.common,ae.bumpmap,ae.normalmap,ae.displacementmap,ae.fog,{matcap:{value:null}}]),vertexShader:De.meshmatcap_vert,fragmentShader:De.meshmatcap_frag},points:{uniforms:pt([ae.points,ae.fog]),vertexShader:De.points_vert,fragmentShader:De.points_frag},dashed:{uniforms:pt([ae.common,ae.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:De.linedashed_vert,fragmentShader:De.linedashed_frag},depth:{uniforms:pt([ae.common,ae.displacementmap]),vertexShader:De.depth_vert,fragmentShader:De.depth_frag},normal:{uniforms:pt([ae.common,ae.bumpmap,ae.normalmap,ae.displacementmap,{opacity:{value:1}}]),vertexShader:De.meshnormal_vert,fragmentShader:De.meshnormal_frag},sprite:{uniforms:pt([ae.sprite,ae.fog]),vertexShader:De.sprite_vert,fragmentShader:De.sprite_frag},background:{uniforms:{uvTransform:{value:new Fe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:De.background_vert,fragmentShader:De.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Fe}},vertexShader:De.backgroundCube_vert,fragmentShader:De.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:De.cube_vert,fragmentShader:De.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:De.equirect_vert,fragmentShader:De.equirect_frag},distance:{uniforms:pt([ae.common,ae.displacementmap,{referencePosition:{value:new Be},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:De.distance_vert,fragmentShader:De.distance_frag},shadow:{uniforms:pt([ae.lights,ae.fog,{color:{value:new Qe(0)},opacity:{value:1}}]),vertexShader:De.shadow_vert,fragmentShader:De.shadow_frag}};Pt.physical={uniforms:pt([Pt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Fe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Fe},clearcoatNormalScale:{value:new dt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Fe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Fe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Fe},sheen:{value:0},sheenColor:{value:new Qe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Fe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Fe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Fe},transmissionSamplerSize:{value:new dt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Fe},attenuationDistance:{value:0},attenuationColor:{value:new Qe(0)},specularColor:{value:new Qe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Fe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Fe},anisotropyVector:{value:new dt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Fe}}]),vertexShader:De.meshphysical_vert,fragmentShader:De.meshphysical_frag};var yn={r:0,b:0,g:0},Yt=new Xi,oc=new Xt;function sc(e,n,t,i,c,a){let d=new Qe(0),_=c===!0?0:1,L,C,B=null,D=0,p=null;function S(g){let T=g.isScene===!0?g.background:null;if(T&&T.isTexture){let E=g.backgroundBlurriness>0;T=n.get(T,E)}return T}function M(g){let T=!1,E=S(g);E===null?l(d,_):E&&E.isColor&&(l(E,1),T=!0);let N=e.xr.getEnvironmentBlendMode();N==="additive"?t.buffers.color.setClear(0,0,0,1,a):N==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,a),(e.autoClear||T)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function y(g,T){let E=S(T);E&&(E.isCubeTexture||E.mapping===cn)?(C===void 0&&(C=new Rt(new In(1,1,1),new Ct({name:"BackgroundCubeMaterial",uniforms:Nn(Pt.backgroundCube.uniforms),vertexShader:Pt.backgroundCube.vertexShader,fragmentShader:Pt.backgroundCube.fragmentShader,side:ht,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),C.geometry.deleteAttribute("normal"),C.geometry.deleteAttribute("uv"),C.onBeforeRender=function(N,b,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(C.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(C)),Yt.copy(T.backgroundRotation),Yt.x*=-1,Yt.y*=-1,Yt.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Yt.y*=-1,Yt.z*=-1),C.material.uniforms.envMap.value=E,C.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,C.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,C.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,C.material.uniforms.backgroundRotation.value.setFromMatrix4(oc.makeRotationFromEuler(Yt)),C.material.toneMapped=tt.getTransfer(E.colorSpace)!==qe,(B!==E||D!==E.version||p!==e.toneMapping)&&(C.material.needsUpdate=!0,B=E,D=E.version,p=e.toneMapping),C.layers.enableAll(),g.unshift(C,C.geometry,C.material,0,0,null)):E&&E.isTexture&&(L===void 0&&(L=new Rt(new Zi(2,2),new Ct({name:"BackgroundMaterial",uniforms:Nn(Pt.background.uniforms),vertexShader:Pt.background.vertexShader,fragmentShader:Pt.background.fragmentShader,side:Jt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),L.geometry.deleteAttribute("normal"),Object.defineProperty(L.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(L)),L.material.uniforms.t2D.value=E,L.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,L.material.toneMapped=tt.getTransfer(E.colorSpace)!==qe,E.matrixAutoUpdate===!0&&E.updateMatrix(),L.material.uniforms.uvTransform.value.copy(E.matrix),(B!==E||D!==E.version||p!==e.toneMapping)&&(L.material.needsUpdate=!0,B=E,D=E.version,p=e.toneMapping),L.layers.enableAll(),g.unshift(L,L.geometry,L.material,0,0,null))}function l(g,T){g.getRGB(yn,Qi(e)),t.buffers.color.setClear(yn.r,yn.g,yn.b,T,a)}function s(){C!==void 0&&(C.geometry.dispose(),C.material.dispose(),C=void 0),L!==void 0&&(L.geometry.dispose(),L.material.dispose(),L=void 0)}return{getClearColor:function(){return d},setClearColor:function(g,T=1){d.set(g),_=T,l(d,_)},getClearAlpha:function(){return _},setClearAlpha:function(g){_=g,l(d,_)},render:M,addToRenderList:y,dispose:s}}function lc(e,n){let t=e.getParameter(e.MAX_VERTEX_ATTRIBS),i={},c=p(null),a=c,d=!1;function _(R,V,z,W,Y){let O=!1,F=D(R,W,z,V);a!==F&&(a=F,C(a.object)),O=S(R,W,z,Y),O&&M(R,W,z,Y),Y!==null&&n.update(Y,e.ELEMENT_ARRAY_BUFFER),(O||d)&&(d=!1,E(R,V,z,W),Y!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n.get(Y).buffer))}function L(){return e.createVertexArray()}function C(R){return e.bindVertexArray(R)}function B(R){return e.deleteVertexArray(R)}function D(R,V,z,W){let Y=W.wireframe===!0,O=i[V.id];O===void 0&&(O={},i[V.id]=O);let F=R.isInstancedMesh===!0?R.id:0,ie=O[F];ie===void 0&&(ie={},O[F]=ie);let re=ie[z.id];re===void 0&&(re={},ie[z.id]=re);let Me=re[Y];return Me===void 0&&(Me=p(L()),re[Y]=Me),Me}function p(R){let V=[],z=[],W=[];for(let Y=0;Y<t;Y++)V[Y]=0,z[Y]=0,W[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:V,enabledAttributes:z,attributeDivisors:W,object:R,attributes:{},index:null}}function S(R,V,z,W){let Y=a.attributes,O=V.attributes,F=0,ie=z.getAttributes();for(let re in ie)if(ie[re].location>=0){let Ae=Y[re],he=O[re];if(he===void 0&&(re==="instanceMatrix"&&R.instanceMatrix&&(he=R.instanceMatrix),re==="instanceColor"&&R.instanceColor&&(he=R.instanceColor)),Ae===void 0||Ae.attribute!==he||he&&Ae.data!==he.data)return!0;F++}return a.attributesNum!==F||a.index!==W}function M(R,V,z,W){let Y={},O=V.attributes,F=0,ie=z.getAttributes();for(let re in ie)if(ie[re].location>=0){let Ae=O[re];Ae===void 0&&(re==="instanceMatrix"&&R.instanceMatrix&&(Ae=R.instanceMatrix),re==="instanceColor"&&R.instanceColor&&(Ae=R.instanceColor));let he={};he.attribute=Ae,Ae&&Ae.data&&(he.data=Ae.data),Y[re]=he,F++}a.attributes=Y,a.attributesNum=F,a.index=W}function y(){let R=a.newAttributes;for(let V=0,z=R.length;V<z;V++)R[V]=0}function l(R){s(R,0)}function s(R,V){let z=a.newAttributes,W=a.enabledAttributes,Y=a.attributeDivisors;z[R]=1,W[R]===0&&(e.enableVertexAttribArray(R),W[R]=1),Y[R]!==V&&(e.vertexAttribDivisor(R,V),Y[R]=V)}function g(){let R=a.newAttributes,V=a.enabledAttributes;for(let z=0,W=V.length;z<W;z++)V[z]!==R[z]&&(e.disableVertexAttribArray(z),V[z]=0)}function T(R,V,z,W,Y,O,F){F===!0?e.vertexAttribIPointer(R,V,z,Y,O):e.vertexAttribPointer(R,V,z,W,Y,O)}function E(R,V,z,W){y();let Y=W.attributes,O=z.getAttributes(),F=V.defaultAttributeValues;for(let ie in O){let re=O[ie];if(re.location>=0){let Me=Y[ie];if(Me===void 0&&(ie==="instanceMatrix"&&R.instanceMatrix&&(Me=R.instanceMatrix),ie==="instanceColor"&&R.instanceColor&&(Me=R.instanceColor)),Me!==void 0){let Ae=Me.normalized,he=Me.itemSize,Ne=n.get(Me);if(Ne===void 0)continue;let Je=Ne.buffer,je=Ne.type,X=Ne.bytesPerElement,j=je===e.INT||je===e.UNSIGNED_INT||Me.gpuType===ti;if(Me.isInterleavedBufferAttribute){let ne=Me.data,Le=ne.stride,Te=Me.offset;if(ne.isInstancedInterleavedBuffer){for(let Ce=0;Ce<re.locationSize;Ce++)s(re.location+Ce,ne.meshPerAttribute);R.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let Ce=0;Ce<re.locationSize;Ce++)l(re.location+Ce);e.bindBuffer(e.ARRAY_BUFFER,Je);for(let Ce=0;Ce<re.locationSize;Ce++)T(re.location+Ce,he/re.locationSize,je,Ae,Le*X,(Te+he/re.locationSize*Ce)*X,j)}else{if(Me.isInstancedBufferAttribute){for(let ne=0;ne<re.locationSize;ne++)s(re.location+ne,Me.meshPerAttribute);R.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=Me.meshPerAttribute*Me.count)}else for(let ne=0;ne<re.locationSize;ne++)l(re.location+ne);e.bindBuffer(e.ARRAY_BUFFER,Je);for(let ne=0;ne<re.locationSize;ne++)T(re.location+ne,he/re.locationSize,je,Ae,he*X,he/re.locationSize*ne*X,j)}}else if(F!==void 0){let Ae=F[ie];if(Ae!==void 0)switch(Ae.length){case 2:e.vertexAttrib2fv(re.location,Ae);break;case 3:e.vertexAttrib3fv(re.location,Ae);break;case 4:e.vertexAttrib4fv(re.location,Ae);break;default:e.vertexAttrib1fv(re.location,Ae)}}}}g()}function N(){h();for(let R in i){let V=i[R];for(let z in V){let W=V[z];for(let Y in W){let O=W[Y];for(let F in O)B(O[F].object),delete O[F];delete W[Y]}}delete i[R]}}function b(R){if(i[R.id]===void 0)return;let V=i[R.id];for(let z in V){let W=V[z];for(let Y in W){let O=W[Y];for(let F in O)B(O[F].object),delete O[F];delete W[Y]}}delete i[R.id]}function w(R){for(let V in i){let z=i[V];for(let W in z){let Y=z[W];if(Y[R.id]===void 0)continue;let O=Y[R.id];for(let F in O)B(O[F].object),delete O[F];delete Y[R.id]}}}function f(R){for(let V in i){let z=i[V],W=R.isInstancedMesh===!0?R.id:0,Y=z[W];if(Y!==void 0){for(let O in Y){let F=Y[O];for(let ie in F)B(F[ie].object),delete F[ie];delete Y[O]}delete z[W],Object.keys(z).length===0&&delete i[V]}}}function h(){$(),d=!0,a!==c&&(a=c,C(a.object))}function $(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:_,reset:h,resetDefaultState:$,dispose:N,releaseStatesOfGeometry:b,releaseStatesOfObject:f,releaseStatesOfProgram:w,initAttributes:y,enableAttribute:l,disableUnusedAttributes:g}}function cc(e,n,t){let i;function c(C){i=C}function a(C,B){e.drawArrays(i,C,B),t.update(B,i,1)}function d(C,B,D){D!==0&&(e.drawArraysInstanced(i,C,B,D),t.update(B,i,D))}function _(C,B,D){if(D===0)return;n.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,C,0,B,0,D);let S=0;for(let M=0;M<D;M++)S+=B[M];t.update(S,i,1)}function L(C,B,D,p){if(D===0)return;let S=n.get("WEBGL_multi_draw");if(S===null)for(let M=0;M<C.length;M++)d(C[M],B[M],p[M]);else{S.multiDrawArraysInstancedWEBGL(i,C,0,B,0,p,0,D);let M=0;for(let y=0;y<D;y++)M+=B[y]*p[y];t.update(M,i,1)}}this.setMode=c,this.render=a,this.renderInstances=d,this.renderMultiDraw=_,this.renderMultiDrawInstances=L}function fc(e,n,t,i){let c;function a(){if(c!==void 0)return c;if(n.has("EXT_texture_filter_anisotropic")===!0){let w=n.get("EXT_texture_filter_anisotropic");c=e.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else c=0;return c}function d(w){return!(w!==At&&i.convert(w)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))}function _(w){let f=w===wt&&(n.has("EXT_color_buffer_half_float")||n.has("EXT_color_buffer_float"));return!(w!==St&&i.convert(w)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==Ut&&!f)}function L(w){if(w==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let C=t.precision!==void 0?t.precision:"highp",B=L(C);B!==C&&(ze("WebGLRenderer:",C,"not supported, using",B,"instead."),C=B);let D=t.logarithmicDepthBuffer===!0,p=t.reversedDepthBuffer===!0&&n.has("EXT_clip_control"),S=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),M=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=e.getParameter(e.MAX_TEXTURE_SIZE),l=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),s=e.getParameter(e.MAX_VERTEX_ATTRIBS),g=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),T=e.getParameter(e.MAX_VARYING_VECTORS),E=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),N=e.getParameter(e.MAX_SAMPLES),b=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:L,textureFormatReadable:d,textureTypeReadable:_,precision:C,logarithmicDepthBuffer:D,reversedDepthBuffer:p,maxTextures:S,maxVertexTextures:M,maxTextureSize:y,maxCubemapSize:l,maxAttributes:s,maxVertexUniforms:g,maxVaryings:T,maxFragmentUniforms:E,maxSamples:N,samples:b}}function dc(e){let n=this,t=null,i=0,c=!1,a=!1,d=new Fa,_=new Fe,L={value:null,needsUpdate:!1};this.uniform=L,this.numPlanes=0,this.numIntersection=0,this.init=function(D,p){let S=D.length!==0||p||i!==0||c;return c=p,i=D.length,S},this.beginShadows=function(){a=!0,B(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(D,p){t=B(D,p,0)},this.setState=function(D,p,S){let M=D.clippingPlanes,y=D.clipIntersection,l=D.clipShadows,s=e.get(D);if(!c||M===null||M.length===0||a&&!l)a?B(null):C();else{let g=a?0:i,T=g*4,E=s.clippingState||null;L.value=E,E=B(M,p,T,S);for(let N=0;N!==T;++N)E[N]=t[N];s.clippingState=E,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=g}};function C(){L.value!==t&&(L.value=t,L.needsUpdate=i>0),n.numPlanes=i,n.numIntersection=0}function B(D,p,S,M){let y=D!==null?D.length:0,l=null;if(y!==0){if(l=L.value,M!==!0||l===null){let s=S+y*4,g=p.matrixWorldInverse;_.getNormalMatrix(g),(l===null||l.length<s)&&(l=new Float32Array(s));for(let T=0,E=S;T!==y;++T,E+=4)d.copy(D[T]).applyMatrix4(g,_),d.normal.toArray(l,E),l[E+3]=d.constant}L.value=l,L.needsUpdate=!0}return n.numPlanes=y,n.numIntersection=0,l}}var Ot=4,za=[.125,.215,.35,.446,.526,.582],Kt=20,uc=256,gn=new Ji,Xa=new Qe,er=null,tr=0,nr=0,ir=!1,pc=new Be,On=class{constructor(n){this._renderer=n,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(n,t=0,i=.1,c=100,a={}){let{size:d=256,position:_=pc}=a;er=this._renderer.getRenderTarget(),tr=this._renderer.getActiveCubeFace(),nr=this._renderer.getActiveMipmapLevel(),ir=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(d);let L=this._allocateTargets();return L.depthBuffer=!0,this._sceneToCubeUV(n,i,c,L,_),t>0&&this._blur(L,0,0,t),this._applyPMREM(L),this._cleanup(L),L}fromEquirectangular(n,t=null){return this._fromTexture(n,t)}fromCubemap(n,t=null){return this._fromTexture(n,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ka(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=qa(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(n){this._lodMax=Math.floor(Math.log2(n)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let n=0;n<this._lodMeshes.length;n++)this._lodMeshes[n].geometry.dispose()}_cleanup(n){this._renderer.setRenderTarget(er,tr,nr),this._renderer.xr.enabled=ir,n.scissorTest=!1,rn(n,0,0,n.width,n.height)}_fromTexture(n,t){n.mapping===en||n.mapping===Ht?this._setSize(n.image.length===0?16:n.image[0].width||n.image[0].image.width):this._setSize(n.image.width/4),er=this._renderer.getRenderTarget(),tr=this._renderer.getActiveCubeFace(),nr=this._renderer.getActiveMipmapLevel(),ir=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(n,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let n=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:mt,minFilter:mt,generateMipmaps:!1,type:wt,format:At,colorSpace:un,depthBuffer:!1},c=Ya(n,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==n||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ya(n,t,i);let{_lodMax:a}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=hc(a)),this._blurMaterial=_c(a,n,t),this._ggxMaterial=mc(a,n,t)}return c}_compileMaterial(n){let t=new Rt(new hn,n);this._renderer.compile(t,gn)}_sceneToCubeUV(n,t,i,c,a){let L=new _n(90,1,t,i),C=[1,-1,1,1,1,1],B=[1,1,1,-1,-1,-1],D=this._renderer,p=D.autoClear,S=D.toneMapping;D.getClearColor(Xa),D.toneMapping=vt,D.autoClear=!1,D.state.buffers.depth.getReversed()&&(D.setRenderTarget(c),D.clearDepth(),D.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Rt(new In,new Na({name:"PMREM.Background",side:ht,depthWrite:!1,depthTest:!1})));let y=this._backgroundBox,l=y.material,s=!1,g=n.background;g?g.isColor&&(l.color.copy(g),n.background=null,s=!0):(l.color.copy(Xa),s=!0);for(let T=0;T<6;T++){let E=T%3;E===0?(L.up.set(0,C[T],0),L.position.set(a.x,a.y,a.z),L.lookAt(a.x+B[T],a.y,a.z)):E===1?(L.up.set(0,0,C[T]),L.position.set(a.x,a.y,a.z),L.lookAt(a.x,a.y+B[T],a.z)):(L.up.set(0,C[T],0),L.position.set(a.x,a.y,a.z),L.lookAt(a.x,a.y,a.z+B[T]));let N=this._cubeSize;rn(c,E*N,T>2?N:0,N,N),D.setRenderTarget(c),s&&D.render(y,L),D.render(n,L)}D.toneMapping=S,D.autoClear=p,n.background=g}_textureToCubeUV(n,t){let i=this._renderer,c=n.mapping===en||n.mapping===Ht;c?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ka()),this._cubemapMaterial.uniforms.flipEnvMap.value=n.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=qa());let a=c?this._cubemapMaterial:this._equirectMaterial,d=this._lodMeshes[0];d.material=a;let _=a.uniforms;_.envMap.value=n;let L=this._cubeSize;rn(t,0,0,3*L,2*L),i.setRenderTarget(t),i.render(d,gn)}_applyPMREM(n){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let c=this._lodMeshes.length;for(let a=1;a<c;a++)this._applyGGXFilter(n,a-1,a);t.autoClear=i}_applyGGXFilter(n,t,i){let c=this._renderer,a=this._pingPongRenderTarget,d=this._ggxMaterial,_=this._lodMeshes[i];_.material=d;let L=d.uniforms,C=i/(this._lodMeshes.length-1),B=t/(this._lodMeshes.length-1),D=Math.sqrt(C*C-B*B),p=0+C*1.25,S=D*p,{_lodMax:M}=this,y=this._sizeLods[i],l=3*y*(i>M-Ot?i-M+Ot:0),s=4*(this._cubeSize-y);L.envMap.value=n.texture,L.roughness.value=S,L.mipInt.value=M-t,rn(a,l,s,3*y,2*y),c.setRenderTarget(a),c.render(_,gn),L.envMap.value=a.texture,L.roughness.value=0,L.mipInt.value=M-i,rn(n,l,s,3*y,2*y),c.setRenderTarget(n),c.render(_,gn)}_blur(n,t,i,c,a){let d=this._pingPongRenderTarget;this._halfBlur(n,d,t,i,c,"latitudinal",a),this._halfBlur(d,n,i,i,c,"longitudinal",a)}_halfBlur(n,t,i,c,a,d,_){let L=this._renderer,C=this._blurMaterial;d!=="latitudinal"&&d!=="longitudinal"&&Ze("blur direction must be either latitudinal or longitudinal!");let B=3,D=this._lodMeshes[c];D.material=C;let p=C.uniforms,S=this._sizeLods[i]-1,M=isFinite(a)?Math.PI/(2*S):2*Math.PI/(2*Kt-1),y=a/M,l=isFinite(a)?1+Math.floor(B*y):Kt;l>Kt&&ze(`sigmaRadians, ${a}, is too large and will clip, as it requested ${l} samples when the maximum is set to ${Kt}`);let s=[],g=0;for(let w=0;w<Kt;++w){let f=w/y,h=Math.exp(-f*f/2);s.push(h),w===0?g+=h:w<l&&(g+=2*h)}for(let w=0;w<s.length;w++)s[w]=s[w]/g;p.envMap.value=n.texture,p.samples.value=l,p.weights.value=s,p.latitudinal.value=d==="latitudinal",_&&(p.poleAxis.value=_);let{_lodMax:T}=this;p.dTheta.value=M,p.mipInt.value=T-i;let E=this._sizeLods[c],N=3*E*(c>T-Ot?c-T+Ot:0),b=4*(this._cubeSize-E);rn(t,N,b,3*E,2*E),L.setRenderTarget(t),L.render(D,gn)}};function hc(e){let n=[],t=[],i=[],c=e,a=e-Ot+1+za.length;for(let d=0;d<a;d++){let _=Math.pow(2,c);n.push(_);let L=1/_;d>e-Ot?L=za[d-e+Ot-1]:d===0&&(L=0),t.push(L);let C=1/(_-2),B=-C,D=1+C,p=[B,B,D,B,D,D,B,B,D,D,B,D],S=6,M=6,y=3,l=2,s=1,g=new Float32Array(y*M*S),T=new Float32Array(l*M*S),E=new Float32Array(s*M*S);for(let b=0;b<S;b++){let w=b%3*2/3-1,f=b>2?0:-1,h=[w,f,0,w+2/3,f,0,w+2/3,f+1,0,w,f,0,w+2/3,f+1,0,w,f+1,0];g.set(h,y*M*b),T.set(p,l*M*b);let $=[b,b,b,b,b,b];E.set($,s*M*b)}let N=new hn;N.setAttribute("position",new pn(g,y)),N.setAttribute("uv",new pn(T,l)),N.setAttribute("faceIndex",new pn(E,s)),i.push(new Rt(N,null)),c>Ot&&c--}return{lodMeshes:i,sizeLods:n,sigmas:t}}function Ya(e,n,t){let i=new Et(e,n,t);return i.texture.mapping=cn,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function rn(e,n,t,i,c){e.viewport.set(n,t,i,c),e.scissor.set(n,t,i,c)}function mc(e,n,t){return new Ct({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:uc,CUBEUV_TEXEL_WIDTH:1/n,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Gn(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Tt,depthTest:!1,depthWrite:!1})}function _c(e,n,t){let i=new Float32Array(Kt),c=new Be(0,1,0);return new Ct({name:"SphericalGaussianBlur",defines:{n:Kt,CUBEUV_TEXEL_WIDTH:1/n,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:c}},vertexShader:Gn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Tt,depthTest:!1,depthWrite:!1})}function qa(){return new Ct({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Gn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Tt,depthTest:!1,depthWrite:!1})}function Ka(){return new Ct({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Gn(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Tt,depthTest:!1,depthWrite:!1})}function Gn(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}var Bn=class extends Et{constructor(n=1,t={}){super(n,n,t),this.isWebGLCubeRenderTarget=!0;let i={width:n,height:n,depth:1},c=[i,i,i,i,i,i];this.texture=new Ki(c),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(n,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},c=new In(5,5,5),a=new Ct({name:"CubemapFromEquirect",uniforms:Nn(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:ht,blending:Tt});a.uniforms.tEquirect.value=t;let d=new Rt(c,a),_=t.minFilter;return t.minFilter===Vt&&(t.minFilter=mt),new ka(1,10,this).update(n,d),t.minFilter=_,d.geometry.dispose(),d.material.dispose(),this}clear(n,t=!0,i=!0,c=!0){let a=n.getRenderTarget();for(let d=0;d<6;d++)n.setRenderTarget(this,d),n.clear(t,i,c);n.setRenderTarget(a)}};function gc(e){let n=new WeakMap,t=new WeakMap,i=null;function c(p,S=!1){return p==null?null:S?d(p):a(p)}function a(p){if(p&&p.isTexture){let S=p.mapping;if(S===Mn||S===Tn)if(n.has(p)){let M=n.get(p).texture;return _(M,p.mapping)}else{let M=p.image;if(M&&M.height>0){let y=new Bn(M.height);return y.fromEquirectangularTexture(e,p),n.set(p,y),p.addEventListener("dispose",C),_(y.texture,p.mapping)}else return null}}return p}function d(p){if(p&&p.isTexture){let S=p.mapping,M=S===Mn||S===Tn,y=S===en||S===Ht;if(M||y){let l=t.get(p),s=l!==void 0?l.texture.pmremVersion:0;if(p.isRenderTargetTexture&&p.pmremVersion!==s)return i===null&&(i=new On(e)),l=M?i.fromEquirectangular(p,l):i.fromCubemap(p,l),l.texture.pmremVersion=p.pmremVersion,t.set(p,l),l.texture;if(l!==void 0)return l.texture;{let g=p.image;return M&&g&&g.height>0||y&&g&&L(g)?(i===null&&(i=new On(e)),l=M?i.fromEquirectangular(p):i.fromCubemap(p),l.texture.pmremVersion=p.pmremVersion,t.set(p,l),p.addEventListener("dispose",B),l.texture):null}}}return p}function _(p,S){return S===Mn?p.mapping=en:S===Tn&&(p.mapping=Ht),p}function L(p){let S=0,M=6;for(let y=0;y<M;y++)p[y]!==void 0&&S++;return S===M}function C(p){let S=p.target;S.removeEventListener("dispose",C);let M=n.get(S);M!==void 0&&(n.delete(S),M.dispose())}function B(p){let S=p.target;S.removeEventListener("dispose",B);let M=t.get(S);M!==void 0&&(t.delete(S),M.dispose())}function D(){n=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:c,dispose:D}}function vc(e){let n={};function t(i){if(n[i]!==void 0)return n[i];let c=e.getExtension(i);return n[i]=c,c}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let c=t(i);return c===null&&Wi("WebGLRenderer: "+i+" extension not supported."),c}}}function Sc(e,n,t,i){let c={},a=new WeakMap;function d(D){let p=D.target;p.index!==null&&n.remove(p.index);for(let M in p.attributes)n.remove(p.attributes[M]);p.removeEventListener("dispose",d),delete c[p.id];let S=a.get(p);S&&(n.remove(S),a.delete(p)),i.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function _(D,p){return c[p.id]===!0||(p.addEventListener("dispose",d),c[p.id]=!0,t.memory.geometries++),p}function L(D){let p=D.attributes;for(let S in p)n.update(p[S],e.ARRAY_BUFFER)}function C(D){let p=[],S=D.index,M=D.attributes.position,y=0;if(M===void 0)return;if(S!==null){let g=S.array;y=S.version;for(let T=0,E=g.length;T<E;T+=3){let N=g[T+0],b=g[T+1],w=g[T+2];p.push(N,b,b,w,w,N)}}else{let g=M.array;y=M.version;for(let T=0,E=g.length/3-1;T<E;T+=3){let N=T+0,b=T+1,w=T+2;p.push(N,b,b,w,w,N)}}let l=new(M.count>=65535?Ia:wa)(p,1);l.version=y;let s=a.get(D);s&&n.remove(s),a.set(D,l)}function B(D){let p=a.get(D);if(p){let S=D.index;S!==null&&p.version<S.version&&C(D)}else C(D);return a.get(D)}return{get:_,update:L,getWireframeAttribute:B}}function Ec(e,n,t){let i;function c(p){i=p}let a,d;function _(p){a=p.type,d=p.bytesPerElement}function L(p,S){e.drawElements(i,S,a,p*d),t.update(S,i,1)}function C(p,S,M){M!==0&&(e.drawElementsInstanced(i,S,a,p*d,M),t.update(S,i,M))}function B(p,S,M){if(M===0)return;n.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,S,0,a,p,0,M);let l=0;for(let s=0;s<M;s++)l+=S[s];t.update(l,i,1)}function D(p,S,M,y){if(M===0)return;let l=n.get("WEBGL_multi_draw");if(l===null)for(let s=0;s<p.length;s++)C(p[s]/d,S[s],y[s]);else{l.multiDrawElementsInstancedWEBGL(i,S,0,a,p,0,y,0,M);let s=0;for(let g=0;g<M;g++)s+=S[g]*y[g];t.update(s,i,1)}}this.setMode=c,this.setIndex=_,this.render=L,this.renderInstances=C,this.renderMultiDraw=B,this.renderMultiDrawInstances=D}function xc(e){let n={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,d,_){switch(t.calls++,d){case e.TRIANGLES:t.triangles+=_*(a/3);break;case e.LINES:t.lines+=_*(a/2);break;case e.LINE_STRIP:t.lines+=_*(a-1);break;case e.LINE_LOOP:t.lines+=_*a;break;case e.POINTS:t.points+=_*a;break;default:Ze("WebGLInfo: Unknown draw mode:",d);break}}function c(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:n,render:t,programs:null,autoReset:!0,reset:c,update:i}}function Mc(e,n,t){let i=new WeakMap,c=new ut;function a(d,_,L){let C=d.morphTargetInfluences,B=_.morphAttributes.position||_.morphAttributes.normal||_.morphAttributes.color,D=B!==void 0?B.length:0,p=i.get(_);if(p===void 0||p.count!==D){let h=function(){w.dispose(),i.delete(_),_.removeEventListener("dispose",h)};p!==void 0&&p.texture.dispose();let S=_.morphAttributes.position!==void 0,M=_.morphAttributes.normal!==void 0,y=_.morphAttributes.color!==void 0,l=_.morphAttributes.position||[],s=_.morphAttributes.normal||[],g=_.morphAttributes.color||[],T=0;S===!0&&(T=1),M===!0&&(T=2),y===!0&&(T=3);let E=_.attributes.position.count*T,N=1;E>n.maxTextureSize&&(N=Math.ceil(E/n.maxTextureSize),E=n.maxTextureSize);let b=new Float32Array(E*N*4*D),w=new zi(b,E,N,D);w.type=Ut,w.needsUpdate=!0;let f=T*4;for(let $=0;$<D;$++){let R=l[$],V=s[$],z=g[$],W=E*N*4*$;for(let Y=0;Y<R.count;Y++){let O=Y*f;S===!0&&(c.fromBufferAttribute(R,Y),b[W+O+0]=c.x,b[W+O+1]=c.y,b[W+O+2]=c.z,b[W+O+3]=0),M===!0&&(c.fromBufferAttribute(V,Y),b[W+O+4]=c.x,b[W+O+5]=c.y,b[W+O+6]=c.z,b[W+O+7]=0),y===!0&&(c.fromBufferAttribute(z,Y),b[W+O+8]=c.x,b[W+O+9]=c.y,b[W+O+10]=c.z,b[W+O+11]=z.itemSize===4?c.w:1)}}p={count:D,texture:w,size:new dt(E,N)},i.set(_,p),_.addEventListener("dispose",h)}if(d.isInstancedMesh===!0&&d.morphTexture!==null)L.getUniforms().setValue(e,"morphTexture",d.morphTexture,t);else{let S=0;for(let y=0;y<C.length;y++)S+=C[y];let M=_.morphTargetsRelative?1:1-S;L.getUniforms().setValue(e,"morphTargetBaseInfluence",M),L.getUniforms().setValue(e,"morphTargetInfluences",C)}L.getUniforms().setValue(e,"morphTargetsTexture",p.texture,t),L.getUniforms().setValue(e,"morphTargetsTextureSize",p.size)}return{update:a}}function Tc(e,n,t,i,c){let a=new WeakMap;function d(C){let B=c.render.frame,D=C.geometry,p=n.get(C,D);if(a.get(p)!==B&&(n.update(p),a.set(p,B)),C.isInstancedMesh&&(C.hasEventListener("dispose",L)===!1&&C.addEventListener("dispose",L),a.get(C)!==B&&(t.update(C.instanceMatrix,e.ARRAY_BUFFER),C.instanceColor!==null&&t.update(C.instanceColor,e.ARRAY_BUFFER),a.set(C,B))),C.isSkinnedMesh){let S=C.skeleton;a.get(S)!==B&&(S.update(),a.set(S,B))}return p}function _(){a=new WeakMap}function L(C){let B=C.target;B.removeEventListener("dispose",L),i.releaseStatesOfObject(B),t.remove(B.instanceMatrix),B.instanceColor!==null&&t.remove(B.instanceColor)}return{update:d,dispose:_}}var Ac={[Kn]:"LINEAR_TONE_MAPPING",[$n]:"REINHARD_TONE_MAPPING",[Zn]:"CINEON_TONE_MAPPING",[Qn]:"ACES_FILMIC_TONE_MAPPING",[jn]:"AGX_TONE_MAPPING",[ei]:"NEUTRAL_TONE_MAPPING",[Jn]:"CUSTOM_TONE_MAPPING"};function Rc(e,n,t,i,c){let a=new Et(n,t,{type:e,depthBuffer:i,stencilBuffer:c}),d=new Et(n,t,{type:wt,depthBuffer:!1,stencilBuffer:!1}),_=new hn;_.setAttribute("position",new Yi([-1,3,0,-1,-1,0,3,-1,0],3)),_.setAttribute("uv",new Yi([0,2,0,0,2,0],2));let L=new Ga({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),C=new Rt(_,L),B=new Ji(-1,1,1,-1,0,1),D=null,p=null,S=!1,M,y=null,l=[],s=!1;this.setSize=function(g,T){a.setSize(g,T),d.setSize(g,T);for(let E=0;E<l.length;E++){let N=l[E];N.setSize&&N.setSize(g,T)}},this.setEffects=function(g){l=g,s=l.length>0&&l[0].isRenderPass===!0;let T=a.width,E=a.height;for(let N=0;N<l.length;N++){let b=l[N];b.setSize&&b.setSize(T,E)}},this.begin=function(g,T){if(S||g.toneMapping===vt&&l.length===0)return!1;if(y=T,T!==null){let E=T.width,N=T.height;(a.width!==E||a.height!==N)&&this.setSize(E,N)}return s===!1&&g.setRenderTarget(a),M=g.toneMapping,g.toneMapping=vt,!0},this.hasRenderPass=function(){return s},this.end=function(g,T){g.toneMapping=M,S=!0;let E=a,N=d;for(let b=0;b<l.length;b++){let w=l[b];if(w.enabled!==!1&&(w.render(g,N,E,T),w.needsSwap!==!1)){let f=E;E=N,N=f}}if(D!==g.outputColorSpace||p!==g.toneMapping){D=g.outputColorSpace,p=g.toneMapping,L.defines={},tt.getTransfer(D)===qe&&(L.defines.SRGB_TRANSFER="");let b=Ac[p];b&&(L.defines[b]=""),L.needsUpdate=!0}L.uniforms.tDiffuse.value=E.texture,g.setRenderTarget(y),g.render(C,B),y=null,S=!1},this.isCompositing=function(){return S},this.dispose=function(){a.dispose(),d.dispose(),_.dispose(),L.dispose()}}var mo=new La,or=new mn(1,1),_o=new zi,go=new Da,vo=new Ki,$a=[],Za=[],Qa=new Float32Array(16),Ja=new Float32Array(9),ja=new Float32Array(4);function on(e,n,t){let i=e[0];if(i<=0||i>0)return e;let c=n*t,a=$a[c];if(a===void 0&&(a=new Float32Array(c),$a[c]=a),n!==0){i.toArray(a,0);for(let d=1,_=0;d!==n;++d)_+=t,e[d].toArray(a,_)}return a}function at(e,n){if(e.length!==n.length)return!1;for(let t=0,i=e.length;t<i;t++)if(e[t]!==n[t])return!1;return!0}function ot(e,n){for(let t=0,i=n.length;t<i;t++)e[t]=n[t]}function Hn(e,n){let t=Za[n];t===void 0&&(t=new Int32Array(n),Za[n]=t);for(let i=0;i!==n;++i)t[i]=e.allocateTextureUnit();return t}function Cc(e,n){let t=this.cache;t[0]!==n&&(e.uniform1f(this.addr,n),t[0]=n)}function bc(e,n){let t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2f(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(at(t,n))return;e.uniform2fv(this.addr,n),ot(t,n)}}function Pc(e,n){let t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3f(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else if(n.r!==void 0)(t[0]!==n.r||t[1]!==n.g||t[2]!==n.b)&&(e.uniform3f(this.addr,n.r,n.g,n.b),t[0]=n.r,t[1]=n.g,t[2]=n.b);else{if(at(t,n))return;e.uniform3fv(this.addr,n),ot(t,n)}}function Lc(e,n){let t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4f(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(at(t,n))return;e.uniform4fv(this.addr,n),ot(t,n)}}function Dc(e,n){let t=this.cache,i=n.elements;if(i===void 0){if(at(t,n))return;e.uniformMatrix2fv(this.addr,!1,n),ot(t,n)}else{if(at(t,i))return;ja.set(i),e.uniformMatrix2fv(this.addr,!1,ja),ot(t,i)}}function Uc(e,n){let t=this.cache,i=n.elements;if(i===void 0){if(at(t,n))return;e.uniformMatrix3fv(this.addr,!1,n),ot(t,n)}else{if(at(t,i))return;Ja.set(i),e.uniformMatrix3fv(this.addr,!1,Ja),ot(t,i)}}function wc(e,n){let t=this.cache,i=n.elements;if(i===void 0){if(at(t,n))return;e.uniformMatrix4fv(this.addr,!1,n),ot(t,n)}else{if(at(t,i))return;Qa.set(i),e.uniformMatrix4fv(this.addr,!1,Qa),ot(t,i)}}function Ic(e,n){let t=this.cache;t[0]!==n&&(e.uniform1i(this.addr,n),t[0]=n)}function Nc(e,n){let t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2i(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(at(t,n))return;e.uniform2iv(this.addr,n),ot(t,n)}}function yc(e,n){let t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3i(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else{if(at(t,n))return;e.uniform3iv(this.addr,n),ot(t,n)}}function Fc(e,n){let t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4i(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(at(t,n))return;e.uniform4iv(this.addr,n),ot(t,n)}}function Oc(e,n){let t=this.cache;t[0]!==n&&(e.uniform1ui(this.addr,n),t[0]=n)}function Bc(e,n){let t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y)&&(e.uniform2ui(this.addr,n.x,n.y),t[0]=n.x,t[1]=n.y);else{if(at(t,n))return;e.uniform2uiv(this.addr,n),ot(t,n)}}function Gc(e,n){let t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z)&&(e.uniform3ui(this.addr,n.x,n.y,n.z),t[0]=n.x,t[1]=n.y,t[2]=n.z);else{if(at(t,n))return;e.uniform3uiv(this.addr,n),ot(t,n)}}function Hc(e,n){let t=this.cache;if(n.x!==void 0)(t[0]!==n.x||t[1]!==n.y||t[2]!==n.z||t[3]!==n.w)&&(e.uniform4ui(this.addr,n.x,n.y,n.z,n.w),t[0]=n.x,t[1]=n.y,t[2]=n.z,t[3]=n.w);else{if(at(t,n))return;e.uniform4uiv(this.addr,n),ot(t,n)}}function Vc(e,n,t){let i=this.cache,c=t.allocateTextureUnit();i[0]!==c&&(e.uniform1i(this.addr,c),i[0]=c);let a;this.type===e.SAMPLER_2D_SHADOW?(or.compareFunction=t.isReversedDepthBuffer()?Un:Dn,a=or):a=mo,t.setTexture2D(n||a,c)}function kc(e,n,t){let i=this.cache,c=t.allocateTextureUnit();i[0]!==c&&(e.uniform1i(this.addr,c),i[0]=c),t.setTexture3D(n||go,c)}function Wc(e,n,t){let i=this.cache,c=t.allocateTextureUnit();i[0]!==c&&(e.uniform1i(this.addr,c),i[0]=c),t.setTextureCube(n||vo,c)}function zc(e,n,t){let i=this.cache,c=t.allocateTextureUnit();i[0]!==c&&(e.uniform1i(this.addr,c),i[0]=c),t.setTexture2DArray(n||_o,c)}function Xc(e){switch(e){case 5126:return Cc;case 35664:return bc;case 35665:return Pc;case 35666:return Lc;case 35674:return Dc;case 35675:return Uc;case 35676:return wc;case 5124:case 35670:return Ic;case 35667:case 35671:return Nc;case 35668:case 35672:return yc;case 35669:case 35673:return Fc;case 5125:return Oc;case 36294:return Bc;case 36295:return Gc;case 36296:return Hc;case 35678:case 36198:case 36298:case 36306:case 35682:return Vc;case 35679:case 36299:case 36307:return kc;case 35680:case 36300:case 36308:case 36293:return Wc;case 36289:case 36303:case 36311:case 36292:return zc}}function Yc(e,n){e.uniform1fv(this.addr,n)}function qc(e,n){let t=on(n,this.size,2);e.uniform2fv(this.addr,t)}function Kc(e,n){let t=on(n,this.size,3);e.uniform3fv(this.addr,t)}function $c(e,n){let t=on(n,this.size,4);e.uniform4fv(this.addr,t)}function Zc(e,n){let t=on(n,this.size,4);e.uniformMatrix2fv(this.addr,!1,t)}function Qc(e,n){let t=on(n,this.size,9);e.uniformMatrix3fv(this.addr,!1,t)}function Jc(e,n){let t=on(n,this.size,16);e.uniformMatrix4fv(this.addr,!1,t)}function jc(e,n){e.uniform1iv(this.addr,n)}function ef(e,n){e.uniform2iv(this.addr,n)}function tf(e,n){e.uniform3iv(this.addr,n)}function nf(e,n){e.uniform4iv(this.addr,n)}function rf(e,n){e.uniform1uiv(this.addr,n)}function af(e,n){e.uniform2uiv(this.addr,n)}function of(e,n){e.uniform3uiv(this.addr,n)}function sf(e,n){e.uniform4uiv(this.addr,n)}function lf(e,n,t){let i=this.cache,c=n.length,a=Hn(t,c);at(i,a)||(e.uniform1iv(this.addr,a),ot(i,a));let d;this.type===e.SAMPLER_2D_SHADOW?d=or:d=mo;for(let _=0;_!==c;++_)t.setTexture2D(n[_]||d,a[_])}function cf(e,n,t){let i=this.cache,c=n.length,a=Hn(t,c);at(i,a)||(e.uniform1iv(this.addr,a),ot(i,a));for(let d=0;d!==c;++d)t.setTexture3D(n[d]||go,a[d])}function ff(e,n,t){let i=this.cache,c=n.length,a=Hn(t,c);at(i,a)||(e.uniform1iv(this.addr,a),ot(i,a));for(let d=0;d!==c;++d)t.setTextureCube(n[d]||vo,a[d])}function df(e,n,t){let i=this.cache,c=n.length,a=Hn(t,c);at(i,a)||(e.uniform1iv(this.addr,a),ot(i,a));for(let d=0;d!==c;++d)t.setTexture2DArray(n[d]||_o,a[d])}function uf(e){switch(e){case 5126:return Yc;case 35664:return qc;case 35665:return Kc;case 35666:return $c;case 35674:return Zc;case 35675:return Qc;case 35676:return Jc;case 5124:case 35670:return jc;case 35667:case 35671:return ef;case 35668:case 35672:return tf;case 35669:case 35673:return nf;case 5125:return rf;case 36294:return af;case 36295:return of;case 36296:return sf;case 35678:case 36198:case 36298:case 36306:case 35682:return lf;case 35679:case 36299:case 36307:return cf;case 35680:case 36300:case 36308:case 36293:return ff;case 36289:case 36303:case 36311:case 36292:return df}}var sr=class{constructor(n,t,i){this.id=n,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Xc(t.type)}},lr=class{constructor(n,t,i){this.id=n,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=uf(t.type)}},cr=class{constructor(n){this.id=n,this.seq=[],this.map={}}setValue(n,t,i){let c=this.seq;for(let a=0,d=c.length;a!==d;++a){let _=c[a];_.setValue(n,t[_.id],i)}}},rr=/(\w+)(\])?(\[|\.)?/g;function eo(e,n){e.seq.push(n),e.map[n.id]=n}function pf(e,n,t){let i=e.name,c=i.length;for(rr.lastIndex=0;;){let a=rr.exec(i),d=rr.lastIndex,_=a[1],L=a[2]==="]",C=a[3];if(L&&(_=_|0),C===void 0||C==="["&&d+2===c){eo(t,C===void 0?new sr(_,e,n):new lr(_,e,n));break}else{let D=t.map[_];D===void 0&&(D=new cr(_),eo(t,D)),t=D}}}var an=class{constructor(n,t){this.seq=[],this.map={};let i=n.getProgramParameter(t,n.ACTIVE_UNIFORMS);for(let d=0;d<i;++d){let _=n.getActiveUniform(t,d),L=n.getUniformLocation(t,_.name);pf(_,L,this)}let c=[],a=[];for(let d of this.seq)d.type===n.SAMPLER_2D_SHADOW||d.type===n.SAMPLER_CUBE_SHADOW||d.type===n.SAMPLER_2D_ARRAY_SHADOW?c.push(d):a.push(d);c.length>0&&(this.seq=c.concat(a))}setValue(n,t,i,c){let a=this.map[t];a!==void 0&&a.setValue(n,i,c)}setOptional(n,t,i){let c=t[i];c!==void 0&&this.setValue(n,i,c)}static upload(n,t,i,c){for(let a=0,d=t.length;a!==d;++a){let _=t[a],L=i[_.id];L.needsUpdate!==!1&&_.setValue(n,L.value,c)}}static seqWithValue(n,t){let i=[];for(let c=0,a=n.length;c!==a;++c){let d=n[c];d.id in t&&i.push(d)}return i}};function to(e,n,t){let i=e.createShader(n);return e.shaderSource(i,t),e.compileShader(i),i}var hf=37297,mf=0;function _f(e,n){let t=e.split(`
`),i=[],c=Math.max(n-6,0),a=Math.min(n+6,t.length);for(let d=c;d<a;d++){let _=d+1;i.push(`${_===n?">":" "} ${_}: ${t[d]}`)}return i.join(`
`)}var no=new Fe;function gf(e){tt._getMatrix(no,tt.workingColorSpace,e);let n=`mat3( ${no.elements.map(t=>t.toFixed(4))} )`;switch(tt.getTransfer(e)){case Gi:return[n,"LinearTransferOETF"];case qe:return[n,"sRGBTransferOETF"];default:return ze("WebGLProgram: Unsupported color space: ",e),[n,"LinearTransferOETF"]}}function io(e,n,t){let i=e.getShaderParameter(n,e.COMPILE_STATUS),a=(e.getShaderInfoLog(n)||"").trim();if(i&&a==="")return"";let d=/ERROR: 0:(\d+)/.exec(a);if(d){let _=parseInt(d[1]);return t.toUpperCase()+`

`+a+`

`+_f(e.getShaderSource(n),_)}else return a}function vf(e,n){let t=gf(n);return[`vec4 ${e}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var Sf={[Kn]:"Linear",[$n]:"Reinhard",[Zn]:"Cineon",[Qn]:"ACESFilmic",[jn]:"AgX",[ei]:"Neutral",[Jn]:"Custom"};function Ef(e,n){let t=Sf[n];return t===void 0?(ze("WebGLProgram: Unsupported toneMapping:",n),"vec3 "+e+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+e+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Fn=new Be;function xf(){tt.getLuminanceCoefficients(Fn);let e=Fn.x.toFixed(4),n=Fn.y.toFixed(4),t=Fn.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${n}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Mf(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Sn).join(`
`)}function Tf(e){let n=[];for(let t in e){let i=e[t];i!==!1&&n.push("#define "+t+" "+i)}return n.join(`
`)}function Af(e,n){let t={},i=e.getProgramParameter(n,e.ACTIVE_ATTRIBUTES);for(let c=0;c<i;c++){let a=e.getActiveAttrib(n,c),d=a.name,_=1;a.type===e.FLOAT_MAT2&&(_=2),a.type===e.FLOAT_MAT3&&(_=3),a.type===e.FLOAT_MAT4&&(_=4),t[d]={type:a.type,location:e.getAttribLocation(n,d),locationSize:_}}return t}function Sn(e){return e!==""}function ro(e,n){let t=n.numSpotLightShadows+n.numSpotLightMaps-n.numSpotLightShadowsWithMaps;return e.replace(/NUM_DIR_LIGHTS/g,n.numDirLights).replace(/NUM_SPOT_LIGHTS/g,n.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,n.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,n.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,n.numPointLights).replace(/NUM_HEMI_LIGHTS/g,n.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,n.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,n.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,n.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,n.numPointLightShadows)}function ao(e,n){return e.replace(/NUM_CLIPPING_PLANES/g,n.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,n.numClippingPlanes-n.numClipIntersection)}var Rf=/^[ \t]*#include +<([\w\d./]+)>/gm;function fr(e){return e.replace(Rf,bf)}var Cf=new Map;function bf(e,n){let t=De[n];if(t===void 0){let i=Cf.get(n);if(i!==void 0)t=De[i],ze('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',n,i);else throw new Error("Can not resolve #include <"+n+">")}return fr(t)}var Pf=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function oo(e){return e.replace(Pf,Lf)}function Lf(e,n,t,i){let c="";for(let a=parseInt(n);a<parseInt(t);a++)c+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return c}function so(e){let n=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision==="highp"?n+=`
#define HIGH_PRECISION`:e.precision==="mediump"?n+=`
#define MEDIUM_PRECISION`:e.precision==="lowp"&&(n+=`
#define LOW_PRECISION`),n}var Df={[sn]:"SHADOWMAP_TYPE_PCF",[Qt]:"SHADOWMAP_TYPE_VSM"};function Uf(e){return Df[e.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var wf={[en]:"ENVMAP_TYPE_CUBE",[Ht]:"ENVMAP_TYPE_CUBE",[cn]:"ENVMAP_TYPE_CUBE_UV"};function If(e){return e.envMap===!1?"ENVMAP_TYPE_CUBE":wf[e.envMapMode]||"ENVMAP_TYPE_CUBE"}var Nf={[Ht]:"ENVMAP_MODE_REFRACTION"};function yf(e){return e.envMap===!1?"ENVMAP_MODE_REFLECTION":Nf[e.envMapMode]||"ENVMAP_MODE_REFLECTION"}var Ff={[ta]:"ENVMAP_BLENDING_MULTIPLY",[na]:"ENVMAP_BLENDING_MIX",[ia]:"ENVMAP_BLENDING_ADD"};function Of(e){return e.envMap===!1?"ENVMAP_BLENDING_NONE":Ff[e.combine]||"ENVMAP_BLENDING_NONE"}function Bf(e){let n=e.envMapCubeUVHeight;if(n===null)return null;let t=Math.log2(n)-2,i=1/n;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function Gf(e,n,t,i){let c=e.getContext(),a=t.defines,d=t.vertexShader,_=t.fragmentShader,L=Uf(t),C=If(t),B=yf(t),D=Of(t),p=Bf(t),S=Mf(t),M=Tf(a),y=c.createProgram(),l,s,g=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(l=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M].filter(Sn).join(`
`),l.length>0&&(l+=`
`),s=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M].filter(Sn).join(`
`),s.length>0&&(s+=`
`)):(l=[so(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+B:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+L:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Sn).join(`
`),s=[so(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+C:"",t.envMap?"#define "+B:"",t.envMap?"#define "+D:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+L:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==vt?"#define TONE_MAPPING":"",t.toneMapping!==vt?De.tonemapping_pars_fragment:"",t.toneMapping!==vt?Ef("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",De.colorspace_pars_fragment,vf("linearToOutputTexel",t.outputColorSpace),xf(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Sn).join(`
`)),d=fr(d),d=ro(d,t),d=ao(d,t),_=fr(_),_=ro(_,t),_=ao(_,t),d=oo(d),_=oo(_),t.isRawShaderMaterial!==!0&&(g=`#version 300 es
`,l=[S,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+l,s=["#define varying in",t.glslVersion===Hi?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Hi?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+s);let T=g+l+d,E=g+s+_,N=to(c,c.VERTEX_SHADER,T),b=to(c,c.FRAGMENT_SHADER,E);c.attachShader(y,N),c.attachShader(y,b),t.index0AttributeName!==void 0?c.bindAttribLocation(y,0,t.index0AttributeName):t.morphTargets===!0&&c.bindAttribLocation(y,0,"position"),c.linkProgram(y);function w(R){if(e.debug.checkShaderErrors){let V=c.getProgramInfoLog(y)||"",z=c.getShaderInfoLog(N)||"",W=c.getShaderInfoLog(b)||"",Y=V.trim(),O=z.trim(),F=W.trim(),ie=!0,re=!0;if(c.getProgramParameter(y,c.LINK_STATUS)===!1)if(ie=!1,typeof e.debug.onShaderError=="function")e.debug.onShaderError(c,y,N,b);else{let Me=io(c,N,"vertex"),Ae=io(c,b,"fragment");Ze("THREE.WebGLProgram: Shader Error "+c.getError()+" - VALIDATE_STATUS "+c.getProgramParameter(y,c.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+Y+`
`+Me+`
`+Ae)}else Y!==""?ze("WebGLProgram: Program Info Log:",Y):(O===""||F==="")&&(re=!1);re&&(R.diagnostics={runnable:ie,programLog:Y,vertexShader:{log:O,prefix:l},fragmentShader:{log:F,prefix:s}})}c.deleteShader(N),c.deleteShader(b),f=new an(c,y),h=Af(c,y)}let f;this.getUniforms=function(){return f===void 0&&w(this),f};let h;this.getAttributes=function(){return h===void 0&&w(this),h};let $=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return $===!1&&($=c.getProgramParameter(y,hf)),$},this.destroy=function(){i.releaseStatesOfProgram(this),c.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=mf++,this.cacheKey=n,this.usedTimes=1,this.program=y,this.vertexShader=N,this.fragmentShader=b,this}var Hf=0,dr=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(n){let t=n.vertexShader,i=n.fragmentShader,c=this._getShaderStage(t),a=this._getShaderStage(i),d=this._getShaderCacheForMaterial(n);return d.has(c)===!1&&(d.add(c),c.usedTimes++),d.has(a)===!1&&(d.add(a),a.usedTimes++),this}remove(n){let t=this.materialCache.get(n);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(n),this}getVertexShaderID(n){return this._getShaderStage(n.vertexShader).id}getFragmentShaderID(n){return this._getShaderStage(n.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(n){let t=this.materialCache,i=t.get(n);return i===void 0&&(i=new Set,t.set(n,i)),i}_getShaderStage(n){let t=this.shaderCache,i=t.get(n);return i===void 0&&(i=new ur(n),t.set(n,i)),i}},ur=class{constructor(n){this.id=Hf++,this.code=n,this.usedTimes=0}};function Vf(e,n,t,i,c,a){let d=new Ua,_=new dr,L=new Set,C=[],B=new Map,D=i.logarithmicDepthBuffer,p=i.precision,S={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(f){return L.add(f),f===0?"uv":`uv${f}`}function y(f,h,$,R,V){let z=R.fog,W=V.geometry,Y=f.isMeshStandardMaterial||f.isMeshLambertMaterial||f.isMeshPhongMaterial?R.environment:null,O=f.isMeshStandardMaterial||f.isMeshLambertMaterial&&!f.envMap||f.isMeshPhongMaterial&&!f.envMap,F=n.get(f.envMap||Y,O),ie=F&&F.mapping===cn?F.image.height:null,re=S[f.type];f.precision!==null&&(p=i.getMaxPrecision(f.precision),p!==f.precision&&ze("WebGLProgram.getParameters:",f.precision,"not supported, using",p,"instead."));let Me=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Ae=Me!==void 0?Me.length:0,he=0;W.morphAttributes.position!==void 0&&(he=1),W.morphAttributes.normal!==void 0&&(he=2),W.morphAttributes.color!==void 0&&(he=3);let Ne,Je,je,X;if(re){let Ve=Pt[re];Ne=Ve.vertexShader,Je=Ve.fragmentShader}else Ne=f.vertexShader,Je=f.fragmentShader,_.update(f),je=_.getVertexShaderID(f),X=_.getFragmentShaderID(f);let j=e.getRenderTarget(),ne=e.state.buffers.depth.getReversed(),Le=V.isInstancedMesh===!0,Te=V.isBatchedMesh===!0,Ce=!!f.map,st=!!f.matcap,ye=!!F,He=!!f.aoMap,Xe=!!f.lightMap,Ue=!!f.bumpMap,nt=!!f.normalMap,m=!!f.displacementMap,rt=!!f.emissiveMap,Ge=!!f.metalnessMap,Ke=!!f.roughnessMap,ge=f.anisotropy>0,u=f.clearcoat>0,r=f.dispersion>0,x=f.iridescence>0,k=f.sheen>0,q=f.transmission>0,H=ge&&!!f.anisotropyMap,de=u&&!!f.clearcoatMap,ee=u&&!!f.clearcoatNormalMap,xe=u&&!!f.clearcoatRoughnessMap,Re=x&&!!f.iridescenceMap,K=x&&!!f.iridescenceThicknessMap,Q=k&&!!f.sheenColorMap,ue=k&&!!f.sheenRoughnessMap,me=!!f.specularMap,le=!!f.specularColorMap,we=!!f.specularIntensityMap,v=q&&!!f.transmissionMap,te=q&&!!f.thicknessMap,J=!!f.gradientMap,fe=!!f.alphaMap,Z=f.alphaTest>0,G=!!f.alphaHash,pe=!!f.extensions,be=vt;f.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(be=e.toneMapping);let $e={shaderID:re,shaderType:f.type,shaderName:f.name,vertexShader:Ne,fragmentShader:Je,defines:f.defines,customVertexShaderID:je,customFragmentShaderID:X,isRawShaderMaterial:f.isRawShaderMaterial===!0,glslVersion:f.glslVersion,precision:p,batching:Te,batchingColor:Te&&V._colorsTexture!==null,instancing:Le,instancingColor:Le&&V.instanceColor!==null,instancingMorph:Le&&V.morphTexture!==null,outputColorSpace:j===null?e.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:un,alphaToCoverage:!!f.alphaToCoverage,map:Ce,matcap:st,envMap:ye,envMapMode:ye&&F.mapping,envMapCubeUVHeight:ie,aoMap:He,lightMap:Xe,bumpMap:Ue,normalMap:nt,displacementMap:m,emissiveMap:rt,normalMapObjectSpace:nt&&f.normalMapType===ma,normalMapTangentSpace:nt&&f.normalMapType===ha,metalnessMap:Ge,roughnessMap:Ke,anisotropy:ge,anisotropyMap:H,clearcoat:u,clearcoatMap:de,clearcoatNormalMap:ee,clearcoatRoughnessMap:xe,dispersion:r,iridescence:x,iridescenceMap:Re,iridescenceThicknessMap:K,sheen:k,sheenColorMap:Q,sheenRoughnessMap:ue,specularMap:me,specularColorMap:le,specularIntensityMap:we,transmission:q,transmissionMap:v,thicknessMap:te,gradientMap:J,opaque:f.transparent===!1&&f.blending===ln&&f.alphaToCoverage===!1,alphaMap:fe,alphaTest:Z,alphaHash:G,combine:f.combine,mapUv:Ce&&M(f.map.channel),aoMapUv:He&&M(f.aoMap.channel),lightMapUv:Xe&&M(f.lightMap.channel),bumpMapUv:Ue&&M(f.bumpMap.channel),normalMapUv:nt&&M(f.normalMap.channel),displacementMapUv:m&&M(f.displacementMap.channel),emissiveMapUv:rt&&M(f.emissiveMap.channel),metalnessMapUv:Ge&&M(f.metalnessMap.channel),roughnessMapUv:Ke&&M(f.roughnessMap.channel),anisotropyMapUv:H&&M(f.anisotropyMap.channel),clearcoatMapUv:de&&M(f.clearcoatMap.channel),clearcoatNormalMapUv:ee&&M(f.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:xe&&M(f.clearcoatRoughnessMap.channel),iridescenceMapUv:Re&&M(f.iridescenceMap.channel),iridescenceThicknessMapUv:K&&M(f.iridescenceThicknessMap.channel),sheenColorMapUv:Q&&M(f.sheenColorMap.channel),sheenRoughnessMapUv:ue&&M(f.sheenRoughnessMap.channel),specularMapUv:me&&M(f.specularMap.channel),specularColorMapUv:le&&M(f.specularColorMap.channel),specularIntensityMapUv:we&&M(f.specularIntensityMap.channel),transmissionMapUv:v&&M(f.transmissionMap.channel),thicknessMapUv:te&&M(f.thicknessMap.channel),alphaMapUv:fe&&M(f.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(nt||ge),vertexColors:f.vertexColors,vertexAlphas:f.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:V.isPoints===!0&&!!W.attributes.uv&&(Ce||fe),fog:!!z,useFog:f.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:f.wireframe===!1&&(f.flatShading===!0||W.attributes.normal===void 0&&nt===!1&&(f.isMeshLambertMaterial||f.isMeshPhongMaterial||f.isMeshStandardMaterial||f.isMeshPhysicalMaterial)),sizeAttenuation:f.sizeAttenuation===!0,logarithmicDepthBuffer:D,reversedDepthBuffer:ne,skinning:V.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:Ae,morphTextureStride:he,numDirLights:h.directional.length,numPointLights:h.point.length,numSpotLights:h.spot.length,numSpotLightMaps:h.spotLightMap.length,numRectAreaLights:h.rectArea.length,numHemiLights:h.hemi.length,numDirLightShadows:h.directionalShadowMap.length,numPointLightShadows:h.pointShadowMap.length,numSpotLightShadows:h.spotShadowMap.length,numSpotLightShadowsWithMaps:h.numSpotLightShadowsWithMaps,numLightProbes:h.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:f.dithering,shadowMapEnabled:e.shadowMap.enabled&&$.length>0,shadowMapType:e.shadowMap.type,toneMapping:be,decodeVideoTexture:Ce&&f.map.isVideoTexture===!0&&tt.getTransfer(f.map.colorSpace)===qe,decodeVideoTextureEmissive:rt&&f.emissiveMap.isVideoTexture===!0&&tt.getTransfer(f.emissiveMap.colorSpace)===qe,premultipliedAlpha:f.premultipliedAlpha,doubleSided:f.side===Mt,flipSided:f.side===ht,useDepthPacking:f.depthPacking>=0,depthPacking:f.depthPacking||0,index0AttributeName:f.index0AttributeName,extensionClipCullDistance:pe&&f.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(pe&&f.extensions.multiDraw===!0||Te)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:f.customProgramCacheKey()};return $e.vertexUv1s=L.has(1),$e.vertexUv2s=L.has(2),$e.vertexUv3s=L.has(3),L.clear(),$e}function l(f){let h=[];if(f.shaderID?h.push(f.shaderID):(h.push(f.customVertexShaderID),h.push(f.customFragmentShaderID)),f.defines!==void 0)for(let $ in f.defines)h.push($),h.push(f.defines[$]);return f.isRawShaderMaterial===!1&&(s(h,f),g(h,f),h.push(e.outputColorSpace)),h.push(f.customProgramCacheKey),h.join()}function s(f,h){f.push(h.precision),f.push(h.outputColorSpace),f.push(h.envMapMode),f.push(h.envMapCubeUVHeight),f.push(h.mapUv),f.push(h.alphaMapUv),f.push(h.lightMapUv),f.push(h.aoMapUv),f.push(h.bumpMapUv),f.push(h.normalMapUv),f.push(h.displacementMapUv),f.push(h.emissiveMapUv),f.push(h.metalnessMapUv),f.push(h.roughnessMapUv),f.push(h.anisotropyMapUv),f.push(h.clearcoatMapUv),f.push(h.clearcoatNormalMapUv),f.push(h.clearcoatRoughnessMapUv),f.push(h.iridescenceMapUv),f.push(h.iridescenceThicknessMapUv),f.push(h.sheenColorMapUv),f.push(h.sheenRoughnessMapUv),f.push(h.specularMapUv),f.push(h.specularColorMapUv),f.push(h.specularIntensityMapUv),f.push(h.transmissionMapUv),f.push(h.thicknessMapUv),f.push(h.combine),f.push(h.fogExp2),f.push(h.sizeAttenuation),f.push(h.morphTargetsCount),f.push(h.morphAttributeCount),f.push(h.numDirLights),f.push(h.numPointLights),f.push(h.numSpotLights),f.push(h.numSpotLightMaps),f.push(h.numHemiLights),f.push(h.numRectAreaLights),f.push(h.numDirLightShadows),f.push(h.numPointLightShadows),f.push(h.numSpotLightShadows),f.push(h.numSpotLightShadowsWithMaps),f.push(h.numLightProbes),f.push(h.shadowMapType),f.push(h.toneMapping),f.push(h.numClippingPlanes),f.push(h.numClipIntersection),f.push(h.depthPacking)}function g(f,h){d.disableAll(),h.instancing&&d.enable(0),h.instancingColor&&d.enable(1),h.instancingMorph&&d.enable(2),h.matcap&&d.enable(3),h.envMap&&d.enable(4),h.normalMapObjectSpace&&d.enable(5),h.normalMapTangentSpace&&d.enable(6),h.clearcoat&&d.enable(7),h.iridescence&&d.enable(8),h.alphaTest&&d.enable(9),h.vertexColors&&d.enable(10),h.vertexAlphas&&d.enable(11),h.vertexUv1s&&d.enable(12),h.vertexUv2s&&d.enable(13),h.vertexUv3s&&d.enable(14),h.vertexTangents&&d.enable(15),h.anisotropy&&d.enable(16),h.alphaHash&&d.enable(17),h.batching&&d.enable(18),h.dispersion&&d.enable(19),h.batchingColor&&d.enable(20),h.gradientMap&&d.enable(21),f.push(d.mask),d.disableAll(),h.fog&&d.enable(0),h.useFog&&d.enable(1),h.flatShading&&d.enable(2),h.logarithmicDepthBuffer&&d.enable(3),h.reversedDepthBuffer&&d.enable(4),h.skinning&&d.enable(5),h.morphTargets&&d.enable(6),h.morphNormals&&d.enable(7),h.morphColors&&d.enable(8),h.premultipliedAlpha&&d.enable(9),h.shadowMapEnabled&&d.enable(10),h.doubleSided&&d.enable(11),h.flipSided&&d.enable(12),h.useDepthPacking&&d.enable(13),h.dithering&&d.enable(14),h.transmission&&d.enable(15),h.sheen&&d.enable(16),h.opaque&&d.enable(17),h.pointsUvs&&d.enable(18),h.decodeVideoTexture&&d.enable(19),h.decodeVideoTextureEmissive&&d.enable(20),h.alphaToCoverage&&d.enable(21),f.push(d.mask)}function T(f){let h=S[f.type],$;if(h){let R=Pt[h];$=Ba.clone(R.uniforms)}else $=f.uniforms;return $}function E(f,h){let $=B.get(h);return $!==void 0?++$.usedTimes:($=new Gf(e,h,f,c),C.push($),B.set(h,$)),$}function N(f){if(--f.usedTimes===0){let h=C.indexOf(f);C[h]=C[C.length-1],C.pop(),B.delete(f.cacheKey),f.destroy()}}function b(f){_.remove(f)}function w(){_.dispose()}return{getParameters:y,getProgramCacheKey:l,getUniforms:T,acquireProgram:E,releaseProgram:N,releaseShaderCache:b,programs:C,dispose:w}}function kf(){let e=new WeakMap;function n(d){return e.has(d)}function t(d){let _=e.get(d);return _===void 0&&(_={},e.set(d,_)),_}function i(d){e.delete(d)}function c(d,_,L){e.get(d)[_]=L}function a(){e=new WeakMap}return{has:n,get:t,remove:i,update:c,dispose:a}}function Wf(e,n){return e.groupOrder!==n.groupOrder?e.groupOrder-n.groupOrder:e.renderOrder!==n.renderOrder?e.renderOrder-n.renderOrder:e.material.id!==n.material.id?e.material.id-n.material.id:e.materialVariant!==n.materialVariant?e.materialVariant-n.materialVariant:e.z!==n.z?e.z-n.z:e.id-n.id}function lo(e,n){return e.groupOrder!==n.groupOrder?e.groupOrder-n.groupOrder:e.renderOrder!==n.renderOrder?e.renderOrder-n.renderOrder:e.z!==n.z?n.z-e.z:e.id-n.id}function co(){let e=[],n=0,t=[],i=[],c=[];function a(){n=0,t.length=0,i.length=0,c.length=0}function d(p){let S=0;return p.isInstancedMesh&&(S+=2),p.isSkinnedMesh&&(S+=1),S}function _(p,S,M,y,l,s){let g=e[n];return g===void 0?(g={id:p.id,object:p,geometry:S,material:M,materialVariant:d(p),groupOrder:y,renderOrder:p.renderOrder,z:l,group:s},e[n]=g):(g.id=p.id,g.object=p,g.geometry=S,g.material=M,g.materialVariant=d(p),g.groupOrder=y,g.renderOrder=p.renderOrder,g.z=l,g.group=s),n++,g}function L(p,S,M,y,l,s){let g=_(p,S,M,y,l,s);M.transmission>0?i.push(g):M.transparent===!0?c.push(g):t.push(g)}function C(p,S,M,y,l,s){let g=_(p,S,M,y,l,s);M.transmission>0?i.unshift(g):M.transparent===!0?c.unshift(g):t.unshift(g)}function B(p,S){t.length>1&&t.sort(p||Wf),i.length>1&&i.sort(S||lo),c.length>1&&c.sort(S||lo)}function D(){for(let p=n,S=e.length;p<S;p++){let M=e[p];if(M.id===null)break;M.id=null,M.object=null,M.geometry=null,M.material=null,M.group=null}}return{opaque:t,transmissive:i,transparent:c,init:a,push:L,unshift:C,finish:D,sort:B}}function zf(){let e=new WeakMap;function n(i,c){let a=e.get(i),d;return a===void 0?(d=new co,e.set(i,[d])):c>=a.length?(d=new co,a.push(d)):d=a[c],d}function t(){e=new WeakMap}return{get:n,dispose:t}}function Xf(){let e={};return{get:function(n){if(e[n.id]!==void 0)return e[n.id];let t;switch(n.type){case"DirectionalLight":t={direction:new Be,color:new Qe};break;case"SpotLight":t={position:new Be,direction:new Be,color:new Qe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new Be,color:new Qe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new Be,skyColor:new Qe,groundColor:new Qe};break;case"RectAreaLight":t={color:new Qe,position:new Be,halfWidth:new Be,halfHeight:new Be};break}return e[n.id]=t,t}}}function Yf(){let e={};return{get:function(n){if(e[n.id]!==void 0)return e[n.id];let t;switch(n.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new dt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new dt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new dt,shadowCameraNear:1,shadowCameraFar:1e3};break}return e[n.id]=t,t}}}var qf=0;function Kf(e,n){return(n.castShadow?2:0)-(e.castShadow?2:0)+(n.map?1:0)-(e.map?1:0)}function $f(e){let n=new Xf,t=Yf(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let C=0;C<9;C++)i.probe.push(new Be);let c=new Be,a=new Xt,d=new Xt;function _(C){let B=0,D=0,p=0;for(let h=0;h<9;h++)i.probe[h].set(0,0,0);let S=0,M=0,y=0,l=0,s=0,g=0,T=0,E=0,N=0,b=0,w=0;C.sort(Kf);for(let h=0,$=C.length;h<$;h++){let R=C[h],V=R.color,z=R.intensity,W=R.distance,Y=null;if(R.shadow&&R.shadow.map&&(R.shadow.map.texture.format===nn?Y=R.shadow.map.texture:Y=R.shadow.map.depthTexture||R.shadow.map.texture),R.isAmbientLight)B+=V.r*z,D+=V.g*z,p+=V.b*z;else if(R.isLightProbe){for(let O=0;O<9;O++)i.probe[O].addScaledVector(R.sh.coefficients[O],z);w++}else if(R.isDirectionalLight){let O=n.get(R);if(O.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){let F=R.shadow,ie=t.get(R);ie.shadowIntensity=F.intensity,ie.shadowBias=F.bias,ie.shadowNormalBias=F.normalBias,ie.shadowRadius=F.radius,ie.shadowMapSize=F.mapSize,i.directionalShadow[S]=ie,i.directionalShadowMap[S]=Y,i.directionalShadowMatrix[S]=R.shadow.matrix,g++}i.directional[S]=O,S++}else if(R.isSpotLight){let O=n.get(R);O.position.setFromMatrixPosition(R.matrixWorld),O.color.copy(V).multiplyScalar(z),O.distance=W,O.coneCos=Math.cos(R.angle),O.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),O.decay=R.decay,i.spot[y]=O;let F=R.shadow;if(R.map&&(i.spotLightMap[N]=R.map,N++,F.updateMatrices(R),R.castShadow&&b++),i.spotLightMatrix[y]=F.matrix,R.castShadow){let ie=t.get(R);ie.shadowIntensity=F.intensity,ie.shadowBias=F.bias,ie.shadowNormalBias=F.normalBias,ie.shadowRadius=F.radius,ie.shadowMapSize=F.mapSize,i.spotShadow[y]=ie,i.spotShadowMap[y]=Y,E++}y++}else if(R.isRectAreaLight){let O=n.get(R);O.color.copy(V).multiplyScalar(z),O.halfWidth.set(R.width*.5,0,0),O.halfHeight.set(0,R.height*.5,0),i.rectArea[l]=O,l++}else if(R.isPointLight){let O=n.get(R);if(O.color.copy(R.color).multiplyScalar(R.intensity),O.distance=R.distance,O.decay=R.decay,R.castShadow){let F=R.shadow,ie=t.get(R);ie.shadowIntensity=F.intensity,ie.shadowBias=F.bias,ie.shadowNormalBias=F.normalBias,ie.shadowRadius=F.radius,ie.shadowMapSize=F.mapSize,ie.shadowCameraNear=F.camera.near,ie.shadowCameraFar=F.camera.far,i.pointShadow[M]=ie,i.pointShadowMap[M]=Y,i.pointShadowMatrix[M]=R.shadow.matrix,T++}i.point[M]=O,M++}else if(R.isHemisphereLight){let O=n.get(R);O.skyColor.copy(R.color).multiplyScalar(z),O.groundColor.copy(R.groundColor).multiplyScalar(z),i.hemi[s]=O,s++}}l>0&&(e.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ae.LTC_FLOAT_1,i.rectAreaLTC2=ae.LTC_FLOAT_2):(i.rectAreaLTC1=ae.LTC_HALF_1,i.rectAreaLTC2=ae.LTC_HALF_2)),i.ambient[0]=B,i.ambient[1]=D,i.ambient[2]=p;let f=i.hash;(f.directionalLength!==S||f.pointLength!==M||f.spotLength!==y||f.rectAreaLength!==l||f.hemiLength!==s||f.numDirectionalShadows!==g||f.numPointShadows!==T||f.numSpotShadows!==E||f.numSpotMaps!==N||f.numLightProbes!==w)&&(i.directional.length=S,i.spot.length=y,i.rectArea.length=l,i.point.length=M,i.hemi.length=s,i.directionalShadow.length=g,i.directionalShadowMap.length=g,i.pointShadow.length=T,i.pointShadowMap.length=T,i.spotShadow.length=E,i.spotShadowMap.length=E,i.directionalShadowMatrix.length=g,i.pointShadowMatrix.length=T,i.spotLightMatrix.length=E+N-b,i.spotLightMap.length=N,i.numSpotLightShadowsWithMaps=b,i.numLightProbes=w,f.directionalLength=S,f.pointLength=M,f.spotLength=y,f.rectAreaLength=l,f.hemiLength=s,f.numDirectionalShadows=g,f.numPointShadows=T,f.numSpotShadows=E,f.numSpotMaps=N,f.numLightProbes=w,i.version=qf++)}function L(C,B){let D=0,p=0,S=0,M=0,y=0,l=B.matrixWorldInverse;for(let s=0,g=C.length;s<g;s++){let T=C[s];if(T.isDirectionalLight){let E=i.directional[D];E.direction.setFromMatrixPosition(T.matrixWorld),c.setFromMatrixPosition(T.target.matrixWorld),E.direction.sub(c),E.direction.transformDirection(l),D++}else if(T.isSpotLight){let E=i.spot[S];E.position.setFromMatrixPosition(T.matrixWorld),E.position.applyMatrix4(l),E.direction.setFromMatrixPosition(T.matrixWorld),c.setFromMatrixPosition(T.target.matrixWorld),E.direction.sub(c),E.direction.transformDirection(l),S++}else if(T.isRectAreaLight){let E=i.rectArea[M];E.position.setFromMatrixPosition(T.matrixWorld),E.position.applyMatrix4(l),d.identity(),a.copy(T.matrixWorld),a.premultiply(l),d.extractRotation(a),E.halfWidth.set(T.width*.5,0,0),E.halfHeight.set(0,T.height*.5,0),E.halfWidth.applyMatrix4(d),E.halfHeight.applyMatrix4(d),M++}else if(T.isPointLight){let E=i.point[p];E.position.setFromMatrixPosition(T.matrixWorld),E.position.applyMatrix4(l),p++}else if(T.isHemisphereLight){let E=i.hemi[y];E.direction.setFromMatrixPosition(T.matrixWorld),E.direction.transformDirection(l),y++}}}return{setup:_,setupView:L,state:i}}function fo(e){let n=new $f(e),t=[],i=[];function c(B){C.camera=B,t.length=0,i.length=0}function a(B){t.push(B)}function d(B){i.push(B)}function _(){n.setup(t)}function L(B){n.setupView(t,B)}let C={lightsArray:t,shadowsArray:i,camera:null,lights:n,transmissionRenderTarget:{}};return{init:c,state:C,setupLights:_,setupLightsView:L,pushLight:a,pushShadow:d}}function Zf(e){let n=new WeakMap;function t(c,a=0){let d=n.get(c),_;return d===void 0?(_=new fo(e),n.set(c,[_])):a>=d.length?(_=new fo(e),d.push(_)):_=d[a],_}function i(){n=new WeakMap}return{get:t,dispose:i}}var Qf=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Jf=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,jf=[new Be(1,0,0),new Be(-1,0,0),new Be(0,1,0),new Be(0,-1,0),new Be(0,0,1),new Be(0,0,-1)],ed=[new Be(0,-1,0),new Be(0,-1,0),new Be(0,0,1),new Be(0,0,-1),new Be(0,-1,0),new Be(0,-1,0)],uo=new Xt,vn=new Be,ar=new Be;function td(e,n,t){let i=new qi,c=new dt,a=new dt,d=new ut,_=new Ha,L=new Va,C={},B=t.maxTextureSize,D={[Jt]:ht,[ht]:Jt,[Mt]:Mt},p=new Ct({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new dt},radius:{value:4}},vertexShader:Qf,fragmentShader:Jf}),S=p.clone();S.defines.HORIZONTAL_PASS=1;let M=new hn;M.setAttribute("position",new pn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let y=new Rt(M,p),l=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=sn;let s=this.type;this.render=function(b,w,f){if(l.enabled===!1||l.autoUpdate===!1&&l.needsUpdate===!1||b.length===0)return;this.type===br&&(ze("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=sn);let h=e.getRenderTarget(),$=e.getActiveCubeFace(),R=e.getActiveMipmapLevel(),V=e.state;V.setBlending(Tt),V.buffers.depth.getReversed()===!0?V.buffers.color.setClear(0,0,0,0):V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);let z=s!==this.type;z&&w.traverse(function(W){W.material&&(Array.isArray(W.material)?W.material.forEach(Y=>Y.needsUpdate=!0):W.material.needsUpdate=!0)});for(let W=0,Y=b.length;W<Y;W++){let O=b[W],F=O.shadow;if(F===void 0){ze("WebGLShadowMap:",O,"has no shadow.");continue}if(F.autoUpdate===!1&&F.needsUpdate===!1)continue;c.copy(F.mapSize);let ie=F.getFrameExtents();c.multiply(ie),a.copy(F.mapSize),(c.x>B||c.y>B)&&(c.x>B&&(a.x=Math.floor(B/ie.x),c.x=a.x*ie.x,F.mapSize.x=a.x),c.y>B&&(a.y=Math.floor(B/ie.y),c.y=a.y*ie.y,F.mapSize.y=a.y));let re=e.state.buffers.depth.getReversed();if(F.camera._reversedDepth=re,F.map===null||z===!0){if(F.map!==null&&(F.map.depthTexture!==null&&(F.map.depthTexture.dispose(),F.map.depthTexture=null),F.map.dispose()),this.type===Qt){if(O.isPointLight){ze("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}F.map=new Et(c.x,c.y,{format:nn,type:wt,minFilter:mt,magFilter:mt,generateMipmaps:!1}),F.map.texture.name=O.name+".shadowMap",F.map.depthTexture=new mn(c.x,c.y,Ut),F.map.depthTexture.name=O.name+".shadowMapDepth",F.map.depthTexture.format=kt,F.map.depthTexture.compareFunction=null,F.map.depthTexture.minFilter=yt,F.map.depthTexture.magFilter=yt}else O.isPointLight?(F.map=new Bn(c.x),F.map.depthTexture=new Oa(c.x,Ft)):(F.map=new Et(c.x,c.y),F.map.depthTexture=new mn(c.x,c.y,Ft)),F.map.depthTexture.name=O.name+".shadowMap",F.map.depthTexture.format=kt,this.type===sn?(F.map.depthTexture.compareFunction=re?Un:Dn,F.map.depthTexture.minFilter=mt,F.map.depthTexture.magFilter=mt):(F.map.depthTexture.compareFunction=null,F.map.depthTexture.minFilter=yt,F.map.depthTexture.magFilter=yt);F.camera.updateProjectionMatrix()}let Me=F.map.isWebGLCubeRenderTarget?6:1;for(let Ae=0;Ae<Me;Ae++){if(F.map.isWebGLCubeRenderTarget)e.setRenderTarget(F.map,Ae),e.clear();else{Ae===0&&(e.setRenderTarget(F.map),e.clear());let he=F.getViewport(Ae);d.set(a.x*he.x,a.y*he.y,a.x*he.z,a.y*he.w),V.viewport(d)}if(O.isPointLight){let he=F.camera,Ne=F.matrix,Je=O.distance||he.far;Je!==he.far&&(he.far=Je,he.updateProjectionMatrix()),vn.setFromMatrixPosition(O.matrixWorld),he.position.copy(vn),ar.copy(he.position),ar.add(jf[Ae]),he.up.copy(ed[Ae]),he.lookAt(ar),he.updateMatrixWorld(),Ne.makeTranslation(-vn.x,-vn.y,-vn.z),uo.multiplyMatrices(he.projectionMatrix,he.matrixWorldInverse),F._frustum.setFromProjectionMatrix(uo,he.coordinateSystem,he.reversedDepth)}else F.updateMatrices(O);i=F.getFrustum(),E(w,f,F.camera,O,this.type)}F.isPointLightShadow!==!0&&this.type===Qt&&g(F,f),F.needsUpdate=!1}s=this.type,l.needsUpdate=!1,e.setRenderTarget(h,$,R)};function g(b,w){let f=n.update(y);p.defines.VSM_SAMPLES!==b.blurSamples&&(p.defines.VSM_SAMPLES=b.blurSamples,S.defines.VSM_SAMPLES=b.blurSamples,p.needsUpdate=!0,S.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new Et(c.x,c.y,{format:nn,type:wt})),p.uniforms.shadow_pass.value=b.map.depthTexture,p.uniforms.resolution.value=b.mapSize,p.uniforms.radius.value=b.radius,e.setRenderTarget(b.mapPass),e.clear(),e.renderBufferDirect(w,null,f,p,y,null),S.uniforms.shadow_pass.value=b.mapPass.texture,S.uniforms.resolution.value=b.mapSize,S.uniforms.radius.value=b.radius,e.setRenderTarget(b.map),e.clear(),e.renderBufferDirect(w,null,f,S,y,null)}function T(b,w,f,h){let $=null,R=f.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(R!==void 0)$=R;else if($=f.isPointLight===!0?L:_,e.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0||w.alphaToCoverage===!0){let V=$.uuid,z=w.uuid,W=C[V];W===void 0&&(W={},C[V]=W);let Y=W[z];Y===void 0&&(Y=$.clone(),W[z]=Y,w.addEventListener("dispose",N)),$=Y}if($.visible=w.visible,$.wireframe=w.wireframe,h===Qt?$.side=w.shadowSide!==null?w.shadowSide:w.side:$.side=w.shadowSide!==null?w.shadowSide:D[w.side],$.alphaMap=w.alphaMap,$.alphaTest=w.alphaToCoverage===!0?.5:w.alphaTest,$.map=w.map,$.clipShadows=w.clipShadows,$.clippingPlanes=w.clippingPlanes,$.clipIntersection=w.clipIntersection,$.displacementMap=w.displacementMap,$.displacementScale=w.displacementScale,$.displacementBias=w.displacementBias,$.wireframeLinewidth=w.wireframeLinewidth,$.linewidth=w.linewidth,f.isPointLight===!0&&$.isMeshDistanceMaterial===!0){let V=e.properties.get($);V.light=f}return $}function E(b,w,f,h,$){if(b.visible===!1)return;if(b.layers.test(w.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&$===Qt)&&(!b.frustumCulled||i.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(f.matrixWorldInverse,b.matrixWorld);let z=n.update(b),W=b.material;if(Array.isArray(W)){let Y=z.groups;for(let O=0,F=Y.length;O<F;O++){let ie=Y[O],re=W[ie.materialIndex];if(re&&re.visible){let Me=T(b,re,h,$);b.onBeforeShadow(e,b,w,f,z,Me,ie),e.renderBufferDirect(f,null,z,Me,b,ie),b.onAfterShadow(e,b,w,f,z,Me,ie)}}}else if(W.visible){let Y=T(b,W,h,$);b.onBeforeShadow(e,b,w,f,z,Y,null),e.renderBufferDirect(f,null,z,Y,b,null),b.onAfterShadow(e,b,w,f,z,Y,null)}}let V=b.children;for(let z=0,W=V.length;z<W;z++)E(V[z],w,f,h,$)}function N(b){b.target.removeEventListener("dispose",N);for(let f in C){let h=C[f],$=b.target.uuid;$ in h&&(h[$].dispose(),delete h[$])}}}function nd(e,n){function t(){let v=!1,te=new ut,J=null,fe=new ut(0,0,0,0);return{setMask:function(Z){J!==Z&&!v&&(e.colorMask(Z,Z,Z,Z),J=Z)},setLocked:function(Z){v=Z},setClear:function(Z,G,pe,be,$e){$e===!0&&(Z*=be,G*=be,pe*=be),te.set(Z,G,pe,be),fe.equals(te)===!1&&(e.clearColor(Z,G,pe,be),fe.copy(te))},reset:function(){v=!1,J=null,fe.set(-1,0,0,0)}}}function i(){let v=!1,te=!1,J=null,fe=null,Z=null;return{setReversed:function(G){if(te!==G){let pe=n.get("EXT_clip_control");G?pe.clipControlEXT(pe.LOWER_LEFT_EXT,pe.ZERO_TO_ONE_EXT):pe.clipControlEXT(pe.LOWER_LEFT_EXT,pe.NEGATIVE_ONE_TO_ONE_EXT),te=G;let be=Z;Z=null,this.setClear(be)}},getReversed:function(){return te},setTest:function(G){G?j(e.DEPTH_TEST):ne(e.DEPTH_TEST)},setMask:function(G){J!==G&&!v&&(e.depthMask(G),J=G)},setFunc:function(G){if(te&&(G=Ca[G]),fe!==G){switch(G){case Kr:e.depthFunc(e.NEVER);break;case $r:e.depthFunc(e.ALWAYS);break;case Zr:e.depthFunc(e.LESS);break;case qn:e.depthFunc(e.LEQUAL);break;case Qr:e.depthFunc(e.EQUAL);break;case Jr:e.depthFunc(e.GEQUAL);break;case jr:e.depthFunc(e.GREATER);break;case ea:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}fe=G}},setLocked:function(G){v=G},setClear:function(G){Z!==G&&(Z=G,te&&(G=1-G),e.clearDepth(G))},reset:function(){v=!1,J=null,fe=null,Z=null,te=!1}}}function c(){let v=!1,te=null,J=null,fe=null,Z=null,G=null,pe=null,be=null,$e=null;return{setTest:function(Ve){v||(Ve?j(e.STENCIL_TEST):ne(e.STENCIL_TEST))},setMask:function(Ve){te!==Ve&&!v&&(e.stencilMask(Ve),te=Ve)},setFunc:function(Ve,Lt,Dt){(J!==Ve||fe!==Lt||Z!==Dt)&&(e.stencilFunc(Ve,Lt,Dt),J=Ve,fe=Lt,Z=Dt)},setOp:function(Ve,Lt,Dt){(G!==Ve||pe!==Lt||be!==Dt)&&(e.stencilOp(Ve,Lt,Dt),G=Ve,pe=Lt,be=Dt)},setLocked:function(Ve){v=Ve},setClear:function(Ve){$e!==Ve&&(e.clearStencil(Ve),$e=Ve)},reset:function(){v=!1,te=null,J=null,fe=null,Z=null,G=null,pe=null,be=null,$e=null}}}let a=new t,d=new i,_=new c,L=new WeakMap,C=new WeakMap,B={},D={},p=new WeakMap,S=[],M=null,y=!1,l=null,s=null,g=null,T=null,E=null,N=null,b=null,w=new Qe(0,0,0),f=0,h=!1,$=null,R=null,V=null,z=null,W=null,Y=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),O=!1,F=0,ie=e.getParameter(e.VERSION);ie.indexOf("WebGL")!==-1?(F=parseFloat(/^WebGL (\d)/.exec(ie)[1]),O=F>=1):ie.indexOf("OpenGL ES")!==-1&&(F=parseFloat(/^OpenGL ES (\d)/.exec(ie)[1]),O=F>=2);let re=null,Me={},Ae=e.getParameter(e.SCISSOR_BOX),he=e.getParameter(e.VIEWPORT),Ne=new ut().fromArray(Ae),Je=new ut().fromArray(he);function je(v,te,J,fe){let Z=new Uint8Array(4),G=e.createTexture();e.bindTexture(v,G),e.texParameteri(v,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(v,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let pe=0;pe<J;pe++)v===e.TEXTURE_3D||v===e.TEXTURE_2D_ARRAY?e.texImage3D(te,0,e.RGBA,1,1,fe,0,e.RGBA,e.UNSIGNED_BYTE,Z):e.texImage2D(te+pe,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,Z);return G}let X={};X[e.TEXTURE_2D]=je(e.TEXTURE_2D,e.TEXTURE_2D,1),X[e.TEXTURE_CUBE_MAP]=je(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),X[e.TEXTURE_2D_ARRAY]=je(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),X[e.TEXTURE_3D]=je(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),d.setClear(1),_.setClear(0),j(e.DEPTH_TEST),d.setFunc(qn),Ue(!1),nt(Wn),j(e.CULL_FACE),He(Tt);function j(v){B[v]!==!0&&(e.enable(v),B[v]=!0)}function ne(v){B[v]!==!1&&(e.disable(v),B[v]=!1)}function Le(v,te){return D[v]!==te?(e.bindFramebuffer(v,te),D[v]=te,v===e.DRAW_FRAMEBUFFER&&(D[e.FRAMEBUFFER]=te),v===e.FRAMEBUFFER&&(D[e.DRAW_FRAMEBUFFER]=te),!0):!1}function Te(v,te){let J=S,fe=!1;if(v){J=p.get(te),J===void 0&&(J=[],p.set(te,J));let Z=v.textures;if(J.length!==Z.length||J[0]!==e.COLOR_ATTACHMENT0){for(let G=0,pe=Z.length;G<pe;G++)J[G]=e.COLOR_ATTACHMENT0+G;J.length=Z.length,fe=!0}}else J[0]!==e.BACK&&(J[0]=e.BACK,fe=!0);fe&&e.drawBuffers(J)}function Ce(v){return M!==v?(e.useProgram(v),M=v,!0):!1}let st={[jt]:e.FUNC_ADD,[Lr]:e.FUNC_SUBTRACT,[Dr]:e.FUNC_REVERSE_SUBTRACT};st[Ur]=e.MIN,st[wr]=e.MAX;let ye={[Ir]:e.ZERO,[Nr]:e.ONE,[yr]:e.SRC_COLOR,[Or]:e.SRC_ALPHA,[Wr]:e.SRC_ALPHA_SATURATE,[Vr]:e.DST_COLOR,[Gr]:e.DST_ALPHA,[Fr]:e.ONE_MINUS_SRC_COLOR,[Br]:e.ONE_MINUS_SRC_ALPHA,[kr]:e.ONE_MINUS_DST_COLOR,[Hr]:e.ONE_MINUS_DST_ALPHA,[zr]:e.CONSTANT_COLOR,[Xr]:e.ONE_MINUS_CONSTANT_COLOR,[Yr]:e.CONSTANT_ALPHA,[qr]:e.ONE_MINUS_CONSTANT_ALPHA};function He(v,te,J,fe,Z,G,pe,be,$e,Ve){if(v===Tt){y===!0&&(ne(e.BLEND),y=!1);return}if(y===!1&&(j(e.BLEND),y=!0),v!==Pr){if(v!==l||Ve!==h){if((s!==jt||E!==jt)&&(e.blendEquation(e.FUNC_ADD),s=jt,E=jt),Ve)switch(v){case ln:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case zn:e.blendFunc(e.ONE,e.ONE);break;case Xn:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case Yn:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:Ze("WebGLState: Invalid blending: ",v);break}else switch(v){case ln:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case zn:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case Xn:Ze("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Yn:Ze("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ze("WebGLState: Invalid blending: ",v);break}g=null,T=null,N=null,b=null,w.set(0,0,0),f=0,l=v,h=Ve}return}Z=Z||te,G=G||J,pe=pe||fe,(te!==s||Z!==E)&&(e.blendEquationSeparate(st[te],st[Z]),s=te,E=Z),(J!==g||fe!==T||G!==N||pe!==b)&&(e.blendFuncSeparate(ye[J],ye[fe],ye[G],ye[pe]),g=J,T=fe,N=G,b=pe),(be.equals(w)===!1||$e!==f)&&(e.blendColor(be.r,be.g,be.b,$e),w.copy(be),f=$e),l=v,h=!1}function Xe(v,te){v.side===Mt?ne(e.CULL_FACE):j(e.CULL_FACE);let J=v.side===ht;te&&(J=!J),Ue(J),v.blending===ln&&v.transparent===!1?He(Tt):He(v.blending,v.blendEquation,v.blendSrc,v.blendDst,v.blendEquationAlpha,v.blendSrcAlpha,v.blendDstAlpha,v.blendColor,v.blendAlpha,v.premultipliedAlpha),d.setFunc(v.depthFunc),d.setTest(v.depthTest),d.setMask(v.depthWrite),a.setMask(v.colorWrite);let fe=v.stencilWrite;_.setTest(fe),fe&&(_.setMask(v.stencilWriteMask),_.setFunc(v.stencilFunc,v.stencilRef,v.stencilFuncMask),_.setOp(v.stencilFail,v.stencilZFail,v.stencilZPass)),rt(v.polygonOffset,v.polygonOffsetFactor,v.polygonOffsetUnits),v.alphaToCoverage===!0?j(e.SAMPLE_ALPHA_TO_COVERAGE):ne(e.SAMPLE_ALPHA_TO_COVERAGE)}function Ue(v){$!==v&&(v?e.frontFace(e.CW):e.frontFace(e.CCW),$=v)}function nt(v){v!==Rr?(j(e.CULL_FACE),v!==R&&(v===Wn?e.cullFace(e.BACK):v===Cr?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))):ne(e.CULL_FACE),R=v}function m(v){v!==V&&(O&&e.lineWidth(v),V=v)}function rt(v,te,J){v?(j(e.POLYGON_OFFSET_FILL),(z!==te||W!==J)&&(z=te,W=J,d.getReversed()&&(te=-te),e.polygonOffset(te,J))):ne(e.POLYGON_OFFSET_FILL)}function Ge(v){v?j(e.SCISSOR_TEST):ne(e.SCISSOR_TEST)}function Ke(v){v===void 0&&(v=e.TEXTURE0+Y-1),re!==v&&(e.activeTexture(v),re=v)}function ge(v,te,J){J===void 0&&(re===null?J=e.TEXTURE0+Y-1:J=re);let fe=Me[J];fe===void 0&&(fe={type:void 0,texture:void 0},Me[J]=fe),(fe.type!==v||fe.texture!==te)&&(re!==J&&(e.activeTexture(J),re=J),e.bindTexture(v,te||X[v]),fe.type=v,fe.texture=te)}function u(){let v=Me[re];v!==void 0&&v.type!==void 0&&(e.bindTexture(v.type,null),v.type=void 0,v.texture=void 0)}function r(){try{e.compressedTexImage2D(...arguments)}catch(v){Ze("WebGLState:",v)}}function x(){try{e.compressedTexImage3D(...arguments)}catch(v){Ze("WebGLState:",v)}}function k(){try{e.texSubImage2D(...arguments)}catch(v){Ze("WebGLState:",v)}}function q(){try{e.texSubImage3D(...arguments)}catch(v){Ze("WebGLState:",v)}}function H(){try{e.compressedTexSubImage2D(...arguments)}catch(v){Ze("WebGLState:",v)}}function de(){try{e.compressedTexSubImage3D(...arguments)}catch(v){Ze("WebGLState:",v)}}function ee(){try{e.texStorage2D(...arguments)}catch(v){Ze("WebGLState:",v)}}function xe(){try{e.texStorage3D(...arguments)}catch(v){Ze("WebGLState:",v)}}function Re(){try{e.texImage2D(...arguments)}catch(v){Ze("WebGLState:",v)}}function K(){try{e.texImage3D(...arguments)}catch(v){Ze("WebGLState:",v)}}function Q(v){Ne.equals(v)===!1&&(e.scissor(v.x,v.y,v.z,v.w),Ne.copy(v))}function ue(v){Je.equals(v)===!1&&(e.viewport(v.x,v.y,v.z,v.w),Je.copy(v))}function me(v,te){let J=C.get(te);J===void 0&&(J=new WeakMap,C.set(te,J));let fe=J.get(v);fe===void 0&&(fe=e.getUniformBlockIndex(te,v.name),J.set(v,fe))}function le(v,te){let fe=C.get(te).get(v);L.get(te)!==fe&&(e.uniformBlockBinding(te,fe,v.__bindingPointIndex),L.set(te,fe))}function we(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),d.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),B={},re=null,Me={},D={},p=new WeakMap,S=[],M=null,y=!1,l=null,s=null,g=null,T=null,E=null,N=null,b=null,w=new Qe(0,0,0),f=0,h=!1,$=null,R=null,V=null,z=null,W=null,Ne.set(0,0,e.canvas.width,e.canvas.height),Je.set(0,0,e.canvas.width,e.canvas.height),a.reset(),d.reset(),_.reset()}return{buffers:{color:a,depth:d,stencil:_},enable:j,disable:ne,bindFramebuffer:Le,drawBuffers:Te,useProgram:Ce,setBlending:He,setMaterial:Xe,setFlipSided:Ue,setCullFace:nt,setLineWidth:m,setPolygonOffset:rt,setScissorTest:Ge,activeTexture:Ke,bindTexture:ge,unbindTexture:u,compressedTexImage2D:r,compressedTexImage3D:x,texImage2D:Re,texImage3D:K,updateUBOMapping:me,uniformBlockBinding:le,texStorage2D:ee,texStorage3D:xe,texSubImage2D:k,texSubImage3D:q,compressedTexSubImage2D:H,compressedTexSubImage3D:de,scissor:Q,viewport:ue,reset:we}}function id(e,n,t,i,c,a,d){let _=n.has("WEBGL_multisampled_render_to_texture")?n.get("WEBGL_multisampled_render_to_texture"):null,L=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),C=new dt,B=new WeakMap,D,p=new WeakMap,S=!1;try{S=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function M(u,r){return S?new OffscreenCanvas(u,r):Ta("canvas")}function y(u,r,x){let k=1,q=ge(u);if((q.width>x||q.height>x)&&(k=x/Math.max(q.width,q.height)),k<1)if(typeof HTMLImageElement<"u"&&u instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&u instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&u instanceof ImageBitmap||typeof VideoFrame<"u"&&u instanceof VideoFrame){let H=Math.floor(k*q.width),de=Math.floor(k*q.height);D===void 0&&(D=M(H,de));let ee=r?M(H,de):D;return ee.width=H,ee.height=de,ee.getContext("2d").drawImage(u,0,0,H,de),ze("WebGLRenderer: Texture has been resized from ("+q.width+"x"+q.height+") to ("+H+"x"+de+")."),ee}else return"data"in u&&ze("WebGLRenderer: Image in DataTexture is too big ("+q.width+"x"+q.height+")."),u;return u}function l(u){return u.generateMipmaps}function s(u){e.generateMipmap(u)}function g(u){return u.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:u.isWebGL3DRenderTarget?e.TEXTURE_3D:u.isWebGLArrayRenderTarget||u.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function T(u,r,x,k,q=!1){if(u!==null){if(e[u]!==void 0)return e[u];ze("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+u+"'")}let H=r;if(r===e.RED&&(x===e.FLOAT&&(H=e.R32F),x===e.HALF_FLOAT&&(H=e.R16F),x===e.UNSIGNED_BYTE&&(H=e.R8)),r===e.RED_INTEGER&&(x===e.UNSIGNED_BYTE&&(H=e.R8UI),x===e.UNSIGNED_SHORT&&(H=e.R16UI),x===e.UNSIGNED_INT&&(H=e.R32UI),x===e.BYTE&&(H=e.R8I),x===e.SHORT&&(H=e.R16I),x===e.INT&&(H=e.R32I)),r===e.RG&&(x===e.FLOAT&&(H=e.RG32F),x===e.HALF_FLOAT&&(H=e.RG16F),x===e.UNSIGNED_BYTE&&(H=e.RG8)),r===e.RG_INTEGER&&(x===e.UNSIGNED_BYTE&&(H=e.RG8UI),x===e.UNSIGNED_SHORT&&(H=e.RG16UI),x===e.UNSIGNED_INT&&(H=e.RG32UI),x===e.BYTE&&(H=e.RG8I),x===e.SHORT&&(H=e.RG16I),x===e.INT&&(H=e.RG32I)),r===e.RGB_INTEGER&&(x===e.UNSIGNED_BYTE&&(H=e.RGB8UI),x===e.UNSIGNED_SHORT&&(H=e.RGB16UI),x===e.UNSIGNED_INT&&(H=e.RGB32UI),x===e.BYTE&&(H=e.RGB8I),x===e.SHORT&&(H=e.RGB16I),x===e.INT&&(H=e.RGB32I)),r===e.RGBA_INTEGER&&(x===e.UNSIGNED_BYTE&&(H=e.RGBA8UI),x===e.UNSIGNED_SHORT&&(H=e.RGBA16UI),x===e.UNSIGNED_INT&&(H=e.RGBA32UI),x===e.BYTE&&(H=e.RGBA8I),x===e.SHORT&&(H=e.RGBA16I),x===e.INT&&(H=e.RGBA32I)),r===e.RGB&&(x===e.UNSIGNED_INT_5_9_9_9_REV&&(H=e.RGB9_E5),x===e.UNSIGNED_INT_10F_11F_11F_REV&&(H=e.R11F_G11F_B10F)),r===e.RGBA){let de=q?Gi:tt.getTransfer(k);x===e.FLOAT&&(H=e.RGBA32F),x===e.HALF_FLOAT&&(H=e.RGBA16F),x===e.UNSIGNED_BYTE&&(H=de===qe?e.SRGB8_ALPHA8:e.RGBA8),x===e.UNSIGNED_SHORT_4_4_4_4&&(H=e.RGBA4),x===e.UNSIGNED_SHORT_5_5_5_1&&(H=e.RGB5_A1)}return(H===e.R16F||H===e.R32F||H===e.RG16F||H===e.RG32F||H===e.RGBA16F||H===e.RGBA32F)&&n.get("EXT_color_buffer_float"),H}function E(u,r){let x;return u?r===null||r===Ft||r===tn?x=e.DEPTH24_STENCIL8:r===Ut?x=e.DEPTH32F_STENCIL8:r===dn&&(x=e.DEPTH24_STENCIL8,ze("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):r===null||r===Ft||r===tn?x=e.DEPTH_COMPONENT24:r===Ut?x=e.DEPTH_COMPONENT32F:r===dn&&(x=e.DEPTH_COMPONENT16),x}function N(u,r){return l(u)===!0||u.isFramebufferTexture&&u.minFilter!==yt&&u.minFilter!==mt?Math.log2(Math.max(r.width,r.height))+1:u.mipmaps!==void 0&&u.mipmaps.length>0?u.mipmaps.length:u.isCompressedTexture&&Array.isArray(u.image)?r.mipmaps.length:1}function b(u){let r=u.target;r.removeEventListener("dispose",b),f(r),r.isVideoTexture&&B.delete(r)}function w(u){let r=u.target;r.removeEventListener("dispose",w),$(r)}function f(u){let r=i.get(u);if(r.__webglInit===void 0)return;let x=u.source,k=p.get(x);if(k){let q=k[r.__cacheKey];q.usedTimes--,q.usedTimes===0&&h(u),Object.keys(k).length===0&&p.delete(x)}i.remove(u)}function h(u){let r=i.get(u);e.deleteTexture(r.__webglTexture);let x=u.source,k=p.get(x);delete k[r.__cacheKey],d.memory.textures--}function $(u){let r=i.get(u);if(u.depthTexture&&(u.depthTexture.dispose(),i.remove(u.depthTexture)),u.isWebGLCubeRenderTarget)for(let k=0;k<6;k++){if(Array.isArray(r.__webglFramebuffer[k]))for(let q=0;q<r.__webglFramebuffer[k].length;q++)e.deleteFramebuffer(r.__webglFramebuffer[k][q]);else e.deleteFramebuffer(r.__webglFramebuffer[k]);r.__webglDepthbuffer&&e.deleteRenderbuffer(r.__webglDepthbuffer[k])}else{if(Array.isArray(r.__webglFramebuffer))for(let k=0;k<r.__webglFramebuffer.length;k++)e.deleteFramebuffer(r.__webglFramebuffer[k]);else e.deleteFramebuffer(r.__webglFramebuffer);if(r.__webglDepthbuffer&&e.deleteRenderbuffer(r.__webglDepthbuffer),r.__webglMultisampledFramebuffer&&e.deleteFramebuffer(r.__webglMultisampledFramebuffer),r.__webglColorRenderbuffer)for(let k=0;k<r.__webglColorRenderbuffer.length;k++)r.__webglColorRenderbuffer[k]&&e.deleteRenderbuffer(r.__webglColorRenderbuffer[k]);r.__webglDepthRenderbuffer&&e.deleteRenderbuffer(r.__webglDepthRenderbuffer)}let x=u.textures;for(let k=0,q=x.length;k<q;k++){let H=i.get(x[k]);H.__webglTexture&&(e.deleteTexture(H.__webglTexture),d.memory.textures--),i.remove(x[k])}i.remove(u)}let R=0;function V(){R=0}function z(){let u=R;return u>=c.maxTextures&&ze("WebGLTextures: Trying to use "+u+" texture units while this GPU supports only "+c.maxTextures),R+=1,u}function W(u){let r=[];return r.push(u.wrapS),r.push(u.wrapT),r.push(u.wrapR||0),r.push(u.magFilter),r.push(u.minFilter),r.push(u.anisotropy),r.push(u.internalFormat),r.push(u.format),r.push(u.type),r.push(u.generateMipmaps),r.push(u.premultiplyAlpha),r.push(u.flipY),r.push(u.unpackAlignment),r.push(u.colorSpace),r.join()}function Y(u,r){let x=i.get(u);if(u.isVideoTexture&&Ge(u),u.isRenderTargetTexture===!1&&u.isExternalTexture!==!0&&u.version>0&&x.__version!==u.version){let k=u.image;if(k===null)ze("WebGLRenderer: Texture marked for update but no image data found.");else if(k.complete===!1)ze("WebGLRenderer: Texture marked for update but image is incomplete");else{X(x,u,r);return}}else u.isExternalTexture&&(x.__webglTexture=u.sourceTexture?u.sourceTexture:null);t.bindTexture(e.TEXTURE_2D,x.__webglTexture,e.TEXTURE0+r)}function O(u,r){let x=i.get(u);if(u.isRenderTargetTexture===!1&&u.version>0&&x.__version!==u.version){X(x,u,r);return}else u.isExternalTexture&&(x.__webglTexture=u.sourceTexture?u.sourceTexture:null);t.bindTexture(e.TEXTURE_2D_ARRAY,x.__webglTexture,e.TEXTURE0+r)}function F(u,r){let x=i.get(u);if(u.isRenderTargetTexture===!1&&u.version>0&&x.__version!==u.version){X(x,u,r);return}t.bindTexture(e.TEXTURE_3D,x.__webglTexture,e.TEXTURE0+r)}function ie(u,r){let x=i.get(u);if(u.isCubeDepthTexture!==!0&&u.version>0&&x.__version!==u.version){j(x,u,r);return}t.bindTexture(e.TEXTURE_CUBE_MAP,x.__webglTexture,e.TEXTURE0+r)}let re={[ra]:e.REPEAT,[An]:e.CLAMP_TO_EDGE,[aa]:e.MIRRORED_REPEAT},Me={[yt]:e.NEAREST,[oa]:e.NEAREST_MIPMAP_NEAREST,[fn]:e.NEAREST_MIPMAP_LINEAR,[mt]:e.LINEAR,[Rn]:e.LINEAR_MIPMAP_NEAREST,[Vt]:e.LINEAR_MIPMAP_LINEAR},Ae={[ga]:e.NEVER,[Ma]:e.ALWAYS,[va]:e.LESS,[Dn]:e.LEQUAL,[Sa]:e.EQUAL,[Un]:e.GEQUAL,[Ea]:e.GREATER,[xa]:e.NOTEQUAL};function he(u,r){if(r.type===Ut&&n.has("OES_texture_float_linear")===!1&&(r.magFilter===mt||r.magFilter===Rn||r.magFilter===fn||r.magFilter===Vt||r.minFilter===mt||r.minFilter===Rn||r.minFilter===fn||r.minFilter===Vt)&&ze("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),e.texParameteri(u,e.TEXTURE_WRAP_S,re[r.wrapS]),e.texParameteri(u,e.TEXTURE_WRAP_T,re[r.wrapT]),(u===e.TEXTURE_3D||u===e.TEXTURE_2D_ARRAY)&&e.texParameteri(u,e.TEXTURE_WRAP_R,re[r.wrapR]),e.texParameteri(u,e.TEXTURE_MAG_FILTER,Me[r.magFilter]),e.texParameteri(u,e.TEXTURE_MIN_FILTER,Me[r.minFilter]),r.compareFunction&&(e.texParameteri(u,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(u,e.TEXTURE_COMPARE_FUNC,Ae[r.compareFunction])),n.has("EXT_texture_filter_anisotropic")===!0){if(r.magFilter===yt||r.minFilter!==fn&&r.minFilter!==Vt||r.type===Ut&&n.has("OES_texture_float_linear")===!1)return;if(r.anisotropy>1||i.get(r).__currentAnisotropy){let x=n.get("EXT_texture_filter_anisotropic");e.texParameterf(u,x.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(r.anisotropy,c.getMaxAnisotropy())),i.get(r).__currentAnisotropy=r.anisotropy}}}function Ne(u,r){let x=!1;u.__webglInit===void 0&&(u.__webglInit=!0,r.addEventListener("dispose",b));let k=r.source,q=p.get(k);q===void 0&&(q={},p.set(k,q));let H=W(r);if(H!==u.__cacheKey){q[H]===void 0&&(q[H]={texture:e.createTexture(),usedTimes:0},d.memory.textures++,x=!0),q[H].usedTimes++;let de=q[u.__cacheKey];de!==void 0&&(q[u.__cacheKey].usedTimes--,de.usedTimes===0&&h(r)),u.__cacheKey=H,u.__webglTexture=q[H].texture}return x}function Je(u,r,x){return Math.floor(Math.floor(u/x)/r)}function je(u,r,x,k){let H=u.updateRanges;if(H.length===0)t.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,x,k,r.data);else{H.sort((K,Q)=>K.start-Q.start);let de=0;for(let K=1;K<H.length;K++){let Q=H[de],ue=H[K],me=Q.start+Q.count,le=Je(ue.start,r.width,4),we=Je(Q.start,r.width,4);ue.start<=me+1&&le===we&&Je(ue.start+ue.count-1,r.width,4)===le?Q.count=Math.max(Q.count,ue.start+ue.count-Q.start):(++de,H[de]=ue)}H.length=de+1;let ee=e.getParameter(e.UNPACK_ROW_LENGTH),xe=e.getParameter(e.UNPACK_SKIP_PIXELS),Re=e.getParameter(e.UNPACK_SKIP_ROWS);e.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let K=0,Q=H.length;K<Q;K++){let ue=H[K],me=Math.floor(ue.start/4),le=Math.ceil(ue.count/4),we=me%r.width,v=Math.floor(me/r.width),te=le,J=1;e.pixelStorei(e.UNPACK_SKIP_PIXELS,we),e.pixelStorei(e.UNPACK_SKIP_ROWS,v),t.texSubImage2D(e.TEXTURE_2D,0,we,v,te,J,x,k,r.data)}u.clearUpdateRanges(),e.pixelStorei(e.UNPACK_ROW_LENGTH,ee),e.pixelStorei(e.UNPACK_SKIP_PIXELS,xe),e.pixelStorei(e.UNPACK_SKIP_ROWS,Re)}}function X(u,r,x){let k=e.TEXTURE_2D;(r.isDataArrayTexture||r.isCompressedArrayTexture)&&(k=e.TEXTURE_2D_ARRAY),r.isData3DTexture&&(k=e.TEXTURE_3D);let q=Ne(u,r),H=r.source;t.bindTexture(k,u.__webglTexture,e.TEXTURE0+x);let de=i.get(H);if(H.version!==de.__version||q===!0){t.activeTexture(e.TEXTURE0+x);let ee=tt.getPrimaries(tt.workingColorSpace),xe=r.colorSpace===zt?null:tt.getPrimaries(r.colorSpace),Re=r.colorSpace===zt||ee===xe?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,r.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,r.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,r.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,Re);let K=y(r.image,!1,c.maxTextureSize);K=Ke(r,K);let Q=a.convert(r.format,r.colorSpace),ue=a.convert(r.type),me=T(r.internalFormat,Q,ue,r.colorSpace,r.isVideoTexture);he(k,r);let le,we=r.mipmaps,v=r.isVideoTexture!==!0,te=de.__version===void 0||q===!0,J=H.dataReady,fe=N(r,K);if(r.isDepthTexture)me=E(r.format===Wt,r.type),te&&(v?t.texStorage2D(e.TEXTURE_2D,1,me,K.width,K.height):t.texImage2D(e.TEXTURE_2D,0,me,K.width,K.height,0,Q,ue,null));else if(r.isDataTexture)if(we.length>0){v&&te&&t.texStorage2D(e.TEXTURE_2D,fe,me,we[0].width,we[0].height);for(let Z=0,G=we.length;Z<G;Z++)le=we[Z],v?J&&t.texSubImage2D(e.TEXTURE_2D,Z,0,0,le.width,le.height,Q,ue,le.data):t.texImage2D(e.TEXTURE_2D,Z,me,le.width,le.height,0,Q,ue,le.data);r.generateMipmaps=!1}else v?(te&&t.texStorage2D(e.TEXTURE_2D,fe,me,K.width,K.height),J&&je(r,K,Q,ue)):t.texImage2D(e.TEXTURE_2D,0,me,K.width,K.height,0,Q,ue,K.data);else if(r.isCompressedTexture)if(r.isCompressedArrayTexture){v&&te&&t.texStorage3D(e.TEXTURE_2D_ARRAY,fe,me,we[0].width,we[0].height,K.depth);for(let Z=0,G=we.length;Z<G;Z++)if(le=we[Z],r.format!==At)if(Q!==null)if(v){if(J)if(r.layerUpdates.size>0){let pe=ji(le.width,le.height,r.format,r.type);for(let be of r.layerUpdates){let $e=le.data.subarray(be*pe/le.data.BYTES_PER_ELEMENT,(be+1)*pe/le.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,Z,0,0,be,le.width,le.height,1,Q,$e)}r.clearLayerUpdates()}else t.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,Z,0,0,0,le.width,le.height,K.depth,Q,le.data)}else t.compressedTexImage3D(e.TEXTURE_2D_ARRAY,Z,me,le.width,le.height,K.depth,0,le.data,0,0);else ze("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else v?J&&t.texSubImage3D(e.TEXTURE_2D_ARRAY,Z,0,0,0,le.width,le.height,K.depth,Q,ue,le.data):t.texImage3D(e.TEXTURE_2D_ARRAY,Z,me,le.width,le.height,K.depth,0,Q,ue,le.data)}else{v&&te&&t.texStorage2D(e.TEXTURE_2D,fe,me,we[0].width,we[0].height);for(let Z=0,G=we.length;Z<G;Z++)le=we[Z],r.format!==At?Q!==null?v?J&&t.compressedTexSubImage2D(e.TEXTURE_2D,Z,0,0,le.width,le.height,Q,le.data):t.compressedTexImage2D(e.TEXTURE_2D,Z,me,le.width,le.height,0,le.data):ze("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):v?J&&t.texSubImage2D(e.TEXTURE_2D,Z,0,0,le.width,le.height,Q,ue,le.data):t.texImage2D(e.TEXTURE_2D,Z,me,le.width,le.height,0,Q,ue,le.data)}else if(r.isDataArrayTexture)if(v){if(te&&t.texStorage3D(e.TEXTURE_2D_ARRAY,fe,me,K.width,K.height,K.depth),J)if(r.layerUpdates.size>0){let Z=ji(K.width,K.height,r.format,r.type);for(let G of r.layerUpdates){let pe=K.data.subarray(G*Z/K.data.BYTES_PER_ELEMENT,(G+1)*Z/K.data.BYTES_PER_ELEMENT);t.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,G,K.width,K.height,1,Q,ue,pe)}r.clearLayerUpdates()}else t.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,K.width,K.height,K.depth,Q,ue,K.data)}else t.texImage3D(e.TEXTURE_2D_ARRAY,0,me,K.width,K.height,K.depth,0,Q,ue,K.data);else if(r.isData3DTexture)v?(te&&t.texStorage3D(e.TEXTURE_3D,fe,me,K.width,K.height,K.depth),J&&t.texSubImage3D(e.TEXTURE_3D,0,0,0,0,K.width,K.height,K.depth,Q,ue,K.data)):t.texImage3D(e.TEXTURE_3D,0,me,K.width,K.height,K.depth,0,Q,ue,K.data);else if(r.isFramebufferTexture){if(te)if(v)t.texStorage2D(e.TEXTURE_2D,fe,me,K.width,K.height);else{let Z=K.width,G=K.height;for(let pe=0;pe<fe;pe++)t.texImage2D(e.TEXTURE_2D,pe,me,Z,G,0,Q,ue,null),Z>>=1,G>>=1}}else if(we.length>0){if(v&&te){let Z=ge(we[0]);t.texStorage2D(e.TEXTURE_2D,fe,me,Z.width,Z.height)}for(let Z=0,G=we.length;Z<G;Z++)le=we[Z],v?J&&t.texSubImage2D(e.TEXTURE_2D,Z,0,0,Q,ue,le):t.texImage2D(e.TEXTURE_2D,Z,me,Q,ue,le);r.generateMipmaps=!1}else if(v){if(te){let Z=ge(K);t.texStorage2D(e.TEXTURE_2D,fe,me,Z.width,Z.height)}J&&t.texSubImage2D(e.TEXTURE_2D,0,0,0,Q,ue,K)}else t.texImage2D(e.TEXTURE_2D,0,me,Q,ue,K);l(r)&&s(k),de.__version=H.version,r.onUpdate&&r.onUpdate(r)}u.__version=r.version}function j(u,r,x){if(r.image.length!==6)return;let k=Ne(u,r),q=r.source;t.bindTexture(e.TEXTURE_CUBE_MAP,u.__webglTexture,e.TEXTURE0+x);let H=i.get(q);if(q.version!==H.__version||k===!0){t.activeTexture(e.TEXTURE0+x);let de=tt.getPrimaries(tt.workingColorSpace),ee=r.colorSpace===zt?null:tt.getPrimaries(r.colorSpace),xe=r.colorSpace===zt||de===ee?e.NONE:e.BROWSER_DEFAULT_WEBGL;e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,r.flipY),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,r.premultiplyAlpha),e.pixelStorei(e.UNPACK_ALIGNMENT,r.unpackAlignment),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe);let Re=r.isCompressedTexture||r.image[0].isCompressedTexture,K=r.image[0]&&r.image[0].isDataTexture,Q=[];for(let G=0;G<6;G++)!Re&&!K?Q[G]=y(r.image[G],!0,c.maxCubemapSize):Q[G]=K?r.image[G].image:r.image[G],Q[G]=Ke(r,Q[G]);let ue=Q[0],me=a.convert(r.format,r.colorSpace),le=a.convert(r.type),we=T(r.internalFormat,me,le,r.colorSpace),v=r.isVideoTexture!==!0,te=H.__version===void 0||k===!0,J=q.dataReady,fe=N(r,ue);he(e.TEXTURE_CUBE_MAP,r);let Z;if(Re){v&&te&&t.texStorage2D(e.TEXTURE_CUBE_MAP,fe,we,ue.width,ue.height);for(let G=0;G<6;G++){Z=Q[G].mipmaps;for(let pe=0;pe<Z.length;pe++){let be=Z[pe];r.format!==At?me!==null?v?J&&t.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+G,pe,0,0,be.width,be.height,me,be.data):t.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+G,pe,we,be.width,be.height,0,be.data):ze("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):v?J&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+G,pe,0,0,be.width,be.height,me,le,be.data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+G,pe,we,be.width,be.height,0,me,le,be.data)}}}else{if(Z=r.mipmaps,v&&te){Z.length>0&&fe++;let G=ge(Q[0]);t.texStorage2D(e.TEXTURE_CUBE_MAP,fe,we,G.width,G.height)}for(let G=0;G<6;G++)if(K){v?J&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+G,0,0,0,Q[G].width,Q[G].height,me,le,Q[G].data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+G,0,we,Q[G].width,Q[G].height,0,me,le,Q[G].data);for(let pe=0;pe<Z.length;pe++){let $e=Z[pe].image[G].image;v?J&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+G,pe+1,0,0,$e.width,$e.height,me,le,$e.data):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+G,pe+1,we,$e.width,$e.height,0,me,le,$e.data)}}else{v?J&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+G,0,0,0,me,le,Q[G]):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+G,0,we,me,le,Q[G]);for(let pe=0;pe<Z.length;pe++){let be=Z[pe];v?J&&t.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+G,pe+1,0,0,me,le,be.image[G]):t.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+G,pe+1,we,me,le,be.image[G])}}}l(r)&&s(e.TEXTURE_CUBE_MAP),H.__version=q.version,r.onUpdate&&r.onUpdate(r)}u.__version=r.version}function ne(u,r,x,k,q,H){let de=a.convert(x.format,x.colorSpace),ee=a.convert(x.type),xe=T(x.internalFormat,de,ee,x.colorSpace),Re=i.get(r),K=i.get(x);if(K.__renderTarget=r,!Re.__hasExternalTextures){let Q=Math.max(1,r.width>>H),ue=Math.max(1,r.height>>H);q===e.TEXTURE_3D||q===e.TEXTURE_2D_ARRAY?t.texImage3D(q,H,xe,Q,ue,r.depth,0,de,ee,null):t.texImage2D(q,H,xe,Q,ue,0,de,ee,null)}t.bindFramebuffer(e.FRAMEBUFFER,u),rt(r)?_.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,k,q,K.__webglTexture,0,m(r)):(q===e.TEXTURE_2D||q>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&q<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,k,q,K.__webglTexture,H),t.bindFramebuffer(e.FRAMEBUFFER,null)}function Le(u,r,x){if(e.bindRenderbuffer(e.RENDERBUFFER,u),r.depthBuffer){let k=r.depthTexture,q=k&&k.isDepthTexture?k.type:null,H=E(r.stencilBuffer,q),de=r.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;rt(r)?_.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,m(r),H,r.width,r.height):x?e.renderbufferStorageMultisample(e.RENDERBUFFER,m(r),H,r.width,r.height):e.renderbufferStorage(e.RENDERBUFFER,H,r.width,r.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,de,e.RENDERBUFFER,u)}else{let k=r.textures;for(let q=0;q<k.length;q++){let H=k[q],de=a.convert(H.format,H.colorSpace),ee=a.convert(H.type),xe=T(H.internalFormat,de,ee,H.colorSpace);rt(r)?_.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,m(r),xe,r.width,r.height):x?e.renderbufferStorageMultisample(e.RENDERBUFFER,m(r),xe,r.width,r.height):e.renderbufferStorage(e.RENDERBUFFER,xe,r.width,r.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function Te(u,r,x){let k=r.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(e.FRAMEBUFFER,u),!(r.depthTexture&&r.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let q=i.get(r.depthTexture);if(q.__renderTarget=r,(!q.__webglTexture||r.depthTexture.image.width!==r.width||r.depthTexture.image.height!==r.height)&&(r.depthTexture.image.width=r.width,r.depthTexture.image.height=r.height,r.depthTexture.needsUpdate=!0),k){if(q.__webglInit===void 0&&(q.__webglInit=!0,r.depthTexture.addEventListener("dispose",b)),q.__webglTexture===void 0){q.__webglTexture=e.createTexture(),t.bindTexture(e.TEXTURE_CUBE_MAP,q.__webglTexture),he(e.TEXTURE_CUBE_MAP,r.depthTexture);let Re=a.convert(r.depthTexture.format),K=a.convert(r.depthTexture.type),Q;r.depthTexture.format===kt?Q=e.DEPTH_COMPONENT24:r.depthTexture.format===Wt&&(Q=e.DEPTH24_STENCIL8);for(let ue=0;ue<6;ue++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,Q,r.width,r.height,0,Re,K,null)}}else Y(r.depthTexture,0);let H=q.__webglTexture,de=m(r),ee=k?e.TEXTURE_CUBE_MAP_POSITIVE_X+x:e.TEXTURE_2D,xe=r.depthTexture.format===Wt?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(r.depthTexture.format===kt)rt(r)?_.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,xe,ee,H,0,de):e.framebufferTexture2D(e.FRAMEBUFFER,xe,ee,H,0);else if(r.depthTexture.format===Wt)rt(r)?_.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,xe,ee,H,0,de):e.framebufferTexture2D(e.FRAMEBUFFER,xe,ee,H,0);else throw new Error("Unknown depthTexture format")}function Ce(u){let r=i.get(u),x=u.isWebGLCubeRenderTarget===!0;if(r.__boundDepthTexture!==u.depthTexture){let k=u.depthTexture;if(r.__depthDisposeCallback&&r.__depthDisposeCallback(),k){let q=()=>{delete r.__boundDepthTexture,delete r.__depthDisposeCallback,k.removeEventListener("dispose",q)};k.addEventListener("dispose",q),r.__depthDisposeCallback=q}r.__boundDepthTexture=k}if(u.depthTexture&&!r.__autoAllocateDepthBuffer)if(x)for(let k=0;k<6;k++)Te(r.__webglFramebuffer[k],u,k);else{let k=u.texture.mipmaps;k&&k.length>0?Te(r.__webglFramebuffer[0],u,0):Te(r.__webglFramebuffer,u,0)}else if(x){r.__webglDepthbuffer=[];for(let k=0;k<6;k++)if(t.bindFramebuffer(e.FRAMEBUFFER,r.__webglFramebuffer[k]),r.__webglDepthbuffer[k]===void 0)r.__webglDepthbuffer[k]=e.createRenderbuffer(),Le(r.__webglDepthbuffer[k],u,!1);else{let q=u.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,H=r.__webglDepthbuffer[k];e.bindRenderbuffer(e.RENDERBUFFER,H),e.framebufferRenderbuffer(e.FRAMEBUFFER,q,e.RENDERBUFFER,H)}}else{let k=u.texture.mipmaps;if(k&&k.length>0?t.bindFramebuffer(e.FRAMEBUFFER,r.__webglFramebuffer[0]):t.bindFramebuffer(e.FRAMEBUFFER,r.__webglFramebuffer),r.__webglDepthbuffer===void 0)r.__webglDepthbuffer=e.createRenderbuffer(),Le(r.__webglDepthbuffer,u,!1);else{let q=u.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,H=r.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,H),e.framebufferRenderbuffer(e.FRAMEBUFFER,q,e.RENDERBUFFER,H)}}t.bindFramebuffer(e.FRAMEBUFFER,null)}function st(u,r,x){let k=i.get(u);r!==void 0&&ne(k.__webglFramebuffer,u,u.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),x!==void 0&&Ce(u)}function ye(u){let r=u.texture,x=i.get(u),k=i.get(r);u.addEventListener("dispose",w);let q=u.textures,H=u.isWebGLCubeRenderTarget===!0,de=q.length>1;if(de||(k.__webglTexture===void 0&&(k.__webglTexture=e.createTexture()),k.__version=r.version,d.memory.textures++),H){x.__webglFramebuffer=[];for(let ee=0;ee<6;ee++)if(r.mipmaps&&r.mipmaps.length>0){x.__webglFramebuffer[ee]=[];for(let xe=0;xe<r.mipmaps.length;xe++)x.__webglFramebuffer[ee][xe]=e.createFramebuffer()}else x.__webglFramebuffer[ee]=e.createFramebuffer()}else{if(r.mipmaps&&r.mipmaps.length>0){x.__webglFramebuffer=[];for(let ee=0;ee<r.mipmaps.length;ee++)x.__webglFramebuffer[ee]=e.createFramebuffer()}else x.__webglFramebuffer=e.createFramebuffer();if(de)for(let ee=0,xe=q.length;ee<xe;ee++){let Re=i.get(q[ee]);Re.__webglTexture===void 0&&(Re.__webglTexture=e.createTexture(),d.memory.textures++)}if(u.samples>0&&rt(u)===!1){x.__webglMultisampledFramebuffer=e.createFramebuffer(),x.__webglColorRenderbuffer=[],t.bindFramebuffer(e.FRAMEBUFFER,x.__webglMultisampledFramebuffer);for(let ee=0;ee<q.length;ee++){let xe=q[ee];x.__webglColorRenderbuffer[ee]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,x.__webglColorRenderbuffer[ee]);let Re=a.convert(xe.format,xe.colorSpace),K=a.convert(xe.type),Q=T(xe.internalFormat,Re,K,xe.colorSpace,u.isXRRenderTarget===!0),ue=m(u);e.renderbufferStorageMultisample(e.RENDERBUFFER,ue,Q,u.width,u.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+ee,e.RENDERBUFFER,x.__webglColorRenderbuffer[ee])}e.bindRenderbuffer(e.RENDERBUFFER,null),u.depthBuffer&&(x.__webglDepthRenderbuffer=e.createRenderbuffer(),Le(x.__webglDepthRenderbuffer,u,!0)),t.bindFramebuffer(e.FRAMEBUFFER,null)}}if(H){t.bindTexture(e.TEXTURE_CUBE_MAP,k.__webglTexture),he(e.TEXTURE_CUBE_MAP,r);for(let ee=0;ee<6;ee++)if(r.mipmaps&&r.mipmaps.length>0)for(let xe=0;xe<r.mipmaps.length;xe++)ne(x.__webglFramebuffer[ee][xe],u,r,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,xe);else ne(x.__webglFramebuffer[ee],u,r,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0);l(r)&&s(e.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(de){for(let ee=0,xe=q.length;ee<xe;ee++){let Re=q[ee],K=i.get(Re),Q=e.TEXTURE_2D;(u.isWebGL3DRenderTarget||u.isWebGLArrayRenderTarget)&&(Q=u.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),t.bindTexture(Q,K.__webglTexture),he(Q,Re),ne(x.__webglFramebuffer,u,Re,e.COLOR_ATTACHMENT0+ee,Q,0),l(Re)&&s(Q)}t.unbindTexture()}else{let ee=e.TEXTURE_2D;if((u.isWebGL3DRenderTarget||u.isWebGLArrayRenderTarget)&&(ee=u.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),t.bindTexture(ee,k.__webglTexture),he(ee,r),r.mipmaps&&r.mipmaps.length>0)for(let xe=0;xe<r.mipmaps.length;xe++)ne(x.__webglFramebuffer[xe],u,r,e.COLOR_ATTACHMENT0,ee,xe);else ne(x.__webglFramebuffer,u,r,e.COLOR_ATTACHMENT0,ee,0);l(r)&&s(ee),t.unbindTexture()}u.depthBuffer&&Ce(u)}function He(u){let r=u.textures;for(let x=0,k=r.length;x<k;x++){let q=r[x];if(l(q)){let H=g(u),de=i.get(q).__webglTexture;t.bindTexture(H,de),s(H),t.unbindTexture()}}}let Xe=[],Ue=[];function nt(u){if(u.samples>0){if(rt(u)===!1){let r=u.textures,x=u.width,k=u.height,q=e.COLOR_BUFFER_BIT,H=u.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,de=i.get(u),ee=r.length>1;if(ee)for(let Re=0;Re<r.length;Re++)t.bindFramebuffer(e.FRAMEBUFFER,de.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+Re,e.RENDERBUFFER,null),t.bindFramebuffer(e.FRAMEBUFFER,de.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+Re,e.TEXTURE_2D,null,0);t.bindFramebuffer(e.READ_FRAMEBUFFER,de.__webglMultisampledFramebuffer);let xe=u.texture.mipmaps;xe&&xe.length>0?t.bindFramebuffer(e.DRAW_FRAMEBUFFER,de.__webglFramebuffer[0]):t.bindFramebuffer(e.DRAW_FRAMEBUFFER,de.__webglFramebuffer);for(let Re=0;Re<r.length;Re++){if(u.resolveDepthBuffer&&(u.depthBuffer&&(q|=e.DEPTH_BUFFER_BIT),u.stencilBuffer&&u.resolveStencilBuffer&&(q|=e.STENCIL_BUFFER_BIT)),ee){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,de.__webglColorRenderbuffer[Re]);let K=i.get(r[Re]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,K,0)}e.blitFramebuffer(0,0,x,k,0,0,x,k,q,e.NEAREST),L===!0&&(Xe.length=0,Ue.length=0,Xe.push(e.COLOR_ATTACHMENT0+Re),u.depthBuffer&&u.resolveDepthBuffer===!1&&(Xe.push(H),Ue.push(H),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,Ue)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Xe))}if(t.bindFramebuffer(e.READ_FRAMEBUFFER,null),t.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),ee)for(let Re=0;Re<r.length;Re++){t.bindFramebuffer(e.FRAMEBUFFER,de.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+Re,e.RENDERBUFFER,de.__webglColorRenderbuffer[Re]);let K=i.get(r[Re]).__webglTexture;t.bindFramebuffer(e.FRAMEBUFFER,de.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+Re,e.TEXTURE_2D,K,0)}t.bindFramebuffer(e.DRAW_FRAMEBUFFER,de.__webglMultisampledFramebuffer)}else if(u.depthBuffer&&u.resolveDepthBuffer===!1&&L){let r=u.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[r])}}}function m(u){return Math.min(c.maxSamples,u.samples)}function rt(u){let r=i.get(u);return u.samples>0&&n.has("WEBGL_multisampled_render_to_texture")===!0&&r.__useRenderToTexture!==!1}function Ge(u){let r=d.render.frame;B.get(u)!==r&&(B.set(u,r),u.update())}function Ke(u,r){let x=u.colorSpace,k=u.format,q=u.type;return u.isCompressedTexture===!0||u.isVideoTexture===!0||x!==un&&x!==zt&&(tt.getTransfer(x)===qe?(k!==At||q!==St)&&ze("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ze("WebGLTextures: Unsupported texture color space:",x)),r}function ge(u){return typeof HTMLImageElement<"u"&&u instanceof HTMLImageElement?(C.width=u.naturalWidth||u.width,C.height=u.naturalHeight||u.height):typeof VideoFrame<"u"&&u instanceof VideoFrame?(C.width=u.displayWidth,C.height=u.displayHeight):(C.width=u.width,C.height=u.height),C}this.allocateTextureUnit=z,this.resetTextureUnits=V,this.setTexture2D=Y,this.setTexture2DArray=O,this.setTexture3D=F,this.setTextureCube=ie,this.rebindTextures=st,this.setupRenderTarget=ye,this.updateRenderTargetMipmap=He,this.updateMultisampleRenderTarget=nt,this.setupDepthRenderbuffer=Ce,this.setupFrameBufferTexture=ne,this.useMultisampledRTT=rt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function rd(e,n){function t(i,c=zt){let a,d=tt.getTransfer(c);if(i===St)return e.UNSIGNED_BYTE;if(i===ni)return e.UNSIGNED_SHORT_4_4_4_4;if(i===ii)return e.UNSIGNED_SHORT_5_5_5_1;if(i===ca)return e.UNSIGNED_INT_5_9_9_9_REV;if(i===fa)return e.UNSIGNED_INT_10F_11F_11F_REV;if(i===sa)return e.BYTE;if(i===la)return e.SHORT;if(i===dn)return e.UNSIGNED_SHORT;if(i===ti)return e.INT;if(i===Ft)return e.UNSIGNED_INT;if(i===Ut)return e.FLOAT;if(i===wt)return e.HALF_FLOAT;if(i===da)return e.ALPHA;if(i===ua)return e.RGB;if(i===At)return e.RGBA;if(i===kt)return e.DEPTH_COMPONENT;if(i===Wt)return e.DEPTH_STENCIL;if(i===pa)return e.RED;if(i===ri)return e.RED_INTEGER;if(i===nn)return e.RG;if(i===ai)return e.RG_INTEGER;if(i===oi)return e.RGBA_INTEGER;if(i===Cn||i===bn||i===Pn||i===Ln)if(d===qe)if(a=n.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===Cn)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===bn)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Pn)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ln)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=n.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===Cn)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===bn)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Pn)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ln)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===si||i===li||i===ci||i===fi)if(a=n.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===si)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===li)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ci)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===fi)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===di||i===ui||i===pi||i===hi||i===mi||i===_i||i===gi)if(a=n.get("WEBGL_compressed_texture_etc"),a!==null){if(i===di||i===ui)return d===qe?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===pi)return d===qe?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC;if(i===hi)return a.COMPRESSED_R11_EAC;if(i===mi)return a.COMPRESSED_SIGNED_R11_EAC;if(i===_i)return a.COMPRESSED_RG11_EAC;if(i===gi)return a.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===vi||i===Si||i===Ei||i===xi||i===Mi||i===Ti||i===Ai||i===Ri||i===Ci||i===bi||i===Pi||i===Li||i===Di||i===Ui)if(a=n.get("WEBGL_compressed_texture_astc"),a!==null){if(i===vi)return d===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Si)return d===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Ei)return d===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===xi)return d===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Mi)return d===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Ti)return d===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ai)return d===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ri)return d===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ci)return d===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===bi)return d===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Pi)return d===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Li)return d===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Di)return d===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ui)return d===qe?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===wi||i===Ii||i===Ni)if(a=n.get("EXT_texture_compression_bptc"),a!==null){if(i===wi)return d===qe?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Ii)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Ni)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===yi||i===Fi||i===Oi||i===Bi)if(a=n.get("EXT_texture_compression_rgtc"),a!==null){if(i===yi)return a.COMPRESSED_RED_RGTC1_EXT;if(i===Fi)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Oi)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Bi)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===tn?e.UNSIGNED_INT_24_8:e[i]!==void 0?e[i]:null}return{convert:t}}var ad=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,od=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,pr=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(n,t){if(this.texture===null){let i=new $i(n.texture);(n.depthNear!==t.depthNear||n.depthFar!==t.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=i}}getMesh(n){if(this.texture!==null&&this.mesh===null){let t=n.cameras[0].viewport,i=new Ct({vertexShader:ad,fragmentShader:od,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Rt(new Zi(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},hr=class extends ba{constructor(n,t){super();let i=this,c=null,a=1,d=null,_="local-floor",L=1,C=null,B=null,D=null,p=null,S=null,M=null,y=typeof XRWebGLBinding<"u",l=new pr,s={},g=t.getContextAttributes(),T=null,E=null,N=[],b=[],w=new dt,f=null,h=new _n;h.viewport=new ut;let $=new _n;$.viewport=new ut;let R=[h,$],V=new Wa,z=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let j=N[X];return j===void 0&&(j=new wn,N[X]=j),j.getTargetRaySpace()},this.getControllerGrip=function(X){let j=N[X];return j===void 0&&(j=new wn,N[X]=j),j.getGripSpace()},this.getHand=function(X){let j=N[X];return j===void 0&&(j=new wn,N[X]=j),j.getHandSpace()};function Y(X){let j=b.indexOf(X.inputSource);if(j===-1)return;let ne=N[j];ne!==void 0&&(ne.update(X.inputSource,X.frame,C||d),ne.dispatchEvent({type:X.type,data:X.inputSource}))}function O(){c.removeEventListener("select",Y),c.removeEventListener("selectstart",Y),c.removeEventListener("selectend",Y),c.removeEventListener("squeeze",Y),c.removeEventListener("squeezestart",Y),c.removeEventListener("squeezeend",Y),c.removeEventListener("end",O),c.removeEventListener("inputsourceschange",F);for(let X=0;X<N.length;X++){let j=b[X];j!==null&&(b[X]=null,N[X].disconnect(j))}z=null,W=null,l.reset();for(let X in s)delete s[X];n.setRenderTarget(T),S=null,p=null,D=null,c=null,E=null,je.stop(),i.isPresenting=!1,n.setPixelRatio(f),n.setSize(w.width,w.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){a=X,i.isPresenting===!0&&ze("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){_=X,i.isPresenting===!0&&ze("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return C||d},this.setReferenceSpace=function(X){C=X},this.getBaseLayer=function(){return p!==null?p:S},this.getBinding=function(){return D===null&&y&&(D=new XRWebGLBinding(c,t)),D},this.getFrame=function(){return M},this.getSession=function(){return c},this.setSession=async function(X){if(c=X,c!==null){if(T=n.getRenderTarget(),c.addEventListener("select",Y),c.addEventListener("selectstart",Y),c.addEventListener("selectend",Y),c.addEventListener("squeeze",Y),c.addEventListener("squeezestart",Y),c.addEventListener("squeezeend",Y),c.addEventListener("end",O),c.addEventListener("inputsourceschange",F),g.xrCompatible!==!0&&await t.makeXRCompatible(),f=n.getPixelRatio(),n.getSize(w),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let ne=null,Le=null,Te=null;g.depth&&(Te=g.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ne=g.stencil?Wt:kt,Le=g.stencil?tn:Ft);let Ce={colorFormat:t.RGBA8,depthFormat:Te,scaleFactor:a};D=this.getBinding(),p=D.createProjectionLayer(Ce),c.updateRenderState({layers:[p]}),n.setPixelRatio(1),n.setSize(p.textureWidth,p.textureHeight,!1),E=new Et(p.textureWidth,p.textureHeight,{format:At,type:St,depthTexture:new mn(p.textureWidth,p.textureHeight,Le,void 0,void 0,void 0,void 0,void 0,void 0,ne),stencilBuffer:g.stencil,colorSpace:n.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}else{let ne={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:a};S=new XRWebGLLayer(c,t,ne),c.updateRenderState({baseLayer:S}),n.setPixelRatio(1),n.setSize(S.framebufferWidth,S.framebufferHeight,!1),E=new Et(S.framebufferWidth,S.framebufferHeight,{format:At,type:St,colorSpace:n.outputColorSpace,stencilBuffer:g.stencil,resolveDepthBuffer:S.ignoreDepthValues===!1,resolveStencilBuffer:S.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(L),C=null,d=await c.requestReferenceSpace(_),je.setContext(c),je.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(c!==null)return c.environmentBlendMode},this.getDepthTexture=function(){return l.getDepthTexture()};function F(X){for(let j=0;j<X.removed.length;j++){let ne=X.removed[j],Le=b.indexOf(ne);Le>=0&&(b[Le]=null,N[Le].disconnect(ne))}for(let j=0;j<X.added.length;j++){let ne=X.added[j],Le=b.indexOf(ne);if(Le===-1){for(let Ce=0;Ce<N.length;Ce++)if(Ce>=b.length){b.push(ne),Le=Ce;break}else if(b[Ce]===null){b[Ce]=ne,Le=Ce;break}if(Le===-1)break}let Te=N[Le];Te&&Te.connect(ne)}}let ie=new Be,re=new Be;function Me(X,j,ne){ie.setFromMatrixPosition(j.matrixWorld),re.setFromMatrixPosition(ne.matrixWorld);let Le=ie.distanceTo(re),Te=j.projectionMatrix.elements,Ce=ne.projectionMatrix.elements,st=Te[14]/(Te[10]-1),ye=Te[14]/(Te[10]+1),He=(Te[9]+1)/Te[5],Xe=(Te[9]-1)/Te[5],Ue=(Te[8]-1)/Te[0],nt=(Ce[8]+1)/Ce[0],m=st*Ue,rt=st*nt,Ge=Le/(-Ue+nt),Ke=Ge*-Ue;if(j.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(Ke),X.translateZ(Ge),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),Te[10]===-1)X.projectionMatrix.copy(j.projectionMatrix),X.projectionMatrixInverse.copy(j.projectionMatrixInverse);else{let ge=st+Ge,u=ye+Ge,r=m-Ke,x=rt+(Le-Ke),k=He*ye/u*ge,q=Xe*ye/u*ge;X.projectionMatrix.makePerspective(r,x,k,q,ge,u),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function Ae(X,j){j===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(j.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(c===null)return;let j=X.near,ne=X.far;l.texture!==null&&(l.depthNear>0&&(j=l.depthNear),l.depthFar>0&&(ne=l.depthFar)),V.near=$.near=h.near=j,V.far=$.far=h.far=ne,(z!==V.near||W!==V.far)&&(c.updateRenderState({depthNear:V.near,depthFar:V.far}),z=V.near,W=V.far),V.layers.mask=X.layers.mask|6,h.layers.mask=V.layers.mask&-5,$.layers.mask=V.layers.mask&-3;let Le=X.parent,Te=V.cameras;Ae(V,Le);for(let Ce=0;Ce<Te.length;Ce++)Ae(Te[Ce],Le);Te.length===2?Me(V,h,$):V.projectionMatrix.copy(h.projectionMatrix),he(X,V,Le)};function he(X,j,ne){ne===null?X.matrix.copy(j.matrixWorld):(X.matrix.copy(ne.matrixWorld),X.matrix.invert(),X.matrix.multiply(j.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(j.projectionMatrix),X.projectionMatrixInverse.copy(j.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=Pa*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return V},this.getFoveation=function(){if(!(p===null&&S===null))return L},this.setFoveation=function(X){L=X,p!==null&&(p.fixedFoveation=X),S!==null&&S.fixedFoveation!==void 0&&(S.fixedFoveation=X)},this.hasDepthSensing=function(){return l.texture!==null},this.getDepthSensingMesh=function(){return l.getMesh(V)},this.getCameraTexture=function(X){return s[X]};let Ne=null;function Je(X,j){if(B=j.getViewerPose(C||d),M=j,B!==null){let ne=B.views;S!==null&&(n.setRenderTargetFramebuffer(E,S.framebuffer),n.setRenderTarget(E));let Le=!1;ne.length!==V.cameras.length&&(V.cameras.length=0,Le=!0);for(let ye=0;ye<ne.length;ye++){let He=ne[ye],Xe=null;if(S!==null)Xe=S.getViewport(He);else{let nt=D.getViewSubImage(p,He);Xe=nt.viewport,ye===0&&(n.setRenderTargetTextures(E,nt.colorTexture,nt.depthStencilTexture),n.setRenderTarget(E))}let Ue=R[ye];Ue===void 0&&(Ue=new _n,Ue.layers.enable(ye),Ue.viewport=new ut,R[ye]=Ue),Ue.matrix.fromArray(He.transform.matrix),Ue.matrix.decompose(Ue.position,Ue.quaternion,Ue.scale),Ue.projectionMatrix.fromArray(He.projectionMatrix),Ue.projectionMatrixInverse.copy(Ue.projectionMatrix).invert(),Ue.viewport.set(Xe.x,Xe.y,Xe.width,Xe.height),ye===0&&(V.matrix.copy(Ue.matrix),V.matrix.decompose(V.position,V.quaternion,V.scale)),Le===!0&&V.cameras.push(Ue)}let Te=c.enabledFeatures;if(Te&&Te.includes("depth-sensing")&&c.depthUsage=="gpu-optimized"&&y){D=i.getBinding();let ye=D.getDepthInformation(ne[0]);ye&&ye.isValid&&ye.texture&&l.init(ye,c.renderState)}if(Te&&Te.includes("camera-access")&&y){n.state.unbindTexture(),D=i.getBinding();for(let ye=0;ye<ne.length;ye++){let He=ne[ye].camera;if(He){let Xe=s[He];Xe||(Xe=new $i,s[He]=Xe);let Ue=D.getCameraImage(He);Xe.sourceTexture=Ue}}}}for(let ne=0;ne<N.length;ne++){let Le=b[ne],Te=N[ne];Le!==null&&Te!==void 0&&Te.update(Le,j,C||d)}Ne&&Ne(X,j),j.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:j}),M=null}let je=new ho;je.setAnimationLoop(Je),this.setAnimationLoop=function(X){Ne=X},this.dispose=function(){}}},qt=new Xi,sd=new Xt;function ld(e,n){function t(l,s){l.matrixAutoUpdate===!0&&l.updateMatrix(),s.value.copy(l.matrix)}function i(l,s){s.color.getRGB(l.fogColor.value,Qi(e)),s.isFog?(l.fogNear.value=s.near,l.fogFar.value=s.far):s.isFogExp2&&(l.fogDensity.value=s.density)}function c(l,s,g,T,E){s.isMeshBasicMaterial?a(l,s):s.isMeshLambertMaterial?(a(l,s),s.envMap&&(l.envMapIntensity.value=s.envMapIntensity)):s.isMeshToonMaterial?(a(l,s),D(l,s)):s.isMeshPhongMaterial?(a(l,s),B(l,s),s.envMap&&(l.envMapIntensity.value=s.envMapIntensity)):s.isMeshStandardMaterial?(a(l,s),p(l,s),s.isMeshPhysicalMaterial&&S(l,s,E)):s.isMeshMatcapMaterial?(a(l,s),M(l,s)):s.isMeshDepthMaterial?a(l,s):s.isMeshDistanceMaterial?(a(l,s),y(l,s)):s.isMeshNormalMaterial?a(l,s):s.isLineBasicMaterial?(d(l,s),s.isLineDashedMaterial&&_(l,s)):s.isPointsMaterial?L(l,s,g,T):s.isSpriteMaterial?C(l,s):s.isShadowMaterial?(l.color.value.copy(s.color),l.opacity.value=s.opacity):s.isShaderMaterial&&(s.uniformsNeedUpdate=!1)}function a(l,s){l.opacity.value=s.opacity,s.color&&l.diffuse.value.copy(s.color),s.emissive&&l.emissive.value.copy(s.emissive).multiplyScalar(s.emissiveIntensity),s.map&&(l.map.value=s.map,t(s.map,l.mapTransform)),s.alphaMap&&(l.alphaMap.value=s.alphaMap,t(s.alphaMap,l.alphaMapTransform)),s.bumpMap&&(l.bumpMap.value=s.bumpMap,t(s.bumpMap,l.bumpMapTransform),l.bumpScale.value=s.bumpScale,s.side===ht&&(l.bumpScale.value*=-1)),s.normalMap&&(l.normalMap.value=s.normalMap,t(s.normalMap,l.normalMapTransform),l.normalScale.value.copy(s.normalScale),s.side===ht&&l.normalScale.value.negate()),s.displacementMap&&(l.displacementMap.value=s.displacementMap,t(s.displacementMap,l.displacementMapTransform),l.displacementScale.value=s.displacementScale,l.displacementBias.value=s.displacementBias),s.emissiveMap&&(l.emissiveMap.value=s.emissiveMap,t(s.emissiveMap,l.emissiveMapTransform)),s.specularMap&&(l.specularMap.value=s.specularMap,t(s.specularMap,l.specularMapTransform)),s.alphaTest>0&&(l.alphaTest.value=s.alphaTest);let g=n.get(s),T=g.envMap,E=g.envMapRotation;T&&(l.envMap.value=T,qt.copy(E),qt.x*=-1,qt.y*=-1,qt.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(qt.y*=-1,qt.z*=-1),l.envMapRotation.value.setFromMatrix4(sd.makeRotationFromEuler(qt)),l.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,l.reflectivity.value=s.reflectivity,l.ior.value=s.ior,l.refractionRatio.value=s.refractionRatio),s.lightMap&&(l.lightMap.value=s.lightMap,l.lightMapIntensity.value=s.lightMapIntensity,t(s.lightMap,l.lightMapTransform)),s.aoMap&&(l.aoMap.value=s.aoMap,l.aoMapIntensity.value=s.aoMapIntensity,t(s.aoMap,l.aoMapTransform))}function d(l,s){l.diffuse.value.copy(s.color),l.opacity.value=s.opacity,s.map&&(l.map.value=s.map,t(s.map,l.mapTransform))}function _(l,s){l.dashSize.value=s.dashSize,l.totalSize.value=s.dashSize+s.gapSize,l.scale.value=s.scale}function L(l,s,g,T){l.diffuse.value.copy(s.color),l.opacity.value=s.opacity,l.size.value=s.size*g,l.scale.value=T*.5,s.map&&(l.map.value=s.map,t(s.map,l.uvTransform)),s.alphaMap&&(l.alphaMap.value=s.alphaMap,t(s.alphaMap,l.alphaMapTransform)),s.alphaTest>0&&(l.alphaTest.value=s.alphaTest)}function C(l,s){l.diffuse.value.copy(s.color),l.opacity.value=s.opacity,l.rotation.value=s.rotation,s.map&&(l.map.value=s.map,t(s.map,l.mapTransform)),s.alphaMap&&(l.alphaMap.value=s.alphaMap,t(s.alphaMap,l.alphaMapTransform)),s.alphaTest>0&&(l.alphaTest.value=s.alphaTest)}function B(l,s){l.specular.value.copy(s.specular),l.shininess.value=Math.max(s.shininess,1e-4)}function D(l,s){s.gradientMap&&(l.gradientMap.value=s.gradientMap)}function p(l,s){l.metalness.value=s.metalness,s.metalnessMap&&(l.metalnessMap.value=s.metalnessMap,t(s.metalnessMap,l.metalnessMapTransform)),l.roughness.value=s.roughness,s.roughnessMap&&(l.roughnessMap.value=s.roughnessMap,t(s.roughnessMap,l.roughnessMapTransform)),s.envMap&&(l.envMapIntensity.value=s.envMapIntensity)}function S(l,s,g){l.ior.value=s.ior,s.sheen>0&&(l.sheenColor.value.copy(s.sheenColor).multiplyScalar(s.sheen),l.sheenRoughness.value=s.sheenRoughness,s.sheenColorMap&&(l.sheenColorMap.value=s.sheenColorMap,t(s.sheenColorMap,l.sheenColorMapTransform)),s.sheenRoughnessMap&&(l.sheenRoughnessMap.value=s.sheenRoughnessMap,t(s.sheenRoughnessMap,l.sheenRoughnessMapTransform))),s.clearcoat>0&&(l.clearcoat.value=s.clearcoat,l.clearcoatRoughness.value=s.clearcoatRoughness,s.clearcoatMap&&(l.clearcoatMap.value=s.clearcoatMap,t(s.clearcoatMap,l.clearcoatMapTransform)),s.clearcoatRoughnessMap&&(l.clearcoatRoughnessMap.value=s.clearcoatRoughnessMap,t(s.clearcoatRoughnessMap,l.clearcoatRoughnessMapTransform)),s.clearcoatNormalMap&&(l.clearcoatNormalMap.value=s.clearcoatNormalMap,t(s.clearcoatNormalMap,l.clearcoatNormalMapTransform),l.clearcoatNormalScale.value.copy(s.clearcoatNormalScale),s.side===ht&&l.clearcoatNormalScale.value.negate())),s.dispersion>0&&(l.dispersion.value=s.dispersion),s.iridescence>0&&(l.iridescence.value=s.iridescence,l.iridescenceIOR.value=s.iridescenceIOR,l.iridescenceThicknessMinimum.value=s.iridescenceThicknessRange[0],l.iridescenceThicknessMaximum.value=s.iridescenceThicknessRange[1],s.iridescenceMap&&(l.iridescenceMap.value=s.iridescenceMap,t(s.iridescenceMap,l.iridescenceMapTransform)),s.iridescenceThicknessMap&&(l.iridescenceThicknessMap.value=s.iridescenceThicknessMap,t(s.iridescenceThicknessMap,l.iridescenceThicknessMapTransform))),s.transmission>0&&(l.transmission.value=s.transmission,l.transmissionSamplerMap.value=g.texture,l.transmissionSamplerSize.value.set(g.width,g.height),s.transmissionMap&&(l.transmissionMap.value=s.transmissionMap,t(s.transmissionMap,l.transmissionMapTransform)),l.thickness.value=s.thickness,s.thicknessMap&&(l.thicknessMap.value=s.thicknessMap,t(s.thicknessMap,l.thicknessMapTransform)),l.attenuationDistance.value=s.attenuationDistance,l.attenuationColor.value.copy(s.attenuationColor)),s.anisotropy>0&&(l.anisotropyVector.value.set(s.anisotropy*Math.cos(s.anisotropyRotation),s.anisotropy*Math.sin(s.anisotropyRotation)),s.anisotropyMap&&(l.anisotropyMap.value=s.anisotropyMap,t(s.anisotropyMap,l.anisotropyMapTransform))),l.specularIntensity.value=s.specularIntensity,l.specularColor.value.copy(s.specularColor),s.specularColorMap&&(l.specularColorMap.value=s.specularColorMap,t(s.specularColorMap,l.specularColorMapTransform)),s.specularIntensityMap&&(l.specularIntensityMap.value=s.specularIntensityMap,t(s.specularIntensityMap,l.specularIntensityMapTransform))}function M(l,s){s.matcap&&(l.matcap.value=s.matcap)}function y(l,s){let g=n.get(s).light;l.referencePosition.value.setFromMatrixPosition(g.matrixWorld),l.nearDistance.value=g.shadow.camera.near,l.farDistance.value=g.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:c}}function cd(e,n,t,i){let c={},a={},d=[],_=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function L(g,T){let E=T.program;i.uniformBlockBinding(g,E)}function C(g,T){let E=c[g.id];E===void 0&&(M(g),E=B(g),c[g.id]=E,g.addEventListener("dispose",l));let N=T.program;i.updateUBOMapping(g,N);let b=n.render.frame;a[g.id]!==b&&(p(g),a[g.id]=b)}function B(g){let T=D();g.__bindingPointIndex=T;let E=e.createBuffer(),N=g.__size,b=g.usage;return e.bindBuffer(e.UNIFORM_BUFFER,E),e.bufferData(e.UNIFORM_BUFFER,N,b),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,T,E),E}function D(){for(let g=0;g<_;g++)if(d.indexOf(g)===-1)return d.push(g),g;return Ze("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(g){let T=c[g.id],E=g.uniforms,N=g.__cache;e.bindBuffer(e.UNIFORM_BUFFER,T);for(let b=0,w=E.length;b<w;b++){let f=Array.isArray(E[b])?E[b]:[E[b]];for(let h=0,$=f.length;h<$;h++){let R=f[h];if(S(R,b,h,N)===!0){let V=R.__offset,z=Array.isArray(R.value)?R.value:[R.value],W=0;for(let Y=0;Y<z.length;Y++){let O=z[Y],F=y(O);typeof O=="number"||typeof O=="boolean"?(R.__data[0]=O,e.bufferSubData(e.UNIFORM_BUFFER,V+W,R.__data)):O.isMatrix3?(R.__data[0]=O.elements[0],R.__data[1]=O.elements[1],R.__data[2]=O.elements[2],R.__data[3]=0,R.__data[4]=O.elements[3],R.__data[5]=O.elements[4],R.__data[6]=O.elements[5],R.__data[7]=0,R.__data[8]=O.elements[6],R.__data[9]=O.elements[7],R.__data[10]=O.elements[8],R.__data[11]=0):(O.toArray(R.__data,W),W+=F.storage/Float32Array.BYTES_PER_ELEMENT)}e.bufferSubData(e.UNIFORM_BUFFER,V,R.__data)}}}e.bindBuffer(e.UNIFORM_BUFFER,null)}function S(g,T,E,N){let b=g.value,w=T+"_"+E;if(N[w]===void 0)return typeof b=="number"||typeof b=="boolean"?N[w]=b:N[w]=b.clone(),!0;{let f=N[w];if(typeof b=="number"||typeof b=="boolean"){if(f!==b)return N[w]=b,!0}else if(f.equals(b)===!1)return f.copy(b),!0}return!1}function M(g){let T=g.uniforms,E=0,N=16;for(let w=0,f=T.length;w<f;w++){let h=Array.isArray(T[w])?T[w]:[T[w]];for(let $=0,R=h.length;$<R;$++){let V=h[$],z=Array.isArray(V.value)?V.value:[V.value];for(let W=0,Y=z.length;W<Y;W++){let O=z[W],F=y(O),ie=E%N,re=ie%F.boundary,Me=ie+re;E+=re,Me!==0&&N-Me<F.storage&&(E+=N-Me),V.__data=new Float32Array(F.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=E,E+=F.storage}}}let b=E%N;return b>0&&(E+=N-b),g.__size=E,g.__cache={},this}function y(g){let T={boundary:0,storage:0};return typeof g=="number"||typeof g=="boolean"?(T.boundary=4,T.storage=4):g.isVector2?(T.boundary=8,T.storage=8):g.isVector3||g.isColor?(T.boundary=16,T.storage=12):g.isVector4?(T.boundary=16,T.storage=16):g.isMatrix3?(T.boundary=48,T.storage=48):g.isMatrix4?(T.boundary=64,T.storage=64):g.isTexture?ze("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ze("WebGLRenderer: Unsupported uniform value type.",g),T}function l(g){let T=g.target;T.removeEventListener("dispose",l);let E=d.indexOf(T.__bindingPointIndex);d.splice(E,1),e.deleteBuffer(c[T.id]),delete c[T.id],delete a[T.id]}function s(){for(let g in c)e.deleteBuffer(c[g]);d=[],c={},a={}}return{bind:L,update:C,dispose:s}}var fd=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),bt=null;function dd(){return bt===null&&(bt=new ya(fd,16,16,nn,wt),bt.name="DFG_LUT",bt.minFilter=mt,bt.magFilter=mt,bt.wrapS=An,bt.wrapT=An,bt.generateMipmaps=!1,bt.needsUpdate=!0),bt}var po=class{constructor(n={}){let{canvas:t=Aa(),context:i=null,depth:c=!0,stencil:a=!1,alpha:d=!1,antialias:_=!1,premultipliedAlpha:L=!0,preserveDrawingBuffer:C=!1,powerPreference:B="default",failIfMajorPerformanceCaveat:D=!1,reversedDepthBuffer:p=!1,outputBufferType:S=St}=n;this.isWebGLRenderer=!0;let M;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");M=i.getContextAttributes().alpha}else M=d;let y=S,l=new Set([oi,ai,ri]),s=new Set([St,Ft,dn,tn,ni,ii]),g=new Uint32Array(4),T=new Int32Array(4),E=null,N=null,b=[],w=[],f=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=vt,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let h=this,$=!1;this._outputColorSpace=_a;let R=0,V=0,z=null,W=-1,Y=null,O=new ut,F=new ut,ie=null,re=new Qe(0),Me=0,Ae=t.width,he=t.height,Ne=1,Je=null,je=null,X=new ut(0,0,Ae,he),j=new ut(0,0,Ae,he),ne=!1,Le=new qi,Te=!1,Ce=!1,st=new Xt,ye=new Be,He=new ut,Xe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ue=!1;function nt(){return z===null?Ne:1}let m=i;function rt(o,A){return t.getContext(o,A)}try{let o={alpha:!0,depth:c,stencil:a,antialias:_,premultipliedAlpha:L,preserveDrawingBuffer:C,powerPreference:B,failIfMajorPerformanceCaveat:D};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"183"}`),t.addEventListener("webglcontextlost",pe,!1),t.addEventListener("webglcontextrestored",be,!1),t.addEventListener("webglcontextcreationerror",$e,!1),m===null){let A="webgl2";if(m=rt(A,o),m===null)throw rt(A)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(o){throw Ze("WebGLRenderer: "+o.message),o}let Ge,Ke,ge,u,r,x,k,q,H,de,ee,xe,Re,K,Q,ue,me,le,we,v,te,J,fe;function Z(){Ge=new vc(m),Ge.init(),te=new rd(m,Ge),Ke=new fc(m,Ge,n,te),ge=new nd(m,Ge),Ke.reversedDepthBuffer&&p&&ge.buffers.depth.setReversed(!0),u=new xc(m),r=new kf,x=new id(m,Ge,ge,r,Ke,te,u),k=new gc(h),q=new Co(m),J=new lc(m,q),H=new Sc(m,q,u,J),de=new Tc(m,H,q,J,u),le=new Mc(m,Ke,x),Q=new dc(r),ee=new Vf(h,k,Ge,Ke,J,Q),xe=new ld(h,r),Re=new zf,K=new Zf(Ge),me=new sc(h,k,ge,de,M,L),ue=new td(h,de,Ke),fe=new cd(m,u,Ke,ge),we=new cc(m,Ge,u),v=new Ec(m,Ge,u),u.programs=ee.programs,h.capabilities=Ke,h.extensions=Ge,h.properties=r,h.renderLists=Re,h.shadowMap=ue,h.state=ge,h.info=u}Z(),y!==St&&(f=new Rc(y,t.width,t.height,c,a));let G=new hr(h,m);this.xr=G,this.getContext=function(){return m},this.getContextAttributes=function(){return m.getContextAttributes()},this.forceContextLoss=function(){let o=Ge.get("WEBGL_lose_context");o&&o.loseContext()},this.forceContextRestore=function(){let o=Ge.get("WEBGL_lose_context");o&&o.restoreContext()},this.getPixelRatio=function(){return Ne},this.setPixelRatio=function(o){o!==void 0&&(Ne=o,this.setSize(Ae,he,!1))},this.getSize=function(o){return o.set(Ae,he)},this.setSize=function(o,A,I=!0){if(G.isPresenting){ze("WebGLRenderer: Can't change size while VR device is presenting.");return}Ae=o,he=A,t.width=Math.floor(o*Ne),t.height=Math.floor(A*Ne),I===!0&&(t.style.width=o+"px",t.style.height=A+"px"),f!==null&&f.setSize(t.width,t.height),this.setViewport(0,0,o,A)},this.getDrawingBufferSize=function(o){return o.set(Ae*Ne,he*Ne).floor()},this.setDrawingBufferSize=function(o,A,I){Ae=o,he=A,Ne=I,t.width=Math.floor(o*I),t.height=Math.floor(A*I),this.setViewport(0,0,o,A)},this.setEffects=function(o){if(y===St){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(o){for(let A=0;A<o.length;A++)if(o[A].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}f.setEffects(o||[])},this.getCurrentViewport=function(o){return o.copy(O)},this.getViewport=function(o){return o.copy(X)},this.setViewport=function(o,A,I,U){o.isVector4?X.set(o.x,o.y,o.z,o.w):X.set(o,A,I,U),ge.viewport(O.copy(X).multiplyScalar(Ne).round())},this.getScissor=function(o){return o.copy(j)},this.setScissor=function(o,A,I,U){o.isVector4?j.set(o.x,o.y,o.z,o.w):j.set(o,A,I,U),ge.scissor(F.copy(j).multiplyScalar(Ne).round())},this.getScissorTest=function(){return ne},this.setScissorTest=function(o){ge.setScissorTest(ne=o)},this.setOpaqueSort=function(o){Je=o},this.setTransparentSort=function(o){je=o},this.getClearColor=function(o){return o.copy(me.getClearColor())},this.setClearColor=function(){me.setClearColor(...arguments)},this.getClearAlpha=function(){return me.getClearAlpha()},this.setClearAlpha=function(){me.setClearAlpha(...arguments)},this.clear=function(o=!0,A=!0,I=!0){let U=0;if(o){let P=!1;if(z!==null){let oe=z.texture.format;P=l.has(oe)}if(P){let oe=z.texture.type,ce=s.has(oe),se=me.getClearColor(),_e=me.getClearAlpha(),Se=se.r,Pe=se.g,Ie=se.b;ce?(g[0]=Se,g[1]=Pe,g[2]=Ie,g[3]=_e,m.clearBufferuiv(m.COLOR,0,g)):(T[0]=Se,T[1]=Pe,T[2]=Ie,T[3]=_e,m.clearBufferiv(m.COLOR,0,T))}else U|=m.COLOR_BUFFER_BIT}A&&(U|=m.DEPTH_BUFFER_BIT),I&&(U|=m.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U!==0&&m.clear(U)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",pe,!1),t.removeEventListener("webglcontextrestored",be,!1),t.removeEventListener("webglcontextcreationerror",$e,!1),me.dispose(),Re.dispose(),K.dispose(),r.dispose(),k.dispose(),de.dispose(),J.dispose(),fe.dispose(),ee.dispose(),G.dispose(),G.removeEventListener("sessionstart",_r),G.removeEventListener("sessionend",gr),Bt.stop()};function pe(o){o.preventDefault(),ki("WebGLRenderer: Context Lost."),$=!0}function be(){ki("WebGLRenderer: Context Restored."),$=!1;let o=u.autoReset,A=ue.enabled,I=ue.autoUpdate,U=ue.needsUpdate,P=ue.type;Z(),u.autoReset=o,ue.enabled=A,ue.autoUpdate=I,ue.needsUpdate=U,ue.type=P}function $e(o){Ze("WebGLRenderer: A WebGL context could not be created. Reason: ",o.statusMessage)}function Ve(o){let A=o.target;A.removeEventListener("dispose",Ve),Lt(A)}function Lt(o){Dt(o),r.remove(o)}function Dt(o){let A=r.get(o).programs;A!==void 0&&(A.forEach(function(I){ee.releaseProgram(I)}),o.isShaderMaterial&&ee.releaseShaderCache(o))}this.renderBufferDirect=function(o,A,I,U,P,oe){A===null&&(A=Xe);let ce=P.isMesh&&P.matrixWorld.determinant()<0,se=Eo(o,A,I,U,P);ge.setMaterial(U,ce);let _e=I.index,Se=1;if(U.wireframe===!0){if(_e=H.getWireframeAttribute(I),_e===void 0)return;Se=2}let Pe=I.drawRange,Ie=I.attributes.position,Ee=Pe.start*Se,ke=(Pe.start+Pe.count)*Se;oe!==null&&(Ee=Math.max(Ee,oe.start*Se),ke=Math.min(ke,(oe.start+oe.count)*Se)),_e!==null?(Ee=Math.max(Ee,0),ke=Math.min(ke,_e.count)):Ie!=null&&(Ee=Math.max(Ee,0),ke=Math.min(ke,Ie.count));let it=ke-Ee;if(it<0||it===1/0)return;J.setup(P,U,se,I,_e);let et,We=we;if(_e!==null&&(et=q.get(_e),We=v,We.setIndex(et)),P.isMesh)U.wireframe===!0?(ge.setLineWidth(U.wireframeLinewidth*nt()),We.setMode(m.LINES)):We.setMode(m.TRIANGLES);else if(P.isLine){let ft=U.linewidth;ft===void 0&&(ft=1),ge.setLineWidth(ft*nt()),P.isLineSegments?We.setMode(m.LINES):P.isLineLoop?We.setMode(m.LINE_LOOP):We.setMode(m.LINE_STRIP)}else P.isPoints?We.setMode(m.POINTS):P.isSprite&&We.setMode(m.TRIANGLES);if(P.isBatchedMesh)if(P._multiDrawInstances!==null)Wi("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),We.renderMultiDrawInstances(P._multiDrawStarts,P._multiDrawCounts,P._multiDrawCount,P._multiDrawInstances);else if(Ge.get("WEBGL_multi_draw"))We.renderMultiDraw(P._multiDrawStarts,P._multiDrawCounts,P._multiDrawCount);else{let ft=P._multiDrawStarts,ve=P._multiDrawCounts,_t=P._multiDrawCount,Oe=_e?q.get(_e).bytesPerElement:1,gt=r.get(U).currentProgram.getUniforms();for(let xt=0;xt<_t;xt++)gt.setValue(m,"_gl_DrawID",xt),We.render(ft[xt]/Oe,ve[xt])}else if(P.isInstancedMesh)We.renderInstances(Ee,it,P.count);else if(I.isInstancedBufferGeometry){let ft=I._maxInstanceCount!==void 0?I._maxInstanceCount:1/0,ve=Math.min(I.instanceCount,ft);We.renderInstances(Ee,it,ve)}else We.render(Ee,it)};function mr(o,A,I){o.transparent===!0&&o.side===Mt&&o.forceSinglePass===!1?(o.side=ht,o.needsUpdate=!0,xn(o,A,I),o.side=Jt,o.needsUpdate=!0,xn(o,A,I),o.side=Mt):xn(o,A,I)}this.compile=function(o,A,I=null){I===null&&(I=o),N=K.get(I),N.init(A),w.push(N),I.traverseVisible(function(P){P.isLight&&P.layers.test(A.layers)&&(N.pushLight(P),P.castShadow&&N.pushShadow(P))}),o!==I&&o.traverseVisible(function(P){P.isLight&&P.layers.test(A.layers)&&(N.pushLight(P),P.castShadow&&N.pushShadow(P))}),N.setupLights();let U=new Set;return o.traverse(function(P){if(!(P.isMesh||P.isPoints||P.isLine||P.isSprite))return;let oe=P.material;if(oe)if(Array.isArray(oe))for(let ce=0;ce<oe.length;ce++){let se=oe[ce];mr(se,I,P),U.add(se)}else mr(oe,I,P),U.add(oe)}),N=w.pop(),U},this.compileAsync=function(o,A,I=null){let U=this.compile(o,A,I);return new Promise(P=>{function oe(){if(U.forEach(function(ce){r.get(ce).currentProgram.isReady()&&U.delete(ce)}),U.size===0){P(o);return}setTimeout(oe,10)}Ge.get("KHR_parallel_shader_compile")!==null?oe():setTimeout(oe,10)})};let Vn=null;function So(o){Vn&&Vn(o)}function _r(){Bt.stop()}function gr(){Bt.start()}let Bt=new ho;Bt.setAnimationLoop(So),typeof self<"u"&&Bt.setContext(self),this.setAnimationLoop=function(o){Vn=o,G.setAnimationLoop(o),o===null?Bt.stop():Bt.start()},G.addEventListener("sessionstart",_r),G.addEventListener("sessionend",gr),this.render=function(o,A){if(A!==void 0&&A.isCamera!==!0){Ze("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if($===!0)return;let I=G.enabled===!0&&G.isPresenting===!0,U=f!==null&&(z===null||I)&&f.begin(h,z);if(o.matrixWorldAutoUpdate===!0&&o.updateMatrixWorld(),A.parent===null&&A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),G.enabled===!0&&G.isPresenting===!0&&(f===null||f.isCompositing()===!1)&&(G.cameraAutoUpdate===!0&&G.updateCamera(A),A=G.getCamera()),o.isScene===!0&&o.onBeforeRender(h,o,A,z),N=K.get(o,w.length),N.init(A),w.push(N),st.multiplyMatrices(A.projectionMatrix,A.matrixWorldInverse),Le.setFromProjectionMatrix(st,Vi,A.reversedDepth),Ce=this.localClippingEnabled,Te=Q.init(this.clippingPlanes,Ce),E=Re.get(o,b.length),E.init(),b.push(E),G.enabled===!0&&G.isPresenting===!0){let ce=h.xr.getDepthSensingMesh();ce!==null&&kn(ce,A,-1/0,h.sortObjects)}kn(o,A,0,h.sortObjects),E.finish(),h.sortObjects===!0&&E.sort(Je,je),Ue=G.enabled===!1||G.isPresenting===!1||G.hasDepthSensing()===!1,Ue&&me.addToRenderList(E,o),this.info.render.frame++,Te===!0&&Q.beginShadows();let P=N.state.shadowsArray;if(ue.render(P,o,A),Te===!0&&Q.endShadows(),this.info.autoReset===!0&&this.info.reset(),(U&&f.hasRenderPass())===!1){let ce=E.opaque,se=E.transmissive;if(N.setupLights(),A.isArrayCamera){let _e=A.cameras;if(se.length>0)for(let Se=0,Pe=_e.length;Se<Pe;Se++){let Ie=_e[Se];Sr(ce,se,o,Ie)}Ue&&me.render(o);for(let Se=0,Pe=_e.length;Se<Pe;Se++){let Ie=_e[Se];vr(E,o,Ie,Ie.viewport)}}else se.length>0&&Sr(ce,se,o,A),Ue&&me.render(o),vr(E,o,A)}z!==null&&V===0&&(x.updateMultisampleRenderTarget(z),x.updateRenderTargetMipmap(z)),U&&f.end(h),o.isScene===!0&&o.onAfterRender(h,o,A),J.resetDefaultState(),W=-1,Y=null,w.pop(),w.length>0?(N=w[w.length-1],Te===!0&&Q.setGlobalState(h.clippingPlanes,N.state.camera)):N=null,b.pop(),b.length>0?E=b[b.length-1]:E=null};function kn(o,A,I,U){if(o.visible===!1)return;if(o.layers.test(A.layers)){if(o.isGroup)I=o.renderOrder;else if(o.isLOD)o.autoUpdate===!0&&o.update(A);else if(o.isLight)N.pushLight(o),o.castShadow&&N.pushShadow(o);else if(o.isSprite){if(!o.frustumCulled||Le.intersectsSprite(o)){U&&He.setFromMatrixPosition(o.matrixWorld).applyMatrix4(st);let ce=de.update(o),se=o.material;se.visible&&E.push(o,ce,se,I,He.z,null)}}else if((o.isMesh||o.isLine||o.isPoints)&&(!o.frustumCulled||Le.intersectsObject(o))){let ce=de.update(o),se=o.material;if(U&&(o.boundingSphere!==void 0?(o.boundingSphere===null&&o.computeBoundingSphere(),He.copy(o.boundingSphere.center)):(ce.boundingSphere===null&&ce.computeBoundingSphere(),He.copy(ce.boundingSphere.center)),He.applyMatrix4(o.matrixWorld).applyMatrix4(st)),Array.isArray(se)){let _e=ce.groups;for(let Se=0,Pe=_e.length;Se<Pe;Se++){let Ie=_e[Se],Ee=se[Ie.materialIndex];Ee&&Ee.visible&&E.push(o,ce,Ee,I,He.z,Ie)}}else se.visible&&E.push(o,ce,se,I,He.z,null)}}let oe=o.children;for(let ce=0,se=oe.length;ce<se;ce++)kn(oe[ce],A,I,U)}function vr(o,A,I,U){let{opaque:P,transmissive:oe,transparent:ce}=o;N.setupLightsView(I),Te===!0&&Q.setGlobalState(h.clippingPlanes,I),U&&ge.viewport(O.copy(U)),P.length>0&&En(P,A,I),oe.length>0&&En(oe,A,I),ce.length>0&&En(ce,A,I),ge.buffers.depth.setTest(!0),ge.buffers.depth.setMask(!0),ge.buffers.color.setMask(!0),ge.setPolygonOffset(!1)}function Sr(o,A,I,U){if((I.isScene===!0?I.overrideMaterial:null)!==null)return;if(N.state.transmissionRenderTarget[U.id]===void 0){let Ee=Ge.has("EXT_color_buffer_half_float")||Ge.has("EXT_color_buffer_float");N.state.transmissionRenderTarget[U.id]=new Et(1,1,{generateMipmaps:!0,type:Ee?wt:St,minFilter:Vt,samples:Math.max(4,Ke.samples),stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:tt.workingColorSpace})}let oe=N.state.transmissionRenderTarget[U.id],ce=U.viewport||O;oe.setSize(ce.z*h.transmissionResolutionScale,ce.w*h.transmissionResolutionScale);let se=h.getRenderTarget(),_e=h.getActiveCubeFace(),Se=h.getActiveMipmapLevel();h.setRenderTarget(oe),h.getClearColor(re),Me=h.getClearAlpha(),Me<1&&h.setClearColor(16777215,.5),h.clear(),Ue&&me.render(I);let Pe=h.toneMapping;h.toneMapping=vt;let Ie=U.viewport;if(U.viewport!==void 0&&(U.viewport=void 0),N.setupLightsView(U),Te===!0&&Q.setGlobalState(h.clippingPlanes,U),En(o,I,U),x.updateMultisampleRenderTarget(oe),x.updateRenderTargetMipmap(oe),Ge.has("WEBGL_multisampled_render_to_texture")===!1){let Ee=!1;for(let ke=0,it=A.length;ke<it;ke++){let et=A[ke],{object:We,geometry:ft,material:ve,group:_t}=et;if(ve.side===Mt&&We.layers.test(U.layers)){let Oe=ve.side;ve.side=ht,ve.needsUpdate=!0,Er(We,I,U,ft,ve,_t),ve.side=Oe,ve.needsUpdate=!0,Ee=!0}}Ee===!0&&(x.updateMultisampleRenderTarget(oe),x.updateRenderTargetMipmap(oe))}h.setRenderTarget(se,_e,Se),h.setClearColor(re,Me),Ie!==void 0&&(U.viewport=Ie),h.toneMapping=Pe}function En(o,A,I){let U=A.isScene===!0?A.overrideMaterial:null;for(let P=0,oe=o.length;P<oe;P++){let ce=o[P],{object:se,geometry:_e,group:Se}=ce,Pe=ce.material;Pe.allowOverride===!0&&U!==null&&(Pe=U),se.layers.test(I.layers)&&Er(se,A,I,_e,Pe,Se)}}function Er(o,A,I,U,P,oe){o.onBeforeRender(h,A,I,U,P,oe),o.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,o.matrixWorld),o.normalMatrix.getNormalMatrix(o.modelViewMatrix),P.onBeforeRender(h,A,I,U,o,oe),P.transparent===!0&&P.side===Mt&&P.forceSinglePass===!1?(P.side=ht,P.needsUpdate=!0,h.renderBufferDirect(I,A,U,P,o,oe),P.side=Jt,P.needsUpdate=!0,h.renderBufferDirect(I,A,U,P,o,oe),P.side=Mt):h.renderBufferDirect(I,A,U,P,o,oe),o.onAfterRender(h,A,I,U,P,oe)}function xn(o,A,I){A.isScene!==!0&&(A=Xe);let U=r.get(o),P=N.state.lights,oe=N.state.shadowsArray,ce=P.state.version,se=ee.getParameters(o,P.state,oe,A,I),_e=ee.getProgramCacheKey(se),Se=U.programs;U.environment=o.isMeshStandardMaterial||o.isMeshLambertMaterial||o.isMeshPhongMaterial?A.environment:null,U.fog=A.fog;let Pe=o.isMeshStandardMaterial||o.isMeshLambertMaterial&&!o.envMap||o.isMeshPhongMaterial&&!o.envMap;U.envMap=k.get(o.envMap||U.environment,Pe),U.envMapRotation=U.environment!==null&&o.envMap===null?A.environmentRotation:o.envMapRotation,Se===void 0&&(o.addEventListener("dispose",Ve),Se=new Map,U.programs=Se);let Ie=Se.get(_e);if(Ie!==void 0){if(U.currentProgram===Ie&&U.lightsStateVersion===ce)return Mr(o,se),Ie}else se.uniforms=ee.getUniforms(o),o.onBeforeCompile(se,h),Ie=ee.acquireProgram(se,_e),Se.set(_e,Ie),U.uniforms=se.uniforms;let Ee=U.uniforms;return(!o.isShaderMaterial&&!o.isRawShaderMaterial||o.clipping===!0)&&(Ee.clippingPlanes=Q.uniform),Mr(o,se),U.needsLights=Mo(o),U.lightsStateVersion=ce,U.needsLights&&(Ee.ambientLightColor.value=P.state.ambient,Ee.lightProbe.value=P.state.probe,Ee.directionalLights.value=P.state.directional,Ee.directionalLightShadows.value=P.state.directionalShadow,Ee.spotLights.value=P.state.spot,Ee.spotLightShadows.value=P.state.spotShadow,Ee.rectAreaLights.value=P.state.rectArea,Ee.ltc_1.value=P.state.rectAreaLTC1,Ee.ltc_2.value=P.state.rectAreaLTC2,Ee.pointLights.value=P.state.point,Ee.pointLightShadows.value=P.state.pointShadow,Ee.hemisphereLights.value=P.state.hemi,Ee.directionalShadowMatrix.value=P.state.directionalShadowMatrix,Ee.spotLightMatrix.value=P.state.spotLightMatrix,Ee.spotLightMap.value=P.state.spotLightMap,Ee.pointShadowMatrix.value=P.state.pointShadowMatrix),U.currentProgram=Ie,U.uniformsList=null,Ie}function xr(o){if(o.uniformsList===null){let A=o.currentProgram.getUniforms();o.uniformsList=an.seqWithValue(A.seq,o.uniforms)}return o.uniformsList}function Mr(o,A){let I=r.get(o);I.outputColorSpace=A.outputColorSpace,I.batching=A.batching,I.batchingColor=A.batchingColor,I.instancing=A.instancing,I.instancingColor=A.instancingColor,I.instancingMorph=A.instancingMorph,I.skinning=A.skinning,I.morphTargets=A.morphTargets,I.morphNormals=A.morphNormals,I.morphColors=A.morphColors,I.morphTargetsCount=A.morphTargetsCount,I.numClippingPlanes=A.numClippingPlanes,I.numIntersection=A.numClipIntersection,I.vertexAlphas=A.vertexAlphas,I.vertexTangents=A.vertexTangents,I.toneMapping=A.toneMapping}function Eo(o,A,I,U,P){A.isScene!==!0&&(A=Xe),x.resetTextureUnits();let oe=A.fog,ce=U.isMeshStandardMaterial||U.isMeshLambertMaterial||U.isMeshPhongMaterial?A.environment:null,se=z===null?h.outputColorSpace:z.isXRRenderTarget===!0?z.texture.colorSpace:un,_e=U.isMeshStandardMaterial||U.isMeshLambertMaterial&&!U.envMap||U.isMeshPhongMaterial&&!U.envMap,Se=k.get(U.envMap||ce,_e),Pe=U.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,Ie=!!I.attributes.tangent&&(!!U.normalMap||U.anisotropy>0),Ee=!!I.morphAttributes.position,ke=!!I.morphAttributes.normal,it=!!I.morphAttributes.color,et=vt;U.toneMapped&&(z===null||z.isXRRenderTarget===!0)&&(et=h.toneMapping);let We=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,ft=We!==void 0?We.length:0,ve=r.get(U),_t=N.state.lights;if(Te===!0&&(Ce===!0||o!==Y)){let lt=o===Y&&U.id===W;Q.setState(U,o,lt)}let Oe=!1;U.version===ve.__version?(ve.needsLights&&ve.lightsStateVersion!==_t.state.version||ve.outputColorSpace!==se||P.isBatchedMesh&&ve.batching===!1||!P.isBatchedMesh&&ve.batching===!0||P.isBatchedMesh&&ve.batchingColor===!0&&P.colorTexture===null||P.isBatchedMesh&&ve.batchingColor===!1&&P.colorTexture!==null||P.isInstancedMesh&&ve.instancing===!1||!P.isInstancedMesh&&ve.instancing===!0||P.isSkinnedMesh&&ve.skinning===!1||!P.isSkinnedMesh&&ve.skinning===!0||P.isInstancedMesh&&ve.instancingColor===!0&&P.instanceColor===null||P.isInstancedMesh&&ve.instancingColor===!1&&P.instanceColor!==null||P.isInstancedMesh&&ve.instancingMorph===!0&&P.morphTexture===null||P.isInstancedMesh&&ve.instancingMorph===!1&&P.morphTexture!==null||ve.envMap!==Se||U.fog===!0&&ve.fog!==oe||ve.numClippingPlanes!==void 0&&(ve.numClippingPlanes!==Q.numPlanes||ve.numIntersection!==Q.numIntersection)||ve.vertexAlphas!==Pe||ve.vertexTangents!==Ie||ve.morphTargets!==Ee||ve.morphNormals!==ke||ve.morphColors!==it||ve.toneMapping!==et||ve.morphTargetsCount!==ft)&&(Oe=!0):(Oe=!0,ve.__version=U.version);let gt=ve.currentProgram;Oe===!0&&(gt=xn(U,A,P));let xt=!1,Gt=!1,$t=!1,Ye=gt.getUniforms(),ct=ve.uniforms;if(ge.useProgram(gt.program)&&(xt=!0,Gt=!0,$t=!0),U.id!==W&&(W=U.id,Gt=!0),xt||Y!==o){ge.buffers.depth.getReversed()&&o.reversedDepth!==!0&&(o._reversedDepth=!0,o.updateProjectionMatrix()),Ye.setValue(m,"projectionMatrix",o.projectionMatrix),Ye.setValue(m,"viewMatrix",o.matrixWorldInverse);let Nt=Ye.map.cameraPosition;Nt!==void 0&&Nt.setValue(m,ye.setFromMatrixPosition(o.matrixWorld)),Ke.logarithmicDepthBuffer&&Ye.setValue(m,"logDepthBufFC",2/(Math.log(o.far+1)/Math.LN2)),(U.isMeshPhongMaterial||U.isMeshToonMaterial||U.isMeshLambertMaterial||U.isMeshBasicMaterial||U.isMeshStandardMaterial||U.isShaderMaterial)&&Ye.setValue(m,"isOrthographic",o.isOrthographicCamera===!0),Y!==o&&(Y=o,Gt=!0,$t=!0)}if(ve.needsLights&&(_t.state.directionalShadowMap.length>0&&Ye.setValue(m,"directionalShadowMap",_t.state.directionalShadowMap,x),_t.state.spotShadowMap.length>0&&Ye.setValue(m,"spotShadowMap",_t.state.spotShadowMap,x),_t.state.pointShadowMap.length>0&&Ye.setValue(m,"pointShadowMap",_t.state.pointShadowMap,x)),P.isSkinnedMesh){Ye.setOptional(m,P,"bindMatrix"),Ye.setOptional(m,P,"bindMatrixInverse");let lt=P.skeleton;lt&&(lt.boneTexture===null&&lt.computeBoneTexture(),Ye.setValue(m,"boneTexture",lt.boneTexture,x))}P.isBatchedMesh&&(Ye.setOptional(m,P,"batchingTexture"),Ye.setValue(m,"batchingTexture",P._matricesTexture,x),Ye.setOptional(m,P,"batchingIdTexture"),Ye.setValue(m,"batchingIdTexture",P._indirectTexture,x),Ye.setOptional(m,P,"batchingColorTexture"),P._colorsTexture!==null&&Ye.setValue(m,"batchingColorTexture",P._colorsTexture,x));let It=I.morphAttributes;if((It.position!==void 0||It.normal!==void 0||It.color!==void 0)&&le.update(P,I,gt),(Gt||ve.receiveShadow!==P.receiveShadow)&&(ve.receiveShadow=P.receiveShadow,Ye.setValue(m,"receiveShadow",P.receiveShadow)),(U.isMeshStandardMaterial||U.isMeshLambertMaterial||U.isMeshPhongMaterial)&&U.envMap===null&&A.environment!==null&&(ct.envMapIntensity.value=A.environmentIntensity),ct.dfgLUT!==void 0&&(ct.dfgLUT.value=dd()),Gt&&(Ye.setValue(m,"toneMappingExposure",h.toneMappingExposure),ve.needsLights&&xo(ct,$t),oe&&U.fog===!0&&xe.refreshFogUniforms(ct,oe),xe.refreshMaterialUniforms(ct,U,Ne,he,N.state.transmissionRenderTarget[o.id]),an.upload(m,xr(ve),ct,x)),U.isShaderMaterial&&U.uniformsNeedUpdate===!0&&(an.upload(m,xr(ve),ct,x),U.uniformsNeedUpdate=!1),U.isSpriteMaterial&&Ye.setValue(m,"center",P.center),Ye.setValue(m,"modelViewMatrix",P.modelViewMatrix),Ye.setValue(m,"normalMatrix",P.normalMatrix),Ye.setValue(m,"modelMatrix",P.matrixWorld),U.isShaderMaterial||U.isRawShaderMaterial){let lt=U.uniformsGroups;for(let Nt=0,Zt=lt.length;Nt<Zt;Nt++){let Tr=lt[Nt];fe.update(Tr,gt),fe.bind(Tr,gt)}}return gt}function xo(o,A){o.ambientLightColor.needsUpdate=A,o.lightProbe.needsUpdate=A,o.directionalLights.needsUpdate=A,o.directionalLightShadows.needsUpdate=A,o.pointLights.needsUpdate=A,o.pointLightShadows.needsUpdate=A,o.spotLights.needsUpdate=A,o.spotLightShadows.needsUpdate=A,o.rectAreaLights.needsUpdate=A,o.hemisphereLights.needsUpdate=A}function Mo(o){return o.isMeshLambertMaterial||o.isMeshToonMaterial||o.isMeshPhongMaterial||o.isMeshStandardMaterial||o.isShadowMaterial||o.isShaderMaterial&&o.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return V},this.getRenderTarget=function(){return z},this.setRenderTargetTextures=function(o,A,I){let U=r.get(o);U.__autoAllocateDepthBuffer=o.resolveDepthBuffer===!1,U.__autoAllocateDepthBuffer===!1&&(U.__useRenderToTexture=!1),r.get(o.texture).__webglTexture=A,r.get(o.depthTexture).__webglTexture=U.__autoAllocateDepthBuffer?void 0:I,U.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(o,A){let I=r.get(o);I.__webglFramebuffer=A,I.__useDefaultFramebuffer=A===void 0};let To=m.createFramebuffer();this.setRenderTarget=function(o,A=0,I=0){z=o,R=A,V=I;let U=null,P=!1,oe=!1;if(o){let se=r.get(o);if(se.__useDefaultFramebuffer!==void 0){ge.bindFramebuffer(m.FRAMEBUFFER,se.__webglFramebuffer),O.copy(o.viewport),F.copy(o.scissor),ie=o.scissorTest,ge.viewport(O),ge.scissor(F),ge.setScissorTest(ie),W=-1;return}else if(se.__webglFramebuffer===void 0)x.setupRenderTarget(o);else if(se.__hasExternalTextures)x.rebindTextures(o,r.get(o.texture).__webglTexture,r.get(o.depthTexture).__webglTexture);else if(o.depthBuffer){let Pe=o.depthTexture;if(se.__boundDepthTexture!==Pe){if(Pe!==null&&r.has(Pe)&&(o.width!==Pe.image.width||o.height!==Pe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");x.setupDepthRenderbuffer(o)}}let _e=o.texture;(_e.isData3DTexture||_e.isDataArrayTexture||_e.isCompressedArrayTexture)&&(oe=!0);let Se=r.get(o).__webglFramebuffer;o.isWebGLCubeRenderTarget?(Array.isArray(Se[A])?U=Se[A][I]:U=Se[A],P=!0):o.samples>0&&x.useMultisampledRTT(o)===!1?U=r.get(o).__webglMultisampledFramebuffer:Array.isArray(Se)?U=Se[I]:U=Se,O.copy(o.viewport),F.copy(o.scissor),ie=o.scissorTest}else O.copy(X).multiplyScalar(Ne).floor(),F.copy(j).multiplyScalar(Ne).floor(),ie=ne;if(I!==0&&(U=To),ge.bindFramebuffer(m.FRAMEBUFFER,U)&&ge.drawBuffers(o,U),ge.viewport(O),ge.scissor(F),ge.setScissorTest(ie),P){let se=r.get(o.texture);m.framebufferTexture2D(m.FRAMEBUFFER,m.COLOR_ATTACHMENT0,m.TEXTURE_CUBE_MAP_POSITIVE_X+A,se.__webglTexture,I)}else if(oe){let se=A;for(let _e=0;_e<o.textures.length;_e++){let Se=r.get(o.textures[_e]);m.framebufferTextureLayer(m.FRAMEBUFFER,m.COLOR_ATTACHMENT0+_e,Se.__webglTexture,I,se)}}else if(o!==null&&I!==0){let se=r.get(o.texture);m.framebufferTexture2D(m.FRAMEBUFFER,m.COLOR_ATTACHMENT0,m.TEXTURE_2D,se.__webglTexture,I)}W=-1},this.readRenderTargetPixels=function(o,A,I,U,P,oe,ce,se=0){if(!(o&&o.isWebGLRenderTarget)){Ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let _e=r.get(o).__webglFramebuffer;if(o.isWebGLCubeRenderTarget&&ce!==void 0&&(_e=_e[ce]),_e){ge.bindFramebuffer(m.FRAMEBUFFER,_e);try{let Se=o.textures[se],Pe=Se.format,Ie=Se.type;if(o.textures.length>1&&m.readBuffer(m.COLOR_ATTACHMENT0+se),!Ke.textureFormatReadable(Pe)){Ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ke.textureTypeReadable(Ie)){Ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}A>=0&&A<=o.width-U&&I>=0&&I<=o.height-P&&m.readPixels(A,I,U,P,te.convert(Pe),te.convert(Ie),oe)}finally{let Se=z!==null?r.get(z).__webglFramebuffer:null;ge.bindFramebuffer(m.FRAMEBUFFER,Se)}}},this.readRenderTargetPixelsAsync=async function(o,A,I,U,P,oe,ce,se=0){if(!(o&&o.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let _e=r.get(o).__webglFramebuffer;if(o.isWebGLCubeRenderTarget&&ce!==void 0&&(_e=_e[ce]),_e)if(A>=0&&A<=o.width-U&&I>=0&&I<=o.height-P){ge.bindFramebuffer(m.FRAMEBUFFER,_e);let Se=o.textures[se],Pe=Se.format,Ie=Se.type;if(o.textures.length>1&&m.readBuffer(m.COLOR_ATTACHMENT0+se),!Ke.textureFormatReadable(Pe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ke.textureTypeReadable(Ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Ee=m.createBuffer();m.bindBuffer(m.PIXEL_PACK_BUFFER,Ee),m.bufferData(m.PIXEL_PACK_BUFFER,oe.byteLength,m.STREAM_READ),m.readPixels(A,I,U,P,te.convert(Pe),te.convert(Ie),0);let ke=z!==null?r.get(z).__webglFramebuffer:null;ge.bindFramebuffer(m.FRAMEBUFFER,ke);let it=m.fenceSync(m.SYNC_GPU_COMMANDS_COMPLETE,0);return m.flush(),await Ra(m,it,4),m.bindBuffer(m.PIXEL_PACK_BUFFER,Ee),m.getBufferSubData(m.PIXEL_PACK_BUFFER,0,oe),m.deleteBuffer(Ee),m.deleteSync(it),oe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(o,A=null,I=0){let U=Math.pow(2,-I),P=Math.floor(o.image.width*U),oe=Math.floor(o.image.height*U),ce=A!==null?A.x:0,se=A!==null?A.y:0;x.setTexture2D(o,0),m.copyTexSubImage2D(m.TEXTURE_2D,I,0,0,ce,se,P,oe),ge.unbindTexture()};let Ao=m.createFramebuffer(),Ro=m.createFramebuffer();this.copyTextureToTexture=function(o,A,I=null,U=null,P=0,oe=0){let ce,se,_e,Se,Pe,Ie,Ee,ke,it,et=o.isCompressedTexture?o.mipmaps[oe]:o.image;if(I!==null)ce=I.max.x-I.min.x,se=I.max.y-I.min.y,_e=I.isBox3?I.max.z-I.min.z:1,Se=I.min.x,Pe=I.min.y,Ie=I.isBox3?I.min.z:0;else{let ct=Math.pow(2,-P);ce=Math.floor(et.width*ct),se=Math.floor(et.height*ct),o.isDataArrayTexture?_e=et.depth:o.isData3DTexture?_e=Math.floor(et.depth*ct):_e=1,Se=0,Pe=0,Ie=0}U!==null?(Ee=U.x,ke=U.y,it=U.z):(Ee=0,ke=0,it=0);let We=te.convert(A.format),ft=te.convert(A.type),ve;A.isData3DTexture?(x.setTexture3D(A,0),ve=m.TEXTURE_3D):A.isDataArrayTexture||A.isCompressedArrayTexture?(x.setTexture2DArray(A,0),ve=m.TEXTURE_2D_ARRAY):(x.setTexture2D(A,0),ve=m.TEXTURE_2D),m.pixelStorei(m.UNPACK_FLIP_Y_WEBGL,A.flipY),m.pixelStorei(m.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),m.pixelStorei(m.UNPACK_ALIGNMENT,A.unpackAlignment);let _t=m.getParameter(m.UNPACK_ROW_LENGTH),Oe=m.getParameter(m.UNPACK_IMAGE_HEIGHT),gt=m.getParameter(m.UNPACK_SKIP_PIXELS),xt=m.getParameter(m.UNPACK_SKIP_ROWS),Gt=m.getParameter(m.UNPACK_SKIP_IMAGES);m.pixelStorei(m.UNPACK_ROW_LENGTH,et.width),m.pixelStorei(m.UNPACK_IMAGE_HEIGHT,et.height),m.pixelStorei(m.UNPACK_SKIP_PIXELS,Se),m.pixelStorei(m.UNPACK_SKIP_ROWS,Pe),m.pixelStorei(m.UNPACK_SKIP_IMAGES,Ie);let $t=o.isDataArrayTexture||o.isData3DTexture,Ye=A.isDataArrayTexture||A.isData3DTexture;if(o.isDepthTexture){let ct=r.get(o),It=r.get(A),lt=r.get(ct.__renderTarget),Nt=r.get(It.__renderTarget);ge.bindFramebuffer(m.READ_FRAMEBUFFER,lt.__webglFramebuffer),ge.bindFramebuffer(m.DRAW_FRAMEBUFFER,Nt.__webglFramebuffer);for(let Zt=0;Zt<_e;Zt++)$t&&(m.framebufferTextureLayer(m.READ_FRAMEBUFFER,m.COLOR_ATTACHMENT0,r.get(o).__webglTexture,P,Ie+Zt),m.framebufferTextureLayer(m.DRAW_FRAMEBUFFER,m.COLOR_ATTACHMENT0,r.get(A).__webglTexture,oe,it+Zt)),m.blitFramebuffer(Se,Pe,ce,se,Ee,ke,ce,se,m.DEPTH_BUFFER_BIT,m.NEAREST);ge.bindFramebuffer(m.READ_FRAMEBUFFER,null),ge.bindFramebuffer(m.DRAW_FRAMEBUFFER,null)}else if(P!==0||o.isRenderTargetTexture||r.has(o)){let ct=r.get(o),It=r.get(A);ge.bindFramebuffer(m.READ_FRAMEBUFFER,Ao),ge.bindFramebuffer(m.DRAW_FRAMEBUFFER,Ro);for(let lt=0;lt<_e;lt++)$t?m.framebufferTextureLayer(m.READ_FRAMEBUFFER,m.COLOR_ATTACHMENT0,ct.__webglTexture,P,Ie+lt):m.framebufferTexture2D(m.READ_FRAMEBUFFER,m.COLOR_ATTACHMENT0,m.TEXTURE_2D,ct.__webglTexture,P),Ye?m.framebufferTextureLayer(m.DRAW_FRAMEBUFFER,m.COLOR_ATTACHMENT0,It.__webglTexture,oe,it+lt):m.framebufferTexture2D(m.DRAW_FRAMEBUFFER,m.COLOR_ATTACHMENT0,m.TEXTURE_2D,It.__webglTexture,oe),P!==0?m.blitFramebuffer(Se,Pe,ce,se,Ee,ke,ce,se,m.COLOR_BUFFER_BIT,m.NEAREST):Ye?m.copyTexSubImage3D(ve,oe,Ee,ke,it+lt,Se,Pe,ce,se):m.copyTexSubImage2D(ve,oe,Ee,ke,Se,Pe,ce,se);ge.bindFramebuffer(m.READ_FRAMEBUFFER,null),ge.bindFramebuffer(m.DRAW_FRAMEBUFFER,null)}else Ye?o.isDataTexture||o.isData3DTexture?m.texSubImage3D(ve,oe,Ee,ke,it,ce,se,_e,We,ft,et.data):A.isCompressedArrayTexture?m.compressedTexSubImage3D(ve,oe,Ee,ke,it,ce,se,_e,We,et.data):m.texSubImage3D(ve,oe,Ee,ke,it,ce,se,_e,We,ft,et):o.isDataTexture?m.texSubImage2D(m.TEXTURE_2D,oe,Ee,ke,ce,se,We,ft,et.data):o.isCompressedTexture?m.compressedTexSubImage2D(m.TEXTURE_2D,oe,Ee,ke,et.width,et.height,We,et.data):m.texSubImage2D(m.TEXTURE_2D,oe,Ee,ke,ce,se,We,ft,et);m.pixelStorei(m.UNPACK_ROW_LENGTH,_t),m.pixelStorei(m.UNPACK_IMAGE_HEIGHT,Oe),m.pixelStorei(m.UNPACK_SKIP_PIXELS,gt),m.pixelStorei(m.UNPACK_SKIP_ROWS,xt),m.pixelStorei(m.UNPACK_SKIP_IMAGES,Gt),oe===0&&A.generateMipmaps&&m.generateMipmap(ve),ge.unbindTexture()},this.initRenderTarget=function(o){r.get(o).__webglFramebuffer===void 0&&x.setupRenderTarget(o)},this.initTexture=function(o){o.isCubeTexture?x.setTextureCube(o,0):o.isData3DTexture?x.setTexture3D(o,0):o.isDataArrayTexture||o.isCompressedArrayTexture?x.setTexture2DArray(o,0):x.setTexture2D(o,0),ge.unbindTexture()},this.resetState=function(){R=0,V=0,z=null,ge.reset(),J.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Vi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(n){this._outputColorSpace=n;let t=this.getContext();t.drawingBufferColorSpace=tt._getDrawingBufferColorSpace(n),t.unpackColorSpace=tt._getUnpackColorSpace()}};export{po as a};
/*! Bundled license information:

three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
