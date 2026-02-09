import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Repeat, Flame, Check } from 'lucide-react-native';
import { useTheme } from '../../src/theme';
import { useAppState } from '../../src/state/AppStateContext';
import { WKDAYS } from '../../src/data';
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
        <Text style={{ color: theme.text }}>Habit not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            { opacity: pressed ? 0.7 : 1 },
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
                {habit.freq}
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
              {WKDAYS.map((day, index) => (
                <View key={index} style={styles.dayColumn}>
                  <Text style={[styles.dayName, { color: theme.textTertiary }]}>
                    {day}
                  </Text>
                  <Pressable
                    onPress={() => toggleHabitDay(habit.id, index)}
                    style={({ pressed }) => [
                      styles.dayButton,
                      { opacity: pressed ? 0.7 : 1 },
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  meta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
  },
  weekGrid: {
    alignItems: 'center',
  },
  weekLabel: {
    fontSize: 14,
    marginBottom: 20,
  },
  daysGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  dayColumn: {
    alignItems: 'center',
    gap: 12,
  },
  dayName: {
    fontSize: 13,
    fontWeight: '600',
  },
  dayButton: {
    padding: 4,
  },
  dayBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
