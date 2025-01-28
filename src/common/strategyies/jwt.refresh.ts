import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PayloadDto } from './dto/payload.dto';
import { env } from 'src/common/configs/env';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        async (req: Request) => {
          const data = req?.cookies['refresh_token'];
          if (!data) {
            throw new UnauthorizedException('Invalid refresh token');
          } else {
            const user = await this.userService.checkRefreshToken(
              data.id,
              data.refreshToken,
            );
            if (!user) {
              throw new UnauthorizedException('Invalid refresh token');
            }
            return data;
          }
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET,
    });
  }

  async validate(payload: PayloadDto) {
    return payload;
  }
}
