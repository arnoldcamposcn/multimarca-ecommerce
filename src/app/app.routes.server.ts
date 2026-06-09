import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'carrito', renderMode: RenderMode.Server },
  { path: 'checkout', renderMode: RenderMode.Server },
  { path: 'categorias/:category', renderMode: RenderMode.Server },
  { path: 'categorias/:category/:slug', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Prerender },
];
