import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';
import { Configuration } from './entities/config.entity'; // Adjust the path as needed
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationModule } from '../organization/organization.module'; // Adjust the path as needed
import { CacheService } from '../../common/services/cache.service'; // Adjust the path as needed

@Module({
    imports: [
        TypeOrmModule.forFeature([Configuration]),
        forwardRef(() => OrganizationModule),  
      ],
  controllers: [ConfigController],
  providers: [ConfigService, CacheService],
  exports: [
    ConfigService,
    CacheService, // ✅ Export CacheService for use in other modules
    TypeOrmModule
  ],
})
export class ConfigModule {}
