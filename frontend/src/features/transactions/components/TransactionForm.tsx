import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  useCreateTransaction,
  useUpdateTransaction,
} from "../hooks/useTransactions.ts";
import {
  transactionSchema,
  type TransactionFormData,
} from "../schemas/transaction.schema.ts";
import type { Transaction } from "../services/transactionService.ts";

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
  defaultType?: string;
}

const TYPE_OPTIONS = [
  { value: "expense", label: "Despesa" },
  { value: "income", label: "Receita" },
  { value: "transfer", label: "Transferência" },
];

const SCOPE_OPTIONS = [
  { value: "shared", label: "Casal" },
  { value: "individual", label: "Individual" },
];

export function TransactionForm({
  open,
  onOpenChange,
  transaction,
  defaultType,
}: TransactionFormProps) {
  const { data: categories } = useCategories();
  const { data: accounts } = useAccounts();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const isEditing = !!transaction;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: (transaction?.type ?? defaultType ?? "expense") as "income" | "expense" | "transfer",
      amount: transaction ? parseFloat(transaction.amount) : undefined,
      description: transaction?.description ?? "",
      notes: transaction?.notes ?? "",
      date: transaction?.date
        ? new Date(transaction.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      categoryId: transaction?.categoryId ?? "",
      accountId: transaction?.accountId ?? "",
      beneficiaryScope: (transaction?.beneficiaryScope ?? "shared") as "individual" | "shared",
      status: (transaction?.status ?? "paid") as "pending" | "paid" | "cancelled",
    },
  });

  const selectedType = watch("type");

  const filteredCategories = categories?.filter(
    (c) => c.type === selectedType || selectedType === "transfer",
  );

  async function onSubmit(data: TransactionFormData) {
    if (isEditing) {
      await updateMutation.mutateAsync({
        id: transaction.id,
        data: { ...data, amount: data.amount },
      });
    } else {
      await createMutation.mutateAsync({ ...data, amount: data.amount });
    }
    onOpenChange(false);
    reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Transação" : "Nova Transação"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <div className="flex gap-2">
              {TYPE_OPTIONS.map((t) => (
                <Button
                  key={t.value}
                  type="button"
                  variant={selectedType === t.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setValue("type", t.value as "income" | "expense" | "transfer");
                    setValue("categoryId", "");
                  }}
                >
                  {t.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tx-amount">Valor</Label>
            <Input
              id="tx-amount"
              type="number"
              step="0.01"
              placeholder="0,00"
              {...register("amount")}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tx-description">Descrição</Label>
            <Input
              id="tx-description"
              placeholder="Ex: Supermercado, Salário..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tx-date">Data</Label>
            <Input id="tx-date" type="date" {...register("date")} />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tx-category">Categoria</Label>
            <select
              id="tx-category"
              {...register("categoryId")}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Selecione...</option>
              {filteredCategories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-sm text-destructive">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tx-account">Conta</Label>
            <select
              id="tx-account"
              {...register("accountId")}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Selecione...</option>
              {accounts?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            {errors.accountId && (
              <p className="text-sm text-destructive">
                {errors.accountId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Escopo</Label>
            <div className="flex gap-2">
              {SCOPE_OPTIONS.map((s) => (
                <Button
                  key={s.value}
                  type="button"
                  variant={
                    watch("beneficiaryScope") === s.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() =>
                    setValue("beneficiaryScope", s.value as "individual" | "shared")
                  }
                >
                  {s.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tx-notes">Observações</Label>
            <Input
              id="tx-notes"
              placeholder="Notas opcionais..."
              {...register("notes")}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? "Salvando..."
              : isEditing
                ? "Salvar"
                : "Criar Transação"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
