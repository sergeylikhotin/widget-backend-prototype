import {
  Component,
  User,
  Schema,
  Widget,
  PermissionAction,
  Permission
} from '@prisma/client';
import { AbilityBuilder, ExtractSubjectType, PureAbility } from '@casl/ability';
import { PrismaQuery, Subjects, createPrismaAbility } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { CaslService } from './casl.service';

export type AppSubjects =
  | 'all'
  | Subjects<{
      User: User;
      Component: Component;
      Schema: Schema;
      Widget: Widget;
    }>;

export type AppAbility = PureAbility<
  [PermissionAction, AppSubjects],
  PrismaQuery
>;

@Injectable()
export class CaslAbilityFactory {
  constructor(private readonly caslService: CaslService) {}

  async createForUser(user: User) {
    const caslAbilityBuilder = new AbilityBuilder<AppAbility>(
      createPrismaAbility
    );

    const abilities = await this.caslService.getPermissionsForUser(user);

    abilities.forEach((ability) =>
      this.createAbility(ability, caslAbilityBuilder)
    );

    return caslAbilityBuilder.build({
      detectSubjectType: (item) =>
        item.constructor as unknown as ExtractSubjectType<AppSubjects>
    });
  }

  private createAbility(
    { type, action, modelName, resourceId }: Permission,
    caslAbilityBuilder: AbilityBuilder<AppAbility>
  ) {
    const attributes = resourceId ? { id: resourceId } : undefined;

    caslAbilityBuilder[type](action, modelName as any, attributes);
  }
}
