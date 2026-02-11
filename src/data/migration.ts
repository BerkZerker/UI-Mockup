import { Habit, HabitCompletion, HabitColorId } from '../types';
import { formatDate, getDayOfWeek } from '../utils/dates';

interface OldHabit {
  id: number;
  title: string;
  frequency: string;
  streak: number;
  week: (0 | 1)[];
}

const COLOR_ROTATION: HabitColorId[] = ['sage', 'teal', 'sky', 'lavender', 'coral', 'amber', 'rose', 'slate'];

/** Migrate old mock habits to new Habit[] + HabitCompletion[] format */
export function migrateHabits(oldHabits: OldHabit[]): { habits: Habit[]; completions: HabitCompletion[] } {
  const habits: Habit[] = [];
  const completions: HabitCompletion[] = [];

  // Find the Monday of the current week
  const today = new Date();
  const jsDay = today.getDay();
  const mondayOffset = jsDay === 0 ? 6 : jsDay - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);

  oldHabits.forEach((old, idx) => {
    const habitId = `migrated-${old.id}`;

    habits.push({
      id: habitId,
      title: old.title,
      colorId: COLOR_ROTATION[idx % COLOR_ROTATION.length],
      icon: '',
      category: 'Wellness',
      selectedDays: [],
      targetValue: null,
      targetUnit: null,
      notes: '',
      createdAt: new Date().toISOString(),
      reminderEnabled: false,
      reminderTime: null,
      archived: false,
    });

    // Convert the week array into completions for this week
    old.week.forEach((done, dayIdx) => {
      if (done === 1) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + dayIdx);
        completions.push({
          habitId,
          date: formatDate(d),
          status: 'completed',
          value: null,
        });
      }
    });
  });

  return { habits, completions };
}
