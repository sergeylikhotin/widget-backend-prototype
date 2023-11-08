import { generateHashFromStringSync } from 'src/common/utils/hash';
import { Role, User } from '@prisma/client';

export const userSeed: User[] = [
  {
    id: 1,
    email: 'example@mail.com',
    password: generateHashFromStringSync('admin', 4),
    roleId: 'c34ede0c-e6dc-49fb-ab4a-4c56501a1d96',
    activationCode: null,
    activationCodeExpiration: null
  }
];
