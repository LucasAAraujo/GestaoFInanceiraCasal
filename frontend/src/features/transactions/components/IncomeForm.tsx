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
});

type FormData = z.infer<typeof schema>;

interface IncomeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IncomeForm({ open, onOpenChange }: IncomeFormProps) {
  const { data: categories } = useCategories();
  const { data: accounts } = useAccounts();
  const createMutation = useCreateTransaction();

  const incomeCategories = categories?.filter((c) => c.type === "income");

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
    },
  });

  async function onSubmit(data: FormData) {
    await createMutation.mutateAsync({ ...data, type: "income", status: "paid" });
    onOpenChange(false);
    reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            Nova Receita
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inc-amount">Valor</Label>
            <Input id="inc-amount" type="number" step="0.01" placeholder="0,00" {...register("amount")} />
            {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="inc-desc">Descrição</Label>
            <Input id="inc-desc" placeholder="Ex: Salário, Freelance..." {...register("description")} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="inc-date">Data</Label>
            <Input id="inc-date" type="date" {...register("date")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inc-cat">Categoria</Label>
            <select id="inc-cat" {...register("categoryId")} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
              <option value="">Selecione...</option>
              {incomeCategories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="inc-acc">Conta</Label>
            <select id="inc-acc" {...register("accountId")} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
              <option value="">Selecione...</option>
              {accounts?.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
            {errors.accountId && <p className="text-sm text-destructive">{errors.accountId.message}</p>}
          </div>

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

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Adicionar Receita"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
