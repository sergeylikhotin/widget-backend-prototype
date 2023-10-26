import { registerAs } from '@nestjs/config';
import { ConfigNames } from '../types/shared';

export interface AppConfig {
  port: number;
  bcryptSalt: number;
  isDev: boolean;
  isProd: boolean;
}

export default registerAs(ConfigNames.APP, () => {
  const port = process.env.PORT ? +process.env.PORT : 5001;
  const isProd = process.env.NODE_ENV === 'production';

  const config: AppConfig = {
    port,
    bcryptSalt: 4,
    isDev: !isProd,
    isProd: isProd
  };

  return config;
});
