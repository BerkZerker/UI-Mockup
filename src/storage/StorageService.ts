import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, HabitCompletion, CategoryFilter } from '../types';

const KEYS = {
  habits: '@scaffold/habits',
  completions: '@scaffold/completions',
  settings: '@scaffold/settings',
  schemaVersion: '@scaffold/schemaVersion',
} as const;

const CURRENT_SCHEMA_VERSION = 1;

interface StoredSettings {
  userName: string;
  categoryFilter: CategoryFilter;
}

interface StoredData {
  habits: Habit[];
  completions: HabitCompletion[];
  settings: StoredSettings | null;
}

interface SavePayload {
  habits: Habit[];
  completions: HabitCompletion[];
  settings: StoredSettings;
}

/** Persistent storage service using AsyncStorage */
export const StorageService = {
  /** Load all persisted data. Returns null on first launch. */
  async loadAll(): Promise<StoredData | null> {
    const version = await AsyncStorage.getItem(KEYS.schemaVersion);
    if (!version) return null; // first launch

    const [habitsStr, completionsStr, settingsStr] = await AsyncStorage.multiGet([
      KEYS.habits,
      KEYS.completions,
      KEYS.settings,
    ]);

    return {
      habits: habitsStr[1] ? JSON.parse(habitsStr[1]) : [],
      completions: completionsStr[1] ? JSON.parse(completionsStr[1]) : [],
      settings: settingsStr[1] ? JSON.parse(settingsStr[1]) : null,
    };
  },

  /** Save all data to storage */
  async saveAll(data: SavePayload): Promise<void> {
    await AsyncStorage.multiSet([
      [KEYS.habits, JSON.stringify(data.habits)],
      [KEYS.completions, JSON.stringify(data.completions)],
      [KEYS.settings, JSON.stringify(data.settings)],
      [KEYS.schemaVersion, String(CURRENT_SCHEMA_VERSION)],
    ]);
  },

  /** Clear all stored data */
  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  },

  /** Export all data as a JSON string */
  async exportData(): Promise<string> {
    const data = await this.loadAll();
    return JSON.stringify(data, null, 2);
  },

  /** Import data from a JSON string. Validates structure before saving. */
  async importData(json: string): Promise<boolean> {
    try {
      const data = JSON.parse(json);
      if (!data || !Array.isArray(data.habits) || !Array.isArray(data.completions)) {
        return false;
      }
      await this.saveAll({
        habits: data.habits,
        completions: data.completions,
        settings: data.settings || { userName: 'Sam', categoryFilter: 'All' },
      });
      return true;
    } catch {
      return false;
    }
  },
};
