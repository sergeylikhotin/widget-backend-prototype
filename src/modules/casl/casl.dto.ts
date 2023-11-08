import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Permission } from '@prisma/client';
import { IsEnum, IsInt, IsPositive, IsString, IsUUID } from 'class-validator';

export class PermissionDto implements Omit<Permission, 'id' | 'role'> {
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
  @IsString()
  @IsUUID()
  roleId: string;

  @ApiProperty({
    description: 'The action that is allowed or denied by this permission.'
  })
  @IsEnum($Enums.PermissionAction)
  action: $Enums.PermissionAction;

  @ApiProperty({
    description: 'The type of the permission (values: can or cannot).'
  })
  @IsEnum($Enums.PermissionType)
  type: $Enums.PermissionType;

  @ApiProperty({
    description: 'The model name for which the permission is defined.'
  })
  @IsString()
  modelName: string;
}
