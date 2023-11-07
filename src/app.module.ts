import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './modules/prisma/prisma.module';
import { WidgetModule } from './modules/widget/widget.module';
import { SchemaModule } from './modules/schema/schema.module';
import { ComponentModule } from './modules/component/component.module';
import { DataModule } from './modules/data/data.module';
import { TournamentModule } from './modules/data/tournament/tournament.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    PrismaModule,
    WidgetModule,
    SchemaModule,
    ComponentModule,
    DataModule,
    TournamentModule
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule {}
