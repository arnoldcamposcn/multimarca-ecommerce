import { Component, input, output, signal } from '@angular/core';
import { IconComponent } from '../../atoms/icon/icon';

@Component({
  selector: 'app-quantity-selector',
  imports: [IconComponent],
  templateUrl: './quantity-selector.html',
  styleUrl: './quantity-selector.scss',
})

export class QuantitySelectorComponent {

  readonly quantity = input.required<number>();

  readonly incremented = output<void>();

  readonly decremented = output<void>();

  readonly removed = output<void>();

  increment(): void {
    this.incremented.emit();
  }

  decrement(): void {
    this.decremented.emit();
  }

  remove(): void {
    this.removed.emit();
  }

}
