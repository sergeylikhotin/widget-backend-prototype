import { generateHashFromStringSync } from 'src/common/utils/hash';
import { Role, User } from '@prisma/client';

export const userSeed: User[] = [
  {
    id: 1,
    email: 'example@mail.com',
    password: generateHashFromStringSync('admin', 4),
    roles: [Role.super_admin],
    activationCode: null
  }
];
