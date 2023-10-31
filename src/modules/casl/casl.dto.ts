import { $Enums, CaslAbility } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsArray, IsInt, IsPositive, IsNumber } from 'class-validator';

export class PermissionDto implements Omit<CaslAbility, 'id'> {
  @ApiProperty({
    description: 'The id of the target user'
  })
  @IsInt()
  @IsPositive()
  sharedWithId: number;

  @ApiProperty({
    description: 'The id of the resource'
  })
  @IsInt()
  @IsPositive()
  resourceId: number;

  @ApiProperty({
    description: 'The role for permission'
  })
  @IsEnum($Enums.Role)
  role: $Enums.Role;

  @ApiProperty({
    description: 'The action that is allowed or denied by this permission.'
  })
  @IsEnum($Enums.CaslAction)
  action: $Enums.CaslAction;

  @ApiProperty({
    description: 'The type of the permission (values: can or cannot).'
  })
  @IsEnum($Enums.CaslPermissionType)
  type: $Enums.CaslPermissionType;

  @ApiProperty({
    description: 'The model name for which the permission is defined.'
  })
  @IsEnum($Enums.CaslModels)
  modelName: $Enums.CaslModels;
}
