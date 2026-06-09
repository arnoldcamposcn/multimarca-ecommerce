import { Component, computed, inject, output } from '@angular/core';
import { CartItemComponent } from '../../../../shared/ui/molecules/cart-item/cart-item';
import { CartUiService } from '../../services/cart-ui';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { IconComponent } from '../../../../shared/ui/atoms/icon/icon';
import { ButtonComponent } from '../../../../shared/ui/atoms/button/button';


@Component({
  selector: 'app-mini-cart-drawer',
  imports: [CartItemComponent, IconComponent, ButtonComponent],
  templateUrl: './mini-cart-drawer.html',
  styleUrl: './mini-cart-drawer.scss',
})
export class MiniCartDrawer {

  readonly cartUiService = inject(CartUiService);
  readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  close(): void {
    this.cartUiService.close();
  }

  readonly cartCount = computed(() => {

  return this.cartService
    .items()
    .length;

});


readonly subtotal = computed(() => {

  return this.cartService
    .items()
    .reduce(
      (total, item) =>
        total + (item.price * item.quantity),
      0
    );

});

removeItem(productId: number): void {

  this.cartService.remove(
    productId
  );

}

  goToCart(): void {
    this.router.navigate(['/carrito']);
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
