import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  // Only a regular user can view the user dashboard
  if (session.user.role !== 'USER') {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
