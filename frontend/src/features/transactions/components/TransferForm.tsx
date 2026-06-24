import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useCreateTransaction } from "../hooks/useTransactions.ts";

const schema = z.object({
  amount: z.coerce.number().positive("Valor deve ser positivo"),
  description: z.string().min(1, "Descrição é obrigatória"),
  date: z.string().min(1, "Data é obrigatória"),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  accountId: z.string().min(1, "Conta de origem é obrigatória"),
});

type FormData = z.infer<typeof schema>;

interface TransferFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransferForm({ open, onOpenChange }: TransferFormProps) {
  const { data: categories } = useCategories();
  const { data: accounts } = useAccounts();
  const createMutation = useCreateTransaction();

  const transferCategories = categories?.filter((c) => c.type === "transfer" || c.type === "expense");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
    },
  });

  async function onSubmit(data: FormData) {
    await createMutation.mutateAsync({
      ...data,
      type: "transfer",
      beneficiaryScope: "shared",
      status: "paid",
    });
    onOpenChange(false);
    reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-500" />
            Nova Transferência
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tf-amount">Valor</Label>
            <Input id="tf-amount" type="number" step="0.01" placeholder="0,00" {...register("amount")} />
            {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tf-desc">Descrição</Label>
            <Input id="tf-desc" placeholder="Ex: Transferência entre contas..." {...register("description")} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tf-date">Data</Label>
            <Input id="tf-date" type="date" {...register("date")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tf-acc">Conta de Origem</Label>
            <select id="tf-acc" {...register("accountId")} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
              <option value="">Selecione...</option>
              {accounts?.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            {errors.accountId && <p className="text-sm text-destructive">{errors.accountId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tf-cat">Categoria</Label>
            <select id="tf-cat" {...register("categoryId")} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
              <option value="">Selecione...</option>
              {transferCategories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
          </div>

          <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Adicionar Transferência"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
