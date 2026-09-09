'use client';
import {useEffect,useRef,type RefObject} from 'react';
import type * as Three from 'three';
export type RenderState={ready:boolean;error:boolean;progress:number;objects:number;triangles:number};
type Props={progress:RefObject<number>;onReady:()=>void;onStage:(s:string)=>void;onError:()=>void;state?:RefObject<RenderState>};
export default function Cosmos({progress,onReady,onStage,onError,state}:Props){
 const mount=useRef<HTMLDivElement>(null),callbacks=useRef({onReady,onStage,onError});callbacks.current={onReady,onStage,onError};
 useEffect(()=>{let disposed=false,frame=0;let renderer:Three.WebGLRenderer|undefined;const cleanup:Array<()=>void>=[];
 const fail=()=>{if(disposed)return;if(state)state.current.error=true;callbacks.current.onError()};
 async function init(){try{
 const T=await import('three');if(disposed)return;const host=mount.current!;
 renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});const r=renderer;
 const mobile=()=>innerWidth<761;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 r.setPixelRatio(Math.min(devicePixelRatio,mobile()?1.3:1.6));r.setSize(innerWidth,innerHeight);r.setClearColor('#03060d');r.outputColorSpace=T.SRGBColorSpace;r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=1.12;host.appendChild(r.domElement);
 const lost=(event:Event)=>{event.preventDefault();fail()};r.domElement.addEventListener('webglcontextlost',lost);cleanup.push(()=>r.domElement.removeEventListener('webglcontextlost',lost));
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(43,innerWidth/innerHeight,.08,950);
 scene.add(new T.AmbientLight('#9badcb',.22));const sun=new T.DirectionalLight('#ffe5c7',3.4);sun.position.set(-40,30,50);scene.add(sun);const rim=new T.DirectionalLight('#4268a8',.5);rim.position.set(35,-8,-30);scene.add(rim);
 callbacks.current.onStage('Bringing the worlds into focus');
 const loader=new T.TextureLoader();const textures=await Promise.all(['earth','moon','saturn'].map(n=>loader.loadAsync('/space/'+n+'.jpg')));if(disposed){textures.forEach(t=>t.dispose());return}textures.forEach(t=>{t.colorSpace=T.SRGBColorSpace;t.anisotropy=Math.min(r.capabilities.getMaxAnisotropy(),8)});cleanup.push(()=>textures.forEach(t=>t.dispose()));
 let seed=42;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646};
 const sphere=new T.SphereGeometry(1,96,64);const material=(map:Three.Texture)=>new T.MeshStandardMaterial({map,roughness:.97});
 const earth=new T.Mesh(sphere,material(textures[0]));earth.scale.setScalar(4.25);earth.position.set(4.4,.8,0);earth.rotation.z=.15;scene.add(earth);
 const moon=new T.Mesh(sphere,new T.MeshStandardMaterial({map:textures[1],bumpMap:textures[1],bumpScale:.027,roughness:1}));moon.scale.setScalar(2.8);moon.position.set(3.8,1,-28);scene.add(moon);
 const saturnGroup=new T.Group();saturnGroup.position.set(0,2,-115);saturnGroup.rotation.set(.13,0,.3);scene.add(saturnGroup);
 const saturn=new T.Mesh(sphere,material(textures[2]));saturn.scale.set(6.6,6,6.6);saturnGroup.add(saturn);
 const atmosphere=(radius:number,color:string,position:Three.Vector3)=>{const m=new T.ShaderMaterial({uniforms:{glowColor:{value:new T.Color(color)}},vertexShader:'varying vec3 vNormal; varying vec3 vPosition; void main(){vNormal=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.0);vPosition=mv.xyz;gl_Position=projectionMatrix*mv;}',fragmentShader:'uniform vec3 glowColor;varying vec3 vNormal;varying vec3 vPosition;void main(){float intensity=pow(1.0-abs(dot(normalize(vNormal),normalize(-vPosition))),3.5);gl_FragColor=vec4(glowColor,intensity*.7);}',side:T.FrontSide,transparent:true,depthWrite:false,blending:T.AdditiveBlending});const shell=new T.Mesh(sphere,m);shell.scale.setScalar(radius);shell.position.copy(position);scene.add(shell);return shell};
 atmosphere(4.34,'#2b87e8',earth.position);atmosphere(6.74,'#c49c6a',saturnGroup.position);
 // Radial particles and bands form a real annular mesh. The shader calculates Saturn's shadow.
 const ringGeometry=new T.RingGeometry(8.2,15.9,256,4);ringGeometry.rotateX(-Math.PI/2);
 const ringMaterial=new T.ShaderMaterial({uniforms:{innerRadius:{value:8.2},outerRadius:{value:15.9}},vertexShader:'varying vec3 localPosition;void main(){localPosition=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'varying vec3 localPosition;uniform float innerRadius;uniform float outerRadius;void main(){float radius=length(localPosition.xz);float q=(radius-innerRadius)/(outerRadius-innerRadius);float bands=.64+.16*sin(radius*48.0)+.10*sin(radius*117.0)+.065*sin(radius*293.0);float gap=1.0-smoothstep(12.05,12.15,radius)*(1.0-smoothstep(12.7,12.8,radius));float innerFade=smoothstep(8.2,8.6,radius);float outerFade=1.0-smoothstep(15.4,15.9,radius);vec3 color=mix(vec3(.42,.33,.25),vec3(.90,.80,.62),smoothstep(.0,.35,q));color=mix(color,vec3(.56,.47,.37),smoothstep(.67,1.0,q));vec3 light=normalize(vec3(-.65,.7,.6));float b=dot(localPosition,light);float disc=b*b-dot(localPosition,localPosition)+40.0;float shadow=disc>0.0&&b<0.0?.19:1.0;gl_FragColor=vec4(color*bands*shadow*1.25,bands*gap*innerFade*outerFade*.88);}',side:T.DoubleSide,transparent:true,depthWrite:false});
 const rings=new T.Mesh(ringGeometry,ringMaterial);saturnGroup.add(rings);
 const starPositions=[],starColors=[];for(let i=0;i<2400;i++){const a=random()*Math.PI*2,z=random()*2-1,rad=180+random()*240;starPositions.push(Math.sqrt(1-z*z)*Math.cos(a)*rad,z*rad,Math.sqrt(1-z*z)*Math.sin(a)*rad-70);const c=new T.Color().setHSL(.09+random()*.55,.15,.45+random()*.5);starColors.push(c.r,c.g,c.b)}
 const starsGeometry=new T.BufferGeometry();starsGeometry.setAttribute('position',new T.Float32BufferAttribute(starPositions,3));starsGeometry.setAttribute('color',new T.Float32BufferAttribute(starColors,3));const stars=new T.Points(starsGeometry,new T.PointsMaterial({size:.22,sizeAttenuation:true,vertexColors:true,transparent:true,opacity:.9}));scene.add(stars);
 // Shared, irregular geometry keeps the drift field inexpensive even on a phone.
 const rockGeometry=new T.IcosahedronGeometry(1,2);const attr=rockGeometry.attributes.position;for(let i=0;i<attr.count;i++){const x=attr.getX(i),y=attr.getY(i),z=attr.getZ(i);const n=1+.15*Math.sin(x*8+y*5)*Math.cos(z*7+x*3);attr.setXYZ(i,x*n,y*n,z*n)}rockGeometry.computeVertexNormals();const rockMaterial=new T.MeshStandardMaterial({map:textures[1],color:'#938e87',roughness:1});
 const rockCount=mobile()?130:210,rocks=new T.InstancedMesh(rockGeometry,rockMaterial,rockCount),dummy=new T.Object3D();const rockData:Array<{x:number;y:number;z:number;s:number;rx:number;ry:number}>=[];
 for(let i=0;i<rockCount;i++){const a=random()*Math.PI*2,rad=4+random()*17;rockData.push({x:Math.cos(a)*rad,y:Math.sin(a)*rad*.55,z:-41-random()*42,s:.12+Math.pow(random(),3)*1.4,rx:random()*6,ry:random()*6})}scene.add(rocks);
 const iceCount=mobile()?420:850,ice=new T.InstancedMesh(rockGeometry,new T.MeshStandardMaterial({color:'#a69476',roughness:.85}),iceCount);
 for(let i=0;i<iceCount;i++){const a=random()*Math.PI*2,rad=8.5+random()*7;dummy.position.set(Math.cos(a)*rad,(random()-.5)*.13,Math.sin(a)*rad);dummy.rotation.set(random()*3,random()*3,random()*3);dummy.scale.setScalar(.016+random()*.055);dummy.updateMatrix();ice.setMatrixAt(i,dummy.matrix)}saturnGroup.add(ice);
 // A piecewise smooth flight has room to linger at each world and stays out of the geometry.
 const stops=[
 {p:0,c:[0,1.8,16],t:[.3,.8,0]},
 {p:.17,c:[10,3.3,10],t:[1.3,.7,0]},
 {p:.26,c:[.5,2,-7],t:[.4,.5,-28]},
 {p:.34,c:[-1,2.6,-17],t:[.8,.7,-28]},
 {p:.44,c:[0,1,-36],t:[.8,0,-61]},
 {p:.52,c:[-1,1.8,-55],t:[0,1,-89]},
 {p:.60,c:[0,5,-77],t:[-4,2,-115]},
 {p:.69,c:[1,8,-86],t:[-5,2,-115]},
 {p:.79,c:[12,8,-95],t:[-2,2,-115]},
 {p:.87,c:[14,2,-111],t:[0,3,-116]},
 {p:.94,c:[10,7,-136],t:[-1,1,-115]},
 {p:1,c:[0,14,-153],t:[5,2,-115]},
 ];
 const position=new T.Vector3(),look=new T.Vector3(),pointer=new T.Vector2();const mouse=(e:PointerEvent)=>{pointer.set(e.clientX/innerWidth-.5,e.clientY/innerHeight-.5)};addEventListener('pointermove',mouse,{passive:true});cleanup.push(()=>removeEventListener('pointermove',mouse));
 const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.fov=mobile()?52:43;camera.updateProjectionMatrix();r.setSize(innerWidth,innerHeight)};addEventListener('resize',resize);cleanup.push(()=>removeEventListener('resize',resize));resize();
 let smoothP=Number.isFinite(progress.current)?progress.current:0,previous=performance.now(),elapsed=0,first=true;
 const animate=(now:number)=>{if(disposed)return;const dt=Math.min((now-previous)/1000,.05);previous=now;if(!document.hidden){elapsed+=reduced.matches?0:dt;smoothP=reduced.matches?progress.current:T.MathUtils.damp(smoothP,progress.current,5,dt);if(Math.abs(smoothP-progress.current)<.00015)smoothP=progress.current;let k=0;while(k<stops.length-2&&smoothP>stops[k+1].p)k++;const a=stops[k],b=stops[k+1];let q=T.MathUtils.clamp((smoothP-a.p)/(b.p-a.p),0,1);q=q*q*(3-2*q);position.set(...a.c as [number,number,number]).lerp(new T.Vector3(...b.c as [number,number,number]),q);look.set(...a.t as [number,number,number]).lerp(new T.Vector3(...b.t as [number,number,number]),q);if(mobile()){look.y-=3.3;position.z+=(smoothP<.4?3:0)}else if(!reduced.matches){position.x+=pointer.x*.32;position.y-=pointer.y*.2}camera.position.copy(position);camera.lookAt(look);
 earth.rotation.y=.35+elapsed*.016+smoothP*1.3;moon.rotation.y=.9+elapsed*.008;saturn.rotation.y=elapsed*.01;
 rockData.forEach((d,i)=>{dummy.position.set(d.x,d.y+Math.sin(elapsed*.1+i)*.13,d.z);dummy.rotation.set(d.rx+elapsed*.023,d.ry+elapsed*.017,0);dummy.scale.set(d.s,d.s*.76,d.s*.93);dummy.updateMatrix();rocks.setMatrixAt(i,dummy.matrix)});rocks.instanceMatrix.needsUpdate=true;
 r.render(scene,camera);if(state)state.current={ready:true,error:false,progress:smoothP,objects:r.info.render.calls,triangles:r.info.render.triangles};if(first){first=false;callbacks.current.onReady()}}
 frame=requestAnimationFrame(animate)};
 callbacks.current.onStage('Opening the flight path');await r.compileAsync(scene,camera);if(!disposed)frame=requestAnimationFrame(animate);
 cleanup.push(()=>{scene.traverse(o=>{if(o instanceof T.Mesh||o instanceof T.Points){o.geometry.dispose();const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>m.dispose())}})});
 }catch(e){console.error('Unable to initialize space journey',e);fail()}}void init();return()=>{disposed=true;cancelAnimationFrame(frame);cleanup.forEach(fn=>fn());renderer?.dispose();mount.current?.replaceChildren()};
 },[progress,state]);return <div ref={mount} style={{position:'absolute',inset:0}} aria-label="A three-dimensional voyage from Earth, past the Moon, through asteroids and Saturn’s rings" role="img"/>
}
