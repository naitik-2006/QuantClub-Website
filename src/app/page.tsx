'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  BarChart2,
  Brain,
  Sigma,
  ChevronDown,
  Activity,
  Database,
  LineChart,
} from 'lucide-react';
import dynamic from 'next/dynamic';

const HeroCanvas = dynamic(() => import('@/components/HeroCanvas'), { ssr: false });

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const stats = [
  { value: '48+', label: 'MEMBERS' },
  { value: '14+', label: 'PROJECTS' },
  { value: '3',   label: 'YEARS' },
  { value: '∞',   label: 'ALPHA' },
];

const projects = [
  {
    icon: BarChart2,
    title: 'QUANT STRATEGY ALPHA',
    description: 'A systematic momentum strategy backtested over 10 years of equity data with live paper-trading integration.',
    tags: ['PYTHON', 'C++', 'BACKTESTING', 'PANDAS'],
  },
  {
    icon: Brain,
    title: 'ML SIGNAL PREDICTOR',
    description: 'LSTM-based price movement classifier trained on multi-asset tick data with custom feature engineering pipelines.',
    tags: ['PYTHON', 'TENSORFLOW', 'TIME-SERIES', 'SKLEARN'],
  },
  {
    icon: Sigma,
    title: 'OPTIONS PRICER ENGINE',
    description: 'Real-time Black-Scholes and Monte Carlo options pricing with Greeks computation and vol-surface visualization.',
    tags: ['C++', 'PYTHON', 'MATH', 'MONTE CARLO'],
  },
];

function SectionHeader({ label, title }: { label: string; title: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="section-label">{label}</p>
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-none">
        {title}
      </h2>
    </div>
  );
}

function ProjectCard({
  icon: Icon, title, description, tags, index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  tags: string[];
  index: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="glass-card rounded-sm p-6 group cursor-pointer transition-all duration-300 flex flex-col gap-5"
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 border border-electric-cyan/20 rounded flex items-center justify-center bg-electric-cyan/5 group-hover:border-electric-cyan/50 group-hover:bg-electric-cyan/10 transition-all duration-300">
          <Icon className="w-5 h-5 text-electric-cyan" strokeWidth={1.5} />
        </div>
        <ArrowRight className="w-4 h-4 text-silver/30 group-hover:text-electric-cyan group-hover:translate-x-1 transition-all duration-300" />
      </div>

      <div className="space-y-2">
        <h3 className="font-mono text-sm font-semibold tracking-[0.12em] text-white group-hover:text-electric-cyan transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-silver leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-auto">
        {tags.map(tag => (
          <span key={tag} className="tag-pill">{tag}</span>
        ))}
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const aboutRef    = useRef(null);
  const projectsRef = useRef(null);
  const aboutInView    = useInView(aboutRef,    { once: true, margin: '-80px' });
  const projectsInView = useInView(projectsRef, { once: true, margin: '-80px' });

  return (
    <div>
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grid-bg">
        <HeroCanvas />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-8"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="font-mono text-[0.65rem] tracking-[0.4em] text-electric-cyan/70"
            >
              EST. 2021 · UNIVERSITY QUANT FINANCE SOCIETY
            </motion.p>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-[clamp(3.5rem,14vw,9rem)] font-black tracking-tighter leading-none text-white glow-text select-none"
            >
              THE QUANT<br />
              <span className="text-electric-cyan">CLUB</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="font-mono text-sm md:text-base tracking-[0.22em] text-silver/80 max-w-xl mx-auto"
            >
              MASTERING MARKETS.&nbsp; DECODING DATA.&nbsp; BUILDING ALPHA.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={3}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
            >
              <Link
                href="/resources"
                className="group relative inline-flex items-center gap-2 px-7 py-3.5 bg-electric-cyan text-black font-mono text-xs tracking-[0.15em] font-semibold hover:shadow-glow-cyan transition-all duration-300 rounded-sm overflow-hidden"
              >
                <span className="relative z-10">EXPLORE RESOURCES</span>
                <ArrowRight className="w-3.5 h-3.5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
              </Link>
              <Link
                href="/team"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-electric-cyan/40 text-electric-cyan font-mono text-xs tracking-[0.15em] hover:border-electric-cyan hover:shadow-glow-cyan-sm transition-all duration-300 rounded-sm"
              >
                OUR TEAM
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={4}
              className="flex items-center justify-center gap-6 sm:gap-12 pt-8 flex-wrap"
            >
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="font-mono text-2xl font-bold text-electric-cyan glow-text-sm">{value}</p>
                  <p className="font-mono text-[0.6rem] tracking-[0.2em] text-silver/50 mt-1">{label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[0.55rem] tracking-[0.3em] text-silver/30">SCROLL</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-4 h-4 text-silver/30" />
          </motion.div>
        </motion.div>
      </section>

      <section
        ref={aboutRef}
        className="relative py-20 md:py-32 px-5 sm:px-6 max-w-7xl mx-auto"
      >
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-48 bg-gradient-to-b from-transparent via-electric-cyan/30 to-transparent hidden lg:block" />

        <motion.div
          initial="hidden"
          animate={aboutInView ? 'visible' : 'hidden'}
          variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center"
        >
          <motion.div variants={fadeUp} className="space-y-6">
            <SectionHeader
              label="// ABOUT US"
              title={<>WE ARE THE<br /><span className="text-electric-cyan">QUANTS.</span></>}
            />
            <div className="w-16 h-px bg-electric-cyan shadow-glow-cyan-sm" />
          </motion.div>

          <motion.div variants={fadeUp} custom={1} className="space-y-6">
            <p className="text-silver leading-8 text-base">
              The Quant Club is a student organization for aspiring quantitative analysts,
              algorithmic traders, and data scientists. We bridge the gap between academic theory and
              real-world financial markets through research, collaborative projects, and
              industry mentorship.
            </p>
            <p className="text-silver/60 leading-8 text-sm">
              From implementing option pricing models to training neural networks on tick data,
              our members work at the intersection of mathematics, computer science, and markets.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { icon: Activity,  label: 'LIVE TRADING',   sub: 'Paper & sim' },
                { icon: Database,  label: 'DATA DRIVEN',    sub: 'Multi-source' },
                { icon: LineChart, label: 'BACKTESTING',    sub: 'Decade data' },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="p-4 border border-white/5 rounded-sm bg-white/[0.02] hover:border-electric-cyan/20 transition-all duration-300 group"
                >
                  <Icon className="w-4 h-4 text-electric-cyan mb-2 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
                  <p className="font-mono text-[0.6rem] tracking-[0.12em] text-white">{label}</p>
                  <p className="font-mono text-[0.55rem] tracking-widest text-silver/40 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative py-20 md:py-32 px-5 sm:px-6">
        <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

        <div className="max-w-7xl mx-auto" ref={projectsRef}>
          <motion.div
            initial="hidden"
            animate={projectsInView ? 'visible' : 'hidden'}
            variants={stagger}
            className="space-y-14"
          >
            <motion.div variants={fadeUp}>
              <SectionHeader
                label="// PROJECTS"
                title={<>WHAT WE<br /><span className="text-electric-cyan">BUILD.</span></>}
              />
            </motion.div>

            <motion.div
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6"
            >
              {projects.map((p, i) => (
                <ProjectCard key={p.title} {...p} index={i} />
              ))}
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={4}
              className="flex items-center justify-center gap-3 pt-4"
            >
              <div className="h-px w-12 bg-electric-cyan/20" />
              <p className="font-mono text-[0.6rem] tracking-[0.2em] text-silver/30">
                + MORE IN DEVELOPMENT
              </p>
              <div className="h-px w-12 bg-electric-cyan/20" />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
