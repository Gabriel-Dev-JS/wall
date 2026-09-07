import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { MonthTotal } from '@/domain/transactions/reports';
import { useTheme } from '@/hooks/use-theme';
import { monthKey } from '@/utils/date';

const CHART_HEIGHT = 100;

function shortMonthLabel(key: string): string {
  const [year, month] = key.split('-').map(Number);
  const label = new Date(year, month - 1, 1).toLocaleDateString('pt-BR', { month: 'short' });
  return label.replace('.', '');
}

interface MonthlyBarChartProps {
  data: MonthTotal[];
}

export function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  const theme = useTheme();
  const currentKey = monthKey(new Date().toISOString());
  const max = Math.max(...data.map((month) => month.total), 1);

  return (
    <View style={styles.container}>
      {data.map((month) => {
        const isCurrent = month.key === currentKey;
        const barHeight = month.total > 0 ? Math.max((month.total / max) * CHART_HEIGHT, 4) : 2;
        return (
          <View key={month.key} style={styles.column}>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.bar,
                  {
                    height: barHeight,
                    backgroundColor: isCurrent ? '#208AEF' : theme.backgroundSelected,
                  },
                ]}
              />
            </View>
            <ThemedText type="small" themeColor="textSecondary" style={styles.label}>
              {shortMonthLabel(month.key)}
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: CHART_HEIGHT + 28,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.one,
  },
  barTrack: {
    height: CHART_HEIGHT,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 18,
    borderRadius: 6,
  },
  label: {
    fontSize: 11,
    textTransform: 'capitalize',
  },
});
