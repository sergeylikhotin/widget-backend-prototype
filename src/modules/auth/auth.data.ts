import { Role, User } from '@prisma/client';
import { generateHashFromStringSync } from 'src/common/utils/hash';

export const userSeed: User[] = [
  {
    id: 1,
    email: 'example@mail.com',
    password: generateHashFromStringSync('admin', 4),
    roles: [Role.super_admin]
  }
];
