import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
@ValidatorConstraint({ name: 'EntityExists', async: true })
export class IsEntityExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(entityId: any, args: ValidationArguments) {
    if (entityId == null) return false;

    const [entity] = args.constraints;
    const context: any = this.prisma[entity];

    const count = await context.count({
      where: { id: entityId }
    });
    return count > 0;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} with id ${args.value} does not exist`;
  }
}

export function IsEntityExist(
  entity: Prisma.TypeMap['meta']['modelProps'],
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity],
      validator: IsEntityExistConstraint
    });
  };
}
