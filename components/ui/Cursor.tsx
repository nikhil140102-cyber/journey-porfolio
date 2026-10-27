'use client';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/lib/store';

type Mode = 'default' | 'hover' | 'view' | 'drag' | 'text';

/** Dot follows instantly, ring trails with easing. States: hover · view · drag · text · press. */
export default function Cursor() {
  const enabled = useStore((s) => s.cursor);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>('default');
  const [label, setLabel] = useState('');
  const [down, setDown] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('has-cursor', enabled);
    if (!enabled) return;
    const pos = { x: -100, y: -100 }, r = { x: -100, y: -100 };
    let raf = 0;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pos.x = e.clientX; pos.y = e.clientY;
      setVisible(true);
      const t = e.target as HTMLElement;
      const custom = t.closest<HTMLElement>('[data-cursor]');
      if (custom && custom.dataset.cursor) {
        const c = custom.dataset.cursor;
        setMode(c === 'drag' ? 'drag' : c === 'view' ? 'view' : 'hover');
        setLabel(c === 'drag' ? '← Drag →' : c === 'view' ? 'View' : '');
      } else if (t.closest('input, textarea')) { setMode('text'); setLabel(''); }
      else if (t.closest('a, button, [role="button"], label')) { setMode('hover'); setLabel(''); }
      else { setMode('default'); setLabel(''); }
    };
    const loop = () => {
      r.x += (pos.x - r.x) * 0.16;
      r.y += (pos.y - r.y) * 0.16;
      if (dot.current) dot.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${r.x}px, ${r.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const d = () => setDown(true), u = () => setDown(false);
    const leave = () => setVisible(false);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', d);
    window.addEventListener('pointerup', u);
    document.addEventListener('mouseleave', leave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', d);
      window.removeEventListener('pointerup', u);
      document.removeEventListener('mouseleave', leave);
      document.documentElement.classList.remove('has-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div className={`cursor cursor-${mode} ${down ? 'is-down' : ''} ${visible ? 'is-visible' : ''}`} aria-hidden="true">
      <div ref={ring} className="cursor-ring"><span>{label}</span></div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
