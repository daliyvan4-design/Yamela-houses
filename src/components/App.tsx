'use client';
import { useState, useEffect } from 'react';
import { T } from '@/lib/tokens';
import { Page } from '@/lib/types';
import Sidebar from '@/components/ui/Sidebar';
import BottomTab from '@/components/ui/BottomTab';
import HeroPage from '@/components/pages/HeroPage';
import ProjectsPage from '@/components/pages/ProjectsPage';
import AboutPage from '@/components/pages/AboutPage';
import ContactPage from '@/components/pages/ContactPage';

const pages: Record<Page, React.ComponentType<{ setPage: (p: Page) => void }>> = {
  hero:     HeroPage,
  projects: ProjectsPage,
  about:    AboutPage,
  contact:  ContactPage,
};

export default function App() {
  const [page, setPage] = useState<Page>('hero');
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const PageComp = pages[page];
  const offset = mobile ? 0 : T.sidebar;

  return (
    <div style={{ height: '100vh', display: 'flex', fontFamily: 'var(--font-dm-sans)' }}>
      {!mobile && <Sidebar page={page} setPage={setPage}/>}

      <main
        key={page}
        style={{
          marginLeft: offset,
          marginBottom: mobile ? 56 : 0,
          flex: 1,
          height: mobile ? 'calc(100vh - 56px)' : '100vh',
          overflow: 'hidden',
        }}
      >
        <PageComp setPage={setPage}/>
      </main>

      {mobile && <BottomTab page={page} setPage={setPage}/>}
    </div>
  );
}
