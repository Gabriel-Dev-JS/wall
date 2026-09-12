import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatCentsToBRL } from '@/utils/money';

interface FolderRowProps {
  label: string;
  subtitle: string;
  total: number;
  onPress: () => void;
  onExport: () => void;
  onDelete?: () => void;
}

export function FolderRow({ label, subtitle, total, onPress, onExport, onDelete }: FolderRowProps) {
  const theme = useTheme();

  return (
    <Swipeable
      overshootRight={false}
      renderRightActions={(_progress, _dragX, swipeable) => (
        <View style={styles.actions}>
          <Pressable
            style={[styles.actionButton, styles.exportAction]}
            onPress={() => {
              swipeable.close();
              onExport();
            }}>
            <Text style={styles.actionIcon}>📄</Text>
          </Pressable>
          {onDelete && (
            <Pressable
              style={[styles.actionButton, { backgroundColor: theme.negative }]}
              onPress={() => {
                swipeable.close();
                onDelete();
              }}>
              <Text style={styles.actionIcon}>🗑️</Text>
            </Pressable>
          )}
        </View>
      )}>
      <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
        <ThemedView type="backgroundElement" style={styles.row}>
          <View style={styles.info}>
            <ThemedText type="default">{label}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {subtitle}
            </ThemedText>
          </View>
          <ThemedText type="smallBold" themeColor={total < 0 ? 'negative' : 'positive'}>
            {formatCentsToBRL(total)}
          </ThemedText>
        </ThemedView>
      </Pressable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
  },
  info: {
    gap: 2,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportAction: {
    backgroundColor: '#208AEF',
  },
  actionIcon: {
    fontSize: 22,
  },
});
