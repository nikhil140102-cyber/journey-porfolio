// "Ask Nikhil" — answers only from the portfolio content in lib/content.ts.
// Runs fully in the browser. To plug in a real LLM later, set NEXT_PUBLIC_ASK_ENDPOINT
// to an API that accepts { question, context } and returns { answer }.

import {
  site, about, skillGroups, experience, projects, clients, education, certifications, certificationsCount, posts,
} from './content';

type Intent = { keys: string[]; answer: () => string; follow?: string[]; weight?: number };

const list = (a: string[]) => (a.length <= 1 ? a.join('') : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`);

const intents: Intent[] = [
  { keys: ['hi', 'hello', 'hey', 'namaste', 'yo'],
    answer: () => `Hi! I can answer questions about ${site.short}'s projects, skills, experience, education or availability. What would you like to know?`,
    follow: ['Tech stack', 'Current role', 'Projects'] },
  { keys: ['stack', 'skill', 'tech', 'tools', 'technolog', 'know', 'language'],
    answer: () => `Here's the toolkit: ${skillGroups.map((g) => `${g.name} — ${g.items.slice(0, 4).join(', ')}`).join('; ')}.`,
    follow: ['DevOps experience', 'WordPress work', 'Projects'] },
  { keys: ['devops', 'aws', 'cloud', 'kubernetes', 'docker', 'terraform', 'eks', 'ci/cd', 'cicd', 'pipeline', 'jenkins'],
    answer: () => `On the DevOps side, ${site.short} is a DevOps Specialist at TWS and trained through a TrainWithShubham apprenticeship. He works with ${list(skillGroups[3].items)}. Projects include ${projects.filter((p) => p.category === 'DevOps').map((p) => p.title).join(' and ')}.`,
    follow: ['E-commerce DevOps Automation', 'Writing', 'Contact'], weight: 2.5 },
  { keys: ['wordpress', 'elementor', 'woocommerce', 'shopify', 'cms'],
    answer: () => `WordPress is a big part of the story — 20+ WordPress sites at TechEnhance, client builds at The All Solutions and AvadheshCo, and tools like ${list(skillGroups[1].items)}.`,
    follow: ['Clients', 'Experience', 'Contact'], weight: 2.5 },
  { keys: ['react', 'next', 'frontend', 'front-end', 'javascript', 'tailwind', 'gsap'],
    answer: () => `Frontend: ${list(skillGroups[0].items)}. GRYNC (Next.js + GSAP) and Wall of Frames (Next.js + Tailwind) are good examples.`,
    follow: ['GRYNC', 'Wall of Frames'], weight: 2.5 },
  { keys: ['current', 'now', 'job', 'work at', 'working', 'role', 'position', 'company'],
    answer: () => `Right now ${site.short} is a ${experience[0].role} at ${experience[0].company} (${experience[0].date}, ${experience[0].place}) and a ${experience[1].role} at ${experience[1].company}.`,
    follow: ['Full experience', 'Availability'] },
  { keys: ['experience', 'career', 'history', 'background', 'worked', 'internship', 'intern'],
    answer: () => `${experience.length} stops so far: ${experience.map((e) => `${e.role} at ${e.company} (${e.date})`).join('; ')}.`,
    follow: ['Current role', 'Projects'] },
  { keys: ['project', 'built', 'portfolio', 'case study', 'work sample', 'examples'],
    answer: () => `Featured projects: ${projects.map((p) => `${p.title} — ${p.summary}`).join(' ')}`,
    follow: projects.slice(0, 3).map((p) => p.title) },
  { keys: ['client', 'brand', 'customer'],
    answer: () => `Client work includes ${list(clients)} — 30+ websites in total. Detailed case studies are shared with each client's permission.`,
    follow: ['WordPress work', 'Contact'] },
  { keys: ['education', 'degree', 'college', 'university', 'btech', 'b.tech', 'cgpa', 'study', 'studied', 'graduate'],
    answer: () => `${education.degree} from ${education.school}, ${education.years}, with a CGPA of ${education.score}/10.`,
    follow: ['Certifications'] },
  { keys: ['cert', 'course', 'badge', 'forage', 'learning'],
    answer: () => `${certificationsCount} certifications, including ${certifications.map((c) => `${c.title} (${c.issuer})`).join(', ')}.`,
    follow: ['Education'] },
  { keys: ['hire', 'available', 'availability', 'freelance', 'open to', 'contact', 'email', 'reach', 'talk', 'call'],
    answer: () => `${site.short} is open to frontend, web-engineering and DevOps roles plus freelance builds. The quickest way is the contact form in the last chapter${site.email ? ` or ${site.email}` : ''} — or LinkedIn.`,
    follow: ['Open contact form', 'LinkedIn'] },
  { keys: ['where', 'location', 'based', 'city', 'live'],
    answer: () => `Based in ${site.location}, working remotely (currently with a Pune-based team).`, follow: ['Availability'] },
  { keys: ['resume', 'résumé', 'cv'],
    answer: () => `You can download the résumé from the header menu (⌘K → “Download résumé”) or the contact chapter.`, follow: ['Contact'] },
  { keys: ['linkedin', 'github', 'social', 'follow'],
    answer: () => `LinkedIn: ${site.socials.linkedin} (${site.linkedinFollowers} followers). GitHub: ${site.socials.github}.`, follow: ['Writing'] },
  { keys: ['post', 'blog', 'writing', 'article', 'write'],
    answer: () => `Recent featured posts: ${posts.map((p) => `“${p.title}”`).join(', ')}. They're on LinkedIn today, with a blog coming soon.`, follow: ['DevOps experience'] },
  { keys: ['about', 'who', 'yourself', 'introduce', 'summary'],
    answer: () => `${site.name} — ${site.role}. ${about.body}`, follow: ['Tech stack', 'Projects'] },
];

export type Answer = { text: string; follow: string[]; action?: 'contact' | 'linkedin' | `project:${string}` };

export function localAnswer(qRaw: string): Answer {
  const q = qRaw.toLowerCase();
  // specific project mention
  const p = projects.find((pr) => q.includes(pr.title.toLowerCase()) || q.includes(pr.slug.replace(/-/g, ' ')));
  if (p) {
    return {
      text: `${p.title}: ${p.summary} Stack — ${p.stack.join(', ')}. Want to open the case study?`,
      follow: ['Open case study', 'Other projects'],
      action: `project:${p.slug}`,
    };
  }
  if (q.includes('open contact')) return { text: 'Taking you to the contact chapter…', follow: [], action: 'contact' };
  if (q === 'linkedin') return { text: `Opening LinkedIn — ${site.socials.linkedin}`, follow: [], action: 'linkedin' };
  let best: Intent | null = null;
  let score = 0;
  for (const it of intents) {
    const s = it.keys.reduce((acc, k) => acc + (q.includes(k) ? k.length : 0), 0) * (it.weight ?? 1);
    if (s > score) { score = s; best = it; }
  }
  if (best) return { text: best.answer(), follow: best.follow ?? [] };
  return {
    text: `I only know what's in this portfolio, so I might not have that one. Try asking about skills, projects, experience, education or availability.`,
    follow: ['Tech stack', 'Projects', 'Availability'],
  };
}

export async function ask(question: string): Promise<Answer> {
  const endpoint = process.env.NEXT_PUBLIC_ASK_ENDPOINT;
  if (endpoint) {
    try {
      const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question }) });
      if (r.ok) {
        const j = await r.json();
        if (j?.answer) return { text: String(j.answer), follow: [] };
      }
    } catch {}
  }
  return localAnswer(question);
}
