import { Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})

export class IconComponent {
  readonly src = input.required<string>();
  readonly alt = input('');
  readonly size = input(24);
  readonly width = input<number | null>(null);
  readonly height = input<number | null>(null);
}
