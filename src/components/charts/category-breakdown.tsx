import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { getCategoryById } from '@/constants/categories';
import { Spacing } from '@/constants/theme';
import type { CategoryTotal } from '@/domain/transactions/reports';
import { formatCentsToBRL } from '@/utils/money';

interface CategoryBreakdownProps {
  data: CategoryTotal[];
}

export function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  const total = data.reduce((sum, item) => sum + item.total, 0);

  if (total === 0) {
    return (
      <ThemedText type="small" themeColor="textSecondary">
        Sem despesas neste mês.
      </ThemedText>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {data.map((item) => {
          const category = getCategoryById(item.categoryId);
          const percent = (item.total / total) * 100;
          return (
            <View
              key={item.categoryId}
              style={[styles.segment, { flexGrow: percent, backgroundColor: category.color }]}
            />
          );
        })}
      </View>

      <View style={styles.legend}>
        {data.map((item) => {
          const category = getCategoryById(item.categoryId);
          const percent = Math.round((item.total / total) * 100);
          return (
            <View key={item.categoryId} style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: category.color }]} />
              <ThemedText type="small" style={styles.legendLabel}>
                {category.icon} {category.label}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {formatCentsToBRL(item.total)} · {percent}%
              </ThemedText>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  bar: {
    flexDirection: 'row',
    height: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  segment: {
    minWidth: 2,
  },
  legend: {
    gap: Spacing.two,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    flex: 1,
  },
});
