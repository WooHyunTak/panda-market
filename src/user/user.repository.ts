import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prismaService';
import { CreateUserDto } from './dto/create.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  getUsers() {
    return this.prismaService.user.findMany();
  }

  getUserByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        nickname: true,
        refreshToken: true,
      },
    });
  }

  getUserById(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        password: true,
        nickname: true,
        refreshToken: true,
      },
    });
  }

  createUser(data: CreateUserDto) {
    return this.prismaService.user.create({
      data,
      select: {
        id: true,
        email: true,
        password: true,
        nickname: true,
        refreshToken: true,
      },
    });
  }

  updateRefreshToken(id: string, refreshToken: string) {
    return this.prismaService.user.update({
      where: { id },
      data: { refreshToken },
      select: {
        id: true,
        email: true,
        password: true,
        nickname: true,
        refreshToken: true,
      },
    });
  }
}
