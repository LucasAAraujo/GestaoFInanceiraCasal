import { api } from "#shared/lib/api.ts";

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  recurringTotal: number;
  committedPercent: number;
  savings: number;
}

export interface MonthlyTotal {
  month: string;
  income: number;
  expense: number;
}

export interface CategoryTotal {
  name: string;
  color: string;
  total: number;
}

export interface PersonTotal {
  userId: string;
  total: number;
}

export interface DashboardCharts {
  monthlyTotals: MonthlyTotal[];
  byCategory: CategoryTotal[];
  byPerson: PersonTotal[];
}

export interface UpcomingBill {
  id: string;
  description: string;
  amount: string;
  date: string;
  status: string;
  category: { id: string; name: string; color: string };
  account: { id: string; name: string };
}

export async function getDashboardSummary(month: number, year: number) {
  const response = await api.get<DashboardSummary>("/dashboard/summary", {
    params: { month, year },
  });
  return response.data;
}

export async function getDashboardCharts(month: number, year: number) {
  const response = await api.get<DashboardCharts>("/dashboard/charts", {
    params: { month, year },
  });
  return response.data;
}

export async function getUpcomingBills() {
  const response = await api.get<UpcomingBill[]>("/dashboard/upcoming");
  return response.data;
}
