import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Habit, HabitCompletion, CategoryFilter, CompletionStatus } from '../types';
import { HABITS_INIT } from '../data';
import { migrateHabits } from '../data/migration';
import { calculateStreak, getWeekCompletions } from '../utils/streaks';
import { getToday, formatDate } from '../utils/dates';
import { StorageService } from '../storage/StorageService';

interface AppStateContextValue {
  habits: Habit[];
  completions: HabitCompletion[];
  categoryFilter: CategoryFilter;
  userName: string;
  loading: boolean;
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (habitId: string, date: string, status?: CompletionStatus) => void;
  getHabitStreak: (habitId: string) => number;
  getHabitWeek: (habitId: string) => (CompletionStatus | null)[];
  setCategoryFilter: (cat: CategoryFilter) => void;
  setUserName: (name: string) => void;
  resetAll: () => void;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

interface AppStateProviderProps {
  children: ReactNode;
}

/** Provides global app state with persistence via AsyncStorage */
export function AppStateProvider({ children }: AppStateProviderProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');
  const [userName, setUserName] = useState('Sam');
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Hydrate from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await StorageService.loadAll();
        if (data) {
          setHabits(data.habits);
          setCompletions(data.completions);
          if (data.settings) {
            setUserName(data.settings.userName || 'Sam');
            setCategoryFilter(data.settings.categoryFilter || 'All');
          }
        } else {
          // First launch: migrate from mock data
          const migrated = migrateHabits(HABITS_INIT as any);
          setHabits(migrated.habits);
          setCompletions(migrated.completions);
        }
      } catch {
        // Fallback to migration on error
        const migrated = migrateHabits(HABITS_INIT as any);
        setHabits(migrated.habits);
        setCompletions(migrated.completions);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    })();
  }, []);

  // Auto-save when state changes (after initial load)
  useEffect(() => {
    if (!initialized) return;
    StorageService.saveAll({
      habits,
      completions,
      settings: { userName, categoryFilter },
    });
  }, [habits, completions, userName, categoryFilter, initialized]);

  const addHabit = useCallback((habit: Habit) => {
    setHabits(prev => [...prev, habit]);
  }, []);

  const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    setCompletions(prev => prev.filter(c => c.habitId !== id));
  }, []);

  const toggleHabitCompletion = useCallback((habitId: string, date: string, status?: CompletionStatus) => {
    setCompletions(prev => {
      const existing = prev.findIndex(c => c.habitId === habitId && c.date === date);
      if (existing >= 0) {
        const currentStatus = prev[existing].status;
        if (status) {
          if (status === currentStatus) {
            return prev.filter((_, i) => i !== existing);
          }
          return prev.map((c, i) => i === existing ? { ...c, status } : c);
        }
        return prev.filter((_, i) => i !== existing);
      }
      return [...prev, {
        habitId,
        date,
        status: status || 'completed',
        value: null,
      }];
    });
  }, []);

  const getHabitStreak = useCallback((habitId: string): number => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return 0;
    return calculateStreak(habit, completions);
  }, [habits, completions]);

  const getHabitWeek = useCallback((habitId: string): (CompletionStatus | null)[] => {
    return getWeekCompletions(habitId, completions);
  }, [completions]);

  const resetAll = useCallback(async () => {
    const migrated = migrateHabits(HABITS_INIT as any);
    setHabits(migrated.habits);
    setCompletions(migrated.completions);
    setCategoryFilter('All');
    setUserName('Sam');
    await StorageService.clearAll();
  }, []);

  const value: AppStateContextValue = {
    habits,
    completions,
    categoryFilter,
    userName,
    loading,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    getHabitStreak,
    getHabitWeek,
    setCategoryFilter,
    setUserName,
    resetAll,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

/** Access the global app state. Must be used within AppStateProvider. */
export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}
