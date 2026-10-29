import * as T from './vendor/three.module.min.js';
const host=document.querySelector('#scene');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
try{
const renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setClearColor(0xffffff,0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;host.appendChild(renderer.domElement);
const scene=new T.Scene(), camera=new T.PerspectiveCamera(37,1,.1,100);
scene.add(new T.HemisphereLight(0xffe8d6,0x574538,3.2));
const key=new T.DirectionalLight(0xffffff,5);key.position.set(-5,12,8);scene.add(key);
const rim=new T.DirectionalLight(0xdd9e70,4);rim.position.set(7,6,-4);scene.add(rim);
const front=new T.DirectionalLight(0xffd7ad,1.5);front.position.set(0,5,12);scene.add(front);
const marble=new T.MeshStandardMaterial({color:0xd5b08d,roughness:.27,metalness:.17});
const detail=new T.MeshStandardMaterial({color:0xe6c5a2,roughness:.22,metalness:.4});
const blue=new T.MeshStandardMaterial({color:0xbd8055,roughness:.22,metalness:.55,emissive:0x402011,emissiveIntensity:.16});
function mesh(g,m,parent,x=0,y=0,z=0){const o=new T.Mesh(g,m);o.position.set(x,y,z);parent.add(o);return o;}
function slab(w,h,d,y,g){const s=new T.Shape();const r=.05;const x=-w/2,z=-d/2;s.moveTo(x+r,z);s.lineTo(x+w-r,z);s.quadraticCurveTo(x+w,z,x+w,z+r);s.lineTo(x+w,z+d-r);s.quadraticCurveTo(x+w,z+d,x+w-r,z+d);s.lineTo(x+r,z+d);s.quadraticCurveTo(x,z+d,x,z+d-r);s.lineTo(x,z+r);s.quadraticCurveTo(x,z,x+r,z);const geo=new T.ExtrudeGeometry(s,{depth:h,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.025,bevelThickness:.025});geo.rotateX(-Math.PI/2);return mesh(geo,marble,g,0,y,0);}
function lathe(points,parent,mat=marble){return mesh(new T.LatheGeometry(points.map(p=>new T.Vector2(...p)),80),mat,parent);}
function column(){const g=new T.Group();slab(1.85,.19,1.85,.04,g);slab(1.65,.14,1.65,.27,g);lathe([[.01,.41],[.8,.41],[.83,.46],[.8,.52],[.67,.56],[.69,.64],[.72,.69],[.69,.75],[.59,.81],[.58,.9]],g);
const positions=[],uv=[],indices=[],segments=240,rows=28;
for(let j=0;j<=rows;j++){const h=j/rows;for(let i=0;i<=segments;i++){const a=i/segments*Math.PI*2;const radius=.575-.065*h+.026*Math.sin(h*Math.PI)-.04*(.5+.5*Math.cos(a*24));positions.push(Math.cos(a)*radius,.87+h*5.6,Math.sin(a)*radius);uv.push(i/segments,h);if(j<rows&&i<segments){const k=j*(segments+1)+i;indices.push(k,k+segments+1,k+1,k+1,k+segments+1,k+segments+2);}}}
const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();mesh(geo,marble,g);
lathe([[.5,6.45],[.55,6.45],[.58,6.49],[.58,6.57],[.54,6.6],[.56,6.68],[.67,6.76],[.75,6.86],[.76,6.96]],g);
slab(1.65,.14,1.28,6.96,g);slab(1.9,.17,1.5,7.19,g);
for(const side of [-1,1]){for(const z of [-.64,.64]){const pts=[];for(let i=0;i<100;i++){const t=i/99;const a=t*Math.PI*4.4;const radius=.29*(1-t)+.035;pts.push(new T.Vector3(side*.65+Math.cos(a)*radius,6.95+Math.sin(a)*radius,z));}mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),100,.07,10,false),marble,g);}}
for(let i=0;i<11;i++){mesh(new T.SphereGeometry(.035,10,8),detail,g,(i-5)*.105,6.62,.55);}
const accent=mesh(new T.TorusGeometry(.72,.015,8,100),blue,g,0,.7,0);accent.rotation.x=Math.PI/2;
return g;}
const left=column(),right=column();scene.add(left,right);left.rotation.y=.17;right.rotation.y=-.17;
const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=128;const ctx=shadowCanvas.getContext('2d');const grad=ctx.createRadialGradient(64,64,0,64,64,64);grad.addColorStop(0,'rgba(0,0,0,.45)');grad.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=grad;ctx.fillRect(0,0,128,128);const shadowTexture=new T.CanvasTexture(shadowCanvas);
const shadows=[];for(const x of [-5.1,5.1]){const shadow=mesh(new T.PlaneGeometry(4,4),new T.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false}),scene,x,0,0);shadow.rotation.x=-Math.PI/2;shadows.push(shadow);}
const orbit=new T.Group();scene.add(orbit);const halo=mesh(new T.TorusGeometry(3.5,.012,8,180),new T.MeshBasicMaterial({color:0xc58f67,transparent:true,opacity:.28}),orbit,0,3.9,-2.6);halo.rotation.y=.18;
const particles=new T.BufferGeometry();const dots=[];for(let i=0;i<35;i++)dots.push(Math.sin(i*82.3)*9,Math.cos(i*21.7)*5+4,-3-Math.abs(Math.sin(i*12.3))*3);particles.setAttribute('position',new T.Float32BufferAttribute(dots,3));const sparkle=new T.Points(particles,new T.PointsMaterial({color:0xcba279,size:.025,transparent:true,opacity:.65}));scene.add(sparkle);
let w=0,h=0,p=0,targetX=0,targetY=0,mouseX=0,mouseY=0,visible=true;
function size(){w=host.clientWidth;h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}size();addEventListener('resize',size);
addEventListener('pointermove',e=>{targetX=(e.clientX/innerWidth-.5)*.36;targetY=(e.clientY/innerHeight-.5)*.15;},{passive:true});
const start=performance.now();let raf;const observation=new IntersectionObserver(e=>{visible=e[0].isIntersecting;if(visible&&!raf)draw(performance.now());});observation.observe(host);
function draw(now){raf=null;if(!visible||document.hidden)return;const mobile=w<700;const elapsed=(now-start)/1000;const enter=reduced.matches?1:1-Math.pow(1-Math.min(elapsed/2.6,1),4);p=reduced.matches?0:Number(document.documentElement.style.getPropertyValue('--progress')||0);mouseX+=(targetX-mouseX)*.035;mouseY+=(targetY-mouseY)*.035;const offset=mobile?3.25:5.15;left.position.set(-offset-p*2,0,p*.7);right.position.set(offset+p*2,0,p*.7);shadows[0].position.x=left.position.x;shadows[1].position.x=right.position.x;camera.position.set(reduced.matches?0:mouseX,4.3+(1-enter)*1.8+(reduced.matches?0:mouseY),(mobile?25:16.5)-(1-enter)*5-p*3);camera.lookAt(0,3.7,-.4);orbit.rotation.z=reduced.matches?0:Math.sin(elapsed*.15)*.035;sparkle.rotation.y=reduced.matches?0:elapsed*.012;renderer.render(scene,camera);raf=requestAnimationFrame(draw);}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!raf)draw(performance.now());});draw(start);document.documentElement.classList.add('webgl-ready');
renderer.domElement.addEventListener('webglcontextlost',()=>{document.documentElement.classList.remove('webgl-ready');cancelAnimationFrame(raf);});
}catch(e){console.warn('Cena 3D indisponível; exibindo composição alternativa.');}
