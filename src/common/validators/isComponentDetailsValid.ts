import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ComponentSchemaRegistry } from '../../modules/component/component.registry';
import { betterAjvErrors } from '@apideck/better-ajv-errors';
import { ErrorObject } from 'ajv';

@Injectable()
@ValidatorConstraint({ name: 'ComponentType' })
export class IsComponentDetailsConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly typesRegistry: ComponentSchemaRegistry) {}

  validate(value: any, args?: ValidationArguments): Promise<boolean> | boolean {
    const [typePropertyName, detailsType] = args.constraints as [
      string,
      DetailsType
    ];

    const type = (args.object as any)[typePropertyName];
    const componentSchema = this.typesRegistry.get(type);
    if (componentSchema == null) {
      return false;
    }

    switch (detailsType) {
      case DetailsType.Props:
        return componentSchema.validateProps(value);
      case DetailsType.Bindings:
        return componentSchema.validateBindings(value);
      default:
        return false;
    }
  }

  defaultMessage(args?: ValidationArguments): string {
    const [typePropertyName, detailsType] = args.constraints as [
      string,
      DetailsType
    ];

    const type = (args.object as any)[typePropertyName];
    const componentSchema = this.typesRegistry.get(type);
    if (componentSchema == null) {
      return `${typePropertyName} property must have existing component type for ${detailsType} validation.`;
    }

    const errors: ErrorObject[] =
      detailsType === DetailsType.Props
        ? componentSchema.validateProps.errors
        : componentSchema.validateBindings.errors;

    return betterAjvErrors({
      schema: componentSchema.props,
      data: args.value,
      errors
    })
      .map((error) => `${detailsType} ${error.message}`)
      .join();
  }
}

export enum DetailsType {
  Props = 'props',
  Bindings = 'bindings'
}
export function IsComponentDetailsValid(
  typePropertyName: string,
  detailsType: DetailsType,
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [typePropertyName, detailsType],
      validator: IsComponentDetailsConstraint
    });
  };
}
