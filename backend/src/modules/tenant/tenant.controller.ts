import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { TenantService } from './tenant.service.js';
import { CreateTenantDto } from './dto/create-tenant.dto.js';
import { InviteMemberDto } from './dto/invite-member.dto.js';
import { AcceptInviteDto } from './dto/accept-invite.dto.js';

@Controller('tenants')
@UseGuards(JwtAuthGuard)
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  async create(
    @Body() dto: CreateTenantDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.tenantService.create(dto, user.id);
  }

  @Get('me')
  async getMyTenant(@CurrentUser() user: { id: string }) {
    return this.tenantService.getMyTenant(user.id);
  }

  @Post('invite')
  async invite(
    @Body() dto: InviteMemberDto,
    @CurrentUser() user: { id: string; tenantId: string },
  ) {
    return this.tenantService.invite(dto, user.id, user.tenantId);
  }

  @Post('accept-invite')
  async acceptInvite(
    @Body() dto: AcceptInviteDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.tenantService.acceptInvite(dto.token, user.id);
  }
}
