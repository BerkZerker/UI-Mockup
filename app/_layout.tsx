import { Stack } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from '../src/theme';
import { AppStateProvider, useAppState } from '../src/state';

function AppContent() {
  const { loading } = useAppState();
  const { theme } = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.bg }}>
        <ActivityIndicator size="large" color={theme.textTertiary} />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppStateProvider>
          <SafeAreaProvider>
            <AppContent />
          </SafeAreaProvider>
        </AppStateProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
