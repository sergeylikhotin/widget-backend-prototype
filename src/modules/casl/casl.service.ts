import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PermissionDto } from './casl.dto';
import { CursorPaginationDto, PaginationDto } from 'src/common/dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Permission, User } from '@prisma/client';

let count = 0;

@Injectable()
export class CaslService {
  private readonly cacheKey = 'permission';
  private readonly lock = false;
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly prisma: PrismaService
  ) {}

  async getPermissions({ take, cursor }: CursorPaginationDto) {
    const cachedPerms = await this.cacheManager.get<Permission[]>(
      this.cacheKey
    );

    if (!cachedPerms) {
      console.log('Render times', ++count);
      const cursorArgs: any = cursor ? { skip: 1, cursor: { id: cursor } } : {};
      const permissions = await this.prisma.permission.findMany({
        take,
        ...cursorArgs
      });

      await this.cacheManager.set(this.cacheKey, permissions);
      return permissions;
    }

    return cachedPerms;
  }

  async getPermissionsForUser(user: User) {
    const cacheKey = `${this.cacheKey}:${user.id}`;
    const cachedPerms = await this.cacheManager.get<Permission[]>(cacheKey);

    if (!cachedPerms) {
      const permissions = await this.prisma.permission.findMany({
        where: { OR: [{ roleId: user.roleId }, { sharedWithId: user.id }] }
      });

      await this.cacheManager.set(cacheKey, permissions);
      return permissions;
    }

    return cachedPerms;
  }

  async addPermission(dto: PermissionDto, user: User) {
    const cacheKey = `${this.cacheKey}:${user.id}`;
    const allowedCondition =
      (dto.resourceId && !dto.sharedWithId) ||
      (!dto.resourceId && dto.sharedWithId);

    if (allowedCondition) {
      throw new BadRequestException(
        'ResourceId and sharedWithId must be defined or both not!'
      );
    }

    const isExist = await this.prisma.permission.findFirst({
      where: dto
    });

    if (isExist) {
      throw new BadRequestException('Permission already exist!');
    }

    await this.prisma.permission.create({ data: dto });
    await this.cacheManager.del(this.cacheKey);
    await this.cacheManager.del(cacheKey);
  }

  async updatePermission(id: string, dto: PermissionDto, user: User) {
    const cacheKey = `${this.cacheKey}:${user.id}`;
    await this.prisma.permission.update({
      where: { id },
      data: dto
    });
    await this.cacheManager.del(this.cacheKey);
    await this.cacheManager.del(cacheKey);
  }

  async removePermission(id: string, user: User) {
    const cacheKey = `${this.cacheKey}:${user.id}`;
    await this.prisma.permission.delete({ where: { id } });
    await this.cacheManager.del(this.cacheKey);
    await this.cacheManager.del(cacheKey);
  }
}
