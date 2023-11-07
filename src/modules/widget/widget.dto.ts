import { Widget } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWidgetDto implements Partial<Widget> {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateWidgetDto implements Partial<Widget> {
  @IsString()
  @IsNotEmpty()
  name: string;
}
