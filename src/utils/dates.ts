import { DayOfWeek } from '../types';

/** Get today's date as YYYY-MM-DD string */
export function getToday(): string {
  return formatDate(new Date());
}

/** Format a Date object as YYYY-MM-DD */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Get the Monday of the current week as YYYY-MM-DD */
export function getWeekStart(): string {
  const now = new Date();
  const jsDay = now.getDay(); // 0=Sun, 1=Mon, ...
  const diff = jsDay === 0 ? 6 : jsDay - 1; // convert to Mon=0
  const monday = new Date(now);
  monday.setDate(now.getDate() - diff);
  return formatDate(monday);
}

/** Convert a Date to our DayOfWeek (0=Mon, 6=Sun) */
export function getDayOfWeek(date: Date): DayOfWeek {
  const jsDay = date.getDay(); // 0=Sun
  return (jsDay === 0 ? 6 : jsDay - 1) as DayOfWeek;
}

/** Get the last N days as YYYY-MM-DD strings (most recent first) */
export function getLastNDays(n: number): string[] {
  const days: string[] = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    days.push(formatDate(d));
  }
  return days;
}

/** Parse a YYYY-MM-DD string into a Date object (local timezone) */
export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Get the short month label for a date (e.g., "Jan", "Feb") */
export function getMonthLabel(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short' });
}
