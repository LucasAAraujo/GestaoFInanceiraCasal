import { Module } from '@nestjs/common';
import { RecurringController } from './recurring.controller.js';
import { RecurringService } from './recurring.service.js';
import { RecurringRepository } from './recurring.repository.js';
import { TransactionsModule } from '../transactions/transactions.module.js';
import { CategoriesModule } from '../categories/categories.module.js';
import { AccountsModule } from '../accounts/accounts.module.js';

@Module({
  imports: [TransactionsModule, CategoriesModule, AccountsModule],
  controllers: [RecurringController],
  providers: [RecurringService, RecurringRepository],
  exports: [RecurringRepository, RecurringService],
})
export class RecurringModule {}
