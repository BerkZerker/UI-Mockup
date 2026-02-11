import { useMemo } from 'react';
import { Habit, HabitCompletion, CompletionStatus } from '../types';
import { formatDate, getDayOfWeek } from '../utils/dates';
import { calculateStreak } from '../utils/streaks';

interface HeatmapDay {
  date: string;
  status: CompletionStatus | null;
}

interface StreakPoint {
  date: string;
  streak: number;
}

interface WeeklyBar {
  label: string;
  completed: number;
  total: number;
}

interface HabitChartData {
  heatmapData: HeatmapDay[];
  streakData: StreakPoint[];
  weeklyBarData: WeeklyBar[];
}

/** Compute chart data for a habit's detail view */
export function useHabitChartData(
  habit: Habit | undefined,
  completions: HabitCompletion[]
): HabitChartData {
  return useMemo(() => {
    if (!habit) {
      return { heatmapData: [], streakData: [], weeklyBarData: [] };
    }

    const habitCompletions = completions.filter(c => c.habitId === habit.id);
    const completionMap = new Map<string, CompletionStatus>();
    habitCompletions.forEach(c => completionMap.set(c.date, c.status));

    const scheduledDays = habit.selectedDays.length === 0
      ? [0, 1, 2, 3, 4, 5, 6]
      : habit.selectedDays;

    const today = new Date();

    // Heatmap: last 91 days (13 weeks)
    const heatmapData: HeatmapDay[] = [];
    for (let i = 90; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = formatDate(d);
      heatmapData.push({
        date: dateStr,
        status: completionMap.get(dateStr) ?? null,
      });
    }

    // Streak over time: last 30 days
    const streakData: StreakPoint[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = formatDate(d);

      // Count streak backward from this date
      let streak = 0;
      const walker = new Date(d);
      for (let j = 0; j < 365; j++) {
        const wDateStr = formatDate(walker);
        const dow = getDayOfWeek(walker);
        if (scheduledDays.includes(dow)) {
          const status = completionMap.get(wDateStr);
          if (status === 'completed') {
            streak++;
          } else if (status === 'skipped') {
            // skip
          } else {
            if (j > 0) break;
          }
        }
        walker.setDate(walker.getDate() - 1);
      }
      streakData.push({ date: dateStr, streak });
    }

    // Weekly bar data: last 8 weeks
    const weeklyBarData: WeeklyBar[] = [];
    for (let w = 7; w >= 0; w--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (w * 7 + (today.getDay() === 0 ? 6 : today.getDay() - 1)));
      let completed = 0;
      let total = 0;
      for (let d = 0; d < 7; d++) {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + d);
        if (day > today) continue;
        const dow = getDayOfWeek(day);
        if (scheduledDays.includes(dow)) {
          total++;
          if (completionMap.get(formatDate(day)) === 'completed') {
            completed++;
          }
        }
      }
      weeklyBarData.push({
        label: `W${8 - w}`,
        completed,
        total: Math.max(total, 1),
      });
    }

    return { heatmapData, streakData, weeklyBarData };
  }, [habit, completions]);
}
