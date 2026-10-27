// Single source of truth for every word on the site.
// Edit here — chapters, case studies, the AI assistant and SEO all read from this file.

export const site = {
  name: 'Nikhil Rana',
  short: 'Nikhil',
  role: 'Web Developer · DevOps Engineer',
  stackLine: ['React.js', 'Next.js', 'WordPress', 'AWS', 'Terraform'],
  location: 'Dholpur, Rajasthan, India',
  available: true,
  availability: 'Available for work',
  url: 'https://nikhilrana.dev', // TODO: replace with your real domain
  // TODO: add a verified public email before publishing (leave empty to hide "Copy email").
  email: '',
  resumeUrl: '/resume.pdf', // TODO: drop your résumé PDF into /public/resume.pdf
  socials: {
    github: 'https://github.com/nikhil140102-cyber',
    linkedin: 'https://www.linkedin.com/in/nikhil-rana-devops/',
  },
  linkedinFollowers: '2.9K+',
  intro:
    'I build fast, accessible websites and the scalable, automated AWS infrastructure that runs them — 30+ sites shipped across client and personal projects.',
};

export type Accent = 'violet' | 'cyan' | 'pink' | 'yellow' | 'green';
export const accentHex: Record<Accent, string> = {
  violet: '#7C5CFF',
  cyan: '#22D3EE',
  pink: '#F472B6',
  yellow: '#FACC15',
  green: '#34D399',
};

export type ChapterId =
  | 'hero' | 'about' | 'skills' | 'experience' | 'projects'
  | 'clients' | 'voices' | 'learning' | 'writing' | 'contact';

export const chapters: { id: ChapterId; label: string; accent: Accent; side: 'left' | 'right' | 'center' }[] = [
  { id: 'hero', label: 'Hero', accent: 'violet', side: 'left' },
  { id: 'about', label: 'About', accent: 'cyan', side: 'right' },
  { id: 'skills', label: 'Skills', accent: 'green', side: 'left' },
  { id: 'experience', label: 'Experience', accent: 'pink', side: 'center' },
  { id: 'projects', label: 'Projects', accent: 'violet', side: 'center' },
  { id: 'clients', label: 'Clients', accent: 'cyan', side: 'center' },
  { id: 'voices', label: 'Voices', accent: 'pink', side: 'center' },
  { id: 'learning', label: 'Learning', accent: 'yellow', side: 'left' },
  { id: 'writing', label: 'Writing', accent: 'green', side: 'center' },
  { id: 'contact', label: 'Contact', accent: 'violet', side: 'right' },
];

export const stats = [
  { value: '30+', label: 'Websites shipped' },
  { value: '20+', label: 'WordPress builds' },
  { value: '8.4', label: 'CGPA · B.Tech CSE' },
  { value: '2.9K+', label: 'LinkedIn followers' },
];

export const about = {
  title: 'Websites that are fast, accessible & built to last',
  body:
    'I design and implement scalable, secure, high-performing cloud infrastructure — and the responsive, client-focused websites that run on it. B.Tech CSE (2025), now shipping at AvadheshCo and TWS.',
  tags: ['Now @ AvadheshCo', 'DevOps @ TWS', 'Open to roles'],
  pillars: [
    { title: 'Frontend', text: 'React, Next.js & Tailwind interfaces', icon: 'code' },
    { title: 'WordPress', text: 'Elementor, WooCommerce & Shopify builds', icon: 'globe' },
    { title: 'DevOps', text: 'AWS, Docker & CI/CD pipelines', icon: 'cloud' },
  ],
};

export const skillGroups = [
  { name: 'Frontend', items: ['React.js', 'Next.js', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Responsive design'] },
  { name: 'CMS / E-commerce', items: ['WordPress', 'Elementor', 'WooCommerce', 'Shopify'] },
  { name: 'Backend / Data', items: ['Node.js', 'Express.js', 'REST APIs', 'MongoDB', 'PHP', 'Python', 'SQL'] },
  { name: 'Cloud / DevOps', items: ['AWS · EC2 · S3 · IAM · EKS', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'GitLab CI/CD'] },
  { name: 'Tools / Deployment', items: ['Git', 'GitHub', 'Figma', 'VS Code', 'Vercel', 'Netlify', 'Prometheus', 'Grafana'] },
];

export const experience = [
  { role: 'Web Developer', company: 'AvadheshCo / Avadhesh Consulting', date: 'Jun 2025 – Present', place: 'Pune · Remote',
    text: 'Client websites and frontend projects — design, development and optimisation of scalable web apps, WordPress updates and deployment support.' },
  { role: 'DevOps Specialist', company: 'TWS — TrainWithShubham', date: '2025 – Present', place: 'Remote',
    text: 'Cloud infrastructure, containers and CI/CD on AWS — automating deploys and monitoring.' },
  { role: 'DevOps Trainee', company: 'TrainWithShubham · Apprenticeship', date: 'Feb – May 2025', place: 'Pune · Remote',
    text: 'Trained in core DevOps technologies and real-world cloud infrastructure workflows — Docker, Kubernetes and more.' },
  { role: 'Web Developer', company: 'The All Solutions', date: 'Dec 2024 – Jan 2025', place: 'Full-time',
    text: 'Developed responsive, client-focused WordPress websites with performance optimisation.' },
  { role: 'WordPress Developer', company: 'TechEnhance', date: '2023 – 2024', place: 'Bengaluru',
    text: 'Worked on 20+ WordPress websites with responsive layouts, SEO, security and performance optimisation.' },
  { role: 'WordPress Intern', company: 'Digitally Please', date: '2023', place: 'Internship',
    text: 'Supported website development, security reviews, SEO and performance audits.' },
  { role: 'API Integration Intern', company: 'Caelius Consulting', date: '2022 – 2023', place: 'Mohali',
    text: 'Exposure to MuleSoft, Anypoint Platform and enterprise API integrations.' },
  { role: 'Interview Coordinator', company: 'Indian School of Business', date: '2022 – 2023', place: 'Mohali',
    text: 'Interview coordination, stakeholder communication and operations.' },
];

export type CoverKind = 'grync' | 'frames' | 'dashboard' | 'devops' | 'pipeline';
export type Project = {
  slug: string; title: string; summary: string; stack: string[]; category: 'Frontend' | 'WordPress' | 'DevOps';
  cover: CoverKind; accent: Accent; link?: string; linkLabel: string;
  overview: string; challenge: string; approach: string; outcome: string; role: string; timeline: string;
};

export const projects: Project[] = [
  { slug: 'grync', title: 'GRYNC', category: 'Frontend', cover: 'grync', accent: 'yellow',
    summary: 'Business-intelligence website — responsive navigation, hero and service sections with GSAP-powered interactions.',
    stack: ['Next.js', 'React', 'CSS', 'GSAP'], link: 'https://github.com/Grync-Technologies/GRYNC', linkLabel: 'View on GitHub',
    role: 'Frontend developer', timeline: 'Add dates',
    overview: 'GRYNC needed a modern website to present its business-intelligence services: responsive navigation, a confident hero and service sections that feel interactive without slowing the page down.',
    challenge: 'Make dense BI services easy to scan on every screen size.',
    approach: 'Component-based Next.js build, responsive layouts and GSAP scroll interactions for each section.',
    outcome: 'Add a verified result — launch date, performance score or client feedback.' },
  { slug: 'wall-of-frames', title: 'Wall of Frames', category: 'Frontend', cover: 'frames', accent: 'pink',
    summary: 'Responsive web app — UI implementation plus deployment configuration.',
    stack: ['Next.js', 'React', 'Tailwind CSS'], link: 'https://github.com/nikhil140102-cyber/ava-wallOfFrame', linkLabel: 'View on GitHub',
    role: 'Frontend developer', timeline: 'Add dates',
    overview: 'A responsive web application built from a Figma design, with the UI implemented in Next.js and Tailwind CSS and deployment configured end to end.',
    challenge: 'Translate the design faithfully across breakpoints while keeping the codebase easy to extend.',
    approach: 'Reusable Tailwind components, responsive grid layouts and a deployment pipeline configured alongside the app.',
    outcome: 'Add a verified result before publishing.' },
  { slug: 'mern-dashboard', title: 'Avadhesh MERN Dashboard', category: 'Frontend', cover: 'dashboard', accent: 'cyan',
    summary: 'Role-based admin, manager, team and client dashboard with lead tracking, status management and structured imports.',
    stack: ['React', 'Tailwind CSS', 'Express.js', 'MongoDB'], linkLabel: 'Case study',
    role: 'Full-stack developer', timeline: 'In development',
    overview: 'An internal dashboard with role-based views for admins, managers, team members and clients — tracking leads, statuses and structured data imports.',
    challenge: 'Four roles, one codebase: each person should only see and do what their role allows.',
    approach: 'React + Tailwind front end over an Express.js and MongoDB API, with role-based access and structured import flows.',
    outcome: 'Live URL to verify — add once deployed.' },
  { slug: 'ecommerce-devops', title: 'E-commerce DevOps Automation', category: 'DevOps', cover: 'devops', accent: 'green',
    summary: 'Containerised app infrastructure with CI/CD and monitoring workflows.',
    stack: ['AWS EKS', 'Terraform', 'Jenkins', 'ArgoCD', 'Helm', 'Prometheus', 'Grafana'], linkLabel: 'Case study',
    role: 'DevOps engineer', timeline: 'Add dates',
    overview: 'Infrastructure and delivery pipeline for a containerised e-commerce application on AWS EKS.',
    challenge: 'Repeatable environments, safe deploys and visibility into a multi-service app.',
    approach: 'Terraform for infrastructure, Jenkins + ArgoCD + Helm for delivery, Prometheus and Grafana for monitoring.',
    outcome: 'Repository to verify — add link and results.' },
  { slug: 'django-notes-cicd', title: 'Django Notes CI/CD', category: 'DevOps', cover: 'pipeline', accent: 'yellow',
    summary: 'Notes application deployed through a GitLab CI/CD pipeline.',
    stack: ['Django', 'Python', 'AWS EC2', 'GitLab CI/CD'], linkLabel: 'Case study',
    role: 'DevOps engineer', timeline: 'Add dates',
    overview: 'A Django notes application shipped to AWS EC2 through an automated GitLab CI/CD pipeline.',
    challenge: 'Every push should be tested, built and deployed without manual steps.',
    approach: 'GitLab CI/CD stages for test, build and deploy targeting an EC2 host.',
    outcome: 'Repository to verify — add link and results.' },
];

export const clients = ['Sunshine', 'Brick2Wall', 'Drivuum', 'Avagift', 'Avazone', 'Nita TCC', 'Drink Insider'];

// TODO: replace with real quotes (with permission) — the section hides itself if this array is empty.
export const testimonials = [
  { quote: 'Quote from a client or manager goes here — add real words with their permission.', name: 'Client name', role: 'Role · Company', initials: 'AB' },
  { quote: 'Quote from a team lead goes here — what it was like to ship with Nikhil.', name: 'Team lead name', role: 'Role · Company', initials: 'CD' },
  { quote: 'Quote from a client goes here — the result they cared about most.', name: 'Client name', role: 'Role · Company', initials: 'EF' },
];

export const education = {
  degree: 'B.Tech, Computer Science Engineering',
  school: 'Swami Vivekanand Institute of Engineering & Technology (SVIET), Rajpura · Punjab Technical University',
  years: 'Sep 2021 – Jun 2025',
  score: '8.4',
  scoreLabel: 'CGPA / 10',
};

export const certifications = [
  { title: 'AWS Solutions Architecture', issuer: 'Job Simulation · Forage' },
  { title: 'Deloitte Data Analytics', issuer: 'Job Simulation · Forage · Jun 2026' },
  { title: 'Gemini Certified', issuer: 'University Student' },
  { title: 'AWS Educate', issuer: '7 learning badges' },
];
export const certificationsCount = 9;

export const posts = [
  { tag: 'AWS', title: 'Automating multi-environment AWS EC2', excerpt: 'Provisioning dev, staging and prod EC2 environments automatically.', href: 'https://www.linkedin.com/in/nikhil-rana-devops/recent-activity/all/' },
  { tag: 'DevOps', title: 'Built a live monitoring dashboard for my Python app', excerpt: 'What I tracked, how it’s wired and why it matters in production.', href: 'https://www.linkedin.com/in/nikhil-rana-devops/recent-activity/all/' },
  { tag: 'DevOps', title: 'Just deployed an EKS cluster using Terraform', excerpt: 'Spinning up Amazon EKS end to end with infrastructure as code.', href: 'https://www.linkedin.com/in/nikhil-rana-devops/recent-activity/all/' },
];
