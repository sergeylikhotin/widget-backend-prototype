import { Component } from '../schema/schema.service';
import { IsEmpty, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { IsEntityExist } from '../../common/validators/isEntityExist';
import { IsComponentType } from '../../common/validators/isComponentType';
import {
  DetailsType,
  IsComponentDetailsValid
} from '../../common/validators/isComponentDetailsValid';

export class CreateComponentDto implements Partial<Component> {
  @IsUUID()
  @IsOptional()
  parentId: string;

  @IsEntityExist('schema')
  @IsUUID()
  @IsNotEmpty()
  schemaId: string;

  @IsComponentType()
  @IsString()
  type: string;

  @IsComponentDetailsValid('type', DetailsType.Props)
  @IsNotEmpty()
  props: any;

  @IsComponentDetailsValid('type', DetailsType.Bindings)
  @IsNotEmpty()
  bindings: any;
}

export class UpdateComponentDto implements Partial<Component> {
  @IsUUID()
  @IsOptional()
  parentId: string;

  @IsOptional()
  type: string;

  @IsComponentDetailsValid('type', DetailsType.Props)
  @IsOptional()
  props: any;

  @IsComponentDetailsValid('type', DetailsType.Bindings)
  @IsOptional()
  bindings: any;
}
