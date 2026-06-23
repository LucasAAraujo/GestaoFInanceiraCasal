import { api } from "#shared/lib/api.ts";

export interface Category {
  id: string;
  tenantId: string;
  name: string;
  type: string;
  color: string;
  icon: string | null;
  isDefault: boolean;
  isArchived: boolean;
}

export interface CreateCategoryPayload {
  name: string;
  type: string;
  color?: string;
  icon?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  type?: string;
  color?: string;
  icon?: string;
}

export async function getCategories() {
  const response = await api.get<Category[]>("/categories");
  return response.data;
}

export async function createCategory(data: CreateCategoryPayload) {
  const response = await api.post<Category>("/categories", data);
  return response.data;
}

export async function updateCategory(id: string, data: UpdateCategoryPayload) {
  const response = await api.patch<Category>(`/categories/${id}`, data);
  return response.data;
}

export async function archiveCategory(id: string) {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
}
