import { Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './tag.html',
  styleUrl: './tag.scss',
})

export class TagComponent {
  readonly label = input.required<string>();
  readonly icon = input<string>();
  readonly variant = input<'default' | 'interest'>('default');
}
