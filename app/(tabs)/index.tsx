import { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Target, Flame, Inbox } from 'lucide-react-native';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, INTERACTIVE } from '../../src/theme';
import { useAppState } from '../../src/state/AppStateContext';
import { CATEGORIES } from '../../src/data';
import {
  GlassCard,
  ProgressBar,
  CategoryPills,
  GoalListItem,
  FAB,
  AddGoalMenu,
} from '../../src/components';

export default function TodayScreen() {
  const { theme, accent } = useTheme();
  const { goals, categoryFilter, setCategoryFilter, toggleGoal } = useAppState();
  const router = useRouter();
  const [showAddMenu, setShowAddMenu] = useState(false);

  const filtered = categoryFilter === 'All' ? goals : goals.filter((g) => g.category === categoryFilter);
  const todayGoals = filtered.filter((g) => g.today);
  const upcomingGoals = filtered.filter((g) => !g.today);
  const doneCount = goals.filter((g) => g.done && g.today).length;
  const totalCount = goals.filter((g) => g.today).length;

  const bestStreak = goals.reduce((max, g) => Math.max(max, g.streak), 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed header area */}
      <View style={styles.header}>
        <View style={[styles.logo, { backgroundColor: accent.primary }]}>
          <Target size={18} color="#fff" />
        </View>
        <Text style={[styles.appName, { color: theme.text }]}>MicroGoals</Text>
      </View>

      <GlassCard style={styles.progressCard}>
        <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>
          Today's progress
        </Text>
        <View style={styles.progressNumbers}>
          <Text style={[styles.progressDone, { color: theme.text }]}>
            {doneCount}
            <Text style={[styles.progressTotal, { color: theme.textTertiary }]}>
              /{totalCount}
            </Text>
          </Text>
          <Text style={[styles.progressCompleted, { color: theme.textTertiary }]}>
            completed
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <ProgressBar value={doneCount} max={totalCount} />
        </View>
        {bestStreak > 0 && (
          <View style={styles.streak}>
            <Flame size={12} color={theme.textTertiary} fill={theme.textTertiary} />
            <Text style={[styles.streakText, { color: theme.textSecondary }]}>
              {bestStreak}-day streak
            </Text>
          </View>
        )}
      </GlassCard>

      <CategoryPills
        categories={CATEGORIES}
        selected={categoryFilter}
        onSelect={setCategoryFilter}
      />

      {/* Scrollable task list */}
      <FlatList
        data={todayGoals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <GoalListItem
            goal={item}
            onToggle={toggleGoal}
            showBorder={index < todayGoals.length - 1}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Inbox size={32} color={theme.textTertiary} />
            <Text style={[styles.emptyText, { color: theme.textTertiary }]}>
              {categoryFilter === 'All' ? 'No goals for today' : `No goals in ${categoryFilter}`}
            </Text>
          </View>
        }
        ListFooterComponent={
          categoryFilter === 'All' && upcomingGoals.length > 0 ? (
            <View style={styles.upcoming}>
              <Text style={[styles.upcomingTitle, { color: theme.textTertiary }]}>
                UPCOMING
              </Text>
              {upcomingGoals.map((goal) => (
                <View key={goal.id} style={styles.upcomingItem}>
                  <View style={[styles.upcomingDot, { borderColor: theme.textTertiary }]} />
                  <Text style={[styles.upcomingText, { color: theme.textTertiary }]}>
                    {goal.title}
                  </Text>
                </View>
              ))}
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <FAB onPress={() => setShowAddMenu(true)} />
      <AddGoalMenu visible={showAddMenu} onClose={() => setShowAddMenu(false)} />
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
    gap: SPACING.md - 2,
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  logo: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: FONT_SIZE['5xl'],
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: -0.5,
  },
  progressCard: {
    marginTop: SPACING.xl - 2,
    marginHorizontal: SPACING.xl,
    padding: SPACING.lg,
  },
  progressLabel: {
    fontSize: FONT_SIZE.base,
  },
  progressNumbers: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.sm,
    marginTop: SPACING.sm - 2,
  },
  progressDone: {
    fontSize: FONT_SIZE['7xl'],
    fontWeight: FONT_WEIGHT.bold,
  },
  progressTotal: {
    fontSize: FONT_SIZE['5xl'],
    fontWeight: FONT_WEIGHT.medium,
  },
  progressCompleted: {
    fontSize: FONT_SIZE.base,
  },
  progressBarContainer: {
    marginTop: SPACING.md,
  },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm - 2,
    marginTop: SPACING.md - 2,
  },
  streakText: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
    gap: SPACING.sm,
  },
  emptyText: {
    fontSize: FONT_SIZE.lg,
  },
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md - 2,
    paddingBottom: 100,
  },
  upcoming: {
    marginTop: SPACING.xxl,
  },
  upcomingTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: SPACING.xs,
  },
  upcomingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
  },
  upcomingDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  upcomingText: {
    fontSize: FONT_SIZE.lg,
  },
});
