'use client';

import { useEffect, useRef } from 'react';

function ParticleField() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current!;
    const ctx = el.getContext('2d');
    if (!ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, frame = 0, t = 0, px = 0, py = 0;
    const points = Array.from({length: 3600}, (_, i) => ({u: i / 3600, a: i * 2.399963, r: .84 + Math.random() * .16, size: .35 + Math.random() * 1.3}));
    const resize = () => {w = innerWidth; h = innerHeight; const d = Math.min(devicePixelRatio, 2); el.width = w*d; el.height = h*d; ctx.setTransform(d,0,0,d,0,0);};
    const pointer = (e: PointerEvent) => {px = (e.clientX/w-.5)*.3; py=(e.clientY/h-.5)*.2;};
    resize(); window.addEventListener('resize',resize); window.addEventListener('pointermove',pointer);
    const draw = () => {
      t += reduced ? 0 : .004;
      const scroll = Math.min(2, scrollY/h);
      ctx.clearRect(0,0,w,h);
      const cx = w * (w < 700 ? .5 : .64) + Math.sin(t*.6)*12;
      const cy = h*.49;
      const scale = Math.min(w*.38,h*.37);
      const glow = ctx.createRadialGradient(cx,cy,0,cx,cy,scale*1.4);
      glow.addColorStop(0,'rgba(93,37,184,.16)'); glow.addColorStop(.5,'rgba(40,37,134,.08)');glow.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
      ctx.globalCompositeOperation='lighter';
      for (const p of points) {
        const v = p.u*Math.PI*2;
        const tube = .24 + .05*Math.sin(v*3+t*2);
        const radius = .70+tube*Math.cos(p.a);
        let x = radius*Math.cos(v), y = radius*Math.sin(v), z = tube*Math.sin(p.a);
        const morph = Math.min(1, scroll);
        const helixY = (p.u-.5)*2.5;
        const helixA = p.u*Math.PI*8 + (p.a%2)*Math.PI;
        const hx = Math.cos(helixA)*(.36+.12*Math.sin(p.a));
        const hz = Math.sin(helixA)*(.36+.12*Math.sin(p.a));
        x=x*(1-morph)+hx*morph; y=y*(1-morph)+helixY*morph; z=z*(1-morph)+hz*morph;
        const bloom = Math.max(0,scroll-1);
        x = x*(1-bloom)+Math.cos(p.a)*Math.sqrt(1-(p.u*2-1)**2)*bloom;
        y = y*(1-bloom)+(p.u*2-1)*bloom;
        z = z*(1-bloom)+Math.sin(p.a)*Math.sqrt(1-(p.u*2-1)**2)*bloom;
        const ry = t+px+.35, rx=.48+py;
        const xx=x*Math.cos(ry)+z*Math.sin(ry), zz=-x*Math.sin(ry)+z*Math.cos(ry);
        const yy=y*Math.cos(rx)-zz*Math.sin(rx), depth=y*Math.sin(rx)+zz*Math.cos(rx);
        const perspective = 2.8/(2.8-depth);
        const sx=cx+xx*scale*perspective, sy=cy+yy*scale*perspective;
        const hue = 230+65*p.u+22*Math.sin(p.a)+scroll*20;
        ctx.fillStyle=`hsla(${hue},90%,${65+depth*12}%,${.25+(depth+1)*.25})`;
        ctx.beginPath();ctx.arc(sx,sy,p.size*perspective,0,Math.PI*2);ctx.fill();
      }
      for(let i=0;i<70;i++){
        const x=(Math.sin(i*127.1)*.5+.5)*w;
        const y=((Math.cos(i*311.7)*.5+.5)*h+t*(i%3+1)*3)%h;
        ctx.fillStyle=`rgba(190,180,255,${.12+(i%4)*.06})`;ctx.fillRect(x,y,i%9===0?2:1,1);
      }
      ctx.globalCompositeOperation='source-over';
      frame=requestAnimationFrame(draw);
    };
    draw(); return () => {cancelAnimationFrame(frame); window.removeEventListener('resize',resize);window.removeEventListener('pointermove',pointer);};
  },[]);
  return <canvas ref={canvas} className="particle-field" aria-hidden="true" />;
}

export default function Home() {
  return <main>
    <ParticleField />
    <div className="ambient" aria-hidden="true" />
    <header className="site-header">
      <a href="#home" className="wordmark" aria-label="Aether home"><span className="brand-symbol">✳</span> AETHER<span className="wordmark-dot">®</span></a>
      <nav aria-label="Main navigation"><a href="#exploration">Exploration</a><a href="#philosophy">Philosophy</a></nav>
      <a href="#exploration" className="header-cta">Enter the experience <span>↗</span></a>
    </header>
    <section id="home" className="scene hero">
      <div className="hero-content"><div className="eyebrow"><span className="live-dot" /> AN INDEPENDENT DIGITAL EXPLORATION</div>
      <h1>Beyond<br/>the <em>ordinary.</em></h1>
      <p className="intro">A space where imagination takes form.<br/>And the digital becomes something you feel.</p>
      <a className="round-link" href="#exploration"><span className="circle-arrow">↘</span><span>Explore the unknown</span></a></div>
      <div className="specimen-label"><span className="tiny-cross">+</span><div>FIG. 001 — CONTINUUM<br/><span>MATTER IN A CONSTANT STATE OF BECOMING</span></div></div>
      <div className="scene-bottom"><span>SCROLL TO UNFOLD <span className="down-line">↓</span></span><span>ART · TECHNOLOGY · HUMAN EXPERIENCE</span><span>01 / 03</span></div>
    </section>
    <section id="exploration" className="scene exploration">
      <div className="glass-card"><div className="eyebrow">01 / THE EXPLORATION</div><h2>Nothing stays.<br/><em>Everything flows.</em></h2><p>A thousand points. One living system. Familiar forms dissolve into new possibilities, shaped by every move you make.</p><a className="text-link" href="#philosophy">Follow the transformation <span>↓</span></a><div className="card-footer"><span>INFINITE POSSIBILITIES</span><span>↗</span></div></div>
      <div className="side-note">FORM / FLUX / FREQUENCY</div>
      <div className="scene-bottom"><span>A STUDY IN TRANSFORMATION</span><span>02 / 03</span></div>
    </section>
    <section id="philosophy" className="scene philosophy"><div className="closing-content"><div className="eyebrow">02 / THE PHILOSOPHY</div><h2>Less noise.<br/><em>More wonder.</em></h2><p>The most meaningful experiences don’t demand attention.<br/>They invite you to stay a little longer.</p><a className="round-link" href="#home"><span className="circle-arrow">↗</span><span>Experience it again</span></a></div><div className="scene-bottom"><span>© 2026 AETHER — CONCEPT EXPERIENCE</span><span>DESIGNED TO BE FELT</span><span>03 / 03</span></div></section>
    <a href="#home" className="corner-mark" aria-label="Back to top">a<span>↗</span></a>
  </main>;
}
