import {
  Component,
  User,
  Schema,
  Widget,
  CaslAction,
  CaslAbility,
  CaslModels
} from '@prisma/client';
import { AbilityBuilder, ExtractSubjectType, PureAbility } from '@casl/ability';
import { PrismaQuery, Subjects, createPrismaAbility } from '@casl/prisma';
import { Injectable, Scope } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type AppSubjects =
  | 'all'
  | Subjects<{
      User: User;
      Component: Component;
      Schema: Schema;
      Widget: Widget;
    }>;

export type AppAbility = PureAbility<[CaslAction, AppSubjects], PrismaQuery>;

@Injectable({ scope: Scope.REQUEST })
export class CaslAbilityFactory {
  private readonly caslAbilityBuilder = new AbilityBuilder<AppAbility>(
    createPrismaAbility
  );
  constructor(private readonly prisma: PrismaService) {}

  async createForUser(user: User) {
    await Promise.all(
      user.roles.map(async (role) => {
        const abilities = await this.prisma.caslAbility.findMany({
          where: { role }
        });

        abilities.forEach((value) => this.createAbility(value, user));
      })
    );

    return this.caslAbilityBuilder.build({
      detectSubjectType: (item) =>
        item.constructor as unknown as ExtractSubjectType<AppSubjects>
    });
  }

  private createAbility(
    { type, action, modelName, sharedWithId, resourceId }: CaslAbility,
    user: User
  ) {
    if (user?.id && sharedWithId === user?.id) {
      this.caslAbilityBuilder[type](action, modelName as CaslModels, {
        id: resourceId
      });
    } else if (!sharedWithId && !resourceId) {
      this.caslAbilityBuilder[type](action, modelName as CaslModels);
    }
  }
}
