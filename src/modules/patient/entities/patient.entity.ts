// src/patient/entities/patient.entity.ts
import { Column, Entity, JoinColumn,ManyToOne,  CreateDateColumn, UpdateDateColumn,  VersionColumn, PrimaryColumn } from 'typeorm';
import { PatientTranslation } from './patient-translation.entity';
import { Organization } from '../../organization/entities/organization.entity';
import { Network } from '../../network/entities/network.entity';
import { UserEntity } from '../../user/user.entity';
import { PatientRegistrationStatus } from './patient-registration-status.entity';



export enum GenderIdentity {
    MALE = 'male',
    FEMALE = 'female',
    TRANSGENDER_MALE = 'transgender-male',
    TRANSGENDER_FEMALE = 'transgender-female',
    NON_BINARY = 'non-binary',
    OTHER = 'other',
    PREFER_NOT_TO_SAY = 'prefer-not-to-say'
}
  
export enum BiologicalSex {
    MALE = 'male',
    FEMALE = 'female',
    INTERSEX = 'intersex',
    UNKNOWN = 'unknown'
}

@Entity('patient')
export class Patient {


  @PrimaryColumn({ name: 'upid', type: 'varchar', length: 50}) // ✅ UPID is now the primary key
  upid!: string;

//   @Column({ name: 'network_id', type: 'uuid' })
//   networkId!: string;

  @Column({ name: 'abha', length: 50, nullable: true })
  abha?: string;

  @Column({ name: 'mrn', length: 50, nullable: true })
  mrn?: string;

  @Column({ name: 'identifier', type: 'json', nullable: true })
  identifier?: Record<string, any>;

  @Column({ name: 'name_prefix', length: 10, nullable: true })
  namePrefix?: string;

  @Column({ name: 'name_given', length: 100 })
  nameGiven!: string;

  @Column({ name: 'name_middle', length: 100, nullable: true })
  nameMiddle?: string;

  @Column({ name: 'name_family', length: 100 })
  nameFamily!: string;

  @Column({ name: 'name_suffix', length: 10, nullable: true })
  nameSuffix?: string;

  @Column({ name: 'preferred_name', length: 100, nullable: true })
  preferredName?: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate!: Date | null;

  @Column({ name: 'death_date', type: 'date', nullable: true })
  deathDate?: Date | null;

  @Column({ 
    name: 'gender_identity', 
    type: 'enum', 
    enum: GenderIdentity,
    nullable: true 
  })
  genderIdentity?: GenderIdentity;

  @Column({ 
    name: 'biological_sex', 
    type: 'enum', 
    enum: BiologicalSex,
    nullable: true 
  })
  biologicalSex?: BiologicalSex;

  @Column({ name: 'preferred_pronouns', length: 50, nullable: true })
  preferredPronouns?: string;

  @Column({ name: 'address', type: 'json', nullable: true })
  address?: Record<string, any>;

//   @ManyToOne(() => Organization, { nullable: false })
// @JoinColumn({ name: 'organization_id' })
// organization!: Organization;

  @Column({ name: 'contact', type: 'json', nullable: true })
  contact?: Record<string, any> | null;

  // New verification fields
  @Column({ name: 'phone_verified', type: 'boolean', default: false })
  phoneVerified!: boolean;

  @Column({ name: 'phone_verified_at', type: 'timestamp', nullable: true })
  phoneVerifiedAt?: Date;

  @Column({ name: 'email_verified', type: 'boolean', default: false })
  emailVerified!: boolean;

  @Column({ name: 'email_verified_at', type: 'timestamp', nullable: true })
  emailVerifiedAt?: Date;

  @Column({ name: 'preferred_language', length: 50, nullable: true })
  preferredLanguage?: string;

  @Column({ name: 'interpreter_required', type: 'boolean', default: false })
  interpreterRequired!: boolean;

  @Column({ name: 'marital_status', length: 50, nullable: true })
  maritalStatus?: string;

  @Column({ name: 'race', type: 'json', nullable: true })
  race?: Record<string, any>;

  @Column({ name: 'ethnicity', length: 50, nullable: true })
  ethnicity?: string;

  @Column({ name: 'emergency_contacts', type: 'json', nullable: true })
  emergencyContacts?: Record<string, any>;

//   @Column({ name: 'preferred_pharmacy', type: 'uuid', nullable: true })
//   preferredPharmacy?: string;

//   @Column({ name: 'primary_care_provider', type: 'uuid', nullable: true })
//   primaryCareProvider?: string;

  @Column({ name: 'active', type: 'boolean', default: true })
  active!: boolean;

  @Column({ name: 'preferences', type: 'json', nullable: true })
  preferences?: Record<string, any>;

  @Column({ name: 'blood_type', length: 10, nullable: true })
  bloodType?: string;

  @Column({ name: 'organ_donor', type: 'boolean', nullable: true })
  organDonor?: boolean;

  @Column({ name: 'advance_directives', type: 'json', nullable: true })
  advanceDirectives?: Record<string, any>;

  @Column({ name: 'status_id', type: 'int', nullable: true })
  statusId?: number;

  @Column({ name: 'created_by', type: 'uuid' })
  createdBy!: string;

  @Column({ name: 'updated_by', type: 'uuid' })
  updatedBy!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @VersionColumn({ name: 'version', default: 1 })
  version!: number;

//   @ManyToOne(() => Network, { nullable: false, eager: true }) 
//   @JoinColumn({ name: 'network_id' })
//   network!: Network;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator!: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updater!: UserEntity;

  @Column({ name: 'translations', type: 'json', nullable: true })
  translations!: PatientTranslation[];

//   @ManyToOne(() => PatientRegistrationStatus, { nullable: true })
  @JoinColumn({ name: 'status_id' })
  registrationStatus?: PatientRegistrationStatus;

//   @Column({ name: 'organization_id', type: 'uuid' })
// organizationId!: string;

@ManyToOne(() => Organization, { nullable: false })
@JoinColumn({ name: 'organization_id' })
organization!: Organization;

@ManyToOne(() => Network, { nullable: false })
@JoinColumn({ name: 'network_id' })
network!: Network;
  

} 