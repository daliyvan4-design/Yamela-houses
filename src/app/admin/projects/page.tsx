import AdminShell from '@/components/admin/AdminShell';
import { getProjects } from '@/lib/store';
import ProjectsAdmin from '@/components/admin/ProjectsAdmin';

export default async function AdminProjects() {
  const initial = await getProjects();
  return (
    <AdminShell title="Projets">
      <ProjectsAdmin initial={initial}/>
    </AdminShell>
  );
}
