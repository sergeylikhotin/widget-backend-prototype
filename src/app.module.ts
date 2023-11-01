import { Module } from '@nestjs/common';
import { SchemaRenderModule } from './modules/schema-render/schema-render.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CaslModule } from './modules/casl/casl.module';
import appConfig from './common/config/app.config';
import cookieConfig from './common/config/cookie.config';
import jwtConfig from './common/config/jwt.config';
import { WidgetModule } from './modules/widget/widget.module';
import { EmailModule } from './modules/email/email.module';
import emailConfig from './common/config/email.config';
import clientConfig from './common/config/client.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, cookieConfig, jwtConfig, emailConfig, clientConfig],
      isGlobal: true
    }),
    SchemaRenderModule,
    PrismaModule,
    AuthModule,
    CaslModule,
    WidgetModule,
    EmailModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
