import type { Transaction, TransactionType } from './types';

export function sumByType(transactions: Transaction[], type: TransactionType): number {
  return transactions.filter((t) => t.type === type).reduce((sum, t) => sum + t.amountCents, 0);
}

export function totalIncome(transactions: Transaction[]): number {
  return sumByType(transactions, 'receita');
}

export function totalExpense(transactions: Transaction[]): number {
  return sumByType(transactions, 'despesa');
}

export function balance(transactions: Transaction[]): number {
  return totalIncome(transactions) - totalExpense(transactions);
}

export function isSameDay(isoDate: string, reference: Date): boolean {
  return isoDate.slice(0, 10) === reference.toISOString().slice(0, 10);
}

export function isSameMonth(isoDate: string, reference: Date): boolean {
  return isoDate.slice(0, 7) === reference.toISOString().slice(0, 7);
}
