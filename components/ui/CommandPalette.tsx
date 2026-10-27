'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { chapters, projects, site } from '@/lib/content';
import { getState, setState, toast, useStore } from '@/lib/store';
import { scrollToChapter } from '@/lib/lenis';
import Icon, { type IconName } from './Icon';

type Item = { id: string; group: 'Chapters' | 'Projects' | 'Actions'; label: string; hint: string; icon: IconName; run: () => void };

export default function CommandPalette() {
  const open = useStore((s) => s.paletteOpen);
  const router = useRouter();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const items = useMemo<Item[]>(() => {
    const close = () => setState({ paletteOpen: false });
    const list: Item[] = [
      ...chapters.map((c, i) => ({
        id: 'c-' + c.id, group: 'Chapters' as const, label: `Go to ${c.label}`, hint: `0${i}`, icon: 'arrowRight' as IconName,
        run: () => { close(); setTimeout(() => scrollToChapter(c.id), 200); },
      })),
      ...projects.map((p) => ({
        id: 'p-' + p.slug, group: 'Projects' as const, label: `Open case study · ${p.title}`, hint: p.category, icon: 'arrowUpRight' as IconName,
        run: () => { close(); router.push(`/work/${p.slug}`); },
      })),
      { id: 'a-ai', group: 'Actions', label: 'Ask Nikhil — AI assistant', hint: 'Beta', icon: 'sparkle', run: () => setState({ paletteOpen: false, chatOpen: true }) },
      { id: 'a-sound', group: 'Actions', label: 'Toggle sound', hint: 'Audio', icon: 'sound', run: () => { setState({ sound: !getState().sound, paletteOpen: false }); } },
      { id: 'a-settings', group: 'Actions', label: 'Experience settings', hint: 'Motion · quality', icon: 'settings', run: () => setState({ paletteOpen: false, settingsOpen: true }) },
      { id: 'a-resume', group: 'Actions', label: 'Download résumé', hint: 'PDF', icon: 'download', run: () => { close(); window.open(site.resumeUrl, '_blank'); } },
      { id: 'a-li', group: 'Actions', label: 'Open LinkedIn', hint: site.linkedinFollowers + ' followers', icon: 'linkedin', run: () => { close(); window.open(site.socials.linkedin, '_blank'); } },
      { id: 'a-gh', group: 'Actions', label: 'Open GitHub', hint: 'Code', icon: 'github', run: () => { close(); window.open(site.socials.github, '_blank'); } },
    ];
    if (site.email)
      list.push({ id: 'a-email', group: 'Actions', label: 'Copy email address', hint: 'Clipboard', icon: 'copy',
        run: () => { navigator.clipboard?.writeText(site.email); close(); toast('Email copied to clipboard'); } });
    return list;
  }, [router]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? items.filter((i) => (i.label + ' ' + i.hint + ' ' + i.group).toLowerCase().includes(s)) : items;
  }, [q, items]);

  useEffect(() => { setSel(0); }, [q]);
  useEffect(() => {
    if (open) { setQ(''); setTimeout(() => input.current?.focus(), 30); }
  }, [open]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(filtered.length - 1, s + 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
    if (e.key === 'Enter') { e.preventDefault(); filtered[sel]?.run(); }
  };

  let lastGroup = '';
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setState({ paletteOpen: false })}>
          <motion.div
            className="palette"
            role="dialog"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="palette-search">
              <Icon name="search" size={18} />
              <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder="Jump to a chapter, project or action…" aria-label="Search commands" />
              <kbd>Esc</kbd>
            </div>
            <div className="palette-list" role="listbox">
              {filtered.length === 0 && <p className="palette-empty">Nothing matches “{q}”. Try “projects” or “contact”.</p>}
              {filtered.map((it, i) => {
                const head = it.group !== lastGroup ? it.group : null;
                lastGroup = it.group;
                return (
                  <div key={it.id}>
                    {head && <p className="palette-group">{head}</p>}
                    <button
                      role="option"
                      aria-selected={i === sel}
                      className={`palette-item ${i === sel ? 'is-sel' : ''}`}
                      onMouseEnter={() => setSel(i)}
                      onClick={it.run}
                    >
                      <Icon name={it.icon} size={16} />
                      <span className="palette-label">{it.label}</span>
                      <span className="palette-hint">{it.hint}</span>
                    </button>
                  </div>
                );
              })}
            </div>
            <p className="palette-foot">↑ ↓ navigate · ↵ open · esc close</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
