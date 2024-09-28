import { User } from 'src/users/entities/user.entity';

export type ExpressUser = Pick<User, 'id' | 'role' | 'email'>;

export interface IJWTAuthorizedRequest extends IRequest {
  user?: {
    id: number;
    email: string;
  };
}
