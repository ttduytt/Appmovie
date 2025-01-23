import { Component, input, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import dayjs, { Dayjs } from 'dayjs';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IMovie } from '../movie.model';
import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';
import { MovieService } from '../service/movie.service';

@Component({
  standalone: true,
  selector: 'jhi-movie-detail',
  templateUrl: './movie-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe, HasAnyAuthorityDirective],
  styleUrl: '../../../../content/scss/movieDetail.scss',
})
export class MovieDetailComponent {
  movie = input<IMovie | null>(null);
  protected readonly movieService = inject(MovieService);

  previousState(): void {
    window.history.back();
  }

  getYear(date: Dayjs | null | undefined): string {
    return date ? date.year().toString() : '';
  }

  updateView(id: number) {
    this.movieService.updateViewMovie(id).subscribe();
  }
}
