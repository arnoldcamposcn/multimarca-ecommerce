import { Component, computed, effect, inject, signal } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, catchError, of, startWith } from 'rxjs';

import { CategoryFilterComponent } from '../../components/category-filter/category-filter';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { ProductService } from '../../services/products.service';
import { MiniCartDrawer } from '../../../cart/components/mini-cart-drawer/mini-cart-drawer';
import { StateFeedback } from '../../../../shared/ui/molecules/state-feedback/state-feedback';
import { SeoService } from '../../../../core/services/seo.service';

type ProductsState = {
  products: any[];
  loading: boolean;
  error: string | null;
};

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CategoryFilterComponent, ProductCardComponent, MiniCartDrawer, StateFeedback],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly seoService = inject(SeoService);

  readonly productsState = toSignal(
    this.productService.getProducts().pipe(
      map((products) => ({
        products,
        loading: false,
        error: null,
      })),
      startWith({
        products: [],
        loading: true,
        error: null,
      }),
      catchError(() =>
        of({
          products: [],
          loading: false,
          error: 'No se pudieron cargar los productos',
        }),
      ),
    ),
    {
      initialValue: {
        products: [],
        loading: true,
        error: null,
      },
    },
  );

  readonly products = computed(() => this.productsState().products);

  readonly isLoading = computed(() => this.productsState().loading);

  readonly error = computed(() => this.productsState().error);

  readonly isEmpty = computed(
    () => !this.isLoading() && !this.error() && this.products().length === 0,
  );

  readonly isSuccess = computed(
    () => !this.isLoading() && !this.error() && this.products().length > 0,
  );

  readonly categories = computed(() => {
    const products = this.products();
    const unique = [...new Set(products.map((p) => p.category))].sort();

    return ['todos', ...unique];
  });

  readonly selectedCategory = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('category') ?? 'todos')),
    {
      initialValue: 'todos',
    },
  );

  readonly filteredProducts = computed(() => {
    const category = this.selectedCategory();
    const products = this.products();

    if (category === 'todos') return products;

    return products.filter((p) => p.category === category);
  });

  readonly categoryTitle = computed(() => {
    const category = this.selectedCategory();
    return category === 'todos' ? 'Todos los productos' : this.toTitleCase(category);
  });

  readonly isMiniCartOpen = signal(false);

  constructor() {
    effect(() => {
      const category = this.selectedCategory();
      const label = category === 'todos' ? 'Todos los productos' : this.toTitleCase(category);

      this.seoService.update({
        title: label,
        description: `Explora nuestra selección de ${label.toLowerCase()} con los mejores precios y entregas a domicilio.`,
        url: `/categorias/${category}`,
      });
    });
  }

  onCategorySelected(category: string) {
    this.router.navigate(['/categorias', category]);
  }

  onClearFilters() {
    this.router.navigate(['/categorias', 'todos']);
  }

  openMiniCart(): void {
    this.isMiniCartOpen.set(true);
  }

  onRetry(): void {
    this.productService.invalidateCache();
  }

  private toTitleCase(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
