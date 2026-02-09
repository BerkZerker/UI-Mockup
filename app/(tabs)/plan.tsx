import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'lucide-react-native';
import { useTheme, SPACING, FONT_SIZE } from '../../src/theme';
import { PLAN } from '../../src/data';
import {
  ScreenHeader,
  GlassCard,
  WeekStrip,
  DayCard,
} from '../../src/components';

export default function PlanScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Plan" subtitle="Your week at a glance" />

      <FlatList
        data={PLAN}
        keyExtractor={(item) => item.day}
        ListHeaderComponent={
          <View style={styles.weekContainer}>
            <GlassCard style={styles.weekCard}>
              <WeekStrip days={['3', '4', '5', '6', '7', '8', '9']} selectedDay="7" />
            </GlassCard>
          </View>
        }
        renderItem={({ item, index }) => (
          <DayCard day={item} isToday={index === 0} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Calendar size={32} color={theme.textTertiary} />
            <Text style={[styles.emptyText, { color: theme.textTertiary }]}>
              No planned days
            </Text>
          </View>
        }
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  weekContainer: {
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  weekCard: {
    padding: 0,
  },
  content: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 100,
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
