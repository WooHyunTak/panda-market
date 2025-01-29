import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtOptionalStrategy } from 'src/common/strategyies/jwt.optional.strategy';
import { JwtStrategy } from 'src/common/strategyies/jwt.strategy';
import { JwtRefreshStrategy } from 'src/common/strategyies/jwt.refresh';
import { CommonModule } from 'src/common/common.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [CommonModule, UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtOptionalStrategy,
    JwtRefreshStrategy,
  ],
  exports: [AuthService, JwtStrategy, JwtOptionalStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
