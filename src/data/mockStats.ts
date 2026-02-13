import { HabitColorId } from "../types";
import { INITIAL_HABITS } from "./habits";

export interface HabitCompletionRate {
  habitId: string;
  name: string;
  colorId: HabitColorId;
  rate: number;
}

export interface CalendarDay {
  date: string;
  count: number;
}

// Simple hash for deterministic pseudo-random values
function hash(x: number, seed: number): number {
  const h = Math.sin(x * 127.1 + seed * 311.7) * 43758.5453;
  return h - Math.floor(h);
}

// 365 daily completion percentages, trending upward from ~0.4 to ~0.75
export const DAILY_COMPLETION_PERCENT: number[] = Array.from(
  { length: 365 },
  (_, i) => {
    const trend = 0.4 + (0.35 * i) / 364;
    const noise = (hash(i, 1) - 0.5) * 0.3;
    return Math.max(0, Math.min(1, trend + noise));
  },
);

// Per-habit completion rates
export const HABIT_COMPLETION_RATES: HabitCompletionRate[] = INITIAL_HABITS.map(
  (habit, i) => ({
    habitId: habit.id,
    name: habit.name,
    colorId: habit.colorId,
    rate: Math.round((0.45 + hash(i, 42) * 0.5) * 100) / 100,
  }),
);

// Generate calendar heatmap data for a given month
export function generateCalendarData(year: number, month: number): CalendarDay[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days: CalendarDay[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const count = Math.floor(hash(d, month + year) * 9);
    days.push({ date: dateStr, count });
  }
  return days;
}

// Overall daily completion rates for each day of the week (Mon-Sun)
export const AGGREGATE_WEEKLY: number[] = Array.from({ length: 7 }, (_, i) =>
  Math.round((0.5 + hash(i, 99) * 0.4) * 100) / 100,
);
