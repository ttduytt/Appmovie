export interface INation {
  id: number;
  name?: string | null;
}

export type NewNation = Omit<INation, 'id'> & { id: null };
