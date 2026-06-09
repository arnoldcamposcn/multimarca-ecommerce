import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartItem } from '../../features/cart/models/cart-item.model';
import { Product } from '../../features/products/models/product.model';
import { Variant } from '../../features/products/models/variant.model';


interface Ga4Item {
  item_id: string;
  item_name: string;
  item_category: string;
  price: number;
  quantity: number;
  item_variant?: string;
}

interface Ga4EcommerceEvent {
  event: string;
  ecommerce: {
    currency: 'PEN';
    value: number;
    items: Ga4Item[];
    coupon?: string;
  };
}


@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));


  viewItem(product: Product, variant?: Variant): void {
    const activeVariant = variant ?? product.variants[0];

    this.push({
      event: 'view_item',
      ecommerce: {
        currency: 'PEN',
        value: activeVariant?.price ?? 0,
        items: [this.toGa4Item(product, activeVariant, 1)],
      },
    });
  }


  addToCart(product: Product, variant: Variant, quantity = 1): void {
    this.push({
      event: 'add_to_cart',
      ecommerce: {
        currency: 'PEN',
        value: variant.price * quantity,
        items: [this.toGa4Item(product, variant, quantity)],
      },
    });
  }


  beginCheckout(items: CartItem[], subtotal: number): void {
    this.push({
      event: 'begin_checkout',
      ecommerce: {
        currency: 'PEN',
        value: subtotal,
        items: items.map((item) => ({
          item_id: String(item.id),
          item_name: item.name,
          item_category: '',
          item_variant: item.presentation,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    });
  }


  private toGa4Item(product: Product, variant: Variant | undefined, quantity: number): Ga4Item {
    return {
      item_id: String(product.id),
      item_name: product.name,
      item_category: product.category,
      item_variant: variant ? `${variant.name} ${variant.units} UN` : undefined,
      price: variant?.price ?? 0,
      quantity,
    };
  }

 
  private push(payload: Ga4EcommerceEvent): void {
    if (!this.isBrowser) return;

    const w = window as unknown as Record<string, unknown[]>;

    w['dataLayer'] ??= [];
    w['dataLayer'].push({ ecommerce: null });
    w['dataLayer'].push(payload);
  }
}
