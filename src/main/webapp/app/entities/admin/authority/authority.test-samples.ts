import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: '025da7b3-418e-4508-8444-9b07545956de',
};

export const sampleWithPartialData: IAuthority = {
  name: '8f32d35f-e6c9-42eb-a2bc-66131745b0b5',
};

export const sampleWithFullData: IAuthority = {
  name: '1c4088ea-6fda-4417-9dbb-45ed1e367d81',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
