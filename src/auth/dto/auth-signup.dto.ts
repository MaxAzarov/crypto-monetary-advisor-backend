import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignupDto {
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
}
