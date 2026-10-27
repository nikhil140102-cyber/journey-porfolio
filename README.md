# Nikhil Rana — 3D story portfolio

A scroll-driven, 3D storyline portfolio built with **Next.js 15 (App Router)**, **Three.js / React Three Fiber**, **GSAP + ScrollTrigger**, **Lenis** smooth scroll and **Framer Motion**. Design source: Figma file *“Nikhil — 3D Story Portfolio” → Storyboard v3*.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
```

Requires Node 18.18+ (Node 20 recommended).

## Deploy

- **Vercel (easiest):** push to GitHub → “New Project” in Vercel → import → deploy. No settings needed.
- **Netlify / any static host:** `STATIC_EXPORT=1 npm run build` → upload the `out/` folder.

## Edit your content — one file

Everything you see lives in **`lib/content.ts`**: name, role, stats, about text, skills, experience, projects (and their case-study text), clients, testimonials, education, certifications, posts and social links. The AI assistant and SEO metadata read from the same file, so they stay in sync.

## Before publishing — checklist

- [ ] `site.url` → your real domain (used for SEO, sitemap and social cards)
- [ ] `site.email` → a verified public email (turns on “Copy email” in ⌘K)
- [ ] Add `public/resume.pdf`
- [ ] Set `NEXT_PUBLIC_FORM_ENDPOINT` (copy `.env.example` → `.env.local`) — e.g. a Formspree form URL. Without it the form shows success but **doesn’t deliver**.
- [ ] Replace placeholder **testimonials** with real quotes (with permission). Empty the array to hide the chapter.
- [ ] Fill case-study `timeline` / `outcome` fields and add real screenshots
- [ ] Confirm permission to show client names
- [ ] Replace the placeholder **Privacy Policy** and **Terms** pages (`app/privacy-policy`, `app/terms`)

## How it works

| Piece | Where |
|---|---|
| 3D world, camera flight, bloom | `components/world/World.tsx` |
| 10 chapter scenes (shader planet, liquid orb, constellation, road, cover-flow panels, orbit, knot, instanced blocks, lattice, swirl portal) | `components/world/Stations.tsx` |
| Scroll → camera progress, Lenis + ScrollTrigger sync, shortcuts | `components/AppShell.tsx` |
| Chapters (HTML over the canvas) | `components/chapters/*` |
| Preloader, header, chapter dots, ⌘K palette, AI chat, settings, custom cursor, toast | `components/ui/*` |
| Case-study pages | `app/work/[slug]/page.tsx` |
| “Ask Nikhil” answers | `lib/ask.ts` |
| Generative ambient sound | `lib/sound.ts` |

### Features
- Preloader with **Enter with sound / Enter quietly**
- Camera flies through 10 chapters as you scroll; pinned scroll sequences for Experience (fly-through road), Projects (3D cover-flow, draggable, filterable), Clients (orbit) and Voices (swipe carousel)
- **⌘K / Ctrl+K command palette** (or press `/`) — jump to chapters, open case studies, download résumé, toggle sound
- **Ask Nikhil** AI assistant — answers only from portfolio content; set `NEXT_PUBLIC_ASK_ENDPOINT` to plug in a real LLM later
- **Experience settings** — sound, reduce motion, custom cursor, graphics quality (Auto / High / Low), remembered per visitor
- **Custom cursor** — dot + trailing ring, hover / View / Drag / text / press states, magnetic buttons; auto-off on touch devices
- Contact form with validation, honeypot spam trap, **required consent checkbox** (Privacy Policy + T&C), success and error states
- Case-study template per project, 404 “lost in space” page, sitemap, robots, Open Graph and JSON-LD Person schema
- Accessibility: keyboard navigation, focus rings, skip link, `prefers-reduced-motion` respected (camera cuts instead of flights, no auto-animations)
- Performance: per-station mounting/culling, DPR clamp, auto quality tier, postprocessing only on High

## Roadmap ideas
- Real blog (MDX) at `/writing`
- Case-study screenshots / video
- LLM-backed “Ask Nikhil” (API route + your key)
- Hindi / English toggle
"# journey-porfolio" 
