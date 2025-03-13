import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Patient } from './patient.entity';


@Entity()
export class PatientTranslation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  language!: string;

  
  @ManyToOne(() => Patient, (patient) => patient.translations, { onDelete: 'CASCADE' })  
  patient!: Patient;

  @Column()
  nameGiven!: string;

  @Column()
  nameFamily!: string;

  @Column()
  preferredName!: string;
}


