import { Card, CardContent } from "#components/ui/card.tsx";
import type { DashboardSummary } from "../services/dashboardService.ts";

interface SummaryCardsProps {
  summary: DashboardSummary;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

const CARDS = [
  {
    key: "totalIncome" as const,
    label: "Receita",
    color: "text-green-600",
  },
  {
    key: "totalExpense" as const,
    label: "Despesas",
    color: "text-red-600",
  },
  {
    key: "balance" as const,
    label: "Saldo",
    color: "text-blue-600",
  },
  {
    key: "recurringTotal" as const,
    label: "Recorrentes",
    color: "text-orange-600",
  },
];

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {CARDS.map((card) => (
        <Card key={card.key}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>
              {formatCurrency(summary[card.key])}
            </p>
          </CardContent>
        </Card>
      ))}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">% Comprometido</p>
          <p className="text-2xl font-bold text-purple-600">
            {summary.committedPercent}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
