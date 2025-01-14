import { INation, NewNation } from './nation.model';

export const sampleWithRequiredData: INation = {
  id: 22841,
};

export const sampleWithPartialData: INation = {
  id: 15024,
};

export const sampleWithFullData: INation = {
  id: 5261,
  name: 'steeple incidentally buttery',
};

export const sampleWithNewData: NewNation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
