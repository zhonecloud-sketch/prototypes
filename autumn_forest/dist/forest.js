/* Original procedural woodland for zhone. See ASSETS.md for prompts. */
(() => {
  'use strict';
  const canvas = document.getElementById('forest');
  const status = document.getElementById('status');
  const gl = canvas.getContext('webgl2', {alpha:false, antialias:false,
    powerPreference:'high-performance', preserveDrawingBuffer:false});
  if (!gl) {
    status.textContent = 'This forest needs WebGL 2. Please open it in a browser with hardware acceleration.';
    return;
  }
  let seed = 4217;
  const random = () => {seed = (Math.imul(seed,1664525)+1013904223)|0;
    return (seed>>>0)/4294967296;};
  const rand = (a,b) => a+(b-a)*random();
  const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
  const normalize = a => {const l = Math.hypot(...a)||1;return a.map(v=>v/l);};
  const cross = (a,b) => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const height = (x,z) => .16*Math.sin(x*.29+z*.13)+.1*Math.cos(z*.31)+Math.max(0,Math.abs(x)-5)*.035;
  const trail = z => 1.1*Math.sin(z*.065);
  function program(vs,fs) {
    function shader(type,source) {
      const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);
      if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));
      return s;
    }
    const p=gl.createProgram();gl.attachShader(p,shader(gl.VERTEX_SHADER,vs));
    gl.attachShader(p,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);
    if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));
    return p;
  }
  const fullVS=`#version 300 es
  precision highp float;
  out vec2 uv;
  void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);
    uv=p;gl_Position=vec4(p*2.-1.,0,1);}`;
  const skyFS=`#version 300 es
  precision highp float;
  in vec2 uv;out vec4 frag;
  uniform float aspect;
  void main(){vec2 d=(uv-vec2(.63,.71))*vec2(aspect,1.);
    float sun=exp(-length(d)*7.);vec3 c=mix(vec3(.70,.68,.48),vec3(.40,.56,.58),smoothstep(.2,1.,uv.y));
    c=mix(c,vec3(1.,.91,.63),sun*.8);c+=vec3(1.,.82,.46)*pow(sun,15.)*1.4;
    frag=vec4(c,1.);}`;
  const common=`
    uniform vec3 eye;uniform float haze;
    in vec3 world;in vec3 normal;in vec3 color;in float kind;
    out vec4 frag;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
      return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+1.),f.x),f.y);}
    vec3 atmosphere(vec3 c){float d=length(world-eye);
      float fog=1.-exp(-d*.016*haze);return mix(c,vec3(.80,.77,.59),fog);}
  `;
  const solidVS=`#version 300 es
    precision highp float;
    layout(location=0)in vec3 pos;layout(location=1)in vec3 norm;
    layout(location=2)in vec3 tint;layout(location=3)in float type;
    uniform mat4 vp;out vec3 world;out vec3 normal;out vec3 color;out float kind;
    void main(){world=pos;normal=norm;color=tint;kind=type;gl_Position=vp*vec4(pos,1.);}`;
  const solidFS=`#version 300 es
    precision highp float;
    ${common}
    void main(){vec3 n=normalize(normal);vec3 c=color;
      if(kind>1.5){
        float streak=noise(vec2(world.x*31.+world.z*29.,world.y*1.9));
        float scar=step(.76,noise(vec2(world.x*10.+world.z*12.,world.y*31.)));
        c*=.83+.17*streak;c=mix(c,vec3(.16,.18,.15),scar*.86);
        c*=.84+.16*sin(world.y*.7);
      }else if(kind>.5){
        float bark=noise(vec2((world.x+world.z)*52.,world.y*3.));
        c*=.55+bark*.65;
      }else{
        float soil=noise(world.xz*24.)*.45+noise(world.xz*5.)*.55;c*=.75+.5*soil;
        float path=1.-smoothstep(1.1,2.6,abs(world.x-1.1*sin(world.z*.065)));
        c=mix(c,vec3(.29,.235,.145)*(.8+soil*.4),path*.8);
        float dapple=smoothstep(.3,.72,noise(world.xz*.85));
        c*=.57+dapple*.85;
      }
      float light=max(0.,dot(n,normalize(vec3(-.45,.83,-.3))));
      c*=vec3(.53,.58,.47)+vec3(.73,.63,.43)*light;
      frag=vec4(atmosphere(c),1.);
    }`;
  const leafVS=`#version 300 es
    precision highp float;
    layout(location=0)in vec2 shape;
    layout(location=1)in vec4 centerSize;
    layout(location=2)in vec4 tintType;
    layout(location=3)in vec4 rotation;
    uniform mat4 vp;uniform float time;uniform float breeze;uniform float density;uniform float fallingOn;
    out vec3 world;out vec3 normal;out vec3 color;out float kind;out vec2 leafUV;
    void main(){vec3 center=centerSize.xyz;float falling=step(2.5,tintType.w);
      float t=time*(.22+breeze*.4);
      if(falling>.5&&fallingOn<.5){gl_Position=vec4(2,2,2,1);return;}
      if(falling>.5){center.y=mod(center.y-t*(.8+rotation.w*.08),13.)+.2;
        center.x+=sin(t*.7+rotation.w)*1.8;center.z+=cos(t*.4+rotation.w)*1.2;}
      float movement=step(.5,tintType.w);
      center.x+=sin(time*.85+center.z*.32+center.x*.23)*breeze*.22*movement;
      center.z+=cos(time*.7+center.x*.24)*breeze*.12*movement;
      float a=rotation.x+sin(time*1.5+rotation.w)*breeze*.3*movement+falling*t;
      float b=rotation.y+sin(time*1.2+rotation.w)*breeze*.24*movement;
      vec3 u=vec3(cos(a),0,sin(a));vec3 v=vec3(-sin(a)*sin(b),cos(b),cos(a)*sin(b));
      vec2 s=shape;
      if(tintType.w>1.5&&tintType.w<2.5&&length(s)>.01){s=normalize(s)*vec2(.48,.82);}
      world=center+(u*s.x+v*s.y)*centerSize.w/sqrt(density);
      world+=cross(u,v)*abs(s.x)*.11*centerSize.w;
      normal=normalize(cross(u,v));color=tintType.xyz;kind=tintType.w;
      leafUV=s;gl_Position=vp*vec4(world,1.);
    }`;
  const leafFS=`#version 300 es
    precision highp float;
    ${common}
    in vec2 leafUV;
    void main(){vec3 n=normalize(normal);float ndl=abs(dot(n,normalize(vec3(-.45,.83,-.3))));
      float vein=1.-smoothstep(.008,.024,abs(leafUV.x));
      float rib=1.-smoothstep(.015,.045,abs(fract(leafUV.y*5.-abs(leafUV.x)*3.)-.5));
      vec3 c=color*(.72+.4*ndl);
      c*=1.-vein*.17-rib*.055;
      c*=.9+.1*leafUV.y;
      float back=pow(max(0.,dot(normalize(world-eye),normalize(vec3(-.45,.83,-.3)))),3.);
      c+=color*back*.35;
      frag=vec4(atmosphere(c),1.);
    }`;
  const postFS=`#version 300 es
    precision highp float;
    in vec2 uv;out vec4 frag;
    uniform sampler2D scene;uniform sampler2D depths;
    uniform vec2 pixel;uniform float blurStrength;uniform float sunlight;uniform float aspect;uniform vec2 sunUV;
    float distanceAt(vec2 p){float z=texture(depths,p).r*2.-1.;return 32./(160.1-z*159.9);}
    void main(){float d=distanceAt(uv);
      float blur=smoothstep(13.,65.,d)*2.8*blurStrength;
      vec2 p=uv;
      vec3 c=texture(scene,p).rgb*.24;float weight=.24;
      for(int i=0;i<8;i++){float a=float(i)*.785398;
        vec2 q=p+vec2(cos(a),sin(a))*pixel*blur;
        float w=.095*mix(.06,1.,step(d*.65,distanceAt(q)));
        c+=texture(scene,q).rgb*w;weight+=w;}
      c/=weight;
      // Sparse depth samples let sunlight break through the canopy.
      vec2 ray=sunUV-uv;float shafts=0.;
      for(int i=1;i<=8;i++){
        vec2 q=uv+ray*(float(i)/8.)*.76;
        shafts+=smoothstep(45.,150.,distanceAt(q))*.125;
      }
      float glow=exp(-length(ray*vec2(aspect,1.))*2.1);
      c+=vec3(1.,.78,.39)*shafts*glow*.16*smoothstep(3.,30.,d);
      c*=sunlight;
      vec2 v=(uv-.5)*vec2(.85,1.);c*=1.-dot(v,v)*.23;
      c=pow(max(c,vec3(0)),vec3(.96));frag=vec4(c,1.);
    }`;
  try {
    const sky=program(fullVS,skyFS),solid=program(solidVS,solidFS);
    const leaf=program(leafVS,leafFS),post=program(fullVS,postFS);
    const loc=(p,n)=>gl.getUniformLocation(p,n);
    const uniforms=p=>Object.fromEntries(['vp','eye','time','breeze','aspect',
      'scene','depths','pixel','blurStrength','sunlight','sunUV','density','haze','fallingOn'].map(n=>[n,loc(p,n)]));
    const su=uniforms(solid),lu=uniforms(leaf),pu=uniforms(post),ku=uniforms(sky);
    const vertices=[],instances=[],distantInstances=[];
    const trees=[];let rejectedBranches=0;
    function vertex(p,n,c,k){vertices.push(...p,...n,...c,k);}
    function cylinder(a,b,r1,r2,c,k,sides=6){
      // Reserve a 3.6 m wide, 3.4 m tall strolling corridor.
      if(k>0){for(let t=0;t<=1;t+=.125){
        const p=a.map((v,i)=>v+(b[i]-v)*t);
        if(Math.abs(p[0]-trail(p[2]))<1.8+Math.max(r1,r2)&&p[1]<height(p[0],p[2])+3.4){rejectedBranches++;return;}
      }}
      const axis=normalize(b.map((v,i)=>v-a[i]));
      const u=normalize(cross(axis,Math.abs(axis[1])>.95?[1,0,0]:[0,1,0]));
      const v=cross(axis,u);
      for(let i=0;i<sides;i++){
        const normals=[i,i+1].map(j=>u.map((q,k)=>q*Math.cos(j/sides*Math.PI*2)+v[k]*Math.sin(j/sides*Math.PI*2)));
        const p=normals.map(n=>a.map((q,k)=>q+n[k]*r1));
        const q=normals.map(n=>b.map((v,k)=>v+n[k]*r2));
        for(const [point,n] of [[p[0],normals[0]],[p[1],normals[1]],[q[0],normals[0]],
          [p[1],normals[1]],[q[1],normals[1]],[q[0],normals[0]]])vertex(point,n,c,k);
      }
    }
    const mapleColors=[[.83,.31,.055],[.95,.46,.055],[.69,.19,.035],[.96,.61,.09],[.78,.39,.045]];
    const birchColors=[[.83,.68,.13],[.95,.75,.18],[.71,.58,.1],[.91,.62,.1]];
    function addLeaf(x,y,z,size,birch,fallen=false,ground=false){
      if(!ground&&!fallen&&Math.abs(x-trail(z))<2.2+size&&y<height(x,z)+3.8)return;
      const palette=birch?birchColors:mapleColors;
      const c=palette[Math.floor(random()*palette.length)];const variation=rand(.82,1.13);
      const target=z<-24?distantInstances:instances;
      target.push(x,y,z,size,...c.map(v=>v*variation),ground?0:fallen?3:birch?2:1,
        rand(0,6.28),ground?Math.PI/2:rand(-1.3,1.3),0,rand(0,20));
    }
    // Tapered branch hierarchies place leaf sprays at branch tips.
    function tree(x,z,h,birch){
      trees.push({x,z,height:h,birch});
      const base=height(x,z);const lean=rand(-1.15,1.15),bend=rand(-.65,.65);
      const c=birch?[.76,.76,.66]:[.27,.235,.17];
      const radius=h*(birch?rand(.010,.017):rand(.017,.029));
      const crown=rand(.7,1.4),crownStart=Math.max(3.8/h,rand(.34,.64));
      const points=[];
      for(let j=0;j<=5;j++)points.push([x+lean*(j/5)**1.6,base+h*j/5,z+bend*(j/5)**2]);
      for(let j=0;j<5;j++)cylinder(points[j],points[j+1],radius*(1-j*.18),radius*(1-(j+1)*.18),c,birch?2:1,8);
      const branches=Math.round(clamp(h*.9,7,birch?15:20));
      for(let j=0;j<branches;j++){
        const f=rand(Math.min(crownStart,.78),.96),angle=rand(0,Math.PI*2);
        const spread=(birch?2.3:3.5)*Math.sin(f*Math.PI)*h/12*crown*rand(.65,1.3);
        const start=[x+lean*f**1.6,base+h*f,z+bend*f*f];
        const tip=[start[0]+Math.cos(angle)*spread,start[1]+rand(.2,1.4)*h/12,start[2]+Math.sin(angle)*spread];
        cylinder(start,tip,radius*.26*(1-f+.2),.018,c,birch?2:1,5);
        for(let k=0;k<3;k++){
          const a=angle+(k-1)*.8;const end=[tip[0]+Math.cos(a)*rand(.5,1.3),tip[1]+rand(.3,1.5),tip[2]+Math.sin(a)*rand(.5,1.3)];
          cylinder(tip,end,.025,.006,c,birch?2:1,4);
          const count=Math.round(clamp(h,10,19));
          for(let n=0;n<count;n++){
            const theta=rand(0,6.28),r=Math.sqrt(random())*(birch?.85:1.15);
            addLeaf(end[0]+Math.cos(theta)*r,end[1]+rand(-.55,.55),end[2]+Math.sin(theta)*r,
              birch?rand(.14,.23):rand(.18,.30),birch);
          }
        }
      }
      for(let j=0;j<4;j++){
        const a=j*1.57;const end=[x+Math.cos(a)*radius*3,base+.015,z+Math.sin(a)*radius*3];
        cylinder([x,base+.3,z],end,radius*.45,.025,c,birch?2:1);
      }
    }
    for(let z=-130;z<65;z+=2){for(let x=-60;x<60;x+=2){
      const a=[x,height(x,z),z],b=[x+2,height(x+2,z),z],c=[x,height(x,z+2),z+2],d=[x+2,height(x+2,z+2),z+2];
      for(const p of [a,c,b,b,c,d])vertex(p,[0,1,0],[.30,.28,.12],0);
    }}
    // Uneven age groups, irregular spacing and asymmetric crowns.
    for(let i=0;i<8;i++){
      const z=5-Math.floor(i/2)*19,x=trail(z)+(i%2?1:-1)*rand(4.6,6.2);
      tree(x,z,[21,8,12,23,7,17,20,10][i],i%3===1);
    }
    for(let tries=0;trees.length<180&&tries<3000;tries++){
      const x=rand(-30,30),z=rand(-105,40);
      if(Math.abs(x-trail(z))<4.1||trees.some(t=>Math.hypot(x-t.x,z-t.z)<rand(2.1,3.4)))continue;
      const age=random(),h=age<.2?rand(4.8,8):age<.73?rand(9,15):rand(17,24);
      tree(x,z,h,random()<.45);
    }
    // The foreground is scattered with individually shaped fallen leaves.
    for(let i=0;i<8500;i++){
      const x=rand(-25,25),z=rand(-110,40);
      if(Math.abs(x-Math.sin(z*.065))<1.6&&random()<.78)continue;
      addLeaf(x,height(x,z)+rand(.025,.065),z,rand(.07,.17),random()<.35,false,true);
    }
    // Low grasses and small saplings break up the floor beside the trail.
    for(let i=0;i<620;i++){
      const x=rand(-22,22),z=rand(-100,35);
      if(Math.abs(x-trail(z))<3.1)continue;
      const y=height(x,z),c=[rand(.19,.31),rand(.23,.34),.09];
      for(let j=0;j<5;j++){
        const a=rand(0,6.28),h=rand(.12,.5),w=rand(.015,.04);
        const n=[Math.cos(a),.25,Math.sin(a)];
        vertex([x-w,y,z],n,c,0);vertex([x+w,y,z],n,c,0);
        vertex([x+Math.cos(a)*h*.4,y+h,z+Math.sin(a)*h*.4],n,c,0);
      }
      if(i%14===0){
        cylinder([x,y,z],[x+.12,y+.75,z],.019,.004,[.27,.24,.12],1,4);
        for(let j=0;j<12;j++)addLeaf(x+rand(-.35,.35),y+rand(.25,.85),z+rand(-.3,.3),rand(.09,.16),false);
      }
    }
    for(let i=0;i<170;i++)addLeaf(rand(-16,16),rand(1,14),rand(-90,30),rand(.07,.16),false,true);
    // Shuffle once so adaptive thinning remains distributed across the forest.
    for(const data of [instances,distantInstances])for(let i=data.length/12-1;i>0;i--){
      const j=Math.floor(random()*(i+1));
      for(let k=0;k<12;k++){const temp=data[i*12+k];data[i*12+k]=data[j*12+k];data[j*12+k]=temp;}
    }
    const solidVAO=gl.createVertexArray();gl.bindVertexArray(solidVAO);
    const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
    [3,3,3,1].forEach((size,i)=>{gl.enableVertexAttribArray(i);gl.vertexAttribPointer(i,size,gl.FLOAT,false,40,[0,12,24,36][i]);});
    const leafVAO=gl.createVertexArray();gl.bindVertexArray(leafVAO);
    const outline=[[0,-.7],[-.24,-.25],[-.65,-.32],[-.48,.02],[-.86,.28],[-.35,.3],[-.28,.65],[0,1.],[.28,.65],[.35,.3],[.86,.28],[.48,.02],[.65,-.32],[.24,-.25]];
    const shape=[];for(let i=0;i<outline.length;i++)shape.push(0,0,...outline[i],...outline[(i+1)%outline.length]);
    const sb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,sb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(shape),gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
    const ib=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,ib);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(instances),gl.STATIC_DRAW);
    for(let i=1;i<=3;i++){gl.enableVertexAttribArray(i);gl.vertexAttribPointer(i,4,gl.FLOAT,false,48,(i-1)*16);gl.vertexAttribDivisor(i,1);}
    const farVAO=gl.createVertexArray();gl.bindVertexArray(farVAO);
    const farShape=[0,-.7,-.6,.15,0,1.,0,-.7,0,1.,.6,.15];
    const fb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,fb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(farShape),gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
    const fi=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,fi);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(distantInstances),gl.STATIC_DRAW);
    for(let i=1;i<=3;i++){gl.enableVertexAttribArray(i);gl.vertexAttribPointer(i,4,gl.FLOAT,false,48,(i-1)*16);gl.vertexAttribDivisor(i,1);}
    gl.bindVertexArray(null);
    const allLeaves=new Float32Array(instances.concat(distantInstances));
    const nearData=new Float32Array(allLeaves.length),farData=new Float32Array(allLeaves.length);
    let nearTotal=instances.length/12,farTotal=distantInstances.length/12,lastLOD=Infinity;
    function updateFoliage(z){
      if(Math.abs(z-lastLOD)<8)return;
      let n=0,f=0;
      for(let i=0;i<allLeaves.length;i+=12){
        const near=Math.abs(allLeaves[i+2]-z)<34&&Math.abs(allLeaves[i])<24;
        const target=near?nearData:farData,offset=near?n:f;
        for(let k=0;k<12;k++)target[offset+k]=allLeaves[i+k];
        if(near)n+=12;else f+=12;
      }
      gl.bindBuffer(gl.ARRAY_BUFFER,ib);gl.bufferData(gl.ARRAY_BUFFER,nearData.subarray(0,n),gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER,fi);gl.bufferData(gl.ARRAY_BUFFER,farData.subarray(0,f),gl.DYNAMIC_DRAW);
      nearTotal=n/12;farTotal=f/12;lastLOD=z;
    }
    const frame=gl.createFramebuffer(),scene=gl.createTexture(),depth=gl.createTexture();
    let width=0,heightPx=0,quality=1,resizeNeeded=true;
    function texture(t,internal,format,type){gl.bindTexture(gl.TEXTURE_2D,t);
      gl.texImage2D(gl.TEXTURE_2D,0,internal,width,heightPx,0,format,type,null);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,t===depth?gl.NEAREST:gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,t===depth?gl.NEAREST:gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);}
    function resize(){
      const pixels=innerWidth*innerHeight;
      const ratio=Math.min(devicePixelRatio,1.6,Math.sqrt(1500000/pixels))*quality;
      width=Math.max(1,Math.round(innerWidth*ratio));heightPx=Math.max(1,Math.round(innerHeight*ratio));
      canvas.width=width;canvas.height=heightPx;
      texture(scene,gl.RGBA8,gl.RGBA,gl.UNSIGNED_BYTE);
      texture(depth,gl.DEPTH_COMPONENT24,gl.DEPTH_COMPONENT,gl.UNSIGNED_INT);
      gl.bindFramebuffer(gl.FRAMEBUFFER,frame);
      gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,scene,0);
      gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,depth,0);
      if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw new Error('Incomplete render target');
      resizeNeeded=false;
    }
    function matrix(eye,target,aspect){
      const z=normalize(eye.map((v,i)=>v-target[i]));const x=normalize(cross([0,1,0],z)),y=cross(z,x);
      const view=[x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,
        -x.reduce((s,v,i)=>s+v*eye[i],0),-y.reduce((s,v,i)=>s+v*eye[i],0),-z.reduce((s,v,i)=>s+v*eye[i],0),1];
      const f=1/Math.tan((aspect<1?65:57)*Math.PI/360),near=.1,far=160;
      const p=[f/aspect,0,0,0,0,f,0,0,0,0,(far+near)/(near-far),-1,0,0,2*far*near/(near-far),0];
      const out=new Float32Array(16);
      for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)out[c*4+r]+=p[k*4+r]*view[c*4+k];
      return out;
    }
    const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
    let yaw=0,pitch=.08,targetYaw=0,targetPitch=.08,paused=reducedMotion,walking=!reducedMotion;
    let time=0,last=0,breeze=.45,frames=0,sample=0,fps=60,raf=0;
    let pace=.85,sunlight=1,haze=1,blurStrength=1,fallingOn=true;
    let walkZ=10,direction=-1,turnRemaining=0,routeYaw=-.06,distance=0;
    let pointer=null,contextLost=false;
    const walk=document.getElementById('walk'),motion=document.getElementById('motion');
    function walkUI(){walk.textContent=walking?'Ⅱ Pause stroll':'▷ Resume stroll';walk.setAttribute('aria-pressed',String(walking));}
    walkUI();motion.checked=!paused;
    walk.onclick=()=>{walking=!walking;walkUI();};
    motion.onchange=()=>{paused=!motion.checked;};
    document.getElementById('leaves').onchange=e=>{fallingOn=e.target.checked;};
    const settings={pace:v=>pace=v,wind:v=>breeze=v,sunlight:v=>sunlight=v,haze:v=>haze=v,blur:v=>blurStrength=v};
    for(const [id,assign]of Object.entries(settings))document.getElementById(id).oninput=e=>{
      const v=Number(e.target.value);assign(v);
      document.getElementById(id+'-value').textContent=id==='pace'?v.toFixed(2)+' m/s':Math.round(v*100)+'%';
    };
    const drawer=document.getElementById('scene-controls'),settingsButton=document.getElementById('settings');
    function showSettings(open){drawer.hidden=!open;settingsButton.setAttribute('aria-expanded',String(open));
      if(open)document.getElementById('settings-close').focus();else settingsButton.focus();}
    settingsButton.onclick=()=>showSettings(drawer.hidden);
    document.getElementById('settings-close').onclick=()=>showSettings(false);
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!drawer.hidden)showSettings(false);});
    document.getElementById('recenter').onclick=()=>{targetYaw=0;targetPitch=.08;};
    document.getElementById('reset').onclick=()=>{
      for(const id of Object.keys(settings)){const input=document.getElementById(id);input.value=input.defaultValue;input.dispatchEvent(new Event('input'));}
      walkZ=10;direction=-1;turnRemaining=0;routeYaw=-.06;distance=0;targetYaw=yaw=0;targetPitch=pitch=.08;
      walking=!reducedMotion;paused=reducedMotion;motion.checked=!paused;fallingOn=true;
      document.getElementById('leaves').checked=true;walkUI();window.forestAudio.reset();
    };
    canvas.onpointerdown=e=>{pointer=[e.clientX,e.clientY];canvas.setPointerCapture(e.pointerId);};
    canvas.onpointermove=e=>{if(!pointer)return;
      targetYaw=clamp(targetYaw-(e.clientX-pointer[0])*.003,-Math.PI,Math.PI);
      targetPitch=clamp(targetPitch+(e.clientY-pointer[1])*.002,-.3,.6);pointer=[e.clientX,e.clientY];};
    canvas.onpointerup=canvas.onpointercancel=()=>{pointer=null;};
    canvas.onkeydown=e=>{if(!e.key.startsWith('Arrow'))return;e.preventDefault();
      if(e.key==='ArrowLeft')targetYaw-=.07;if(e.key==='ArrowRight')targetYaw+=.07;
      if(e.key==='ArrowUp')targetPitch+=.04;if(e.key==='ArrowDown')targetPitch-=.04;
      targetYaw=clamp(targetYaw,-Math.PI,Math.PI);targetPitch=clamp(targetPitch,-.3,.6);};
    const notes=document.getElementById('notes');
    document.getElementById('about').onclick=()=>{document.getElementById('metrics').textContent=
      `${Math.round(fps)} fps on this device · ${width} × ${heightPx} render resolution · adaptive quality`;notes.showModal();};
    document.getElementById('close').onclick=()=>notes.close();
    notes.onclick=e=>{if(e.target===notes){const r=notes.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)notes.close();}};
    window.addEventListener('resize',()=>{resizeNeeded=true;});
    document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(raf);last=0;sample=0;frames=0;if(!document.hidden&&!contextLost)raf=requestAnimationFrame(render);});
    canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();contextLost=true;cancelAnimationFrame(raf);status.hidden=false;status.textContent='The forest is resting. Restoring the view…';});
    canvas.addEventListener('webglcontextrestored',()=>location.reload());
    function render(now){
      const elapsed=last?(now-last)/1000:1/60;const dt=Math.min(elapsed,.1);last=now;
      if(!paused)time+=dt;
      yaw+=(targetYaw-yaw)*Math.min(1,dt*6);pitch+=(targetPitch-pitch)*Math.min(1,dt*6);
      if(resizeNeeded)resize();
      const aspect=width/heightPx;
      if(walking&&!notes.open){
        if(turnRemaining>0)turnRemaining=Math.max(0,turnRemaining-dt);
        else{
          const step=pace*dt/Math.sqrt(1+(.0715*Math.cos(walkZ*.065))**2);
          walkZ+=direction*step;distance+=pace*dt;
          if(walkZ<=-62||walkZ>=10){walkZ=clamp(walkZ,-62,10);direction*=-1;turnRemaining=6;}
        }
        const desired=Math.atan2((trail(walkZ+direction*.5)-trail(walkZ)),direction*-.5);
        const delta=Math.atan2(Math.sin(desired-routeYaw),Math.cos(desired-routeYaw));
        routeYaw+=delta*Math.min(1,dt*(turnRemaining>0?.9:2));
      }
      updateFoliage(walkZ);
      const x=trail(walkZ),heading=routeYaw+yaw;
      const eye=[x,height(x,walkZ)+1.72,walkZ];
      const target=[eye[0]+Math.sin(heading)*30,eye[1]+Math.sin(pitch)*30,eye[2]-Math.cos(heading)*30];
      const vp=matrix(eye,target,aspect);
      gl.bindFramebuffer(gl.FRAMEBUFFER,frame);gl.viewport(0,0,width,heightPx);
      gl.disable(gl.DEPTH_TEST);gl.depthMask(true);gl.clear(gl.DEPTH_BUFFER_BIT);
      gl.useProgram(sky);gl.uniform1f(ku.aspect,aspect);gl.bindVertexArray(null);gl.drawArrays(gl.TRIANGLES,0,3);
      gl.enable(gl.DEPTH_TEST);gl.useProgram(solid);gl.uniformMatrix4fv(su.vp,false,vp);gl.uniform3fv(su.eye,eye);
      gl.uniform1f(su.haze,haze);
      gl.bindVertexArray(solidVAO);gl.drawArrays(gl.TRIANGLES,0,vertices.length/10);
      gl.useProgram(leaf);gl.uniformMatrix4fv(lu.vp,false,vp);gl.uniform3fv(lu.eye,eye);
      gl.uniform1f(lu.haze,haze);gl.uniform1f(lu.fallingOn,fallingOn?1:0);
      const density=quality>.8?1:quality>.6?.72:.45;
      const nearCount=Math.floor(nearTotal*density),farCount=Math.floor(farTotal*density);
      gl.uniform1f(lu.time,time);gl.uniform1f(lu.breeze,breeze);gl.uniform1f(lu.density,density);gl.bindVertexArray(leafVAO);
      gl.drawArraysInstanced(gl.TRIANGLES,0,shape.length/2,nearCount);
      gl.bindVertexArray(farVAO);gl.drawArraysInstanced(gl.TRIANGLES,0,6,farCount);
      gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.disable(gl.DEPTH_TEST);gl.useProgram(post);gl.bindVertexArray(null);
      gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,scene);gl.uniform1i(pu.scene,0);
      gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,depth);gl.uniform1i(pu.depths,1);
      gl.uniform2f(pu.pixel,1/width,1/heightPx);gl.uniform1f(pu.blurStrength,blurStrength);gl.uniform1f(pu.sunlight,sunlight);gl.uniform1f(pu.aspect,aspect);
      gl.uniform2f(pu.sunUV,.68-Math.sin(heading)*.7,.82-pitch*.5);
      gl.drawArrays(gl.TRIANGLES,0,3);
      frames++;sample+=elapsed;
      if(sample>2){fps=frames/sample;
        if(fps<34&&quality>.5){quality=Math.max(.5,quality-.12);resizeNeeded=true;}
        else if(fps>56&&quality<1){quality=Math.min(1,quality+.025);resizeNeeded=true;}
        frames=0;sample=0;
      }
      window.forestStats={fps,width,height:heightPx,quality,leaves:nearCount+farCount,
        triangles:vertices.length/30+shape.length/6*nearCount+farCount*2,
        mode:'realistic',paused,time,drawCalls:5,walking,pace,walkZ,direction,turnRemaining,distance,eye,
        breeze,sunlight,haze,blurStrength,fallingOn,treeCount:trees.length,
        treeHeightRange:[Math.min(...trees.map(t=>t.height)),Math.max(...trees.map(t=>t.height))]};
      raf=requestAnimationFrame(render);
    }
    let minBranchClearance=Infinity;
    for(let i=0;i<vertices.length;i+=10){
      if(vertices[i+9]>.5&&Math.abs(vertices[i]-trail(vertices[i+2]))<1.8)
        minBranchClearance=Math.min(minBranchClearance,vertices[i+1]-height(vertices[i],vertices[i+2]));
    }
    window.forestGeometry={trees,rejectedBranches,corridorWidth:3.6,corridorHeight:3.4,minBranchClearance};
    status.hidden=true;raf=requestAnimationFrame(render);
  } catch(error) {
    console.error(error);status.textContent='The forest could not start: '+error.message;
  }
})();
