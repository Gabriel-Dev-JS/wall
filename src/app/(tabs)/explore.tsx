import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MonthlyBarChart } from '@/components/charts/monthly-bar-chart';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemeModeToggle } from '@/components/theme-mode-toggle';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { groupByYear, monthlyExpenseTotals } from '@/domain/transactions/reports';
import { useTransactions } from '@/hooks/use-transactions';
import { formatCentsToBRL } from '@/utils/money';

export default function HistoryScreen() {
  const { transactions } = useTransactions();
  const groups = groupByYear(transactions).sort((a, b) => b.key.localeCompare(a.key));
  const monthlyExpenses = monthlyExpenseTotals(transactions);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <ThemedText type="subtitle">Histórico</ThemedText>

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
                  <Pressable
                    key={group.key}
                    onPress={() =>
                      router.push({ pathname: '/year/[year]', params: { year: group.key } })
                    }>
                    <ThemedView type="backgroundElement" style={styles.folderRow}>
                      <View style={styles.folderInfo}>
                        <ThemedText type="default">{group.key}</ThemedText>
                        <ThemedText type="small" themeColor="textSecondary">
                          {group.monthCount} {group.monthCount === 1 ? 'mês' : 'meses'}
                        </ThemedText>
                      </View>
                      <ThemedText
                        type="smallBold"
                        themeColor={group.total < 0 ? 'negative' : 'positive'}>
                        {formatCentsToBRL(group.total)}
                      </ThemedText>
                    </ThemedView>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View style={styles.section}>
            <ThemedText type="smallBold">Aparência</ThemedText>
            <ThemeModeToggle />
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
  folderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
  },
  folderInfo: {
    gap: 2,
  },
});
