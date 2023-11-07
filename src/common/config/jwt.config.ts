import { registerAs } from '@nestjs/config';
import {
  accessLifeMultiplier,
  refreshLifeMultiplier
} from 'src/common/constants/jwt';
import { ConfigNames } from '../types/shared';

export interface JwtConfig {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenLife: string;
  refreshTokenLife: string;
}

export default registerAs(ConfigNames.JWT, () => {
  const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
  const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

  if (!accessTokenSecret || !refreshTokenSecret) {
    throw new Error('[Jwt config]: JWT secrets not defined');
  }

  const config: JwtConfig = {
    accessTokenSecret,
    refreshTokenSecret,
    accessTokenLife: `${accessLifeMultiplier}h`,
    refreshTokenLife: `${refreshLifeMultiplier}d`
  };

  return config;
});
