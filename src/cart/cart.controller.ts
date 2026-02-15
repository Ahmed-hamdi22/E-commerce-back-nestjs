import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req: any) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('items')
  addToCart(@Request() req: any, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(req.user.id, dto);
  }

  @Patch('items/:productId')
  updateQuantity(
    @Request() req: any,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateQuantity(req.user.id, productId, dto.quantity);
  }

  @Delete('items/:productId')
  removeItem(
    @Request() req: any,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.cartService.removeItem(req.user.id, productId);
  }

  @Delete()
  clearCart(@Request() req: any) {
    return this.cartService.clearCart(req.user.id);
  }
}
