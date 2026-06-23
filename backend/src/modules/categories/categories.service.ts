import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async findAll(tenantId: string) {
    return this.categoriesRepository.findAll(tenantId);
  }

  async create(tenantId: string, dto: CreateCategoryDto) {
    return this.categoriesRepository.create(tenantId, dto);
  }

  async update(tenantId: string, id: string, dto: UpdateCategoryDto) {
    const category = await this.categoriesRepository.findById(tenantId, id);
    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    await this.categoriesRepository.update(tenantId, id, dto);
    return this.categoriesRepository.findById(tenantId, id);
  }

  async archive(tenantId: string, id: string) {
    const category = await this.categoriesRepository.findById(tenantId, id);
    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    await this.categoriesRepository.archive(tenantId, id);
    return { message: 'Categoria arquivada com sucesso' };
  }
}
