import { Routes } from '@angular/router';

export const CHECKOUT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./page/checkout/checkout')
        .then(c => c.Checkout)
  }
];
