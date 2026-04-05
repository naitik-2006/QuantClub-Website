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

export const STATIC_EVENTS: CalEvent[] = [];
