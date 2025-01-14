import { IPermission, NewPermission } from './permission.model';

export const sampleWithRequiredData: IPermission = {
  id: 5768,
};

export const sampleWithPartialData: IPermission = {
  id: 3290,
  description: 'cutover',
};

export const sampleWithFullData: IPermission = {
  id: 23416,
  name: 'speedy aha',
  description: 'handful meh atop',
};

export const sampleWithNewData: NewPermission = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
