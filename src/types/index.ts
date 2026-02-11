/** Categories for organizing habits */
export type Category = 'Wellness' | 'Learning' | 'Creative' | 'Fitness' | 'Finance';

/** Filter type that includes 'All' option for UI filtering */
export type CategoryFilter = Category | 'All';

/** Legacy frequency label - kept for display purposes */
export type Frequency = 'Daily' | '3x/week' | '2x/week' | 'Weekly';

/** Legacy binary day state: 0=incomplete, 1=complete */
export type WeekDay = 0 | 1;

/** Curated habit color identifiers from the app's palette */
export type HabitColorId = 'sage' | 'teal' | 'sky' | 'lavender' | 'coral' | 'amber' | 'rose' | 'slate';

/** Lucide icon name string */
export type HabitIconName = string;

/** Day of the week: 0=Monday through 6=Sunday */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Units for quantifiable habit targets */
export type TargetUnit = 'minutes' | 'hours' | 'pages' | 'glasses' | 'reps' | 'steps' | 'custom';

/** Three-state completion tracking: completed, skipped (doesn't break streak), or missed */
export type CompletionStatus = 'completed' | 'skipped' | 'missed';

/** Theme appearance mode */
export type ThemeMode = 'dark' | 'light';

/** A trackable habit with customizable frequency, color, and targets */
export interface Habit {
  /** UUID string identifier */
  id: string;
  /** Display name */
  title: string;
  /** Color palette identifier for UI theming */
  colorId: HabitColorId;
  /** Lucide icon name for visual identification */
  icon: HabitIconName;
  /** Organizational category */
  category: Category;
  /** Days of week this habit is scheduled. Empty array = daily (all 7 days) */
  selectedDays: DayOfWeek[];
  /** Optional numeric target value (e.g., 30 for 30 minutes) */
  targetValue: number | null;
  /** Unit for the target value */
  targetUnit: TargetUnit | null;
  /** Optional user notes */
  notes: string;
  /** ISO date string when habit was created */
  createdAt: string;
  /** Whether reminders are enabled (UI-only in Expo Go) */
  reminderEnabled: boolean;
  /** Time string for reminder (HH:MM format) */
  reminderTime: string | null;
  /** Whether the habit is archived (hidden from main views) */
  archived: boolean;
}

/** Record of a habit's status on a specific date */
export interface HabitCompletion {
  /** ID of the associated habit */
  habitId: string;
  /** Date string in YYYY-MM-DD format */
  date: string;
  /** Completion state: completed, skipped, or missed */
  status: CompletionStatus;
  /** Optional quantity value for target-based habits */
  value: number | null;
}

/** Theme color tokens for light/dark mode */
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

/** Accent color tokens derived from the primary brand color */
export interface AccentColors {
  primary: string;
  primaryHover: string;
  onPrimary: string;
  primaryFaint: string;
  primaryMuted: string;
  primaryGlass: string;
}

/** A single color from the habit color palette */
export interface HabitColor {
  /** Palette identifier */
  id: HabitColorId;
  /** Display label */
  label: string;
  /** Full-opacity hex color */
  primary: string;
  /** 10% opacity variant for backgrounds */
  faint: string;
  /** 22% opacity variant for muted elements */
  muted: string;
}

/** User preferences persisted to storage */
export interface UserSettings {
  /** Current theme appearance */
  themeMode: ThemeMode;
  /** Default category filter on app launch */
  defaultCategory: CategoryFilter;
  /** Whether daily reminder notifications are enabled (UI-only) */
  remindersDailyEnabled: boolean;
  /** Whether streak alert notifications are enabled (UI-only) */
  remindersStreakEnabled: boolean;
}
