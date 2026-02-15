export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  itemTotal: number;
  imageUrl?: string;
}

export interface UserCart {
  userId: number;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  updatedAt: Date;
}
