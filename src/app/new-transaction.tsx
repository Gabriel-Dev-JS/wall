import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CATEGORIES, type CategoryId } from '@/constants/categories';
import { Spacing } from '@/constants/theme';
import {
  deleteTransaction,
  getTransactionById,
  insertTransaction,
  updateTransaction,
} from '@/domain/transactions/repository';
import type { NewTransaction, Transaction, TransactionType } from '@/domain/transactions/types';
import { useTheme } from '@/hooks/use-theme';
import { confirmDestructive } from '@/utils/confirm';
import { isCurrentMonth, monthKey } from '@/utils/date';
import { centsFromDigits, formatCentsToBRL } from '@/utils/money';

export default function NewTransactionScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const transactionId = id ? Number(id) : null;
  const db = useSQLiteContext();
  const theme = useTheme();

  const [existing, setExisting] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(transactionId));
  const [description, setDescription] = useState('');
  const [amountCents, setAmountCents] = useState(0);
  const [type, setType] = useState<TransactionType>('despesa');
  const [categoryId, setCategoryId] = useState<CategoryId | null>(null);

  useEffect(() => {
    if (!transactionId) return;
    getTransactionById(db, transactionId).then((transaction) => {
      if (transaction) {
        setExisting(transaction);
        setDescription(transaction.description);
        setAmountCents(transaction.amountCents);
        setType(transaction.type);
        setCategoryId(transaction.categoryId);
      }
      setIsLoading(false);
    });
  }, [db, transactionId]);

  async function handleSave() {
    if (!description.trim()) {
      Alert.alert('Descrição obrigatória', 'Informe uma descrição para o lançamento.');
      return;
    }
    if (amountCents <= 0) {
      Alert.alert('Valor inválido', 'Informe um valor maior que zero.');
      return;
    }
    if (!categoryId) {
      Alert.alert('Categoria obrigatória', 'Escolha uma categoria para o lançamento.');
      return;
    }

    const input: NewTransaction = {
      description: description.trim(),
      amountCents,
      type,
      categoryId,
      date: existing?.date ?? new Date().toISOString(),
    };

    if (existing) {
      await updateTransaction(db, existing.id, input);
    } else {
      await insertTransaction(db, input);
    }
    router.back();
  }

  const canDelete = existing ? isCurrentMonth(monthKey(existing.date)) : false;

  async function handleDelete() {
    if (!existing || !canDelete) return;
    const confirmed = await confirmDestructive(
      'Excluir lançamento',
      `Deseja excluir "${existing.description}"?`,
      'Excluir'
    );
    if (!confirmed) return;

    await deleteTransaction(db, existing.id);
    router.back();
  }

  if (isLoading) {
    return <ThemedView style={styles.container} />;
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: existing ? 'Editar lançamento' : 'Novo lançamento' }} />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.typeToggle}>
          {(['despesa', 'receita'] as TransactionType[]).map((option) => {
            const isActive = type === option;
            const activeColor = option === 'despesa' ? theme.negative : theme.positive;
            return (
              <Pressable key={option} style={styles.typeButtonWrapper} onPress={() => setType(option)}>
                <ThemedView
                  type={isActive ? 'backgroundSelected' : 'backgroundElement'}
                  style={styles.typeButton}>
                  <ThemedText
                    type="smallBold"
                    style={isActive ? { color: activeColor } : undefined}
                    themeColor={isActive ? undefined : 'textSecondary'}>
                    {option === 'despesa' ? 'Despesa' : 'Receita'}
                  </ThemedText>
                </ThemedView>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.field}>
          <ThemedText type="small" themeColor="textSecondary">
            Valor
          </ThemedText>
          <TextInput
            style={[styles.amountInput, { color: theme.text }]}
            keyboardType="numeric"
            value={amountCents === 0 ? '' : formatCentsToBRL(amountCents)}
            onChangeText={(text) => setAmountCents(centsFromDigits(text))}
            placeholder="R$ 0,00"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <View style={styles.field}>
          <ThemedText type="small" themeColor="textSecondary">
            Descrição
          </ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Ex: Almoço"
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        <View style={styles.field}>
          <ThemedText type="small" themeColor="textSecondary">
            Categoria *
          </ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}>
            {CATEGORIES.map((category) => {
              const isActive = categoryId === category.id;
              return (
                <Pressable key={category.id} onPress={() => setCategoryId(category.id)}>
                  <ThemedView
                    type={isActive ? 'backgroundSelected' : 'backgroundElement'}
                    style={styles.categoryChip}>
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <ThemedText type="small">{category.label}</ThemedText>
                  </ThemedView>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <ThemedText style={styles.saveButtonLabel}>Salvar</ThemedText>
        </Pressable>
        {existing && canDelete && (
          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <ThemedText themeColor="negative" type="smallBold">
              Excluir lançamento
            </ThemedText>
          </Pressable>
        )}
        {existing && !canDelete && (
          <ThemedText type="small" themeColor="textSecondary" style={styles.readOnlyHint}>
            Lançamentos de meses anteriores não podem ser excluídos individualmente. Apague o mês
            inteiro na tela do mês.
          </ThemedText>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  typeToggle: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  typeButtonWrapper: {
    flex: 1,
  },
  typeButton: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  field: {
    gap: Spacing.two,
  },
  amountInput: {
    fontSize: 40,
    fontWeight: '600',
  },
  input: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
  },
  categoryList: {
    gap: Spacing.two,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
  },
  categoryIcon: {
    fontSize: 16,
  },
  footer: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    gap: Spacing.two,
  },
  saveButton: {
    backgroundColor: '#208AEF',
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  saveButtonLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  readOnlyHint: {
    textAlign: 'center',
    paddingVertical: Spacing.two,
  },
});
