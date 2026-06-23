import { api } from "#shared/lib/api.ts";
import type { Category } from "#features/categories/services/categoryService.ts";
import type { Account } from "#features/accounts/services/accountService.ts";

export interface Transaction {
  id: string;
  tenantId: string;
  type: string;
  amount: string;
  description: string;
  notes: string | null;
  date: string;
  categoryId: string;
  accountId: string;
  ownerUserId: string | null;
  paidByUserId: string | null;
  beneficiaryScope: string;
  status: string;
  category: Pick<Category, "id" | "name" | "color" | "icon" | "type">;
  account: Pick<Account, "id" | "name" | "type">;
}

export interface TransactionListResponse {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  type?: string;
  status?: string;
  accountId?: string;
  ownerUserId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateTransactionPayload {
  type: string;
  amount: number;
  description: string;
  notes?: string;
  date: string;
  categoryId: string;
  accountId: string;
  ownerUserId?: string;
  paidByUserId?: string;
  beneficiaryScope?: string;
  status?: string;
}

export type UpdateTransactionPayload = Partial<CreateTransactionPayload>;

export async function getTransactions(filters: TransactionFilters = {}) {
  const response = await api.get<TransactionListResponse>("/transactions", {
    params: filters,
  });
  return response.data;
}

export async function createTransaction(data: CreateTransactionPayload) {
  const response = await api.post<Transaction>("/transactions", data);
  return response.data;
}

export async function updateTransaction(
  id: string,
  data: UpdateTransactionPayload,
) {
  const response = await api.patch<Transaction>(`/transactions/${id}`, data);
  return response.data;
}

export async function deleteTransaction(id: string) {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
}
