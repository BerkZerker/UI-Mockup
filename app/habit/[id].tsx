import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Repeat, Flame, Check, AlertCircle } from 'lucide-react-native';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, INTERACTIVE } from '../../src/theme';
import { useAppState } from '../../src/state/AppStateContext';
import { WEEKDAYS } from '../../src/data';
import { GlassCard } from '../../src/components';

export default function HabitDetailScreen() {
  const { theme, accent } = useTheme();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { habits, toggleHabitDay } = useAppState();

  const habit = habits.find((h) => h.id === Number(id));

  if (!habit) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.backButton,
              { opacity: pressed ? INTERACTIVE.pressedOpacity : 1 },
            ]}
          >
            <ArrowLeft size={24} color={theme.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Habit Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <GlassCard style={styles.errorCard}>
            <AlertCircle size={40} color={theme.textTertiary} />
            <Text style={[styles.errorTitle, { color: theme.text }]}>Habit not found</Text>
            <Text style={[styles.errorDescription, { color: theme.textTertiary }]}>
              This habit may have been removed or doesn't exist.
            </Text>
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.errorButton,
                {
                  backgroundColor: accent.primary,
                  opacity: pressed ? INTERACTIVE.pressedOpacityLight : 1,
                },
              ]}
            >
              <Text style={styles.errorButtonText}>Go back</Text>
            </Pressable>
          </GlassCard>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.backButton,
            { opacity: pressed ? INTERACTIVE.pressedOpacity : 1 },
          ]}
        >
          <ArrowLeft size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Habit Details</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <GlassCard style={styles.card}>
          <Text style={[styles.title, { color: theme.text }]}>{habit.title}</Text>

          {/* Meta */}
          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Repeat size={16} color={theme.textSecondary} />
              <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                {habit.frequency}
              </Text>
            </View>
            {habit.streak > 0 && (
              <View style={styles.metaItem}>
                <Flame size={16} color={theme.textSecondary} fill={theme.textSecondary} />
                <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                  {habit.streak}-day streak
                </Text>
              </View>
            )}
          </View>

          {/* Large Weekly Grid */}
          <View style={styles.weekGrid}>
            <Text style={[styles.weekLabel, { color: theme.textSecondary }]}>
              This Week
            </Text>
            <View style={styles.daysGrid}>
              {WEEKDAYS.map((day, index) => (
                <View key={index} style={styles.dayColumn}>
                  <Text style={[styles.dayName, { color: theme.textTertiary }]}>
                    {day}
                  </Text>
                  <Pressable
                    onPress={() => toggleHabitDay(habit.id, index)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: !!habit.week[index] }}
                    accessibilityLabel={`${day} ${habit.week[index] ? 'completed' : 'not completed'}`}
                    style={({ pressed }) => [
                      styles.dayButton,
                      { opacity: pressed ? INTERACTIVE.pressedOpacity : 1 },
                    ]}
                  >
                    <View
                      style={[
                        styles.dayBox,
                        {
                          backgroundColor: habit.week[index]
                            ? accent.primary
                            : theme.pillBg,
                          borderWidth: habit.week[index] ? 0 : 2,
                          borderColor: theme.border,
                        },
                      ]}
                    >
                      {habit.week[index] === 1 && (
                        <Check size={20} color="#fff" strokeWidth={3} />
                      )}
                    </View>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        </GlassCard>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZE['3xl'],
    fontWeight: FONT_WEIGHT.semibold,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
  },
  card: {
    padding: SPACING.xxl,
  },
  title: {
    fontSize: FONT_SIZE['5xl'],
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.lg,
  },
  meta: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.xxxl,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm - 2,
  },
  metaText: {
    fontSize: FONT_SIZE.lg,
  },
  weekGrid: {
    alignItems: 'center',
  },
  weekLabel: {
    fontSize: FONT_SIZE.lg,
    marginBottom: SPACING.xl,
  },
  daysGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  dayColumn: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  dayName: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
  },
  dayButton: {
    padding: SPACING.xs,
  },
  dayBox: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'center',
  },
  errorCard: {
    padding: SPACING.xxxl,
    alignItems: 'center',
    gap: SPACING.md,
  },
  errorTitle: {
    fontSize: FONT_SIZE['4xl'],
    fontWeight: FONT_WEIGHT.semibold,
  },
  errorDescription: {
    fontSize: FONT_SIZE.lg,
    textAlign: 'center',
  },
  errorButton: {
    marginTop: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    borderRadius: RADIUS.lg,
  },
  errorButtonText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#fff',
  },
});
