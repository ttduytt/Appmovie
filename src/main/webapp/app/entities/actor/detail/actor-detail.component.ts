import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IActor } from '../actor.model';

@Component({
  standalone: true,
  selector: 'jhi-actor-detail',
  templateUrl: './actor-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ActorDetailComponent {
  actor = input<IActor | null>(null);

  previousState(): void {
    window.history.back();
  }
}
