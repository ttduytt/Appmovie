import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ITopic } from '../topic.model';

@Component({
  standalone: true,
  selector: 'jhi-topic-detail',
  templateUrl: './topic-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class TopicDetailComponent {
  topic = input<ITopic | null>(null);

  previousState(): void {
    window.history.back();
  }
}
