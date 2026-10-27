'use client';
// Lightweight shell for inner pages (case studies, 404, legal): cursor, palette, settings.
import { useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { loadSettings, setState, getState } from '@/lib/store';
import { site } from '@/lib/content';
import Cursor from './ui/Cursor';
import CommandPalette from './ui/CommandPalette';
import Settings from './ui/Settings';
import Toast from './ui/Toast';
import Icon from './ui/Icon';

export default function SubShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    loadSettings();
    setState({ entered: true });
    const on = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setState({ paletteOpen: !getState().paletteOpen }); }
      if (e.key === 'Escape') setState({ paletteOpen: false, settingsOpen: false });
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, []);
  return (
    <>
      <div className="sub-bg" aria-hidden="true" />
      <header className="header is-static">
        <Link href="/" className="logo">{site.short}<span>.</span></Link>
        <nav className="header-right">
          <button className="search-pill" onClick={() => setState({ paletteOpen: true })}><Icon name="search" size={14} /> <span>Search</span> <kbd>⌘K</kbd></button>
          <Link href="/" className="btn btn-ghost"><span>Back to the story</span><Icon name="arrowLeft" size={16} /></Link>
        </nav>
      </header>
      {children}
      <CommandPalette />
      <Settings />
      <Toast />
      <Cursor />
    </>
  );
}
