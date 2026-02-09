import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useTheme } from '../../src/theme';
import { LONG_GOALS } from '../../src/data';
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
        data={LONG_GOALS}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <LongGoalCard
            goal={item}
            onPress={() => router.push(`/goal/${item.id}`)}
          />
        )}
        ListFooterComponent={
          <Pressable
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  addButton: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
