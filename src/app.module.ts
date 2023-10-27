import { Module } from '@nestjs/common';
import { SchemaRenderModule } from './modules/schema-render/schema-render.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CaslModule } from './modules/casl/casl.module';
import appConfig from './common/config/app.config';
import cookieConfig from './common/config/cookie.config';
import jwtConfig from './common/config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, cookieConfig, jwtConfig],
      isGlobal: true
    }),
    SchemaRenderModule,
    PrismaModule,
    AuthModule,
    CaslModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
