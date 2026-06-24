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
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    key: "totalExpense" as const,
    label: "Despesas",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
  },
  {
    key: "balance" as const,
    label: "Saldo",
    color: "text-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-200",
  },
  {
    key: "recurringTotal" as const,
    label: "Recorrentes",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
];

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {CARDS.map((card) => (
        <Card key={card.key} className={`${card.border} border`}>
          <CardContent className={`p-4 rounded-xl ${card.bg}`}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{card.label}</p>
            <p className={`text-2xl font-bold mt-1 ${card.color}`}>
              {formatCurrency(summary[card.key])}
            </p>
          </CardContent>
        </Card>
      ))}
      <Card className="border-violet-200 border">
        <CardContent className="p-4 rounded-xl bg-violet-50">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">% Comprometido</p>
          <p className="text-2xl font-bold mt-1 text-violet-600">
            {summary.committedPercent}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
