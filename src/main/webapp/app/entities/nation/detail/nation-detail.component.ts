import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { INation } from '../nation.model';

@Component({
  standalone: true,
  selector: 'jhi-nation-detail',
  templateUrl: './nation-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class NationDetailComponent {
  nation = input<INation | null>(null);

  previousState(): void {
    window.history.back();
  }
}
