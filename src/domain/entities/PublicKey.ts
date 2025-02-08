import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Device } from "./Device";

@Entity({ schema: "security" })
export class PublicKey {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false, type: "text", unique: true })
  publicKey: string;

  @Column({ nullable: false })
  deviceId: number;

  @Column({ nullable: false, type: "text", unique: true })
  hash: string;

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date | string;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date | string;

  @ManyToOne(() => Device, (device) => device.publicKeys)
  @JoinColumn({ name: "deviceId" })
  device: Device;
}
