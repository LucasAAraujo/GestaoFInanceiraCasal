import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateAccountDto } from './dto/create-account.dto.js';
import { UpdateAccountDto } from './dto/update-account.dto.js';

@Injectable()
export class AccountsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.account.findMany({
      where: { tenantId, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findById(tenantId: string, id: string) {
    return this.prisma.account.findFirst({
      where: { id, tenantId },
    });
  }

  async create(tenantId: string, dto: CreateAccountDto) {
    return this.prisma.account.create({
      data: { tenantId, ...dto },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateAccountDto) {
    return this.prisma.account.updateMany({
      where: { id, tenantId },
      data: dto,
    });
  }

  async deactivate(tenantId: string, id: string) {
    return this.prisma.account.updateMany({
      where: { id, tenantId },
      data: { isActive: false },
    });
  }
}
