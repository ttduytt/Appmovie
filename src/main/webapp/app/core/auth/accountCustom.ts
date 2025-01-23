export interface AccountCustom {
  id: number;
  activated: boolean;
  authorities: string[];
  email: string;
  firstName: string | null;
  langKey: string;
  lastName: string | null;
  login: string;
  imageUrl: string | null;
}
