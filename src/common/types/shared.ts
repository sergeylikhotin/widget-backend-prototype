import { Prisma, PrismaClient, User } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Request } from 'express';

export enum ConfigNames {
  DATABASE = 'database',
  APP = 'app',
  EMAIL = 'email',
  JWT = 'jwt',
  COOKIES = 'cookies'
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
