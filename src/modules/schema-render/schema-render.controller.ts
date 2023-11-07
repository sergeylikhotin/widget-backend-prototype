import { Controller, Get, Param } from '@nestjs/common';
import { SchemaRenderService } from './schema-render.service';

@Controller()
export class SchemaRenderController {
  constructor(private readonly schemaRenderService: SchemaRenderService) {}

  @Get('schema/:schemaName')
  getSchema(@Param('schemaName') schemaName: string) {
    return this.schemaRenderService.getSchema(schemaName);
  }
}
