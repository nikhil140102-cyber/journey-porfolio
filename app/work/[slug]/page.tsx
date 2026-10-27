import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { accentHex, projects } from '@/lib/content';
import SubShell from '@/components/SubShell';
import Cover from '@/components/ui/Cover';
import Icon from '@/components/ui/Icon';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return p ? { title: `${p.title} — case study`, description: p.summary } : {};
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = projects.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];
  const accent = accentHex[p.accent];
  return (
    <SubShell>
      <main className="case" style={{ ['--accent' as string]: accent }}>
        <section className="case-hero">
          <p className="crumbs"><Link href="/#projects">Projects</Link> / {p.title}</p>
          <p className="kicker" style={{ color: accentHex.violet }}>Case study · {p.category}</p>
          <h1 className="case-title">{p.title}</h1>
          <p className="lead">{p.summary}</p>
          <dl className="case-meta">
            <div><dt>Role</dt><dd>{p.role}</dd></div>
            <div><dt>Stack</dt><dd>{p.stack.join(' · ')}</dd></div>
            <div><dt>Timeline</dt><dd>{p.timeline}</dd></div>
            <div><dt>Links</dt><dd>{p.link ? <a href={p.link} target="_blank" rel="noreferrer">{p.linkLabel} <Icon name="arrowUpRight" size={14} /></a> : 'Repository to verify'}</dd></div>
          </dl>
          <div className="case-cover"><Cover kind={p.cover} /></div>
        </section>

        <section className="case-grid">
          <div>
            <p className="kicker" style={{ color: accentHex.violet }}>01 — Overview</p>
            <h2 className="h-lg">What the project needed</h2>
          </div>
          <div>
            <p className="lead light">{p.overview}</p>
            <p className="muted sm placeholder">[ Add: your exact role, team size, constraints and timeline before publishing ]</p>
          </div>
        </section>

        <section className="case-cards">
          {[
            ['02', 'Challenge', p.challenge],
            ['03', 'Approach', p.approach],
            ['04', 'Outcome', p.outcome],
          ].map(([n, t, d]) => (
            <article key={t} className="glass case-card">
              <p className="kicker" style={{ color: accentHex.violet }}>{n} — {t}</p>
              <h3>{t}</h3>
              <p className="muted sm">{d}</p>
            </article>
          ))}
        </section>

        <section className="case-shots">
          <p className="kicker" style={{ color: accentHex.violet }}>05 — Screens</p>
          <div className="shots">
            <div className="shot big">Desktop screenshot — add a genuine capture</div>
            <div className="shot">Mobile view</div>
            <div className="shot">Interaction GIF / video</div>
          </div>
        </section>

        <section className="case-next glass">
          <div>
            <p className="kicker muted">Next project</p>
            <h2 className="h-xl">{next.title}</h2>
            <Link href={`/work/${next.slug}`} className="btn btn-primary"><span>Read next case study</span><Icon name="arrowRight" size={16} /></Link>
          </div>
          <Link href={`/work/${next.slug}`} className="case-next-cover" data-cursor="view"><Cover kind={next.cover} /></Link>
        </section>
        <footer className="case-foot"><span>© {new Date().getFullYear()} Nikhil Rana</span><Link href="/">Back to the story ↑</Link></footer>
      </main>
    </SubShell>
  );
}
