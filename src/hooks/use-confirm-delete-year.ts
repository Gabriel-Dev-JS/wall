import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';

import { deleteTransactionsByYear } from '@/domain/transactions/repository';
import { confirmDestructive } from '@/utils/confirm';

export function useConfirmDeleteYear(onDeleted: () => void) {
  const db = useSQLiteContext();

  return useCallback(
    async (year: string) => {
      const confirmed = await confirmDestructive(
        'Excluir ano',
        `Deseja excluir todos os lançamentos de ${year}? Essa ação não pode ser desfeita.`,
        'Excluir ano'
      );
      if (!confirmed) return;

      await deleteTransactionsByYear(db, year);
      onDeleted();
    },
    [db, onDeleted]
  );
}
