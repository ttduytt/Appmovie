export interface IBlog {
  id: number;
  name?: string | null;
  content?: string | null;
}

export type NewBlog = Omit<IBlog, 'id'> & { id: null };
