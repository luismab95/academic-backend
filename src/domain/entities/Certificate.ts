import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

export interface CertificateData extends Certificate {
  name: string;
  lastname: string;
  identification: string;
  email: string;
}

@Entity({ schema: "public" })
export class Certificate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 255 })
  code: string;

  @Column({ nullable: false, type: "text", unique: true })
  hash: string;

  @Column({ nullable: false, default: true })
  status: boolean;

  @Column({ nullable: false })
  userId: number;

  @Column({ type: "text", nullable: false })
  metadata: string;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date | string;

  @ManyToOne(() => User, (user) => user.certificates)
  @JoinColumn({ name: "userId" })
  user: User;
}
