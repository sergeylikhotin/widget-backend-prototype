import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { accessStrategyName } from '../constants/jwt';
import { TokenService } from '../..//modules/token/token.service';
import { GuardedRequest } from '../types/shared';

@Injectable()
export class AccessTokenGuard
  extends AuthGuard(accessStrategyName)
  implements CanActivate
{
  constructor(
    @Inject(TokenService) private readonly _tokenService: TokenService
  ) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<GuardedRequest>();
    const accessToken = request.headers.authorization?.split(' ')[1];
    if (!accessToken) {
      throw new UnauthorizedException();
    }

    const payload = this._tokenService.validateAccessToken(accessToken);
    if (!payload) {
      throw new UnauthorizedException();
    }

    request.user = payload;
    return true;
  }
}
