'use client';
import { useRef } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { animate, useInView } from 'framer-motion';
import { useEffect, useState } from 'react';
import { site, stats } from '@/lib/content';
import { useStore } from '@/lib/store';
import { scrollToChapter } from '@/lib/lenis';
import { Button } from '../ui/Motion';
import Icon from '../ui/Icon';

gsap.registerPlugin(SplitText, useGSAP);

function Counter({ value, run }: { value: string; run: boolean }) {
  const m = value.match(/^([\d.]+)(.*)$/);
  const num = m ? parseFloat(m[1]) : 0;
  const suffix = m ? m[2] : value;
  const decimals = m && m[1].includes('.') ? m[1].split('.')[1].length : 0;
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    const c = animate(0, num, { duration: 1.8, ease: [0.22, 1, 0.36, 1], onUpdate: setV });
    return () => c.stop();
  }, [run, num]);
  return <>{v.toFixed(decimals)}{suffix}</>;
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const entered = useStore((s) => s.entered);
  const reduce = useStore((s) => s.reduceMotion);
  const statsRef = useRef<HTMLDListElement>(null);
  const inView = useInView(statsRef, { once: true });

  useGSAP(
    () => {
      if (!entered) return;
      if (reduce) { gsap.set('.hero-fade, .hero-name', { opacity: 1 }); return; }
      const split = SplitText.create('.hero-name .line', { type: 'chars', mask: 'chars' });
      const tl = gsap.timeline({ delay: 0.35 });
      tl.set('.hero-name', { opacity: 1 })
        .from(split.chars, { yPercent: 120, rotate: 6, duration: 1.1, ease: 'expo.out', stagger: 0.035 })
        .from('.hero-fade', { y: 24, opacity: 0, filter: 'blur(8px)', duration: 0.9, ease: 'power3.out', stagger: 0.08 }, '-=0.8');
      return () => split.revert();
    },
    { scope: root, dependencies: [entered, reduce] },
  );

  return (
    <section id="hero" className="chapter side-left" data-chapter="0" ref={root} aria-label="Introduction">
      <div className="chapter-inner">
        <div className="hero-copy">
          <p className="badge hero-fade"><span className="pulse" />{site.availability}</p>
          <p className="kicker hero-fade" style={{ color: '#7C5CFF' }}>{site.role}</p>
          <h1 className="hero-name" aria-label={site.name}>
            <span className="line">Nikhil</span>
            <span className="line outline">Rana.</span>
          </h1>
          <p className="hero-stack hero-fade">{site.stackLine.join('  ·  ')}</p>
          <p className="lead hero-fade">{site.intro}</p>
          <div className="row hero-fade">
            <Button onClick={() => scrollToChapter('about')}>Start the story</Button>
            <Button variant="ghost" icon="download" href={site.resumeUrl} external>Download résumé</Button>
          </div>
          <dl className="stats hero-fade" ref={statsRef}>
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="stat-value"><Counter value={s.value} run={inView && entered} /></dd>
                <dd className="stat-label">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="hero-location hero-fade"><Icon name="pin" size={14} /> {site.location}</p>
        <div className="scroll-hint hero-fade" aria-hidden="true"><span className="mouse"><i /></span>Scroll to begin</div>
      </div>
    </section>
  );
}
