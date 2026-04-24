import AdminShell from '@/components/admin/AdminShell';
import LogoAdmin from '@/components/admin/LogoAdmin';

export const dynamic = 'force-dynamic';

export default function AdminLogo() {
  return (
    <AdminShell title="Logos">
      <LogoAdmin/>
    </AdminShell>
  );
}
