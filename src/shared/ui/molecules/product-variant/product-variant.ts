import { Component, input, output } from '@angular/core';
import { ProductVariant } from '../../../../features/products/models/product-variant.model';

@Component({
  selector: 'app-product-variant',
  imports: [],
  templateUrl: './product-variant.html',
  styleUrl: './product-variant.scss',
})

export class ProductVariantComponent {

  readonly variant = input.required<ProductVariant>();
  readonly productImage = input('');

  readonly selected = input(false);
  readonly isFirst = input(false);
  readonly isLast = input(false);
  readonly selectedChange = output<void>();

  readonly imageSrc = () => this.productImage() || this.variant().image;

  onSelect(): void {
    this.selectedChange.emit();
  }

}