import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock } from 'lucide-react-native';
import { useTheme } from '../../src/theme';
import { LONG_GOALS } from '../../src/data';
import { GlassCard } from '../../src/components';

export default function GoalDetailScreen() {
  const { theme, accent } = useTheme();
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const goal = LONG_GOALS.find((g) => g.id === Number(id));

  if (!goal) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
        <Text style={{ color: theme.text }}>Goal not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <ArrowLeft size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Goal Details</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <GlassCard style={styles.card}>
          <Text style={[styles.title, { color: theme.text }]}>{goal.title}</Text>

          {/* Large Progress */}
          <View style={styles.progressContainer}>
            <Text style={[styles.percentageLabel, { color: theme.textSecondary }]}>
              Progress
            </Text>
            <Text style={[styles.percentageValue, { color: accent.primary }]}>
              {goal.pct}%
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressTrack,
                { backgroundColor: theme.pillBg },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${goal.pct}%`,
                    backgroundColor: accent.primary,
                  },
                ]}
              />
            </View>
          </View>

          {/* Details */}
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textTertiary }]}>
                Current
              </Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {goal.current}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, { color: theme.textTertiary }]}>
                Target
              </Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {goal.target}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.deadlineLabel}>
                <Clock size={14} color={theme.textTertiary} />
                <Text style={[styles.detailLabel, { color: theme.textTertiary }]}>
                  Deadline
                </Text>
              </View>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {goal.deadline}
              </Text>
            </View>
          </View>
        </GlassCard>
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  percentageLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  percentageValue: {
    fontSize: 64,
    fontWeight: '700',
  },
  progressBarContainer: {
    marginBottom: 32,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  details: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 15,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  deadlineLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
