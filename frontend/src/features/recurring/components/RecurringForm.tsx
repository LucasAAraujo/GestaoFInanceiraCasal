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
import { useCategories } from "#features/categories/hooks/useCategories.ts";
import { useAccounts } from "#features/accounts/hooks/useAccounts.ts";
import { useCreateRecurrence, useUpdateRecurrence } from "../hooks/useRecurring.ts";
import type { RecurringTransaction } from "../services/recurringService.ts";

interface RecurringFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recurring?: RecurringTransaction | null;
}

const FREQUENCY_OPTIONS = [
  { value: "weekly", label: "Semanal" },
  { value: "monthly", label: "Mensal" },
  { value: "yearly", label: "Anual" },
];

export function RecurringForm({ open, onOpenChange, recurring }: RecurringFormProps) {
  const { data: categories } = useCategories();
  const { data: accounts } = useAccounts();
  const createMutation = useCreateRecurrence();
  const updateMutation = useUpdateRecurrence();
  const isEditing = !!recurring;

  const [description, setDescription] = useState(recurring?.description ?? "");
  const [amount, setAmount] = useState(recurring?.amount ?? "");
  const [categoryId, setCategoryId] = useState(recurring?.categoryId ?? "");
  const [accountId, setAccountId] = useState(recurring?.accountId ?? "");
  const [frequency, setFrequency] = useState(recurring?.frequency ?? "monthly");
  const [startDate, setStartDate] = useState(
    recurring?.startDate
      ? new Date(recurring.startDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  );

  const expenseCategories = categories?.filter((c) => c.type === "expense");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      description,
      amount: parseFloat(amount),
      categoryId,
      accountId,
      frequency,
      startDate,
    };

    if (isEditing) {
      await updateMutation.mutateAsync({ id: recurring.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
    onOpenChange(false);
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Recorrência" : "Nova Recorrência"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rec-desc">Descrição</Label>
            <Input
              id="rec-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Netflix, Aluguel..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rec-amount">Valor</Label>
            <Input
              id="rec-amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rec-category">Categoria</Label>
            <select
              id="rec-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
            >
              <option value="">Selecione...</option>
              {expenseCategories?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rec-account">Conta</Label>
            <select
              id="rec-account"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
            >
              <option value="">Selecione...</option>
              {accounts?.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rec-frequency">Frequência</Label>
            <select
              id="rec-frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {FREQUENCY_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>

          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="rec-start">Data de Início</Label>
              <Input
                id="rec-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Salvando..." : isEditing ? "Salvar" : "Criar Recorrência"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
