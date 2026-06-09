import { Discount } from './discount.model';
import { Variant } from './variant.model';

export interface Product {
  id: number;
  sku: string;
  slug: string;

  name: string;
  category: string;

  shortDescription: string;
  longDescription: string;
  composition: string;
  contraindications: string;

  images: string[];

  discounts: Discount;

  variants: Variant[];

  searchCount: number;

  relatedProductIds: number[];
}
