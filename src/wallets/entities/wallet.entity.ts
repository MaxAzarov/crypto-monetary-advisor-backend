import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 42 })
  accountAddress: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ nullable: false })
  walletName: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.wallets)
  user: User;
}
