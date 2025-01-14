import { ITopic, NewTopic } from './topic.model';

export const sampleWithRequiredData: ITopic = {
  id: 25806,
};

export const sampleWithPartialData: ITopic = {
  id: 237,
  name: 'searchingly',
};

export const sampleWithFullData: ITopic = {
  id: 28887,
  name: 'incidentally',
};

export const sampleWithNewData: NewTopic = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
