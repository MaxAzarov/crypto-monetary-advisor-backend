import { IsWalletAddress } from '@advisor/common/decorators/is-wallet-address';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateWalletDto {
  @IsWalletAddress()
  @IsString()
  @IsNotEmpty()
  readonly accountAddress: string;

  @IsString()
  @IsNotEmpty()
  walletName: string;
}
