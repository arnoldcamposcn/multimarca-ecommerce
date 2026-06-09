import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../../atoms/icon/icon';

@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink, IconComponent],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb {
  readonly category = input.required<string>();
  readonly productName = input<string | undefined>(undefined);

  readonly categoryLabel = computed(() => {
    const value = this.category();

    if (!value) {
      return '';
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
  });
}
