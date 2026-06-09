import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input
} from '@angular/core';

@Component({
  selector: 'app-carousel',

  standalone: true,

  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarouselComponent {

  slidesPerView = input(4);

  spaceBetween = input(16);

}