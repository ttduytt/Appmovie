import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 17069,
  login: "Z7@Lmd\\7cX\\CxMh\\'V\\G6JBjw\\@Lf",
};

export const sampleWithPartialData: IUser = {
  id: 16063,
  login: 'ktQ',
};

export const sampleWithFullData: IUser = {
  id: 9751,
  login: '{5~xKM@ksVIvz\\BH\\WA\\.S\\1Iv\\qAGVyP',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
