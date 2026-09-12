import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';

import { deleteTransaction } from '@/domain/transactions/repository';
import type { Transaction } from '@/domain/transactions/types';
import { confirmDestructive } from '@/utils/confirm';

export function useConfirmDeleteTransaction(onDeleted: () => void) {
  const db = useSQLiteContext();

  return useCallback(
    async (transaction: Transaction) => {
      const confirmed = await confirmDestructive(
        'Excluir lançamento',
        `Deseja excluir "${transaction.description}"?`,
        'Excluir'
      );
      if (!confirmed) return;

      await deleteTransaction(db, transaction.id);
      onDeleted();
    },
    [db, onDeleted]
  );
}
