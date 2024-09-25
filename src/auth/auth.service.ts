import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ExpressUser } from 'src/common/types';
import { UsersService } from 'src/users/users.service';

import { SignupDto } from './dto/auth-signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async me(user: ExpressUser) {
    return this.usersService.findOne({
      id: user.id,
    });
  }

  async getUserFromToken(token: string) {
    return this.jwtService.decode(token);
  }

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne({ email });

    if (!user) {
      throw new BadRequestException({
        error: 'User does not exist',
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (isValidPassword) {
      const payload = { email: user.email, id: user.id };
      const token = await this.jwtService.signAsync(payload);

      return { token, user: user };
    } else {
      throw new UnprocessableEntityException({
        error: 'Invalid user data',
      });
    }
  }

  async signUp(loginDto: SignupDto) {
    const user = await this.usersService.findOne({ email: loginDto.email });

    if (user) {
      throw new BadRequestException({
        error: 'User exists',
      });
    }

    return await this.usersService.create(loginDto);
  }
}
