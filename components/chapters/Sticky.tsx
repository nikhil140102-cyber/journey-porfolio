'use client';
// Pinned, scroll-scrubbed chapters: Experience (fly-through road), Projects (3D cover-flow),
// Clients (orbit) and Voices (testimonial arc).
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion } from 'framer-motion';
import { accentHex, clients, experience, projects, testimonials, type Project } from '@/lib/content';
import { scroll, useStore } from '@/lib/store';
import { lenisRef } from '@/lib/lenis';
import { Kicker, Reveal, WordReveal } from '../ui/Motion';
import Cover from '../ui/Cover';
import Icon from '../ui/Icon';

gsap.registerPlugin(ScrollTrigger, useGSAP);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function useSectionProgress(id: string, onProgress: (p: number) => void, deps: unknown[] = []) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const st = ScrollTrigger.create({
        trigger: ref.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => { scroll.local.set(id, self.progress); onProgress(self.progress); },
        onRefresh: (self) => onProgress(self.progress),
      });
      onProgress(st.progress);
    },
    { scope: ref, dependencies: deps },
  );
  return ref;
}

function scrollWithin(section: HTMLElement | null, p: number) {
  if (!section) return;
  const top = section.getBoundingClientRect().top + window.scrollY;
  const len = section.offsetHeight - window.innerHeight;
  const y = top + clamp(p, 0, 1) * len;
  if (lenisRef.current) lenisRef.current.scrollTo(y, { duration: 1.1 });
  else window.scrollTo({ top: y, behavior: 'smooth' });
}

/* ─────────────── 03 · Experience ─────────────── */
export function Experience() {
  const cards = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const n = experience.length;
  const ref = useSectionProgress('experience', (p) => {
    const f = p * (n - 1);
    const spread = Math.min(300, window.innerWidth * 0.2);
    const narrow = window.innerWidth < 768;
    cards.current.forEach((el, k) => {
      if (!el) return;
      const d = k - f;
      const side = narrow ? 0 : k % 2 ? 1 : -1;
      const z = d < 0 ? -d * 900 : -d * 520;
      const op = d < 0 ? clamp(1 + d * 3, 0, 1) : clamp(1 - d * 0.24, 0, 1);
      el.style.transform = `translate3d(calc(-50% + ${side * spread}px), calc(-50% + ${d * -26}px), ${z}px)`;
      el.style.opacity = String(op);
      el.style.zIndex = String(100 - Math.round(d * 10));
      el.style.pointerEvents = Math.abs(d) < 0.5 ? 'auto' : 'none';
    });
    setActive(clamp(Math.round(f), 0, n - 1));
  });
  return (
    <section id="experience" className="chapter sticky-chapter" ref={ref} style={{ height: `${n * 60 + 100}vh` }} aria-labelledby="exp-title">
      <div className="sticky">
        <div className="sticky-head">
          <Kicker accent={accentHex.pink}>Chapter 03 — Experience</Kicker>
          <WordReveal as="h2" text="The road so far" className="h-xl" />
          <p className="muted">{n} stops, 2022 → today. Keep scrolling — each stop flies forward into focus.</p>
        </div>
        <div className="road-stage">
          {experience.map((e, k) => (
            <article key={k} ref={(el) => { cards.current[k] = el; }} className={`exp-card glass ${k === active ? 'is-active' : ''}`}>
              <p className="exp-meta"><span className="pill pink">{e.date}</span><span className="muted sm">{e.place}</span></p>
              <h3>{e.role}</h3>
              <p className="exp-company">{e.company}</p>
              <p className="muted sm">{e.text}</p>
            </article>
          ))}
        </div>
        <div className="road-counter" aria-live="polite">
          <span>Stop {active + 1} / {n}</span>
          <span className="road-dots">{experience.map((_, k) => <i key={k} className={k <= active ? 'on' : ''} />)}</span>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── 04 · Projects ─────────────── */
function ProjectCard({ p, index }: { p: Project; index: number }) {
  return (
    <>
      <div className="project-cover"><Cover kind={p.cover} /></div>
      <div className="project-body">
        <p className="kicker" style={{ color: accentHex.violet }}>{p.category} · 0{index + 1}</p>
        <h3>{p.title}</h3>
        <p className="muted sm">{p.summary}</p>
        <ul className="tags">{p.stack.slice(0, 4).map((s) => <li key={s} className="tag">{s}</li>)}</ul>
        <span className="project-link">Read case study <Icon name="arrowUpRight" size={14} /></span>
      </div>
    </>
  );
}

export function Projects() {
  const filters = ['All', 'Frontend', 'DevOps'];
  const [filter, setFilter] = useState('All');
  const list = useMemo(() => projects.filter((p) => filter === 'All' || p.category === filter), [filter]);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const [focus, setFocus] = useState(0);
  const prog = useRef(0);
  const layout = (p: number) => {
    prog.current = p;
    const n = list.length;
    const f = p * Math.max(1, n - 1);
    const step = window.innerWidth < 768 ? window.innerWidth * 0.82 : clamp(window.innerWidth * 0.3, 240, 420);
    cards.current.forEach((el, k) => {
      if (!el) return;
      const o = k - f;
      const a = Math.abs(o);
      el.style.transform = `translate3d(calc(-50% + ${o * step}px), -50%, ${-a * 240}px) rotateY(${clamp(-o * 26, -55, 55)}deg)`;
      el.style.opacity = String(clamp(1 - a * 0.32, 0, 1));
      el.style.zIndex = String(100 - Math.round(a * 10));
    });
    setFocus(clamp(Math.round(f), 0, n - 1));
  };
  const ref = useSectionProgress('projects', layout, [list.length]);
  useEffect(() => { layout(prog.current); }, [list]); // eslint-disable-line react-hooks/exhaustive-deps

  // drag to scrub
  const drag = useRef<{ x: number; p: number; moved: boolean } | null>(null);
  const go = (k: number) => scrollWithin(ref.current, list.length > 1 ? k / (list.length - 1) : 0);

  return (
    <section id="projects" className="chapter sticky-chapter" ref={ref} style={{ height: '340vh' }} aria-labelledby="projects-title">
      <div className="sticky">
        <div className="sticky-head center">
          <Kicker accent={accentHex.violet}>Chapter 04 — Featured projects</Kicker>
          <WordReveal as="h2" text="Things I’ve built" className="h-xl" />
          <div className="tabs" role="tablist" aria-label="Filter projects">
            {filters.map((f) => (
              <button key={f} role="tab" aria-selected={filter === f} className={`tab ${filter === f ? 'is-on' : ''}`} onClick={() => { setFilter(f); go(0); }}>{f}</button>
            ))}
          </div>
        </div>
        <div
          className="flow-stage"
          data-cursor="drag"
          onPointerDown={(e) => { drag.current = { x: e.clientX, p: prog.current, moved: false }; }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            const dx = e.clientX - drag.current.x;
            if (Math.abs(dx) > 6) drag.current.moved = true;
            if (drag.current.moved) {
              const n = Math.max(1, list.length - 1);
              const p = clamp(drag.current.p - dx / (window.innerWidth * 0.35) / n, 0, 1);
              const sec = ref.current!;
              const top = sec.getBoundingClientRect().top + window.scrollY;
              const y = top + p * (sec.offsetHeight - window.innerHeight);
              if (lenisRef.current) lenisRef.current.scrollTo(y, { immediate: true });
              else window.scrollTo(0, y);
            }
          }}
          onPointerUp={() => { setTimeout(() => { drag.current = null; }, 0); }}
          onPointerLeave={() => { drag.current = null; }}
        >
          {list.map((p, k) => (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              ref={(el) => { cards.current[k] = el; }}
              className={`project-card glass ${k === focus ? 'is-focus' : ''}`}
              data-cursor="view"
              draggable={false}
              onClick={(e) => { if (drag.current?.moved) e.preventDefault(); }}
            >
              <ProjectCard p={p} index={projects.indexOf(p)} />
            </Link>
          ))}
        </div>
        <div className="flow-controls">
          <button className="icon-btn" aria-label="Previous project" onClick={() => go(focus - 1)} disabled={focus === 0}><Icon name="arrowLeft" /></button>
          <span className="muted sm">{focus + 1} / {list.length} · drag or keep scrolling</span>
          <button className="icon-btn" aria-label="Next project" onClick={() => go(focus + 1)} disabled={focus === list.length - 1}><Icon name="arrowRight" /></button>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── 05 · Clients ─────────────── */
export function Clients() {
  const chips = useRef<(HTMLElement | null)[]>([]);
  const p = useRef(0);
  const paused = useRef(false);
  const reduce = useStore((s) => s.reduceMotion);
  const ref = useSectionProgress('clients', (v) => { p.current = v; });
  useEffect(() => {
    let raf = 0, t = 0, last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000; last = now;
      if (!paused.current && !reduce) t += dt;
      const w = window.innerWidth, narrow = w < 768;
      const rx = narrow ? w * 0.34 : Math.min(560, w * 0.38), ry = rx * (narrow ? 0.62 : 0.28);
      chips.current.forEach((el, k) => {
        if (!el) return;
        const a = (k / clients.length) * Math.PI * 2 + p.current * Math.PI * 1.4 + t * 0.12;
        const depth = (Math.sin(a) + 1) / 2;
        el.style.transform = `translate3d(calc(-50% + ${Math.cos(a) * rx}px), calc(-50% + ${Math.sin(a) * ry}px), 0) scale(${0.75 + depth * 0.6})`;
        el.style.opacity = String(0.35 + depth * 0.65);
        el.style.zIndex = String(Math.round(depth * 100));
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);
  return (
    <section id="clients" className="chapter sticky-chapter" ref={ref} style={{ height: '220vh' }} aria-labelledby="clients-title">
      <div className="sticky">
        <div className="sticky-head center">
          <Kicker accent={accentHex.cyan}>Chapter 05 — Client work</Kicker>
          <WordReveal as="h2" text="Brands I’ve shipped for" className="h-xl" />
          <p className="muted measure">30+ websites across WordPress, Elementor and custom builds. Detailed case studies are shared with each client’s permission.</p>
        </div>
        <ul className="orbit">
          {clients.map((c, k) => (
            <li
              key={c}
              ref={(el) => { chips.current[k] = el; }}
              className="orbit-chip"
              onMouseEnter={() => { paused.current = true; }}
              onMouseLeave={() => { paused.current = false; }}
            >
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ─────────────── 06 · Voices ─────────────── */
export function Voices() {
  const [idx, setIdx] = useState(1);
  const n = testimonials.length;
  if (!n) return null;
  const step = (d: number) => setIdx((i) => (i + d + n) % n);
  return (
    <section id="voices" className="chapter" aria-labelledby="voices-title">
      <div className="chapter-inner col-center">
        <div className="sticky-head center">
          <Kicker accent={accentHex.pink}>Chapter 06 — Voices</Kicker>
          <WordReveal as="h2" text="Kind words" className="h-xl" />
          <p className="muted">What it’s like to build with me — from clients, leads and teammates.</p>
        </div>
        <motion.div
          className="voices"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => { if (info.offset.x < -60) step(1); else if (info.offset.x > 60) step(-1); }}
          data-cursor="drag"
        >
          {testimonials.map((t, k) => {
            let o = k - idx;
            if (o > n / 2) o -= n;
            if (o < -n / 2) o += n;
            const a = Math.abs(o);
            return (
              <motion.figure
                key={k}
                className="voice glass"
                animate={{ x: `calc(-50% + ${o * 105}%)`, rotateY: -o * 12, scale: 1 - a * 0.14, opacity: a > 1.5 ? 0 : 1 - a * 0.35, zIndex: 10 - a }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                onClick={() => setIdx(k)}
              >
                <Icon name="quote" size={22} className="accent-pink" />
                <blockquote>“{t.quote}”</blockquote>
                <figcaption>
                  <span className="avatar">{t.initials}</span>
                  <span><strong>{t.name}</strong><small>{t.role}</small></span>
                </figcaption>
              </motion.figure>
            );
          })}
        </motion.div>
        <Reveal className="flow-controls static">
          <button className="icon-btn" aria-label="Previous testimonial" onClick={() => step(-1)}><Icon name="arrowLeft" /></button>
          <span className="muted sm">{idx + 1} / {n}</span>
          <button className="icon-btn" aria-label="Next testimonial" onClick={() => step(1)}><Icon name="arrowRight" /></button>
        </Reveal>
      </div>
    </section>
  );
}
