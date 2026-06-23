import { api } from "#shared/lib/api.ts";

export interface Account {
  id: string;
  tenantId: string;
  name: string;
  type: string;
  ownerUserId: string | null;
  initialBalance: string;
  isActive: boolean;
}

export interface CreateAccountPayload {
  name: string;
  type: string;
  ownerUserId?: string;
  initialBalance?: number;
}

export interface UpdateAccountPayload {
  name?: string;
  type?: string;
  ownerUserId?: string;
}

export async function getAccounts() {
  const response = await api.get<Account[]>("/accounts");
  return response.data;
}

export async function createAccount(data: CreateAccountPayload) {
  const response = await api.post<Account>("/accounts", data);
  return response.data;
}

export async function updateAccount(id: string, data: UpdateAccountPayload) {
  const response = await api.patch<Account>(`/accounts/${id}`, data);
  return response.data;
}

export async function deactivateAccount(id: string) {
  const response = await api.delete(`/accounts/${id}`);
  return response.data;
}
