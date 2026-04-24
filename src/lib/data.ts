export interface Project {
  id: number;
  name: string;
  location: string;
  year: string;
  tags: string;
  cols: number;
  rows: number;
}

export type Category = 'interieur' | 'immeuble' | 'maison';

export const catLabels: Record<Category, string> = {
  interieur: 'Intérieur',
  immeuble:  'Immeuble',
  maison:    'Maison',
};

export const allProjects: Record<Category, Project[]> = {
  interieur: [
    { id:1,  name:'Salon Riad Azur',   location:'Marrakech, MA',  year:'2024', tags:'Intérieur · 180m²', cols:2, rows:2 },
    { id:2,  name:'Cuisine Studio K',  location:'Casablanca, MA', year:'2023', tags:'Intérieur · 55m²',  cols:1, rows:1 },
    { id:3,  name:'Suite Lumière',     location:'Rabat, MA',      year:'2023', tags:'Intérieur · 42m²',  cols:1, rows:1 },
    { id:4,  name:'Bureau Haut-Agdal', location:'Rabat, MA',      year:'2022', tags:'Intérieur · 120m²', cols:1, rows:1 },
    { id:5,  name:'Loft Gauthier',     location:'Casablanca, MA', year:'2022', tags:'Intérieur · 210m²', cols:1, rows:1 },
  ],
  immeuble: [
    { id:6,  name:'Résidence Lumière', location:'Fès, MA',        year:'2023', tags:'Immeuble · 2200m²', cols:2, rows:2 },
    { id:7,  name:'Tour Zénith',       location:'Casablanca, MA', year:'2022', tags:'Immeuble · 4800m²', cols:1, rows:1 },
    { id:8,  name:'Collectif Anfa',    location:'Casablanca, MA', year:'2022', tags:'Immeuble · 1600m²', cols:1, rows:1 },
    { id:9,  name:'Îlot Nord',         location:'Tanger, MA',     year:'2021', tags:'Immeuble · 3100m²', cols:1, rows:1 },
    { id:10, name:'Pavillon Médina',   location:'Fès, MA',        year:'2021', tags:'Immeuble · 900m²',  cols:1, rows:1 },
  ],
  maison: [
    { id:11, name:'Villa Azur',        location:'Marrakech, MA',  year:'2024', tags:'Maison · 420m²',    cols:2, rows:2 },
    { id:12, name:'Maison Blanche',    location:'Casablanca, MA', year:'2023', tags:'Maison · 280m²',    cols:1, rows:1 },
    { id:13, name:'Villa Atlas',       location:'Ifrane, MA',     year:'2023', tags:'Maison · 360m²',    cols:1, rows:1 },
    { id:14, name:'Pavillon Sud',      location:'Agadir, MA',     year:'2022', tags:'Maison · 200m²',    cols:1, rows:1 },
    { id:15, name:'Maison Chellah',    location:'Rabat, MA',      year:'2021', tags:'Maison · 310m²',    cols:1, rows:1 },
  ],
};
