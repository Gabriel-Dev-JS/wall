import type { SQLiteDatabase } from 'expo-sqlite';

import type { NewTransaction, Transaction, TransactionType } from './types';

interface TransactionRow {
  id: number;
  description: string;
  amount_cents: number;
  type: TransactionType;
  category_id: string;
  date: string;
  created_at: string;
}

function mapRow(row: TransactionRow): Transaction {
  return {
    id: row.id,
    description: row.description,
    amountCents: row.amount_cents,
    type: row.type,
    categoryId: row.category_id as Transaction['categoryId'],
    date: row.date,
    createdAt: row.created_at,
  };
}

export async function listTransactions(db: SQLiteDatabase): Promise<Transaction[]> {
  const rows = await db.getAllAsync<TransactionRow>(
    'SELECT * FROM transactions ORDER BY date DESC, id DESC'
  );
  return rows.map(mapRow);
}

export async function getTransactionById(
  db: SQLiteDatabase,
  id: number
): Promise<Transaction | null> {
  const row = await db.getFirstAsync<TransactionRow>(
    'SELECT * FROM transactions WHERE id = ?',
    [id]
  );
  return row ? mapRow(row) : null;
}

export async function insertTransaction(
  db: SQLiteDatabase,
  input: NewTransaction
): Promise<Transaction> {
  const createdAt = new Date().toISOString();
  const result = await db.runAsync(
    `INSERT INTO transactions (description, amount_cents, type, category_id, date, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [input.description, input.amountCents, input.type, input.categoryId, input.date, createdAt]
  );
  return {
    id: result.lastInsertRowId,
    ...input,
    createdAt,
  };
}

export async function updateTransaction(
  db: SQLiteDatabase,
  id: number,
  input: NewTransaction
): Promise<void> {
  await db.runAsync(
    `UPDATE transactions
     SET description = ?, amount_cents = ?, type = ?, category_id = ?, date = ?
     WHERE id = ?`,
    [input.description, input.amountCents, input.type, input.categoryId, input.date, id]
  );
}

export async function deleteTransaction(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
}

export async function deleteTransactionsByMonth(db: SQLiteDatabase, month: string): Promise<void> {
  await db.runAsync('DELETE FROM transactions WHERE date LIKE ?', [`${month}%`]);
}

export async function deleteTransactionsByYear(db: SQLiteDatabase, year: string): Promise<void> {
  await db.runAsync('DELETE FROM transactions WHERE date LIKE ?', [`${year}%`]);
}
