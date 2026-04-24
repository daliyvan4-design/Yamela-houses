import AdminShell from '@/components/admin/AdminShell';
import { getAbout } from '@/lib/store';
import AboutAdmin from '@/components/admin/AboutAdmin';

export default async function AdminAbout() {
  const initial = await getAbout();
  return (
    <AdminShell title="À propos">
      <AboutAdmin initial={initial}/>
    </AdminShell>
  );
}
