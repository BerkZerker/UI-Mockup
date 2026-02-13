import { View, Text, Switch, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useTheme,
  SPACING,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
} from "../../src/theme";
import { useHabits } from "../../src/state";

export default function SettingsScreen() {
  const { theme, mode, toggleMode } = useTheme();
  const { habits } = useHabits();

  const activeCount = habits.length;
  const completedCount = habits.filter((h) => h.completed).length;
  const bestStreak = Math.max(...habits.map((h) => h.streak), 0);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          More
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Stats */}
        <View
          style={[
            styles.statsCard,
            {
              backgroundColor: theme.glassBackground,
              borderColor: theme.glassBorder,
            },
          ]}
        >
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>
              {activeCount}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>
              Habits
            </Text>
          </View>
          <View
            style={[styles.divider, { backgroundColor: theme.borderSubtle }]}
          />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>
              {bestStreak}d
            </Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>
              Best streak
            </Text>
          </View>
          <View
            style={[styles.divider, { backgroundColor: theme.borderSubtle }]}
          />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>
              {activeCount > 0
                ? Math.round((completedCount / activeCount) * 100)
                : 0}
              %
            </Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>
              Today
            </Text>
          </View>
        </View>

        {/* Appearance */}
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
          APPEARANCE
        </Text>
        <View style={[styles.row, { borderBottomColor: theme.borderSubtle }]}>
          <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>
            Dark Mode
          </Text>
          <Switch
            value={mode === "dark"}
            onValueChange={toggleMode}
            trackColor={{ false: theme.borderSubtle, true: theme.accent }}
            thumbColor="#fff"
          />
        </View>

        {/* About */}
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.textMuted, marginTop: SPACING.xxxl },
          ]}
        >
          ABOUT
        </Text>
        <View style={[styles.row, { borderBottomColor: theme.borderSubtle }]}>
          <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>
            Version
          </Text>
          <Text style={[styles.rowValue, { color: theme.textMuted }]}>
            1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE["6xl"],
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: -0.5,
  },
  scroll: { paddingHorizontal: SPACING.xl, paddingBottom: 100 },
  statsCard: {
    flexDirection: "row",
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.xl,
    marginBottom: SPACING.xxxl,
  },
  stat: { flex: 1, alignItems: "center", gap: SPACING.xs },
  statValue: { fontSize: FONT_SIZE["5xl"], fontWeight: FONT_WEIGHT.bold },
  statLabel: { fontSize: FONT_SIZE.sm },
  divider: { width: 1, alignSelf: "stretch" },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    letterSpacing: 0.8,
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.lg - 2,
    borderBottomWidth: 1,
  },
  rowLabel: { fontSize: FONT_SIZE.xl },
  rowValue: { fontSize: FONT_SIZE.xl },
});
