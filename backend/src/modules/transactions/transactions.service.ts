import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionsRepository } from './transactions.repository.js';
import { CategoriesRepository } from '../categories/categories.repository.js';
import { AccountsRepository } from '../accounts/accounts.repository.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { UpdateTransactionDto } from './dto/update-transaction.dto.js';
import { TransactionFiltersDto } from './dto/transaction-filters.dto.js';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly accountsRepository: AccountsRepository,
  ) {}

  async findAll(tenantId: string, filters: TransactionFiltersDto) {
    return this.transactionsRepository.findAll(tenantId, filters);
  }

  async create(tenantId: string, dto: CreateTransactionDto) {
    const category = await this.categoriesRepository.findById(tenantId, dto.categoryId);
    if (!category) {
      throw new BadRequestException('Categoria não pertence ao workspace');
    }

    const account = await this.accountsRepository.findById(tenantId, dto.accountId);
    if (!account) {
      throw new BadRequestException('Conta não pertence ao workspace');
    }

    return this.transactionsRepository.create(tenantId, {
      type: dto.type,
      amount: dto.amount,
      description: dto.description,
      notes: dto.notes,
      date: new Date(dto.date),
      categoryId: dto.categoryId,
      accountId: dto.accountId,
      ownerUserId: dto.ownerUserId,
      paidByUserId: dto.paidByUserId,
      beneficiaryScope: dto.beneficiaryScope ?? 'shared',
      status: dto.status ?? 'paid',
    });
  }

  async update(tenantId: string, id: string, dto: UpdateTransactionDto) {
    const transaction = await this.transactionsRepository.findById(tenantId, id);
    if (!transaction) {
      throw new NotFoundException('Transação não encontrada');
    }

    if (dto.categoryId) {
      const category = await this.categoriesRepository.findById(tenantId, dto.categoryId);
      if (!category) {
        throw new BadRequestException('Categoria não pertence ao workspace');
      }
    }

    if (dto.accountId) {
      const account = await this.accountsRepository.findById(tenantId, dto.accountId);
      if (!account) {
        throw new BadRequestException('Conta não pertence ao workspace');
      }
    }

    const data: Record<string, unknown> = { ...dto };
    if (dto.date) data.date = new Date(dto.date);

    await this.transactionsRepository.update(tenantId, id, data);
    return this.transactionsRepository.findById(tenantId, id);
  }

  async delete(tenantId: string, id: string) {
    const transaction = await this.transactionsRepository.findById(tenantId, id);
    if (!transaction) {
      throw new NotFoundException('Transação não encontrada');
    }

    await this.transactionsRepository.delete(tenantId, id);
    return { message: 'Transação removida com sucesso' };
  }
}
