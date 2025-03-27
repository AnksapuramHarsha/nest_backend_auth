import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Configuration } from './entities/config.entity';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { QueryConfigDto } from './dto/query-config.dto';
import { CacheService } from '../../common/services/cache.service';

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(Configuration)
    private configRepository: Repository<Configuration>,
    private cacheService: CacheService,
  ) {}

  private getCacheKey(category: string, key?: string, tenantInfo?: any): string {
    const parts = ['config', category];
    if (key) parts.push(key);
    if (tenantInfo) {
      if (tenantInfo.networkId) parts.push(`network:${tenantInfo.networkId}`);
      if (tenantInfo.organizationId) parts.push(`org:${tenantInfo.organizationId}`);
      if (tenantInfo.departmentId) parts.push(`dept:${tenantInfo.departmentId}`);
      if (tenantInfo.userId) parts.push(`user:${tenantInfo.userId}`);
    }
    return parts.join(':');
  }

  async getUPIDFormat() {
    const config = await this.configRepository.findOne({ where: { category: 'upid', key: 'format' } });
    return config ? config.value : { format: '', components: [] };
  }

  
  async updateUPIDFormat(format: string, components: string[]) {
    let config = await this.configRepository.findOne({ where: { category: 'upid', key: 'format' } });

    if (!config) {
      config = new Configuration();
      config.category = 'upid';
      config.key = 'format';
    }

    config.value = { format, components, uniqueCounter: config.value?.uniqueCounter || 1 };
    await this.configRepository.save(config);

    return { message: 'UPID format updated successfully', format, components };
  }

  async create(createConfigDto: CreateConfigDto, userId: string): Promise<Configuration> {
    // Check if configuration already exists
    const existing = await this.configRepository.findOne({
      where: {
        category: createConfigDto.category,
        key: createConfigDto.key,
        networkId: createConfigDto.networkId,
        organizationId: createConfigDto.organizationId,
        departmentId: createConfigDto.departmentId,
        userId: createConfigDto.userId,
      },
    });

    if (existing) {
      throw new ConflictException('Configuration already exists');
    }

    // Handle parent value for override tracking
    let metadata = createConfigDto.metadata || {};
    if (
      createConfigDto.networkId ||
      createConfigDto.organizationId ||
      createConfigDto.departmentId || 
      createConfigDto.userId
    ) {
      const parentConfig = await this.findParentConfig(createConfigDto);
      if (parentConfig) {
        metadata.isOverridden = true;
        metadata.parentValue = parentConfig.value;
      }
    }

    const config = this.configRepository.create({
      ...createConfigDto,
      metadata,
      createdBy: userId,
      updatedBy: userId,
    });

    const savedConfig = await this.configRepository.save(config);
    await this.invalidateCache(savedConfig);
    return savedConfig;
  }

  async findAll(queryDto: QueryConfigDto): Promise<Configuration[]> {
    const cacheKey = this.getCacheKey(
      queryDto.category || 'all',
      undefined,
      {
        networkId: queryDto.networkId,
        organizationId: queryDto.organizationId,
        departmentId: queryDto.departmentId,
        userId: queryDto.userId,
      },
    );

    const cachedData = await this.cacheService.get<Configuration[]>(cacheKey);
    if (cachedData) return cachedData;

    const where: FindOptionsWhere<Configuration> = {};
    if (queryDto.category) where.category = queryDto.category;
    if (queryDto.key) where.key = queryDto.key;
    if (queryDto.networkId) where.networkId = queryDto.networkId;
    if (queryDto.organizationId) where.organizationId = queryDto.organizationId;
    if (queryDto.departmentId) where.departmentId = queryDto.departmentId;
    if (queryDto.userId) where.userId = queryDto.userId;
    if (!queryDto.includeInactive) where.isActive = true;

    const configs = await this.configRepository.find({ where });
    
    // Apply locale filtering if requested
    if (queryDto.locale && configs.length > 0) {
      configs.forEach(config => {
        if (queryDto.locale && config.metadata?.locales?.[queryDto.locale]) {
          config.value = config.metadata.locales[queryDto.locale];
        }
      });
    }

    await this.cacheService.set(cacheKey, configs, 3600); // Cache for 1 hour
    return configs;
  }

  async findOne(category: string, key: string, queryDto: QueryConfigDto): Promise<Configuration> {
    const cacheKey = this.getCacheKey(
      category,
      key,
      {
        networkId: queryDto.networkId,
        organizationId: queryDto.organizationId,
        departmentId: queryDto.departmentId,
        userId: queryDto.userId,
      },
    );

    const cachedData = await this.cacheService.get<Configuration>(cacheKey);
    if (cachedData) return cachedData;

    // Start with the most specific configuration level
    let config: Configuration | null = null;

    // Try to find the most specific configuration based on the hierarchy
    if (queryDto.userId) {
      config = await this.configRepository.findOne({
        where: {
          category,
          key,
          userId: queryDto.userId,
          isActive: true,
        },
      });
    }

    if (!config && queryDto.departmentId) {
      config = await this.configRepository.findOne({
        where: {
          category,
          key,
          departmentId: queryDto.departmentId,
          isActive: true,
        },
      });
    }

    if (!config && queryDto.organizationId) {
      config = await this.configRepository.findOne({
        where: {
          category,
          key,
          organizationId: queryDto.organizationId,
          isActive: true,
        },
      });
    }

    if (!config && queryDto.networkId) {
      config = await this.configRepository.findOne({
        where: {
          category,
          key,
          networkId: queryDto.networkId,
          isActive: true,
        },
      });
    }

    // If still not found, try to find system-level configuration
    if (!config) {
      config = await this.configRepository.findOne({
        where: {
          category,
          key,
          networkId: undefined,
          organizationId: undefined,
          departmentId: undefined,
          userId: undefined,
          isActive: true,
        },
      });
    }

    if (!config) {
      throw new NotFoundException(`Configuration not found for ${category}.${key}`);
    }

    // Apply locale filtering if requested
    if (queryDto.locale && config.metadata?.locales?.[queryDto.locale]) {
      config.value = config.metadata.locales[queryDto.locale];
    }

    await this.cacheService.set(cacheKey, config, 3600); // Cache for 1 hour
    return config;
  }

  async update(
    category: string,
    key: string,
    updateConfigDto: UpdateConfigDto,
    queryDto: QueryConfigDto,
    userId: string,
  ): Promise<Configuration> {
    const config = await this.findOne(category, key, queryDto);

    // Handle parent value for override tracking
    let metadata = { ...config.metadata, ...updateConfigDto.metadata };
    if (
      config.networkId ||
      config.organizationId ||
      config.departmentId ||
      config.userId
    ) {
      const parentConfig = await this.findParentConfig({
        category,
        key,
        networkId: config.networkId,
        organizationId: config.organizationId,
        departmentId: config.departmentId,
        userId: config.userId,
      });
      
      if (parentConfig) {
        metadata.isOverridden = true;
        metadata.parentValue = parentConfig.value;
      }
    }

    const updated = await this.configRepository.save({
      ...config,
      ...updateConfigDto,
      metadata,
      updatedBy: userId,
    });

    await this.invalidateCache(updated);
    return updated;
  }

  async remove(
    category: string,
    key: string,
    queryDto: QueryConfigDto,
  ): Promise<void> {
    const config = await this.findOne(category, key, queryDto);
    await this.configRepository.remove(config);
    await this.invalidateCache(config);
  }

  async resetToParent(
    category: string,
    key: string,
    queryDto: QueryConfigDto,
    userId: string,
  ): Promise<Configuration> {
    const config = await this.findOne(category, key, queryDto);
    
    if (!config.metadata?.isOverridden) {
      throw new NotFoundException('No parent configuration to reset to');
    }

    const parentConfig = await this.findParentConfig({
      category,
      key,
      networkId: config.networkId,
      organizationId: config.organizationId,
      departmentId: config.departmentId,
      userId: config.userId,
    });

    if (!parentConfig) {
      throw new NotFoundException('Parent configuration not found');
    }

    const metadata = { ...config.metadata };
    delete metadata.isOverridden;
    delete metadata.parentValue;

    const updated = await this.configRepository.save({
      ...config,
      value: parentConfig.value,
      metadata,
      updatedBy: userId,
    });

    await this.invalidateCache(updated);
    return updated;
  }

  private async findParentConfig(configInfo: {
    category: string;
    key: string;
    networkId?: string;
    organizationId?: string;
    departmentId?: string;
    userId?: string;
  }): Promise<Configuration | null> {
    const { category, key, networkId, organizationId, departmentId, userId } = configInfo;
    
    // User -> Department -> Organization -> Network -> System
    let parentConfig: Configuration | null = null;

    if (userId) {
      parentConfig = await this.configRepository.findOne({
        where: {
          category,
          key,
          departmentId,
          userId: undefined,
          isActive: true,
        },
      });
      if (parentConfig) return parentConfig;
    }

    if (departmentId) {
      parentConfig = await this.configRepository.findOne({
        where: {
          category,
          key,
          organizationId,
          departmentId: undefined,
          isActive: true,
        },
      });
      if (parentConfig) return parentConfig;
    }

    if (organizationId) {
      parentConfig = await this.configRepository.findOne({
        where: {
          category,
          key,
          networkId,
          organizationId: undefined,
          isActive: true,
        },
      });
      if (parentConfig) return parentConfig;
    }

    if (networkId) {
      parentConfig = await this.configRepository.findOne({
        where: {
          category,
          key,
          networkId: undefined,
          organizationId: undefined,
          departmentId: undefined,
          userId: undefined,
          isActive: true,
        },
      });
    }

    return parentConfig;
  }

  private async invalidateCache(config: Configuration): Promise<void> {
    const cachePatterns = [
      `config:${config.category}:${config.key}:*`,
      `config:${config.category}:*`,
      `config:all:*`,
    ];

    for (const pattern of cachePatterns) {
      await this.cacheService.deletePattern(pattern);
    }
  }
}