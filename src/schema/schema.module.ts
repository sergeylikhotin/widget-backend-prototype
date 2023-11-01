import { Module } from '@nestjs/common';
import { SchemaService } from './schema.service';
import { SchemaController } from './schema.controller';
import { SchemaSeedService } from './schema.seed.service';
import { SchemaComponentFactory } from './schema.component.factory';

@Module({
  providers: [SchemaService, SchemaComponentFactory, SchemaSeedService],
  controllers: [SchemaController],
  exports: [SchemaService]
})
export class SchemaModule {}
