import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';
import { Roles, RolesGuard } from 'src/common/guards/roles.guard';
import { AccessTokenGuard } from 'src/common/guards/access.guard';
import { MessageResponse } from 'src/common/dto';
import { Role } from '@prisma/client';
import {
  CaslPolicyHandler,
  CheckPolicies,
  PoliciesGuard
} from 'src/common/guards/policies.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('register')
  async register(@Body() body: AuthDto, @Res() res: Response) {
    const {
      user,
      tokens: { accessToken }
    } = await this._authService.register(body);

    res.status(HttpStatus.OK).json({ user, accessToken });
  }

  @ApiBody({
    type: AuthDto,
    examples: {
      email: {
        value: {
          email: 'example@mail.com',
          password: 'admin'
        }
      }
    }
  })
  @Post('login')
  async login(@Body() body: AuthDto, @Res() res: Response) {
    const {
      user,
      tokens: { accessToken }
    } = await this._authService.login(body);

    res.status(HttpStatus.OK).json({ user, accessToken });
  }

  @ApiBearerAuth()
  @Roles(Role.super_admin)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Get('test-role-guard')
  async testRole(@Res() res: Response) {
    res.status(HttpStatus.OK).json(new MessageResponse('Success'));
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, PoliciesGuard)
  @CheckPolicies(new CaslPolicyHandler('manage', 'Widget'))
  @Get('test-policy-guard')
  async test(@Res() res: Response) {
    res.status(HttpStatus.OK).json(new MessageResponse('Success'));
  }
}
