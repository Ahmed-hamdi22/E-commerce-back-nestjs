import { CartItem } from '../cart/cart.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DELIVERED = 'DELIVERED',
}

export interface Order {
  id: number;
  userId: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  notes?: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  whatsAppLink: string;
  createdAt: Date;
}
