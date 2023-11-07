import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ComponentSchemaRegistry } from '../../modules/component/component.registry';

@Injectable()
@ValidatorConstraint({ name: 'ComponentType' })
export class IsComponentTypeConstraint implements ValidatorConstraintInterface {
  constructor(private readonly typesRegistry: ComponentSchemaRegistry) {}

  validate(
    value: any,
    validationArguments?: ValidationArguments
  ): Promise<boolean> | boolean {
    return this.typesRegistry.get(value) != null;
  }

  defaultMessage(args?: ValidationArguments): string {
    return `${args.value} is not valid component type.`;
  }
}
export function IsComponentType(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsComponentTypeConstraint
    });
  };
}
