import { useState } from "react";
import { useDashboardSummary, useDashboardCharts } from "../hooks/useDashboardData.ts";
import { SummaryCards } from "../components/SummaryCards.tsx";
import { MonthSelector } from "../components/MonthSelector.tsx";
import { RevenueExpenseChart } from "../components/RevenueExpenseChart.tsx";
import { CategoryChart } from "../components/CategoryChart.tsx";
import { PersonSplitChart } from "../components/PersonSplitChart.tsx";

export function DashboardPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { data: summary, isLoading: loadingSummary } = useDashboardSummary(month, year);
  const { data: charts, isLoading: loadingCharts } = useDashboardCharts(month, year);

  function handleMonthChange(m: number, y: number) {
    setMonth(m);
    setYear(y);
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

          {charts && (
            <div className="grid gap-6 lg:grid-cols-2">
              <RevenueExpenseChart data={charts.monthlyTotals} />
              <CategoryChart data={charts.byCategory} />
              <PersonSplitChart data={charts.byPerson} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
