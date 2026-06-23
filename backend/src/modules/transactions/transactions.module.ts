import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller.js';
import { TransactionsService } from './transactions.service.js';
import { TransactionsRepository } from './transactions.repository.js';
import { CategoriesModule } from '../categories/categories.module.js';
import { AccountsModule } from '../accounts/accounts.module.js';

@Module({
  imports: [CategoriesModule, AccountsModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, TransactionsRepository],
  exports: [TransactionsRepository, TransactionsService],
})
export class TransactionsModule {}
