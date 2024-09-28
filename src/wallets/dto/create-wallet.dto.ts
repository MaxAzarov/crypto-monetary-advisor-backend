import { IsNotEmpty, IsString } from 'class-validator';
import { IsWalletAddress } from 'src/common/decorators/is-wallet-address';

export class CreateWalletDto {
  @IsWalletAddress()
  @IsString()
  @IsNotEmpty()
  readonly accountAddress: string;

  @IsString()
  @IsNotEmpty()
  walletName: string;
}
