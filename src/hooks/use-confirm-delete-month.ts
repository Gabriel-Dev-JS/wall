import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';

import { deleteTransactionsByMonth } from '@/domain/transactions/repository';
import { confirmDestructive } from '@/utils/confirm';
import { formatMonthLabel } from '@/utils/date';

export function useConfirmDeleteMonth(onDeleted: () => void) {
  const db = useSQLiteContext();

  return useCallback(
    async (month: string) => {
      const confirmed = await confirmDestructive(
        'Excluir mês',
        `Deseja excluir todos os lançamentos de ${formatMonthLabel(month)}? Essa ação não pode ser desfeita.`,
        'Excluir mês'
      );
      if (!confirmed) return;

      await deleteTransactionsByMonth(db, month);
      onDeleted();
    },
    [db, onDeleted]
  );
}
