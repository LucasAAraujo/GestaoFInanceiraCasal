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
            className="bg-green-600 hover:bg-green-700"
            onClick={() => onAddTransaction("income")}
          >
            + Receita
          </Button>
          <Button
            size="sm"
            className="bg-red-600 hover:bg-red-700"
            onClick={() => onAddTransaction("expense")}
          >
            + Despesa
          </Button>
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => onAddTransaction("transfer")}
          >
            + Transferência
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
