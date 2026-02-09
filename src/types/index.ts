export type Category = 'Wellness' | 'Learning' | 'Creative' | 'Fitness' | 'Finance';
export type CategoryFilter = Category | 'All';
export type Frequency = 'Daily' | '3x/week' | '2x/week' | 'Weekly';
export type WeekDay = 0 | 1;

export interface Goal {
  id: number;
  title: string;
  category: Category;
  done: boolean;
  streak: number;
  today: boolean;
}

export interface Habit {
  id: number;
  title: string;
  frequency: Frequency;
  streak: number;
  week: WeekDay[];
}

export interface LongGoal {
  id: number;
  title: string;
  percent: number;
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
