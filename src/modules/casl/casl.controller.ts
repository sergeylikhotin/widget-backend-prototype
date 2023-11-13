import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { MessageResponse, PaginationDto } from 'src/common/dto';
import { PermissionDto } from './casl.dto';
import { CaslService } from './casl.service';
import { GuardedRequest } from 'src/common/types/shared';
import { AccessTokenGuard } from 'src/common/guards/access.guard';

@ApiTags('roles')
@Controller('roles')
export class CaslController {
  constructor(private readonly caslService: CaslService) {}

  @Get('role')
  async getRolesForUser() {}

  @Post('role')
  async addRoleForUser() {}

  @Patch('role/:id')
  async updateRoleForUser() {}

  @Delete('role/:id')
  async removeRoleForUser() {}

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get('permission')
  async getPermissions(@Res() res: Response) {
    const permissions = await this.caslService.getPermissions();

    res.status(HttpStatus.OK).json(permissions);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Post('permission')
  async addPermission(@Res() res: Response, @Body() body: PermissionDto) {
    await this.caslService.addPermission(body);

    res.status(HttpStatus.OK).json(new MessageResponse('Success'));
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @UsePipes(new ValidationPipe())
  @Patch('permission/:id')
  async updatePermission(
    @Res() res: Response,
    @Body() body: PermissionDto,
    @Param('id', ParseIntPipe) id: number
  ) {
    await this.caslService.updatePermission(id, body);

    res.status(HttpStatus.OK).json(new MessageResponse('Success'));
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @UsePipes(new ValidationPipe())
  @Delete('permission/:id')
  async removePermission(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number
  ) {
    await this.caslService.removePermission(id);

    res.status(HttpStatus.OK).json(new MessageResponse('Success'));
  }
}
