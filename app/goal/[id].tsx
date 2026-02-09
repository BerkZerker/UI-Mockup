import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, AlertCircle } from 'lucide-react-native';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, INTERACTIVE } from '../../src/theme';
import { LONG_GOALS_INIT } from '../../src/data';
import { GlassCard } from '../../src/components';

export default function GoalDetailScreen() {
  const { theme, accent } = useTheme();
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const goal = LONG_GOALS_INIT.find((g) => g.id === Number(id));

  if (!goal) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.backButton,
              { opacity: pressed ? INTERACTIVE.pressedOpacity : 1 },
            ]}
          >
            <ArrowLeft size={24} color={theme.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Goal Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <GlassCard style={styles.errorCard}>
            <AlertCircle size={40} color={theme.textTertiary} />
            <Text style={[styles.errorTitle, { color: theme.text }]}>Goal not found</Text>
            <Text style={[styles.errorDescription, { color: theme.textTertiary }]}>
              This goal may have been removed or doesn't exist.
            </Text>
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.errorButton,
                {
                  backgroundColor: accent.primary,
                  opacity: pressed ? INTERACTIVE.pressedOpacityLight : 1,
                },
              ]}
            >
              <Text style={styles.errorButtonText}>Go back</Text>
            </Pressable>
          </GlassCard>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.backButton,
            { opacity: pressed ? INTERACTIVE.pressedOpacity : 1 },
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
              {goal.percent}%
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
                    width: `${goal.percent}%`,
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
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZE['3xl'],
    fontWeight: FONT_WEIGHT.semibold,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
  },
  card: {
    padding: SPACING.xxl,
  },
  title: {
    fontSize: FONT_SIZE['5xl'],
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.xxl,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  percentageLabel: {
    fontSize: FONT_SIZE.lg,
    marginBottom: SPACING.sm,
  },
  percentageValue: {
    fontSize: FONT_SIZE['8xl'],
    fontWeight: FONT_WEIGHT.bold,
  },
  progressBarContainer: {
    marginBottom: SPACING.xxxl,
  },
  progressTrack: {
    height: SPACING.sm,
    borderRadius: SPACING.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: SPACING.xs,
  },
  details: {
    gap: SPACING.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: FONT_SIZE.xl,
  },
  detailValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.semibold,
  },
  deadlineLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm - 2,
  },
  errorContainer: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'center',
  },
  errorCard: {
    padding: SPACING.xxxl,
    alignItems: 'center',
    gap: SPACING.md,
  },
  errorTitle: {
    fontSize: FONT_SIZE['4xl'],
    fontWeight: FONT_WEIGHT.semibold,
  },
  errorDescription: {
    fontSize: FONT_SIZE.lg,
    textAlign: 'center',
  },
  errorButton: {
    marginTop: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xxl,
    borderRadius: RADIUS.lg,
  },
  errorButtonText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.semibold,
    color: '#fff',
  },
});
