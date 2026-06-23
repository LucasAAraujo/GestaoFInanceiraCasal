import { Button } from "#components/ui/button.tsx";
import type { Transaction } from "../services/transactionService.ts";

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TYPE_COLORS: Record<string, string> = {
  income: "text-green-600",
  expense: "text-red-600",
  transfer: "text-blue-600",
};

const TYPE_SIGNS: Record<string, string> = {
  income: "+",
  expense: "-",
  transfer: "",
};

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(typeof value === "string" ? parseFloat(value) : value);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

export function TransactionItem({
  transaction,
  onEdit,
  onDelete,
}: TransactionItemProps) {
  return (
    <div className="flex items-center justify-between py-3 px-4 border-b last:border-b-0">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          className="w-3 h-3 rounded-full shrink-0"
          style={{ backgroundColor: transaction.category.color }}
        />
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate">{transaction.description}</p>
          <p className="text-xs text-muted-foreground">
            {transaction.category.name} · {transaction.account.name}
            {transaction.beneficiaryScope === "individual" && " · Individual"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <p className={`font-semibold ${TYPE_COLORS[transaction.type]}`}>
            {TYPE_SIGNS[transaction.type]}
            {formatCurrency(transaction.amount)}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(transaction.date)}
          </p>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(transaction)}
          >
            Editar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(transaction.id)}
          >
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
}
