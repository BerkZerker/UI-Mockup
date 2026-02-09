import { View, Text, Switch, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme';
import { ScreenHeader } from '../../src/components';

export default function SettingsScreen() {
  const { theme, mode, toggleMode } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Settings" subtitle="Preferences and configuration" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textTertiary }]}>
            ACCOUNT
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.settingRow,
              { borderBottomWidth: 0, opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <View style={styles.settingLeft}>
              <User size={18} color={theme.text} style={styles.settingIcon} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Profile</Text>
            </View>
            <ChevronRight size={16} color={theme.textTertiary} />
          </Pressable>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textTertiary }]}>
            APPEARANCE
          </Text>
          <View style={[styles.settingRow, { borderBottomColor: theme.borderSubtle }]}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
            <Switch
              value={mode === 'dark'}
              onValueChange={toggleMode}
              trackColor={{ false: theme.pillBg, true: theme.success }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textTertiary }]}>
            NOTIFICATIONS
          </Text>
          <View style={[styles.settingRow, { borderBottomColor: theme.borderSubtle }]}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              Daily Reminders
            </Text>
            <Switch
              value={false}
              trackColor={{ false: theme.pillBg, true: theme.success }}
              thumbColor="#fff"
            />
          </View>
          <View style={[styles.settingRow, { borderBottomColor: theme.borderSubtle }]}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              Streak Alerts
            </Text>
            <Switch
              value={false}
              trackColor={{ false: theme.pillBg, true: theme.success }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textTertiary }]}>
            DATA
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.settingRow,
              { borderBottomColor: theme.borderSubtle, opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => {}}
          >
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              Default Category
            </Text>
            <View style={styles.settingRight}>
              <Text style={[styles.settingValue, { color: theme.textTertiary }]}>
                All
              </Text>
              <ChevronRight size={16} color={theme.textTertiary} />
            </View>
          </Pressable>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textTertiary }]}>
            ABOUT
          </Text>
          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>Version</Text>
            <Text style={[styles.settingValue, { color: theme.textTertiary }]}>
              1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 24,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '400',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIcon: {
    marginRight: 0,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 15,
  },
});
