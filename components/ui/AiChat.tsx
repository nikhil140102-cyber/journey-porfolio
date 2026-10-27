'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ask } from '@/lib/ask';
import { site } from '@/lib/content';
import { setState, useStore } from '@/lib/store';
import { scrollToChapter } from '@/lib/lenis';
import Icon from './Icon';

type Msg = { from: 'ai' | 'user'; text: string };

export default function AiChat() {
  const open = useStore((s) => s.chatOpen);
  const entered = useStore((s) => s.entered);
  const router = useRouter();
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: 'ai', text: `Hi! Ask me about ${site.short}'s projects, skills, experience, education or availability.` },
  ]);
  const [follow, setFollow] = useState<string[]>(['Tech stack', 'Current role', 'Projects', 'Availability']);
  const [pending, setPending] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);
  const [value, setValue] = useState('');
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => { list.current?.scrollTo({ top: 1e6, behavior: 'smooth' }); }, [msgs, typing]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || typing) return;
    if (q === 'Open case study' && pending) { router.push(`/work/${pending}`); setState({ chatOpen: false }); return; }
    setMsgs((m) => [...m, { from: 'user', text: q }]);
    setValue('');
    setTyping(true);
    const a = await ask(q);
    if (a.action === 'contact') { setTimeout(() => { setState({ chatOpen: false }); scrollToChapter('contact'); }, 600); }
    if (a.action === 'linkedin') window.open(site.socials.linkedin, '_blank');
    if (a.action?.startsWith('project:')) setPending(a.action.split(':')[1]);
    // type the answer out
    await new Promise((r) => setTimeout(r, 450));
    setTyping(false);
    setMsgs((m) => [...m, { from: 'ai', text: '' }]);
    const words = a.text.split(' ');
    for (let i = 0; i < words.length; i++) {
      await new Promise((r) => setTimeout(r, 22));
      setMsgs((m) => {
        const c = [...m];
        c[c.length - 1] = { from: 'ai', text: words.slice(0, i + 1).join(' ') };
        return c;
      });
    }
    setFollow(a.follow);
  };

  return (
    <>
      <AnimatePresence>
        {entered && !open && (
          <motion.button
            className="chat-launcher"
            aria-label="Ask Nikhil — AI assistant"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 1.2 }}
            onClick={() => setState({ chatOpen: true })}
          >
            <Icon name="sparkle" size={16} /> <span>Ask Nikhil</span>
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <motion.section
            className="chat"
            role="dialog"
            aria-label="Ask Nikhil — AI assistant"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            data-lenis-prevent
          >
            <header className="chat-head">
              <span className="chat-avatar"><Icon name="sparkle" size={16} /></span>
              <div>
                <strong>Ask Nikhil</strong>
                <small>AI · answers from this portfolio only</small>
              </div>
              <button className="icon-btn" aria-label="Close chat" onClick={() => setState({ chatOpen: false })}><Icon name="close" /></button>
            </header>
            <div className="chat-body" ref={list}>
              {msgs.map((m, i) => (
                <div key={i} className={`bubble bubble-${m.from}`}>
                  {m.from === 'ai' && <span className="chat-avatar sm"><Icon name="sparkle" size={12} /></span>}
                  <p>{m.text}</p>
                </div>
              ))}
              {typing && <div className="bubble bubble-ai"><span className="chat-avatar sm"><Icon name="sparkle" size={12} /></span><p className="typing"><i /><i /><i /></p></div>}
              {!typing && follow.length > 0 && (
                <div className="chips">
                  {follow.map((f) => <button key={f} className="tag" onClick={() => send(f)}>{f}</button>)}
                </div>
              )}
            </div>
            <form className="chat-input" onSubmit={(e) => { e.preventDefault(); send(value); }}>
              <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Ask anything…" aria-label="Your question" />
              <button className="icon-btn primary" aria-label="Send" type="submit"><Icon name="send" size={16} /></button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
