import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PermissionDto } from './casl.dto';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class CaslService {
  constructor(private readonly prisma: PrismaService) {
    // const config = this._configService.getOrThrow<AppConfig>(ConfigNames.APP);
    // this._appConfig = config;
  }

  async getRoles() {}

  async addRoleForUser() {}

  async updateRoleForUser() {}

  async removeRoleForUser() {}

  async getPermissions({ skip, take }: PaginationDto) {
    const permissions = await this.prisma.caslAbility.findMany({
      skip,
      take
    });

    return permissions;
  }

  async addPermission(dto: PermissionDto) {
    const allowedCondition =
      (dto.resourceId && !dto.sharedWithId) ||
      (!dto.resourceId && dto.sharedWithId);

    if (allowedCondition) {
      throw new BadRequestException(
        'ResourceId and sharedWithId must be defined or both not!'
      );
    }

    const isExist = await this.prisma.caslAbility.findFirst({
      where: { ...dto }
    });

    if (isExist) {
      throw new BadRequestException('Permission already exist!');
    }

    await this.prisma.caslAbility.create({ data: dto });
  }

  async updatePermission(id: number, dto: PermissionDto) {
    await this.prisma.caslAbility.update({ where: { id }, data: dto });
  }

  async removePermission(id: number) {
    await this.prisma.caslAbility.delete({ where: { id } });
  }
}
