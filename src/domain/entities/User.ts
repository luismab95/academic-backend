import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { AuthAttempt, BloquedUser, Certificate, Mfa, Session } from "./";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: false,
    length: 100,
  })
  email: string;

  @Column({
    unique: true,
    nullable: false,
    length: 10,
  })
  identification: string;

  @Column({ nullable: false, length: 255 })
  password: string;

  @Column({ nullable: false, length: 100 })
  name: string;

  @Column({ nullable: false, length: 100 })
  lastname: string;

  @Column({
    unique: true,
    nullable: true,
    length: 20,
  })
  phone: string;

  @Column({ nullable: false, default: true })
  status: boolean;

  @CreateDateColumn({ type: "timestamp with time zone" })
  createdAt: Date | string;

  @UpdateDateColumn({ type: "timestamp with time zone" })
  updatedAt: Date | string;

  @OneToOne(() => Mfa, (mfa) => mfa.user)
  mfas: Mfa;

  @OneToOne(() => Session, (session) => session.user)
  sessions: Session;

  @OneToOne(() => Certificate, (certificate) => certificate.user)
  certificates: Certificate;

  @OneToOne(() => AuthAttempt, (authAttempt) => authAttempt.user)
  attempts: AuthAttempt;

  @OneToOne(() => BloquedUser, (bloquedUser) => bloquedUser.user)
  bloquedUsers: BloquedUser;
}
