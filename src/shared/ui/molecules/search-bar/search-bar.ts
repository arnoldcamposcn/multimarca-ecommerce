import { Component } from '@angular/core';
import { IconComponent } from '../../atoms/icon/icon';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBarComponent {}
