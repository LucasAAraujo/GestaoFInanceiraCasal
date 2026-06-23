import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateAccountDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsIn(['checking', 'savings', 'credit_card', 'wallet', 'investment'])
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  ownerUserId?: string;
}
