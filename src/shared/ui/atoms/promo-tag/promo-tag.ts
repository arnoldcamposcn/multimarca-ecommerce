import { Component, input } from '@angular/core';

@Component({
  selector: 'app-promo-tag',
  standalone: true,
  templateUrl: './promo-tag.html',
  styleUrl: './promo-tag.scss',
})

export class PromoTagComponent {

  label = input.required<string>();

  variant = input<'primary' | 'secondary'>('primary');

}