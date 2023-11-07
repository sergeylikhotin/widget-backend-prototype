import { registerAs } from '@nestjs/config';
import { ConfigNames } from '../types/shared';

export interface ClientAppConfig {
  client_app_url: string;
  client_app_register_url: string;
}

export default registerAs(ConfigNames.CLIENT_APP, () => {
  const client_app_url = process.env.CLIENT_APP_URL;
  const client_app_register_url = process.env.CLIENT_APP_REGISTER_URL;

  if (!client_app_url) {
    throw new Error('[Client config]: required config not defined or invalid');
  }

  const config: ClientAppConfig = {
    client_app_url,
    client_app_register_url
  };

  return config;
});
