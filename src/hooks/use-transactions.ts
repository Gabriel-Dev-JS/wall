import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';

import { listTransactions } from '@/domain/transactions/repository';
import type { Transaction } from '@/domain/transactions/types';

export function useTransactions() {
  const db = useSQLiteContext();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(async () => {
    const data = await listTransactions(db);
    setTransactions(data);
    setIsLoading(false);
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  return { transactions, isLoading, reload };
}
