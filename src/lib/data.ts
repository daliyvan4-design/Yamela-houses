export interface Project {
  id: number;
  name: string;
  location: string;
  year: string;
  tags: string;
  cols: number;
  rows: number;
}

export type Category = 'interieur' | 'residentiel' | 'bureaux' | 'commercial' | 'mobilier';

export const catLabels: Record<Category, string> = {
  interieur:   'Intérieur',
  residentiel: 'Résidentiel',
  bureaux:     'Bureaux',
  commercial:  'Commercial',
  mobilier:    'Mobilier',
};

export const allProjects: Record<Category, Project[]> = {
  interieur:   [],
  residentiel: [],
  bureaux:     [],
  commercial:  [],
  mobilier:    [],
};
