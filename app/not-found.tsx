import Link from 'next/link';
import SubShell from '@/components/SubShell';
import Icon from '@/components/ui/Icon';

export default function NotFound() {
  return (
    <SubShell>
      <main className="lost">
        <div className="lost-planet" aria-hidden="true"><span /></div>
        <p className="kicker" style={{ color: '#7C5CFF' }}>Error 404 — lost in space</p>
        <h1 className="lost-code">404</h1>
        <h2 className="h-lg">This page drifted out of orbit.</h2>
        <p className="lead">The link may be old or mistyped. Head back to the story, or press <kbd>⌘K</kbd> to jump anywhere.</p>
        <Link href="/" className="btn btn-primary"><span>Back to the story</span><Icon name="arrowRight" size={16} /></Link>
      </main>
    </SubShell>
  );
}
