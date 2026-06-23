import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class TenantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(name: string) {
    return this.prisma.tenant.create({ data: { name } });
  }

  async findById(id: string) {
    return this.prisma.tenant.findUnique({
      where: { id },
      include: { members: { include: { user: true } } },
    });
  }

  async createMember(data: {
    tenantId: string;
    userId: string;
    role: string;
    color?: string;
    invitedBy?: string;
  }) {
    return this.prisma.tenantMember.create({ data });
  }

  async findMemberByUserId(userId: string) {
    return this.prisma.tenantMember.findFirst({
      where: { userId },
      include: { tenant: true },
    });
  }

  async countMembers(tenantId: string) {
    return this.prisma.tenantMember.count({ where: { tenantId } });
  }
}
