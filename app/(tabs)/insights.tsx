import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingDown, Link, Trophy, AlertTriangle, Moon, Zap, Sparkles } from 'lucide-react-native';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '../../src/theme';
import { ScreenHeader } from '../../src/components';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Insight {
  id: number;
  title: string;
  description: string;
  category: 'Pattern' | 'Suggestion' | 'Achievement' | 'Warning';
  icon: any;
}

const CATEGORY_COLORS: Record<string, string> = {
  Pattern: '#4a90d9',    // sky
  Suggestion: '#4a8d5f', // sage
  Achievement: '#d4a03c', // amber
  Warning: '#e07856',    // coral
};

const INSIGHTS: Insight[] = [
  {
    id: 1,
    title: 'Monday Motivation Gap',
    description: 'Your completion rate drops 30% on Mondays compared to other weekdays. Try setting easier Monday targets.',
    category: 'Pattern',
    icon: TrendingDown,
  },
  {
    id: 2,
    title: 'Try Habit Stacking',
    description: 'You complete "Meditate" and "Read" at similar times. Stack them together for a stronger routine.',
    category: 'Suggestion',
    icon: Link,
  },
  {
    id: 3,
    title: 'Exercise Streak Record!',
    description: 'You just hit your longest exercise streak ever. Keep the momentum going!',
    category: 'Achievement',
    icon: Trophy,
  },
  {
    id: 4,
    title: 'Journal Declining',
    description: 'Your journaling habit has dropped from 80% to 40% completion over the past 3 weeks.',
    category: 'Warning',
    icon: AlertTriangle,
  },
  {
    id: 5,
    title: 'Late Night Impact',
    description: 'On days you complete habits after 10pm, your next-day completion rate is 25% lower.',
    category: 'Pattern',
    icon: Moon,
  },
  {
    id: 6,
    title: 'Weekend Warrior',
    description: 'Your weekend completion rate is 15% higher than weekdays. Consider redistributing your schedule.',
    category: 'Suggestion',
    icon: Zap,
  },
];

function ShimmerCard({ insight, index }: { insight: Insight; index: number }) {
  const { theme } = useTheme();
  const shimmerAnim = useRef(new Animated.Value(-1)).current;
  const Icon = insight.icon;
  const catColor = CATEGORY_COLORS[insight.category];

  useEffect(() => {
    const delay = index * 400;
    const timer = setTimeout(() => {
      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    }, delay);
    return () => clearTimeout(timer);
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
    <View style={[styles.card, { backgroundColor: theme.bgSecondary, borderColor: theme.borderSubtle }]}>
      {/* Shimmer overlay */}
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX }],
            backgroundColor: theme.glassHighlight,
          },
        ]}
      />

      <View style={styles.cardContent}>
        <View style={[styles.iconCircle, { backgroundColor: catColor + '1A' }]}>
          <Icon size={20} color={catColor} />
        </View>
        <View style={styles.cardText}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>{insight.title}</Text>
          <Text style={[styles.cardDesc, { color: theme.textSecondary }]}>{insight.description}</Text>
          <View style={[styles.categoryPill, { backgroundColor: catColor + '1A' }]}>
            <Text style={[styles.categoryText, { color: catColor }]}>{insight.category}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function InsightsScreen() {
  const { theme, accent } = useTheme();
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
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated gradient overlay */}
      <Animated.View
        style={[
          styles.gradientOverlay,
          { backgroundColor: accent.primary, opacity: breatheAnim },
        ]}
        pointerEvents="none"
      />

      <ScreenHeader title="Insights" subtitle="AI-powered analysis" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* AI Banner */}
        <View style={[styles.aiBanner, { backgroundColor: accent.primaryFaint }]}>
          <Sparkles size={16} color={accent.primary} />
          <Text style={[styles.aiBannerText, { color: accent.primary }]}>Powered by AI analysis</Text>
        </View>

        {/* Insight Cards */}
        {INSIGHTS.map((insight, index) => (
          <ShimmerCard key={insight.id} insight={insight} index={index} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: 100,
  },
  aiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    marginBottom: SPACING.xl,
  },
  aiBannerText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
  },
  card: {
    borderRadius: RADIUS['3xl'],
    borderWidth: 1,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 80,
    opacity: 0.5,
  },
  cardContent: {
    flexDirection: 'row',
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.semibold,
  },
  cardDesc: {
    fontSize: FONT_SIZE.base,
    lineHeight: 18,
    marginTop: SPACING.xs,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    paddingVertical: SPACING.xxs + 1,
    paddingHorizontal: SPACING.sm + 2,
    borderRadius: RADIUS.full,
    marginTop: SPACING.sm,
  },
  categoryText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
  },
});
