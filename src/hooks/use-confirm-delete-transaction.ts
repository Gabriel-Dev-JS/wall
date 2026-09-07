import { useSQLiteContext } from 'expo-sqlite';
import { useCallback } from 'react';
import { Alert } from 'react-native';

import { deleteTransaction } from '@/domain/transactions/repository';
import type { Transaction } from '@/domain/transactions/types';

export function useConfirmDeleteTransaction(onDeleted: () => void) {
  const db = useSQLiteContext();

  return useCallback(
    (transaction: Transaction) => {
      Alert.alert('Excluir lançamento', `Deseja excluir "${transaction.description}"?`, [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteTransaction(db, transaction.id);
            onDeleted();
          },
        },
      ]);
    },
    [db, onDeleted]
  );
}
