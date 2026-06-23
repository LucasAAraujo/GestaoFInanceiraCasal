import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './dashboard.repository.js';

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async getSummary(tenantId: string, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const transactions = await this.dashboardRepository.getMonthTransactions(
      tenantId, startDate, endDate,
    );

    let totalIncome = 0;
    let totalExpense = 0;

    for (const t of transactions) {
      const val = Number(t.amount);
      if (t.type === 'income') totalIncome += val;
      else if (t.type === 'expense') totalExpense += val;
    }

    const balance = totalIncome - totalExpense;
    const recurringTotal = await this.dashboardRepository.getRecurringTotal(tenantId);
    const committedPercent = totalIncome > 0
      ? Math.round((totalExpense / totalIncome) * 100)
      : 0;
    const savings = totalIncome - totalExpense;

    return {
      totalIncome,
      totalExpense,
      balance,
      recurringTotal,
      committedPercent,
      savings,
    };
  }

  async getCharts(tenantId: string, month: number, year: number) {
    const months: { start: Date; end: Date }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(year, month - 1 - i, 1);
      months.push({
        start: new Date(d.getFullYear(), d.getMonth(), 1),
        end: new Date(d.getFullYear(), d.getMonth() + 1, 0),
      });
    }

    const monthlyTotals = await this.dashboardRepository.getMonthlyTotals(tenantId, months);

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const transactions = await this.dashboardRepository.getMonthTransactions(
      tenantId, startDate, endDate,
    );

    const categoryMap = new Map<string, { name: string; color: string; total: number }>();
    const personMap = new Map<string, number>();

    for (const t of transactions) {
      if (t.type === 'expense') {
        const val = Number(t.amount);
        const key = t.categoryId;
        const existing = categoryMap.get(key);
        if (existing) {
          existing.total += val;
        } else {
          categoryMap.set(key, {
            name: t.category.name,
            color: t.category.color,
            total: val,
          });
        }

        const personKey = t.ownerUserId ?? 'shared';
        personMap.set(personKey, (personMap.get(personKey) ?? 0) + val);
      }
    }

    const byCategory = Array.from(categoryMap.values())
      .sort((a, b) => b.total - a.total);

    const byPerson = Array.from(personMap.entries())
      .map(([userId, total]) => ({ userId, total }))
      .sort((a, b) => b.total - a.total);

    return { monthlyTotals, byCategory, byPerson };
  }

  async getUpcoming(tenantId: string) {
    return this.dashboardRepository.getUpcomingBills(tenantId, 30);
  }
}
