import { useState } from "react";
import { useDashboardSummary, useDashboardCharts } from "../hooks/useDashboardData.ts";
import { SummaryCards } from "../components/SummaryCards.tsx";
import { MonthSelector } from "../components/MonthSelector.tsx";
import { RevenueExpenseChart } from "../components/RevenueExpenseChart.tsx";
import { QuickActions } from "../components/QuickActions.tsx";
import { DashboardSidebar } from "../components/DashboardSidebar.tsx";
import { DashboardExtrato } from "../components/DashboardExtrato.tsx";
import { ScopeFilter } from "../components/ScopeFilter.tsx";
import { FadeIn } from "#shared/components/FadeIn.tsx";
import { IncomeForm } from "#features/transactions/components/IncomeForm.tsx";
import { ExpenseForm } from "#features/transactions/components/ExpenseForm.tsx";
import { TransferForm } from "#features/transactions/components/TransferForm.tsx";

export function DashboardPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [scopeFilter, setScopeFilter] = useState<"all" | "shared" | "individual">("all");

  const [incomeOpen, setIncomeOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  const { data: summary, isLoading: loadingSummary, isFetching: fetchingSummary } = useDashboardSummary(month, year);
  const { data: charts, isLoading: loadingCharts, isFetching: fetchingCharts } = useDashboardCharts(month, year);

  function handleMonthChange(m: number, y: number) {
    setMonth(m);
    setYear(y);
  }

  const isRefreshing = (fetchingSummary && !loadingSummary) || (fetchingCharts && !loadingCharts);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <QuickActions
            onAddIncome={() => setIncomeOpen(true)}
            onAddExpense={() => setExpenseOpen(true)}
            onAddTransfer={() => setTransferOpen(true)}
          />
          {isRefreshing && (
            <div className="w-5 h-5 border-2 border-muted border-t-primary rounded-full animate-spin" />
          )}
        </div>
        <div className="flex items-center gap-3">
          <ScopeFilter value={scopeFilter} onChange={setScopeFilter} />
          <MonthSelector month={month} year={year} onChange={handleMonthChange} />
        </div>
      </div>

      {loadingSummary ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 skeleton rounded-xl" />
          ))}
        </div>
      ) : summary ? (
        <FadeIn>
          <div className={`transition-opacity duration-300 ${fetchingSummary ? "opacity-60" : "opacity-100"}`}>
            <SummaryCards summary={summary} />
          </div>
        </FadeIn>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          {loadingCharts ? (
            <div className="h-90 skeleton rounded-xl" />
          ) : charts ? (
            <FadeIn>
              <div className={`transition-opacity duration-300 ${fetchingCharts ? "opacity-60" : "opacity-100"}`}>
                <RevenueExpenseChart data={charts.monthlyTotals} />
              </div>
            </FadeIn>
          ) : null}

          <FadeIn delay={100}>
            <DashboardExtrato scopeFilter={scopeFilter} month={month} year={year} />
          </FadeIn>
        </div>

        <FadeIn delay={150}>
          <DashboardSidebar />
        </FadeIn>
      </div>

      <IncomeForm open={incomeOpen} onOpenChange={setIncomeOpen} />
      <ExpenseForm open={expenseOpen} onOpenChange={setExpenseOpen} />
      <TransferForm open={transferOpen} onOpenChange={setTransferOpen} />
    </div>
  );
}
