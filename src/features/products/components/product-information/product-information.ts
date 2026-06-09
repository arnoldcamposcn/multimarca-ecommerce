import { Component, input, signal } from '@angular/core';
import { IconComponent } from '../../../../shared/ui/atoms/icon/icon';

@Component({
  selector: 'app-product-information',
  imports: [IconComponent],
  templateUrl: './product-information.html',
  styleUrl: './product-information.scss',
})

export class ProductInformationComponent {

  readonly description = input.required<string>();
  readonly composition = input.required<string>();
  readonly contraindications = input.required<string>();

  readonly openedSection = signal<string | null>('description');

  toggle(section: string): void {
    this.openedSection.update(current =>
      current === section ? null : section
    );
  }
}