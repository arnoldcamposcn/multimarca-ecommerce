import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, delay, map, shareReplay, switchMap } from 'rxjs';

import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  private readonly reload$ = new BehaviorSubject<number>(0);

  private readonly products$ = this.reload$.pipe(
    switchMap(() =>
      this.http
        .get<Product[]>('/assets/data/products.json')
        .pipe(delay(1000)),
    ),
    shareReplay(1),
  );

  getProducts(): Observable<Product[]> {
    return this.products$;
  }

  getProductBySlug(slug: string): Observable<Product | undefined> {
    return this.products$.pipe(
      map((products) => products.find((product) => product.slug === slug)),
    );
  }

  getRelatedProducts(currentProduct: Product): Observable<Product[]> {
    return this.products$.pipe(
      map((products) =>
        products.filter(
          (product) =>
            product.category === currentProduct.category &&
            product.id !== currentProduct.id,
        ),
      ),
    );
  }

  invalidateCache(): void {
    this.reload$.next(this.reload$.value + 1);
  }
}
