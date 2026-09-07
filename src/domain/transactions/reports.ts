import type { CategoryId } from '@/constants/categories';
import { monthKey } from '@/utils/date';

import type { Transaction } from './types';

export interface MonthTotal {
  key: string;
  total: number;
}

export function monthlyExpenseTotals(transactions: Transaction[], monthsBack = 6): MonthTotal[] {
  const now = new Date();
  const months: MonthTotal[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    months.push({ key, total: 0 });
  }

  const totalsByKey = new Map(months.map((month) => [month.key, month]));
  for (const transaction of transactions) {
    if (transaction.type !== 'despesa') continue;
    const entry = totalsByKey.get(monthKey(transaction.date));
    if (entry) {
      entry.total += transaction.amountCents;
    }
  }

  return months;
}

export interface CategoryTotal {
  categoryId: CategoryId;
  total: number;
}

export function expensesByCategory(transactions: Transaction[]): CategoryTotal[] {
  const totals = new Map<CategoryId, number>();
  for (const transaction of transactions) {
    if (transaction.type !== 'despesa') continue;
    totals.set(transaction.categoryId, (totals.get(transaction.categoryId) ?? 0) + transaction.amountCents);
  }

  return Array.from(totals.entries())
    .map(([categoryId, total]) => ({ categoryId, total }))
    .sort((a, b) => b.total - a.total);
}
