import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @MaxLength(16)
  @ApiProperty()
  password: string;
}
