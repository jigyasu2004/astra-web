'use client';
import {useEffect,useRef} from 'react';
import {projects} from './projects';
export default function Scene({progress,onReady,onError}:{progress:React.RefObject<number>;onReady:()=>void;onError:()=>void}){
 const mount=useRef<HTMLDivElement>(null);
 useEffect(()=>{let cancelled=false;let dispose=()=>{};
 (async()=>{
 const T=await import('three');const {RoomEnvironment}=await import('three/addons/environments/RoomEnvironment.js');if(cancelled)return;
 const scene=new T.Scene();const renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);renderer.setClearColor('#08090e');renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;mount.current!.appendChild(renderer.domElement);
 const camera=new T.PerspectiveCamera(45,innerWidth/innerHeight,.1,150);camera.position.set(0,0,12);
 const room=new RoomEnvironment();const pmrem=new T.PMREMGenerator(renderer);const env=pmrem.fromScene(room,.03);scene.environment=env.texture;room.dispose();pmrem.dispose();
 const uniforms={time:{value:0},shift:{value:0}};
 const chamber=new T.Mesh(new T.SphereGeometry(44,80,48),new T.ShaderMaterial({side:T.BackSide,uniforms,vertexShader:`varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec2 vUv;uniform float time;uniform float shift;void main(){vec2 uv=vUv;vec2 cell=fract(uv*vec2(100.,50.));vec2 edge=min(cell,1.-cell);float grid=1.-smoothstep(.012,.035,min(edge.x,edge.y));vec2 fine=fract(uv*vec2(500.,250.));float micro=1.-smoothstep(.006,.04,min(min(fine.x,1.-fine.x),min(fine.y,1.-fine.y)));float wave=pow(max(0.,sin(uv.x*13.+uv.y*5.+time*.12+shift*2.)),5.);float glow=exp(-pow((uv.y-.48)*6.,2.));vec3 violet=mix(vec3(.025,.018,.075),vec3(.09,.024,.23),wave);vec3 cyan=vec3(.005,.16,.21)*pow(max(0.,cos(uv.x*11.-time*.1)),12.);vec3 color=(violet+cyan)*glow;color+=grid*vec3(.11,.11,.16)+micro*.012;color*=.55+.45*glow;gl_FragColor=vec4(color,1.);}`}));scene.add(chamber);
 const shape=new T.Shape();shape.moveTo(0,2.9);shape.lineTo(-2.65,-1.8);shape.lineTo(2.65,-1.8);shape.closePath();const hole=new T.Path();hole.moveTo(0,1.3);hole.lineTo(1.22,-.95);hole.lineTo(-1.22,-.95);hole.closePath();shape.holes.push(hole);
 const chrome=new T.MeshPhysicalMaterial({color:'#d8def5',metalness:1,roughness:.075,envMapIntensity:2.6,clearcoat:1});const portal=new T.Mesh(new T.ExtrudeGeometry(shape,{depth:.48,bevelEnabled:true,bevelSegments:5,steps:1,bevelSize:.17,bevelThickness:.16,curveSegments:32}),chrome);portal.position.set(0,.2,0);scene.add(portal);
 const rim=new T.PointLight('#8b4fff',80,30);rim.position.set(-3,3,4);scene.add(rim);const light=new T.PointLight('#74d9ff',60,30);light.position.set(5,-2,5);scene.add(light);
 const orbit=new T.Group();scene.add(orbit);const cards:T.Group[]=[];const textures:T.Texture[]=[];
 for(let i=0;i<projects.length;i++){
 const texture=await new T.TextureLoader().loadAsync('/images/'+projects[i].image+'.jpg');textures.push(texture);texture.colorSpace=T.SRGBColorSpace;
 const ratio=texture.image.width/texture.image.height,target=7.6/4.6;if(ratio>target){texture.repeat.x=target/ratio;texture.offset.x=(1-texture.repeat.x)/2}else{texture.repeat.y=ratio/target;texture.offset.y=(1-texture.repeat.y)/2}
 const card=new T.Group();const panel=new T.Mesh(new T.PlaneGeometry(7.6,4.6),new T.MeshBasicMaterial({map:texture}));card.add(panel);
 const edges=new T.LineSegments(new T.EdgesGeometry(new T.PlaneGeometry(7.66,4.66)),new T.LineBasicMaterial({color:projects[i].color,transparent:true,opacity:.65}));edges.position.z=.02;card.add(edges);
 const back=new T.Mesh(new T.BoxGeometry(7.8,4.8,.12),new T.MeshStandardMaterial({color:'#13131e',metalness:.5,roughness:.4}));back.position.z=-.09;card.add(back);orbit.add(card);cards.push(card);
 }
 let frame=0,current=progress.current,time=0,px=0,py=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)};const pointer=(e:PointerEvent)=>{px=(e.clientX/innerWidth-.5)*.35;py=(e.clientY/innerHeight-.5)*.25};addEventListener('resize',resize);addEventListener('pointermove',pointer);
 const tick=()=>{if(cancelled)return;time+=.016;current+=(progress.current-current)*(reduced?1:.07);const p=current;uniforms.time.value=reduced?0:time;uniforms.shift.value=p;const mobile=innerWidth<700;
 camera.position.set(reduced?0:px,reduced?0:-py,12);camera.lookAt(0,0,0);
 const enter=T.MathUtils.smoothstep(p,.08,.22),leave=T.MathUtils.smoothstep(p,.87,.96);portal.visible=enter<.99||leave>.01;const scale=(mobile?.65:1)*(1+enter*7)*(1-leave)+leave*(mobile?.45:.8);portal.scale.setScalar(scale);portal.position.z=enter*8*(1-leave);portal.position.y=leave*.9;portal.rotation.set(.08+Math.sin(time*.2)*.04*(reduced?0:1),-.28+(reduced?0:Math.sin(time*.25)*.25)+p*1.3,p*.5+leave*.2);chrome.transparent=true;chrome.opacity=1-enter+leave;
 orbit.visible=p>.13&&p<.97;orbit.scale.setScalar(mobile?.48:1);orbit.position.y=mobile?.9:.4;const cursor=(p-.23)/.108;
 for(let i=0;i<cards.length;i++){const angle=(i-cursor)*.77;cards[i].visible=Math.abs(angle)<2.7;cards[i].position.set(Math.sin(angle)*10,Math.sin(angle)*.35,-(1-Math.cos(angle))*7);cards[i].rotation.y=-angle*.8;cards[i].scale.setScalar(Math.min(1,Math.max(.001,enter*(1-leave))));}
 chamber.rotation.y=p*.12;renderer.render(scene,camera);frame=requestAnimationFrame(tick)};
 const lost=(e:Event)=>{e.preventDefault();cancelAnimationFrame(frame);onError()};renderer.domElement.addEventListener('webglcontextlost',lost);
 dispose=()=>{cancelAnimationFrame(frame);removeEventListener('resize',resize);removeEventListener('pointermove',pointer);renderer.domElement.removeEventListener('webglcontextlost',lost);scene.traverse((obj:any)=>{obj.geometry?.dispose();if(obj.material){for(const m of(Array.isArray(obj.material)?obj.material:[obj.material]))m.dispose()}});textures.forEach(t=>t.dispose());env.dispose();renderer.dispose();renderer.domElement.remove()};
 if(cancelled){dispose();return}await renderer.compileAsync(scene,camera);tick();requestAnimationFrame(()=>{if(!cancelled)onReady()});
 })().catch(()=>{if(!cancelled)onError()});return()=>{cancelled=true;dispose()};},[]);
 return <div className="webgl" ref={mount} aria-hidden="true"/>;
}
