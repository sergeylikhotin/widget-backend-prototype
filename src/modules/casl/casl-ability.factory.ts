import { Component, User, Schema, Role } from '@prisma/client';
import { AbilityBuilder, ExtractSubjectType, PureAbility } from '@casl/ability';
import { PrismaQuery, Subjects, createPrismaAbility } from '@casl/prisma';
import { Injectable } from '@nestjs/common';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete'
}

export type AppSubjects =
  | 'all'
  | Subjects<{
      User: User;
      Component: Component;
      Schema: Schema;
    }>;

export type AppAbility = PureAbility<[Action, AppSubjects], PrismaQuery>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility
    );

    if (user.roles.includes(Role.super_admin)) {
      // can(Action.Manage, 'all'); // read-write access to everything
      cannot(Action.Read, 'Component');
    }

    return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as unknown as ExtractSubjectType<AppSubjects>
    });
  }
}
