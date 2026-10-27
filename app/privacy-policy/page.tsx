import SubShell from '@/components/SubShell';

export const metadata = { title: 'Privacy Policy' };

export default function Privacy() {
  return (
    <SubShell>
      <main className="legal">
        <h1 className="h-xl">Privacy Policy</h1>
        <p className="muted">TODO — replace with your final policy before publishing.</p>
        <h2>What the contact form collects</h2>
        <p>Your name, email address and message, used only to reply to you. Nothing is sold or shared for marketing.</p>
        <h2>Settings stored in your browser</h2>
        <p>Your sound, motion, cursor and graphics-quality preferences are saved in your browser’s local storage so the site remembers them. They never leave your device.</p>
        <h2>Contact</h2>
        <p>Questions about your data? Reach out via the contact form or LinkedIn.</p>
      </main>
    </SubShell>
  );
}
