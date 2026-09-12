import { getCategoryById } from '@/constants/categories';

import type { Transaction } from './types';

const CSV_SEPARATOR = ';';
const CSV_HEADER = ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor (R$)'];

function escapeCsvField(value: string): string {
  if (/[;"\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function formatCsvDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatCsvAmount(cents: number): string {
  return (cents / 100).toFixed(2).replace('.', ',');
}

export function transactionsToCsv(transactions: Transaction[]): string {
  const rows = [...transactions]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((transaction) => [
      formatCsvDate(transaction.date),
      transaction.description,
      getCategoryById(transaction.categoryId).label,
      transaction.type === 'despesa' ? 'Despesa' : 'Receita',
      formatCsvAmount(transaction.amountCents),
    ]);

  return [CSV_HEADER, ...rows]
    .map((row) => row.map(escapeCsvField).join(CSV_SEPARATOR))
    .join('\n');
}
