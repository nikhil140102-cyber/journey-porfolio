'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { setState, useStore, type Quality } from '@/lib/store';
import Icon from './Icon';

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} className={`toggle ${on ? 'is-on' : ''}`} onClick={() => onChange(!on)}>
      <span />
    </button>
  );
}

export default function Settings() {
  const open = useStore((s) => s.settingsOpen);
  const s = useStore((st) => st);
  const rows: { key: 'sound' | 'reduceMotion' | 'cursor'; title: string; text: string }[] = [
    { key: 'sound', title: 'Sound', text: 'Ambient score and UI clicks' },
    { key: 'reduceMotion', title: 'Reduce motion', text: 'Fades instead of camera flights' },
    { key: 'cursor', title: 'Custom cursor', text: 'Magnetic cursor on buttons' },
  ];
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="scrim scrim-clear" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setState({ settingsOpen: false })}>
          <motion.aside
            className="settings"
            role="dialog"
            aria-label="Experience settings"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="settings-head">
              <h3>Experience settings</h3>
              <button className="icon-btn" aria-label="Close" onClick={() => setState({ settingsOpen: false })}><Icon name="close" /></button>
            </div>
            <p className="muted sm">Tune the 3D story for your device.</p>
            {rows.map((r) => (
              <div className="settings-row" key={r.key}>
                <div><strong>{r.title}</strong><small>{r.text}</small></div>
                <Toggle on={s[r.key]} label={r.title} onChange={(v) => setState({ [r.key]: v })} />
              </div>
            ))}
            <div className="settings-row col">
              <strong>Graphics quality</strong>
              <div className="tabs">
                {(['auto', 'high', 'low'] as Quality[]).map((q) => (
                  <button key={q} className={`tab ${s.quality === q ? 'is-on' : ''}`} onClick={() => setState({ quality: q })}>
                    {q[0].toUpperCase() + q.slice(1)}
                  </button>
                ))}
              </div>
              <small>Auto picks a level from your device’s performance. Saved for your next visit.</small>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
