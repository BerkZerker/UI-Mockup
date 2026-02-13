import { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sun, Moon } from 'lucide-react-native';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '../../src/theme';
import { useHabits } from '../../src/state';
import { ProgressRing, InsightCard, HabitCard, AddHabitButton } from '../../src/components';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function TodayScreen() {
  const { theme, mode, toggleMode } = useTheme();
  const { habits, toggleHabit } = useHabits();

  const completedCount = useMemo(() => habits.filter(h => h.completed).length, [habits]);

  const formattedDay = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.dayLabel, { color: theme.textMuted }]}>{formattedDay}</Text>
            <Text style={[styles.dateLabel, { color: theme.textPrimary }]}>{formattedDate}</Text>
          </View>
          <View style={styles.headerRight}>
            <ProgressRing completed={completedCount} total={habits.length} />
            <Pressable onPress={toggleMode} style={[styles.themeBtn, { backgroundColor: theme.glassBackground, borderColor: theme.glassBorder }]}>
              {mode === 'dark' ? <Sun size={16} color={theme.textMuted} /> : <Moon size={16} color={theme.textMuted} />}
            </Pressable>
          </View>
        </View>

        {/* Insight Card */}
        <View style={styles.insightWrap}>
          <InsightCard
            title="You're on a roll with journaling"
            description="23-day streak! You tend to journal best right after reading. Keep that pairing going."
          />
        </View>

        {/* Habits Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Today's habits</Text>
          <View style={styles.dayLabels}>
            {DAY_LABELS.map((d, i) => (
              <Text
                key={i}
                style={[
                  styles.dayLabelText,
                  {
                    color: i === 6 ? theme.accent : theme.textMuted,
                    opacity: i === 6 ? 1 : 0.6,
                  },
                ]}
              >
                {d}
              </Text>
            ))}
          </View>
        </View>

        {habits.map((habit, index) => (
          <HabitCard key={habit.id} habit={habit} onToggle={toggleHabit} index={index} />
        ))}

        <AddHabitButton />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: SPACING.xl, paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  dayLabel: { fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.medium, letterSpacing: 0.5, marginBottom: 2 },
  dateLabel: { fontSize: FONT_SIZE['6xl'], fontWeight: FONT_WEIGHT.bold, letterSpacing: -0.5 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  themeBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightWrap: { marginBottom: SPACING.xl },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    paddingHorizontal: 2,
  },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.semibold, letterSpacing: 0.3 },
  dayLabels: { flexDirection: 'row', gap: 4 },
  dayLabelText: { width: 14, fontSize: FONT_SIZE.xs - 1, fontWeight: FONT_WEIGHT.semibold, textAlign: 'center' },
});
