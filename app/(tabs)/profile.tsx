import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, INTERACTIVE } from '../../src/theme';
import { useAppState } from '../../src/state/AppStateContext';
import { ScreenHeader, StatsSummaryCard, GlassCard } from '../../src/components';

export default function ProfileScreen() {
  const { theme, accent } = useTheme();
  const { userName, setUserName, goals, habits, resetAll } = useAppState();

  const totalGoals = goals.length;
  const totalHabits = habits.length;
  const doneGoals = goals.filter((g) => g.done && g.today).length;
  const todayGoals = goals.filter((g) => g.today).length;
  const completionPct = todayGoals > 0 ? Math.round((doneGoals / todayGoals) * 100) : 0;

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleReset = () => {
    Alert.alert(
      'Reset All Data',
      'This will reset all goals, habits, and settings to their initial values. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: resetAll,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Profile" subtitle="Your information and stats" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: accent.primary }]}>
            <Text style={styles.initials}>{initials}</Text>
          </View>
        </View>

        {/* Name Input */}
        <GlassCard style={styles.nameCard}>
          <Text style={[styles.nameLabel, { color: theme.textSecondary }]}>Name</Text>
          <TextInput
            value={userName}
            onChangeText={setUserName}
            style={[
              styles.nameInput,
              {
                color: theme.text,
                borderBottomColor: theme.border,
              },
            ]}
            placeholderTextColor={theme.textTertiary}
            placeholder="Enter your name"
          />
        </GlassCard>

        {/* Stats Summary */}
        <StatsSummaryCard
          title="Your stats"
          stats={[
            { label: 'Total goals', value: totalGoals.toString() },
            { label: 'Total habits', value: totalHabits.toString() },
            { label: 'Completion', value: `${completionPct}%` },
          ]}
        />

        {/* Reset Button */}
        <Pressable
          onPress={handleReset}
          accessibilityLabel="Reset all data"
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.resetButton,
            {
              backgroundColor: theme.danger,
              opacity: pressed ? INTERACTIVE.pressedOpacityLight : 1,
            },
          ]}
        >
          <Text style={styles.resetButtonText}>Reset All Data</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxxl,
    paddingBottom: 100,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: FONT_SIZE['6xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: '#fff',
  },
  nameCard: {
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  nameLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.sm,
  },
  nameInput: {
    fontSize: FONT_SIZE['2xl'],
    fontWeight: FONT_WEIGHT.medium,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
  },
  resetButton: {
    marginTop: SPACING.xxxl,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#fff',
  },
});
