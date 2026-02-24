import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import UserDashboard from './user-dashboard';
import { getUserDashboardData } from '@/lib/dashboard-data';
import { authorize } from '@/lib/middleware/authorize';

export default async function UserDashboardPage() {
  const session = await getSession();

  try {
    await authorize(session, ['USER']);
  } catch {
    redirect('/auth/login');
  }

  const data = await getUserDashboardData(session!.user.id);

  return <UserDashboard data={data} />;
}

