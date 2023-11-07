import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import { CreateComponentDto, UpdateComponentDto } from './component.dto';
import { ComponentSchemaRegistry } from './component.registry';
import { GetManyQuery } from '../../common/dto/getMany';
import { ComponentService } from './component.service';

@Controller('components')
export class ComponentController {
  constructor(
    private readonly componentService: ComponentService,
    private readonly registry: ComponentSchemaRegistry
  ) {}

  @Get()
  async getMany(@Query() query: GetManyQuery) {
    return await this.componentService.getMany(query.take, query.cursor);
  }

  @Get(':componentId')
  async getOne(@Param('componentId', ParseUUIDPipe) componentId: string) {
    return await this.componentService.getOne(componentId);
  }

  @Post()
  async create(@Body() dto: CreateComponentDto) {
    return await this.componentService.create(dto);
  }

  @Patch(':componentId')
  async update(
    @Param('componentId', ParseUUIDPipe) componentId: string,
    @Body() dto: UpdateComponentDto
  ) {
    return await this.componentService.update(componentId, dto);
  }

  @Delete(':componentId')
  async remove(@Param('componentId', ParseUUIDPipe) componentId: string) {
    return await this.componentService.remove(componentId);
  }
  @Get('/registry')
  getRegistry() {
    return this.registry.toJSON();
  }

  @Get('/registry/:type')
  getRegistryType(@Param('type') type: string) {
    return this.registry.get(type);
  }
}
