import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartUiService {

  readonly isMiniCartOpen = signal(false);

  open(): void {
    this.isMiniCartOpen.set(true);
  }

  close(): void {
    this.isMiniCartOpen.set(false);
  }

  toggle(): void {
    this.isMiniCartOpen.update(value => !value);
  }

}
