import { useState } from "react";
import { Button } from "#components/ui/button.tsx";
import { Input } from "#components/ui/input.tsx";
import { Label } from "#components/ui/label.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "#components/ui/dialog.tsx";
import { useCreateAccount, useUpdateAccount } from "../hooks/useAccounts.ts";
import type { Account } from "../services/accountService.ts";

interface AccountFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: Account | null;
}

const ACCOUNT_TYPES = [
  { value: "checking", label: "Conta Corrente" },
  { value: "savings", label: "Poupança" },
  { value: "credit_card", label: "Cartão de Crédito" },
  { value: "wallet", label: "Carteira" },
  { value: "investment", label: "Investimento" },
];

export function AccountForm({ open, onOpenChange, account }: AccountFormProps) {
  const [name, setName] = useState(account?.name ?? "");
  const [type, setType] = useState(account?.type ?? "checking");
  const [initialBalance, setInitialBalance] = useState(
    account?.initialBalance ?? "0",
  );

  const createMutation = useCreateAccount();
  const updateMutation = useUpdateAccount();
  const isEditing = !!account;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isEditing) {
      await updateMutation.mutateAsync({
        id: account.id,
        data: { name, type },
      });
    } else {
      await createMutation.mutateAsync({
        name,
        type,
        initialBalance: parseFloat(initialBalance) || 0,
      });
    }
    onOpenChange(false);
    setName("");
    setType("checking");
    setInitialBalance("0");
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Conta" : "Nova Conta"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="acc-name">Nome</Label>
            <Input
              id="acc-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Nubank, Itaú, Carteira"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="acc-type">Tipo</Label>
            <select
              id="acc-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {ACCOUNT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="acc-balance">Saldo Inicial</Label>
              <Input
                id="acc-balance"
                type="number"
                step="0.01"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Salvando..." : isEditing ? "Salvar" : "Criar Conta"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
