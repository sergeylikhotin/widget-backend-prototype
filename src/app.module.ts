import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { WidgetModule } from './widget/widget.module';
import { SchemaModule } from './schema/schema.module';
import { DataGateway } from './data/data.gateway';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    WidgetModule,
    SchemaModule
  ],
  controllers: [AppController],
  providers: [AppService, DataGateway]
})
export class AppModule {}
