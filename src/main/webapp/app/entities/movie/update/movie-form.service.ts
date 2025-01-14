import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IMovie, NewMovie } from '../movie.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMovie for edit and NewMovieFormGroupInput for create.
 */
type MovieFormGroupInput = IMovie | PartialWithRequiredKeyOf<NewMovie>;

type MovieFormDefaults = Pick<NewMovie, 'id' | 'actors' | 'topics'>;

type MovieFormGroupContent = {
  id: FormControl<IMovie['id'] | NewMovie['id']>;
  movieName: FormControl<IMovie['movieName']>;
  release: FormControl<IMovie['release']>;
  author: FormControl<IMovie['author']>;
  view: FormControl<IMovie['view']>;
  description: FormControl<IMovie['description']>;
  numberEpisode: FormControl<IMovie['numberEpisode']>;
  avatar: FormControl<IMovie['avatar']>;
  linkMovie: FormControl<IMovie['linkMovie']>;
  nation: FormControl<IMovie['nation']>;
  actors: FormControl<IMovie['actors']>;
  topics: FormControl<IMovie['topics']>;
};

export type MovieFormGroup = FormGroup<MovieFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MovieFormService {
  createMovieFormGroup(movie: MovieFormGroupInput = { id: null }): MovieFormGroup {
    const movieRawValue = {
      ...this.getFormDefaults(),
      ...movie,
    };
    return new FormGroup<MovieFormGroupContent>({
      id: new FormControl(
        { value: movieRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      movieName: new FormControl(movieRawValue.movieName),
      release: new FormControl(movieRawValue.release),
      author: new FormControl(movieRawValue.author),
      view: new FormControl(movieRawValue.view),
      description: new FormControl(movieRawValue.description),
      numberEpisode: new FormControl(movieRawValue.numberEpisode),
      avatar: new FormControl(movieRawValue.avatar),
      linkMovie: new FormControl(movieRawValue.linkMovie),
      nation: new FormControl(movieRawValue.nation),
      actors: new FormControl(movieRawValue.actors ?? []),
      topics: new FormControl(movieRawValue.topics ?? []),
    });
  }

  getMovie(form: MovieFormGroup): IMovie | NewMovie {
    return form.getRawValue() as IMovie | NewMovie;
  }

  resetForm(form: MovieFormGroup, movie: MovieFormGroupInput): void {
    const movieRawValue = { ...this.getFormDefaults(), ...movie };
    form.reset(
      {
        ...movieRawValue,
        id: { value: movieRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): MovieFormDefaults {
    return {
      id: null,
      actors: [],
      topics: [],
    };
  }
}
