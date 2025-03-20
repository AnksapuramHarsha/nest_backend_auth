import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Organization } from '../../organization/entities/organization.entity'; // ✅ Ensure correct import
import { Network } from '../../network/entities/network.entity';

@Entity('configurations')
export class Configuration {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  @Index()
  category!: string;

  @Column({ length: 100 })
  @Index()
  key!: string;

  @Column({ type: 'jsonb' })
  value: any;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: {
    isOverridden?: boolean;
    parentValue?: any;
    locales?: Record<string, any>;
    description?: string;
  };

  @Column({ nullable: true })
  networkId!: string;

  @Column({ nullable: true })
  organizationId!: string;

  @Column({ nullable: true })
  departmentId!: string;

  @Column({ nullable: true })
  userId!: string;

  @Column({ default: true })
  isActive!: boolean;

  // ✅ Correct ManyToOne relationship (without forwardRef)
  @ManyToOne(() => Organization, (organization) => organization.configurations, { nullable: true })
  organization!: Promise<Organization>;

  @ManyToOne(() => Network, { nullable: true, onDelete: 'CASCADE' })
  network!: Promise<Network>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  createdBy!: string;

  @Column({ nullable: true })
  updatedBy!: string;
}
