import { Card, CardContent } from "#components/ui/card.tsx";
import type { UpcomingBill } from "../services/dashboardService.ts";

interface UpcomingBillsProps {
  bills: UpcomingBill[];
}

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(typeof value === "string" ? parseFloat(value) : value);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

export function UpcomingBills({ bills }: UpcomingBillsProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Contas a Vencer</h3>
        {bills.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma conta pendente
          </p>
        ) : (
          <div className="space-y-2">
            {bills.map((bill) => (
              <div
                key={bill.id}
                className="flex items-center justify-between py-2 border-b last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: bill.category.color }}
                  />
                  <div>
                    <p className="text-sm font-medium">{bill.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(bill.date)} · {bill.account.name}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-red-600">
                  {formatCurrency(bill.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
