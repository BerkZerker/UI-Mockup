import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme';
import { useAppState } from '../../src/state/AppStateContext';
import { WKDAYS } from '../../src/data';
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
              {WKDAYS.map((day, i) => (
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
        ListFooterComponent={
          <StatsSummaryCard
            title="This week"
            stats={[
              { label: 'Completion', value: '71%' },
              { label: 'Best streak', value: '12d' },
              { label: 'Active', value: '5' },
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 100,
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
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
    fontSize: 11,
    fontWeight: '500',
  },
});
