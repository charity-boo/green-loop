import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CollectorDashboard from './collector-dashboard';
import { getCollectorDashboardData } from '@/lib/dashboard-data';
import { authorize } from '@/lib/middleware/authorize';

export default async function CollectorDashboardPage() {
  const session = await getSession();

  try {
    await authorize(session, ['COLLECTOR', 'ADMIN']);
  } catch {
    redirect('/auth/login');
  }

  const tasks = await getCollectorDashboardData();

  return <CollectorDashboard tasks={tasks} />;
}
