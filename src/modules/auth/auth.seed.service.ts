import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { userSeed } from './auth.data';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { PrismaInterface, SeedInterface } from 'src/common/types/shared';
import { User } from '@prisma/client';

@Injectable()
export class AuthSeed implements SeedInterface, OnModuleInit {
  private readonly _list: User[] = userSeed;
  private readonly _logger = new Logger(AuthSeed.name);

  constructor(private readonly _prisma: PrismaService) {}

  async onModuleInit() {
    try {
      await this._prisma.$transaction(async (prisma) => {
        await this.plant(prisma);
      });
    } catch (error) {
      this._logger.error(error);
    }
  }

  async plant(prisma: PrismaInterface) {
    await this._fill(prisma);
  }

  private async _fill(prisma: PrismaInterface) {
    await Promise.all(
      this._list.map(async (user) => {
        const isExists = await prisma.user.findUnique({
          where: { id: user.id }
        });

        if (!isExists) {
          await prisma.user.create({ data: user });
        }
      })
    );
  }
}
