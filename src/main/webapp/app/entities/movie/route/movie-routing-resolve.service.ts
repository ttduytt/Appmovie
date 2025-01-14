import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMovie } from '../movie.model';
import { MovieService } from '../service/movie.service';

const movieResolve = (route: ActivatedRouteSnapshot): Observable<null | IMovie> => {
  const id = route.params.id;
  if (id) {
    return inject(MovieService)
      .find(id)
      .pipe(
        mergeMap((movie: HttpResponse<IMovie>) => {
          if (movie.body) {
            return of(movie.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default movieResolve;
