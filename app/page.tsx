import AppShell from '@/components/AppShell';
import Hero from '@/components/chapters/Hero';
import { About, Skills, Learning, Writing } from '@/components/chapters/Simple';
import { Experience, Projects, Clients, Voices } from '@/components/chapters/Sticky';
import Contact from '@/components/chapters/Contact';

export default function Home() {
  return (
    <AppShell>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Clients />
      <Voices />
      <Learning />
      <Writing />
      <Contact />
    </AppShell>
  );
}
