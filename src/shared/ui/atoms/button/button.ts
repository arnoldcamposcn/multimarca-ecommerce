import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})

export class ButtonComponent {

  readonly label = input.required<string>();

  readonly variant = input<'primary' | 'success'>('primary');
  readonly fullWidth = input(false);

}
