'use client';
import { ProjectRecord, AboutRecord, ContactRecord } from './store';

interface Cache {
  projects: ProjectRecord[] | null;
  about: AboutRecord | null;
  contact: ContactRecord | null;
  logoUrl: string | null;
  logoFetched: boolean;
}

const cache: Cache = { projects: null, about: null, contact: null, logoUrl: null, logoFetched: false };

export function prefetchAll() {
  if (!cache.projects)    fetch('/api/projects').then(r => r.json()).then(d => { cache.projects = d; });
  if (!cache.about)       fetch('/api/about').then(r => r.json()).then(d => { cache.about = d; });
  if (!cache.contact)     fetch('/api/contact').then(r => r.json()).then(d => { cache.contact = d; });
  if (!cache.logoFetched) {
    cache.logoFetched = true;
    fetch('/api/logo').then(r => r.json()).then(d => { cache.logoUrl = d.active_url; });
  }
}

export function getCachedProjects(): ProjectRecord[] | null { return cache.projects; }
export function getCachedAbout(): AboutRecord | null        { return cache.about; }
export function getCachedContact(): ContactRecord | null    { return cache.contact; }
export function getCachedLogoUrl(): string | null           { return cache.logoUrl; }
export function invalidateLogoCache()                       { cache.logoUrl = null; cache.logoFetched = false; }
