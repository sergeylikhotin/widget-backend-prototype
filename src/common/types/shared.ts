import { DefaultArgs } from '@prisma/client/runtime/library';
import { Request } from 'express';
import { Prisma, PrismaClient, User } from '@prisma/client';

export enum ConfigNames {
  DATABASE = 'database',
  APP = 'app',
  EMAIL = 'email',
  JWT = 'jwt',
  COOKIES = 'cookies',
  CLIENT_APP = 'client_app'
}

export type GuardedRequest = Request & { user: User };

export interface PrismaInterface
  extends Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  > {}

export interface SeedInterface {
  plant(prisma?: PrismaInterface): Promise<any>;
}
