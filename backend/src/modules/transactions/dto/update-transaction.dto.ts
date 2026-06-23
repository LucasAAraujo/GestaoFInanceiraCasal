import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateTransactionDto {
  @IsString()
  @IsIn(['income', 'expense', 'transfer'])
  @IsOptional()
  type?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  amount?: number;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  accountId?: string;

  @IsString()
  @IsOptional()
  ownerUserId?: string;

  @IsString()
  @IsOptional()
  paidByUserId?: string;

  @IsString()
  @IsIn(['individual', 'shared'])
  @IsOptional()
  beneficiaryScope?: string;

  @IsString()
  @IsIn(['pending', 'paid', 'cancelled'])
  @IsOptional()
  status?: string;
}
