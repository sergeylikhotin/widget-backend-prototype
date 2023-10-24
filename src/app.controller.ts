import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { SchemaRenderService } from './schema-render/schema-render.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly schemaRenderService: SchemaRenderService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('schema/:schemaName')
  getSchema(@Param('schemaName') schemaName: string) {
    return this.schemaRenderService.getSchema(schemaName);
  }
}
