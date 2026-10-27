'use client';
import { useEffect, useRef } from 'react';
import { chapters, accentHex } from '@/lib/content';
import { scroll, useStore } from '@/lib/store';
import { scrollToChapter } from '@/lib/lenis';

export default function ChapterNav() {
  const active = useStore((s) => s.active);
  const entered = useStore((s) => s.entered);
  const fill = useRef<HTMLSpanElement>(null);
  const accent = accentHex[chapters[active].accent];

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      if (fill.current) fill.current.style.transform = `scaleX(${Math.max(0.02, scroll.progress / (chapters.length - 1))})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={`hud ${entered ? 'is-in' : ''}`} style={{ ['--accent' as string]: accent }}>
      <nav className="dots" aria-label="Chapters">
        {chapters.map((c, i) => (
          <button
            key={c.id}
            className={`dot ${i === active ? 'is-active' : ''}`}
            onClick={() => scrollToChapter(c.id)}
            aria-label={`Go to ${c.label}`}
            aria-current={i === active ? 'step' : undefined}
          >
            <span className="dot-label">{c.label}</span>
            <span className="dot-pip" />
          </button>
        ))}
      </nav>
      <div className="progress" aria-hidden="true">
        <span className="progress-count">0{active} / 0{chapters.length - 1}</span>
        <span className="progress-track"><span ref={fill} className="progress-fill" /></span>
        <span className="progress-label">{chapters[active].label}</span>
      </div>
    </div>
  );
}
