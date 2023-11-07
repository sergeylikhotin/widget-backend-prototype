import { Controller, Get, Param } from '@nestjs/common';
import { SchemaService } from './schema.service';

@Controller('schemas')
export class SchemaController {
  constructor(private readonly schemaService: SchemaService) {}

  @Get('/:schemaId')
  buildSchema(@Param('schemaId') schemaId: string) {
    return this.schemaService.build(schemaId);
  }
}
