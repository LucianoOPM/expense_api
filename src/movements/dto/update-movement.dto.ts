import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateMovementDto } from './create-movement.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateMovementDto extends PartialType(
  OmitType(CreateMovementDto, ['createdAt']),
) {
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
