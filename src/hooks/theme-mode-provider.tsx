import { useSQLiteContext } from 'expo-sqlite';
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

import { getSetting, setSetting } from '@/domain/settings/repository';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type ThemeMode = 'light' | 'dark' | 'system';
type ResolvedScheme = 'light' | 'dark';

interface ThemeModeContextValue {
  themeMode: ThemeMode;
  resolvedScheme: ResolvedScheme;
  setThemeMode: (mode: ThemeMode) => void;
}

const SETTING_KEY = 'theme_mode';

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export function ThemeModeProvider({ children }: PropsWithChildren) {
  const db = useSQLiteContext();
  const systemScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    getSetting(db, SETTING_KEY).then((value) => {
      if (value === 'light' || value === 'dark' || value === 'system') {
        setThemeModeState(value);
      }
    });
  }, [db]);

  function setThemeMode(mode: ThemeMode) {
    setThemeModeState(mode);
    setSetting(db, SETTING_KEY, mode);
  }

  const resolvedScheme: ResolvedScheme =
    themeMode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : themeMode;

  return (
    <ThemeModeContext.Provider value={{ themeMode, resolvedScheme, setThemeMode }}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }
  return context;
}
