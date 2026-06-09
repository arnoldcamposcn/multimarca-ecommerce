import {
  Component,
  computed,
  effect,
  input,
  signal
} from '@angular/core';

@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [],
  templateUrl: './product-gallery.html',
  styleUrl: './product-gallery.scss'
})
export class ProductGalleryComponent {

  readonly images =
    input.required<string[]>();

  readonly selectedIndex = signal(0);

  readonly selectedImage = computed(() => {
    const images = this.images();
    const index = this.selectedIndex();

    return images[index] ?? images[0] ?? '';
  });

  constructor() {
    effect(() => {
      const images = this.images();

      if (images.length === 0) {
        this.selectedIndex.set(0);
        return;
      }

      if (this.selectedIndex() > images.length - 1) {
        this.selectedIndex.set(0);
      }
    });
  }

  selectImage(index: number): void {
    this.selectedIndex.set(index);
  }
}