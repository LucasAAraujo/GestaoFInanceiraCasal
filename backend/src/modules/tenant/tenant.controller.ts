import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { TenantService } from './tenant.service.js';
import { CreateTenantDto } from './dto/create-tenant.dto.js';

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
}
