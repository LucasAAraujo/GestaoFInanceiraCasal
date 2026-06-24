import { useQuery } from "@tanstack/react-query";
import {
  getDashboardSummary,
  getDashboardCharts,
  getUpcomingBills,
} from "../services/dashboardService.ts";

export function useDashboardSummary(month: number, year: number) {
  return useQuery({
    queryKey: ["dashboard", "summary", month, year],
    queryFn: () => getDashboardSummary(month, year),
  });
}

export function useDashboardCharts(month: number, year: number) {
  return useQuery({
    queryKey: ["dashboard", "charts", month, year],
    queryFn: () => getDashboardCharts(month, year),
  });
}

export function useUpcomingBills() {
  return useQuery({
    queryKey: ["dashboard", "upcoming"],
    queryFn: getUpcomingBills,
  });
}
