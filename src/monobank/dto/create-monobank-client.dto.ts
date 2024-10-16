import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMonobankClientDto {
  @IsNotEmpty()
  @IsString()
  monobankKey: string;

  @IsNotEmpty()
  @IsString()
  monobankName: string;
}
