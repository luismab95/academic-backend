import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ schema: "security" })
export class CertificateCodeRef {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 255, unique: true })
  code: string;

  @Column({ nullable: false, type: "text", unique: true })
  token: string;

  @Column({ nullable: false, default: true })
  status: boolean;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date | string;
}
