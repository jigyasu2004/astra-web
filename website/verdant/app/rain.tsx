'use client';
import { useEffect, useRef, useState } from 'react';
import { CloudRain, Volume2, VolumeX } from 'lucide-react';

// Synthesized locally: no audio download, third-party requests or autoplay.
function createRain() {
  const Audio = window.AudioContext || (window as any).webkitAudioContext;
  if (!Audio) throw new Error('Audio is unavailable in this browser.');
  const context: AudioContext = new Audio();
  const length = Math.floor(context.sampleRate * 12);
  const buffer = context.createBuffer(2, length, context.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    let soft = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      soft = soft * .97 + white * .03;
      data[i] = white * .22 + soft * 1.5;
    }
    // Soft, irregular splashes on the canopy, baked into the seamless loop.
    for (let drop = 0; drop < 180; drop++) {
      const start = Math.floor(Math.random() * length);
      const duration = Math.floor(context.sampleRate * (.015 + Math.random() * .055));
      for (let j = 0; j < duration; j++) {
        const envelope = Math.sin(Math.PI * j / duration) * Math.exp(-4 * j / duration);
        data[(start + j) % length] += (Math.random() * 2 - 1) * envelope * .12;
      }
    }
    const fade = Math.floor(context.sampleRate * .1);
    for (let i = 0; i < fade; i++) {
      const mix = i / fade;
      data[length - fade + i] = data[length - fade + i] * (1 - mix) + data[i] * mix;
    }
  }
  const source = context.createBufferSource();
  source.buffer = buffer; source.loop = true; source.loopStart = .1;
  const filter = context.createBiquadFilter();
  filter.type = 'lowpass'; filter.frequency.value = 5500; filter.Q.value = .35;
  const gain = context.createGain(); gain.gain.value = 0;
  source.connect(filter).connect(gain).connect(context.destination); source.start();
  return { context, gain };
}

export default function Rain() {
  const audio = useRef<ReturnType<typeof createRain> | null>(null);
  const wanted = useRef(false);
  const level = useRef(.45);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [enabled, setEnabled] = useState(false);
  const [volume, setVolume] = useState(.45);
  const [error, setError] = useState('');
  const applyVolume = () => {
    const engine = audio.current;
    if (!engine) return;
    engine.gain.gain.setTargetAtTime(wanted.current ? level.current * .75 : 0, engine.context.currentTime, .15);
  };
  const toggle = async () => {
    clearTimeout(timer.current);
    wanted.current = !wanted.current;
    setEnabled(wanted.current); setError('');
    try {
      if (wanted.current) {
        audio.current ??= createRain();
        await audio.current.context.resume();
        applyVolume();
      } else if (audio.current) {
        applyVolume();
        timer.current = setTimeout(() => {
          if (!wanted.current) void audio.current?.context.suspend();
        }, 650);
      }
    } catch {
      wanted.current = false; setEnabled(false);
      setError('Sound could not start. Tap to try again.');
    }
  };
  useEffect(() => {
    const visibility = () => {
      const engine = audio.current;
      if (!engine) return;
      if (document.hidden) void engine.context.suspend();
      else if (wanted.current) void engine.context.resume().catch(() => {
        wanted.current = false; setEnabled(false);
      });
    };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      clearTimeout(timer.current);
      document.removeEventListener('visibilitychange', visibility);
      void audio.current?.context.close(); audio.current = null;
    };
  }, []);
  return <div className="rain-control">
    <button type="button" className="rain-toggle" onClick={toggle} aria-pressed={enabled} aria-label={enabled ? 'Turn rain sound off' : 'Turn rain sound on'}>
      <CloudRain size={17} strokeWidth={1.4}/><span>RAIN <b>{enabled ? 'ON' : 'OFF'}</b></span>{enabled ? <Volume2 size={14}/> : <VolumeX size={14}/>}
    </button>
    {enabled && <label className="rain-volume"><span className="sr-only">Rain volume</span><input aria-label="Rain volume" type="range" min="0" max="100" value={Math.round(volume * 100)} onChange={event => {const value = Number(event.target.value) / 100;level.current = value;setVolume(value);applyVolume();}}/></label>}
    {error && <p role="status" className="rain-error">{error}</p>}
    <style>{`.rain-control{position:fixed;bottom:90px;left:4%;z-index:15;display:flex;align-items:center;gap:12px;border:1px solid #e2e7c833;border-radius:30px;padding:3px 12px 3px 3px;background:#102118d9;backdrop-filter:blur(12px);color:#e4e8ce}.rain-toggle{display:flex;align-items:center;gap:10px;background:none;border:0;padding:11px 13px;border-radius:30px;font-size:9px;letter-spacing:1.8px;min-height:42px}.rain-toggle b{font-size:8px;font-weight:400;color:#a6b69c;margin-left:4px}.rain-toggle[aria-pressed=true] b{color:#dcdf96}.rain-volume{display:flex;align-items:center;padding:8px 0}.rain-volume input{accent-color:#d5df9f;width:80px;cursor:pointer}.rain-error{position:absolute;bottom:100%;left:0;width:250px;font-size:12px;letter-spacing:0;line-height:1.5;background:#102118;padding:12px;border-radius:8px}@media(max-width:700px){.rain-control{left:6%;bottom:78px}.rain-toggle{padding:9px 10px}.rain-volume input{width:66px}}@media(max-height:600px) and (min-width:701px){.rain-control{left:auto;right:4%;bottom:64px}.rain-toggle{padding:6px 10px;min-height:34px}}`}</style>
  </div>;
}
