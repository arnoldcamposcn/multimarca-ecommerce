import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TopBannerComponent } from '../top-banner/top-banner';
import { LogoComponent } from '../../atoms/logo/logo';
import { CartButtonComponent } from '../../molecules/cart-button/cart-button';
import { SearchBarComponent } from '../../molecules/search-bar/search-bar';
import { CartUiService } from '../../../../features/cart/services/cart-ui';
import { MiniCartDrawer } from '../../../../features/cart/components/mini-cart-drawer/mini-cart-drawer';
import { CartService } from '../../../../features/cart/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, TopBannerComponent, LogoComponent, CartButtonComponent, SearchBarComponent, MiniCartDrawer],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly cartUiService = inject(CartUiService);
  readonly cartService = inject(CartService);

  readonly cartCount = computed(() => this.cartService.items().length);
}
