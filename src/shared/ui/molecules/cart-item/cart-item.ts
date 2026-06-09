import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-cart-item',
  imports: [],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.scss',
})

export class CartItemComponent {

  readonly productId = input.required<number>();

  readonly image = input.required<string>();

  readonly title = input.required<string>();

  readonly presentation = input('');

  readonly price = input.required<number>();

  readonly quantity = input<number>(1);

  readonly remove = output<number>();

  onRemove(): void {

    this.remove.emit(
      this.productId()
    );

  }

}
