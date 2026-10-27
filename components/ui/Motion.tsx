'use client';
import { motion, useMotionValue, useSpring, useTransform, type HTMLMotionProps } from 'framer-motion';
import { useRef, type ReactNode, type MouseEvent } from 'react';
import { useStore } from '@/lib/store';
import { click } from '@/lib/sound';
import Icon, { type IconName } from './Icon';

/** Fade-and-rise when scrolled into view; children stagger if `stagger` is set. */
export function Reveal({ children, delay = 0, className, as = 'div', y = 28 }: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'li' | 'p'; y?: number }) {
  const reduce = useStore((s) => s.reduceMotion);
  const M = motion[as];
  return (
    <M
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  );
}

/** Splits a heading into words that rise in one after another. */
export function WordReveal({ text, className, as = 'h2', delay = 0 }: { text: string; className?: string; as?: 'h1' | 'h2' | 'h3'; delay?: number }) {
  const reduce = useStore((s) => s.reduceMotion);
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ staggerChildren: reduce ? 0 : 0.06, delayChildren: delay }}
      aria-label={text}
    >
      {text.split(' ').map((w, i) => (
        <span key={i} className="word-mask" aria-hidden="true">
          <motion.span
            className="word"
            variants={{ hidden: { y: reduce ? 0 : '110%', opacity: reduce ? 0 : 1 }, show: { y: '0%', opacity: 1 } }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

type BtnProps = {
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  icon?: IconName | null;
  href?: string;
  onClick?: () => void;
  external?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  cursor?: string;
};

/** Pill button that is pulled toward the pointer (magnetic) and clicks softly. */
export function Button({ children, variant = 'primary', icon = 'arrowRight', href, onClick, external, className = '', type = 'button', disabled, cursor }: BtnProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useStore((s) => s.reduceMotion);
  const sound = useStore((s) => s.sound);
  const x = useSpring(0, { stiffness: 220, damping: 15, mass: 0.3 });
  const y = useSpring(0, { stiffness: 220, damping: 15, mass: 0.3 });
  const move = (e: MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const leave = () => { x.set(0); y.set(0); };
  const cls = `btn btn-${variant} ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      {icon && <Icon name={icon} size={16} />}
    </>
  );
  const common = {
    ref: ref as never,
    className: cls,
    style: { x, y },
    onMouseMove: move,
    onMouseLeave: leave,
    'data-cursor': cursor,
    onClick: () => { click(sound); onClick?.(); },
  };
  if (href)
    return (
      <motion.a href={href} {...common} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
        {inner}
      </motion.a>
    );
  return (
    <motion.button type={type} disabled={disabled} {...common}>
      {inner}
    </motion.button>
  );
}

export function IconButton({ icon, label, onClick, active, className = '' }: { icon: IconName; label: string; onClick?: () => void; active?: boolean; className?: string }) {
  const sound = useStore((s) => s.sound);
  return (
    <button type="button" className={`icon-btn ${active ? 'is-active' : ''} ${className}`} aria-label={label} title={label} onClick={() => { click(sound, 660); onClick?.(); }}>
      <Icon name={icon} size={18} />
    </button>
  );
}

/** Card that tilts toward the pointer in 3D. */
export function Tilt({ children, className, max = 8, ...rest }: { children: ReactNode; className?: string; max?: number } & HTMLMotionProps<'div'>) {
  const reduce = useStore((s) => s.reduceMotion);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 150, damping: 18 });
  return (
    <motion.div
      className={className}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onMouseLeave={() => { mx.set(0.5); my.set(0.5); }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function Kicker({ children, accent }: { children: ReactNode; accent: string }) {
  return (
    <p className="kicker" style={{ color: accent }}>
      <span className="kicker-bar" style={{ background: accent }} />
      {children}
    </p>
  );
}
