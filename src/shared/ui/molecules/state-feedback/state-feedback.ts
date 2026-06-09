import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

type StateType = 'loading' | 'error' | 'empty';

@Component({
  selector: 'app-state-feedback',
  standalone: true,
  templateUrl: './state-feedback.html',
  styleUrl: './state-feedback.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateFeedback {
  readonly state = input<StateType>('loading');

  readonly loadingMessage = input('Cargando...');
  readonly errorMessage = input('Ha ocurrido un error.');
  readonly emptyMessage = input('No hay resultados.');

  readonly actionLabel = input('Reintentar');
  readonly showAction = input(false);

  readonly action = output<void>();

  onAction(): void {
    this.action.emit();
  }

  readonly ariaRole = () =>
    this.state() === 'error' ? 'alert' : 'status';

  readonly ariaLive = () =>
    this.state() === 'error' ? 'assertive' : 'polite';
}