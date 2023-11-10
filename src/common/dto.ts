import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive, IsUUID,
  Max,
  Min
} from 'class-validator';

export class MessageResponse {
  @ApiProperty()
  public message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export class PaginationDto {
  @ApiProperty({
    required: false
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  skip?: number;

  @ApiProperty({
    required: false
  })
  @IsNumber()
  @Max(100)
  @Min(1)
  @IsOptional()
  take?: number;
}

export class CursorPaginationDto {
  @ApiProperty({
    required: false
  })
  @IsNumber()
  @Max(100)
  @Min(1)
  @IsOptional()
  take: number;

  @ApiProperty({
    required: false,
    description: 'Cursor field from previous request.'
  })
  @IsUUID()
  @IsOptional()
  cursor: string;
}

export class IdDto {
  @IsInt()
  @IsPositive()
  id: number;
}
