import { HabitColor, HabitColorId } from '../types';

/** 8 curated habit colors harmonizing with the app's green accent (#4a8d5f) */
export const HABIT_COLORS: HabitColor[] = [
  {
    id: 'sage',
    label: 'Sage',
    primary: '#4a8d5f',
    faint: 'rgba(74,141,95,0.10)',
    muted: 'rgba(74,141,95,0.22)',
  },
  {
    id: 'teal',
    label: 'Teal',
    primary: '#3a9e8f',
    faint: 'rgba(58,158,143,0.10)',
    muted: 'rgba(58,158,143,0.22)',
  },
  {
    id: 'sky',
    label: 'Sky',
    primary: '#4a90d9',
    faint: 'rgba(74,144,217,0.10)',
    muted: 'rgba(74,144,217,0.22)',
  },
  {
    id: 'lavender',
    label: 'Lavender',
    primary: '#8b7ec8',
    faint: 'rgba(139,126,200,0.10)',
    muted: 'rgba(139,126,200,0.22)',
  },
  {
    id: 'coral',
    label: 'Coral',
    primary: '#e07856',
    faint: 'rgba(224,120,86,0.10)',
    muted: 'rgba(224,120,86,0.22)',
  },
  {
    id: 'amber',
    label: 'Amber',
    primary: '#d4a03c',
    faint: 'rgba(212,160,60,0.10)',
    muted: 'rgba(212,160,60,0.22)',
  },
  {
    id: 'rose',
    label: 'Rose',
    primary: '#c75b7a',
    faint: 'rgba(199,91,122,0.10)',
    muted: 'rgba(199,91,122,0.22)',
  },
  {
    id: 'slate',
    label: 'Slate',
    primary: '#6b7f99',
    faint: 'rgba(107,127,153,0.10)',
    muted: 'rgba(107,127,153,0.22)',
  },
];

/** Look up a habit color by its ID. Falls back to sage. */
export function getHabitColor(id: HabitColorId): HabitColor {
  return HABIT_COLORS.find(c => c.id === id) ?? HABIT_COLORS[0];
}
