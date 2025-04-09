import { User } from "./User";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ schema: "security" })
export class AuthAttempt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: "int" })
  attempt: number;

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @Column({ nullable: false })
  userId: number;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date | string;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date | string;

  @ManyToOne(() => User, (user) => user.attempts)
  @JoinColumn({ name: "userId" })
  user: User;
}
