import { useState } from "react";
import { Button } from "#components/ui/button.tsx";
import { Card, CardContent } from "#components/ui/card.tsx";
import { useTransactions, useDeleteTransaction } from "#features/transactions/hooks/useTransactions.ts";
import type { TransactionFilters } from "#features/transactions/services/transactionService.ts";

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(typeof value === "string" ? parseFloat(value) : value);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

interface DashboardExtratoProps {
  scopeFilter: "all" | "shared" | "individual";
  month: number;
  year: number;
}

export function DashboardExtrato({ scopeFilter, month, year }: DashboardExtratoProps) {
  const [page, setPage] = useState(1);
  const deleteMutation = useDeleteTransaction();

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = `${year}-${String(month).padStart(2, "0")}-${new Date(year, month, 0).getDate()}`;

  const filters: TransactionFilters = {
    startDate,
    endDate,
    page,
    limit: 10,
  };

  const { data, isLoading, isFetching } = useTransactions(filters);

  const transactions = (data?.data ?? []).filter((t) => {
    if (scopeFilter === "all") return true;
    return t.beneficiaryScope === scopeFilter;
  });

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Extrato do Mês
          </h3>
          {isFetching && !isLoading && (
            <div className="w-4 h-4 border-2 border-muted border-t-primary rounded-full animate-spin" />
          )}
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 skeleton rounded-lg" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhuma transação no período
          </p>
        ) : (
          <>
            <div className="divide-y divide-border">
              {transactions.map((t) => {
                const isIncome = t.type === "income";
                return (
                  <div key={t.id} className="flex items-center gap-3 py-2.5 group">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                      style={{
                        backgroundColor: t.category.color + "18",
                        color: t.category.color,
                      }}
                    >
                      {t.category.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{t.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(t.date)} · {t.category.name}
                        {t.beneficiaryScope === "individual" && " · Individual"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-sm font-semibold ${isIncome ? "text-emerald-600" : "text-rose-600"}`}>
                        {isIncome ? "+" : "-"}{formatCurrency(t.amount)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteMutation.mutate(t.id)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {(data?.totalPages ?? 1) > 1 && (
              <div className="flex items-center justify-between pt-3 mt-2 border-t">
                <p className="text-xs text-muted-foreground">{data?.total} transações</p>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    ←
                  </Button>
                  <span className="flex items-center text-xs text-muted-foreground px-2">
                    {page}/{data?.totalPages}
                  </span>
                  <Button variant="outline" size="sm" disabled={page >= (data?.totalPages ?? 1)} onClick={() => setPage((p) => p + 1)}>
                    →
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
