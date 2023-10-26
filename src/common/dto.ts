import { ApiProperty } from '@nestjs/swagger';

export class MessageResponse {
  @ApiProperty()
  public message: string;

  constructor(message: string) {
    this.message = message;
  }
}
