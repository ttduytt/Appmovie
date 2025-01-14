import { IBlog, NewBlog } from './blog.model';

export const sampleWithRequiredData: IBlog = {
  id: 16180,
};

export const sampleWithPartialData: IBlog = {
  id: 20723,
  content: 'hourly overconfidently',
};

export const sampleWithFullData: IBlog = {
  id: 11493,
  name: 'always',
  content: 'pivot',
};

export const sampleWithNewData: NewBlog = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
