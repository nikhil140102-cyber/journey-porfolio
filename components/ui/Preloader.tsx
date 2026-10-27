'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { setState, useStore } from '@/lib/store';
import { site } from '@/lib/content';
import { Button } from './Motion';

export default function Preloader() {
  const entered = useStore((s) => s.entered);
  const ready = useStore((s) => s.ready);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const loop = (t: number) => {
      const k = Math.min(1, (t - start) / 1800);
      const eased = 1 - Math.pow(1 - k, 3);
      setPct((p) => Math.max(p, Math.round(eased * (ready ? 100 : 88))));
      if (k < 1 || !ready) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  const done = pct >= 100;
  const enter = (sound: boolean) => {
    window.scrollTo(0, 0);
    setState({ entered: true, sound });
  };

  return (
    <AnimatePresence>
      {!entered && (
        <motion.div
          className="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08, filter: 'blur(12px)' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-label="Loading"
        >
          <div className="pre-logo">{site.short}<span>.</span></div>
          <svg className="pre-orbit" viewBox="0 0 560 560" aria-hidden="true">
            <defs>
              <linearGradient id="pre-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#A78BFA" /><stop offset="0.5" stopColor="#22D3EE" /><stop offset="1" stopColor="#F472B6" />
              </linearGradient>
            </defs>
            <circle cx="280" cy="280" r="250" stroke="#2A2640" strokeWidth="2" fill="none" />
            <circle cx="280" cy="280" r="250" stroke="url(#pre-g)" strokeWidth="4" fill="none" strokeLinecap="round"
              strokeDasharray={`${(pct / 100) * 1571} 1571`} transform="rotate(-90 280 280)" />
            <circle cx="280" cy="280" r="200" stroke="#2A2640" strokeDasharray="3 9" fill="none" />
          </svg>
          <div className="pre-center">
            <p className="kicker" style={{ color: '#7C5CFF' }}>{done ? 'Ready when you are' : 'Loading the story'}</p>
            <div className="pre-count" aria-live="polite">{pct}%</div>
            <div className="pre-bar"><span style={{ transform: `scaleX(${pct / 100})` }} /></div>
            <p className="pre-sub">Compiling shaders · placing planets · warming up the camera</p>
          </div>
          <motion.div className="pre-actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: done ? 1 : 0, y: done ? 0 : 16 }} transition={{ duration: 0.6 }}>
            <Button onClick={() => enter(true)} icon="sound">Enter with sound</Button>
            <Button variant="ghost" icon={null} onClick={() => enter(false)}>Enter quietly</Button>
          </motion.div>
          <p className="pre-tip">Tip — press <kbd>⌘K</kbd> anytime to jump to any chapter</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
