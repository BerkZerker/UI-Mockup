import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';
import {
  Inbox,
  Calendar,
  Hash,
  Target,
  Settings
} from 'lucide-react-native';
import { useTheme } from '../../src/theme';
import { DotPattern } from '../../src/components';

export default function TabsLayout() {
  const { theme, accent, mode } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <DotPattern />
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: accent.primary,
          tabBarInactiveTintColor: theme.textTertiary,
          sceneStyle: { backgroundColor: 'transparent' },
          tabBarStyle: {
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            position: 'absolute',
            paddingTop: 6,
            paddingBottom: 28,
            height: 88,
            elevation: 0,
          },
          tabBarBackground: () => (
            <BlurView
              intensity={80}
              tint={mode === 'dark' ? 'dark' : 'light'}
              experimentalBlurMethod="dimezisBlurView"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderTopWidth: 1,
                borderTopColor: theme.glassBorder,
                backgroundColor: mode === 'dark' ? 'rgba(33, 33, 33, 0.3)' : 'rgba(245, 245, 245, 0.3)',
                overflow: 'hidden',
              }}
            />
          ),
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '400',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Today',
            tabBarIcon: ({ color, size }) => <Inbox size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="plan"
          options={{
            title: 'Plan',
            tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="habits"
          options={{
            title: 'Habits',
            tabBarIcon: ({ color, size }) => <Hash size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="goals"
          options={{
            title: 'Goals',
            tabBarIcon: ({ color, size }) => <Target size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </View>
  );
}
