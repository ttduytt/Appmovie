import dayjs from 'dayjs/esm';
import { INation } from 'app/entities/nation/nation.model';
import { IActor } from 'app/entities/actor/actor.model';
import { ITopic } from 'app/entities/topic/topic.model';

export interface IMovie {
  id: number;
  movieName?: string | null;
  release?: dayjs.Dayjs | null;
  author?: string | null;
  view?: number | null;
  description?: string | null;
  numberEpisode?: number | null;
  avatar?: string | null;
  linkMovie?: string | null;
  nation?: INation | null;
  actors?: IActor[] | null;
  topics?: ITopic[] | null;
}

export type NewMovie = Omit<IMovie, 'id'> & { id: null };
