import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { TenantGuard } from '../../common/guards/tenant.guard.js';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator.js';
import { AccountsService } from './accounts.service.js';
import { CreateAccountDto } from './dto/create-account.dto.js';
import { UpdateAccountDto } from './dto/update-account.dto.js';

@Controller('accounts')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  async findAll(@CurrentTenant() tenantId: string) {
    return this.accountsService.findAll(tenantId);
  }

  @Post()
  async create(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateAccountDto,
  ) {
    return this.accountsService.create(tenantId, dto);
  }

  @Patch(':id')
  async update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAccountDto,
  ) {
    return this.accountsService.update(tenantId, id, dto);
  }

  @Delete(':id')
  async deactivate(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.accountsService.deactivate(tenantId, id);
  }
}
