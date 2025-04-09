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
export class BloquedUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @Column({ nullable: false })
  userId: number;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date | string;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date | string;

  @Column({ type: "timestamp with time zone", nullable: false })
  expiratedAt: Date | string;

  @ManyToOne(() => User, (user) => user.bloquedUsers)
  @JoinColumn({ name: "userId" })
  user: User;
}
