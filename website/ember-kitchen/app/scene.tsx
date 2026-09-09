'use client';
import { useEffect, useRef, type MutableRefObject } from 'react';
import type * as Three from 'three';
type Props={progress:MutableRefObject<number>;paused:MutableRefObject<boolean>;onReady:()=>void;onError:()=>void};
export default function BurgerScene({progress,paused,onReady,onError}:Props){
 const mount=useRef<HTMLDivElement>(null), callbacks=useRef({onReady,onError});callbacks.current={onReady,onError};
 useEffect(()=>{
  let disposed=false,renderer:Three.WebGLRenderer|undefined,raf=0,cleanup=()=>{};
  (async()=>{
   const T=await import('three');const {GLTFLoader}=await import('three/addons/loaders/GLTFLoader.js');const {RoomEnvironment}=await import('three/addons/environments/RoomEnvironment.js');const {RoundedBoxGeometry}=await import('three/addons/geometries/RoundedBoxGeometry.js');
   if(disposed||!mount.current)return;const host=mount.current;
   renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.setClearColor(0x000000,0);renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;host.appendChild(renderer.domElement);
   const scene=new T.Scene(),camera=new T.PerspectiveCamera(34,1,.1,80);camera.position.set(0,.4,9);
   const pmrem=new T.PMREMGenerator(renderer),room=new RoomEnvironment();const env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();pmrem.dispose();
   scene.add(new T.HemisphereLight(0xfff5dc,0x783316,2));const key=new T.DirectionalLight(0xffe0ae,3.0);key.position.set(-3,6,5);scene.add(key);const rim=new T.DirectionalLight(0xffffff,2.4);rim.position.set(4,2,-2);scene.add(rim);
   const burger=new T.Group();scene.add(burger);
   const gltf=await new GLTFLoader().loadAsync('/models/ember-burger.glb');if(disposed){gltf.scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();}});return;}
   gltf.scene.updateMatrixWorld(true);let source:Three.Mesh|undefined;gltf.scene.traverse(o=>{if(o instanceof T.Mesh&&!source)source=o;});if(!source)throw new Error('Burger geometry missing');
   const geometry=source.geometry.clone().applyMatrix4(source.matrixWorld);geometry.computeBoundingBox();const box=geometry.boundingBox!,center=box.getCenter(new T.Vector3()),size=box.getSize(new T.Vector3());geometry.translate(-center.x,-center.y,-center.z);geometry.scale(2.65/size.x,2.65/size.x,2.65/size.x);geometry.computeBoundingBox();
   const raw=geometry.toNonIndexed(),positions=raw.getAttribute('position'),normals=raw.getAttribute('normal'),uv=raw.getAttribute('uv'),bounds=geometry.boundingBox!,height=bounds.max.y-bounds.min.y;
   const cuts=[.13,.35,.56,.71],groups=Array.from({length:5},()=>({p:[] as number[],n:[] as number[],uv:[] as number[]}));
   for(let i=0;i<positions.count;i+=3){const cy=(positions.getY(i)+positions.getY(i+1)+positions.getY(i+2))/3;const fraction=(cy-bounds.min.y)/height;let k=cuts.findIndex(c=>fraction<c);if(k===-1)k=4;for(let v=i;v<i+3;v++){groups[k].p.push(positions.getX(v),positions.getY(v),positions.getZ(v));groups[k].n.push(normals.getX(v),normals.getY(v),normals.getZ(v));groups[k].uv.push(uv.getX(v),uv.getY(v));}}
   const material=(source.material as Three.MeshStandardMaterial).clone();material.roughness=.66;material.envMapIntensity=.42;material.side=T.DoubleSide;if(material.map)material.map.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
   const parts=groups.map(g=>{const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(g.p,3));geo.setAttribute('normal',new T.Float32BufferAttribute(g.n,3));geo.setAttribute('uv',new T.Float32BufferAttribute(g.uv,2));geo.computeBoundingSphere();const mesh=new T.Mesh(geo,material);burger.add(mesh);return mesh});geometry.dispose();raw.dispose();
   // A second scroll act: a cascade of golden fries and a chilled glass of cola.
   const sides=new T.Group();scene.add(sides);
   const noise=new Uint8Array(64*64*4);for(let i=0;i<64*64;i++){const n=((i*1664525+1013904223)>>>8)%255;noise[i*4]=224+n*.12;noise[i*4+1]=145+n*.24;noise[i*4+2]=43+n*.19;noise[i*4+3]=255;}const fryTexture=new T.DataTexture(noise,64,64,T.RGBAFormat);fryTexture.colorSpace=T.SRGBColorSpace;fryTexture.wrapS=fryTexture.wrapT=T.RepeatWrapping;fryTexture.needsUpdate=true;
   const fryGeometry=new RoundedBoxGeometry(.13,.92,.13,3,.025),fryMaterial=new T.MeshStandardMaterial({map:fryTexture,roughness:.72,color:0xffdd80,bumpMap:fryTexture,bumpScale:.012});const fries=new T.InstancedMesh(fryGeometry,fryMaterial,28);sides.add(fries);
   const glass=new T.Group();sides.add(glass);const glassMaterial=new T.MeshPhysicalMaterial({color:0xf9f5e9,roughness:.07,metalness:.03,transparent:true,opacity:.20,side:T.DoubleSide,envMapIntensity:1.8,clearcoat:1});
   const glassShape=[new T.Vector2(.32,0),new T.Vector2(.33,.08),new T.Vector2(.39,1.62),new T.Vector2(.40,1.66)];const vessel=new T.Mesh(new T.LatheGeometry(glassShape,48),glassMaterial);glass.add(vessel);
   const rimMesh=new T.Mesh(new T.TorusGeometry(.40,.015,8,48),glassMaterial);rimMesh.rotation.x=Math.PI/2;rimMesh.position.y=1.66;glass.add(rimMesh);
   const base=new T.Mesh(new T.CylinderGeometry(.33,.32,.07,48),glassMaterial);base.position.y=.035;glass.add(base);
   const colaMaterial=new T.MeshPhysicalMaterial({color:0x2e1004,roughness:.13,metalness:.05,clearcoat:1,clearcoatRoughness:.1});const cola=new T.Mesh(new T.CylinderGeometry(.364,.307,1.34,48),colaMaterial);cola.position.y=.76;glass.add(cola);
   const iceMaterial=new T.MeshPhysicalMaterial({color:0xd9eeed,roughness:.17,metalness:.05,transparent:true,opacity:.60,clearcoat:1,envMapIntensity:1.4});const iceGeometry=new RoundedBoxGeometry(.28,.24,.27,3,.035);const ice:Three.Mesh[]=[];for(let i=0;i<6;i++){const cube=new T.Mesh(iceGeometry,iceMaterial);const a=i*2.4;cube.position.set(Math.cos(a)*.20,1.36+(i%2)*.13,Math.sin(a)*.20);cube.rotation.set(i*.3,i*.7,i*.2);glass.add(cube);ice.push(cube);}
   const strawMaterial=new T.MeshStandardMaterial({color:0xe96531,roughness:.48});const straw=new T.Mesh(new T.CylinderGeometry(.026,.026,1.9,12),strawMaterial);straw.position.set(.21,1.45,-.04);straw.rotation.z=-.12;glass.add(straw);
   const droplets=new T.InstancedMesh(new T.SphereGeometry(1,6,5),new T.MeshPhysicalMaterial({color:0xecf5f4,roughness:.05,transparent:true,opacity:.5,clearcoat:1}),95);glass.add(droplets);const dropDummy=new T.Object3D();for(let i=0;i<95;i++){const a=i*2.39996,y=.15+((i*31)%93)/93*1.38,r=.331+y*.043;dropDummy.position.set(Math.cos(a)*r,y,Math.sin(a)*r);const size=.009+(i%4)*.004;dropDummy.scale.set(size,size*1.3,size);dropDummy.updateMatrix();droplets.setMatrixAt(i,dropDummy.matrix);}
   const bubbles=new T.InstancedMesh(new T.SphereGeometry(.007,5,4),new T.MeshStandardMaterial({color:0x9c662a,roughness:.15,transparent:true,opacity:.7}),45);glass.add(bubbles);
   // Tiny sesame crumbs orbit around the food, adding depth without obscuring it.
   const crumbs=new T.InstancedMesh(new T.SphereGeometry(1,6,4),new T.MeshStandardMaterial({color:0xe8be78,roughness:.85}),42);scene.add(crumbs);const dummy=new T.Object3D();
   const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let targetX=0,targetY=0,px=0,py=0,smoothed=progress.current,t=0,last=performance.now(),first=true;
   function pointer(e:PointerEvent){targetX=(e.clientX/innerWidth-.5)*2;targetY=(e.clientY/innerHeight-.5)*2;}
   window.addEventListener('pointermove',pointer,{passive:true});
   const resize=()=>{if(!renderer)return;const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix()};const ro=new ResizeObserver(resize);ro.observe(host);resize();
   function render(now:number){if(disposed||!renderer)return;raf=requestAnimationFrame(render);const dt=Math.min((now-last)/1000,.04);last=now;const mobile=host.clientWidth<760;
    if(!paused.current&&!reduced)t+=dt;smoothed+=(progress.current-smoothed)*(reduced?1:1-Math.exp(-dt*9));const p=smoothed;
    const smooth=(a:number,b:number,x:number)=>{const v=T.MathUtils.clamp((x-a)/(b-a),0,1);return v*v*(3-2*v)};
    const explode=smooth(.15,.38,p)*(1-smooth(.61,.82,p));const meal=smooth(.78,.97,p);
    px+=(targetX-px)*.035;py+=(targetY-py)*.035;
    burger.position.set(mobile?-.28*meal:1.05+explode*.12-.32*meal,mobile?-1.0:-.12*meal,0);burger.rotation.set(.06+(reduced?0:py*.04),-.35+p*.7+(reduced?0:px*.13+Math.sin(t*.35)*.07),-.10+explode*.10);
    const fit=mobile?Math.min(1,host.clientWidth/390)*.76:Math.min(1.15,host.clientWidth/1250);burger.scale.setScalar(fit*(1-explode*(mobile?.30:.16))*(1-meal*.25));burger.position.y+=(reduced?0:Math.sin(t*.8)*.035);
    parts.forEach((part,i)=>{part.position.y=(i-2)*explode*.60;part.position.x=Math.sin(i*1.2)*explode*.10;part.rotation.y=(i-2)*explode*.13;part.rotation.z=Math.sin(i*1.8)*explode*.045;});
    sides.visible=p>.78;sides.scale.setScalar(fit*(mobile?.78:1));sides.position.set(mobile?0:0,mobile?-.74:0,0);
    glass.position.set(mobile?.95:2.35,-1.05-(1-meal)*3.6,-.5);glass.rotation.z=-.10*(1-meal);glass.rotation.y=.15;
    for(let i=0;i<28;i++){const arrive=smooth(.79+i*.004,.90+i*.003,p),a=i*2.39996;const fx=(mobile?.45:1.55)+Math.cos(a)*(.28+(i%5)*.065),fy=-1.04+(i%6)*.065;dummy.position.set(fx+Math.sin(a)*(1-arrive)*.75,fy+(1-arrive)*4.8,.68+Math.sin(a)*.37);dummy.rotation.set(1.1+Math.sin(i)*.32+(1-arrive)*4,i*.7+(1-arrive)*3,Math.cos(i)*.7+(1-arrive)*2);dummy.scale.set(1,.75+(i%7)*.09,1);dummy.updateMatrix();fries.setMatrixAt(i,dummy.matrix);}fries.instanceMatrix.needsUpdate=true;
    for(let i=0;i<45;i++){const a=i*2.4,y=.18+((i*.077+t*.13)%1.17);dummy.position.set(Math.cos(a)*.35,y,Math.sin(a)*.35);dummy.scale.setScalar(1);dummy.updateMatrix();bubbles.setMatrixAt(i,dummy.matrix);}bubbles.instanceMatrix.needsUpdate=true;
    ice.forEach((cube,i)=>{cube.rotation.y=i*.7+Math.sin(t*.3+i)*.05;cube.position.y=1.36+(i%2)*.13+Math.sin(t*.7+i)*.01;});
    camera.position.z=mobile?9.1:9;camera.position.y=mobile?.25:.45;camera.lookAt(0,mobile?-.12:0,0);
    for(let i=0;i<42;i++){const angle=i*2.39996+t*.035;const radius=1.7+(i%7)*.19;dummy.position.set(burger.position.x+Math.cos(angle)*radius*fit,(Math.sin(angle*1.4+t*.08)*1.5+burger.position.y)*fit,Math.sin(angle)*1.2-.4);dummy.rotation.set(i+t*.07,i*.7,t*.2);dummy.scale.set(.013,.033,.013);dummy.updateMatrix();crumbs.setMatrixAt(i,dummy.matrix);}crumbs.instanceMatrix.needsUpdate=true;crumbs.visible=!mobile;
    renderer.render(scene,camera);if(first){first=false;host.dataset.ready='true';callbacks.current.onReady();}
   }
   cleanup=()=>{ro.disconnect();window.removeEventListener('pointermove',pointer);env.dispose();fryTexture.dispose();const disposedGeos=new Set<Three.BufferGeometry>(),disposedMats=new Set<Three.Material>();sides.traverse(o=>{if(o instanceof T.Mesh){if(!disposedGeos.has(o.geometry)){o.geometry.dispose();disposedGeos.add(o.geometry);}for(const m of Array.isArray(o.material)?o.material:[o.material])if(!disposedMats.has(m)){m.dispose();disposedMats.add(m);}}});material.map?.dispose();material.dispose();parts.forEach(p=>p.geometry.dispose());crumbs.geometry.dispose();(crumbs.material as Three.Material).dispose();source?.geometry.dispose();};
   raf=requestAnimationFrame(render);
  })().catch(e=>{if(!disposed){console.error('Food scene could not start',e);callbacks.current.onError();}});
  return()=>{disposed=true;cancelAnimationFrame(raf);cleanup();renderer?.dispose();renderer?.domElement.remove();};
 },[progress,paused]);
 return <div ref={mount} className="food-scene" role="img" aria-label="A realistic 3D sesame burger. Its five layers separate and reassemble, then golden fries tumble into place and an iced cola rises beside it as you scroll."/>;
}
