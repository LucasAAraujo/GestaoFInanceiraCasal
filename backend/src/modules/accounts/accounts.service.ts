import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountsRepository } from './accounts.repository.js';
import { CreateAccountDto } from './dto/create-account.dto.js';
import { UpdateAccountDto } from './dto/update-account.dto.js';

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  async findAll(tenantId: string) {
    return this.accountsRepository.findAll(tenantId);
  }

  async create(tenantId: string, dto: CreateAccountDto) {
    return this.accountsRepository.create(tenantId, dto);
  }

  async update(tenantId: string, id: string, dto: UpdateAccountDto) {
    const account = await this.accountsRepository.findById(tenantId, id);
    if (!account) {
      throw new NotFoundException('Conta não encontrada');
    }

    await this.accountsRepository.update(tenantId, id, dto);
    return this.accountsRepository.findById(tenantId, id);
  }

  async deactivate(tenantId: string, id: string) {
    const account = await this.accountsRepository.findById(tenantId, id);
    if (!account) {
      throw new NotFoundException('Conta não encontrada');
    }

    await this.accountsRepository.deactivate(tenantId, id);
    return { message: 'Conta desativada com sucesso' };
  }
}
