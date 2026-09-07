import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddTransactionFab } from '@/components/add-transaction-fab';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TransactionRow } from '@/components/transaction-row';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { balance, isSameDay, isSameMonth, totalExpense, totalIncome } from '@/domain/transactions/calculations';
import { useConfirmDeleteTransaction } from '@/hooks/use-confirm-delete-transaction';
import { useTransactions } from '@/hooks/use-transactions';
import { formatCentsToBRL } from '@/utils/money';

export default function HomeScreen() {
  const { transactions, reload } = useTransactions();
  const confirmDelete = useConfirmDeleteTransaction(reload);

  const now = new Date();
  const monthTransactions = transactions.filter((t) => isSameMonth(t.date, now));
  const todayTransactions = transactions.filter((t) => isSameDay(t.date, now));

  const income = totalIncome(monthTransactions);
  const expense = totalExpense(monthTransactions);
  const monthBalance = balance(monthTransactions);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <ThemedText type="small" themeColor="textSecondary">
            Valor livre (receitas − despesas)
          </ThemedText>
          <ThemedText type="title" themeColor={monthBalance < 0 ? 'negative' : 'text'}>
            {formatCentsToBRL(monthBalance)}
          </ThemedText>

          <ThemedView style={styles.summaryRow}>
            <ThemedView type="backgroundElement" style={styles.summaryCard}>
              <ThemedText type="small" themeColor="textSecondary">
                Receitas
              </ThemedText>
              <ThemedText type="smallBold" themeColor="positive">
                {formatCentsToBRL(income)}
              </ThemedText>
            </ThemedView>
            <ThemedView type="backgroundElement" style={styles.summaryCard}>
              <ThemedText type="small" themeColor="textSecondary">
                Despesas
              </ThemedText>
              <ThemedText type="smallBold" themeColor="negative">
                {formatCentsToBRL(expense)}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Hoje
          </ThemedText>

          {todayTransactions.length === 0 ? (
            <ThemedText type="small" themeColor="textSecondary">
              Nenhum lançamento hoje.
            </ThemedText>
          ) : (
            <ThemedView style={styles.list}>
              {todayTransactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  onLongPress={() => confirmDelete(transaction)}
                />
              ))}
            </ThemedView>
          )}
        </ScrollView>

        <AddTransactionFab />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.six,
    gap: Spacing.two,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  summaryCard: {
    flex: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.half,
  },
  sectionTitle: {
    marginTop: Spacing.five,
    marginBottom: Spacing.one,
  },
  list: {
    gap: Spacing.two,
  },
});
