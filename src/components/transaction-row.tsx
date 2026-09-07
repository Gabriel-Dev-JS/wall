import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getCategoryById } from '@/constants/categories';
import { Spacing } from '@/constants/theme';
import type { Transaction } from '@/domain/transactions/types';
import { formatShortDate } from '@/utils/date';
import { formatCentsToBRL } from '@/utils/money';

interface TransactionRowProps {
  transaction: Transaction;
  onLongPress?: () => void;
  showDate?: boolean;
}

export function TransactionRow({ transaction, onLongPress, showDate }: TransactionRowProps) {
  const category = getCategoryById(transaction.categoryId);
  const isExpense = transaction.type === 'despesa';

  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: '/new-transaction', params: { id: String(transaction.id) } })
      }
      onLongPress={onLongPress}
      style={({ pressed }) => pressed && styles.pressed}>
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
});
