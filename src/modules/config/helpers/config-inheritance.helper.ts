import { Injectable } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Configuration } from '../entities/config.entity';

@Injectable()
export class ConfigInheritanceHelper {
  constructor(
    @InjectRepository(Configuration)
    private configRepository: Repository<Configuration>,
  ) {}

  /**
   * Get the complete inheritance chain for a configuration
   */
  async getInheritanceChain(
    category: string,
    key: string,
    options: {
      networkId?: string;
      organizationId?: string;
      departmentId?: string;
      userId?: string;
    },
  ): Promise<Configuration[]> {
    const { networkId, organizationId, departmentId, userId } = options;
    const chain: Configuration[] = [];

    // System level (always included in the chain)
    const systemConfig = await this.configRepository.findOne({
      where: {
        category,
        key,
        networkId: IsNull(),
        organizationId: IsNull(),
        departmentId: IsNull(),
        userId: IsNull(),
        isActive: true,
      },
    });

    if (systemConfig) {
      chain.push(systemConfig);
    }

    // Network level
    if (networkId) {
      const networkConfig = await this.configRepository.findOne({
        where: {
          category,
          key,
          networkId,
          organizationId: IsNull(),
          departmentId: IsNull(),
          userId: IsNull(),
          isActive: true,
        },
      });

      if (networkConfig) {
        chain.push(networkConfig);
      }
    }

    // Organization level
    if (organizationId) {
      const orgConfig = await this.configRepository.findOne({
        where: {
          category,
          key,
          organizationId,
          departmentId: IsNull(),
          userId: IsNull(),
          isActive: true,
        },
      });

      if (orgConfig) {
        chain.push(orgConfig);
      }
    }

    // Department level
    if (departmentId) {
      const deptConfig = await this.configRepository.findOne({
        where: {
          category,
          key,
          departmentId,
          userId: IsNull(),
          isActive: true,
        },
      });

      if (deptConfig) {
        chain.push(deptConfig);
      }
    }

    // User level
    if (userId) {
      const userConfig = await this.configRepository.findOne({
        where: {
          category,
          key,
          userId,
          isActive: true,
        },
      });

      if (userConfig) {
        chain.push(userConfig);
      }
    }

    return chain;
  }

  /**
   * Mark configuration values as inherited or overridden based on parent values
   */
  processInheritanceMetadata(configs: Configuration[]): Configuration[] {
    if (configs.length <= 1) {
      return configs;
    }

    // Start from the second item in the chain
    for (let i = 1; i < configs.length; i++) {
      const current = configs[i];
      const parent = configs[i - 1];

      // Compare values to determine if overridden
      const isOverridden = current && JSON.stringify(current.value) !== JSON.stringify(parent && parent.value);
      
      // Update metadata
      if (current) {
        current.metadata = {
          ...current.metadata,
          isOverridden,
          parentValue: parent?.value,
        };
      }
    }

    return configs;
  }
}