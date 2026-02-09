import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/theme';
import { useAppState } from '../../src/state/AppStateContext';
import { ScreenHeader, StatsSummaryCard, GlassCard } from '../../src/components';

export default function ProfileScreen() {
  const { theme, accent } = useTheme();
  const { userName, setUserName, goals, habits, resetAll } = useAppState();

  const totalGoals = goals.length;
  const totalHabits = habits.length;
  const doneGoals = goals.filter((g) => g.done && g.today).length;
  const todayGoals = goals.filter((g) => g.today).length;
  const completionPct = todayGoals > 0 ? Math.round((doneGoals / todayGoals) * 100) : 0;

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleReset = () => {
    Alert.alert(
      'Reset All Data',
      'This will reset all goals, habits, and settings to their initial values. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: resetAll,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Profile" subtitle="Your information and stats" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: accent.primary }]}>
            <Text style={styles.initials}>{initials}</Text>
          </View>
        </View>

        {/* Name Input */}
        <GlassCard style={styles.nameCard}>
          <Text style={[styles.nameLabel, { color: theme.textSecondary }]}>Name</Text>
          <TextInput
            value={userName}
            onChangeText={setUserName}
            style={[
              styles.nameInput,
              {
                color: theme.text,
                borderBottomColor: theme.border,
              },
            ]}
            placeholderTextColor={theme.textTertiary}
            placeholder="Enter your name"
          />
        </GlassCard>

        {/* Stats Summary */}
        <StatsSummaryCard
          title="Your stats"
          stats={[
            { label: 'Total goals', value: totalGoals.toString() },
            { label: 'Total habits', value: totalHabits.toString() },
            { label: 'Completion', value: `${completionPct}%` },
          ]}
        />

        {/* Reset Button */}
        <Pressable
          onPress={handleReset}
          style={({ pressed }) => [
            styles.resetButton,
            {
              backgroundColor: theme.danger,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text style={styles.resetButtonText}>Reset All Data</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 100,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  nameCard: {
    padding: 16,
    marginBottom: 8,
  },
  nameLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  nameInput: {
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  resetButton: {
    marginTop: 32,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});
