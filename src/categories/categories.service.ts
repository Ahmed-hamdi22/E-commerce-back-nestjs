import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  private categories: Category[] = [
    {
      id: 1,
      name: 'Electronics',
      description: 'Smartphones, laptops, headphones, and modern gadgets',
      createdAt: new Date('2026-01-10'),
    },
    {
      id: 2,
      name: 'Fashion & Apparel',
      description: 'Trendy clothing, shoes, watches, and accessories',
      createdAt: new Date('2026-01-12'),
    },
    {
      id: 3,
      name: 'Home & Kitchen',
      description: 'Home appliances, cookware, and decorative goods',
      createdAt: new Date('2026-01-15'),
    },
  ];

  findAll(): Category[] {
    return this.categories;
  }

  findById(id: number): Category {
    const category = this.categories.find((c) => c.id === id);
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return category;
  }

  create(dto: CreateCategoryDto): Category {
    const exists = this.categories.some(
      (c) => c.name.toLowerCase() === dto.name.toLowerCase(),
    );
    if (exists) {
      throw new ConflictException(`Category with name "${dto.name}" already exists`);
    }

    const newCategory: Category = {
      id: this.categories.length ? Math.max(...this.categories.map((c) => c.id)) + 1 : 1,
      name: dto.name,
      description: dto.description,
      createdAt: new Date(),
    };

    this.categories.push(newCategory);
    return newCategory;
  }

  update(id: number, dto: UpdateCategoryDto): Category {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Category #${id} not found`);
    }

    if (dto.name) {
      const exists = this.categories.some(
        (c) => c.id !== id && c.name.toLowerCase() === dto.name!.toLowerCase(),
      );
      if (exists) {
        throw new ConflictException(`Category with name "${dto.name}" already exists`);
      }
    }

    this.categories[index] = {
      ...this.categories[index],
      ...dto,
    };

    return this.categories[index];
  }

  remove(id: number): { message: string; deletedId: number } {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new NotFoundException(`Category #${id} not found`);
    }

    this.categories.splice(index, 1);
    return {
      message: `Category #${id} deleted successfully`,
      deletedId: id,
    };
  }
}
