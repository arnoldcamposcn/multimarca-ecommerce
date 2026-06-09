import { Component, input } from '@angular/core';
import { IconComponent } from '../../atoms/icon/icon';


@Component({
  selector: 'app-cart-button',
  imports: [IconComponent],
  templateUrl: './cart-button.html',
  styleUrl: './cart-button.scss',
})


export class CartButtonComponent {
  readonly count = input(0);
}
