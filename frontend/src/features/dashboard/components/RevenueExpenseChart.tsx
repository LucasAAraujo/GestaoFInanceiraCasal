import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent } from "#components/ui/card.tsx";
import type { MonthlyTotal } from "../services/dashboardService.ts";

interface RevenueExpenseChartProps {
  data: MonthlyTotal[];
}

const MONTH_SHORT = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

function formatLabel(month: string) {
  const [, m] = month.split("-");
  return MONTH_SHORT[parseInt(m) - 1];
}

export function RevenueExpenseChart({ data }: RevenueExpenseChartProps) {
  const chartData = data.map((d) => ({
    name: formatLabel(d.month),
    Receita: d.income,
    Despesa: d.expense,
  }));

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-4">Receitas x Despesas</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value: number) =>
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(value)
              }
            />
            <Legend />
            <Bar dataKey="Receita" fill="#22C55E" />
            <Bar dataKey="Despesa" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
