import { IMovie } from 'app/entities/movie/movie.model';

export interface ITopic {
  id: number;
  name?: string | null;
  movies?: IMovie[] | null;
}

export type NewTopic = Omit<ITopic, 'id'> & { id: null };
