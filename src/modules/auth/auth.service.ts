import { BadRequestException, Injectable } from '@nestjs/common';
import { AppConfig } from 'src/common/config/app.config';
import {
  compareStringWithHash,
  generateHashFromString
} from 'src/common/utils/hash';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, EmailDto, UserAccountWithoutPasswordDto } from './auth.dto';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '../token/token.service';
import { ConfigNames } from 'src/common/types/shared';
import { User } from '@prisma/client';
import { ClientAppConfig } from 'src/common/config/client.config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly appConfig: AppConfig;
  private readonly clientAppConfig: ClientAppConfig;
  constructor(
    private readonly _prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly _tokensService: TokenService
  ) {
    const appConfig = this.configService.getOrThrow<AppConfig>(ConfigNames.APP);
    const clientAppConfig = this.configService.getOrThrow<ClientAppConfig>(
      ConfigNames.CLIENT_APP
    );

    this.clientAppConfig = clientAppConfig;
    this.appConfig = appConfig;
  }

  async sendEmailWithLink({ email }: EmailDto, expireTime?: number) {
    const isExistEmail = await this._prisma.user.findUnique({
      where: { email }
    });

    if (!isExistEmail) {
      throw new BadRequestException('Email doesn`t exist!');
    }

    if (isExistEmail.password) {
      throw new BadRequestException('User already registered!');
    }

    const activationCode = uuidv4();
    const expirationTime = new Date();
    const inOneHour = 1;

    expirationTime.setHours(
      expirationTime.getHours() + expireTime ?? inOneHour
    );

    await this._prisma.user.update({
      where: { email },
      data: {
        activationCode,
        activationCodeExpiration: expirationTime
      }
    });

    const link = this.redirectRegisterUrl(activationCode);
    return link;
  }

  async createUserAccountWithoutPassword(dto: UserAccountWithoutPasswordDto) {
    await this._prisma.user.create({
      data: { ...dto }
    });
  }

  async deleteUserByEmail({ email }: EmailDto) {
    await this._prisma.user.delete({
      where: { email }
    });
  }

  async register({ email, password }: AuthDto, code: string) {
    const isExistEmail = await this._prisma.user.findUnique({
      where: { email }
    });

    if (!isExistEmail) {
      throw new BadRequestException('Email doesn`t exist or user registered!');
    }

    if (isExistEmail.password) {
      throw new BadRequestException('User already registered!');
    }

    const isExistCode = await this._prisma.user.findUnique({
      where: { email, activationCode: code }
    });

    if (!isExistCode) {
      throw new BadRequestException('Activation code doesn`t exist!');
    }

    const isCodeExpired =
      isExistCode.activationCodeExpiration &&
      isExistCode.activationCodeExpiration < new Date();

    if (isCodeExpired) {
      throw new BadRequestException('Activation code expired!');
    }

    const hashedPassword = await generateHashFromString(
      password,
      this.appConfig.bcryptSalt
    );

    const createdUser = await this._prisma.user.update({
      where: { email },
      data: { password: hashedPassword, activationCode: null }
    });

    const tokens = this._tokensService.generateTokens(createdUser);

    return {
      user: createdUser,
      tokens
    };
  }

  async login({ email, password }: AuthDto) {
    const candidate = await this._prisma.user.findUnique({
      where: { email }
    });

    if (!candidate) {
      throw new BadRequestException('Invalid doesn`t exist!');
    }

    const isValid = await compareStringWithHash(password, candidate.password);

    if (!isValid) {
      throw new BadRequestException('Invalid password!');
    }

    const tokens = this._tokensService.generateTokens(candidate);

    return {
      user: candidate,
      tokens
    };
  }

  async refresh(user: User) {
    const tokens = this._tokensService.generateTokens(user);

    return { tokens };
  }

  async getEmailByCode(code: string) {
    const candidate = await this._prisma.user.findUnique({
      where: { activationCode: code }
    });

    if (!candidate) {
      throw new BadRequestException("Activation code doesn't exist!");
    }

    return candidate.email;
  }

  private redirectRegisterUrl(code: string) {
    return `${this.clientAppConfig.client_app_register_url}/${code}`;
  }
}
