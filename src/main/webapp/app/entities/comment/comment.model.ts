import dayjs from 'dayjs/esm';
import { IMovie } from 'app/entities/movie/movie.model';
import { IUser } from '../user/user.model';

export interface IComment {
  id: number;
  name?: string | null;
  content?: string | null;
  date?: dayjs.Dayjs | null;
  like?: number | null;
  movie?: IMovie | null;
  user?: IUser | null;
}

export type NewComment = Omit<IComment, 'id'> & { id: null };
