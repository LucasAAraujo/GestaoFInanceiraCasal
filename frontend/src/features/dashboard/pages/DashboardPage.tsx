import { useState } from "react";
import { useDashboardSummary } from "../hooks/useDashboardData.ts";
import { SummaryCards } from "../components/SummaryCards.tsx";
import { MonthSelector } from "../components/MonthSelector.tsx";

export function DashboardPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { data: summary, isLoading } = useDashboardSummary(month, year);

  function handleMonthChange(m: number, y: number) {
    setMonth(m);
    setYear(y);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <MonthSelector month={month} year={year} onChange={handleMonthChange} />
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : summary ? (
        <SummaryCards summary={summary} />
      ) : null}
    </div>
  );
}
