import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

const regExpPassword =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,50}$/;

export class CreateUserDto {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsString({ message: 'Email must be a string' })
  email: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(50, { message: 'Password must not exceed 50 characters' })
  @Matches(regExpPassword, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;
}

export class UpdateUserDto {
  @IsString({ message: 'Name must be a string' })
  @Transform(({ value }) => value.trim())
  @IsOptional()
  name?: string;

  @IsString({ message: 'Password must be a string' })
  @Transform(({ value }) => value.trim())
  @IsOptional()
  password?: string;

  @IsBoolean()
  @IsOptional()
  estatus?: boolean;
}

export class QueryUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsOptional()
  name?: string;

  @IsNotEmpty()
  @IsEnum(['1', '0', 'true', 'false'], {
    message: 'Status should be a 0, 1, true, false value',
  })
  @IsOptional()
  status?: string;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsOptional()
  email?: string;

  @Transform(({ value }) => value.toLowerCase())
  @IsString()
  @IsEnum(['asc', 'desc'], { message: 'Order must be ASC or DESC' })
  @IsOptional()
  order?: string;

  @IsString()
  @IsEnum(['name', 'email'])
  @Transform(({ value }) => value.toLowerCase())
  @IsOptional()
  orderBy?: string;

  @IsNumberString()
  @IsOptional()
  page?: string;

  @IsNumberString()
  @IsOptional()
  limit?: string;
}

export class SingleQueryDto {
  @IsNotEmpty()
  @IsEnum(['1', '0', 'true', 'false'], {
    message: 'Expenses value should be a 0, 1, true, false value',
  })
  @IsOptional()
  expenses?: string;
  @IsNotEmpty()
  @IsEnum(['1', '0', 'true', 'false'], {
    message: 'Earning value should be a 0, 1, true, false value',
  })
  @IsOptional()
  earnings?: string;
}
