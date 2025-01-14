import dayjs from 'dayjs/esm';

import { IMovie, NewMovie } from './movie.model';

export const sampleWithRequiredData: IMovie = {
  id: 19172,
};

export const sampleWithPartialData: IMovie = {
  id: 8703,
  movieName: 'strategy boohoo',
  description: 'despite',
  linkMovie: 'woot deficient',
};

export const sampleWithFullData: IMovie = {
  id: 13765,
  movieName: 'woeful exaggerate',
  release: dayjs('2025-01-12'),
  author: 'out dulcimer dull',
  view: 4071,
  description: 'sedately',
  numberEpisode: 9992,
  avatar: 'whose',
  linkMovie: 'supposing softly',
};

export const sampleWithNewData: NewMovie = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
