import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: { name: string; email: string; password: string }) {
    return this.prisma.user.create({ data });
  }

  async createRefreshToken(data: {
    userId: string;
    token: string;
    expiresAt: Date;
  }) {
    return this.prisma.refreshToken.create({ data });
  }

  async findRefreshToken(token: string) {
    return this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async deleteRefreshToken(token: string) {
    return this.prisma.refreshToken.delete({ where: { token } });
  }

  async deleteUserRefreshTokens(userId: string) {
    return this.prisma.refreshToken.deleteMany({ where: { userId } });
  }
}
