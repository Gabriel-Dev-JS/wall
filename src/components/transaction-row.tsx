import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getCategoryById } from '@/constants/categories';
import { Spacing } from '@/constants/theme';
import type { Transaction } from '@/domain/transactions/types';
import { useTheme } from '@/hooks/use-theme';
import { formatShortDate } from '@/utils/date';
import { formatCentsToBRL } from '@/utils/money';

interface TransactionRowProps {
  transaction: Transaction;
  onDelete?: () => void;
  showDate?: boolean;
}

export function TransactionRow({ transaction, onDelete, showDate }: TransactionRowProps) {
  const category = getCategoryById(transaction.categoryId);
  const isExpense = transaction.type === 'despesa';
  const theme = useTheme();

  function handleEdit() {
    router.push({ pathname: '/new-transaction', params: { id: String(transaction.id) } });
  }

  return (
    <Swipeable
      overshootRight={false}
      renderRightActions={(_progress, _dragX, swipeable) => (
        <View style={styles.actions}>
          <Pressable
            style={[styles.actionButton, styles.editAction]}
            onPress={() => {
              swipeable.close();
              handleEdit();
            }}>
            <Text style={styles.actionIcon}>✏️</Text>
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
      <Pressable onPress={handleEdit} style={({ pressed }) => pressed && styles.pressed}>
        <ThemedView type="backgroundElement" style={styles.row}>
          <Text style={styles.icon}>{category.icon}</Text>
          <View style={styles.info}>
            <ThemedText type="default">{transaction.description}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {category.label}
              {showDate ? ` · ${formatShortDate(transaction.date)}` : ''}
            </ThemedText>
          </View>
          <ThemedText type="smallBold" themeColor={isExpense ? 'negative' : 'positive'}>
            {isExpense ? '- ' : '+ '}
            {formatCentsToBRL(transaction.amountCents)}
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
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
  },
  icon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
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
  editAction: {
    backgroundColor: '#208AEF',
  },
  actionIcon: {
    fontSize: 22,
  },
});
