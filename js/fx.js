/*
 * FX: a small zero-dependency WebGL2 sprite + post-processing engine.
 *
 *   sprites (one instanced draw, every shape is a signed-distance field, so edges stay crisp at any zoom)
 *     -> HDR buffer -> bloom (down/up-sample chain) -> shockwaves + lens + chromatic aberration -> tone map
 *
 * Colours above 1.0 are what bloom picks up, so "brightness" is a real artistic control.
 * If WebGL2 is unavailable (or ?lofi=1) a plain Canvas2D fallback draws the same sprites, simply and legibly.
 */
(function (root) {
  'use strict';

  var T = {
    GLOW: 0, BOX: 1, BALL: 2, RING: 3, SHARD: 4, FLARE: 5, GLYPH: 6, GEM: 7, CRATE: 8, PORTAL: 9,
    PEG: 10, DOMINO: 11, BELL: 12, SMOKE: 13, CHEVRON: 14, DISC: 15
  };
  var STRIDE = 16, MAX_SPRITES = 24000;

  var VS_FS = '#version 300 es\nout vec2 vUv;void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);vUv=p;gl_Position=vec4(p*2.-1.,0,1);}';

  var VS_SPRITE = [
    '#version 300 es',
    'layout(location=0) in vec2 aQ;',
    'layout(location=1) in vec4 iPS;',     // x y hw hh
    'layout(location=2) in vec4 iRT;',     // rot type p1 p2
    'layout(location=3) in vec4 iA;',
    'layout(location=4) in vec4 iB;',
    'uniform vec4 uView;',                 // scaleX scaleY offsetX offsetY (world -> clip)
    'uniform float uPx;',                  // world units per pixel
    'out vec2 vL; out vec2 vS; out vec4 vA; out vec4 vB; flat out vec3 vT;',
    'void main(){',
    '  float pad = 2.0*uPx;',
    '  vec2 s = iPS.zw + pad;',
    '  vec2 l = aQ*s;',
    '  float c=cos(iRT.x), n=sin(iRT.x);',
    '  vec2 w = iPS.xy + vec2(c*l.x-n*l.y, n*l.x+c*l.y);',
    '  gl_Position = vec4(w*uView.xy+uView.zw,0,1);',
    '  vL=l; vS=iPS.zw; vA=iA; vB=iB; vT=vec3(iRT.y,iRT.z,iRT.w);',
    '}'
  ].join('\n');

  var FS_SPRITE = [
    '#version 300 es',
    'precision highp float;',
    'in vec2 vL; in vec2 vS; in vec4 vA; in vec4 vB; flat in vec3 vT;',
    'uniform float uPx; uniform float uTime; uniform sampler2D uAtlas;',
    'out vec4 o;',
    'float box(vec2 p, vec2 b, float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}',
    'float aa(float d){return clamp(.5-d/uPx,0.,1.);}',
    'void main(){',
    '  int t=int(vT.x+.5); float p1=vT.y, p2=vT.z; vec2 p=vL;',
    '  if(t==0){', // GLOW: additive soft dot. p1=falloff
    '    float d=length(p/vS); if(d>=1.) discard; float v=pow(1.-d,p1<=0.?2.:p1); o=vec4(vA.rgb*vA.a*v,0.); return;',
    '  }',
    '  if(t==1){', // BOX: lit slab with a hot rim. A=body B=rim p1=radius p2=rim width
    '    float d=box(p,vS,p1); float a=aa(d); if(a<=0.) discard;',
    '    float g=clamp(p.y/vS.y*.5+.5,0.,1.);',
    '    vec3 c=mix(vA.rgb,vA.rgb*.42,g);',
    '    float rim=smoothstep(-p2,-p2*.1,d);',
    '    float top=smoothstep(.0,1.,1.-g)*.25;',
    '    c+=vB.rgb*(rim*vB.a)+vA.rgb*top;',
    '    o=vec4(c*a,a*vA.a); return;',
    '  }',
    '  if(t==2){', // BALL: a glassy marble. p1=spin p2=material
    '    float r=vS.x; float d=length(p)-r; float a=aa(d); if(a<=0.) discard;',
    '    vec2 n=p/r; float z=sqrt(max(0.,1.-dot(n,n))); vec3 N=vec3(n,z);',
    '    vec3 L=normalize(vec3(-.5,-.65,.6));',
    '    float cs=cos(p1),sn=sin(p1); vec2 q=vec2(cs*n.x-sn*n.y,sn*n.x+cs*n.y);',
    '    float swirl=.5+.5*sin(q.x*6.+sin(q.y*5.+p1)*2.5);',
    '    vec3 base=mix(vA.rgb,vB.rgb,swirl);',
    '    float dif=max(0.,dot(N,L))*.8+.3;',
    '    float spec=pow(max(0.,dot(N,normalize(L+vec3(0,0,1)))),60.);',
    '    float fres=pow(1.-z,2.5);',
    '    vec3 c=base*dif+vec3(1.)*spec*3.+vB.rgb*fres*1.6;',
    '    if(p2>1.5){c=mix(c,vec3(1.9,1.3,.35)*dif+vec3(1.)*spec*4.,.75);}',   // gold
    '    else if(p2>.5){c+=vA.rgb*.9;}',                                       // burning hot
    '    o=vec4(c*a,a); return;',
    '  }',
    '  if(t==3){', // RING: additive. p1=thickness (fraction of radius)
    '    float d=abs(length(p)-vS.x*(1.-p1))-vS.x*p1*.8; float v=clamp(1.-max(d,0.)/(vS.x*p1+uPx),0.,1.);',
    '    o=vec4(vA.rgb*vA.a*v*v,0.); return;',
    '  }',
    '  if(t==4){', // SHARD: triangle fragment
    '    vec2 q=p/vS; float d=max(abs(q.x)*.866+q.y*.5,-q.y)-.5; float a=clamp(.5-d*vS.x/uPx,0.,1.); if(a<=0.) discard;',
    '    o=vec4(vA.rgb*a,a*vA.a); return;',
    '  }',
    '  if(t==5){', // FLARE: four-point star. additive
    '    vec2 q=abs(p/vS); float d=length(p/vS); if(d>=1.) discard;',
    '    float v=.018/(q.x*q.y+.018)*pow(1.-d,2.)+pow(max(0.,1.-d*2.2),3.)*1.2;',
    '    o=vec4(vA.rgb*vA.a*v,0.); return;',
    '  }',
    '  if(t==6){', // GLYPH: B=uv rect. additive-ish
    '    vec2 q=p/vS; if(abs(q.x)>=1.||abs(q.y)>=1.) discard;',
    '    vec2 uv=mix(vB.xy,vB.zw,q*.47+.5); float m=texture(uAtlas,uv).r; if(m<=.01) discard;',
    '    o=vec4(vA.rgb*m,m*p1); return;',
    '  }',
    '  if(t==7){', // GEM
    '    float ang=atan(p.y,p.x)+p1; float seg=6.2832/8.; float fa=floor(ang/seg); float h=cos(seg*.5)/cos(mod(ang,seg)-seg*.5); float R=vS.x*h;',
    '    float d=length(p)-R; float a=aa(d); if(a<=0.) discard;',
    '    float f=.55+.45*sin(fa*2.4+p2); float core=smoothstep(.62,.5,length(p)/vS.x);',
    '    vec3 c=mix(vA.rgb*(.5+f),vB.rgb*(1.1+f),core)+vec3(1.)*pow(f,6.)*.8;',
    '    o=vec4(c*a,a); return;',
    '  }',
    '  if(t==8){', // CRATE: hazard stripes
    '    float d=box(p,vS,.06); float a=aa(d); if(a<=0.) discard;',
    '    float s=step(.5,fract((p.x+p.y)/(vS.x*.62)));',
    '    float inner=step(box(p,vS*.72,.04),0.);',
    '    vec3 c=mix(mix(vec3(.9,.1,.04),vec3(.08,.03,.03),s),vec3(1.2,.25,.06)*(.7+.5*p1),inner);',
    '    float rim=smoothstep(-.06,0.,d); c+=vec3(2.2,.7,.2)*rim*(.5+p1);',
    '    o=vec4(c*a,a); return;',
    '  }',
    '  if(t==9){', // PORTAL: spinning swirl. additive with a dark throat
    '    float r=length(p)/vS.x; if(r>=1.) discard; float ang=atan(p.y,p.x);',
    '    float sw=.5+.5*sin(ang*3.+r*11.-uTime*5.*p1); float edge=smoothstep(1.,.72,r);',
    '    float hole=smoothstep(.1,.6,r);',
    '    vec3 c=mix(vA.rgb,vB.rgb,sw)*(sw*.8+.5)*edge*hole*1.8;',
    '    o=vec4(c,(1.-hole)*edge); return;',
    '  }',
    '  if(t==10){', // PEG: studded bumper. p1=flash
    '    float r=vS.x; float d=length(p)-r; float a=aa(d); if(a<=0.) discard;',
    '    float q=length(p)/r; vec3 c=mix(vA.rgb*1.2,vB.rgb,smoothstep(.2,.95,q));',
    '    c+=vec3(1.)*smoothstep(.34,.0,length(p/r+vec2(.3,.34)))*.9; c+=vB.rgb*(smoothstep(.72,1.,q)*1.5)+vA.rgb*p1*4.;',
    '    o=vec4(c*a,a); return;',
    '  }',
    '  if(t==11){', // DOMINO: pips + a divider, heat on impact. p1=heat p2=rim
    '    float d=box(p,vS,min(vS.x*.5,.05)); float a=aa(d); if(a<=0.) discard;',
    '    float g=p.x/vS.x*.5+.5; vec3 c=mix(vA.rgb,vB.rgb,g);',
    '    float rim=smoothstep(-.035,-.003,d); c+=mix(vA.rgb,vec3(1.),.45)*rim*(.9+p2);',
    '    float py=fract((p.y/vS.y*.5+.5)*6.)-.5; float cell=floor((p.y/vS.y*.5+.5)*6.);',
    '    float pip=smoothstep(.34,.2,length(vec2(p.x/vS.x*1.1,py)));',
    '    float hasPip=step(.5,mod(cell+1.,2.)); c+=vec3(1.3)*pip*hasPip*.75;',
    '    float mid=smoothstep(.022,.0,abs(p.y)); c+=vec3(.9)*mid;',
    '    c+=vec3(2.6,2.1,1.6)*p1;',
    '    o=vec4(c*a,a); return;',
    '  }',
    '  if(t==12){', // BELL silhouette. p1=glow p2=swing
    '    float cs=cos(p2),sn=sin(p2); vec2 q=vec2(cs*p.x+sn*(p.y+vS.y),-sn*p.x+cs*(p.y+vS.y))-vec2(0,vS.y); vec2 u=q/vS;',
    '    float w=.34+.62*smoothstep(-.75,.8,u.y)*smoothstep(-.75,.8,u.y);',
    '    float d=max(abs(u.x)-w,max(-.8-u.y,u.y-.78));',
    '    float dome=length(u-vec2(0,-.5))-.4; d=min(d,dome);',
    '    d=min(d,length(u-vec2(0,.9))-.16);',
    '    float a=clamp(.5-d*vS.x/uPx,0.,1.); if(a<=0.) discard;',
    '    float sh=.55+.75*smoothstep(.75,-.6,u.x/(w+.001))*smoothstep(1.2,-.5,u.x/(w+.001));',
    '    vec3 c=mix(vec3(.95,.55,.12),vec3(1.8,1.35,.5),sh)+vec3(2.4,1.8,.7)*p1;',
    '    o=vec4(c*a,a); return;',
    '  }',
    '  if(t==13){', // SMOKE: soft blended puff
    '    float d=length(p/vS); if(d>=1.) discard; float v=pow(1.-d,1.6)*vA.a; o=vec4(vA.rgb*v,v); return;',
    '  }',
    '  if(t==14){', // CHEVRON speed arrows. p1=phase
    '    vec2 q=p/vS; float s=fract(q.x*2.-q.y*0.+abs(q.y)*-1.2-p1); float v=smoothstep(.0,.15,s)*smoothstep(.55,.4,s)*smoothstep(1.,.6,abs(q.y))*smoothstep(1.,.75,abs(q.x));',
    '    if(v<=.003) discard; o=vec4(vA.rgb*vA.a*v,0.); return;',
    '  }',
    '  if(t==15){', // DISC: flat blended circle
    '    float d=length(p)-vS.x; float a=aa(d); if(a<=0.) discard; o=vec4(vA.rgb*a*vA.a,a*vA.a); return;',
    '  }',
    '  discard;',
    '}'
  ].join('\n');

  var FS_BG = [
    '#version 300 es',
    'precision highp float;',
    'in vec2 vUv; out vec4 o;',
    'uniform vec2 uRes; uniform float uTime; uniform vec2 uCam; uniform float uHeat;',
    'uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uC3;',
    'uniform vec4 uLight[8]; uniform vec3 uLightC[8]; uniform int uNL; uniform vec4 uView;',
    'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
    'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}',
    'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}',
    'void main(){',
    '  float asp=uRes.x/uRes.y; vec2 uv=vUv; vec2 s=(uv-.5)*vec2(asp,1.);',
    '  vec2 par=uCam*vec2(.006,.004);',
    '  float hor=.30+.015*sin(uTime*.3);',                 // horizon, from the bottom of the screen
    '  float above=smoothstep(0.,1.,(uv.y-hor)/(1.-hor));',
    '  vec3 c=mix(uC2*.34,uC1*.42,pow(max(above,0.),.6));',
    '  float neb=fbm(s*2.1+par*2.+vec2(uTime*.012,-uTime*.008)); float neb2=fbm(s*4.+par*3.-vec2(uTime*.02,0.)+neb*2.);',
    '  c+=uC2*pow(neb,2.6)*.42+uC3*pow(neb2,4.)*.16;',
    // stars
    '  vec2 g=(s+par*1.5)*90.; vec2 id=floor(g); float st=h(id); vec2 fp=fract(g)-.5;',
    '  float tw=.5+.5*sin(uTime*(1.+st*3.)+st*40.);',
    '  c+=vec3(.9,.95,1.)*step(.975,st)*smoothstep(.34,.02,length(fp))*tw*(.7+uHeat*.6)*smoothstep(hor,hor+.25,uv.y);',
    // art deco sun with sun-burst rays
    '  vec2 sc=vec2(par.x*-2.,hor+.10); vec2 d=vec2(s.x,uv.y)-sc; float r=length(d); float sr=.20+.006*sin(uTime*.5);',
    '  float ang=atan(d.y,d.x);',
    '  float rays=smoothstep(.55,.95,sin(ang*14.+uTime*(.08+.25*uHeat)))*smoothstep(1.1,.26,r)*step(0.,d.y+.08);',
    '  c+=uC3*rays*(.035+.16*uHeat)*smoothstep(hor-.01,hor+.04,uv.y);',
    '  float halo=exp(-max(r-sr,0.)*7.); c+=uC3*halo*(.07+.26*uHeat);',
    '  if(r<sr&&uv.y>hor){',
    '    float gy=clamp((d.y+sr)/(2.*sr),0.,1.);',
    '    float gap=mix(.62,.0,smoothstep(.15,.72,gy));',
    '    float bands=step(gap,fract(gy*15.-uTime*.09));',
    '    vec3 sun=mix(uC3*vec3(.85,.28,.55),uC3*vec3(.95,.72,.42)+vec3(.12,.09,.03),smoothstep(.1,1.,gy));',
    '    c=mix(c,sun*(.62+.5*uHeat),bands*smoothstep(sr,sr-.006,r));',
    '  }',
    // perspective grid below the horizon
    '  if(uv.y<hor){',
    '    float dy=hor-uv.y; float z=.17/dy; vec2 gp=vec2(s.x*z+par.x*18.,z+uTime*.42+par.y*30.);',
    '    vec2 fw=fwidth(gp); vec2 gl=abs(fract(gp*1.6)-.5)/(fw*1.6);',
    '    float line=1.-min(min(gl.x,gl.y),1.);',
    '    float fade=smoothstep(0.,.03,dy)*(1.-smoothstep(.0,hor*1.1,dy)*.25);',
    '    vec3 ground=mix(uC2*.12,uC1*.22,smoothstep(.0,.3,dy));',
    '    c=ground+uC3*line*fade*(.26+uHeat*.9)+uC3*exp(-dy*18.)*(.14+.3*uHeat);',
    '  }',
    // moving lights spill onto the fog
    '  vec2 wp=(vec2(uv.x*2.-1.,uv.y*2.-1.)-uView.zw)/uView.xy;',
    '  for(int i=0;i<uNL;i++){vec2 dl=wp-uLight[i].xy; float f=uLight[i].z/(1.+dot(dl,dl)*uLight[i].w); c+=uLightC[i]*f;}',
    '  float v=1.-dot((uv-.5)*vec2(1.05,.95),(uv-.5)*vec2(1.05,.95))*.9;',
    '  o=vec4(c*v,1.);',
    '}'
  ].join('\n');

  var FS_DOWN = [
    '#version 300 es', 'precision highp float;', 'in vec2 vUv; out vec4 o;',
    'uniform sampler2D uT; uniform vec2 uPx; uniform float uThresh;',
    'void main(){',
    '  vec2 x=uPx; vec3 a=texture(uT,vUv+vec2(-2.,2.)*x).rgb,b=texture(uT,vUv+vec2(0.,2.)*x).rgb,c=texture(uT,vUv+vec2(2.,2.)*x).rgb;',
    '  vec3 d=texture(uT,vUv+vec2(-2.,0.)*x).rgb,e=texture(uT,vUv).rgb,f=texture(uT,vUv+vec2(2.,0.)*x).rgb;',
    '  vec3 g=texture(uT,vUv+vec2(-2.,-2.)*x).rgb,h=texture(uT,vUv+vec2(0.,-2.)*x).rgb,i=texture(uT,vUv+vec2(2.,-2.)*x).rgb;',
    '  vec3 j=texture(uT,vUv+vec2(-1.,1.)*x).rgb,k=texture(uT,vUv+vec2(1.,1.)*x).rgb,l=texture(uT,vUv+vec2(-1.,-1.)*x).rgb,m=texture(uT,vUv+vec2(1.,-1.)*x).rgb;',
    '  vec3 r=e*.125+(a+c+g+i)*.03125+(b+d+f+h)*.0625+(j+k+l+m)*.125;',
    '  if(uThresh>0.){float br=max(r.r,max(r.g,r.b)); float s=clamp(br-uThresh+.35,0.,.7); s=s*s/(4.*.35+1e-4); r*=max(s,br-uThresh)/max(br,1e-4);}',
    '  o=vec4(min(r,vec3(30.)),1.);',
    '}'
  ].join('\n');

  var FS_UP = [
    '#version 300 es', 'precision highp float;', 'in vec2 vUv; out vec4 o;',
    'uniform sampler2D uT; uniform vec2 uPx; uniform float uK;',
    'void main(){vec2 x=uPx*1.6; vec3 c=texture(uT,vUv).rgb*4.;',
    ' c+=(texture(uT,vUv+vec2(x.x,0.)).rgb+texture(uT,vUv-vec2(x.x,0.)).rgb+texture(uT,vUv+vec2(0.,x.y)).rgb+texture(uT,vUv-vec2(0.,x.y)).rgb)*2.;',
    ' c+=texture(uT,vUv+x).rgb+texture(uT,vUv-x).rgb+texture(uT,vUv+vec2(x.x,-x.y)).rgb+texture(uT,vUv+vec2(-x.x,x.y)).rgb;',
    ' o=vec4(c/16.*uK,1.);}'
  ].join('\n');

  var FS_FINAL = [
    '#version 300 es', 'precision highp float;', 'in vec2 vUv; out vec4 o;',
    'uniform sampler2D uS; uniform sampler2D uB; uniform vec2 uRes; uniform float uTime;',
    'uniform float uCA; uniform float uBloom; uniform float uSat; uniform float uFlash; uniform float uExposure;',
    'uniform vec4 uW[6]; uniform int uNW;',
    'float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}',
    'void main(){',
    '  vec2 uv=vUv; float asp=uRes.x/uRes.y; vec2 off=vec2(0.);',
    '  for(int i=0;i<uNW;i++){',       // shockwaves: x y radius strength (uv space)
    '    vec2 d=(uv-uW[i].xy)*vec2(asp,1.); float r=length(d); float w=uW[i].z; float e=r-w;',
    '    float band=exp(-e*e*320.)*uW[i].w; if(r>1e-4) off+=d/r*band*.055/vec2(asp,1.);',
    '  }',
    '  vec2 q=uv+off; vec2 cd=(uv-.5); float ca=uCA*(.0015+dot(cd,cd)*.012)+length(off)*.5;',
    '  vec3 c=vec3(texture(uS,q+cd*ca).r,texture(uS,q).g,texture(uS,q-cd*ca).b);',
    '  vec3 b=vec3(texture(uB,q+cd*ca*1.4).r,texture(uB,q).g,texture(uB,q-cd*ca*1.4).b);',
    '  c+=b*uBloom; c+=uFlash;',
    '  float l=dot(c,vec3(.3,.59,.11)); c=mix(vec3(l),c,uSat);',
    '  c*=uExposure;',
    '  c=(c*(2.51*c+.03))/(c*(2.43*c+.59)+.14);',      // ACES-ish filmic curve
    '  c=pow(clamp(c,0.,1.),vec3(.88));',
    '  float v=1.-dot(cd,cd)*.55; c*=v;',
    '  c+=(h(uv*uRes+fract(uTime)*91.)-.5)*.018;',
    '  o=vec4(c,1.);',
    '}'
  ].join('\n');

  function compile(gl, vs, fs) {
    function sh(type, src) {
      var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error('shader: ' + gl.getShaderInfoLog(s));
      return s;
    }
    var p = gl.createProgram();
    gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('link: ' + gl.getProgramInfoLog(p));
    var u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < n; i++) { var name = gl.getActiveUniform(p, i).name; u[name.replace('[0]', '')] = gl.getUniformLocation(p, name); }
    return { p: p, u: u };
  }

  // ---------------------------------------------------------------- glyph atlas
  var GLYPHS = '0123456789+-×x!:.,ABCDEFGHIJKLMNOPQRSTUVWXYZ ';
  function buildAtlas() {
    var size = 72, cols = 12, rows = Math.ceil(GLYPHS.length / cols);
    var cv = (root.document && root.document.createElement('canvas'));
    if (!cv) return null;
    cv.width = cols * size; cv.height = rows * size;
    var c = cv.getContext('2d');
    c.fillStyle = '#000'; c.fillRect(0, 0, cv.width, cv.height);
    c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = '800 ' + (size * 0.72) + 'px "Segoe UI", system-ui, -apple-system, Roboto, Helvetica, Arial, sans-serif';
    var map = {};
    for (var i = 0; i < GLYPHS.length; i++) {
      var ch = GLYPHS[i], cx = i % cols, cy = Math.floor(i / cols);
      c.fillText(ch, cx * size + size / 2, cy * size + size / 2);
      map[ch] = { u0: cx / cols, v0: cy / rows, u1: (cx + 1) / cols, v1: (cy + 1) / rows, adv: Math.min(1, c.measureText(ch).width / size + 0.035) };
    }
    return { canvas: cv, map: map };
  }

  // ---------------------------------------------------------------- engine
  function FX(canvas, opts) {
    opts = opts || {};
    this.canvas = canvas;
    this.T = T;
    this.data = new Float32Array(MAX_SPRITES * STRIDE);
    this.n = 0;
    this.quality = opts.quality == null ? 2 : opts.quality;
    this.px = 0.02; this.time = 0;
    this.waves = []; this.lights = [];
    this.flash = 0; this.ca = 0; this.sat = 1; this.bloom = 1; this.heat = 0;
    this.colors = { c1: [0.05, 0.03, 0.2], c2: [0.32, 0.06, 0.42], c3: [1, 0.25, 0.6] };
    this.view = [1, 1, 0, 0];
    this.gl = null;
    this.atlas = buildAtlas();
    var gl = opts.lofi ? null : canvas.getContext('webgl2', { alpha: false, antialias: false, powerPreference: 'high-performance' });
    if (gl) {
      try { this._init(gl); this.gl = gl; } catch (e) { if (root.console) console.warn('FX falling back:', e); this.initError = String(e); gl = null; this.gl = null; }
    }
    if (!this.gl) {
      // a canvas that already handed out a webgl2 context cannot give a 2D one; swap in a fresh element
      if (canvas.getContext('2d') == null && canvas.parentNode) {
        var fresh = canvas.cloneNode(false); canvas.parentNode.replaceChild(fresh, canvas); this.canvas = canvas = fresh;
      }
      this.c2d = canvas.getContext('2d');
    }
    var self = this;
    if (this.gl) {
      canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); self.lost = true; });
      canvas.addEventListener('webglcontextrestored', function () { try { self._init(self.gl); self.lost = false; self.resize(true); } catch (err) { /* stays black */ } });
    }
    this.resize(true);
  }

  FX.prototype._init = function (gl) {
    var ext = gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float');
    this.hdr = !!ext;
    gl.getExtension('OES_texture_float_linear');
    this.progSprite = compile(gl, VS_SPRITE, FS_SPRITE);
    this.progBg = compile(gl, VS_FS, FS_BG);
    this.progDown = compile(gl, VS_FS, FS_DOWN);
    this.progUp = compile(gl, VS_FS, FS_UP);
    this.progFinal = compile(gl, VS_FS, FS_FINAL);
    this.vao = gl.createVertexArray(); gl.bindVertexArray(this.vao);
    var q = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, q);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    this.inst = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, this.inst);
    gl.bufferData(gl.ARRAY_BUFFER, this.data.byteLength, gl.DYNAMIC_DRAW);
    var off = 0;
    for (var i = 1; i <= 4; i++) {
      gl.enableVertexAttribArray(i);
      gl.vertexAttribPointer(i, 4, gl.FLOAT, false, STRIDE * 4, off);
      gl.vertexAttribDivisor(i, 1);
      off += 16;
    }
    this.emptyVao = gl.createVertexArray();
    if (this.atlas) {
      this.atlasTex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, this.atlasTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.atlas.canvas);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAX_LOD, 2);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    this.fbos = null;
  };

  FX.prototype._target = function (w, h, hdr) {
    var gl = this.gl, tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    if (hdr) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
    else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    var fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return { tex: tex, fb: fb, w: w, h: h };
  };

  FX.prototype._free = function () {
    var gl = this.gl;
    if (!this.fbos) return;
    var all = [this.fbos.scene, this.fbos.bg].concat(this.fbos.mips);
    all.forEach(function (t) { gl.deleteTexture(t.tex); gl.deleteFramebuffer(t.fb); });
    this.fbos = null;
  };

  /** Device pixels are capped per quality level; the game lowers quality itself if frames run long. */
  FX.prototype.resize = function (force) {
    var c = this.canvas, r = c.getBoundingClientRect();
    var cap = [1, 1.25, 2][this.quality];
    var dpr = Math.min(root.devicePixelRatio || 1, cap);
    var maxPixels = [1.1e6, 2.2e6, 4.2e6][this.quality];
    var w = Math.max(200, r.width * dpr), h = Math.max(200, r.height * dpr);
    if (w * h > maxPixels) { var k = Math.sqrt(maxPixels / (w * h)); w *= k; h *= k; }
    w = Math.floor(w); h = Math.floor(h);
    if (!force && w === c.width && h === c.height) return false;
    c.width = w; c.height = h; this.w = w; this.h = h; this.dpr = w / Math.max(1, r.width);
    if (!this.gl) return true;
    this._free();
    var levels = [4, 5, 6][this.quality], mips = [], mw = w, mh = h;
    for (var i = 0; i < levels; i++) {
      mw = Math.max(2, mw >> 1); mh = Math.max(2, mh >> 1);
      mips.push(this._target(mw, mh, this.hdr));
    }
    this.fbos = {
      scene: this._target(w, h, this.hdr),
      bg: this._target(Math.max(2, w >> 1), Math.max(2, h >> 1), this.hdr),
      mips: mips
    };
    return true;
  };

  FX.prototype.setQuality = function (q) {
    q = Math.max(0, Math.min(2, q));
    if (q === this.quality) return;
    this.quality = q; this.resize(true);
  };

  /** cam: world centre + pixels per world unit */
  FX.prototype.setCamera = function (x, y, ppu, sx, sy) {
    var W = this.w, H = this.h;
    this.ppu = ppu;
    this.px = 1 / ppu;
    this.view = [2 * ppu / W, -2 * ppu / H, -2 * (x + (sx || 0)) * ppu / W, 2 * (y + (sy || 0)) * ppu / H];
  };
  FX.prototype.worldToUv = function (x, y) {
    var v = this.view;
    return { x: (x * v[0] + v[2]) * 0.5 + 0.5, y: (y * v[1] + v[3]) * 0.5 + 0.5 };
  };

  FX.prototype.begin = function () { this.n = 0; };

  FX.prototype.sprite = function (type, x, y, hw, hh, rot, ar, ag, ab, aa, br, bg, bb, ba, p1, p2) {
    if (this.n >= MAX_SPRITES) return;
    var d = this.data, i = this.n * STRIDE;
    d[i] = x; d[i + 1] = y; d[i + 2] = hw; d[i + 3] = hh;
    d[i + 4] = rot || 0; d[i + 5] = type; d[i + 6] = p1 || 0; d[i + 7] = p2 || 0;
    d[i + 8] = ar; d[i + 9] = ag; d[i + 10] = ab; d[i + 11] = aa;
    d[i + 12] = br; d[i + 13] = bg; d[i + 14] = bb; d[i + 15] = ba;
    this.n++;
  };

  /** size is the cell height in world units. */
  FX.prototype.text = function (str, x, y, size, r, g, b, a, align) {
    if (!this.atlas) return;
    if (this.c2d) { this._text2d(str, x, y, size, r, g, b, a, align); return; }
    var map = this.atlas.map, w = 0, i, ch;
    str = String(str).toUpperCase();
    for (i = 0; i < str.length; i++) { ch = map[str[i]] || map[' ']; w += ch.adv * size; }
    var cx = x - (align === 'left' ? 0 : align === 'right' ? w : w / 2);
    for (i = 0; i < str.length; i++) {
      ch = map[str[i]] || map[' '];
      var adv = ch.adv * size;
      this.sprite(T.GLYPH, cx + adv / 2, y, size / 2, size / 2, 0, r, g, b, a, ch.u0, ch.v0, ch.u1, ch.v1, a == null ? 1 : a, 0);
      cx += adv;
    }
  };

  FX.prototype.wave = function (x, y, strength, speed, maxAge) {
    if (this.waves.length >= 6) this.waves.shift();
    this.waves.push({ x: x, y: y, age: 0, strength: strength == null ? 1 : strength, speed: speed || 0.7, max: maxAge || 0.9 });
  };

  FX.prototype.update = function (dt) {
    for (var i = this.waves.length - 1; i >= 0; i--) { var w = this.waves[i]; w.age += dt; if (w.age > w.max) this.waves.splice(i, 1); }
    this.flash *= Math.pow(0.01, dt);
    this.ca *= Math.pow(0.03, dt);
    this.time += dt;
  };

  function bindTex(gl, unit, tex, loc) { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tex); gl.uniform1i(loc, unit); }

  FX.prototype.render = function () {
    if (this.c2d) { this._render2d(); return; }
    if (this.lost) return;
    var gl = this.gl, f = this.fbos, P;
    gl.bindVertexArray(this.emptyVao);
    gl.disable(gl.BLEND);

    // background at half resolution: smooth fog does not need the pixels
    gl.bindFramebuffer(gl.FRAMEBUFFER, f.bg.fb); gl.viewport(0, 0, f.bg.w, f.bg.h);
    P = this.progBg; gl.useProgram(P.p);
    gl.uniform2f(P.u.uRes, this.w, this.h); gl.uniform1f(P.u.uTime, this.time);
    gl.uniform2f(P.u.uCam, this.camX || 0, this.camY || 0);
    gl.uniform1f(P.u.uHeat, this.heat);
    gl.uniform3fv(P.u.uC1, this.colors.c1); gl.uniform3fv(P.u.uC2, this.colors.c2); gl.uniform3fv(P.u.uC3, this.colors.c3);
    gl.uniform4fv(P.u.uView, this.view);
    var nl = Math.min(8, this.lights.length), lp = new Float32Array(32), lc = new Float32Array(24);
    for (var i = 0; i < nl; i++) {
      var L = this.lights[i];
      lp[i * 4] = L.x; lp[i * 4 + 1] = L.y; lp[i * 4 + 2] = L.power; lp[i * 4 + 3] = L.falloff;
      lc[i * 3] = L.r; lc[i * 3 + 1] = L.g; lc[i * 3 + 2] = L.b;
    }
    gl.uniform1i(P.u.uNL, nl);
    if (P.u.uLight) gl.uniform4fv(P.u.uLight, lp);
    if (P.u.uLightC) gl.uniform3fv(P.u.uLightC, lc);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // scene: background, then every sprite in order
    gl.bindFramebuffer(gl.FRAMEBUFFER, f.scene.fb); gl.viewport(0, 0, f.scene.w, f.scene.h);
    P = this.progUp; gl.useProgram(P.p);
    bindTex(gl, 0, f.bg.tex, P.u.uT);
    gl.uniform2f(P.u.uPx, 0.5 / f.bg.w, 0.5 / f.bg.h); gl.uniform1f(P.u.uK, 1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (this.n) {
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      P = this.progSprite; gl.useProgram(P.p);
      gl.uniform4fv(P.u.uView, this.view); gl.uniform1f(P.u.uPx, this.px); gl.uniform1f(P.u.uTime, this.time);
      if (this.atlasTex) bindTex(gl, 0, this.atlasTex, P.u.uAtlas);
      gl.bindVertexArray(this.vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.inst);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.data, 0, this.n * STRIDE);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.n);
      gl.bindVertexArray(this.emptyVao);
      gl.disable(gl.BLEND);
    }

    // bloom: down the chain with a soft threshold, back up additively
    P = this.progDown; gl.useProgram(P.p);
    var src = f.scene, m;
    for (m = 0; m < f.mips.length; m++) {
      var dst = f.mips[m];
      gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fb); gl.viewport(0, 0, dst.w, dst.h);
      bindTex(gl, 0, src.tex, P.u.uT);
      gl.uniform2f(P.u.uPx, 1 / src.w, 1 / src.h);
      gl.uniform1f(P.u.uThresh, m === 0 ? (this.hdr ? 1.0 : 0.72) : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      src = dst;
    }
    P = this.progUp; gl.useProgram(P.p);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
    for (m = f.mips.length - 1; m > 0; m--) {
      var from = f.mips[m], to = f.mips[m - 1];
      gl.bindFramebuffer(gl.FRAMEBUFFER, to.fb); gl.viewport(0, 0, to.w, to.h);
      bindTex(gl, 0, from.tex, P.u.uT);
      gl.uniform2f(P.u.uPx, 1 / from.w, 1 / from.h); gl.uniform1f(P.u.uK, 0.85);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    gl.disable(gl.BLEND);

    // final: distortion, chromatic aberration, tone map
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, this.w, this.h);
    P = this.progFinal; gl.useProgram(P.p);
    bindTex(gl, 0, f.scene.tex, P.u.uS); bindTex(gl, 1, f.mips[0].tex, P.u.uB);
    gl.uniform2f(P.u.uRes, this.w, this.h); gl.uniform1f(P.u.uTime, this.time);
    gl.uniform1f(P.u.uCA, this.ca); gl.uniform1f(P.u.uBloom, 0.42 * this.bloom);
    gl.uniform1f(P.u.uSat, this.sat); gl.uniform1f(P.u.uFlash, this.flash); gl.uniform1f(P.u.uExposure, 1.05);
    var nw = Math.min(6, this.waves.length), wd = new Float32Array(24);
    for (var wi = 0; wi < nw; wi++) {
      var w = this.waves[wi], uv = this.worldToUv(w.x, w.y), k = w.age / w.max;
      wd[wi * 4] = uv.x; wd[wi * 4 + 1] = uv.y; wd[wi * 4 + 2] = w.age * w.speed; wd[wi * 4 + 3] = w.strength * (1 - k) * (1 - k);
    }
    gl.uniform1i(P.u.uNW, nw);
    if (P.u.uW) gl.uniform4fv(P.u.uW, wd);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  // ---------------------------------------------------------------- plain 2D fallback
  FX.prototype._text2d = function (str, x, y, size, r, g, b, a, align) {
    (this._texts = this._texts || []).push({ str: String(str).toUpperCase(), x: x, y: y, size: size, r: r, g: g, b: b, a: a, align: align });
  };
  function css(r, g, b, a) { return 'rgba(' + Math.min(255, r * 255 | 0) + ',' + Math.min(255, g * 255 | 0) + ',' + Math.min(255, b * 255 | 0) + ',' + (a == null ? 1 : a) + ')'; }

  FX.prototype._render2d = function () {
    var c = this.c2d, d = this.data, w = this.w, h = this.h, v = this.view, n = this.n, ppu = this.ppu || 20;
    var bg = c.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, css(this.colors.c1[0], this.colors.c1[1], this.colors.c1[2], 1));
    bg.addColorStop(1, css(this.colors.c2[0] * 0.8, this.colors.c2[1] * 0.8, this.colors.c2[2] * 0.8, 1));
    c.globalCompositeOperation = 'source-over'; c.fillStyle = bg; c.fillRect(0, 0, w, h);
    function X(x) { return (x * v[0] + v[2]) * 0.5 * w + 0.5 * w; }
    function Y(y) { return (1 - (y * v[1] + v[3])) * 0.5 * h; }
    for (var i = 0; i < n; i++) {
      var o = i * STRIDE, type = d[o + 5], x = X(d[o]), y = Y(d[o + 1]), hw = d[o + 2] * ppu, hh = d[o + 3] * ppu, rot = d[o + 4];
      var A = css(d[o + 8], d[o + 9], d[o + 10], Math.max(0, Math.min(1, d[o + 11])));
      if (x < -hw * 2 - 20 || x > w + hw * 2 + 20 || y < -hh * 2 - 20 || y > h + hh * 2 + 20) continue;
      c.save(); c.translate(x, y); c.rotate(rot);
      if (type === T.GLOW || type === T.FLARE || type === T.SMOKE) {
        c.globalCompositeOperation = type === T.SMOKE ? 'source-over' : 'lighter';
        c.globalAlpha = 0.5; c.fillStyle = A; c.beginPath(); c.arc(0, 0, hw * 0.5, 0, 6.283); c.fill();
      } else if (type === T.RING) {
        c.globalCompositeOperation = 'lighter'; c.strokeStyle = A; c.lineWidth = Math.max(1, hw * d[o + 6]); c.beginPath(); c.arc(0, 0, hw, 0, 6.283); c.stroke();
      } else if (type === T.BALL || type === T.PEG || type === T.DISC || type === T.GEM || type === T.PORTAL) {
        c.fillStyle = A; c.beginPath(); c.arc(0, 0, hw, 0, 6.283); c.fill();
      } else if (type === T.GLYPH || type === T.CHEVRON) { /* drawn as text below / skipped */
      } else if (type === T.CRATE) {
        c.fillStyle = '#d33'; c.fillRect(-hw, -hh, hw * 2, hh * 2);
      } else if (type === T.BELL) {
        c.fillStyle = '#fc4'; c.beginPath(); c.moveTo(-hw * 0.3, -hh); c.lineTo(hw * 0.3, -hh); c.lineTo(hw, hh); c.lineTo(-hw, hh); c.closePath(); c.fill();
      } else {
        c.fillStyle = A; c.fillRect(-hw, -hh, hw * 2, hh * 2);
        if (type === T.BOX) { c.strokeStyle = css(d[o + 12], d[o + 13], d[o + 14], 1); c.lineWidth = 1.5; c.strokeRect(-hw, -hh, hw * 2, hh * 2); }
      }
      c.restore();
    }
    var ts = this._texts || [];
    c.globalCompositeOperation = 'source-over'; c.textBaseline = 'middle';
    for (i = 0; i < ts.length; i++) {
      var t = ts[i];
      c.fillStyle = css(t.r, t.g, t.b, t.a); c.textAlign = t.align === 'left' ? 'left' : t.align === 'right' ? 'right' : 'center';
      c.font = '800 ' + (t.size * ppu) + 'px system-ui, sans-serif';
      c.fillText(t.str, X(t.x), Y(t.y));
    }
    this._texts = [];
  };

  FX.T = T;
  root.FX = FX;
})(window);
