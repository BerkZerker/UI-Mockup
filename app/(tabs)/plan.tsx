import { View, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme';
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
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 20,
  },
  weekCard: {
    padding: 0,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
});
