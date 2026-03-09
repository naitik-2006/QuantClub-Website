/**
 * Google Calendar Integration
 *
 * HOW TO CONNECT YOUR GOOGLE CALENDAR:
 * 1. Go to https://calendar.google.com → create a new calendar for the club
 * 2. Open Settings → click the calendar → scroll to "Share with specific people"
 *    → tick "Make available to public"
 * 3. Scroll to "Integrate calendar" → copy your Calendar ID
 *    (looks like: abc123@group.calendar.google.com or your Gmail address)
 * 4. Go to https://console.cloud.google.com → create a project → enable
 *    "Google Calendar API" → Credentials → Create API Key
 * 5. Add both values to a .env.local file at the project root:
 *       NEXT_PUBLIC_GOOGLE_CALENDAR_ID=your-calendar-id-here
 *       NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY=your-api-key-here
 * 6. Restart the dev server. That's it — events you add in Google Calendar
 *    will automatically appear on the website.
 *
 * EVENT TYPE auto-detection from title keywords:
 *   workshop / session / hands-on  → WORKSHOP  (cyan)
 *   seminar / talk / panel         → SEMINAR   (purple)
 *   hackathon / hack               → HACKATHON (red)
 *   social / networking / mixer    → SOCIAL    (green)
 *   lecture / intro / class        → LECTURE   (blue)
 *   competition / contest          → COMPETITION (amber)
 *
 * SPECIAL DESCRIPTION LINES (add to the Google Calendar event description):
 *   Speaker: Dr. Jane Smith, MIT       → shows speaker credit on the card
 *   Link: https://zoom.us/j/123...     → makes the RSVP button open that URL
 *   (both lines are hidden from the public description shown on the website)
 */

export type EventType = 'WORKSHOP' | 'SEMINAR' | 'COMPETITION' | 'SOCIAL' | 'LECTURE' | 'HACKATHON';
export type Format    = 'IN-PERSON' | 'VIRTUAL' | 'HYBRID';

export interface CalEvent {
  id:          number;
  year:        number;
  month:       number; // 0-indexed
  day:         number;
  time:        string;
  title:       string;
  type:        EventType;
  description: string;
  location:    string;
  format:      Format;
  speaker?:    string;
  link?:       string; // Zoom / registration URL
}

interface GoogleRawEvent {
  id:          string;
  summary?:    string;
  description?:string;
  location?:   string;
  start:       { dateTime?: string; date?: string };
  end:         { dateTime?: string; date?: string };
}

/* ─── Fetch from Google Calendar API ─── */
export async function fetchGoogleCalendarEvents(
  calendarId: string,
  apiKey: string,
): Promise<CalEvent[]> {
  const timeMin = new Date().toISOString();
  const url = [
    'https://www.googleapis.com/calendar/v3/calendars/',
    encodeURIComponent(calendarId),
    '/events?key=', apiKey,
    '&timeMin=', encodeURIComponent(timeMin),
    '&maxResults=50',
    '&singleEvents=true',
    '&orderBy=startTime',
  ].join('');

  const res = await fetch(url, { next: { revalidate: 300 } }); // cache 5 min
  if (!res.ok) {
    throw new Error(`Google Calendar API responded with ${res.status}`);
  }

  const json = await res.json();
  const items: GoogleRawEvent[] = json.items ?? [];

  return items
    .filter(e => e.summary) // skip events with no title
    .map((e, idx) => parseRawEvent(e, idx + 1));
}

/* ─── Parse a raw Google Calendar event into our CalEvent shape ─── */
function parseRawEvent(e: GoogleRawEvent, id: number): CalEvent {
  const startStr  = e.start.dateTime ?? e.start.date ?? '';
  const endStr    = e.end.dateTime   ?? e.end.date   ?? startStr;
  const start     = new Date(startStr);
  const end       = new Date(endStr);
  const allDay    = !e.start.dateTime;

  const fmt = (d: Date) =>
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const time = allDay ? 'All Day' : `${fmt(start)} – ${fmt(end)}`;

  // Extract special lines from description
  const speakerMatch = e.description?.match(/^Speaker:\s*(.+)$/im);
  const speaker      = speakerMatch?.[1]?.trim();

  const linkMatch    = e.description?.match(/^Link:\s*(\S+)$/im);
  const link         = linkMatch?.[1]?.trim();

  // Strip "Speaker: …" and "Link: …" lines from the public description
  const description  = (e.description ?? 'No description provided.')
    .replace(/^Speaker:.*$/im, '')
    .replace(/^Link:.*$/im, '')
    .trim() || 'No description provided.';

  return {
    id,
    year:   start.getFullYear(),
    month:  start.getMonth(),
    day:    start.getDate(),
    time,
    title:  e.summary ?? 'Untitled Event',
    type:   inferType(e.summary ?? ''),
    description,
    location: e.location ?? 'TBD',
    format:   inferFormat(e.location ?? ''),
    speaker,
    link,
  };
}

/* ─── Heuristics ─── */
function inferType(title: string): EventType {
  const t = title.toLowerCase();
  if (/hackathon|hack/.test(t))                  return 'HACKATHON';
  if (/workshop|session|hands.on|tutorial/.test(t)) return 'WORKSHOP';
  if (/seminar|talk|panel|keynote/.test(t))      return 'SEMINAR';
  if (/social|network|mixer|showcase/.test(t))   return 'SOCIAL';
  if (/competition|contest|challenge/.test(t))   return 'COMPETITION';
  if (/lecture|intro|class|course/.test(t))      return 'LECTURE';
  return 'WORKSHOP';
}

function inferFormat(location: string): Format {
  const l = location.toLowerCase();
  if (/zoom|meet|teams|online|virtual|discord|webex/.test(l)) return 'VIRTUAL';
  if (/hybrid/.test(l)) return 'HYBRID';
  return 'IN-PERSON';
}
