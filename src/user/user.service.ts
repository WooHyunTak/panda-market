import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(data: CreateUserDto) {
    const user = await this.userRepository.createUser(data);
    const { refreshToken, password, ...result } = user;
    return result;
  }

  async login(data: LoginUserDto) {
    const user = await this.userRepository.getUserByEmail(data.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatch = await bcrypt.compare(data.password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const { refreshToken, password, ...result } = user;
    return result;
  }

  async getUser(id: string) {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { refreshToken, password, ...result } = user;
    return result;
  }

  async checkRefreshToken(id: string, refreshToken: string) {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return true;
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    const user = await this.userRepository.updateRefreshToken(id, refreshToken);
    return user;
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
}
