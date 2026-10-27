'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { chapters, site, accentHex } from '@/lib/content';
import { setState, useStore } from '@/lib/store';
import { scrollToChapter } from '@/lib/lenis';
import { Button, IconButton } from './Motion';
import Icon from './Icon';

const links = [
  { label: 'About', id: 'about' },
  { label: 'Work', id: 'projects' },
  { label: 'Writing', id: 'writing' },
  { label: 'Contact', id: 'contact' },
];

export default function Header() {
  const sound = useStore((s) => s.sound);
  const menuOpen = useStore((s) => s.menuOpen);
  const active = useStore((s) => s.active);
  const entered = useStore((s) => s.entered);

  return (
    <>
      <motion.header
        className="header"
        initial={{ y: -40, opacity: 0 }}
        animate={entered ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <a href="#hero" className="logo" onClick={(e) => { e.preventDefault(); scrollToChapter('hero'); }}>
          {site.short}<span>.</span>
        </a>
        <nav className="header-right" aria-label="Primary">
          <ul className="header-links">
            {links.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} onClick={(e) => { e.preventDefault(); scrollToChapter(l.id); }}>{l.label}</a>
              </li>
            ))}
          </ul>
          <button className="search-pill" onClick={() => setState({ paletteOpen: true })} aria-label="Open command palette">
            <Icon name="search" size={14} /> <span>Search</span> <kbd>⌘K</kbd>
          </button>
          <IconButton icon={sound ? 'sound' : 'mute'} label={sound ? 'Mute sound' : 'Turn sound on'} active={sound} onClick={() => setState({ sound: !sound })} />
          <IconButton icon="settings" label="Experience settings" onClick={() => setState({ settingsOpen: true })} className="hide-sm" />
          <Button onClick={() => scrollToChapter('contact')} className="hide-sm">Let&apos;s talk</Button>
          <IconButton icon="command" label="Command palette" onClick={() => setState({ paletteOpen: true })} className="show-sm" />
          <IconButton icon={menuOpen ? 'close' : 'menu'} label="Menu" onClick={() => setState({ menuOpen: !menuOpen })} className="show-sm" />
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ clipPath: 'circle(0% at 92% 4%)' }}
            animate={{ clipPath: 'circle(150% at 92% 4%)' }}
            exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <ol>
              {chapters.map((c, i) => (
                <motion.li key={c.id} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.04 }}>
                  <a
                    href={`#${c.id}`}
                    className={i === active ? 'is-active' : ''}
                    style={i === active ? { color: accentHex[c.accent] } : undefined}
                    onClick={(e) => { e.preventDefault(); setState({ menuOpen: false }); setTimeout(() => scrollToChapter(c.id), 350); }}
                  >
                    <span>0{i}</span>{c.label}
                  </a>
                </motion.li>
              ))}
            </ol>
            <div className="mobile-menu-foot">
              <a href={site.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={site.socials.github} target="_blank" rel="noreferrer">GitHub</a>
              <button onClick={() => setState({ menuOpen: false, settingsOpen: true })}>Settings</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
