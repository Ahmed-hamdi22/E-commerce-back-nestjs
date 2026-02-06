import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Wireless Noise-Canceling Headphones',
      description: 'High-fidelity audio with active noise cancellation and 30h battery life.',
      price: 199.99,
      categoryId: 1, // Electronics
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      createdAt: new Date('2026-01-20'),
    },
    {
      id: 2,
      name: 'Mechanical Gaming Keyboard',
      description: 'RGB backlit mechanical keyboard with blue tactile switches.',
      price: 89.5,
      categoryId: 1, // Electronics
      stock: 40,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
      createdAt: new Date('2026-01-22'),
    },
    {
      id: 3,
      name: 'Classic Cotton Oversized T-Shirt',
      description: '100% premium combed organic cotton for maximum comfort and style.',
      price: 29.99,
      categoryId: 2, // Fashion
      stock: 60,
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
      createdAt: new Date('2026-01-25'),
    },
    {
      id: 4,
      name: 'Automatic Espresso Coffee Maker',
      description: 'Compact 15-bar Italian pump coffee machine with integrated milk frother.',
      price: 149.0,
      categoryId: 3, // Home & Kitchen
      stock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500',
      createdAt: new Date('2026-01-28'),
    },
  ];

  constructor(private readonly categoriesService: CategoriesService) {}

  getProducts(categoryId?: number, search?: string): Product[] {
    let result = [...this.products];

    if (categoryId) {
      result = result.filter((p) => p.categoryId === categoryId);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      );
    }

    return result;
  }

  getSingleProduct(id: number): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  createNewProduct(dto: CreateProductDto): Product {
    // Validate category exists
    this.categoriesService.findById(dto.categoryId);

    const newProduct: Product = {
      id: this.products.length ? Math.max(...this.products.map((p) => p.id)) + 1 : 1,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      categoryId: dto.categoryId,
      stock: dto.stock ?? 10,
      imageUrl: dto.imageUrl ?? 'https://placehold.co/400x300?text=Product',
      createdAt: new Date(),
    };

    this.products.push(newProduct);
    return newProduct;
  }

  updateProduct(id: number, dto: UpdateProductDto): Product {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    if (dto.categoryId !== undefined) {
      this.categoriesService.findById(dto.categoryId);
    }

    this.products[index] = {
      ...this.products[index],
      ...dto,
    };

    return this.products[index];
  }

  removeProduct(id: number): { message: string; deletedId: number } {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    this.products.splice(index, 1);
    return {
      message: `Product #${id} deleted successfully`,
      deletedId: id,
    };
  }
}
