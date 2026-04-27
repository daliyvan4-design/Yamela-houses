export interface Project {
  id: number;
  name: string;
  location: string;
  year: string;
  tags: string;
  cols: number;
  rows: number;
}

export type Category = 'residentiel' | 'bureaux' | 'commercial' | 'interieur' | 'mobilier';

export const catLabels: Record<Category, string> = {
  residentiel: 'Résidentiel',
  bureaux:     'Bureaux',
  commercial:  'Commercial',
  interieur:   'Intérieur',
  mobilier:    'Mobilier',
};

export const allProjects: Record<Category, Project[]> = {
  interieur:   [],
  residentiel: [],
  bureaux:     [],
  commercial:  [],
  mobilier:    [],
};
