import { Component, computed, inject, input } from '@angular/core';
import { FavoriteButtonComponent } from '../../../../shared/ui/atoms/favorite-button/favorite-button';
import { ButtonComponent } from '../../../../shared/ui/atoms/button/button';
import { TagComponent } from '../../../../shared/ui/atoms/tag/tag';
import { QuantitySelectorComponent } from '../../../../shared/ui/molecules/quantity-selector/quantity-selector';
import { Product } from '../../models/product.model';
import { CartService } from '../../../cart/services/cart.service';
import { Router } from '@angular/router';
import { PromoTagComponent } from '../../../../shared/ui/atoms/promo-tag/promo-tag';
import { IconComponent } from '../../../../shared/ui/atoms/icon/icon';
import { AnalyticsService } from '../../../../core/services/analytics.service';

@Component({
  selector: 'app-product-card',
  imports: [
    FavoriteButtonComponent,
    ButtonComponent,
    TagComponent,
    QuantitySelectorComponent,
    PromoTagComponent,
    IconComponent
  ],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  /** True para las primeras cards visibles sin scroll (LCP candidates) */
  readonly priority = input(false);

  readonly cartService = inject(CartService);
  readonly router = inject(Router);
  private readonly analyticsService = inject(AnalyticsService);

  readonly addedToCart = computed(() => {
    return this.cartService.items().some((item) => item.id === this.product().id);
  });

  readonly cartQuantity = computed(() => {
    const item = this.cartService.items().find((item) => item.id === this.product().id);

    return item?.quantity ?? 0;
  });

  readonly prices = computed(() => {
    const product = this.product();
    const regular = product.variants[0]?.price ?? 0;
    const promo = this.applyDiscount(regular, product.discounts.promotion);
    const card = this.applyDiscount(regular, product.discounts.card);

    return { regular, promo, card };
  });

  onAddToCart(): void {
    const product = this.product();
    const firstVariant = product.variants[0];

    this.cartService.add({
      id: product.id,
      name: product.name,
      image: product.images[0],
      presentation: firstVariant ? `${firstVariant.name} ${firstVariant.units} UN` : '',
      price: firstVariant?.price ?? 0,
      quantity: 1,
    });

    if (firstVariant) {
      this.analyticsService.addToCart(product, firstVariant, 1);
    }
  }

  increaseQuantity(): void {
    this.cartService.increase(this.product().id);
  }

  decreaseQuantity(): void {
    this.cartService.decrease(this.product().id);
  }

  onRemoveFromCart(): void {
    this.cartService.remove(this.product().id);
  }

  navigateToProduct(): void {
    const product = this.product();

    this.router.navigate(['/categorias', product.category, product.slug]);
  }

  private applyDiscount(basePrice: number, discountPercentage: number): number {
    return Number((basePrice * (1 - discountPercentage / 100)).toFixed(2));
  }
}
