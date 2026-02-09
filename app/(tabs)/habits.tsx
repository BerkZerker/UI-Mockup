import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Hash } from 'lucide-react-native';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT } from '../../src/theme';
import { useAppState } from '../../src/state/AppStateContext';
import { WEEKDAYS } from '../../src/data';
import {
  ScreenHeader,
  HabitRow,
  StatsSummaryCard,
  FAB,
  AddGoalMenu,
} from '../../src/components';

export default function HabitsScreen() {
  const { theme } = useTheme();
  const { habits, toggleHabitDay } = useAppState();
  const router = useRouter();
  const [showAddMenu, setShowAddMenu] = useState(false);

  const totalDays = habits.reduce((sum, h) => sum + h.week.length, 0);
  const doneDays = habits.reduce((sum, h) => sum + h.week.filter((d) => d === 1).length, 0);
  const completionPct = totalDays > 0 ? Math.round((doneDays / totalDays) * 100) : 0;
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
  const activeCount = habits.length;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Habits" subtitle="Weekly tracker" />

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View style={styles.weekHeader}>
            <View style={styles.spacer} />
            <View style={styles.weekDays}>
              {WEEKDAYS.map((day, i) => (
                <View key={i} style={styles.dayLabel}>
                  <Text style={[styles.dayText, { color: theme.textTertiary }]}>
                    {day}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <Pressable onPress={() => router.push(`/habit/${item.id}`)}>
            <HabitRow
              habit={item}
              onToggleDay={toggleHabitDay}
              showBorder={index < habits.length - 1}
            />
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Hash size={32} color={theme.textTertiary} />
            <Text style={[styles.emptyText, { color: theme.textTertiary }]}>
              No habits tracked yet
            </Text>
          </View>
        }
        ListFooterComponent={
          <StatsSummaryCard
            title="This week"
            stats={[
              { label: 'Completion', value: `${completionPct}%` },
              { label: 'Best streak', value: `${bestStreak}d` },
              { label: 'Active', value: `${activeCount}` },
            ]}
          />
        }
        contentContainerStyle={styles.content}
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
  content: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: 100,
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm - 2,
  },
  spacer: {
    flex: 1,
  },
  weekDays: {
    flexDirection: 'row',
    gap: 0,
    width: 196,
  },
  dayLabel: {
    width: 28,
    alignItems: 'center',
  },
  dayText: {
    fontSize: FONT_SIZE.sm,
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
});
