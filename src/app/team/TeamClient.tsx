'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Github, Linkedin, Mail, User } from 'lucide-react';

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
  image?: string;      // URL or /team/photo.jpg path
  gradient: string;
  section: string;
}

/* ─── MemberCard ─── */
function MemberCard({ member, delay = 0 }: { member: Member; delay?: number }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const initials = member.name.split(' ').map(w => w[0]).join('');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.22 } }}
      className="glass-card rounded-sm overflow-hidden group cursor-pointer transition-shadow duration-300 hover:shadow-glow-cyan-sm flex flex-col"
    >
      {/* ── Avatar / Photo ── */}
      <div className={`relative h-48 sm:h-52 bg-gradient-to-br ${member.gradient} overflow-hidden flex-shrink-0`}>
        <div className="absolute inset-0 grid-bg opacity-20" />

        {member.image ? (
          /* Real photo */
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          /* Initials fallback */
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-6xl font-black text-white/[0.08] select-none tracking-widest">
              {initials}
            </span>
            {/* Subtle person icon */}
            <User className="absolute w-14 h-14 text-white/10" />
          </div>
        )}

        {/* Pulse indicator */}
        <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-electric-cyan animate-pulse" />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-electric-cyan/0 group-hover:bg-electric-cyan/[0.04] transition-all duration-500" />
        {/* Bottom fade into card body */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0D0D0D] to-transparent" />
      </div>

      {/* ── Info ── */}
      <div className="p-5 space-y-3 flex-1 flex flex-col">
        <div>
          <h3 className="text-white font-semibold text-base tracking-tight group-hover:text-electric-cyan transition-colors duration-200 leading-snug">
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

        {/* Social links — pushed to bottom */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/5 mt-auto">
          {member.linkedin && member.linkedin !== '#' && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-7 h-7 border border-white/10 rounded flex items-center justify-center text-silver/35 hover:border-electric-cyan/50 hover:text-electric-cyan transition-all duration-200"
            >
              <Linkedin className="w-3 h-3" />
            </a>
          )}
          {member.github && member.github !== '#' && (
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-7 h-7 border border-white/10 rounded flex items-center justify-center text-silver/35 hover:border-electric-cyan/50 hover:text-electric-cyan transition-all duration-200"
            >
              <Github className="w-3 h-3" />
            </a>
          )}
          {member.email && member.email !== '#' && (
            <a
              href={`mailto:${member.email}`}
              aria-label="Email"
              className="w-7 h-7 border border-white/10 rounded flex items-center justify-center text-silver/35 hover:border-electric-cyan/50 hover:text-electric-cyan transition-all duration-200"
            >
              <Mail className="w-3 h-3" />
            </a>
          )}
          {/* empty state */}
          {!member.linkedin && !member.github && !member.email && (
            <span className="text-[0.6rem] font-mono text-white/15 tracking-widest">IIT BHU</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Section Header ─── */
function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-4 mb-8"
    >
      <p className="section-label">{title}</p>
      <div className="flex-1 h-px bg-white/5" />
      <span className="font-mono text-[0.58rem] tracking-widest text-white/20">
        {String(count).padStart(2, '0')} MEMBER{count !== 1 ? 'S' : ''}
      </span>
    </motion.div>
  );
}

/* ─── Page ─── */
export default function TeamClient({ initialMembers }: { initialMembers: Member[] }) {
  const [members] = useState<Member[]>(initialMembers);
  const loading = false;

  // Group members by section — preserve insertion order
  const sectionsMap = members.reduce((acc, member) => {
    const s = member.section || 'OTHER';
    if (!acc[s]) acc[s] = [];
    acc[s].push(member);
    return acc;
  }, {} as Record<string, Member[]>);

  const sections = Object.keys(sectionsMap);

  return (
    <div className="min-h-screen pt-24 pb-28 px-5 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-20">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <p className="section-label">// THE TEAM</p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none text-white">
            MEET THE<br />
            <span className="text-electric-cyan">QUANTS.</span>
          </h1>
          <p className="text-silver/70 text-sm leading-relaxed max-w-xl">
            Passionate students from IIT BHU Varanasi — mathematics, computer science, and finance — united
            by a drive to decode markets and build exceptional quantitative systems.
          </p>

          {/* Stats row */}
          {members.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-8 pt-2"
            >
              <div className="flex items-baseline gap-2">
                <span className="font-black text-3xl text-electric-cyan">{members.length}</span>
                <span className="font-mono text-[0.6rem] tracking-[0.2em] text-white/30">MEMBERS</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-black text-3xl text-violet-400">{sections.length}</span>
                <span className="font-mono text-[0.6rem] tracking-[0.2em] text-white/30">TEAMS</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* ── Loading skeleton ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card rounded-sm h-72 animate-pulse" />
            ))}
          </div>
        )}

        {/* ── Dynamic Sections ── */}
        {!loading && sections.map((section) => (
          <section key={section} className="space-y-0">
            <SectionHeader title={section} count={sectionsMap[section].length} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
              {sectionsMap[section].map((m, i) => (
                <MemberCard key={m.id} member={m} delay={i * 0.08} />
              ))}
            </div>
          </section>
        ))}

        {!loading && sections.length === 0 && (
          <div className="text-center py-24">
            <p className="text-silver/40 font-mono text-sm tracking-wider">No team members currently listed.</p>
            <p className="text-silver/25 font-mono text-xs tracking-wider mt-2">Admins can add members via the admin panel.</p>
          </div>
        )}

      </div>
    </div>
  );
}
