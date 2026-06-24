import { useState } from "react";
import { useDashboardSummary, useDashboardCharts, useUpcomingBills } from "../hooks/useDashboardData.ts";
import { SummaryCards } from "../components/SummaryCards.tsx";
import { MonthSelector } from "../components/MonthSelector.tsx";
import { RevenueExpenseChart } from "../components/RevenueExpenseChart.tsx";
import { CategoryChart } from "../components/CategoryChart.tsx";
import { PersonSplitChart } from "../components/PersonSplitChart.tsx";
import { QuickActions } from "../components/QuickActions.tsx";
import { UpcomingBills } from "../components/UpcomingBills.tsx";
import { TransactionForm } from "#features/transactions/components/TransactionForm.tsx";

export function DashboardPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [formOpen, setFormOpen] = useState(false);
  const [defaultType, setDefaultType] = useState("expense");

  const { data: summary, isLoading: loadingSummary } = useDashboardSummary(month, year);
  const { data: charts, isLoading: loadingCharts } = useDashboardCharts(month, year);
  const { data: upcoming } = useUpcomingBills();

  function handleMonthChange(m: number, y: number) {
    setMonth(m);
    setYear(y);
  }

  function handleAddTransaction(type: string) {
    setDefaultType(type);
    setFormOpen(true);
  }

  const isLoading = loadingSummary || loadingCharts;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <MonthSelector month={month} year={year} onChange={handleMonthChange} />
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <>
          {summary && <SummaryCards summary={summary} />}

          <div className="grid gap-6 lg:grid-cols-3">
            <QuickActions onAddTransaction={handleAddTransaction} />
            <div className="lg:col-span-2">
              <UpcomingBills bills={upcoming ?? []} />
            </div>
          </div>

          {charts && (
            <div className="grid gap-6 lg:grid-cols-2">
              <RevenueExpenseChart data={charts.monthlyTotals} />
              <CategoryChart data={charts.byCategory} />
              <PersonSplitChart data={charts.byPerson} />
            </div>
          )}
        </>
      )}

      <TransactionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        defaultType={defaultType}
      />
    </div>
  );
}
