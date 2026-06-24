import { Button } from "#components/ui/button.tsx";

interface QuickActionsProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
  onAddTransfer: () => void;
}

export function QuickActions({ onAddIncome, onAddExpense, onAddTransfer }: QuickActionsProps) {
  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        className="bg-emerald-600 hover:bg-emerald-700 shadow-sm"
        onClick={onAddIncome}
      >
        + Receita
      </Button>
      <Button
        size="sm"
        className="bg-rose-600 hover:bg-rose-700 shadow-sm"
        onClick={onAddExpense}
      >
        + Despesa
      </Button>
      <Button
        size="sm"
        className="bg-sky-600 hover:bg-sky-700 shadow-sm"
        onClick={onAddTransfer}
      >
        + Transferência
      </Button>
    </div>
  );
}
