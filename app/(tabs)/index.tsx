import { useMemo, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckCircle } from "lucide-react-native";
import {
  useTheme,
  SPACING,
  FONT_SIZE,
  FONT_WEIGHT,
} from "../../src/theme";
import { useHabits, useUser } from "../../src/state";
import {
  HabitCard,
  ProgressBar,
} from "../../src/components";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function TodayScreen() {
  const { theme } = useTheme();
  const { habits, toggleHabit } = useHabits();
  const { userName } = useUser();

  const completedCount = useMemo(
    () => habits.filter((h) => h.completed).length,
    [habits],
  );

  const incompleteHabits = useMemo(
    () => habits.filter((h) => !h.completed),
    [habits],
  );

  const completedHabits = useMemo(
    () => habits.filter((h) => h.completed),
    [habits],
  );

  const handleToggle = useCallback(
    (id: string) => {
      toggleHabit(id);
    },
    [toggleHabit],
  );

  const greeting = getGreeting();
  const formattedDay = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();
  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* FIXED: Header — greeting left, date right */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.greeting, { color: theme.accent }]}>
            {greeting}, {userName}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={[styles.dateLabel, { color: theme.textPrimary }]}>
            {formattedDate}
          </Text>
          <Text style={[styles.dayLabel, { color: theme.textMuted }]}>
            {formattedDay}
          </Text>
        </View>
      </View>

      {/* FIXED: Stats Pane */}
      <View style={styles.statsPane}>
        <ProgressBar completed={completedCount} total={habits.length} />
      </View>

      {/* SCROLLABLE: Habits — incomplete first, completed at bottom */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {incompleteHabits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onToggle={handleToggle}
            index={0}
          />
        ))}

        {completedHabits.length > 0 && (
          <View style={styles.groupSection}>
            <View style={styles.sectionHeader}>
              <CheckCircle
                size={15}
                color={theme.textMuted}
                strokeWidth={2}
              />
              <Text
                style={[styles.sectionTitle, { color: theme.textMuted }]}
              >
                Completed
              </Text>
              <View
                style={[
                  styles.sectionCount,
                  { backgroundColor: theme.surface2 },
                ]}
              >
                <Text
                  style={[
                    styles.sectionCountText,
                    { color: theme.textMuted },
                  ]}
                >
                  {completedHabits.length}
                </Text>
              </View>
              <View
                style={[
                  styles.sectionLine,
                  { backgroundColor: theme.borderSubtle },
                ]}
              />
            </View>

            {completedHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={handleToggle}
                index={0}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  greeting: {
    fontSize: FONT_SIZE["6xl"],
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: -0.5,
  },
  dateLabel: {
    fontSize: FONT_SIZE["3xl"],
    fontWeight: FONT_WEIGHT.semibold,
    letterSpacing: -0.3,
  },
  dayLabel: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.medium,
    letterSpacing: 0.8,
    marginTop: 2,
  },
  statsPane: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  scroll: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 120,
  },
  groupSection: {
    marginTop: SPACING.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: SPACING.md,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  sectionCount: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  sectionCountText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    marginLeft: SPACING.sm,
  },
});
