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
  accountId: z.string().min(1, "Conta é obrigatória"),
  beneficiaryScope: z.enum(["individual", "shared"]).default("shared"),
  status: z.enum(["pending", "paid"]).default("paid"),
});

type FormData = z.infer<typeof schema>;

interface ExpenseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QUICK_EXPENSES = [
  { label: "Netflix", icon: "🎬", color: "#E50914" },
  { label: "Spotify", icon: "🎵", color: "#1DB954" },
  { label: "Disney+", icon: "🏰", color: "#113CCF" },
  { label: "Amazon Prime", icon: "📦", color: "#00A8E1" },
  { label: "HBO Max", icon: "🎭", color: "#B509FF" },
  { label: "YouTube Premium", icon: "▶️", color: "#FF0000" },
  { label: "Conta de Água", icon: "💧", color: "#0EA5E9" },
  { label: "Conta de Luz", icon: "⚡", color: "#F59E0B" },
  { label: "Internet", icon: "🌐", color: "#6366F1" },
  { label: "Aluguel", icon: "🏠", color: "#EF4444" },
  { label: "Supermercado", icon: "🛒", color: "#22C55E" },
  { label: "Gasolina", icon: "⛽", color: "#F97316" },
];

export function ExpenseForm({ open, onOpenChange }: ExpenseFormProps) {
  const { data: categories } = useCategories();
  const { data: accounts } = useAccounts();
  const createMutation = useCreateTransaction();

  const expenseCategories = categories?.filter((c) => c.type === "expense");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      beneficiaryScope: "shared",
      status: "paid",
    },
  });

  function selectQuickExpense(label: string) {
    setValue("description", label);
  }

  async function onSubmit(data: FormData) {
    await createMutation.mutateAsync({ ...data, type: "expense" });
    onOpenChange(false);
    reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            Nova Despesa
          </DialogTitle>
        </DialogHeader>

        <div className="mb-2">
          <p className="text-xs text-muted-foreground mb-2">Atalhos</p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_EXPENSES.map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={() => selectQuickExpense(q.label)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium border border-border hover:bg-accent transition-colors"
              >
                <span>{q.icon}</span>
                {q.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="exp-amount">Valor</Label>
              <Input id="exp-amount" type="number" step="0.01" placeholder="0,00" {...register("amount")} />
              {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp-date">Data</Label>
              <Input id="exp-date" type="date" {...register("date")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="exp-desc">Descrição</Label>
            <Input id="exp-desc" placeholder="Ex: Supermercado, Farmácia..." {...register("description")} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="exp-cat">Categoria</Label>
              <select id="exp-cat" {...register("categoryId")} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="">Selecione...</option>
                {expenseCategories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp-acc">Conta</Label>
              <select id="exp-acc" {...register("accountId")} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="">Selecione...</option>
                {accounts?.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              {errors.accountId && <p className="text-sm text-destructive">{errors.accountId.message}</p>}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="space-y-2">
              <Label>Escopo</Label>
              <div className="flex gap-2">
                {(["shared", "individual"] as const).map((v) => (
                  <Button key={v} type="button" size="sm" variant={watch("beneficiaryScope") === v ? "default" : "outline"} onClick={() => setValue("beneficiaryScope", v)}>
                    {v === "shared" ? "Casal" : "Individual"}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex gap-2">
                {(["paid", "pending"] as const).map((v) => (
                  <Button key={v} type="button" size="sm" variant={watch("status") === v ? "default" : "outline"} onClick={() => setValue("status", v)}>
                    {v === "paid" ? "Pago" : "Pendente"}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Adicionar Despesa"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
