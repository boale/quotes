import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: [ './auth-layout.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent {
}
