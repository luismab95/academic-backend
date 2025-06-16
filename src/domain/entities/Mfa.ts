import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { OtpType } from "./Auth";
import { User } from "./User";

@Entity({ schema: "security" })
export class Mfa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 10, default: "email" })
  method: OtpType;

  @Column({ nullable: false, length: 100, })
  type: "login" | "forgot-password" | "reset-password";

  @Column({ nullable: false, length: 6 })
  otp: string;

  @Column({ nullable: false, default: true })
  active: boolean;

  @Column({ nullable: false, default: false })
  isUsed: boolean;

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: false, type: "timestamp with time zone" })
  expiratedAt: Date | string;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date | string;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date | string;

  @ManyToOne(() => User, (user) => user.mfas)
  @JoinColumn({ name: "userId" })
  user: User;
}
