import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { migrateDbIfNeeded } from '@/db/schema';
import { ThemeModeProvider, useThemeMode } from '@/hooks/theme-mode-provider';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { resolvedScheme } = useThemeMode();
  return (
    <ThemeProvider value={resolvedScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="new-transaction"
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'Novo lançamento',
          }}
        />
        <Stack.Screen
          name="month/[month]"
          options={{
            headerShown: true,
            title: 'Mês',
          }}
        />
        <Stack.Screen
          name="year/[year]"
          options={{
            headerShown: true,
            title: 'Ano',
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SQLiteProvider databaseName="wall.db" onInit={migrateDbIfNeeded}>
        <ThemeModeProvider>
          <RootNavigator />
        </ThemeModeProvider>
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}
