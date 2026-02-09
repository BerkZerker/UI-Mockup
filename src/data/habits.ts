import { Habit } from '../types';

export const HABITS_INIT: Habit[] = [
  {
    id: 1,
    title: 'Meditate',
    freq: 'Daily',
    streak: 5,
    week: [1, 1, 1, 1, 1, 0, 0],
  },
  {
    id: 2,
    title: 'Read',
    freq: 'Daily',
    streak: 12,
    week: [1, 1, 1, 1, 1, 1, 1],
  },
  {
    id: 3,
    title: 'Exercise',
    freq: '3x/week',
    streak: 3,
    week: [1, 0, 1, 0, 1, 0, 0],
  },
  {
    id: 4,
    title: 'Journal',
    freq: 'Daily',
    streak: 0,
    week: [1, 1, 0, 1, 0, 0, 0],
  },
  {
    id: 5,
    title: 'No sugar',
    freq: 'Daily',
    streak: 8,
    week: [1, 1, 1, 1, 1, 1, 1],
  },
];
