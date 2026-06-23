import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateRecurringDto {
  @IsString()
  @MaxLength(255)
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  accountId?: string;

  @IsString()
  @IsIn(['weekly', 'monthly', 'yearly'])
  @IsOptional()
  frequency?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  ownerUserId?: string;

  @IsString()
  @IsIn(['individual', 'shared'])
  @IsOptional()
  beneficiaryScope?: string;
}
