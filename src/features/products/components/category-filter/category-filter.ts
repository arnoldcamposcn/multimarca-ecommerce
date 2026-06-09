import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  templateUrl: './category-filter.html',
  styleUrl: './category-filter.scss',
})
export class CategoryFilterComponent {
  readonly categories = input<string[]>([]);

  readonly selectedCategory = input<string>('todos');

  readonly categorySelected = output<string>();

  readonly clearFilters = output<void>();

  selectCategory(category: string) {
    this.categorySelected.emit(category);
  }

  clear() {
    this.clearFilters.emit();
  }
}
