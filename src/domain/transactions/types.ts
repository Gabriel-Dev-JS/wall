import type { CategoryId } from '@/constants/categories';

export type TransactionType = 'receita' | 'despesa';

export interface Transaction {
  id: number;
  description: string;
  amountCents: number;
  type: TransactionType;
  categoryId: CategoryId;
  date: string;
  createdAt: string;
}

export interface NewTransaction {
  description: string;
  amountCents: number;
  type: TransactionType;
  categoryId: CategoryId;
  date: string;
}
