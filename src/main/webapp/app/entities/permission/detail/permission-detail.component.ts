import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IPermission } from '../permission.model';

@Component({
  standalone: true,
  selector: 'jhi-permission-detail',
  templateUrl: './permission-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class PermissionDetailComponent {
  permission = input<IPermission | null>(null);

  previousState(): void {
    window.history.back();
  }
}
