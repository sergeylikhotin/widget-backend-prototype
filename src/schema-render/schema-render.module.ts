import { Module } from '@nestjs/common';
import { SchemaRenderService } from './schema-render.service';
import { SchemaRenderSeedService } from './schema-render.seed.service';

@Module({
  providers: [SchemaRenderService, SchemaRenderSeedService],
  exports: [SchemaRenderService]
})
export class SchemaRenderModule {}
