import { Controller, Get, Post, Body, Put, Param, Delete, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from './config.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { QueryConfigDto } from './dto/query-config.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
// import { Roles } from '../../decorators/roles.decorator';
import type { RequestWithUser } from '../../interfaces/request-with-user.interface';

@ApiTags('Config') // ✅ Add API tag for Swagger grouping
@ApiBearerAuth()
@Controller('api/v1/config')
@UseGuards(JwtAuthGuard)
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Post()
//   @Roles(['ADMIN'])
  @ApiOperation({ summary: 'Create a new configuration setting' }) // ✅ Add operation summary
  @ApiBody({ type: CreateConfigDto }) // ✅ Define request body
  @ApiResponse({
    status: 201,
    description: 'Successfully created configuration',
    schema: {
      example: {
        message: 'Configuration created successfully',
        data: {
          category: 'system',
          key: 'theme',
          value: 'dark',
          metadata: {
            isOverridden: true,
            parentValue: 'light',
            locales: { en: 'Dark Mode', fr: 'Mode Sombre' },
            description: 'Theme setting for UI',
          },
        },
      },
    },
  })
  async create(@Body() createConfigDto: CreateConfigDto, @Req() req: RequestWithUser) {
    return this.configService.create(createConfigDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all configurations' })
  @ApiResponse({
    status: 200,
    description: 'List of configurations',
    schema: {
      example: [
        {
          category: 'system',
          key: 'theme',
          value: 'dark',
          metadata: {
            isOverridden: true,
            parentValue: 'light',
            locales: { en: 'Dark Mode', fr: 'Mode Sombre' },
            description: 'Theme setting for UI',
          },
        },
      ],
    },
  })
  async findAll(@Query() queryDto: QueryConfigDto) {
    return this.configService.findAll(queryDto);
  }

  @Get(':category')
  @ApiOperation({ summary: 'Find configurations by category' })
  async findByCategory(@Param('category') category: string, @Query() queryDto: QueryConfigDto) {
    return this.configService.findAll({ ...queryDto, category });
  }

  @Get(':category/:key')
  @ApiOperation({ summary: 'Retrieve a single configuration by category and key' })
  async findOne(
    @Param('category') category: string,
    @Param('key') key: string,
    @Query() queryDto: QueryConfigDto,
  ) {
    return this.configService.findOne(category, key, queryDto);
  }

  @Put(':category/:key')
//   @Roles(['admin', 'config-manager'])
  @ApiOperation({ summary: 'Update a configuration setting' })
  @ApiBody({ type: UpdateConfigDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated configuration',
    schema: {
      example: {
        message: 'Configuration updated successfully',
        data: {
          category: 'system',
          key: 'theme',
          value: 'light',
          metadata: {
            isOverridden: false,
            parentValue: 'dark',
            locales: { en: 'Light Mode', fr: 'Mode Lumière' },
            description: 'Updated theme setting',
          },
        },
      },
    },
  })
  async update(
    @Param('category') category: string,
    @Param('key') key: string,
    @Body() updateConfigDto: UpdateConfigDto,
    @Query() queryDto: QueryConfigDto,
    @Req() req: RequestWithUser,
  ) {
    return this.configService.update(category, key, updateConfigDto, queryDto, req.user.id);
  }

  @Delete(':category/:key')
//   @Roles(['admin', 'config-manager'])
  @ApiOperation({ summary: 'Delete a configuration setting' })
  @ApiResponse({ status: 200, description: 'Configuration deleted successfully' })
  async remove(@Param('category') category: string, @Param('key') key: string, @Query() queryDto: QueryConfigDto) {
    return this.configService.remove(category, key, queryDto);
  }

  @Post(':category/:key/reset')
//   @Roles(['admin', 'config-manager'])
  @ApiOperation({ summary: 'Reset configuration to parent value' })
  @ApiResponse({
    status: 200,
    description: 'Configuration reset to parent value successfully',
    schema: {
      example: {
        message: 'Configuration reset to parent value successfully',
        data: {
          category: 'system',
          key: 'theme',
          value: 'light', // Parent value restored
          metadata: {
            isOverridden: false,
            parentValue: 'dark',
            locales: { en: 'Light Mode', fr: 'Mode Lumière' },
            description: 'Reverted theme setting to parent value',
          },
        },
      },
    },
  })
  async resetToParent(
    @Param('category') category: string,
    @Param('key') key: string,
    @Query() queryDto: QueryConfigDto,
    @Req() req: RequestWithUser,
  ) {
    return this.configService.resetToParent(category, key, queryDto, req.user.id);
  }

  @Post('upid/update')
  @ApiOperation({ summary: 'Update UPID format', description: 'Admin selects components for UPID generation' })
  @ApiResponse({ status: 200, description: 'UPID format updated successfully' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        format: { type: 'string', example: 'PAT-${ORG}-${NET}-${USER}-${UNIQUE}' },
        components: {
          type: 'array',
          items: { type: 'string' },
          example: ["ORG", "NET", "USER", "UNIQUE"]
        }
      },
    },
  })
  async updateUPIDFormat(
    @Body('format') format: string,
    @Body('components') components: string[]
  ) {
    return this.configService.updateUPIDFormat(format, components);
  }

  /**
   * ✅ Get UPID format
   */
  @Get('upid')
  @ApiOperation({ summary: 'Get UPID format', description: 'Retrieve the UPID format configuration' })
  @ApiResponse({ status: 200, description: 'UPID format retrieved successfully' })
  async getUPIDFormat() {
    return this.configService.getUPIDFormat();
  }

}
