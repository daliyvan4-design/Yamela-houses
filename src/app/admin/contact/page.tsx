import AdminShell from '@/components/admin/AdminShell';
import { getContact } from '@/lib/store';
import ContactAdmin from '@/components/admin/ContactAdmin';

export default async function AdminContact() {
  const initial = await getContact();
  return (
    <AdminShell title="Contact">
      <ContactAdmin initial={initial}/>
    </AdminShell>
  );
}
