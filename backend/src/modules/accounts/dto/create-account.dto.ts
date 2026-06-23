import { IsDecimal, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsIn(['checking', 'savings', 'credit_card', 'wallet', 'investment'])
  type: string;

  @IsString()
  @IsOptional()
  ownerUserId?: string;

  @IsOptional()
  initialBalance?: number;
}
