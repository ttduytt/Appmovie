import { IActor, NewActor } from './actor.model';

export const sampleWithRequiredData: IActor = {
  id: 20721,
};

export const sampleWithPartialData: IActor = {
  id: 7240,
};

export const sampleWithFullData: IActor = {
  id: 25097,
  name: 'toward',
  age: 31593,
  height: 16713.88,
};

export const sampleWithNewData: NewActor = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
