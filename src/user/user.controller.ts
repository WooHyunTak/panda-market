import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create.dto';
import { LoginUserDto } from './dto/login.dto';
import createToken from 'src/common/utils/createToken';
import { Request, Response } from 'express';
import {
  cookieOptions,
  refreshCookieOptions,
} from 'src/common/configs/cookieOptions';
import { User } from 'src/common/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { PayloadDto } from 'src/common/strategyies/dto/payload.dto';
import { JwtRefreshGuard } from 'src/common/guards/jwt.refresh.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() data: CreateUserDto, @Res() res: Response) {
    const user = await this.userService.createUser(data);
    const accessToken = createToken(user, 'access');
    const refreshToken = createToken(user, 'refresh');

    res.cookie('access_token', accessToken, cookieOptions);
    res.cookie('refresh_token', refreshToken, refreshCookieOptions);

    await this.userService.updateRefreshToken(user.id, refreshToken);

    res.status(204).send();
  }

  @Post('login')
  async login(@Body() data: LoginUserDto, @Res() res: Response) {
    const user = await this.userService.login(data);
    const accessToken = createToken(user, 'access');
    const refreshToken = createToken(user, 'refresh');

    await this.userService.updateRefreshToken(user.id, refreshToken);

    res.cookie('access_token', accessToken, cookieOptions);
    res.cookie('refresh_token', refreshToken, refreshCookieOptions);

    res.status(204).send();
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getUser(@User() user: PayloadDto) {
    const userInfo = await this.userService.getUser(user.id);
    return userInfo;
  }

  @Get('refresh-token')
  @UseGuards(JwtRefreshGuard)
  async refresh(@User() user: PayloadDto, @Res() res: Response) {
    const accessToken = createToken(user, 'access');
    const refreshToken = createToken(user, 'refresh');

    res.cookie('access_token', accessToken, cookieOptions);
    res.cookie('refresh_token', refreshToken, refreshCookieOptions);

    await this.userService.updateRefreshToken(user.id, refreshToken);

    res.status(204).send();
  }
}
