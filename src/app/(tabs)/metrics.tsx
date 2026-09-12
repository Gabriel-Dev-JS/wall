import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MonthlyBarChart } from '@/components/charts/monthly-bar-chart';
import { FolderRow } from '@/components/folder-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { transactionsToCsv } from '@/domain/transactions/csv';
import { groupByYear, monthlyExpenseTotals } from '@/domain/transactions/reports';
import { useConfirmDeleteYear } from '@/hooks/use-confirm-delete-year';
import { useTransactions } from '@/hooks/use-transactions';
import { exportCsv } from '@/utils/csv-export';
import { yearKey } from '@/utils/date';

export default function MetricsScreen() {
  const { transactions, reload } = useTransactions();
  const confirmDeleteYear = useConfirmDeleteYear(reload);
  const groups = groupByYear(transactions).sort((a, b) => b.key.localeCompare(a.key));
  const monthlyExpenses = monthlyExpenseTotals(transactions);

  function handleExportYear(year: string) {
    const yearTransactions = transactions.filter((transaction) => yearKey(transaction.date) === year);
    exportCsv(`transacoes-${year}.csv`, transactionsToCsv(yearTransactions));
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <ThemedText type="subtitle">Métricas</ThemedText>

          <View style={styles.section}>
            <ThemedText type="smallBold">Gastos por mês</ThemedText>
            <MonthlyBarChart data={monthlyExpenses} />
          </View>

          <View style={styles.section}>
            <ThemedText type="smallBold">Anos</ThemedText>

            {groups.length === 0 ? (
              <ThemedText type="small" themeColor="textSecondary">
                Nenhum lançamento registrado ainda.
              </ThemedText>
            ) : (
              <View style={styles.folderList}>
                {groups.map((group) => (
                  <FolderRow
                    key={group.key}
                    label={group.key}
                    subtitle={`${group.monthCount} ${group.monthCount === 1 ? 'mês' : 'meses'}`}
                    total={group.total}
                    onPress={() =>
                      router.push({ pathname: '/year/[year]', params: { year: group.key } })
                    }
                    onExport={() => handleExportYear(group.key)}
                    onDelete={() => confirmDeleteYear(group.key)}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
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
  section: {
    gap: Spacing.three,
  },
  folderList: {
    gap: Spacing.two,
  },
});
