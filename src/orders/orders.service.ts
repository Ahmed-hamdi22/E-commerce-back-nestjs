import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Order, OrderStatus } from './order.entity';
import { CheckoutDto } from './dto/checkout.dto';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrdersService {
  private orders: Order[] = [];

  constructor(private readonly cartService: CartService) {}

  checkout(user: { id: number; name: string; email: string }, dto: CheckoutDto) {
    const cart = this.cartService.getCart(user.id);

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Your shopping cart is empty. Add products before checkout.');
    }

    const orderId = this.orders.length ? Math.max(...this.orders.map((o) => o.id)) + 1 : 1;
    const targetWhatsAppNumber = (dto.whatsappNumber || '201000000000').replace(/[^0-9]/g, '');

    // Format WhatsApp message text
    const itemsSummary = cart.items
      .map((i) => `• ${i.productName} (x${i.quantity}) - $${i.itemTotal}`)
      .join('\n');

    const whatsappMessage =
      `🛒 *طلب جديد من متجر E-Commerce*\n\n` +
      `📦 *رقم الطلب:* #${orderId}\n` +
      `👤 *اسم العميل:* ${user.name}\n` +
      `📧 *البريد:* ${user.email}\n` +
      `📞 *الهاتف:* ${dto.customerPhone}\n` +
      `📍 *عنوان التوصيل:* ${dto.deliveryAddress}\n` +
      (dto.notes ? `📝 *ملاحظات:* ${dto.notes}\n` : '') +
      `\n📋 *المنتجات:*\n${itemsSummary}\n\n` +
      `💰 *الإجمالي النهائي:* $${cart.totalPrice}\n\n` +
      `⚡ يُرجى تأكيد الطلب للبدء في الشحن والتجهيز.`;

    const whatsAppLink = `https://wa.me/${targetWhatsAppNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    const newOrder: Order = {
      id: orderId,
      userId: user.id,
      customerName: user.name,
      customerPhone: dto.customerPhone,
      deliveryAddress: dto.deliveryAddress,
      notes: dto.notes,
      items: [...cart.items],
      totalAmount: cart.totalPrice,
      status: OrderStatus.PENDING,
      whatsAppLink,
      createdAt: new Date(),
    };

    this.orders.push(newOrder);

    // Empty user cart upon successful checkout
    this.cartService.clearCart(user.id);

    return {
      message: 'Order created successfully! Click the WhatsApp link to confirm your order.',
      order: newOrder,
      whatsAppLink,
    };
  }

  getMyOrders(userId: number): Order[] {
    return this.orders.filter((o) => o.userId === userId);
  }

  getAllOrders(): Order[] {
    return this.orders;
  }

  getOrderById(id: number): Order {
    const order = this.orders.find((o) => o.id === id);
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
  }
}
