import {
  Body,
  Controller,
  Get,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Response } from 'express';
import { MessageResponse } from 'src/common/dto';
import { AccessTokenGuard } from 'src/common/guards/access.guard';
import {
  CaslPolicyHandler,
  CheckPolicies,
  PoliciesGuard
} from 'src/common/guards/policies.guard';
import { Roles, RolesGuard } from 'src/common/guards/roles.guard';
import { getRegisterLinkHtml } from '../email/email.html';
import { EmailService } from '../email/email.service';
import { AuthDto, EmailDto, UserAccountWithoutPasswordDto } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService
  ) {}

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
    } = await this.authService.login(body);

    res.status(HttpStatus.OK).json({ user, accessToken });
  }

  @Post('register')
  async register(
    @Body() body: AuthDto,
    @Query('code') code: string,
    @Res() res: Response
  ) {
    const {
      user,
      tokens: { accessToken }
    } = await this.authService.register(body, code);

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

  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @Roles(Role.super_admin)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post('register/send-link')
  async sendEmailWithLink(
    @Res() res: Response,
    @Body() body: EmailDto,
    @Query('expire-time-hours', ParseIntPipe)
    expireTime?: number
  ) {
    const link = await this.authService.sendEmailWithLink(body, expireTime);
    const title = 'Register link!';

    await this.emailService.send(body.email, title, getRegisterLinkHtml(link));

    res.status(HttpStatus.OK).json(new MessageResponse('Success'));
  }

  @ApiBearerAuth()
  @Roles(Role.super_admin)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post('register/user-account')
  async createUserAccountWithoutPassword(
    @Res() res: Response,
    @Body() body: UserAccountWithoutPasswordDto
  ) {
    await this.authService.createUserAccountWithoutPassword(body);
    res.status(HttpStatus.OK).json(new MessageResponse('Success'));
  }

  @Get('email-by-code')
  async getEmailByCode(@Res() res: Response, @Query('code') code: string) {
    const email = await this.authService.getEmailByCode(code);

    res.status(HttpStatus.OK).json(email);
  }
}