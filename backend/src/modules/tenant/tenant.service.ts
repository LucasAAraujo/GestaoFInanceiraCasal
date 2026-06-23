import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TenantRepository } from './tenant.repository.js';
import { CreateTenantDto } from './dto/create-tenant.dto.js';

@Injectable()
export class TenantService {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async create(dto: CreateTenantDto, userId: string) {
    const existing = await this.tenantRepository.findMemberByUserId(userId);
    if (existing) {
      throw new ConflictException('Usuário já pertence a um workspace');
    }

    const tenant = await this.tenantRepository.create(dto.name);

    await this.tenantRepository.createMember({
      tenantId: tenant.id,
      userId,
      role: 'admin',
      color: '#3B82F6',
    });

    return this.tenantRepository.findById(tenant.id);
  }

  async getMyTenant(userId: string) {
    const membership = await this.tenantRepository.findMemberByUserId(userId);
    if (!membership) {
      throw new NotFoundException('Usuário não pertence a nenhum workspace');
    }

    return this.tenantRepository.findById(membership.tenantId);
  }
}
