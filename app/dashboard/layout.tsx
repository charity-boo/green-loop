import { getSession, Role } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from "./dashboard-layout";

export default async function RootDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('RootDashboardLayout rendered. Calling getSession()...');
  const session = await getSession();

  if (!session || !session.user) {
    console.log('No session found in RootDashboardLayout. Redirecting to /auth/login.');
    redirect("/auth/login");
  }

  const userRole = (session.user.role || 'USER') as Role;
  console.log('Session found in RootDashboardLayout. User role:', userRole);

  return (
    <DashboardLayout userRole={userRole}>
      {children}
    </DashboardLayout>
  );
}