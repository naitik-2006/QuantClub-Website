'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Briefcase,
  Trophy,
  ExternalLink,
  TrendingUp,
  MapPin,
  Calendar,
  Building2,
  Users
} from 'lucide-react';

/* ─── Types ─── */
interface Opportunity {
  id: string;
  title: string;
  company: string;
  type: 'INTERNSHIP' | 'FULL-TIME' | 'COMPETITION';
  location: string;
  deadline?: string;
  tags: string[];
  description: string;
  href: string;
  isClubOpportunity?: boolean;
}



/* ─── Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

function OppCard({ opp, index }: { opp: Opportunity; index: number }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`relative glass-card rounded-sm p-6 group border-l-2 ${opp.isClubOpportunity ? 'border-l-indigo-500' : 'border-l-electric-cyan/50'} hover:shadow-glow-cyan-sm transition-all duration-300`}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-[0.6rem] font-mono tracking-widest px-2 py-0.5 rounded-sm ${opp.isClubOpportunity ? 'bg-indigo-500/20 text-indigo-400' : 'bg-electric-cyan/10 text-electric-cyan'}`}>
                {opp.type}
              </span>
              {opp.isClubOpportunity && (
                <span className="text-[0.6rem] font-mono tracking-widest px-2 py-0.5 rounded-sm bg-white/5 text-silver/60">
                  INTERNAL ROLE
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-electric-cyan transition-colors">
              {opp.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-silver/50 text-xs">
              <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {opp.company}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {opp.location}</span>
              {opp.deadline && (
                <span className="flex items-center gap-1 text-red-400/70"><Calendar className="w-3 h-3" /> DEADLINE: {opp.deadline}</span>
              )}
            </div>
          </div>

          <p className="text-silver/70 text-sm leading-relaxed max-w-2xl">
            {opp.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {opp.tags.map(tag => (
              <span key={tag} className="tag-pill text-[0.6rem] uppercase tracking-tighter">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <motion.a
          href={opp.href}
          target={opp.href.startsWith('http') ? "_blank" : "_self"}
          rel="noopener noreferrer"
          whileHover={{ x: 3 }}
          className="flex-shrink-0 flex items-center justify-center w-full md:w-12 md:h-12 border border-white/10 rounded-sm hover:border-electric-cyan group-hover:bg-electric-cyan group-hover:text-black transition-all duration-200"
        >
          <ExternalLink className="w-5 h-5" />
        </motion.a>
      </div>
    </motion.div>
  );
}

import { useState, useEffect } from 'react';

export default function OpportunitiesPage() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });
  
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    fetch('/api/admin/opportunities')
      .then(res => res.ok ? res.json() : [])
      .then(setOpportunities)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto space-y-20">

        {/* ── Header ── */}
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={headerInView ? 'visible' : 'hidden'}
          className="space-y-6 text-center md:text-left"
        >
          <motion.p variants={fadeUp} className="section-label text-center md:text-left">// CAREERS & COMPETITIONS</motion.p>
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight uppercase"
          >
            Bridge to<br />
            <span className="text-electric-cyan">Industry Excellence.</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-silver max-w-2xl leading-relaxed text-sm mx-auto md:mx-0">
            A curated database of upcoming internships at top-tier quant trading firms,
            global research competitions, and exclusive roles.
          </motion.p>
        </motion.div>

        {/* ── Industry Section ── */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-electric-cyan" />
            <h2 className="text-2xl font-bold text-white tracking-widest uppercase">Opportunities</h2>
            <div className="h-px flex-grow bg-white/5 ml-4" />
          </div>

          <div className="grid grid-cols-1 gap-6">
            {opportunities.map((opp, i) => (
              <OppCard key={opp.id} opp={opp} index={i} />
            ))}
            {opportunities.length === 0 && (
              <p className="text-silver/50 font-mono text-sm tracking-wider">No opportunities currently listed. Check back later.</p>
            )}
          </div>
        </section>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card rounded-sm p-10 text-center space-y-6 overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-electric-cyan to-transparent opacity-30" />
          <Trophy className="w-12 h-12 text-electric-cyan mx-auto animate-pulse-glow" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Have an Opportunity to Share?</h2>
            <p className="text-silver/60 text-sm max-w-lg mx-auto">
              If your firm is hiring or you've found a competition that would interest the club,
              let us know so we can feature it here.
            </p>
          </div>
          <button className="font-mono text-xs tracking-widest px-8 py-3.5 border border-electric-cyan/40 text-electric-cyan hover:bg-electric-cyan hover:text-black transition-all duration-300 rounded-sm">
            SUBMIT OPPORTUNITY
          </button>
        </motion.div>

      </div>
    </div>
  );
}
