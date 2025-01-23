import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import MovieResolve from './route/movie-routing-resolve.service';

const movieRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/movie.component').then(m => m.MovieComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'searchMovie',
    loadComponent: () => import('./list-movie-search/list-movie-search.component').then(m => m.ListMovieSearchComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'watchmovie/:id',
    loadComponent: () => import('./watch-movie/watch-movie.component').then(m => m.WatchMovieComponent),
    resolve: {
      movie: MovieResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/movie-detail.component').then(m => m.MovieDetailComponent),
    resolve: {
      movie: MovieResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/movie-update.component').then(m => m.MovieUpdateComponent),
    resolve: {
      movie: MovieResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/movie-update.component').then(m => m.MovieUpdateComponent),
    resolve: {
      movie: MovieResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default movieRoute;
