export interface ProjetoPivot {
  integrantes?: string | null;
}

export interface Projeto {
  id?: number;
  name: string;
  images?: string[] | null;
  description?: string | null;
  status: string;
  date_begin: string;
  date_end?: string | null;
  pivot?: ProjetoPivot | null;
  pessoas?: any[];
}
