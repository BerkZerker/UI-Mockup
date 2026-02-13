import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import {
  CalendarDays,
  BarChart3,
  Sparkles,
  Menu,
} from "lucide-react-native";
import { useTheme, RADIUS } from "../../src/theme";
import { NoiseBackground } from "../../src/components";
import { FAB } from "../../src/components/FAB";

function TabIcon({
  focused,
  Icon,
  ActiveIcon,
  color,
  size,
  fillActive,
}: {
  focused: boolean;
  Icon: any;
  ActiveIcon: any;
  color: string;
  size: number;
  fillActive?: boolean;
}) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        width: 64,
        height: 32,
        borderRadius: RADIUS.full,
        backgroundColor: focused ? theme.accentFaint : "transparent",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {focused ? (
        <ActiveIcon size={size} color={color} {...(fillActive ? { fill: color } : {})} />
      ) : (
        <Icon size={size} color={color} />
      )}
    </View>
  );
}

export default function TabsLayout() {
  const { theme, mode } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <NoiseBackground />
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.textMuted,
          sceneStyle: { backgroundColor: "transparent" },
          tabBarStyle: {
            backgroundColor: theme.surface1,
            borderTopWidth: 1,
            borderTopColor: theme.glassBorder,
            position: "absolute",
            paddingTop: 6,
            paddingBottom: 28,
            height: 88,
            elevation: 0,
          },
          tabBarBackground: () => null,
          tabBarLabelStyle: { fontSize: 10, fontWeight: "500" },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Today",
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon focused={focused} Icon={CalendarDays} ActiveIcon={CalendarDays} color={color} size={size} fillActive />
            ),
          }}
        />
        <Tabs.Screen
          name="habits"
          options={{
            title: "Stats",
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon focused={focused} Icon={BarChart3} ActiveIcon={BarChart3} color={color} size={size} fillActive />
            ),
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            title: "Insights",
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon focused={focused} Icon={Sparkles} ActiveIcon={Sparkles} color={color} size={size} fillActive />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "More",
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon focused={focused} Icon={Menu} ActiveIcon={Menu} color={color} size={size} fillActive />
            ),
          }}
        />
      </Tabs>
      <FAB />
    </View>
  );
}
