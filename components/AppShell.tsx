'use client';
import dynamic from 'next/dynamic';
import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { chapters } from '@/lib/content';
import { getState, loadSettings, scroll, setState, useStore } from '@/lib/store';
import { lenisRef } from '@/lib/lenis';
import { setSound } from '@/lib/sound';
import Preloader from './ui/Preloader';
import Header from './ui/Header';
import ChapterNav from './ui/ChapterNav';
import Cursor from './ui/Cursor';
import CommandPalette from './ui/CommandPalette';
import AiChat from './ui/AiChat';
import Settings from './ui/Settings';
import Toast from './ui/Toast';

const World = dynamic(() => import('./world/World'), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

export default function AppShell({ children }: { children: ReactNode }) {
  const reduce = useStore((s) => s.reduceMotion);
  const entered = useStore((s) => s.entered);
  const sound = useStore((s) => s.sound);

  useEffect(() => { loadSettings(); }, []);
  useEffect(() => { setSound(sound); }, [sound]);

  // Smooth scroll (Lenis) driven by GSAP's ticker so ScrollTrigger stays in sync.
  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ duration: 1.25, smoothWheel: true, wheelMultiplier: 0.9 });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    if (!getState().entered) lenis.stop();
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduce]);

  // Lock scroll until the visitor enters from the preloader.
  useEffect(() => {
    document.documentElement.classList.toggle('locked', !entered);
    if (entered) {
      lenisRef.current?.start();
      setTimeout(() => ScrollTrigger.refresh(), 100);
    }
  }, [entered]);

  // Map page scroll → fractional chapter progress for the camera.
  useEffect(() => {
    let tops: number[] = [];
    let heights: number[] = [];
    const measure = () => {
      const els = chapters.map((c) => document.getElementById(c.id));
      tops = els.map((e) => (e ? e.getBoundingClientRect().top + window.scrollY : 0));
      heights = els.map((e) => (e ? e.offsetHeight : window.innerHeight));
    };
    let last = window.scrollY;
    const update = () => {
      const y = window.scrollY;
      scroll.velocity = y - last;
      last = y;
      let p = 0;
      for (let i = 0; i < tops.length; i++) {
        if (y >= tops[i]) {
          const span = i === tops.length - 1 ? Math.max(1, heights[i] - window.innerHeight) : heights[i];
          p = i + Math.min(1, (y - tops[i]) / span);
        }
      }
      scroll.progress = Math.min(p, chapters.length - 1);
      const active = Math.min(chapters.length - 1, Math.floor(scroll.progress + 0.35));
      if (active !== getState().active) setState({ active });
    };
    measure();
    update();
    const onResize = () => { measure(); update(); };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', onResize);
    ScrollTrigger.addEventListener('refresh', onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', onResize);
      ScrollTrigger.removeEventListener('refresh', onResize);
      ro.disconnect();
    };
  }, []);

  // Global shortcuts
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.closest('input, textarea, [contenteditable]');
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setState({ paletteOpen: !getState().paletteOpen });
      } else if (e.key === 'Escape') {
        setState({ paletteOpen: false, chatOpen: false, settingsOpen: false, menuOpen: false });
      } else if (!typing && e.key === '/' && getState().entered) {
        e.preventDefault();
        setState({ paletteOpen: true });
      }
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, []);

  // Pause smooth scroll while a modal is open
  const modal = useStore((s) => s.paletteOpen || s.menuOpen);
  useEffect(() => {
    if (!entered) return;
    if (modal) lenisRef.current?.stop();
    else lenisRef.current?.start();
  }, [modal, entered]);

  return (
    <>
      <World />
      <Preloader />
      <Header />
      <ChapterNav />
      <main className="story">{children}</main>
      <AiChat />
      <CommandPalette />
      <Settings />
      <Toast />
      <Cursor />
    </>
  );
}
