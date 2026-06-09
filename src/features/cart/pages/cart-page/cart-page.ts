import { Component, computed, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { QuantitySelectorComponent } from '../../../../shared/ui/molecules/quantity-selector/quantity-selector';
import { Router } from '@angular/router';
import { AnalyticsService } from '../../../../core/services/analytics.service';

@Component({
  selector: 'app-cart-page',
  imports: [QuantitySelectorComponent],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
})
export class CartPage {

  readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly analyticsService = inject(AnalyticsService);

  readonly items = this.cartService.items;

  readonly subtotal = computed(() => {

    return this.items().reduce(
      (total, item) =>
        total + (item.price * item.quantity),
      0
    );

  });

  increase(productId: number): void {

    this.cartService.increase(
      productId
    );

  }

  decrease(productId: number): void {

    this.cartService.decrease(
      productId
    );

  }

  remove(productId: number): void {

    this.cartService.remove(
      productId
    );

  }

  getVariantName(presentation: string): string {
    const value = presentation?.trim();
    if (!value) {
      return '';
    }

    return value.split(/\s+/)[0] ?? value;
  }

  goToCheckout(): void {
    this.analyticsService.beginCheckout(this.items(), this.subtotal());
    this.router.navigate(['/checkout']);
  }

}
