import { CaslAbility, Role, User } from '@prisma/client';

export const caslSeed: CaslAbility[] = [
  {
    id: 1,
    modelName: 'Widget',
    action: 'manage',
    role: 'manager',
    type: 'can',
    resourceId: null,
    sharedWithId: null
  },
  {
    id: 2,
    modelName: 'all',
    action: 'manage',
    role: 'super_admin',
    type: 'can',
    resourceId: null,
    sharedWithId: null
  }
];
