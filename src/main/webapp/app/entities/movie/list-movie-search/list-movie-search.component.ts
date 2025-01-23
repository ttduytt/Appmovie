import { Component, NgZone, OnInit, inject } from '@angular/core';
import { IMovie } from '../movie.model';
import { MovieService } from '../service/movie.service';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import HasAnyAuthorityDirective from '../../../shared/auth/has-any-authority.directive';

@Component({
  selector: 'jhi-list-movie-search',
  standalone: true,
  imports: [RouterModule, HasAnyAuthorityDirective],
  templateUrl: './list-movie-search.component.html',
  styleUrl: './list-movie-search.component.scss',
})
export class ListMovieSearchComponent implements OnInit {
  movies: IMovie[] = [];
  protected readonly movieService = inject(MovieService);

  trackId = (item: IMovie): number => this.movieService.getMovieIdentifier(item);

  ngOnInit(): void {
    this.movieService.currentListMovie.subscribe(data => (this.movies = data));
  }
}
