import {
  Injectable,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  private readonly platformId = inject(PLATFORM_ID);

  private readonly isBrowser = isPlatformBrowser(
    this.platformId
  );

  private readonly STORAGE_KEY = 'cart';

  readonly items = signal<CartItem[]>(
    this.loadItems()
  );

  private loadItems(): CartItem[] {

    if (!this.isBrowser) {
      return [];
    }

    const cart = localStorage.getItem(
      this.STORAGE_KEY
    );

    if (!cart) {
      return [];
    }

    const parsedItems = JSON.parse(cart) as Array<CartItem & { regularPrice?: number; presentation?: string }>;

    return parsedItems.map((item) => ({
      ...item,
      price: item.price ?? item.regularPrice ?? 0,
      presentation: item.presentation ?? '',
    }));
  }

  private save(items: CartItem[]): void {

    if (!this.isBrowser) {
      return;
    }

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(items)
    );

  }

  add(item: CartItem): void {

    const items = this.items();

    const existing = items.find(
      product => product.id === item.id
    );

    if (existing) {

      existing.quantity++;

      this.items.set([...items]);

      this.save(this.items());

      return;
    }

    const updated = [
      ...items,
      item,
    ];

    this.items.set(updated);

    this.save(updated);

  }

  increase(productId: number): void {

    const items = this.items();

    const item = items.find(
      product => product.id === productId
    );

    if (!item) {
      return;
    }

    item.quantity++;

    this.items.set([...items]);

    this.save(this.items());

  }

  decrease(productId: number): void {

    const items = this.items();

    const item = items.find(
      product => product.id === productId
    );

    if (!item) {
      return;
    }

    if (item.quantity > 1) {

      item.quantity--;

      this.items.set([...items]);

      this.save(this.items());

    }

  }

  remove(productId: number): void {

    const updated = this.items().filter(
      item => item.id !== productId
    );

    this.items.set(updated);

    this.save(updated);

  }

  updatePresentation(
    productId: number,
    presentation: string,
    price: number
  ): void {
    const items = this.items();

    const item = items.find(
      (product) => product.id === productId
    );

    if (!item) {
      return;
    }

    item.presentation = presentation;
    item.price = price;

    this.items.set([...items]);
    this.save(this.items());
  }

}
