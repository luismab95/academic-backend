import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Session } from "./Session";
import { User } from "./User";
import { PublicKey } from "./PublicKey";

@Entity({ schema: "security" })
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 255 })
  name: string;

  @Column({ nullable: true, length: 50 })
  type: string;

  @Column({ nullable: false, length: 255, unique: true })
  serie: string;

  @Column({ nullable: true, length: 100 })
  operationSystem: string;

  @Column({ nullable: true, length: 50 })
  version: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date | string;

  @OneToOne(() => Session, (session) => session.device)
  sessions: Session;

  @OneToOne(() => PublicKey, (publicKey) => publicKey.device)
  publicKeys: PublicKey;
}
