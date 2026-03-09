'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  BookOpen,
  TrendingUp,
  Brain,
  BarChart2,
  Sigma,
  Clock,
  ChevronRight,
  Search,
  Star,
  Layers,
} from 'lucide-react';

type Category = 'ALL' | 'QUANT FINANCE' | 'MACHINE LEARNING' | 'TIME-SERIES' | 'OPTIONS' | 'RISK';

interface Resource {
  id: number;
  title: string;
  author: string;
  category: Category;
  tags: string[];
  icon: React.ElementType;
  readTime: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  featured?: boolean;
  description: string;
  href?: string; // link to the actual resource (PDF, Notion, GitHub, etc.)
}

const CATEGORIES: Category[] = [
  'ALL',
  'QUANT FINANCE',
  'MACHINE LEARNING',
  'TIME-SERIES',
  'OPTIONS',
  'RISK',
];

const RESOURCES: Resource[] = [
  {
    id: 1,
    title: 'Statistical Arbitrage Fundamentals',
    author: 'Club Research Team',
    category: 'QUANT FINANCE',
    tags: ['COINTEGRATION', 'PAIRS TRADING', 'STATISTICS'],
    icon: TrendingUp,
    readTime: '45 MIN',
    difficulty: 'INTERMEDIATE',
    featured: true,
    description: 'A comprehensive introduction to stat-arb strategies, covering mean-reversion, cointegration tests, and live implementation.',
  },
  {
    id: 2,
    title: 'LSTM Price Prediction Pipeline',
    author: 'Club Research Team',
    category: 'MACHINE LEARNING',
    tags: ['LSTM', 'TENSORFLOW', 'DEEP LEARNING'],
    icon: Brain,
    readTime: '60 MIN',
    difficulty: 'ADVANCED',
    description: 'End-to-end guide for building LSTM networks on OHLCV data — feature engineering, training, and walk-forward validation.',
  },
  {
    id: 3,
    title: 'ARIMA & GARCH for Volatility',
    author: 'Club Research Team',
    category: 'TIME-SERIES',
    tags: ['ARIMA', 'GARCH', 'VOLATILITY'],
    icon: BarChart2,
    readTime: '30 MIN',
    difficulty: 'INTERMEDIATE',
    description: 'Model financial time series with ARIMA for trend and GARCH for heteroskedastic volatility clustering.',
  },
  {
    id: 4,
    title: 'Black-Scholes & Greeks Deep Dive',
    author: 'Club Research Team',
    category: 'OPTIONS',
    tags: ['BLACK-SCHOLES', 'GREEKS', 'PRICING'],
    icon: Sigma,
    readTime: '50 MIN',
    difficulty: 'ADVANCED',
    description: 'Derive the Black-Scholes PDE from first principles and compute Delta, Gamma, Vega, Theta, and Rho analytically.',
  },
  {
    id: 5,
    title: 'Portfolio VaR & CVaR Methods',
    author: 'Club Research Team',
    category: 'RISK',
    tags: ['VAR', 'CVAR', 'MONTE CARLO'],
    icon: Layers,
    readTime: '40 MIN',
    difficulty: 'INTERMEDIATE',
    description: 'Parametric, historical simulation, and Monte Carlo approaches to computing Value-at-Risk and Conditional VaR.',
  },
  {
    id: 6,
    title: 'Introduction to Quantitative Finance',
    author: 'Club Research Team',
    category: 'QUANT FINANCE',
    tags: ['INTRO', 'STOCHASTIC', 'FUNDAMENTALS'],
    icon: BookOpen,
    readTime: '20 MIN',
    difficulty: 'BEGINNER',
    description: 'Your first steps into quantitative finance — probability theory, stochastic calculus overview, and financial instruments.',
  },
  {
    id: 7,
    title: 'Reinforcement Learning for Trading',
    author: 'Club Research Team',
    category: 'MACHINE LEARNING',
    tags: ['RL', 'Q-LEARNING', 'TRADING'],
    icon: Brain,
    readTime: '70 MIN',
    difficulty: 'ADVANCED',
    description: 'Train agents with PPO and DQN to execute order book strategies in simulated market environments.',
  },
  {
    id: 8,
    title: 'Fourier Transform in Options Pricing',
    author: 'Club Research Team',
    category: 'OPTIONS',
    tags: ['FFT', 'HESTON', 'CHARACTERISTIC'],
    icon: Sigma,
    readTime: '55 MIN',
    difficulty: 'ADVANCED',
    description: 'Price European options under the Heston stochastic volatility model via the Carr-Madan FFT method.',
  },
  {
    id: 9,
    title: 'Kalman Filter for Signal Extraction',
    author: 'Club Research Team',
    category: 'TIME-SERIES',
    tags: ['KALMAN', 'STATE-SPACE', 'SIGNAL'],
    icon: BarChart2,
    readTime: '35 MIN',
    difficulty: 'INTERMEDIATE',
    description: 'Apply the Kalman filter to extract latent signals and estimate dynamic hedge ratios in financial data.',
  },
];

const DIFFICULTY_COLORS = {
  BEGINNER:     'rgba(0,255,180,0.7)',
  INTERMEDIATE: 'rgba(0,200,255,0.7)',
  ADVANCED:     'rgba(255,140,0,0.7)',
};

/* ─── Variants ─── */
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] },
  }),
};

const cardVariants = {
  hidden:  { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
};

function ResourceCard({ resource }: { resource: Resource }) {
  const { icon: Icon, title, author, tags, readTime, difficulty, featured, description, href } = resource;

  const inner = (
    <>
      {featured && (
        <div className="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-electric-cyan/50 to-transparent" />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="w-9 h-9 border border-electric-cyan/20 rounded flex items-center justify-center bg-electric-cyan/5 group-hover:border-electric-cyan/50 group-hover:bg-electric-cyan/10 transition-all duration-300 flex-shrink-0">
          <Icon className="w-4 h-4 text-electric-cyan" strokeWidth={1.5} />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {featured && <Star className="w-3 h-3 text-electric-cyan" fill="currentColor" />}
          <span
            className="font-mono text-[0.55rem] tracking-wider px-1.5 py-0.5 rounded-sm"
            style={{ color: DIFFICULTY_COLORS[difficulty], border: `1px solid ${DIFFICULTY_COLORS[difficulty]}30`, background: `${DIFFICULTY_COLORS[difficulty]}08` }}
          >
            {difficulty}
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        <h3 className="font-semibold text-white text-sm leading-snug group-hover:text-electric-cyan transition-colors duration-200">
          {title}
        </h3>
        <p className="text-silver/50 text-xs">{author}</p>
        <p className="text-silver/60 text-xs leading-relaxed mt-2">{description}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {tags.map(t => (
          <span key={t} className="tag-pill">{t}</span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-silver/30">
          <Clock className="w-3 h-3" />
          <span className="font-mono text-[0.6rem] tracking-wider">{readTime}</span>
        </div>
        {href ? (
          <motion.span
            className="inline-flex items-center gap-1 font-mono text-[0.65rem] tracking-[0.1em] text-electric-cyan/60 group-hover:text-electric-cyan transition-colors duration-200"
            whileHover={{ x: 2 }}
          >
            START READING
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </motion.span>
        ) : (
          <span className="font-mono text-[0.6rem] tracking-wider text-silver/20">COMING SOON</span>
        )}
      </div>
    </>
  );

  const cardClass = `
    relative glass-card rounded-sm p-6 flex flex-col gap-4 group transition-all duration-300
    ${featured ? 'border-electric-cyan/25' : ''}
    ${href ? 'cursor-pointer' : 'cursor-default'}
  `;

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        layout
        whileHover={{ y: -5, transition: { duration: 0.22 } }}
        className={cardClass}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className={cardClass}
    >
      {inner}
    </motion.article>
  );
}

export default function ResourcesPage() {
  const [active, setActive]   = useState<Category>('ALL');
  const [query,  setQuery]    = useState('');
  const headerRef             = useRef(null);
  const headerInView          = useInView(headerRef, { once: true });

  const filtered = RESOURCES.filter(r => {
    const catMatch   = active === 'ALL' || r.category === active;
    const queryMatch = query === '' ||
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(query.toLowerCase()));
    return catMatch && queryMatch;
  });

  return (
    <div className="min-h-screen pt-24 pb-24 px-6">
      <div className="max-w-7xl mx-auto space-y-14">

        {/* ── Header ── */}
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={headerInView ? 'visible' : 'hidden'}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="space-y-6"
        >
          <motion.p variants={fadeUp} className="section-label">// RESOURCES</motion.p>
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-5xl md:text-6xl font-black tracking-tight text-white leading-none"
          >
            KNOWLEDGE<br />
            <span className="text-electric-cyan">BASE.</span>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="text-silver max-w-xl leading-relaxed text-sm">
            Curated guides, research papers, and implementation tutorials for quantitative finance
            and data science. Filter by topic and start building your edge.
          </motion.p>
        </motion.div>

        {/* ── Filter + Search ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between"
        >
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`tag-pill cursor-pointer text-[0.65rem] py-1.5 px-3 ${active === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-silver/40 pointer-events-none" />
            <input
              type="text"
              placeholder="SEARCH RESOURCES..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-sm text-white font-mono text-xs tracking-wider placeholder:text-silver/25 focus:outline-none focus:border-electric-cyan/50 focus:shadow-glow-cyan-sm transition-all duration-200"
            />
          </div>
        </motion.div>

        {/* ── Count ── */}
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-electric-cyan animate-pulse-glow" />
          <p className="font-mono text-[0.6rem] tracking-[0.2em] text-silver/40">
            {filtered.length} RESOURCE{filtered.length !== 1 ? 'S' : ''} FOUND
          </p>
        </div>

        {/* ── Grid ── */}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6"
            >
              {filtered.map(r => (
                <ResourceCard key={r.id} resource={r} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24 text-center space-y-3"
            >
              <p className="font-mono text-silver/30 tracking-[0.2em] text-sm">NO RESULTS FOUND</p>
              <button
                onClick={() => { setActive('ALL'); setQuery(''); }}
                className="font-mono text-xs text-electric-cyan/60 hover:text-electric-cyan transition-colors tracking-widest"
              >
                CLEAR FILTERS
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Coming Soon banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative glass-card rounded-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden"
        >
          <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
          <div>
            <p className="section-label mb-2">COMING SOON</p>
            <p className="text-white font-semibold">Interactive Jupyter Notebooks & Video Lectures</p>
            <p className="text-silver/50 text-xs mt-1 leading-relaxed">
              Hands-on implementations with live code execution, directly in your browser.
            </p>
          </div>
          <button className="flex-shrink-0 font-mono text-xs tracking-[0.15em] px-6 py-3 border border-electric-cyan/40 text-electric-cyan hover:bg-electric-cyan hover:text-black transition-all duration-200 rounded-sm hover:shadow-glow-cyan-sm">
            NOTIFY ME
          </button>
        </motion.div>
      </div>
    </div>
  );
}
