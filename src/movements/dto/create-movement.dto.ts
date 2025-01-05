import { Decimal } from '@prisma/client/runtime/library';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsDecimal,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMovementDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  description?: string;

  @IsDecimal()
  @IsNotEmpty()
  total: Decimal;

  @IsInt()
  @IsNotEmpty()
  idCategory: number;

  @IsDateString()
  @IsNotEmpty()
  createdAt: string;

  @IsInt()
  @IsNotEmpty()
  @IsIn([1, 2])
  type: number;
}
