import { Permission, Role } from '@prisma/client';

export const caslSeed: Permission[] = [
  {
    id: 1,
    modelName: 'Widget',
    action: 'manage',
    roleId: '0c9a2d21-038f-40b4-9b68-4d4232fb9beb',
    type: 'can',
    resourceId: null,
    sharedWithId: null
  },
  {
    id: 2,
    modelName: 'all',
    action: 'manage',
    roleId: 'c34ede0c-e6dc-49fb-ab4a-4c56501a1d96',
    type: 'can',
    resourceId: null,
    sharedWithId: null
  }
];

export const roleSeed: Role[] = [
  { id: 'c34ede0c-e6dc-49fb-ab4a-4c56501a1d96', name: 'super_admin' },
  { id: '0c9a2d21-038f-40b4-9b68-4d4232fb9beb', name: 'manager' }
];

export const AccessRole = {
  super_admin: 'c34ede0c-e6dc-49fb-ab4a-4c56501a1d96',
  manager: '0c9a2d21-038f-40b4-9b68-4d4232fb9beb'
} as const;
