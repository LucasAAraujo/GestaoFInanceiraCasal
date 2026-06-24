import { Button } from "#components/ui/button.tsx";
import { Card, CardContent } from "#components/ui/card.tsx";

interface QuickActionsProps {
  onAddTransaction: (type: string) => void;
}

export function QuickActions({ onAddTransaction }: QuickActionsProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Ações Rápidas</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 shadow-sm"
            onClick={() => onAddTransaction("income")}
          >
            + Receita
          </Button>
          <Button
            size="sm"
            className="bg-rose-600 hover:bg-rose-700 shadow-sm"
            onClick={() => onAddTransaction("expense")}
          >
            + Despesa
          </Button>
          <Button
            size="sm"
            className="bg-sky-600 hover:bg-sky-700 shadow-sm"
            onClick={() => onAddTransaction("transfer")}
          >
            + Transferência
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
