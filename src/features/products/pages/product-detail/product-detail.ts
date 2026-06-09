import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/products.service';
import { Product } from '../../models/product.model';
import { CartService } from '../../../cart/services/cart.service';
import { ButtonComponent } from '../../../../shared/ui/atoms/button/button';
import { ProductInformationComponent } from '../../components/product-information/product-information';
import { RelatedProductsComponent } from '../../components/related-products/related-products';
import { ProductGalleryComponent } from '../../components/product-gallery/product-gallery';
import { Breadcrumb } from '../../../../shared/ui/molecules/breadcrumb/breadcrumb';
import { FavoriteButtonComponent } from '../../../../shared/ui/atoms/favorite-button/favorite-button';
import { QuantitySelectorComponent } from '../../../../shared/ui/molecules/quantity-selector/quantity-selector';
import { ProductVariantComponent } from '../../../../shared/ui/molecules/product-variant/product-variant';
import { IconComponent } from '../../../../shared/ui/atoms/icon/icon';
import { PromoTagComponent } from '../../../../shared/ui/atoms/promo-tag/promo-tag';
import { StateFeedback } from '../../../../shared/ui/molecules/state-feedback/state-feedback';
import { SeoService } from '../../../../core/services/seo.service';
import { AnalyticsService } from '../../../../core/services/analytics.service';

type ProductDetailState = {
  product: Product | undefined;
  loading: boolean;
  error: string | null;
};

@Component({
  selector: 'app-product-detail',
  imports: [
    ButtonComponent,
    ProductInformationComponent,
    RelatedProductsComponent,
    ProductGalleryComponent,
    Breadcrumb,
    FavoriteButtonComponent,
    QuantitySelectorComponent,
    ProductVariantComponent,
    IconComponent,
    PromoTagComponent,
    StateFeedback,
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly seoService = inject(SeoService);
  private readonly analyticsService = inject(AnalyticsService);


  readonly productState = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('slug') ?? ''),
      switchMap((slug) =>
        this.productService.getProductBySlug(slug).pipe(
          map((product) => ({
            product,
            loading: false,
            error: product ? null : 'No encontramos el producto solicitado.',
          })),
          catchError(() =>
            of({
              product: undefined as Product | undefined,
              loading: false,
              error: 'No pudimos cargar la ficha del producto. Intentalo nuevamente.',
            }),
          ),
          startWith({
            product: undefined as Product | undefined,
            loading: true,
            error: null as string | null,
          }),
        ),
      ),
    ),
    {
      initialValue: {
        product: undefined as Product | undefined,
        loading: true,
        error: null as string | null,
      } satisfies ProductDetailState,
    },
  );

  readonly product = computed(() => this.productState().product);
  readonly isLoading = computed(() => this.productState().loading);
  readonly error = computed(() => this.productState().error);


  readonly relatedProducts = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('slug') ?? ''),
      switchMap((slug) =>
        this.productService.getProductBySlug(slug).pipe(
          switchMap((product) =>
            product
              ? this.productService.getRelatedProducts(product).pipe(
                  catchError(() => of([])),
                )
              : of([]),
          ),
        ),
      ),
    ),
    { initialValue: [] },
  );


  readonly selectedVariantIndex = signal(0);

  readonly selectedVariant = computed(() => {
    const product = this.product();
    const index = this.selectedVariantIndex();

    if (!product) {
      return null;
    }

    return product.variants[index] ?? product.variants[0] ?? null;
  });

  readonly prices = computed(() => {
    const product = this.product();
    const variant = this.selectedVariant();

    if (!product || !variant) {
      return null;
    }

    const regularPrice = variant.price;

    return {
      regularPrice,
      promotionPrice: this.applyDiscount(regularPrice, product.discounts.promotion),
      cardPrice: this.applyDiscount(regularPrice, product.discounts.card),
    };
  });

  readonly addedToCart = computed(() => {
    const product = this.product();

    if (!product) {
      return false;
    }

    return this.cartService.items().some((item) => item.id === product.id);
  });

  readonly cartQuantity = computed(() => {
    const product = this.product();

    if (!product) {
      return 0;
    }

    return (
      this.cartService.items().find((item) => item.id === product.id)?.quantity ?? 0
    );
  });

  constructor() {
    effect(() => {
      const product = this.product();
      const index = this.selectedVariantIndex();

      if (!product || index > product.variants.length - 1) {
        this.selectedVariantIndex.set(0);
      }
    });

    effect(() => {
      const product = this.product();

      if (!product) {
        return;
      }

      this.seoService.update({
        title: product.name,
        description: product.shortDescription,
        image: product.images[0],
        url: `/categorias/${product.category}/${product.slug}`,
        type: 'product',
      });

      this.analyticsService.viewItem(product, this.selectedVariant() ?? undefined);
    });
  }

  onAddToCart(): void {
    const product = this.product();
    const variant = this.selectedVariant();

    if (!product || !variant) {
      return;
    }

    this.cartService.add({
      id: product.id,
      name: product.name,
      image: product.images[0],
      presentation: `${variant.name} ${variant.units} UN`,
      price: variant.price,
      quantity: 1,
    });

    this.analyticsService.addToCart(product, variant, 1);
  }

  selectVariant(index: number): void {
    const product = this.product();
    const variant = product?.variants[index];

    this.selectedVariantIndex.set(index);

    if (!product || !variant) {
      return;
    }

    this.cartService.updatePresentation(
      product.id,
      `${variant.name} ${variant.units} UN`,
      variant.price,
    );
  }

  increaseQuantity(): void {
    const product = this.product();

    if (product) {
      this.cartService.increase(product.id);
    }
  }

  decreaseQuantity(): void {
    const product = this.product();

    if (product) {
      this.cartService.decrease(product.id);
    }
  }

  onRemoveFromCart(): void {
    const product = this.product();

    if (product) {
      this.cartService.remove(product.id);
    }
  }

  onRetry(): void {
    this.productService.invalidateCache();
  }

  private applyDiscount(basePrice: number, discountPct: number): number {
    return Number((basePrice * (1 - discountPct / 100)).toFixed(2));
  }
}
