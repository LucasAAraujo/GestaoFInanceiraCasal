import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository.js';
import { UpdateProfileDto, ChangePasswordDto } from './dto/update-profile.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findById(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.usersRepository.updateProfile(id, dto);
    return this.findById(id);
  }

  async changePassword(id: string, dto: ChangePasswordDto) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const valid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!valid) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.usersRepository.updatePassword(id, hashed);
    return { message: 'Senha alterada com sucesso' };
  }
}
