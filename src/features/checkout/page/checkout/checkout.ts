import { Component, computed, inject } from '@angular/core';
import { CartService } from '../../../cart/services/cart.service';

@Component({
  selector: 'app-checkout',
  imports: [],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  private readonly cartService = inject(CartService);

  readonly cartItems = this.cartService.items;

  readonly cartCount = computed(() => this.cartItems().length);

  readonly subtotal = computed(() =>
    this.cartItems().reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  );
}
