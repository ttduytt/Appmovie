import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMovie, NewMovie } from '../movie.model';

export type PartialUpdateMovie = Partial<IMovie> & Pick<IMovie, 'id'>;

type RestOf<T extends IMovie | NewMovie> = Omit<T, 'release'> & {
  release?: string | null;
};

export type RestMovie = RestOf<IMovie>;

export type NewRestMovie = RestOf<NewMovie>;

export type PartialUpdateRestMovie = RestOf<PartialUpdateMovie>;

export type EntityResponseType = HttpResponse<IMovie>;
export type EntityArrayResponseType = HttpResponse<IMovie[]>;

@Injectable({ providedIn: 'root' })
export class MovieService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/movies');

  create(movie: NewMovie): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(movie);
    return this.http.post<RestMovie>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(movie: IMovie): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(movie);
    return this.http
      .put<RestMovie>(`${this.resourceUrl}/${this.getMovieIdentifier(movie)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(movie: PartialUpdateMovie): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(movie);
    return this.http
      .patch<RestMovie>(`${this.resourceUrl}/${this.getMovieIdentifier(movie)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestMovie>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestMovie[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMovieIdentifier(movie: Pick<IMovie, 'id'>): number {
    return movie.id;
  }

  compareMovie(o1: Pick<IMovie, 'id'> | null, o2: Pick<IMovie, 'id'> | null): boolean {
    return o1 && o2 ? this.getMovieIdentifier(o1) === this.getMovieIdentifier(o2) : o1 === o2;
  }

  addMovieToCollectionIfMissing<Type extends Pick<IMovie, 'id'>>(
    movieCollection: Type[],
    ...moviesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const movies: Type[] = moviesToCheck.filter(isPresent);
    if (movies.length > 0) {
      const movieCollectionIdentifiers = movieCollection.map(movieItem => this.getMovieIdentifier(movieItem));
      const moviesToAdd = movies.filter(movieItem => {
        const movieIdentifier = this.getMovieIdentifier(movieItem);
        if (movieCollectionIdentifiers.includes(movieIdentifier)) {
          return false;
        }
        movieCollectionIdentifiers.push(movieIdentifier);
        return true;
      });
      return [...moviesToAdd, ...movieCollection];
    }
    return movieCollection;
  }

  protected convertDateFromClient<T extends IMovie | NewMovie | PartialUpdateMovie>(movie: T): RestOf<T> {
    return {
      ...movie,
      release: movie.release?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restMovie: RestMovie): IMovie {
    return {
      ...restMovie,
      release: restMovie.release ? dayjs(restMovie.release) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestMovie>): HttpResponse<IMovie> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestMovie[]>): HttpResponse<IMovie[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
