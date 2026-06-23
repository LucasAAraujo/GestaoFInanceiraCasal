import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RecurringRepository } from './recurring.repository.js';
import { TransactionsRepository } from '../transactions/transactions.repository.js';
import { CategoriesRepository } from '../categories/categories.repository.js';
import { AccountsRepository } from '../accounts/accounts.repository.js';
import { CreateRecurringDto } from './dto/create-recurring.dto.js';
import { UpdateRecurringDto } from './dto/update-recurring.dto.js';

@Injectable()
export class RecurringService {
  constructor(
    private readonly recurringRepository: RecurringRepository,
    private readonly transactionsRepository: TransactionsRepository,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly accountsRepository: AccountsRepository,
  ) {}

  async findAll(tenantId: string) {
    return this.recurringRepository.findAll(tenantId);
  }

  async create(tenantId: string, dto: CreateRecurringDto) {
    const category = await this.categoriesRepository.findById(tenantId, dto.categoryId);
    if (!category) {
      throw new BadRequestException('Categoria não pertence ao workspace');
    }

    const account = await this.accountsRepository.findById(tenantId, dto.accountId);
    if (!account) {
      throw new BadRequestException('Conta não pertence ao workspace');
    }

    const startDate = new Date(dto.startDate);

    return this.recurringRepository.create(tenantId, {
      description: dto.description,
      amount: dto.amount,
      categoryId: dto.categoryId,
      accountId: dto.accountId,
      frequency: dto.frequency,
      startDate,
      nextDueDate: startDate,
      endDate: dto.endDate ? new Date(dto.endDate) : null,
      ownerUserId: dto.ownerUserId,
      beneficiaryScope: dto.beneficiaryScope ?? 'shared',
    });
  }

  async update(tenantId: string, id: string, dto: UpdateRecurringDto) {
    const recurring = await this.recurringRepository.findById(tenantId, id);
    if (!recurring) {
      throw new NotFoundException('Recorrência não encontrada');
    }

    const data: Record<string, unknown> = { ...dto };
    if (dto.endDate) data.endDate = new Date(dto.endDate);

    await this.recurringRepository.update(tenantId, id, data);
    return this.recurringRepository.findById(tenantId, id);
  }

  async deactivate(tenantId: string, id: string) {
    const recurring = await this.recurringRepository.findById(tenantId, id);
    if (!recurring) {
      throw new NotFoundException('Recorrência não encontrada');
    }

    await this.recurringRepository.deactivate(tenantId, id);
    return { message: 'Recorrência encerrada com sucesso' };
  }

  async generateOccurrences(tenantId: string) {
    const dueRecurrences = await this.recurringRepository.findDueRecurrences(tenantId);
    let generated = 0;

    for (const rec of dueRecurrences) {
      await this.transactionsRepository.create(tenantId, {
        type: 'expense',
        amount: rec.amount,
        description: rec.description,
        date: rec.nextDueDate,
        categoryId: rec.categoryId,
        accountId: rec.accountId,
        ownerUserId: rec.ownerUserId,
        beneficiaryScope: rec.beneficiaryScope,
        status: 'pending',
        recurringId: rec.id,
      });

      const nextDate = this.calculateNextDate(rec.nextDueDate, rec.frequency);

      if (rec.endDate && nextDate > rec.endDate) {
        await this.recurringRepository.deactivate(tenantId, rec.id);
      } else {
        await this.recurringRepository.updateNextDueDate(rec.id, nextDate);
      }

      generated++;
    }

    return { generated };
  }

  private calculateNextDate(current: Date, frequency: string): Date {
    const next = new Date(current);
    switch (frequency) {
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'yearly':
        next.setFullYear(next.getFullYear() + 1);
        break;
    }
    return next;
  }
}
