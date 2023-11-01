import {
  Component,
  User,
  Schema,
  Widget,
  CaslAction,
  CaslAbility
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

        abilities.forEach((ability) => this.createAbilityByRole(ability));
      })
    );

    const abilities = await this.prisma.caslAbility.findMany({
      where: { sharedWithId: user.id }
    });

    abilities.forEach((ability) => this.createAbilityByResource(ability));

    return this.caslAbilityBuilder.build({
      detectSubjectType: (item) =>
        item.constructor as unknown as ExtractSubjectType<AppSubjects>
    });
  }

  private createAbilityByRole({ type, action, modelName }: CaslAbility) {
    this.caslAbilityBuilder[type](action, modelName);
  }

  private createAbilityByResource({
    type,
    action,
    modelName,
    resourceId
  }: CaslAbility) {
    this.caslAbilityBuilder[type](action, modelName, {
      id: resourceId
    });
  }
}
