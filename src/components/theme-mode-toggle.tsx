import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useThemeMode, type ThemeMode } from '@/hooks/theme-mode-provider';

const OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
  { value: 'system', label: 'Sistema' },
];

export function ThemeModeToggle() {
  const { themeMode, setThemeMode } = useThemeMode();

  return (
    <View style={styles.row}>
      {OPTIONS.map((option) => {
        const isActive = themeMode === option.value;
        return (
          <Pressable
            key={option.value}
            style={styles.optionWrapper}
            onPress={() => setThemeMode(option.value)}>
            <ThemedView
              type={isActive ? 'backgroundSelected' : 'backgroundElement'}
              style={styles.option}>
              <ThemedText type="small" themeColor={isActive ? undefined : 'textSecondary'}>
                {option.label}
              </ThemedText>
            </ThemedView>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  optionWrapper: {
    flex: 1,
  },
  option: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
});
