import { BadRequestException } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ethers } from 'ethers';

@ValidatorConstraint({ async: false })
export class IsWalletAddressConstraint implements ValidatorConstraintInterface {
  validate(address: any): boolean {
    try {
      ethers.getAddress(address);
      return true;
    } catch (e) {
      throw new BadRequestException('Wallet address is invalid.');
    }
  }

  defaultMessage(): string {
    return 'Invalid wallet address format.';
  }
}

export function IsWalletAddress(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsWalletAddressConstraint,
    });
  };
}
