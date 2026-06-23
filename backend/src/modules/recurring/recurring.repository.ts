import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class RecurringRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.recurringTransaction.findMany({
      where: { tenantId, isActive: true },
      include: {
        category: { select: { id: true, name: true, color: true, icon: true } },
        account: { select: { id: true, name: true, type: true } },
      },
      orderBy: { nextDueDate: 'asc' },
    });
  }

  async findById(tenantId: string, id: string) {
    return this.prisma.recurringTransaction.findFirst({
      where: { id, tenantId },
      include: {
        category: { select: { id: true, name: true, color: true, icon: true } },
        account: { select: { id: true, name: true, type: true } },
      },
    });
  }

  async create(tenantId: string, data: Record<string, unknown>) {
    return this.prisma.recurringTransaction.create({
      data: { tenantId, ...data } as never,
      include: {
        category: { select: { id: true, name: true, color: true, icon: true } },
        account: { select: { id: true, name: true, type: true } },
      },
    });
  }

  async update(tenantId: string, id: string, data: Record<string, unknown>) {
    return this.prisma.recurringTransaction.updateMany({
      where: { id, tenantId },
      data: data as never,
    });
  }

  async deactivate(tenantId: string, id: string) {
    return this.prisma.recurringTransaction.updateMany({
      where: { id, tenantId },
      data: { isActive: false },
    });
  }

  async findDueRecurrences(tenantId: string) {
    return this.prisma.recurringTransaction.findMany({
      where: {
        tenantId,
        isActive: true,
        nextDueDate: { lte: new Date() },
      },
      include: {
        category: { select: { id: true, name: true, color: true, icon: true } },
        account: { select: { id: true, name: true, type: true } },
      },
    });
  }

  async updateNextDueDate(id: string, nextDueDate: Date) {
    return this.prisma.recurringTransaction.update({
      where: { id },
      data: { nextDueDate },
    });
  }
}
