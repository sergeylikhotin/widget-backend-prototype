import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtConfig } from 'src/common/config/jwt.config';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigNames } from 'src/common/types/shared';
import { User } from '@prisma/client';

export interface IGeneratedTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class TokenService {
  private readonly _config: JwtConfig;
  constructor(
    private readonly _prisma: PrismaService,
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService
  ) {
    const config = this._configService.getOrThrow<JwtConfig>(ConfigNames.JWT);
    this._config = config;
  }

  public generateTokens(payload: User): IGeneratedTokens {
    const accessToken = this._jwtService.sign(
      { ...payload },
      {
        secret: this._config.accessTokenSecret,
        expiresIn: this._config.accessTokenLife
      }
    );
    const refreshToken = this._jwtService.sign(
      {
        ...payload
      },
      {
        secret: this._config.refreshTokenSecret,
        expiresIn: this._config.refreshTokenLife
      }
    );
    return {
      accessToken,
      refreshToken
    };
  }

  public validateAccessToken(token: string): User | null {
    const userData = this._validateToken(token, this._config.accessTokenSecret);
    return userData;
  }

  private _validateToken(token: string, secret: string): User | null {
    try {
      const userData = this._jwtService.verify(token, {
        secret
      });

      return userData;
    } catch (e) {
      return null;
    }
  }
}
