import { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Target, Flame } from 'lucide-react-native';
import { useTheme } from '../../src/theme';
import { useAppState } from '../../src/state/AppStateContext';
import { CATS } from '../../src/data';
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

  const filtered = categoryFilter === 'All' ? goals : goals.filter((g) => g.cat === categoryFilter);
  const todayGoals = filtered.filter((g) => g.today);
  const upcomingGoals = goals.filter((g) => !g.today);
  const doneCount = goals.filter((g) => g.done && g.today).length;
  const totalCount = goals.filter((g) => g.today).length;

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
        <View style={styles.streak}>
          <Flame size={12} color={theme.textTertiary} fill={theme.textTertiary} />
          <Text style={[styles.streakText, { color: theme.textSecondary }]}>
            12-day streak
          </Text>
        </View>
      </GlassCard>

      <CategoryPills
        categories={CATS}
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
    gap: 10,
    marginTop: 16,
    paddingHorizontal: 20,
  },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  progressCard: {
    marginTop: 18,
    marginHorizontal: 20,
    padding: 16,
  },
  progressLabel: {
    fontSize: 13,
  },
  progressNumbers: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 6,
  },
  progressDone: {
    fontSize: 32,
    fontWeight: '700',
  },
  progressTotal: {
    fontSize: 22,
    fontWeight: '500',
  },
  progressCompleted: {
    fontSize: 13,
  },
  progressBarContainer: {
    marginTop: 12,
  },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },
  upcoming: {
    marginTop: 24,
  },
  upcomingTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  upcomingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  upcomingDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  upcomingText: {
    fontSize: 14,
  },
});
