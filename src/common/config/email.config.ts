import { registerAs } from '@nestjs/config';
import { MINUTE } from 'src/common/constants/time';
import { ConfigNames } from '../types/shared';

export interface EmailConfig {
  login: string;
  password: string;
  service: string;
  delay: number;
  from: string;
}

export default registerAs(ConfigNames.EMAIL, () => {
  const login = process.env.GOOGLE_EMAIL_LOGIN;
  const password = process.env.GOOGLE_EMAIL_PASSWORD;

  if (!login || !password) {
    throw new Error(
      '[Email config]: required GOOGLE credentials not defined or invalid'
    );
  }

  const config: EmailConfig = {
    login,
    password,
    service: 'gmail',
    from: login,
    delay: MINUTE
  };

  return config;
});
