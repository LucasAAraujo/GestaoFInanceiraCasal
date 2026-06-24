import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "#components/ui/card.tsx";
import type { PersonTotal } from "../services/dashboardService.ts";

interface PersonSplitChartProps {
  data: PersonTotal[];
}

export function PersonSplitChart({ data }: PersonSplitChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">Divisão por Pessoa</h3>
          <p className="text-muted-foreground text-center py-8">
            Sem dados para exibir
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((d) => ({
    name: d.userId === "shared" ? "Compartilhado" : d.userId.slice(0, 8),
    Gastos: d.total,
  }));

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-4">Divisão por Pessoa</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip
              formatter={(value: number) =>
                new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(value)
              }
            />
            <Bar dataKey="Gastos" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
