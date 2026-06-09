import { Component, input } from '@angular/core';

@Component({
  selector: 'app-top-banner',
  standalone: true,
  templateUrl: './top-banner.html',
  styleUrl: './top-banner.scss',
})

export class TopBannerComponent {
  readonly message = input.required<string>();
}
