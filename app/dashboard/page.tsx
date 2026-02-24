import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardRootPage() {
  const session = await getSession();

  if (!session || !session.user) {
    // This should not happen due to the layout protection, but as a safeguard
    redirect("/auth/login");
  }

  const { role } = session.user;

  switch (role) {
    case 'ADMIN':
      redirect("/dashboard/admin");
    case 'COLLECTOR':
      redirect("/dashboard/collector");
    default:
      redirect("/dashboard/user");
  }
}