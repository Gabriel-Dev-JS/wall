import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';
import { Alert } from 'react-native';

import { deleteTransactionsByMonth } from '@/domain/transactions/repository';
import { formatMonthLabel } from '@/utils/date';

export function useConfirmDeleteMonth(onDeleted: () => void) {
  const db = useSQLiteContext();

  return useCallback(
    (month: string) => {
      Alert.alert(
        'Excluir mês',
        `Deseja excluir todos os lançamentos de ${formatMonthLabel(month)}? Essa ação não pode ser desfeita.`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Excluir mês',
            style: 'destructive',
            onPress: async () => {
              await deleteTransactionsByMonth(db, month);
              onDeleted();
            },
          },
        ]
      );
    },
    [db, onDeleted]
  );
}
