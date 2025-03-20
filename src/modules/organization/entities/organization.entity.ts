import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Network } from '../../network/entities/network.entity';
import { Configuration } from '../../config/entities/config.entity';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ nullable: true })
  networkId!: string;

  @ManyToOne(() => Network, (network) => network.organizations, { nullable: true })
  network!: Promise<Network>;

  @OneToMany(() => Configuration, (config) => config.organization)
  configurations!: Configuration[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}