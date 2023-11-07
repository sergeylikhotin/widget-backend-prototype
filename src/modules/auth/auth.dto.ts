import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsArray, IsEmail, IsEnum, IsString, MaxLength } from 'class-validator';

export class EmailDto {
  @IsEmail()
  @IsString()
  @ApiProperty()
  email: string;
}

export class AuthDto extends EmailDto {
  @IsString()
  @MaxLength(16)
  @ApiProperty()
  password: string;
}

export class EmailByCodeDto {
  @IsString()
  @ApiProperty()
  activationCode: string;
}

export class UserAccountWithoutPasswordDto extends EmailDto {
  @IsArray()
  @IsEnum($Enums.Role, { each: true })
  @ApiProperty()
  roles: $Enums.Role[];
}
