import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../shared/ui/organisms/header/header';
import { FooterComponent } from '../shared/ui/organisms/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('multimarca-ecommerce');
}
