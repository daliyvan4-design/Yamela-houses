'use client';
import { ProjectRecord, AboutRecord, ContactRecord } from './store';

interface Cache {
  projects: ProjectRecord[] | null;
  about: AboutRecord | null;
  contact: ContactRecord | null;
}

const cache: Cache = { projects: null, about: null, contact: null };

export function prefetchAll() {
  if (!cache.projects) fetch('/api/projects').then(r => r.json()).then(d => { cache.projects = d; });
  if (!cache.about)    fetch('/api/about').then(r => r.json()).then(d => { cache.about = d; });
  if (!cache.contact)  fetch('/api/contact').then(r => r.json()).then(d => { cache.contact = d; });
}

export function getCachedProjects(): ProjectRecord[] | null { return cache.projects; }
export function getCachedAbout(): AboutRecord | null        { return cache.about; }
export function getCachedContact(): ContactRecord | null    { return cache.contact; }
