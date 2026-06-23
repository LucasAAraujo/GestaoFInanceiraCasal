import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.category.findMany({
      where: { tenantId, isArchived: false },
      orderBy: { name: 'asc' },
    });
  }

  async findById(tenantId: string, id: string) {
    return this.prisma.category.findFirst({
      where: { id, tenantId },
    });
  }

  async create(tenantId: string, dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: { tenantId, ...dto },
    });
  }

  async createMany(tenantId: string, categories: Omit<CreateCategoryDto, never>[]) {
    return this.prisma.category.createMany({
      data: categories.map((c) => ({ tenantId, isDefault: true, ...c })),
    });
  }

  async update(tenantId: string, id: string, dto: UpdateCategoryDto) {
    return this.prisma.category.updateMany({
      where: { id, tenantId },
      data: dto,
    });
  }

  async archive(tenantId: string, id: string) {
    return this.prisma.category.updateMany({
      where: { id, tenantId },
      data: { isArchived: true },
    });
  }
}
