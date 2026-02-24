import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminDashboard from './admin-dashboard';
import { getAdminDashboardData } from '@/lib/dashboard-data';
import { authorize } from '@/lib/middleware/authorize';

export default async function AdminDashboardPage() {
  const session = await getSession();

  try {
    await authorize(session, ['ADMIN']);
  } catch {
    redirect('/auth/login');
  }

  const data = await getAdminDashboardData();

  return <AdminDashboard data={data} />;
}
