/**
 * ─────────────────────────────────────────────────────────────────
 *  STATIC FALLBACK EVENTS
 *
 *  These events are shown when Google Calendar is NOT connected.
 *  Once you add NEXT_PUBLIC_GOOGLE_CALENDAR_ID and
 *  NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY to .env.local, the site
 *  will pull events directly from your Google Calendar instead.
 *
 *  To add an event here manually:
 *    - Copy one object, increment the id, set year/month(0-indexed)/day
 *    - month: 0=Jan 1=Feb 2=Mar 3=Apr 4=May … 11=Dec
 *    - type options: WORKSHOP | SEMINAR | COMPETITION | SOCIAL | LECTURE | HACKATHON
 *    - format options: IN-PERSON | VIRTUAL | HYBRID
 * ─────────────────────────────────────────────────────────────────
 */

import type { CalEvent } from '@/lib/googleCalendar';
export type { CalEvent } from '@/lib/googleCalendar';

export const STATIC_EVENTS: CalEvent[] = [
  {
    id: 1,
    year: 2026, month: 2, day: 14,        // March 14
    time: '18:00 – 20:00',
    title: 'Options Pricing Workshop: Greeks & Vol Surface',
    type: 'WORKSHOP',
    description: 'Hands-on session implementing Black-Scholes in Python, computing Greeks, and visualising the implied vol surface with real market data.',
    location: 'Building A — Room 204',
    format: 'IN-PERSON',
    speaker: 'Guest Speaker, Derivatives Desk',
  },
  {
    id: 2,
    year: 2026, month: 2, day: 21,        // March 21
    time: '17:30 – 19:00',
    title: 'Intro to Algorithmic Trading with Zipline',
    type: 'LECTURE',
    description: 'Beginner-friendly walkthrough of backtesting a momentum strategy using Zipline and Quandl data.',
    location: 'Online — Zoom',
    format: 'VIRTUAL',
    speaker: 'Guest Speaker, Proprietary Desk',
  },
  {
    id: 3,
    year: 2026, month: 3, day: 4,         // April 4
    time: '09:00 – 18:00',
    title: 'Quant Alpha Hackathon 2026',
    type: 'HACKATHON',
    description: 'Full-day team challenge — build and pitch a profitable quant strategy. Prizes for top 3 teams. Data and compute provided.',
    location: 'Building C — Innovation Lab',
    format: 'IN-PERSON',
  },
  {
    id: 4,
    year: 2026, month: 3, day: 16,        // April 16
    time: '18:00 – 19:30',
    title: 'ML in Finance: Signals vs. Noise',
    type: 'SEMINAR',
    description: 'A critical examination of ML in finance — when it works, when it overfits, and how to validate properly.',
    location: 'Auditorium B',
    format: 'HYBRID',
    speaker: 'Guest Speaker, Hedge Fund Analytics',
  },
  {
    id: 5,
    year: 2026, month: 3, day: 23,        // April 23
    time: '16:00 – 17:30',
    title: 'Portfolio Optimisation & Efficient Frontier',
    type: 'WORKSHOP',
    description: 'Implement Markowitz mean-variance optimisation, construct the efficient frontier, and extend to the Black-Litterman model.',
    location: 'Building A — Room 201',
    format: 'IN-PERSON',
  },
  {
    id: 6,
    year: 2026, month: 4, day: 7,         // May 7
    time: '18:30 – 21:00',
    title: 'End-of-Semester Showcase & Social',
    type: 'SOCIAL',
    description: 'Members present semester projects, followed by networking with alumni from quantitative finance roles.',
    location: 'Faculty Lounge — Level 5',
    format: 'IN-PERSON',
  },
];
