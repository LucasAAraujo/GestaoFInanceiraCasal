import { Module } from '@nestjs/common';
import { TenantController } from './tenant.controller.js';
import { TenantService } from './tenant.service.js';
import { TenantRepository } from './tenant.repository.js';
import { UsersModule } from '../users/users.module.js';
import { CategoriesModule } from '../categories/categories.module.js';
import { MailModule } from '../mail/mail.module.js';

@Module({
  imports: [UsersModule, CategoriesModule, MailModule],
  controllers: [TenantController],
  providers: [TenantService, TenantRepository],
  exports: [TenantRepository, TenantService],
})
export class TenantModule {}
