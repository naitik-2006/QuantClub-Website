'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  BookOpen,
  ChevronRight,
  Search,
  Star,
  Zap,
  ExternalLink,
  Calculator,
  Target,
  Sparkles,
  ArrowUpRight,
  Filter, X,
  Grid3X3,
  List,
  Activity, Sigma, Puzzle, Globe, Layers, TrendingUp, Code2, Brain, Terminal, Settings, Cpu, Network, BarChart2
} from 'lucide-react';

import {
  CATEGORIES,
  CATEGORY_META,
  type Category,
  type Resource,
} from '@/data/resources';

/* ─────────────────────────────────────────────────────────────
   Animations
───────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] },
  }),
};

const cardVariants = {
  hidden:  { opacity: 0, y: 16, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
};

/* ─────────────────────────────────────────────────────────────
   Difficulty Badge Styles
───────────────────────────────────────────────────────────── */
const DIFFICULTY_STYLES: Record<string, { gradient: string; text: string; glow: string }> = {
  BEGINNER:     { gradient: 'from-emerald-500/20 to-teal-500/20', text: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
  INTERMEDIATE: { gradient: 'from-sky-500/20 to-blue-500/20',     text: 'text-sky-400',     glow: 'shadow-sky-500/20'     },
  ADVANCED:     { gradient: 'from-rose-500/20 to-pink-500/20',    text: 'text-rose-400',    glow: 'shadow-rose-500/20'    },
};

/* ─────────────────────────────────────────────────────────────
   Resource Card — Premium Glassmorphism
───────────────────────────────────────────────────────────── */
function ResourceCard({ resource, index }: { resource: Resource; index: number }) {
  const { icon: Icon, title, author, tags, difficulty, featured, description, href, isMustDo, comment, category } = resource;
  const diff = DIFFICULTY_STYLES[difficulty];
  const catMeta = CATEGORY_META[category];
  const catColor = catMeta?.color ?? '#00f5d4';

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
      custom={index}
      className="group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-500 h-full"
      style={{
        background: 'linear-gradient(135deg, rgba(15,15,20,0.95) 0%, rgba(10,10,15,0.98) 100%)',
      }}
    >
      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-2xl p-px overflow-hidden">
        <div
          className="absolute inset-0 rounded-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${catColor}30 0%, transparent 40%, transparent 60%, ${catColor}20 100%)`,
          }}
        />
      </div>

      {/* Inner content container */}
      <div className="relative z-10 flex flex-col h-full p-5 rounded-2xl border border-white/[0.06] group-hover:border-white/[0.12] transition-all duration-500">

        {/* Featured glow at top */}
        {featured && (
          <div
            className="absolute top-0 left-6 right-6 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${catColor}, transparent)` }}
          />
        )}

        {/* Header row: icon + badges */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${catColor}15, ${catColor}08)`,
              border: `1px solid ${catColor}20`,
              boxShadow: `0 0 0 0 ${catColor}00`,
            }}
          >
            <Icon className="w-4.5 h-4.5" style={{ color: catColor }} strokeWidth={1.5} />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {isMustDo && (
              <span className="inline-flex items-center gap-1 font-mono text-[0.55rem] tracking-wider px-2 py-1 rounded-lg bg-gradient-to-r from-amber-500/15 to-yellow-500/15 text-amber-400 border border-amber-400/20 shadow-sm shadow-amber-500/10">
                <Star className="w-2.5 h-2.5 fill-amber-400" /> MUST DO
              </span>
            )}
            <span className={`font-mono text-[0.55rem] tracking-wider px-2 py-1 rounded-lg bg-gradient-to-r ${diff.gradient} ${diff.text} border border-white/[0.06]`}>
              {difficulty}
            </span>
          </div>
        </div>

        {/* Title + Author */}
        <div className="space-y-1 mb-3">
          <h3 className="font-semibold text-[0.92rem] text-white/90 leading-snug transition-colors duration-300 group-hover:text-white">
            {title}
          </h3>
          {author && <p className="text-white/30 text-xs font-mono tracking-wider">{author}</p>}
        </div>

        {/* Description */}
        <p className="text-white/45 text-[0.8rem] leading-relaxed mb-3 flex-1">{description}</p>

        {/* Comment callout */}
        {comment && (
          <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-amber-500/[0.06] to-yellow-500/[0.04] border-l-2 border-amber-400/40">
            <p className="text-amber-400/80 text-[0.72rem] italic leading-relaxed">
              &ldquo;{comment}&rdquo;
            </p>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tags.slice(0, 4).map(t => (
            <span
              key={t}
              className="font-mono text-[0.55rem] tracking-wider px-2 py-0.5 rounded-md bg-white/[0.04] text-white/30 border border-white/[0.06] transition-all duration-200 group-hover:text-white/40 group-hover:border-white/10"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/[0.05]">
          <span
            className="font-mono text-[0.55rem] tracking-wider px-2 py-0.5 rounded-md"
            style={{ color: `${catColor}60`, background: `${catColor}08`, border: `1px solid ${catColor}15` }}
          >
            {catMeta?.label ?? 'RESOURCE'}
          </span>
          <span
            className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] tracking-[0.08em] transition-all duration-300 group-hover:gap-2.5"
            style={{ color: `${catColor}90` }}
          >
            EXPLORE
            <ArrowUpRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>

      {/* Hover glow effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${catColor}08 0%, transparent 70%)`,
        }}
      />
    </motion.a>
  );
}

/* ─────────────────────────────────────────────────────────────
   Category Sidebar Button
───────────────────────────────────────────────────────────── */
function CategoryTab({ cat, active, count, onClick }: { cat: string; active: boolean; count: number; onClick: () => void }) {
  const meta = CATEGORY_META[cat as Category] || { label: cat, description: '', color: '#888' };
  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-between gap-2 group relative overflow-hidden
        ${active
          ? 'text-white'
          : 'hover:bg-white/[0.04] text-white/45 hover:text-white/70'
        }
      `}
      style={active ? {
        background: `linear-gradient(135deg, ${meta.color}12, ${meta.color}06)`,
        border: `1px solid ${meta.color}25`,
      } : { border: '1px solid transparent' }}
    >
      {/* Active indicator dot */}
      {active && (
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
          style={{ background: meta.color, boxShadow: `0 0 8px ${meta.color}60` }}
        />
      )}
      <span className="font-mono text-xs tracking-wider truncate">{meta.label}</span>
      <span
        className="font-mono text-[0.55rem] px-2 py-0.5 rounded-full flex-shrink-0 transition-all duration-200 tabular-nums"
        style={active
          ? { background: `${meta.color}18`, color: meta.color, border: `1px solid ${meta.color}30` }
          : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.06)' }
        }
      >
        {count}
      </span>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────────── */
export default function ResourcesClient({ initialResources }: { initialResources: any[] }) {
  const [active, setActive] = useState<string>('ALL');
  const [query,  setQuery]  = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef  = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  const iconMap: Record<string, any> = { BookOpen, Star, Zap, Calculator, Target, ExternalLink, Activity, Sigma, Puzzle, Globe, Layers, TrendingUp, Code2, Brain, Terminal, Settings, Cpu, Network, BarChart2 };
  const [allResources] = useState<Resource[]>(() => {
    const data = Array.isArray(initialResources) ? initialResources :
                 typeof initialResources === 'string' ? JSON.parse(initialResources) : [];
    return data.map((r: any) => ({ ...r, icon: iconMap[r.iconName] || BookOpen }));
  });

  // Dynamic categories and counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: allResources.length };
    allResources.forEach(r => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return counts;
  }, [allResources]);

  const activeCategories = useMemo(() => {
    const cats = new Set<string>();
    allResources.forEach(r => cats.add(r.category));
    return ['ALL', ...Array.from(cats)];
  }, [allResources]);

  // Filtered list
  const filtered = useMemo(() =>
    allResources.filter(r => {
      const catMatch   = active === 'ALL' || r.category === active;
      const q = query.toLowerCase();
      const queryMatch = q === '' ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.tags.some((t: string) => t.toLowerCase().includes(q));
      return catMatch && queryMatch;
    }),
    [active, query, allResources]
  );

  const activeMeta = CATEGORY_META[active as Category] || { label: active, description: 'Custom category', color: '#888' };

  return (
    <div className="min-h-screen pt-24 pb-24">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,255,255,0.03) 0%, transparent 100%)',
      }} />

      {/* ── Page header ── */}
      <div className="px-6 max-w-7xl mx-auto relative z-10">
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={headerInView ? 'visible' : 'hidden'}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="space-y-5 mb-14"
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
          <motion.p variants={fadeUp} custom={2} className="text-silver/70 max-w-xl leading-relaxed text-sm">
            Curated books, courses, tools, and practice platforms for quantitative finance,
            coding, and mental math. Filter by category and start building your edge.
          </motion.p>

          {/* Stats row */}
          <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-8 pt-3">
            {[
              { label: 'RESOURCES', value: allResources.length, color: '#00FFFF' },
              { label: 'CATEGORIES', value: CATEGORIES.length - 1, color: '#A78BFA' },
              { label: 'MUST-DO', value: allResources.filter(r => r.isMustDo).length, color: '#F59E0B' },
            ].map(s => (
              <div key={s.label} className="flex items-baseline gap-2.5">
                <span className="font-black text-3xl" style={{ color: s.color }}>{s.value}</span>
                <span className="font-mono text-[0.6rem] tracking-[0.2em] text-white/30">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── Layout: sidebar + content ── */}
      <div className="px-6 max-w-7xl mx-auto relative z-10">
        <div className="flex gap-8 items-start">

          {/* ── Sidebar (desktop) ── */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden lg:flex flex-col gap-1.5 w-56 flex-shrink-0 sticky top-28"
          >
            <p className="font-mono text-[0.55rem] tracking-[0.25em] text-white/25 mb-3 px-4">CATEGORIES</p>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white font-mono text-[0.65rem] tracking-wider placeholder:text-white/20 focus:outline-none focus:border-electric-cyan/30 focus:bg-white/[0.04] transition-all duration-300"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {activeCategories.map(cat => (
              <CategoryTab
                key={cat}
                cat={cat}
                active={active === cat}
                count={categoryCounts[cat] ?? 0}
                onClick={() => { setActive(cat); setQuery(''); }}
              />
            ))}

            {/* Sidebar decoration */}
            <div className="mt-6 px-4">
              <div className="h-px w-full bg-gradient-to-r from-electric-cyan/10 via-electric-cyan/20 to-transparent" />
              <p className="font-mono text-[0.5rem] tracking-[0.2em] text-white/15 mt-3">
                BUILT FOR QUANTS
              </p>
            </div>
          </motion.aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">

            {/* Mobile: filter bar */}
            <div className="lg:hidden flex flex-col gap-3 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
                <input
                  type="text"
                  placeholder="SEARCH RESOURCES..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="w-full pl-9 pr-10 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white font-mono text-xs tracking-wider placeholder:text-white/20 focus:outline-none focus:border-electric-cyan/30 transition-all duration-300"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                onClick={() => setMobileMenuOpen(v => !v)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white/50 font-mono text-xs tracking-wider hover:border-white/15 transition-all duration-200"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>FILTER: {activeMeta?.label || active}</span>
                <span className="ml-auto font-mono text-[0.55rem] px-1.5 py-0.5 rounded-full bg-electric-cyan/10 text-electric-cyan border border-electric-cyan/20">
                  {filtered.length}
                </span>
              </button>

              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-1.5 p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                      {activeCategories.map(cat => {
                        const meta = CATEGORY_META[cat as Category] || { label: cat, description: '', color: '#888' };
                        const isActive = active === cat;
                        return (
                          <button
                            key={cat}
                            onClick={() => { setActive(cat); setMobileMenuOpen(false); setQuery(''); }}
                            className={`
                              flex items-center justify-between px-3 py-2 rounded-lg font-mono text-[0.6rem] tracking-wider transition-all duration-200
                              ${isActive ? 'bg-white/[0.08] text-white border border-white/12' : 'text-white/40 hover:text-white/60 hover:bg-white/[0.04] border border-transparent'}
                            `}
                          >
                            <span className="truncate">{meta.label}</span>
                            <span className="ml-1 flex-shrink-0 text-white/25">{categoryCounts[cat] ?? 0}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Active category header */}
            {active !== 'ALL' && (
              <motion.div
                key={active}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-start gap-3"
              >
                <div
                  className="w-1 self-stretch rounded-full flex-shrink-0"
                  style={{ background: `linear-gradient(180deg, ${activeMeta.color}, transparent)` }}
                />
                <div>
                  <h2 className="text-white font-bold text-lg tracking-tight">{activeMeta?.label || active}</h2>
                  <p className="text-white/35 text-xs mt-0.5">{activeMeta?.description || 'Custom category'}</p>
                </div>
              </motion.div>
            )}

            {/* Result count */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-electric-cyan animate-pulse" />
              <p className="font-mono text-[0.6rem] tracking-[0.2em] text-white/30">
                {filtered.length} RESOURCE{filtered.length !== 1 ? 'S' : ''} {query ? 'MATCHING' : 'IN'}{' '}
                <span className="text-white/50">{query ? `"${query.toUpperCase()}"` : (activeMeta?.label || active).toUpperCase()}</span>
              </p>
            </div>

            {/* Cards grid */}
            <AnimatePresence mode="popLayout">
              {filtered.length > 0 ? (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                >
                  {filtered.map((r, i) => (
                    <ResourceCard key={r.id} resource={r} index={i} />
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
                  <p className="font-mono text-white/20 tracking-[0.2em] text-sm">NO RESULTS FOUND</p>
                  <p className="text-white/15 text-xs">Try a different search term or category</p>
                  <button
                    onClick={() => { setActive('ALL'); setQuery(''); }}
                    className="font-mono text-xs text-electric-cyan/50 hover:text-electric-cyan transition-colors tracking-widest mt-2 inline-block"
                  >
                    CLEAR FILTERS →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
