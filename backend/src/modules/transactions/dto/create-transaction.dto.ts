import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsIn(['income', 'expense', 'transfer'])
  type: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  description: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  accountId: string;

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
