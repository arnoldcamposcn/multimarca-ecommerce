import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input
} from '@angular/core';

import { Product } from '../../models/product.model';
import { ProductCardComponent } from '../product-card/product-card';
import { CarouselComponent } from '../../../../shared/ui/organisms/carousel/carousel';


@Component({
  selector: 'app-related-products',

  imports: [
    CarouselComponent,
    ProductCardComponent
  ],

  templateUrl: './related-products.html',
  styleUrl: './related-products.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RelatedProductsComponent {

  products = input.required<Product[]>();

}