import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense", "transfer"]),
  amount: z.coerce.number().positive("Valor deve ser positivo"),
  description: z.string().min(1, "Descrição é obrigatória").max(255),
  notes: z.string().optional(),
  date: z.string().min(1, "Data é obrigatória"),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  accountId: z.string().min(1, "Conta é obrigatória"),
  beneficiaryScope: z.enum(["individual", "shared"]).default("shared"),
  status: z.enum(["pending", "paid", "cancelled"]).default("paid"),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
