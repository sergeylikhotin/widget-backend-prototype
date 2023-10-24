import { Module } from '@nestjs/common';
import { SchemaRenderService } from './schema-render.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [SchemaRenderService],
  exports: [SchemaRenderService]
})
export class SchemaRenderModule {}
