import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddTransactionFab } from '@/components/add-transaction-fab';
import { CategoryBreakdown } from '@/components/charts/category-breakdown';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TransactionRow } from '@/components/transaction-row';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { balance, totalExpense, totalIncome } from '@/domain/transactions/calculations';
import { expensesByCategory } from '@/domain/transactions/reports';
import { useConfirmDeleteTransaction } from '@/hooks/use-confirm-delete-transaction';
import { useTransactions } from '@/hooks/use-transactions';
import { formatMonthLabel, monthKey } from '@/utils/date';
import { formatCentsToBRL } from '@/utils/money';

export default function MonthScreen() {
  const { month } = useLocalSearchParams<{ month: string }>();
  const { transactions, reload } = useTransactions();
  const confirmDelete = useConfirmDeleteTransaction(reload);

  const monthTransactions = transactions.filter((transaction) => monthKey(transaction.date) === month);
  const income = totalIncome(monthTransactions);
  const expense = totalExpense(monthTransactions);
  const monthBalance = balance(monthTransactions);
  const categoryTotals = expensesByCategory(monthTransactions);
  const label = month ? formatMonthLabel(month) : '';

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: label }} />

      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.summaryRow}>
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
          </View>

          <View style={styles.freeAmount}>
            <ThemedText type="small" themeColor="textSecondary">
              Valor livre do mês
            </ThemedText>
            <ThemedText type="subtitle" themeColor={monthBalance < 0 ? 'negative' : 'text'}>
              {formatCentsToBRL(monthBalance)}
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText type="smallBold">Gastos por categoria</ThemedText>
            <CategoryBreakdown data={categoryTotals} />
          </View>

          <View style={styles.section}>
            <ThemedText type="smallBold">Lançamentos</ThemedText>
            {monthTransactions.length === 0 ? (
              <ThemedText type="small" themeColor="textSecondary">
                Nenhum lançamento neste mês.
              </ThemedText>
            ) : (
              <View style={styles.list}>
                {monthTransactions.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                    showDate
                    onLongPress={() => confirmDelete(transaction)}
                  />
                ))}
              </View>
            )}
          </View>
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
    gap: Spacing.five,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  summaryCard: {
    flex: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.half,
  },
  freeAmount: {
    gap: Spacing.half,
  },
  section: {
    gap: Spacing.three,
  },
  list: {
    gap: Spacing.two,
  },
});
