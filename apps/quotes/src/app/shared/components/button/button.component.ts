import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: [ './button.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() label: string;
  @Input() type = 'button';
  @Input() disabled?: boolean;
  @Input() class?: string;

  @Output() clicked = new EventEmitter<MouseEvent | KeyboardEvent>();

  onClick(event: MouseEvent | KeyboardEvent): void {
    this.clicked.next(event);
  }

}
