import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './common/config/app.config';
import clientConfig from './common/config/client.config';
import cookieConfig from './common/config/cookie.config';
import emailConfig from './common/config/email.config';
import jwtConfig from './common/config/jwt.config';

import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { CaslModule } from './modules/casl/casl.module';
import { ComponentModule } from './modules/component/component.module';
import { DataModule } from './modules/data/data.module';
import { TournamentModule } from './modules/data/tournament/tournament.module';
import { EmailModule } from './modules/email/email.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { SchemaModule } from './modules/schema/schema.module';
import { WidgetModule } from './modules/widget/widget.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, cookieConfig, jwtConfig, emailConfig, clientConfig],
      isGlobal: true
    }),
    CacheModule.register({ isGlobal: true }),

    PrismaModule,
    AuthModule,
    CaslModule,
    WidgetModule,
    EmailModule,

    SchemaModule,
    ComponentModule,
    DataModule,
    TournamentModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    }
  ]
})
export class AppModule {}
