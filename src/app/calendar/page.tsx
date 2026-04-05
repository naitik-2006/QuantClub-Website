'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Video,
  Users,
  Zap,
  BookOpen,
  Trophy,
  X,
  Clock,
  User,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { fetchGoogleCalendarEvents, type CalEvent, type EventType, type Format } from '@/lib/googleCalendar';
import { STATIC_EVENTS } from '@/data/events';

/* ─── Config ─── */
const TYPE_CFG: Record<EventType, { color: string; bg: string; icon: React.ElementType }> = {
  WORKSHOP:    { color: '#00FFFF',  bg: 'rgba(0,255,255,0.12)',   icon: Zap      },
  SEMINAR:     { color: '#A78BFA',  bg: 'rgba(167,139,250,0.12)', icon: BookOpen },
  COMPETITION: { color: '#F59E0B',  bg: 'rgba(245,158,11,0.12)',  icon: Trophy   },
  SOCIAL:      { color: '#34D399',  bg: 'rgba(52,211,153,0.12)',  icon: Users    },
  LECTURE:     { color: '#60A5FA',  bg: 'rgba(96,165,250,0.12)',  icon: Video    },
  HACKATHON:   { color: '#F87171',  bg: 'rgba(248,113,113,0.12)', icon: Zap      },
};

const FORMAT_ICON: Record<Format, React.ElementType> = {
  'IN-PERSON': MapPin,
  'VIRTUAL':   Video,
  'HYBRID':    Users,
};

const MONTH_NAMES = [
  'JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE',
  'JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER',
];
const DAY_NAMES = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

/* ─── Helpers ─── */
function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate(); }
function firstDayOfWeek(y: number, m: number) { return new Date(y, m, 1).getDay(); }

function buildGrid(y: number, m: number): (number | null)[] {
  const cells: (number | null)[] = [];
  const pad = firstDayOfWeek(y, m);
  for (let i = 0; i < pad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth(y, m); d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function eventsForDay(events: CalEvent[], y: number, m: number, d: number) {
  return events.filter(e => e.year === y && e.month === m && e.day === d);
}

/* ─── EventPill ─── */
function EventPill({ event, onClick }: { event: CalEvent; onClick: () => void }) {
  const { color, bg } = TYPE_CFG[event.type];
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick(); }}
      className="w-full text-left px-1.5 py-0.5 rounded-sm text-[0.6rem] font-mono tracking-wide truncate transition-all duration-150 hover:brightness-125 cursor-pointer"
      style={{ background: bg, color, border: `1px solid ${color}25` }}
    >
      {event.title}
    </button>
  );
}

/* ─── Detail Panel ─── */
function EventDetail({ event, onClose }: { event: CalEvent; onClose: () => void }) {
  const { color, bg, icon: Icon } = TYPE_CFG[event.type];
  const FmtIcon = FORMAT_ICON[event.format];

  return (
    <motion.div
      key={event.id}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card rounded-sm overflow-hidden flex-shrink-0 w-full lg:w-80 xl:w-96"
    >
      {/* Top accent strip */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />

      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div
            className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0"
            style={{ background: bg, border: `1px solid ${color}40` }}
          >
            <Icon className="w-4 h-4" style={{ color }} strokeWidth={1.5} />
          </div>
          <button
            onClick={onClose}
            className="text-silver/30 hover:text-white transition-colors p-1 -mr-1 -mt-1 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Type + Format pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="font-mono text-[0.6rem] tracking-[0.12em] px-2 py-0.5 rounded-sm"
            style={{ color, background: bg, border: `1px solid ${color}30` }}
          >
            {event.type}
          </span>
          <div className="flex items-center gap-1">
            <FmtIcon className="w-2.5 h-2.5 text-silver/40" />
            <span className="font-mono text-[0.58rem] tracking-wider text-silver/40">{event.format}</span>
          </div>
        </div>

        {/* Title + date */}
        <div>
          <h3 className="text-white font-semibold text-sm leading-snug">{event.title}</h3>
          <p className="font-mono text-[0.62rem] tracking-wider mt-1" style={{ color: `${color}90` }}>
            {MONTH_NAMES[event.month].slice(0,3)} {String(event.day).padStart(2,'0')} · {event.time}
          </p>
        </div>

        <p className="text-silver/60 text-xs leading-relaxed">{event.description}</p>

        {/* Meta */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 text-silver/30 flex-shrink-0" />
            <span className="font-mono text-[0.6rem] tracking-wider text-silver/50">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-silver/30 flex-shrink-0" />
            <span className="font-mono text-[0.6rem] tracking-wider text-silver/50">{event.time}</span>
          </div>
          {event.speaker && (
            <div className="flex items-center gap-2">
              <User className="w-3 h-3 text-silver/30 flex-shrink-0" />
              <span className="font-mono text-[0.6rem] tracking-wider text-silver/50">{event.speaker}</span>
            </div>
          )}
        </div>

        {event.link ? (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center font-mono text-[0.65rem] tracking-[0.15em] py-2.5 rounded-sm border transition-all duration-200 hover:brightness-125"
            style={{ color, borderColor: `${color}50`, background: bg }}
          >
            REGISTER / JOIN →
          </a>
        ) : (
          <Link
            href="/contact"
            className="block w-full text-center font-mono text-[0.65rem] tracking-[0.15em] py-2.5 rounded-sm border transition-all duration-200 hover:brightness-125"
            style={{ color, borderColor: `${color}50`, background: bg }}
          >
            RSVP / ENQUIRE →
          </Link>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Calendar Grid ─── */
function CalendarGrid({
  year, month, events, onSelect,
}: {
  year: number; month: number;
  events: CalEvent[];
  onSelect: (e: CalEvent) => void;
}) {
  const today = new Date();
  const cells = buildGrid(year, month);

  return (
    <div className="flex-1 min-w-0">
      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((d, i) => (
          <div
            key={d}
            className={`py-2 text-center font-mono text-[0.58rem] tracking-[0.18em]
              ${i === 0 || i === 6 ? 'text-silver/25' : 'text-silver/40'}`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-px bg-white/[0.04] rounded-sm overflow-hidden border border-white/[0.06]">
        {cells.map((day, idx) => {
          const isWeekend  = idx % 7 === 0 || idx % 7 === 6;
          const isToday    = day !== null &&
            today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
          const dayEvents  = day ? eventsForDay(events, year, month, day) : [];
          const hasEvent   = dayEvents.length > 0;

          return (
            <div
              key={idx}
              className={`
                relative min-h-[80px] sm:min-h-[100px] p-1.5 sm:p-2 flex flex-col gap-1
                transition-colors duration-150
                ${day === null ? 'bg-black/50' : isWeekend ? 'bg-[#080808]' : 'bg-[#0D0D0D]'}
                ${hasEvent ? 'hover:bg-white/[0.03] cursor-pointer' : ''}
              `}
            >
              {/* Day number */}
              {day !== null && (
                <div className={`
                  w-6 h-6 flex items-center justify-center rounded-full
                  font-mono text-[0.65rem] leading-none flex-shrink-0
                  ${isToday
                    ? 'bg-electric-cyan text-black font-bold shadow-[0_0_10px_rgba(0,255,255,0.5)]'
                    : isWeekend ? 'text-silver/25' : 'text-silver/50'
                  }
                `}>
                  {day}
                </div>
              )}

              {/* Event pills (desktop) */}
              <div className="hidden sm:flex flex-col gap-0.5 flex-1 overflow-hidden">
                {dayEvents.slice(0, 2).map(ev => (
                  <EventPill key={ev.id} event={ev} onClick={() => onSelect(ev)} />
                ))}
                {dayEvents.length > 2 && (
                  <span
                    className="font-mono text-[0.55rem] text-silver/30 px-1 cursor-pointer"
                    onClick={() => onSelect(dayEvents[0])}
                  >
                    +{dayEvents.length - 2} more
                  </span>
                )}
              </div>

              {/* Event dots (mobile) */}
              {hasEvent && (
                <div className="flex sm:hidden gap-0.5 mt-auto flex-wrap" onClick={() => onSelect(dayEvents[0])}>
                  {dayEvents.slice(0, 3).map(ev => (
                    <div
                      key={ev.id}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: TYPE_CFG[ev.type].color }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function CalendarPage() {
  const now = new Date();
  const [year,     setYear]     = useState(now.getFullYear());
  const [month,    setMonth]    = useState(now.getMonth());
  const [selected, setSelected] = useState<CalEvent | null>(null);
  const [events,   setEvents]   = useState<CalEvent[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [source,   setSource]   = useState<'static' | 'google' | 'mixed'>('static');

  /* ─── Fetch Events ─── */
  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      try {
        // 1. Always load internal/admin events
        const adminRes = await fetch('/api/admin/events');
        const adminEvents: CalEvent[] = adminRes.ok ? await adminRes.json() : [];
        let allEvents = [...STATIC_EVENTS, ...adminEvents];

        // 2. Try fetching Google Calendar if env vars present
        const calId  = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID;
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY;
        
        if (calId && apiKey) {
          try {
            const gcEvents = await fetchGoogleCalendarEvents(calId, apiKey);
            allEvents = [...allEvents, ...gcEvents];
            setSource('mixed');
          } catch (err) {
            console.warn('[Calendar] Google sync failed:', err);
            setSource('static');
          }
        } else {
          setSource('static');
        }
        
        setEvents(allEvents);
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadEvents();
  }, []);

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelected(null);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelected(null);
  };
  const goToday = () => {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setSelected(null);
  };

  const monthEvents = events.filter(e => e.year === year && e.month === month);

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-4"
        >
          <div>
            <p className="section-label">// CALENDAR</p>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none text-white mt-2">
              UPCOMING <span className="text-electric-cyan">EVENTS.</span>
            </h1>
          </div>

          {/* Source badge */}
          <div className="flex items-center gap-3">
            {loading && (
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-3 h-3 text-silver/40 animate-spin" />
                <span className="font-mono text-[0.58rem] tracking-wider text-silver/40">SYNCING...</span>
              </div>
            )}
            {!loading && source === 'google' && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 border border-electric-cyan/20 rounded-sm bg-electric-cyan/5">
                <CheckCircle2 className="w-2.5 h-2.5 text-electric-cyan" />
                <span className="font-mono text-[0.58rem] tracking-wider text-electric-cyan/70">SYNCED · GOOGLE CALENDAR</span>
              </div>
            )}
            <p className="text-silver/40 text-xs font-mono tracking-wider">
              {monthEvents.length} EVENT{monthEvents.length !== 1 ? 'S' : ''} THIS MONTH
            </p>
          </div>
        </motion.div>

        {/* ── Month nav ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={prevMonth}
            className="w-8 h-8 border border-white/10 rounded flex items-center justify-center text-silver/50 hover:border-electric-cyan/50 hover:text-electric-cyan transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-baseline gap-2.5">
            <span className="font-mono text-xl font-bold text-white tracking-wide">
              {MONTH_NAMES[month]}
            </span>
            <span className="font-mono text-sm text-silver/40 tracking-wider">{year}</span>
          </div>

          <button
            onClick={nextMonth}
            className="w-8 h-8 border border-white/10 rounded flex items-center justify-center text-silver/50 hover:border-electric-cyan/50 hover:text-electric-cyan transition-all duration-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={goToday}
            className="font-mono text-[0.62rem] tracking-[0.14em] px-3 py-1.5 border border-white/10 text-silver/40 hover:border-electric-cyan/40 hover:text-electric-cyan rounded-sm transition-all duration-200"
          >
            TODAY
          </button>

          {/* Type legend */}
          <div className="hidden md:flex items-center gap-4 ml-auto flex-wrap">
            {(Object.keys(TYPE_CFG) as EventType[]).map(t => (
              <div key={t} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm" style={{ background: TYPE_CFG[t].color }} />
                <span className="font-mono text-[0.58rem] tracking-wider" style={{ color: `${TYPE_CFG[t].color}70` }}>{t}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Calendar + Detail panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col lg:flex-row gap-4 items-start"
        >
          <CalendarGrid
            year={year}
            month={month}
            events={events}
            onSelect={setSelected}
          />

          <AnimatePresence mode="wait">
            {selected ? (
              <EventDetail
                key={selected.id}
                event={selected}
                onClose={() => setSelected(null)}
              />
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden lg:flex w-80 xl:w-96 flex-shrink-0 glass-card rounded-sm h-48 items-center justify-center"
              >
                <p className="font-mono text-[0.62rem] tracking-[0.2em] text-silver/20">
                  SELECT AN EVENT
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Mobile event list for selected month ── */}
        {monthEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="lg:hidden space-y-3"
          >
            <p className="section-label pt-2">THIS MONTH</p>
            {monthEvents.map(ev => {
              const { color, bg, icon: Icon } = TYPE_CFG[ev.type];
              const isSelected = selected?.id === ev.id;
              return (
                <motion.button
                  key={ev.id}
                  onClick={() => setSelected(isSelected ? null : ev)}
                  whileHover={{ x: 4 }}
                  className={`w-full text-left glass-card rounded-sm p-4 flex items-center gap-4 transition-all duration-200 ${isSelected ? 'border-electric-cyan/40' : ''}`}
                >
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: bg, border: `1px solid ${color}30` }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color }} strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-medium truncate">{ev.title}</p>
                    <p className="font-mono text-[0.6rem] tracking-wider mt-0.5" style={{ color: `${color}80` }}>
                      {MONTH_NAMES[ev.month].slice(0,3)} {String(ev.day).padStart(2,'0')} · {ev.time}
                    </p>
                  </div>
                  <ChevronRight
                    className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
                    style={{ color: `${color}60`, transform: isSelected ? 'rotate(90deg)' : 'none' }}
                  />
                </motion.button>
              );
            })}

            <AnimatePresence>
              {selected && (
                <EventDetail key={`mobile-${selected.id}`} event={selected} onClose={() => setSelected(null)} />
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── No events this month ── */}
        {monthEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center space-y-2"
          >
            <p className="font-mono text-silver/20 tracking-[0.25em] text-sm">NO EVENTS THIS MONTH</p>
            <button
              onClick={goToday}
              className="font-mono text-[0.65rem] tracking-widest text-electric-cyan/40 hover:text-electric-cyan transition-colors"
            >
              GO TO TODAY →
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
}
