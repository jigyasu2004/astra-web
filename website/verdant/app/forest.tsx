'use client';
import { useEffect, useRef } from 'react';
export default function Forest({progress,onReady,onError}:{progress:React.RefObject<number>;onReady:()=>void;onError:()=>void}){
 const mount=useRef<HTMLDivElement>(null);
 useEffect(()=>{let cleanup=()=>{};let cancelled=false;
 (async()=>{const THREE=await import('three');const {Tree}=await import('@dgreenheck/ez-tree');if(cancelled)return;
 const host=mount.current!;const scene=new THREE.Scene();scene.background=new THREE.Color('#101e17');scene.fog=new THREE.FogExp2('#18281c',.028);
 const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;renderer.localClippingEnabled=true;host.appendChild(renderer.domElement);
 const camera=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,.1,160);
 const hemi=new THREE.HemisphereLight('#e6efd0','#243626',2);scene.add(hemi);
 const sun=new THREE.DirectionalLight('#ffe3a4',4.5);sun.position.set(12,25,-10);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-35,right:35,top:35,bottom:-35,far:90});sun.shadow.bias=-.0005;scene.add(sun);scene.add(new THREE.AmbientLight('#a1c8a3',.4));
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(250,250),new THREE.MeshStandardMaterial({color:'#293e26',roughness:1}));floor.rotation.x=-Math.PI/2;floor.position.y=-.12;floor.receiveShadow=true;scene.add(floor);
 const dirt=new THREE.TextureLoader().load('/forest/dirt.jpg');dirt.wrapS=dirt.wrapT=THREE.RepeatWrapping;dirt.repeat.set(25,25);dirt.colorSpace=THREE.SRGBColorSpace;floor.material.map=dirt;floor.material.needsUpdate=true;
 const hero=new Tree();hero.loadPreset('Oak Medium');hero.options.leaves.tint=0xb5d073;hero.options.leaves.count=13;hero.generate();hero.position.set(4,0,0);hero.scale.setScalar(.19);scene.add(hero);
 const growPlane=new THREE.Plane(new THREE.Vector3(0,-1,0),1.4);hero.branchesMesh.material.clippingPlanes=[growPlane];hero.leavesMesh.material.clippingPlanes=[growPlane];hero.branchesMesh.castShadow=true;hero.leavesMesh.castShadow=true;
 const grove=new THREE.Group();scene.add(grove);
 const template=new Tree();template.loadPreset('Ash Medium');template.options.leaves.count=7;template.options.branch.children[0]=5;template.options.branch.children[1]=3;template.generate();
 for(let i=0;i<30;i++){const tree=new THREE.Group();const branch=new THREE.Mesh(template.branchesMesh.geometry,template.branchesMesh.material);const leaf=new THREE.Mesh(template.leavesMesh.geometry,template.leavesMesh.material);branch.castShadow=i<8;leaf.castShadow=i<8;tree.add(branch,leaf);const side=i%2?1:-1;tree.position.set(side*(5+(i*7%13)),0,-8-Math.floor(i/2)*5);tree.scale.setScalar(.16+(i%5)*.018);tree.rotation.y=i*1.72;grove.add(tree)}
 const grassGeo=new THREE.ConeGeometry(.055,.65,3);grassGeo.translate(0,.3,0);const grass=new THREE.InstancedMesh(grassGeo,new THREE.MeshStandardMaterial({color:'#82964c',roughness:1}),1800);const dummy=new THREE.Object3D();
 for(let i=0;i<1800;i++){const x=Math.sin(i*127.1)*27,z=Math.cos(i*311.7)*47-20;dummy.position.set(x,0,z);dummy.rotation.set(.1*Math.sin(i),i,Math.sin(i)*.14);dummy.scale.setScalar(.5+(i%7)*.17);if(Math.abs(x)<2.4&&z<-3)dummy.scale.setScalar(0);dummy.updateMatrix();grass.setMatrixAt(i,dummy.matrix)}scene.add(grass);
 const moteGeometry=new THREE.BufferGeometry();const positions=new Float32Array(240*3);for(let i=0;i<240;i++){positions[i*3]=Math.sin(i*13)*24;positions[i*3+1]=1+(i*17%100)/10;positions[i*3+2]=Math.cos(i*7)*45-20}moteGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3));const motes=new THREE.Points(moteGeometry,new THREE.PointsMaterial({color:'#f9df97',size:.045,transparent:true,opacity:.65}));scene.add(motes);
 const fallMat=new THREE.MeshStandardMaterial({map:hero.leavesMesh.material.map,alphaTest:.4,side:THREE.DoubleSide,color:'#dbae55',roughness:.9});const falling=new THREE.InstancedMesh(new THREE.PlaneGeometry(.6,.6),fallMat,85);scene.add(falling);
 const leafDummy=new THREE.Object3D();let frame=0,smoothed=0,time=0,px=0,py=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const pointer=(e:PointerEvent)=>{px=(e.clientX/innerWidth-.5)*.8;py=(e.clientY/innerHeight-.5)*.35};const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)};addEventListener('resize',resize);addEventListener('pointermove',pointer);
 const target=new THREE.Vector3();const pos=new THREE.Vector3();
 const render=()=>{time+=.016;smoothed+=(progress.current-smoothed)*(reduced?1:.055);const p=smoothed;const growth=THREE.MathUtils.smoothstep(p,0,.38);const travel=THREE.MathUtils.smoothstep(p,.52,.94);const orbit=THREE.MathUtils.smoothstep(p,.27,.53);
 growPlane.constant=1.5+growth*13;hero.scale.setScalar(.13+growth*.06);hero.rotation.y=orbit*.55;
 const angle=orbit*1.05;pos.set(4-Math.sin(angle)*14,4.5+orbit*3,18-Math.cos(angle)*2);target.set(1.4+orbit*2.6,2.7+growth*2.6,0);
 pos.lerp(new THREE.Vector3(Math.sin(travel*4)*1.6,3.7+Math.sin(travel*Math.PI)*1.2,-45*travel+5),travel);target.lerp(new THREE.Vector3(0,4,-48*travel-12),travel);
 camera.position.copy(pos);if(!reduced){camera.position.x+=px;camera.position.y+=py}camera.lookAt(target);
 const autumn=THREE.MathUtils.smoothstep(p,.72,.98);hero.leavesMesh.material.color.setRGB(1,1-autumn*.38,1-autumn*.68);template.leavesMesh.material.color.setRGB(1,1-autumn*.24,1-autumn*.55);sun.color.setRGB(1,.89-autumn*.16,.64-autumn*.2);
 if(!reduced){hero.update(time);template.update(time);motes.rotation.y=Math.sin(time*.05)*.05}
 falling.visible=p>.7;for(let i=0;i<85;i++){leafDummy.position.set(Math.sin(i*71)*9,((i*.73+(reduced?0:-time*.7))%13+13)%13,-20+(Math.cos(i*13)*20));leafDummy.rotation.set(time*.4+i,i+time*.2,i*.3);leafDummy.updateMatrix();falling.setMatrixAt(i,leafDummy.matrix)}falling.instanceMatrix.needsUpdate=true;
 renderer.render(scene,camera);frame=requestAnimationFrame(render)};render();onReady();
 const lost=(e:Event)=>{e.preventDefault();cancelAnimationFrame(frame);onError()};renderer.domElement.addEventListener('webglcontextlost',lost);
 cleanup=()=>{cancelAnimationFrame(frame);removeEventListener('resize',resize);removeEventListener('pointermove',pointer);renderer.domElement.removeEventListener('webglcontextlost',lost);const geos=new Set<any>(),mats=new Set<any>(),textures=new Set<any>();scene.traverse((o:any)=>{if(o.geometry)geos.add(o.geometry);for(const m of (o.material?Array.isArray(o.material)?o.material:[o.material]:[])){mats.add(m);for(const v of Object.values(m))if((v as any)?.isTexture)textures.add(v)}});geos.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove()};
 })().catch(onError);return()=>{cancelled=true;cleanup()};},[]);
 return <div ref={mount} className="forest-canvas" aria-hidden="true"/>;
}
