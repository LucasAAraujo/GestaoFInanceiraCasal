import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../users/users.repository.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.usersRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    const { password: _, ...result } = user;
    return result;
  }
}
