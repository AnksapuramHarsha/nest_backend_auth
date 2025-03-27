// src/patient/entities/patient-registration-status.entity.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Patient } from './patient.entity';

@Entity('patient_registration_status')
export class PatientRegistrationStatus {
  @PrimaryGeneratedColumn('increment')
  statusId!: number;

  @Column({ name: 'status_code', length: 50, unique: true })
  statusCode!: string;

  @Column({ name: 'status_name', length: 100 })
  statusName!: string;

  @Column({ name: 'status_description', type: 'text', nullable: true })
  statusDescription?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => Patient, patient => patient.registrationStatus)
  patients?: Patient[];
}
