import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { accessStrategyName } from '../constants/jwt';
import { JwtConfig } from '../config/jwt.config';
import { ConfigNames } from '../types/shared';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  accessStrategyName
) {
  constructor(configService: ConfigService) {
    const config = configService.get<JwtConfig>(ConfigNames.JWT);
    if (!config) {
      throw new Error('JWT config does not exists');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.accessTokenSecret,
      ignoreExpiration: false
    });
  }

  validate(payload: any) {
    return payload;
  }
}
