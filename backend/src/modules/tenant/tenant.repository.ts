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

  async getMembers(tenantId: string) {
    return this.prisma.tenantMember.findMany({
      where: { tenantId },
      include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
    });
  }

  async createInvitation(data: {
    tenantId: string;
    email: string;
    token: string;
    invitedBy: string;
    expiresAt: Date;
  }) {
    return this.prisma.invitation.create({ data });
  }

  async findInvitationByToken(token: string) {
    return this.prisma.invitation.findUnique({
      where: { token },
      include: { tenant: true },
    });
  }

  async updateInvitationStatus(id: string, status: string) {
    return this.prisma.invitation.update({
      where: { id },
      data: { status },
    });
  }

  async findPendingInvitationByEmail(tenantId: string, email: string) {
    return this.prisma.invitation.findFirst({
      where: { tenantId, email, status: 'pending' },
    });
  }
}
