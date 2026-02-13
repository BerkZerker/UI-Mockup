export type HabitColorId =
  | "sage"
  | "teal"
  | "sky"
  | "lavender"
  | "coral"
  | "amber"
  | "rose"
  | "slate";

export type ThemeMode = "dark" | "light";

export interface Habit {
  id: string;
  name: string;
  colorId: HabitColorId;
  streak: number;
  completed: boolean;
  time: string;
  weekly: number[];
  hasVoiceNote?: boolean;
}

export interface ThemeColors {
  bg: string;
  surface1: string;
  surface2: string;
  surface3: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderSubtle: string;
  accent: string;
  accentHover: string;
  accentFaint: string;
  accentMuted: string;
  accentGlass: string;
  danger: string;
  glassBackground: string;
  glassBorder: string;
}

export interface HabitColor {
  id: HabitColorId;
  label: string;
  primary: string;
}
