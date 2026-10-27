'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import Icon from './Icon';

export default function Toast() {
  const msg = useStore((s) => s.toast);
  return (
    <div className="toast-wrap" aria-live="polite">
      <AnimatePresence>
        {msg && (
          <motion.div className="toast" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
            <span className="toast-icon"><Icon name="check" size={12} /></span>
            {msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
