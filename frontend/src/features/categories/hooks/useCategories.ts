import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  createCategory,
  updateCategory,
  archiveCategory,
  type CreateCategoryPayload,
  type UpdateCategoryPayload,
} from "../services/categoryService.ts";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryPayload) => createCategory(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryPayload }) =>
      updateCategory(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useArchiveCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => archiveCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}
