export interface IProduct {
  id?: number;
  name: string;
  price: number;
  description?: string;
  categoryId?: number;
  stock?: number;
  imageUrl?: string;
}
