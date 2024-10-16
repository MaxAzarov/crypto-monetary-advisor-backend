import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class MonobankClient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  monobankKey: string;

  @Column()
  monobankName: string;

  @ManyToOne(() => User, (user) => user.monobankAccounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;
}
