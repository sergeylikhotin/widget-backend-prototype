import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthSeed } from './auth.seed.service';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [TokenModule],
  controllers: [AuthController],
  providers: [AuthService, AuthSeed],
  exports: [AuthService, AuthSeed]
})
export class AuthModule {}
