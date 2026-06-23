import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'node:crypto';
import { TenantRepository } from './tenant.repository.js';
import { UsersRepository } from '../users/users.repository.js';
import { MailService } from '../mail/mail.service.js';
import { CreateTenantDto } from './dto/create-tenant.dto.js';
import { InviteMemberDto } from './dto/invite-member.dto.js';

@Injectable()
export class TenantService {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly usersRepository: UsersRepository,
    private readonly mailService: MailService,
  ) {}

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

  async invite(dto: InviteMemberDto, userId: string, tenantId: string) {
    const memberCount = await this.tenantRepository.countMembers(tenantId);
    if (memberCount >= 2) {
      throw new BadRequestException('O workspace já possui 2 membros');
    }

    const existingInvite = await this.tenantRepository.findPendingInvitationByEmail(tenantId, dto.email);
    if (existingInvite) {
      throw new ConflictException('Já existe um convite pendente para este e-mail');
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitation = await this.tenantRepository.createInvitation({
      tenantId,
      email: dto.email,
      token,
      invitedBy: userId,
      expiresAt,
    });

    await this.mailService.sendInvitation(dto.email, token);

    return invitation;
  }

  async acceptInvite(token: string, userId: string) {
    const invitation = await this.tenantRepository.findInvitationByToken(token);
    if (!invitation || invitation.status !== 'pending') {
      throw new BadRequestException('Convite inválido ou já utilizado');
    }

    if (invitation.expiresAt < new Date()) {
      await this.tenantRepository.updateInvitationStatus(invitation.id, 'expired');
      throw new BadRequestException('Convite expirado');
    }

    const existingMembership = await this.tenantRepository.findMemberByUserId(userId);
    if (existingMembership) {
      throw new ConflictException('Usuário já pertence a um workspace');
    }

    await this.tenantRepository.createMember({
      tenantId: invitation.tenantId,
      userId,
      role: 'member',
      color: '#EF4444',
      invitedBy: invitation.invitedBy,
    });

    await this.tenantRepository.updateInvitationStatus(invitation.id, 'accepted');

    return this.tenantRepository.findById(invitation.tenantId);
  }
}
