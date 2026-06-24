import { useState } from "react";
import { useDashboardSummary, useDashboardCharts } from "../hooks/useDashboardData.ts";
import { SummaryCards } from "../components/SummaryCards.tsx";
import { MonthSelector } from "../components/MonthSelector.tsx";
import { RevenueExpenseChart } from "../components/RevenueExpenseChart.tsx";
import { QuickActions } from "../components/QuickActions.tsx";
import { DashboardSidebar } from "../components/DashboardSidebar.tsx";
import { IncomeForm } from "#features/transactions/components/IncomeForm.tsx";
import { ExpenseForm } from "#features/transactions/components/ExpenseForm.tsx";
import { TransferForm } from "#features/transactions/components/TransferForm.tsx";

export function DashboardPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [incomeOpen, setIncomeOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  const { data: summary, isLoading: loadingSummary } = useDashboardSummary(month, year);
  const { data: charts, isLoading: loadingCharts } = useDashboardCharts(month, year);

  function handleMonthChange(m: number, y: number) {
    setMonth(m);
    setYear(y);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <QuickActions
            onAddIncome={() => setIncomeOpen(true)}
            onAddExpense={() => setExpenseOpen(true)}
            onAddTransfer={() => setTransferOpen(true)}
          />
        </div>
        <MonthSelector month={month} year={year} onChange={handleMonthChange} />
      </div>

      {loadingSummary ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      ) : summary ? (
        <SummaryCards summary={summary} />
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          {loadingCharts ? (
            <div className="h-90 bg-muted animate-pulse rounded-xl" />
          ) : charts ? (
            <RevenueExpenseChart data={charts.monthlyTotals} />
          ) : null}
        </div>

        <DashboardSidebar />
      </div>

      <IncomeForm open={incomeOpen} onOpenChange={setIncomeOpen} />
      <ExpenseForm open={expenseOpen} onOpenChange={setExpenseOpen} />
      <TransferForm open={transferOpen} onOpenChange={setTransferOpen} />
    </div>
  );
}
