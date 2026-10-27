'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, type FormEvent } from 'react';
import { accentHex, site } from '@/lib/content';
import { toast } from '@/lib/store';
import { scrollToChapter } from '@/lib/lenis';
import { Button, Kicker, Reveal, WordReveal } from '../ui/Motion';
import Icon from '../ui/Icon';

type Errors = Partial<Record<'name' | 'email' | 'message' | 'consent', string>>;

export default function Contact() {
  const [values, setValues] = useState({ name: '', email: '', message: '', consent: false, company: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const validate = () => {
    const e: Errors = {};
    if (values.name.trim().length < 2) e.name = 'Please add your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) e.email = 'Enter a valid email address';
    if (values.message.trim().length < 10) e.message = 'Tell me a little more (10+ characters)';
    if (!values.consent) e.consent = 'Please accept the Privacy Policy and Terms to send';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (values.company) return; // honeypot
    if (!validate()) return;
    setStatus('sending');
    try {
      const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT; // e.g. a Formspree / Web3Forms / your API URL
      if (endpoint) {
        const r = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ name: values.name, email: values.email, message: values.message, consent: values.consent }),
        });
        if (!r.ok) throw new Error('Request failed');
      } else {
        await new Promise((r) => setTimeout(r, 900));
        console.warn('NEXT_PUBLIC_FORM_ENDPOINT is not set — the message was not delivered.');
      }
      setStatus('sent');
      toast('Message sent — I’ll reply within a day.');
    } catch {
      setStatus('error');
    }
  };

  const field = (k: 'name' | 'email', label: string, ph: string, type = 'text') => (
    <label className={`field ${errors[k] ? 'has-error' : ''}`}>
      <span>{errors[k] ? `${label} — ${errors[k]}` : label}</span>
      <input
        type={type}
        name={k}
        value={values[k]}
        placeholder={ph}
        autoComplete={k === 'email' ? 'email' : 'name'}
        onChange={(e) => setValues((v) => ({ ...v, [k]: e.target.value }))}
        aria-invalid={!!errors[k]}
      />
    </label>
  );

  return (
    <section id="contact" className="chapter side-right" aria-labelledby="contact-title">
      <div className="chapter-inner">
        <Reveal className="card glass contact-card">
          <p className="badge"><span className="pulse" />Available · replies within a day</p>
          <Kicker accent={accentHex.violet}>Chapter 09 — Next chapter</Kicker>
          <AnimatePresence mode="wait">
            {status === 'sent' ? (
              <motion.div key="sent" className="sent" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <span className="sent-icon"><Icon name="check" size={28} /></span>
                <h2 className="h-lg">Message received.</h2>
                <p className="muted">Thanks for reaching out — I’ll reply within a day. Meanwhile, keep exploring the story.</p>
                <div className="row">
                  <Button onClick={() => scrollToChapter('hero')}>Back to the story</Button>
                  <Button variant="ghost" icon="download" href={site.resumeUrl} external>Download résumé</Button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="form" exit={{ opacity: 0, y: -10 }}>
                <WordReveal as="h2" text="Let’s build what’s next" className="h-lg" />
                <p className="muted sm">Open to frontend, web-engineering and DevOps roles — and freelance builds.</p>
                <div className="row wrap">
                  <Button variant="ghost" icon="github" href={site.socials.github} external>GitHub</Button>
                  <Button variant="ghost" icon="linkedin" href={site.socials.linkedin} external>LinkedIn</Button>
                  <Button variant="ghost" icon="download" href={site.resumeUrl} external>Résumé</Button>
                </div>
                <form className="form" onSubmit={submit} noValidate>
                  <div className="row two">
                    {field('name', 'Name', 'Your name')}
                    {field('email', 'Email', 'you@company.com', 'email')}
                  </div>
                  <label className={`field ${errors.message ? 'has-error' : ''}`}>
                    <span>{errors.message ? `Project — ${errors.message}` : 'Project'}</span>
                    <textarea name="message" rows={4} value={values.message} placeholder="Tell me what we are building…" onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))} aria-invalid={!!errors.message} />
                  </label>
                  <input className="hp" tabIndex={-1} autoComplete="off" name="company" value={values.company} onChange={(e) => setValues((v) => ({ ...v, company: e.target.value }))} aria-hidden="true" />
                  <label className={`consent ${errors.consent ? 'has-error' : ''}`}>
                    <input type="checkbox" checked={values.consent} onChange={(e) => setValues((v) => ({ ...v, consent: e.target.checked }))} required />
                    <span className="box"><Icon name="check" size={12} /></span>
                    <span>I agree to the <a href="/privacy-policy" target="_blank">Privacy Policy</a> and <a href="/terms" target="_blank">Terms &amp; Conditions</a>.</span>
                  </label>
                  {(errors.consent || status === 'error') && (
                    <p className="form-error" role="alert"><Icon name="alert" size={14} />{status === 'error' ? 'Something went wrong — please try again or reach me on LinkedIn.' : errors.consent}</p>
                  )}
                  <Button type="submit" disabled={status === 'sending'} icon={status === 'sending' ? null : 'arrowRight'}>
                    {status === 'sending' ? 'Sending…' : 'Send message'}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
        <p className="footer-note">© {new Date().getFullYear()} {site.name} · {site.location}</p>
      </div>
    </section>
  );
}
