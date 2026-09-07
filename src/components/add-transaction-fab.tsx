import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, Spacing } from '@/constants/theme';

export function AddTransactionFab() {
  return (
    <Pressable
      style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      onPress={() => router.push('/new-transaction')}>
      <ThemedText style={styles.fabLabel}>+</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: Spacing.four,
    bottom: BottomTabInset + Spacing.three,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabPressed: {
    opacity: 0.85,
  },
  fabLabel: {
    color: '#ffffff',
    fontSize: 32,
    lineHeight: 34,
    fontWeight: '600',
  },
});
