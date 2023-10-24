import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SchemaRenderModule } from './schema-render/schema-render.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [SchemaRenderModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
