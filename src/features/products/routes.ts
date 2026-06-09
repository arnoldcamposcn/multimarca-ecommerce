import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [

  {
    path: ':category/:slug',
    loadComponent: () =>
      import('./pages/product-detail/product-detail')
        .then(c => c.ProductDetail)
  },

  {
    path: ':category',
    loadComponent: () =>
      import('./pages/product-list/product-list')
        .then(c => c.ProductList)
  }

];
