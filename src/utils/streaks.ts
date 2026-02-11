import { Habit, HabitCompletion, CompletionStatus, DayOfWeek } from '../types';
import { formatDate, getDayOfWeek, parseDate, getToday } from './dates';

/** Get the effective scheduled days (empty = all 7 days) */
function getScheduledDays(habit: Habit): DayOfWeek[] {
  return habit.selectedDays.length === 0
    ? [0, 1, 2, 3, 4, 5, 6]
    : habit.selectedDays;
}

/** Check if a date is a scheduled day for the habit */
function isScheduledDay(habit: Habit, date: Date): boolean {
  const dow = getDayOfWeek(date);
  return getScheduledDays(habit).includes(dow);
}

/** Build a lookup map from completions for a specific habit */
function buildCompletionMap(habitId: string, completions: HabitCompletion[]): Map<string, CompletionStatus> {
  const map = new Map<string, CompletionStatus>();
  for (const c of completions) {
    if (c.habitId === habitId) {
      map.set(c.date, c.status);
    }
  }
  return map;
}

/** Calculate the current streak for a habit (walking backward from today).
 *  Skipped days and non-scheduled days don't break the streak. */
export function calculateStreak(habit: Habit, completions: HabitCompletion[]): number {
  const map = buildCompletionMap(habit.id, completions);
  const today = new Date();
  let streak = 0;
  const d = new Date(today);

  for (let i = 0; i < 365; i++) {
    const dateStr = formatDate(d);
    if (isScheduledDay(habit, d)) {
      const status = map.get(dateStr);
      if (status === 'completed') {
        streak++;
      } else if (status === 'skipped') {
        // skipped doesn't break streak, but doesn't count
      } else {
        // If it's today and not yet marked, don't break
        if (i === 0) {
          // today hasn't ended yet, skip
        } else {
          break;
        }
      }
    }
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

/** Calculate the longest streak ever for a habit */
export function calculateLongestStreak(habit: Habit, completions: HabitCompletion[]): number {
  const map = buildCompletionMap(habit.id, completions);

  // Get all completion dates sorted ascending
  const dates = Array.from(map.keys()).sort();
  if (dates.length === 0) return 0;

  const startDate = parseDate(dates[0]);
  const endDate = new Date();
  let longest = 0;
  let current = 0;
  const d = new Date(startDate);

  while (d <= endDate) {
    const dateStr = formatDate(d);
    if (isScheduledDay(habit, d)) {
      const status = map.get(dateStr);
      if (status === 'completed') {
        current++;
        longest = Math.max(longest, current);
      } else if (status === 'skipped') {
        // doesn't break or add
      } else {
        current = 0;
      }
    }
    d.setDate(d.getDate() + 1);
  }
  return longest;
}

/** Get completion statuses for the current week (Mon-Sun) */
export function getWeekCompletions(
  habitId: string,
  completions: HabitCompletion[]
): (CompletionStatus | null)[] {
  const map = buildCompletionMap(habitId, completions);
  const today = new Date();
  const jsDay = today.getDay();
  const mondayOffset = jsDay === 0 ? 6 : jsDay - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);

  const result: (CompletionStatus | null)[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = formatDate(d);
    result.push(map.get(dateStr) ?? null);
  }
  return result;
}

/** Get a human-readable frequency label from selectedDays */
export function getFrequencyLabel(selectedDays: DayOfWeek[]): string {
  if (selectedDays.length === 0 || selectedDays.length === 7) return 'Daily';
  if (selectedDays.length === 5 &&
    [0, 1, 2, 3, 4].every(d => selectedDays.includes(d as DayOfWeek))) {
    return 'Weekdays';
  }
  if (selectedDays.length === 2 &&
    [5, 6].every(d => selectedDays.includes(d as DayOfWeek))) {
    return 'Weekends';
  }
  return `${selectedDays.length}x/week`;
}

/** Calculate completion rate over the last N days */
export function calculateCompletionRate(
  habit: Habit,
  completions: HabitCompletion[],
  days: number = 30
): number {
  const map = buildCompletionMap(habit.id, completions);
  const today = new Date();
  let scheduled = 0;
  let completed = 0;

  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (isScheduledDay(habit, d)) {
      scheduled++;
      const status = map.get(formatDate(d));
      if (status === 'completed') completed++;
    }
  }
  return scheduled > 0 ? Math.round((completed / scheduled) * 100) : 0;
}
