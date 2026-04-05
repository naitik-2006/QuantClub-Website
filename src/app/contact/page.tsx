'use client';

import { useState, useRef, FormEvent } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Mail,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  MessageCircle,
  Send,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Calendar,
} from 'lucide-react';

/* ─── Data ─── */
const CONTACT_INFO = [
  {
    icon: Mail,
    label: 'EMAIL US',
    value: 'thequantclub.iitbhu@gmail.com',
    href: 'mailto:thequantclub.iitbhu@gmail.com',
    sub: 'We check this daily',
  },
  {
    icon: Linkedin,
    label: 'LINKEDIN',
    value: 'The Quant Club IIT BHU',
    href: 'https://www.linkedin.com/company/the-quant-club-iit-bhu-varanasi/',
    sub: 'Follow us for updates',
  },
  {
    icon: MapPin,
    label: 'FIND US',
    value: 'IIT BHU Varanasi\nUttar Pradesh, India',
    href: '#',
    sub: 'During semester weeks',
  },
  {
    icon: Calendar,
    label: 'WEEKLY MEETINGS',
    value: 'Every Thursday · 6 PM',
    href: '/calendar',
    sub: 'Open to all members',
  },
];

const SOCIALS = [
  { icon: Linkedin,      label: 'LinkedIn',  href: 'https://www.linkedin.com/company/the-quant-club-iit-bhu-varanasi/' },
];

const SUBJECTS = [
  'Join The Club',
  'General Question',
  'Project Idea',
  'Workshop / Speaker Suggestion',
  'Just Saying Hi',
  'Other',
];

/* ─── FloatingInput ─── */
function FloatingInput({
  id, label, type = 'text', required, value, onChange,
}: {
  id: string; label: string; type?: string;
  required?: boolean; value: string; onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className="relative pt-5">
      <label
        htmlFor={id}
        className={`absolute font-mono text-xs tracking-[0.12em] transition-all duration-300 pointer-events-none
          ${active ? '-top-0 left-0 text-[0.58rem] text-electric-cyan tracking-[0.2em]' : 'top-5 left-0 text-silver/40'}`}
      >
        {label}{required && ' *'}
      </label>
      <input
        id={id} type={type} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        className="input-glow w-full pb-2.5 pt-1 text-sm text-white font-sans tracking-wide bg-transparent"
        style={{
          borderBottomColor: focused ? 'rgba(0,255,255,0.8)' : 'rgba(255,255,255,0.1)',
          boxShadow: focused ? '0 2px 0 0 rgba(0,255,255,0.3)' : 'none',
        }}
      />
    </div>
  );
}

/* ─── FloatingTextarea ─── */
function FloatingTextarea({
  id, label, required, value, onChange,
}: {
  id: string; label: string; required?: boolean;
  value: string; onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className="relative pt-5">
      <label
        htmlFor={id}
        className={`absolute font-mono text-xs tracking-[0.12em] transition-all duration-300 pointer-events-none
          ${active ? '-top-0 left-0 text-[0.58rem] text-electric-cyan tracking-[0.2em]' : 'top-5 left-0 text-silver/40'}`}
      >
        {label}{required && ' *'}
      </label>
      <textarea
        id={id} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        rows={5}
        className="input-glow w-full pb-2 pt-1 text-sm text-white font-sans tracking-wide resize-none bg-transparent"
        style={{
          borderBottomColor: focused ? 'rgba(0,255,255,0.8)' : 'rgba(255,255,255,0.1)',
          boxShadow: focused ? '0 2px 0 0 rgba(0,255,255,0.3)' : 'none',
        }}
      />
    </div>
  );
}

/* ─── FloatingSelect ─── */
function FloatingSelect({
  id, label, value, onChange, options,
}: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; options: string[];
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className="relative pt-5">
      <label
        htmlFor={id}
        className={`absolute font-mono text-xs tracking-[0.12em] transition-all duration-300 pointer-events-none z-10
          ${active ? '-top-0 left-0 text-[0.58rem] text-electric-cyan tracking-[0.2em]' : 'top-5 left-0 text-silver/40'}`}
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id} value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="appearance-none input-glow w-full pb-2.5 pt-1 text-sm text-white font-sans tracking-wide bg-transparent pr-6 cursor-pointer"
          style={{
            borderBottomColor: focused ? 'rgba(0,255,255,0.8)' : 'rgba(255,255,255,0.1)',
            boxShadow: focused ? '0 2px 0 0 rgba(0,255,255,0.3)' : 'none',
          }}
        >
          <option value="" disabled hidden />
          {options.map(o => (
            <option key={o} value={o} className="bg-[#0A0A0A] text-white">{o}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-0 bottom-2.5 w-3.5 h-3.5 text-silver/30 pointer-events-none" />
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function ContactPage() {
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const formRef  = useRef(null);
  const infoRef  = useRef(null);
  const formView = useInView(formRef, { once: true, margin: '-60px' });
  const infoView = useInView(infoRef, { once: true, margin: '-60px' });

  const [honeypot, setHoneypot] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, honeypot }),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-24 px-5 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 space-y-4"
        >
          <p className="section-label">// CONTACT</p>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-none text-white">
            GET IN<br />
            <span className="text-electric-cyan">TOUCH.</span>
          </h1>
          <p className="text-silver text-sm leading-relaxed max-w-lg">
            Interested in joining, have a project idea, or just curious about what we do?
            Drop us a message — we reply fast.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-20">

          {/* ══════════════════════════════
              FORM
          ══════════════════════════════ */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, y: 28 }}
            animate={formView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-sm p-10 sm:p-14 text-center space-y-4"
              >
                <motion.div
                  animate={{ scale: [0.8, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <CheckCircle className="w-12 h-12 text-electric-cyan mx-auto" strokeWidth={1} />
                </motion.div>
                <h3 className="text-white text-xl font-bold">You're all set.</h3>
                <p className="text-silver/60 text-sm leading-relaxed max-w-xs mx-auto">
                  Message received! We'll get back to{' '}
                  <span className="text-electric-cyan font-mono text-xs">{email}</span>{' '}
                  soon. In the meantime, join our Discord for the fastest responses.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <a
                    href="#"
                    className="font-mono text-xs tracking-[0.15em] px-5 py-2.5 border border-electric-cyan/40 text-electric-cyan hover:bg-electric-cyan hover:text-black transition-all duration-200 rounded-sm"
                  >
                    JOIN DISCORD
                  </a>
                  <button
                    onClick={() => { setStatus('idle'); setName(''); setEmail(''); setSubject(''); setMessage(''); }}
                    className="font-mono text-xs tracking-[0.15em] text-silver/35 hover:text-electric-cyan transition-colors"
                  >
                    SEND ANOTHER →
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-7">
                {/* Honeypot — hidden from real users, bots will fill it */}
                <input
                  type="text"
                  name="honeypot"
                  value={honeypot}
                  onChange={e => setHoneypot(e.target.value)}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                  <FloatingInput id="name"  label="YOUR NAME"      value={name}  onChange={setName}  required />
                  <FloatingInput id="email" label="STUDENT EMAIL"  type="email" value={email} onChange={setEmail} required />
                </div>
                <FloatingSelect id="subject" label="WHAT'S UP?" value={subject} onChange={setSubject} options={SUBJECTS} />
                <FloatingTextarea id="message" label="YOUR MESSAGE" value={message} onChange={setMessage} required />

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="font-mono text-xs">Something went wrong. Try again or DM us on Discord.</span>
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={status === 'loading'}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="group relative inline-flex items-center gap-2.5 px-8 py-4 bg-electric-cyan text-black font-mono text-xs tracking-[0.18em] font-semibold hover:shadow-[0_0_24px_rgba(0,255,255,0.5)] transition-all duration-300 rounded-sm disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
                >
                  {status === 'loading' ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                        className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full"
                      />
                      SENDING...
                    </>
                  ) : (
                    <>
                      SEND MESSAGE
                      <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                    </>
                  )}
                  <div className="absolute inset-0 bg-black/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* ══════════════════════════════
              INFO SIDEBAR
          ══════════════════════════════ */}
          <motion.div
            ref={infoRef}
            initial={{ opacity: 0, y: 28 }}
            animate={infoView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {CONTACT_INFO.map(({ icon: Icon, label, value, href, sub }, i) => (
              <motion.a
                key={label}
                href={href}
                initial={{ opacity: 0, x: 16 }}
                animate={infoView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.09, duration: 0.45 }}
                whileHover={{ x: 4, transition: { duration: 0.18 } }}
                className="flex items-start gap-4 group cursor-pointer block"
              >
                <div className="w-9 h-9 border border-electric-cyan/20 rounded flex items-center justify-center bg-electric-cyan/5 flex-shrink-0 group-hover:border-electric-cyan/50 group-hover:bg-electric-cyan/10 transition-all duration-300 mt-0.5">
                  <Icon className="w-4 h-4 text-electric-cyan" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="section-label text-[0.56rem] mb-0.5">{label}</p>
                  <p className="text-white/80 text-sm leading-snug whitespace-pre-line group-hover:text-white transition-colors duration-200">
                    {value}
                  </p>
                  <p className="font-mono text-[0.58rem] tracking-wider text-silver/30 mt-0.5">{sub}</p>
                </div>
              </motion.a>
            ))}

            {/* Divider */}
            <div className="h-px bg-white/5 my-2" />

            {/* Socials */}
            <div>
              <p className="section-label mb-4">FOLLOW US</p>
              <div className="flex items-center gap-2.5 flex-wrap">
                {SOCIALS.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-9 h-9 border border-white/10 rounded flex items-center justify-center text-silver/40 hover:border-electric-cyan/55 hover:text-electric-cyan hover:shadow-[0_0_10px_rgba(0,255,255,0.25)] transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Membership note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={infoView ? { opacity: 1 } : {}}
              transition={{ delay: 0.55 }}
              className="glass-card rounded-sm p-5 space-y-2"
            >
              <p className="section-label">MEMBERSHIP</p>
              <p className="text-white/70 text-sm leading-relaxed">
                Applications open at the start of each semester. No prior experience required —
                just curiosity and drive.
              </p>
              <a
                href="/calendar"
                className="inline-block font-mono text-[0.62rem] tracking-[0.14em] text-electric-cyan/70 hover:text-electric-cyan transition-colors mt-1"
              >
                SEE UPCOMING SESSIONS →
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
