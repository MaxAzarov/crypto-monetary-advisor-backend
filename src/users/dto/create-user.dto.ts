import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'volodor05412@example.com' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  password?: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  firstName?: string | null;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  lastName?: string | null;

  @ApiProperty({ example: '+14842634655' })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string | null;
}
