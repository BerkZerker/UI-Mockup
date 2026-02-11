import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { BlurView } from 'expo-blur';
import {
  CalendarCheck,
  CalendarDays,
  BarChart3,
  BarChart2,
  Sparkles,
  Sparkle,
  LayoutList,
  List,
  Settings,
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
            tabBarIcon: ({ color, size, focused }) =>
              focused
                ? <CalendarCheck size={size} color={color} fill={color} />
                : <CalendarDays size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: 'Stats',
            tabBarIcon: ({ color, size, focused }) =>
              focused
                ? <BarChart3 size={size} color={color} fill={color} />
                : <BarChart2 size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            title: 'Insights',
            tabBarIcon: ({ color, size, focused }) =>
              focused
                ? <Sparkles size={size} color={color} fill={color} />
                : <Sparkle size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="habits"
          options={{
            title: 'Habits',
            tabBarIcon: ({ color, size, focused }) =>
              focused
                ? <LayoutList size={size} color={color} />
                : <List size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size, focused }) =>
              focused
                ? <Settings size={size} color={color} fill={color} />
                : <Settings size={size} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}
