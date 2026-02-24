import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  if (session?.user?.role !== 'ADMIN') {
    redirect("/");
  }

  return <>{children}</>;
}
