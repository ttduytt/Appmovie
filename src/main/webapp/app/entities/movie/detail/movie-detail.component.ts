import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IMovie } from '../movie.model';

@Component({
  standalone: true,
  selector: 'jhi-movie-detail',
  templateUrl: './movie-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class MovieDetailComponent {
  movie = input<IMovie | null>(null);

  previousState(): void {
    window.history.back();
  }
}
