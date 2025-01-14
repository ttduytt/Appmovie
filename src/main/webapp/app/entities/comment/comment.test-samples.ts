import dayjs from 'dayjs/esm';

import { IComment, NewComment } from './comment.model';

export const sampleWithRequiredData: IComment = {
  id: 15321,
};

export const sampleWithPartialData: IComment = {
  id: 12793,
  name: 'elderly',
};

export const sampleWithFullData: IComment = {
  id: 16388,
  name: 'fooey',
  content: 'slight',
  date: dayjs('2025-01-12'),
  like: 15830,
};

export const sampleWithNewData: NewComment = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
