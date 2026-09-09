import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { balance } from '@/domain/transactions/calculations';
import { groupByMonth } from '@/domain/transactions/reports';
import { useTransactions } from '@/hooks/use-transactions';
import { formatMonthLabel, yearKey } from '@/utils/date';
import { formatCentsToBRL } from '@/utils/money';

export default function YearScreen() {
  const { year } = useLocalSearchParams<{ year: string }>();
  const { transactions } = useTransactions();

  const yearTransactions = transactions.filter((transaction) => yearKey(transaction.date) === year);
  const yearBalance = balance(yearTransactions);
  const months = groupByMonth(yearTransactions).sort((a, b) => b.key.localeCompare(a.key));

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
                  <Pressable
                    key={month.key}
                    onPress={() =>
                      router.push({ pathname: '/month/[month]', params: { month: month.key } })
                    }>
                    <ThemedView type="backgroundElement" style={styles.folderRow}>
                      <View style={styles.folderInfo}>
                        <ThemedText type="default">{formatMonthLabel(month.key)}</ThemedText>
                        <ThemedText type="small" themeColor="textSecondary">
                          {month.count} lançamento{month.count === 1 ? '' : 's'}
                        </ThemedText>
                      </View>
                      <ThemedText
                        type="smallBold"
                        themeColor={month.total < 0 ? 'negative' : 'positive'}>
                        {formatCentsToBRL(month.total)}
                      </ThemedText>
                    </ThemedView>
                  </Pressable>
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
