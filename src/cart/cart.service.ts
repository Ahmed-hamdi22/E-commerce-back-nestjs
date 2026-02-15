import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserCart, CartItem } from './cart.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  // Map of userId -> UserCart
  private carts: Map<number, UserCart> = new Map();

  constructor(private readonly productsService: ProductsService) {}

  private getOrCreateCart(userId: number): UserCart {
    let cart = this.carts.get(userId);
    if (!cart) {
      cart = {
        userId,
        items: [],
        totalItems: 0,
        totalPrice: 0,
        updatedAt: new Date(),
      };
      this.carts.set(userId, cart);
    }
    return cart;
  }

  private recalculate(cart: UserCart): void {
    let totalItems = 0;
    let totalPrice = 0;

    for (const item of cart.items) {
      item.itemTotal = Number((item.price * item.quantity).toFixed(2));
      totalItems += item.quantity;
      totalPrice += item.itemTotal;
    }

    cart.totalItems = totalItems;
    cart.totalPrice = Number(totalPrice.toFixed(2));
    cart.updatedAt = new Date();
  }

  getCart(userId: number): UserCart {
    const cart = this.getOrCreateCart(userId);
    this.recalculate(cart);
    return cart;
  }

  addToCart(userId: number, dto: AddToCartDto): UserCart {
    const product = this.productsService.getSingleProduct(dto.productId);
    const cart = this.getOrCreateCart(userId);
    const quantity = dto.quantity && dto.quantity > 0 ? dto.quantity : 1;

    const existingIndex = cart.items.findIndex(
      (item) => item.productId === dto.productId,
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      const newItem: CartItem = {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity,
        itemTotal: Number((product.price * quantity).toFixed(2)),
        imageUrl: product.imageUrl,
      };
      cart.items.push(newItem);
    }

    this.recalculate(cart);
    return cart;
  }

  updateQuantity(userId: number, productId: number, quantity: number): UserCart {
    if (quantity <= 0) {
      return this.removeItem(userId, productId);
    }

    const cart = this.getOrCreateCart(userId);
    const item = cart.items.find((i) => i.productId === productId);

    if (!item) {
      throw new NotFoundException(`Product #${productId} is not in your cart`);
    }

    item.quantity = quantity;
    this.recalculate(cart);
    return cart;
  }

  removeItem(userId: number, productId: number): UserCart {
    const cart = this.getOrCreateCart(userId);
    const initialLength = cart.items.length;
    cart.items = cart.items.filter((item) => item.productId !== productId);

    if (cart.items.length === initialLength) {
      throw new NotFoundException(`Product #${productId} is not in your cart`);
    }

    this.recalculate(cart);
    return cart;
  }

  clearCart(userId: number): UserCart {
    const cart = this.getOrCreateCart(userId);
    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;
    cart.updatedAt = new Date();
    return cart;
  }
}
