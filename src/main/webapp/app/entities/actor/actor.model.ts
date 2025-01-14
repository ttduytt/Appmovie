import { IMovie } from 'app/entities/movie/movie.model';

export interface IActor {
  id: number;
  name?: string | null;
  age?: number | null;
  height?: number | null;
  movies?: IMovie[] | null;
}

export type NewActor = Omit<IActor, 'id'> & { id: null };
