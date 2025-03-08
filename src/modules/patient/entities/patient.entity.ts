import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  patient_id!: string;

  @Column({ unique: true })
  upid!: string;

  @Column({ unique: true, nullable: true })
  abha_no!: string;

  @Column()
  first_name!: string;

  @Column()
  last_name!: string;

  @Column({ nullable: true })
  middle_name!: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth!: Date;

  @Column({ nullable: true })
  gender!: string;

  @Column()
  mobile_number!: string;

  @Column({ default: false })
  mobile_verified!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  address!: object;

  @Column({ default: false })
  duplicate_flag!: boolean;

  @Column({ default: 'online' })
  registration_mode!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
