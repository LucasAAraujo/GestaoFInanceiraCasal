import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRecurrences,
  createRecurrence,
  updateRecurrence,
  deactivateRecurrence,
  generateOccurrences,
  type CreateRecurringPayload,
  type UpdateRecurringPayload,
} from "../services/recurringService.ts";

export function useRecurrences() {
  return useQuery({
    queryKey: ["recurring"],
    queryFn: getRecurrences,
  });
}

export function useCreateRecurrence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRecurringPayload) => createRecurrence(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recurring"] }),
  });
}

export function useUpdateRecurrence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRecurringPayload }) =>
      updateRecurrence(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recurring"] }),
  });
}

export function useDeactivateRecurrence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deactivateRecurrence(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["recurring"] }),
  });
}

export function useGenerateOccurrences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => generateOccurrences(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
