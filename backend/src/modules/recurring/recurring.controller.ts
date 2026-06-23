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
import { RecurringService } from './recurring.service.js';
import { CreateRecurringDto } from './dto/create-recurring.dto.js';
import { UpdateRecurringDto } from './dto/update-recurring.dto.js';

@Controller('recurring')
@UseGuards(JwtAuthGuard, TenantGuard)
export class RecurringController {
  constructor(private readonly recurringService: RecurringService) {}

  @Get()
  async findAll(@CurrentTenant() tenantId: string) {
    return this.recurringService.findAll(tenantId);
  }

  @Post()
  async create(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateRecurringDto,
  ) {
    return this.recurringService.create(tenantId, dto);
  }

  @Post('generate')
  async generate(@CurrentTenant() tenantId: string) {
    return this.recurringService.generateOccurrences(tenantId);
  }

  @Patch(':id')
  async update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateRecurringDto,
  ) {
    return this.recurringService.update(tenantId, id, dto);
  }

  @Delete(':id')
  async deactivate(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.recurringService.deactivate(tenantId, id);
  }
}
