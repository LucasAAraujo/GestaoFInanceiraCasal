import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAccounts,
  createAccount,
  updateAccount,
  deactivateAccount,
  type CreateAccountPayload,
  type UpdateAccountPayload,
} from "../services/accountService.ts";

export function useAccounts() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAccountPayload) => createAccount(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["accounts"] }),
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountPayload }) =>
      updateAccount(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["accounts"] }),
  });
}

export function useDeactivateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deactivateAccount(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["accounts"] }),
  });
}
