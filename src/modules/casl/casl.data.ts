import { Permission, Role } from '@prisma/client';

export const caslSeed: Permission[] = [
  {
    id: 'f8c3329a-4a9a-4e46-aa24-4ac8532e250d',
    modelName: 'Widget',
    action: 'manage',
    roleId: '0c9a2d21-038f-40b4-9b68-4d4232fb9beb',
    type: 'can',
    resourceId: null,
    sharedWithId: null
  },
  {
    id: '2e655e85-563a-456b-b7ea-7e2857f5e718',
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
