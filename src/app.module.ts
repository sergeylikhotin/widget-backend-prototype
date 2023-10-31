import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { WidgetModule } from './widget/widget.module';
import { SchemaModule } from './schema/schema.module';

@Module({
  imports: [PrismaModule, WidgetModule, SchemaModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
