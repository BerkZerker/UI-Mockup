import { useState, useEffect, useMemo } from 'react';
import { View, Text, Switch, ScrollView, StyleSheet, Pressable, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Download, Upload, Trash2, Info, ChevronRight } from 'lucide-react-native';
import { Paths, File } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, INTERACTIVE } from '../../src/theme';
import { useAppState } from '../../src/state';
import { StorageService } from '../../src/storage/StorageService';
import { calculateCompletionRate } from '../../src/utils/streaks';
import { ScreenHeader, StatsSummaryCard } from '../../src/components';
import appJson from '../../app.json';

const APP_VERSION = appJson.expo.version;
const NOTIF_KEYS = {
  daily: '@scaffold/notif_daily',
  streak: '@scaffold/notif_streak',
};

export default function SettingsScreen() {
  const { theme, accent, mode, toggleMode } = useTheme();
  const { habits, completions, userName, setUserName, resetAll, getHabitStreak } = useAppState();

  const [dailyReminders, setDailyReminders] = useState(false);
  const [streakAlerts, setStreakAlerts] = useState(false);

  const activeHabits = useMemo(() => habits.filter(h => !h.archived), [habits]);

  const bestStreak = useMemo(() => {
    return activeHabits.reduce((max, h) => Math.max(max, getHabitStreak(h.id)), 0);
  }, [activeHabits, getHabitStreak]);

  const overallCompletion = useMemo(() => {
    if (activeHabits.length === 0) return 0;
    const total = activeHabits.reduce((sum, h) => sum + calculateCompletionRate(h, completions, 30), 0);
    return Math.round(total / activeHabits.length);
  }, [activeHabits, completions]);

  // Load notification preferences
  useEffect(() => {
    AsyncStorage.getItem(NOTIF_KEYS.daily).then(v => setDailyReminders(v === 'true')).catch(() => {});
    AsyncStorage.getItem(NOTIF_KEYS.streak).then(v => setStreakAlerts(v === 'true')).catch(() => {});
  }, []);

  const toggleDaily = (value: boolean) => {
    setDailyReminders(value);
    AsyncStorage.setItem(NOTIF_KEYS.daily, String(value)).catch(() => {});
  };

  const toggleStreak = (value: boolean) => {
    setStreakAlerts(value);
    AsyncStorage.setItem(NOTIF_KEYS.streak, String(value)).catch(() => {});
  };

  const handleExport = async () => {
    try {
      const json = await StorageService.exportData();
      const file = new File(Paths.cache, 'scaffold-backup.json');
      file.write(json);
      await Sharing.shareAsync(file.uri, {
        mimeType: 'application/json',
        dialogTitle: 'Export Scaffold Data',
      });
    } catch {
      Alert.alert('Export Failed', 'Could not export data.');
    }
  };

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets?.[0]) return;
      const importedFile = new File(result.assets[0].uri);
      const content = await importedFile.text();
      if (!content) {
        Alert.alert('Import Failed', 'Could not read the file.');
        return;
      }
      const success = await StorageService.importData(content);
      if (success) {
        Alert.alert('Import Successful', 'Data imported. Restart the app to see changes.');
      } else {
        Alert.alert('Import Failed', 'Invalid data format.');
      }
    } catch {
      Alert.alert('Import Failed', 'Could not read the file.');
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset All Data',
      'This will erase all habits and settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: () => resetAll(),
        },
      ]
    );
  };

  const initials = userName
    .split(' ')
    .map(w => w.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'S';

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Settings" subtitle="Preferences and configuration" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={[styles.avatar, { backgroundColor: accent.primaryMuted }]}>
            <Text style={[styles.avatarText, { color: accent.primary }]}>{initials}</Text>
          </View>
          <TextInput
            value={userName}
            onChangeText={setUserName}
            style={[
              styles.nameInput,
              {
                color: theme.text,
                backgroundColor: theme.bgSecondary,
                borderColor: theme.borderSubtle,
              },
            ]}
            placeholder="Your name"
            placeholderTextColor={theme.textTertiary}
          />
          <StatsSummaryCard
            title="Quick stats"
            stats={[
              { label: 'Habits', value: `${activeHabits.length}` },
              { label: 'Best streak', value: `${bestStreak}d` },
              { label: 'Completion', value: `${overallCompletion}%` },
            ]}
          />
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textTertiary }]}>
            APPEARANCE
          </Text>
          <View style={[styles.settingRow, { borderBottomColor: theme.borderSubtle }]}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
            <Switch
              value={mode === 'dark'}
              onValueChange={toggleMode}
              trackColor={{ false: theme.pillBg, true: theme.success }}
              thumbColor="#fff"
              accessibilityLabel="Dark mode"
              accessibilityRole="switch"
            />
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textTertiary }]}>
            NOTIFICATIONS
          </Text>
          <View style={[styles.settingRow, { borderBottomColor: theme.borderSubtle }]}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              Daily Reminders
            </Text>
            <Switch
              value={dailyReminders}
              onValueChange={toggleDaily}
              trackColor={{ false: theme.pillBg, true: theme.success }}
              thumbColor="#fff"
              accessibilityLabel="Daily reminders"
              accessibilityRole="switch"
            />
          </View>
          <View style={[styles.settingRow, { borderBottomColor: theme.borderSubtle }]}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              Streak Alerts
            </Text>
            <Switch
              value={streakAlerts}
              onValueChange={toggleStreak}
              trackColor={{ false: theme.pillBg, true: theme.success }}
              thumbColor="#fff"
              accessibilityLabel="Streak alerts"
              accessibilityRole="switch"
            />
          </View>
          <View style={styles.notifInfo}>
            <Info size={12} color={theme.textTertiary} />
            <Text style={[styles.notifInfoText, { color: theme.textTertiary }]}>
              Push notifications require a development build.
            </Text>
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textTertiary }]}>
            DATA
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.settingRow,
              { borderBottomColor: theme.borderSubtle, opacity: pressed ? INTERACTIVE.pressedOpacity : 1 },
            ]}
            onPress={handleExport}
          >
            <View style={styles.settingLeft}>
              <Download size={18} color={theme.text} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Export Data</Text>
            </View>
            <ChevronRight size={16} color={theme.textTertiary} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.settingRow,
              { borderBottomColor: theme.borderSubtle, opacity: pressed ? INTERACTIVE.pressedOpacity : 1 },
            ]}
            onPress={handleImport}
          >
            <View style={styles.settingLeft}>
              <Upload size={18} color={theme.text} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Import Data</Text>
            </View>
            <ChevronRight size={16} color={theme.textTertiary} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.settingRow,
              { borderBottomWidth: 0, opacity: pressed ? INTERACTIVE.pressedOpacity : 1 },
            ]}
            onPress={handleReset}
          >
            <View style={styles.settingLeft}>
              <Trash2 size={18} color={theme.danger} />
              <Text style={[styles.settingLabel, { color: theme.danger }]}>Reset All Data</Text>
            </View>
          </Pressable>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textTertiary }]}>
            ABOUT
          </Text>
          <View style={[styles.settingRow, { borderBottomColor: theme.borderSubtle }]}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Version</Text>
            <Text style={[styles.settingValue, { color: theme.textTertiary }]}>
              {APP_VERSION}
            </Text>
          </View>
          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Licenses</Text>
            <Text style={[styles.settingValue, { color: theme.textTertiary }]}>
              Open Source
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: SPACING.xxl,
    paddingBottom: 100,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xxl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  avatarText: {
    fontSize: FONT_SIZE['6xl'],
    fontWeight: FONT_WEIGHT.bold,
  },
  nameInput: {
    fontSize: FONT_SIZE['2xl'],
    fontWeight: FONT_WEIGHT.medium,
    textAlign: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderWidth: 1,
    borderRadius: RADIUS.lg,
    width: '100%',
    marginBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xxxl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.lg - 2,
    paddingHorizontal: SPACING.xl,
    borderBottomWidth: 1,
  },
  settingLabel: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.regular,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  settingValue: {
    fontSize: FONT_SIZE.xl,
  },
  notifInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.sm,
  },
  notifInfoText: {
    fontSize: FONT_SIZE.sm,
  },
});
