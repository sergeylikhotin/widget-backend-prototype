import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { PrismaInterface, SeedInterface } from 'src/common/types/shared';
import { CaslAbility, User } from '@prisma/client';
import { caslSeed } from './casl.data';

@Injectable()
export class CaslSeed implements SeedInterface, OnModuleInit {
  private readonly _list: CaslAbility[] = caslSeed;
  private readonly _logger = new Logger(CaslSeed.name);

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
      this._list.map(async (item) => {
        const isExists = await prisma.caslAbility.findUnique({
          where: { id: item.id }
        });

        if (!isExists) {
          await prisma.caslAbility.create({ data: item });
        }
      })
    );
  }
}
