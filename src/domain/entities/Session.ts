import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Device } from "./Device";

@Entity({ schema: "security" })
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 255, unique: true })
  accessToken: string;

  @Column({ nullable: false, length: 255, unique: true })
  refreshToken: string;

  @Column({ nullable: false, length: 100 })
  originIp: string;

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: false })
  deviceId: number;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date | string;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date | string;

  @Column({ nullable: false, type: "timestamp with time zone" })
  expiratedAt: Date | string;

  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Device, (device) => device.sessions)
  @JoinColumn({ name: "deviceId" })
  device: Device;
}
