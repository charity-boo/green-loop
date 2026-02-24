import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CollectorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || !session.user || (session.user.role !== 'COLLECTOR' && session.user.role !== 'ADMIN')) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
