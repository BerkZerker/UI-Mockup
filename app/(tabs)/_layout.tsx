import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";
import {
  CalendarBlankIcon,
  ChartBarIcon,
  SparkleIcon,
  ListIcon,
} from "phosphor-react-native";
import { useTheme, RADIUS } from "../../src/theme";
import { NoiseBackground } from "../../src/components";
import { FAB } from "../../src/components/FAB";

function TabIcon({
  focused,
  Icon,
  color,
  size,
}: {
  focused: boolean;
  Icon: any;
  color: string;
  size: number;
}) {
  const { theme } = useTheme();
  return (
    <View
      style={{
        width: 64,
        height: 32,
        borderRadius: RADIUS.full,
        backgroundColor: focused ? theme.accentMuted : "transparent",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon size={size} color={color} weight={focused ? "bold" : "regular"} />
    </View>
  );
}

function CalendarDayIcon({
  size,
  color,
  weight,
}: {
  size: number;
  color: string;
  weight: "bold" | "regular";
}) {
  const day = new Date().getDate();
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CalendarBlankIcon size={size} color={color} weight={weight} />
      <Text
        style={{
          position: "absolute",
          top: size * 0.33,
          fontSize: size * 0.38,
          fontWeight: "700",
          color,
        }}
      >
        {day}
      </Text>
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
            height: 96,
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
              <TabIcon
                focused={focused}
                Icon={CalendarDayIcon}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="habits"
          options={{
            title: "Stats",
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon
                focused={focused}
                Icon={ChartBarIcon}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            title: "Insights",
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon
                focused={focused}
                Icon={SparkleIcon}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "More",
            tabBarIcon: ({ color, size, focused }) => (
              <TabIcon
                focused={focused}
                Icon={ListIcon}
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tabs>
      <FAB />
    </View>
  );
}
