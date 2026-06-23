-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `recurring_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `recurring_transactions` (
    `id` VARCHAR(191) NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `category_id` VARCHAR(191) NOT NULL,
    `account_id` VARCHAR(191) NOT NULL,
    `frequency` VARCHAR(191) NOT NULL,
    `next_due_date` DATE NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `owner_user_id` VARCHAR(191) NULL,
    `beneficiary_scope` VARCHAR(191) NOT NULL DEFAULT 'shared',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `idx_recurring_tenant`(`tenant_id`),
    INDEX `idx_recurring_tenant_next_due`(`tenant_id`, `next_due_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_recurring_id_fkey` FOREIGN KEY (`recurring_id`) REFERENCES `recurring_transactions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recurring_transactions` ADD CONSTRAINT `recurring_transactions_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recurring_transactions` ADD CONSTRAINT `recurring_transactions_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recurring_transactions` ADD CONSTRAINT `recurring_transactions_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
