import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, Target } from 'lucide-react-native';
import { useTheme, SPACING, FONT_SIZE, FONT_WEIGHT, INTERACTIVE } from '../../src/theme';
import { LONG_GOALS_INIT } from '../../src/data';
import {
  ScreenHeader,
  LongGoalCard,
  GlassCard,
  FAB,
  AddGoalMenu,
} from '../../src/components';

export default function GoalsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [showAddMenu, setShowAddMenu] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Goals" subtitle="Long-term objectives" />

      <FlatList
        data={LONG_GOALS_INIT}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <LongGoalCard
            goal={item}
            onPress={() => router.push(`/goal/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Target size={32} color={theme.textTertiary} />
            <Text style={[styles.emptyText, { color: theme.textTertiary }]}>
              No long-term goals yet
            </Text>
          </View>
        }
        ListFooterComponent={
          <Pressable
            style={({ pressed }) => ({ opacity: pressed ? INTERACTIVE.pressedOpacity : 1 })}
            onPress={() => {}}
          >
            <GlassCard style={styles.addButton} subtle>
              <Plus size={18} color={theme.textTertiary} />
              <Text style={[styles.addText, { color: theme.textTertiary }]}>
                Add a goal
              </Text>
            </GlassCard>
          </Pressable>
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
    paddingTop: SPACING.lg,
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
  addButton: {
    padding: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  addText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.medium,
  },
});
