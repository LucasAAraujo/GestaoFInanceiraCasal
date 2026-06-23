import { Module } from '@nestjs/common';
import { TenantController } from './tenant.controller.js';
import { TenantService } from './tenant.service.js';
import { TenantRepository } from './tenant.repository.js';

@Module({
  controllers: [TenantController],
  providers: [TenantService, TenantRepository],
  exports: [TenantRepository, TenantService],
})
export class TenantModule {}
