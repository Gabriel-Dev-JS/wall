import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FolderRow } from '@/components/folder-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { balance } from '@/domain/transactions/calculations';
import { transactionsToCsv } from '@/domain/transactions/csv';
import { groupByMonth } from '@/domain/transactions/reports';
import { useConfirmDeleteMonth } from '@/hooks/use-confirm-delete-month';
import { useTransactions } from '@/hooks/use-transactions';
import { exportCsv } from '@/utils/csv-export';
import { formatMonthLabel, monthKey, yearKey } from '@/utils/date';
import { formatCentsToBRL } from '@/utils/money';

export default function YearScreen() {
  const { year } = useLocalSearchParams<{ year: string }>();
  const { transactions, reload } = useTransactions();
  const confirmDeleteMonth = useConfirmDeleteMonth(reload);

  const yearTransactions = transactions.filter((transaction) => yearKey(transaction.date) === year);
  const yearBalance = balance(yearTransactions);
  const months = groupByMonth(yearTransactions).sort((a, b) => b.key.localeCompare(a.key));

  function handleExportMonth(month: string) {
    const monthTransactions = transactions.filter((transaction) => monthKey(transaction.date) === month);
    exportCsv(`transacoes-${month}.csv`, transactionsToCsv(monthTransactions));
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: year }} />

      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.freeAmount}>
            <ThemedText type="small" themeColor="textSecondary">
              Valor livre do ano
            </ThemedText>
            <ThemedText type="subtitle" themeColor={yearBalance < 0 ? 'negative' : 'text'}>
              {formatCentsToBRL(yearBalance)}
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText type="smallBold">Meses</ThemedText>

            {months.length === 0 ? (
              <ThemedText type="small" themeColor="textSecondary">
                Nenhum lançamento registrado neste ano.
              </ThemedText>
            ) : (
              <View style={styles.folderList}>
                {months.map((month) => (
                  <FolderRow
                    key={month.key}
                    label={formatMonthLabel(month.key)}
                    subtitle={`${month.count} lançamento${month.count === 1 ? '' : 's'}`}
                    total={month.total}
                    onPress={() =>
                      router.push({ pathname: '/month/[month]', params: { month: month.key } })
                    }
                    onExport={() => handleExportMonth(month.key)}
                    onDelete={() => confirmDeleteMonth(month.key)}
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
  freeAmount: {
    gap: Spacing.half,
  },
  section: {
    gap: Spacing.three,
  },
  folderList: {
    gap: Spacing.two,
  },
});
