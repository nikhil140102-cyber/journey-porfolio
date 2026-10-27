'use client';
import type Lenis from 'lenis';

export const lenisRef: { current: Lenis | null } = { current: null };

export function scrollToChapter(id: string, immediate = false) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisRef.current) lenisRef.current.scrollTo(el, { duration: immediate ? 0 : 2.2, immediate });
  else el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' });
}
