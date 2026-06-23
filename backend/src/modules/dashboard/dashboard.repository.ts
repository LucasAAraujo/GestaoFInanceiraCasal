import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getMonthTransactions(tenantId: string, startDate: Date, endDate: Date) {
    return this.prisma.transaction.findMany({
      where: {
        tenantId,
        date: { gte: startDate, lte: endDate },
        status: { not: 'cancelled' },
      },
      include: {
        category: { select: { id: true, name: true, color: true } },
      },
    });
  }

  async getMonthlyTotals(tenantId: string, months: { start: Date; end: Date }[]) {
    const results: { month: string; income: number; expense: number }[] = [];
    for (const { start, end } of months) {
      const transactions = await this.prisma.transaction.findMany({
        where: {
          tenantId,
          date: { gte: start, lte: end },
          status: { not: 'cancelled' },
          type: { in: ['income', 'expense'] },
        },
        select: { type: true, amount: true },
      });

      let income = 0;
      let expense = 0;
      for (const t of transactions) {
        const val = Number(t.amount);
        if (t.type === 'income') income += val;
        else if (t.type === 'expense') expense += val;
      }

      results.push({
        month: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`,
        income,
        expense,
      });
    }
    return results;
  }

  async getRecurringTotal(tenantId: string) {
    const recurring = await this.prisma.recurringTransaction.findMany({
      where: { tenantId, isActive: true },
      select: { amount: true },
    });
    return recurring.reduce((sum, r) => sum + Number(r.amount), 0);
  }

  async getUpcomingBills(tenantId: string, daysAhead: number) {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + daysAhead);

    return this.prisma.transaction.findMany({
      where: {
        tenantId,
        status: 'pending',
        date: { gte: today, lte: future },
      },
      include: {
        category: { select: { id: true, name: true, color: true } },
        account: { select: { id: true, name: true } },
      },
      orderBy: { date: 'asc' },
      take: 10,
    });
  }
}
