'use client';
// About · Skills · Learning · Writing — the "card beside a 3D object" chapters.
import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion, AnimatePresence } from 'framer-motion';
import { about, accentHex, certifications, certificationsCount, education, posts, site, skillGroups } from '@/lib/content';
import { useStore } from '@/lib/store';
import { Button, Kicker, Reveal, Tilt, WordReveal } from '../ui/Motion';
import Icon, { type IconName } from '../ui/Icon';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function About() {
  const c = accentHex.cyan;
  return (
    <section id="about" className="chapter side-right" aria-labelledby="about-title">
      <div className="chapter-inner">
        <div className="pillars">
          {about.pillars.map((p, i) => (
            <Reveal key={p.title} delay={0.1 * i} className="pillar glass">
              <Icon name={p.icon as IconName} size={22} className="accent-cyan" />
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="card glass">
          <Kicker accent={c}>Chapter 01 — About</Kicker>
          <WordReveal as="h2" text={about.title} className="h-xl" />
          <p className="body">{about.body}</p>
          <ul className="tags">{about.tags.map((t) => <li key={t} className="tag">{t}</li>)}</ul>
        </Reveal>
      </div>
    </section>
  );
}

export function Skills() {
  const root = useRef<HTMLElement>(null);
  const reduce = useStore((s) => s.reduceMotion);
  useGSAP(
    () => {
      if (reduce) return;
      gsap.utils.toArray<HTMLElement>('.skill-group').forEach((g) => {
        gsap.from(g.querySelectorAll('.tag'), {
          opacity: 0, y: 14, scale: 0.9, duration: 0.5, ease: 'back.out(2)', stagger: 0.035,
          scrollTrigger: { trigger: g, start: 'top 85%', once: true },
        });
      });
    },
    { scope: root, dependencies: [reduce] },
  );
  return (
    <section id="skills" className="chapter side-left" ref={root} aria-labelledby="skills-title">
      <div className="chapter-inner">
        <Reveal className="card glass wide">
          <Kicker accent={accentHex.green}>Chapter 02 — Skills</Kicker>
          <WordReveal as="h2" text="The toolkit" className="h-lg" />
          {skillGroups.map((g) => (
            <div key={g.name} className="skill-group">
              <p className="group-label">{g.name}</p>
              <ul className="tags">{g.items.map((t) => <li key={t} className="tag">{t}</li>)}</ul>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function Learning() {
  const y = accentHex.yellow;
  return (
    <section id="learning" className="chapter side-left" aria-labelledby="learning-title">
      <div className="chapter-inner">
        <Reveal className="card glass wide">
          <Kicker accent={y}>Chapter 07 — Learning</Kicker>
          <WordReveal as="h2" text="Always compiling" className="h-lg" />
          <div className="edu">
            <div className="edu-score"><strong>{education.score}</strong><small>{education.scoreLabel}</small></div>
            <div>
              <h3>{education.degree}</h3>
              <p className="muted sm">{education.school} · {education.years}</p>
            </div>
          </div>
          <p className="group-label">Certifications &amp; learning</p>
          <ul className="certs">
            {certifications.map((c, i) => (
              <motion.li key={c.title} className="cert" initial={{ opacity: 0, rotateX: -60 }} whileInView={{ opacity: 1, rotateX: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 * i, duration: 0.6 }}>
                <span className="cert-icon"><Icon name="award" size={18} /></span>
                <span><strong>{c.title}</strong><small>{c.issuer}</small></span>
              </motion.li>
            ))}
          </ul>
          <Button variant="ghost" href={site.socials.linkedin + 'details/certifications/'} external>View all {certificationsCount} certifications</Button>
        </Reveal>
      </div>
    </section>
  );
}

export function Writing() {
  const g = accentHex.green;
  const tags = ['All', 'DevOps', 'AWS', 'Web'];
  const [tab, setTab] = useState('All');
  const shown = posts.filter((p) => tab === 'All' || p.tag === tab);
  return (
    <section id="writing" className="chapter" aria-labelledby="writing-title">
      <div className="chapter-inner split">
        <div className="intro">
          <Kicker accent={g}>Chapter 08 — Writing</Kicker>
          <WordReveal as="h2" text="Notes from the build" className="h-xl" />
          <Reveal><p className="lead">Build logs on AWS, Kubernetes, Terraform and the web — featured on LinkedIn today, on this blog soon.</p></Reveal>
          <div className="tabs" role="tablist">
            {tags.map((t) => <button key={t} role="tab" aria-selected={tab === t} className={`tab ${tab === t ? 'is-on' : ''}`} onClick={() => setTab(t)}>{t}</button>)}
          </div>
          <Button variant="ghost" href={site.socials.linkedin} external icon="linkedin">Follow on LinkedIn · {site.linkedinFollowers}</Button>
        </div>
        <div className="posts">
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => (
              <motion.a
                layout
                key={p.title}
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="post glass"
                data-cursor="view"
                initial={{ opacity: 0, y: 30, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: [-1.2, 0.8, -0.6][i % 3] }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <span className="post-cover" aria-hidden="true" />
                <span className="post-meta" style={{ color: g }}>LinkedIn · {p.tag}</span>
                <strong>{p.title}</strong>
                <span className="muted sm">{p.excerpt}</span>
              </motion.a>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export { Tilt };
