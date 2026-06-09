# Multimarca Ecommerce 

E-commerce farmacéutico en **Angular 21** con SSR híbrido, signals, SEO dinámico y Analytics GA4. Arquitectura orientada a escalabilidad multimarca.

---

## Requisitos

| Herramienta | Versión |
|---|---|
| Node.js | 20.x+ |
| npm | 10.x+ |
| Angular CLI | `npm i -g @angular/cli@21` |

---

## Instalación y ejecución

```bash
npm install

ng serve                                              # dev (cliente)
npm run serve:ssr:multimarca-ecommerce                # dev con SSR
ng build && node dist/multimarca-ecommerce/server/server.mjs  # producción
```

Accede en `http://localhost:4200`.

---

## Estructura de la solución

```
src/
├── app/
│   ├── app.routes.ts           # Lazy routing por feature (loadChildren/loadComponent)
│   └── app.routes.server.ts    # SSR híbrido: Prerender (home) / Server (PLP, PDP, transaccionales)
│
├── core/services/
│   ├── seo.service.ts          # Title, meta description, OG, Twitter Card, canonical por ruta
│   └── analytics.service.ts   # GA4 ecommerce: view_item, add_to_cart, begin_checkout
│
├── features/
│   ├── products/               # Dominio catálogo
│   │   ├── pages/              # ProductList (PLP) · ProductDetail (PDP)
│   │   ├── components/         # ProductCard · ProductGallery · ProductInformation · RelatedProducts · CategoryFilter
│   │   ├── services/           # ProductService — HTTP + shareReplay(1) + invalidateCache()
│   │   └── models/             # Product · Variant · Discount
│   ├── cart/                   # Dominio carrito
│   │   ├── services/           # CartService (signal + localStorage) · CartUiService
│   │   └── components/         # MiniCartDrawer · CartPage
│   └── checkout/               # Formulario de cierre de pedido
│
└── shared/ui/                  # Atomic Design — sin lógica de negocio
    ├── atoms/                  # Button · Icon · Badge · Tag · PromoTag · Logo · FavoriteButton
    ├── molecules/              # Breadcrumb · CartItem · QuantitySelector · SearchBar · StateFeedback
    └── organisms/              # Header · Footer · Carousel · TopBanner · CategoryNav
```



La solución combina una arquitectura **Feature-Based** para el dominio con **Atomic Design** para la capa de presentación.

Cada feature (`products`, `cart`, `checkout`) encapsula sus componentes, servicios, modelos y estado, favoreciendo la cohesión y reduciendo el acoplamiento entre dominios. Por otro lado, la capa `shared/ui` centraliza componentes reutilizables organizados en `atoms`, `molecules` y `organisms`, promoviendo consistencia visual, reutilización y mantenibilidad.

Esta separación permite escalar nuevas funcionalidades de forma independiente, mantener una clara división entre negocio y presentación, y simplificar la evolución del sistema a medida que crece el producto.

Además, la organización por dominios sienta una base sólida para una futura adopción de una arquitectura de microfrontends, donde funcionalidades como `products`, `cart` o `checkout` podrían desacoplarse progresivamente en aplicaciones independientes con un impacto mínimo sobre el resto de la solución.

---



## Funcionalidades implementadas

| Feature | Detalle |
|---|---|
| **PLP** | Filtro por categoría vía URL, `<h1>` dinámico, estados loading / error / empty con `StateFeedback` |
| **PDP** | Galería con thumbnails, selector de variantes, 3 niveles de precio (regular / promo / tarjeta) |
| **Carrito** | Persistido en `localStorage`, signals reactivos, mini-cart drawer, sincronización variante↔precio |
| **Checkout** | Formulario con `autocomplete` nativo y resumen de pedido reactivo |
| **SEO** | `SeoService` actualiza title, description, OG, Twitter Card y canonical en cada cambio de ruta |
| **Analytics** | `AnalyticsService` SSR-safe empuja eventos GA4 ecommerce al `dataLayer` |
| **SSR** | `RenderMode.Server` en PLP/PDP/carrito/checkout; `Prerender` en home y fallback |
| **Performance** | `fetchpriority="high"` + `loading="eager"` en LCP; `loading="lazy"` + dimensiones en el resto |
| **Responsive** | Layout mobile-first con reorganización real en tablet y desktop |

---

## Optimizaciones de Performance

| Área | Técnica aplicada |
|---|---|
| **LCP** | `loading="eager"` + `fetchpriority="high"` en las 4 primeras cards y galería principal |
| **CLS** | `width` + `height` explícitos en todas las imágenes |
| **Fuentes** | `<link rel="preconnect">` + `<link rel="stylesheet">` en `<head>` — sin `@import` en CSS |
| **SSR** | HTML completo desde servidor → mejor FCP y TTFB para crawlers |
| **Cache HTTP** | `shareReplay(1)` en `ProductService` — una sola petición HTTP por sesión |
| **Code splitting** | Lazy routing: 3 bundles independientes por feature |
| **Re-renders** | Signals + `computed` + `ChangeDetectionStrategy.OnPush` — sin detección de cambios innecesaria |

---

## Escalabilidad y arquitectura multimarca

La solución está diseñada para soportar múltiples marcas **sin duplicar lógica de negocio**:

- **CSS tokens por marca** (`--brand-primary`, `--brand-font`, etc.) — cambiar el archivo de tokens actualiza toda la UI
- **`BrandConfigService`** con un `InjectionToken` (`APP_CONFIG`) — configuración de logo, GTM ID y nombre de marca por entorno
- **Build targets en `angular.json`** con `fileReplacements` — `ng build --configuration=mifarma` genera un bundle independiente con estilos y GTM de Mifarma
- **Features encapsuladas** — `products`, `cart`, `checkout` son módulos autónomos sin acoplamiento entre sí

---

## Preguntas obligatorias

### 1. ¿Qué decisiones tomaste para mejorar la performance?

- **LCP:** El `input priority` en `ProductCardComponent` controla dinámicamente cuáles imágenes son `eager` + `fetchpriority="high"` (las primeras 4 above-the-fold). La galería principal del PDP también es eager.
- **CLS:** Todas las imágenes tienen `width` y `height` explícitos — el navegador reserva el espacio antes de descargar.
- **Fuentes:** `preconnect` a `fonts.googleapis.com` y `fonts.gstatic.com` en `<head>` en lugar de `@import` en CSS, eliminando el bloqueo de render.
- **SSR:** `RenderMode.Server` en PLP y PDP — el HTML llega completo desde el servidor, mejorando FCP y permitiendo indexación sin JavaScript.
- **Cache:** `shareReplay(1)` sobre el observable de HTTP — el JSON de productos se descarga una sola vez por sesión aunque haya múltiples componentes suscritos.

---

### 2. ¿Cómo estructurarías esta solución para soportar múltiples marcas?

**Capa 1 — CSS custom properties por marca:**
```scss
/* brand/inkafarma/tokens.scss */
:root { --brand-primary: #17A15B; --brand-secondary: #354159; }

/* brand/mifarma/tokens.scss */
:root { --brand-primary: #E8192C; --brand-secondary: #1A1A2E; }
```

**Capa 2 — Token de inyección por entorno:**
```typescript
export const APP_CONFIG = new InjectionToken<BrandConfig>('APP_CONFIG');

// app.config.ts de cada marca
providers: [{ provide: APP_CONFIG, useValue: inkafarmaConfig }]
```

**Capa 3 — Build target con `fileReplacements`:**
```json
"mifarma": {
  "fileReplacements": [{ "replace": "src/brand/config.ts", "with": "src/brand/mifarma.ts" }]
}
```

`ng build --configuration=mifarma` → bundle independiente. Cero duplicación de lógica de negocio.

---

### 3. Si hay problemas de LCP en producción, ¿cómo lo abordarías?

1. **Identificar** el elemento LCP exacto con DevTools → Performance o `onLCP()` de la librería `web-vitals`.
2. **Verificar** que no tenga `loading="lazy"` y que el SSR entregue el `src` correcto desde el primer byte.
3. **TTFB alto:** cachear la respuesta del servidor SSR con Redis o un edge cache (Vercel/Cloudflare).
4. **Imagen pesada:** convertir a WebP/AVIF con `srcset` por resolución de pantalla.
5. **Hidratación bloqueante:** confirmar que Angular no reemplaza el nodo DOM del LCP durante la hidratación.

---

### 4. ¿Cómo evitarías que Analytics se dispare múltiples veces en una SPA?

- **Reset GA4** antes de cada evento: `dataLayer.push({ ecommerce: null })` evita contaminación del contexto anterior.
- **`effect()` sobre signal:** Angular solo re-ejecuta el efecto cuando cambia la dependencia reactiva; re-renders sin cambio de producto no disparan `view_item`.
- **`switchMap`:** cancela la suscripción del producto anterior antes de resolver el nuevo — el efecto nunca recibe datos obsoletos.
- **Deduplicación por ID** como capa extra en producción:
```typescript
if (product.id === this.lastViewedId) return;
this.lastViewedId = product.id;
this.push({ event: 'view_item', ... });
```

---

### 5. ¿Qué consideraciones SEO tendrías en un entorno real?

- **SSR obligatorio** — sin él, Googlebot y crawlers de redes sociales ven `<app-root>` vacío.
- **Meta dinámicos** — `SeoService` actualiza title, description, OG y Twitter Card en cada ruta con `Title` + `Meta` de `@angular/platform-browser`.
- **Canonical por ruta** — `<link rel="canonical">` con URL absoluta en cada cambio de página; evita penalización por contenido duplicado.
- **Jerarquía H1→H2→H3** — `<h1>` único por página (categoría en PLP, nombre del producto en PDP).
- **Semántica HTML** — `<main>`, `<header>`, `<nav>`, `<footer>`, `role="radiogroup"` en variantes.
- **En producción añadiría:** JSON-LD `Product` + `BreadcrumbList` para rich results en Google, sitemap.xml dinámico desde el catálogo, `robots.txt` bloqueando `/carrito` y `/checkout`, y monitoreo de cobertura de índice en Search Console.
