import { api } from "#shared/lib/api.ts";

export interface RecurringTransaction {
  id: string;
  tenantId: string;
  description: string;
  amount: string;
  categoryId: string;
  accountId: string;
  frequency: string;
  nextDueDate: string;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  ownerUserId: string | null;
  beneficiaryScope: string;
  category: { id: string; name: string; color: string; icon: string | null };
  account: { id: string; name: string; type: string };
}

export interface CreateRecurringPayload {
  description: string;
  amount: number;
  categoryId: string;
  accountId: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  ownerUserId?: string;
  beneficiaryScope?: string;
}

export type UpdateRecurringPayload = Partial<CreateRecurringPayload>;

export async function getRecurrences() {
  const response = await api.get<RecurringTransaction[]>("/recurring");
  return response.data;
}

export async function createRecurrence(data: CreateRecurringPayload) {
  const response = await api.post<RecurringTransaction>("/recurring", data);
  return response.data;
}

export async function updateRecurrence(id: string, data: UpdateRecurringPayload) {
  const response = await api.patch<RecurringTransaction>(`/recurring/${id}`, data);
  return response.data;
}

export async function deactivateRecurrence(id: string) {
  const response = await api.delete(`/recurring/${id}`);
  return response.data;
}

export async function generateOccurrences() {
  const response = await api.post<{ generated: number }>("/recurring/generate");
  return response.data;
}
