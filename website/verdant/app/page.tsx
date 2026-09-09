'use client';
import { useEffect,useRef,useState } from 'react';
import { ArrowDown,ArrowUpRight,Leaf,RotateCcw } from 'lucide-react';
import Forest from './forest';
const acts=[
 {label:'THE BEGINNING',lines:['Every forest','begins with one.'],copy:'A seed. A little light. A world waiting to unfold.'},
 {label:'TAKING ROOT',lines:['Small beginnings.','Deep possibilities.'],copy:'Below the quiet earth, a new life finds its way.'},
 {label:'REACHING UP',lines:['Follow the light.','Find your sky.'],copy:'Branch by branch, the smallest things become extraordinary.'},
 {label:'IN FULL LEAF',lines:['A thousand leaves.','One living world.'],copy:'Pause beneath the crown. Notice how everything breathes.'},
 {label:'BEYOND ONE TREE',lines:['A little further.','A whole forest.'],copy:'What began alone now belongs to something bigger.'},
 {label:'THE QUIET PATH',lines:['Wander slowly.','Feel more.'],copy:'Let the canopy lead you. There is no hurry here.'},
 {label:'THE GOLDEN HOUR',lines:['Let the leaves fall.','Let the light in.'],copy:'The forest changes its colours. The earth welcomes them home.'},
 {label:'BEGIN AGAIN',lines:['Every ending','holds a beginning.'],copy:'A season returns to the soil. Another story is ready to grow.'}
];
const chapterAt=(value:number)=>Math.min(acts.length-1,Math.floor(Math.max(0,value)*acts.length));
export default function Home(){const progress=useRef(0);const [p,setP]=useState(0);const [ready,setReady]=useState(false);const [error,setError]=useState(false);const [stage,setStage]=useState('Gathering the seeds');const frame=useRef(0);
 useEffect(()=>{document.getElementById('boot-loader')?.remove()},[]);
 useEffect(()=>{const previous=document.body.style.overflow;if(!ready)document.body.style.overflow='hidden';return()=>{document.body.style.overflow=previous}},[ready]);
 useEffect(()=>{const update=()=>{frame.current=0;const value=Math.max(0,Math.min(1,scrollY/(document.documentElement.scrollHeight-innerHeight)));progress.current=value;setP(value)};const scroll=()=>{if(!frame.current)frame.current=requestAnimationFrame(update)};addEventListener('scroll',scroll,{passive:true});addEventListener('resize',scroll);update();return()=>{cancelAnimationFrame(frame.current);removeEventListener('scroll',scroll);removeEventListener('resize',scroll)}},[]);
 useEffect(()=>{const ctx=(document as any).modelContext;if(!ctx)return;const life=new AbortController();Promise.resolve(ctx.registerTool({name:'set_forest_journey',description:'Move to a chapter of the 3D forest journey and report rendering status.',inputSchema:{type:'object',properties:{progress:{type:'number',minimum:0,maximum:1}},required:['progress'],additionalProperties:false},annotations:{readOnlyHint:false},execute:async(input:any)=>{if(typeof input?.progress!=='number'||!Number.isFinite(input.progress)||input.progress<0||input.progress>1)throw new Error('Progress must be from 0 to 1.');window.scrollTo({top:input.progress*(document.documentElement.scrollHeight-innerHeight),behavior:'instant'});await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));return {progress:progress.current,ready,error,chapter:chapterAt(progress.current)+1,title:acts[chapterAt(progress.current)].lines.join(" ")};}},{signal:life.signal})).catch(()=>{});return()=>life.abort()},[ready,error]);
 const jump=(n:number)=>window.scrollTo({top:n*(document.documentElement.scrollHeight-innerHeight),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});const act=chapterAt(p);const a=acts[act];
 return <main className="experience"><div className="fixed-scene"><Forest progress={progress} onStage={setStage} onReady={()=>setReady(true)} onError={()=>setError(true)}/><div className="vignette"/></div>
 <div className={'loading-screen '+(ready&&!error?'loaded':'')} aria-hidden={ready&&!error} role="status"><span className="loader-brand">VERDANT ®</span><div className="loader-center"><div className="loader-orbit"/><p className="loader-kicker">A MOMENT FOR NATURE</p><h2>A little patience.<br/><em>A forest is waking.</em></h2><p className="loader-stage">{error?'The forest could not load. Please try again.':stage+'…'}</p>{error&&<button onClick={()=>location.reload()}>Try again ↗</button>}</div><span className="loader-foot">GOOD THINGS TAKE A LITTLE GROWING</span></div>
 <div className={'journey-ui '+(ready&&!error?'is-ready':'')} inert={!ready||error}>
 <header className="topbar"><a className="brand" href="#"><Leaf size={22} strokeWidth={1.4}/> VERDANT<span>®</span></a><span className="edition">AN IMMERSIVE NATURE STUDY — 001</span><button onClick={()=>jump(.55)}>Enter the forest <ArrowUpRight size={16}/></button></header>
 <aside className="side-index" aria-label="Scene chapters">{acts.map((a,i)=><button key={a.label} onClick={()=>jump((i+.15)/acts.length)} aria-label={a.label} aria-current={act===i?'step':undefined}><span className={act===i?'selected':''}/>0{i+1}</button>)}</aside>
 <div className="story-copy"><section key={act} className="chapter"><p className="eyebrow"><span className="live-dot"/>0{act+1} / {a.label}</p><h1>{a.lines.map((line,i)=><span className="line-mask" key={line}><span style={{animationDelay:`${i*100}ms`}}>{i===1?<em>{line}</em>:line}</span></span>)}</h1><p className="description">{a.copy}</p><button className="journey-link" onClick={()=>jump(act===7?0:(act+1+.15)/acts.length)}><span>{act===7?<RotateCcw size={18}/>:<ArrowDown size={18}/>}</span>{act===7?'Begin again':act===0?'Scroll to bring it to life':'Keep exploring'}</button></section></div>
 <div className="coordinates"><span>THE LIVING WORLD</span><b key={act}>{a.label} · 0{act+1} / 08</b></div>
 <footer className="bottom-bar"><span>SCROLL SLOWLY <ArrowDown size={12}/></span><div className="progress-track"><i style={{width:String(p*100)+'%'}}/></div><span>{String(Math.round(p*100)).padStart(2,'0')} / 100</span><a href="https://github.com/dgreenheck/ez-tree" target="_blank" rel="noreferrer" className="credits">TREE STUDY ↗</a></footer>
 </div><div className="scroll-space" aria-hidden="true"/>
 </main>
}
