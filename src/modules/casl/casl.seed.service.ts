import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { PrismaInterface, SeedInterface } from 'src/common/types/shared';
import { Permission } from '@prisma/client';
import { caslSeed, roleSeed } from './casl.data';

@Injectable()
export class CaslSeed implements SeedInterface, OnModuleInit {
  private readonly _list: Permission[] = caslSeed;
  private readonly _roles = roleSeed;
  private readonly _logger = new Logger(CaslSeed.name);

  constructor(private readonly _prisma: PrismaService) {}

  async onModuleInit() {
    try {
      // await this._prisma.role.ups
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
      this._roles.map(async (item) => {
        const isExists = await prisma.role.findUnique({
          where: { id: item.id }
        });

        if (!isExists) {
          await prisma.role.create({ data: item });
        }
      })
    );
    await Promise.all(
      this._list.map(async (item) => {
        const isExists = await prisma.permission.findUnique({
          where: { id: item.id }
        });

        if (!isExists) {
          await prisma.permission.create({ data: item });
        }
      })
    );
  }
}
