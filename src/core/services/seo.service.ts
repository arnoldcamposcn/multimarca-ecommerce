import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SeoConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product';
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly document = inject(DOCUMENT);

  private readonly SITE_NAME = 'Inkafarma';
  private readonly BASE_URL = 'https://www.inkafarma.pe';
  private readonly DEFAULT_DESCRIPTION =
    'Compra medicamentos, vitaminas y productos de salud con los mejores precios. Entrega a domicilio en todo el país.';
  private readonly DEFAULT_IMAGE = '/images/logos/inkafarma.svg';

  update(config: SeoConfig = {}): void {
    const fullTitle = config.title
      ? `${config.title} | ${this.SITE_NAME}`
      : this.SITE_NAME;

    const description = config.description ?? this.DEFAULT_DESCRIPTION;
    const image = config.image ?? this.DEFAULT_IMAGE;
    const type = config.type ?? 'website';

    this.titleService.setTitle(fullTitle);

    this.metaService.updateTag({ name: 'description', content: description });

    this.metaService.updateTag({ property: 'og:title', content: fullTitle });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:image', content: image });
    this.metaService.updateTag({ property: 'og:type', content: type });
    this.metaService.updateTag({ property: 'og:site_name', content: this.SITE_NAME });

    if (config.url) {
      const absoluteUrl = this.toAbsoluteUrl(config.url);
      this.metaService.updateTag({ property: 'og:url', content: absoluteUrl });
      this.setCanonical(absoluteUrl);
    }

    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: fullTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: image });
  }


  private toAbsoluteUrl(url: string): string {
    return url.startsWith('http') ? url : `${this.BASE_URL}${url}`;
  }

  private setCanonical(url: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }
}
