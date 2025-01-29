import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies['refresh_token'];

    if (!refreshToken) {
      throw new ForbiddenException('Refresh token not found');
    }

    const user = await this.userService.checkRefreshToken(
      refreshToken.id,
      refreshToken.refreshToken,
    );

    if (!user) {
      throw new ForbiddenException('Invalid refresh token');
    }

    // request에 user 정보를 추가할 수 있습니다
    request.user = user;

    return true;
  }
}
