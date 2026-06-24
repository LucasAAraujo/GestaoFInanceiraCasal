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

  async updatePassword(userId: string, password: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { password },
    });
  }

  async updateProfile(userId: string, data: { name?: string; avatarUrl?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async createPasswordResetToken(data: {
    userId: string;
    token: string;
    expiresAt: Date;
  }) {
    return this.prisma.passwordResetToken.create({ data });
  }

  async findPasswordResetToken(token: string) {
    return this.prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async deletePasswordResetToken(token: string) {
    return this.prisma.passwordResetToken.delete({ where: { token } });
  }

  async deleteUserPasswordResetTokens(userId: string) {
    return this.prisma.passwordResetToken.deleteMany({ where: { userId } });
  }
}
