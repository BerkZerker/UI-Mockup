export interface Goal {
  id: number;
  title: string;
  cat: string;
  done: boolean;
  streak: number;
  today: boolean;
}

export interface Habit {
  id: number;
  title: string;
  freq: string;
  streak: number;
  week: number[];
}

export interface LongGoal {
  id: number;
  title: string;
  pct: number;
  target: string;
  current: string;
  deadline: string;
}

export interface PlanDay {
  day: string;
  date: string;
  tasks: number;
  done: number;
}

export interface ThemeColors {
  bg: string;
  bgSecondary: string;
  bgTertiary: string;
  bgElevated: string;
  glassBg: string;
  glassBorder: string;
  glassHighlight: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  borderSubtle: string;
  pillBg: string;
  pillText: string;
  success: string;
  danger: string;
}

export interface AccentColors {
  primary: string;
  primaryHover: string;
  onPrimary: string;
  primaryFaint: string;
  primaryMuted: string;
  primaryGlass: string;
}

export type ThemeMode = 'dark' | 'light';
