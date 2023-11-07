import { Module } from '@nestjs/common';
import { SchemaRenderService } from './schema-render.service';
import { SchemaRenderSeedService } from './schema-render.seed.service';
import { SchemaRenderController } from './schema-render.controller';

@Module({
  controllers: [SchemaRenderController],
  providers: [SchemaRenderService, SchemaRenderSeedService],
  exports: [SchemaRenderService]
})
export class SchemaRenderModule {}
