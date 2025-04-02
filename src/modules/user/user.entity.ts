import { Column, Entity, OneToOne, VirtualColumn, ManyToOne, JoinColumn } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity.ts';
import { RoleType } from '../../constants/role-type.ts';
import { UseDto } from '../../decorators/use-dto.decorator.ts';
import type { UserDtoOptions } from './dtos/user.dto.ts';
import { UserDto } from './dtos/user.dto.ts';
import { UserSettingsEntity } from './user-settings.entity.ts';
import { Network } from '../network/entities/network.entity.ts';
import { Organization } from '../organization/entities/organization.entity.ts';


@Entity({ name: 'users' })

@UseDto(UserDto)
export class UserEntity extends AbstractEntity<UserDto, UserDtoOptions> {

  @Column({ nullable: true, type: 'varchar' })
  firstName!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  lastName!: string | null;

  @Column({ name: 'role', type: 'enum', enum: RoleType })
  role!: RoleType;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  email!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  password!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  phone!: string | null;

  @VirtualColumn({
    query: (alias) =>
      `SELECT CONCAT(${alias}.first_name, ' ', ${alias}.last_name)`,
  })
  fullName!: string;

  @OneToOne(() => UserSettingsEntity, (userSettings) => userSettings.user)
  settings?: UserSettingsEntity;

  @Column({ name: 'organization_id', nullable: true })
  organizationId?: string;
  
  @ManyToOne(() => Organization, { nullable: true })
  @JoinColumn({ name: 'organization_id' })
  organization?: Organization;
  
  @Column({ name: 'network_id', nullable: true })
  networkId?: string;
  
  @ManyToOne(() => Network, { nullable: true })
  @JoinColumn({ name: 'network_id' })
  network?: Network;



}
