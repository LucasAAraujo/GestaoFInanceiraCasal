import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { TransactionFiltersDto } from './dto/transaction-filters.dto.js';

@Injectable()
export class TransactionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string, filters: TransactionFiltersDto) {
    const where: Record<string, unknown> = { tenantId };

    if (filters.type) where.type = filters.type;
    if (filters.status) where.status = filters.status;
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.accountId) where.accountId = filters.accountId;
    if (filters.ownerUserId) where.ownerUserId = filters.ownerUserId;

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) (where.date as Record<string, unknown>).gte = new Date(filters.startDate);
      if (filters.endDate) (where.date as Record<string, unknown>).lte = new Date(filters.endDate);
    }

    if (filters.search) {
      where.description = { contains: filters.search };
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;

    const [data, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, color: true, icon: true, type: true } },
          account: { select: { id: true, name: true, type: true } },
        },
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(tenantId: string, id: string) {
    return this.prisma.transaction.findFirst({
      where: { id, tenantId },
      include: {
        category: { select: { id: true, name: true, color: true, icon: true, type: true } },
        account: { select: { id: true, name: true, type: true } },
      },
    });
  }

  async create(tenantId: string, data: Record<string, unknown>) {
    return this.prisma.transaction.create({
      data: { tenantId, ...data } as never,
      include: {
        category: { select: { id: true, name: true, color: true, icon: true, type: true } },
        account: { select: { id: true, name: true, type: true } },
      },
    });
  }

  async update(tenantId: string, id: string, data: Record<string, unknown>) {
    return this.prisma.transaction.updateMany({
      where: { id, tenantId },
      data: data as never,
    });
  }

  async delete(tenantId: string, id: string) {
    return this.prisma.transaction.deleteMany({
      where: { id, tenantId },
    });
  }
}
