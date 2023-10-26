import { Global, Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Global()
@Module({
  imports: [JwtModule.register({})],
  controllers: [],
  providers: [TokenService, JwtService],
  exports: [TokenService, JwtService]
})
export class TokenModule {}
