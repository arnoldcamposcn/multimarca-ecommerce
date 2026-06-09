import { Component, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
})

export class LogoComponent {
  readonly src = input.required<string>();
  readonly alt = input('Logo');
}
