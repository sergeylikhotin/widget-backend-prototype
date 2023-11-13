import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit
} from '@nestjs/common';
import { Permission, User } from '@prisma/client';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { PermissionDto } from './casl.dto';

@Injectable()
export class CaslService implements OnModuleInit {
  private readonly cacheKey = 'permission';

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly prisma: PrismaService
  ) {}

  async onModuleInit() {
    const permissions = await this.prisma.permission.findMany();

    await this.cacheManager.set(this.cacheKey, permissions);
  }

  async getPermissions() {
    return this.getCachedPermissions();
  }

  private async getCachedPermissions() {
    const cachedPerms = await this.cacheManager.get<Permission[]>(
      this.cacheKey
    );

    if (!cachedPerms) {
      const permissions = await this.prisma.permission.findMany();

      await this.cacheManager.set(this.cacheKey, permissions);
      return permissions;
    }

    return cachedPerms;
  }

  async getPermissionsForUser(user: User) {
    const cachedPerms = await this.getCachedPermissions();

    return cachedPerms.filter(
      (perm) => perm.sharedWithId === user.id || perm.roleId === user.roleId
    );
  }

  async addPermission(dto: PermissionDto, user: User) {
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
  }

  async updatePermission(id: number, dto: PermissionDto) {
    await this.prisma.permission.update({
      where: { id },
      data: dto
    });

    await this.cacheManager.del(this.cacheKey);
  }

  async removePermission(id: number) {
    await this.prisma.permission.delete({ where: { id } });
    await this.cacheManager.del(this.cacheKey);
  }
}
