import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Goal, Habit } from '../types';
import { GOALS_INIT, HABITS_INIT } from '../data';

interface AppStateContextValue {
  goals: Goal[];
  habits: Habit[];
  categoryFilter: string;
  userName: string;
  toggleGoal: (id: number) => void;
  toggleHabitDay: (habitId: number, dayIndex: number) => void;
  setCategoryFilter: (cat: string) => void;
  setUserName: (name: string) => void;
  resetAll: () => void;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

interface AppStateProviderProps {
  children: ReactNode;
}

export function AppStateProvider({ children }: AppStateProviderProps) {
  const [goals, setGoals] = useState<Goal[]>(GOALS_INIT);
  const [habits, setHabits] = useState<Habit[]>(HABITS_INIT);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [userName, setUserName] = useState('Sam');

  const toggleGoal = (id: number) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, done: !g.done } : g))
    );
  };

  const toggleHabitDay = (habitId: number, dayIndex: number) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId
          ? {
              ...h,
              week: h.week.map((v, i) => (i === dayIndex ? (v ? 0 : 1) : v)),
            }
          : h
      )
    );
  };

  const resetAll = () => {
    setGoals(GOALS_INIT);
    setHabits(HABITS_INIT);
    setCategoryFilter('All');
    setUserName('Sam');
  };

  const value: AppStateContextValue = {
    goals,
    habits,
    categoryFilter,
    userName,
    toggleGoal,
    toggleHabitDay,
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

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
}
