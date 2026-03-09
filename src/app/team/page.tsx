'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

/* ─── Types ─── */
interface Member {
  id: number;
  name: string;
  role: string;
  department: string;
  tags: string[];
  github?: string;
  linkedin?: string;
  email?: string;
  gradient: string;
}

/* ─── Data ─── */
const LEADERSHIP: Member[] = [
  {
    id: 1,
    name: 'John Doe',
    role: 'PRESIDENT',
    department: 'Quantitative Research',
    tags: ['STAT ARB', 'C++', 'DERIVATIVES'],
    github: '#', linkedin: '#', email: '#',
    gradient: 'from-cyan-900/40 to-cyan-800/20',
  },
  {
    id: 2,
    name: 'Jane Smith',
    role: 'VICE PRESIDENT',
    department: 'Algorithmic Trading',
    tags: ['ALGO TRADING', 'PYTHON', 'ML'],
    github: '#', linkedin: '#', email: '#',
    gradient: 'from-violet-900/40 to-violet-800/20',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    role: 'HEAD OF RESEARCH',
    department: 'Portfolio Theory',
    tags: ['PORTFOLIO OPT', 'R', 'RISK'],
    github: '#', linkedin: '#',
    gradient: 'from-blue-900/40 to-blue-800/20',
  },
];

const OFFICERS: Member[] = [
  {
    id: 4,
    name: 'Alice Brown',
    role: 'ML LEAD',
    department: 'Machine Learning',
    tags: ['DEEP LEARNING', 'NLP', 'TORCH'],
    github: '#', linkedin: '#',
    gradient: 'from-emerald-900/40 to-emerald-800/20',
  },
  {
    id: 5,
    name: 'Charlie Davis',
    role: 'OPTIONS ANALYST',
    department: 'Derivatives Pricing',
    tags: ['OPTIONS', 'MONTE CARLO', 'MATH'],
    github: '#', linkedin: '#',
    gradient: 'from-amber-900/40 to-amber-800/20',
  },
  {
    id: 6,
    name: 'Eve Wilson',
    role: 'DATA ENGINEER',
    department: 'Infrastructure',
    tags: ['KAFKA', 'SQL', 'PIPELINE'],
    github: '#', email: '#',
    gradient: 'from-rose-900/40 to-rose-800/20',
  },
  {
    id: 7,
    name: 'Frank Miller',
    role: 'RISK ANALYST',
    department: 'Risk Management',
    tags: ['VAR', 'STRESS TEST', 'BASEL'],
    linkedin: '#', email: '#',
    gradient: 'from-orange-900/40 to-orange-800/20',
  },
  {
    id: 8,
    name: 'Grace Taylor',
    role: 'EVENTS COORDINATOR',
    department: 'Operations',
    tags: ['COMMUNITY', 'OUTREACH', 'EVENTS'],
    linkedin: '#', email: '#',
    gradient: 'from-teal-900/40 to-teal-800/20',
  },
  {
    id: 9,
    name: 'Henry Moore',
    role: 'TREASURER',
    department: 'Finance & Ops',
    tags: ['BUDGETING', 'PYTHON', 'ADMIN'],
    linkedin: '#',
    gradient: 'from-indigo-900/40 to-indigo-800/20',
  },
];

/* ─── MemberCard ─── */
function MemberCard({ member, delay = 0 }: { member: Member; delay?: number }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const initials = member.name.split(' ').map(w => w[0]).join('');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.22 } }}
      className="glass-card rounded-sm overflow-hidden group cursor-pointer transition-all duration-300"
    >
      {/* ── Avatar ── */}
      <div className={`relative h-48 bg-gradient-to-br ${member.gradient} overflow-hidden`}>
        <div className="absolute inset-0 grid-bg opacity-25" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-6xl font-black text-white/[0.07] select-none tracking-widest">
            {initials}
          </span>
        </div>
        <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-electric-cyan animate-pulse" />
        <div className="absolute inset-0 bg-electric-cyan/0 group-hover:bg-electric-cyan/[0.03] transition-all duration-500" />
        <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-[#0D0D0D] to-transparent" />
      </div>

      {/* ── Info ── */}
      <div className="p-5 space-y-3">
        <div>
          <h3 className="text-white font-semibold text-base tracking-tight group-hover:text-electric-cyan transition-colors duration-200">
            {member.name}
          </h3>
          <p className="font-mono text-[0.63rem] tracking-[0.15em] text-electric-cyan/65 mt-0.5">
            {member.role}
          </p>
          <p className="text-silver/35 text-xs mt-0.5">{member.department}</p>
        </div>

        <div className="flex flex-wrap gap-1">
          {member.tags.map(t => (
            <span key={t} className="tag-pill">{t}</span>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
          {member.linkedin && (
            <a href={member.linkedin} aria-label="LinkedIn"
              className="w-7 h-7 border border-white/10 rounded flex items-center justify-center text-silver/35 hover:border-electric-cyan/50 hover:text-electric-cyan transition-all duration-200">
              <Linkedin className="w-3 h-3" />
            </a>
          )}
          {member.github && (
            <a href={member.github} aria-label="GitHub"
              className="w-7 h-7 border border-white/10 rounded flex items-center justify-center text-silver/35 hover:border-electric-cyan/50 hover:text-electric-cyan transition-all duration-200">
              <Github className="w-3 h-3" />
            </a>
          )}
          {member.email && (
            <a href={`mailto:${member.email}`} aria-label="Email"
              className="w-7 h-7 border border-white/10 rounded flex items-center justify-center text-silver/35 hover:border-electric-cyan/50 hover:text-electric-cyan transition-all duration-200">
              <Mail className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Page ─── */
export default function TeamPage() {
  return (
    <div className="min-h-screen pt-24 pb-24 px-5 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <p className="section-label">// THE TEAM</p>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-none text-white">
            MEET THE<br />
            <span className="text-electric-cyan">QUANTS.</span>
          </h1>
          <p className="text-silver/70 text-sm leading-relaxed max-w-xl">
            Passionate students from mathematics, computer science, and finance — united
            by a drive to decode markets and build exceptional quantitative systems.
          </p>
        </motion.div>

        {/* ── Leadership ── */}
        <section>
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 mb-8"
          >
            <p className="section-label">LEADERSHIP</p>
            <div className="flex-1 h-px bg-white/5" />
            <span className="font-mono text-[0.58rem] tracking-widest text-white/20">
              {String(LEADERSHIP.length).padStart(2,'0')} MEMBERS
            </span>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {LEADERSHIP.map((m, i) => (
              <MemberCard key={m.id} member={m} delay={i * 0.1} />
            ))}
          </div>
        </section>

        {/* ── Officers ── */}
        <section>
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 mb-8"
          >
            <p className="section-label">OFFICERS & ANALYSTS</p>
            <div className="flex-1 h-px bg-white/5" />
            <span className="font-mono text-[0.58rem] tracking-widest text-white/20">
              {String(OFFICERS.length).padStart(2,'0')} MEMBERS
            </span>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {OFFICERS.map((m, i) => (
              <MemberCard key={m.id} member={m} delay={i * 0.07} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
