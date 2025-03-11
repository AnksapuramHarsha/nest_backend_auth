// import { Injectable } from '@nestjs/common';
// import { CommandBus } from '@nestjs/cqrs';
// import { InjectRepository } from '@nestjs/typeorm';
// import { plainToClass } from 'class-transformer';
// import type { FindOptionsWhere } from 'typeorm';
// import { Repository } from 'typeorm';
// import { Transactional } from 'typeorm-transactional';
// import { RoleType } from 'constants/role-type.ts';
// import type { PageDto } from '../../common/dto/page.dto.ts';
// import { FileNotImageException } from '../../exceptions/file-not-image.exception.ts';
// import { UserNotFoundException } from '../../exceptions/user-not-found.exception.ts';
// import type { IFile } from '../../interfaces/IFile.ts';
// import { AwsS3Service } from '../../shared/services/aws-s3.service.ts';
// import { ValidatorService } from '../../shared/services/validator.service.ts';
// import type { Reference } from '../../types.ts';
// import { UserRegisterDto } from '../auth/dto/user-register.dto.ts';
// import { CreateSettingsCommand } from './commands/create-settings.command.ts';
// import { CreateSettingsDto } from './dtos/create-settings.dto.ts';
// import type { UserDto } from './dtos/user.dto.ts';
// import type { UsersPageOptionsDto } from './dtos/users-page-options.dto.ts';
// import { UserEntity } from './user.entity.ts';
// import type { UserSettingsEntity } from './user-settings.entity.ts';

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectRepository(UserEntity)
//     private userRepository: Repository<UserEntity>,
//     private validatorService: ValidatorService,
//     private awsS3Service: AwsS3Service,
//     private commandBus: CommandBus,
//   ) {}

//   /**
//    * Find single user
//    */
// //   findOne(findData: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
// //     return this.userRepository.findOneBy(findData);
// //   }
// async findOne(findData: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
//     return this.userRepository.findOne({
//       where: findData,
//       relations: ['role'],
//     });
//   }

// //   findByUsernameOrEmail(
// //     options: Partial<{ username: string; email: string }>,
// //   ): Promise<UserEntity | null> {
// //     const queryBuilder = this.userRepository
// //       .createQueryBuilder('user')
// //       .leftJoinAndSelect<UserEntity, 'user'>('user.settings', 'settings');

// //     if (options.email) {
// //       queryBuilder.orWhere('user.email = :email', {
// //         email: options.email,
// //       });
// //     }

// //     if (options.username) {
// //       queryBuilder.orWhere('user.username = :username', {
// //         username: options.username,
// //       });
// //     }

// //     return queryBuilder.getOne();
// //   }

// async findByUsernameOrEmail(options: Partial<{ username: string; email: string }>): Promise<UserEntity | null> {
//     const queryBuilder = this.userRepository
//       .createQueryBuilder('user')
//       .leftJoinAndSelect('user.role', 'role');

//     if (options.email) {
//       queryBuilder.orWhere('user.email = :email', { email: options.email });
//     }

//     if (options.username) {
//       queryBuilder.orWhere('user.username = :username', { username: options.username });
//     }

//     return queryBuilder.getOne();
//   }

// //   @Transactional()
// //   async createUser(
// //     userRegisterDto: UserRegisterDto,
// //     file?: Reference<IFile>,
// //   ): Promise<UserEntity> {
// //     const user = this.userRepository.create(userRegisterDto);

// //     if (file && !this.validatorService.isImage(file.mimetype)) {
// //       throw new FileNotImageException();
// //     }

// //     if (file) {
// //       user.avatar = await this.awsS3Service.uploadImage(file);
// //     }

// //     await this.userRepository.save(user);

// //     user.settings = await this.createSettings(
// //       user.id,
// //       plainToClass(CreateSettingsDto, {
// //         isEmailVerified: false,
// //         isPhoneVerified: false,
// //       }),
// //     );

// //     return user;
// //   }

// @Transactional()
//   async createUser(userRegisterDto: UserRegisterDto, role: RoleType, file?: Reference<IFile>): Promise<UserEntity> {
//     const user = this.userRepository.create(userRegisterDto);
//     user.role = role; // Assigning role to user
//     if (file && !this.validatorService.isImage(file.mimetype)) {
//         throw new FileNotImageException();
//       }
      
//       if (file) {
//         user.avatar = await this.awsS3Service.uploadImage(file);
//       }
//     await this.userRepository.save(user);

//     user.settings = await this.createSettings(user.id, plainToClass(CreateSettingsDto, {
//       isEmailVerified: false,
//       isPhoneVerified: false,
//     }));

//     return user;
//   }


// //   async getUsers(
// //     pageOptionsDto: UsersPageOptionsDto,   
// //   ): Promise<PageDto<UserDto>> {

// //     const queryBuilder = this.userRepository.createQueryBuilder('user');
// //     const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);

// //     return items.toPageDto(pageMetaDto);
// //   }
// async getUsers(pageOptionsDto: UsersPageOptionsDto): Promise<PageDto<UserDto>> {
//     // Ensure pageOptionsDto has numeric values
//     const safePageOptions = {
//       ...pageOptionsDto,
//       page: Number(pageOptionsDto.page) || 1,
//       limit: Number(pageOptionsDto.limit) || 10,
//     };
  
//     // Log the values to debug
//     console.log('Pagination parameters:', {
//       original: pageOptionsDto,
//       sanitized: safePageOptions
//     });
    
//     const queryBuilder = this.userRepository
//       .createQueryBuilder('user')
//      // .leftJoinAndSelect('user.role', 'role');
      
//     // Now use your sanitized pagination options
//     //const [users, pageMetaDto] = await queryBuilder.paginate(safePageOptions);
//     const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);
//     return items.toPageDto(pageMetaDto);
//     // Rest of your code...
//   }

//   async getUser(userId: Uuid): Promise<UserDto> {
//     const queryBuilder = this.userRepository.createQueryBuilder('user');

//     queryBuilder.where('user.id = :userId', { userId });

//     const userEntity = await queryBuilder.getOne();

//     if (!userEntity) {
//       throw new UserNotFoundException();
//     }

//     return userEntity.toDto();
//   }

//   createSettings(
//     userId: Uuid,
//     createSettingsDto: CreateSettingsDto,
//   ): Promise<UserSettingsEntity> {
//     return this.commandBus.execute<CreateSettingsCommand, UserSettingsEntity>(
//       new CreateSettingsCommand(userId, createSettingsDto),
//     );
//   }
// }
//----------------------------------------------------------------

import { Injectable, ForbiddenException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import type { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { RoleType } from '../../constants/role-type.ts';
import type { PageDto } from '../../common/dto/page.dto.ts';
import { FileNotImageException } from '../../exceptions/file-not-image.exception.ts';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception.ts';
import type { IFile } from '../../interfaces/IFile.ts';
import { AwsS3Service } from '../../shared/services/aws-s3.service.ts';
import { ValidatorService } from '../../shared/services/validator.service.ts';
import type { Reference } from '../../types.ts';
import { UserRegisterDto } from '../auth/dto/user-register.dto.ts';
import { CreateSettingsCommand } from './commands/create-settings.command.ts';
import { CreateSettingsDto } from './dtos/create-settings.dto.ts';
import type { UserDto } from './dtos/user.dto.ts';
import type { UsersPageOptionsDto } from './dtos/users-page-options.dto.ts';
import { UserEntity } from './user.entity.ts';
import type { UserSettingsEntity } from './user-settings.entity.ts';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private validatorService: ValidatorService,
    private awsS3Service: AwsS3Service,
    private commandBus: CommandBus,
  ) {}

  async findOne(findData: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: findData,
      select: ['id', 'email', 'password', 'role']  
    });
  }

  async findByUsernameOrEmail(options: Partial<{ username: string; email: string }>): Promise<UserEntity | null> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role');

    if (options.email) {
      queryBuilder.orWhere('user.email = :email', { email: options.email });
    }

    if (options.username) {
      queryBuilder.orWhere('user.username = :username', { username: options.username });
    }

    return queryBuilder.getOne();
  }

  @Transactional()
  async createUser(userRegisterDto: UserRegisterDto, role: RoleType, file?: Reference<IFile>): Promise<UserEntity> {
    const user = this.userRepository.create(userRegisterDto);
    user.role = role; 

    if (file && !this.validatorService.isImage(file.mimetype)) {
      throw new FileNotImageException();
    }

    if (file) {
      user.avatar = await this.awsS3Service.uploadImage(file);
    }

    await this.userRepository.save(user);

    user.settings = await this.createSettings(user.id, plainToClass(CreateSettingsDto, {
      isEmailVerified: false,
      isPhoneVerified: false,
    }));

    return user;
  }

  async getUsers(pageOptionsDto: UsersPageOptionsDto): Promise<PageDto<UserDto>> {
    const safePageOptions = {
      ...pageOptionsDto,
      page: Number(pageOptionsDto.page) || 1,
      limit: Number(pageOptionsDto.limit) || 10,
    };

    console.log('Pagination parameters:', {
      original: pageOptionsDto,
      sanitized: safePageOptions
    });

    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role');

    const [items, pageMetaDto] = await queryBuilder.paginate(safePageOptions);
    return items.toPageDto(pageMetaDto);
  }

  async getUser(userId: Uuid): Promise<UserDto> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.where('user.id = :userId', { userId }).leftJoinAndSelect('user.role', 'role');

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    return userEntity.toDto();
  }

  createSettings(userId: Uuid, createSettingsDto: CreateSettingsDto): Promise<UserSettingsEntity> {
    return this.commandBus.execute(new CreateSettingsCommand(userId, createSettingsDto));
  }

  async validateUserRole(userId: Uuid, roles: RoleType[]): Promise<boolean> {
    const user = await this.getUser(userId);
    if (!user.role || !roles.includes(user.role)) {
      throw new ForbiddenException(`User does not have required role`);
    }
    return true;
  }
}

