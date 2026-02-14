import { useMemo } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Sun, Sunset, Moon } from "lucide-react-native";
import {
  useTheme,
  SPACING,
  FONT_SIZE,
  FONT_WEIGHT,
} from "../../src/theme";
import { useHabits } from "../../src/state";
import {
  HabitCard,
  ProgressBar,
} from "../../src/components";
import { Habit } from "../../src/types";

type TimeGroup = {
  key: string;
  label: string;
  icon: typeof Sun;
  habits: Habit[];
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function parseTimeToHour(time: string): number {
  if (time === "All day") return 6; // treat as morning
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 12;
  let hour = parseInt(match[1], 10);
  const period = match[3].toUpperCase();
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return hour;
}

function groupHabitsByTime(habits: Habit[]): TimeGroup[] {
  const morning: Habit[] = [];
  const afternoon: Habit[] = [];
  const evening: Habit[] = [];

  for (const habit of habits) {
    const hour = parseTimeToHour(habit.time);
    if (hour < 12) {
      morning.push(habit);
    } else if (hour < 17) {
      afternoon.push(habit);
    } else {
      evening.push(habit);
    }
  }

  // Sort within each group: incomplete first, then by time
  const sortGroup = (group: Habit[]) =>
    [...group].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return parseTimeToHour(a.time) - parseTimeToHour(b.time);
    });

  const groups: TimeGroup[] = [];

  if (morning.length > 0) {
    groups.push({
      key: "morning",
      label: "Morning",
      icon: Sun,
      habits: sortGroup(morning),
    });
  }
  if (afternoon.length > 0) {
    groups.push({
      key: "afternoon",
      label: "Afternoon",
      icon: Sun,
      habits: sortGroup(afternoon),
    });
  }
  if (evening.length > 0) {
    groups.push({
      key: "evening",
      label: "Evening",
      icon: Sunset,
      habits: sortGroup(evening),
    });
  }

  return groups;
}

export default function TodayScreen() {
  const { theme } = useTheme();
  const { habits, toggleHabit } = useHabits();

  const completedCount = useMemo(
    () => habits.filter((h) => h.completed).length,
    [habits],
  );

  const groups = useMemo(() => groupHabitsByTime(habits), [habits]);

  const greeting = getGreeting();
  const formattedDay = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();
  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  // Running index for staggered animations across groups
  let cardIndex = 0;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* FIXED: Header */}
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: theme.accent }]}>
          {greeting}
        </Text>
        <Text style={[styles.dateLabel, { color: theme.textPrimary }]}>
          {formattedDate}
        </Text>
        <Text style={[styles.dayLabel, { color: theme.textMuted }]}>
          {formattedDay}
        </Text>
      </View>

      {/* FIXED: Stats Pane */}
      <View style={styles.statsPane}>
        <ProgressBar completed={completedCount} total={habits.length} />
      </View>

      {/* SCROLLABLE: Grouped habit cards */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {groups.map((group) => {
          const GroupIcon = group.icon;
          return (
            <View key={group.key} style={styles.groupSection}>
              <View style={styles.sectionHeader}>
                <GroupIcon
                  size={15}
                  color={theme.textMuted}
                  strokeWidth={2}
                />
                <Text
                  style={[styles.sectionTitle, { color: theme.textMuted }]}
                >
                  {group.label}
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
                    {group.habits.filter((h) => h.completed).length}/
                    {group.habits.length}
                  </Text>
                </View>
                <View
                  style={[styles.sectionLine, { backgroundColor: theme.borderSubtle }]}
                />
              </View>

              {group.habits.map((habit) => {
                const idx = cardIndex++;
                return (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onToggle={toggleHabit}
                    index={idx}
                  />
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  greeting: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  dateLabel: {
    fontSize: FONT_SIZE["6xl"],
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: -0.5,
  },
  dayLabel: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.medium,
    letterSpacing: 0.5,
    marginTop: 1,
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
    marginBottom: SPACING.lg,
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
