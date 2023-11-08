import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength } from 'class-validator';

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
  @IsString()
  @ApiProperty()
  roleId: string;
}
