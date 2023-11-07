import { Schema } from '@prisma/client';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { IsEntityExist } from '../../common/validators/isEntityExist';

export class CreateSchemaDto implements Partial<Schema> {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEntityExist('widget')
  @IsUUID()
  widgetId: string;
}
