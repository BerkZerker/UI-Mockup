import { useRef, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Sparkles } from "lucide-react-native";
import {
  useTheme,
  SPACING,
  FONT_SIZE,
  FONT_WEIGHT,
  RADIUS,
} from "../../src/theme";
import { InsightCard } from "../../src/components";

const INSIGHTS = [
  {
    id: "1",
    title: "Monday Motivation Gap",
    desc: "Your completion rate drops 30% on Mondays compared to other weekdays. Try setting easier Monday targets.",
  },
  {
    id: "2",
    title: "Try Habit Stacking",
    desc: 'You complete "Meditate" and "Read" at similar times. Stack them together for a stronger routine.',
  },
  {
    id: "3",
    title: "Exercise Streak Record!",
    desc: "You just hit your longest exercise streak ever. Keep the momentum going!",
  },
  {
    id: "4",
    title: "Journal Declining",
    desc: "Your journaling habit has dropped from 80% to 40% completion over the past 3 weeks.",
  },
  {
    id: "5",
    title: "Late Night Impact",
    desc: "On days you complete habits after 10pm, your next-day completion rate is 25% lower.",
  },
  {
    id: "6",
    title: "Weekend Warrior",
    desc: "Your weekend completion rate is 15% higher than weekdays. Consider redistributing your schedule.",
  },
];

export default function InsightsScreen() {
  const { theme } = useTheme();
  const breatheAnim = useRef(new Animated.Value(0.03)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 0.08,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(breatheAnim, {
          toValue: 0.03,
          duration: 3000,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Animated.View
        style={[
          styles.breatheOverlay,
          { backgroundColor: theme.accent, opacity: breatheAnim },
        ]}
        pointerEvents="none"
      />

      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Insights
        </Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          AI-powered analysis
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.aiBanner, { backgroundColor: theme.accentFaint }]}>
          <Sparkles size={14} color={theme.accent} />
          <Text style={[styles.aiBannerText, { color: theme.accent }]}>
            Powered by AI analysis
          </Text>
        </View>

        {INSIGHTS.map((insight) => (
          <View key={insight.id} style={styles.cardWrap}>
            <InsightCard title={insight.title} description={insight.desc} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  breatheOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE["6xl"],
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: -0.5,
  },
  subtitle: { fontSize: FONT_SIZE.lg },
  scroll: { paddingHorizontal: SPACING.xl, paddingBottom: 100 },
  aiBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    alignSelf: "flex-start",
    marginBottom: SPACING.xl,
  },
  aiBannerText: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.medium },
  cardWrap: { marginBottom: SPACING.md },
});
