import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'categorias/todos',
    pathMatch: 'full',
  },
  {
    path: 'carrito',
    loadChildren: () => import('../features/cart/route').then((r) => r.CART_ROUTES),
  },
  {
    path: 'checkout',
    loadChildren: () => import('../features/checkout/route').then((r) => r.CHECKOUT_ROUTES),
  },
  {
    path: 'categorias',
    loadChildren: () => import('../features/products/routes').then((r) => r.PRODUCTS_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'categorias/todos',
  },
];
