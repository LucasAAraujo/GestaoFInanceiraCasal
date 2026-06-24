import { Button } from "#components/ui/button.tsx";
import { Card, CardContent } from "#components/ui/card.tsx";
import { useDeactivateRecurrence } from "../hooks/useRecurring.ts";
import type { RecurringTransaction } from "../services/recurringService.ts";

interface RecurringListProps {
  items: RecurringTransaction[];
  onEdit: (item: RecurringTransaction) => void;
}

const FREQUENCY_LABELS: Record<string, string> = {
  weekly: "Semanal",
  monthly: "Mensal",
  yearly: "Anual",
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

export function RecurringList({ items, onEdit }: RecurringListProps) {
  const deactivateMutation = useDeactivateRecurrence();

  if (items.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        Nenhuma recorrência cadastrada.
      </p>
    );
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item.category.color }}
              />
              <div>
                <p className="font-medium">{item.description}</p>
                <p className="text-sm text-muted-foreground">
                  {item.category.name} · {item.account.name} ·{" "}
                  {FREQUENCY_LABELS[item.frequency]}
                </p>
                <p className="text-xs text-muted-foreground">
                  Próxima cobrança: {formatDate(item.nextDueDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-semibold text-rose-600">
                {formatCurrency(item.amount)}
              </p>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(item)}
                >
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deactivateMutation.mutate(item.id)}
                  disabled={deactivateMutation.isPending}
                >
                  Encerrar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
